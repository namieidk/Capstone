import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vls_token")?.value;

  if (!token) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  return Response.json(data, { status: res.status });
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vls_token")?.value;

  if (!token) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await request.text();

  const res = await fetch(`${BACKEND_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return Response.json(data ?? { message: "Request failed" }, {
    status: res.status,
  });
}
