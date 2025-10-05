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
          name: true,
          role: true,
          dashboard: true,
          active: true,
          emailVerified: true,
          image: true,
        },
      });

      if (!user || !user.active) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      return NextResponse.json({
        user: {
          ...user,
          isAdmin: user.role === "ADMIN" || user.role === "SUPER_ADMIN",
          isSuperAdmin: user.role === "SUPER_ADMIN",
        },
      });
    }

    // For super admin (env-based auth without database user)
    return NextResponse.json({
      user: {
        email: auth.email,
        name: "Super Admin",
        role: "SUPER_ADMIN",
        dashboard: auth.dashboard,
        isAdmin: true,
        isSuperAdmin: true,
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
