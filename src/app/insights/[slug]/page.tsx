import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getInsight, getRelatedInsights } from "@/lib/content";
import { categoryLabel } from "@/data/content-categories";
import { formatDate } from "@/lib/utils";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ReadingTime } from "@/components/ui/ReadingTime";
import { ShareButton } from "@/components/insights/ShareButton";
import { RelatedArticles } from "@/components/insights/RelatedArticles";
import { absoluteUrl, siteConfig } from "@/data/site-config";


// No generateStaticParams: with Cache Components it must return at least one entry, and there
// are no published articles yet. Articles render on demand, and drafts or unknown slugs return 404.

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) return { title: "Article not found" };
  return buildMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/insights/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt ?? article.publishedAt,
  });
}

export default async function InsightArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getInsight(slug);
  if (!article) notFound();

  const crumbs = [{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: article.title }];
  const related = getRelatedInsights(article, 3);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.seoTitle,
    description: article.seoDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.author },
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    publisher: { "@type": "Organization", name: siteConfig.brandName },
  };

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-5 pb-6 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={articleJsonLd} />

      <article aria-labelledby="article-title" className="mx-auto max-w-3xl px-5 pb-10 sm:px-8">
        <header className="flex flex-col gap-5">
          <p className="eyebrow">{categoryLabel(article.category)}</p>
          <h1 id="article-title">{article.title}</h1>
          {article.excerpt ? <p className="text-xl text-charcoal/85">{article.excerpt}</p> : null}
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            {article.updatedAt ? (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  Updated <time dateTime={article.updatedAt}>{formatDate(article.updatedAt)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <ReadingTime minutes={article.readingTime} />
          </p>
        </header>

        {article.featuredImage ? (
          <figure className="mt-10">
            <Image src={article.featuredImage} alt={article.title} width={1200} height={630} sizes="(min-width: 768px) 768px, 100vw" className="h-auto w-full rounded-lg" priority />
          </figure>
        ) : null}

        <div className="article-body mt-12 border-t border-gold/40 pt-12" dangerouslySetInnerHTML={{ __html: article.html }} />

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-gold/40 pt-8">
          <Link href="/insights" className="font-medium text-teal hover:underline">
            ← Back to Insights
          </Link>
          <ShareButton title={article.title} path={`/insights/${article.slug}`} />
        </div>
      </article>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <RelatedArticles articles={related} />
      </div>
    </main>
  );
}
