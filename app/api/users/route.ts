import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

/**
 * GET /api/users
 * Fetch list of user profiles with filters and pagination
 * Public endpoint - returns only active users with profiles
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse query parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const role = searchParams.get("role") as UserRole | null;
    const search = searchParams.get("search");
    const showInTeam = searchParams.get("showInTeam");

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build where clause for users
    const userWhere: Record<string, unknown> = {
      active: true,
      profile: {
        isNot: null,
      },
    };

    // Add role filter
    if (role && Object.values(UserRole).includes(role)) {
      userWhere.role = role;
    }

    // Fetch all matching users first (we'll filter by profile fields in memory if needed)
    const [usersData] = await Promise.all([
      prisma.user.findMany({
        where: userWhere as never,
        select: {
          id: true,
          email: true,
          role: true,
          profile: {
            select: {
              id: true,
              fullName: true,
              chineseName: true,
              title: true,
              avatar: true,
              bio: true,
              interests: true,
              showInTeam: true,
              teamOrder: true,
              email: true,
              phone: true,
              office: true,
              website: true,
              github: true,
              linkedin: true,
              googleScholar: true,
              researchGate: true,
              orcidId: true,
              publicationCount: true,
              projectCount: true,
              citationCount: true,
              hIndex: true,
            },
          },
          _count: {
            select: {
              publications: true,
            },
          },
        },
        orderBy: [{ createdAt: "desc" }],
      }),
      prisma.user.count({ where: userWhere as never }),
    ]);

    // Filter in memory for profile-specific filters
    const filteredUsers = usersData.filter((user) => {
      if (!user.profile) return false;

      // Show in team filter
      if (showInTeam === "true" && !user.profile.showInTeam) {
        return false;
      }

      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesName = user.profile.fullName
          ?.toLowerCase()
          .includes(searchLower);
        const matchesBio = user.profile.bio
          ?.toLowerCase()
          .includes(searchLower);
        const matchesInterests = user.profile.interests
          ?.toLowerCase()
          .includes(searchLower);

        if (!matchesName && !matchesBio && !matchesInterests) {
          return false;
        }
      }

      return true;
    });

    // Sort by teamOrder and fullName
    filteredUsers.sort((a, b) => {
      const aOrder = a.profile?.teamOrder ?? 999;
      const bOrder = b.profile?.teamOrder ?? 999;
      if (aOrder !== bOrder) return aOrder - bOrder;

      const aName = a.profile?.fullName || "";
      const bName = b.profile?.fullName || "";
      return aName.localeCompare(bName);
    });

    // Apply pagination
    const paginatedUsers = filteredUsers.slice(skip, skip + limit);

    // Format response
    const formattedUsers = paginatedUsers.map((user) => ({
      id: user.id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      stats: {
        publications: user._count.publications,
        projects: user.profile?.projectCount || 0,
        citations: user.profile?.citationCount || 0,
        hIndex: user.profile?.hIndex || 0,
      },
    }));

    const filteredTotal = filteredUsers.length;

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        limit,
        total: filteredTotal,
        totalPages: Math.ceil(filteredTotal / limit),
        hasMore: page * limit < filteredTotal,
      },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
