import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      user: { select: { name: true, suburb: true, state: true } },
      _count: { select: { quotes: true } },
    },
  });

  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });

  return NextResponse.json({ job });
}
