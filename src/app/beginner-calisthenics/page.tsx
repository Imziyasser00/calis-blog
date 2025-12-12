import "server-only";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Newsletter from "@calis/components/Newsletter";
import ArticleCard from "@calis/components/post/ArticleCard";
import { client } from "@calis/lib/sanity.client";
import {
    ArrowRight,
    CheckCircle2,
    ClipboardCheck,
    Gauge,
    ShieldCheck,
    Sparkles,
    Target,
    Timer,
    Dumbbell,
    BookOpen,
} from "lucide-react";
import { Key } from "react";

const SITE_URL = "https://www.calishub.com";
const CANONICAL = `${SITE_URL}/beginner-calisthenics`;

export const metadata: Metadata = {
    title: "Beginner Calisthenics: Step-by-Step Guide (No Equipment)",
    description:
        "New to calisthenics? Start the right way with a complete beginner roadmap: exercises, weekly plans, progressions, common mistakes, and tools—no equipment needed.",
    alternates: {canonical: CANONICAL},
    keywords: [
        "beginner calisthenics",
        "calisthenics for beginners",
        "bodyweight training beginner",
        "beginner calisthenics workout",
        "calisthenics at home",
        "first pull up",
        "push up progression",
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
        title: "Beginner Calisthenics: Step-by-Step Guide (No Equipment)",
        description:
            "A complete beginner roadmap: what to train, how to progress, weekly structure, and what to avoid—plus tools to track your level.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Beginner Calisthenics: Step-by-Step Guide",
        description:
            "Start calisthenics the smart way: beginner exercises, progressions, and weekly plans—no equipment needed.",
    },
};

type PostCard = {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    publishedAt?: string;
    mainImage?: any;
    categoryTitles?: string[];
};

const PAGE_PICKS = 6;

const featuredBeginnerQuery = /* groq */ `
*[
  _type == "post"
  && defined(slug.current)
  && !(_id in path("drafts.**"))
  && (
    "beginner" in categories[]->slug.current
    || categories[]->title match "*Beginner*"
    || title match "*beginner*"
  )
] | order(publishedAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  "excerpt": coalesce(excerpt, pt::text(body)),
  publishedAt,
  mainImage,
  "categoryTitles": categories[]->title
}
`;

const latestPostsQuery = /* groq */ `
*[
  _type == "post"
  && defined(slug.current)
  && !(_id in path("drafts.**"))
] | order(publishedAt desc)[0...$limit]{
  _id,
  title,
  "slug": slug.current,
  "excerpt": coalesce(excerpt, pt::text(body)),
  publishedAt,
  mainImage,
  "categoryTitles": categories[]->title
}
`;

async function getBeginnerPicks() {
    const rows: PostCard[] = await client.fetch(featuredBeginnerQuery, {limit: PAGE_PICKS});
    if (rows?.length) return rows;

    // fallback: newest if you have no beginner category yet
    return client.fetch(latestPostsQuery, {limit: PAGE_PICKS});
}

async function getLatestPosts() {
    return client.fetch(latestPostsQuery, {limit: PAGE_PICKS});
}

export default async function BeginnerCalisthenicsHubPage() {
    const [beginnerPicks, latest] = await Promise.all([getBeginnerPicks(), getLatestPosts()]);

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {"@type": "ListItem", position: 1, name: "Home", item: SITE_URL},
            {"@type": "ListItem", position: 2, name: "Beginner Calisthenics", item: CANONICAL},
        ],
    };

    const faqLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "Can I start calisthenics as a complete beginner?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text:
                        "Yes. Start with scaled movements (incline push-ups, rows/negatives, squats, planks) and progress gradually. Consistency and clean form matter more than intensity.",
                },
            },
            {
                "@type": "Question",
                name: "How many days per week should a beginner train?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text:
                        "Most beginners progress best with 3 full-body sessions per week with rest days in between. This balances practice, strength gains, and recovery.",
                },
            },
            {
                "@type": "Question",
                name: "Do I need equipment?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text:
                        "No. You can build strong foundations without equipment. A pull-up bar or rings help later, but you can begin at home or in a park with regressions.",
                },
            },
            {
                "@type": "Question",
                name: "Should I train to failure?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text:
                        "Not most days. A good beginner rule is to stop 1–2 reps before failure to keep technique clean and recover well.",
                },
            },
        ],
    };

    // @ts-ignore
    return (
        <div className="min-h-screen bg-black text-white">
            <Header/>

            {/* Background aura */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-purple-600/40"/>
                <div
                    className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-fuchsia-500/30"/>
                <div
                    className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.12),transparent_60%)]"/>
            </div>

            <main className="container mx-auto px-4 py-12">
                {/* Hero */}
                <section className="mx-auto max-w-6xl">
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500"/>
                        Hub Guide • beginner-friendly • no equipment
                    </div>

                    <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
                        {/* Left */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                                Beginner Calisthenics{" "}
                                <span
                                    className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
                  Done Right
                </span>
                            </h1>

                            <p className="mt-4 max-w-2xl text-white/65">
                                Start with a clear roadmap: what to train, how to progress, how often to train,
                                what to avoid, and how to track results. Calm, realistic, and built for consistency.
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                <Link
                                    href="#roadmap"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    Start the roadmap <ArrowRight className="h-4 w-4"/>
                                </Link>

                                <Link
                                    href="/tools/max-rep-estimator"
                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                                >
                                    <Gauge className="h-4 w-4"/>
                                    Check your level
                                </Link>
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-white/55">
                                <Chip icon={<ShieldCheck className="h-4 w-4"/>} text="Joint-friendly progressions"/>
                                <Chip icon={<Target className="h-4 w-4"/>} text="Clear weekly structure"/>
                                <Chip icon={<Sparkles className="h-4 w-4"/>} text="No fluff, only fundamentals"/>
                            </div>
                        </div>

                        {/* Right: Quick Nav + mini value card */}
                        <aside className="rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
                            <p className="text-xs uppercase tracking-wide text-white/40">Quick navigation</p>

                            <div className="mt-3 grid gap-2 text-sm">
                                <QuickLink href="#roadmap" label="Your roadmap (start here)"/>
                                <QuickLink href="#pillars" label="The 4 pillars (push/pull/core/legs)"/>
                                <QuickLink href="#week" label="Beginner weekly plan (example)"/>
                                <QuickLink href="#picks" label="Recommended articles"/>
                                <QuickLink href="#mistakes" label="Common mistakes"/>
                                <QuickLink href="#faq" label="FAQ"/>
                            </div>

                            <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                                <p className="text-sm font-semibold">Fast rule</p>
                                <p className="mt-1 text-sm text-white/60">
                                    Train 3x/week, keep form clean, progress slowly. Consistency beats “hard” sessions.
                                </p>
                            </div>
                        </aside>
                    </div>
                </section>

                {/* Roadmap */}
                <section id="roadmap" className="mx-auto max-w-6xl mt-14">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">Beginner roadmap</h2>
                                <p className="mt-2 text-white/60">
                                    Follow this order. Each step removes confusion and builds confidence.
                                </p>
                            </div>
                            <Link href="/blog" className="text-sm text-purple-300 hover:text-purple-200">
                                Browse all articles →
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            <StepCard
                                icon={<ClipboardCheck className="h-5 w-5"/>}
                                title="Step 1: Learn the basics"
                                desc="Pick regressions you can do with clean form."
                                bullets={["Incline/knee push-ups", "Rows/negatives", "Squats + planks"]}
                            />
                            <StepCard
                                icon={<Timer className="h-5 w-5"/>}
                                title="Step 2: Train 3x/week"
                                desc="Same plan each week. Progress slowly."
                                bullets={["Full body sessions", "Rest days between", "Stop 1–2 reps before failure"]}
                            />
                            <StepCard
                                icon={<Gauge className="h-5 w-5"/>}
                                title="Step 3: Track and adjust"
                                desc="Measure, then upgrade your plan."
                                bullets={["Repeat key lifts weekly", "Small progress steps", "Use a tool when stuck"]}
                            />
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/tools/max-rep-estimator"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-purple-500/50 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-200 hover:bg-purple-500/15 transition"
                            >
                                <Gauge className="h-4 w-4"/>
                                Use Max Rep Estimator
                            </Link>
                            <Link
                                href="/tools"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/85 hover:bg-white/10 transition"
                            >
                                Explore tools <ArrowRight className="h-4 w-4"/>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Pillars */}
                <section id="pillars" className="mx-auto max-w-6xl mt-16">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold">The 4 pillars (don’t skip these)</h2>
                            <p className="mt-2 text-white/60">
                                Most beginners plateau because one pillar is missing. Keep them balanced.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <PillarCard
                            icon={<Dumbbell className="h-5 w-5"/>}
                            title="Push"
                            desc="Pressing strength and shoulder-friendly technique."
                            suggestions={["Incline push-ups", "Full push-ups", "Dips later"]}
                        />
                        <PillarCard
                            icon={<Dumbbell className="h-5 w-5"/>}
                            title="Pull"
                            desc="Back strength for posture + first pull-up."
                            suggestions={["Rows", "Negatives", "Assisted pull-ups"]}
                        />
                        <PillarCard
                            icon={<Dumbbell className="h-5 w-5"/>}
                            title="Core"
                            desc="Bracing & control so everything feels stronger."
                            suggestions={["Plank", "Hollow hold", "Knee raises"]}
                        />
                        <PillarCard
                            icon={<Dumbbell className="h-5 w-5"/>}
                            title="Legs"
                            desc="Balance and capacity for sustainable training."
                            suggestions={["Squats", "Split squats", "Calf raises"]}
                        />
                    </div>
                </section>

                {/* Benchmarks */}
                <section className="mx-auto max-w-6xl mt-16">
                    <h2 className="text-2xl font-bold">Beginner benchmarks (simple targets)</h2>
                    <p className="mt-2 text-white/60 max-w-3xl">
                        These aren’t “rules”, they’re clean targets. If you can hit these with good form,
                        your foundation is solid.
                    </p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Benchmark title="Push-ups" value="10–20 clean" note="no snake hips"/>
                        <Benchmark title="Rows" value="8–12 controlled" note="full range"/>
                        <Benchmark title="Plank" value="45–90s" note="ribs down"/>
                        <Benchmark title="Squats" value="20+ smooth" note="steady tempo"/>
                    </div>
                </section>

                {/* Sample week */}
                <section id="week" className="mx-auto max-w-6xl mt-16">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
                        <h2 className="text-2xl font-bold">Beginner weekly plan (example)</h2>
                        <p className="mt-2 text-white/60">
                            Train Monday/Wednesday/Friday (or any 3 days). Keep it simple. Progress comes from
                            repeating.
                        </p>

                        <div className="mt-6 grid gap-4 lg:grid-cols-3">
                            <WorkoutDay
                                day="Day A"
                                items={[
                                    "Incline push-ups 3×6–12",
                                    "Rows 3×6–12",
                                    "Squats 3×10–20",
                                    "Plank 3×30–60s",
                                ]}
                            />
                            <WorkoutDay
                                day="Day B"
                                items={[
                                    "Knee push-ups 3×6–12",
                                    "Negatives 4×3–6",
                                    "Split squats 3×8–12/leg",
                                    "Hollow hold 3×20–40s",
                                ]}
                            />
                            <WorkoutDay
                                day="Day C"
                                items={[
                                    "Incline push-ups 3×6–12",
                                    "Rows 3×6–12",
                                    "Glute bridge 3×10–20",
                                    "Side plank 3×20–45s/side",
                                ]}
                            />
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/tools/max-rep-estimator"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition"
                            >
                                <Gauge className="h-4 w-4"/>
                                Estimate your level
                            </Link>
                            <Link
                                href="/tools/workout-generator"
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/85 hover:bg-white/10 transition"
                            >
                                Generate a workout <ArrowRight className="h-4 w-4"/>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Recommended articles */}
                <section id="picks" className="mx-auto max-w-6xl mt-16">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Recommended for beginners</h2>
                            <p className="mt-2 text-white/60">
                                Start here to remove confusion and progress faster.
                            </p>
                        </div>
                        <Link href="/blog" className="text-sm text-purple-300 hover:text-purple-200">
                            All articles →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {beginnerPicks.map((p: {
                            _id: Key | null | undefined;
                            title: any;
                            slug: any;
                            excerpt: any;
                            categoryTitles: any;
                            publishedAt: any;
                            mainImage: any;
                        }, idx: number) => (
                            <ArticleCard
                                key={p._id}
                                post={{
                                    _id: p._id,
                                    title: p.title,
                                    slug: p.slug,
                                    excerpt: p.excerpt,
                                    categoryTitles: p.categoryTitles ?? [],
                                    publishedAt: p.publishedAt,
                                    mainImage: p.mainImage,
                                }}
                                priority={idx === 0}
                            />
                        ))}
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white/90">Latest articles</h3>
                        <Link href="/blog" className="text-sm text-white/60 hover:text-white">
                            See more <ArrowRight className="h-4 w-4 inline" />
                        </Link>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {latest.map((p) => (
                            <ArticleCard
                                key={`latest-${p._id}`}
                                post={{
                                    _id: p._id,
                                    title: p.title,
                                    slug: p.slug,
                                    excerpt: p.excerpt,
                                    categoryTitles: p.categoryTitles ?? [],
                                    publishedAt: p.publishedAt,
                                    mainImage: p.mainImage,
                                }}
                            />
                        ))}
                    </div>
                </section>

                {/* Mistakes */}
                <section id="mistakes" className="mx-auto max-w-6xl mt-16">
                    <h2 className="text-2xl font-bold">Common beginner mistakes (avoid these)</h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <MistakeCard title="Training to failure every session">
                            Progress faster by stopping 1–2 reps before failure and keeping form clean.
                        </MistakeCard>
                        <MistakeCard title="Skipping pulling work">
                            Push-only routines often lead to shoulder issues. Balance push + pull every week.
                        </MistakeCard>
                        <MistakeCard title="Rushing skills too early">
                            Skills come easier after you build strength and control. Foundations first.
                        </MistakeCard>
                        <MistakeCard title="No plan, just random workouts">
                            Consistency beats variety. Repeat a simple plan weekly and progress gradually.
                        </MistakeCard>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="mx-auto max-w-6xl mt-16">
                    <h2 className="text-2xl font-bold">FAQ</h2>
                    <div className="mt-6 grid gap-4">
                        <FaqItem q="Can I start calisthenics as a complete beginner?">
                            Yes. Start with regressions you can do with clean form (incline push-ups, rows, squats, planks),
                            and progress slowly.
                        </FaqItem>
                        <FaqItem q="How many days per week should I train?">
                            Most beginners do best with 3 full-body sessions/week, with rest days in between.
                        </FaqItem>
                        <FaqItem q="Do I need equipment?">
                            No. A pull-up bar or rings help later, but you can begin without equipment at home or in a park.
                        </FaqItem>
                        <FaqItem q="Should I train to failure?">
                            Not most days. Keep 1–2 reps in reserve to maintain technique and recover well.
                        </FaqItem>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="mx-auto max-w-6xl mt-16">
                    <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 text-purple-200">
                                    <BookOpen className="h-4 w-4" />
                                    <span className="text-xs uppercase tracking-wider">Next step</span>
                                </div>
                                <h2 className="mt-2 text-2xl font-bold">Want a structured path sent to you?</h2>
                                <p className="mt-2 text-white/70">
                                    Get progressions, technique cues, and simple plans. No spam. Unsubscribe anytime.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-sm text-white/70">
                                    <CheckCircle2 className="h-4 w-4 text-purple-300" />
                                    Clean, actionable emails only
                                </div>
                            </div>
                            <div className="min-w-[280px]  flex justify-center items-center">
                                <Newsletter />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* JSON-LD */}
            <Script id="ld-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(breadcrumbLd)}
            </Script>
            <Script id="ld-faq" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(faqLd)}
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

function QuickLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/75 hover:text-white hover:bg-white/10 transition"
        >
            {label}
        </Link>
    );
}

function StepCard({
                      icon,
                      title,
                      desc,
                      bullets,
                  }: {
    icon: React.ReactNode;
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
                <div className="inline-flex items-center gap-2 text-purple-200">
                    {icon}
                    <span className="text-xs uppercase tracking-wider">Step</span>
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

function PillarCard({
                        icon,
                        title,
                        desc,
                        suggestions,
                    }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    suggestions: string[];
}) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-6 transition hover:border-purple-500/35">
            <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(168,85,247,0.16),transparent_60%)]" />
            </div>

            <div className="relative flex items-start gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-purple-300">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="mt-2 text-sm text-white/60">{desc}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                            <span
                                key={s}
                                className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70"
                            >
                {s}
              </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Benchmark({ title, value, note }: { title: string; value: string; note: string }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-sm text-white/55">{title}</div>
            <div className="mt-2 text-xl font-semibold text-white">{value}</div>
            <div className="mt-2 text-sm text-white/45">{note}</div>
        </div>
    );
}

function WorkoutDay({ day, items }: { day: string; items: string[] }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">{day}</h3>
                <span className="text-xs text-purple-200 rounded-full border border-purple-500/30 bg-purple-500/10 px-2 py-1">
          45–60 min
        </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
                {items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-400/80" />
                        <span>{it}</span>
                    </li>
                ))}
            </ul>
            <p className="mt-4 text-xs text-white/45">
                Keep 1–2 reps in reserve. Add reps first, then make the exercise harder.
            </p>
        </div>
    );
}

function MistakeCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-white/60">{children}</p>
        </div>
    );
}

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
    return (
        <details className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 open:bg-white/[0.04]">
            <summary className="cursor-pointer list-none font-semibold text-white/90 flex items-center justify-between gap-4">
                <span>{q}</span>
                <span className="text-purple-300 transition group-open:rotate-90">›</span>
            </summary>
            <div className="mt-3 text-sm text-white/60">{children}</div>
        </details>
    );
}
