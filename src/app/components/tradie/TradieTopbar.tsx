"use client";

import { Bell, ChevronDown, MapPin } from "lucide-react";

export function TradieTopbar() {
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
      </div>
    </div>
  );
}