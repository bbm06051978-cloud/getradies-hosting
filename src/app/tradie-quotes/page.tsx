"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, CheckCircle, Clock, XCircle, MapPin } from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type Quote = {
  id: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
    trade: string;
    suburb: string;
    state: string;
    user: { name: string; phone: string };
  };
};

export default function TradieQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/quotes")
      .then((res) => res.json())
      .then((data) => {
        if (data.quotes) setQuotes(data.quotes);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return { bg: "bg-green-100 text-green-700", icon: CheckCircle, label: "Accepted" };
      case "REJECTED":
        return { bg: "bg-red-100 text-red-700", icon: XCircle, label: "Rejected" };
      default:
        return { bg: "bg-orange-100 text-orange-700", icon: Clock, label: "Pending" };
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />

        <div className="p-8 flex-1">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard-tradie" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Quotes</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Track all quotes you have sent to homeowners
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Total Sent", value: quotes.length, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Accepted", value: quotes.filter(q => q.status === "ACCEPTED").length, color: "text-green-600", bg: "bg-green-50" },
              { label: "Pending", value: quotes.filter(q => q.status === "PENDING").length, color: "text-orange-600", bg: "bg-orange-50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quotes list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : quotes.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <Briefcase size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 text-lg mb-2">No quotes sent yet</h3>
              <p className="text-gray-400 text-sm">
                Go to job leads and send your first quote
              </p>
              <Link href="/dashboard-tradie">
                <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                  View Job Leads
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => {
                const statusStyle = getStatusStyle(quote.status);
                const StatusIcon = statusStyle.icon;
                return (
                  <div
                    key={quote.id}
                    className={`bg-white rounded-2xl p-5 shadow-sm border-2 transition-all ${
                      quote.status === "ACCEPTED" ? "border-green-200" : "border-gray-100"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Job info */}
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Briefcase size={18} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{quote.job?.title}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                              {quote.job?.trade}
                            </span>
                            <MapPin size={11} />
                            {quote.job?.suburb}, {quote.job?.state}
                          </div>
                          <div className="mt-1 space-y-0.5">
                            <p className="text-xs text-gray-500 font-medium">
                              👤 {quote.job?.user?.name || "Homeowner"}
                            </p>
                            {quote.status === "ACCEPTED" && quote.job?.user?.phone && (
                              <p className="text-xs text-green-600 font-bold">
                                📞 {quote.job.user.phone}
                              </p>
                            )}
                            {quote.status === "ACCEPTED" && !quote.job?.user?.phone && (
                              <p className="text-xs text-green-600 font-semibold">
                                ✅ Accepted — contact via messages
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <span className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle.bg}`}>
                        <StatusIcon size={13} />
                        {statusStyle.label}
                      </span>
                    </div>

                    {/* Quote details */}
                    <div className="mt-4 flex items-center gap-6 flex-wrap">
                      <div className="bg-blue-50 rounded-xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xl font-bold text-blue-900">
                          ${quote.amount.toLocaleString()}
                        </span>
                        <span className="text-sm text-blue-600">AUD</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed flex-1">
                        {quote.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-400">
                        Sent {new Date(quote.createdAt).toLocaleDateString("en-AU", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      {quote.status === "ACCEPTED" && (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
                          <CheckCircle size={14} />
                          Homeowner accepted — follow up now!
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}