// app/topics/[slug]/page.tsx
import "server-only"
import Link from "next/link"
import Image from "next/image"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import { BrainCircuit, Clock } from "lucide-react"
import { client } from "@calis/lib/sanity.client"
import { urlFor } from "@calis/lib/sanity.image"
import { groq } from "next-sanity"
import { notFound } from "next/navigation"

type SanityImage = any

type Category = {
    _id: string
    title: string
    slug: string
}

type ArticleCardData = {
    title: string
    slug: string
    description?: string
    category?: { _id: string; title: string } | null
    date?: string | null
    mainImage?: SanityImage
}

const PAGE_SIZE = 6

// --- Queries ---
const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current
  }
`

const countPostsInCategoryQuery = groq`
  count(*[_type == "post" && references($catId)])
`

const postsInCategoryQuery = groq`
  *[_type == "post" && references($catId)]
    | order(publishedAt desc)[$start...$end]{
      title,
      "slug": slug.current,
      "description": coalesce(excerpt, pt::text(body)),
      "category": categories[0]->{ _id, title },
      publishedAt,
      mainImage
    }
`

// --- Data helpers ---
async function getCategory(slug: string): Promise<Category | null> {
    return await client.fetch(categoryBySlugQuery, { slug })
}

async function getCounts(catId: string): Promise<number> {
    return await client.fetch(countPostsInCategoryQuery, { catId })
}

async function getPosts(catId: string, page: number): Promise<ArticleCardData[]> {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const rows = await client.fetch(postsInCategoryQuery, { catId, start, end })
    return (rows || []).map((r: any) => ({
        title: r.title,
        slug: r.slug,
        description: r.description,
        category: r.category ?? null,
        date: r.publishedAt
            ? new Date(r.publishedAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
            })
            : null,
        mainImage: r.mainImage,
    }))
}

// --- Page ---
export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: {
    // NOTE: In your codebase PageProps makes these Promises
    params: Promise<{ slug: string }>
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { slug } = await params
    const sp = (await searchParams) ?? {}

    const cat = await getCategory(slug)
    if (!cat) notFound()

    const raw = Array.isArray(sp.page) ? sp.page[0] : sp.page
    const parsed = Number(raw)
    const currentPage = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1

    const totalCount = await getCounts(cat!._id)
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const safePage = Math.min(Math.max(1, currentPage), totalPages)
    const posts = await getPosts(cat!._id, safePage)

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-10 sm:py-12">
                <div className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-purple-500 mb-2">
                        <BrainCircuit className="h-5 w-5" />
                        <span>Topic</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold">{cat!.title}</h1>
                    <p className="text-gray-400 mt-2">
                        {totalCount} {totalCount === 1 ? "article" : "articles"}
                    </p>

                    <div className="mt-4 text-sm">
                        <Link href="/topics" className="text-purple-500 hover:text-purple-400">
                            ← All topics
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {posts.map((a) => (
                        <ArticleCard
                            key={a.slug}
                            title={a.title}
                            description={a.description}
                            category={a.category?.title}
                            date={a.date ?? ""}
                            slug={a.slug}
                            imageUrl={
                                a.mainImage
                                    ? urlFor(a.mainImage as any).width(1200).height(800).fit("crop").url()
                                    : "/placeholder.svg"
                            }
                        />
                    ))}
                </div>

                {posts.length === 0 && (
                    <p className="text-gray-400 mt-8">No articles in this topic yet.</p>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination currentPage={safePage} totalPages={totalPages} basePath={`/topics/${cat!.slug}`} />
                )}
            </main>

            <Footer />
        </div>
    )
}

// --- Card ---
function ArticleCard({
                         title,
                         description,
                         category,
                         date,
                         slug = "",
                         imageUrl,
                     }: {
    title: string
    description?: string
    category?: string
    date?: string
    slug?: string
    imageUrl: string
}) {
    const shortDesc =
        (description || "").trim().slice(0, 150) + ((description || "").length > 150 ? "…" : "")

    return (
        <Link href={`/blog/${slug}`} className="group block">
            <div className="space-y-3">
                <div className="relative h-52 sm:h-56 md:h-64 xl:h-72 rounded-lg overflow-hidden border border-gray-800 group-hover:border-purple-500/50 transition-colors">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                </div>
                <div>
                    {category && (
                        <div className="flex items-center gap-2 text-xs text-purple-500 mb-2">
                            <BrainCircuit className="h-4 w-4" />
                            <span>{category}</span>
                        </div>
                    )}
                    <h3 className="font-medium group-hover:text-purple-400 transition-colors leading-snug">{title}</h3>
                    {shortDesc && <p className="text-gray-400 text-sm mt-2 line-clamp-2">{shortDesc}</p>}
                    {date && (
                        <div className="flex items-center gap-1 mt-3 text-[11px] sm:text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{date}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    )
}

// --- Pagination ---
function Pagination({
                        currentPage,
                        totalPages,
                        basePath,
                    }: {
    currentPage: number
    totalPages: number
    basePath: string
}) {
    const windowSize = 2
    const start = Math.max(1, currentPage - windowSize)
    const end = Math.min(totalPages, currentPage + windowSize)
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)
    const pageHref = (p: number) => (p === 1 ? `${basePath}` : `${basePath}?page=${p}`)

    return (
        <nav className="mt-10 flex items-center justify-center gap-2 sm:gap-3" aria-label="Pagination">
            <PaginationLink href={pageHref(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                Prev
            </PaginationLink>

            {start > 1 && (
                <>
                    <PaginationLink href={pageHref(1)}>1</PaginationLink>
                    {start > 2 && <span className="px-2 text-gray-500">…</span>}
                </>
            )}

            {pages.map((p) => (
                <PaginationLink key={p} href={pageHref(p)} active={p === currentPage}>
                    {p}
                </PaginationLink>
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="px-2 text-gray-500">…</span>}
                    <PaginationLink href={pageHref(totalPages)}>{totalPages}</PaginationLink>
                </>
            )}

            <PaginationLink href={pageHref(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                Next
            </PaginationLink>
        </nav>
    )
}

function PaginationLink({
                            href,
                            children,
                            active,
                            disabled,
                        }: {
    href: string
    children: React.ReactNode
    active?: boolean
    disabled?: boolean
}) {
    if (disabled) {
        return (
            <span className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-600 cursor-not-allowed select-none">
        {children}
      </span>
        )
    }
    return (
        <Link
            href={href}
            className={[
                "px-3 py-1.5 rounded-lg border transition-colors",
                active
                    ? "border-purple-500/60 bg-purple-500/10 text-white"
                    : "border-gray-800 text-gray-300 hover:border-purple-500/60 hover:text-white",
            ].join(" ")}
        >
            {children}
        </Link>
    )
}

// --- Optional: prebuild category pages ---
export async function generateStaticParams() {
    const rows: { slug: string }[] = await client.fetch(groq`
    *[_type == "category" && defined(slug.current)]{ "slug": slug.current }
  `)
    return rows.map((r) => ({ slug: r.slug }))
}

// --- Optional: SEO ---
export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const cat: Category | null = await client.fetch(categoryBySlugQuery, { slug })
    if (!cat) return { title: "Topic not found" }
    return {
        title: `${cat.title} — Topics`,
        description: `Articles about ${cat.title}.`,
    }
}
