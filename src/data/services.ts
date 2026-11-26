/**
 * Consulting services (PRD §6.3). Prices are indicative and are only displayed
 * when `siteConfig.pricing.showPrices` is true. Ask the Product Owner before changing amounts.
 */
export interface ServicePrice {
  ngn: string;
  usd: string;
  unit?: string;
}

export interface Service {
  slug: string;
  name: string;
  shortName: string;
  /** One-line summary shown on the Services page. */
  summary: string;
  targetCustomer: string;
  problem: string;
  deliverables: string[];
  price: ServicePrice;
  duration: string | null;
  ctaLabel: string;
  /** Option value used on the contact form's "Service required" select. */
  enquiryValue: string;
  note?: string;
}

export const services: Service[] = [
  {
    slug: "prd-requirements-sprint",
    name: "PRD & Requirements Sprint",
    shortName: "PRD Sprint",
    summary: "Turn a product idea into clear requirements that developers and designers can build from.",
    targetCustomer: "Founders and development teams with product ideas or poorly documented requirements.",
    problem: "Unclear requirements lead to confusion, misalignment and inefficient development.",
    deliverables: [
      "Product overview",
      "Product objectives",
      "Problem statement",
      "Target users",
      "Functional requirements",
      "Non-functional requirements where applicable",
      "User stories",
      "Acceptance criteria",
      "Feature prioritisation",
      "Scope definition",
      "Development-ready documentation",
    ],
    price: { ngn: "₦75,000", usd: "$150" },
    duration: "5–7 working days",
    ctaLabel: "Request This Service",
    enquiryValue: "PRD & Requirements Sprint",
  },
  {
    slug: "product-discovery-mvp",
    name: "Product Discovery & MVP Planning",
    shortName: "Discovery & MVP",
    summary: "Understand the problem you're solving, find the opportunities worth pursuing, and decide what the first release should contain.",
    targetCustomer: "Founders preparing to build a digital product.",
    problem: "Unclear product requirements and difficulty defining MVP scope.",
    deliverables: [
      "Discovery session",
      "Problem definition",
      "Target user definition",
      "Assumptions and risks",
      "User journey mapping",
      "Feature identification",
      "Feature prioritisation",
      "MVP scope",
      "Initial product roadmap",
      "Product recommendations",
    ],
    price: { ngn: "₦100,000", usd: "$250" },
    duration: "7–10 working days",
    ctaLabel: "Plan My MVP",
    enquiryValue: "Product Discovery & MVP Planning",
  },
  {
    slug: "product-audit",
    name: "Product Audit",
    shortName: "Product Audit",
    summary: "Review an existing digital product and identify what to improve first.",
    targetCustomer: "Businesses with existing digital products.",
    problem: "Poor product experience and unclear product direction.",
    deliverables: [
      "Product review",
      "Onboarding assessment",
      "User experience observations",
      "Navigation assessment",
      "Feature gap analysis",
      "Product friction identification",
      "Prioritised recommendations",
      "Improvement roadmap",
    ],
    price: { ngn: "₦50,000", usd: "$100" },
    duration: "3–5 working days",
    ctaLabel: "Request an Audit",
    enquiryValue: "Product Audit",
  },
  {
    slug: "fractional-product-management",
    name: "Fractional Product Management",
    shortName: "Fractional PM",
    summary: "Ongoing product direction and execution support, without hiring a full-time Product Manager.",
    targetCustomer: "Startups and growing businesses that need ongoing Product Management support.",
    problem: "Limited Product Management resources and uncertainty about prioritisation.",
    deliverables: [
      "Backlog management",
      "Product prioritisation",
      "Sprint planning support",
      "Requirements management",
      "Developer coordination",
      "Stakeholder communication",
      "Product documentation",
      "Progress reporting",
    ],
    price: { ngn: "₦200,000", usd: "$500", unit: "per month" },
    duration: null,
    ctaLabel: "Discuss an Engagement",
    enquiryValue: "Fractional Product Management",
    note: "Engagement hours, availability, scope and responsibilities are agreed before commencement.",
  },
];

export function findService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function findServiceByEnquiryValue(value: string | null | undefined): Service | undefined {
  if (!value) return undefined;
  return services.find((s) => s.enquiryValue === value || s.slug === value);
}
