import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function GET(_request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vls_token")?.value;

  if (!token) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const backendUrl = getBackendUrl();
  let res: Response;
  try {
    res = await fetch(`${backendUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error(`[Auth Me Proxy Error] Failed to reach backend at "${backendUrl}/auth/me":`, err);
    return Response.json({ message: "Backend server is currently unreachable." }, { status: 502 });
  }

  let data: unknown = null;
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    await res.text().catch(() => null);
  }

  if (res.ok && data && typeof data === "object" && "role" in data) {
    const roleData = data as { role?: string };
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

    if (tokenRole && roleData.role && tokenRole !== roleData.role.toUpperCase()) {
      try {
        const refreshRes = await fetch(`${backendUrl}/auth/refresh-token`, {
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

  return Response.json(data ?? { message: "Failed to fetch user profile" }, { status: res.status });
}

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vls_token")?.value;

  if (!token) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const body = await request.text();
  const backendUrl = getBackendUrl();

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/auth/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body,
    });
  } catch (err) {
    console.error(`[Auth Me PATCH Proxy Error] Failed to reach backend at "${backendUrl}/auth/me":`, err);
    return Response.json({ message: "Backend server is currently unreachable." }, { status: 502 });
  }

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
