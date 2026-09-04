import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/signup",
  "/stafflogin",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (r) => pathname === r || pathname.startsWith(r + "/"),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get("vls_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
