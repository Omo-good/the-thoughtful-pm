import Link from "next/link";
import type { InsightMeta } from "@/lib/content";
import { categoryLabel } from "@/data/content-categories";
import { formatDate } from "@/lib/utils";
import { ReadingTime } from "@/components/ui/ReadingTime";

export function ArticleCard({ article, as: Heading = "h3" }: { article: InsightMeta; as?: "h2" | "h3" }) {
  return (
    <article className="card flex h-full flex-col gap-4 p-7">
      <p className="eyebrow">{categoryLabel(article.category)}</p>
      <Heading className="text-2xl">
        <Link href={`/insights/${article.slug}`} className="hover:text-teal">
          {article.title}
        </Link>
      </Heading>
      {article.excerpt ? <p className="text-charcoal/85">{article.excerpt}</p> : null}
      <p className="mt-auto text-sm text-muted">
        <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        <span aria-hidden="true"> · </span>
        <ReadingTime minutes={article.readingTime} />
      </p>
    </article>
  );
}
