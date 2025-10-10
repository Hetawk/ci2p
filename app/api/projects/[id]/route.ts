import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/projects/[id] - Get single project by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    fullName: true,
                    avatar: true,
                    title: true,
                    bio: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const formattedProject = {
      ...project,
      tags: project.tags ? JSON.parse(project.tags) : [],
      gallery: project.gallery ? JSON.parse(project.gallery) : [],
      publications: project.publications
        ? JSON.parse(project.publications)
        : [],
    };

    return NextResponse.json({
      success: true,
      data: formattedProject,
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

// PUT /api/projects/[id] - Update project (authenticated users only)
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId: payload.userId,
            role: {
              in: ["LEAD", "CO_LEAD"],
            },
          },
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Check permissions (project lead/co-lead or admin)
    const isProjectLead = existingProject.members.length > 0;
    const isAdmin = payload.role === "SUPER_ADMIN";

    if (!isProjectLead && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You don't have permission to edit this project",
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
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.startDate !== undefined)
      updateData.startDate = new Date(body.startDate);
    if (body.endDate !== undefined)
      updateData.endDate = body.endDate ? new Date(body.endDate) : null;
    if (body.funding !== undefined) {
      if (body.funding.source !== undefined)
        updateData.fundingSource = body.funding.source;
      if (body.funding.amount !== undefined)
        updateData.fundingAmount = body.funding.amount;
      if (body.funding.grantNumber !== undefined)
        updateData.grantNumber = body.funding.grantNumber;
    }
    if (body.tags !== undefined) {
      updateData.tags =
        typeof body.tags === "string" ? body.tags : JSON.stringify(body.tags);
    }
    if (body.keywords !== undefined) updateData.keywords = body.keywords;
    if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
    if (body.gallery !== undefined) {
      updateData.gallery =
        typeof body.gallery === "string"
          ? body.gallery
          : JSON.stringify(body.gallery);
    }
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isPublished !== undefined)
      updateData.isPublished = body.isPublished;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        members: {
          include: {
            user: {
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
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...project,
        tags: project.tags ? JSON.parse(project.tags) : [],
        gallery: project.gallery ? JSON.parse(project.gallery) : [],
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// DELETE /api/projects/[id] - Delete project (admin only)
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

    // Only admin can delete projects
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only admins can delete projects" },
        { status: 403 }
      );
    }

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}

// PATCH /api/projects/[id] - Toggle featured/published status or update status
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

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId: payload.userId,
            role: {
              in: ["LEAD", "CO_LEAD"],
            },
          },
        },
      },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isProjectLead = existingProject.members.length > 0;
    const isAdmin = payload.role === "SUPER_ADMIN";

    if (!isProjectLead && !isAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: You don't have permission to edit this project",
        },
        { status: 403 }
      );
    }

    const { action, value } = await request.json();

    let updatedProject;

    switch (action) {
      case "toggleFeatured":
        updatedProject = await prisma.project.update({
          where: { id },
          data: {
            isFeatured: !existingProject.isFeatured,
          },
        });
        break;

      case "togglePublished":
        updatedProject = await prisma.project.update({
          where: { id },
          data: {
            isPublished: !existingProject.isPublished,
          },
        });
        break;

      case "updateStatus":
        if (!value) {
          return NextResponse.json(
            { success: false, error: "Status value is required" },
            { status: 400 }
          );
        }
        updatedProject = await prisma.project.update({
          where: { id },
          data: {
            status: value,
          },
        });
        break;

      case "incrementViews":
        updatedProject = await prisma.project.update({
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
        ...updatedProject,
        tags: updatedProject.tags ? JSON.parse(updatedProject.tags) : [],
      },
    });
  } catch (error) {
    console.error("Error patching project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}
