import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token." }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true, name: true, email: true, role: true,
      tradieProfile: {
        select: {
          businessName: true, specialty: true,
          rating: true, totalReviews: true,
          profilePhoto: true, isVerified: true,
        }
      }
    },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  return NextResponse.json({ user });
}