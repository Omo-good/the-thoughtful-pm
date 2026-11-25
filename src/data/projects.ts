/**
 * Portfolio case studies (PRD §6.4).
 * Only verified facts from the approved PRD are used. Sections the PRD names but
 * has no verified content for (e.g. "Lessons learned") are omitted, not invented.
 * `screenshots` is empty until real product screenshots are supplied (PRD §8.6).
 */

export interface CaseStudySection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: "everwoven" | "prayfirst" | "giftwize";
  name: string;
  category: string;
  summary: string;
  platform: string | null;
  role: string;
  /** Plain-language status. Keeps shipped work separate from planned work (PRD §6.4). */
  status: string;
  /** Short line shown on the card, derived from the PRD description. */
  cardDescription: string;
  sections: CaseStudySection[];
  screenshots: ProjectScreenshot[];
  seoDescription: string;
}

export const projects: Project[] = [
  {
    slug: "everwoven",
    name: "Everwoven",
    category: "Relationship Technology / Consumer Application",
    summary:
      "A digital courtship and marriage ecosystem designed to support intentional relationships and the journey towards marriage. It is not a matchmaking platform.",
    cardDescription:
      "A digital courtship and marriage ecosystem for intentional relationships. Not a matchmaking platform.",
    platform: "Landing page, user application and admin back office",
    role: "Product Manager / Product Lead",
    status: "Built into a functional product. Core features are actively used.",
    seoDescription:
      "Everwoven case study: product leadership for a courtship and marriage ecosystem with a landing page, user application and admin back office.",
    sections: [
      {
        heading: "Overview",
        paragraphs: [
          "Everwoven progressed from concept into a functional product with a public landing page, a user application and an admin back office.",
        ],
      },
      {
        heading: "Product surfaces",
        bullets: ["Public landing page", "User application", "Admin back office"],
      },
      {
        heading: "My role",
        paragraphs: [
          "I acted as Product Manager and Product Lead across the three product surfaces.",
        ],
        bullets: [
          "Led product decisions across the three product surfaces.",
          "Defined product direction.",
          "Defined product requirements.",
          "Structured product functionality and workflows.",
          "Made product prioritisation decisions.",
          "Directed user experience decisions.",
          "Worked with AI-assisted development tools.",
          "Reviewed implementation and functional outcomes.",
        ],
      },
      {
        heading: "Ownership and execution",
        paragraphs: [
          "Product ownership is distinct from implementation. Code was produced with AI-assisted development tools and other contributors; my responsibility was the product direction, requirements, prioritisation and review of outcomes.",
        ],
      },
    ],
    screenshots: [],
  },
  {
    slug: "prayfirst",
    name: "PrayFirst",
    category: "Faith Technology / Android Application",
    summary:
      "A personal prayer and Bible reading application designed to encourage consistent scripture reading, prayer, reflection and testimony tracking.",
    cardDescription:
      "A personal prayer and Bible reading app for consistent scripture reading, prayer, reflection and testimony tracking.",
    platform: "Android",
    role: "Product Owner / Product Manager",
    status:
      "Android project successfully built and installed on a device. No user adoption figures are claimed.",
    seoDescription:
      "PrayFirst case study: product ownership of an Android prayer and Bible reading app with a one-year reading plan.",
    sections: [
      {
        heading: "Product vision and scope",
        paragraphs: [
          "I defined the product vision and scope, and the prayer experience that sits at its centre.",
        ],
      },
      {
        heading: "Product requirements",
        bullets: [
          "Established scripture reading requirements.",
          "Specified a thematic book-pairing reading plan.",
          "Defined daily chapter allocation for a one-year reading journey.",
          "Defined reflection and prayer-point recording.",
          "Defined testimony tracking.",
          "Specified offline Bible content.",
          "Defined prayer screen scripture behaviour.",
          "Worked through text-to-speech considerations.",
        ],
      },
      {
        heading: "Execution",
        paragraphs: [
          "I coordinated AI-assisted development. The Android project was successfully built and installed on a device.",
        ],
      },
    ],
    screenshots: [],
  },
  {
    slug: "giftwize",
    name: "GiftWize",
    category: "Gifting Technology / Marketplace",
    summary:
      "A gifting platform designed to simplify the process of discovering, selecting and sending gifts.",
    cardDescription:
      "A gifting platform to simplify discovering, selecting and sending gifts, including a marketplace and AI gift assistant.",
    platform: null,
    role: "Product Manager",
    status:
      "Product definition and planning work. Planned features and proposed monetisation are not described as shipped.",
    seoDescription:
      "GiftWize case study: product management of a gifting platform, covering roadmap, marketplace planning and AI gift assistant requirements.",
    sections: [
      {
        heading: "Product work",
        bullets: [
          "Product roadmap planning.",
          "Feature definition.",
          "Authentication and onboarding.",
          "Dashboard requirements.",
          "Wishlist functionality.",
          "Events functionality.",
          "AI Gift Assistant requirements.",
          "Marketplace planning.",
          "Vendor registration and vendor dashboard requirements.",
          "Admin functionality.",
          "Marketplace language-barrier solution using AI-assisted chat translation.",
          "Monetisation exploration.",
          "Payment and service-charge considerations.",
          "Product analytics planning.",
        ],
      },
    ],
    screenshots: [],
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
