"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { tradeGuides } from "./data";
import { Search, ChevronRight, TrendingUp, X } from "lucide-react";

export default function CostGuidesPage() {
  const [search, setSearch] = useState("");

  const filtered = tradeGuides.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.jobs.some(j => j.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-blue-800 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-widest">
            2024 Australian Pricing Guide
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            How Much Do {" "}
          <span className="text-orange-400">Before</span>{" "}
            Tradies Cost in Australia?
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Real price ranges based on thousands of Australian jobs. Know what to expect before hiring any tradie.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto flex items-center bg-white rounded-2xl px-4 py-3 gap-3 shadow-xl">
            <Search size={20} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search e.g. blocked drain, house clean, paint room..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm text-gray-700 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-6 flex-wrap">
            {["✓ 80% accuracy", "✓ Updated 2024", "✓ All Australian states", "✓ Free AI estimates"].map(b => (
              <span key={b} className="text-blue-200 text-sm font-medium">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Trade cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Search results label */}
          {search && (
            <div className="mb-6 flex items-center gap-3">
              <p className="text-gray-500 text-sm">
                {filtered.length === 0
                  ? `No results for "${search}"`
                  : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`}
              </p>
              <button onClick={() => setSearch("")}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline">
                Clear search
              </button>
            </div>
          )}

          {!search && (
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp size={20} className="text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Browse by Trade</h2>
            </div>
          )}

          {/* No results */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search size={48} className="text-gray-200 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 text-lg mb-2">No trade guides found</h3>
              <p className="text-gray-400 text-sm mb-4">
                Try searching for a trade like "plumbing" or a job like "leaking tap"
              </p>
              <button onClick={() => setSearch("")}
                className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                View All Cost Guides
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((trade) => (
                <Link key={trade.slug} href={`/cost-guides/${trade.slug}`}>
                  <div className={`${trade.bgColor} rounded-2xl p-6 border-2 border-transparent hover:border-blue-300 transition-all cursor-pointer group h-full`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{trade.emoji}</span>
                      <ChevronRight size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{trade.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{trade.description}</p>

                    {/* Show matching jobs if searching */}
                    {search && (
                      <div className="mb-4 space-y-1">
                        {trade.jobs
                          .filter(j => j.name.toLowerCase().includes(search.toLowerCase()))
                          .slice(0, 3)
                          .map(j => (
                            <div key={j.name} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-1.5">
                              <span className="text-xs font-medium text-gray-700">{j.name}</span>
                              <span className={`text-xs font-bold ${trade.color}`}>${j.min}–${j.max}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400 font-medium">Typical cost</p>
                        <p className={`text-lg font-bold ${trade.color}`}>
                          ${trade.avgMin.toLocaleString()} – ${trade.avgMax.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 font-medium">Hourly rate</p>
                        <p className="text-sm font-bold text-gray-700">
                          ${trade.hourlyMin}–${trade.hourlyMax}/hr
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Estimate CTA */}
      <section className="bg-blue-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Your Instant AI Estimate
          </h2>
          <p className="text-blue-200 mb-8">
            Tell us your job and get a personalised price estimate based on your location — free and instant.
          </p>
          <Link href="/">
            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg">
              Get a Free AI Estimate →
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}