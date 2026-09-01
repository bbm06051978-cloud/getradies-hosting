import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email) {
    return NextResponse.json({ error: "Email required." }, { status: 400 });
  }

  try {
    // Update user unsubscribe preference
    await prisma.user.updateMany({
      where: { email: decodeURIComponent(email) },
      data: { emailNotifications: false },
    });

    // Redirect to unsubscribe confirmation page
    return NextResponse.redirect(new URL(`/unsubscribe?email=${email}&success=true`, req.url));
  } catch {
    return NextResponse.redirect(new URL(`/unsubscribe?email=${email}&error=true`, req.url));
  }
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: "Email required." }, { status: 400 });

  try {
    await prisma.user.updateMany({
      where: { email },
      data: { emailNotifications: false },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to unsubscribe." }, { status: 500 });
  }
}
