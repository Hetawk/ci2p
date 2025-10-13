import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { verifyAuth } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateSecurePassword } from "@/lib/password";
import { OrcidService } from "@/lib/orcid";
import { UserRole } from "@prisma/client";

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  if (!token) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  const payload = await verifyAuth(token.value);

  if (!payload || payload.role !== "SUPER_ADMIN") {
    return { error: "Forbidden", status: 403 } as const;
  }

  return { payload } as const;
}

export async function POST(request: NextRequest) {
  const auth = await requireSuperAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = await request.json();
    const {
      email,
      role = UserRole.GUEST,
      username,
      password,
      profile = {},
    } = body as Record<string, unknown>;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const selectedRole =
      typeof role === "string" &&
      Object.values(UserRole).includes(role as UserRole)
        ? (role as UserRole)
        : UserRole.GUEST;

    const tempPassword =
      typeof password === "string" && password.trim().length > 0
        ? password.trim()
        : generateSecurePassword();
    const hashedPassword = await hashPassword(tempPassword);

    const profileInput = (profile || {}) as Record<string, unknown>;
    const normalizedOrcid = profileInput.orcidId
      ? OrcidService.normalizeOrcidId(String(profileInput.orcidId))
      : null;

    if (profileInput.orcidId && !normalizedOrcid) {
      return NextResponse.json(
        { error: "Invalid ORCID identifier" },
        { status: 400 }
      );
    }

    if (normalizedOrcid) {
      const duplicate = await prisma.profile.findFirst({
        where: {
          orcidId: normalizedOrcid,
        },
        select: { id: true },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: "ORCID ID already connected to another member" },
          { status: 400 }
        );
      }
    }

    const memberId = profileInput.memberId
      ? String(profileInput.memberId).trim()
      : null;

    if (memberId) {
      const existingMember = await prisma.profile.findFirst({
        where: {
          memberId,
        },
        select: { id: true },
      });

      if (existingMember) {
        return NextResponse.json(
          { error: "Member ID is already in use" },
          { status: 400 }
        );
      }
    }

    const created = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: username ? String(username) : null,
        role: selectedRole,
        password: hashedPassword,
        isTemporaryPassword: true,
        mustChangePassword: true,
        passwordChangedAt: new Date(),
        profile: {
          create: {
            fullName:
              typeof profileInput.fullName === "string" &&
              profileInput.fullName.trim().length > 0
                ? profileInput.fullName.trim()
                : normalizedEmail,
            chineseName:
              typeof profileInput.chineseName === "string"
                ? profileInput.chineseName.trim() || null
                : null,
            title:
              typeof profileInput.title === "string"
                ? profileInput.title.trim() || null
                : null,
            memberId,
            universityId:
              typeof profileInput.universityId === "string"
                ? profileInput.universityId.trim() || null
                : null,
            phone:
              typeof profileInput.phone === "string"
                ? profileInput.phone.trim() || null
                : null,
            email:
              typeof profileInput.email === "string"
                ? profileInput.email.trim() || null
                : null,
            website:
              typeof profileInput.website === "string"
                ? profileInput.website.trim() || null
                : null,
            github:
              typeof profileInput.github === "string"
                ? profileInput.github.trim() || null
                : null,
            linkedin:
              typeof profileInput.linkedin === "string"
                ? profileInput.linkedin.trim() || null
                : null,
            googleScholar:
              typeof profileInput.googleScholar === "string"
                ? profileInput.googleScholar.trim() || null
                : null,
            researchGate:
              typeof profileInput.researchGate === "string"
                ? profileInput.researchGate.trim() || null
                : null,
            bio:
              typeof profileInput.bio === "string"
                ? profileInput.bio.trim() || null
                : null,
            interests:
              typeof profileInput.interests === "string"
                ? profileInput.interests.trim() || null
                : null,
            showInTeam:
              profileInput.showInTeam === undefined
                ? true
                : Boolean(profileInput.showInTeam),
            teamOrder:
              profileInput.teamOrder === undefined
                ? null
                : (() => {
                    const parsed = Number.parseInt(
                      String(profileInput.teamOrder),
                      10
                    );
                    return Number.isNaN(parsed) ? null : parsed;
                  })(),
            orcidId: normalizedOrcid,
            orcidEnabled: true,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            id: true,
            fullName: true,
            memberId: true,
            orcidId: true,
            orcidEnabled: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: created,
      generatedPassword: tempPassword,
    });
  } catch (error) {
    console.error("Error creating admin user", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
