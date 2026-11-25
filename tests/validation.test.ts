import { test } from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry, isSpamHoneypot, DESCRIPTION_MAX_LENGTH } from "../src/lib/validation.ts";

const valid = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
  company: "",
  website: "example.com",
  location: "Lagos",
  serviceRequired: "Product Audit",
  projectStage: "",
  budgetRange: "",
  projectDescription: "Our onboarding loses people on step two.",
  preferredCurrency: "",
  privacyConsent: true,
};

test("accepts a complete valid enquiry and normalises the website to https", () => {
  const result = validateEnquiry(valid);
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.data.website, "https://example.com/");
});

test("budget and company are optional", () => {
  const result = validateEnquiry({ ...valid, budgetRange: "", company: "", website: "" });
  assert.equal(result.ok, true);
});

test("required fields are reported individually", () => {
  const result = validateEnquiry({ privacyConsent: false });
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.ok(result.errors.fullName);
    assert.ok(result.errors.email);
    assert.ok(result.errors.serviceRequired);
    assert.ok(result.errors.projectDescription);
    assert.ok(result.errors.privacyConsent);
  }
});

test("rejects malformed email addresses", () => {
  for (const email of ["plainaddress", "a@b", "a b@c.com", "@example.com"]) {
    const result = validateEnquiry({ ...valid, email });
    assert.equal(result.ok, false, email);
  }
});

test("rejects unsafe website schemes", () => {
  const result = validateEnquiry({ ...valid, website: "javascript:alert(1)" });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.errors.website);
});

test("rejects a service that is not on the list", () => {
  const result = validateEnquiry({ ...valid, serviceRequired: "Something else" });
  assert.equal(result.ok, false);
});

test("rejects over-long descriptions", () => {
  const result = validateEnquiry({ ...valid, projectDescription: "x".repeat(DESCRIPTION_MAX_LENGTH + 1) });
  assert.equal(result.ok, false);
});

test("rejects a budget not in the configured lists", () => {
  const result = validateEnquiry({ ...valid, budgetRange: "$1 million" });
  assert.equal(result.ok, false);
});

test("strips control characters and non-string values", () => {
  const result = validateEnquiry({ ...valid, fullName: "Ada\u0000 Lovelace", company: 42 });
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.data.fullName, "Ada Lovelace");
    assert.equal(result.data.company, "");
  }
});

test("honeypot detects filled hidden field only", () => {
  assert.equal(isSpamHoneypot({ website_confirm: "http://spam" }), true);
  assert.equal(isSpamHoneypot({ website_confirm: "" }), false);
  assert.equal(isSpamHoneypot({}), false);
});
