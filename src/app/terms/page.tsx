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

// Body item types:
//   string         → plain paragraph
//   string[]       → bullet list
//   { sub: string; body: BodyItem[] }  → subsection heading + its own body
type BodyItem = string | string[] | { sub: string; body: BodyItem[] };
type Section = { title: string; body: BodyItem[] };

function RenderBody({ items }: { items: BodyItem[] }) {
  return (
    <>
      {items.map((item, i) => {
        if (typeof item === "string") {
          return <p key={i} className="text-slate-700 leading-relaxed">{item}</p>;
        }
        if (Array.isArray(item)) {
          return (
            <ul key={i} className="list-disc pl-6 space-y-1 text-slate-700">
              {item.map((li) => <li key={li}>{li}</li>)}
            </ul>
          );
        }
        // subsection
        return (
          <div key={i} className="mt-4">
            <h3 className="text-base font-semibold text-slate-800 mb-2">{item.sub}</h3>
            <div className="space-y-2 pl-2">
              <RenderBody items={item.body} />
            </div>
          </div>
        );
      })}
    </>
  );
}

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
      "Businesses that register on GeTradie to offer the services of more than one tradesperson under a single account are \"Agencies\" and must also comply with section 11.",
    ],
  },
  {
    title: "3. Accounts",
    body: [
      "You must provide accurate, current and complete information when you register and keep it up to date.",
      `You are responsible for keeping your login details secure and for all activity on your account. Tell us immediately at ${SUPPORT_EMAIL} if you suspect unauthorised use.`,
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
    title: "6. Tradies — individual registration",
    body: [
      "This section applies to Tradies who register individually. Tradies listed by an Agency are covered by section 11.",
      "You must hold, and keep current, all licences, registrations, qualifications and insurance required by law for the work you quote on, including any licence required by NSW Fair Trading or the equivalent authority in your state. You must hold a minimum of $5,000,000 public liability insurance at all times while listed on the Platform.",
      "You authorise us to verify your licence, insurance, ABN and identity details, and you agree to provide supporting documents on request. Verification is a point-in-time check only and does not mean GeTradie endorses or guarantees your work.",
      "You must notify GeTradie immediately if your insurance lapses or your licence is suspended or revoked.",
      "Quotes must be genuine, include all material costs you expect to charge, and comply with the Australian Consumer Law and any applicable home building laws (including written contract and deposit requirements).",
      "You are responsible for your own tax, GST, superannuation and workers' compensation obligations.",
      "You must only quote on jobs within your service area and trade category.",
    ],
  },
  {
    title: "7. Lock Amount and payments",
    body: [
      "When a Homeowner accepts a quote, the Homeowner pays a lock amount (\"Lock Amount\") through the Platform to confirm the booking. The Lock Amount tiers are shown on the Platform at the time of booking.",
      "The Lock Amount forms part of the agreed quote price. The Homeowner pays the remaining balance directly to the Tradie (or Agency), as agreed between them.",
      "Payments are processed by our payment provider, Stripe. GeTradie does not store your full card details.",
      `The Lock Amount is held until the job is marked complete. If no dispute is raised within ${DISPUTE_DAYS} days after the job is marked complete, the Lock Amount, less GeTradie's fixed platform fee for that tier, is released to the Tradie or Agency.`,
      "GeTradie's fixed platform fee for each Lock Amount tier is displayed before payment.",
      "Tradies earn GeTradie Points for completed jobs. Points are a loyalty and reputation feature only. They have no cash value, cannot be transferred, and may be adjusted or withdrawn in cases of error, fraud or breach of these Terms.",
    ],
  },
  {
    title: "8. Cancellations and refunds",
    body: [
      "Either the Homeowner or the Tradie (or Agency) may cancel a booking through the Platform at any time before the Tradie confirms it, and after that until 12 hours before the start time confirmed by the Tradie. If no start time has been confirmed, the booking may be cancelled until the job is marked done.",
      "When a booking is cancelled within these times, the Lock Amount is refunded to the Homeowner in full, including GeTradie's platform fee. If the Tradie or Agency cancels, the job is reopened for new quotes.",
      "From 12 hours before the confirmed start time a booking can no longer be cancelled through the Platform. If something goes wrong after that point, either party may raise a dispute under section 9.",
      "Repeated late cancellations may result in account restrictions.",
      "Nothing in this section limits any refund or remedy you are entitled to under the Australian Consumer Law.",
    ],
  },
  {
    title: "9. Disputes",
    body: [
      `Either the Homeowner or the Tradie (or Agency) may raise a dispute through the Platform from 12 hours before the confirmed start time (or from when the booking is confirmed, if no start time has been set) until ${DISPUTE_DAYS} days after the Tradie marks the job done. You must choose a reason and describe what happened. Please try to resolve the issue with the other party by chat or phone first, and keep your messages and photos as evidence.`,
      `If the Homeowner does not confirm completion or raise a dispute within ${DISPUTE_DAYS} days after the Tradie marks the job done, the job is treated as complete and can no longer be disputed through the Platform.`,
      "A report that the Tradie did not arrive, or that the Homeowner was not available or did not give access, can be made from one hour after the confirmed start time.",
      "The other party has 48 hours to respond (24 hours for a report that someone did not attend). If they accept the dispute, it is resolved in favour of the party who raised it, except that GeTradie decides the amount where a Tradie reports that the Homeowner was not available. If a Tradie does not respond within 24 hours to a report that they did not arrive at a confirmed start time, the Lock Amount is refunded to the Homeowner in full.",
      "The party who raised a dispute may withdraw it at any time before it is resolved, and the booking then continues.",
      "While a dispute is open, the Lock Amount is held. In all other cases GeTradie will review the information from both parties and may decide to refund all or part of the Lock Amount to the Homeowner, or release all or part of it to the Tradie or Agency. A full refund includes GeTradie's platform fee. Where all or part of the Lock Amount is released to the Tradie or Agency, GeTradie's platform fee is deducted from that share. We will act reasonably and in good faith, and will give both parties the reason for the decision, but our decision relates only to the Lock Amount.",
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
    title: "11. Agencies — Registration, Individual Tradie Verification & Liability",
    body: [
      {
        sub: "11.1 Definition",
        body: [
          "An \"Agency\" is a business entity (whether a sole trader, partnership, company or other structure) that registers on GeTradie to offer the services of more than one tradesperson under its business account. An Agency is an independent business. Nothing in these Terms creates an employment, partnership or agency relationship between GeTradie and an Agency or its personnel.",
        ],
      },
      {
        sub: "11.2 Agency registration requirements",
        body: [
          "To register and remain listed as an Agency, the business must:",
          [
            "hold a valid Australian Business Number (ABN) and, where applicable, an Australian Company Number (ACN)",
            "hold a valid business or contractor licence appropriate to its trade, where required by law",
            "hold public liability insurance covering its business operations of no less than $5,000,000",
            "nominate an authorised representative responsible for the Agency's account and compliance with these Terms",
          ],
        ],
      },
      {
        sub: "11.3 Individual Tradie Verification — Agency's sole responsibility",
        body: [
          "GeTradie verifies the Agency's own business-level credentials (ABN, business licence and business insurance) as described in section 3.",
          "The Agency is solely responsible for verifying, before listing or assigning any individual tradesperson on the Platform, that the person:",
          [
            "holds a valid personal trade licence or qualification required by law to perform the relevant trade in that state or territory",
            "is covered by public liability insurance (whether under the Agency's policy or their own) of no less than $5,000,000",
            "has a legal right to work in Australia",
            "is, so far as the Agency can reasonably ascertain, suitable to attend a homeowner's property",
          ],
          "The Agency must keep records of each verification and provide them to GeTradie within 48 hours of a request.",
          "The Agency must immediately stop assigning any individual tradesperson whose licence, insurance or right to work lapses, is suspended or is revoked, and must notify GeTradie within 24 hours of becoming aware of this.",
          "Assigning an unverified or unlisted individual to a job is a material breach of these Terms and may result in immediate suspension or termination of the Agency's account.",
        ],
      },
      {
        sub: "11.4 Display to Homeowners",
        body: [
          "Where a job is fulfilled through an Agency, GeTradie will display to the Homeowner the Agency's business name together with GeTradie's verification of the Agency's business-level credentials, and the name of the individual tradesperson attending the job with a statement that the individual's licence, insurance and suitability have been verified by the Agency under this section 11, and have not been independently verified by GeTradie unless GeTradie expressly states otherwise.",
        ],
      },
      {
        sub: "11.5 Agency indemnity",
        body: [
          "Each Agency agrees to indemnify and hold harmless GeTradie, its officers, directors, employees and agents from and against any and all claims, damages, losses, costs and expenses (including reasonable legal fees) arising out of or relating to:",
          [
            "any failure by the Agency to verify an individual tradesperson in accordance with clause 11.3",
            "any act, omission, negligence, misconduct or criminal conduct of an individual tradesperson listed or assigned by the Agency",
            "any misrepresentation by the Agency regarding the qualifications, licensing, insurance, identity or suitability of an individual tradesperson",
            "any other breach of this section 11 by the Agency",
          ],
          "Where a Tradie is listed by an Agency, the Agency's indemnity under this clause applies in addition to, and does not reduce or limit, the individual Tradie's own indemnity obligations under section 18.",
        ],
      },
      {
        sub: "11.6 GeTradie's right to audit",
        body: [
          "GeTradie reserves the right, but is not obliged, to periodically audit or spot-check the verification records and individual tradespeople listed by an Agency. The existence of this right does not reduce, remove or transfer any part of the Agency's responsibility under this section 11, and GeTradie's decision not to exercise this right does not constitute an acceptance of risk or liability by GeTradie.",
        ],
      },
    ],
  },
  {
    title: "12. Contact details and communication",
    body: [
      "To protect privacy, a Homeowner's and a Tradie's phone numbers are only shown to each other while a booking is active. Email addresses are not displayed.",
      "Use the in-app chat for job communication where possible so there is a record if a dispute arises.",
      "You must not use another user's contact details for any purpose other than the booked job, and must not take a job arranged through GeTradie off the Platform to avoid fees.",
    ],
  },
  {
    title: "13. Reviews",
    body: [
      "Only Homeowners with a completed booking may review a Tradie.",
      "Reviews must be honest, based on genuine experience, and must not be defamatory, offensive, or offered or requested in exchange for any benefit.",
      "We may remove reviews that breach these Terms or the law, but we do not edit reviews to change their meaning.",
    ],
  },
  {
    title: "14. Prohibited conduct",
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
    title: "15. Your content",
    body: [
      "You keep ownership of the content you upload (such as photos, job descriptions and reviews).",
      "You grant GeTradie a non-exclusive, royalty-free licence to use, store, display and process that content to operate, improve and promote the Platform.",
      "You confirm you have the right to upload the content and that it does not infringe anyone's rights.",
    ],
  },
  {
    title: "16. Suspension and termination",
    body: [
      "You may close your account at any time from your settings or by contacting us.",
      "We may suspend or close your account, or remove content, if you breach these Terms, if we reasonably suspect fraud or unsafe conduct, or if required by law. Where reasonable, we will tell you why.",
      "Sections that by their nature should survive termination (including payments owed, disputes, liability and governing law) continue to apply.",
    ],
  },
  {
    title: "17. Australian Consumer Law",
    body: [
      "Our services come with guarantees that cannot be excluded under the Australian Consumer Law. Nothing in these Terms excludes, restricts or modifies any right or remedy you have under the Australian Consumer Law or any other law that cannot lawfully be excluded.",
    ],
  },
  {
    title: "18. Liability",
    body: [
      "To the extent permitted by law, GeTradie is not liable for the work performed by Tradies or Agencies, the conduct of any user, or any loss arising from a contract between a Homeowner and a Tradie or Agency.",
      "To the extent permitted by law, GeTradie is not liable for any indirect or consequential loss, or loss of profit, revenue or data.",
      "Where our liability for a failure to comply with a consumer guarantee cannot be excluded but can be limited, our liability is limited to supplying the services again or paying the cost of having them supplied again.",
      "Subject to the above, our total liability to you in connection with the Platform is limited to the fees you paid to GeTradie in the 12 months before the claim arose.",
    ],
  },
  {
    title: "19. Indemnity",
    body: [
      "To the extent permitted by law, you indemnify GeTradie against claims, losses and costs arising from your breach of these Terms, your breach of law, or (for Tradies and Agencies) the work performed, except to the extent caused by GeTradie's own negligence or breach.",
    ],
  },
  {
    title: "20. Changes to these Terms",
    body: [
      "We may update these Terms from time to time. If a change materially affects you, we will notify you by email or in-app at least 14 days before it takes effect. Continuing to use the Platform after that date means you accept the updated Terms.",
    ],
  },
  {
    title: "21. Governing law",
    body: [
      "These Terms are governed by the laws of New South Wales, Australia. You and GeTradie submit to the non-exclusive jurisdiction of the courts of New South Wales.",
    ],
  },
  {
    title: "22. Contact us",
    body: [`${ENTITY}, Parramatta NSW 2150. Email: ${SUPPORT_EMAIL}`],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-10 shadow-sm">
        <div className="mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">← GeTradie — Australia's Only AI-Powered Tradie Marketplace</Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-8">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
              <div className="mt-3 space-y-3">
                <RenderBody items={s.body} />
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
