import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DisputeError, processDueItems, resolveDispute } from "@/lib/disputes";

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

  await processDueItems();

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
    // This older "Resolve" button closes a dispute in the tradie's favour.
    // The newer admin screen uses /api/disputes, which offers refund, release or split.
    const open = await prisma.dispute.findFirst({
      where: { bookingId, status: { in: ["OPEN", "RESPONDED"] } },
      select: { id: true },
    });
    if (open) {
      try {
        await resolveDispute({
          disputeId: open.id,
          outcome: "RELEASE_TRADIE",
          note: "Resolved in the tradie's favour by GeTradie.",
          by: "ADMIN",
          byId: admin.id,
        });
      } catch (err) {
        if (err instanceof DisputeError) return NextResponse.json({ error: err.message }, { status: err.status });
        console.error("Resolve dispute error:", err);
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
      }
      return NextResponse.json({ success: true });
    }
    // Disputed bookings from before the dispute process existed have no dispute record.
    const closed = await prisma.booking.updateMany({
      where: { id: bookingId, status: "DISPUTED" },
      data: { status: "COMPLETED" },
    });
    if (closed.count === 1) {
      const b = await prisma.booking.findUnique({ where: { id: bookingId }, select: { jobId: true } });
      if (b) await prisma.job.update({ where: { id: b.jobId }, data: { status: "COMPLETED" } });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
