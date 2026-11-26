import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Product Management",
          "Product strategy",
          "Product discovery",
          "Working with developers",
          "Building digital products",
          "Product leadership",
          "Startup challenges",
        ],
      },
    }),
    defineField({ name: "publishedAt", title: "Publish date", type: "datetime", validation: (r) => r.required() }),
    defineField({ name: "summary", title: "Summary", type: "text", rows: 2, validation: (r) => r.required().max(160) }),
    defineField({ name: "cover", title: "Cover image", type: "image", options: { hotspot: true }, description: "Minimum 2400 × 1350 px" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }, { type: "image", options: { hotspot: true } }] }),
    defineField({
      name: "related",
      title: "Related articles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "article" }] }],
      validation: (r) => r.max(3),
    }),
    defineField({ name: "published", title: "Published", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "cover" } },
});
