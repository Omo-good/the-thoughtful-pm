# The Thoughtful PM

Personal brand, portfolio, insights and consulting website for Arewa, built from the approved PRD (v1.0).

- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Lucide React · Markdown insights (gray-matter + marked) · Formspree (server-side)
- **Status:** MVP implemented and tested locally. **Not deployed.** Commercial production hosting is on hold until a compliant Vercel plan is approved (see [Deployment](#deployment)).

## Quick start

Requirements: Node.js 20.9 or newer, npm.

```bash
npm install
cp .env.example .env.local     # then edit values as needed (all are optional locally)
npm run dev                    # http://localhost:3000
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (prerenders static pages) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js rules) |
| `npm run typecheck` | TypeScript check, no emit |
| `npm test` | Unit tests: enquiry validation, insight search, draft exclusion |
| `npm run check` | Lint + typecheck + tests + build, the full gate |

## Environment variables

Copy `.env.example` to `.env.local`. Never commit real values (`.env*` is git-ignored except `.env.example`).

| Variable | Scope | Purpose | If empty |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical URLs, Open Graph, sitemap | Defaults to `https://the-thoughtful-pm.vercel.app` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Professional email in footer, contact page, privacy policy, and form fallback | Hidden everywhere |
| `NEXT_PUBLIC_LINKEDIN_URL` | Public | LinkedIn link in footer and Person structured data | Hidden |
| `FORMSPREE_ENDPOINT` | **Server only** | Formspree form endpoint, e.g. `https://formspree.io/f/xxxxxxxx` | Form returns "not available" (HTTP 503) and shows the email fallback. It never pretends an enquiry was sent. |

`NEXT_PUBLIC_*` values are inlined at build time, so set them before `npm run build` on any host. `FORMSPREE_ENDPOINT` is read at request time on the server and is never sent to the browser.

## Activating the contact form (Formspree)

1. Create a form at formspree.io and copy its endpoint URL (`https://formspree.io/f/...`).
2. Set `FORMSPREE_ENDPOINT` in `.env.local` (locally) and in the host's environment settings (in production).
3. Set `NEXT_PUBLIC_CONTACT_EMAIL` so the email fallback appears.
4. Restart the server, submit a test enquiry, and confirm it arrives in the configured inbox. The PRD requires successful submissions to be actually delivered. That can only be confirmed with a real endpoint.

Submissions go to `POST /api/contact`, which validates again on the server, drops honeypot submissions silently, and returns 502 if the form service fails, so the UI never reports a false success.

## Editing content (no CMS)

| What | Where |
| --- | --- |
| Brand name, tagline, description, pricing display switch | `src/data/site-config.ts` |
| Services, prices, deliverables, enquiry labels | `src/data/services.ts` (set `pricing.showPrices` in `site-config.ts` to hide prices and show "Pricing on request") |
| Case studies | `src/data/projects.ts` |
| Expertise list | `src/data/expertise.ts` |
| Insight categories | `src/data/content-categories.ts` |
| Navigation | `src/data/navigation.ts` |
| Insights articles | `src/content/insights/<slug>.md` |

**Writing an article.** Create `src/content/insights/<slug>.md` with this front matter:

```yaml
---
slug: my-article              # optional, defaults to the file name
title: My article title       # required
excerpt: One-line summary.
category: product-thinking    # see content-categories.ts
author: Arewa
publishedAt: 2026-12-01       # required, YYYY-MM-DD
updatedAt:                    # optional
readingTime:                  # optional, estimated automatically
featuredImage:                # optional path, e.g. /images/insights/cover.png (1200×630 recommended)
featured: false               # true = shown as the featured article
published: true               # only published: true appears anywhere public
seoTitle:                     # optional
seoDescription:               # optional
---
```

Set `published: false` to keep a draft. Drafts are excluded from listings, search, related articles, the sitemap, and detail routes (they return 404). The bundled `draft-template.md` is a draft and stays private.

**Adding case-study screenshots.** Put images in `public/images/projects/<slug>/` and add an entry to the project's `screenshots` array in `src/data/projects.ts` with `src`, `alt`, `width` and `height`. The gallery renders only when screenshots exist, so no placeholder is shown publicly.

**Pricing.** Prices are stored as text exactly as approved. The site never converts currencies. Change `showPrices` in `site-config.ts` to hide them.

## Project structure

```
src/
  app/                    Routes: /, /about, /services, /work, /work/[slug], /insights,
                          /insights/[slug], /contact, /privacy, not-found, sitemap, robots,
                          icon, opengraph-image, api/contact
  components/             layout, navigation, ui, homepage, expertise, services,
                          portfolio, insights, contact
  data/                   Central configuration and structured content
  content/insights/       Markdown articles (published flag controls visibility)
  lib/                    validation (pure, tested), content loader, metadata, utils
  fonts/                  Self-hosted Cormorant Garamond and Inter (latin subset)
  app/globals.css         Brand tokens and typography
tests/                    Unit tests (run with npm test)
```

## Routes

| Route | Type | Notes |
| --- | --- | --- |
| `/` | Static | Hero, philosophy, expertise, selected work, services, recent insights (only when published), working principles, CTA |
| `/about` | Static | Verified background only |
| `/services` | Static | Four services, deliverables, pricing as configured |
| `/work`, `/work/everwoven`, `/work/prayfirst`, `/work/giftwize` | Static | Case studies with previous/next and related links |
| `/insights` | Dynamic | Search, category filter, pagination (9 per page), empty states |
| `/insights/[slug]` | Dynamic | Published articles only, share, related articles, Article structured data; unknown or draft slugs return 404 |
| `/contact` | Static | Reads `?service=` on the client so the page is static and does not shift |
| `/privacy` | Static | Draft policy text (see open items) |
| `/api/contact` | Dynamic | POST only; validates, forwards to Formspree |

## Testing performed

Local production build (`next build` + `next start`), tested with headless Google Chrome:

- **Build and static checks:** lint, TypeScript, 18 unit tests, production build: all pass.
- **Routes:** 200 for all public pages. Unknown case studies, unknown articles and draft articles return 404. The API returns 405 for GET.
- **Contact API:** unconfigured → 503 with email fallback message; invalid input → 422 with field errors; malformed JSON → 400; oversized body → 413; honeypot → silent 200, not forwarded; mock form service success → 200; mock form service failure → 502. Verified against a local mock form service, not a real Formspree account.
- **Forms:** service preselected from the CTA, required-field and email validation, focus moves to the first invalid field, entered values preserved when submission fails, double-submission guard.
- **Insights:** using a temporary published article (since removed), verified listing, featured item, search, category filter, detail page, related articles, Article structured data, and 404 for drafts.
- **Responsive:** no horizontal overflow at 360, 390, 768, 1024 and 1440 px on all public routes.
- **Navigation:** mobile drawer opens, navigates, and closes with Escape.
- **Accessibility:** axe-core, WCAG 2.0, 2.1 and 2.2 AA rules, zero violations on 10 scans (home, services, case study, insights, contact at 390 and 1440 px).
- **Performance (Lighthouse, production build):** performance 98–100, accessibility 100, best practices 100, SEO 100 on the 10 page/device combinations checked, with CLS 0.

**Not yet tested:** Firefox, Edge and Safari (only Chrome was available); real devices; a real Formspree endpoint; screen-reader testing beyond automated rules.

## Deployment

**Do not deploy commercially on Vercel Hobby.** Vercel's Hobby plan is for personal, non-commercial use, and this site promotes paid consulting.

Before going live:

1. Obtain Product Owner approval for a paid Vercel plan (Pro is the expected minimum). Document its cost.
2. Push the repository to GitHub, connect it to Vercel, and set the environment variables above for the Production environment.
3. Confirm the production build succeeds and run `npm run check` locally first.
4. **Rollback:** in the Vercel dashboard, open the project's Deployments list and use "Promote to Production" (or Instant Rollback) on the last known-good deployment.

Custom domains are deferred. Change `NEXT_PUBLIC_SITE_URL` when one is approved. Nothing else is hardcoded to the Vercel subdomain.

## Open items and assets needed from the Product Owner

These are intentionally not invented (PRD Rule 3):

1. **Professional email** and **LinkedIn URL**: not provided. Footer, contact page, privacy policy and form fallback stay hidden until set.
2. **Formspree endpoint**: needed to send enquiries. Without it, the form returns "not available".
3. **Portrait photo**: none supplied. The hero uses a typographic treatment.
4. **Product screenshots**: none supplied for Everwoven, PrayFirst or GiftWize. Add to `public/images/projects/` (see above).
5. **Case study content the PRD names but does not provide:** "Lessons learned" for all three projects, "Personal professional journey" on About, Everwoven's full narrative, and GiftWize's product-decision and outcome sections. Sections without verified content are omitted rather than invented.
6. **GiftWize platform:** not stated in the PRD, so the card and page omit it. Also, GiftWize is shown as product definition and planning work, not shipped software.
7. **Confirm the professional details:** the About page uses the background facts exactly as written in the PRD (Industrial Chemistry, AltSchool Africa, roles). Confirm these before publishing.
8. **Pricing decision:** prices are displayed by default (`showPrices: true`) because the PRD lists indicative prices. Confirm, or set to `false`.
9. **Privacy policy review:** the text is a plain-language draft. It has not been reviewed by a lawyer and makes no compliance claims (PRD §13).
10. **Insights content:** no articles were provided, so the site launches with no public articles. Home and Insights show appropriate empty states. The homepage preview appears automatically once articles are published.
11. **Response-time promise:** none is stated, as the PRD requires.
12. **Analytics:** none installed (PRD §13 requires approval first).
13. **Brand assets:** a simple SVG icon and a generated Open Graph image are included. Replace them with approved brand assets when available.

## Deviations from the PRD (please approve)

- **Text colours for accessibility.** The PRD grey `#77736E` measures 4.26:1 on the ivory background, below WCAG AA's 4.5:1 for body text. Muted text therefore uses `#6B6660` (5.14:1). The original grey remains available as `--color-muted-brand` for non-text uses. Gold and terracotta are used only for rules, borders and decoration, never for text. Error text uses clay `#9A4E36` (5.4:1) instead of terracotta (2.90:1). The PRD requires WCAG 2.2 AA (§11), so these changes support that requirement.
- **Project content location.** Case studies live in `src/data/projects.ts` rather than `src/content/projects/`. The structured data file is simpler for three projects. Move them if you prefer Markdown.
- **Rendering mode.** The scaffold's experimental Cache Components mode was disabled. Under it, dynamic routes could not return real 404 status codes for unknown articles. The site uses classic rendering: static pages are prerendered and dynamic routes are served on demand.
- **Fonts.** Cormorant Garamond and Inter are self-hosted (latin subset) instead of loaded from Google Fonts. This removes a third-party request (PRD §12, §13), and the sandbox could not reach Google Fonts during the build.
- **Insights pagination** is used instead of "Load More" (both allowed by the PRD). Pages are server-rendered, so search and filters work without JavaScript.
- **Testimonial component** is not built, because the PRD permits it only when real testimonials exist.

## Accessibility and performance notes

- Keyboard-accessible navigation with visible focus; skip link; one `h1` per page; heading order checked.
- Reduced-motion preference respected in CSS.
- Forms use real labels, `aria-describedby` for errors, and a live status region.
- Images use `next/image` with explicit dimensions to prevent layout shift.
- Structured data (Person, WebSite, ProfessionalService, Article, BreadcrumbList) includes only configured or verified information.
