import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // Decode token to get role
  let role: string | null = null;
  let decoded: any = null;
  if (token) {
    try {
      decoded = verifyToken(token);
      role = decoded?.role || null;
    } catch {
      role = null;
    }
  }

  // Cache control headers
  const cacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  // Public auth routes - redirect to dashboard if already logged in
  const authRoutes = ["/login", "/login-tradie", "/signup"];
  if (authRoutes.some(r => path.startsWith(r)) && token && role) {
    if (role === "TRADIE") return NextResponse.redirect(new URL("/dashboard-tradie", req.url));
    if (role === "HOMEOWNER") return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Tradie only routes
  const tradieRoutes = ["/dashboard-tradie", "/tradie-profile", "/tradie-jobs", "/tradie-bookings", "/tradie-schedule", "/tradie-subscription", "/tradie-chats", "/tradie-verification", "/quotes"];
  if (tradieRoutes.some(r => path.startsWith(r))) {
    if (!token || !decoded) return NextResponse.redirect(new URL("/login-tradie", req.url));
    if (role !== "TRADIE") return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Homeowner only routes
  const homeownerRoutes = ["/dashboard", "/my-jobs", "/my-quotes", "/bookings", "/chats", "/post-job", "/job"];
  if (homeownerRoutes.some(r => path.startsWith(r))) {
    if (!token || !decoded) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "HOMEOWNER") return NextResponse.redirect(new URL("/dashboard-tradie", req.url));
  }

  // Admin only routes
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!token || !decoded || role !== "ADMIN") return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Allow request with cache headers
  const response = NextResponse.next();
  Object.entries(cacheHeaders).forEach(([key, value]) => response.headers.set(key, value));
  return response;
}

export const config = {
  matcher: [
    "/login", "/login-tradie", "/signup",
    "/dashboard/:path*", "/dashboard-tradie/:path*",
    "/tradie-profile/:path*", "/tradie-jobs/:path*",
    "/tradie-bookings/:path*", "/tradie-schedule/:path*",
    "/tradie-subscription/:path*", "/tradie-chats/:path*",
    "/tradie-verification/:path*", "/quotes/:path*",
    "/my-jobs/:path*", "/my-quotes/:path*",
    "/bookings/:path*", "/chats/:path*",
    "/post-job/:path*", "/job/:path*",
    "/admin/:path*",
  ],
};
