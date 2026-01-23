"use client";

import { Sparkles } from "lucide-react";
import Chip from "./ui/Chip";
import DownloadGate from "@calis/components/library/DownloadGate";

export default function ResultHero({
                                       title,
                                       level,
                                       goal,
                                       days,
                                       onDownload,
                                       onReset,
                                   }: {
    title: string;
    level: string;
    goal: string;
    days: number;
    onDownload: () => Promise<void> | void;
    onReset: () => void;
}) {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#6ee7facc]/10 via-[#a855f7cc]/10 to-[#f472b6cc]/10 p-6 sm:p-10 backdrop-blur-xl">
            <div className="relative text-center space-y-4 sm:space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-purple-500 shadow-[0_12px_40px_rgba(168,85,247,.45)] mb-2">
                    <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight pt-8">
                    Your{" "}
                    <span className="bg-purple-500 bg-clip-text text-transparent">
            Personalized Plan
          </span>
                </h2>

                <p className="text-gray-300 text-base sm:text-lg">{title}</p>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <Chip tone="cyan">{level}</Chip>
                    <Chip tone="purple">{goal}</Chip>
                    <Chip tone="pink">{days} Days</Chip>
                </div>

                <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
                    <DownloadGate
                        onAfterUnlock={onDownload}
                        buttonLabel="Download PDF"
                        buttonClassName="inline-flex items-center justify-center gap-2 h-12 rounded-xl px-5 font-semibold text-white bg-purple-500 hover:opacity-95 transition"
                        title="Download your plan"
                        subtitle="Enter your email to unlock your personalized PDF."
                    />

                    <button
                        onClick={onReset}
                        className="h-12 rounded-xl px-5 font-semibold border border-white/10 hover:bg-white/5 transition"
                    >
                        Create New Plan
                    </button>
                </div>
            </div>
        </section>
    );
}
