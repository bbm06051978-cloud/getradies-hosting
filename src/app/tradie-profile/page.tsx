"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft, User, Mail, Phone, MapPin, Lock,
  CheckCircle, Edit3, Save, X, Calendar, Briefcase,
  Eye, EyeOff, ShieldCheck, Star, FileText, Building,
  Camera, Trash2,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

const australianStates = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const specialties = ["Plumbing", "Electrical", "Cleaning", "Painting", "Handyman", "Carpentry", "Removalists"];

type TradieProfile = {
  id: string; businessName: string; specialty: string;
  licenseNumber: string | null; isVerified: boolean;
  rating: number; totalReviews: number; bio: string | null;
  suburb: string | null; state: string | null; profilePhoto: string | null;
  _count: { quotes: number; bookings: number };
};

type UserData = {
  id: string; name: string; email: string; phone: string | null;
  suburb: string | null; state: string | null; postcode: string | null;
  createdAt: string; tradieProfile: TradieProfile | null;
};

export default function TradieProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "", phone: "", suburb: "", state: "", postcode: "",
    businessName: "", specialty: "", licenseNumber: "", bio: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });

  useEffect(() => {
    fetch("/api/tradie/profile")
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setUser(d.user);
          setForm({
            name: d.user.name || "",
            phone: d.user.phone || "",
            suburb: d.user.tradieProfile?.suburb || d.user.suburb || "",
            state: d.user.tradieProfile?.state || d.user.state || "",
            postcode: d.user.postcode || "",
            businessName: d.user.tradieProfile?.businessName || "",
            specialty: d.user.tradieProfile?.specialty || "",
            licenseNumber: d.user.tradieProfile?.licenseNumber || "",
            bio: d.user.tradieProfile?.bio || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (file.size > 500000) { setError("Image must be under 500KB. Try compressing it first."); return; }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setUploadingPhoto(true);
      setError("");
      try {
        const res = await fetch("/api/tradie/photo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photo: base64 }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Failed to upload."); return; }
        setUser(prev => prev ? {
          ...prev,
          tradieProfile: prev.tradieProfile ? { ...prev.tradieProfile, profilePhoto: base64 } : prev.tradieProfile,
        } : prev);
        setSuccess("Profile photo updated!");
        setTimeout(() => setSuccess(""), 3000);
      } catch { setError("Something went wrong."); }
      finally { setUploadingPhoto(false); }
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = async () => {
    if (!confirm("Remove your profile photo?")) return;
    setDeletingPhoto(true);
    setError("");
    try {
      const res = await fetch("/api/tradie/photo", { method: "DELETE" });
      if (res.ok) {
        setUser(prev => prev ? {
          ...prev,
          tradieProfile: prev.tradieProfile ? { ...prev.tradieProfile, profilePhoto: null } : prev.tradieProfile,
        } : prev);
        setSuccess("Profile photo removed.");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch { setError("Failed to delete photo."); }
    finally { setDeletingPhoto(false); }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.businessName.trim()) { setError("Name and business name are required."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/tradie/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save."); return; }
      setUser(prev => prev ? {
        ...prev, name: form.name, phone: form.phone,
        suburb: form.suburb, state: form.state, postcode: form.postcode,
        tradieProfile: prev.tradieProfile ? {
          ...prev.tradieProfile,
          businessName: form.businessName, specialty: form.specialty,
          licenseNumber: form.licenseNumber, bio: form.bio,
          suburb: form.suburb, state: form.state,
        } : prev.tradieProfile,
      } : prev);
      setEditing(false);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Something went wrong."); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword) { setError("Current password is required."); return; }
    if (passwordForm.newPassword.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setError("Passwords do not match."); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/tradie/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...passwordForm }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to update password."); return; }
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordSection(false);
      setSuccess("Password updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch { setError("Something went wrong."); }
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name || "", phone: user.phone || "",
        suburb: user.tradieProfile?.suburb || user.suburb || "",
        state: user.tradieProfile?.state || user.state || "",
        postcode: user.postcode || "",
        businessName: user.tradieProfile?.businessName || "",
        specialty: user.tradieProfile?.specialty || "",
        licenseNumber: user.tradieProfile?.licenseNumber || "",
        bio: user.tradieProfile?.bio || "",
      });
    }
    setEditing(false); setError("");
  };

  const currentPhoto = user?.tradieProfile?.profilePhoto;
  const displayInitial = user?.tradieProfile?.businessName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || "T";

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <TradieSidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <TradieTopbar />
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
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
      <TradieSidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar />
        <div className="p-8 flex-1 max-w-3xl mx-auto w-full">

          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard-tradie" className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-500 text-sm mt-0.5">Manage your business and personal information</p>
            </div>
          </div>

          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6 flex items-center gap-2">
              <CheckCircle size={16} />{success}
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </motion.div>
          )}

          {/* Profile card with photo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-orange-400 h-24 relative" />

            <div className="px-6 pb-6">
              {/* Avatar with photo upload */}
              <div className="flex items-end justify-between -mt-10 mb-4">
                <div className="relative group">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  {/* Avatar circle */}
                  <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-orange-100 flex items-center justify-center relative">
                    {currentPhoto ? (
                      <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-orange-500 font-bold text-2xl">{displayInitial}</span>
                    )}

                    {/* Upload overlay on hover */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      {uploadingPhoto ? (
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                      ) : (
                        <Camera size={18} className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Photo action buttons */}
                  <div className="flex gap-1.5 mt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Camera size={11} />
                      {uploadingPhoto ? "Uploading..." : currentPhoto ? "Change" : "Upload"}
                    </button>
                    {currentPhoto && (
                      <button
                        onClick={handleDeletePhoto}
                        disabled={deletingPhoto}
                        className="flex items-center gap-1 bg-red-100 hover:bg-red-200 disabled:bg-red-50 text-red-600 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Trash2 size={11} />
                        {deletingPhoto ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Max 500KB · JPG or PNG</p>
                </div>

                {/* Edit/Save buttons */}
                {!editing ? (
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-2 border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    <Edit3 size={15} />Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleCancel}
                      className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm font-semibold">
                      <X size={15} />Cancel
                    </button>
                    <button onClick={handleSave} disabled={saving}
                      className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                      <Save size={15} />{saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                )}
              </div>

              {/* Name and badges */}
              <h2 className="text-xl font-bold text-gray-900">{user?.tradieProfile?.businessName || user?.name}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                  {user?.tradieProfile?.specialty || "Tradie"}
                </span>
                {user?.tradieProfile?.isVerified && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                    <ShieldCheck size={12} />Verified
                  </span>
                )}
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">
                    {user?.tradieProfile?.rating?.toFixed(1) || "0.0"} ({user?.tradieProfile?.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {[
                  { label: "Quotes Sent", value: user?.tradieProfile?._count?.quotes || 0, color: "text-orange-500", bg: "bg-orange-50" },
                  { label: "Bookings", value: user?.tradieProfile?._count?.bookings || 0, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Reviews", value: user?.tradieProfile?.totalReviews || 0, color: "text-green-600", bg: "bg-green-50" },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Business Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Building size={18} className="text-orange-500" />
              Business Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Business Name</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <Building size={16} className="text-gray-400" />
                    <input type="text" value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="Your business name" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <Building size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.tradieProfile?.businessName || "—"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Trade Specialty</label>
                {editing ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {specialties.map(s => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, specialty: s })}
                        className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                          form.specialty === s ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <Briefcase size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.tradieProfile?.specialty || "—"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">License Number</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <FileText size={16} className="text-gray-400" />
                    <input type="text" value={form.licenseNumber} onChange={e => setForm({ ...form, licenseNumber: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="e.g. PLB123456" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <FileText size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.tradieProfile?.licenseNumber || "Not provided"}</span>
                    {user?.tradieProfile?.isVerified && <ShieldCheck size={14} className="text-green-500 ml-auto" />}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Business Bio</label>
                {editing ? (
                  <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                    rows={4} placeholder="Describe your experience and skills..."
                    className="w-full border border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors resize-none" />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-700 leading-relaxed">{user?.tradieProfile?.bio || "No bio added yet."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <User size={18} className="text-orange-500" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Full Name</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <User size={16} className="text-gray-400" />
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.name || "—"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Email Address</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700 font-medium">{user?.email}</span>
                  <span className="ml-auto text-xs text-gray-400 italic">Cannot be changed</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Phone Number</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
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

          {/* Service Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <MapPin size={18} className="text-orange-500" />
              Service Area
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Suburb</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <MapPin size={16} className="text-gray-400" />
                    <input type="text" value={form.suburb} onChange={e => setForm({ ...form, suburb: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="e.g. Parramatta" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.tradieProfile?.suburb || user?.suburb || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">State</label>
                {editing ? (
                  <div className="grid grid-cols-4 gap-2">
                    {australianStates.map(s => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, state: s })}
                        className={`py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                          form.state === s ? "bg-orange-500 text-white border-orange-500" : "border-gray-200 text-gray-600 hover:border-orange-300"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <MapPin size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700 font-medium">{user?.tradieProfile?.state || user?.state || "Not provided"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Postcode</label>
                {editing ? (
                  <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                    <MapPin size={16} className="text-gray-400" />
                    <input type="text" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })}
                      className="flex-1 text-sm text-gray-700 outline-none bg-transparent" placeholder="e.g. 2150" maxLength={4} />
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

          {/* Member since */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Calendar size={18} className="text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Member Since</p>
                <p className="text-sm font-bold text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Lock size={18} className="text-orange-500" />
                Password & Security
              </h3>
              {!showPasswordSection && (
                <button onClick={() => setShowPasswordSection(true)}
                  className="flex items-center gap-2 border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                  <Lock size={15} />Change Password
                </button>
              )}
            </div>

            {!showPasswordSection ? (
              <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Lock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">••••••••••••</span>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { label: "Current Password", key: "currentPassword", show: showCurrent, setShow: setShowCurrent },
                  { label: "New Password", key: "newPassword", show: showNew, setShow: setShowNew },
                  { label: "Confirm New Password", key: "confirmPassword", show: showConfirm, setShow: setShowConfirm },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">{f.label}</label>
                    <div className="flex items-center border border-gray-200 focus-within:border-orange-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                      <Lock size={16} className="text-gray-400" />
                      <input type={f.show ? "text" : "password"}
                        value={passwordForm[f.key as keyof typeof passwordForm]}
                        onChange={e => setPasswordForm({ ...passwordForm, [f.key]: e.target.value })}
                        className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                        placeholder={f.key === "newPassword" ? "Min 8 characters" : "Enter password"} />
                      <button type="button" onClick={() => f.setShow(!f.show)} className="text-gray-400 hover:text-gray-600">
                        {f.show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <button onClick={() => { setShowPasswordSection(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); setError(""); }}
                    className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-4 py-2.5 rounded-xl text-sm font-semibold">
                    <X size={15} />Cancel
                  </button>
                  <button onClick={handlePasswordChange} disabled={saving}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-2.5 rounded-xl font-bold text-sm transition-colors">
                    <ShieldCheck size={15} />{saving ? "Updating..." : "Update Password"}
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
