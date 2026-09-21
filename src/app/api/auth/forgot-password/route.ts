import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  const res = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

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
        { message: "Too many reset attempts. Please wait a moment and try again later." },
        { status: 429 },
      );
    }
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as Record<string, unknown>).message
        : "Failed to process forgot password request.";
    return Response.json({ message: Array.isArray(message) ? message.join(", ") : message }, { status: res.status });
  }

  return Response.json(data ?? { message: "Reset email dispatched." });
}
