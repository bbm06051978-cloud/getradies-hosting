import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { userId: decoded.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { notificationId, action } = await req.json();

  if (action === "mark_read" && notificationId) {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "mark_all_read") {
    await prisma.notification.updateMany({
      where: { userId: decoded.id, isRead: false },
      data: { isRead: true },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "delete" && notificationId) {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    return NextResponse.json({ success: true });
  }

  if (action === "delete_all") {
    await prisma.notification.deleteMany({
      where: { userId: decoded.id },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
