import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST — upload profile photo (base64)
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { photo } = await req.json();

  if (!photo) return NextResponse.json({ error: "No photo provided." }, { status: 400 });

  // Validate it's a base64 image
  if (!photo.startsWith("data:image/")) {
    return NextResponse.json({ error: "Invalid image format." }, { status: 400 });
  }

  // Check size — base64 string should be under 700KB (500KB image)
  const sizeInBytes = (photo.length * 3) / 4;
  if (sizeInBytes > 700000) {
    return NextResponse.json({ error: "Image too large. Please use an image under 500KB." }, { status: 400 });
  }

  await prisma.tradieProfile.update({
    where: { userId: decoded.id },
    data: { profilePhoto: photo },
  });

  return NextResponse.json({ success: true, photo });
}

// DELETE — remove profile photo
export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  await prisma.tradieProfile.update({
    where: { userId: decoded.id },
    data: { profilePhoto: null },
  });

  return NextResponse.json({ success: true });
}
