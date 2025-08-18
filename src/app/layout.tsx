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
const DEFAULT_TITLE = `${SITE_NAME} — Blog`;
const DEFAULT_DESC =
    "Calisthenics tutorials, progressions, workouts, and coaching notes.";

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
    title: { default: DEFAULT_TITLE, template: `%s · ${SITE_NAME}` },
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
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: [
            {
                url: "/og.jpg", // <-- add a 1200x630 image at public/og.jpg
                width: 1200,
                height: 630,
                alt: SITE_NAME,
            },
        ],
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: DEFAULT_TITLE,
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
    themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#0b1220" }, { color: "#ffffff" }],
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{ children: React.ReactNode }>) {
    // JSON-LD (Organization + Website)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`, // optional: add public/logo.png
    };
    const websiteLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
    };

    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-950`}>
        {children}
        <Toaster />
        <Script id="ld-org" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify(jsonLd)}
        </Script>
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
            {JSON.stringify(websiteLd)}
        </Script>
        </body>
        </html>
    );
}
