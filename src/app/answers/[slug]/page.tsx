import "server-only";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import { client } from "@calis/lib/sanity.client";
import { ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import AskQuestionInlineSection from "@calis/components/answers/AskQuestionInlineSection";

export const revalidate = 60;

const SITE_URL = "https://www.calishub.com";

// --------------------
// Types
// --------------------
type FAQItem = {
    question: string;
    answer: string;
};

type AnswerDoc = {
    _id: string;
    question: string;
    slug: string;
    topic: string;
    publishedAt?: string | null;

    shortAnswer: string;
    keyPoints?: string[];

    table?: {
        caption?: string;
        columns?: string[];
        rows?: { cells?: string[] }[];
    };

    cta?: {
        label?: string;
        href?: string;
        note?: string;
    };

    faq?: FAQItem[];

    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        canonical?: string;
        noindex?: boolean;
    };
};

// --------------------
// Data helpers
// --------------------
async function getAnswerBySlug(slug: string): Promise<AnswerDoc | null> {
    const query = /* groq */ `
    *[_type == "answerPage" && slug.current == $slug][0]{
      _id,
      question,
      "slug": slug.current,
      topic,
      publishedAt,
      shortAnswer,
      keyPoints,
      table{
        caption,
        columns,
        rows[]{ cells }
      },
      cta{
        label,
        href,
        note
      },
      faq[]{
        question,
        answer
      },
      seo{
        metaTitle,
        metaDescription,
        canonical,
        noindex
      }
    }
  `;
    return client.fetch(query, { slug });
}

// For SEO rich results
function buildFaqJsonLd(faq?: FAQItem[]) {
    if (!faq?.length) return null;
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq
            .filter((f) => f?.question && f?.answer)
            .map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: f.answer,
                },
            })),
    };
}

// --------------------
// Metadata
// --------------------
export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const doc = await getAnswerBySlug(slug);

    if (!doc) return { title: "Answer not found | CalisHub" };

    const canonical =
        doc.seo?.canonical?.trim() ||
        `${SITE_URL}/answers/${doc.slug}`;

    const title =
        doc.seo?.metaTitle?.trim() ||
        `${doc.question} | CalisHub`;

    const description =
        doc.seo?.metaDescription?.trim() ||
        doc.shortAnswer?.slice(0, 155);

    const noindex = Boolean(doc.seo?.noindex);

    return {
        title,
        description,
        alternates: { canonical },
        robots: noindex
            ? { index: false, follow: false }
            : {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                    "max-video-preview": -1,
                },
            },
        openGraph: {
            type: "article",
            url: canonical,
            siteName: "CalisHub",
            title,
            description,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

// --------------------
// Page
// --------------------
export default async function AnswerPage({
                                             params,
                                         }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const doc = await getAnswerBySlug(slug);
    if (!doc) notFound();

    const faqJsonLd = buildFaqJsonLd(doc.faq);

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            {/* Background aura */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-purple-600/40" />
                <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full blur-3xl opacity-25 bg-fuchsia-500/30" />
                <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgba(168,85,247,0.12),transparent_60%)]" />
            </div>

            <main className="container mx-auto px-4 py-10 sm:py-14">
                {/* Breadcrumb / back */}
                <div className="mx-auto max-w-3xl">
                    <Link
                        href="/answers"
                        className="text-sm text-white/60 hover:text-white transition"
                    >
                        ← Back to Answers
                    </Link>
                </div>

                {/* Hero */}
                <section className="mx-auto max-w-3xl mt-4">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                        <span className="h-2 w-2 rounded-full bg-purple-500" />
                        Topic: <span className="text-white/85">{doc.topic}</span>
                    </div>

                    <h1 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">
                        {doc.question}
                    </h1>

                    <p className="mt-4 text-lg text-white/70">
                        {doc.shortAnswer}
                    </p>

                    {/* Optional quick CTA under short answer */}
                    {doc.cta?.href ? (
                        <div className="mt-6">
                            <Link
                                href={doc.cta.href}
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                            >
                                {doc.cta.label || "Try the tool"}{" "}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            {doc.cta.note ? (
                                <p className="mt-2 text-sm text-white/55">
                                    {doc.cta.note}
                                </p>
                            ) : null}
                        </div>
                    ) : null}
                </section>

                {/* Content blocks */}
                <section className="mx-auto max-w-3xl mt-10 space-y-8">
                    {/* Key points */}
                    {doc.keyPoints?.length ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <div className="flex items-center gap-2 text-purple-200">
                                <Sparkles className="h-4 w-4" />
                                <h2 className="text-lg font-semibold text-white">
                                    Key points
                                </h2>
                            </div>

                            <ul className="mt-4 space-y-2 text-white/75">
                                {doc.keyPoints.slice(0, 10).map((k, i) => (
                                    <li key={i} className="flex gap-3">
                                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-purple-300/80" />
                                        <span>{k}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {/* Optional table */}
                    {doc.table?.columns?.length && doc.table?.rows?.length ? (
                        <div className="rounded-2xl border border-white/10 bg-[#0b0b10] p-6">
                            <h2 className="text-lg font-semibold">
                                {doc.table.caption || "Quick reference"}
                            </h2>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="text-left text-white/70">
                                        {doc.table.columns.map((c, idx) => (
                                            <th
                                                key={idx}
                                                className="border-b border-white/10 py-2 pr-4"
                                            >
                                                {c}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className="text-white/75">
                                    {doc.table.rows.map((r, i) => (
                                        <tr key={i} className="align-top">
                                            {(r.cells || []).map((cell, j) => (
                                                <td
                                                    key={j}
                                                    className="border-b border-white/10 py-3 pr-4"
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : null}

                    {/* FAQ */}
                    {doc.faq?.length ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                            <div className="flex items-center gap-2">
                                <HelpCircle className="h-4 w-4 text-purple-200" />
                                <h2 className="text-lg font-semibold">FAQ</h2>
                            </div>

                            <div className="mt-4 space-y-4">
                                {doc.faq.slice(0, 10).map((f, idx) => (
                                    <details
                                        key={idx}
                                        className="rounded-xl border border-white/10 bg-black/30 p-4"
                                    >
                                        <summary className="cursor-pointer text-white/85 font-medium">
                                            {f.question}
                                        </summary>
                                        <p className="mt-3 text-white/70">{f.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    {/* Back */}
                    <div className="text-center">
                        <Link
                            href="/answers"
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                        >
                            Browse more answers <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                    {/* Ask */}
                    <AskQuestionInlineSection defaultTopic={doc.topic} />

                </section>
            </main>

            {/* JSON-LD for FAQ rich results */}
            {faqJsonLd ? (
                <script
                    type="application/ld+json"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            ) : null}

            <Footer />
        </div>
    );
}
