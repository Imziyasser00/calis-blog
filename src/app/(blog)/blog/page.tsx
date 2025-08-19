import "server-only"
import Link from "next/link"
import Image from "next/image"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import { BrainCircuit, Clock } from "lucide-react"
import { client } from "@calis/lib/sanity.client"
import { urlFor } from "@calis/lib/sanity.image"

// --- Types ---
type SanityImage = any

type ArticleCardData = {
    title: string
    slug: string
    description?: string
    category?: { _id: string; title: string } | null
    date?: string | null
    mainImage?: SanityImage
}

// --- Data helpers ---
const PAGE_SIZE = 6

async function getTotalCount(): Promise<number> {
    const q = /* groq */ `count(*[_type == "post"])`
    return await client.fetch(q)
}

async function getArticles(page: number): Promise<ArticleCardData[]> {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const query = /* groq */ `
    *[_type == "post"]|order(publishedAt desc)[$start...$end]{
      title,
      "slug": slug.current,
      "description": coalesce(excerpt, pt::text(body)),
      "category": categories[0]->{ _id, title },
      publishedAt,
      mainImage
    }
  `
    const rows = await client.fetch(query, { start, end })
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
export default async function BlogIndexPage({
                                                searchParams,
                                            }: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const raw = Array.isArray(searchParams?.page) ? searchParams?.page[0] : searchParams?.page
    const parsed = Number(raw)
    const currentPage = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1

    const [totalCount, articles] = await Promise.all([getTotalCount(), getArticles(currentPage)])
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const safePage = Math.min(Math.max(1, currentPage), totalPages)

    // If user passed a page beyond range and there are pages, refetch the last page
    const pageArticles = safePage === currentPage ? articles : await getArticles(safePage)

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-10 sm:py-12">
                <section className="mb-10 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">All Articles</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {pageArticles.map((a) => (
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

                    {pageArticles.length === 0 && (
                        <p className="text-gray-400 mt-8">No articles yet. Check back soon.</p>
                    )}

                    {totalPages > 1 && (
                        <Pagination currentPage={safePage} totalPages={totalPages} basePath="/blog" />
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}

// --- Components ---
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
                    <Image src={imageUrl} alt={`${title} thumbnail`} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" />
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

function Pagination({
                        currentPage,
                        totalPages,
                        basePath = "/blog",
                    }: {
    currentPage: number
    totalPages: number
    basePath?: string
}) {
    // Build a small window of pages around current
    const windowSize = 2
    const start = Math.max(1, currentPage - windowSize)
    const end = Math.min(totalPages, currentPage + windowSize)
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    const pageHref = (p: number) => (p === 1 ? `${basePath}` : `${basePath}?page=${p}`)

    return (
        <nav className="mt-10 flex items-center justify-center gap-2 sm:gap-3" aria-label="Pagination">
            {/* Prev */}
            <PaginationLink href={pageHref(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                Prev
            </PaginationLink>

            {/* First page ellipsis */}
            {start > 1 && (
                <>
                    <PaginationLink href={pageHref(1)}>1</PaginationLink>
                    {start > 2 && <span className="px-2 text-gray-500">…</span>}
                </>
            )}

            {/* Page numbers */}
            {pages.map((p) => (
                <PaginationLink key={p} href={pageHref(p)} active={p === currentPage}>
                    {p}
                </PaginationLink>
            ))}

            {/* Last page ellipsis */}
            {end < totalPages && (
                <>
                    {end < totalPages - 1 && <span className="px-2 text-gray-500">…</span>}
                    <PaginationLink href={pageHref(totalPages)}>{totalPages}</PaginationLink>
                </>
            )}

            {/* Next */}
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
