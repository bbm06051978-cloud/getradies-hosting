import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("token");
  return response;
}

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const redirect = searchParams.get("redirect") || "/login";
  const response = NextResponse.redirect(new URL(redirect, origin));
  response.cookies.delete("token");
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}