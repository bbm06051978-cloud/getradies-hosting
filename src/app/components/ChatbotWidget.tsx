"use client";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const QUICK_QUESTIONS = [
  "How does GeTradie work?",
  "Is it free to post a job?",
  "How do tradies get verified?",
  "What trades are supported?",
];

export default function ChatbotWidget() {
  const [open, setOpen]         = useState(false);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm the GeTradie Assistant 👋 I can help you with questions about posting jobs, getting quotes, payments and more. What can I help you with today?",
    },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Sorry, I couldn't process that." }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble right now. Please email support@getradie.com.au" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9998,
          width: 56, height: 56, borderRadius: "50%",
          background: "rgba(249,115,22,0.6)",
          animation: "pulse 1.5s ease-out infinite",
          boxShadow: "0 0 0 8px rgba(249,115,22,0.2)",
          pointerEvents: "none",
        }}/>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: "50%",
          background: "linear-gradient(135deg, #F97316, #EA580C)",
          border: "none", cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,71,171,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
        aria-label="Open chat"
      >
        {open ? <X size={22} color="#fff"/> : <MessageCircle size={22} color="#fff"/>}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: "fixed", bottom: 90, right: 24, zIndex: 9998,
          width: 360, maxHeight: 520,
          background: "#fff", borderRadius: 20,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          border: "1px solid rgba(0,71,171,0.1)",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #0047AB, #003d99)",
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Bot size={18} color="#fff"/>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>GeTradie Assistant</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>
                <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10B981", marginRight: 4 }}/>
                Online · Usually replies instantly
              </p>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.7)" }}>
              <X size={16}/>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: m.role === "user" ? "linear-gradient(135deg, #0047AB, #003d99)" : "#F3F4F6",
                  color: m.role === "user" ? "#fff" : "#111827",
                  fontSize: 13, lineHeight: 1.5,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ background: "#F3F4F6", borderRadius: "18px 18px 18px 4px", padding: "10px 14px", display: "flex", gap: 4 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: "50%", background: "#9CA3AF",
                      animation: "bounce 1s infinite", animationDelay: `${i * 0.2}s`,
                    }}/>
                  ))}
                </div>
              </div>
            )}

            {/* Quick questions — show only at start */}
            {messages.length === 1 && !loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                <p style={{ fontSize: 11, color: "#9CA3AF", margin: 0 }}>Quick questions:</p>
                {QUICK_QUESTIONS.map(q => (
                  <button key={q} onClick={() => sendMessage(q)} style={{
                    background: "#EFF6FF", border: "1px solid #BFDBFE",
                    borderRadius: 10, padding: "8px 12px", cursor: "pointer",
                    fontSize: 12, color: "#0047AB", fontWeight: 600, textAlign: "left",
                    transition: "background 0.2s",
                  }}>
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Input */}
          <div style={{ padding: "12px 16px", borderTop: "1px solid #E5E7EB", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
              placeholder="Type a message..."
              style={{
                flex: 1, border: "1.5px solid #E5E7EB", borderRadius: 12,
                padding: "8px 12px", fontSize: 13, outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={e => (e.target.style.borderColor = "#0047AB")}
              onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: input.trim() && !loading ? "linear-gradient(135deg, #0047AB, #003d99)" : "#E5E7EB",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {loading ? <Loader2 size={16} color="#9CA3AF" style={{ animation: "spin 1s linear infinite" }}/> : <Send size={16} color={input.trim() ? "#fff" : "#9CA3AF"}/>}
            </button>
          </div>

          {/* Footer */}
          <div style={{ padding: "6px 16px 10px", textAlign: "center" }}>
            <p style={{ fontSize: 10, color: "#9CA3AF", margin: 0 }}>
              Powered by GeTradie AI · <a href="mailto:support@getradie.com.au" style={{ color: "#0047AB" }}>support@getradie.com.au</a>
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.8); opacity: 0; }
          100% { transform: scale(1.8); opacity: 0; }
        }
      `}</style>
    </>
  );
}
