import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/projects - List all projects with filtering and pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Filters
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");
    const tag = searchParams.get("tag");
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
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (tag) {
      where.tags = {
        contains: tag,
      };
    }

    if (isFeatured) {
      where.isFeatured = true;
    }

    // Build orderBy clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let orderBy: any = {};
    switch (sortBy) {
      case "oldest":
        orderBy = { startDate: "asc" };
        break;
      case "alphabetical":
        orderBy = { title: "asc" };
        break;
      case "newest":
      default:
        orderBy = { createdAt: "desc" };
        break;
    }

    // Fetch projects and total count
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy,
        skip,
        take: limit,
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
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        projects,
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
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create new project (authenticated users only)
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

    // Only RESEARCHER and SUPER_ADMIN can create projects
    if (payload.role !== "RESEARCHER" && payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      status,
      startDate,
      endDate,
      funding,
      tags,
      coverImage,
      isFeatured,
      isPublished,
    } = body;

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: title, description",
        },
        { status: 400 }
      );
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        status: status || "ACTIVE",
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        fundingSource: funding?.source,
        fundingAmount: funding?.amount,
        grantNumber: funding?.grantNumber,
        tags: tags || "",
        coverImage,
        isFeatured: isFeatured || false,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    // Add creator as project lead
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: payload.userId,
        role: "LEAD",
      },
    });

    // Update user's project count
    await prisma.profile.update({
      where: { userId: payload.userId },
      data: {
        projectCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
