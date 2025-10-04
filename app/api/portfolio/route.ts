import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [
      personalInfo,
      education,
      awards,
      experience,
      skills,
      languages,
      research,
    ] = await Promise.all([
      prisma.personalInfo.findFirst(),
      prisma.education.findMany({ orderBy: { order: "asc" } }),
      prisma.award.findMany({ orderBy: { order: "asc" } }),
      prisma.experience.findMany({ orderBy: { order: "asc" } }),
      prisma.skill.findMany({ orderBy: { order: "asc" } }),
      prisma.language.findMany({ orderBy: { order: "asc" } }),
      prisma.research.findMany({ orderBy: { order: "asc" } }),
    ]);

    return NextResponse.json({
      personalInfo,
      education,
      awards,
      experience,
      skills,
      languages,
      research,
    });
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio data" },
      { status: 500 }
    );
  }
}
