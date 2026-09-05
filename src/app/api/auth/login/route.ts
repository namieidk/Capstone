import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") ?? "";
  let data: unknown = null;
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as Record<string, unknown>).message
        : "Invalid email or password.";
    return Response.json(
      { message: Array.isArray(message) ? message.join(", ") : message },
      { status: res.status },
    );
  }

  if (
    !data ||
    typeof data !== "object" ||
    !("access_token" in data) ||
    !("user" in data)
  ) {
    return Response.json(
      { message: "Unexpected response from the server." },
      { status: 500 },
    );
  }

  const tokenData = data as { access_token: string; user: unknown };

  const cookieStore = await cookies();
  cookieStore.set("vls_token", tokenData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return Response.json({ user: tokenData.user });
}
