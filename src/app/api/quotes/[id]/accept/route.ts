import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const quote = await prisma.quote.update({
    where: { id: params.id },
    data: { status: "ACCEPTED" },
  });

  await prisma.job.update({
    where: { id: quote.jobId },
    data: { status: "BOOKED" },
  });

  return NextResponse.json({ success: true });
}