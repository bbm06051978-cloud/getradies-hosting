import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value || req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Not authenticated." }, { status: 401 });

  const decoded = verifyToken(token);
  if (!decoded) return NextResponse.json({ error: "Invalid token." }, { status: 401 });

  const { client, clientEmail, jobDesc, invoiceNo, date, due, lines, addGST, notes, subtotal, gstAmt, total } = await req.json();

  if (!clientEmail) return NextResponse.json({ error: "Client email is required." }, { status: 400 });

  // Get tradie info
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { name: true, email: true, tradieProfile: { select: { businessName: true } } },
  });

  const businessName = user?.tradieProfile?.businessName || user?.name || "GeTradie Tradie";
  const tradieEmail = user?.email || "";

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; max-width: 700px; margin: 40px auto; color: #111; font-size: 14px; }
        h1 { color: #F97316; margin: 0; }
        .header { display: flex; justify-content: space-between; margin-bottom: 32px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #F97316; color: white; padding: 10px; text-align: left; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
        .total-row td { font-weight: bold; font-size: 16px; color: #F97316; border-top: 2px solid #F97316; }
        .notes { background: #FFF7ED; border: 1px solid #FED7AA; border-radius: 8px; padding: 16px; margin-top: 20px; }
        .badge { background: #F97316; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>INVOICE</h1>
          <p style="color:#666;margin:4px 0">${invoiceNo}</p>
          <span class="badge">Powered by GeTradie</span>
        </div>
        <div style="text-align:right">
          <p><strong>${businessName}</strong></p>
          <p>Date: ${date}</p>
          ${due ? `<p>Due: ${due}</p>` : ""}
        </div>
      </div>

      <div style="margin-bottom:20px">
        <strong>Billed to:</strong><br/>
        ${client || "—"}
        ${clientEmail ? `<br/>${clientEmail}` : ""}
      </div>

      ${jobDesc ? `<div style="margin-bottom:20px"><strong>Job:</strong> ${jobDesc}</div>` : ""}

      <table>
        <thead>
          <tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr>
        </thead>
        <tbody>
          ${lines.map((l: any) => `
            <tr>
              <td>${l.desc}</td>
              <td>${l.qty}</td>
              <td>$${parseFloat(l.rate || "0").toFixed(2)}</td>
              <td>$${((parseFloat(l.qty) || 0) * (parseFloat(l.rate) || 0)).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div style="text-align:right;margin-top:8px">
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        ${addGST ? `<p>GST (10%): $${gstAmt.toFixed(2)}</p>` : ""}
        <p style="font-size:20px;font-weight:bold;color:#F97316">Total: $${total.toFixed(2)}</p>
      </div>

      ${notes ? `<div class="notes"><strong>Notes:</strong><br/>${notes}</div>` : ""}
    </body>
    </html>
  `;

  try {
    // Send to homeowner/client
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${businessName} via GeTradie <noreply@getradie.com.au>`,
        to: clientEmail,
        subject: `Invoice ${invoiceNo} from ${businessName}`,
        html: invoiceHTML,
      }),
    });

    // Send copy to tradie
    if (tradieEmail) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "GeTradie <noreply@getradie.com.au>",
          to: tradieEmail,
          subject: `[Copy] Invoice ${invoiceNo} sent to ${client}`,
          html: `<p>This is a copy of the invoice you sent via GeTradie.</p>${invoiceHTML}`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Invoice send error:", err);
    return NextResponse.json({ error: "Failed to send invoice." }, { status: 500 });
  }
}
