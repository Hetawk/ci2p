import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { Prisma } from "@prisma/client";

// GET /api/resources - List all resources with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    // Filters
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const isBookable = searchParams.get("bookable");
    const search = searchParams.get("search");

    // Build where clause
    const where: Prisma.ResourceWhereInput = {};

    if (type) {
      where.type = type as Prisma.ResourceWhereInput["type"];
    }

    if (status) {
      where.status = status as Prisma.ResourceWhereInput["status"];
    }

    if (isBookable !== null && isBookable !== undefined) {
      where.isBookable = isBookable === "true";
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { location: { contains: search } },
      ];
    }

    // Only show published resources for non-admin users
    where.isPublished = true;

    // Fetch resources with pagination
    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { status: "asc" }, // Available resources first
          { name: "asc" },
        ],
        include: {
          bookings: {
            where: {
              status: "APPROVED",
              endTime: {
                gte: new Date(), // Only future/current bookings
              },
            },
            select: {
              id: true,
              startTime: true,
              endTime: true,
              status: true,
              purpose: true,
            },
            orderBy: {
              startTime: "asc",
            },
          },
        },
      }),
      prisma.resource.count({ where }),
    ]);

    // Format response
    const formattedResources = resources.map((resource) => ({
      ...resource,
      activeBookings: resource.bookings.length,
      nextAvailable: resource.bookings[0]?.endTime || null,
    }));

    return NextResponse.json({
      success: true,
      data: {
        resources: formattedResources,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNextPage: page * limit < total,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create new resource (admin only)
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

    // Check if user is admin
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      type,
      description,
      location,
      capacity,
      modelNumber,
      manufacturer,
      purchaseDate,
      imageUrl,
      manualUrl,
      isBookable,
      status,
    } = body;

    // Validation
    if (!name || !type || !description) {
      return NextResponse.json(
        { success: false, error: "Name, type, and description are required" },
        { status: 400 }
      );
    }

    // Create resource
    const resource = await prisma.resource.create({
      data: {
        name,
        type,
        description,
        location,
        capacity,
        modelNumber,
        manufacturer,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        imageUrl,
        manualUrl,
        isBookable: isBookable ?? true,
        status: status || "AVAILABLE",
        isPublished: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: resource,
        message: "Resource created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
