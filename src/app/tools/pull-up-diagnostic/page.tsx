import type { Metadata } from "next";
import PullUpDiagnosticWizard from "@calis/components/tools/pull-up-diagnostic/PullUpDiagnosticWizard";
import Header from "@calis/components/site/Header";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import Newsletter from "@calis/components/Newsletter";
import Footer from "@calis/components/site/Footer";

export const metadata: Metadata = {
    title: "Pull-Up Diagnostic | CalisHub Tools",
    description:
        "Find the #1 reason you can’t do pull-ups yet and get a 4-week plan based on your answers.",
};

export default function Page() {
    return (
        <div className="min-h-screen bg-black text-white">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <Link href="/tools" className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Tools
                    </Link>
                </div>
             <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Pull-Up Diagnostic 🧠💪
                    </h1>
                    <p className="mt-2 text-white/70">
                        Answer a few questions and get your primary blocker + a 4-week focus plan.
                    </p>
                </div>


                <PullUpDiagnosticWizard />
             </div>

                 <div className="mt-12   ">

                     <Newsletter />
                 </div>

            </main>
            <Footer />
        </div>
    );
}
