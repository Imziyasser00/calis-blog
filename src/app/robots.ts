// app/robots.ts
import { MetadataRoute } from "next";

const SITE_URL = ("https://www.calishub.com/").replace(/\/+$/, "");

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/studio"],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
