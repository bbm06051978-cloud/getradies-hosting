"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, User, Mail, Phone, MapPin, Lock,
  CheckCircle, Edit3, Save, X, Calendar, Briefcase,
  Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

const australianStates = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  createdAt: string;
  role: string;
  _count: { jobs: number };
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    suburb: "",
    state: "",
    postcode: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setForm({
            name: d.user.name || "",
            phone: d.user.phone || "",
            suburb: d.user.suburb || "",
            state: d.user.state || "",
            postcode: d.user.postcode || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save."); return; }
      setUser((prev) => prev ? { ...prev, ...form } : prev);
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword) { setError("Current password is required."); return; }
    if (passwordForm.newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError("Passwords do not match."); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...passwordForm }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update password."); return; }
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordSection(false);
      setSuccess("Password updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        suburb: user.suburb || "",
        state: user.state || "",
        postcode: user.postcode || "",
      });
    }
    setEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <div className="p-8 flex-1 max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage your personal information</p>
            </div>
          </div>

          {/* Success message */}
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
              <CheckCircle size={16} />
              {success}
            </motion.div>
          )}

          {/* Error message */}
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </motion.div>
          )}

          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">

            {/* Avatar banner */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 h-24 relative">
              <div className="absolute -bottom-10 left-6">
                <div className="w-20 h-20 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-blue-900 font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-14 px-6 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      Homeowner
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <ShieldCheck size={12} className="text-green-500" />
                      Verified Account
                    </span>
                  </div>
                </div>

                {!editing ? (
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    <Edit3 size={15} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleCancel}
                      className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:border-gray-300">
                      <X size={15} />Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                      <Save size={15} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Briefcase size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-blue-900">{user?._count?.jobs || 0}</p>
                    <p className="text-xs text-gray-500 font-medium">Jobs Posted</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" }) : "-"}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">Member Since</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <User size={18} className="text-blue-600" />
              Personal Information
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <User size={16} className="text-gray-400" />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="Full name" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.name || "—"}</span>
                  </div>
                )}
              </div>

              {/* Email - never editable */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700 font-medium">{user?.email}</span>
                  <span className="ml-auto text-xs text-gray-400 italic">Cannot be changed</span>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <Phone size={16} className="text-gray-400" />
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="e.g. 0412 345 678" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.phone || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" />
              Address
            </h3>

            <div className="space-y-4">
              {/* Suburb */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Suburb</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <MapPin size={16} className="text-gray-400" />
                    <input type="text" value={form.suburb} onChange={e => setForm({ ...form, suburb: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="e.g. Bondi" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.suburb || "Not provided"}</span>
                  </div>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                {editing ? (
                  <div className="grid grid-cols-4 gap-2">
                    {australianStates.map((s) => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, state: s })}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                          form.state === s ? "bg-blue-900 text-white border-blue-900" : "border-gray-200 text-gray-600 hover:border-blue-300"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.state || "Not provided"}</span>
                  </div>
                )}
              </div>

              {/* Postcode */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Postcode</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <MapPin size={16} className="text-gray-400" />
                    <input type="text" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="e.g. 2026" maxLength={4} />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.postcode || "Not provided"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Lock size={18} className="text-blue-600" />
                Password & Security
              </h3>
              {!showPasswordSection && (
                <button onClick={() => setShowPasswordSection(true)}
                  className="flex items-center gap-2 border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                  <Lock size={15} />
                  Change Password
                </button>
              )}
            </div>

            {!showPasswordSection ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Lock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">••••••••••••</span>
                <span className="ml-auto text-xs text-gray-400">Last changed: unknown</span>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Current Password</label>
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <Lock size={16} className="text-gray-400" />
                    <input type={showCurrent ? "text" : "password"} value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="Enter current password" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-gray-400 hover:text-gray-600">
                      {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">New Password</label>
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <Lock size={16} className="text-gray-400" />
                    <input type={showNew ? "text" : "password"} value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="Min 8 characters" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="text-gray-400 hover:text-gray-600">
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Confirm New Password</label>
                  <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <Lock size={16} className="text-gray-400" />
                    <input type={showConfirm ? "text" : "password"} value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="Repeat new password" />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-600">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => { setShowPasswordSection(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setError(""); }}
                    className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">
                    <X size={15} />Cancel
                  </button>
                  <button onClick={handlePasswordChange} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white py-2.5 rounded-xl font-bold text-sm transition-colors">
                    <ShieldCheck size={15} />
                    {saving ? "Updating..." : "Update Password"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
