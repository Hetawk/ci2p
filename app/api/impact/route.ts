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
    const year = searchParams.get("year");

    // Parse pagination parameters
    const { page, limit } = parsePaginationParams(searchParams, {
      defaultLimit: 20,
      maxLimit: 100,
    });
    const { skip, take } = calculatePaginationValues(page, limit);

    // Build where clause
    const where: {
      active?: boolean;
      featured?: boolean;
      category?: string;
      year?: string;
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
    if (year) {
      where.year = year;
    }

    // Get total count
    const total = await prisma.impactMetric.count({ where });

    // Fetch paginated impact metrics
    const impacts = await prisma.impactMetric.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      skip,
      take,
    });

    return NextResponse.json(
      createPaginatedResponse(impacts, page, limit, total)
    );
  } catch (error) {
    console.error("Error fetching impact metrics:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch impact metrics" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      label,
      value,
      description,
      icon,
      category,
      year,
      order,
      active,
      featured,
    } = body;

    const impact = await prisma.impactMetric.create({
      data: {
        label,
        value,
        description,
        icon,
        category,
        year,
        order: order ? parseInt(order) : 0,
        active: active ?? true,
        featured: featured ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      data: impact,
    });
  } catch (error) {
    console.error("Error creating impact metric:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create impact metric" },
      { status: 500 }
    );
  }
}
