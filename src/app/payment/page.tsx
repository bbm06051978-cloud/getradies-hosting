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
import { ArrowLeft, ShieldCheck, CheckCircle, Zap, CreditCard } from "lucide-react";
import { Sidebar } from "@/app/components/dashboard/Sidebar";
import { Topbar } from "@/app/components/dashboard/Topbar";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({
  quoteId, paymentIntentId, amount, jobTitle, tradie, onSuccess,
}: {
  quoteId: string; paymentIntentId: string; amount: number;
  jobTitle: string; tradie: string; onSuccess: (bookingId: string) => void;
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
      // Confirm payment — this triggers all accept logic
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

      <button type="submit" disabled={!stripe || loading}
        className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
        style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", boxShadow: "0 4px 20px rgba(249,115,22,0.4)" }}>
        {loading ? (
          <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>Processing...</>
        ) : (
          <><CreditCard size={15}/>Pay ${amount.toFixed(2)} AUD & Confirm Booking</>
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
  const searchParams   = useSearchParams();
  const router         = useRouter();
  const quoteId        = searchParams.get("quoteId") || "";

  const [clientSecret,     setClientSecret]     = useState("");
  const [paymentIntentId,  setPaymentIntentId]  = useState("");
  const [amount,           setAmount]           = useState(0);
  const [jobTitle,         setJobTitle]         = useState("");
  const [tradie,           setTradie]           = useState("");
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState("");
  const [success,          setSuccess]          = useState(false);
  const [bookingId,        setBookingId]        = useState("");

  useEffect(() => {
    if (!quoteId) return;
    fetch(`/api/quotes/${quoteId}`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({}),
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); return; }
        setClientSecret(d.clientSecret);
        setPaymentIntentId(d.paymentIntentId);
        setAmount(d.amount);
        setJobTitle(d.jobTitle);
        setTradie(d.tradie);
      })
      .catch(() => setError("Failed to initialise payment."))
      .finally(() => setLoading(false));
  }, [quoteId]);

  const handleSuccess = (newBookingId: string) => {
    setBookingId(newBookingId);
    setSuccess(true);
  };

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
            <p className="text-gray-400 text-sm mb-6">Amount paid: <span className="font-bold text-gray-700">${amount.toFixed(2)} AUD</span></p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-left">
              <p className="text-xs text-blue-600 font-semibold">What happens next?</p>
              <p className="text-xs text-blue-500 mt-1">The tradie will confirm your booking shortly. You will be notified when they confirm.</p>
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
        <div className="p-8 max-w-lg mx-auto w-full">

          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20}/>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
              <p className="text-gray-500 text-sm mt-0.5">Pay to confirm your booking</p>
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
              {/* Order summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Order Summary</p>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{jobTitle}</p>
                    <p className="text-sm text-orange-500 font-semibold">{tradie}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">${amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">AUD inc. GST</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Zap size={13} className="text-orange-500"/>
                    <p className="text-xs text-gray-500">Payment held securely until job is completed</p>
                  </div>
                </div>
              </div>

              {/* Test card notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-blue-700 mb-1">Test Mode — Use Test Card</p>
                <p className="text-xs text-blue-600 font-mono">4242 4242 4242 4242</p>
                <p className="text-xs text-blue-500 mt-0.5">Expiry: any future date · CVV: any 3 digits</p>
              </div>

              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                  <PaymentForm
                    quoteId={quoteId}
                    paymentIntentId={paymentIntentId}
                    amount={amount}
                    jobTitle={jobTitle}
                    tradie={tradie}
                    onSuccess={handleSuccess}
                  />
                </Elements>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
