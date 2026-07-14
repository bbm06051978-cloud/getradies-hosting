"use client";

import { useState } from "react";
import { Star, X, Send, CheckCircle } from "lucide-react";

type Props = {
  bookingId: string;
  tradieName: string;
  jobTitle: string;
  onClose: () => void;
  onSubmitted: () => void;
};

export function LeaveReview({ bookingId, tradieName, jobTitle, onClose, onSubmitted }: Props) {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [done, setDone]       = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { setError("Please select a star rating."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to submit review."); return; }
      setDone(true);
      setTimeout(() => { onSubmitted(); onClose(); }, 2000);
    } catch { setError("Something went wrong."); }
    finally { setLoading(false); }
  };

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        style={{ animation: "slideUp 0.22s cubic-bezier(.22,1,.36,1)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900">Leave a Review</h2>
            <p className="text-xs text-gray-400 mt-0.5">{tradieName} · {jobTitle}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X size={16} className="text-gray-500"/>
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={32} className="text-green-500"/>
              </div>
              <p className="font-bold text-gray-900 text-lg">Review Submitted!</p>
              <p className="text-gray-400 text-sm mt-1">Thank you for your feedback.</p>
            </div>
          ) : (
            <>
              {/* Star rating */}
              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">How would you rate this tradie?</p>
                <div className="flex justify-center gap-2 mb-2">
                  {[1,2,3,4,5].map(star => (
                    <button key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="transition-transform hover:scale-110">
                      <Star size={40}
                        className={`transition-colors ${
                          star <= (hover || rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        }`}/>
                    </button>
                  ))}
                </div>
                {(hover || rating) > 0 && (
                  <p className="text-sm font-bold text-yellow-600">{labels[hover || rating]}</p>
                )}
              </div>

              {/* Comment */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                  placeholder={`Tell others about your experience with ${tradieName}...`}
                  className="w-full border border-gray-200 focus:border-orange-400 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none transition-colors"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/500</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                  {error}
                </div>
              )}

              <button onClick={handleSubmit} disabled={loading || rating === 0}
                className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                style={{ background: "linear-gradient(135deg,#F97316,#EA580C)" }}>
                {loading
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Submitting...</>
                  : <><Send size={15}/>Submit Review</>}
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}
