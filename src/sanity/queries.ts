import { defineQuery } from "next-sanity";

// Every query excludes drafts explicitly as well as through the published perspective.
export const ARTICLES_QUERY = defineQuery(`
  *[_type == "article" && published == true && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    "slug": slug.current,
    title,
    category,
    publishedAt,
    summary,
    "coverUrl": cover.asset->url
  }
`);

export const ARTICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "article" && slug.current == $slug && published == true && !(_id in path("drafts.**"))][0] {
    "slug": slug.current,
    title,
    category,
    publishedAt,
    summary,
    "coverUrl": cover.asset->url,
    body,
    "related": related[]->{ "slug": slug.current, title, "coverUrl": cover.asset->url, summary }
  }
`);
