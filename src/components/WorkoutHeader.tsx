import { ArrowLeft } from "lucide-react";

export default function WorkoutHeader() {
    return (
        <div className="mb-8 sm:mb-12">
            <a href="/tools" className="inline-flex items-center gap-2 text-[#a855f7] hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
            </a>
            <div className="mt-5 space-y-3">
                <h1 className="text-4xl/tight sm:text-5xl/tight md:text-6xl/tight font-extrabold tracking-tight">
                    Workout{" "}
                    <span className="bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#22d3ee] bg-clip-text text-transparent">
            Generator
          </span>
                </h1>
                <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-2xl">
                    Answer a few quick questions and we’ll build a progressive plan that fits your week.
                </p>
            </div>
        </div>
    );
}
