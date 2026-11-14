import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function POST(request: NextRequest) {
  let body: {
    mfaToken?: string;
    code?: string;
    method?: string;
    rememberDevice?: boolean;
    remember?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const backendUrl = getBackendUrl();
  let res: Response;
  try {
    res = await fetch(`${backendUrl}/auth/mfa/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mfa_token: body.mfaToken,
        code: body.code,
        ...(body.method ? { method: body.method } : {}),
        remember_device: Boolean(body.rememberDevice),
      }),
    });
  } catch (err) {
    console.error(`[Auth MFA Verify Error] Failed to reach backend at "${backendUrl}/auth/mfa/verify":`, err);
    return Response.json({ message: "Authentication server unreachable" }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return Response.json(
      { message: data?.message ?? "Verification failed." },
      { status: res.status },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("vls_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: body.remember || body.rememberDevice ? 60 * 60 * 24 * 30 : 60 * 60 * 24 * 7,
  });

  if (data.trusted_device_token) {
    cookieStore.set("vls_trusted_device", data.trusted_device_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return Response.json({ user: data.user });
}
