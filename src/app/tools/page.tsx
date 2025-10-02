"use client"

import Link from "next/link"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@calis/components/ui/card"
import { Dumbbell, Route } from "lucide-react"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import Newsletter from "@calis/components/Newsletter";

const tools = [
    {
        title: "Max Rep Estimator",
        description:
            "Find your true strength level and progression path with scientifically validated formulas",
        icon: <Dumbbell className="h-8 w-8" />,
        slug: "max-rep-estimator",
        category: "Strength Analysis",
        status: "live",
    },
    {
        title: "Workout Generator",
        description:
            "Instantly create personalized calisthenics workouts tailored to your level and goals.",
        icon: <Route className="h-8 w-8" />,
        slug: "workout-generator",
        category: "Programming",
        status: "coming-soon",
    },
]

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto my-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Fitness <span className="text-purple-500">Tools</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Professional-grade calculators and analyzers to track your fitness
                        journey
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => {
                        const isComingSoon = tool.status === "coming-soon"

                        // Live tools → clickable Link
                        if (!isComingSoon) {
                            return (
                                <Link
                                    key={tool.slug}
                                    href={`/tools/${tool.slug}`}
                                    className="group"
                                >
                                    <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 h-full">
                                        <CardHeader>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="text-purple-500 group-hover:text-purple-400 transition-colors">
                                                    {tool.icon}
                                                </div>
                                                <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">
                          {tool.category}
                        </span>
                                            </div>
                                            <CardTitle className="text-xl text-white group-hover:text-purple-400 transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <CardDescription className="text-gray-400">
                                                {tool.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        }

                        // Coming soon tools → not a link
                        return (
                            <Card
                                key={tool.slug}
                                className="relative opacity-75 bg-gray-900 border-gray-800 hover:border-gray-700 transition-all h-full"
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-purple-500">{tool.icon}</div>
                                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                                        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
                      Coming Soon
                    </span>
                                    </div>
                                    <CardTitle className="text-xl text-white">
                                        {tool.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-400 mb-4">
                                        {tool.description}
                                    </CardDescription>
                                    <a
                                        href="#newsletter"
                                        className="inline-block rounded-lg px-3 py-1 border border-purple-500/40 text-sm text-purple-300 hover:border-purple-500/70 transition"
                                    >
                                        Get Notified
                                    </a>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
                <div className={"mt-24"}>

                <Newsletter />
                </div>

            </main>
            <Footer />
        </div>
    )
}
