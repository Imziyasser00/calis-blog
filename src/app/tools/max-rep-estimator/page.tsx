// app/tools/max-rep-estimator/page.tsx
import type { Metadata } from "next";
import ClientPage from "./ClientPage";

const SITE_URL = "https://www.calishub.com";

export const metadata: Metadata = {
    title: "Max-Rep Estimator — Advanced Calisthenics Strength Calculator",
    description:
        "Estimate your calisthenics 1RM-equivalent and rep maxes (3RM/5RM/8RM/10RM) using reps, bodyweight, added load, RIR, tempo, and rest quality. Get training targets instantly with CalisHub.",
    keywords: [
        "max rep estimator",
        "calisthenics strength calculator",
        "pull-up 1rm estimator",
        "weighted pull-up calculator",
        "dip 1rm estimator",
        "rep max table",
        "bodyweight strength ratio",
        "RIR estimator",
    ],
    alternates: {
        canonical: `${SITE_URL}/tools/max-rep-estimator`,
    },
    openGraph: {
        type: "website",
        siteName: "CalisHub",
        title: "Max-Rep Estimator — Advanced Calisthenics Strength Calculator",
        description:
            "Estimate your 1RM-equivalent, rep max table, and training targets using RIR, tempo, and rest quality.",
        url: `${SITE_URL}/tools/max-rep-estimator`,
        images: [
            {
                url: "/og/max-rep-estimator.png",
                width: 1024,
                height: 1024,
                alt: "CalisHub Max-Rep Estimator",
            },
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Max-Rep Estimator — Advanced Calisthenics Strength Calculator",
        description:
            "Estimate 1RM-equivalent + rep maxes for pull-ups, dips, push-ups and more. Advanced inputs: RIR, tempo, rest quality.",
        images: ["/og/max-rep-estimator.png"],
        site: "@calishub",
        creator: "@calishub",
    },
    category: "fitness",
};

export default function Page() {
    return (
        <main className="min-h-[100svh] bg-black text-white">
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        name: "CalisHub Max-Rep Estimator",
                        applicationCategory: "HealthApplication",
                        operatingSystem: "Web",
                        url: `${SITE_URL}/tools/max-rep-estimator`,
                        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
                        publisher: { "@type": "Organization", name: "CalisHub" },
                    }),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        itemListElement: [
                            {
                                "@type": "ListItem",
                                position: 1,
                                name: "Tools",
                                item: `${SITE_URL}/tools`,
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                name: "Max-Rep Estimator",
                                item: `${SITE_URL}/tools/max-rep-estimator`,
                            },
                        ],
                    }),
                }}
            />

            <ClientPage />
        </main>
    );
}
