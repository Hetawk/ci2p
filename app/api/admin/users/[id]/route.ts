import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { verifyAuth } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { OrcidService } from "@/lib/orcid";
import { hashPassword, generateSecurePassword } from "@/lib/password";
import { autoSyncUserIfNeeded } from "@/lib/orcid-auto-sync";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME);

  if (!token) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  const payload = await verifyAuth(token.value);

  if (!payload || !payload.role) {
    return { error: "Unauthorized", status: 401 } as const;
  }

  if (payload.role !== "SUPER_ADMIN" && payload.role !== "ADMIN") {
    return { error: "Forbidden", status: 403 } as const;
  }

  return { payload } as const;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        publications: {
          orderBy: { year: "desc" },
          select: {
            id: true,
            title: true,
            year: true,
            publicationType: true,
            journal: true,
            doi: true,
            createdAt: true,
            isFromOrcid: true,
            orcidWorkId: true,
          },
        },
        projects: {
          take: 10,
          orderBy: { joinedAt: "desc" },
          include: {
            project: {
              select: {
                id: true,
                title: true,
                status: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        },
        _count: {
          select: {
            publications: true,
            projects: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Trigger automatic ORCID sync if needed (non-blocking)
    autoSyncUserIfNeeded(user.id).catch((error) => {
      console.error("Background ORCID sync failed:", error);
    });

    const rest = { ...user } as Record<string, unknown>;
    delete rest.password;
    delete rest.resetToken;
    delete rest.verificationToken;
    delete rest.verificationHash;

    // All publications are now in the database (both manual and synced from ORCID)
    const allPublications = user.publications.map((pub) => ({
      ...pub,
      source: pub.isFromOrcid ? ("orcid" as const) : ("manual" as const),
      orcidPutCode: pub.orcidWorkId,
    }));

    const orcidCount = allPublications.filter(
      (p) => p.source === "orcid"
    ).length;
    const manualCount = allPublications.filter(
      (p) => p.source === "manual"
    ).length;

    return NextResponse.json({
      success: true,
      data: {
        ...rest,
        stats: {
          publications: user._count.publications,
          projects: user._count.projects,
          orcidWorks: orcidCount,
          mergedPublications: allPublications.length,
          manual: manualCount,
        },
        publications: allPublications,
        orcidWorks: [], // Kept for backward compatibility
      },
    });
  } catch (error) {
    console.error("Error fetching admin user detail", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSuperAdmin = auth.payload?.role === "SUPER_ADMIN";

    // Prepare user update fields
    const userUpdate: Record<string, unknown> = {};
    let generatedPassword: string | null = null;

    if (body.email !== undefined) {
      userUpdate.email = body.email;
    }

    if (body.username !== undefined) {
      userUpdate.username = body.username || null;
    }

    if (body.active !== undefined) {
      userUpdate.active = Boolean(body.active);
    }

    if (body.emailVerified !== undefined) {
      userUpdate.emailVerified = Boolean(body.emailVerified);
    }

    if (body.role !== undefined) {
      if (!isSuperAdmin) {
        return NextResponse.json(
          { error: "Only SUPER_ADMIN may change role" },
          { status: 403 }
        );
      }
      userUpdate.role = body.role;
    }

    if (body.password !== undefined || body.resetPassword) {
      if (!isSuperAdmin) {
        return NextResponse.json(
          { error: "Only SUPER_ADMIN may reset passwords" },
          { status: 403 }
        );
      }

      const newPassword =
        typeof body.password === "string" && body.password.trim().length > 0
          ? String(body.password)
          : generateSecurePassword();

      const hashed = await hashPassword(newPassword);
      userUpdate.password = hashed;
      userUpdate.isTemporaryPassword = true;
      userUpdate.mustChangePassword = true;
      userUpdate.passwordChangedAt = new Date();
      generatedPassword = newPassword;
    }

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({ where: { id }, data: userUpdate });
    }

    // Handle profile updates
    const profileInput = body.profile as Record<string, unknown> | undefined;
    let requestedFullName: string | undefined;

    if (profileInput) {
      const profileData: Record<string, unknown> = {};

      const mapStringField = (key: string) => {
        if (profileInput[key] !== undefined) {
          const value = profileInput[key];
          profileData[key] = value === null ? null : String(value);
        }
      };

      [
        "chineseName",
        "title",
        "bio",
        "phone",
        "office",
        "email",
        "website",
        "github",
        "linkedin",
        "googleScholar",
        "researchGate",
        "interests",
      ].forEach(mapStringField);

      if (profileInput.fullName !== undefined) {
        const raw = profileInput.fullName;
        const normalized =
          raw === null ? "" : typeof raw === "string" ? raw : String(raw);
        const trimmed = normalized.trim();
        requestedFullName = trimmed;
      }

      if (profileInput.memberId !== undefined) {
        const memberId = profileInput.memberId
          ? String(profileInput.memberId).trim()
          : null;

        if (memberId && memberId !== existing.profile?.memberId) {
          const duplicate = await prisma.profile.findFirst({
            where: {
              memberId,
              userId: { not: id },
            },
          });

          if (duplicate) {
            return NextResponse.json(
              { error: "Member ID is already in use" },
              { status: 400 }
            );
          }
        }

        profileData.memberId = memberId;
      }

      if (profileInput.universityId !== undefined) {
        profileData.universityId = profileInput.universityId
          ? String(profileInput.universityId)
          : null;
      }

      if (profileInput.teamOrder !== undefined) {
        const orderValue =
          profileInput.teamOrder === null || profileInput.teamOrder === ""
            ? null
            : Number.parseInt(String(profileInput.teamOrder), 10);
        profileData.teamOrder = Number.isNaN(orderValue) ? null : orderValue;
      }

      if (profileInput.showInTeam !== undefined) {
        profileData.showInTeam = Boolean(profileInput.showInTeam);
      }

      if (profileInput.orcidEnabled !== undefined) {
        profileData.orcidEnabled = Boolean(profileInput.orcidEnabled);
      }

      if (profileInput.orcidId !== undefined) {
        const normalized = profileInput.orcidId
          ? OrcidService.normalizeOrcidId(String(profileInput.orcidId))
          : null;

        if (profileInput.orcidId && !normalized) {
          return NextResponse.json(
            { error: "Invalid ORCID identifier" },
            { status: 400 }
          );
        }

        if (normalized && normalized !== existing.profile?.orcidId) {
          const duplicate = await prisma.profile.findFirst({
            where: {
              orcidId: normalized,
              userId: { not: id },
            },
          });

          if (duplicate) {
            return NextResponse.json(
              { error: "ORCID ID already connected to another member" },
              { status: 400 }
            );
          }
        }

        profileData.orcidId = normalized;
      }

      if (profileInput.publicationCount !== undefined) {
        const parsed = Number.parseInt(
          String(profileInput.publicationCount),
          10
        );
        profileData.publicationCount = Number.isNaN(parsed) ? 0 : parsed;
      }

      if (profileInput.projectCount !== undefined) {
        const parsed = Number.parseInt(String(profileInput.projectCount), 10);
        profileData.projectCount = Number.isNaN(parsed) ? 0 : parsed;
      }

      if (profileInput.citationCount !== undefined) {
        const parsed = Number.parseInt(String(profileInput.citationCount), 10);
        profileData.citationCount = Number.isNaN(parsed) ? 0 : parsed;
      }

      if (profileInput.hIndex !== undefined) {
        const parsed = Number.parseInt(String(profileInput.hIndex), 10);
        profileData.hIndex = Number.isNaN(parsed) ? 0 : parsed;
      }

      const profileExists = Boolean(existing.profile);
      const computedFullName = (() => {
        if (requestedFullName !== undefined) {
          return requestedFullName.length > 0
            ? requestedFullName
            : existing.profile?.fullName || existing.email;
        }
        return existing.profile?.fullName || existing.email;
      })();

      if (profileExists) {
        await prisma.profile.update({
          where: { userId: id },
          data: {
            ...profileData,
            fullName: computedFullName,
          },
        });
      } else {
        await prisma.profile.create({
          data: {
            userId: id,
            fullName: computedFullName,
            ...profileData,
          },
        });
      }
    }

    const updated = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        _count: {
          select: {
            publications: true,
            projects: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      generatedPassword,
    });
  } catch (error) {
    console.error("Error updating admin user", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { id } = await params;

    const existing = await prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Soft-delete by deactivating account and hiding from public listings
    await prisma.user.update({
      where: { id },
      data: {
        active: false,
        profile: existing.profile
          ? {
              update: {
                showInTeam: false,
              },
            }
          : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Error deactivating user", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
