import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/papers/[id] - Get single paper by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const paper = await prisma.publication.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                fullName: true,
                avatar: true,
                title: true,
                orcidId: true,
              },
            },
          },
        },
      },
    });

    if (!paper) {
      return NextResponse.json(
        { success: false, error: "Paper not found" },
        { status: 404 }
      );
    }

    // Parse authors JSON
    const formattedPaper = {
      ...paper,
      authors: JSON.parse(paper.authors),
    };

    return NextResponse.json({
      success: true,
      data: formattedPaper,
    });
  } catch (error) {
    console.error("Error fetching paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch paper" },
      { status: 500 }
    );
  }
}

// PUT /api/papers/[id] - Update paper (authenticated users only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if publication exists
    const existingPublication = await prisma.publication.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });

    if (!existingPublication) {
      return NextResponse.json(
        { success: false, error: "Publication not found" },
        { status: 404 }
      );
    }

    // Check permissions (owner or admin)
    const isOwner = existingPublication.authorId === payload.userId;
    const isAdmin =
      payload.role === "SUPER_ADMIN" || payload.role === "RESEARCHER";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: You don't have permission to edit this publication",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Prepare update data (allowing any valid Prisma update field)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.abstract !== undefined) updateData.abstract = body.abstract;
    if (body.authors !== undefined) {
      updateData.authors =
        typeof body.authors === "string"
          ? body.authors
          : JSON.stringify(body.authors);
    }
    if (body.publicationType !== undefined)
      updateData.publicationType = body.publicationType;
    if (body.journal !== undefined) updateData.journal = body.journal;
    if (body.conference !== undefined) updateData.conference = body.conference;
    if (body.year !== undefined) updateData.year = parseInt(body.year);
    if (body.month !== undefined)
      updateData.month = body.month ? parseInt(body.month) : null;
    if (body.doi !== undefined) updateData.doi = body.doi;
    if (body.url !== undefined) updateData.url = body.url;
    if (body.pdfUrl !== undefined) updateData.pdfUrl = body.pdfUrl;
    if (body.customTags !== undefined) updateData.customTags = body.customTags;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isPublished !== undefined)
      updateData.isPublished = body.isPublished;
    if (body.citations !== undefined)
      updateData.citations = parseInt(body.citations);

    const paper = await prisma.publication.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: {
        ...paper,
        authors: JSON.parse(paper.authors),
      },
    });
  } catch (error) {
    console.error("Error updating paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update paper" },
      { status: 500 }
    );
  }
}

// DELETE /api/papers/[id] - Delete paper (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if publication exists
    const existingPublication = await prisma.publication.findUnique({
      where: { id },
    });

    if (!existingPublication) {
      return NextResponse.json(
        { success: false, error: "Publication not found" },
        { status: 404 }
      );
    }

    // Check permissions (owner or admin)
    const isOwner = existingPublication.authorId === payload.userId;
    const isAdmin = payload.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: You don't have permission to delete this publication",
        },
        { status: 403 }
      );
    }

    await prisma.publication.delete({
      where: { id },
    });

    // Update user's publication count
    await prisma.profile.update({
      where: { userId: existingPublication.authorId },
      data: {
        publicationCount: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Paper deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete paper" },
      { status: 500 }
    );
  }
}

// PATCH /api/papers/[id] - Toggle featured/published status (authenticated users only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check if publication exists
    const existingPublication = await prisma.publication.findUnique({
      where: { id },
    });

    if (!existingPublication) {
      return NextResponse.json(
        { success: false, error: "Publication not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = existingPublication.authorId === payload.userId;
    const isAdmin =
      payload.role === "SUPER_ADMIN" || payload.role === "RESEARCHER";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: You don't have permission to edit this publication",
        },
        { status: 403 }
      );
    }

    const { action } = await request.json();

    let updatedPaper;

    switch (action) {
      case "toggleFeatured":
        updatedPaper = await prisma.publication.update({
          where: { id },
          data: {
            isFeatured: !existingPublication.isFeatured,
          },
        });
        break;

      case "togglePublished":
        updatedPaper = await prisma.publication.update({
          where: { id },
          data: {
            isPublished: !existingPublication.isPublished,
          },
        });
        break;

      case "incrementViews":
        updatedPaper = await prisma.publication.update({
          where: { id },
          data: {
            views: {
              increment: 1,
            },
          },
        });
        break;

      case "incrementDownloads":
        updatedPaper = await prisma.publication.update({
          where: { id },
          data: {
            downloads: {
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
        ...updatedPaper,
        authors: JSON.parse(updatedPaper.authors),
      },
    });
  } catch (error) {
    console.error("Error patching paper:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update paper" },
      { status: 500 }
    );
  }
}
