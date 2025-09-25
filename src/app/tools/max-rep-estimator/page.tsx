import "server-only"
import type { Metadata } from "next"
import ToolPage from "./tools"

const SITE_URL = "https://www.calishub.com"

export const metadata: Metadata = {
    title: {
        default: "Calisthenics Strength & Progression Calculator",
        template: "%s · CalisHub",
    },
    description:
        "Estimate your bodyweight strength (Epley 1RM), see your level, and follow a smart progression path across push, pull, rings, legs, and core.",
    alternates: {
        canonical: `${SITE_URL}/tools/max-rep-estimator`,
    },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/tools/max-rep-estimator`,
        siteName: "CalisHub",
        title: "Calisthenics Strength & Progression · CalisHub",
        description:
            "Discover your bodyweight strength ratio, estimated 1RM, skill unlocks, and next progressions for calisthenics.",
        images: [
            {
                url: `${SITE_URL}/og/tools-calisthenics-strength.png`,
                width: 1200,
                height: 630,
                alt: "Calisthenics Strength & Progression Calculator",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Calisthenics Strength & Progression · CalisHub",
        description:
            "Estimate 1RM, visualize your level, and unlock the next steps in your calisthenics journey.",
        images: [`${SITE_URL}/og/tools-calisthenics-strength.png`],
        creator: "@calishub",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    category: "Tools",
    keywords: [
        "calisthenics calculator",
        "bodyweight strength",
        "Epley 1RM",
        "pull-ups strength",
        "push-ups strength",
        "dips",
        "squats",
        "progression path",
        "skill unlocks",
        "fitness tool",
    ],
}

export default function Page() {
    return <ToolPage />
}
