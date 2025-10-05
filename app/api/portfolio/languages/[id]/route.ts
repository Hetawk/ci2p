import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single language
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const language = await prisma.language.findUnique({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const language = await prisma.language.update({
      where: { id },
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

// PATCH - Partial update (for publish/unpublish)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const language = await prisma.language.update({
      where: { id },
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.language.delete({
      where: { id },
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
