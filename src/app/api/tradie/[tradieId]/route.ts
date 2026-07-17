import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tradieId: string }> }
) {
  try {
    const { tradieId } = await params;

    const profile = await prisma.tradieProfile.findUnique({
      where: { id: tradieId },
      include: {
        user: {
          select: { name: true, suburb: true, state: true, createdAt: true },
        },
        photos: {
          select: { id: true, url: true, caption: true },
          take: 12,
        },
        bookings: {
          where: { status: "COMPLETED" },
          include: {
            review: {
              include: {
                user: { select: { name: true } },
              },
            },
            job: { select: { title: true, trade: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { bookings: true, quotes: true },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Tradie not found." }, { status: 404 });
    }

    // Extract reviews from completed bookings
    const reviews = profile.bookings
      .filter(b => b.review)
      .map(b => ({
        id: b.review!.id,
        rating: b.review!.rating,
        comment: b.review!.comment,
        createdAt: b.review!.createdAt,
        homeowner: b.review!.user.name,
        jobTitle: b.job.title,
      }));

    const completedJobs = profile.bookings.length;

    return NextResponse.json({
      profile: {
        id: profile.id,
        businessName: profile.businessName,
        specialty: profile.specialty,
        bio: profile.bio,
        suburb: profile.suburb,
        state: profile.state,
        rating: profile.rating,
        totalReviews: profile.totalReviews,
        isVerified: profile.isVerified,
        profilePhoto: profile.profilePhoto,
        memberSince: profile.user.createdAt,
        completedJobs,
        getradiePoints: profile.getradiePoints ?? 0,
        pointsBadge: profile.pointsBadge ?? "Bronze",
        photos: profile.photos,
        reviews,
      },
    });

  } catch (err) {
    console.error("Public tradie profile error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
