import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const program = await prisma.program.findUnique({
      where: { id },
    });

    if (!program) {
      return NextResponse.json(
        { success: false, error: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Error fetching program:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch program" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const program = await prisma.program.update({
      where: { id },
      data: {
        ...body,
        beneficiaries: body.beneficiaries
          ? parseInt(body.beneficiaries)
          : undefined,
        order: body.order ? parseInt(body.order) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Error updating program:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update program" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.program.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting program:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete program" },
      { status: 500 }
    );
  }
}
