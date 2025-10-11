import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedSync } from "./lib/auth";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes - require authentication
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticatedSync(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Settings routes - require authentication
  if (pathname.startsWith("/settings")) {
    if (!isAuthenticatedSync(request)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/settings/:path*"],
};
