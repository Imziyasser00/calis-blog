import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@calis/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: { default: 'Calisthenics Hub — Blog', template: '%s · Calisthenics Hub' },
    description: 'Calisthenics tutorials, progressions, workouts, and coaching notes.',
    metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
    alternates: { types: { 'application/rss+xml': '/feed.xml' } },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-950`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
