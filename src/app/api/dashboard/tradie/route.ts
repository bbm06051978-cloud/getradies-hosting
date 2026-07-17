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

  const tradieProfile = await prisma.tradieProfile.findUnique({
    where: { userId },
  });

  if (!tradieProfile) {
    return NextResponse.json({ error: "Tradie profile not found." }, { status: 404 });
  }

  const tradieProfileId = tradieProfile.id;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [jobLeads, quotesSent, bookingsConfirmed, schedule, earnings] =
    await Promise.all([
      prisma.job.findMany({
        where: {
          trade: tradieProfile.specialty,
          status: "OPEN",
          AND: [
            { state: tradieProfile.state || "NSW" },
            {
              OR: [
                { suburb: { equals: tradieProfile.suburb || "", mode: "insensitive" } },
                { suburb: "" },
              ],
            },
          ],
        },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          title: true,
          trade: true,
          suburb: true,
          state: true,
          status: true,
          createdAt: true,
          aiEstimate: true,
        },
      }),
      prisma.quote.count({
        where: { tradieProfileId },
      }),
      prisma.booking.count({
        where: {
          tradieProfileId,
          status: "CONFIRMED",
          createdAt: { gte: weekAgo },
        },
      }),
      prisma.booking.findMany({
        where: {
          tradieProfileId,
          scheduledAt: { gte: new Date() },
          status: { in: ["CONFIRMED", "PENDING"] },
        },
        orderBy: { scheduledAt: "asc" },
        take: 5,
        include: {
          job: {
            include: {
              user: {
                select: { suburb: true, state: true },
              },
            },
          },
        },
      }),
      prisma.booking.aggregate({
        where: {
          tradieProfileId,
          status: "COMPLETED",
          updatedAt: { gte: monthStart },
        },
        _sum: { totalAmount: true },
      }),
    ]);

  return NextResponse.json({
    jobLeads,
    schedule,
    stats: {
      newJobLeads: jobLeads.length ?? 0,
      quotesSent: quotesSent ?? 0,
      bookingsConfirmed: bookingsConfirmed ?? 0,
      earnings: earnings._sum.totalAmount ?? 0,
    },
    getradiePoints: {
      points: tradieProfile.getradiePoints ?? 0,
      badge: tradieProfile.pointsBadge ?? "Bronze",
    },
    profile: {
      businessDetails: !!tradieProfile.businessName && !!tradieProfile.specialty,
      servicesPricing: !!tradieProfile.bio,
      photosGallery: (await prisma.tradiePhoto.count({ where: { tradieProfileId } })) > 0,
      licenseInsurance: !!tradieProfile.licenseNumber,
    },
    subscription: {
      plan:           tradieProfile.subscriptionPlan ?? "Free",
      expiry:         tradieProfile.subscriptionExpiry ?? null,
      freeQuotesUsed: tradieProfile.freeQuotesUsed ?? 0,
    },
  });
}