import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site-pages";

// Static export: generated once at build time as /robots.txt. The demo stays out of search.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/p/", "/u/", "/primitives/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
