import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

/**
 * File-based insights (PRD §6.5). Markdown files live in src/content/insights.
 * Only articles with `published: true` are ever returned, so drafts never reach
 * listings, sitemap, search, related articles or detail routes.
 */

export interface InsightMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string | null;
  readingTime: number;
  featuredImage: string | null;
  featured: boolean;
  published: boolean;
  seoTitle: string;
  seoDescription: string;
}

export interface Insight extends InsightMeta {
  html: string;
}

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "insights");
const WORDS_PER_MINUTE = 220;

export function estimateReadingTime(markdown: string): number {
  const words = markdown.replace(/```[\s\S]*?```/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function readRawFiles(): { slug: string; data: Record<string, unknown>; body: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const parsed = matter(raw);
      return { slug: file.replace(/\.mdx?$/, ""), data: parsed.data, body: parsed.content };
    });
}

function toMeta(slug: string, data: Record<string, unknown>, body: string): InsightMeta | null {
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  // YAML parses unquoted YYYY-MM-DD values into Date objects; normalise them to ISO dates.
  const dateStr = (v: unknown) => (v instanceof Date ? v.toISOString().slice(0, 10) : str(v));
  const title = str(data.title);
  const publishedAt = dateStr(data.publishedAt);
  if (!title || !publishedAt) {
    console.warn(`[insights] Skipping "${slug}": title and publishedAt are required.`);
    return null;
  }
  const excerpt = str(data.excerpt);
  return {
    slug: str(data.slug) || slug,
    title,
    excerpt,
    category: str(data.category),
    author: str(data.author) || "Arewa",
    publishedAt,
    updatedAt: dateStr(data.updatedAt) || null,
    readingTime: typeof data.readingTime === "number" ? data.readingTime : estimateReadingTime(body),
    featuredImage: str(data.featuredImage) || null,
    featured: data.featured === true,
    published: data.published === true,
    seoTitle: str(data.seoTitle) || title,
    seoDescription: str(data.seoDescription) || excerpt,
  };
}

function publishedRecords() {
  return readRawFiles()
    .map((f) => ({ ...f, meta: toMeta(f.slug, f.data, f.body) }))
    .filter((r): r is typeof r & { meta: InsightMeta } => r.meta !== null && r.meta.published === true);
}

/** All published insights, newest first. Drafts are excluded. */
export function getPublishedInsights(): InsightMeta[] {
  return publishedRecords()
    .map((r) => r.meta)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPublishedSlugs(): string[] {
  return getPublishedInsights().map((i) => i.slug);
}

/** A single published insight with rendered HTML, or null for drafts and unknown slugs. */
export function getInsight(slug: string): Insight | null {
  const record = publishedRecords().find((r) => r.meta.slug === slug);
  if (!record) return null;
  const html = marked.parse(record.body, { async: false }) as string;
  return { ...record.meta, html };
}

export function getFeaturedInsight(): InsightMeta | null {
  const all = getPublishedInsights();
  return all.find((i) => i.featured) ?? all[0] ?? null;
}

export function getRelatedInsights(current: InsightMeta, limit = 3): InsightMeta[] {
  return getPublishedInsights()
    .filter((i) => i.slug !== current.slug)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, limit);
}

export interface InsightQuery {
  q?: string;
  category?: string;
}

/** Case-insensitive search over title, excerpt, category and author, plus optional category filter. */
export function searchInsights(items: InsightMeta[], query: InsightQuery): InsightMeta[] {
  const q = (query.q ?? "").trim().toLowerCase();
  return items.filter((item) => {
    if (query.category && item.category !== query.category) return false;
    if (!q) return true;
    return [item.title, item.excerpt, item.category, item.author].some((field) => field.toLowerCase().includes(q));
  });
}
