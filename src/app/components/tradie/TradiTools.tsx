"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Calculator, Package, Clock, Car, FileText, Plus, Trash2, Copy, Check, Play, Pause, Square, Download } from "lucide-react";

// ── Shared modal wrapper ──────────────────────────────────────
function Modal({ title, icon: Icon, color, onClose, wide, children }: {
  title: string; icon: any; color: string; onClose: () => void;
  wide?: boolean; children: React.ReactNode;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full flex flex-col max-h-[90vh] ${wide ? "max-w-2xl" : "max-w-md"}`}
        style={{ animation: "slideUp 0.22s cubic-bezier(.22,1,.36,1)" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}35` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">{children}</div>
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ── 1. GST Calculator ─────────────────────────────────────────
function GSTCalculator({ onClose }: { onClose: () => void }) {
  const [price, setPrice] = useState("");
  const [mode, setMode] = useState<"add"|"extract">("add");
  const [copied, setCopied] = useState(false);

  const num    = parseFloat(price) || 0;
  const gst    = mode === "add" ? num * 0.1 : num - num / 1.1;
  const total  = mode === "add" ? num + gst  : num;
  const exGST  = mode === "add" ? num        : num / 1.1;

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Modal title="GST Calculator" icon={Calculator} color="#F97316" onClose={onClose}>
      {/* Mode toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
        {(["add","extract"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode===m?"bg-white text-gray-900 shadow-sm":"text-gray-500"}`}>
            {m === "add" ? "Add GST to price" : "Extract GST from total"}
          </button>
        ))}
      </div>

      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
        {mode === "add" ? "Price (ex GST)" : "Total price (inc GST)"}
      </label>
      <div className="flex items-center border-2 border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 mb-5 gap-2 transition-colors">
        <span className="text-gray-400 font-semibold">$</span>
        <input type="number" placeholder="0.00" value={price}
          onChange={e => setPrice(e.target.value)}
          className="flex-1 text-lg font-bold text-gray-900 outline-none bg-transparent"
          autoFocus />
      </div>

      {num > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl overflow-hidden mb-4">
          {[
            { label: "Ex GST",    value: exGST  },
            { label: "GST (10%)", value: gst    },
            { label: "Inc GST",   value: total, bold: true },
          ].map((r, i) => (
            <div key={r.label} className={`flex items-center justify-between px-4 py-3 ${i < 2 ? "border-b border-orange-100" : ""}`}>
              <span className={`text-sm ${r.bold ? "font-bold text-gray-900" : "text-gray-500"}`}>{r.label}</span>
              <span className={`font-bold ${r.bold ? "text-orange-600 text-lg" : "text-gray-700"}`}>
                ${r.value.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => copy(`$${total.toFixed(2)}`)} disabled={!num}
        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
        style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", color: "white" }}>
        {copied ? <><Check size={15}/>Copied!</> : <><Copy size={15}/>Copy Total (${total.toFixed(2)})</>}
      </button>
    </Modal>
  );
}

// ── 2. Material Cost Calculator ───────────────────────────────
type MatRow = { id: number; name: string; qty: string; unit: string; price: string };

function MaterialCalculator({ onClose }: { onClose: () => void }) {
  const [rows, setRows]     = useState<MatRow[]>([{ id: 1, name: "", qty: "1", unit: "unit", price: "" }]);
  const [markup, setMarkup] = useState("20");
  const [copied, setCopied] = useState(false);

  const addRow    = () => setRows(r => [...r, { id: Date.now(), name: "", qty: "1", unit: "unit", price: "" }]);
  const removeRow = (id: number) => setRows(r => r.filter(x => x.id !== id));
  const update    = (id: number, field: keyof MatRow, val: string) =>
    setRows(r => r.map(x => x.id === id ? { ...x, [field]: val } : x));

  const subtotal  = rows.reduce((s, r) => s + (parseFloat(r.qty)||0) * (parseFloat(r.price)||0), 0);
  const withMarkup = subtotal * (1 + (parseFloat(markup)||0) / 100);
  const copy = () => { navigator.clipboard.writeText(`$${withMarkup.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <Modal title="Material Calculator" icon={Package} color="#3B82F6" onClose={onClose} wide>
      <div className="space-y-2 mb-4">
        {/* Header row */}
        <div className="grid gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1"
          style={{ gridTemplateColumns: "1fr 70px 80px 90px 36px" }}>
          <span>Item</span><span>Qty</span><span>Unit</span><span>$/Unit</span><span></span>
        </div>

        {rows.map(r => (
          <div key={r.id} className="grid gap-2 items-center"
            style={{ gridTemplateColumns: "1fr 70px 80px 90px 36px" }}>
            <input value={r.name} onChange={e => update(r.id,"name",e.target.value)}
              placeholder="Material name"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
            <input value={r.qty} onChange={e => update(r.id,"qty",e.target.value)}
              type="number" min="0"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-center" />
            <select value={r.unit} onChange={e => update(r.id,"unit",e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-blue-400">
              {["unit","m","m²","m³","kg","L","box","roll","sheet","bag"].map(u => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <div className="flex items-center border border-gray-200 rounded-lg px-2 py-2 gap-1 focus-within:border-blue-400">
              <span className="text-gray-400 text-xs">$</span>
              <input value={r.price} onChange={e => update(r.id,"price",e.target.value)}
                type="number" min="0" placeholder="0.00"
                className="w-full text-sm outline-none bg-transparent" />
            </div>
            <button onClick={() => removeRow(r.id)} disabled={rows.length === 1}
              className="w-9 h-9 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-30">
              <Trash2 size={14} className="text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={addRow}
        className="w-full py-2.5 rounded-xl border-2 border-dashed border-blue-200 text-blue-500 text-sm font-semibold hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 mb-5">
        <Plus size={15}/> Add Item
      </button>

      {/* Markup + totals */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Materials subtotal</span>
          <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Markup</span>
            <div className="flex items-center border border-blue-200 rounded-lg bg-white overflow-hidden">
              <input type="number" value={markup} onChange={e => setMarkup(e.target.value)} min="0" max="200"
                className="w-14 px-2 py-1 text-sm text-center outline-none font-bold" />
              <span className="px-2 text-sm text-gray-400 bg-blue-50">%</span>
            </div>
          </div>
          <span className="font-bold text-blue-600">+${(withMarkup - subtotal).toFixed(2)}</span>
        </div>
        <div className="border-t border-blue-200 pt-3 flex items-center justify-between">
          <span className="font-bold text-gray-900">Total with markup</span>
          <span className="font-bold text-blue-600 text-xl">${withMarkup.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={copy} disabled={subtotal === 0}
        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
        style={{ background: "linear-gradient(135deg,#3B82F6,#2563EB)", color: "white" }}>
        {copied ? <><Check size={15}/>Copied!</> : <><Copy size={15}/>Copy Total (${withMarkup.toFixed(2)})</>}
      </button>
    </Modal>
  );
}

// ── 3. Job Timer ──────────────────────────────────────────────
function JobTimer({ onClose }: { onClose: () => void }) {
  const [running, setRunning]   = useState(false);
  const [elapsed, setElapsed]   = useState(0);
  const [rate, setRate]         = useState("95");
  const [sessions, setSessions] = useState<{ label: string; secs: number }[]>([]);
  const [label, setLabel]       = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startRef    = useRef<number>(0);

  const start = () => {
    startRef.current = Date.now() - elapsed * 1000;
    intervalRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    setRunning(true);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setRunning(false);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (elapsed > 0) {
      setSessions(s => [...s, { label: label || `Session ${s.length+1}`, secs: elapsed }]);
    }
    setElapsed(0); setRunning(false); setLabel("");
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const fmt = (s: number) => {
    const h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return `${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
  };

  const totalSecs = sessions.reduce((a, s) => a + s.secs, 0) + elapsed;
  const labour    = (totalSecs / 3600) * (parseFloat(rate) || 0);

  return (
    <Modal title="Job Timer" icon={Clock} color="#8B5CF6" onClose={onClose}>
      {/* Big timer display */}
      <div className="text-center mb-6">
        <div className="text-6xl font-mono font-bold text-gray-900 mb-1"
          style={{ letterSpacing: "0.05em", color: running ? "#8B5CF6" : "#111827" }}>
          {fmt(elapsed)}
        </div>
        <p className="text-xs text-gray-400">{running ? "Running…" : elapsed > 0 ? "Paused" : "Ready to start"}</p>
      </div>

      {/* Session label */}
      <input value={label} onChange={e => setLabel(e.target.value)}
        placeholder="Label this session (optional)"
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-purple-400 mb-4" />

      {/* Controls */}
      <div className="flex gap-3 mb-6">
        {!running
          ? <button onClick={start} className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#8B5CF6,#7C3AED)" }}>
              <Play size={16}/> {elapsed > 0 ? "Resume" : "Start"}
            </button>
          : <button onClick={pause} className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg,#F59E0B,#D97706)" }}>
              <Pause size={16}/> Pause
            </button>
        }
        <button onClick={stop} disabled={elapsed === 0}
          className="px-5 py-3 rounded-xl font-bold text-white flex items-center gap-2 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)" }}>
          <Square size={16}/> Log
        </button>
      </div>

      {/* Sessions list */}
      {sessions.length > 0 && (
        <div className="mb-4 space-y-2">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5">
              <span className="text-sm text-gray-600">{s.label}</span>
              <span className="text-sm font-bold text-gray-900">{fmt(s.secs)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Rate + total */}
      <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-500">Hourly rate</span>
          <div className="flex items-center border border-purple-200 rounded-lg bg-white overflow-hidden">
            <span className="px-2 text-gray-400 text-sm">$</span>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} min="0"
              className="w-16 px-2 py-1 text-sm font-bold outline-none text-center" />
            <span className="px-2 text-gray-400 text-sm">/hr</span>
          </div>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-500">Total time</span>
          <span className="font-bold text-gray-900">{fmt(totalSecs)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-purple-200 pt-3 mt-1">
          <span className="font-bold text-gray-900">Labour cost</span>
          <span className="font-bold text-purple-600 text-xl">${labour.toFixed(2)}</span>
        </div>
      </div>
    </Modal>
  );
}

// ── 4. Travel Cost Calculator ─────────────────────────────────
function TravelCalculator({ onClose }: { onClose: () => void }) {
  const [distance, setDistance] = useState("");
  const [rate, setRate]         = useState("0.88");
  const [mode, setMode]         = useState<"drive"|"flat">("drive");
  const [flat, setFlat]         = useState("");
  const [copied, setCopied]     = useState(false);

  const km     = parseFloat(distance) || 0;
  const atoAmt = km * (parseFloat(rate) || 0.88);
  const total  = mode === "drive" ? atoAmt : parseFloat(flat) || 0;
  const copy   = () => { navigator.clipboard.writeText(`$${total.toFixed(2)}`); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <Modal title="Travel Cost Calculator" icon={Car} color="#22C55E" onClose={onClose}>
      {/* Mode */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
        {(["drive","flat"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode===m?"bg-white shadow-sm text-gray-900":"text-gray-500"}`}>
            {m === "drive" ? "Per km (ATO rate)" : "Flat fee"}
          </button>
        ))}
      </div>

      {mode === "drive" ? (
        <>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Distance (km)</label>
          <div className="flex items-center border-2 border-gray-200 focus-within:border-green-400 rounded-xl px-4 py-3 mb-4 gap-2">
            <input type="number" placeholder="0" value={distance}
              onChange={e => setDistance(e.target.value)}
              className="flex-1 text-lg font-bold text-gray-900 outline-none bg-transparent" autoFocus />
            <span className="text-gray-400 font-medium">km</span>
          </div>

          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Rate per km</label>
          <div className="flex items-center border-2 border-gray-200 focus-within:border-green-400 rounded-xl px-4 py-3 mb-5 gap-2">
            <span className="text-gray-400">$</span>
            <input type="number" value={rate} onChange={e => setRate(e.target.value)} step="0.01"
              className="flex-1 font-bold text-gray-900 outline-none bg-transparent" />
            <span className="text-xs text-gray-400 bg-green-50 border border-green-200 px-2 py-1 rounded-lg font-semibold">ATO 2024</span>
          </div>

          {km > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Distance</span>
                <span className="font-bold">{km} km</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-500">Rate</span>
                <span className="font-bold">${parseFloat(rate).toFixed(2)}/km</span>
              </div>
              <div className="flex justify-between border-t border-green-200 pt-3 mt-1">
                <span className="font-bold text-gray-900">Travel allowance</span>
                <span className="font-bold text-green-600 text-xl">${atoAmt.toFixed(2)}</span>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Flat travel fee</label>
          <div className="flex items-center border-2 border-gray-200 focus-within:border-green-400 rounded-xl px-4 py-3 mb-5 gap-2">
            <span className="text-gray-400">$</span>
            <input type="number" placeholder="0.00" value={flat}
              onChange={e => setFlat(e.target.value)}
              className="flex-1 text-lg font-bold text-gray-900 outline-none bg-transparent" autoFocus />
          </div>
          {parseFloat(flat) > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4 flex justify-between">
              <span className="font-bold text-gray-900">Travel charge</span>
              <span className="font-bold text-green-600 text-xl">${parseFloat(flat).toFixed(2)}</span>
            </div>
          )}
        </>
      )}

      <button onClick={copy} disabled={total === 0}
        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40"
        style={{ background: "linear-gradient(135deg,#22C55E,#16A34A)", color: "white" }}>
        {copied ? <><Check size={15}/>Copied!</> : <><Copy size={15}/>Copy (${total.toFixed(2)})</>}
      </button>
    </Modal>
  );
}

// ── 5. Invoice Generator ──────────────────────────────────────
type InvLine = { id: number; desc: string; qty: string; rate: string };

function InvoiceGenerator({ onClose }: { onClose: () => void }) {
  const [client, setClient]       = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [jobDesc, setJobDesc]     = useState("");
  const [invoiceNo, setInvoiceNo] = useState(`INV-${Date.now().toString().slice(-5)}`);
  const [date, setDate]           = useState(new Date().toISOString().split("T")[0]);
  const [due, setDue]             = useState("");
  const [lines, setLines]         = useState<InvLine[]>([{ id: 1, desc: "Labour", qty: "1", rate: "" }]);
  const [addGST, setAddGST]       = useState(true);
  const [notes, setNotes]         = useState("Payment due within 7 days. Thank you for your business.");
  const [preview, setPreview]     = useState(false);

  const addLine    = () => setLines(l => [...l, { id: Date.now(), desc: "", qty: "1", rate: "" }]);
  const removeLine = (id: number) => setLines(l => l.filter(x => x.id !== id));
  const updateLine = (id: number, f: keyof InvLine, v: string) => setLines(l => l.map(x => x.id === id ? { ...x, [f]: v } : x));

  const subtotal = lines.reduce((s, l) => s + (parseFloat(l.qty)||0)*(parseFloat(l.rate)||0), 0);
  const gstAmt   = addGST ? subtotal * 0.1 : 0;
  const total    = subtotal + gstAmt;

  const printInvoice = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>${invoiceNo}</title>
    <style>
      body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#111;font-size:14px}
      h1{color:#F97316;margin:0}.header{display:flex;justify-content:space-between;margin-bottom:32px}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#F97316;color:white;padding:10px;text-align:left}
      td{padding:10px;border-bottom:1px solid #eee}
      .total-row td{font-weight:bold;font-size:16px;color:#F97316;border-top:2px solid #F97316}
      .notes{background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:16px;margin-top:20px}
    </style></head><body>
    <div class="header">
      <div><h1>INVOICE</h1><p style="color:#666;margin:4px 0">${invoiceNo}</p></div>
      <div style="text-align:right"><p>Date: ${date}</p>${due?`<p>Due: ${due}</p>`:""}</div>
    </div>
    <div style="margin-bottom:20px"><strong>Billed to:</strong><br/>${client||"—"}${clientEmail?`<br/>${clientEmail}`:""}</div>
    ${jobDesc?`<div style="margin-bottom:20px"><strong>Job:</strong> ${jobDesc}</div>`:""}
    <table>
      <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
      <tbody>
        ${lines.map(l=>`<tr><td>${l.desc}</td><td>${l.qty}</td><td>$${parseFloat(l.rate||"0").toFixed(2)}</td><td>$${((parseFloat(l.qty)||0)*(parseFloat(l.rate)||0)).toFixed(2)}</td></tr>`).join("")}
      </tbody>
    </table>
    <div style="text-align:right;margin-top:8px">
      <p>Subtotal: $${subtotal.toFixed(2)}</p>
      ${addGST?`<p>GST (10%): $${gstAmt.toFixed(2)}</p>`:""}
      <p style="font-size:20px;font-weight:bold;color:#F97316">Total: $${total.toFixed(2)}</p>
    </div>
    ${notes?`<div class="notes"><strong>Notes:</strong><br/>${notes}</div>`:""}
    </body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <Modal title="Invoice Generator" icon={FileText} color="#EF4444" onClose={onClose} wide>
      {/* Client details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Client Name</label>
          <input value={client} onChange={e=>setClient(e.target.value)} placeholder="John Smith"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Client Email</label>
          <input value={clientEmail} onChange={e=>setClientEmail(e.target.value)} placeholder="client@email.com" type="email"
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Invoice #</label>
          <input value={invoiceNo} onChange={e=>setInvoiceNo(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400"/>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400"/>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Job Description</label>
        <input value={jobDesc} onChange={e=>setJobDesc(e.target.value)} placeholder="e.g. Kitchen tap replacement"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400"/>
      </div>

      {/* Line items */}
      <div className="mb-2">
        <div className="grid gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1 mb-1"
          style={{ gridTemplateColumns: "1fr 70px 90px 36px" }}>
          <span>Description</span><span>Qty</span><span>Rate ($)</span><span></span>
        </div>
        <div className="space-y-2 mb-3">
          {lines.map(l => (
            <div key={l.id} className="grid gap-2" style={{ gridTemplateColumns: "1fr 70px 90px 36px" }}>
              <input value={l.desc} onChange={e=>updateLine(l.id,"desc",e.target.value)} placeholder="Description"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400"/>
              <input value={l.qty} onChange={e=>updateLine(l.id,"qty",e.target.value)} type="number" min="0"
                className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-center outline-none focus:border-red-400"/>
              <div className="flex items-center border border-gray-200 rounded-lg px-2 focus-within:border-red-400 gap-1">
                <span className="text-gray-400 text-xs">$</span>
                <input value={l.rate} onChange={e=>updateLine(l.id,"rate",e.target.value)} type="number" min="0" placeholder="0.00"
                  className="w-full text-sm outline-none bg-transparent py-2"/>
              </div>
              <button onClick={()=>removeLine(l.id)} disabled={lines.length===1}
                className="w-9 h-9 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center disabled:opacity-30">
                <Trash2 size={13} className="text-red-500"/>
              </button>
            </div>
          ))}
        </div>
        <button onClick={addLine}
          className="w-full py-2 rounded-xl border-2 border-dashed border-red-200 text-red-400 text-sm font-semibold hover:border-red-400 hover:bg-red-50 transition-all flex items-center justify-center gap-2 mb-4">
          <Plus size={14}/> Add Line Item
        </button>
      </div>

      {/* GST toggle */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={()=>setAddGST(g=>!g)}
          className={`w-10 h-6 rounded-full transition-all relative ${addGST?"bg-orange-500":"bg-gray-200"}`}>
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${addGST?"left-5":"left-1"}`}/>
        </button>
        <span className="text-sm text-gray-600 font-medium">Add GST (10%)</span>
      </div>

      {/* Totals */}
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">Subtotal</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </div>
        {addGST && <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">GST (10%)</span>
          <span className="font-bold">${gstAmt.toFixed(2)}</span>
        </div>}
        <div className="flex justify-between border-t border-red-200 pt-3 mt-1">
          <span className="font-bold text-gray-900">Total</span>
          <span className="font-bold text-red-600 text-xl">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Notes</label>
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-red-400 resize-none"/>
      </div>

      <button onClick={printInvoice}
        className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg,#EF4444,#DC2626)" }}>
        <Download size={15}/> Generate &amp; Print Invoice
      </button>
    </Modal>
  );
}

// ── Quick Tools bar (embed in dashboard) ──────────────────────
export function QuickTools() {
  const [open, setOpen] = useState<string|null>(null);

  const tools = [
    { id:"gst",      label:"GST Calc",    icon:Calculator, color:"#F97316", comp: GSTCalculator      },
    { id:"materials",label:"Materials",   icon:Package,    color:"#3B82F6", comp: MaterialCalculator  },
    { id:"timer",    label:"Job Timer",   icon:Clock,      color:"#8B5CF6", comp: JobTimer            },
    { id:"travel",   label:"Travel Cost", icon:Car,        color:"#22C55E", comp: TravelCalculator    },
    { id:"invoice",  label:"Invoice",     icon:FileText,   color:"#EF4444", comp: InvoiceGenerator    },
  ];

  const Active = tools.find(t => t.id === open)?.comp ?? null;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">🧰 Quick Tools</p>
        <div className="grid grid-cols-5 gap-3">
          {tools.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setOpen(t.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-all group">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background:`${t.color}15`, border:`1px solid ${t.color}30` }}>
                  <Icon size={18} style={{ color:t.color }}/>
                </div>
                <span className="text-xs font-semibold text-gray-500 text-center leading-tight">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {open && Active && <Active onClose={() => setOpen(null)} />}
    </>
  );
}
