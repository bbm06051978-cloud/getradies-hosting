"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

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

const LICENCE_AUTHORITIES: Record<string, string> = {
  NSW: "NSW Fair Trading",
  VIC: "Consumer Affairs Victoria",
  QLD: "QBCC (Queensland Building & Construction Commission)",
  WA:  "Building & Energy WA",
  SA:  "Consumer & Business Services SA",
  TAS: "CBOS Tasmania",
  ACT: "Access Canberra",
  NT:  "NT Consumer Affairs",
};

export default function TradieVerificationPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [licenceNumber, setLicenceNumber] = useState("");
  const [licenceState, setLicenceState] = useState("");
  const [licenceExpiry, setLicenceExpiry] = useState("");
  const [abn, setAbn] = useState("");
  const [licenceDocUrl, setLicenceDocUrl] = useState("");
  const [insuranceDocUrl, setInsuranceDocUrl] = useState("");
  const [insurancePolicyNo, setInsurancePolicyNo] = useState("");
  const [insuranceExpiry, setInsuranceExpiry] = useState("");
  const [includeInsurance, setIncludeInsurance] = useState(false);

  // File upload simulation (base64 for now — S3 integration post-launch)
  const [licenceFile, setLicenceFile] = useState<File | null>(null);
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/verification");
      const data = await res.json();
      if (data.tradieProfile) {
        setProfile(data.tradieProfile);
        setLicenceNumber(data.tradieProfile.licenceNumber || "");
        setLicenceState(data.tradieProfile.licenceState || "");
        setAbn(data.tradieProfile.abn || "");
        setInsurancePolicyNo(data.tradieProfile.insurancePolicyNo || "");
      }
    } catch (e) {}
    setLoading(false);
  };

  const handleFileUpload = async (file: File, type: "licence" | "insurance") => {
    try {
      // Get pre-signed URL from API
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          documentType: type === "licence" ? "LICENCE" : "INSURANCE",
        }),
      });
      const data = await res.json();
      if (!data.uploadUrl) {
        setError(data.error || "Failed to prepare upload. Please try again.");
        return;
      }

      // Upload directly to S3
      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) {
        setError("Upload failed. Please try again.");
        return;
      }

      // Save public URL
      if (type === "licence") {
        setLicenceFile(file);
        setLicenceDocUrl(data.publicUrl);
      } else {
        setInsuranceFile(file);
        setInsuranceDocUrl(data.publicUrl);
      }
    } catch (e) {
      setError("Upload failed. Please check your connection.");
    }
  };

  const handleMoreInfoSubmit = async () => {
    setError("");
    if (!licenceDocUrl) { setError("Please upload a document first."); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenceNumber: profile?.licenseNumber || "ADDITIONAL_DOC",
          licenceState: profile?.licenceState || "NSW",
          licenceExpiry: profile?.licenceExpiry || null,
          abn: profile?.abn || null,
          licenceDocUrl,
          insuranceDocUrl: null,
          insurancePolicyNo: null,
          insuranceExpiry: null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        await fetchProfile();
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!licenceNumber.trim()) { setError("Licence number is required."); return; }
    if (!licenceState) { setError("Please select the state that issued your licence."); return; }
    if (!licenceExpiry) { setError("Licence expiry date is required."); return; }
    if (!licenceDocUrl) { setError("Please upload a copy of your licence."); return; }
    if (includeInsurance && !insuranceDocUrl) { setError("Please upload your insurance certificate."); return; }

    setSubmitting(true);
    console.log("Submitting:", { licenceNumber: licenceNumber.trim(), licenceState, licenceDocUrl: licenceDocUrl ? licenceDocUrl.substring(0,50)+"..." : "EMPTY" });
    try {
      const res = await fetch("/api/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenceNumber: licenceNumber.trim(),
          licenceState,
          licenceExpiry,
          abn: abn.trim() || null,
          licenceDocUrl,
          insuranceDocUrl: includeInsurance ? insuranceDocUrl : null,
          insurancePolicyNo: includeInsurance ? insurancePolicyNo.trim() : null,
          insuranceExpiry: includeInsurance ? insuranceExpiry : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        await fetchProfile();
      } else {
        setError(data.error || "Submission failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; bg: string; color: string; icon: string }> = {
      EMAIL_VERIFIED:       { label: "Pending Documents", bg: "#FFF7ED", color: "#F97316", icon: "📋" },
      DOCS_SUBMITTED:       { label: "Under Review",      bg: "#EFF6FF", color: "#0047AB", icon: "🔍" },
      UNDER_REVIEW:         { label: "Under Review",      bg: "#EFF6FF", color: "#0047AB", icon: "🔍" },
      MORE_INFO_REQUIRED:   { label: "Action Required",   bg: "#FFF7ED", color: "#F97316", icon: "⚠️" },
      APPROVED:             { label: "Verified ✅",        bg: "#F0FDF4", color: "#16803C", icon: "✅" },
      REJECTED:             { label: "Resubmit Required", bg: "#FEF2F2", color: "#D92D20", icon: "❌" },
      EXPIRED:              { label: "Expired",           bg: "#FEF2F2", color: "#D92D20", icon: "⏰" },
      SUSPENDED:            { label: "Suspended",         bg: "#FEF2F2", color: "#D92D20", icon: "🚫" },
    };
    return map[status] || map["EMAIL_VERIFIED"];
  };

  if (loading) return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFF" }}>
      <TradieSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#6B7280" }}>Loading...</p>
      </div>
    </div>
  );

  const status = profile?.verificationStatus || "EMAIL_VERIFIED";
  const badge = getStatusBadge(status);
  const canSubmit = ["EMAIL_VERIFIED", "REJECTED"].includes(status);
  const needsMoreInfo = status === "MORE_INFO_REQUIRED";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFF" }}>
      <TradieSidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TradieTopbar />
        <div style={{ padding: "32px", maxWidth: "720px", margin: "0 auto", width: "100%" }}>

          {/* Header */}
          <div style={{ marginBottom: "28px" }}>
            <h1 style={{ color: "#17324D", fontSize: "24px", fontWeight: 800, margin: 0 }}>Tradie Verification</h1>
            <p style={{ color: "#667085", fontSize: "14px", marginTop: "6px" }}>
              Get verified to start quoting on jobs across Australia
            </p>
          </div>

          {/* Status Card */}
          <div style={{ background: badge.bg, border: `1px solid ${badge.color}30`, borderRadius: "12px", padding: "20px 24px", marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "20px" }}>{badge.icon}</span>
                <span style={{ color: badge.color, fontWeight: 700, fontSize: "15px" }}>{badge.label}</span>
              </div>
              {profile?.verificationNotes && (
                <p style={{ color: "#374151", fontSize: "13px", marginTop: "8px", marginLeft: "30px" }}>
                  <strong>Note:</strong> {profile.verificationNotes}
                </p>
              )}
              {status === "APPROVED" && profile?.verificationDate && (
                <p style={{ color: "#16803C", fontSize: "13px", marginTop: "4px", marginLeft: "30px" }}>
                  Verified on {new Date(profile.verificationDate).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              )}
            </div>
            {status === "APPROVED" && (
              <div style={{ textAlign: "right" }}>
                <div style={{ background: "#16803C", color: "#fff", borderRadius: "8px", padding: "6px 14px", fontSize: "12px", fontWeight: 700 }}>
                  ✅ Verified Tradie
                </div>
              </div>
            )}
          </div>

          {/* What you get when verified */}
          {status !== "APPROVED" && (
            <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px" }}>
              <p style={{ color: "#17324D", fontWeight: 700, fontSize: "14px", margin: "0 0 12px" }}>Why get verified?</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { icon: "📋", text: "Quote on available jobs" },
                  { icon: "✅", text: "Verified badge on profile" },
                  { icon: "🏆", text: "Higher trust from homeowners" },
                  { icon: "💰", text: "Win more jobs, earn more" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "16px" }}>{item.icon}</span>
                    <span style={{ color: "#374151", fontSize: "13px" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success message */}
          {submitted && (
            <div style={{ background: "#F0FDF4", border: "1px solid #16803C", borderRadius: "12px", padding: "20px 24px", marginBottom: "24px" }}>
              <p style={{ color: "#15803D", fontWeight: 700, fontSize: "15px", margin: "0 0 6px" }}>✅ Documents submitted successfully!</p>
              <p style={{ color: "#15803D", fontSize: "13px", margin: 0 }}>
                Our team will review your documents within 24-48 hours. You'll receive an email once verified.
              </p>
            </div>
          )}

          {/* More Info Required — simplified upload */}
          {needsMoreInfo && !submitted && (
            <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #F2F4F7" }}>
                <span style={{ fontSize: "18px" }}>📎</span>
                <span style={{ color: "#17324D", fontWeight: 700, fontSize: "15px" }}>Upload Additional Document</span>
              </div>
              <p style={{ color: "#667085", fontSize: "13px", marginBottom: "16px" }}>
                Please upload the document requested by our team and resubmit.
              </p>
              <div
                style={{
                  border: `2px dashed ${licenceFile ? "#16803C" : "#D0D5DD"}`,
                  borderRadius: "10px", padding: "24px",
                  textAlign: "center", cursor: "pointer",
                  background: licenceFile ? "#F0FDF4" : "#F9FAFB",
                }}
                onClick={() => document.getElementById("additionalUpload")?.click()}
              >
                {licenceFile ? (
                  <div>
                    <span style={{ fontSize: "24px" }}>✅</span>
                    <p style={{ color: "#16803C", fontWeight: 600, fontSize: "13px", margin: "6px 0 0" }}>{licenceFile.name}</p>
                    <p style={{ color: "#16803C", fontSize: "11px", margin: "4px 0 0" }}>Click to replace</p>
                  </div>
                ) : (
                  <div>
                    <span style={{ fontSize: "32px" }}>📎</span>
                    <p style={{ color: "#374151", fontWeight: 600, fontSize: "13px", margin: "8px 0 4px" }}>Click to upload document</p>
                    <p style={{ color: "#98A2B3", fontSize: "12px", margin: 0 }}>JPG, PNG or PDF — max 10MB</p>
                  </div>
                )}
              </div>
              <input
                id="additionalUpload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                style={{ display: "none" }}
                onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "licence"); }}
              />
              {error && <p style={{ color: "#D92D20", fontSize: "12px", marginTop: "8px" }}>{error}</p>}
              <button
                onClick={handleMoreInfoSubmit}
                disabled={submitting || !licenceFile}
                style={{
                  marginTop: "16px", width: "100%", padding: "12px",
                  background: submitting || !licenceFile ? "#93AECF" : "#0047AB",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontSize: "14px", fontWeight: 700,
                  cursor: submitting || !licenceFile ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Uploading..." : "Submit Additional Document →"}
              </button>
            </div>
          )}

          {/* Form */}
          {canSubmit && !submitted && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FEE4E2", borderRadius: "8px", padding: "12px 16px", color: "#D92D20", fontSize: "13px" }}>
                  {error}
                </div>
              )}

              {/* Section 1 — Licence */}
              <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid #F2F4F7" }}>
                  <span style={{ fontSize: "18px" }}>📄</span>
                  <span style={{ color: "#17324D", fontWeight: 700, fontSize: "15px" }}>Trade Licence</span>
                  <span style={{ background: "#FEF2F2", color: "#D92D20", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px" }}>Required</span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  {/* Licence Number */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>Licence Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. 12345678"
                      value={licenceNumber}
                      onChange={e => setLicenceNumber(e.target.value)}
                      style={{ borderRadius: "8px", border: "1px solid #D0D5DD", padding: "8px 12px", fontSize: "13px", color: "#172B4D", outline: "none" }}
                    />
                  </div>

                  {/* Licence State */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>Issuing State *</label>
                    <select
                      value={licenceState}
                      onChange={e => setLicenceState(e.target.value)}
                      style={{ borderRadius: "8px", border: "1px solid #D0D5DD", padding: "8px 12px", fontSize: "13px", color: licenceState ? "#172B4D" : "#98A2B3", outline: "none", background: "#fff" }}
                    >
                      <option value="">Select state</option>
                      {AU_STATES.map(s => (
                        <option key={s.code} value={s.code}>{s.code} — {s.name}</option>
                      ))}
                    </select>
                    {licenceState && (
                      <p style={{ color: "#667085", fontSize: "11px", margin: 0 }}>Issued by: {LICENCE_AUTHORITIES[licenceState]}</p>
                    )}
                  </div>

                  {/* Licence Expiry */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>Licence Expiry Date *</label>
                    <input
                      type="date"
                      value={licenceExpiry}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={e => setLicenceExpiry(e.target.value)}
                      style={{ borderRadius: "8px", border: "1px solid #D0D5DD", padding: "8px 12px", fontSize: "13px", color: "#172B4D", outline: "none" }}
                    />
                  </div>

                  {/* ABN */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>ABN (Optional but recommended)</label>
                    <input
                      type="text"
                      placeholder="12 345 678 901"
                      value={abn}
                      maxLength={14}
                      onChange={e => setAbn(e.target.value.replace(/[^\d\s]/g, ""))}
                      style={{ borderRadius: "8px", border: "1px solid #D0D5DD", padding: "8px 12px", fontSize: "13px", color: "#172B4D", outline: "none" }}
                    />
                  </div>
                </div>

                {/* Licence Document Upload */}
                <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>Upload Licence Document * <span style={{ color: "#667085", fontWeight: 400 }}>(Photo or PDF)</span></label>
                  <div
                    style={{
                      border: `2px dashed ${licenceFile ? "#16803C" : "#D0D5DD"}`,
                      borderRadius: "10px", padding: "24px",
                      textAlign: "center", cursor: "pointer",
                      background: licenceFile ? "#F0FDF4" : "#F9FAFB",
                      transition: "all 0.2s",
                    }}
                    onClick={() => document.getElementById("licenceUpload")?.click()}
                  >
                    {licenceFile ? (
                      <div>
                        <span style={{ fontSize: "24px" }}>✅</span>
                        <p style={{ color: "#16803C", fontWeight: 600, fontSize: "13px", margin: "6px 0 0" }}>{licenceFile.name}</p>
                        <p style={{ color: "#16803C", fontSize: "11px", margin: "4px 0 0" }}>Click to replace</p>
                      </div>
                    ) : (
                      <div>
                        <span style={{ fontSize: "32px" }}>📎</span>
                        <p style={{ color: "#374151", fontWeight: 600, fontSize: "13px", margin: "8px 0 4px" }}>Click to upload licence</p>
                        <p style={{ color: "#98A2B3", fontSize: "12px", margin: 0 }}>JPG, PNG or PDF — max 10MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="licenceUpload"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: "none" }}
                    onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "licence"); }}
                  />
                </div>
              </div>

              {/* Section 2 — Insurance (Optional) */}
              <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: "12px", padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: includeInsurance ? "20px" : 0, paddingBottom: includeInsurance ? "12px" : 0, borderBottom: includeInsurance ? "1px solid #F2F4F7" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "18px" }}>🛡️</span>
                    <span style={{ color: "#17324D", fontWeight: 700, fontSize: "15px" }}>Public Liability Insurance</span>
                    <span style={{ background: "#F0FDF4", color: "#16803C", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px" }}>Optional — Premium badge</span>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <span style={{ color: "#667085", fontSize: "12px" }}>{includeInsurance ? "Remove" : "Add insurance"}</span>
                    <input
                      type="checkbox"
                      checked={includeInsurance}
                      onChange={e => setIncludeInsurance(e.target.checked)}
                      style={{ width: "16px", height: "16px", accentColor: "#0047AB" }}
                    />
                  </label>
                </div>

                {includeInsurance && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>Policy Number</label>
                        <input
                          type="text"
                          placeholder="e.g. PLI-123456"
                          value={insurancePolicyNo}
                          onChange={e => setInsurancePolicyNo(e.target.value)}
                          style={{ borderRadius: "8px", border: "1px solid #D0D5DD", padding: "8px 12px", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>Policy Expiry Date</label>
                        <input
                          type="date"
                          value={insuranceExpiry}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={e => setInsuranceExpiry(e.target.value)}
                          style={{ borderRadius: "8px", border: "1px solid #D0D5DD", padding: "8px 12px", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                    </div>

                    {/* Insurance Document Upload */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <label style={{ color: "#17324D", fontSize: "12px", fontWeight: 600 }}>Upload Certificate of Currency</label>
                      <div
                        style={{
                          border: `2px dashed ${insuranceFile ? "#16803C" : "#D0D5DD"}`,
                          borderRadius: "10px", padding: "20px",
                          textAlign: "center", cursor: "pointer",
                          background: insuranceFile ? "#F0FDF4" : "#F9FAFB",
                        }}
                        onClick={() => document.getElementById("insuranceUpload")?.click()}
                      >
                        {insuranceFile ? (
                          <div>
                            <span style={{ fontSize: "20px" }}>✅</span>
                            <p style={{ color: "#16803C", fontWeight: 600, fontSize: "13px", margin: "4px 0 0" }}>{insuranceFile.name}</p>
                          </div>
                        ) : (
                          <div>
                            <span style={{ fontSize: "24px" }}>📎</span>
                            <p style={{ color: "#374151", fontWeight: 600, fontSize: "13px", margin: "6px 0 2px" }}>Click to upload insurance certificate</p>
                            <p style={{ color: "#98A2B3", fontSize: "12px", margin: 0 }}>JPG, PNG or PDF — max 10MB</p>
                          </div>
                        )}
                      </div>
                      <input
                        id="insuranceUpload"
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        style={{ display: "none" }}
                        onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0], "insurance"); }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Declaration */}
              <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "10px", padding: "16px 20px" }}>
                <p style={{ color: "#1E40AF", fontSize: "12px", margin: 0, lineHeight: 1.7 }}>
                  <strong>Declaration:</strong> By submitting these documents, I confirm that all information provided is accurate and current. I understand that providing false information may result in account suspension and legal action under Australian Consumer Law.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%", padding: "14px",
                  background: submitting ? "#93AECF" : "#0047AB",
                  color: "#fff", border: "none", borderRadius: "10px",
                  fontSize: "14px", fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 14px rgba(0,71,171,0.3)",
                }}
              >
                {submitting ? "Submitting documents…" : "Submit for Verification →"}
              </button>

            </form>
          )}

          {/* Already submitted / approved info */}
          {(status === "DOCS_SUBMITTED" || status === "UNDER_REVIEW") && !submitted && (
            <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: "12px", padding: "24px", textAlign: "center" }}>
              <span style={{ fontSize: "48px" }}>🔍</span>
              <h3 style={{ color: "#17324D", margin: "12px 0 8px" }}>Documents under review</h3>
              <p style={{ color: "#667085", fontSize: "14px", margin: "0 0 20px" }}>
                Our team is reviewing your documents. You'll receive an email within 24-48 hours.
              </p>
              <div style={{ background: "#F8FAFF", borderRadius: "8px", padding: "16px", textAlign: "left" }}>
                <p style={{ color: "#374151", fontSize: "13px", fontWeight: 600, margin: "0 0 8px" }}>Documents submitted:</p>
                {profile?.documents?.map((doc: any) => (
                  <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px" }}>{doc.documentType === "LICENCE" ? "📄" : "🛡️"}</span>
                    <span style={{ color: "#374151", fontSize: "13px" }}>{doc.documentType === "LICENCE" ? "Trade Licence" : "Insurance Certificate"}</span>
                    <span style={{ background: "#EFF6FF", color: "#0047AB", fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px", marginLeft: "auto" }}>Under Review</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {status === "APPROVED" && (
            <div style={{ background: "#fff", border: "1px solid #E4E7EC", borderRadius: "12px", padding: "24px" }}>
              <h3 style={{ color: "#17324D", margin: "0 0 16px" }}>Your Verification Details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { label: "Licence Number", value: profile?.licenseNumber },
                  { label: "Issuing State", value: profile?.licenceState },
                  { label: "ABN", value: profile?.abn || "Not provided" },
                  { label: "Verification Tier", value: profile?.verificationTier || "Basic" },
                ].map((item, i) => (
                  <div key={i} style={{ background: "#F8FAFF", borderRadius: "8px", padding: "12px 16px" }}>
                    <p style={{ color: "#98A2B3", fontSize: "11px", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</p>
                    <p style={{ color: "#17324D", fontSize: "13px", margin: 0, fontWeight: 600 }}>{item.value || "—"}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                <Link href="/tradie-jobs" style={{ background: "#F97316", color: "#fff", padding: "12px 24px", borderRadius: "8px", fontWeight: 700, fontSize: "13px", textDecoration: "none" }}>
                  View Job Leads →
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
