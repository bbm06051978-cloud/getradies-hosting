import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | GeTradie",
  description: "How GeTradie collects, uses, stores and protects your personal information.",
};

// ─── UPDATE THESE ONCE GeTradie Pty Ltd IS REGISTERED ───────────────
const ENTITY = "GeTradie";
const ABN = "[ABN to be added]";
const PRIVACY_EMAIL = "privacy@getradie.com.au";
const LAST_UPDATED = "27 September 2026";
// ────────────────────────────────────────────────────────────────────

type Section = { title: string; body: (string | string[])[] };

const sections: Section[] = [
  {
    title: "1. About this policy",
    body: [
      `${ENTITY} (ABN ${ABN}) ("GeTradie", "we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, disclose and protect your personal information when you use the GeTradie website and mobile app (the "Platform").`,
      "We handle personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs).",
    ],
  },
  {
    title: "2. Information we collect",
    body: [
      "All users:",
      [
        "name, email address, phone number, suburb, state and postcode",
        "login details (passwords are stored in encrypted, hashed form only)",
        "profile photo, if you add one",
        "messages sent through in-app chat",
        "device, browser, IP address and usage information, and push notification tokens",
      ],
      "Homeowners:",
      ["job descriptions, job photos and job location", "bookings, reviews and payment history"],
      "Tradies:",
      [
        "business name, ABN, trade category, service area and bio",
        "licence and insurance details and supporting documents for verification",
        "quotes, bookings, ratings, GeTradie Points and subscription details",
      ],
      "Payment card details are collected and processed directly by our payment provider, Stripe. We do not store your full card number.",
    ],
  },
  {
    title: "3. How we collect it",
    body: [
      "We collect information directly from you when you register, post a job, send a quote, chat, pay, leave a review or contact us.",
      "We may collect information from third parties, for example to verify a Tradie's licence or ABN through public registers, and from our payment provider about the status of payments.",
      "We collect some information automatically through cookies and similar technologies when you use the Platform.",
    ],
  },
  {
    title: "4. How we use it",
    body: [
      "We use your personal information to:",
      [
        "create and manage your account",
        "match Homeowners' jobs with suitable local Tradies",
        "generate AI price estimates, job descriptions and quote suggestions",
        "process Lock Amounts, subscriptions, refunds and releases of funds",
        "verify Tradies' licences, insurance and identity",
        "enable chat, bookings, notifications and reviews",
        "handle disputes, support requests and complaints",
        "detect and prevent fraud, misuse and security issues",
        "improve the Platform and understand how it is used",
        "send service messages, such as booking updates and password reset codes",
        "send marketing messages, where you have not opted out",
        "comply with our legal obligations",
      ],
    ],
  },
  {
    title: "5. What other users can see",
    body: [
      "A Tradie's business name, trade, service area, verification status, rating, reviews and public profile are visible to Homeowners.",
      "When a Tradie quotes on a job, the Tradie can see the job description, photos and general location.",
      "Phone numbers are shared between a Homeowner and a Tradie only while a booking is active (pending or confirmed). They are hidden once the booking is completed or cancelled.",
      "Email addresses are never displayed to other users.",
    ],
  },
  {
    title: "6. AI features",
    body: [
      "When you use AI features, the text you enter (such as a job description) is sent to our AI provider, OpenAI, to generate a response. Please do not include sensitive personal information in job descriptions.",
      "Our AI provider processes this data on our behalf and does not use it to train its models under our commercial API arrangements.",
      "AI outputs are suggestions only. No decision that has a significant legal effect on you is made solely by automated means.",
    ],
  },
  {
    title: "7. Who we share it with",
    body: [
      "We do not sell your personal information. We share it only as described in this policy, including with:",
      [
        "other users, as described in section 5",
        "Stripe, for payment processing",
        "Amazon Web Services (AWS), for hosting and file storage",
        "Supabase, for database hosting",
        "OpenAI, for AI features",
        "Resend, for sending emails",
        "Expo, for push notifications on mobile",
        "our professional advisers, such as lawyers and accountants",
        "government agencies, regulators or law enforcement where required or authorised by law",
        "a buyer or successor if GeTradie's business is sold or restructured",
      ],
    ],
  },
  {
    title: "8. Overseas disclosure",
    body: [
      "Our main database and hosting are located in Australia (Sydney region).",
      "Some of our service providers may store or process information overseas, including in the United States (Stripe, OpenAI, Expo) and Japan (Resend email service).",
      "We take reasonable steps to ensure these providers handle your information consistently with the Australian Privacy Principles.",
    ],
  },
  {
    title: "9. Security and retention",
    body: [
      "We take reasonable steps to protect your personal information from misuse, interference, loss and unauthorised access. These include encryption in transit, hashed passwords, access controls and private file storage with time-limited access links.",
      "No system is completely secure. If a data breach is likely to cause you serious harm, we will notify you and the Office of the Australian Information Commissioner (OAIC) as required under the Notifiable Data Breaches scheme.",
      "We keep personal information only for as long as needed for the purposes in this policy and to meet legal, tax and dispute-resolution obligations. We then delete or de-identify it.",
    ],
  },
  {
    title: "10. Cookies",
    body: [
      "We use cookies and similar technologies to keep you signed in, remember your preferences and understand how the Platform is used.",
      "You can control cookies through your browser settings, but some parts of the Platform may not work without them.",
    ],
  },
  {
    title: "11. Marketing",
    body: [
      "We may send you news and offers about GeTradie. Every marketing email includes an unsubscribe link, as required by the Spam Act 2003 (Cth).",
      "You will still receive essential service messages, such as booking and security notifications.",
      "You can manage push notifications in the app settings or on your device.",
    ],
  },
  {
    title: "12. Access, correction and deletion",
    body: [
      `You can view and update most of your information in your account settings. You may also ask us to access or correct your personal information by emailing ${PRIVACY_EMAIL}. We will respond within 30 days.`,
      "You can delete your account from the app settings or by contacting us. We may keep some information where required by law or to resolve open disputes or payments.",
    ],
  },
  {
    title: "13. Children",
    body: [
      "The Platform is intended for people aged 18 and over. We do not knowingly collect personal information from children.",
    ],
  },
  {
    title: "14. Complaints",
    body: [
      `If you have a privacy concern or complaint, email ${PRIVACY_EMAIL}. We will acknowledge it promptly and aim to resolve it within 30 days.`,
      "If you are not satisfied with our response, you can complain to the Office of the Australian Information Commissioner (OAIC) at oaic.gov.au or on 1300 363 992.",
    ],
  },
  {
    title: "15. Changes to this policy",
    body: [
      "We may update this policy from time to time. We will post the updated version on this page and, if the changes are significant, notify you by email or in-app.",
    ],
  },
  {
    title: "16. Contact us",
    body: [`${ENTITY}, Parramatta NSW 2150. Email: ${PRIVACY_EMAIL}`],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 sm:p-10 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Privacy Policy</h1>
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
          <Link href="/terms" className="text-blue-600 underline">
            Terms of Service
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
