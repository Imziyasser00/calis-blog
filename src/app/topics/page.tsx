import "server-only"
import Link from "next/link"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@calis/components/ui/card"
import { BrainCircuit } from "lucide-react"
import { client } from "@calis/lib/sanity.client"
import { groq } from "next-sanity"
import type { Metadata } from "next"
import Script from "next/script"

const SITE_URL = ("https://www.calishub.com")

type Topic = {
    _id: string
    title: string
    slug: string
    count: number
}

// GROQ: fetch all categories with post counts
const topicsQuery = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    "count": count(*[_type == "post" && references(^._id)])
  }
`

async function getTopics(): Promise<Topic[]> {
    const rows = await client.fetch(topicsQuery)
    return (rows || []).map((t: any) => ({
        _id: t._id,
        title: t.title,
        slug: t.slug,
        count: t.count ?? 0,
    })).filter((t: { count: number }) => t.count > 0)
}

/* ------------------------- METADATA (dynamic) ------------------------- */
function buildDescription(topics: Topic[]) {
    const total = topics.reduce((acc, t) => acc + (t.count || 0), 0)
    const topNames = topics
        .slice() // copy
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
        .map((t) => t.title)
    const list = topNames.join(", ")
    const base = "Explore calisthenics topics: tutorials, progressions, skills, and programming."
    if (!topics.length) return base
    if (list) {
        return `Browse ${topics.length} topics (${total} articles total). Popular: ${list}.`
    }
    return base
}

function buildKeywords(topics: Topic[]) {
    const set = new Set<string>(["calisthenics", "bodyweight training", "workouts", "progressions", "skills"])
    topics.forEach((t) => t.title && set.add(t.title.toLowerCase()))
    return Array.from(set).slice(0, 25)
}

export async function generateMetadata(): Promise<Metadata> {
    const topics = await getTopics()
    const canonical = `${SITE_URL}/topics`
    const title = "Topics"
    const description = buildDescription(topics)
    const keywords = buildKeywords(topics)
    const total = topics.reduce((acc, t) => acc + (t.count || 0), 0)

    return {
        title: { default: `${title} · Calisthenics Hub`, template: "%s · Calisthenics Hub" },
        description,
        keywords,
        alternates: { canonical },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        },
        openGraph: {
            type: "website",
            url: canonical,
            siteName: "Calisthenics Hub",
            title: `${title} · Calisthenics Hub`,
            description,
        },
        twitter: {
            card: "summary",
            title: `${title} · Calisthenics Hub`,
            description,
        },
        // Optional: expose a category for analytics/UA hints
        category: "Topics",
        other: {
            "x-items-count": String(topics.length),
            "x-articles-count": String(total),
        },
    }
}

/* --------------------------- PAGE COMPONENT --------------------------- */
export default async function TopicsPage() {
    const topics = await getTopics()

    // JSON-LD: Breadcrumbs + ItemList of topics
    const breadcrumbLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Topics", item: `${SITE_URL}/topics` },
        ],
    }

    const itemListLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListOrder: "http://schema.org/ItemListOrderAscending",
        numberOfItems: topics.length,
        itemListElement: topics.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: t.title,
            url: `${SITE_URL}/topics/${t.slug}`,
        })),
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <section className="mb-12">
                    <h1 className="text-4xl font-bold mb-8">Topics</h1>

                    {/* Responsive grid: phones / tablets / XL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {topics.map((topic) => (
                            <TopicCard
                                key={topic._id}
                                title={topic.title}
                                description={`Articles about ${topic.title}.`}
                                count={topic.count}
                                href={`/topics/${topic.slug}`}
                            />
                        ))}
                    </div>

                    {topics.length === 0 && (
                        <p className="text-gray-400 mt-6">No topics yet. Add some categories in Sanity Studio.</p>
                    )}
                </section>
            </main>

            <Footer />

            {/* JSON-LD */}
            <Script id="ld-breadcrumbs" type="application/ld+json" strategy="afterInteractive">
                {JSON.stringify(breadcrumbLd)}
            </Script>
            <Script id="ld-itemlist" type="application/ld+json" strategy="afterInteractive">
                {JSON.stringify(itemListLd)}
            </Script>
        </div>
    )
}

function TopicCard({
                       title,
                       description,
                       count,
                       href,
                   }: {
    title: string
    description: string
    count: number
    href: string
}) {
    return (
        <Link href={href} className="group">
            <Card className="bg-gray-900 border-gray-800 text-white hover:border-purple-500/50 transition-colors h-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="bg-purple-500/10 p-3 rounded-lg text-purple-500">
                            <BrainCircuit className="h-6 w-6" />
                        </div>
                        <div className="bg-gray-800 text-purple-500 px-3 py-1 rounded-full text-sm">
                            {count} {count === 1 ? "article" : "articles"}
                        </div>
                    </div>
                    <CardTitle className="text-xl mt-4 group-hover:text-purple-400 transition-colors">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription className="text-gray-400">{description}</CardDescription>
                </CardContent>
                <CardFooter>
                    <span className="text-purple-500 text-sm group-hover:text-purple-400 transition-colors">View articles →</span>
                </CardFooter>
            </Card>
        </Link>
    )
}
