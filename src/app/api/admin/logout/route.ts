import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

// Signs out of the admin panel only. A homeowner or tradie session is left alone,
// unless the ordinary session is itself an admin login (older way of signing in).
export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE);
  const ordinary = req.cookies.get("token")?.value;
  if (ordinary && verifyToken(ordinary)?.role === "ADMIN") response.cookies.delete("token");
  response.headers.set("Cache-Control", "no-store");
  return response;
}
