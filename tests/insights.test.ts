import { test } from "node:test";
import assert from "node:assert/strict";
import { searchInsights, estimateReadingTime, type InsightMeta } from "../src/lib/content.ts";

const item = (overrides: Partial<InsightMeta>): InsightMeta => ({
  slug: "a",
  title: "Title",
  excerpt: "Excerpt",
  category: "product-thinking",
  author: "Arewa",
  publishedAt: "2026-01-01",
  updatedAt: null,
  readingTime: 3,
  featuredImage: null,
  featured: false,
  published: true,
  seoTitle: "Title",
  seoDescription: "Excerpt",
  ...overrides,
});

const items = [
  item({ slug: "one", title: "Discovery Matters", category: "product-thinking" }),
  item({ slug: "two", title: "Shipping MVPs", excerpt: "Scope is the hard part", category: "building-products" }),
  item({ slug: "three", title: "Hiring Engineers", category: "career-reflections", author: "Guest" }),
];

test("empty query returns everything", () => {
  assert.equal(searchInsights(items, {}).length, 3);
});

test("search is case-insensitive across title and excerpt", () => {
  assert.deepEqual(searchInsights(items, { q: "DISCOVERY" }).map((i) => i.slug), ["one"]);
  assert.deepEqual(searchInsights(items, { q: "scope is" }).map((i) => i.slug), ["two"]);
});

test("search matches author", () => {
  assert.deepEqual(searchInsights(items, { q: "guest" }).map((i) => i.slug), ["three"]);
});

test("category filter narrows results", () => {
  assert.deepEqual(searchInsights(items, { category: "building-products" }).map((i) => i.slug), ["two"]);
});

test("search and category combine, and no match returns empty", () => {
  assert.equal(searchInsights(items, { q: "discovery", category: "building-products" }).length, 0);
  assert.equal(searchInsights(items, { q: "zzz-no-match" }).length, 0);
});

test("reading time is at least one minute and scales with length", () => {
  assert.equal(estimateReadingTime("short"), 1);
  assert.ok(estimateReadingTime("word ".repeat(1100)) >= 4);
});
