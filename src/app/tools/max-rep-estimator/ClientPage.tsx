"use client";

import MaxRepHeader from "@calis/components/MaxRepHeader";
import Header from "@calis/components/site/Header";
import Footer from "@calis/components/site/Footer";
import Estimator from "./Estimator";

export default function ClientPage() {
    return (
        <>
            <Header />

            <section className="relative">
                {/* Keep bottom padding so mobile fixed bar has room */}
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-36 sm:pb-20 pt-6 sm:pt-10">
                    <MaxRepHeader />
                    <Estimator />
                </div>
            </section>

            <Footer />
        </>
    );
}
