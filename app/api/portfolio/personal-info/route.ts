import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch personal info
export async function GET() {
  try {
    const personalInfo = await prisma.personalInfo.findFirst();
    return NextResponse.json(personalInfo);
  } catch (error) {
    console.error("Error fetching personal info:", error);
    return NextResponse.json(
      { error: "Failed to fetch personal info" },
      { status: 500 }
    );
  }
}

// PUT - Update personal info
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const personalInfo = await prisma.personalInfo.findFirst();

    if (!personalInfo) {
      // Create if doesn't exist
      const created = await prisma.personalInfo.create({
        data: {
          ...data,
          id: data.id || "patience-info",
        },
      });
      return NextResponse.json(created);
    }

    // Update existing
    const updated = await prisma.personalInfo.update({
      where: { id: personalInfo.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating personal info:", error);
    return NextResponse.json(
      { error: "Failed to update personal info" },
      { status: 500 }
    );
  }
}
