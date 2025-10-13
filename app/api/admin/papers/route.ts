import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { verifyAuth } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  if (!token) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  const payload = await verifyAuth(token.value);

  if (!payload || !payload.role) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  if (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN") {
    return { error: "Forbidden", status: 403 } as const;
  }

  return { payload } as const;
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const source = searchParams.get("source");

    const where: Prisma.PublicationWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { abstract: { contains: search } },
        { journal: { contains: search } },
        { conference: { contains: search } },
      ];
    }

    if (status === "published") {
      where.isPublished = true;
    } else if (status === "draft") {
      where.isPublished = false;
    }

    if (source === "orcid") {
      where.isFromOrcid = true;
    } else if (source === "manual") {
      where.isFromOrcid = false;
    }

    const publications = await prisma.publication.findMany({
      where,
      orderBy: [{ year: "desc" }, { updatedAt: "desc" }],
      include: {
        author: {
          select: {
            profile: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    // Add source field based on isFromOrcid
    const papersWithSource = publications.map((paper) => ({
      id: paper.id,
      title: paper.title,
      authors: paper.authors,
      journal: paper.journal,
      conference: paper.conference,
      year: paper.year,
      publicationType: paper.publicationType,
      doi: paper.doi,
      url: paper.url,
      views: paper.views,
      isFeatured: paper.isFeatured,
      isPublished: paper.isPublished,
      createdAt: paper.createdAt,
      updatedAt: paper.updatedAt,
      authorId: paper.authorId,
      authorName: paper.author?.profile?.fullName || "Unknown",
      source: paper.isFromOrcid ? ("orcid" as const) : ("manual" as const),
      orcidPutCode: paper.orcidWorkId,
    }));

    const totals = {
      count: publications.length,
      published: publications.filter((p) => p.isPublished).length,
      drafts: publications.filter((p) => !p.isPublished).length,
      orcid: publications.filter((p) => p.isFromOrcid).length,
      manual: publications.filter((p) => !p.isFromOrcid).length,
      featured: publications.filter((p) => p.isFeatured).length,
    };

    return NextResponse.json({
      success: true,
      data: {
        papers: papersWithSource,
        totals,
      },
    });
  } catch (error) {
    console.error("Error fetching admin publications", error);
    return NextResponse.json(
      { error: "Failed to fetch publications" },
      { status: 500 }
    );
  }
}
