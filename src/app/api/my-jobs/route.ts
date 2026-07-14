import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const jobs = await prisma.job.findMany({
    where: { userId: decoded.id },
    orderBy: { createdAt: "desc" },
    include: {
      quotes: {
        select: { id: true, amount: true, status: true },
      },
      bookings: {
        select: {
          id: true, status: true, scheduledAt: true,
          tradieProfile: {
            select: {
              businessName: true,
              specialty: true,
              user: { select: { phone: true } },
            },
          },
        },
      },
    },
  });

  return NextResponse.json({ jobs });
}

// PATCH — Cancel a job
export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }

  const { jobId, action } = await req.json();

  if (action === "cancel") {
    await prisma.job.update({
      where: { id: jobId, userId: decoded.id },
      data: { status: "CANCELLED" },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
