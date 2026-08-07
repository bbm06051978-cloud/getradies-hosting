import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { name, phone, suburb, state } = await req.json();

  const user = await prisma.user.update({
    where: { id: decoded.id },
    data: {
      name: name || undefined,
      phone: phone || undefined,
      suburb: suburb || undefined,
      state: state || undefined,
    },
  });

  return NextResponse.json({ success: true, user });
}