import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
  });

  if (!tradieProfile) return NextResponse.json({ error: "Tradie profile not found." }, { status: 404 });

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const bookings = await prisma.booking.findMany({
    where: {
      tradieProfileId: tradieProfile.id,
      status: { in: ["CONFIRMED", "PENDING", "PENDING_CONFIRMATION"] },
      scheduledAt: { gte: todayStart },
    },
    orderBy: { scheduledAt: "asc" },
    include: {
      job: {
        include: {
          user: {
            select: { name: true, phone: true, email: true, suburb: true, state: true },
          },
        },
      },
    },
  });

  // Overdue bookings — confirmed but past scheduled time
  const overdue = await prisma.booking.findMany({
    where: {
      tradieProfileId: tradieProfile.id,
      status: { in: ["CONFIRMED", "PENDING"] },
      scheduledAt: { lt: todayStart },
    },
    orderBy: { scheduledAt: "desc" },
    include: {
      job: {
        include: {
          user: {
            select: { name: true, phone: true, email: true, suburb: true, state: true },
          },
        },
      },
    },
  });

  return NextResponse.json({ bookings, overdue });
}
