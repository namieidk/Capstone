import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

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

  if (!res.ok) {
    return Response.json(data, { status: res.status });
  }

  return Response.json(data);
}
