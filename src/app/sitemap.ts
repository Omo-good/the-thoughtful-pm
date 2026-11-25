import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getPublishedInsights } from "@/lib/content";
import { absoluteUrl } from "@/data/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/services", "/work", "/insights", "/contact", "/privacy"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const projectRoutes = projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.6 }));
  // Published articles only. Drafts are never listed (PRD §6.5).
  const articleRoutes = getPublishedInsights().map((a) => ({
    url: absoluteUrl(`/insights/${a.slug}`),
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
