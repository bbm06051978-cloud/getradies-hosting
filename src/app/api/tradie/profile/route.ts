import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      suburb: true,
      state: true,
      postcode: true,
      createdAt: true,
      tradieProfile: {
        select: {
          id: true,
          businessName: true,
          specialty: true,
          licenseNumber: true,
          isVerified: true,
          rating: true,
          totalReviews: true,
          bio: true,
          suburb: true,
          state: true,
          profilePhoto: true,
          getradiePoints: true,
          pointsBadge: true,
          _count: {
            select: {
              quotes: true,
              bookings: true,
            },
          },
        },
      },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  return NextResponse.json({ user });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const {
    name, phone,
    businessName, specialty, licenseNumber, bio, suburb, state, postcode,
    currentPassword, newPassword,
  } = await req.json();

  if (newPassword) {
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

    const valid = await bcrypt.compare(currentPassword || "", user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: decoded.id }, data: { name, phone, passwordHash } });
  } else {
    await prisma.user.update({ where: { id: decoded.id }, data: { name, phone } });
  }

  // Update tradie profile
  await prisma.tradieProfile.update({
    where: { userId: decoded.id },
    data: { businessName, specialty, licenseNumber, bio, suburb, state },
  });

  // Update user suburb/state/postcode too
  await prisma.user.update({
    where: { id: decoded.id },
    data: { suburb, state, postcode },
  });

  return NextResponse.json({ success: true });
}
