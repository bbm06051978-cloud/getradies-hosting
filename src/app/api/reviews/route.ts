import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST — submit a review
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { bookingId, rating, comment } = await req.json();

    if (!bookingId || !rating) {
      return NextResponse.json({ error: "Booking ID and rating are required." }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5." }, { status: 400 });
    }

    // Verify booking belongs to this homeowner and is completed
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        job: { select: { userId: true } },
        tradieProfile: { select: { id: true, totalReviews: true, rating: true } },
        review: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found." }, { status: 404 });
    }

    if (booking.job.userId !== decoded.id) {
      return NextResponse.json({ error: "Not authorised." }, { status: 403 });
    }

    if (booking.status !== "COMPLETED") {
      return NextResponse.json({ error: "Job must be completed before leaving a review." }, { status: 400 });
    }

    if (booking.review) {
      return NextResponse.json({ error: "You have already reviewed this booking." }, { status: 400 });
    }

    // Create review and update tradie rating in transaction
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: {
          bookingId,
          userId: decoded.id,
          rating,
          comment: comment || null,
        },
      });

      // Recalculate tradie rating
      const allReviews = await tx.review.findMany({
        where: { booking: { tradieProfileId: booking.tradieProfileId } },
        select: { rating: true },
      });

      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

      await tx.tradieProfile.update({
        where: { id: booking.tradieProfileId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          totalReviews: allReviews.length,
        },
      });

      // Notify tradie about new review
      const tradieUser = await tx.tradieProfile.findUnique({
        where: { id: booking.tradieProfileId },
        include: { user: { select: { id: true } } },
      });

      if (tradieUser) {
        await tx.notification.create({
          data: {
            userId: tradieUser.user.id,
            title: "New Review Received!",
            message: `You received a ${rating}-star review. ${comment ? `"${comment.slice(0, 60)}${comment.length > 60 ? "..." : ""}"` : ""}`,
          },
        });
      }

      return newReview;
    });

    return NextResponse.json({ success: true, review });

  } catch (err) {
    console.error("Review error:", err);
    return NextResponse.json({ error: "Server error: " + String(err) }, { status: 500 });
  }
}

// GET — get reviews for a tradie profile
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tradieProfileId = searchParams.get("tradieProfileId");

  if (!tradieProfileId) {
    return NextResponse.json({ error: "tradieProfileId required." }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { booking: { tradieProfileId } },
    include: {
      user: { select: { name: true } },
      booking: { select: { job: { select: { title: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reviews });
}
