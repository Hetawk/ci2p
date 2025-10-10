import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  validatePassword,
  validateEmail,
  validateUsername,
  generateToken,
  generateVerificationUrl,
} from "@/lib/password";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, username, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
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

    // Validate username if provided
    if (username && !validateUsername(username)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Username must be 3-20 characters and contain only letters, numbers, underscores, and hyphens",
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Weak password",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, ...(username ? [{ username }] : [])],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            existingUser.email === email
              ? "Email already registered"
              : "Username already taken",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username: username || null,
        password: hashedPassword,
        verificationToken,
        emailVerified: false,
        role: "GUEST",
        profile: name
          ? {
              create: {
                fullName: name,
              },
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        username: true,
        emailVerified: true,
        role: true,
        profile: {
          select: {
            fullName: true,
          },
        },
      },
    });

    // Send verification email
    const verificationUrl = generateVerificationUrl(verificationToken);
    const emailTemplate = emailTemplates.verifyEmail(
      user.profile?.fullName || user.email,
      verificationUrl
    );

    await sendEmail({
      to: user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    return NextResponse.json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Registration failed" },
      { status: 500 }
    );
  }
}
