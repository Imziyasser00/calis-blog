import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import ToasterClient from "./ToasterClient";
import AnalyticsGate from "./AnalyticsGate";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const SITE_NAME = "Calisthenics Hub";
const SITE_URL = "https://www.calishub.com";
const DEFAULT_DESC =
    "Learn calisthenics the smart way: step-by-step progressions, workouts, and realistic programs—from absolute beginner to advanced.";

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Calisthenics Hub — Tutorials, Progressions & Workouts",
        template: "%s — Calisthenics Hub",
    },
    applicationName: SITE_NAME,
    description: DEFAULT_DESC,
    category: "Fitness",
    alternates: {
        canonical: `${SITE_URL}/`,
        types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
    },
    openGraph: {
        type: "website",
        url: `${SITE_URL}/`,
        siteName: SITE_NAME,
        title: "Calisthenics Hub — Tutorials, Progressions & Workouts",
        description: DEFAULT_DESC,
        images: [
            {
                url: `${SITE_URL}/og.jpg`,
                width: 1200,
                height: 630,
                alt: SITE_NAME,
                type: "image/jpeg",
            },
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Calisthenics Hub — Tutorials, Progressions & Workouts",
        description: DEFAULT_DESC,
        images: [`${SITE_URL}/og.jpg`],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    manifest: "/site.webmanifest",
};

const ENABLE_VERCEL_ANALYTICS = process.env.NODE_ENV === "production";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const jsonLdCombined = [
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
            sameAs: [],
        },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
        },
    ];

    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <meta name="theme-color" content="#ffffff" />

            <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCombined) }}
            />
        </head>

        <body className={`${geistSans.variable} bg-black overflow-x-hidden antialiased min-h-screen`}>
        {children}

        <ToasterClient />

        {/* ✅ GA loads only after first interaction */}
        <AnalyticsGate />

        {/* ✅ Vercel scripts only in production */}
        {ENABLE_VERCEL_ANALYTICS && <SpeedInsights />}
        {ENABLE_VERCEL_ANALYTICS && <Analytics />}
        </body>
        </html>
    );
}
