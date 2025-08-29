import { NextResponse, NextRequest } from "next/server";

const CANONICAL_HOST = "www.calishub.com";

const SKIP_PREFIXES = ["/_next", "/assets", "/images", "/fonts", "/favicon.ico", "/robots.txt", "/sitemap.xml"];

export function middleware(req: NextRequest) {
    if (process.env.NODE_ENV !== "production") return NextResponse.next();

    const url = req.nextUrl;
    const host = req.headers.get("host") || "";

    const isPreview = host.endsWith(".vercel.app");

    if (isPreview || SKIP_PREFIXES.some((p) => url.pathname.startsWith(p))) {
        return NextResponse.next();
    }

    if (host !== CANONICAL_HOST) {
        url.host = CANONICAL_HOST;
        return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
