"use client";
import { useState, useEffect } from "react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";
import { Bell, Wifi, WifiOff, Shield, FileText, ChevronRight, CheckCircle } from "lucide-react";

type NotificationSettings = {
  newJobLead: boolean;
  quoteAccepted: boolean;
  newMessage: boolean;
  bookingReminder: boolean;
  emailNotifications: boolean;
};

export default function TradieSettingsPage() {
  const [available, setAvailable] = useState(true);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    newJobLead: true,
    quoteAccepted: true,
    newMessage: true,
    bookingReminder: true,
    emailNotifications: true,
  });

  const handleToggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      style={{
        width: "48px", height: "26px",
        borderRadius: "13px",
        background: value ? "#F97316" : "#D1D5DB",
        border: "none", cursor: "pointer",
        position: "relative", transition: "background 0.2s",
        flexShrink: 0,
      }}
    >
      <div style={{
        width: "20px", height: "20px", borderRadius: "50%",
        background: "white",
        position: "absolute", top: "3px",
        left: value ? "25px" : "3px",
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }}/>
    </button>
  );

  const SettingRow = ({ label, description, value, onChange }: {
    label: string; description: string; value: boolean; onChange: () => void;
  }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <Toggle value={value} onChange={onChange}/>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <TradieSidebar/>
      <div className="flex-1 flex flex-col">
        <TradieTopbar/>
        <main className="flex-1 p-6 lg:p-8 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your preferences and account settings</p>
          </div>

          {/* Saved message */}
          {saved && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6">
              <CheckCircle size={16}/>
              Settings saved successfully
            </div>
          )}

          {/* Availability */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              {available
                ? <Wifi size={20} className="text-green-500"/>
                : <WifiOff size={20} className="text-gray-400"/>}
              <h2 className="font-bold text-gray-900">Availability</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {available ? "Available for Jobs" : "Not Available"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {available
                    ? "You are visible to homeowners and receiving job leads"
                    : "You are hidden from homeowners and not receiving job leads"}
                </p>
              </div>
              <Toggle value={available} onChange={() => setAvailable(a => !a)}/>
            </div>
            {!available && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <p className="text-xs text-amber-700 font-medium">
                  ⚠️ Holiday mode is on. You won&apos;t receive any new job leads until you turn availability back on.
                </p>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Bell size={20} className="text-orange-500"/>
              <h2 className="font-bold text-gray-900">Notification Preferences</h2>
            </div>
            <p className="text-xs text-gray-500 mb-4">Choose which notifications you want to receive</p>
            <SettingRow
              label="New Job Leads"
              description="Get notified when a new job matching your trade is posted"
              value={notifications.newJobLead}
              onChange={() => handleToggleNotification("newJobLead")}
            />
            <SettingRow
              label="Quote Accepted"
              description="Get notified when a homeowner accepts your quote"
              value={notifications.quoteAccepted}
              onChange={() => handleToggleNotification("quoteAccepted")}
            />
            <SettingRow
              label="New Messages"
              description="Get notified when a homeowner sends you a message"
              value={notifications.newMessage}
              onChange={() => handleToggleNotification("newMessage")}
            />
            <SettingRow
              label="Booking Reminders"
              description="Get reminded about upcoming bookings 24 hours before"
              value={notifications.bookingReminder}
              onChange={() => handleToggleNotification("bookingReminder")}
            />
            <SettingRow
              label="Email Notifications"
              description="Receive notifications via email in addition to in-app"
              value={notifications.emailNotifications}
              onChange={() => handleToggleNotification("emailNotifications")}
            />
          </div>

          {/* Legal */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-blue-500"/>
              <h2 className="font-bold text-gray-900">Privacy & Legal</h2>
            </div>
            {[
              { label: "Terms of Service", href: "/terms", icon: FileText },
              { label: "Privacy Policy", href: "/privacy", icon: Shield },
              { label: "Cookie Policy", href: "/cookies", icon: FileText },
            ].map(item => (
              <a key={item.label} href={item.href}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <item.icon size={16} className="text-gray-400"/>
                  <span className="text-sm font-medium text-gray-700">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400"/>
              </a>
            ))}
          </div>

          {/* Save button */}
          <button onClick={handleSave}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
            Save Settings
          </button>
        </main>
      </div>
    </div>
  );
}
