import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>

      {/* Hero */}
      <section className="page-hero bg-[#060d4a] py-16 pt-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-blue-200 text-sm">Last updated: July 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-gray">

          <div className="space-y-10 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p>GeTradie Pty Ltd (&ldquo;GeTradie&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose and safeguard your information when you use our platform at getradie.com.au and our mobile application.</p>
              <p className="mt-2">By using GeTradie, you consent to the data practices described in this policy. If you do not agree with this policy, please do not use our services.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
              <p className="font-semibold text-gray-700 mb-2">Information you provide directly:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Name, email address, phone number and location (suburb/state)</li>
                <li>Profile information including business name, trade speciality and licence number (tradies)</li>
                <li>Job descriptions, photos and messages you post on the platform</li>
                <li>Payment information (processed securely by Stripe — we do not store card details)</li>
                <li>Reviews and ratings you submit</li>
              </ul>
              <p className="font-semibold text-gray-700 mt-4 mb-2">Information collected automatically:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and approximate location</li>
                <li>Pages visited, links clicked and time spent on platform</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>To provide and operate the GeTradie marketplace platform</li>
                <li>To match homeowners with suitable verified tradies in their area</li>
                <li>To process payments and manage booking transactions</li>
                <li>To verify tradie licences and credentials</li>
                <li>To send notifications about job leads, quotes, bookings and reviews</li>
                <li>To resolve disputes between homeowners and tradies</li>
                <li>To improve our AI estimate accuracy and platform features</li>
                <li>To send service updates and promotional communications (you can opt out)</li>
                <li>To comply with Australian legal obligations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Sharing Your Information</h2>
              <p>We share your information only in the following circumstances:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Between homeowners and tradies:</strong> Your name, suburb and job details are visible to tradies quoting on your job. Your contact details are shared only after a quote is accepted.</li>
                <li><strong>Service providers:</strong> We use Stripe for payments, Supabase for data storage, OpenAI for AI estimates and AWS for hosting. These providers process data on our behalf under strict data protection agreements.</li>
                <li><strong>Legal requirements:</strong> We may disclose information where required by Australian law, court orders or regulatory authorities.</li>
                <li><strong>Business transfers:</strong> In the event of a merger or acquisition, your data may be transferred to the new entity.</li>
              </ul>
              <p className="mt-3 font-semibold text-gray-700">We do not sell your personal information to advertisers or third parties.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Payment processing via Stripe (PCI DSS compliant)</li>
                <li>Encrypted storage of sensitive information</li>
                <li>Regular security audits and updates</li>
                <li>Access controls limiting who can view your data within GeTradie</li>
              </ul>
              <p className="mt-2">While we take all reasonable steps to protect your data, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Rights Under Australian Law</h2>
              <p>Under the Australian Privacy Act 1988 and Australian Privacy Principles, you have the right to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or outdated information</li>
                <li>Request deletion of your personal information (subject to legal obligations)</li>
                <li>Opt out of direct marketing communications</li>
                <li>Lodge a complaint with the Office of the Australian Information Commissioner (OAIC)</li>
              </ul>
              <p className="mt-2">To exercise these rights, contact us at support@getradie.com.au</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Cookies</h2>
              <p>We use cookies and similar technologies to improve your experience on GeTradie. These include:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Essential cookies:</strong> Required for the platform to function (authentication, session management)</li>
                <li><strong>Analytics cookies:</strong> Help us understand how users interact with the platform</li>
                <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="mt-2">You can control cookies through your browser settings. Disabling essential cookies may affect platform functionality.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Retention</h2>
              <p>We retain your data for as long as your account is active or as needed to provide services. When you delete your account:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Your profile and personal details are deleted within 30 days</li>
                <li>Completed job records may be retained for up to 7 years for tax and legal compliance</li>
                <li>Reviews you&apos;ve received or given may remain on the platform in anonymised form</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. Children&apos;s Privacy</h2>
              <p>GeTradie is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a minor, please contact us immediately.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the platform. Your continued use of GeTradie after changes constitutes acceptance of the updated policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
              <p>If you have questions about this Privacy Policy or our data practices, please contact:</p>
              <div className="mt-2 bg-gray-50 rounded-xl p-4">
                <p><strong>GeTradie Pty Ltd</strong></p>
                <p>Email: support@getradie.com.au</p>
                <p>Website: getradie.com.au/contact</p>
                <p>Response time: Within 5 business days</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}

