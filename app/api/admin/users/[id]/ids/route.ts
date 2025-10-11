import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15 requirement)
    const { id } = await params;

    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuth(token.value);
    if (
      !payload ||
      (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { memberId, universityId } = body;

    if (!memberId && !universityId) {
      return NextResponse.json(
        { error: "At least one ID must be provided" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check for duplicate member ID if updating
    if (memberId && memberId !== user.profile?.memberId) {
      const existingMemberId = await prisma.profile.findFirst({
        where: {
          memberId,
          userId: { not: id },
        },
      });

      if (existingMemberId) {
        return NextResponse.json(
          { error: "Member ID is already in use" },
          { status: 400 }
        );
      }
    }

    // Update profile
    const updateData: { memberId?: string; universityId?: string | null } = {};
    if (memberId !== undefined) updateData.memberId = memberId;
    if (universityId !== undefined)
      updateData.universityId = universityId || null;

    const updatedProfile = await prisma.profile.update({
      where: { userId: id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "User IDs updated successfully",
      user: {
        id: updatedProfile.user.id,
        email: updatedProfile.user.email,
        username: updatedProfile.user.username,
        role: updatedProfile.user.role,
        memberId: updatedProfile.memberId,
        universityId: updatedProfile.universityId,
      },
    });
  } catch (error) {
    console.error("Error updating user IDs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
