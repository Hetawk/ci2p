import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: programs,
    });
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
