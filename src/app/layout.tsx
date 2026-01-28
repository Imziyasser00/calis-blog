// app/layout.tsx
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@calis/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

// -- SEO: Global metadata (baseline for all pages) ------------------------------
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Calisthenics Hub — Tutorials, Progressions & Workouts",
        template: "%s — Calisthenics Hub",
    },
    applicationName: SITE_NAME,
    description: DEFAULT_DESC,

    // Optional but helpful for SERP snippets (harmless if you don't use it elsewhere)
    category: "Fitness",

    verification: {
        google: "AGMdB0VDBN5JY8pqAeLWaBU_sB4thxrCbC4I10s1W2M",
        yandex: "XXXX",
        other: { "msvalidate.01": ["BING_CODE"] },
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

    // If you have a real webmanifest, keep it. If not, remove to avoid 404.
    manifest: "/site.webmanifest",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    // ---- JSON-LD: Organization + WebSite ---------------------------------------
    const ldOrganization = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`, // ensure this exists in /public
        sameAs: [
            // Add real links if you have them (leave empty if not)
            // "https://www.tiktok.com/@yourhandle",
            // "https://www.instagram.com/yourhandle",
            // "https://www.youtube.com/@yourchannel",
        ],
    };

    // Only keep SearchAction if /search actually exists and returns indexable results
    const ldWebsite = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        // Uncomment ONLY if you have /search working
        // potentialAction: {
        //   "@type": "SearchAction",
        //   target: `${SITE_URL}/search?q={search_term_string}`,
        //   "query-input": "required name=search_term_string",
        // },
    };

    const jsonLdCombined = [ldOrganization, ldWebsite];

    return (
        <html lang="en">
        <head>
            {/* Icons (keep what exists, remove broken ones to avoid 404 noise) */}
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <meta name="theme-color" content="#ffffff" />

            {/* Performance: Sanity CDN preconnect is good */}
            <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />

            {/* If you actually use /manifest.json keep it, otherwise delete */}
            <link rel="manifest" href="/manifest.json" />

            {/* GA4 */}
            <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-F02CLSL67R"
                strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
                {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F02CLSL67R', {
              page_path: window.location.pathname,
            });
          `}
            </Script>

            {/* Structured data: render early in HTML */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCombined) }}
            />
        </head>

        <body
            className={`${geistSans.variable} ${geistMono.variable} bg-black overflow-x-hidden antialiased min-h-screen`}
        >
        {children}
        <Toaster />
        <SpeedInsights />
        <Analytics />
        </body>
        </html>
    );
}
