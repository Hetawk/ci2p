import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Find user with this verification token
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
      include: {
        profile: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Email already verified" },
        { status: 400 }
      );
    }

    // Update user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
      },
    });

    // Send welcome email
    const welcomeTemplate = emailTemplates.welcomeEmail(
      user.profile?.fullName || user.email
    );
    await sendEmail({
      to: user.email,
      subject: welcomeTemplate.subject,
      html: welcomeTemplate.html,
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! You can now log in.",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
