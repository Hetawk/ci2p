import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single research
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const research = await prisma.research.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const research = await prisma.research.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.research.delete({
      where: { id: params.id },
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
