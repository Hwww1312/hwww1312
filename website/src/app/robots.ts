import type { MetadataRoute } from "next";
import { BUSINESS } from "@/data/siteContent";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BUSINESS.origin}/sitemap.xml`,
  };
}
