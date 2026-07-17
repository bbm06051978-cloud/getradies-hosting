"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Check, Zap, Crown, ShieldCheck, CheckCircle,
  CreditCard, ArrowLeft, Star,
} from "lucide-react";
import { TradieSidebar } from "@/app/components/tradie/TradieSidebar";
import { TradieTopbar } from "@/app/components/tradie/TradieTopbar";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: 49,
    icon: Zap,
    color: "#3B82F6",
    radius: "20km radius",
    leads: "Up to 15 leads/month",
    features: [
      "20km radius from your suburb",
      "Up to 15 job leads per month",
      "Basic tradie profile",
      "GST & Material Calculator",
      "In-app messaging",
    ],
    notIncluded: [
      "AI Quote Assistant",
      "Priority access window",
      "Unlimited leads",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 99,
    icon: Crown,
    color: "#F97316",
    radius: "40km radius",
    leads: "Unlimited leads",
    recommended: true,
    features: [
      "40km radius from your suburb",
      "Unlimited job leads",
      "Priority access window",
      "AI Quote Assistant",
      "Enhanced tradie profile",
      "GST & Material Calculator",
      "In-app messaging",
      "Invoice Generator",
    ],
    notIncluded: [],
  },
];

function PaymentForm({
  plan, amount, onSuccess,
}: {
  plan: string; amount: number; onSuccess: () => void;
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

    if (confirmError) { setError(confirmError.message || "Payment failed."); setLoading(false); return; }

    if (paymentIntent?.status === "succeeded") {
      const res = await fetch("/api/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id, plan }),
      });
      if (res.ok) onSuccess();
      else setError("Payment succeeded but activation failed. Contact support.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
        <h3 className="font-bold text-gray-900 mb-1">Payment Details</h3>
        <p className="text-xs text-gray-400 mb-5">Secured by Stripe</p>
        <PaymentElement/>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
      )}

      {/* Test card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-xs font-bold text-blue-700 mb-1">Test Mode</p>
        <p className="text-xs text-blue-600 font-mono">4242 4242 4242 4242</p>
        <p className="text-xs text-blue-500 mt-0.5">Any future date · Any CVV</p>
      </div>

      <button type="submit" disabled={!stripe || loading}
        className="w-full py-4 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}>
        {loading ? (
          <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>Processing...</>
        ) : (
          <><CreditCard size={15}/>Pay ${amount}/month & Activate</>
        )}
      </button>

      <div className="flex items-center justify-center gap-2 mt-3">
        <ShieldCheck size={13} className="text-gray-400"/>
        <p className="text-xs text-gray-400">256-bit SSL · Cancel anytime</p>
      </div>
    </form>
  );
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [clientSecret,  setClientSecret]  = useState("");
  const [amount,        setAmount]        = useState(0);
  const [loading,       setLoading]       = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [currentPlan,   setCurrentPlan]   = useState<string>("Free");
  const [freeQuotes,    setFreeQuotes]    = useState(0);
  const [expiry,        setExpiry]        = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/tradie/profile")
      .then(r => r.json())
      .then(d => {
        if (d.user?.tradieProfile) {
          setCurrentPlan(d.user.tradieProfile.subscriptionPlan || "Free");
          setFreeQuotes(d.user.tradieProfile.freeQuotesUsed || 0);
          setExpiry(d.user.tradieProfile.subscriptionExpiry);
        }
      });
  }, []);

  const handleSelectPlan = async (planId: string, price: number) => {
    setSelectedPlan(planId);
    setLoading(true);
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const d = await res.json();
      if (d.error) { alert(d.error); return; }
      setClientSecret(d.clientSecret);
      setAmount(d.amount);
    } catch { alert("Failed to initialise payment."); }
    finally { setLoading(false); }
  };

  if (success) return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar/>
        <div className="flex items-center justify-center flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={40} className="text-green-500"/>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Activated!</h2>
            <p className="text-gray-500 mb-6">You now have full access to job leads for the next 30 days.</p>
            <button onClick={() => router.push("/tradie-jobs")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-sm transition-colors">
              View Job Leads →
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50">
      <TradieSidebar/>
      <main className="flex-1 flex flex-col min-w-0">
        <TradieTopbar/>
        <div className="p-8 max-w-5xl mx-auto w-full">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Plan</h1>
            <p className="text-gray-500">Subscribe to access unlimited job leads in your area</p>

            {/* Current status */}
            <div className="inline-flex items-center gap-3 mt-4 bg-white border border-gray-200 rounded-xl px-4 py-2">
              <span className="text-sm text-gray-600">Current plan:</span>
              <span className={`text-sm font-bold ${currentPlan === "Free" ? "text-orange-500" : "text-green-600"}`}>
                {currentPlan}
              </span>
              {currentPlan === "Free" && (
                <span className="text-xs text-red-500 font-semibold">
                  {3 - freeQuotes} free quote{3 - freeQuotes !== 1 ? "s" : ""} remaining
                </span>
              )}
              {expiry && currentPlan !== "Free" && (
                <span className="text-xs text-gray-400">
                  Expires: {new Date(expiry).toLocaleDateString("en-AU")}
                </span>
              )}
            </div>
          </div>

          {!selectedPlan ? (
            /* Plan selector */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {PLANS.map(plan => {
                const Icon = plan.icon;
                return (
                  <div key={plan.id}
                    className={`bg-white rounded-2xl border-2 p-6 relative ${
                      plan.recommended ? "border-orange-400 shadow-lg shadow-orange-100" : "border-gray-100"
                    }`}>
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Most Popular
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${plan.color}20` }}>
                        <Icon size={20} style={{ color: plan.color }}/>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{plan.name}</p>
                        <p className="text-xs text-gray-400">{plan.radius} · {plan.leads}</p>
                      </div>
                    </div>

                    <div className="mb-5">
                      <span className="text-4xl font-black text-gray-900">${plan.price}</span>
                      <span className="text-gray-400 text-sm">/month</span>
                    </div>

                    <div className="space-y-2 mb-6">
                      {plan.features.map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <Check size={14} className="text-green-500 flex-shrink-0"/>
                          <span className="text-sm text-gray-600">{f}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map(f => (
                        <div key={f} className="flex items-center gap-2 opacity-40">
                          <Check size={14} className="text-gray-300 flex-shrink-0"/>
                          <span className="text-sm text-gray-400 line-through">{f}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan.id, plan.price)}
                      disabled={loading || currentPlan === plan.name}
                      className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-50"
                      style={{ background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}>
                      {currentPlan === plan.name ? "Current Plan" : loading && selectedPlan === plan.id ? "Loading..." : `Get ${plan.name} →`}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Payment form */
            <div className="max-w-md mx-auto">
              <button onClick={() => { setSelectedPlan(null); setClientSecret(""); }}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 mb-6 text-sm">
                <ArrowLeft size={16}/> Back to plans
              </button>

              <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Selected plan</p>
                  <p className="font-bold text-gray-900 capitalize">{selectedPlan} Plan</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-gray-900">${amount}</p>
                  <p className="text-xs text-gray-400">/month · 30 days access</p>
                </div>
              </div>

              {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
                  <PaymentForm
                    plan={selectedPlan}
                    amount={amount}
                    onSuccess={() => setSuccess(true)}
                  />
                </Elements>
              )}
            </div>
          )}

          {/* Free tier note */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              🎉 New tradies get <span className="font-bold text-orange-500">3 free quotes</span> before subscribing.
              You have used {freeQuotes}/3.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
