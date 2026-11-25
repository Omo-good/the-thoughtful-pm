import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/metadata";
import { getFeaturedInsight, getPublishedInsights, searchInsights } from "@/lib/content";
import { insightCategories, categoryLabel } from "@/data/content-categories";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { EmptyState } from "@/components/ui/EmptyState";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Insights",
  description: "Product Management lessons, startup realities and reflections on building products, by Arewa.",
  path: "/insights",
});

function Loading({ label }: { label: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" aria-busy="true">
      <p className="text-muted">{label}</p>
    </section>
  );
}

const PAGE_SIZE = 9;
const crumbs = [{ label: "Home", href: "/" }, { label: "Insights" }];

type SearchParams = Promise<{ q?: string; category?: string; page?: string }>;

function buildHref(params: { q?: string; category?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `/insights?${query}` : "/insights";
}

async function InsightsResults({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().slice(0, 120);
  const requestedCategory = insightCategories.some((c) => c.slug === params.category) ? params.category : undefined;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const all = getPublishedInsights();
  const featured = getFeaturedInsight();
  const isFiltered = Boolean(q || requestedCategory);
  // The featured article is shown above the grid only when no search or filter is active.
  const pool = !isFiltered && featured ? all.filter((a) => a.slug !== featured.slug) : all;
  const results = searchInsights(pool, { q, category: requestedCategory });
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = results.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
      <section aria-labelledby="insights-title" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          as="h1"
          id="insights-title"
          eyebrow="Insights"
          title="Thinking about products, people and the work of building them."
          intro="Notes on Product Management, startups, teams and the African technology ecosystem."
        />

        {all.length === 0 ? (
          <div className="mt-14">
            <EmptyState title="No articles have been published yet.">
              <p>Check back soon, or start a conversation about your product in the meantime.</p>
              <Link href="/contact" className="mt-4 inline-block font-medium text-teal hover:underline">
                Start a Conversation →
              </Link>
            </EmptyState>
          </div>
        ) : (
          <>
            {!isFiltered && featured ? (
              <article aria-labelledby="featured-article" className="card mt-14 grid gap-6 p-8 md:grid-cols-5 md:p-10">
                <div className="flex flex-col gap-4 md:col-span-3">
                  <p className="eyebrow">Featured · {categoryLabel(featured.category)}</p>
                  <h2 id="featured-article" className="text-4xl">
                    <Link href={`/insights/${featured.slug}`} className="hover:text-teal">
                      {featured.title}
                    </Link>
                  </h2>
                  {featured.excerpt ? <p className="text-lg text-charcoal/90">{featured.excerpt}</p> : null}
                </div>
                <p className="text-sm text-muted md:col-span-2 md:self-end md:text-right">
                  <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time> · {featured.readingTime} min read
                </p>
              </article>
            ) : null}

            <form method="get" action="/insights" role="search" className="mt-12 grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
              <div>
                <label htmlFor="q" className="block font-medium">
                  Search articles
                </label>
                <input id="q" name="q" type="search" defaultValue={q} className="mt-2 w-full min-h-11 rounded-md border border-gold/70 bg-paper px-3.5 py-2.5" />
              </div>
              <div>
                <label htmlFor="category" className="block font-medium">
                  Category
                </label>
                <select id="category" name="category" defaultValue={requestedCategory ?? ""} className="mt-2 min-h-11 w-full rounded-md border border-gold/70 bg-paper px-3.5 py-2.5 md:w-auto">
                  <option value="">All categories</option>
                  {insightCategories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="min-h-11 rounded-md bg-teal px-6 py-2.5 font-medium text-paper hover:bg-charcoal">
                Apply
              </button>
            </form>

            <p className="mt-6 text-sm text-muted" aria-live="polite">
              {results.length} {results.length === 1 ? "article" : "articles"} found
              {requestedCategory ? ` in ${categoryLabel(requestedCategory)}` : ""}
              {q ? ` matching “${q}”` : ""}.
            </p>

            {visible.length === 0 ? (
              <div className="mt-8">
                <EmptyState title="No articles match your search.">
                  <p>
                    Try a different word or{" "}
                    <Link href="/insights" className="text-teal underline">
                      clear the filters
                    </Link>
                    .
                  </p>
                </EmptyState>
              </div>
            ) : (
              <ul className="mt-8 grid gap-6 md:grid-cols-3">
                {visible.map((article) => (
                  <li key={article.slug} className="flex">
                    <ArticleCard article={article} as="h2" />
                  </li>
                ))}
              </ul>
            )}

            {pageCount > 1 ? (
              <nav aria-label="Pagination" className="mt-12 flex items-center justify-between gap-4 text-sm">
                {currentPage > 1 ? (
                  <Link href={buildHref({ q, category: requestedCategory, page: currentPage - 1 })} className="min-h-11 inline-flex items-center text-teal hover:underline">
                    ← Previous
                  </Link>
                ) : (
                  <span />
                )}
                <span className="text-muted">
                  Page {currentPage} of {pageCount}
                </span>
                {currentPage < pageCount ? (
                  <Link href={buildHref({ q, category: requestedCategory, page: currentPage + 1 })} className="min-h-11 inline-flex items-center text-teal hover:underline">
                    Next →
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            ) : null}
          </>
        )}
      </section>
  );
}

export default function InsightsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      {/* Search and filter params are request-time data, so results stream behind this boundary. */}
      <Suspense fallback={<Loading label="Loading articles…" />}>
        <InsightsResults searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
