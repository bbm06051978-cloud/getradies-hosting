import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // Skip API routes entirely
  if (path.startsWith("/api/")) return NextResponse.next();

  // Cache control headers
  const cacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
  };

  // Decode token safely
  let role: string | null = null;
  if (token) {
    try {
      const decoded = verifyToken(token);
      role = (decoded as any)?.role || null;
    } catch {
      role = null;
    }
  }

  // Already logged in - redirect away from auth pages
  if (path === "/login" || path === "/login-tradie" || path === "/signup") {
    if (token && role === "TRADIE") {
      return NextResponse.redirect(new URL("/dashboard-tradie", req.url));
    }
    if (token && role === "HOMEOWNER") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    const response = NextResponse.next();
    Object.entries(cacheHeaders).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  }

  // Tradie only routes
  const tradieRoutes = ["/dashboard-tradie", "/tradie-profile", "/tradie-jobs", "/tradie-bookings", "/tradie-schedule", "/tradie-subscription", "/tradie-chats", "/tradie-verification", "/quotes"];
  if (tradieRoutes.some(r => path.startsWith(r))) {
    if (!token || !role) return NextResponse.redirect(new URL("/login-tradie", req.url));
    if (role !== "TRADIE") return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Homeowner only routes
  const homeownerRoutes = ["/dashboard", "/my-jobs", "/my-quotes", "/bookings", "/chats", "/post-job", "/job"];
  if (homeownerRoutes.some(r => path.startsWith(r))) {
    if (!token || !role) return NextResponse.redirect(new URL("/login", req.url));
    if (role !== "HOMEOWNER") return NextResponse.redirect(new URL("/dashboard-tradie", req.url));
  }

  // Admin only routes
  if (path.startsWith("/admin") && !path.startsWith("/admin/login")) {
    if (!token || role !== "ADMIN") return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const response = NextResponse.next();
  Object.entries(cacheHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export const config = {
  matcher: [
    "/login",
    "/login-tradie",
    "/signup",
    "/dashboard/:path*",
    "/dashboard-tradie/:path*",
    "/tradie-profile/:path*",
    "/tradie-jobs/:path*",
    "/tradie-bookings/:path*",
    "/tradie-schedule/:path*",
    "/tradie-subscription/:path*",
    "/tradie-chats/:path*",
    "/tradie-verification/:path*",
    "/quotes/:path*",
    "/my-jobs/:path*",
    "/my-quotes/:path*",
    "/bookings/:path*",
    "/chats/:path*",
    "/post-job/:path*",
    "/job/:path*",
    "/admin/:path*",
  ],
};
