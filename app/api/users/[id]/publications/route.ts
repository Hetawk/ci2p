import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrcidService } from "@/lib/orcid";

/**
 * GET /api/users/[id]/publications
 * Fetch merged publications from ORCID and manual entries
 * Public endpoint
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch user with profile
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        publications: {
          where: { isPublished: true },
          orderBy: { year: "desc" },
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

    let orcidWorks: Array<{
      id: string;
      title: string;
      year: number | null;
      publicationType: string;
      journal?: string | null;
      doi?: string | null;
      source: "orcid";
      orcidPutCode?: string;
      customDescription?: string;
      customAbstract?: string;
      isEnhanced?: boolean;
    }> = [];

    // Fetch ORCID works if enabled
    if (user.profile?.orcidEnabled && user.profile?.orcidId) {
      try {
        const works = await OrcidService.fetchWorks(user.profile.orcidId);
        orcidWorks = works.map((work) => ({
          id: `orcid-${work.putCode}`,
          title: work.title,
          year: work.publicationDate?.year || null,
          publicationType: work.type || "OTHER",
          journal: work.journal || null,
          doi: work.doi || null,
          source: "orcid" as const,
          orcidPutCode: work.putCode,
        }));
      } catch (error) {
        console.error(
          `Failed to fetch ORCID works for ${user.profile.orcidId}:`,
          error
        );
      }
    }

    // Transform manual publications
    const manualPublications = user.publications.map((pub) => ({
      id: pub.id,
      title: pub.title,
      year: pub.year,
      publicationType: pub.publicationType,
      journal: pub.journal,
      conference: pub.conference,
      doi: pub.doi,
      pdfUrl: pub.pdfUrl,
      abstract: pub.abstract,
      customTags: pub.customTags,
      citations: pub.citations,
      source: "manual" as const,
      createdAt: pub.createdAt,
    }));

    // Merge and deduplicate by DOI
    const publicationsMap = new Map<string, unknown>();

    // Add manual publications first (they have priority)
    manualPublications.forEach((pub) => {
      const key = pub.doi || pub.id;
      publicationsMap.set(key, pub);
    });

    // Add ORCID works if not already present
    orcidWorks.forEach((work) => {
      const key = work.doi || work.id;
      if (!publicationsMap.has(key)) {
        publicationsMap.set(key, work);
      } else {
        // If manual publication exists, mark it as enhanced with ORCID data
        const existing = publicationsMap.get(key) as {
          source?: string;
          isEnhanced?: boolean;
        };
        if (existing.source === "manual") {
          existing.isEnhanced = true;
        }
      }
    });

    const mergedPublications = Array.from(publicationsMap.values()).sort(
      (a, b) => {
        const aYear = (a as { year?: number }).year || 0;
        const bYear = (b as { year?: number }).year || 0;
        return bYear - aYear;
      }
    );

    return NextResponse.json({
      publications: mergedPublications,
      stats: {
        total: mergedPublications.length,
        orcid: orcidWorks.length,
        manual: manualPublications.length,
        merged: publicationsMap.size,
      },
    });
  } catch (error) {
    console.error("Failed to fetch publications:", error);
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}
