import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // Verify admin authentication
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Build where clause
    const where: { status?: "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED" } =
      {};
    if (status && status !== "ALL") {
      where.status = status as "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
    }

    // Get total count
    const total = await prisma.registrationRequest.count({ where });

    // Get requests with pagination
    const requests = await prisma.registrationRequest.findMany({
      where,
      orderBy: [
        { status: "asc" }, // PENDING first
        { createdAt: "desc" }, // Then by date
      ],
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      requests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching registration requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
