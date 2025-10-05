import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parsePaginationParams,
  calculatePaginationValues,
  createPaginatedResponse,
  createOrderBy,
} from "@/lib/pagination";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get("published");
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");

    // Parse pagination parameters
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(
      searchParams,
      { defaultLimit: 12, maxLimit: 50 }
    );
    const { skip, take } = calculatePaginationValues(page, limit);

    // Build where clause
    const where: {
      published?: boolean;
      OR?: Array<{ [key: string]: { contains: string; mode: string } }>;
      categoryId?: string;
    } = {};
    if (published === "true") {
      where.published = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Get total count for pagination
    const total = await prisma.post.count({ where });

    // Fetch paginated posts
    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        tags: true,
      },
      orderBy:
        sortBy === "publishedAt"
          ? [{ publishedAt: sortOrder }, { createdAt: sortOrder }]
          : createOrderBy(sortBy, sortOrder),
      skip,
      take,
    });

    return NextResponse.json(
      createPaginatedResponse(posts, page, limit, total)
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      published,
      publishedAt,
      authorId,
      categoryId,
      tagIds,
    } = body;

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        published: published ?? false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        authorId,
        categoryId,
        tags: tagIds
          ? {
              connect: tagIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: {
        author: true,
        category: true,
        tags: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
