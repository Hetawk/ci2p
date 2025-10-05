import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const campaigns = await prisma.donationCampaign.findMany({
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: campaigns,
    });
  } catch (error) {
    console.error("Error fetching donation campaigns:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch donation campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      description,
      goal,
      raised,
      currency,
      image,
      startDate,
      endDate,
      active,
      featured,
    } = body;

    const campaign = await prisma.donationCampaign.create({
      data: {
        title,
        slug,
        description,
        goal: parseFloat(goal),
        raised: raised ? parseFloat(raised) : 0,
        currency: currency || "USD",
        image,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        active: active ?? true,
        featured: featured ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error("Error creating donation campaign:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create donation campaign" },
      { status: 500 }
    );
  }
}
