"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const data = [
  { label: "May 1",  value: 200 },
  { label: "May 4",  value: 400 },
  { label: "May 7",  value: 300 },
  { label: "May 10", value: 700 },
  { label: "May 13", value: 500 },
  { label: "May 16", value: 900 },
  { label: "May 19", value: 750 },
  { label: "May 22", value: 1100 },
  { label: "May 25", value: 1800 },
  { label: "May 28", value: 2200 },
  { label: "May 29", value: 2850 },
];

export function EarningsChart() {
  const [period, setPeriod] = useState("This Month");

  const W = 580;
  const H = 120;
  const pad = { top: 10, right: 10, bottom: 10, left: 10 };
  const maxVal = Math.max(...data.map((d) => d.value));

  const pts = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * (W - pad.left - pad.right),
    y: pad.top + (1 - d.value / maxVal) * (H - pad.top - pad.bottom),
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;

  const yLabels = ["$3k", "$2k", "$1k", "$0"];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">Earnings Overview</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">$2,850</p>
          <p className="text-xs text-gray-500 mt-0.5">Total Earnings</p>
          <p className="text-xs text-green-600 font-semibold mt-1">↑ 18% from last month</p>
        </div>
        <button className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-gray-300">
          {period}
          <ChevronDown size={14} />
        </button>
      </div>

      {/* Chart */}
      <div className="flex gap-2">
        {/* Y axis labels */}
        <div className="flex flex-col justify-between text-xs text-gray-400 pr-1 py-1" style={{ height: 130 }}>
          {yLabels.map((l) => <span key={l}>{l}</span>)}
        </div>

        <div className="flex-1">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 130 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0, 0.33, 0.66, 1].map((t, i) => (
              <line
                key={i}
                x1={pad.left}
                x2={W - pad.right}
                y1={pad.top + t * (H - pad.top - pad.bottom)}
                y2={pad.top + t * (H - pad.top - pad.bottom)}
                stroke="#f1f5f9"
                strokeWidth="1"
              />
            ))}
            {/* Area fill */}
            <path d={areaPath} fill="url(#areaGrad)" />
            {/* Line */}
            <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Last dot */}
            <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y} r="4" fill="#3b82f6" />
          </svg>

          {/* X labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-1 px-1">
            {["May 1", "May 8", "May 15", "May 22", "May 29"].map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
