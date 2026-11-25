import type { InsightMeta } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";

export function RelatedArticles({ articles }: { articles: InsightMeta[] }) {
  if (articles.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="mt-20 border-t border-gold/40 pt-16">
      <h2 id="related-heading" className="text-3xl">
        Related articles
      </h2>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  );
}
