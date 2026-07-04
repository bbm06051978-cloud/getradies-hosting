"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Briefcase, MapPin, Calendar,
  Zap, Clock, User,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

type Job = {
  id: string; title: string; description: string; trade: string;
  suburb: string; state: string; postcode: string | null;
  status: string; aiEstimate: string | null; createdAt: string;
  user: { name: string; suburb: string | null; state: string | null };
};

export default function JobDetailPage() {
  const params = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/jobs/${params.id}`)
      .then(r => r.json())
      .then(d => { if (d.job) setJob(d.job); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="p-8 flex-1 max-w-3xl mx-auto w-full">

          <div className="flex items-center gap-4 mb-8">
            <Link href="/tradie-jobs" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
              <p className="text-gray-500 text-sm mt-0.5">Review the job before sending a quote</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : !job ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <p className="text-gray-400">Job not found.</p>
            </div>
          ) : (
            <div className="space-y-4">

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Briefcase size={24} className="text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                    <div className="flex items-center gap-2 flex-wrap mt-2">
                      <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">{job.trade}</span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        job.status === "OPEN" ? "bg-green-100 text-green-700" :
                        job.status === "QUOTED" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{job.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Job Description</h3>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Location</p>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-800">{job.suburb}, {job.state} {job.postcode}</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Posted</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      {new Date(job.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Posted By</p>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-800">{job.user?.name || "Homeowner"}</span>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Time Posted</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-orange-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      {new Date(job.createdAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>

              {job.aiEstimate && (
                <div className="bg-blue-50 rounded-2xl p-5 shadow-sm border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} className="text-blue-600 fill-blue-600" />
                    <h3 className="font-bold text-blue-900">AI Price Estimate</h3>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {job.aiEstimate.split("\n").filter(l => !l.startsWith("🔧")).join("\n")}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Link href={`/quotes?jobId=${job.id}`} className="flex-1">
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-md">
                    Send Quote for This Job
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}