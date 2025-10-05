import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { signToken, verifyToken, type AuthJWTPayload } from "./jwt";

export const AUTH_COOKIE_NAME = "dashboard-auth-token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface DashboardAuth {
  dashboard: "portfolio" | "herpromise";
  authenticatedAt: number;
  userId?: string;
  email?: string;
  role?: string;
}

export async function setAuthCookie(
  dashboard: "portfolio" | "herpromise",
  userData?: { userId?: string; email?: string; role?: string }
) {
  const cookieStore = await cookies();
  const payload: AuthJWTPayload = {
    dashboard,
    authenticatedAt: Date.now(),
    ...userData,
  };

  const token = await signToken(payload);

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getAuthCookie(): Promise<DashboardAuth | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return null;
  }

  try {
    const payload = await verifyToken(authCookie.value);
    if (!payload) return null;

    return {
      dashboard: payload.dashboard,
      authenticatedAt: payload.authenticatedAt,
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export function verifyPassword(
  inputPassword: string,
  dashboard: "portfolio" | "herpromise"
): boolean {
  const correctPassword =
    dashboard === "portfolio"
      ? process.env.PORTFOLIO_DASHBOARD_PASSWORD
      : process.env.HERPROMISE_DASHBOARD_PASSWORD;

  return inputPassword === correctPassword;
}

export async function isAuthenticated(
  request: NextRequest,
  dashboard: "portfolio" | "herpromise"
): Promise<boolean> {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return false;
  }

  try {
    const payload = await verifyToken(authCookie.value);
    
    if (!payload) {
      return false;
    }

    // Check if authenticated for the correct dashboard
    if (payload.dashboard !== dashboard) {
      return false;
    }

    // JWT automatically handles expiration
    return true;
  } catch {
    return false;
  }
}

// Synchronous check for middleware (basic validation)
export function isAuthenticatedSync(
  request: NextRequest
): boolean {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  
  // If cookie exists, assume authenticated (full verification happens in routes)
  return !!authCookie?.value;
}
