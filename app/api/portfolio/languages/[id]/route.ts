import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single language
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const language = await prisma.language.findUnique({
      where: { id: params.id },
    });

    if (!language) {
      return NextResponse.json(
        { error: "Language not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(language);
  } catch (error) {
    console.error("Error fetching language:", error);
    return NextResponse.json(
      { error: "Failed to fetch language" },
      { status: 500 }
    );
  }
}

// PUT - Update language
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const language = await prisma.language.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json(language);
  } catch (error) {
    console.error("Error updating language:", error);
    return NextResponse.json(
      { error: "Failed to update language" },
      { status: 500 }
    );
  }
}

// DELETE - Delete language
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.language.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Language deleted successfully" });
  } catch (error) {
    console.error("Error deleting language:", error);
    return NextResponse.json(
      { error: "Failed to delete language" },
      { status: 500 }
    );
  }
}
