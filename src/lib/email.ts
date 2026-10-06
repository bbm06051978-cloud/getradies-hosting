// Shared email helpers (Resend). Used by booking and dispute notifications.

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function emailWrap(heading: string, bodyHtml: string): string {
  return `
      <div style="font-family:Arial,sans-serif;padding:40px;max-width:500px;margin:0 auto;">
        <div style="background:#0047AB;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:24px;">GeTradie</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
          <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">${heading}</h2>
          ${bodyHtml}
        </div>
        <div style="padding:20px;text-align:center;">
          <p style="color:#9CA3AF;font-size:12px;margin:0;">GeTradie Pty Ltd &bull; Parramatta NSW 2150 &bull; getradie.com.au</p>
        </div>
      </div>
    `;
}

export function emailPara(html: string): string {
  return `<p style="color:#6B7280;font-size:15px;line-height:1.6;">${html}</p>`;
}

const BOX_TONES = {
  green: { bg: "#F0FDF4", border: "#10B981", text: "#065F46" },
  blue:  { bg: "#EFF6FF", border: "#0047AB", text: "#1E3A8A" },
  amber: { bg: "#FFFBEB", border: "#F59E0B", text: "#92400E" },
  red:   { bg: "#FEF2F2", border: "#EF4444", text: "#991B1B" },
} as const;

export function emailBox(html: string, tone: keyof typeof BOX_TONES = "green"): string {
  const t = BOX_TONES[tone];
  return `<div style="background:${t.bg};border-left:4px solid ${t.border};border-radius:8px;padding:14px 16px;margin:20px 0;">
            <p style="color:${t.text};font-size:13px;line-height:1.5;margin:0;">${html}</p>
          </div>`;
}

// Returns true when Resend accepted the email. Never throws.
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "GeTradie <noreply@getradie.com.au>", to, subject, html }),
    });
    if (!res.ok) {
      console.error("Email not accepted:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Email error:", err);
    return false;
  }
}
