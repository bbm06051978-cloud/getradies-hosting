import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar/>

      {/* Hero */}
      <section className="bg-[#060d4a] py-16 pt-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Cookie Policy</h1>
          <p className="text-blue-200 text-sm">Last updated: July 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-10 text-gray-600 text-sm leading-relaxed">

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">1. What Are Cookies?</h2>
              <p>Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, keep you logged in and understand how you use the platform. GeTradie uses cookies and similar technologies to provide a better experience.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">2. Types of Cookies We Use</h2>

              <div className="space-y-6 mt-2">
                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">🔒 Essential Cookies</h3>
                  <p className="mb-2">These cookies are required for GeTradie to function. Without them you cannot log in, post jobs or receive quotes. They cannot be disabled.</p>
                  <table className="w-full text-xs border-collapse mt-2">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-2 rounded-tl">Cookie</th>
                        <th className="text-left p-2">Purpose</th>
                        <th className="text-left p-2 rounded-tr">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">token</td>
                        <td className="p-2">Keeps you logged in securely</td>
                        <td className="p-2">7 days</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">session_id</td>
                        <td className="p-2">Manages your current session</td>
                        <td className="p-2">Session</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">csrf_token</td>
                        <td className="p-2">Protects against cross-site request forgery</td>
                        <td className="p-2">Session</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">📊 Analytics Cookies</h3>
                  <p className="mb-2">These cookies help us understand how users interact with GeTradie so we can improve the platform. All data is aggregated and anonymous.</p>
                  <table className="w-full text-xs border-collapse mt-2">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-2 rounded-tl">Cookie</th>
                        <th className="text-left p-2">Purpose</th>
                        <th className="text-left p-2 rounded-tr">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">_ga</td>
                        <td className="p-2">Google Analytics — distinguishes users</td>
                        <td className="p-2">2 years</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">_gid</td>
                        <td className="p-2">Google Analytics — identifies session</td>
                        <td className="p-2">24 hours</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">⚙️ Preference Cookies</h3>
                  <p className="mb-2">These cookies remember your settings and preferences to personalise your experience on GeTradie.</p>
                  <table className="w-full text-xs border-collapse mt-2">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-2 rounded-tl">Cookie</th>
                        <th className="text-left p-2">Purpose</th>
                        <th className="text-left p-2 rounded-tr">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">ui_theme</td>
                        <td className="p-2">Remembers display preferences</td>
                        <td className="p-2">1 year</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">dismissed_banner</td>
                        <td className="p-2">Tracks dismissed notifications</td>
                        <td className="p-2">30 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 mb-2">💳 Payment Cookies</h3>
                  <p className="mb-2">These cookies are set by Stripe, our payment processor. They are essential for secure payment processing and fraud prevention.</p>
                  <table className="w-full text-xs border-collapse mt-2">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-2 rounded-tl">Cookie</th>
                        <th className="text-left p-2">Purpose</th>
                        <th className="text-left p-2 rounded-tr">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">__stripe_mid</td>
                        <td className="p-2">Stripe fraud prevention</td>
                        <td className="p-2">1 year</td>
                      </tr>
                      <tr className="border-t border-gray-200">
                        <td className="p-2 font-mono">__stripe_sid</td>
                        <td className="p-2">Stripe session identifier</td>
                        <td className="p-2">30 minutes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">3. How to Control Cookies</h2>
              <p>You can control cookies through your browser settings:</p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>
              <p className="mt-3 text-orange-600 font-medium">⚠️ Note: Disabling essential cookies will prevent you from logging in and using GeTradie&apos;s core features.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">4. Third-Party Cookies</h2>
              <p>Some cookies on GeTradie are set by third-party services we use:</p>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li><strong>Stripe</strong> — Payment processing and fraud prevention</li>
                <li><strong>Google Analytics</strong> — Platform usage analytics</li>
              </ul>
              <p className="mt-2">These third parties have their own privacy policies governing their use of cookies. We recommend reviewing their policies for more information.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">5. Cookie Consent</h2>
              <p>When you first visit GeTradie, you will be asked to accept or decline non-essential cookies. Essential cookies are always active as they are required for the platform to function. You can change your cookie preferences at any time through your browser settings.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">6. Changes to This Policy</h2>
              <p>We may update this Cookie Policy from time to time. We will notify you of significant changes via the platform. Your continued use of GeTradie after changes constitutes acceptance of the updated policy.</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">7. Contact Us</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <p><strong>GeTradie Pty Ltd</strong></p>
                <p>Email: privacy@getradie.com.au</p>
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
