import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  parsePaginationParams,
  calculatePaginationValues,
  createPaginatedResponse,
} from "@/lib/pagination";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Parse pagination parameters
    const { page, limit } = parsePaginationParams(searchParams, {
      defaultLimit: 12,
      maxLimit: 50,
    });
    const { skip, take } = calculatePaginationValues(page, limit);

    // Build where clause
    const where: {
      active?: boolean;
      featured?: boolean;
      category?: string;
      OR?: Array<{ [key: string]: { contains: string; mode: string } }>;
    } = {};

    if (active === "true") {
      where.active = true;
    }
    if (featured === "true") {
      where.featured = true;
    }
    if (category) {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.program.count({ where });

    // Fetch paginated programs
    const programs = await prisma.program.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      skip,
      take,
    });

    return NextResponse.json(
      createPaginatedResponse(programs, page, limit, total)
    );
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch programs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      image,
      gallery,
      category,
      impact,
      beneficiaries,
      startDate,
      endDate,
      location,
      active,
      featured,
      order,
    } = body;

    const program = await prisma.program.create({
      data: {
        name,
        slug,
        description,
        image,
        gallery,
        category,
        impact,
        beneficiaries: beneficiaries ? parseInt(beneficiaries) : 0,
        startDate,
        endDate,
        location,
        active: active ?? true,
        featured: featured ?? false,
        order: order ? parseInt(order) : 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Error creating program:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create program" },
      { status: 500 }
    );
  }
}
