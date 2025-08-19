"use client";
import {useClient} from "sanity";
import Link from "next/link"
import Header from "@calis/components/site/Header"
import Footer from "@calis/components/site/Footer"
import FuzzyText from "@calis/components/FuzzyText";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Header />

            <main className="container my-auto mx-auto flex gap-12 px-4 py-20 ju*stify-center items-center flex-col">
                <FuzzyText
                    baseIntensity={0.3}
                    hoverIntensity={1.45}
                    enableHover={true}
                >
                    404
                </FuzzyText>
                <FuzzyText
                    baseIntensity={0.3}
                    hoverIntensity={1.45}
                    enableHover={true}
                >
                    not found
                </FuzzyText>
                <div className="max-w-xl mx-auto text-center">


                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-lg border border-purple-500 px-4 py-2 text-purple-500 hover:bg-purple-950 hover:text-white transition-colors"
                        >
                            ← Back to home
                        </Link>
                        <Link
                            href="/blog"
                            className="inline-flex items-center justify-center rounded-lg border border-gray-800 px-4 py-2 text-gray-300 hover:border-purple-500/60 hover:text-white transition-colors"
                        >
                            Browse articles
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
