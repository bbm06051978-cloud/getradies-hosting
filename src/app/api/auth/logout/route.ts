import { NextRequest, NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("token");
  return response;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const redirect = searchParams.get("redirect") || "/login";
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace("http://localhost:3000", "") || "";
  const redirectUrl = appUrl ? `${appUrl}${redirect}` : redirect;
  
  const response = NextResponse.redirect(new URL(redirectUrl, req.url));
  response.cookies.delete("token");
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}