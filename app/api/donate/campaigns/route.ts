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
      OR?: Array<{ [key: string]: { contains: string; mode: string } }>;
    } = {};

    if (active === "true") {
      where.active = true;
    }
    if (featured === "true") {
      where.featured = true;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.donationCampaign.count({ where });

    // Fetch paginated campaigns
    const campaigns = await prisma.donationCampaign.findMany({
      where,
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
      skip,
      take,
    });

    return NextResponse.json(
      createPaginatedResponse(campaigns, page, limit, total)
    );
  } catch (error) {
    console.error("Error fetching donation campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donation campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      goal,
      raised,
      currency,
      image,
      startDate,
      endDate,
      active,
      featured,
    } = body;

    const campaign = await prisma.donationCampaign.create({
      data: {
        title,
        slug,
        description,
        goal: parseFloat(goal),
        raised: raised ? parseFloat(raised) : 0,
        currency: currency || "USD",
        image,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        active: active ?? true,
        featured: featured ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error("Error creating donation campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create donation campaign" },
      { status: 500 }
    );
  }
}
