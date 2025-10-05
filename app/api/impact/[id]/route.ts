import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const impact = await prisma.impactMetric.findUnique({
      where: { id },
    });

    if (!impact) {
      return NextResponse.json(
        { success: false, error: "Impact metric not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: impact,
    });
  } catch (error) {
    console.error("Error fetching impact metric:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch impact metric" },
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

    const impact = await prisma.impactMetric.update({
      where: { id },
      data: {
        ...body,
        order: body.order ? parseInt(body.order) : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      data: impact,
    });
  } catch (error) {
    console.error("Error updating impact metric:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update impact metric" },
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
    await prisma.impactMetric.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Impact metric deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting impact metric:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete impact metric" },
      { status: 500 }
    );
  }
}
