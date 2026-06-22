"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Send, MessageSquare, Briefcase,
  User, Clock, Search,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type OtherUser = { id: string; name: string; role: string };
type Job = { id: string; title: string; trade: string };

type Conversation = {
  jobId: string;
  job: Job;
  otherUser: OtherUser;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: { id: string; name: string; role: string };
};

type CurrentUser = { id: string; name: string; role: string };

export default function ChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    const receiverId = searchParams.get("receiverId");
    const receiverName = searchParams.get("receiverName");
    const jobTitle = searchParams.get("jobTitle");
    const trade = searchParams.get("trade");

    if (jobId && receiverId && receiverName) {
      setSelectedConv({
        jobId,
        job: { id: jobId, title: jobTitle || "Job", trade: trade || "" },
        otherUser: { id: receiverId, name: receiverName, role: "TRADIE" },
        lastMessage: "",
        lastMessageAt: new Date().toISOString(),
        unreadCount: 0,
      });
    }
  }, [searchParams]);
  useEffect(() => {
    // Get current user
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setCurrentUser(d.user); }).catch(() => {});
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv.jobId);
      // Poll for new messages every 3 seconds
      pollRef.current = setInterval(() => fetchMessages(selectedConv.jobId), 3000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch {} finally { setLoading(false); }
  };

  const fetchMessages = async (jobId: string) => {
    try {
      const res = await fetch(`/api/messages?jobId=${jobId}`);
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch {}
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedConv || sending) return;
    setSending(true);
    const content = newMessage.trim();
    setNewMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: selectedConv.jobId,
          receiverId: selectedConv.otherUser.id,
          content,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        // Update last message in conversations
        setConversations(prev => prev.map(c =>
          c.jobId === selectedConv.jobId
            ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() }
            : c
        ));
      }
    } catch {} finally { setSending(false); }
  };

  const filtered = conversations.filter(c =>
    c.otherUser.name.toLowerCase().includes(search.toLowerCase()) ||
    c.job.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return date.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 64px)" }}>

          {/* LEFT — Conversations list */}
          <div className="w-80 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-3">
                <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
                  <ArrowLeft size={18} />
                </Link>
                <h2 className="font-bold text-gray-900 text-lg">Messages</h2>
                {conversations.reduce((sum, c) => sum + c.unreadCount, 0) > 0 && (
                  <span className="ml-auto bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {conversations.reduce((sum, c) => sum + c.unreadCount, 0)}
                  </span>
                )}
              </div>
              {/* Search */}
              <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-3 py-2 gap-2 transition-colors">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 text-xs text-gray-700 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageSquare size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm font-medium">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {search ? "No results found" : "Start chatting from a quote or booking"}
                  </p>
                </div>
              ) : (
                filtered.map(conv => (
                  <button
                    key={conv.jobId}
                    onClick={() => setSelectedConv(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                      selectedConv?.jobId === conv.jobId ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">
                          {conv.otherUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-gray-900 text-sm truncate">{conv.otherUser.name}</p>
                          <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{formatTime(conv.lastMessageAt)}</span>
                        </div>
                        <p className="text-xs text-blue-600 font-medium truncate">{conv.job.title}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* RIGHT — Chat window */}
          <div className="flex-1 flex flex-col">
            {!selectedConv ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={36} className="text-blue-300" />
                </div>
                <h3 className="font-bold text-gray-700 text-lg mb-2">Your Messages</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Select a conversation from the left to start chatting, or send a message from a quote card.
                </p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{selectedConv.otherUser.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{selectedConv.otherUser.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Briefcase size={11} />
                      {selectedConv.job.title}
                      <span className="bg-blue-100 text-blue-700 font-semibold px-1.5 py-0.5 rounded-full">
                        {selectedConv.job.trade}
                      </span>
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-green-500 font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                    Online
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageSquare size={32} className="text-gray-200 mb-3" />
                      <p className="text-gray-400 text-sm">No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender.id === currentUser?.id;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? "justify-end" : "justify-start"} gap-2`}
                        >
                          {!isMe && (
                            <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <span className="text-white text-xs font-bold">{msg.sender.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                            {!isMe && (
                              <p className="text-xs text-gray-400 mb-1 ml-1">{msg.sender.name}</p>
                            )}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isMe
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                            }`}>
                              {msg.content}
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}>
                              <Clock size={10} className="text-gray-300" />
                              <span className="text-xs text-gray-300">{formatTime(msg.createdAt)}</span>
                            </div>
                          </div>
                          {isMe && (
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <User size={14} className="text-blue-600" />
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="bg-white border-t border-gray-100 p-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1 flex items-end border border-gray-200 focus-within:border-blue-400 rounded-2xl px-4 py-3 gap-2 transition-colors bg-slate-50">
                      <textarea
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Type a message... (Enter to send)"
                        rows={1}
                        className="flex-1 text-sm text-gray-700 outline-none bg-transparent resize-none max-h-32"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSend}
                      disabled={!newMessage.trim() || sending}
                      className="w-11 h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <Send size={18} className={sending ? "opacity-50" : ""} />
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Press Enter to send · Shift+Enter for new line
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
