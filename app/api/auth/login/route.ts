import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, dashboard } = body;

    if (!password || !dashboard) {
      return NextResponse.json(
        { error: "Password and dashboard are required" },
        { status: 400 }
      );
    }

    if (dashboard !== "portfolio" && dashboard !== "herpromise") {
      return NextResponse.json(
        { error: "Invalid dashboard type" },
        { status: 400 }
      );
    }

    // Verify password
    if (!verifyPassword(password, dashboard)) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Set authentication cookie
    await setAuthCookie(dashboard);

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      dashboard,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
