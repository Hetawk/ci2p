import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch all languages
export async function GET() {
  try {
    const languages = await prisma.language.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(languages);
  } catch (error) {
    console.error("Error fetching languages:", error);
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}

// POST - Create new language
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const language = await prisma.language.create({
      data,
    });
    return NextResponse.json(language, { status: 201 });
  } catch (error) {
    console.error("Error creating language:", error);
    return NextResponse.json(
      { error: "Failed to create language" },
      { status: 500 }
    );
  }
}
