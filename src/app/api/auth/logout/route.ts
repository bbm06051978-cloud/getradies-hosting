import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("token");
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/login", "http://localhost:3000"));
  response.cookies.delete("token");
  return response;
}