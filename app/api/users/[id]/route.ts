import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/users/[id]
 * Fetch detailed user profile with publications and projects
 * Public endpoint
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch user with all details
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        publications: {
          where: { isPublished: true },
          select: {
            id: true,
            title: true,
            publicationType: true,
            journal: true,
            conference: true,
            year: true,
            citations: true,
            doi: true,
            pdfUrl: true,
            createdAt: true,
          },
          orderBy: { year: "desc" },
          take: 10, // Limit to 10 most recent
        },
        _count: {
          select: {
            publications: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.active) {
      return NextResponse.json(
        { error: "User profile is not active" },
        { status: 403 }
      );
    }

    if (!user.profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Fetch user's project memberships
    const projectMemberships = await prisma.projectMember.findMany({
      where: {
        userId: id,
        project: { isPublished: true },
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            startDate: true,
            endDate: true,
            coverImage: true,
            tags: true,
          },
        },
      },
      orderBy: { joinedAt: "desc" },
      take: 10, // Limit to 10 most recent
    });

    // Remove password before sending
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, verificationToken, verificationHash, ...safeUser } = user;

    // Format response
    const response = {
      ...safeUser,
      stats: {
        publications: user._count.publications,
        projects: user.profile.projectCount,
        citations: user.profile.citationCount,
        hIndex: user.profile.hIndex,
      },
      projects: projectMemberships.map((pm) => ({
        ...pm.project,
        memberRole: pm.role,
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
