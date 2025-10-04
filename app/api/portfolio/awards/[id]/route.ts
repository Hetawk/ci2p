import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single award
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const award = await prisma.award.findUnique({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const award = await prisma.award.update({
      where: { id: params.id },
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
  { params }: { params: { id: string } }
) {
  try {
    await prisma.award.delete({
      where: { id: params.id },
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
