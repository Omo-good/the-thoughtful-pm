import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/data/site-config";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  noIndex?: boolean;
}

/** Builds per-page metadata with canonical URL and Open Graph/Twitter tags (PRD §10). */
export function buildMetadata({ title, description, path, type = "website", publishedTime, modifiedTime, noIndex }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.brandName,
      locale: "en_US",
      type,
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
