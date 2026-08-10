"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, User, Mail, Phone, Lock, MapPin, CheckCircle, XCircle } from "lucide-react";
import { motion } from "motion/react";

function validate(field: string, value: string) {
  switch (field) {
    case "name":
      if (!value) return "Name is required";
      if (!/^[a-zA-Z\s]+$/.test(value)) return "Name must contain only letters";
      if (value.length < 2) return "Name must be at least 2 characters";
      return "";
    case "email":
      if (!value) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
      return "";
    case "phone":
      if (!value) return "Phone number is required";
      if (!/^[0-9]{10}$/.test(value.replace(/\s/g, ""))) return "Phone must be 10 digits";
      return "";
    case "password":
      if (!value) return "Password is required";
      if (value.length < 8) return "Password must be at least 8 characters";
      if (!/[A-Za-z]/.test(value)) return "Password must contain at least one letter";
      if (!/[0-9]/.test(value)) return "Password must contain at least one number";
      return "";
    case "suburb":
      if (!value) return "Suburb is required";
      return "";
    default:
      return "";
  }
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters",    pass: password.length >= 8 },
    { label: "Contains letter",  pass: /[A-Za-z]/.test(password) },
    { label: "Contains number",  pass: /[0-9]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-1">
      {checks.map(c => (
        <div key={c.label} className="flex items-center gap-2">
          {c.pass
            ? <CheckCircle size={12} className="text-green-500"/>
            : <XCircle size={12} className="text-red-400"/>}
          <span className={`text-xs ${c.pass ? "text-green-400" : "text-red-400"}`}>{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function Field({ label, field, type = "text", icon: Icon, placeholder, value, error, showPassword, onChange, onTogglePassword }: {
  label: string; field: string; type?: string; icon: React.ElementType; placeholder: string;
  value: string; error?: string; showPassword?: boolean;
  onChange: (field: string, value: string) => void; onTogglePassword?: () => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-200 mb-1">{label}</label>
      <div className={`flex items-center border-2 rounded-xl px-4 py-3 gap-3 bg-white/5 transition-colors ${
        error ? "border-red-400" : "border-white/20 focus-within:border-blue-400"
      }`}>
        <Icon size={16} className="text-gray-400 flex-shrink-0"/>
        <input
          type={field === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(field, e.target.value)}
          className="flex-1 text-sm text-white outline-none bg-transparent placeholder-white/40"
        />
        {field === "password" && onTogglePassword && (
          <button type="button" onClick={onTogglePassword} className="text-gray-400">
            {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      {field === "password" && <PasswordStrength password={value}/>}
    </div>
  );
}

function SignupPageInner() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", suburb: "", state: "NSW" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const states = ["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"];

  const handleChange = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }));
    const err = validate(field, value);
    setErrors(e => ({ ...e, [field]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(form).forEach(field => {
      if (field !== "state") {
        const err = validate(field, form[field as keyof typeof form]);
        if (err) newErrors[field] = err;
      }
    });
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setServerError(data.error || "Signup failed."); return; }
      router.push("/dashboard");
    } catch { setServerError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{
      background: "linear-gradient(135deg, #060d4a 0%, #0d1a8a 50%, #1a3adb 100%)"
    }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md shadow-2xl">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-blue-200 text-sm mt-1">Find trusted tradies across Australia</p>
        </div>

        {serverError && (
          <div className="bg-red-500/20 border border-red-400 text-red-200 text-sm rounded-xl px-4 py-3 mb-4">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full Name" field="name" icon={User} placeholder="John Smith" value={form.name} error={errors.name} onChange={handleChange}/>
          <Field label="Email Address" field="email" type="email" icon={Mail} placeholder="john@example.com" value={form.email} error={errors.email} onChange={handleChange}/>
          <Field label="Phone Number" field="phone" type="tel" icon={Phone} placeholder="0412 345 678" value={form.phone} error={errors.phone} onChange={handleChange}/>
          <Field label="Password" field="password" icon={Lock} placeholder="Min 8 chars with letters & numbers" value={form.password} error={errors.password} showPassword={showPassword} onChange={handleChange} onTogglePassword={() => setShowPassword(!showPassword)}/>
          <Field label="Suburb" field="suburb" icon={MapPin} placeholder="Westmead" value={form.suburb} error={errors.suburb} onChange={handleChange}/>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">State</label>
            <select value={form.state} onChange={e => handleChange("state", e.target.value)}
              className="w-full bg-white/5 border-2 border-white/20 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-blue-400">
              {states.map(s => <option key={s} value={s} className="text-gray-900">{s}</option>)}
            </select>
          </div>

          <motion.button type="submit" disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm transition-colors mt-2">
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-blue-200 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return <Suspense><SignupPageInner/></Suspense>;
}
