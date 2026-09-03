"use client";
import Image from 'next/image';
import { useState , Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Zap,
  Search,
  X,
} from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

const AU_SUBURBS: Record<string, string[]> = {
  NSW: ["Parramatta","Sydney","Westmead","Blacktown","Penrith","Liverpool","Campbelltown","Bankstown","Hurstville","Chatswood","Hornsby","Manly","Bondi","Surry Hills","Newtown","Strathfield","Auburn","Merrylands","Granville","Seven Hills","Castle Hill","Kellyville","Mount Druitt","St Marys","Kingswood","Gosford","Newcastle","Wollongong","Baulkham Hills","Ryde","Eastwood","Epping","North Sydney","Neutral Bay","Mosman","Crows Nest","Lane Cove","Artarmon","Balmain","Rozelle","Leichhardt","Glebe","Pyrmont","Chippendale","Redfern","Waterloo","Zetland","Rosebery","Alexandria","Erskineville","Marrickville","Dulwich Hill","Canterbury","Campsie","Belmore","Lakemba","Punchbowl","Beverly Hills","Kingsgrove","Bexley","Rockdale","Kogarah","Arncliffe","Wolli Creek","Mascot","Botany","Maroubra","Randwick","Kensington","Kingsford","Lidcombe","Homebush","Concord","Rhodes","Meadowbank","West Ryde","Ermington","Rydalmere","Dundas","Carlingford","North Rocks","Northmead","Winston Hills","Toongabbie","Pendle Hill","Wentworthville","Guildford","Fairfield","Wetherill Park","Bossley Park","Cecil Hills","Green Valley","Casula","Moorebank","Sutherland","Kirrawee","Gymea","Miranda","Caringbah","Cronulla"],
  VIC: ["Melbourne","St Kilda","Richmond","Fitzroy","Brunswick","Footscray","Sunshine","Werribee","Frankston","Dandenong","Clayton","Box Hill","Ringwood","Berwick","Cranbourne","Geelong","Ballarat","Bendigo","Moonee Ponds","Essendon","Broadmeadows","Coburg","Preston","Reservoir","Thornbury","Northcote","Fairfield","Ivanhoe","Heidelberg","Bundoora","Mill Park","South Morang","Epping","Lalor","Thomastown","Craigieburn","Roxburgh Park","Glenroy","Pascoe Vale","Keilor","Keilor East","Keilor Downs","Sydenham","Taylors Lakes","Caroline Springs","Melton","Hoppers Crossing","Wyndham Vale","Point Cook","Laverton","Altona","Newport","Williamstown","Yarraville","Seddon","West Footscray"],
  QLD: ["Brisbane","Fortitude Valley","South Brisbane","West End","Toowong","Chermside","Logan","Beenleigh","Ipswich","Gold Coast","Surfers Paradise","Robina","Sunshine Coast","Maroochydore","Townsville","Cairns","Toowoomba","Springfield","Ormeau","Coomera","Hope Island","Helensvale","Nerang","Mudgeeraba","Varsity Lakes","Burleigh Heads","Palm Beach","Currumbin","Coolangatta","Tweed Heads"],
  WA: ["Perth","Fremantle","Subiaco","Nedlands","Morley","Midland","Rockingham","Mandurah","Joondalup","Wanneroo","Armadale","Balga","Nollamara","Mirrabooka","Dianella","Yokine","Inglewood","Mount Lawley","Maylands","Bayswater","Bassendean","Guildford","Ellenbrook","Two Rocks","Yanchep","Alkimos","Clarkson","Merriwa","Quinns Rocks","Burns Beach","Currambine","Ocean Reef","Hillarys","Duncraig","Carine","Sorrento","Padbury","Craigie","Connolly","Edgewater"],
  SA: ["Adelaide","North Adelaide","Glenelg","Norwood","Prospect","Campbelltown","Tea Tree Gully","Elizabeth","Salisbury","Gawler","Port Adelaide","Semaphore","Angle Park","Bowden","Brompton","Hindmarsh","Gepps Cross","Mawson Lakes","Pooraka","Walkley Heights","Davoren Park","Andrews Farm","Smithfield","Munno Para","Virginia","Salisbury East","Salisbury Heights","Greenwith","Golden Grove","Modbury","Redwood Park","Surrey Downs","Ridgehaven","St Agnes","Fairview Park","Hahndorf","Woodside"],
  TAS: ["Hobart","Sandy Bay","Launceston","Devonport","Burnie","New Town","Moonah","Glenorchy","Berriedale","Claremont","Bridgewater","Risdon Vale","Rokeby","Lauderdale","Margate","Snug","Kettering","Huonville"],
  ACT: ["Canberra","Braddon","Kingston","Manuka","Woden","Belconnen","Tuggeranong","Gungahlin","Fyshwick","Mitchell","Hume","Watson","Downer","Dickson","Ainslie","Hackett","Lyneham","Turner","Acton","Parkes","Barton","Forrest","Griffith","Narrabundah","Red Hill","Deakin","Yarralumla","Curtin","Garran","Hughes","Phillip","Pearce","Torrens","Chifley","Mawson","Isaacs","Farrer","Fadden","Gilmore","Wanniassa","Kambah","Greenway","Calwell","Theodore","Gordon","Bonython","Chisholm","Richardson","Banks","Conder","Isabella Plains","Oxley","Monash"],
  NT: ["Darwin","Palmerston","Casuarina","Alice Springs","Katherine","Nightcliff","Rapid Creek","Millner","Moil","Karama","Malak","Marrara","Berrimah","Winnellie","Stuart Park","Fannie Bay","Parap","Larrakeyah","Bayview","Ludmilla","Coconut Grove","Nakara","Wanguri","Leanyer","Muirhead","Lyons","Bakewell","Rosebery","Durack","Zuccoli","Gray","Driver","Woodroffe","Moulden","Farrar","Archer","Gunn","Noonamah","Humpty Doo","Berry Springs","Coolalinga","Virginia","Howard Springs"],
};

const trades = [
  { label: "Plumbing", emoji: "🔧" },
  { label: "Electrical", emoji: "⚡" },
  { label: "Cleaning", emoji: "🧹" },
  { label: "Painting", emoji: "🎨" },
  { label: "Handyman", emoji: "🔨" },
  { label: "Carpentry", emoji: "🪚" },
  { label: "Removalists", emoji: "🚚" },
];

const urgencyOptions = [
  { label: "Emergency", desc: "Within 24 hours", color: "bg-red-50 border-red-200 text-red-700" },
  { label: "Urgent", desc: "Within 3 days", color: "bg-orange-50 border-orange-200 text-orange-700" },
  { label: "This Week", desc: "Within 7 days", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
  { label: "Flexible", desc: "I can wait", color: "bg-green-50 border-green-200 text-green-700" },
];

const budgetOptions = [
  "Under $200",
  "$200 - $500",
  "$500 - $1,000",
  "$1,000 - $3,000",
  "$3,000 - $5,000",
  "$5,000+",
  "Not Sure",
];

const australianStates = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

const steps = [
  { number: 1, title: "Job Details" },
  { number: 2, title: "Location" },
  { number: 3, title: "Schedule & Budget" },
  { number: 4, title: "Review & Post" },
];

function PostJobPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiEstimate, setAiEstimate] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [suburbSuggestions, setSuburbSuggestions] = useState<{name: string; state: string; postcode: string}[]>([]);
  const [showSuburbDropdown, setShowSuburbDropdown] = useState(false);
  const handleSuburbSearch = async (value: string) => {
    setForm(prev => ({ ...prev, suburb: value }));
    setError('');
    if (value.length < 2) { setSuburbSuggestions([]); setShowSuburbDropdown(false); return; }
    try {
      const state = form.state ? `&state=${form.state}` : '';
      const res = await fetch(`/api/suburbs?q=${encodeURIComponent(value)}${state}`);
      const data = await res.json();
      setSuburbSuggestions(data.suburbs || []);
      setShowSuburbDropdown((data.suburbs || []).length > 0);
    } catch { setSuburbSuggestions([]); setShowSuburbDropdown(false); }
  };
  const selectSuburb = (s: {name: string; state: string; postcode: string}) => {
    setForm(prev => ({ ...prev, suburb: s.name, state: s.state, postcode: s.postcode || prev.postcode }));
    setSuburbSuggestions([]);
    setShowSuburbDropdown(false);
  };

  const [form, setForm] = useState({
    title: searchParams.get("job") || "",
    description: searchParams.get("job") || "",
    trade: "",
    suburb: "",
    state: "",
    postcode: "",
    urgency: "",
    budget: "",
    preferredDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const getAiEstimate = async () => {
    if (!form.title || !form.trade) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job: form.title + (form.description ? ". " + form.description : ""),
          location: form.suburb ? `${form.suburb}, ${form.state}` : "Australia",
        }),
      });
      const data = await res.json();
      if (data.estimate && !data.estimate.startsWith("âŒ")) {
        setAiEstimate(data.estimate);
      }
    } catch {
      // silently fail
    } finally {
      setAiLoading(false);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!form.title.trim()) return "Job title is required.";
      if (!form.trade) return "Please select a trade.";
      if (!form.description.trim()) return "Please describe your job.";
    }
    if (currentStep === 2) {
      if (!form.suburb.trim()) return "Suburb is required.";
      if (!form.state) return "Please select your state.";
    }
    if (currentStep === 3) {
      if (!form.urgency) return "Please select urgency.";
      if (!form.budget) return "Please select a budget range.";
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError("");
    if (currentStep === 2) getAiEstimate();
    setCurrentStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((s) => s - 1);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (photos.length >= 5) { setError("Maximum 5 photos allowed."); return; }
    setUploadingPhoto(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, fileSize: file.size, documentType: "job_photo" }),
      });
      const { uploadUrl, publicUrl } = await res.json();
      await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setPhotos(prev => [...prev, publicUrl]);
    } catch { setError("Failed to upload photo."); }
    finally { setUploadingPhoto(false); }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, aiEstimate, photos }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.error === "outside_pilot_area") {
          router.push("/coming-soon");
          return;
        }
        setError(data.error || "Failed to post job.");
        setLoading(false);
        return;
      }

      router.push("/dashboard?jobPosted=true");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <Topbar />

        <div className="p-8 flex-1 max-w-3xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600"><ArrowLeft size={20}/></button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Tell us what you need and get quotes from verified tradies
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {steps.map((s) => (
              <div key={s.number} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.number <= currentStep ? "bg-blue-900" : "bg-gray-200"
                }`} />
                <p className={`text-xs mt-1 font-medium ${
                  s.number === currentStep ? "text-blue-900" : "text-gray-400"
                }`}>
                  {s.title}
                </p>
              </div>
            ))}
          </div>

          {/* Card */}
         {/* <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"> */}

{/* Card */}
<div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
  



            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">

              {/* STEP 1 â€” Job Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <FileText size={18} className="text-blue-900" />
                    Job Details
                  </h2>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title *
                    </label>
                    <div className="flex items-center border border-gray-200 focus-within:border-blue-400 rounded-xl px-4 py-3 gap-3 transition-colors">
                      <Search size={17} className="text-gray-400" />
                      <input
                        type="text"
                        name="title"
                        placeholder="e.g. Fix leaking kitchen tap"
                        value={form.title}
                        onChange={handleChange}
                        className="flex-1 text-sm text-gray-700 outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Trade */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trade Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {trades.map((trade) => (
                        <button
                          key={trade.label}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, trade: trade.label });
                            setError("");
                          }}
                          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                            form.trade === trade.label
                              ? "bg-blue-900 text-white border-blue-900"
                              : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          <span>{trade.emoji}</span>
                          {trade.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description *
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your job in detail â€” what needs to be done, any specific requirements, access details, etc."
                      value={form.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none transition-colors"
                    />
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                      📷 Add Photos <span className="text-gray-400 font-normal">(optional, max 5)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {photos.map((p, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                          <img src={p} alt="job photo" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                        </div>
                      ))}
                      {photos.length < 5 && (
                        <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                          {uploadingPhoto ? <span className="text-xs text-gray-400">Uploading...</span> : <><span className="text-2xl text-gray-300">+</span><span className="text-xs text-gray-400">Photo</span></>}
                          <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                        </label>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 â€” Location */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <MapPin size={18} className="text-blue-900" />
                    Job Location
                  </h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {australianStates.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, state: s, suburb: "" });
                            setSuburbSuggestions([]);
                            setShowSuburbDropdown(false);
                            setError("");
                          }}
                          className={`py-2 rounded-xl border text-sm font-medium transition-colors ${
                            form.state === s
                              ? "bg-blue-900 text-white border-blue-900"
                              : "border-gray-200 text-gray-600 hover:border-blue-300"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Suburb *
                    </label>
                    <div className={`flex items-center border rounded-xl px-4 py-3 gap-3 transition-colors ${form.state ? "border-gray-200 focus-within:border-blue-400" : "border-gray-100 bg-gray-50"}`}>
                      <MapPin size={17} className="text-gray-400" />
                      <input
                        type="text"
                        name="suburb"
                        placeholder={form.state ? "Type suburb name (2+ letters)" : "Select a state first"}
                        value={form.suburb}
                        onChange={e => handleSuburbSearch(e.target.value)}
                        onBlur={() => setTimeout(() => setShowSuburbDropdown(false), 200)}
                        onFocus={() => suburbSuggestions.length > 0 && setShowSuburbDropdown(true)}
                        disabled={!form.state}
                        className="flex-1 text-sm text-gray-700 outline-none bg-transparent disabled:cursor-not-allowed"
                        autoComplete="off"
                      />
                    </div>
                    {showSuburbDropdown && suburbSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-y-auto" style={{ maxHeight: "240px" }}>
                        {suburbSuggestions.map((s, i) => (
                          <button key={i} type="button"
                            onMouseDown={() => selectSuburb(s)}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 flex items-center justify-between border-b border-gray-50 last:border-0">
                            <span className="font-medium text-gray-800">{s.name}</span>
                            <span className="text-xs text-gray-400">{s.state} {s.postcode}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode (Optional)
                    </label>
                    <input
                      type="text"
                      name="postcode"
                      placeholder="e.g. 2026"
                      value={form.postcode}
                      onChange={handleChange}
                      maxLength={4}
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 3 â€” Schedule & Budget */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={18} className="text-blue-900" />
                    Schedule & Budget
                  </h2>

                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How urgent is this? *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {urgencyOptions.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, urgency: opt.label });
                            setError("");
                          }}
                          className={`flex flex-col items-start px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                            form.urgency === opt.label
                              ? "bg-blue-900 text-white border-blue-900"
                              : `${opt.color} border`
                          }`}
                        >
                          <span className="font-bold">{opt.label}</span>
                          <span className={`text-xs mt-0.5 ${form.urgency === opt.label ? "text-blue-200" : "opacity-70"}`}>
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-gray-200 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none transition-colors"
                    />
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {budgetOptions.map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            setForm({ ...form, budget: b });
                            setError("");
                          }}
                          className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors ${
                            form.budget === b
                              ? "bg-blue-900 text-white border-blue-900"
                              : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 4 â€” Review */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <CheckCircle size={18} className="text-blue-900" />
                    Review & Post
                  </h2>

                  {/* Summary */}
                  <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Job Title</span>
                      <span className="text-gray-900 font-semibold text-right max-w-[60%]">{form.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Trade</span>
                      <span className="text-gray-900 font-semibold">{form.trade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Location</span>
                      <span className="text-gray-900 font-semibold">{form.suburb}, {form.state} {form.postcode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Urgency</span>
                      <span className="text-gray-900 font-semibold">{form.urgency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 font-medium">Budget</span>
                      <span className="text-gray-900 font-semibold">{form.budget}</span>
                    </div>
                    {form.preferredDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Preferred Date</span>
                        <span className="text-gray-900 font-semibold">
                          {new Date(form.preferredDate).toLocaleDateString("en-AU", {
                            day: "numeric", month: "long", year: "numeric"
                          })}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">Description</p>
                      <p className="text-sm text-gray-700 leading-relaxed">{form.description}</p>
                    </div>
                  </div>

                  {/* AI Estimate */}
                  {aiLoading && (
                    <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                      <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span className="text-sm text-blue-700 font-medium">Getting AI estimate...</span>
                    </div>
                  )}

                  {aiEstimate && (
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <Zap size={12} className="text-white fill-white" />
                          </div>
                          <span className="text-sm font-bold text-blue-900">AI Price Estimate</span>
                        </div>
                        <button onClick={() => setAiEstimate("")} className="text-gray-400 hover:text-gray-600">
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                        {aiEstimate.split("\n").filter((l) => !l.startsWith("ðŸ”§")).join("\n")}
                      </p>
                    </div>
                  )}

                  {!aiEstimate && !aiLoading && (
                    <button
                      type="button"
                      onClick={getAiEstimate}
                      className="w-full flex items-center justify-center gap-2 border-2 border-blue-200 hover:border-blue-400 text-blue-700 py-3 rounded-xl text-sm font-semibold transition-colors"
                    >
                      <Zap size={16} className="fill-blue-600 text-blue-600" />
                      Get AI Price Estimate
                    </button>
                  )}

                  <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Ready to post!</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Your job will be visible to verified tradies in {form.suburb}, {form.state} immediately.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 border border-gray-200 hover:border-gray-300 text-gray-600 px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold text-sm transition-colors"
                >
                  Continue
                  <ArrowRight size={16} />
                </button>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-300 text-white py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Posting Job...
                    </>
                  ) : (
                    <>
                      <Briefcase size={16} />
                      Post Job Now
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


export default function PostJobPage() {
  return (
    <Suspense>
      <PostJobPageInner />
    </Suspense>
  );
}
