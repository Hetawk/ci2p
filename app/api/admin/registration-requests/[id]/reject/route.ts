import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
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
    const { rejectionReason } = body;

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

    // Update registration request
    await prisma.registrationRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedBy: payload.userId,
        reviewedAt: new Date(),
        rejectionReason:
          rejectionReason || "Application did not meet requirements.",
      },
    });

    // Send rejection email
    const rejectionEmail = emailTemplates.registrationRejected(
      registrationRequest.fullName,
      rejectionReason
    );

    await sendEmail({
      to: registrationRequest.email,
      subject: rejectionEmail.subject,
      html: rejectionEmail.html,
    });

    return NextResponse.json({
      success: true,
      message: "Registration rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting registration request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
