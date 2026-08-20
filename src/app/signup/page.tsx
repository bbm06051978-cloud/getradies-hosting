"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── CONSTANTS ──────────────────────────────────────────────
const TRADES = ["Electrical","Plumbing","Cleaning","Painting","Handyman","Carpentry","Removalists"];
const AU_STATES = [
  { code: "NSW", name: "New South Wales" },
  { code: "VIC", name: "Victoria" },
  { code: "QLD", name: "Queensland" },
  { code: "WA",  name: "Western Australia" },
  { code: "SA",  name: "South Australia" },
  { code: "TAS", name: "Tasmania" },
  { code: "ACT", name: "Australian Capital Territory" },
  { code: "NT",  name: "Northern Territory" },
];

const AU_SUBURBS: Record<string, string[]> = {
  NSW: ["Parramatta","Sydney","Westmead","Blacktown","Penrith","Liverpool","Campbelltown","Bankstown","Hurstville","Chatswood","Hornsby","Manly","Bondi","Surry Hills","Newtown","Leichhardt","Strathfield","Auburn","Merrylands","Granville","Seven Hills","Baulkham Hills","Castle Hill","Kellyville","Rouse Hill","Marsden Park","Quakers Hill","Mount Druitt","St Marys","Kingswood","Glenmore Park","Springwood","Richmond","Windsor","Gosford","Wyong","Newcastle","Maitland","Cessnock","Wagga Wagga","Albury","Orange","Dubbo","Tamworth","Coffs Harbour","Port Macquarie","Wollongong","Shellharbour","Nowra","Bowral"],
  VIC: ["Melbourne","Southbank","Docklands","St Kilda","Prahran","Richmond","Fitzroy","Brunswick","Footscray","Sunshine","St Albans","Werribee","Frankston","Dandenong","Clayton","Box Hill","Ringwood","Lilydale","Croydon","Knox","Berwick","Cranbourne","Pakenham","Geelong","Ballarat","Bendigo","Shepparton","Mildura","Wodonga","Warrnambool"],
  QLD: ["Brisbane","Southbank","Fortitude Valley","South Brisbane","West End","Toowong","Indooroopilly","Chermside","Nundah","Carindale","Logan","Beenleigh","Ipswich","Springfield","Richlands","Gold Coast","Southport","Surfers Paradise","Robina","Broadbeach","Sunshine Coast","Maroochydore","Caloundra","Noosa","Townsville","Cairns","Rockhampton","Mackay","Toowoomba"],
  WA: ["Perth","Fremantle","Subiaco","Nedlands","Cottesloe","Claremont","Morley","Mirrabooka","Balga","Midland","Rockingham","Mandurah","Joondalup","Wanneroo","Armadale","Gosnells","Canning Vale","Thornlie","Bentley","Victoria Park"],
  SA: ["Adelaide","North Adelaide","Glenelg","Norwood","Prospect","Campbelltown","Tea Tree Gully","Modbury","Elizabeth","Salisbury","Parafield Gardens","Golden Grove","Mount Barker","Murray Bridge","Whyalla","Port Augusta","Port Pirie","Gawler"],
  TAS: ["Hobart","Sandy Bay","Battery Point","Launceston","Devonport","Burnie","Ulverstone","Queenstown","Huonville","Sorell"],
  ACT: ["Canberra","Braddon","Civic","Kingston","Manuka","Woden","Belconnen","Tuggeranong","Gungahlin","Bruce","Charnwood","Palmerston","Macgregor","Amaroo"],
  NT: ["Darwin","Palmerston","Casuarina","Nightcliff","Rapid Creek","Alice Springs","Katherine","Nhulunbuy","Tennant Creek"],
};

// ─── VALIDATION ─────────────────────────────────────────────
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validatePhone(phone: string) {
  const digits = phone.replace(/[\s-()]/g, "");
  return /^[2-9]\d{8}$/.test(digits);
}
function validatePassword(pw: string) {
  if (pw.length < 8)       return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pw))   return "Must include at least one uppercase letter";
  if (!/[a-z]/.test(pw))   return "Must include at least one lowercase letter";
  if (!/[0-9]/.test(pw))   return "Must include at least one number";
  return "";
}
function validateSuburb(suburb: string, state: string) {
  if (!suburb.trim() || suburb.trim().length < 2) return false;
  if (!state) return suburb.trim().length >= 2;
  return (AU_SUBURBS[state] || []).some(
    (s) => s.toLowerCase() === suburb.trim().toLowerCase()
  );
}

// ─── FIELD COMPONENT ────────────────────────────────────────
function Field({
  label, children, error, hint, required,
}: {
  label: string; children: React.ReactNode;
  error?: string; hint?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-bold text-gray-700">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Input({
  error, className = "", ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border-2 px-4 py-3 text-sm text-gray-900 outline-none transition
        focus:border-blue-500 bg-gray-50
        ${error ? "border-red-400" : "border-gray-200"}
        ${className}`}
    />
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────
export default function RegisterPage() {
  const [tab, setTab] = useState<"homeowner" | "tradie">("homeowner");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [termsError, setTermsError] = useState("");

  // Fields
  const [name, setName]             = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [suburb, setSuburb]         = useState("");
  const [state, setState]           = useState("");
  const [businessName, setBusinessName] = useState("");
  const [specialty, setSpecialty]   = useState("");
  const [abn, setAbn]               = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [suburbSuggestions, setSuburbSuggestions] = useState<string[]>([]);

  // Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password strength
  const pwChecks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase",     pass: /[A-Z]/.test(password) },
    { label: "Lowercase",     pass: /[a-z]/.test(password) },
    { label: "Number",        pass: /[0-9]/.test(password) },
  ];

  // Suburb autocomplete
  const handleSuburbChange = (val: string) => {
    setSuburb(val);
    if (errors.suburb) setErrors((p) => ({ ...p, suburb: "" }));
    if (val.length >= 2 && state) {
      const matches = (AU_SUBURBS[state] || [])
        .filter((s) => s.toLowerCase().startsWith(val.toLowerCase()))
        .slice(0, 6);
      setSuburbSuggestions(matches);
    } else {
      setSuburbSuggestions([]);
    }
  };

  // Validate
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())           e.name = "Full name is required";
    else if (name.trim().length > 30) e.name = "Name must be 30 characters or less";
    if (!email.trim())          e.email = "Email address is required";
    else if (!validateEmail(email)) e.email = "Please enter a valid email address";
    if (phone && !validatePhone(phone)) e.phone = "Enter a valid Australian number (9 digits after +61, without leading 0)";
    const pwErr = validatePassword(password);
    if (!password)              e.password = "Password is required";
    else if (pwErr)             e.password = pwErr;
    if (!confirm)               e.confirm = "Please confirm your password";
    else if (password !== confirm) e.confirm = "Passwords do not match";
    if (tab === "homeowner") {
      if (suburb && state && !validateSuburb(suburb, state))
        e.suburb = `"${suburb}" is not a recognised suburb in ${state}`;
      if (suburb && !state) e.state = "Please select a state first";
    }
    if (tab === "tradie" && !specialty) e.specialty = "Please select your trade specialty";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    if (!agreedToTerms) { setTermsError("You must agree to the Terms of Service and Privacy Policy to continue."); return; }
    setTermsError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const fullPhone = phone ? `+61${phone.replace(/[\s-()]/g, "")}` : "";
      const body = tab === "homeowner"
        ? { name: name.trim(), email: email.trim().toLowerCase(), phone: fullPhone, password, role: "HOMEOWNER", suburb: suburb.trim(), state }
        : { name: name.trim(), email: email.trim().toLowerCase(), phone: fullPhone, password, role: "TRADIE", businessName: businessName.trim() || name.trim(), specialty };
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        if (data.requiresVerification) {
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
        } else {
          setSuccess(true);
          window.location.href = tab === "tradie" ? "/dashboard-tradie" : "/dashboard";
        }
      } else {
        setServerError(data.error || "Registration failed. Please try again.");
      }
    } catch {
      setServerError("Something went wrong. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const accentBlue  = "border-[#0047AB] text-[#0047AB] bg-blue-50";
  const accentOrange = "border-[#F97316] text-[#F97316] bg-orange-50";

  return (
    <div className="min-h-screen bg-[#F8FAFF]">

      {/* Top bar */}
      <div className="bg-[#0047AB] py-4 px-6 flex items-center justify-between">
        <Link href="/">
          <img src="/imports/GeTradie_Logo.webp" alt="GeTradie" className="h-9 object-contain" />
        </Link>
        <span className="text-blue-200 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-bold underline">Sign in</Link>
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-500 text-sm">Join thousands of Australians on GeTradie — free to sign up</p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8 shadow-inner">
          {(["homeowner","tradie"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setErrors({}); }}
              className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200
                ${tab === t
                  ? t === "homeowner"
                    ? "bg-white text-[#0047AB] shadow-md"
                    : "bg-white text-[#F97316] shadow-md"
                  : "text-gray-400"}`}
            >
              {t === "homeowner" ? "🏠 Homeowner" : "🔧 Tradie"}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-50 p-8">
          {serverError && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Full Name */}
            <Field label="Full Name" required error={errors.name}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="e.g. John Smith"
                  value={name}
                  maxLength={30}
                  error={errors.name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                  }}
                />
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs
                  ${name.length > 25 ? "text-orange-500" : "text-gray-300"}`}>
                  {name.length}/30
                </span>
              </div>
            </Field>

            {/* Email */}
            <Field label="Email Address" required error={errors.email}>
              <Input
                type="email"
                placeholder="john@example.com"
                value={email}
                error={errors.email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
              />
            </Field>

            {/* Phone — +61 built in */}
            <Field
              label="Phone Number"
              error={errors.phone}
              hint="Australian mobile or landline — enter digits after +61 without leading 0"
            >
              <div className={`flex items-center rounded-xl border-2 bg-gray-50 overflow-hidden transition
                ${errors.phone ? "border-red-400" : "border-gray-200 focus-within:border-blue-500"}`}>
                <div className="flex items-center gap-2 px-3 py-3 bg-blue-50 border-r border-gray-200 shrink-0">
                  <span className="text-lg">🇦🇺</span>
                  <span className="text-sm font-bold text-[#0047AB]">+61</span>
                </div>
                <input
                  type="tel"
                  placeholder="4XX XXX XXX"
                  value={phone}
                  maxLength={11}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/[^\d\s-]/g, "");
                    setPhone(cleaned);
                    if (errors.phone) setErrors((p) => ({ ...p, phone: "" }));
                  }}
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-900 outline-none"
                />
              </div>
            </Field>

            {/* Tradie-specific */}
            {tab === "tradie" && (
              <>
                <Field label="Business Name">
                  <Input
                    type="text"
                    placeholder="e.g. Smith Electrical"
                    value={businessName}
                    maxLength={50}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </Field>

                <Field label="Trade Specialty" required error={errors.specialty}>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {TRADES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setSpecialty(t);
                          if (errors.specialty) setErrors((p) => ({ ...p, specialty: "" }));
                        }}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition
                          ${specialty === t
                            ? "bg-[#FFF7ED] border-[#F97316] text-[#F97316]"
                            : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="ABN (Optional)">
                  <Input
                    type="text"
                    placeholder="12 345 678 901"
                    value={abn}
                    maxLength={14}
                    onChange={(e) => setAbn(e.target.value.replace(/[^\d\s]/g, ""))}
                  />
                </Field>
              </>
            )}

            {/* Homeowner-specific */}
            {tab === "homeowner" && (
              <div className="grid grid-cols-2 gap-4">
                {/* State */}
                <Field label="State" required error={errors.state}>
                  <select
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value);
                      setSuburb("");
                      setSuburbSuggestions([]);
                      if (errors.state) setErrors((p) => ({ ...p, state: "", suburb: "" }));
                    }}
                    className={`w-full rounded-xl border-2 px-4 py-3 text-sm bg-gray-50 outline-none
                      transition focus:border-blue-500
                      ${errors.state ? "border-red-400" : "border-gray-200"}
                      ${!state ? "text-gray-400" : "text-gray-900"}`}
                  >
                    <option value="">Select state</option>
                    {AU_STATES.map((s) => (
                      <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                    ))}
                  </select>
                </Field>

                {/* Suburb */}
                <Field label="Suburb" error={errors.suburb}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder={state ? `Search in ${state}...` : "Select state first"}
                      value={suburb}
                      disabled={!state}
                      error={errors.suburb}
                      onChange={(e) => handleSuburbChange(e.target.value)}
                      onBlur={() => setTimeout(() => setSuburbSuggestions([]), 200)}
                    />
                    {suburbSuggestions.length > 0 && (
                      <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-xl
                        border-2 border-blue-200 shadow-lg overflow-hidden">
                        {suburbSuggestions.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              setSuburb(s);
                              setSuburbSuggestions([]);
                              setErrors((p) => ({ ...p, suburb: "" }));
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-800
                              hover:bg-blue-50 hover:text-[#0047AB] border-b border-gray-50 last:border-0"
                          >
                            📍 {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>
              </div>
            )}

            {/* Password */}
            <Field
              label="Password"
              required
              error={errors.password}
              hint={!errors.password ? "Must include uppercase, lowercase, and a number" : ""}
            >
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={password}
                  error={errors.password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              {/* Strength indicators */}
              {password.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {pwChecks.map((c) => (
                    <span
                      key={c.label}
                      className={`text-xs font-medium px-2 py-0.5 rounded-full
                        ${c.pass ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
                    >
                      {c.pass ? "✓" : "○"} {c.label}
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {/* Confirm Password */}
            <Field label="Confirm Password" required error={errors.confirm}>
              <Input
                type="password"
                placeholder="Repeat your password"
                value={confirm}
                error={errors.confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (errors.confirm) setErrors((p) => ({ ...p, confirm: "" }));
                }}
              />
            </Field>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 w-full py-4 rounded-2xl text-white font-black text-base
                transition-all duration-200 active:scale-[0.98] disabled:opacity-60
                ${tab === "homeowner"
                  ? "bg-[#0047AB] hover:bg-[#003d99]"
                  : "bg-[#F97316] hover:bg-[#ea580c]"}`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating Account...
                </span>
              ) : "Create Account →"}
            </button>

            {/* Terms Checkbox */}
            <div className="mt-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => { setAgreedToTerms(e.target.checked); setTermsError(""); }}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer flex-shrink-0"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to GeTradie&apos;s{" "}
                  <Link href="/terms" target="_blank" className="text-[#0047AB] font-semibold hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" target="_blank" className="text-[#0047AB] font-semibold hover:underline">Privacy Policy</Link>
                  . I confirm I am at least 18 years of age and located in Australia.
                </span>
              </label>
              {termsError && <p className="text-red-500 text-xs mt-1.5 ml-7">{termsError}</p>}
            </div>

          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            href={tab === "tradie" ? "/login-tradie" : "/login"}
            className="text-[#0047AB] font-bold hover:underline"
          >
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}
