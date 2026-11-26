import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/back-office";
import { getInsightList } from "@/lib/insights-source";
import { absoluteUrl } from "@/data/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/about", "/services", "/work", "/insights", "/contact", "/privacy"].map((path) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
  const projects = await getProjects();
  const projectRoutes = projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.6 }));
  // Published articles only. Drafts are never listed (PRD §6.5).
  const articleRoutes = (await getInsightList()).map((a) => ({
    url: absoluteUrl(`/insights/${a.slug}`),
    lastModified: new Date(a.updatedAt ?? a.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
