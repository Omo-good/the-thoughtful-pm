import { createClient } from "next-sanity";

// The dataset is public on the Sanity Free plan, so no read token is needed.
// Queries use the published perspective, which keeps drafts out of every page.
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  useCdn: true,
  perspective: "published",
});

export const sanityConfigured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
