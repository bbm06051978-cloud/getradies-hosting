import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>

      {/* Hero */}
      <section className="bg-[#060d4a] py-16 pt-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-blue-200 text-sm">Last updated: July 2026 · Governed by the laws of New South Wales, Australia</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-10 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. Introduction</h2>
              <p>Welcome to GeTradie. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the GeTradie platform operated by GeTradie Pty Ltd (&ldquo;GeTradie&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By accessing or using GeTradie, you agree to be bound by these Terms.</p>
              <p className="mt-2">If you do not agree to these Terms, you must not use our platform. These Terms constitute a legally binding agreement between you and GeTradie Pty Ltd.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Eligibility</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>You must be at least 18 years of age to use GeTradie</li>
                <li>You must be located in Australia</li>
                <li>Tradies must hold valid licences and insurance required by Australian law for their trade</li>
                <li>You must provide accurate and truthful information when registering</li>
                <li>You must not have been previously banned from GeTradie</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. Nature of the Platform — Marketplace Only</h2>
              <p>GeTradie operates solely as an online marketplace that introduces homeowners to independent tradies. GeTradie is <strong>not</strong> a party to any service agreement formed between a homeowner and a tradie through the platform.</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>GeTradie does not employ, engage, or supervise tradies in any capacity</li>
                <li>Tradies are independent contractors, not employees or agents of GeTradie</li>
                <li>GeTradie does not guarantee the quality, safety, legality, or suitability of any work performed</li>
                <li>GeTradie verifies tradie credentials by cross-referencing information provided against publicly available government licensing and registration databases. However, GeTradie cannot guarantee the real-time accuracy of government databases or that a tradie&apos;s licence remains valid after the time of verification</li>
                <li>Any contract for services is formed directly between the homeowner and the tradie</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Platform Availability — No Uptime Guarantee</h2>
              <p>GeTradie provides the platform on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. GeTradie makes no warranty that the platform will be:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Available at all times or uninterrupted</li>
                <li>Free from errors, bugs or security vulnerabilities</li>
                <li>Timely, secure or error-free</li>
                <li>Compatible with all devices or browsers</li>
              </ul>
              <p className="mt-3">GeTradie relies on third party infrastructure including Amazon Web Services (AWS), Stripe and OpenAI. GeTradie is not liable for any failures, outages or errors originating from these third party services.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Force Majeure</h2>
              <p>GeTradie is not liable for any failure or delay in performance resulting from causes beyond its reasonable control including but not limited to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Acts of God, natural disasters, floods, fires or earthquakes</li>
                <li>Government restrictions, regulations or actions</li>
                <li>Internet, network or telecommunications failures</li>
                <li>Cyberattacks, data breaches or distributed denial of service attacks</li>
                <li>Third party service provider failures including AWS, Stripe and OpenAI</li>
                <li>Power failures or outages</li>
                <li>Pandemic, epidemic or public health emergency</li>
                <li>Industrial disputes or strikes</li>
              </ul>
              <p className="mt-2">In the event of a force majeure event, GeTradie&apos;s obligations shall be suspended for the duration of the event.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Service Disruption — Tradie Credits</h2>
              <p>In the event of platform unavailability exceeding 24 continuous hours that is directly caused by GeTradie (excluding force majeure events and third party failures), GeTradie&apos;s sole obligation and liability shall be to provide affected tradie subscribers with a pro-rata credit against their next subscription period.</p>
              <p className="mt-2">No cash refund or compensation for lost income, job leads, business opportunity or any other consequential loss shall be payable by GeTradie in connection with platform unavailability.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Property Damage Disclaimer</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-3">
                <p className="font-semibold text-orange-800 mb-2">⚠️ Important — Please Read Carefully</p>
                <p className="text-orange-700">GeTradie is not liable for any property damage, personal injury, financial loss or any other loss or damage arising from or in connection with services performed by tradies found through the GeTradie platform.</p>
              </div>
              <p>Specifically, GeTradie accepts no responsibility for:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Physical damage to property, fixtures, fittings or belongings during or after service delivery</li>
                <li>Poor workmanship, incomplete work or work not meeting expected standards</li>
                <li>Personal injury to any person arising from tradie conduct or negligence</li>
                <li>Loss of use of property or consequential losses arising from tradie services</li>
                <li>Any damage caused by tradies who misrepresented their credentials</li>
              </ul>
              <p className="mt-3"><strong>Homeowners are strongly advised to:</strong></p>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                <li>Request and verify proof of public liability insurance from tradies before work commences</li>
                <li>Ensure tradies hold the required licences for their trade in your state or territory</li>
                <li>Obtain a written quote and scope of works before authorising any work</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
              <p>To the maximum extent permitted by the Australian Consumer Law (Schedule 2 of the Competition and Consumer Act 2010) and other applicable laws:</p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3 mb-3">
                <p className="font-semibold text-blue-900 mb-2">Liability Cap</p>
                <p className="text-blue-800">GeTradie&apos;s total aggregate liability to any user for any claim arising out of or relating to these Terms or use of the platform shall not exceed the greater of:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-blue-800">
                  <li>(a) The total fees paid by that user to GeTradie in the 12 months immediately preceding the claim, OR</li>
                  <li>(b) AUD $500 minimum</li>
                </ul>
              </div>
              <p className="mt-2 font-semibold text-gray-800">Lock Amount Protection for Tradies</p>
              <p className="mt-1">Notwithstanding the above liability cap, GeTradie shall return any lock amount wrongly withheld from a tradie in full, regardless of the liability cap amount.</p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li>GeTradie is not liable for any indirect, incidental, special, consequential, punitive or exemplary damages</li>
                <li>GeTradie is not liable for loss of profits, loss of income, loss of data, loss of goodwill or business interruption</li>
                <li>GeTradie is not liable for loss of job leads or business opportunity arising from platform unavailability</li>
              </ul>
              <p className="mt-3 text-xs text-gray-500">Note: Nothing in these Terms excludes, restricts or modifies any right or remedy, or any guarantee, warranty or other term or condition implied or imposed by the Australian Consumer Law that cannot lawfully be excluded or limited. This limitation does not apply to liability for personal injury caused by GeTradie&apos;s negligence.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">9. No Class Action</h2>
              <p>To the maximum extent permitted by Australian law, users agree to bring any claims against GeTradie only in their individual capacity. Users agree not to participate as a plaintiff, class member or representative in any:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Class action proceeding under Part IVA of the Federal Court of Australia Act 1976</li>
                <li>Consolidated or representative proceeding</li>
                <li>Group litigation against GeTradie</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">Note: This clause operates to the maximum extent permitted by the Australian Consumer Law. It does not prevent users from lodging complaints with the ACCC, state consumer protection agencies or the Australian Financial Complaints Authority (AFCA) where applicable.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">10. Independent Contractor Clause</h2>
              <p>All tradies on the GeTradie platform are independent contractors. Nothing in these Terms creates or implies:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>An employment relationship between GeTradie and any tradie</li>
                <li>A partnership, joint venture or agency relationship</li>
                <li>Any obligation on GeTradie to supervise, direct or control tradie services</li>
              </ul>
              <p className="mt-2">Tradies are solely responsible for their own tax obligations, superannuation, insurance and compliance with all applicable laws including the Fair Work Act 2009 and relevant state-based licensing legislation.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">11. Tradie Insurance Requirements</h2>
              <p>All tradies registering on GeTradie must:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Hold a minimum of $5,000,000 (five million dollars) public liability insurance at all times while listed on the platform</li>
                <li>Hold all licences required by law for their nominated trade in their state or territory</li>
                <li>Notify GeTradie immediately if their insurance lapses, is cancelled or their licence is suspended or revoked</li>
                <li>Provide proof of insurance and licensing to homeowners upon request</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">12. Tradie Indemnity</h2>
              <p>Each tradie agrees to indemnify, defend and hold harmless GeTradie Pty Ltd, its officers, directors, employees and agents from and against any and all claims, damages, losses, costs and expenses (including reasonable legal fees) arising out of or relating to:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>The tradie&apos;s performance of or failure to perform any services</li>
                <li>Any property damage, personal injury or financial loss caused by the tradie</li>
                <li>The tradie&apos;s breach of these Terms</li>
                <li>Any misrepresentation regarding qualifications, licences or insurance</li>
                <li>Any claim by a homeowner arising from the tradie&apos;s conduct</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">13. Dispute Resolution — Mandatory Process</h2>
              <p>Before commencing any legal proceedings against GeTradie, users must first exhaust GeTradie&apos;s internal dispute resolution process:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Disputes must be raised within 7 days of the relevant event via the GeTradie platform</li>
                <li>GeTradie will act as a neutral mediator and aim to resolve disputes within 48 hours</li>
                <li>Both parties must participate in good faith in the resolution process</li>
                <li>GeTradie&apos;s dispute resolution decision is final for lock amount disbursement</li>
                <li>If the internal process fails, parties may seek resolution through the relevant state consumer tribunal (e.g. NSW Civil and Administrative Tribunal — NCAT)</li>
              </ul>
              <p className="mt-2">This mandatory process does not prevent either party from seeking urgent injunctive relief from a court.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">14. For Homeowners</h2>
              <h3 className="text-base font-semibold text-gray-800 mb-2">14.1 Posting Jobs</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Job postings must be genuine and accurate</li>
                <li>You must not post jobs for illegal activities</li>
                <li>You must be the property owner or have authority to commission the work</li>
              </ul>
              <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">14.2 Lock Amount & Payments</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>The lock amount ($50–$500) is a security deposit held by GeTradie</li>
                <li>The lock amount forms part of the total job cost</li>
                <li>The remaining job balance is paid directly to the tradie after completion</li>
                <li>GeTradie deducts a fixed platform fee from the lock amount</li>
                <li>Lock amounts are non-refundable once a job is confirmed complete by the homeowner</li>
              </ul>
              <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">14.3 Job Confirmation</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>You must confirm job completion within 7 days of the tradie marking it done</li>
                <li>If not confirmed within 7 days, GeTradie may automatically release the lock amount to the tradie</li>
                <li>If you are unsatisfied, you must raise a dispute before confirming completion</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">15. For Tradies</h2>
              <h3 className="text-base font-semibold text-gray-800 mb-2">15.1 Subscriptions</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tradie subscriptions are billed monthly and auto-renew unless cancelled</li>
                <li>New tradies receive 3 free quotes before subscription is required</li>
                <li>No refunds for partial subscription periods</li>
              </ul>
              <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2">15.2 Payments to Tradies</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Lock amount minus GeTradie fee is released upon job confirmation</li>
                <li>The remaining job balance is collected directly from the homeowner</li>
                <li>GeTradie is not responsible for the homeowner&apos;s direct payment</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">16. Australian Consumer Law</h2>
              <p>Nothing in these Terms excludes, restricts or modifies:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Any consumer guarantee under the Australian Consumer Law</li>
                <li>Any right to seek compensation under the Australian Consumer Law</li>
                <li>GeTradie&apos;s obligations under the Competition and Consumer Act 2010 (Cth)</li>
                <li>Any liability that cannot be lawfully excluded under applicable Australian legislation</li>
              </ul>
              <p className="mt-2">Where GeTradie supplies services as a consumer within the meaning of the Australian Consumer Law, GeTradie&apos;s liability for failure to comply with a consumer guarantee is limited to resupplying the services or paying the cost of having the services resupplied.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">17. Electronic Transactions</h2>
              <p>By accepting these Terms electronically, you acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Your electronic acceptance constitutes a valid and binding agreement under the Electronic Transactions Act 1999 (Cth)</li>
                <li>Electronic signatures have the same legal effect as handwritten signatures</li>
                <li>Electronic communications satisfy any legal requirement for written notice</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">18. Prohibited Conduct</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Post false, misleading or fraudulent information</li>
                <li>Harass, abuse or threaten other users</li>
                <li>Circumvent GeTradie by arranging transactions outside the platform to avoid fees</li>
                <li>Create multiple accounts or impersonate others</li>
                <li>Use the platform for any unlawful purpose</li>
                <li>Solicit reviews from users who have not used your services</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">19. Governing Law & Jurisdiction</h2>
              <p>These Terms are governed by the laws of New South Wales, Australia. Any disputes that cannot be resolved through the mandatory dispute resolution process shall be subject to the exclusive jurisdiction of the courts of New South Wales, including the NSW Civil and Administrative Tribunal (NCAT) for consumer matters.</p>
              <p className="mt-2">These Terms do not exclude any rights under the Australian Consumer Law, the Competition and Consumer Act 2010 (Cth), or any other applicable Australian legislation.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">20. Changes to Terms</h2>
              <p>GeTradie may update these Terms at any time. We will notify you of material changes via email or platform notification with at least 14 days notice. Your continued use of GeTradie after the effective date constitutes acceptance of the updated Terms.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">21. Contact</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <p><strong>GeTradie Pty Ltd</strong></p>
                <p>Email: legal@getradie.com.au</p>
                <p>Disputes: disputes@getradie.com.au</p>
                <p>Website: getradie.com.au/contact</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
