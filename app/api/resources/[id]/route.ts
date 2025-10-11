import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/resources/[id] - Get single resource by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: "APPROVED",
            endTime: {
              gte: new Date(),
            },
          },
          orderBy: {
            startTime: "asc",
          },
          take: 10,
          select: {
            id: true,
            startTime: true,
            endTime: true,
            purpose: true,
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    fullName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Calculate next available time
    const now = new Date();
    const activeBookings = resource.bookings.filter(
      (b) => b.startTime <= now && b.endTime >= now
    );
    const nextAvailable =
      activeBookings.length > 0
        ? activeBookings[activeBookings.length - 1].endTime
        : now;

    return NextResponse.json({
      success: true,
      data: {
        ...resource,
        activeBookingsCount: activeBookings.length,
        nextAvailable,
      },
    });
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Update resource (admin only)
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

    // Only SUPER_ADMIN can update resources
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Prepare update data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    // Only update provided fields
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.capacity !== undefined)
      updateData.capacity = parseInt(body.capacity);
    if (body.isBookable !== undefined) updateData.isBookable = body.isBookable;
    if (body.modelNumber !== undefined)
      updateData.modelNumber = body.modelNumber;
    if (body.manufacturer !== undefined)
      updateData.manufacturer = body.manufacturer;
    if (body.purchaseDate !== undefined)
      updateData.purchaseDate = new Date(body.purchaseDate);
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.manualUrl !== undefined) updateData.manualUrl = body.manualUrl;

    const resource = await prisma.resource.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete resource (admin only)
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

    // Only SUPER_ADMIN can delete resources
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: {
              in: ["PENDING", "APPROVED"],
            },
          },
        },
      },
    });

    if (!existingResource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    // Prevent deletion if there are active bookings
    if (existingResource.bookings.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cannot delete resource with active or pending bookings. Please cancel all bookings first.",
        },
        { status: 400 }
      );
    }

    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
