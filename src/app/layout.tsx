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

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: "Calisthenics Hub — Tutorials, Progressions & Workouts",
        template: "%s — Calisthenics Hub",
    },
    description: DEFAULT_DESC,
    verification: {
        google: "AGMdB0VDBN5JY8pqAeLWaBU_sB4thxrCbC4I10s1W2M",
    },
    alternates: {
        canonical: `${SITE_URL}/`,
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
    },
    manifest: "/site.webmanifest",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    // JSON-LD Schema Markup
    const jsonLdCombined = [
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            logo: `${SITE_URL}/logo.png`,
        },
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: SITE_URL,
            potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
            },
        },
    ];

    const gaId = process.env.NEXT_PUBLIC_GA_ID; // <-- ADD THIS TO ENV

    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any" />
            <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />

            {/* ------------------ GOOGLE ANALYTICS ------------------ */}
            {gaId && (
                <>
                    <Script
                        async
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga4-init" strategy="afterInteractive">
                        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
                    </Script>
                </>
            )}
            {/* -------------------------------------------------------- */}

        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} bg-black overflow-x-hidden antialiased min-h-screen`}
        >
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
