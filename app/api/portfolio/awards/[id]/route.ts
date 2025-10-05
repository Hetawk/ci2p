import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single award
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const award = await prisma.award.findUnique({
      where: { id },
    });

    if (!award) {
      return NextResponse.json({ error: "Award not found" }, { status: 404 });
    }

    return NextResponse.json(award);
  } catch (error) {
    console.error("Error fetching award:", error);
    return NextResponse.json(
      { error: "Failed to fetch award" },
      { status: 500 }
    );
  }
}

// PUT - Update award
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const award = await prisma.award.update({
      where: { id },
      data,
    });
    return NextResponse.json(award);
  } catch (error) {
    console.error("Error updating award:", error);
    return NextResponse.json(
      { error: "Failed to update award" },
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
    const award = await prisma.award.update({
      where: { id },
      data,
    });
    return NextResponse.json(award);
  } catch (error) {
    console.error("Error updating award:", error);
    return NextResponse.json(
      { error: "Failed to update award" },
      { status: 500 }
    );
  }
}

// DELETE - Delete award
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.award.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Award deleted successfully" });
  } catch (error) {
    console.error("Error deleting award:", error);
    return NextResponse.json(
      { error: "Failed to delete award" },
      { status: 500 }
    );
  }
}
