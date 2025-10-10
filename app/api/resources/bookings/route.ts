import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/resources/bookings - Get bookings (authenticated)
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const resourceId = searchParams.get("resourceId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const skip = (page - 1) * limit;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {};

    // Regular users see only their bookings, admins see all
    if (payload.role !== "SUPER_ADMIN") {
      where.userId = payload.userId;
    }

    if (status) {
      where.status = status;
    }

    if (resourceId) {
      where.resourceId = resourceId;
    }

    if (startDate || endDate) {
      where.AND = [];
      if (startDate) {
        where.AND.push({
          startTime: {
            gte: new Date(startDate),
          },
        });
      }
      if (endDate) {
        where.AND.push({
          endTime: {
            lte: new Date(endDate),
          },
        });
      }
    }

    const [bookings, total] = await Promise.all([
      prisma.resourceBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startTime: "desc",
        },
        include: {
          resource: {
            select: {
              id: true,
              name: true,
              type: true,
              location: true,
            },
          },
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
      }),
      prisma.resourceBooking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST /api/resources/bookings - Create booking request (authenticated)
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

    const body = await request.json();
    const { resourceId, startTime, endTime, purpose, notes } = body;

    // Validation
    if (!resourceId || !startTime || !endTime || !purpose) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: resourceId, startTime, endTime, purpose",
        },
        { status: 400 }
      );
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return NextResponse.json(
        { success: false, error: "End time must be after start time" },
        { status: 400 }
      );
    }

    if (start < new Date()) {
      return NextResponse.json(
        { success: false, error: "Cannot book resources in the past" },
        { status: 400 }
      );
    }

    // Check if resource exists and is bookable
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json(
        { success: false, error: "Resource not found" },
        { status: 404 }
      );
    }

    if (!resource.isBookable) {
      return NextResponse.json(
        { success: false, error: "This resource is not bookable" },
        { status: 400 }
      );
    }

    if (resource.status !== "AVAILABLE") {
      return NextResponse.json(
        { success: false, error: "Resource is not available for booking" },
        { status: 400 }
      );
    }

    // Check for conflicting bookings
    const conflictingBooking = await prisma.resourceBooking.findFirst({
      where: {
        resourceId,
        status: {
          in: ["PENDING", "APPROVED"],
        },
        OR: [
          {
            AND: [{ startTime: { lte: start } }, { endTime: { gt: start } }],
          },
          {
            AND: [{ startTime: { lt: end } }, { endTime: { gte: end } }],
          },
          {
            AND: [{ startTime: { gte: start } }, { endTime: { lte: end } }],
          },
        ],
      },
    });

    if (conflictingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: "Resource is already booked for this time period",
        },
        { status: 409 }
      );
    }

    // Create booking
    const booking = await prisma.resourceBooking.create({
      data: {
        resourceId,
        userId: payload.userId,
        startTime: start,
        endTime: end,
        purpose,
        notes,
        status: "PENDING", // Requires admin approval
      },
      include: {
        resource: {
          select: {
            id: true,
            name: true,
            type: true,
            location: true,
          },
        },
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
    });

    return NextResponse.json(
      {
        success: true,
        data: booking,
        message:
          "Booking request created successfully. Awaiting admin approval.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
