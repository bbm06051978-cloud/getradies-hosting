"use client";

import { useState, useEffect } from "react";
import { Bell, ChevronDown, MapPin, Star } from "lucide-react";

type TradieUser = {
  name: string;
  email: string;
  tradieProfile: {
    businessName: string;
    specialty: string;
    rating: number;
    totalReviews: number;
    profilePhoto: string | null;
  } | null;
};

export function TradieTopbar() {
  const [user, setUser] = useState<TradieUser | null>(null);

  useEffect(() => {
    fetch("/api/tradie/profile")
      .then(r => r.json())
      .then(d => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  const profilePhoto = user?.tradieProfile?.profilePhoto;
  const initial = user?.tradieProfile?.businessName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || "T";

  return (
    <div className="bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between sticky top-0 z-10">
      {/* Location */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-300 transition-colors">
        <MapPin size={15} className="text-yellow-500" />
        <span className="text-sm font-medium text-gray-700">Sydney, NSW</span>
        <ChevronDown size={15} className="text-gray-400" />
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Online status */}
        <button className="flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
          Go Offline
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-50 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            0
          </span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2 hover:border-orange-300 transition-colors cursor-pointer">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-200">
            {profilePhoto ? (
              <img src={profilePhoto} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{initial}</span>
              </div>
            )}
          </div>

          {/* Name + role + rating */}
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">
              {user?.tradieProfile?.businessName || user?.name || "Tradie"}
            </p>
            <p className="text-xs text-gray-400 leading-tight">
              {user?.tradieProfile?.specialty || "Tradie"}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} className="text-yellow-400 fill-yellow-400" />
              <span className="text-xs text-gray-500">
                {user?.tradieProfile?.rating?.toFixed(1) || "0.0"} ({user?.tradieProfile?.totalReviews || 0} reviews)
              </span>
            </div>
          </div>

          <ChevronDown size={14} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
