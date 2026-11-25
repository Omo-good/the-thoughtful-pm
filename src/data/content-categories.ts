/** Initial insight categories (PRD §6.5). Slugs are used for filtering. */
export const insightCategories = [
  { slug: "product-thinking", label: "Product Thinking" },
  { slug: "building-products", label: "Building Products" },
  { slug: "startup-lessons", label: "Startup Lessons" },
  { slug: "human-side-of-product", label: "Human Side of Product" },
  { slug: "career-reflections", label: "Career Reflections" },
  { slug: "technology-and-society", label: "Technology and Society" },
] as const;

export type InsightCategorySlug = (typeof insightCategories)[number]["slug"];

export function categoryLabel(slug: string): string {
  return insightCategories.find((c) => c.slug === slug)?.label ?? slug;
}
