import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const impacts = await prisma.impactMetric.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: impacts,
    });
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
