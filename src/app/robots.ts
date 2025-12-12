import { MetadataRoute } from "next";

const SITE_URL = "https://www.calishub.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin",
                    "/studio",
                    "/api",
                    "/_next",
                    "/blog?q=", // search results
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
