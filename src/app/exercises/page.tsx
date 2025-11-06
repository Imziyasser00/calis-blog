import { client } from "@calis/lib/sanity.client"
import Image from "next/image"
import Link from "next/link"
import { Dumbbell } from "lucide-react"
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";

interface Exercise {
    _id: string
    name: string
    slug: string
    shortDescription: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
    primaryMuscles: string[]
    coverImage: {
        alt: string
        url: string
    }
}

async function getExercises(): Promise<Exercise[]> {
    try {
        const exercises = await client.fetch<Exercise[]>(
            `*[_type=="exercise"]|order(name asc){
        _id,
        name,
        "slug": slug.current,
        shortDescription,
        difficulty,
        "primaryMuscles": primaryMuscles[]->name,
        "coverImage": coverImage{ alt, "url": asset->url }
      }`,
        )
        return exercises
    } catch (error) {
        console.error("Error fetching exercises:", error)
        return []
    }
}

export default async function ExercisesPage() {
    const exercises = await getExercises()

    return (
        <div className="min-h-screen bg-black text-white">
<Header />
            <main className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="mb-12 text-center space-y-4">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Dumbbell className="h-10 w-10 text-purple-500" />
                        <h1 className="text-4xl md:text-5xl font-bold">
                            All Calisthenics <span className="text-purple-500">Exercises</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                        Learn the form, progressions, and programming for every bodyweight movement.
                    </p>
                </div>

                {/* Exercises Grid */}
                {exercises.length === 0 ? (
                    <div className="text-center py-20">
                        <Dumbbell className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No exercises found yet.</p>
                        <p className="text-gray-600 text-sm mt-2">Check back soon for new content!</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {exercises.map((exercise) => (
                            <Link
                                key={exercise._id}
                                href={`/exercises/${exercise.slug}`}
                                className="group block bg-black border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                {/* Cover Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={exercise.coverImage?.url || "/placeholder.svg?height=200&width=400"}
                                        alt={exercise.coverImage?.alt || exercise.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                    />

                                    {/* Difficulty Badge */}
                                    <div className="absolute top-3 right-3">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            exercise.difficulty === "Beginner"
                                ? "border-green-800 text-green-400 border bg-black"
                                : exercise.difficulty === "Intermediate"
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                        }`}
                    >
                      {exercise.difficulty}
                    </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    {/* Exercise Name */}
                                    <h3 className="font-semibold text-lg group-hover:text-purple-400 transition-colors line-clamp-1">
                                        {exercise.name}
                                    </h3>

                                    {/* Primary Muscles */}
                                    {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {exercise.primaryMuscles.slice(0, 3).map((muscle, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-0.5 bg-purple-500/10 text-purple-400 text-xs rounded-md border border-purple-500/20"
                                                >
                          {muscle}
                        </span>
                                            ))}
                                            {exercise.primaryMuscles.length > 3 && (
                                                <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-md">
                          +{exercise.primaryMuscles.length - 3}
                        </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Short Description */}
                                    <p className="text-gray-400 text-sm line-clamp-2 min-h-[2.5rem]">
                                        {exercise.shortDescription || "Learn proper form and technique for this exercise."}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

          <Footer />
        </div>
    )
}
