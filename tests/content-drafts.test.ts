import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getPublishedInsights, getInsight } from "../src/lib/content.ts";

// The bundled template is published: false. It must never appear publicly.
test("draft articles are excluded from listings and detail lookups", () => {
  const draftFile = path.join(process.cwd(), "src", "content", "insights", "draft-template.md");
  assert.ok(fs.existsSync(draftFile), "draft template should exist");
  assert.ok(!getPublishedInsights().some((i) => i.slug === "draft-template"));
  assert.equal(getInsight("draft-template"), null);
});

test("unknown slugs return null", () => {
  assert.equal(getInsight("does-not-exist"), null);
});
