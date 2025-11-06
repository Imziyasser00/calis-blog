import type { Metadata } from "next";
import ClientPage from "./ClientPage";
const SITE_URL = "https://www.calishub.com"

export const metadata: Metadata = {
    title: "Workout Generator — Personalized Calisthenics Plans",
    description:
        "Instantly build a personalized calisthenics plan based on your level, goals, days per week, and equipment. Train smarter with CalisHub.",
    keywords: [
        "calisthenics workout generator",
        "bodyweight program",
        "custom plan",
        "push pull legs",
        "rings",
        "pull-up bar",
    ],
    alternates: {
        canonical: `${SITE_URL}/tools/max-rep-estimator`,
    },
    openGraph: {
        type: "website",
        siteName: "CalisHub",
        title: "Workout Generator — Personalized Calisthenics Plans",
        description:
            "Build a plan that fits your week. Beginner to advanced, with or without equipment.",
        url: "https://www.calishub.com/tools/workout-generator",
        images: [
            {
                url: "/og/workout-generator.png",
                width: 1024,
                height: 1024,
                alt: "CalisHub Workout Generator",
            },
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Workout Generator — Personalized Calisthenics Plans",
        description:
            "Build a plan that fits your week. Beginner to advanced, with or without equipment.",
        images: ["/og/workout-generator.png"],
        site: "@calishub",
        creator: "@calishub",
    },
    category: "fitness",
};

export default function Page() {
    return (
        <main className="min-h-[100svh] bg-black text-white">
            {/* JSON-LD */}
            {/* (Next.js allows Script in server components) */}
            <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebApplication",
                        name: "CalisHub Workout Generator",
                        applicationCategory: "HealthApplication",
                        operatingSystem: "Web",
                        url: "https://www.calishub.com/tools/workout-generator",
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
                                item: "https://www.calishub.com/tools",
                            },
                            {
                                "@type": "ListItem",
                                position: 2,
                                name: "Workout Generator",
                                item: "https://www.calishub.com/tools/workout-generator",
                            },
                        ],
                    }),
                }}
            />
            <ClientPage />
        </main>
    );
}
