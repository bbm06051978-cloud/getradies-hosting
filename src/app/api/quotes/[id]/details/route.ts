import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — get quote details without creating payment intent
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

    const { id } = await params;

    const quote = await prisma.quote.findUnique({
      where: { id },
      include: {
        job: { select: { title: true, userId: true } },
        tradieProfile: { include: { user: { select: { name: true } } } },
      },
    });

    if (!quote) return NextResponse.json({ error: "Quote not found." }, { status: 404 });
    if (quote.job.userId !== decoded.id) return NextResponse.json({ error: "Not authorised." }, { status: 403 });

    return NextResponse.json({
      jobTitle: quote.job.title,
      tradie:   quote.tradieProfile.user.name,
      amount:   quote.amount,
    });

  } catch (err) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
