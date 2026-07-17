"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ArrowLeft, ShieldCheck, CheckCircle, Zap, CreditCard, Star } from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const LOCK_OPTIONS = [
  { amount: 50,  points: 1,  label: "$50",  desc: "Basic protection",    badge: "🥉" },
  { amount: 100, points: 2,  label: "$100", desc: "Standard protection", badge: "🥈", recommended: true },
  { amount: 250, points: 5,  label: "$250", desc: "Strong protection",   badge: "🥇" },
  { amount: 500, points: 10, label: "$500", desc: "Maximum protection",  badge: "🏆" },
];

function PaymentForm({
  quoteId, amount, jobTitle, tradie, onSuccess,
}: {
  quoteId: string; amount: number; jobTitle: string;
  tradie: string; onSuccess: (bookingId: string) => void;
}) {
  const stripe   = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true); setError("");

    const { error: submitError } = await elements.submit();
    if (submitError) { setError(submitError.message || "Payment failed."); setLoading(false); return; }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || "Payment failed.");
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      const res = await fetch("/api/payment/confirm", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });
      const data = await res.json();
      if (res.ok && data.bookingId) {
        onSuccess(data.bookingId);
      } else {
        setError(data.error || "Payment succeeded but booking failed. Please contact support.");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
        <h2 className="font-bold text-gray-900 mb-1">Payment Details</h2>
        <p className="text-xs text-gray-400 mb-5">Your payment is secured by Stripe</p>
        <PaymentElement/>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {/* Test card notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-xs font-bold text-blue-700 mb-1">Test Mode — Use Test Card</p>
        <p className="text-xs text-blue-600 font-mono">4242 4242 4242 4242</p>
        <p className="text-xs text-blue-500 mt-0.5">Expiry: any future date · CVV: any 3 digits</p>
      </div>

      <button type="submit" disabled={!stripe || loading}
        className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
        style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", boxShadow: "0 4px 20px rgba(249,115,22,0.4)" }}>
        {loading ? (
          <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>Processing...</>
        ) : (
          <><CreditCard size={15}/>Pay ${amount} AUD & Confirm Booking</>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 mt-4">
        <ShieldCheck size={14} className="text-gray-400"/>
        <p className="text-xs text-gray-400">Secured by Stripe · 256-bit SSL encryption</p>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const quoteId      = searchParams.get("quoteId") || "";

  const [jobTitle,    setJobTitle]    = useState("");
  const [tradie,      setTradie]      = useState("");
  const [quoteAmount, setQuoteAmount] = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [success,     setSuccess]     = useState(false);

  // Lock amount selection
  const [selectedLock,  setSelectedLock]  = useState<number | null>(null);
  const [clientSecret,  setClientSecret]  = useState("");
  const [paymentReady,  setPaymentReady]  = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  // Load quote details on mount
  useEffect(() => {
    if (!quoteId) return;
    fetch(`/api/quotes/${quoteId}/details`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setJobTitle(d.jobTitle);
        setTradie(d.tradie);
        setQuoteAmount(d.amount);
      })
      .catch(() => setError("Failed to load quote details."))
      .finally(() => setLoading(false));
  }, [quoteId]);

  // When homeowner selects lock amount — create payment intent
  const handleSelectLock = async (amount: number) => {
    setSelectedLock(amount);
    setPaymentReady(false);
    setLoadingPayment(true);
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ lockAmount: amount }),
      });
      const d = await res.json();
      if (d.error) { setError(d.error); return; }
      setClientSecret(d.clientSecret);
      setPaymentReady(true);
    } catch { setError("Failed to initialise payment."); }
    finally { setLoadingPayment(false); }
  };

  const selectedOption = LOCK_OPTIONS.find(o => o.amount === selectedLock);

  if (success) return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar/>
        <div className="flex items-center justify-center flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 mb-2">Your booking with <span className="font-semibold text-gray-700">{tradie}</span> is confirmed.</p>
            <p className="text-gray-400 text-sm mb-2">Job: <span className="font-semibold text-gray-700">{jobTitle}</span></p>
            <p className="text-gray-400 text-sm mb-2">Lock amount paid: <span className="font-bold text-gray-700">${selectedLock} AUD</span></p>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-6">
              <p className="text-xs text-orange-600 font-bold">
                🏆 {selectedOption?.points} GeTradie Point{selectedOption?.points !== 1 ? "s" : ""} awarded to your tradie!
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-left">
              <p className="text-xs text-blue-600 font-semibold">What happens next?</p>
              <p className="text-xs text-blue-500 mt-1">The tradie will confirm your booking shortly. Your lock amount is held securely until the job is done.</p>
            </div>
            <div className="flex gap-3">
              <Link href="/bookings" className="flex-1">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
                  View Booking
                </button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <button className="w-full border border-gray-200 hover:border-gray-300 text-gray-600 py-3 rounded-xl font-bold text-sm transition-colors">
                  Dashboard
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <Topbar/>
        <div className="p-8 max-w-2xl mx-auto w-full">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20}/>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Select Lock Amount</h1>
              <p className="text-gray-500 text-sm mt-0.5">Choose your dispute protection deposit</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <svg className="animate-spin h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">{error}</div>
          ) : (
            <>
              {/* Job summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Booking Summary</p>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{jobTitle}</p>
                    <p className="text-sm text-orange-500 font-semibold">{tradie}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Quote amount</p>
                    <p className="text-xl font-bold text-gray-900">${quoteAmount}</p>
                    <p className="text-xs text-gray-400">AUD</p>
                  </div>
                </div>
              </div>

              {/* How lock amount works */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Zap size={18} className="text-orange-500 flex-shrink-0 mt-0.5"/>
                  <div>
                    <p className="font-bold text-orange-800 text-sm mb-1">How Lock Amount Works</p>
                    <p className="text-xs text-orange-700 leading-relaxed">
                      The lock amount is your <strong>dispute protection deposit</strong> — separate from the job payment. 
                      It's held securely by GeTradie and released to the tradie only after you confirm the job is done. 
                      If there's a dispute, GeTradie holds the amount until resolved.
                    </p>
                    <p className="text-xs text-orange-600 mt-2 font-semibold">
                      💡 The more you lock, tradies take your job more seriously! — GeTradie holds it until you're happy!
                    </p>
                    <p className="text-xs text-orange-700 mt-2 font-semibold border-t border-orange-200 pt-2">
                      📌 Note: The lock amount is a security deposit only. Please pay the remaining job amount directly to the tradie after job completion.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lock amount selector */}
              <div className="mb-6">
                <p className="font-bold text-gray-900 mb-3">Select Your Lock Amount</p>
                <div className="grid grid-cols-2 gap-3">
                  {LOCK_OPTIONS.map(opt => (
                    <button key={opt.amount} onClick={() => handleSelectLock(opt.amount)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all ${
                        selectedLock === opt.amount
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 bg-white hover:border-orange-300"
                      }`}>
                      {opt.recommended && (
                        <span className="absolute -top-2 left-3 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black text-gray-900">{opt.label}</span>
                        <span className="text-xl">{opt.badge}</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{opt.desc}</p>
                      <div className="flex items-center gap-1">
                        <Star size={11} className="text-orange-400 fill-orange-400"/>
                        <span className="text-xs font-bold text-orange-600">+{opt.points} GeTradie Point{opt.points !== 1 ? "s" : ""} for tradie</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment form */}
              {loadingPayment && (
                <div className="flex items-center justify-center py-8">
                  <svg className="animate-spin h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span className="ml-2 text-sm text-gray-500">Setting up payment...</span>
                </div>
              )}

              {paymentReady && clientSecret && selectedLock && (
                <>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Lock amount selected</p>
                      <p className="font-bold text-gray-900">${selectedLock} AUD</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">GeTradie Points for tradie</p>
                      <p className="font-bold text-orange-500">+{selectedOption?.points} point{selectedOption?.points !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                    <PaymentForm
                      quoteId={quoteId}
                      amount={selectedLock}
                      jobTitle={jobTitle}
                      tradie={tradie}
                      onSuccess={() => setSuccess(true)}
                    />
                  </Elements>
                </>
              )}

              {!selectedLock && !loadingPayment && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center">
                  <p className="text-gray-400 text-sm">👆 Select a lock amount above to proceed with payment</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
