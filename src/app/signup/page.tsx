import Logo from "../components/Logo";
import Link from "next/link";

export const metadata = {
  title: "What Is IVF? Step-by-Step Beginner's Guide to IVF Treatment | HealthcareAnswer.com",
  description:
    "Learn how IVF works, IVF success rates, risks, costs, and treatment steps in this complete beginner-friendly guide.",
};

/* ─────────────────────────────────────────────
   Small reusable components
───────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold text-[#1B2A6B] mt-10 mb-3 pb-2 border-b-2 border-[#2E8FD8]">
      {children}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-700 text-[15px] leading-relaxed">
          <span className="mt-1.5 w-2 h-2 rounded-full bg-[#7B2D8E] flex-shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50 hover:border-[#2E8FD8] transition-colors">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1B2A6B] text-white flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div>
        <p className="font-semibold text-[#1B2A6B] text-[15px]">{title}</p>
        <p className="text-gray-600 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function InfoBox({
  title,
  children,
  color = "blue",
}: {
  title: string;
  children: React.ReactNode;
  color?: "blue" | "purple" | "red";
}) {
  const styles = {
    blue:   "border-[#2E8FD8] bg-blue-50",
    purple: "border-[#7B2D8E] bg-purple-50",
    red:    "border-[#C82030] bg-red-50",
  };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-4 ${styles[color]}`}>
      <p className="font-bold text-sm uppercase tracking-wide text-gray-500 mb-1">{title}</p>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */

export default function IVFPage() {
  const ivfSteps = [
    { title: "Ovarian Stimulation",  description: "Fertility medicines stimulate the ovaries to produce multiple eggs." },
    { title: "Egg Retrieval",        description: "Doctors collect mature eggs from the ovaries via a minor surgical procedure." },
    { title: "Sperm Collection",     description: "A sperm sample is collected from the male partner or a donor." },
    { title: "Fertilization",        description: "Eggs and sperm are combined in a laboratory dish." },
    { title: "Embryo Development",   description: "Fertilized embryos are monitored and cultured for 3–5 days." },
    { title: "Embryo Transfer",      description: "Healthy embryos are transferred into the uterus." },
    { title: "Pregnancy Test",       description: "A blood test confirms pregnancy approximately two weeks later." },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── HEADER (matches main page) ── */}
      <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex flex-col">
            <Logo />
            <p className="text-sm text-gray-500 mt-1">Trusted Health Knowledge Platform</p>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-[#1B2A6B] transition-colors">Home</Link>
            <Link href="/ivf" className="text-[#7B2D8E] font-semibold border-b-2 border-[#7B2D8E] pb-0.5">IVF</Link>
            <Link href="#" className="hover:text-[#1B2A6B] transition-colors">Fertility</Link>
            <Link href="#" className="hover:text-[#1B2A6B] transition-colors">Find Clinics</Link>
            <Link href="#" className="hover:text-[#1B2A6B] transition-colors">Compare Costs</Link>
          </nav>

          <Link
            href="#"
            className="hidden md:inline-flex items-center gap-2 bg-[#1B2A6B] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#7B2D8E] transition-colors"
          >
            Get Free Quote
          </Link>
        </div>
      </header>

      {/* ── BREADCRUMB ── */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <p className="text-sm text-gray-400">
          <Link href="/" className="hover:text-[#1B2A6B]">Home</Link>
          {" / "}
          <Link href="#" className="hover:text-[#1B2A6B]">IVF & Fertility</Link>
          {" / "}
          <span className="text-gray-600">What Is IVF?</span>
        </p>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">

        {/* ── LEFT: Article ── */}
        <article>

          {/* Category tag */}
          <span className="inline-block bg-purple-100 text-[#7B2D8E] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            IVF &amp; Fertility
          </span>

          {/* Article title */}
          <h1 className="text-4xl font-extrabold text-[#1B2A6B] leading-tight mb-4">
            What Is IVF?<br />
            <span className="text-[#7B2D8E]">Complete Beginner&apos;s Guide</span> to In Vitro Fertilization
          </h1>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-y border-gray-100 py-3 mb-6">
            <span>📋 Medically Reviewed</span>
            <span>·</span>
            <span>🕒 8 min read</span>
            <span>·</span>
            <span>Last updated: May 2025</span>
            <span>·</span>
            <span className="text-[#C82030] font-medium">Sources: WHO · Mayo Clinic · NHS</span>
          </div>

          {/* Introduction */}
          <InfoBox title="Quick Summary" color="blue">
            <p className="text-sm text-gray-700 leading-relaxed">
              IVF (In Vitro Fertilization) combines eggs and sperm outside the body. Once fertilization
              occurs, the embryo is transferred into the uterus. It is one of the most effective
              fertility treatments for couples facing infertility.
            </p>
          </InfoBox>

          <p className="text-gray-700 leading-relaxed mt-4">
            In Vitro Fertilization (IVF) is one of the most effective fertility treatments available
            today. Millions of couples worldwide use IVF to overcome infertility challenges and achieve
            pregnancy. IVF has helped many couples dealing with infertility due to age, blocked fallopian
            tubes, low sperm count, hormonal disorders, or unexplained fertility problems.
          </p>

          {/* Who needs IVF */}
          <SectionHeading>Who May Need IVF?</SectionHeading>
          <p className="text-gray-700 text-sm leading-relaxed">
            Doctors may recommend IVF for patients with any of the following conditions:
          </p>
          <BulletList
            items={[
              "Blocked fallopian tubes",
              "Low sperm count",
              "Endometriosis",
              "Ovulation disorders",
              "Polycystic Ovary Syndrome (PCOS)",
              "Unexplained infertility",
              "Age-related fertility decline",
              "Genetic disorders requiring preimplantation genetic testing",
            ]}
          />

          {/* Step by step */}
          <SectionHeading>Step-by-Step IVF Process</SectionHeading>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            A typical IVF cycle takes 4–6 weeks from start to pregnancy test. Here is what each step involves:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ivfSteps.map((step, i) => (
              <StepCard
                key={i}
                number={i + 1}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>

          {/* Success rates */}
          <SectionHeading>IVF Success Rate</SectionHeading>
          <InfoBox title="Key Insight" color="purple">
            <p className="text-sm text-gray-700">
              Women under 35 generally have the highest IVF success rates — typically 40–50% per cycle
              at accredited clinics.
            </p>
          </InfoBox>
          <p className="text-gray-700 text-sm leading-relaxed mt-2">
            IVF success depends on multiple factors:
          </p>
          <BulletList
            items={[
              "Age of the patient",
              "Egg quality and ovarian reserve",
              "Sperm quality and motility",
              "Overall health and BMI",
              "Lifestyle habits (smoking, alcohol, stress)",
            ]}
          />

          {/* Risks */}
          <SectionHeading>Risks and Side Effects</SectionHeading>
          <InfoBox title="Important" color="red">
            <p className="text-sm text-gray-700">
              Always discuss potential risks with your fertility specialist before beginning an IVF cycle.
              Most side effects are mild and temporary.
            </p>
          </InfoBox>
          <BulletList
            items={[
              "Multiple pregnancy (twins or more)",
              "Ovarian Hyperstimulation Syndrome (OHSS)",
              "Emotional stress and anxiety",
              "Mild abdominal pain or bloating",
              "Rare complications during egg retrieval",
            ]}
          />

          {/* Cost */}
          <SectionHeading>IVF Cost in India</SectionHeading>
          <div className="bg-gradient-to-r from-[#1B2A6B] to-[#7B2D8E] rounded-xl p-6 my-4 text-white">
            <p className="text-sm uppercase tracking-widest font-semibold opacity-80 mb-2">Estimated Cost Range</p>
            <p className="text-4xl font-extrabold">₹1.5L – ₹3L</p>
            <p className="text-sm opacity-80 mt-1">per IVF cycle in India (2025)</p>
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">Cost varies depending on:</p>
          <BulletList
            items={[
              "Clinic reputation and accreditation",
              "City (metro cities tend to cost more)",
              "Medication protocols used",
              "Additional procedures (PGT, donor eggs, ICSI)",
            ]}
          />

          {/* Tips */}
          <SectionHeading>Tips to Improve IVF Success</SectionHeading>
          <BulletList
            items={[
              "Maintain a healthy weight (BMI 18.5–24.9)",
              "Avoid smoking and alcohol completely",
              "Eat a balanced, nutrient-rich diet",
              "Reduce stress through yoga, meditation, or counselling",
              "Follow your doctor's medication schedule carefully",
            ]}
          />

          {/* Conclusion */}
          <SectionHeading>Conclusion</SectionHeading>
          <p className="text-gray-700 leading-relaxed">
            IVF has transformed fertility treatment and provided hope to millions of couples across the
            world. Understanding the IVF process helps patients make informed decisions and prepare
            emotionally and financially for treatment. If you are considering IVF, use
            HealthcareAnswer.com to compare clinics, understand costs, and connect with verified
            fertility specialists near you.
          </p>

          {/* Sources */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
              Sources &amp; Medical References
            </p>
            <ul className="space-y-1 text-sm text-gray-500">
              {[
                "World Health Organization (WHO) — Infertility Guidelines",
                "Mayo Clinic Fertility Resources",
                "Cleveland Clinic Fertility Guidelines",
                "NHS Fertility Information",
              ].map((src, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[#2E8FD8]">↗</span>
                  {src}
                </li>
              ))}
            </ul>
          </div>
        </article>

        {/* ── RIGHT: Sidebar ── */}
        <aside className="space-y-6">

          {/* CTA card */}
          <div className="bg-gradient-to-br from-[#1B2A6B] to-[#7B2D8E] rounded-2xl p-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">Free Service</p>
            <h3 className="text-xl font-extrabold leading-snug mb-3">
              Compare IVF Clinics &amp; Get Cost Quotes
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Get cost estimates from top fertility clinics near you — completely free.
            </p>
            <Link
              href="#"
              className="block text-center bg-white text-[#7B2D8E] font-bold text-sm py-3 rounded-xl hover:bg-gray-100 transition-colors"
            >
              Get Free IVF Quote →
            </Link>
          </div>

          {/* Quick facts */}
          <div className="border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              IVF Quick Facts
            </h3>
            <div className="space-y-3">
              {[
                { label: "Cycle Duration",   value: "4–6 weeks" },
                { label: "Success Rate",     value: "40–50% (under 35)" },
                { label: "Cost in India",    value: "₹1.5L – ₹3L" },
                { label: "Clinics in India", value: "3,000+" },
                { label: "Couples Affected", value: "27.5 million" },
              ].map((fact, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-gray-500">{fact.label}</span>
                  <span className="font-bold text-[#1B2A6B]">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related articles */}
          <div className="border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Related Articles
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                "IUI vs IVF — Which is Right for You?",
                "ICSI Treatment Explained",
                "IVF with Donor Eggs in India",
                "How to Choose an IVF Clinic",
                "PCOS and Fertility Treatment Options",
              ].map((article, i) => (
                <li key={i}>
                  <Link href="#" className="text-[#1B2A6B] hover:text-[#7B2D8E] hover:underline leading-snug">
                    {article}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-400 leading-relaxed border border-gray-100">
            <span className="font-bold text-gray-500">Medical Disclaimer:</span> This article is for
            informational purposes only. It is not a substitute for professional medical advice,
            diagnosis, or treatment. Always consult a qualified fertility specialist.
          </div>
        </aside>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <Logo />
            <p className="text-xs text-gray-400 mt-2">© 2025 HealthcareAnswer.com · All rights reserved</p>
          </div>
          <p className="text-xs text-gray-400 text-center md:text-right max-w-sm">
            HealthcareAnswer.com is a health information and lead generation platform.
            We do not provide medical diagnosis or treatment advice.
          </p>
        </div>
      </footer>

    </div>
  );
}
