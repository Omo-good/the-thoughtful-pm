/**
 * Portfolio case studies (PRD §6.4). Copy is deliberately short.
 * Only verified facts from the approved PRD are used.
 * `cover` is brand artwork, not product evidence. Replace it with real screenshots
 * when they are supplied, and add them to `screenshots`.
 */

export interface ProjectScreenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  name: string;
  tag: string;
  tagline: string;
  role: string;
  platform: string | null;
  status: string;
  points: string[];
  cover: string;
  screenshots: ProjectScreenshot[];
  seoDescription: string;
  problem?: string | null;
  users?: { who: string; objective: string; measure: string } | null;
  myRole?: string | null;
  decisions?: { title: string; why: string }[];
  challenges?: string | null;
  outcome?: string | null;
}

export const projects: Project[] = [
  {
    slug: "everwoven",
    name: "Everwoven",
    tag: "Relationships",
    tagline: "A courtship and marriage ecosystem for intentional relationships. Not a matchmaking platform.",
    role: "Product Lead",
    platform: "Landing page, app, admin",
    status: "Functional product. Core features in active use.",
    points: ["Three connected product surfaces", "Product direction and requirements", "Prioritised workflows and features"],
    cover: "/images/projects/everwoven/cover.svg",
    screenshots: [],
    seoDescription: "Everwoven case study: product leadership for a courtship and marriage ecosystem.",
  },
  {
    slug: "prayfirst",
    name: "PrayFirst",
    tag: "Faith",
    tagline: "A personal prayer and Bible reading app for daily scripture, prayer and testimony.",
    role: "Product Owner",
    platform: "Android",
    status: "Built and installed on a device. No adoption figures claimed.",
    points: ["One-year reading plan", "Prayer, reflection and testimony tracking", "Offline Bible content"],
    cover: "/images/projects/prayfirst/cover.svg",
    screenshots: [],
    seoDescription: "PrayFirst case study: product ownership of an Android prayer and Bible reading app.",
  },
  {
    slug: "giftwyz",
    name: "Giftwyz",
    tag: "Gifting",
    tagline: "A platform to discover, select and send gifts, with a marketplace and AI gift assistant.",
    role: "Product Manager",
    platform: null,
    status: "Product definition and planning. Planned features are not shipped.",
    points: ["Wishlists and events", "Vendor marketplace and dashboards", "AI gift assistant and chat translation"],
    cover: "/images/projects/giftwize/cover.svg",
    screenshots: [],
    seoDescription: "Giftwyz case study: product management of a gifting platform and marketplace.",
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
