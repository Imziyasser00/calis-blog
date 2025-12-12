import "server-only";
import Link from "next/link";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import { BrainCircuit } from "lucide-react";
import { client } from "@calis/lib/sanity.client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import Script from "next/script";

const SITE_URL = "https://www.calishub.com";

/* ------------------------- TYPES ------------------------- */
type Topic = {
    _id: string;
    title: string;
    slug: string;
    count: number;
};

/* ------------------------- GROQ ------------------------- */
const topicsQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "count": count(*[_type == "post" && references(^._id)])
  }
`;

async function getTopics(): Promise<Topic[]> {
    const rows = await client.fetch(topicsQuery);
    return (rows || [])
        .map((t: any) => ({
            _id: t._id,
            title: t.title,
            slug: t.slug,
            count: t.count ?? 0,
        }))
        .filter((t: { count: number; }) => t.count > 0);
}

/* ------------------------- SEO HELPERS ------------------------- */
function buildDescription(topics: Topic[]) {
    if (!topics.length) {
        return "Explore calisthenics topics covering workouts, skills, progressions, and training fundamentals.";
    }

    const totalArticles = topics.reduce((acc, t) => acc + t.count, 0);
    const popular = topics
        .slice()
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
        .map((t) => t.title)
        .join(", ");

    return `Browse ${topics.length} calisthenics topics (${totalArticles} articles). Popular topics include ${popular}.`;
}

function buildKeywords(topics: Topic[]) {
    const base = new Set([
        "calisthenics",
        "bodyweight training",
        "workouts",
        "skills",
        "progressions",
        "strength",
    ]);
    topics.forEach((t) => base.add(t.title.toLowerCase()));
    return Array.from(base).slice(0, 25);
}

/* ------------------------- METADATA ------------------------- */
export async function generateMetadata(): Promise<Metadata> {
    const topics = await getTopics();
    const description = buildDescription(topics);

    return {
        title: "Topics · Calisthenics Hub",
        description,
        keywords: buildKeywords(topics),
        alternates: { canonical: `${SITE_URL}/topics` },
        robots: { index: true, follow: true },
        openGraph: {
            type: "website",
            url: `${SITE_URL}/topics`,
            siteName: "Calisthenics Hub",
            title: "Topics · Calisthenics Hub",
            description,
            images: [
                {
                    url: `${SITE_URL}/og/topics.png`,
                    width: 1200,
                    height: 630,
                    alt: "Calisthenics Hub Topics",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: "Topics · Calisthenics Hub",
            description,
            images: [`${SITE_URL}/og/topics.png`],
        },
    };
}

/* ------------------------- PAGE ------------------------- */
export default async function TopicsPage() {
    const topics = await getTopics();

    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
        ],
    };

    const itemListLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        numberOfItems: topics.length,
        itemListElement: topics.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.title,
            url: `${SITE_URL}/topics/${t.slug}`,
        })),
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                {/* Header */}
                <section className="mb-12 max-w-3xl">
                    <h1 className="text-4xl font-bold">Topics</h1>
                    <p className="mt-3 text-white/60">
                        Explore workouts, skills, nutrition, and training principles.
                        Pick a topic to start building real calisthenics strength.
                    </p>
                </section>

                {/* Topics grid */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic) => (
                            <TopicCard
                                key={topic._id}
                                title={topic.title}
                                count={topic.count}
                                href={`/topics/${topic.slug}`}
                            />
                        ))}
                    </div>

                    {topics.length === 0 && (
                        <p className="mt-8 text-white/50">
                            No topics yet. Add categories in Sanity Studio.
                        </p>
                    )}
                </section>
            </main>

            <Footer />

            {/* JSON-LD */}
            <Script id="ld-breadcrumbs" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(breadcrumbLd)}
            </Script>
            <Script id="ld-itemlist" type="application/ld+json" strategy="beforeInteractive">
                {JSON.stringify(itemListLd)}
            </Script>
        </div>
    );
}

/* ------------------------- CARD ------------------------- */
function TopicCard({
                       title,
                       count,
                       href,
                   }: {
    title: string;
    count: number;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
        >
            <article className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-purple-500/40">
                {/* subtle glow */}
                <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition duration-700">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(168,85,247,0.18),transparent_60%)]" />
                </div>

                <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-purple-500/10 p-3 text-purple-300">
                            <BrainCircuit className="h-5 w-5" />
                        </div>
                        <h2 className="text-lg font-semibold group-hover:text-purple-300 transition-colors">
                            {title}
                        </h2>
                    </div>

                    <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-white/70">
            {count} {count === 1 ? "article" : "articles"}
          </span>
                </div>

                <p className="relative z-10 mt-4 text-sm text-white/55">
                    Guides, progressions, and practical training advice.
                </p>

                <span className="relative z-10 mt-5 inline-block text-sm text-purple-300 group-hover:text-purple-200 transition">
          View articles →
        </span>
            </article>
        </Link>
    );
}
