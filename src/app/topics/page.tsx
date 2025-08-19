import "server-only"
import Link from "next/link"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@calis/components/ui/card"
import { BrainCircuit } from "lucide-react"
import { client } from "@calis/lib/sanity.client"
import { groq } from "next-sanity"

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
    // number of posts referencing this category
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
    }))
}

export default async function TopicsPage() {
    const topics = await getTopics()

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
                                // Link to a category page like /topics/[slug]
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
          <span className="text-purple-500 text-sm group-hover:text-purple-400 transition-colors">
            View articles →
          </span>
                </CardFooter>
            </Card>
        </Link>
    )
}
