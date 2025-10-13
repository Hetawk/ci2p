import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { clearAuthCookie, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    await clearAuthCookie();

    // Create response with explicit cookie deletion
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Explicitly delete the cookie in the response
    response.cookies.delete(AUTH_COOKIE_NAME);

    // Also set it to an empty value with immediate expiration as a fallback
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

// Handle GET requests (when accessing logout URL directly in browser)
export async function GET(request: NextRequest) {
  try {
    await clearAuthCookie();

    // Create redirect response to home page
    const response = NextResponse.redirect(new URL("/", request.url));

    // Delete the cookie
    response.cookies.delete(AUTH_COOKIE_NAME);

    // Also set it to an empty value with immediate expiration
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
