"use client";

import MaxRepHeader from "@calis/components/MaxRepHeader";
import StickyNav from "@calis/components/StickyNav";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Estimator from "./Estimator"; // 👈 your max-rep tool main client component

export default function ClientPage() {
    return (
        <>
            <Header />

            {/* CONTENT WRAPPER — ends before Footer */}
            <section className="relative">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-36 sm:pb-20 pt-6 sm:pt-10">
                    <MaxRepHeader />
                    <Estimator />
                </div>

                {/* STICKY (not fixed) — will stick inside the section and stop before Footer */}
                <div className="sm:hidden sticky bottom-[max(env(safe-area-inset-bottom),12px)] z-30">
                    <div className="mx-auto w-full max-w-6xl px-4">
                        <div className="rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl p-2 shadow-[0_8px_32px_rgba(0,0,0,.5)] mb-10">
                            <StickyNav />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
