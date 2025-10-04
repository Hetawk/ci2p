import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all awards
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");
  const category = searchParams.get("category");

  try {
    const awards = await prisma.award.findMany({
      where: {
        ...(featured === "true" && { featured: true }),
        ...(category && { category: category as any }),
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(awards);
  } catch (error) {
    console.error("Error fetching awards:", error);
    return NextResponse.json(
      { error: "Failed to fetch awards" },
      { status: 500 }
    );
  }
}

// POST - Create new award
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const award = await prisma.award.create({
      data,
    });
    return NextResponse.json(award, { status: 201 });
  } catch (error) {
    console.error("Error creating award:", error);
    return NextResponse.json(
      { error: "Failed to create award" },
      { status: 500 }
    );
  }
}
