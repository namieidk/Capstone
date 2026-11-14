import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";
import { formatMfaChallengeResponse } from "@/lib/mfa-bff";

export async function POST(request: NextRequest) {
  let body: { email?: string; password?: string; remember?: boolean };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid request payload." }, { status: 400 });
  }

  const { email, password, remember } = body;
  const backendUrl = getBackendUrl();
  const cookieStore = await cookies();
  const trustedDeviceToken = cookieStore.get("vls_trusted_device")?.value;

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        ...(trustedDeviceToken ? { trusted_device_token: trustedDeviceToken } : {}),
      }),
    });
  } catch (err) {
    console.error(`[Auth Login Proxy Error] Failed to reach backend at "${backendUrl}/auth/login":`, err);
    return Response.json(
      {
        message: "Unable to connect to the server. Please check your connection or try again later.",
      },
      { status: 502 },
    );
  }

  const contentType = res.headers.get("content-type") ?? "";
  let data: unknown = null;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    await res.text().catch(() => null);
  }

  if (!res.ok) {
    if (res.status === 429) {
      return Response.json(
        { message: "Too many login attempts. Please wait a moment and try again later." },
        { status: 429 },
      );
    }
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as Record<string, unknown>).message
        : "Invalid email or password.";
    return Response.json({ message: Array.isArray(message) ? message.join(", ") : message }, { status: res.status });
  }

  const mfaChallenge = formatMfaChallengeResponse(data, Boolean(remember));
  if (mfaChallenge) {
    return Response.json(mfaChallenge);
  }

  if (!data || typeof data !== "object" || !("access_token" in data) || !("user" in data)) {
    return Response.json({ message: "Unexpected response from the server." }, { status: 500 });
  }

  const tokenData = data as { access_token: string; user: unknown };

  const cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    path: string;
    maxAge?: number;
  } = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  if (remember) {
    cookieOptions.maxAge = 60 * 60 * 24 * 30; // 30 days
  }

  cookieStore.set("vls_token", tokenData.access_token, cookieOptions);

  return Response.json({ user: tokenData.user });
}
