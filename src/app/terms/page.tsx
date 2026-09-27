import Link from "next/link";

export const metadata = {
  title: "Terms of Service | GeTradie",
  description: "The terms that apply when you use GeTradie as a homeowner or tradie.",
};

// ─── UPDATE THESE ONCE GeTradie Pty Ltd IS REGISTERED ───────────────
const ENTITY = "GeTradie";
const ABN = "[ABN to be added]";
const SUPPORT_EMAIL = "support@getradie.com.au";
const LAST_UPDATED = "27 September 2026";
const DISPUTE_DAYS = 3;
// ────────────────────────────────────────────────────────────────────

type Section = { title: string; body: (string | string[])[] };

const sections: Section[] = [
  {
    title: "1. About these Terms",
    body: [
      `These Terms of Service ("Terms") govern your use of the GeTradie website, mobile app and related services (the "Platform"), operated by ${ENTITY} (ABN ${ABN}) ("GeTradie", "we", "us", "our").`,
      "By creating an account or using the Platform, you agree to these Terms and our Privacy Policy. If you do not agree, do not use the Platform.",
      "You must be at least 18 years old and able to enter into a legally binding contract to use the Platform.",
    ],
  },
  {
    title: "2. What GeTradie does",
    body: [
      "GeTradie is an online marketplace that connects homeowners who need work done (\"Homeowners\") with independent tradespeople (\"Tradies\").",
      "GeTradie is not a party to any contract for work between a Homeowner and a Tradie. Tradies are independent businesses, not employees, agents or contractors of GeTradie. The Tradie is solely responsible for the quality, safety, legality and completion of the work they perform.",
      "GeTradie does not perform, supervise or guarantee any trade work.",
    ],
  },
  {
    title: "3. Accounts",
    body: [
      "You must provide accurate, current and complete information when you register and keep it up to date.",
      "You are responsible for keeping your login details secure and for all activity on your account. Tell us immediately at " + SUPPORT_EMAIL + " if you suspect unauthorised use.",
      "Each person or business may hold only one account of each type unless we agree otherwise.",
    ],
  },
  {
    title: "4. AI price estimates",
    body: [
      "The Platform may provide an instant price estimate generated with artificial intelligence (\"AI Estimate\"), and AI tools to help write job descriptions and quotes.",
      "AI Estimates are indicative guides only, based on the information provided and general market data. They are not quotes, offers or guarantees of price. The final price is the quote agreed between the Homeowner and the Tradie.",
      "You are responsible for checking any AI-generated content before relying on or submitting it.",
    ],
  },
  {
    title: "5. Homeowners",
    body: [
      "Posting a job and receiving quotes is free for Homeowners.",
      "You must describe the job accurately, including photos where relevant, and have the right to authorise work at the job location.",
      "Each job may receive quotes from a limited number of Tradies. You are free to accept, decline or ignore any quote.",
      "When you accept a quote, you must pay the Lock Amount described in section 7 to confirm the booking.",
    ],
  },
  {
    title: "6. Tradies",
    body: [
      "You must hold, and keep current, all licences, registrations, qualifications and insurance required by law for the work you quote on, including any licence required by NSW Fair Trading or the equivalent authority in your state.",
      "You authorise us to verify your licence, insurance, ABN and identity details, and you agree to provide supporting documents on request. Verification is a point-in-time check only and does not mean GeTradie endorses or guarantees your work.",
      "Quotes must be genuine, include all material costs you expect to charge, and comply with the Australian Consumer Law and any applicable home building laws (including written contract and deposit requirements).",
      "You are responsible for your own tax, GST, superannuation and workers' compensation obligations.",
      "You must only quote on jobs within your service area and trade category.",
    ],
  },
  {
    title: "7. Lock Amount and payments",
    body: [
      "When a Homeowner accepts a quote, the Homeowner pays a lock amount (\"Lock Amount\") through the Platform to confirm the booking. The Lock Amount tiers are shown on the Platform at the time of booking.",
      "The Lock Amount forms part of the agreed quote price. The Homeowner pays the remaining balance directly to the Tradie, as agreed between them.",
      "Payments are processed by our payment provider, Stripe. GeTradie does not store your full card details.",
      "The Lock Amount is held until the job is marked complete. " +
        `If no dispute is raised within ${DISPUTE_DAYS} days after the job is marked complete, the Lock Amount, less GeTradie's fixed platform fee for that tier, is released to the Tradie.`,
      "GeTradie's fixed platform fee for each Lock Amount tier is displayed before payment.",
      "Tradies earn GeTradie Points for completed jobs. Points are a loyalty and reputation feature only. They have no cash value, cannot be transferred, and may be adjusted or withdrawn in cases of error, fraud or breach of these Terms.",
    ],
  },
  {
    title: "8. Cancellations and refunds",
    body: [
      "A Homeowner may cancel a booking before work starts. The Lock Amount will be refunded, less GeTradie's fixed platform fee, unless the Tradie has already incurred costs agreed with the Homeowner.",
      "If a Tradie cancels a booking, the Lock Amount is refunded to the Homeowner in full and the job is reopened for new quotes.",
      "Repeated late cancellations may result in account restrictions.",
      "Nothing in this section limits any refund or remedy you are entitled to under the Australian Consumer Law.",
    ],
  },
  {
    title: "9. Disputes",
    body: [
      `If you are not satisfied with a job, you must raise a dispute through the Platform within ${DISPUTE_DAYS} days after the job is marked complete, with details and any photos.`,
      "While a dispute is open, the Lock Amount is held. GeTradie will review the information from both parties and may decide to release all, part or none of the Lock Amount to either party. We will act reasonably and in good faith, but our decision relates only to the Lock Amount.",
      "GeTradie's dispute process does not replace your legal rights. You may also contact NSW Fair Trading (or your state equivalent) or pursue other remedies against the other party.",
    ],
  },
  {
    title: "10. Tradie subscriptions",
    body: [
      "Tradies may send a limited number of free quotes. After that, a paid subscription is required to continue quoting.",
      "Subscription plans, prices and inclusions are shown on the Platform before you subscribe. Subscriptions renew automatically at the end of each billing period until cancelled.",
      "You can cancel at any time. Cancellation takes effect at the end of the current billing period, and no partial refunds are given except where required by law.",
      "We will give you at least 30 days' notice of any price increase to your subscription.",
    ],
  },
  {
    title: "11. Contact details and communication",
    body: [
      "To protect privacy, a Homeowner's and a Tradie's phone numbers are only shown to each other while a booking is active. Email addresses are not displayed.",
      "Use the in-app chat for job communication where possible so there is a record if a dispute arises.",
      "You must not use another user's contact details for any purpose other than the booked job, and must not take a job arranged through GeTradie off the Platform to avoid fees.",
    ],
  },
  {
    title: "12. Reviews",
    body: [
      "Only Homeowners with a completed booking may review a Tradie.",
      "Reviews must be honest, based on genuine experience, and must not be defamatory, offensive, or offered or requested in exchange for any benefit.",
      "We may remove reviews that breach these Terms or the law, but we do not edit reviews to change their meaning.",
    ],
  },
  {
    title: "13. Prohibited conduct",
    body: [
      "You must not:",
      [
        "provide false, misleading or fraudulent information, licences or documents",
        "harass, threaten, discriminate against or abuse any person",
        "post unlawful, offensive or infringing content",
        "use the Platform for any unlawful purpose",
        "scrape, copy, reverse-engineer or interfere with the Platform or its security",
        "create fake accounts, fake jobs or fake quotes",
      ],
    ],
  },
  {
    title: "14. Your content",
    body: [
      "You keep ownership of the content you upload (such as photos, job descriptions and reviews).",
      "You grant GeTradie a non-exclusive, royalty-free licence to use, store, display and process that content to operate, improve and promote the Platform.",
      "You confirm you have the right to upload the content and that it does not infringe anyone's rights.",
    ],
  },
  {
    title: "15. Suspension and termination",
    body: [
      "You may close your account at any time from your settings or by contacting us.",
      "We may suspend or close your account, or remove content, if you breach these Terms, if we reasonably suspect fraud or unsafe conduct, or if required by law. Where reasonable, we will tell you why.",
      "Sections that by their nature should survive termination (including payments owed, disputes, liability and governing law) continue to apply.",
    ],
  },
  {
    title: "16. Australian Consumer Law",
    body: [
      "Our services come with guarantees that cannot be excluded under the Australian Consumer Law. Nothing in these Terms excludes, restricts or modifies any right or remedy you have under the Australian Consumer Law or any other law that cannot lawfully be excluded.",
    ],
  },
  {
    title: "17. Liability",
    body: [
      "To the extent permitted by law, GeTradie is not liable for the work performed by Tradies, the conduct of any user, or any loss arising from a contract between a Homeowner and a Tradie.",
      "To the extent permitted by law, GeTradie is not liable for any indirect or consequential loss, or loss of profit, revenue or data.",
      "Where our liability for a failure to comply with a consumer guarantee cannot be excluded but can be limited, our liability is limited to supplying the services again or paying the cost of having them supplied again.",
      "Subject to the above, our total liability to you in connection with the Platform is limited to the fees you paid to GeTradie in the 12 months before the claim arose.",
    ],
  },
  {
    title: "18. Indemnity",
    body: [
      "To the extent permitted by law, you indemnify GeTradie against claims, losses and costs arising from your breach of these Terms, your breach of law, or (for Tradies) the work you perform, except to the extent caused by GeTradie's own negligence or breach.",
    ],
  },
  {
    title: "19. Changes to these Terms",
    body: [
      "We may update these Terms from time to time. If a change materially affects you, we will notify you by email or in-app at least 14 days before it takes effect. Continuing to use the Platform after that date means you accept the updated Terms.",
    ],
  },
  {
    title: "20. Governing law",
    body: [
      "These Terms are governed by the laws of New South Wales, Australia. You and GeTradie submit to the non-exclusive jurisdiction of the courts of New South Wales.",
    ],
  },
  {
    title: "21. Contact us",
    body: [`${ENTITY}, Parramatta NSW 2150. Email: ${SUPPORT_EMAIL}`],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-10 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
              <div className="mt-3 space-y-3 text-slate-700 leading-relaxed">
                {s.body.map((item, i) =>
                  Array.isArray(item) ? (
                    <ul key={i} className="list-disc pl-6 space-y-1">
                      {item.map((li) => (
                        <li key={li}>{li}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={i}>{item}</p>
                  )
                )}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-10 text-sm text-slate-500">
          See also our{" "}
          <Link href="/privacy" className="text-blue-600 underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
