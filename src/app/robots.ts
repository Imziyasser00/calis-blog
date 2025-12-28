// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://www.calishub.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/dashboard/",
                    "/admin/",
                    "/api/private/",
                ],
            },
            {
                userAgent: [
                    "GPTBot",
                    "Google-Extended",
                    "Applebot-Extended",
                    "meta-externalagent",
                    "Amazonbot"
                ],
                disallow: "/",
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
