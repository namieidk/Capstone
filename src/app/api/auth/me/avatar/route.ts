import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { getBackendUrl } from "@/lib/backend-url";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vls_token")?.value;

  if (!token) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const formData = await request.formData();
  const backendUrl = getBackendUrl();

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/auth/me/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  } catch (err) {
    console.error(`[Auth Avatar Proxy Error] Failed to reach backend at "${backendUrl}/auth/me/avatar":`, err);
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
