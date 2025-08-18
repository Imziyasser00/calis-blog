// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@calis/components/ui/sonner";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// -- SITE CONSTANTS ------------------------------------------------------------
const SITE_NAME = "Calisthenics Hub";
const SITE_URL = process.env.SITE_URL || "http://localhost:3000";
const DEFAULT_DESC =
    "Learn calisthenics the smart way: step-by-step progressions, technique cues, workouts, and realistic programs—from absolute beginner to advanced. Tutorials, tips, and coaching notes.";

// -- SEO: Viewport -------------------------------------------------------------
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

// -- SEO: Metadata -------------------------------------------------------------
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    title: "Calisthenics Hub — Tutorials, Progressions & Workouts",
    description: DEFAULT_DESC,
    keywords: [
        "calisthenics", "bodyweight training", "progressions", "workouts",
        "handstand", "muscle up", "front lever", "pull ups", "push ups",
        "beginner calisthenics", "street workout"
    ],
    category: "Fitness",
    formatDetection: { email: false, address: false, telephone: false },
    alternates: {
        canonical: "/",
        types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
        type: "website",
        url: "/",
        siteName: SITE_NAME,
        title: "Calisthenics Hub — Tutorials, Progressions & Workouts",
        description: DEFAULT_DESC,
        images: [
            {
                url: "/og.jpg", // ensure 1200x630 (<= 5MB)
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "Calisthenics Hub — Tutorials, Progressions & Workouts",
        description: DEFAULT_DESC,
        images: ["/og.jpg"],
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
    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/site.webmanifest",
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
        { color: "#ffffff" }
    ],
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
            {/* Small perf wins: preconnects for common CDNs you actually use */}
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-950`}>
        {children}
        <Toaster />

        {/* Single inline script for all schema (reduces number of inline scripts) */}
        <Script id="ld-all" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify(jsonLdCombined)}
        </Script>
        </body>
        </html>
    );
}
