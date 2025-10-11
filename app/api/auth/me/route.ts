import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const auth = await getAuthCookie();

    if (!auth) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // If there's a userId, fetch the full user data from database
    if (auth.userId) {
      const user = await prisma.user.findUnique({
        where: { id: auth.userId },
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
          active: true,
          emailVerified: true,
          profile: {
            select: {
              fullName: true,
              avatar: true,
            },
          },
        },
      });

      if (!user || !user.active) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      return NextResponse.json({
        user: {
          ...user,
          name: user.profile?.fullName || user.username,
          image: user.profile?.avatar,
          isAdmin: user.role === "SUPER_ADMIN" || user.role === "ADMIN",
          isSuperAdmin: user.role === "SUPER_ADMIN",
        },
      });
    }

    // Fallback for auth without userId
    return NextResponse.json({
      user: {
        email: auth.email,
        role: auth.role,
        isAdmin: auth.role === "SUPER_ADMIN" || auth.role === "ADMIN",
        isSuperAdmin: auth.role === "SUPER_ADMIN",
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
