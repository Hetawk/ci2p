import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

// GET /api/resources/bookings/[id] - Get single booking
export async function GET(
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

    const booking = await prisma.resourceBooking.findUnique({
      where: { id },
      include: {
        resource: {
          select: {
            id: true,
            name: true,
            type: true,
            location: true,
            imageUrl: true,
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

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check permissions (owner or admin)
    const isOwner = booking.userId === payload.userId;
    const isAdmin = payload.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT /api/resources/bookings/[id] - Update booking (owner or admin)
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

    // Check if booking exists
    const existingBooking = await prisma.resourceBooking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = existingBooking.userId === payload.userId;
    const isAdmin = payload.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    // Cannot update completed or cancelled bookings
    if (["COMPLETED", "CANCELLED"].includes(existingBooking.status)) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot update completed or cancelled bookings",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    // Owners can only update certain fields
    if (isOwner && !isAdmin) {
      if (body.purpose !== undefined) updateData.purpose = body.purpose;
      if (body.notes !== undefined) updateData.notes = body.notes;

      // Can only update times if booking is still pending
      if (existingBooking.status === "PENDING") {
        if (body.startTime !== undefined)
          updateData.startTime = new Date(body.startTime);
        if (body.endTime !== undefined)
          updateData.endTime = new Date(body.endTime);
      }
    }

    // Admins can update any field
    if (isAdmin) {
      if (body.purpose !== undefined) updateData.purpose = body.purpose;
      if (body.notes !== undefined) updateData.notes = body.notes;
      if (body.startTime !== undefined)
        updateData.startTime = new Date(body.startTime);
      if (body.endTime !== undefined)
        updateData.endTime = new Date(body.endTime);
      if (body.status !== undefined) updateData.status = body.status;
    }

    // Validate times if updated
    if (updateData.startTime || updateData.endTime) {
      const start = updateData.startTime || existingBooking.startTime;
      const end = updateData.endTime || existingBooking.endTime;

      if (start >= end) {
        return NextResponse.json(
          { success: false, error: "End time must be after start time" },
          { status: 400 }
        );
      }
    }

    const booking = await prisma.resourceBooking.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/bookings/[id] - Cancel booking (owner or admin)
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

    // Check if booking exists
    const existingBooking = await prisma.resourceBooking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check permissions
    const isOwner = existingBooking.userId === payload.userId;
    const isAdmin = payload.role === "SUPER_ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Access denied" },
        { status: 403 }
      );
    }

    // Cannot cancel completed bookings
    if (existingBooking.status === "COMPLETED") {
      return NextResponse.json(
        { success: false, error: "Cannot cancel completed bookings" },
        { status: 400 }
      );
    }

    // Update status to CANCELLED instead of deleting
    await prisma.resourceBooking.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      success: true,
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}

// PATCH /api/resources/bookings/[id] - Approve/Reject booking (admin only)
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

    // Only admins can approve/reject
    if (payload.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body; // "approve" or "reject"

    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await prisma.resourceBooking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    if (existingBooking.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          error: "Only pending bookings can be approved/rejected",
        },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "APPROVED" : "REJECTED";

    const booking = await prisma.resourceBooking.update({
      where: { id },
      data: { status: newStatus },
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

    return NextResponse.json({
      success: true,
      data: booking,
      message: `Booking ${action}d successfully`,
    });
  } catch (error) {
    console.error("Error processing booking action:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process booking action" },
      { status: 500 }
    );
  }
}
