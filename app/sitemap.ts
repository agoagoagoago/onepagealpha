import type { MetadataRoute } from "next";
import { getAllCompanies } from "@/lib/companies";

// Absolute base URL for the sitemap (env override, else production domain).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://onepagealpha.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/companies`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/request`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const companyRoutes: MetadataRoute.Sitemap = getAllCompanies().map((c) => ({
    url: `${SITE_URL}/companies/${c.slug}`,
    lastModified: new Date(c.reportDate),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...companyRoutes];
}
