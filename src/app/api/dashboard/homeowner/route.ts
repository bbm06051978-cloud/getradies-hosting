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

  const userId = decoded.id;

  const [jobs, quotesReceived, upcomingBookings, completedJobs] =
    await Promise.all([
      // Recent 10 jobs
      prisma.job.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          trade: true,
          status: true,
          createdAt: true,
          aiEstimate: true,
        },
      }),
      // Quotes received count
      prisma.quote.count({
        where: { job: { userId } },
      }),
      // Upcoming bookings count
      prisma.booking.count({
        where: {
          job: { userId },
          status: "CONFIRMED",
          scheduledAt: { gte: new Date() },
        },
      }),
      // Completed jobs count
      prisma.job.count({
        where: { userId, status: "COMPLETED" },
      }),
    ]);

  const activeJobs = jobs.filter((j) =>
    ["OPEN", "QUOTED", "BOOKED", "IN_PROGRESS"].includes(j.status)
  ).length;

  return NextResponse.json({
    jobs,
    stats: {
      activeJobs: activeJobs ?? 0,
      quotesReceived: quotesReceived ?? 0,
      upcomingBookings: upcomingBookings ?? 0,
      completedJobs: completedJobs ?? 0,
    },
  });
}