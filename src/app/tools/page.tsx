"use client"

import Link from "next/link"
import { Calculator, Dumbbell, Activity, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@calis/components/ui/card"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"

export default function ToolsPage() {
    const tools = [
        {
            slug: "max-rep-calculator",
            title: "Max Rep → Training Level",
            description: "Enter your max reps to determine your training level",
            icon: Activity,
        },
        {
            slug: "workout-generator",
            title: "Workout Generator",
            description: "Get a random 3-exercise workout based on your level",
            icon: Dumbbell,
        },
        {
            slug: "bmi-calculator",
            title: "BMI Calculator",
            description: "Calculate your Body Mass Index and category",
            icon: Calculator,
        },
    ]

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Fitness <span className="text-purple-500">Tools</span>
                    </h1>
                    <p className="text-gray-400 text-lg">Quick calculators and generators to help with your fitness journey.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tools.map((tool) => {
                        const IconComponent = tool.icon
                        return (
                            <Link key={tool.slug} href={`/tools/${tool.slug}`}>
                                <Card className="bg-gray-800 border border-gray-700 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer group">
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <IconComponent className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                            <CardTitle className="text-white group-hover:text-purple-200 transition-colors">
                                                {tool.title}
                                            </CardTitle>
                                        </div>
                                        <CardDescription className="text-gray-300">{tool.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
                                            Open Tool →
                                        </div>
                                    </CardContent>
                                </Card>

                            </Link>
                        )
                    })}
                </div>
            </main>
            <Footer />
        </div>
    )
}
