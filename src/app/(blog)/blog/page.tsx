import "server-only"
import Link from "next/link"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import { client } from "@calis/lib/sanity.client"
import { urlFor } from "@calis/lib/sanity.image"
import {ArticleCard } from "@calis/components/post/ArticlelCard";
// Make search param variations render on the server each time
export const dynamic = "force-dynamic";
// or: export const revalidate = 0

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

const PAGE_SIZE = 6

// --- Data helpers (search-aware) ---
async function getTotalCount(q?: string): Promise<number> {
    const m = q ? `*${q}*` : ""
    const query = /* groq */ `
    count(*[_type == "post" && (
      $m == "" ||
      title match $m ||
      pt::text(body) match $m ||
      count(categories[]-> [title match $m]) > 0
    )])
  `
    return await client.fetch(query, { m })
}


async function getArticles(page: number, q?: string): Promise<ArticleCardData[]> {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const m = q ? `*${q}*` : ""
    const query = /* groq */ `
    *[_type == "post" && (
      $m == "" ||
      title match $m ||
      pt::text(body) match $m ||
      count(categories[]-> [title match $m]) > 0
    )] | order(publishedAt desc)[$start...$end]{
      title,
      "slug": slug.current,
      "description": coalesce(excerpt, pt::text(body)),
      "category": categories[0]->{ _id, title },
      publishedAt,
      mainImage
    }
  `
    const rows = await client.fetch(query, { start, end, m })
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
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const sp = await searchParams
    const rawPage = Array.isArray(sp?.page) ? sp.page[0] : sp?.page
    const q = (Array.isArray(sp?.q) ? sp.q[0] : sp?.q)?.trim() || ""
    const parsed = Number(rawPage)
    const currentPage = Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1

    const [totalCount, articles] = await Promise.all([
        getTotalCount(q),
        getArticles(currentPage, q),
    ])
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
    const safePage = Math.min(Math.max(1, currentPage), totalPages)
    const pageArticles = safePage === currentPage ? articles : await getArticles(safePage, q)

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-10 sm:py-12">
                <section className="mb-10 sm:mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold">All Articles</h1>
                    </div>

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
                        <p className="text-gray-400 mt-8">No results{q ? ` for “${q}”` : ""}. Try a different search.</p>
                    )}

                    {totalPages > 1 && (
                        <Pagination currentPage={safePage} totalPages={totalPages} basePath="/blog" q={q} />
                    )}
                </section>
            </main>

            <Footer />
        </div>
    )
}

// --- needed client imports for SearchBar


// --- Pagination (keeps ?q=...) ---
function Pagination({
                        currentPage,
                        totalPages,
                        basePath = "/blog",
                        q = "",
                    }: {
    currentPage: number
    totalPages: number
    basePath?: string
    q?: string
}) {
    const windowSize = 2
    const start = Math.max(1, currentPage - windowSize)
    const end = Math.min(totalPages, currentPage + windowSize)
    const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

    const pageHref = (p: number) => {
        const params = new URLSearchParams()
        if (q) params.set("q", q)
        if (p > 1) params.set("page", String(p))
        const qs = params.toString()
        return qs ? `${basePath}?${qs}` : `${basePath}`
    }

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
