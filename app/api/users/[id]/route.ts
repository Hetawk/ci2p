import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrcidService } from "@/lib/orcid";

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
    let user = await prisma.user.findUnique({
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

    let orcidRecord: unknown = null;
    if (user.profile.orcidEnabled && user.profile.orcidId) {
      const orcidId = user.profile.orcidId;
      const lastSyncedAt = user.profile.orcidSyncedAt;
      const sixHours = 1000 * 60 * 60 * 6;
      const shouldSync =
        !lastSyncedAt || Date.now() - lastSyncedAt.getTime() > sixHours;

      console.log(
        `[ORCID] User ${user.email} has ORCID ${orcidId}, enabled: ${user.profile.orcidEnabled}`
      );

      try {
        if (shouldSync) {
          console.log(`[ORCID] Syncing publications for ${orcidId}`);
          await OrcidService.syncWorksToPublications(user.id, orcidId, prisma);

          user =
            (await prisma.user.findUnique({
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
                  take: 10,
                },
                _count: {
                  select: {
                    publications: true,
                  },
                },
              },
            })) || user;
        }

        console.log(`[ORCID] Fetching complete profile for ${orcidId}`);
        orcidRecord = await OrcidService.fetchCompleteProfile(orcidId);
        console.log(`[ORCID] Successfully fetched profile for ${orcidId}`);
      } catch (err) {
        console.error(
          `[ORCID] Failed to load ORCID record for ${orcidId}`,
          err
        );
      }
    } else {
      console.log(
        `[ORCID] User ${user.email} ORCID not enabled or no ORCID ID set`
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
    const profile = user.profile!;

    const response = {
      ...safeUser,
      stats: {
        publications: user._count.publications,
        projects: profile.projectCount,
        citations: profile.citationCount,
        hIndex: profile.hIndex,
      },
      projects: projectMemberships.map((pm) => ({
        ...pm.project,
        memberRole: pm.role,
      })),
      orcid: orcidRecord,
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
