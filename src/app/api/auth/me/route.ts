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

  if (res.ok && data?.role) {
    let tokenRole: string | undefined;
    try {
      const parts = token.split(".");
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
        tokenRole = payload?.role?.toUpperCase();
      }
    } catch {
      // ignore
    }

    if (tokenRole && tokenRole !== data.role.toUpperCase()) {
      try {
        const refreshRes = await fetch(`${BACKEND_URL}/auth/refresh-token`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          if (refreshData?.access_token) {
            cookieStore.set("vls_token", refreshData.access_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            });
          }
        }
      } catch (err) {
        console.error("Failed to refresh token with updated role:", err);
      }
    }
  }

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
