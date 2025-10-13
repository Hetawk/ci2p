import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { verifyAuth } from "@/lib/jwt";
import {
  syncUserOrcidPublications,
  syncAllUsersOrcidPublications,
} from "@/lib/orcid-sync";

/**
 * POST /api/admin/sync-orcid
 * Sync ORCID publications for a specific user or all users
 * - Regular users can sync their own publications
 * - Admins can sync any user or all users
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuth(token.value);

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    const isAdmin = payload.role === "SUPER_ADMIN" || payload.role === "ADMIN";

    if (userId) {
      // Check permission: users can sync their own, admins can sync any
      if (userId !== payload.userId && !isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Sync single user
      const result = await syncUserOrcidPublications(userId);
      return NextResponse.json(result);
    } else {
      // Only admins can sync all users
      if (!isAdmin) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Sync all users
      const results = await syncAllUsersOrcidPublications();
      return NextResponse.json({ success: true, results });
    }
  } catch (error) {
    console.error("Error syncing ORCID publications:", error);
    return NextResponse.json(
      { error: "Failed to sync ORCID publications" },
      { status: 500 }
    );
  }
}
