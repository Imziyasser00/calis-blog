import Image from "next/image"
import { PortableText, PortableTextComponents } from "@portabletext/react"
import type { Metadata } from "next"
import { client } from "@calis/lib/sanity.client"
import { urlFor } from "@calis/lib/sanity.image"

type Post = {
    title: string
    currentSlug: string
    publishedAt?: string
    mainImage?: any
    body: any
    authorName?: string
    categories?: { _id: string; title: string }[]
}

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
        body: data.body,
        authorName: data?.author?.name,
        categories: data?.categories ?? [],
    }
}

// --- helpers ---
function getYouTubeId(url?: string) {
    if (!url) return null
    try {
        const u = new URL(url)
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1)
        if (u.hostname.includes("youtube.com")) return u.searchParams.get("v")
    } catch {}
    return null
}

// --- PortableText components (rich rendering) ---
const components: PortableTextComponents = {
    // Custom object types (blocks)
    types: {
        image: ({ value }) => {
            const src = value?.asset ? urlFor(value).width(1600).height(900).fit("max").url() : null
            if (!src) return null
            const alt = value?.alt || "Post image"
            return (
                <figure className="my-6">
                    <Image
                        src={src}
                        alt={alt}
                        width={1600}
                        height={900}
                        className="w-full rounded-xl border border-purple-500"
                        sizes="(max-width: 768px) 100vw, 768px"
                    />
                    {value?.caption ? (
                        <figcaption className="mt-2 text-sm text-gray-400">{value.caption}</figcaption>
                    ) : null}
                </figure>
            )
        },

        // workoutTable is a single object, but we still normalize then render a table row
        workoutProgram: ({ value }) => {
            const rows = Array.isArray(value?.exercises) ? value.exercises : []
            if (!rows.length) return null

            return (
                <section className="my-10">
                    {value?.title ? (
                        <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                    ) : null}
                    {value?.intro ? (
                        <p className="text-gray-300 mb-4">{value.intro}</p>
                    ) : null}

                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="min-w-full border-separate border-spacing-0">
                            <thead>
                            <tr className="[&>th]:px-3 [&>th]:py-2 bg-purple-500/10 text-left text-sm">
                                <th>Exercise</th>
                                <th>Sets</th>
                                <th>Reps</th>
                                <th>Rest</th>
                                <th>Tempo</th>
                                <th>RPE</th>
                                <th>Notes</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 text-sm">
                            {rows.map((r: any, i: number) => (
                                <tr key={i} className="[&>td]:px-3 [&>td]:py-2 align-top">
                                    <td className="font-medium">
                                        {r.superset ? (
                                            <span className="mr-2 inline-flex items-center rounded-md border border-blue-400/40 bg-blue-400/10 px-1.5 py-0.5 text-xs">
                        SS {r.superset}
                      </span>
                                        ) : null}
                                        {r.exercise}
                                    </td>
                                    <td>{r.sets ?? ""}</td>
                                    <td>{r.reps ?? ""}</td>
                                    <td>{r.rest ?? ""}</td>
                                    <td>{r.tempo ?? ""}</td>
                                    <td>{r.rpe ?? ""}</td>
                                    <td className="max-w-[28rem]">{r.notes ?? ""}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )
        },
        callout: ({ value }) => {
            const type = value?.type || "Note"
            const tone =
                type === "Warning"
                    ? "border-amber-500/50 bg-amber-500/10"
                    : type === "Tip"
                        ? "border-emerald-500/50 bg-emerald-500/10"
                        : "border-purple-500/40 bg-purple-500/10"
            const emoji = type === "Warning" ? "⚠️" : type === "Tip" ? "💡" : "📝"
            return (
                <div className={`my-6 border rounded-xl p-4 ${tone}`}>
                    <p className="m-0">
                        <span className="mr-2">{emoji}</span>
                        <span className="font-semibold">{type}:</span> {value?.text}
                    </p>
                </div>
            )
        },

        videoEmbed: ({ value }) => {
            const url = value?.url as string | undefined
            const ytId = getYouTubeId(url)
            const src = ytId ? `https://www.youtube.com/embed/${ytId}` : url
            if (!src) return null
            return (
                <div className="my-8">
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-purple-500/40">
                        <iframe
                            src={src}
                            title={value?.caption || "Embedded video"}
                            className="h-full w-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    </div>
                    {value?.caption ? (
                        <p className="mt-2 text-sm text-gray-400">{value.caption}</p>
                    ) : null}
                </div>
            )
        },

        code: ({ value }) => (
            <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
        <code>{value?.code}</code>
      </pre>
        ),
    },

    // Inline marks (decorators & annotations)
    marks: {
        underline: ({ children }) => <span className="underline underline-offset-4">{children}</span>,
        highlight: ({ children }) => (
            <span className="bg-yellow-300/30 ring-1 ring-yellow-300/30 rounded px-1">{children}</span>
        ),
        link: ({ value, children }) => {
            const href = value?.href || "#"
            const blank = !!value?.blank
            return (
                <a
                    href={href}
                    target={blank ? "_blank" : undefined}
                    rel={blank ? "noopener noreferrer" : undefined}
                    className="text-purple-400 hover:text-purple-300 underline decoration-purple-500/40"
                >
                    {children}
                </a>
            )
        },
        youtube: ({ value, children }) => {
            const href = value?.url || "#"
            return (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-red-300 no-underline"
                >
                    ▶ {children || "YouTube"}
                </a>
            )
        },
    },

    // Paragraphs & headings (block styles)
    block: {
        normal: ({ children }) => <p>{children}</p>,
        h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-bold mt-10">{children}</h1>,
        h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-bold mt-8">{children}</h2>,
        h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-semibold mt-6">{children}</h3>,
        h4: ({ children }) => <h4 className="text-xl md:text-2xl font-semibold mt-4">{children}</h4>,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-purple-500/50 pl-4 italic opacity-90 my-6">
                {children}
            </blockquote>
        ),
        highlight: ({ children }) => (
            <p className="bg-yellow-300/20 ring-1 ring-yellow-300/30 rounded-lg p-3">{children}</p>
        ),
    },

    // Lists
    list: {
        bullet: ({ children }) => <ul className="list-disc pl-6 space-y-2">{children}</ul>,
        number: ({ children }) => <ol className="list-decimal pl-6 space-y-2">{children}</ol>,
        check: ({ children }) => <ul className="pl-0 space-y-2">{children}</ul>,
    },
    listItem: {
        bullet: ({ children }) => <li className="[&>p]:m-0">{children}</li>,
        number: ({ children }) => <li className="[&>p]:m-0">{children}</li>,
        check: ({ children }) => (
            <li className="flex items-start gap-3">
        <span className="mt-1.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-emerald-500/50 bg-emerald-500/10">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-400">
            <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-7.2 7.2a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.493-6.493a1 1 0 011.414 0z"
                clipRule="evenodd"
            />
          </svg>
        </span>
                <div className="[&>p]:m-0">{children}</div>
            </li>
        ),
    },
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const data = await getData(params.slug)

    if (!data) {
        return (
            <div className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-2xl font-semibold">Post not found</h1>
                <p className="text-gray-500 mt-2">We couldn’t find a post with the slug “{params.slug}”.</p>
            </div>
        )
    }

    const mainImageUrl = data.mainImage ? urlFor(data.mainImage).width(1600).url() : null
    const published = data.publishedAt
        ? new Date(data.publishedAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : null

    return (
        <div className="overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full pt-24 px-10 md:px-0 flex flex-col gap-4">
                <h1 className="text-3xl md:text-5xl leading-snug md:leading-tight pt-32 font-bold w-full md:w-4/5 mx-auto">
                    {data.title}
                </h1>

                <div className="text-gray-500 w-full md:w-4/5 mx-auto flex flex-wrap gap-2 items-center">
                    {published && (
                        <span>
              published at <span className="text-green-500 font-bold px-2">{published}</span>
            </span>
                    )}
                    {data.authorName && (
                        <span>
              • by <span className="font-medium text-white">{data.authorName}</span>
            </span>
                    )}
                    {data.categories && data.categories.length > 0 && (
                        <span className="flex flex-wrap gap-1">
              •{" "}
                            {data.categories.map((c) => (
                                <span
                                    key={c._id}
                                    className="px-2 py-0.5 rounded-full border border-purple-500/40 text-sm"
                                >
                  {c.title}
                </span>
                            ))}
            </span>
                    )}
                </div>

                {mainImageUrl && (
                    <div className="w-full md:w-4/5 mx-auto">
                        <Image
                            src={mainImageUrl}
                            className="w-full border border-purple-500 my-4 rounded-xl"
                            width={1600}
                            height={900}
                            alt="blog image"
                            priority
                        />
                    </div>
                )}

                <article className="mt-12 prose prose-xl prose-slate w-full mx-auto prose-li:marker:text-purple-500 prose-invert max-w-none">
                    <PortableText value={data.body} components={components} />
                </article>
            </div>
        </div>
    )
}

// Static params for SSG
export async function generateStaticParams() {
    const query = /* groq */ `*[_type == "post" && defined(slug.current)]{ "slug": slug.current }`
    const data: { slug: string }[] = await client.fetch(query)
    return data.map((item) => ({ slug: item.slug }))
}

// SEO metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const data = await getData(params.slug)
    if (!data) return { title: "Post not found" }
    return {
        title: data.title,
        description: data.categories?.map((c) => c.title).join(", "),
        openGraph: {
            title: data.title,
            images: data.mainImage
                ? [
                    {
                        url: urlFor(data.mainImage).width(1200).height(630).fit("crop").url(),
                        width: 1200,
                        height: 630,
                        alt: data.title,
                    },
                ]
                : [],
        },
    }
}
