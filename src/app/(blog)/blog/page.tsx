import "server-only";
import Link from "next/link";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import { client } from "@calis/lib/sanity.client";
import ArticleCard from "@calis/components/post/ArticleCard";
import BlogControls from "@calis/components/blog/BlogControls";

export const revalidate = 60;

// --------------------
// Types
// --------------------
type SanityImage = any;

type ArticleCardData = {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    category?: string | null;
    publishedAt?: string | null;
    mainImage?: SanityImage;
};

type CategoryData = {
    _id: string;
    title: string;
    slug?: string;
};

const PAGE_SIZE = 6;

// --------------------
// Data helpers
// --------------------
async function getCategories(): Promise<CategoryData[]> {
    const query = /* groq */ `
    *[_type == "category"] | order(title asc){
      _id,
      title,
      "slug": slug.current
    }
  `;
    return client.fetch(query);
}

async function getTotalCount(q?: string, cat?: string): Promise<number> {
    const m = q ? `*${q}*` : "";
    const c = cat?.trim() || "";

    const query = /* groq */ `
    count(*[_type == "post" && (
      ($m == "" || title match $m || pt::text(body) match $m || categories[]->title match $m)
      &&
      ($c == "" || $c in categories[]->slug.current || $c in categories[]->title)
    )])
  `;
    return client.fetch(query, { m, c });
}

async function getArticles(page: number, q?: string, cat?: string): Promise<ArticleCardData[]> {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const m = q ? `*${q}*` : "";
    const c = cat?.trim() || "";

    const query = /* groq */ `
    *[_type == "post" && (
      ($m == "" || title match $m || pt::text(body) match $m || categories[]->title match $m)
      &&
      ($c == "" || $c in categories[]->slug.current || $c in categories[]->title)
    )]
    | order(publishedAt desc)
    [$start...$end]{
      _id,
      title,
      "slug": slug.current,
      "excerpt": coalesce(excerpt, pt::text(body)),
      "category": categories[0]->title,
      publishedAt,
      mainImage
    }
  `;
    return client.fetch(query, { start, end, m, c });
}

// --------------------
// Page
// --------------------
export default async function BlogIndexPage({
                                                searchParams,
                                            }: {
    searchParams: { page?: string; q?: string; cat?: string };
}) {
    const sp = await searchParams;

    const q = sp.q?.trim() || "";
    const cat = sp.cat?.trim() || "";
    const currentPage = Math.max(1, Number(sp.page) || 1);

    const [categories, totalCount, articles] = await Promise.all([
        getCategories(),
        getTotalCount(q, cat),
        getArticles(currentPage, q, cat),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-10 sm:py-14">
                {/* Header */}
                <section className="mb-6">
                    <h1 className="text-3xl sm:text-4xl font-bold">Calisthenics Articles & Guides</h1>
                    <p className="mt-2 max-w-2xl text-white/60">
                        Training guides, progressions, workouts, and practical advice to help you build real calisthenics strength.
                    </p>
                </section>

                {/* Search + Category pills */}
                <BlogControls categories={categories} />

                {/* Articles */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {articles.map((a, idx) => (
                            <ArticleCard
                                key={a._id}
                                post={{
                                    _id: a._id,
                                    title: a.title,
                                    slug: a.slug,
                                    excerpt: a.excerpt,
                                    categoryTitles: a.category ? [a.category] : [],
                                    publishedAt: a.publishedAt ?? undefined,
                                    mainImage: a.mainImage,
                                }}
                                priority={idx === 0 && safePage === 1 && !q && !cat}
                            />
                        ))}
                    </div>

                    {articles.length === 0 && (
                        <p className="mt-8 text-white/50">
                            No results{q ? ` for “${q}”` : ""}{cat ? ` in “${cat}”` : ""}. Try a different search.
                        </p>
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination currentPage={safePage} totalPages={totalPages} basePath="/blog" q={q} cat={cat} />
                )}
            </main>

            <Footer />
        </div>
    );
}

// --------------------
// Pagination
// --------------------
function Pagination({
                        currentPage,
                        totalPages,
                        basePath,
                        q,
                        cat,
                    }: {
    currentPage: number;
    totalPages: number;
    basePath: string;
    q?: string;
    cat?: string;
}) {
    const windowSize = 2;
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(totalPages, currentPage + windowSize);

    const pageHref = (p: number) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (cat) params.set("cat", cat);
        if (p > 1) params.set("page", String(p));
        return `${basePath}${params.toString() ? `?${params}` : ""}`;
    };

    return (
        <nav className="mt-12 flex justify-center gap-2" aria-label="Pagination">
            <PaginationLink href={pageHref(currentPage - 1)} disabled={currentPage === 1}>
                Prev
            </PaginationLink>

            {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
                <PaginationLink key={p} href={pageHref(p)} active={p === currentPage}>
                    {p}
                </PaginationLink>
            ))}

            <PaginationLink href={pageHref(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </PaginationLink>
        </nav>
    );
}

function PaginationLink({
                            href,
                            children,
                            active,
                            disabled,
                        }: {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    disabled?: boolean;
}) {
    if (disabled) {
        return <span className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40">{children}</span>;
    }

    return (
        <Link
            href={href}
            className={[
                "px-3 py-1.5 rounded-lg border transition",
                active
                    ? "border-purple-500/60 bg-purple-500/10 text-white"
                    : "border-white/10 text-white/70 hover:border-purple-500/50 hover:text-white",
            ].join(" ")}
        >
            {children}
        </Link>
    );
}
