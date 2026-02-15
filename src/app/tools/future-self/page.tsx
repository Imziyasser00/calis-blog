import type { Metadata } from "next";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Newsletter from "@calis/components/Newsletter";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import FutureSelfSimulator from "./FutureSelfSimulator";

export const metadata: Metadata = {
    title: "Future Self Simulator | CalisHub Tools",
    description:
        "Project your push-up strength in 3, 6, and 12 months. Share your predicted gains and challenge your future self.",
};

export default function Page() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <main className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link
                        href="/tools"
                        className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tools
                    </Link>
                </div>

                <div className="mx-auto  px-4 py-10">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Future Self Simulator 🧬⚡
                        </h1>
                        <p className="mt-2 text-white/70">
                            Enter your current max push-ups and consistency. Watch your projected curve grow.
                        </p>
                    </div>

                    <FutureSelfSimulator />
                </div>

                <div className="mt-12">
                    <Newsletter />
                </div>
            </main>

            <Footer />
        </div>
    );
}
