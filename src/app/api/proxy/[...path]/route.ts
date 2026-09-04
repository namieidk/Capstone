import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

async function proxyRequest(
  method: string,
  path: string,
  request: NextRequest,
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("vls_token")?.value;

  const headers = new Headers();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const init: RequestInit = { method, headers };

  if (method !== "GET" && method !== "HEAD") {
    const contentHeader = request.headers.get("content-type") ?? "";
    if (contentHeader.includes("multipart/form-data")) {
      init.body = await request.formData();
    } else {
      init.body = await request.text();
    }
  }

  const url = new URL(path, BACKEND_URL);
  url.search = request.nextUrl.search;

  const res = await fetch(url.toString(), init);

  const resHeaders = new Headers();
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    resHeaders.set("set-cookie", setCookie);
  }
  const resContentType = res.headers.get("content-type");
  if (resContentType) {
    resHeaders.set("content-type", resContentType);
  }

  const body = await res.arrayBuffer();

  return new Response(body, {
    status: res.status,
    statusText: res.statusText,
    headers: resHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest("GET", path.join("/"), request);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest("POST", path.join("/"), request);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest("PUT", path.join("/"), request);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest("PATCH", path.join("/"), request);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return proxyRequest("DELETE", path.join("/"), request);
}
