import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const state = searchParams.get("state") || "";
  if (q.length < 2) return NextResponse.json({ suburbs: [] });
  const suburbs = await prisma.suburb.findMany({
    where: {
      name: { startsWith: q, mode: "insensitive" },
      ...(state ? { state } : {}),
    },
    orderBy: { name: "asc" },
    take: 15,
    select: { name: true, state: true, postcode: true },
  });
  return NextResponse.json({ suburbs });
}