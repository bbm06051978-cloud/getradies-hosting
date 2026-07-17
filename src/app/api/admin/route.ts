import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded || decoded.role !== "ADMIN") return null;
  return decoded;
}

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  const [
    totalHomeowners, totalTradies, totalJobs, totalQuotes,
    totalBookings, completedJobs, disputedJobs, openJobs,
    payments, users, jobs, disputes,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "HOMEOWNER" } }),
    prisma.user.count({ where: { role: "TRADIE" } }),
    prisma.job.count(),
    prisma.quote.count(),
    prisma.booking.count(),
    prisma.job.count({ where: { status: "COMPLETED" } }),
    prisma.booking.count({ where: { status: "DISPUTED" } }),
    prisma.job.count({ where: { status: "OPEN" } }),
    prisma.payment.aggregate({
      where: { status: "paid" },
      _sum: { amount: true, getradieFee: true, tradieEarning: true },
      _count: true,
    }),
    prisma.user.findMany({
      where: { role: { in: ["HOMEOWNER", "TRADIE"] } },
      select: {
        id: true, name: true, email: true, role: true,
        suburb: true, createdAt: true,
        tradieProfile: {
          select: { id: true, businessName: true, specialty: true, isVerified: true, rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true, title: true, trade: true, suburb: true,
        state: true, status: true, createdAt: true,
        user: { select: { name: true } },
        _count: { select: { quotes: true } },
      },
    }),
    prisma.booking.findMany({
      where: { status: "DISPUTED" },
      include: {
        job: { select: { title: true, user: { select: { name: true } } } },
        tradieProfile: { select: { businessName: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return NextResponse.json({
    stats: {
      totalHomeowners, totalTradies, totalJobs, totalQuotes,
      totalBookings, completedJobs, disputedJobs, openJobs,
      totalRevenue:       payments._sum.amount ?? 0,
      getradieRevenue:    payments._sum.getradieFee ?? 0,
      tradieEarnings:     payments._sum.tradieEarning ?? 0,
      totalTransactions:  payments._count ?? 0,
    },
    users, jobs, disputes,
  });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

  const { action, tradieProfileId, bookingId, verified } = await req.json();

  if (action === "verify_tradie" && tradieProfileId) {
    await prisma.tradieProfile.update({
      where: { userId: tradieProfileId },
      data: { isVerified: verified },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "resolve_dispute" && bookingId) {
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: "COMPLETED" },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
