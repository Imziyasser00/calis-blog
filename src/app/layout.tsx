// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@calis/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// -- SITE CONSTANTS ------------------------------------------------------------
const SITE_NAME = "Calisthenics Hub";
const SITE_URL = "https://www.calishub.com";
const DEFAULT_DESC =
    "Learn calisthenics the smart way: step-by-step progressions, workouts, and realistic programs—from absolute beginner to advanced.";

// -- SEO: Viewport -------------------------------------------------------------
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

    description: DEFAULT_DESC,
    verification: {
        google: "AGMdB0VDBN5JY8pqAeLWaBU_sB4thxrCbC4I10s1W2M",
        yandex: "XXXX",
        other: { "msvalidate.01": ["BING_CODE"] }
    },
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    // ---- JSON-LD: Organization + WebSite (+ optional SiteNavigation) -----------
    const ldOrganization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`, // optional: add public/logo.png (512x512+)
        sameAs: [
            // add your real profiles to boost E-E-A-T
            // "https://www.instagram.com/yourhandle",
            // "https://www.youtube.com/@yourchannel",
            // "https://twitter.com/yourhandle"
        ],
    };

    const ldWebsite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        potentialAction: {
            "@type": "SearchAction",
            target: `${SITE_URL}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
        },
    };

    // (Optional) Site navigation markup – update the names/urls to your real top nav
    const ldNav = {
        "@context": "https://schema.org",
        "@type": "SiteNavigationElement",
        name: ["Beginner Guide", "Exercises", "Workouts", "Skills", "Blog"],
        url: [
            `${SITE_URL}/guides/beginner`,
            `${SITE_URL}/exercises`,
            `${SITE_URL}/workouts`,
            `${SITE_URL}/skills`,
            `${SITE_URL}/blog`,
        ],
    };

    const jsonLdCombined = [ldOrganization, ldWebsite, ldNav];

    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
            <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous"/>
            <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
            <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
            <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
            <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
            <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
            <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
            <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
            <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="msapplication-TileColor" content="#ffffff"/>
            <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
            <meta name="theme-color" content="#ffffff"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
            <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous"/>
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} bg-black overflow-x-hidden antialiased min-h-screen`}>
        {children}
        <Toaster />


        <Script id="ld-all" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify(jsonLdCombined)}
        </Script>
        <SpeedInsights />
        <Analytics />
        </body>
        </html>
    );
}
