import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { autoSyncAllUsersIfNeeded } from "@/lib/orcid-auto-sync";

// GET /api/papers - List all papers with filtering and pagination
export async function GET(request: Request) {
  try {
    // Trigger background sync for all users (non-blocking)
    autoSyncAllUsersIfNeeded().catch((error) => {
      console.error("Background auto-sync failed:", error);
    });

    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || "";
    const year = searchParams.get("year");
    const category = searchParams.get("category");
    const sortBy = searchParams.get("sortBy") || "newest";
    const isFeatured = searchParams.get("featured") === "true";

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { abstract: { contains: search, mode: "insensitive" } },
      ];
    }

    if (year) {
      where.year = parseInt(year);
    }

    if (category) {
      where.publicationType = category;
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    // Build orderBy clause
    let orderBy: { year?: "asc" | "desc"; citations?: "desc" } = {};
    switch (sortBy) {
      case "oldest":
        orderBy = { year: "asc" };
        break;
      case "citations":
        orderBy = { citations: "desc" };
        break;
      case "newest":
      default:
        orderBy = { year: "desc" };
        break;
    }

    // Fetch all papers from database (including synced ORCID publications)
    const [papers, total] = await Promise.all([
      prisma.publication.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          abstract: true,
          authors: true,
          year: true,
          journal: true,
          conference: true,
          volume: true,
          issue: true,
          pages: true,
          doi: true,
          url: true,
          pdfUrl: true,
          citations: true,
          publicationType: true,
          customTags: true,
          isFeatured: true,
          isPublished: true,
          isFromOrcid: true,
          orcidWorkId: true,
          orcidSyncedAt: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
        },
      }),
      prisma.publication.count({ where }),
    ]);

    // Add source field based on isFromOrcid
    const papersWithSource = papers.map((paper) => ({
      ...paper,
      source: paper.isFromOrcid ? "orcid" : "manual",
      orcidPutCode: paper.orcidWorkId,
    }));

    const orcidCount = papers.filter((p) => p.isFromOrcid).length;
    const manualCount = papers.filter((p) => !p.isFromOrcid).length;

    return NextResponse.json({
      success: true,
      data: {
        papers: papersWithSource,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
        stats: {
          manual: manualCount,
          orcid: orcidCount,
          merged: total,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching papers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch papers" },
      { status: 500 }
    );
  }
}

// POST /api/papers - Create new paper (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Only RESEARCHER and SUPER_ADMIN can create papers
    if (payload.role !== "RESEARCHER" && payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      abstract,
      authors,
      year,
      journal,
      conference,
      volume,
      issue,
      pages,
      doi,
      url,
      pdfUrl,
      citations,
      publicationType,
      customTags,
      isFeatured,
      isPublished,
    } = body;

    // Validation
    if (!title || !abstract || !authors || !year) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, abstract, authors, year",
        },
        { status: 400 }
      );
    }

    // Stringify authors if it's an array
    const authorsString =
      typeof authors === "string" ? authors : JSON.stringify(authors);

    const paper = await prisma.publication.create({
      data: {
        title,
        abstract,
        authors: authorsString,
        year: parseInt(year),
        journal,
        conference,
        volume,
        issue,
        pages,
        doi,
        url,
        pdfUrl,
        citations: citations ? parseInt(citations) : 0,
        publicationType: publicationType || "JOURNAL_ARTICLE",
        customTags: customTags || "",
        isFeatured: isFeatured || false,
        isPublished: isPublished !== undefined ? isPublished : true,
        authorId: payload.userId, // Use authenticated user ID
      },
      include: {
        author: {
          select: {
            id: true,
            profile: {
              select: {
                fullName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    // Update user's publication count
    await prisma.profile.update({
      where: { userId: payload.userId },
      data: {
        publicationCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...paper,
        authors: JSON.parse(paper.authors),
      },
    });
  } catch (error) {
    console.error("Error creating paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create paper" },
      { status: 500 }
    );
  }
}
