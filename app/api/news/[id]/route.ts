import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/news/[id] - Get single news article by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.announcement.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!news) {
      return NextResponse.json(
        { success: false, error: "News article not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const formattedNews = {
      ...news,
      tags: news.tags ? JSON.parse(news.tags) : [],
      gallery: news.gallery ? JSON.parse(news.gallery) : [],
    };

    return NextResponse.json({
      success: true,
      data: formattedNews,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch news article" },
      { status: 500 }
    );
  }
}

// PUT /api/news/[id] - Update news article (authenticated users only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if news exists
    const existingNews = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "News article not found" },
        { status: 404 }
      );
    }

    // Check permissions (owner or admin)
    const isOwner = existingNews.authorId === payload.userId;
    const isAdmin =
      payload.role === "SUPER_ADMIN" || payload.role === "RESEARCHER";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: You don't have permission to edit this news article",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (body.title !== undefined) {
      updateData.title = body.title;
      updateData.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.tags !== undefined) {
      updateData.tags =
        typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags);
    }
    if (body.gallery !== undefined) {
      updateData.gallery =
        typeof body.gallery === "string"
          ? body.gallery
          : JSON.stringify(body.gallery);
    }
    if (body.isPinned !== undefined) updateData.isPinned = body.isPinned;
    if (body.isPublished !== undefined)
      updateData.isPublished = body.isPublished;
    if (body.publishedAt !== undefined)
      updateData.publishedAt = new Date(body.publishedAt);

    const news = await prisma.announcement.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...news,
        tags: news.tags ? JSON.parse(news.tags) : [],
        gallery: news.gallery ? JSON.parse(news.gallery) : [],
      },
    });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update news article" },
      { status: 500 }
    );
  }
}

// DELETE /api/news/[id] - Delete news article (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if news exists
    const existingNews = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "News article not found" },
        { status: 404 }
      );
    }

    // Check permissions (owner or admin)
    const isOwner = existingNews.authorId === payload.userId;
    const isAdmin = payload.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: You don't have permission to delete this news article",
        },
        { status: 403 }
      );
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "News article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete news article" },
      { status: 500 }
    );
  }
}

// PATCH /api/news/[id] - Toggle featured/published/pinned status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if news exists
    const existingNews = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { success: false, error: "News article not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = existingNews.authorId === payload.userId;
    const isAdmin =
      payload.role === "SUPER_ADMIN" || payload.role === "RESEARCHER";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: You don't have permission to edit this news article",
        },
        { status: 403 }
      );
    }

    const { action } = await request.json();

    let updatedNews;

    switch (action) {
      case "togglePinned":
        updatedNews = await prisma.announcement.update({
          where: { id },
          data: {
            isPinned: !existingNews.isPinned,
          },
        });
        break;

      case "togglePublished":
        updatedNews = await prisma.announcement.update({
          where: { id },
          data: {
            isPublished: !existingNews.isPublished,
          },
        });
        break;

      case "incrementViews":
        updatedNews = await prisma.announcement.update({
          where: { id },
          data: {
            views: {
              increment: 1,
            },
          },
        });
        break;

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...updatedNews,
        tags: updatedNews.tags ? JSON.parse(updatedNews.tags) : [],
      },
    });
  } catch (error) {
    console.error("Error patching news:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update news article" },
      { status: 500 }
    );
  }
}
