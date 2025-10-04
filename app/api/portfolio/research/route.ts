import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all research
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const featured = searchParams.get("featured");

  try {
    const research = await prisma.research.findMany({
      where: {
        ...(featured === "true" && { featured: true }),
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(research);
  } catch (error) {
    console.error("Error fetching research:", error);
    return NextResponse.json(
      { error: "Failed to fetch research" },
      { status: 500 }
    );
  }
}

// POST - Create new research
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const research = await prisma.research.create({
      data,
    });
    return NextResponse.json(research, { status: 201 });
  } catch (error) {
    console.error("Error creating research:", error);
    return NextResponse.json(
      { error: "Failed to create research" },
      { status: 500 }
    );
  }
}
