"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// ── CONSTANTS ──────────────────────────────────────────────────────
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

// ── VALIDATION ─────────────────────────────────────────────────────
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validatePhone(phone: string) {
  const digits = phone.replace(/[\s\-()]/g, "");
  return /^[2-9]\d{8}$/.test(digits);
}
function validatePassword(pw: string) {
  if (pw.length < 8)       return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(pw))   return "Must include at least one uppercase letter";
  if (!/[a-z]/.test(pw))   return "Must include at least one lowercase letter";
  if (!/[0-9]/.test(pw))   return "Must include at least one number";
  return "";
}

// ── FIELD WRAPPER ──────────────────────────────────────────────────
function Field({ label, children, error, hint, required }: {
  label: string; children: React.ReactNode;
  error?: string; hint?: string; required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600, letterSpacing: "0.02em" }}>
        {label}{required && <span style={{ color: "#D92D20" }}> *</span>}
      </label>
      {children}
      {error && <p style={{ color: "#D92D20", fontSize: "11px", marginTop: "2px" }}>{error}</p>}
      {!error && hint && <p style={{ color: "#98A2B3", fontSize: "11px", marginTop: "2px" }}>{hint}</p>}
    </div>
  );
}

// ── INPUT ──────────────────────────────────────────────────────────
function Input({ error, style={}, className="", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: "8px",
        border: `1px solid ${error ? "#D92D20" : "#D0D5DD"}`,
        padding: "8px 12px",
        fontSize: "13px",
        color: "#172B4D",
        background: "#FFFFFF",
        outline: "none",
        transition: "border-color 0.15s",
        ...style,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = error ? "#D92D20" : "#0047AB"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,71,171,0.08)"; }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? "#D92D20" : "#D0D5DD"; e.currentTarget.style.boxShadow = "none"; }}
      className={className}
    />
  );
}

// ── SECTION HEADER ─────────────────────────────────────────────────
function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", marginBottom: "4px" }}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <span style={{ color: "#17324D", fontSize: "13px", fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase" }}>{title}</span>
      <div style={{ flex: 1, height: "1px", background: "#E4E7EC", marginLeft: "4px" }} />
    </div>
  );
}

// ── MAIN PAGE ──────────────────────────────────────────────────────
function RegisterPageInner() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<"homeowner" | "tradie">("homeowner");

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "tradie") setTab("tradie");
  }, [searchParams]);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Fields
  const [name, setName]                   = useState("");
  const [email, setEmail]                 = useState("");
  const [phone, setPhone]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirm, setConfirm]             = useState("");
  const [showPw, setShowPw]               = useState(false);
  const [unitNo, setUnitNo]               = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [suburb, setSuburb]               = useState("");
  const [state, setState]                 = useState("");
  const [postcode, setPostcode]           = useState("");
  const [businessName, setBusinessName]   = useState("");
  const [specialty, setSpecialty]         = useState("");
  const [abn, setAbn]                     = useState("");
  const [suburbSuggestions, setSuburbSuggestions] = useState<{name: string; state: string; postcode: string}[]>([]);
  const [showSuburbDropdown, setShowSuburbDropdown] = useState(false);
  const [errors, setErrors]               = useState<Record<string, string>>({});

  // Password checks
  const pwChecks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase",     pass: /[A-Z]/.test(password) },
    { label: "Lowercase",     pass: /[a-z]/.test(password) },
    { label: "Number",        pass: /[0-9]/.test(password) },
  ];
  const pwStrength = pwChecks.filter(c => c.pass).length;
  const pwStrengthColor = pwStrength <= 1 ? "#D92D20" : pwStrength <= 2 ? "#F97316" : pwStrength === 3 ? "#F59E0B" : "#16803C";
  const pwStrengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];

  // Suburb search
  const handleSuburbChange = async (val: string) => {
    setSuburb(val);
    if (errors.suburb) setErrors(p => ({ ...p, suburb: "" }));
    if (val.length < 2) { setSuburbSuggestions([]); setShowSuburbDropdown(false); return; }
    try {
      const stateParam = state ? `&state=${state}` : "";
      const res = await fetch(`/api/suburbs?q=${encodeURIComponent(val)}${stateParam}`);
      const data = await res.json();
      setSuburbSuggestions(data.suburbs || []);
      setShowSuburbDropdown((data.suburbs || []).length > 0);
    } catch { setSuburbSuggestions([]); setShowSuburbDropdown(false); }
  };

  const selectSuburb = (s: { name: string; state: string; postcode: string }) => {
    setSuburb(s.name);
    if (!state) setState(s.state);
    setPostcode(s.postcode || "");
    setSuburbSuggestions([]);
    setShowSuburbDropdown(false);
    setErrors(p => ({ ...p, suburb: "" }));
  };

  // Validate
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())           e.name = "Full name is required";
    else if (name.trim().length > 30) e.name = "Name must be 30 characters or less";
    if (!email.trim())          e.email = "Email address is required";
    else if (!validateEmail(email)) e.email = "Please enter a valid email address";
    if (phone && !validatePhone(phone)) e.phone = "Enter a valid Australian number (9 digits, no leading 0)";
    const pwErr = validatePassword(password);
    if (!password)              e.password = "Password is required";
    else if (pwErr)             e.password = pwErr;
    if (!confirm)               e.confirm = "Please confirm your password";
    else if (password !== confirm) e.confirm = "Passwords do not match";
    if (tab === "tradie" && !specialty) e.specialty = "Please select your trade specialty";
    if (tab === "tradie" && !state) e.state = "Please select your base state";
    if (tab === "tradie" && !suburb.trim()) e.suburb = "Please enter your base suburb";
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
      const fullPhone = phone ? `+61${phone.replace(/[\s\-()]/g, "")}` : "";
      const body = tab === "homeowner"
        ? { name: name.trim(), email: email.trim().toLowerCase(), phone: fullPhone, password, role: "HOMEOWNER", unitNo, streetAddress, suburb: suburb.trim(), state, postcode, businessName: "", specialty: "", abn: "" }
        : { name: name.trim(), email: email.trim().toLowerCase(), phone: fullPhone, password, role: "TRADIE", businessName: businessName.trim() || name.trim(), specialty, abn };
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

  return (
    <div style={{ minHeight: "100vh", background: "#F5F8FC" }}>

      {/* Top bar */}
      <div style={{ background: "#0047AB", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/">
          <img src="/imports/GeTradie_Logo.webp" alt="GeTradie" style={{ height: "36px", objectFit: "contain" }} />
        </Link>
        <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#fff", fontWeight: 700, textDecoration: "underline" }}>Sign in</Link>
        </span>
      </div>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "32px 16px 64px" }}>

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h1 style={{ color: "#17324D", fontSize: "26px", fontWeight: 800, margin: 0 }}>Create your GeTradie account</h1>
          <p style={{ color: "#667085", fontSize: "14px", marginTop: "6px" }}>Join Australia's smarter tradie marketplace</p>
        </div>

        {/* Tab toggle */}
        <div style={{ display: "flex", background: "#E4E7EC", borderRadius: "12px", padding: "4px", marginBottom: "24px" }}>
          {(["homeowner", "tradie"] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setErrors({}); }}
              style={{
                flex: 1, padding: "10px", border: "none", cursor: "pointer",
                borderRadius: "9px", fontSize: "13px", fontWeight: 700,
                transition: "all 0.2s",
                background: tab === t ? "#FFFFFF" : "transparent",
                color: tab === t ? (t === "homeowner" ? "#0047AB" : "#F97316") : "#667085",
                boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
              }}
            >
              {t === "homeowner" ? "🏠  Homeowner" : "🔧  Tradie"}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div style={{ background: "#FFFFFF", borderRadius: "16px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", border: "1px solid #E4E7EC", padding: "28px 28px 32px" }}>

          {serverError && (
            <div style={{ background: "#FEF3F2", border: "1px solid #FEE4E2", borderRadius: "8px", padding: "12px 16px", marginBottom: "20px", color: "#D92D20", fontSize: "13px" }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* ── PERSONAL DETAILS ── */}
            <SectionHeader icon="👤" title="Personal details" />

            {/* Name */}
            <Field label="Full Name" required error={errors.name}>
              <div style={{ position: "relative" }}>
                <Input
                  type="text"
                  placeholder="John Smith"
                  value={name}
                  maxLength={30}
                  error={errors.name}
                  onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
                />
                <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: name.length > 25 ? "#F97316" : "#D0D5DD" }}>
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
                onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
              />
            </Field>

            {/* Phone */}
            <Field label="Phone Number" error={errors.phone} hint="Australian mobile or landline — digits after +61, no leading 0">
              <div style={{
                display: "flex", alignItems: "center", borderRadius: "8px",
                border: `1px solid ${errors.phone ? "#D92D20" : "#D0D5DD"}`,
                background: "#FFFFFF", overflow: "hidden", transition: "border-color 0.15s",
              }}
                onFocusCapture={e => (e.currentTarget.style.borderColor = "#0047AB")}
                onBlurCapture={e => (e.currentTarget.style.borderColor = errors.phone ? "#D92D20" : "#D0D5DD")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 12px", background: "#F5F8FC", borderRight: "1px solid #D0D5DD", flexShrink: 0 }}>
                  <span>🇦🇺</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0047AB" }}>+61</span>
                </div>
                <input
                  type="tel"
                  placeholder="4XX XXX XXX"
                  value={phone}
                  maxLength={11}
                  onChange={e => { setPhone(e.target.value.replace(/[^\d\s\-]/g, "")); if (errors.phone) setErrors(p => ({ ...p, phone: "" })); }}
                  style={{ flex: 1, border: "none", outline: "none", padding: "8px 12px", fontSize: "13px", color: "#172B4D", background: "transparent" }}
                />
              </div>
            </Field>

            {/* ── TRADIE SPECIFIC ── */}
            {tab === "tradie" && (
              <>
                <SectionHeader icon="🔧" title="Business details" />

                <Field label="Business Name">
                  <Input type="text" placeholder="e.g. Smith Electrical" value={businessName} maxLength={50} onChange={e => setBusinessName(e.target.value)} />
                </Field>

                <Field label="Trade Specialty" required error={errors.specialty}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "4px" }}>
                    {TRADES.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => { setSpecialty(t); if (errors.specialty) setErrors(p => ({ ...p, specialty: "" })); }}
                        style={{
                          padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 600,
                          cursor: "pointer", transition: "all 0.15s",
                          border: `1.5px solid ${specialty === t ? "#F97316" : "#D0D5DD"}`,
                          background: specialty === t ? "#FFF7ED" : "#F9FAFB",
                          color: specialty === t ? "#F97316" : "#667085",
                        }}
                      >{t}</button>
                    ))}
                  </div>
                  {errors.specialty && <p style={{ color: "#D92D20", fontSize: "11px", marginTop: "4px" }}>{errors.specialty}</p>}
                </Field>

                <Field label="ABN (Optional)">
                  <Input type="text" placeholder="12 345 678 901" value={abn} maxLength={14} onChange={e => setAbn(e.target.value.replace(/[^\d\s]/g, ""))} />
                </Field>

                <SectionHeader icon="📍" title="Base location" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <Field label="State" required error={errors.state}>
                    <select
                      value={state}
                      onChange={e => { setState(e.target.value); setSuburb(""); setSuburbSuggestions([]); if (errors.state) setErrors(p => ({ ...p, state: "", suburb: "" })); }}
                      style={{
                        width: "100%", borderRadius: "8px", border: `1px solid ${errors.state ? "#D92D20" : "#D0D5DD"}`,
                        padding: "8px 12px", fontSize: "13px", color: state ? "#172B4D" : "#98A2B3",
                        background: "#FFFFFF", outline: "none", cursor: "pointer",
                      }}
                    >
                      <option value="">Select state</option>
                      {AU_STATES.map(s => (
                        <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Suburb" required error={errors.suburb}>
                    <div style={{ position: "relative" }}>
                      <Input
                        type="text"
                        placeholder={state ? "Search suburb..." : "Select state first"}
                        value={suburb}
                        disabled={!state}
                        error={errors.suburb}
                        onChange={e => handleSuburbChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuburbDropdown(false), 200)}
                        style={{ background: !state ? "#F9FAFB" : "#FFFFFF" }}
                      />
                      {showSuburbDropdown && suburbSuggestions.length > 0 && (
                        <div style={{
                          position: "absolute", zIndex: 20, top: "100%", left: 0, right: 0, marginTop: "4px",
                          background: "#FFFFFF", borderRadius: "8px", border: "1px solid #D0D5DD",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                        }}>
                          {suburbSuggestions.map(s => (
                            <button
                              key={s.name + s.postcode}
                              type="button"
                              onClick={() => selectSuburb(s)}
                              style={{
                                width: "100%", textAlign: "left", padding: "9px 14px", border: "none",
                                background: "transparent", cursor: "pointer", fontSize: "13px",
                                color: "#172B4D", borderBottom: "1px solid #F2F4F7",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#F5F8FC")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                              <span>📍 {s.name}</span>
                              <span style={{ color: "#98A2B3", fontSize: "12px" }}>{s.state} {s.postcode}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>

                <Field label="Postcode" hint="Auto-filled when you select a suburb">
                  <Input
                    type="text"
                    placeholder="e.g. 2150"
                    value={postcode}
                    maxLength={4}
                    onChange={e => setPostcode(e.target.value.replace(/[^\d]/g, ""))}
                    style={{ maxWidth: "140px" }}
                  />
                </Field>
              </>
            )}

            {/* ── HOMEOWNER ADDRESS ── */}
            {tab === "homeowner" && (
              <>
                <SectionHeader icon="🏠" title="Your address" />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
                  <Field label="Unit / Apt No" hint="Optional">
                    <Input type="text" placeholder="Unit 4" value={unitNo} maxLength={20} onChange={e => setUnitNo(e.target.value)} />
                  </Field>
                  <Field label="Street Address" hint="Optional">
                    <Input type="text" placeholder="12 Smith Street" value={streetAddress} maxLength={100} onChange={e => setStreetAddress(e.target.value)} />
                  </Field>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  {/* State */}
                  <Field label="State" required error={errors.state}>
                    <select
                      value={state}
                      onChange={e => { setState(e.target.value); setSuburb(""); setSuburbSuggestions([]); if (errors.state) setErrors(p => ({ ...p, state: "", suburb: "" })); }}
                      style={{
                        width: "100%", borderRadius: "8px", border: `1px solid ${errors.state ? "#D92D20" : "#D0D5DD"}`,
                        padding: "8px 12px", fontSize: "13px", color: state ? "#172B4D" : "#98A2B3",
                        background: "#FFFFFF", outline: "none", cursor: "pointer",
                      }}
                    >
                      <option value="">Select state</option>
                      {AU_STATES.map(s => (
                        <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                      ))}
                    </select>
                  </Field>

                  {/* Suburb */}
                  <Field label="Suburb" error={errors.suburb}>
                    <div style={{ position: "relative" }}>
                      <Input
                        type="text"
                        placeholder={state ? `Search suburb...` : "Select state first"}
                        value={suburb}
                        disabled={!state}
                        error={errors.suburb}
                        onChange={e => handleSuburbChange(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuburbDropdown(false), 200)}
                        style={{ background: !state ? "#F9FAFB" : "#FFFFFF" }}
                      />
                      {showSuburbDropdown && suburbSuggestions.length > 0 && (
                        <div style={{
                          position: "absolute", zIndex: 20, top: "100%", left: 0, right: 0, marginTop: "4px",
                          background: "#FFFFFF", borderRadius: "8px", border: "1px solid #D0D5DD",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.12)", overflow: "hidden",
                        }}>
                          {suburbSuggestions.map(s => (
                            <button
                              key={s.name + s.postcode}
                              type="button"
                              onClick={() => selectSuburb(s)}
                              style={{
                                width: "100%", textAlign: "left", padding: "9px 14px", border: "none",
                                background: "transparent", cursor: "pointer", fontSize: "13px",
                                color: "#172B4D", borderBottom: "1px solid #F2F4F7",
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                              }}
                              onMouseEnter={e => (e.currentTarget.style.background = "#F5F8FC")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                              <span>📍 {s.name}</span>
                              <span style={{ color: "#98A2B3", fontSize: "12px" }}>{s.state} {s.postcode}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>

                {/* Postcode */}
                <Field label="Postcode" hint="Automatically filled when you select a suburb">
                  <Input
                    type="text"
                    placeholder="e.g. 2150"
                    value={postcode}
                    maxLength={4}
                    onChange={e => setPostcode(e.target.value.replace(/[^\d]/g, ""))}
                    style={{ maxWidth: "140px" }}
                  />
                </Field>
              </>
            )}

            {/* ── SECURITY ── */}
            <SectionHeader icon="🔒" title="Secure your account" />

            {/* Password */}
            <Field label="Password" required error={errors.password}>
              <div style={{ position: "relative" }}>
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Min 8 characters"
                  value={password}
                  error={errors.password}
                  onChange={e => { setPassword(e.target.value); if (errors.password) setErrors(p => ({ ...p, password: "" })); }}
                  style={{ paddingRight: "56px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", cursor: "pointer", fontSize: "12px", color: "#667085", fontWeight: 600 }}
                >{showPw ? "Hide" : "Show"}</button>
              </div>
              {/* Strength bar */}
              {password && (
                <div style={{ marginTop: "8px" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= pwStrength ? pwStrengthColor : "#E4E7EC", transition: "background 0.2s" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {pwChecks.map(c => (
                        <span key={c.label} style={{ fontSize: "11px", color: c.pass ? "#16803C" : "#98A2B3", display: "flex", alignItems: "center", gap: "3px" }}>
                          {c.pass ? "✓" : "○"} {c.label}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: pwStrengthColor }}>{pwStrengthLabel}</span>
                  </div>
                </div>
              )}
            </Field>

            {/* Confirm password */}
            <Field label="Confirm Password" required error={errors.confirm}>
              <Input
                type={showPw ? "text" : "password"}
                placeholder="Repeat your password"
                value={confirm}
                error={errors.confirm}
                onChange={e => { setConfirm(e.target.value); if (errors.confirm) setErrors(p => ({ ...p, confirm: "" })); }}
              />
            </Field>

            {/* Terms */}
            <div style={{ marginTop: "4px" }}>
              <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={e => { setAgreedToTerms(e.target.checked); if (e.target.checked) setTermsError(""); }}
                  style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "#0047AB", flexShrink: 0 }}
                />
                <span style={{ fontSize: "12px", color: "#667085", lineHeight: "1.6" }}>
                  I agree to GeTradie's{" "}
                  <Link href="/terms" style={{ color: "#0047AB", fontWeight: 600 }}>Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" style={{ color: "#0047AB", fontWeight: 600 }}>Privacy Policy</Link>.
                  {" "}I confirm I am at least 18 years of age and located in Australia.
                </span>
              </label>
              {termsError && <p style={{ color: "#D92D20", fontSize: "11px", marginTop: "6px" }}>{termsError}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px", width: "100%", padding: "13px",
                background: loading ? "#93AECF" : "#0047AB",
                color: "#FFFFFF", border: "none", borderRadius: "10px",
                fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 4px 14px rgba(0,71,171,0.35)",
                transition: "all 0.2s", letterSpacing: "0.02em",
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#003d94"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#0047AB"; }}
            >
              {loading ? "Creating your account…" : `Create Account →`}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#98A2B3" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#0047AB", fontWeight: 600 }}>Sign in here</Link>
        </p>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F5F8FC" }} />}>
      <RegisterPageInner />
    </Suspense>
  );
}
