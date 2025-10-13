import { NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const auth = await getAuthCookie();

    console.log("Auth cookie data:", auth); // Debug log

    if (!auth) {
      console.log("No auth cookie found"); // Debug log
      const response = NextResponse.json({ user: null }, { status: 200 });
      // Add cache headers to prevent stale responses
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      return response;
    }

    // If there's a userId, fetch the full user data from database
    if (auth.userId) {
      console.log("Fetching user data for userId:", auth.userId); // Debug log

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
              id: true,
              fullName: true,
              chineseName: true,
              title: true,
              avatar: true,
              bio: true,
              interests: true,
              phone: true,
              office: true,
              email: true,
              website: true,
              github: true,
              linkedin: true,
              googleScholar: true,
              researchGate: true,
              orcidId: true,
              orcidEnabled: true,
              memberId: true,
              universityId: true,
              showInTeam: true,
              teamOrder: true,
              publicationCount: true,
              projectCount: true,
              citationCount: true,
              hIndex: true,
            },
          },
        },
      });

      console.log("Found user:", user?.profile?.fullName || user?.username); // Debug log

      if (!user || !user.active) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      const response = NextResponse.json({
        user: {
          ...user,
          name: user.profile?.fullName || user.username,
          image: user.profile?.avatar,
          isAdmin: user.role === "SUPER_ADMIN" || user.role === "ADMIN",
          isSuperAdmin: user.role === "SUPER_ADMIN",
        },
      });

      // Add cache headers
      response.headers.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate"
      );
      response.headers.set("Pragma", "no-cache");
      return response;
    }

    // Fallback for auth without userId
    const response = NextResponse.json({
      user: {
        email: auth.email,
        role: auth.role,
        isAdmin: auth.role === "SUPER_ADMIN" || auth.role === "ADMIN",
        isSuperAdmin: auth.role === "SUPER_ADMIN",
      },
    });

    // Add cache headers
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    return response;
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await getAuthCookie();

    if (!auth?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: auth.userId },
      data: {
        profile: {
          update: {
            fullName: body.fullName,
            chineseName: body.chineseName || null,
            title: body.title || null,
            bio: body.bio || null,
            interests: body.interests || null,
            phone: body.phone || null,
            office: body.office || null,
            email: body.email || null,
            website: body.website || null,
            github: body.github || null,
            linkedin: body.linkedin || null,
            googleScholar: body.googleScholar || null,
            researchGate: body.researchGate || null,
            avatar: body.avatar || null,
          },
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        profile: {
          select: {
            id: true,
            fullName: true,
            chineseName: true,
            title: true,
            avatar: true,
            bio: true,
            interests: true,
            phone: true,
            office: true,
            email: true,
            website: true,
            github: true,
            linkedin: true,
            googleScholar: true,
            researchGate: true,
            orcidId: true,
            orcidEnabled: true,
            memberId: true,
            universityId: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
