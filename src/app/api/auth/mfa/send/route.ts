import type { NextRequest } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function POST(request: NextRequest) {
  let body: { mfaToken?: string; method?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  const backendUrl = getBackendUrl();
  let res: Response;
  try {
    res = await fetch(`${backendUrl}/auth/mfa/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mfa_token: body.mfaToken,
        method: body.method,
      }),
    });
  } catch (err) {
    console.error(`[Auth MFA Send Error] Failed to reach backend at "${backendUrl}/auth/mfa/send":`, err);
    return Response.json({ message: "Authentication server unreachable" }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    return Response.json(
      { message: data?.message ?? "Failed to send verification code." },
      { status: res.status },
    );
  }

  return Response.json({
    mfaMethod: data.mfa_method,
    mfaDestination: data.mfa_destination,
  });
}
