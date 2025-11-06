import type React from "react"
import { client } from "@calis/lib/sanity.client"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import Script from "next/script"
import { ChevronRight, Dumbbell, Clock, Target, AlertTriangle, Play } from "lucide-react"
import { Badge } from "@calis/components/ui/badge"
import { Button } from "@calis/components/ui/button"
import { Card } from "@calis/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@calis/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@calis/components/ui/tabs"
import { GalleryLightbox } from "@calis/components/gallery-lightbox"
import Footer from "@calis/components/site/Footer";
import Header from "@calis/components/site/Header";
import Newsletter from "@calis/components/Newsletter";

const EXERCISE_QUERY = `*[_type=="exercise" && slug.current==$slug][0]{
  _id, name, "slug": slug.current, shortDescription, body,
  difficulty, type,
  "primaryMuscles": primaryMuscles[]->{name, "slug": slug.current},
  "secondaryMuscles": secondaryMuscles[]->{name, "slug": slug.current},
  "equipment": equipment[]->{name, "slug": slug.current},
  tags[]->{label, "slug": slug.current},
  coverImage{ alt, "url": asset->url },
  "gallery": gallery[]{ alt, "url": asset->url },
  demoVideoUrl, gif{ alt, "url": asset->url },
  setup,
  execution[]{ title, text, image{ alt, "url": asset->url } },
  cues,
  commonMistakes[]{ title, fix, image{ alt, "url": asset->url } },
  safetyNotes, contraindications,
  programming{ beginner, intermediate, advanced },
  tempo, rest,
  regressions[]->{ name, "slug": slug.current, coverImage{ "url": asset->url, alt } },
  progressions[]->{ name, "slug": slug.current, coverImage{ "url": asset->url, alt } },
  variations[]->{ name, "slug": slug.current, coverImage{ "url": asset->url, alt } },
  seo{ metaTitle, metaDescription, canonicalUrl, ogImage{ "url": asset->url, alt } },
  publishedAt
}`

const ALL_SLUGS_QUERY = `*[_type=="exercise"]{ "slug": slug.current }`

type Exercise = {
    _id: string
    name: string
    slug: string
    shortDescription: string
    body?: string
    difficulty: string
    type: string
    primaryMuscles?: Array<{ name: string; slug: string }>
    secondaryMuscles?: Array<{ name: string; slug: string }>
    equipment?: Array<{ name: string; slug: string }>
    tags?: Array<{ label: string; slug: string }>
    coverImage?: { alt: string; url: string }
    gallery?: Array<{ alt: string; url: string }>
    demoVideoUrl?: string
    gif?: { alt: string; url: string }
    setup?: string[]
    execution?: Array<{
        title: string
        text: string
        image?: { alt: string; url: string }
    }>
    cues?: string[]
    commonMistakes?: Array<{
        title: string
        fix: string
        image?: { alt: string; url: string }
    }>
    safetyNotes?: string
    contraindications?: string[]
    programming?: {
        beginner?: ProgrammingLevel
        intermediate?: ProgrammingLevel
        advanced?: ProgrammingLevel
    }
    tempo?: string
    rest?: string
    regressions?: Array<RelatedExercise>
    progressions?: Array<RelatedExercise>
    variations?: Array<RelatedExercise>
    seo?: {
        metaTitle?: string
        metaDescription?: string
        canonicalUrl?: string
        ogImage?: { url: string; alt: string }
    }
    publishedAt?: string
}

type ProgrammingLevel = {
    sets?: string
    reps?: string
    rir?: string
    tempo?: string
    rest?: string
    notes?: string
}

type RelatedExercise = {
    name: string
    slug: string
    coverImage?: { url: string; alt: string }
}

export async function generateStaticParams() {
    const slugs = await client.fetch<Array<{ slug: string }>>(ALL_SLUGS_QUERY)
    return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>
}): Promise<Metadata> {
    const { slug } = await params
    const exercise = await client.fetch<Exercise>(EXERCISE_QUERY, { slug })

    if (!exercise) {
        return {
            title: "Exercise Not Found",
        }
    }

    const title = exercise.seo?.metaTitle || `${exercise.name} — CalisHub`
    const description = exercise.seo?.metaDescription || exercise.shortDescription
    const canonical = exercise.seo?.canonicalUrl || `https://calishub.com/exercises/${slug}`
    const ogImage = exercise.seo?.ogImage?.url || exercise.coverImage?.url || ""

    return {
        title,
        description,
        alternates: {
            canonical,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            images: ogImage ? [{ url: ogImage }] : [],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ogImage ? [ogImage] : [],
        },
    }
}

export default async function ExerciseDetailPage({
                                                     params,
                                                 }: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const exercise = await client.fetch<Exercise>(EXERCISE_QUERY, { slug })

    if (!exercise) {
        notFound()
    }

    // Generate JSON-LD structured data
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Home",
                        item: "https://calishub.com",
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Exercises",
                        item: "https://calishub.com/exercises",
                    },
                    {
                        "@type": "ListItem",
                        position: 3,
                        name: exercise.name,
                        item: `https://calishub.com/exercises/${slug}`,
                    },
                ],
            },
            {
                "@type": "HowTo",
                name: exercise.name,
                description: exercise.shortDescription,
                image: exercise.coverImage?.url,
                step: exercise.execution?.map((step, index) => ({
                    "@type": "HowToStep",
                    position: index + 1,
                    name: step.title,
                    text: step.text,
                    image: step.image?.url,
                })),
            },
            {
                "@type": "ExercisePlan",
                name: exercise.name,
                description: exercise.shortDescription,
                exerciseType: exercise.type,
                intensity: exercise.difficulty,
                repetitions: exercise.programming?.beginner?.reps,
                restPeriods: exercise.rest,
            },
        ],
    }

    return (
        <>

            <Script
                id="exercise-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="min-h-screen bg-black text-white">
                <Header />
                <div className="container max-w-6xl mx-auto px-4 py-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
                        <Link href="/" className="hover:text-purple-400 transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <Link href="/exercises" className="hover:text-purple-400 transition-colors">
                            Exercises
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-zinc-100">{exercise.name}</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <h1 className="text-4xl md:text-5xl font-bold text-white">{exercise.name}</h1>
                            <DifficultyPill difficulty={exercise.difficulty} />
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {exercise.primaryMuscles?.map((muscle) => (
                                <Badge
                                    key={muscle.slug}
                                    variant="secondary"
                                    className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                                >
                                    <Target className="w-3 h-3 mr-1" />
                                    {muscle.name}
                                </Badge>
                            ))}
                        </div>

                        <p className="text-lg text-zinc-300 max-w-3xl">{exercise.shortDescription}</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Hero Media */}
                            <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                                {exercise.coverImage && (
                                    <div className="relative aspect-video">
                                        <Image
                                            src={exercise.coverImage.url || "/placeholder.svg"}
                                            alt={exercise.coverImage.alt || exercise.name}
                                            fill
                                            className="object-cover rounded-2xl"
                                            priority
                                            sizes="(max-width: 1024px) 100vw, 66vw"
                                        />
                                    </div>
                                )}

                                <div className="p-4 flex gap-3">
                                    {exercise.gif?.url && (
                                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                                            <Play className="w-4 h-4" />
                                            Play GIF
                                        </Button>
                                    )}
                                </div>
                            </Card>

                            {/* How-to Section */}
                            <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                                <h2 className="text-2xl font-bold text-white mb-6">How to Perform</h2>

                                {/* Setup */}
                                {exercise.setup && exercise.setup.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-purple-400 mb-3">Setup</h3>
                                        <ul className="space-y-2">
                                            {exercise.setup.map((item, index) => (
                                                <li key={index} className="flex gap-3 text-zinc-300 leading-relaxed">
                                                    <span className="text-purple-400 font-bold">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Execution Steps */}
                                {exercise.execution && exercise.execution.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-purple-400 mb-3">Execution</h3>
                                        <div className="space-y-4">
                                            {exercise.execution.map((step, index) => (
                                                <div key={index} className="bg-zinc-800/50 rounded-xl p-4">
                                                    <h4 className="font-semibold text-white mb-2">
                                                        {index + 1}. {step.title}
                                                    </h4>
                                                    <p className="text-zinc-300 leading-relaxed mb-3">{step.text}</p>
                                                    {step.image && (
                                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                                            <Image
                                                                src={step.image.url || "/placeholder.svg"}
                                                                alt={step.image.alt || step.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Coaching Cues */}
                                {exercise.cues && exercise.cues.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-purple-400 mb-3">Coaching Cues</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {exercise.cues.map((cue, index) => (
                                                <Badge key={index} variant="outline" className="bg-zinc-800/50 text-zinc-300 border-zinc-700">
                                                    {cue}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Common Mistakes */}
                            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                                <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                                    <h2 className="text-2xl font-bold text-white mb-4">Common Mistakes</h2>
                                    <Accordion type="single" collapsible className="space-y-2">
                                        {exercise.commonMistakes.map((mistake, index) => (
                                            <AccordionItem
                                                key={index}
                                                value={`mistake-${index}`}
                                                className="bg-zinc-800/50 rounded-lg border-zinc-700"
                                            >
                                                <AccordionTrigger className="px-4 hover:no-underline">
                                                    <span className="text-left text-white">{mistake.title}</span>
                                                </AccordionTrigger>
                                                <AccordionContent className="px-4 pb-4">
                                                    <p className="text-zinc-300 mb-3">
                                                        <span className="text-purple-400 font-semibold">Fix:</span> {mistake.fix}
                                                    </p>
                                                    {mistake.image && (
                                                        <div className="relative aspect-video rounded-lg overflow-hidden">
                                                            <Image
                                                                src={mistake.image.url || "/placeholder.svg"}
                                                                alt={mistake.image.alt || mistake.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                            />
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </Card>
                            )}

                            {/* Safety */}
                            {(exercise.safetyNotes || (exercise.contraindications && exercise.contraindications.length > 0)) && (
                                <Card className="bg-red-950/20 border-red-900/50 p-6">
                                    <div className="flex gap-3 mb-4">
                                        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                        <h2 className="text-2xl font-bold text-white">Safety Notes</h2>
                                    </div>

                                    {exercise.safetyNotes && <p className="text-zinc-300 mb-4 leading-relaxed">{exercise.safetyNotes}</p>}

                                    {exercise.contraindications && exercise.contraindications.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-red-400 mb-2">Contraindications</h3>
                                            <ul className="space-y-2">
                                                {exercise.contraindications.map((item, index) => (
                                                    <li key={index} className="flex gap-3 text-zinc-300">
                                                        <span className="text-red-400">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Card>
                            )}

                            {/* Programming */}
                            {exercise.programming && (
                                <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Programming Recommendations</h2>

                                    <Tabs defaultValue="beginner" className="w-full">
                                        <TabsList className="grid w-full text-white grid-cols-3 bg-zinc-800/50">
                                            <TabsTrigger value="beginner" className={"text-purple-500 font-semibold"}>Beginner</TabsTrigger>
                                            <TabsTrigger value="intermediate"  className={"text-purple-500"}>Intermediate</TabsTrigger>
                                            <TabsTrigger value="advanced"  className={"text-purple-500"}>Advanced</TabsTrigger>
                                        </TabsList>

                                        {["beginner", "intermediate", "advanced"].map((level) => {
                                            const data = exercise.programming?.[level as keyof typeof exercise.programming]
                                            return (
                                                <TabsContent key={level} value={level} className="mt-4">
                                                    {data ? (
                                                        <div className="bg-zinc-800/50 rounded-xl p-6 space-y-4">
                                                            <div className="grid sm:grid-cols-2 gap-4">
                                                                {data.sets && <QuickFact label="Sets" value={data.sets} />}
                                                                {data.reps && <QuickFact label="Reps" value={data.reps} />}
                                                                {data.rir && <QuickFact label="RIR" value={data.rir} />}
                                                                {data.tempo && <QuickFact label="Tempo" value={data.tempo} />}
                                                                {data.rest && <QuickFact label="Rest" value={data.rest} />}
                                                            </div>
                                                            {data.notes && (
                                                                <p className="text-zinc-300 leading-relaxed pt-4 border-t border-zinc-700">
                                                                    {data.notes}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-zinc-400 text-center py-8">
                                                            No programming data available for this level.
                                                        </p>
                                                    )}
                                                </TabsContent>
                                            )
                                        })}
                                    </Tabs>
                                </Card>
                            )}

                            {/* Gallery */}
                            {exercise.gallery && exercise.gallery.length > 0 && (
                                <Card className="bg-zinc-900/50 border-zinc-800 p-6">
                                    <h2 className="text-2xl font-bold text-white mb-6">Gallery</h2>
                                    <GalleryLightbox images={exercise.gallery} />
                                </Card>
                            )}

                            {/* Related Exercises */}
                            {(exercise.regressions?.length || exercise.progressions?.length || exercise.variations?.length) && (
                                <div className="space-y-6">
                                    {exercise.regressions && exercise.regressions.length > 0 && (
                                        <RelatedRow title="Regressions" exercises={exercise.regressions} />
                                    )}
                                    {exercise.progressions && exercise.progressions.length > 0 && (
                                        <RelatedRow title="Progressions" exercises={exercise.progressions} />
                                    )}
                                    {exercise.variations && exercise.variations.length > 0 && (
                                        <RelatedRow title="Variations" exercises={exercise.variations} />
                                    )}
                                </div>
                            )}

                            {/* CTA */}
<Newsletter />                       </div>

                        {/* Sidebar - Quick Facts */}
                        <div className="lg:col-span-1">
                            <Card className="bg-zinc-900/50 border-zinc-800 p-6 sticky top-8">
                                <h3 className="text-xl font-bold text-white mb-6">Quick Facts</h3>

                                <div className="space-y-4">
                                    <QuickFact label="Type" value={exercise.type} icon={<Dumbbell className="w-4 h-4" />} />

                                    {exercise.equipment && exercise.equipment.length > 0 && (
                                        <div>
                                            <p className="text-sm text-zinc-400 mb-2">Equipment</p>
                                            <div className="flex flex-wrap gap-2">
                                                {exercise.equipment.map((item) => (
                                                    <Badge key={item.slug} variant="secondary" className="bg-zinc-800 text-zinc-300">
                                                        {item.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                                        <div>
                                            <p className="text-sm text-zinc-400 mb-2">Secondary Muscles</p>
                                            <div className="flex flex-wrap gap-2">
                                                {exercise.secondaryMuscles.map((muscle) => (
                                                    <Badge
                                                        key={muscle.slug}
                                                        variant="outline"
                                                        className="bg-zinc-800/50 text-zinc-300 border-zinc-700"
                                                    >
                                                        {muscle.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {exercise.tempo && (
                                        <QuickFact label="Tempo" value={exercise.tempo} icon={<Clock className="w-4 h-4" />} />
                                    )}

                                    {exercise.rest && (
                                        <QuickFact label="Rest" value={exercise.rest} icon={<Clock className="w-4 h-4" />} />
                                    )}

                                    {exercise.tags && exercise.tags.length > 0 && (
                                        <div>
                                            <p className="text-sm text-zinc-400 mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-2">
                                                {exercise.tags.map((tag) => (
                                                    <Badge
                                                        key={tag.slug}
                                                        variant="outline"
                                                        className="bg-purple-500/10 text-purple-300 border-purple-500/30"
                                                    >
                                                        {tag.label}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

// Helper Components
function DifficultyPill({ difficulty }: { difficulty: string }) {
    const colors = {
        beginner: "bg-green-500/20 text-green-300 border-green-500/30",
        intermediate: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        advanced: "bg-red-500/20 text-red-300 border-red-500/30",
    }

    const color = colors[difficulty.toLowerCase() as keyof typeof colors] || colors.beginner

    return (
        <Badge variant="outline" className={color}>
            {difficulty}
        </Badge>
    )
}

function QuickFact({
                       label,
                       value,
                       icon,
                   }: {
    label: string
    value: string
    icon?: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3">
            {icon && <div className="text-purple-400 mt-1">{icon}</div>}
            <div>
                <p className="text-sm text-zinc-400">{label}</p>
                <p className="text-white font-medium">{value}</p>
            </div>
        </div>
    )
}

function RelatedRow({
                        title,
                        exercises,
                    }: {
    title: string
    exercises: RelatedExercise[]
}) {
    return (
        <Card className="bg-zinc-900/50 border-zinc-800 p-6">
            <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((ex) => (
                    <Link
                        key={ex.slug}
                        href={`/exercises/${ex.slug}`}
                        className="group bg-zinc-800/50 rounded-xl overflow-hidden hover:bg-zinc-800 transition-colors"
                    >
                        {ex.coverImage && (
                            <div className="relative aspect-video">
                                <Image
                                    src={ex.coverImage.url || "/placeholder.svg"}
                                    alt={ex.coverImage.alt || ex.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <p className="text-white font-medium group-hover:text-purple-400 transition-colors">{ex.name}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </Card>
    )
}
