"use client";

import Link from "next/link";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@calis/components/ui/card";
import { Dumbbell, Route, Activity } from "lucide-react";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Newsletter from "@calis/components/Newsletter";

type ToolStatus = "live" | "coming-soon";

type Tool = {
    title: string;
    description: string;
    icon: React.ReactNode;
    slug: string;
    category: string;
    status: ToolStatus;
};

const tools: Tool[] = [
    {
        title: "Pull-Up Diagnostic",
        description:
            "Find your #1 pull-up blocker and get a 4-week focus plan based on your answers.",
        icon: <Activity className="h-8 w-8" />,
        slug: "pull-up-diagnostic",
        category: "Diagnostics",
        status: "live",
    },
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
        status: "live",
    },
];

function StatusPill({ status }: { status: ToolStatus }) {
    if (status === "live") {
        return (
            <span className="text-xs text-emerald-300 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
        Live
      </span>
        );
    }
    return (
        <span className="text-xs text-amber-300 bg-amber-500/10 px-2 py-1 rounded-full border border-amber-500/20">
      Coming soon
    </span>
    );
}

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
                        Professional-grade calculators and analyzers to track your fitness journey
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => {
                        const CardInner = (
                            <Card
                                className={[
                                    "bg-gray-900 border-gray-800 transition-all duration-300 h-full",
                                    tool.status === "live"
                                        ? "hover:border-purple-500/50 hover:scale-105"
                                        : "opacity-70 cursor-not-allowed",
                                ].join(" ")}
                            >
                                <CardHeader>
                                    <div className="flex items-center justify-between gap-3 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="text-purple-500 group-hover:text-purple-400 transition-colors">
                                                {tool.icon}
                                            </div>
                                            <span className="text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full border border-purple-500/20">
                        {tool.category}
                      </span>
                                        </div>

                                        <StatusPill status={tool.status} />
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
                        );

                        // ✅ Only link if tool is live
                        return tool.status === "live" ? (
                            <Link key={tool.slug} href={`/tools/${tool.slug}`} className="group">
                                {CardInner}
                            </Link>
                        ) : (
                            <div key={tool.slug} className="group">
                                {CardInner}
                            </div>
                        );
                    })}
                </div>

                <div className="mt-24">
                    <Newsletter />
                </div>
            </main>
            <Footer />
        </div>
    );
}
