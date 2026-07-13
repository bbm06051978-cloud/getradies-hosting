import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }

    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            user: {
              select: { id: true, name: true, phone: true, suburb: true, state: true },
            },
          },
        },
        tradieProfile: {
          include: {
            user: {
              select: { id: true, name: true, phone: true },
            },
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    }

    if (quote.job.userId !== decoded.id) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }

    if (quote.status === "ACCEPTED") {
      return NextResponse.json({ error: "Already accepted." }, { status: 400 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.quote.update({
        where: { id },
        data: { status: "ACCEPTED" },
      });

      await tx.quote.updateMany({
        where: {
          jobId: quote.jobId,
          id: { not: id },
          status: "PENDING",
        },
        data: { status: "REJECTED" },
      });

      await tx.job.update({
        where: { id: quote.jobId },
        data: { status: "BOOKED" },
      });

      await tx.booking.create({
        data: {
          jobId: quote.jobId,
          tradieProfileId: quote.tradieProfileId,
          totalAmount: quote.amount,
          scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "PENDING",
        },
      });
    });

    // Notify accepted tradie
    try {
      await prisma.notification.create({
        data: {
          userId: quote.tradieProfile.user.id,
          title: "Quote Accepted!",
          message: `Your quote of $${quote.amount} for "${quote.job.title}" in ${quote.job.suburb} was accepted by ${quote.job.user.name}. Contact: ${quote.job.user.phone || "via messages"}.`,
        },
      });
    } catch (err) {
      console.error("Failed to notify accepted tradie:", err);
    }

    // Notify rejected tradies
    try {
      const rejectedQuotes = await prisma.quote.findMany({
        where: { jobId: quote.jobId, id: { not: id }, status: "REJECTED" },
        include: { tradieProfile: { include: { user: { select: { id: true } } } } },
      });
      for (const rq of rejectedQuotes) {
        await prisma.notification.create({
          data: {
            userId: rq.tradieProfile.user.id,
            title: "Quote Not Selected",
            message: `Your quote for "${quote.job.title}" in ${quote.job.suburb} was not selected this time. Keep quoting to win more jobs!`,
          },
        });
      }
    } catch (err) {
      console.error("Failed to notify rejected tradies:", err);
    }

    return NextResponse.json({
      success: true,
      tradie: {
        name: quote.tradieProfile.user.name,
        phone: quote.tradieProfile.user.phone,
      },
      homeowner: {
        name: quote.job.user.name,
        phone: quote.job.user.phone,
        suburb: quote.job.user.suburb,
        state: quote.job.user.state,
      },
    });

  } catch (err) {
    console.error("Accept quote error:", err);
    return NextResponse.json({ error: "Server error: " + String(err) }, { status: 500 });
  }
}
