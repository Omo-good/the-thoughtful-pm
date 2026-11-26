import { sanityClient, sanityConfigured } from "@/sanity/client";
import { ARTICLES_QUERY, ARTICLE_BY_SLUG_QUERY } from "@/sanity/queries";
import { insightCategories } from "@/data/content-categories";
import {
  getInsight,
  getPublishedInsights,
  type Insight,
  type InsightMeta,
} from "@/lib/content";

/**
 * Insights come from Sanity when it has published articles. Until then, and if Sanity
 * is unreachable, the local Markdown in src/content/insights is used, so the site
 * never goes blank during the switch.
 */

const AUTHOR = "Goodness Omojengbesi";
const WORDS_PER_MINUTE = 220;

type SanityArticle = {
  slug: string;
  title: string;
  category: string | null;
  publishedAt: string;
  summary: string;
  coverUrl: string | null;
};

type PortableBlock = {
  _type: string;
  style?: string;
  listItem?: string;
  children?: { _type: string; text?: string; marks?: string[] }[];
};

function categorySlug(label: string | null): string {
  const match = insightCategories.find((c) => c.label === label);
  return match?.slug ?? insightCategories[0].slug;
}

function toMeta(a: SanityArticle): InsightMeta {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.summary,
    category: categorySlug(a.category),
    author: AUTHOR,
    publishedAt: a.publishedAt,
    updatedAt: null,
    readingTime: 1,
    featuredImage: a.coverUrl,
    featured: false,
    published: true,
    seoTitle: a.title,
    seoDescription: a.summary,
  };
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

/** Renders the Portable Text body as HTML. Text, headings, quotes and lists only; images are not rendered yet. */
function portableTextToHtml(blocks: PortableBlock[]): string {
  const out: string[] = [];
  let openList: "ul" | "ol" | null = null;
  const closeList = () => {
    if (openList) out.push(`</${openList}>`);
    openList = null;
  };

  for (const block of blocks) {
    if (block._type !== "block") continue;
    const inner = (block.children ?? [])
      .map((child) => {
        let text = escapeHtml(child.text ?? "");
        if (child.marks?.includes("strong")) text = `<strong>${text}</strong>`;
        if (child.marks?.includes("em")) text = `<em>${text}</em>`;
        return text;
      })
      .join("");
    if (!inner.trim()) continue;

    if (block.listItem) {
      const tag = block.listItem === "number" ? "ol" : "ul";
      if (openList !== tag) {
        closeList();
        out.push(`<${tag}>`);
        openList = tag;
      }
      out.push(`<li>${inner}</li>`);
      continue;
    }

    closeList();
    const style = block.style ?? "normal";
    if (style === "h2" || style === "h3" || style === "h4") out.push(`<${style}>${inner}</${style}>`);
    else if (style === "blockquote") out.push(`<blockquote>${inner}</blockquote>`);
    else out.push(`<p>${inner}</p>`);
  }
  closeList();
  return out.join("\n");
}

function readingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

async function sanityList(): Promise<InsightMeta[]> {
  if (!sanityConfigured) return [];
  try {
    const articles = await sanityClient.fetch<SanityArticle[]>(ARTICLES_QUERY);
    return articles.map(toMeta);
  } catch {
    return [];
  }
}

/** Published insights, newest first. */
export async function getInsightList(): Promise<InsightMeta[]> {
  const fromSanity = await sanityList();
  if (fromSanity.length > 0) return fromSanity;
  return getPublishedInsights();
}

export async function getInsightSlugs(): Promise<string[]> {
  return (await getInsightList()).map((i) => i.slug);
}

export async function getFeaturedInsightMeta(): Promise<InsightMeta | null> {
  const all = await getInsightList();
  const featured = all.find((i) => i.featured) ?? all[0] ?? null;
  return featured ? { ...featured, featured: true } : null;
}

export async function getRelatedInsightList(current: InsightMeta, limit = 3): Promise<InsightMeta[]> {
  return (await getInsightList())
    .filter((i) => i.slug !== current.slug)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, limit);
}

/** One published insight with rendered HTML, or null for drafts and unknown slugs. */
export async function getInsightDetail(slug: string): Promise<Insight | null> {
  if (sanityConfigured) {
    try {
      const a = await sanityClient.fetch<(SanityArticle & { body: PortableBlock[] | null; related: SanityArticle[] | null }) | null>(
        ARTICLE_BY_SLUG_QUERY,
        { slug },
      );
      if (a) {
        const html = portableTextToHtml(a.body ?? []);
        return { ...toMeta(a), readingTime: readingMinutes(html), html };
      }
    } catch {
      // Fall through to the local content.
    }
  }
  return getInsight(slug);
}
