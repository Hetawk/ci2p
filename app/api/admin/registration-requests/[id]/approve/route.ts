import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateSecurePassword } from "@/lib/password";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(
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
    const { memberId, universityId, username } = body;

    if (!memberId || !username) {
      return NextResponse.json(
        { error: "Member ID and username are required" },
        { status: 400 }
      );
    }

    // Get registration request
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { id },
    });

    if (!registrationRequest) {
      return NextResponse.json(
        { error: "Registration request not found" },
        { status: 404 }
      );
    }

    if (registrationRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Request has already been processed" },
        { status: 400 }
      );
    }

    // Check if member ID is already in use
    const existingMemberId = await prisma.profile.findFirst({
      where: { memberId },
    });

    if (existingMemberId) {
      return NextResponse.json(
        { error: "Member ID is already in use" },
        { status: 400 }
      );
    }

    // Check if username is already in use
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already in use" },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingEmail = await prisma.user.findUnique({
      where: { email: registrationRequest.email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Generate temporary password
    const tempPassword = generateSecurePassword();
    const hashedPassword = await hashPassword(tempPassword);

    // Create user with profile in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: registrationRequest.email,
          username,
          password: hashedPassword,
          role: registrationRequest.requestedRole,
          emailVerified: true, // Pre-verified by admin
          active: true,
          isTemporaryPassword: true,
          mustChangePassword: true,
          registrationRequestId: id,
          profile: {
            create: {
              fullName: registrationRequest.fullName,
              chineseName: registrationRequest.chineseName,
              phone: registrationRequest.phone,
              memberId,
              universityId: universityId || null,
            },
          },
        },
        include: {
          profile: true,
        },
      });

      // Update registration request
      await tx.registrationRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedBy: payload.userId,
          reviewedAt: new Date(),
        },
      });

      return newUser;
    });

    // Send approval email with temporary password
    const loginUrl = `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/auth/login`;

    const approvalEmail = emailTemplates.registrationApproved(
      registrationRequest.fullName,
      tempPassword,
      loginUrl
    );

    await sendEmail({
      to: registrationRequest.email,
      subject: approvalEmail.subject,
      html: approvalEmail.html,
    });

    return NextResponse.json({
      success: true,
      message: "Registration approved successfully",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        memberId,
      },
    });
  } catch (error) {
    console.error("Error approving registration request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
