import "server-only"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BrainCircuit, Clock } from "lucide-react"
import { PortableText, type PortableTextComponents, type PortableTextMarkComponentProps, type PortableTextTypeComponentProps } from "@portabletext/react"
import type { Metadata } from "next"
import { client } from "@calis/lib/sanity.client"
import { urlFor } from "@calis/lib/sanity.image"
import type { PortableTextBlock, Reference, Image as SanityImageType } from "sanity"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import Newsletter from "@calis/components/Newsletter"
import type { TypedObject } from "sanity"

type LinkMark = TypedObject & {
    _type: "link"
    href?: string
}

const SITE_URL = ("https://www.calishub.com").replace(/\/+$/, "")

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
type SanityTag = { title: string }

type Post = {
    title: string
    currentSlug: string
    publishedAt?: string
    updatedAt?: string
    mainImage?: SanityImage
    body: PortableTextBlock[]
    authorName?: string
    categories?: SanityCategory[]
    readTime?: string
    seoDescription?: string
    tags?: string[]
}

type RelatedPost = {
    title: string
    slug: string
    mainImage?: SanityImage
    category?: SanityCategory
}

// ---- PortableText components (type-safe) ----
const portableComponents: PortableTextComponents = {
    types: {
        image: ({ value }: PortableTextTypeComponentProps<SanityImage>) => {
            if (!value?.asset?._ref) return null
            const src = urlFor(value).width(1600).fit("max").url()
            const alt = value.alt || "Article image"
            return (
                <figure className="my-8">
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-800 bg-black">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 100vw, 960px"
                            loading="lazy"
                        />
                    </div>
                    {value.caption && (
                        <figcaption className="mt-2 text-sm text-gray-400">{value.caption}</figcaption>
                    )}
                </figure>
            )
        },
    },
    marks: {
        link: ({ children, value }: PortableTextMarkComponentProps<LinkMark>) => {
            const href = value?.href || "#"
            const isInternal = href.startsWith("/") || href.startsWith(SITE_URL)
            if (isInternal) {
                return (
                    <Link
                        href={href}
                        className="underline decoration-purple-500/60 hover:decoration-purple-400"
                    >
                        {children}
                    </Link>
                )
            }
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-purple-500/60 hover:decoration-purple-400"
                >
                    {children}
                </a>
            )
        },
    },
}

// ---- Fetch data ----
async function getData(slug: string): Promise<Post | null> {
    const query = /* groq */ `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      "currentSlug": slug.current,
      publishedAt,
      _updatedAt,
      mainImage,
      body,
      author->{ name },
      categories[]->{ _id, title },
      seo{ description, image },
      tags[]->{ title }
    }
  `
    const raw = await client.fetch(query, { slug })
    if (!raw) return null

    return {
        title: raw.title,
        currentSlug: raw.currentSlug,
        publishedAt: raw.publishedAt,
        updatedAt: raw._updatedAt,
        mainImage: raw.seo?.image ?? raw.mainImage,
        body: raw.body ?? [],
        authorName: raw?.author?.name,
        categories: raw?.categories ?? [],
        seoDescription: raw?.seo?.description,
        tags: (raw?.tags ?? [])
            .map((t: SanityTag | string) => (typeof t === "string" ? t : t?.title))
            .filter(Boolean),
    }
}

// ---- Fetch related posts ----
async function getRelatedPosts(slug: string, firstCategoryId?: string): Promise<RelatedPost[]> {
    if (!firstCategoryId) return []
    const query = /* groq */ `
    *[_type == "post" 
      && slug.current != $slug 
      && $catId in categories[]._ref][0...4]{
      title,
      "slug": slug.current,
      mainImage,
      categories[]->{ _id, title }[0]
    }
  `
    const rows: { title: string; slug: string; mainImage?: SanityImage; categories?: SanityCategory }[] =
        await client.fetch(query, { slug, catId: firstCategoryId })

    return (rows || []).map((r) => ({
        title: r.title,
        slug: r.slug,
        mainImage: r.mainImage,
        category: r.categories,
    }))
}

// ---- Helpers ----
function blocksToPlainText(blocks: PortableTextBlock[], maxLen = 300): string {
    try {
        const texts: string[] = []
        for (const block of blocks || []) {
            if (block?._type === "block" && Array.isArray(block.children)) {
                const t = block.children.map((c: any) => c?.text || "").join("")
                if (t.trim()) texts.push(t.trim())
            }
            if (texts.join(" ").length >= maxLen) break
        }
        const full = texts.join(" ").replace(/\s+/g, " ").trim()
        return full.length > maxLen ? full.slice(0, maxLen - 1).trimEnd() + "…" : full
    } catch {
        return ""
    }
}

function buildDescription(data: Post): string {
    if (data.seoDescription && data.seoDescription.trim().length > 60) {
        return data.seoDescription.trim()
    }
    const fallback = blocksToPlainText(data.body, 170)
    if (fallback.length >= 60) return fallback
    const cats = data.categories?.map((c) => c.title).filter(Boolean).join(", ")
    return `${data.title}${cats ? ` — ${cats}` : ""}`
}

function buildKeywords(data: Post): string[] {
    const set = new Set<string>()
    ;(data.tags || []).forEach((t) => set.add(t.toLowerCase()))
    ;(data.categories || []).forEach((c) => c?.title && set.add(c.title.toLowerCase()))
    ;["calisthenics", "bodyweight training", "workout", "progressions"].forEach((s) => set.add(s))
    return Array.from(set).slice(0, 20)
}

function isoOrUndefined(d?: string) {
    if (!d) return undefined
    const x = new Date(d)
    return isNaN(+x) ? undefined : x.toISOString()
}

function mainImageForOg(img?: SanityImageType | undefined) {
    if (!img) return undefined
    const url = urlFor(img).width(1200).height(630).fit("crop").url()
    return [{ url, width: 1200, height: 630, alt: "Open Graph image" }]
}

export default async function BlogPostPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params
    const data = await getData(slug)

    if (!data) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
                    <p className="mb-6">
                        The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                    <Link
                        href="/"
                        className="px-4 py-2 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-950"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    const canonicalUrl = `${SITE_URL}/blog/${data.currentSlug}`
    const mainImageUrl = data.mainImage
        ? urlFor(data.mainImage as SanityImageType).width(1600).height(900).fit("crop").url()
        : null
    const published = data.publishedAt
        ? new Date(data.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null

    const firstCatId = data.categories?.[0]?._id
    const related = await getRelatedPosts(data.currentSlug, firstCatId)

    const publishedISO = isoOrUndefined(data.publishedAt)
    const modifiedISO = isoOrUndefined(data.updatedAt ?? data.publishedAt)
    const ldArticle = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        image: mainImageUrl ? [mainImageUrl] : undefined,
        datePublished: publishedISO,
        dateModified: modifiedISO,
        author: { "@type": "Person", name: data.authorName || "Calisthenics Hub" },
        url: canonicalUrl,
        mainEntityOfPage: canonicalUrl,
        keywords: (data.tags || []).join(", "),
        articleSection: data.categories?.[0]?.title,
        publisher: {
            "@type": "Organization",
            name: "Calisthenics Hub",
        },
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-5xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center text-gray-400 hover:text-white mb-8"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to articles
                    </Link>

                    {data.categories?.[0] && (
                        <div className="flex items-center gap-2 text-sm text-purple-500 mb-4">
                            <BrainCircuit className="h-5 w-5" />
                            <span>{data.categories[0].title}</span>
                        </div>
                    )}

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                        {data.title}
                    </h1>

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
                                alt={data.mainImage?.alt || data.title || ""}
                                role={data.mainImage?.alt || data.title ? undefined : "presentation"}
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
                        <PortableText value={data.body} components={portableComponents} />
                    </article>

                    {related.length > 0 && (
                        <div className="border-t border-gray-800 mt-12 pt-8">
                            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                {related.map((rp) => {
                                    const img = rp.mainImage
                                        ? urlFor(rp.mainImage as SanityImageType)
                                            .width(1200)
                                            .height(800)
                                            .fit("crop")
                                            .url()
                                        : "/placeholder.svg"
                                    return (
                                        <Link href={`/blog/${rp.slug}`} className="group" key={rp.slug}>
                                            <div className="space-y-3">
                                                <div className="relative h-72 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                                                    <Image
                                                        src={img}
                                                        alt={rp.mainImage?.alt || rp.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    {rp.category?.title && (
                                                        <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                                                            <BrainCircuit className="h-4 w-4" />
                                                            <span>{rp.category.title}</span>
                                                        </div>
                                                    )}
                                                    <h4 className="font-medium group-hover:text-purple-400 transition-colors">
                                                        {rp.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="mt-24">
                        <Newsletter />
                    </div>
                </div>
            </main>
            <Footer />
            <script
                id="ld-article"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(ldArticle) }}
            />
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
export async function generateMetadata(
    { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
    const { slug } = await params
    const data = await getData(slug)

    if (!data) {
        return {
            title: "Post not found · Calisthenics Hub",
            robots: { index: false, follow: false },
        }
    }

    const canonicalUrl = `${SITE_URL}/blog/${data.currentSlug}`
    const description = buildDescription(data)
    const keywords = buildKeywords(data)
    const publishedISO = isoOrUndefined(data.publishedAt)
    const modifiedISO = isoOrUndefined(data.updatedAt ?? data.publishedAt)
    const authors = data.authorName ? [data.authorName] : ["Calisthenics Hub"]
    const ogImages = mainImageForOg(data.mainImage as SanityImageType | undefined) ?? []
    const shouldIndex = Boolean(data.publishedAt)

    return {
        title: {
            default: data.title,
            template: "%s · Calisthenics Hub",
        },
        description,
        keywords,
        alternates: { canonical: canonicalUrl },
        robots: {
            index: shouldIndex,
            follow: true,
            googleBot: {
                index: shouldIndex,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            type: "article",
            siteName: "Calisthenics Hub",
            title: data.title,
            description,
            url: canonicalUrl,
            images: ogImages,
            locale: "en_US",
            publishedTime: publishedISO,
            modifiedTime: modifiedISO,
            authors,
            tags: data.tags && data.tags.length ? data.tags : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title: data.title,
            description,
            images: ogImages?.[0]?.url ? [ogImages[0].url] : undefined,
            creator: "@calishub",
        },
        category: data.categories?.[0]?.title,
        formatDetection: {
            telephone: false,
            date: false,
            address: false,
            email: false,
            url: false,
        },
    }
}
