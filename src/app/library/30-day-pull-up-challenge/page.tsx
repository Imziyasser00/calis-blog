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
    CheckCircle2,
    Gauge,
    Target,
    Clock,
    Sparkles,
} from "lucide-react";
import Image from "next/image";

const SITE_URL = "https://www.calishub.com";
const SLUG = "30-day-pull-up-challenge";
const COVER_URL = "/pdfs/covers/30-day-pull-up-challenge.jpg";

const CANONICAL = `${SITE_URL}/library/${SLUG}`;

// IMPORTANT: put the PDF in /public/pdfs/ with a clean filename (no spaces)
const PDF_URL = "/pdfs/30-day-pull-up-challenge.pdf";

export const metadata: Metadata = {
    title: "30-Day Pull-Up Challenge: Tracker + Program (PDF) | CalisHub",
    description:
        "Download the 30-Day Pull-Up Challenge: a beginner + intermediate tracker and program with A/B/C days, strict form checklist, and progress tests on Day 1, 15, and 30.",
    alternates: { canonical: CANONICAL },
    keywords: [
        "30 day pull up challenge pdf",
        "pull up tracker pdf",
        "pull up program beginner",
        "pull up program intermediate",
        "calisthenics pull up challenge",
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
        title: "30-Day Pull-Up Challenge: Tracker + Program (Free PDF)",
        description:
            "A 30-day pull-up tracker + program for beginner & intermediate levels. Weekly rhythm, strict form cues, and progress tests.",
    },
    twitter: {
        card: "summary_large_image",
        title: "30-Day Pull-Up Challenge (Free PDF) | CalisHub",
        description:
            "Download a 30-day pull-up tracker + program with beginner and intermediate tracks.",
    },
};

export default function PullUpChallenge30DayPage() {
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
                name: "30-Day Pull-Up Challenge",
                item: CANONICAL,
            },
        ],
    };

    const creativeWorkLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: "30-Day Pull-Up Challenge: Tracker + Program",
        url: CANONICAL,
        description:
            "A 30-day pull-up program + tracker with beginner (0–3 pull-ups) and intermediate (4–10 pull-ups) tracks, weekly rhythm, warm-up, strict form checklist, and progress tests on Day 1, 15, and 30.",
        about: ["calisthenics", "pull-ups", "strength training", "workout tracker"],
        learningResourceType: "Workout program",
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
                        PDF guide • Beginner + Intermediate • 30-day tracker
                    </div>

                    <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
                        {/* Left */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                                30-Day{" "}
                                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                  Pull-Up Challenge
                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-white/65">
                                A 30-day tracker + program with two levels:{" "}
                                <span className="text-white/80">
                  Beginner (0–3 pull-ups) and Intermediate (4–10 pull-ups)
                </span>
                                . Built around a simple weekly rhythm (A/B/C + Rest), strict form
                                cues, warm-up, and progress tests on Day 1, Day 15, and Day 30.
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
                                <Chip icon={<Target className="h-4 w-4" />} text="Beginner + Intermediate tracks" />
                                <Chip icon={<Gauge className="h-4 w-4" />} text="A/B/C days + strict form rules" />
                                <Chip icon={<Clock className="h-4 w-4" />} text="Progress tests: Day 1 / 15 / 30" />
                            </div>
                        </div>

                        {/* Right: summary box */}
                        <aside className="rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-white/40">
                                Quick summary
                            </p>
                            <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                {/* ✅ Responsive aspect ratios: mobile = 3/4, tablet = 4/5, desktop = 16/10 */}
                                <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[16/10]">
                                    <Image
                                        src={COVER_URL}
                                        alt="30-Day Pull-Up Challenge cover"
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 1024px) 100vw, 360px"
                                        priority
                                    />
                                </div>

                                {/* subtle readable overlay */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                            </div>



                            <ul className="mt-3 space-y-3 text-sm text-white/70">
                                <InfoRow label="Level" value="Beginner (0–3) + Intermediate (4–10)" />
                                <InfoRow label="Format" value="PDF (printable + iPad friendly)" />
                                <InfoRow label="Length" value="~39 pages" />
                                <InfoRow label="Includes" value="Tracker, warm-up, form checklist, daily logs" />
                            </ul>

                            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-purple-300" />
                                <p className="text-sm text-white/70">
                                    You’ll follow a repeatable weekly rhythm and log each session.
                                    The PDF also includes mid-way and final tests plus a completion
                                    certificate.
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
                                A structured 30-day plan you can track day-by-day (GoodNotes /
                                Notability compatible) with clear rules and tests.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <FeatureCard
                            title="How it works + weekly rhythm"
                            desc="Pick your level (Beginner or Intermediate), then follow A/B/C days with built-in rest."
                            bullets={[
                                "Beginner: 0–3 pull-ups",
                                "Intermediate: 4–10 pull-ups",
                                "A = Volume, B = Strength, C = Technique",
                                "REST = Recovery",
                            ]}
                        />
                        <FeatureCard
                            title="Program overview + warm-up"
                            desc="A simple program outline plus a short warm-up you repeat before every session."
                            bullets={[
                                "Warm-up: scap pull-ups, dead hangs, circles",
                                "Easy warm-up set far from failure",
                                "Clear A/B/C intent each day",
                                "Simple rest guidance",
                            ]}
                        />
                        <FeatureCard
                            title="Tracking pages + progress tests"
                            desc="Daily session logs, recovery check-ins, and progress tests on Day 1 / 15 / 30."
                            bullets={[
                                "Daily logs (volume/strength/technique)",
                                "Form + RPE + notes",
                                "Recovery days with reflection",
                                "Final reflection + certificate page",
                            ]}
                        />
                    </div>
                </section>

                {/* Who it's for / How to use */}
                <section className="mx-auto max-w-6xl mt-16 grid gap-10 lg:grid-cols-2">
                    <div>
                        <h2 className="text-2xl font-bold">Who this guide is for</h2>
                        <p className="mt-2 text-white/60">
                            For anyone who wants a clear 30-day structure, without guessing.
                        </p>

                        <ul className="mt-4 space-y-3 text-sm text-white/70">
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                <span>You want more pull-ups but need a plan + a tracker.</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                <span>You’re between 0 and 10 strict pull-ups (two tracks included).</span>
                            </li>
                            <li className="flex gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                <span>You want strict form rules so progress isn’t fake reps.</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold">How to use this PDF</h2>
                        <p className="mt-2 text-white/60">
                            Treat it like a 30-day contract with yourself. Follow the rhythm,
                            log the sessions, and test at the checkpoints.
                        </p>

                        <div className="mt-5 grid gap-4">
                            <StepRow
                                step="Step 1"
                                title="Choose your level"
                                desc="Beginner (0–3 pull-ups) or Intermediate (4–10). Pick the track that matches your strict max."
                            />
                            <StepRow
                                step="Step 2"
                                title="Follow the weekly rhythm"
                                desc="Repeat the A/B/C days with rest days included. Stay 1 rep before failure most days."
                            />
                            <StepRow
                                step="Step 3"
                                title="Test and compare"
                                desc="Test your strict max on Day 1, Day 15, and Day 30. Fill the final reflection and keep going."
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
                                    Download the 30-day tracker & get future guides.
                                </h2>
                                <p className="mt-2 text-white/70">
                                    Grab the PDF now, and optionally join the newsletter to get
                                    notified when new guides drop.
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
                id="ld-breadcrumbs-library-30day-pullup"
                type="application/ld+json"
                strategy="beforeInteractive"
            >
                {JSON.stringify(breadcrumbLd)}
            </Script>
            <Script
                id="ld-creativework-30day-pullup"
                type="application/ld+json"
                strategy="beforeInteractive"
            >
                {JSON.stringify(creativeWorkLd)}
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
