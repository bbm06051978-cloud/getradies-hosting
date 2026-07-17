import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // Protect tradie routes
  const tradieRoutes = [
    "/dashboard-tradie",
    "/tradie-profile",
    "/tradie-jobs",
    "/tradie-bookings",
    "/tradie-schedule",
    "/tradie-subscription",
    "/tradie-chats",
  ];

  const isTradiePath = tradieRoutes.some(r => path.startsWith(r));

  if (isTradiePath && !token) {
    return NextResponse.redirect(new URL("/login-tradie", req.url));
  }

  // Protect homeowner routes
  const homeownerRoutes = [
    "/dashboard",
    "/my-jobs",
    "/my-quotes",
    "/bookings",
    "/chats",
  ];

  const isHomeownerPath = homeownerRoutes.some(r => path.startsWith(r));

  if (isHomeownerPath && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return response;
}

export const config = {
  matcher: [
    "/dashboard-tradie/:path*",
    "/tradie-profile/:path*",
    "/tradie-jobs/:path*",
    "/tradie-bookings/:path*",
    "/tradie-schedule/:path*",
    "/tradie-subscription/:path*",
    "/tradie-chats/:path*",
    "/dashboard/:path*",
    "/my-jobs/:path*",
    "/my-quotes/:path*",
    "/bookings/:path*",
    "/chats/:path*",
  ],
};