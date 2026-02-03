import "server-only";
import Link from "next/link";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import { client } from "@calis/lib/sanity.client";
import { Search, Sparkles } from "lucide-react";
import AskQuestionForm from "../../components/AskQuestionForm";

export const revalidate = 60;

// --------------------
// Types
// --------------------
type AnswerCardData = {
    _id: string;
    title: string;
    slug: string;
    shortAnswer?: string;
    topic?: string | null;
    publishedAt?: string | null;
};

type TopicData = {
    title: string;
};

const PAGE_SIZE = 24;

// --------------------
// Data helpers
// --------------------
async function getTopics(): Promise<string[]> {
    const query = /* groq */ `
    array::compact(array::unique(*[_type == "answerPage"].topic)) | order(@ asc)
  `;
    return client.fetch(query);
}


async function getTotalCount(q?: string, topic?: string): Promise<number> {
    const m = q ? `*${q}*` : "";
    const t = topic?.trim() || "";

    const query = /* groq */ `
    count(*[_type == "answerPage" && (
      ($m == "" || question match $m || shortAnswer match $m)
      &&
      ($t == "" || topic == $t)
    )])
  `;

    return client.fetch(query, { m, t });
}


async function getAnswers(
    page: number,
    q?: string,
    topic?: string,
    sort: "newest" | "oldest" | "az" = "newest"
): Promise<AnswerCardData[]> {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const m = q ? `*${q}*` : "";
    const t = topic?.trim() || "";

    const order =
        sort === "az"
            ? "question asc"
            : sort === "oldest"
                ? "publishedAt asc"
                : "publishedAt desc";

    const query = /* groq */ `
    *[_type == "answerPage" && (
      ($m == "" || question match $m || shortAnswer match $m)
      &&
      ($t == "" || topic == $t)
    )]
    | order(${order})
    [$start...$end]{
      _id,
      "title": question,
      "slug": slug.current,
      shortAnswer,
      topic,
      publishedAt
    }
  `;

    return client.fetch(query, { start, end, m, t });
}

// --------------------
// Page
// --------------------
export default async function AnswersIndexPage({
                                                   searchParams,
                                               }: {
    searchParams: { page?: string; q?: string; topic?: string; sort?: "newest" | "oldest" | "az" };
}) {
    const sp = await searchParams;

    const q = sp.q?.trim() || "";
    const topic = sp.topic?.trim() || "";
    const sort = sp.sort || "newest";
    const currentPage = Math.max(1, Number(sp.page) || 1);

    const [topics, totalCount, answers] = await Promise.all([
        getTopics(),
        getTotalCount(q, topic),
        getAnswers(currentPage, q, topic, sort),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Background aura (same style as your Library) */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-purple-600/40" />
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-fuchsia-500/30" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.12),transparent_60%)]" />
            </div>

            <main className="container mx-auto px-4 py-10 sm:py-14">
                {/* Header */}
                <section className="mb-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Answers • Fast Q&A • Beginner-friendly
                    </div>

                    <h1 className="mt-4 text-3xl sm:text-4xl font-bold">
                        CalisHub{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-300 bg-clip-text text-transparent">
              Answers
            </span>
                    </h1>
                    <p className="mt-2 max-w-2xl text-white/60">
                        Quick, straight-to-the-point answers for real training questions. Open any question to see a short answer,
                        key points, and a clean CTA to your tools.
                    </p>
                </section>

                {/* Controls (search + topic pills + sort) */}
                <AnswersControls topics={topics} />

                {/* Answers grid */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {answers.map((a) => (
                            <AnswerCard key={a._id} a={a} />
                        ))}
                    </div>

                    {answers.length === 0 && (
                        <p className="mt-8 text-white/50">
                            No results{q ? ` for “${q}”` : ""}{topic ? ` in “${topic}”` : ""}. Try a different search.
                        </p>
                    )}
                </section>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination currentPage={safePage} totalPages={totalPages} basePath="/answers" q={q} topic={topic} sort={sort} />
                )}
                <section id="ask" className="mt-16">
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b10] p-6 sm:p-8">
                        {/* glow */}
                        <div aria-hidden className="pointer-events-none absolute -inset-24 opacity-70">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(168,85,247,0.18),transparent_60%)]" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(217,70,239,0.12),transparent_55%)]" />
                        </div>

                        <div className="relative">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                                <span className="h-2 w-2 rounded-full bg-purple-500" />
                                Didn’t find your answer?
                            </div>

                            <h2 className="mt-4 text-2xl sm:text-3xl font-bold">
                                Ask your question
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm text-white/60">
                                Submit it here. We’ll add it to the Answers library so other beginners can find it too.
                            </p>

                            {/* You can use a client component here (recommended) */}
                            <AskQuestionForm />
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}

// --------------------
// Controls (server-rendered UI)
// --------------------
function AnswersControls({ topics }: { topics: string[] }) {
    // We read query params client-side normally, but you can keep it simple:
    // controls here just generate links (like your pagination).
    // Search is a GET form -> /answers?q=...
    return (
        <section className="mb-8">
            {/* Search */}
            <form action="/answers" method="GET" className="relative max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                    name="q"
                    placeholder="Search answers… (grip, elbow pain, beginner, reps)"
                    className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-3 py-2.5 text-sm text-white/85 placeholder:text-white/35 outline-none focus:ring-2 focus:ring-purple-500/60"
                />
                <input type="hidden" name="sort" value="newest" />
            </form>

            {/* Topic pills */}
            <div className="mt-4 flex flex-wrap gap-2">
                <Pill href="/answers" label="All" />
                {topics.map((t) => (
                    <Pill key={t} href={`/answers?topic=${encodeURIComponent(t)}`} label={t} />
                ))}
            </div>

            {/* Sort links */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-300" />
          Sort:
        </span>
                <Pill href="/answers?sort=newest" label="Newest" />
                <Pill href="/answers?sort=oldest" label="Oldest" />
                <Pill href="/answers?sort=az" label="A–Z" />
            </div>
        </section>
    );
}

function Pill({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 hover:border-purple-500/50 hover:text-white transition"
        >
            {label}
        </Link>
    );
}

// --------------------
// Card
// --------------------
function AnswerCard({ a }: { a: AnswerCardData }) {
    return (
        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b10] p-5 transition hover:border-purple-500/35">
            <Link
                href={`/answers/${a.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-purple-200 hover:text-purple-100"
            >
            <div className="pointer-events-none absolute -inset-24 opacity-0 group-hover:opacity-100 transition duration-700">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(168,85,247,0.16),transparent_60%)]" />
            </div>

            <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between gap-3 text-xs text-white/55">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-300/80" />
              {a.topic || "Other"}
          </span>
                </div>

                <h3 className="mt-3 text-lg font-semibold leading-snug">{a.title}</h3>

                <p className="mt-2 text-sm text-white/65 line-clamp-2">
                    {a.shortAnswer ? a.shortAnswer : "Open to see the short answer + key points."}
                </p>

                <div className="mt-5">

                        Open answer <span aria-hidden>→</span>
                </div>
            </div>
            </Link>

        </article>
    );
}

// --------------------
// Pagination (copied from your blog style)
// --------------------
function Pagination({
                        currentPage,
                        totalPages,
                        basePath,
                        q,
                        topic,
                        sort,
                    }: {
    currentPage: number;
    totalPages: number;
    basePath: string;
    q?: string;
    topic?: string;
    sort?: string;
}) {
    const windowSize = 2;
    const start = Math.max(1, currentPage - windowSize);
    const end = Math.min(totalPages, currentPage + windowSize);

    const pageHref = (p: number) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (topic) params.set("topic", topic);
        if (sort) params.set("sort", sort);
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
