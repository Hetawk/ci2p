import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { comparePassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, password } = body; // identifier can be email, username, or student ID

    if (!identifier || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Login credentials and password are required",
        },
        { status: 400 }
      );
    }

    // Find user by email, username, member ID, or university ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
          {
            profile: {
              memberId: identifier,
            },
          },
          {
            profile: {
              universityId: identifier,
            },
          },
        ],
      },
      include: {
        profile: {
          select: {
            fullName: true,
            memberId: true,
            universityId: true,
          },
        },
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

    // Set auth cookie - use "herpromise" as default dashboard value for backward compatibility
    await setAuthCookie("herpromise", {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Determine redirect URL based on role
    let redirectUrl = "/";
    if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
      redirectUrl = "/admin/overview";
    }

    return NextResponse.json({
      success: true,
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.profile?.fullName,
        role: user.role,
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
