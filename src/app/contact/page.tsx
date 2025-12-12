import "server-only"
import Link from "next/link"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import type { Metadata } from "next"
import { Mail, MessageSquare, ShieldCheck } from "lucide-react"

const SITE_URL = "https://www.calishub.com"

export const metadata: Metadata = {
    title: "Contact · CalisHub",
    description:
        "Contact CalisHub for questions, feedback, collaborations, or suggestions about calisthenics training and content.",
    alternates: {
        canonical: `${SITE_URL}/contact`,
    },
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/contact`,
        title: "Contact · CalisHub",
        description:
            "Get in touch with CalisHub. Questions, feedback, or collaboration ideas are welcome.",
    },
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-14">
                {/* Intro */}
                <section className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm text-purple-400">
            <MessageSquare className="h-4 w-4" />
            Contact
          </span>
                    <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">
                        Get in touch with CalisHub
                    </h1>
                    <p className="mt-4 text-white/60">
                        Questions, feedback, ideas, or collaboration proposals?
                        We read every message and reply when it makes sense.
                    </p>
                </section>

                {/* Contact cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20">
                    {/* Email */}
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
                        <div className="flex items-center gap-3 text-purple-400 mb-3">
                            <Mail className="h-5 w-5" />
                            <h2 className="font-semibold">Email</h2>
                        </div>
                        <p className="text-white/60 mb-4 text-sm">
                            For questions, feedback, or general contact.
                        </p>
                        <Link
                            href="mailto:contact@calishub.com"
                            className="inline-flex items-center rounded-lg border border-purple-500 px-4 py-2 text-purple-400 hover:bg-purple-950/50 transition"
                        >
                            contact@calishub.com
                        </Link>
                    </div>

                    {/* Collaboration */}
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
                        <div className="flex items-center gap-3 text-purple-400 mb-3">
                            <MessageSquare className="h-5 w-5" />
                            <h2 className="font-semibold">Collaborations</h2>
                        </div>
                        <p className="text-white/60 text-sm">
                            Coaches, creators, brands, or projects aligned with smart
                            calisthenics are welcome to reach out.
                        </p>
                    </div>

                    {/* Trust */}
                    <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6">
                        <div className="flex items-center gap-3 text-purple-400 mb-3">
                            <ShieldCheck className="h-5 w-5" />
                            <h2 className="font-semibold">Privacy-first</h2>
                        </div>
                        <p className="text-white/60 text-sm">
                            We don’t sell emails or spam.
                            See our{" "}
                            <Link href="/privacy" className="text-purple-400 hover:underline">
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="max-w-3xl mx-auto text-center">
                    <div className="rounded-2xl border border-purple-500/40 bg-purple-500/5 p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-semibold">
                            Want better calisthenics progress?
                        </h3>
                        <p className="text-white/60 mt-2">
                            Read our latest guides or subscribe for new workouts and progressions.
                        </p>
                        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/blog"
                                className="rounded-lg border border-gray-800 px-4 py-2 text-gray-300 hover:border-purple-500/60 hover:text-white"
                            >
                                Read articles
                            </Link>
                            <Link
                                href="/#newsletter"
                                className="rounded-lg border border-purple-500 px-4 py-2 text-purple-400 hover:bg-purple-950/50"
                            >
                                Subscribe
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
