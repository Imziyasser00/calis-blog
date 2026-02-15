"use client";

import Link from "next/link";

export default function MaxRepHeader() {
    return (
        <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold">
                        Max-Rep Estimator
                    </h1>
                    <p className="mt-2 text-gray-400">
                        Estimate your 1RM-equivalent + rep max table using BW, added load, RIR, tempo, and rest.
                    </p>
                </div>

                <Link
                    href="/tools"
                    className="hidden sm:inline-flex h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition items-center"
                >
                    All tools
                </Link>
            </div>
        </div>
    );
}
