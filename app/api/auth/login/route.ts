import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // identifier can be email or username

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Email/username and password are required" },
        { status: 400 }
      );
    }

    // Check if super admin login
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.DASHBOARD_PASSWORD;

    if (identifier === adminEmail && password === adminPassword) {
      // Super admin login
      await setAuthCookie("herpromise", {
        email: adminEmail,
        role: "SUPER_ADMIN",
      });

      return NextResponse.json({
        success: true,
        user: {
          email: adminEmail,
          role: "SUPER_ADMIN",
          dashboard: "BOTH",
        },
      });
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "Please verify your email before logging in",
        },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.active) {
      return NextResponse.json(
        { success: false, error: "Account is inactive" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Determine dashboard access
    let dashboardAccess: "portfolio" | "herpromise" = "herpromise";
    if (user.dashboard === "PORTFOLIO") {
      dashboardAccess = "portfolio";
    } else if (user.dashboard === "BOTH") {
      dashboardAccess = "herpromise"; // Default to herpromise if both
    }

    // Set auth cookie
    await setAuthCookie(dashboardAccess, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        dashboard: user.dashboard,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
