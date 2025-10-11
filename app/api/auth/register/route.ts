import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateEmail } from "@/lib/password";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      fullName,
      chineseName,
      requestedRole = "STUDENT",
      phone,
      universityId,
      major,
      expectedGraduation,
      researchInterests,
      institution,
      degree,
      supervisor,
      message,
    } = body;

    // Validation
    if (!email || !fullName) {
      return NextResponse.json(
        { success: false, error: "Email and full name are required" },
        { status: 400 }
      );
    }

    // Validate email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate requested role
    if (!["STUDENT", "RESEARCHER"].includes(requestedRole)) {
      return NextResponse.json(
        { success: false, error: "Invalid role requested" },
        { status: 400 }
      );
    }

    // Check if email already exists in users or registration requests
    const [existingUser, existingRequest] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.registrationRequest.findUnique({ where: { email } }),
    ]);

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "This email is already registered. Please login instead.",
        },
        { status: 400 }
      );
    }

    if (existingRequest) {
      if (existingRequest.status === "PENDING") {
        return NextResponse.json(
          {
            success: false,
            error:
              "A registration request with this email is already pending review.",
          },
          { status: 400 }
        );
      } else if (existingRequest.status === "REJECTED") {
        // Allow reapplication if previously rejected
        await prisma.registrationRequest.delete({
          where: { id: existingRequest.id },
        });
      }
    }

    // Create registration request
    const registrationRequest = await prisma.registrationRequest.create({
      data: {
        email,
        fullName,
        chineseName,
        requestedRole,
        phone,
        universityId,
        major,
        expectedGraduation: expectedGraduation
          ? new Date(expectedGraduation)
          : null,
        researchInterests,
        institution,
        degree,
        supervisor,
        message,
        status: "PENDING",
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        requestedRole: true,
        status: true,
        createdAt: true,
      },
    });

    // Send confirmation email to applicant
    try {
      const applicantEmail = emailTemplates.registrationSubmitted(
        registrationRequest.fullName
      );
      await sendEmail({
        to: registrationRequest.email,
        subject: applicantEmail.subject,
        html: applicantEmail.html,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Continue even if email fails
    }

    // Notify admins
    try {
      const admins = await prisma.user.findMany({
        where: {
          role: { in: ["SUPER_ADMIN"] },
          active: true,
        },
        select: { email: true, profile: { select: { fullName: true } } },
      });

      const adminEmail = emailTemplates.newRegistrationRequest(
        registrationRequest.fullName,
        registrationRequest.email,
        registrationRequest.requestedRole
      );

      for (const admin of admins) {
        await sendEmail({
          to: admin.email,
          subject: adminEmail.subject,
          html: adminEmail.html,
        });
      }
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Continue even if email fails
    }

    return NextResponse.json({
      success: true,
      message:
        "Registration request submitted successfully! You will receive an email once your application has been reviewed by our administrators.",
      requestId: registrationRequest.id,
      data: registrationRequest,
    });
  } catch (error) {
    console.error("Registration request error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to submit registration request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
