import "server-only";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Newsletter from "@calis/components/Newsletter";
import DownloadGate from "@calis/components/library/DownloadGate";
import {
    ArrowLeft,
    ArrowRight,
    FileText,
    Download,
    CheckCircle2,
    Gauge,
    Target,
    Clock,
    Sparkles,
} from "lucide-react";

const SITE_URL = "https://www.calishub.com";
const CANONICAL = `${SITE_URL}/library/pullup-passport`;
const PDF_URL = "/pdfs/beginner-strength-passport.pdf"; // 👈 adjust if filename is different

export const metadata: Metadata = {
    title: "Beginner Strength Passport: 3-Day Starter & Pull-Up Roadmap (PDF)",
    description:
        "Download the Beginner Strength Passport: a clean 3-day starter plan plus pull-up roadmap in one simple PDF. Built for real beginners with realistic progress.",
    alternates: { canonical: CANONICAL },
    keywords: [
        "pull up pdf",
        "beginner pull up program",
        "pull up roadmap pdf",
        "beginner workout pdf",
        "calisthenics starter guide",
    ],
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
    openGraph: {
        type: "article",
        url: CANONICAL,
        siteName: "CalisHub",
        title:
            "Beginner Strength Passport: 3-Day Starter & Pull-Up Roadmap (Free PDF)",
        description:
            "A simple, realistic PDF to help you start calisthenics, build upper body strength, and move toward your first pull-up.",
    },
    twitter: {
        card: "summary_large_image",
        title:
            "Beginner Strength Passport: 3-Day Starter & Pull-Up Roadmap (Free PDF)",
        description:
            "Download a clean, beginner-friendly pull-up roadmap with a 3-day starter plan you can actually follow.",
    },
};

export default function PullupPassportPage() {
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            {
                "@type": "ListItem",
                position: 2,
                name: "Training Library",
                item: `${SITE_URL}/library`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: "Beginner Strength Passport",
                item: CANONICAL,
            },
        ],
    };

    const productLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "Beginner Strength Passport: 3-Day Starter Plan & Pull-Up Roadmap",
        url: CANONICAL,
        description:
            "A beginner-friendly PDF guide combining a 3-day starter plan with a simple roadmap toward your first pull-up.",
        about: ["calisthenics", "pull-ups", "beginner workout"],
        learningResourceType: "Workout guide",
        isAccessibleForFree: true,
        inLanguage: "en",
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Background aura */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-purple-600/40" />
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-fuchsia-500/30" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.12),transparent_60%)]" />
            </div>

            <main className="container mx-auto px-4 py-12">
                {/* Back link */}
                <div className="mx-auto max-w-6xl mb-4">
                    <Link
                        href="/library"
                        className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white"
                    >
                        <ArrowLeft className="h-3 w-3" />
                        Back to library
                    </Link>
                </div>

                {/* Hero */}
                <section className="mx-auto max-w-6xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        PDF guide • Beginner-friendly • 3-day plan
                    </div>

                    <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
                        {/* Left */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                                Beginner Strength{" "}
                                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                  Passport
                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-white/65">
                                A simple 3-day starter plan plus pull-up roadmap in one PDF.
                                Built for real beginners who want structure, not punishment:
                                clean reps, realistic targets, and calm progression.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <DownloadGate
                                    pdfUrl={PDF_URL}
                                    buttonClassName="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                />


                                <a
                                    href="#inside"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    <FileText className="h-4 w-4" />
                                    See what&apos;s inside
                                </a>
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-white/55">
                                <Chip
                                    icon={<Target className="h-4 w-4" />}
                                    text="First pull-up in realistic steps"
                                />
                                <Chip
                                    icon={<Gauge className="h-4 w-4" />}
                                    text="Baseline tests + checkpoints"
                                />
                                <Chip
                                    icon={<Clock className="h-4 w-4" />}
                                    text="3 short sessions per week"
                                />
                            </div>
                        </div>

                        {/* Right: summary box */}
                        <aside className="rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-white/40">
                                Quick summary
                            </p>

                            <ul className="mt-3 space-y-3 text-sm text-white/70">
                                <InfoRow label="Level" value="Complete beginner" />
                                <InfoRow label="Format" value="PDF (A4, printable & phone-friendly)" />
                                <InfoRow label="Focus" value="Upper body, pull-up foundations, habits" />
                                <InfoRow label="Length" value="~8 pages" />
                            </ul>

                            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-purple-300" />
                                <p className="text-sm text-white/70">
                                    You&apos;ll know exactly what to do on Day 1, Day 2, and Day 3,
                                    plus how to repeat the plan and when to try your first real
                                    pull-up attempt.
                                </p>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* What's inside */}
                <section id="inside" className="mx-auto max-w-6xl mt-16">
                    <div className="flex items-end justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">What&apos;s inside the PDF</h2>
                            <p className="mt-2 text-white/60">
                                A small, structured guide you can actually finish. No fluff, no
                                30-page lecture.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <FeatureCard
                            title="Baseline check (Day 0)"
                            desc="A short self-test to measure dead hangs, scapular reps, negatives, and rows before you start."
                            bullets={[
                                "Dead hang timer",
                                "Scapular pull-up reps",
                                "Negative pull-up control",
                                "Row strength snapshot",
                            ]}
                        />
                        <FeatureCard
                            title="3-Day starter plan"
                            desc="Three repeatable sessions that mix strength, technique, and control without destroying your recovery."
                            bullets={[
                                "Day 1: Control & scapula",
                                "Day 2: Strength & grip",
                                "Day 3: Technique & pattern",
                            ]}
                        />
                        <FeatureCard
                            title="Pull-up roadmap"
                            desc="A simple 3-phase roadmap so you know when to push, when to repeat, and when to attempt your first pull-up."
                            bullets={[
                                "Control → Strength → First pull-up",
                                "Clear unlock targets",
                                "Habit checklist",
                                "Weekly routine suggestion",
                            ]}
                        />
                    </div>
                </section>

                {/* Who it's for / How to use */}
                <section className="mx-auto max-w-6xl mt-16 grid gap-10 lg:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold">Who this guide is for</h2>
                        <p className="mt-2 text-white/60">
                            This PDF is made for people who are tired of random workouts and
                            just want a calm, clear starting point.
                        </p>

                        <ul className="mt-4 space-y-3 text-sm text-white/70">
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                <span>You&apos;re new to calisthenics and don&apos;t know where to start.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                <span>
                  You want your first pull-up eventually, but right now even
                  hanging on the bar feels hard.
                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                <span>
                  You prefer a short PDF you can repeat, not a 200-exercise encyclopedia.
                </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">How to use this PDF</h2>
                        <p className="mt-2 text-white/60">
                            Think of it like a mini passport: you repeat stamps until you&apos;re
                            ready to move to the next phase.
                        </p>

                        <div className="mt-5 grid gap-4">
                            <StepRow
                                step="Step 1"
                                title="Print it or save it on your phone"
                                desc="Keep it somewhere you can see it before each session. Highlight or check off what you complete."
                            />
                            <StepRow
                                step="Step 2"
                                title="Run the 3 sessions each week"
                                desc="Aim for 3 sessions per week. Repeat the same 3 days for at least 2–4 weeks."
                            />
                            <StepRow
                                step="Step 3"
                                title="Retest and move along the roadmap"
                                desc="Use the roadmap targets to know when to progress your exercises or attempt your first real pull-up."
                            />
                        </div>
                    </div>
                </section>

                {/* CTA: download + newsletter */}
                <section className="mx-auto max-w-6xl mt-16">
                    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 text-purple-200">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-wider">
                    Next step
                  </span>
                                </div>
                                <h2 className="mt-2 text-2xl font-bold">
                                    Download the passport & get future guides.
                                </h2>
                                <p className="mt-2 text-white/70">
                                    Grab the Beginner Strength Passport now, and optionally join
                                    the newsletter to get new PDFs when they drop.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-3">
                                    <DownloadGate pdfUrl={PDF_URL} />

                                    <Link
                                        href="/library"
                                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/85 hover:bg-white/10 transition"
                                    >
                                        Back to library <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                            <div className="min-w-[280px] flex justify-center items-center">
                                <Newsletter />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* JSON-LD */}
            <Script
                id="ld-breadcrumbs-library-pullup"
                type="application/ld+json"
                strategy="beforeInteractive"
            >
                {JSON.stringify(breadcrumbLd)}
            </Script>
            <Script
                id="ld-creativework-pullup-passport"
                type="application/ld+json"
                strategy="beforeInteractive"
            >
                {JSON.stringify(productLd)}
            </Script>
        </div>
    );
}

/* ----------------- UI bits ----------------- */

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="text-purple-300">{icon}</span>
            <span>{text}</span>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <li className="flex gap-3 text-sm">
            <span className="text-white/45 min-w-[60px]">{label}</span>
            <span className="text-white/80">{value}</span>
        </li>
    );
}

function FeatureCard({
                         title,
                         desc,
                         bullets,
                     }: {
    title: string;
    desc: string;
    bullets: string[];
}) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="pointer-events-none absolute -inset-24 opacity-70">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(168,85,247,0.12),transparent_55%)]" />
            </div>

            <div className="relative">
                <div className="inline-flex items-center gap-2 text-purple-200 text-xs uppercase tracking-wider">
                    <FileText className="h-4 w-4" />
                    <span>Section</span>
                </div>
                <h3 className="mt-2 font-semibold text-lg">{title}</h3>
                <p className="mt-2 text-sm text-white/60">{desc}</p>
                <ul className="mt-4 space-y-2 text-sm text-white/60">
                    {bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                            <span>{b}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function StepRow({
                     step,
                     title,
                     desc,
                 }: {
    step: string;
    title: string;
    desc: string;
}) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs text-purple-200 uppercase tracking-wide">
                {step}
            </div>
            <h3 className="mt-1 font-semibold text-sm">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{desc}</p>
        </div>
    );
}
