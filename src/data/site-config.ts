/**
 * Central site configuration (PRD §8.4, §6.7, §8.5).
 * Every global value lives here. Contact details and social URLs are read from
 * environment variables and are `null` when unconfigured, so the UI hides them.
 */

function envValue(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const siteConfig = {
  brandName: "The Thoughtful PM",
  tagline: "Building products with curiosity, clarity & care.",
  professionalName: "Arewa",
  professionalTitle: "Product Manager & Consultant",
  description:
    "Meet Arewa, The Thoughtful PM. Explore Product Management insights, product case studies and consulting services for founders, startups and growing businesses.",
  siteUrl: (envValue(process.env.NEXT_PUBLIC_SITE_URL) ?? "https://the-thoughtful-pm.vercel.app").replace(/\/$/, ""),
  email: envValue(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  linkedinUrl: envValue(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  locale: "en",
  /** Server-only. Never imported by client components. */
  formspreeEndpoint: envValue(process.env.FORMSPREE_ENDPOINT),
  pricing: {
    /** Product Owner switch: set to false to hide public prices and show "Request a Quote". */
    showPrices: true,
    currencies: ["NGN", "USD"] as const,
    /** Prices are shown exactly as configured. No currency conversion (PRD §6.3). */
  },
  /** Deliberately not set: no analytics until the Product Owner approves a provider (PRD §13). */
  analytics: null,
} as const;

export type SiteConfig = typeof siteConfig;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
