import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const AUTH_COOKIE_NAME = "dashboard-auth";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface DashboardAuth {
  dashboard: "portfolio" | "herpromise";
  authenticatedAt: number;
}

export async function setAuthCookie(dashboard: "portfolio" | "herpromise") {
  const cookieStore = await cookies();
  const authData: DashboardAuth = {
    dashboard,
    authenticatedAt: Date.now(),
  };

  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authData), {
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
    return JSON.parse(authCookie.value);
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

export function isAuthenticated(
  request: NextRequest,
  dashboard: "portfolio" | "herpromise"
): boolean {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!authCookie?.value) {
    return false;
  }

  try {
    const authData: DashboardAuth = JSON.parse(authCookie.value);

    // Check if authenticated for the correct dashboard
    if (authData.dashboard !== dashboard) {
      return false;
    }

    // Check if token is expired (7 days)
    const tokenAge = Date.now() - authData.authenticatedAt;
    if (tokenAge > AUTH_COOKIE_MAX_AGE * 1000) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
