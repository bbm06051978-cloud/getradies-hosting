"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Send, MessageSquare, Briefcase,
  User, Clock, Search, X, Minus,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type OtherUser = { id: string; name: string; role: string; profilePhoto?: string | null };
type Job = { id: string; title: string; trade: string };

type Conversation = {
  jobId: string; job: Job; otherUser: OtherUser;
  lastMessage: string; lastMessageAt: string; unreadCount: number;
};

type Message = {
  id: string; content: string; createdAt: string; isRead: boolean;
  sender: { id: string; name: string; role: string };
};

type CurrentUser = { id: string; name: string; role: string };

function ChatsPageInner() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [search, setSearch] = useState("");
  const [chatMinimized, setChatMinimized] = useState(false);
  const [listMinimized, setListMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const activeConvRef = useRef<string>("");  const searchParams = useSearchParams();

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    const receiverId = searchParams.get("receiverId");
    const receiverName = searchParams.get("receiverName");
    const jobTitle = searchParams.get("jobTitle");
    const trade = searchParams.get("trade");
    if (jobId && receiverId && receiverName) {
      setSelectedConv({
        jobId, job: { id: jobId, title: jobTitle || "Job", trade: trade || "" },
        otherUser: { id: receiverId, name: receiverName, role: "TRADIE", profilePhoto: null },
        lastMessage: "", lastMessageAt: new Date().toISOString(), unreadCount: 0,
      });
    }
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => { if (d.user) setCurrentUser(d.user); }).catch(() => {});
    fetchConversations();
  }, []);

  useEffect(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (selectedConv) {
      const rid = selectedConv.otherUser.id;
      const jid = selectedConv.jobId;
      const convKey = `${jid}_${rid}`;
      activeConvRef.current = convKey;
      setMessages([]);
      fetchMessages(jid, rid);
      pollRef.current = setInterval(() => {
        fetchMessages(jid, rid);
      }, 5000);
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [selectedConv?.jobId, selectedConv?.otherUser?.id]);

  useEffect(() => {
    if (messages.length > 0 && !chatMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant", block: "nearest" });
    }
  }, [messages, chatMinimized]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      if (data.conversations) setConversations(data.conversations);
    } catch {} finally { setLoading(false); }
  };

  const fetchMessages = async (jobId: string, receiverId: string) => {
    const convKey = `${jobId}_${receiverId}`;
    try {
      const res = await fetch(`/api/messages?jobId=${jobId}&receiverId=${receiverId}`);
      const data = await res.json();
      // Only update messages if this conversation is still active
      if (data.messages && activeConvRef.current === convKey) {
        setMessages(data.messages);
      }
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
        body: JSON.stringify({ jobId: selectedConv.jobId, receiverId: selectedConv.otherUser.id, content }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev => [...prev, data.message]);
        setConversations(prev => prev.map(c =>
          c.jobId === selectedConv.jobId && c.otherUser.id === selectedConv.otherUser.id
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
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
  };

  const unreadTotal = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Main page background */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-500 text-sm mt-0.5">Your conversations with tradies</p>
            </div>
          </div>

          {/* Placeholder content */}
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100 max-w-md">
            <MessageSquare size={48} className="text-gray-200 mx-auto mb-4" />
            <h3 className="font-bold text-gray-700 text-lg mb-2">Chat window is open</h3>
            <p className="text-gray-400 text-sm">Your conversations appear in the chat panel at the bottom right of the screen.</p>
          </div>
        </div>

        {/* ── LinkedIn-style chat windows ── */}
        <div className="fixed bottom-0 right-6 z-50 flex items-end gap-3">

          {/* CHAT WINDOW — opens when conversation selected */}
          {selectedConv && (
            <div className="w-80 bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
              style={{ height: chatMinimized ? "auto" : "420px" }}>

              {/* Chat header */}
              <div className="bg-blue-900 px-4 py-3 flex items-center gap-3 flex-shrink-0 cursor-pointer"
                onClick={() => setChatMinimized(!chatMinimized)}>
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 border-blue-700">
                  {selectedConv.otherUser.profilePhoto ? (
                    <img src={selectedConv.otherUser.profilePhoto} alt={selectedConv.otherUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{selectedConv.otherUser.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{selectedConv.otherUser.name}</p>
                  <div className="flex items-center gap-1 text-xs text-blue-200">
                    <Briefcase size={10} />
                    <span className="truncate">{selectedConv.job.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={e => { e.stopPropagation(); setChatMinimized(!chatMinimized); }}
                    className="p-1 rounded hover:bg-blue-700 text-blue-200 hover:text-white transition-colors">
                    <Minus size={14} />
                  </button>
                  <button onClick={e => { e.stopPropagation(); setSelectedConv(null); setMessages([]); }}
                    className="p-1 rounded hover:bg-blue-700 text-blue-200 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
              </div>

              {!chatMinimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50" style={{ overscrollBehavior: "contain" }}>
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquare size={24} className="text-gray-200 mb-2" />
                        <p className="text-gray-400 text-xs">Say hello!</p>
                      </div>
                    ) : (
                      messages.map(msg => {
                        const isMe = msg.sender.id === currentUser?.id;
                        return (
                          <motion.div key={msg.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isMe ? "justify-end" : "justify-start"} gap-1.5`}>
                            {!isMe && (
                              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1 border border-gray-200">
                                {selectedConv.otherUser.profilePhoto ? (
                                  <img src={selectedConv.otherUser.profilePhoto} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{msg.sender.name.charAt(0)}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="flex flex-col max-w-[200px]">
                              <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                                isMe ? "bg-blue-600 text-white rounded-br-sm" : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                              }`}>
                                {msg.content}
                              </div>
                              <div className={`flex items-center gap-1 mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
                                <Clock size={9} className="text-gray-300" />
                                <span className="text-xs text-gray-300">{formatTime(msg.createdAt)}</span>
                              </div>
                            </div>
                            {isMe && (
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <User size={10} className="text-blue-600" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
                    <div className="flex items-end gap-2">
                      <div className="flex-1 border border-gray-200 focus-within:border-blue-400 rounded-xl px-3 py-2 bg-slate-50 transition-colors">
                        <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                          placeholder="Write a message..."
                          rows={1} className="w-full text-xs text-gray-700 outline-none bg-transparent resize-none max-h-20" />
                      </div>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={handleSend} disabled={!newMessage.trim() || sending}
                        className="w-8 h-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0">
                        <Send size={13} />
                      </motion.button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CONVERSATION LIST PANEL */}
          <div className="w-72 bg-white rounded-t-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
            style={{ height: listMinimized ? "auto" : "420px" }}>

            {/* Header */}
            <div className="bg-blue-900 px-4 py-3 flex items-center justify-between flex-shrink-0 cursor-pointer rounded-t-2xl"
              onClick={() => setListMinimized(!listMinimized)}>
              <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-white" />
                <h2 className="font-bold text-white text-sm">Messaging</h2>
                {unreadTotal > 0 && (
                  <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{unreadTotal}</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={e => { e.stopPropagation(); setListMinimized(!listMinimized); }}
                  className="p-1 rounded hover:bg-blue-700 text-blue-200 hover:text-white transition-colors">
                  <Minus size={14} />
                </button>
              </div>
            </div>

            {!listMinimized && (
              <>
                {/* Search */}
                <div className="px-3 py-2 border-b border-gray-100 flex-shrink-0">
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-lg px-3 py-1.5 gap-2 transition-colors bg-slate-50">
                    <Search size={13} className="text-gray-400" />
                    <input type="text" placeholder="Search messages..." value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="flex-1 text-xs text-gray-700 outline-none bg-transparent" />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-8 px-4">
                      <MessageSquare size={28} className="text-gray-200 mx-auto mb-2" />
                      <p className="text-gray-400 text-xs font-medium">No conversations yet</p>
                      <p className="text-gray-300 text-xs mt-0.5">
                        {search ? "No results" : "Message a tradie from a quote"}
                      </p>
                    </div>
                  ) : (
                    filtered.map(conv => (
               <button key={`${conv.jobId}_${conv.otherUser.id}`} onClick={() => { setMessages([]); setSelectedConv(conv); setChatMinimized(false); }}
                        className={`w-full text-left px-3 py-3 border-b border-gray-50 hover:bg-blue-50 transition-colors ${
                          selectedConv?.jobId === conv.jobId && selectedConv?.otherUser?.id === conv.otherUser.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                        }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                            {conv.otherUser.profilePhoto ? (
                              <img src={conv.otherUser.profilePhoto} alt={conv.otherUser.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-blue-900 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">{conv.otherUser.name.charAt(0).toUpperCase()}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`text-sm truncate ${conv.unreadCount > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-700"}`}>
                                {conv.otherUser.name}
                              </p>
                              <span className="text-xs text-gray-400 flex-shrink-0 ml-1">{formatTime(conv.lastMessageAt)}</span>
                            </div>
                            <p className="text-xs text-blue-500 font-medium truncate">{conv.job.title}</p>
                            <p className={`text-xs truncate mt-0.5 ${conv.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                              {conv.lastMessage}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <span className="bg-blue-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ChatsPage() {
  return (
    <Suspense>
      <ChatsPageInner />
    </Suspense>
  );
}
