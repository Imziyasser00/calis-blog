import "server-only"
import type { Metadata } from "next"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"

const SITE_URL = "https://www.calishub.com"
const CONTACT_EMAIL = "contact@calishub.com"

export const metadata: Metadata = {
    title: "Privacy Policy · CalisHub",
    description:
        "Learn how CalisHub collects, uses, and protects your personal data in compliance with GDPR.",
    alternates: {
        canonical: `${SITE_URL}/privacy`,
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <article className="max-w-3xl mx-auto prose prose-invert prose-purple">
                    <h1>Privacy Policy</h1>

                    <p className="text-white/60">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <p>
                        At <strong>CalisHub</strong>, your privacy matters. This page explains
                        what data we collect, why we collect it, and how we protect it — in
                        compliance with the General Data Protection Regulation (GDPR).
                    </p>

                    <h2>1. Data We Collect</h2>
                    <ul>
                        <li>
                            <strong>Email address</strong> when you subscribe to our newsletter
                        </li>
                        <li>
                            <strong>Anonymous usage data</strong> (pages visited, device type,
                            performance metrics)
                        </li>
                    </ul>

                    <p>
                        We do <strong>not</strong> collect sensitive personal data and we never
                        sell your information.
                    </p>

                    <h2>2. How We Use Your Data</h2>
                    <ul>
                        <li>To send training guides, updates, and new content</li>
                        <li>To improve site performance and user experience</li>
                        <li>To understand what content helps users the most</li>
                    </ul>

                    <h2>3. Cookies & Analytics</h2>
                    <p>
                        CalisHub may use privacy-friendly analytics tools to understand how
                        visitors use the site.
                    </p>
                    <ul>
                        <li>No advertising cookies</li>
                        <li>No cross-site tracking</li>
                        <li>No personal profiling</li>
                    </ul>

                    <h2>4. Data Retention</h2>
                    <p>
                        We keep your data only as long as necessary:
                    </p>
                    <ul>
                        <li>Email data is kept until you unsubscribe</li>
                        <li>Analytics data is aggregated and anonymized</li>
                    </ul>

                    <h2>5. Your Rights (GDPR)</h2>
                    <p>
                        As a user located in the European Union, you have the right to:
                    </p>
                    <ul>
                        <li>Access your personal data</li>
                        <li>Request correction or deletion</li>
                        <li>Withdraw consent at any time</li>
                    </ul>

                    <p>
                        You can unsubscribe anytime via the link in our emails or contact us
                        directly.
                    </p>

                    <h2>6. Third-Party Services</h2>
                    <p>
                        We may rely on trusted third-party services for:
                    </p>
                    <ul>
                        <li>Email delivery</li>
                        <li>Hosting and infrastructure</li>
                        <li>Anonymous analytics</li>
                    </ul>

                    <p>
                        These providers only process data on our behalf and comply with GDPR.
                    </p>

                    <h2>7. Contact</h2>
                    <p>
                        For any privacy-related questions or requests, you can contact us at:
                    </p>
                    <p>
                        <a href={`mailto:${CONTACT_EMAIL}`} className="text-purple-400">
                            {CONTACT_EMAIL}
                        </a>
                    </p>

                    <h2>8. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Any changes will
                        be reflected on this page.
                    </p>
                </article>
            </main>

            <Footer />
        </div>
    )
}
