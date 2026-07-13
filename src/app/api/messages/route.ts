import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — fetch all conversations or messages for a specific job
export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get("jobId");
  const receiverId = searchParams.get("receiverId");
  if (jobId) {
    const messages = await prisma.message.findMany({
      where: {
        jobId,
        OR: [
          { senderId: decoded.id, receiverId: receiverId || undefined },
          { senderId: receiverId || undefined, receiverId: decoded.id },
        ],
      },
      include: {
        sender: {
          select: {
            id: true, name: true, role: true,
            tradieProfile: { select: { profilePhoto: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    await prisma.message.updateMany({
      where: {
        jobId,
        receiverId: decoded.id,
        senderId: receiverId || undefined,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ messages });
  }

  // Fetch all conversations grouped by job
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: decoded.id },
        { receiverId: decoded.id },
      ],
    },
    include: {
      job: { select: { id: true, title: true, trade: true } },
      sender: {
        select: {
          id: true, name: true, role: true,
          tradieProfile: { select: { profilePhoto: true } },
        },
      },
      receiver: {
        select: {
          id: true, name: true, role: true,
          tradieProfile: { select: { profilePhoto: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const conversations = messages.reduce((acc, msg) => {
    const rawOther = msg.senderId === decoded.id ? msg.receiver : msg.sender;
    const key = `${msg.jobId}_${rawOther.id}`;
    if (!acc[key]) {
      acc[key] = {
        jobId: msg.jobId,
        job: msg.job,
        otherUser: {
          id: rawOther.id,
          name: rawOther.name,
          role: rawOther.role,
          profilePhoto: (rawOther as any).tradieProfile?.profilePhoto || null,
        },
        lastMessage: msg.content,
        lastMessageAt: msg.createdAt,
        unreadCount: 0,
      };
    }
    const rawOther2 = msg.senderId === decoded.id ? msg.receiver : msg.sender;
    const key2 = `${msg.jobId}_${rawOther2.id}`;
    if (msg.receiverId === decoded.id && !msg.isRead) {
      acc[key2].unreadCount++;
    }
    return acc;
  }, {} as Record<string, {
    jobId: string;
    job: { id: string; title: string; trade: string };
    otherUser: { id: string; name: string; role: string; profilePhoto: string | null };
    lastMessage: string;
    lastMessageAt: Date;
    unreadCount: number;
  }>);

  return NextResponse.json({ conversations: Object.values(conversations) });
}

// POST — send a message
export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { jobId, receiverId, content } = await req.json();

  if (!jobId || !receiverId || !content?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: {
      jobId,
      senderId: decoded.id,
      receiverId,
      content: content.trim(),
    },
    include: {
      sender: {
        select: {
          id: true, name: true, role: true,
          tradieProfile: { select: { profilePhoto: true } },
        },
      },
    },
  });

  return NextResponse.json({ message });
}