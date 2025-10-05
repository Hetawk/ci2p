import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedSync } from "./lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Portfolio dashboard routes
  if (pathname.startsWith("/portfolio/dashboard")) {
    if (!isAuthenticatedSync(request)) {
      const loginUrl = new URL("/portfolio/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Her Promise dashboard routes
  if (pathname.startsWith("/dashboard") && pathname !== "/dashboard") {
    if (!isAuthenticatedSync(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If accessing /dashboard (the Her Promise dashboard overview)
  if (pathname === "/dashboard") {
    if (!isAuthenticatedSync(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portfolio/dashboard/:path*", "/dashboard/:path*", "/dashboard"],
};
