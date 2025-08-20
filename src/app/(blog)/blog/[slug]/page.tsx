import "server-only"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BrainCircuit, Clock } from "lucide-react"
import { PortableText } from "@portabletext/react"
import type { Metadata } from "next"
import Script from "next/script"
import { client } from "@calis/lib/sanity.client"
import { urlFor } from "@calis/lib/sanity.image"
import type { PortableTextBlock, Reference, Image as SanityImageType } from "sanity"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import Newsletter from "@calis/components/Newsletter";

const SITE_URL = (process.env.SITE_URL || "http://localhost:3000").replace(/\/+$/, "")

// ---- Sanity types ----
type SanityCategory = { _id: string; title: string }
type SanityCrop = { top: number; bottom: number; left: number; right: number }
type SanityHotspot = { x: number; y: number; height: number; width: number }
type SanityImage = {
    _type?: "image"
    asset: Reference & { _ref: string }
    crop?: SanityCrop
    hotspot?: SanityHotspot
    alt?: string
    caption?: string
}

type Post = {
    title: string
    currentSlug: string
    publishedAt?: string
    mainImage?: SanityImage
    body: PortableTextBlock[]
    authorName?: string
    categories?: SanityCategory[]
    readTime?: string
}

type RelatedPost = {
    title: string
    slug: string
    mainImage?: SanityImage
    category?: SanityCategory
}

// ---- Fetch data ----
async function getData(slug: string): Promise<Post | null> {
    const query = /* groq */ `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      "currentSlug": slug.current,
      publishedAt,
      mainImage,
      body,
      author->{ name },
      categories[]->{ _id, title }
    }
  `
    const data = await client.fetch(query, { slug })
    if (!data) return null
    return {
        title: data.title,
        currentSlug: data.currentSlug,
        publishedAt: data.publishedAt,
        mainImage: data.mainImage,
        body: data.body ?? [],
        authorName: data?.author?.name,
        categories: data?.categories ?? [],
    }
}

// ---- Fetch related posts (same first category, exclude current) ----
async function getRelatedPosts(slug: string, firstCategoryId?: string): Promise<RelatedPost[]> {
    if (!firstCategoryId) return []
    const query = /* groq */ `
    *[_type == "post" 
      && slug.current != $slug 
      && $catId in categories[]._ref][0...4]{
      title,
      "slug": slug.current,
      mainImage,
      // pick the first resolved category just for display
      categories[]->{ _id, title }[0]
    }
  `
    const rows: { title: string; slug: string; mainImage?: SanityImage; categories?: SanityCategory }[] = await client.fetch(
        query,
        { slug, catId: firstCategoryId }
    )
    return (rows || []).map((r) => ({
        title: r.title,
        slug: r.slug,
        mainImage: r.mainImage,
        category: r.categories,
    }))
}

// ---- Page component ----
export default async function BlogPostPage({
                                               params,
                                           }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const data = await getData(slug)

    if (!data) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
                    <p className="mb-6">The blog post you&apos;re looking for doesn&apos;t exist or has been moved.</p>
                    <Link href="/" className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-950">
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    const canonicalUrl = `${SITE_URL}/blog/${data.currentSlug}`
    const mainImageUrl = data.mainImage ? urlFor(data.mainImage as SanityImageType).width(1600).height(900).fit("crop").url() : null
    const published = data.publishedAt
        ? new Date(data.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null

    const firstCatId = data.categories?.[0]?._id
    const related = await getRelatedPosts(data.currentSlug, firstCatId)

    const ldArticle = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        image: mainImageUrl ? [mainImageUrl] : undefined,
        datePublished: data.publishedAt ? new Date(data.publishedAt).toISOString() : undefined,
        dateModified: data.publishedAt ? new Date(data.publishedAt).toISOString() : undefined,
        author: data.authorName ? { "@type": "Person", name: data.authorName } : { "@type": "Person", name: "Calis Hub" },
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* --- Header --- */}
            <Header />

            {/* --- Main --- */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    <Link href="/articles" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to articles
                    </Link>

                    {data.categories?.[0] && (
                        <div className="flex items-center gap-2 text-sm text-purple-500 mb-4">
                            <BrainCircuit className="h-5 w-5" />
                            <span>{data.categories[0].title}</span>
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">{data.title}</h1>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-8">
                        {data.readTime && (
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{data.readTime}</span>
                            </div>
                        )}
                        {published && <div>{published}</div>}
                        {data.authorName && <div>By {data.authorName}</div>}
                    </div>

                    {mainImageUrl && (
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-800 mb-8 bg-black">
                            <Image
                                src={mainImageUrl}
                                alt={data.mainImage?.alt || data.title || ''}
                                role={data.mainImage?.alt || data.title ? undefined : 'presentation'}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 960px"
                                priority
                            />
                        </div>
                    )}


                    <article
                        className="
    prose prose-invert max-w-none
    prose-h2:text-purple-400 prose-h2:font-semibold
    prose-h3:text-purple-300
    prose-a:text-purple-400 hover:prose-a:text-purple-300
    prose-strong:text-white
    prose-code:text-purple-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
    prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10
    prose-blockquote:border-l-purple-500 prose-blockquote:text-white/80
    marker:text-purple-500
    prose-img:rounded-xl
  "
                    >
                        <PortableText value={data.body} />
                    </article>


                    {/* --- Related Articles --- */}
                    {related.length > 0 && (
                        <div className="border-t border-gray-800 mt-12 pt-8">
                            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {related.map((rp) => {
                                      const img =
                                        rp.mainImage ? urlFor(rp.mainImage as SanityImageType).width(1200).height(800).fit("crop").url() : "/placeholder.svg"
                                    return (
                                        <Link href={`/blog/${rp.slug}`} className="group" key={rp.slug}>
                                            <div className="space-y-3">
                                                <div className="relative h-48 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                                                    <Image src={img} alt={rp.mainImage?.alt || rp.title} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    {rp.category?.title && (
                                                        <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                                                            <BrainCircuit className="h-4 w-4" />
                                                            <span>{rp.category.title}</span>
                                                        </div>
                                                    )}
                                                    <h4 className="font-medium group-hover:text-purple-400 transition-colors">{rp.title}</h4>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}
                    <div className={"mt-24"}>

                    <Newsletter />
                    </div>

                </div>

            </main>

            <Footer />
            <Script id="ld-article" type="application/ld+json" strategy="afterInteractive">
                {JSON.stringify(ldArticle)}
            </Script>
        </div>
    )
}

// --- Static params ---
export async function generateStaticParams() {
    const query = /* groq */ `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
    const data: { slug: string }[] = await client.fetch(query)
    return data.map((item) => ({ slug: item.slug }))
}

// --- Metadata ---
export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const data = await getData(slug)
    if (!data) return { title: "Post not found" }
    const canonicalUrl = `${SITE_URL}/blog/${data.currentSlug}`
    return {
        title: data.title,
        description: data.categories?.map((c) => c.title).join(", "),
        alternates: { canonical: canonicalUrl },
        openGraph: {
            title: data.title,
            url: canonicalUrl,
            images: data.mainImage
                ? [
                    {
                        url: urlFor(data.mainImage as SanityImageType).width(1200).height(630).fit("crop").url(),
                        width: 1200,
                        height: 630,
                        alt: data.title,
                    },
                ]
                : [],
        },
    }
}
