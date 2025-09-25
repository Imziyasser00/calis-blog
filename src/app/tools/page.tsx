"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@calis/components/ui/card'
import { Dumbbell } from "lucide-react"
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";

const tools = [
    {
        title: "Max Rep Estimator",
        description: "Find your true strength level and progression path with scientifically validated formulas",
        icon: <Dumbbell className="h-8 w-8" />,
        slug: "max-rep-estimator",
        category: "Strength Analysis",
    },
]

export default function ToolsPage() {
    return (
        <div className="min-h-screen  bg-black text-white">
            <Header />
            <main className="container mx-auto my-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Fitness <span className="text-purple-500">Tools</span>
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Professional-grade calculators and analyzers to track your fitness journey
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                            <Card className="bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 h-full">
                                <CardHeader>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="text-purple-500 group-hover:text-purple-400 transition-colors">{tool.icon}</div>
                                        <span className="text-xs text-purple-500 bg-purple-500/10 px-2 py-1 rounded-full">
                      {tool.category}
                    </span>
                                    </div>
                                    <CardTitle className="text-xl text-white group-hover:text-purple-400 transition-colors">{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-400">{tool.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}
