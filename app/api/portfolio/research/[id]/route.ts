import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single research
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const research = await prisma.research.findUnique({
      where: { id },
    });

    if (!research) {
      return NextResponse.json(
        { error: "Research not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(research);
  } catch (error) {
    console.error("Error fetching research:", error);
    return NextResponse.json(
      { error: "Failed to fetch research" },
      { status: 500 }
    );
  }
}

// PUT - Update research
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const research = await prisma.research.update({
      where: { id },
      data,
    });
    return NextResponse.json(research);
  } catch (error) {
    console.error("Error updating research:", error);
    return NextResponse.json(
      { error: "Failed to update research" },
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
    const research = await prisma.research.update({
      where: { id },
      data,
    });
    return NextResponse.json(research);
  } catch (error) {
    console.error("Error updating research:", error);
    return NextResponse.json(
      { error: "Failed to update research" },
      { status: 500 }
    );
  }
}

// DELETE - Delete research
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.research.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Research deleted successfully" });
  } catch (error) {
    console.error("Error deleting research:", error);
    return NextResponse.json(
      { error: "Failed to delete research" },
      { status: 500 }
    );
  }
}
