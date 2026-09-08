import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/data/siteContent";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/privacy" },
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  };
}
