import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getInsightDetail, getRelatedInsightList } from "@/lib/insights-source";
import { categoryLabel } from "@/data/content-categories";
import { formatDate } from "@/lib/utils";
import { breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
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
  const article = await getInsightDetail(slug);
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
  const article = await getInsightDetail(slug);
  if (!article) notFound();

  const crumbs = [{ label: "Home", href: "/" }, { label: "Insights", href: "/insights" }, { label: article.title }];
  const related = await getRelatedInsightList(article, 3);
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
    <main id="main" className="flex-1 bg-ivory text-charcoal">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={articleJsonLd} />

      <article aria-labelledby="article-title" className="px-6 pb-16 pt-12 md:px-[110px] md:pt-[80px]">
        <Link href="/insights" className="text-sm text-gold underline underline-offset-8">
          ← All insights
        </Link>
        <header className="mt-10 flex max-w-[860px] flex-col gap-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-gold">{categoryLabel(article.category)}</p>
          <h1 id="article-title" className="font-display text-[clamp(2.5rem,6vw,5rem)] font-normal leading-[1.05]">
            {article.title}
          </h1>
          {article.excerpt ? <p className="text-xl leading-[1.7] text-[#4A4034]">{article.excerpt}</p> : null}
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[#5C5244]">
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
          <figure className="relative mt-12 aspect-[16/9] w-full overflow-hidden bg-sand">
            <Image src={article.featuredImage} alt={article.title} fill sizes="100vw" className="object-cover" priority />
          </figure>
        ) : null}

        <div className="article-body mx-auto mt-14 max-w-[720px] text-[18px] leading-[1.8] text-charcoal/90" dangerouslySetInnerHTML={{ __html: article.html }} />

        <div className="mx-auto mt-14 flex max-w-[720px] flex-wrap items-center justify-between gap-4 border-t border-[rgba(28,24,19,0.18)] pt-8">
          <Link href="/insights" className="text-sm text-gold underline underline-offset-8">
            ← All insights
          </Link>
          <ShareButton title={article.title} path={`/insights/${article.slug}`} />
        </div>
      </article>

      <div className="px-6 pb-24 md:px-[110px]">
        <RelatedArticles articles={related} />
      </div>
    </main>
  );
}
