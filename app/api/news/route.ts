import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/news - List all news articles with filtering and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category");
    const tag = searchParams.get("tag");
    const sortBy = searchParams.get("sortBy") || "newest";

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      isPublished: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        contains: tag,
      };
    }

    // Build orderBy clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = {};
    switch (sortBy) {
      case "oldest":
        orderBy = { publishedAt: "asc" };
        break;
      case "alphabetical":
        orderBy = { title: "asc" };
        break;
      case "newest":
      default:
        orderBy = { publishedAt: "desc" };
        break;
    }

    // Fetch news and total count
    const [news, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          category: true,
          tags: true,
          isPinned: true,
          publishedAt: true,
          views: true,
          createdAt: true,
          updatedAt: true,
          authorId: true,
        },
      }),
      prisma.announcement.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        news,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page < Math.ceil(total / limit),
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// POST /api/news - Create new news article (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get("auth-token")?.value;
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

    // Only RESEARCHER and SUPER_ADMIN can create news
    if (payload.role !== "RESEARCHER" && payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      publishDate,
      isPublished,
    } = body;

    // Validation
    if (!title || !excerpt || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, excerpt, content",
        },
        { status: 400 }
      );
    }

    // Generate slug from title
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug exists and append number if needed
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.announcement.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const news = await prisma.announcement.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
        category: category || "LAB_NEWS",
        tags: tags || "",
        publishedAt: publishDate ? new Date(publishDate) : new Date(),
        isPublished: isPublished !== undefined ? isPublished : true,
        authorId: payload.userId,
      },
    });

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create news" },
      { status: 500 }
    );
  }
}
