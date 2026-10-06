import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, signToken } from "@/lib/auth";

// Admin sign-in. Sets the admin panel's own cookie and leaves any
// homeowner or tradie session in the same browser untouched.
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json().catch(() => ({}));
    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email: email.trim() } });
    const valid = !!user && await bcrypt.compare(password, user.passwordHash);
    // Same message whether the account is missing, the password is wrong, or it is not an admin.
    if (!user || !valid || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Invalid admin email or password." }, { status: 401 });
    }
    const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name });
    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name } });
    response.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
