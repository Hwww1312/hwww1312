import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/data/siteContent";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_ORIGIN}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_ORIGIN}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_ORIGIN}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];
}
