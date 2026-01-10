import "server-only";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Newsletter from "@calis/components/Newsletter";
import {
    ArrowRight,
    FileText,
    BookOpen,
    Sparkles,
    Download,
    Lock,
    Clock,
    Target,
} from "lucide-react";

const SITE_URL = "https://www.calishub.com";
const CANONICAL = `${SITE_URL}/library`;

export const metadata: Metadata = {
    title: "Training Library: Free PDF Guides & Roadmaps | CalisHub",
    description:
        "Download clean, beginner-friendly PDF guides and roadmaps to build strength, learn calisthenics basics, and progress step by step.",
    alternates: { canonical: CANONICAL },
    keywords: [
        "calisthenics pdf",
        "workout pdf",
        "beginner workout guide",
        "pull up roadmap pdf",
        "calisthenics library",
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
        type: "website",
        url: CANONICAL,
        siteName: "CalisHub",
        title: "Training Library: Free PDF Guides & Roadmaps | CalisHub",
        description:
            "A growing library of PDF guides to help you start calisthenics the smart way: pull-up roadmaps, starter plans, and beginner-friendly structure.",
    },
    twitter: {
        card: "summary_large_image",
        title: "CalisHub Training Library: Free PDF Guides",
        description:
            "Download simple, realistic PDF guides to start calisthenics, build strength, and progress without confusion.",
    },
};

type GuideStatus = "available" | "coming-soon";

type Guide = {
    slug: string; // for /library/[slug] detail page later
    title: string;
    subtitle: string;
    level: string;
    focus: string;
    length: string; // e.g. "8-page PDF"
    status: GuideStatus;
    highlight?: string;
    pdfUrl?: string; // /pdfs/xxx.pdf once ready
};

const guides: Guide[] = [
    {
        slug: "pullup-passport",
        title: "Beginner Strength Passport",
        subtitle: "3-day starter plan & pull-up roadmap in one simple PDF.",
        level: "Beginner",
        focus: "Upper body, pull-up foundations, habit building",
        length: "8-page PDF",
        status: "available",
        highlight: "New",
        // set this when you place the file in /public/pdfs/
        pdfUrl: "/pdfs/beginner-strength-passport.pdf",
    },
    {
        slug: "core-checklist",
        title: "Core Control Checklist",
        subtitle: "Simple progressions to build a strong, quiet core.",
        level: "Beginner–Intermediate",
        focus: "Core tension, hollow body, anti-extension",
        length: "Coming soon",
        status: "coming-soon",
    },
    {
        slug: "squat-knee-friendly",
        title: "Knee-Friendly Squat Starter",
        subtitle: "Basics to squat without pain + simple form cues.",
        level: "Beginner",
        focus: "Lower body, mobility, technique",
        length: "Coming soon",
        status: "coming-soon",
    },
];

export default function LibraryPage() {
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
                {/* Hero */}
                <section className="mx-auto max-w-6xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Training Library • Free PDF guides • Beginner-friendly
                    </div>

                    <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
                        {/* Left */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                                CalisHub{" "}
                                <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                  PDF Guides
                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-white/65">
                                Simple, realistic PDFs you can actually follow. Start with the
                                Beginner Strength Passport, and come back as new guides drop:
                                core, squats, and more.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="#guides"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    Browse PDF guides <ArrowRight className="h-4 w-4" />
                                </Link>

                                <Link
                                    href="/#newsletter"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Get new guides by email
                                </Link>
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-white/55">
                                <Chip
                                    icon={<FileText className="h-4 w-4" />}
                                    text="Printable & offline-friendly"
                                />
                                <Chip
                                    icon={<Target className="h-4 w-4" />}
                                    text="Clear, realistic targets"
                                />
                                <Chip
                                    icon={<Clock className="h-4 w-4" />}
                                    text="Designed for busy people"
                                />
                            </div>
                        </div>

                        {/* Right: mini explainer */}
                        <aside className="rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-white/40">
                                How it works
                            </p>

                            <ul className="mt-3 space-y-3 text-sm text-white/70">
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                    <span>
                    Pick a guide that matches your current goal (first pull-up,
                    cleaner squats, stronger core).
                  </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                    <span>
                    Download the PDF and keep it on your phone or print it.
                  </span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                                    <span>
                    Optional: subscribe to get updates when new guides are
                    released.
                  </span>
                                </li>
                            </ul>

                            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                                <BookOpen className="mt-0.5 h-4 w-4 text-purple-300" />
                                <p className="text-sm text-white/70">
                                    These PDFs aren’t “shred in 7 days” promises. They’re calm,
                                    structured checklists you can actually complete.
                                </p>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Guides list */}
                <section id="guides" className="mx-auto max-w-6xl mt-14">
                    <div className="flex items-end justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Available & upcoming guides</h2>
                            <p className="mt-2 text-white/60">
                                Start with the Beginner Strength Passport. The rest of the
                                library will unlock as new PDFs are released.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {guides.map((guide) => (
                            <GuideCard key={guide.slug} guide={guide} />
                        ))}
                    </div>
                </section>

                {/* Newsletter CTA */}
                <section className="mx-auto max-w-6xl mt-16">
                    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 text-purple-200">
                                    <Sparkles className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-wider">
                    Stay in the loop
                  </span>
                                </div>
                                <h2 className="mt-2 text-2xl font-bold">
                                    Want new guides sent to your inbox?
                                </h2>
                                <p className="mt-2 text-white/70">
                                    Get notified when new PDFs drop: core, squats, mobility, and
                                    progression checklists. No spam. One-click unsubscribe.
                                </p>
                            </div>
                            <div className="min-w-[280px] flex justify-center items-center">
                                <Newsletter />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
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

function GuideCard({ guide }: { guide: Guide }) {
    const isAvailable = guide.status === "available";

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-5 transition hover:border-purple-500/35">
            <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(168,85,247,0.16),transparent_60%)]" />
            </div>

            <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-white/55">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
              <FileText className="h-3 w-3 text-purple-300" />
              <span>PDF guide</span>
            </span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wide">
              {guide.level}
            </span>
                    </div>
                    {guide.highlight && (
                        <span className="rounded-full border border-purple-500/40 bg-purple-500/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-purple-200">
              {guide.highlight}
            </span>
                    )}
                </div>

                <h3 className="mt-3 text-lg font-semibold">{guide.title}</h3>
                <p className="mt-2 text-sm text-white/65">{guide.subtitle}</p>

                <dl className="mt-4 space-y-1 text-xs text-white/55">
                    <div className="flex gap-2">
                        <dt className="text-white/60 min-w-[52px]">Focus</dt>
                        <dd>{guide.focus}</dd>
                    </div>
                    <div className="flex gap-2">
                        <dt className="text-white/60 min-w-[52px]">Format</dt>
                        <dd>{guide.length}</dd>
                    </div>
                </dl>

                <div className="mt-5 flex flex-col gap-2 text-sm">
                    {isAvailable ? (
                        <>
                            <Link
                                href={`/library/${guide.slug}`}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-sm font-medium text-white hover:bg-purple-700 transition"
                            >
                                View guide details <ArrowRight className="h-4 w-4" />
                            </Link>

                            {guide.pdfUrl ? (
                                <Link
                                    href={guide.pdfUrl}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10 transition"
                                >
                                    <Download className="h-3 w-3" />
                                    Download PDF
                                </Link>
                            ) : null}
                        </>
                    ) : (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70">
                            <Lock className="h-3 w-3 text-purple-300" />
                            <span>Coming soon · subscribe to get it when it drops</span>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
