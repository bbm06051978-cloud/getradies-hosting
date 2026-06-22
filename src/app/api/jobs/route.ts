import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const {
    title,
    description,
    trade,
    suburb,
    state,
    postcode,
    urgency,
    budget,
    preferredDate,
    aiEstimate,
  } = await req.json();

  if (!title || !description || !trade || !suburb || !state) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 }
    );
  }

  const job = await prisma.job.create({
    data: {
      userId: decoded.id,
      title,
      description,
      trade,
      suburb,
      state,
      postcode,
      status: "OPEN",
      aiEstimate: aiEstimate || null,
    },
  });

  return NextResponse.json({ success: true, job });
}
