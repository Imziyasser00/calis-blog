// app/page.tsx
import Link from "next/link"
import Image from "next/image"
import { BrainCircuit, Clock, Cpu, Eye, Github, Linkedin, Mail, Rss, Twitter } from "lucide-react"
import { Button } from "@calis/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@calis/components/ui/card"
import Newsletter from "@calis/components/Newsletter"
import { client } from "@calis/lib/sanity.client"
import { urlFor } from "@calis/lib/sanity.image"

export const revalidate = 60 // ISR

type Category = {
    _id: string
    title: string
    slug?: { current: string }
}

type PostCard = {
    _id: string
    title: string
    slug: string
    publishedAt?: string
    excerpt?: string
    mainImage?: any
    categoryTitles: string[]
}

type Hero = {
    title: string
    slug: string
    mainImage?: any
}

async function getData() {
    // Latest post for the hero section
    const hero = await client.fetch<Hero>(
        /* groq */ `
    *[_type=="post" && defined(slug.current)]|order(publishedAt desc)[0]{
      title,
      "slug": slug.current,
      mainImage
    }
  `
    )

    // Featured (latest 3)
    const featured = await client.fetch<PostCard[]>(
        /* groq */ `
  *[_type=="post" && defined(slug.current)]|order(publishedAt desc)[0...3]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": pt::text(body),   // << no trim here
    mainImage,
    "categoryTitles": coalesce(categories[]->title, [])
  }
`)


// Recent (next 6)
    const recent = await client.fetch<PostCard[]>(
        /* groq */ `
  *[_type=="post" && defined(slug.current)]|order(publishedAt desc)[3...9]{
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "excerpt": pt::text(body),   // << no trim here
    mainImage,
    "categoryTitles": coalesce(categories[]->title, [])
  }
`)

    const topics = await client.fetch<Category[]>(
        /* groq */ `
    *[_type=="category"]|order(title asc){
      _id, title, slug
    }
  `
    )

    return { hero, featured, recent, topics }
}

function formatDate(d?: string) {
    if (!d) return ""
    try {
        return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    } catch {
        return d
    }
}

export default async function Home() {
    const { hero, featured, recent, topics } = await getData()

    const heroImg =
        hero?.mainImage ? urlFor(hero.mainImage).width(1600).height(900).fit("crop").url() : undefined

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="container mx-auto py-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tighter">
                        Cali<span className="text-purple-500">Hub</span>
                    </Link>
                    <nav className="hidden md:flex items-center space-x-6 text-sm">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
                        <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link>
                        <Link href="/topics" className="text-gray-400 hover:text-white transition-colors">Topics</Link>
                        <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
                    </nav>
                    <Link href="#newsletter">
                        <Button variant="outline" className="border-purple-500 text-purple-500 hover:bg-purple-950 hover:text-white">
                            Subscribe
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Hero (Sanity image only) */}
            <main className="container mx-auto px-4 py-12">
                <section className="mb-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                                Build strength with <span className="text-purple-500">Calisthenics</span>
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl">
                                Actionable workouts, skill progressions, and gear advice — powered by a clean Sanity + Next.js stack.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/blog">
                                    <Button className="bg-purple-600 hover:bg-purple-700">Latest Articles</Button>
                                </Link>
                                <Link href="#newsletter">
                                    <Button variant="outline" className="border-gray-700 hover:bg-gray-900">Join Newsletter</Button>
                                </Link>
                            </div>
                        </div>

                        <Link
                            href={hero?.slug ? `/blog/${hero.slug}` : "/blog"}
                            className="relative h-[400px] rounded-xl overflow-hidden border border-gray-800 block"
                        >
                            {heroImg ? (
                                <>
                                    <Image
                                        src={heroImg}
                                        alt={hero?.title || "Latest post"}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <h3 className="text-lg md:text-xl font-semibold line-clamp-2">{hero?.title}</h3>
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">
                                    No hero image yet
                                </div>
                            )}
                        </Link>
                    </div>
                </section>

                {/* Featured (latest 3) */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">Featured Articles</h2>
                        <Link href="/blog" className="text-purple-500 hover:text-purple-400 text-sm flex items-center gap-2">
                            View all <Eye className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {(featured || []).map((post) => (
                            <FeaturedCard
                                key={post._id}
                                title={post.title}
                                description={post.excerpt || ""}
                                image={post.mainImage ? urlFor(post.mainImage).width(1200).height(800).fit("crop").url() : ""}
                                date={formatDate(post.publishedAt)}
                                category={post.categoryTitles?.[0] || "Calisthenics"}
                                icon={<BrainCircuit className="h-5 w-5" />}
                                slug={post.slug}
                            />
                        ))}
                    </div>
                </section>

                {/* Recent (next 6) */}
                <section className="mb-20">
                    <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(recent || []).map((post) => (
                            <ArticleCard
                                key={post._id}
                                title={post.title}
                                description={post.excerpt || ""}
                                category={post.categoryTitles?.[0] || "Training"}
                                date={formatDate(post.publishedAt)}
                                slug={post.slug}
                                image={post.mainImage ? urlFor(post.mainImage).width(800).height(500).fit("crop").url() : ""}
                            />
                        ))}
                    </div>
                </section>

                {/* Topics */}
                <section className="mb-20">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Topics</h2>
                        <Link href="/topics" className="text-purple-500 hover:text-purple-400 text-sm">
                            Browse all
                        </Link>
                    </div>
                    <ul className="flex flex-wrap gap-2 text-sm">
                        {(topics || []).map((t) => (
                            <li key={t._id}>
                                <Link
                                    href={t.slug?.current ? `/topics/${t.slug.current}` : "/topics"}
                                    className="px-3 py-1 rounded-full border border-purple-500/40 hover:border-purple-500/70 text-gray-200"
                                >
                                    {t.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Newsletter */}
                <Newsletter />
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="space-y-4">
                            <Link href="/" className="text-xl font-bold tracking-tighter">
                                Cali<span className="text-purple-500">Hub</span>
                            </Link>
                            <p className="text-gray-400 text-sm">
                                Calisthenics workouts, skills, and progress — clean content, no fluff.
                            </p>
                            <div className="flex space-x-4">
                                <Link href="#" className="text-gray-400 hover:text-white"><Twitter className="h-5 w-5" /></Link>
                                <Link href="#" className="text-gray-400 hover:text-white"><Github className="h-5 w-5" /></Link>
                                <Link href="#" className="text-gray-400 hover:text-white"><Linkedin className="h-5 w-5" /></Link>
                                <Link href="#" className="text-gray-400 hover:text-white"><Rss className="h-5 w-5" /></Link>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Topics</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                {(topics || []).slice(0, 5).map((t) => (
                                    <li key={t._id}>
                                        <Link href={t.slug?.current ? `/topics/${t.slug.current}` : "/topics"} className="hover:text-white">
                                            {t.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Resources</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><Link href="/blog" className="hover:text-white">Tutorials</Link></li>
                                <li><Link href="/blog" className="hover:text-white">Programs</Link></li>
                                <li><Link href="/blog" className="hover:text-white">Gear</Link></li>
                                <li><Link href="/blog" className="hover:text-white">Nutrition</Link></li>
                                <li><Link href="/blog" className="hover:text-white">Tools</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-medium mb-4">Contact</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    <span>hello@calihub.dev</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-400">
                        <p>© {new Date().getFullYear()} Calisthenics Hub. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// --------------------- Cards ----------------------

function FeaturedCard({
                          title,
                          description,
                          image,
                          date,
                          category,
                          icon,
                          slug = "",
                      }: {
    title: string
    description?: string
    image?: string
    date?: string
    category?: string
    icon?: React.ReactNode
    slug?: string
}) {
    return (
        <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-purple-500/50 transition-colors">
            <div className="relative h-48">
                <Image
                    src={image || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>
            <CardHeader>
                <div className="flex items-center gap-2 text-sm text-purple-500 mb-2">
                    {icon ?? <Cpu className="h-5 w-5" />}
                    <span>{category || "Calisthenics"}</span>
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {description ? (
                    <CardDescription className="text-gray-400 line-clamp-3">
                        {description}{description.length >= 200 ? "…" : ""}
                    </CardDescription>
                ) : null}
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{date}</span>
                </div>
                <Link href={`/blog/${slug}`} className="text-purple-500 hover:text-purple-400">
                    Read more →
                </Link>
            </CardFooter>
        </Card>
    )
}

function ArticleCard({
                         title,
                         description,
                         category,
                         date,
                         slug = "",
                         image,
                     }: {
    title: string
    description?: string
    category?: string
    date?: string
    slug?: string
    image?: string
}) {
    return (
        <Link href={`/blog/${slug}`} className="group">
            <div className="space-y-3">
                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                    <Image
                        src={image || "/placeholder.svg"}
                        alt={`${title} thumbnail`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                <div>
                    <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                        <BrainCircuit className="h-4 w-4" />
                        <span>{category || "Training"}</span>
                    </div>
                    <h3 className="font-medium group-hover:text-purple-400 transition-colors">{title}</h3>
                    {description ? <p className="text-gray-400 text-sm mt-2 line-clamp-2">{description}{description.length >= 200 ? "…" : ""}</p> : null}
                    <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
