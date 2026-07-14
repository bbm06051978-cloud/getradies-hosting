"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star, MapPin, ShieldCheck, Briefcase, Calendar,
  ArrowLeft, MessageSquare, CheckCircle, Award,
  User, Camera,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

type Review = {
  id: string; rating: number; comment: string | null;
  createdAt: string; homeowner: string; jobTitle: string;
};

type Profile = {
  id: string; businessName: string; specialty: string;
  bio: string | null; suburb: string | null; state: string | null;
  rating: number; totalReviews: number; isVerified: boolean;
  profilePhoto: string | null; memberSince: string;
  completedJobs: number;
  photos: { id: string; url: string; caption: string | null }[];
  reviews: Review[];
};

export default function TradiePublicProfilePage() {
  const params  = useParams();
  const tradieId = Array.isArray(params.tradieId) ? params.tradieId[0] : params.tradieId;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tradieId) return;
    fetch(`/api/tradie/${tradieId}`)
      .then(r => r.json())
      .then(d => { if (d.profile) setProfile(d.profile); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tradieId]);

  const renderStars = (rating: number, size = 16) => (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size}
          className={s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}/>
      ))}
    </div>
  );

  if (loading) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar/>
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
        </div>
      </main>
    </div>
  );

  if (!profile) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar/>
        <div className="p-8 text-center">
          <p className="text-gray-500">Tradie profile not found.</p>
          <Link href="/dashboard" className="text-orange-500 font-semibold mt-4 inline-block">← Back to Dashboard</Link>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar/>
        <div className="p-8 max-w-4xl mx-auto w-full">

          {/* Back */}
          <button onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 text-sm">
            <ArrowLeft size={16}/> Back
          </button>

          {/* Profile header card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-orange-100">
                {profile.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={profile.businessName} className="w-full h-full object-cover"/>
                ) : (
                  <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white font-bold text-3xl">{profile.businessName.charAt(0)}</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">{profile.businessName}</h1>
                      {profile.isVerified && (
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          <ShieldCheck size={11}/> Verified
                        </div>
                      )}
                    </div>
                    <p className="text-orange-500 font-semibold mb-2">{profile.specialty}</p>
                    <div className="flex items-center gap-3 flex-wrap text-sm text-gray-500">
                      {profile.suburb && (
                        <span className="flex items-center gap-1">
                          <MapPin size={13}/>{profile.suburb}{profile.state ? `, ${profile.state}` : ""}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar size={13}/>Member since {new Date(profile.memberSince).toLocaleDateString("en-AU", { month:"long", year:"numeric" })}
                      </span>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-2">
                    <Link href={`/post-job?trade=${encodeURIComponent(profile.specialty)}`}>
                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors">
                        Hire This Tradie
                      </button>
                    </Link>
                    <Link href={`/chats?receiverId=${profile.id}&receiverName=${encodeURIComponent(profile.businessName)}`}>
                      <button className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-orange-300 text-gray-600 px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors">
                        <MessageSquare size={14}/> Message
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-4">
                  {renderStars(profile.rating)}
                  <span className="font-bold text-gray-900">{profile.rating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({profile.totalReviews} review{profile.totalReviews !== 1 ? "s" : ""})</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              {[
                { icon: CheckCircle, label: "Jobs Completed", value: profile.completedJobs, color: "text-green-600" },
                { icon: Star,        label: "Average Rating",  value: profile.rating.toFixed(1), color: "text-yellow-500" },
                { icon: Award,       label: "Total Reviews",   value: profile.totalReviews, color: "text-blue-600" },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <s.icon size={20} className={`${s.color} mx-auto mb-1`}/>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User size={16} className="text-orange-500"/> About
              </h2>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Photos */}
          {profile.photos.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera size={16} className="text-orange-500"/> Work Photos
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {profile.photos.map(p => (
                  <div key={p.id} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img src={p.url} alt={p.caption || "Work photo"} className="w-full h-full object-cover"/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Star size={16} className="text-orange-500"/> Reviews ({profile.totalReviews})
            </h2>
            {profile.reviews.length === 0 ? (
              <div className="text-center py-8">
                <Star size={32} className="text-gray-200 mx-auto mb-2"/>
                <p className="text-gray-400 text-sm">No reviews yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {profile.reviews.map(r => (
                  <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold text-sm">{r.homeowner.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{r.homeowner}</p>
                          <p className="text-xs text-gray-400">{r.jobTitle}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {renderStars(r.rating, 13)}
                        <span className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString("en-AU", { day:"numeric", month:"short", year:"numeric" })}
                        </span>
                      </div>
                    </div>
                    {r.comment && (
                      <p className="text-sm text-gray-600 leading-relaxed ml-12">{r.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
