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

  const profile = await prisma.tradieProfile.findUnique({
    where: { userId: decoded.id },
    select: {
      specialty: true,
      isVerified: true,
      rating: true,
      totalReviews: true,
      businessName: true,
    },
  });

  return NextResponse.json({ profile });
}