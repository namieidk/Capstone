import { NextRequest, NextResponse } from "next/server";

// ============================================================
// MIDDLEWARE — no auth yet
// ============================================================
//
// This does exactly one thing right now: if someone hits the bare
// root path "/", send them to the landing page. Everything else
// (apply, login, signup, etc.) passes through untouched — no auth
// checks, no cookies, no redirects.
//
// When you're ready to add real auth back in, this is the file
// where route protection will go again (see the commented-out
// example at the bottom).

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/landing", request.url));
  }

  return NextResponse.next();
}

// ============================================================
// MATCHER
// ============================================================
// Only run middleware on "/" for now — everything else is
// completely untouched by middleware.

export const config = {
  matcher: ["/"],
};

// ============================================================
// LATER: route protection example (currently disabled)
// ============================================================
//
// const SESSION_COOKIE = "vls_session";
// const PROTECTED_ROUTES = ["/Student/dashboard"];
// const AUTH_ROUTES = ["/Student/login", "/Student/signup"];
//
// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;
//   const hasSession = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
//
//   if (pathname === "/") {
//     return NextResponse.redirect(new URL("/Student/landing", request.url));
//   }
//
//   const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
//   const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
//
//   if (isProtected && !hasSession) {
//     const loginUrl = new URL("/Student/login", request.url);
//     loginUrl.searchParams.set("from", pathname);
//     return NextResponse.redirect(loginUrl);
//   }
//
//   if (isAuthRoute && hasSession) {
//     return NextResponse.redirect(new URL("/Student/dashboard", request.url));
//   }
//
//   return NextResponse.next();
// }
//
// export const config = {
//   matcher: ["/", "/Student/dashboard/:path*", "/Student/login", "/Student/signup"],
// };