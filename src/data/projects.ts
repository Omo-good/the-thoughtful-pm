/**
 * Portfolio case studies (PRD §6.4). Copy is deliberately short.
 * Only verified facts from the approved PRD are used.
 * `cover` is brand artwork, not product evidence. Replace it with real screenshots
 * when they are supplied, and add them to `screenshots`.
 */

export interface ProjectScreenshot {
  src: string;
  alt: string;
  width?: number;
  height?: number;
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
  hero?: { src: string; alt: string } | null;
  roleImage?: { src: string; alt: string } | null;
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
    cover: "",
    screenshots: [],
    seoDescription: "Everwoven case study: product leadership for a courtship and marriage ecosystem.",
    problem: "Courtship and marriage support often means matchmaking, not a space for intentional relationships. Everwoven is built around the relationship itself.",
    users: {
      who: "Christian singles and couples in Nigeria, launching in English",
      objective: "Support intentional courtship and marriage on a Christian-first platform",
      measure: "A successful pilot with friends who are in relationships, before a wider launch",
    },
    myRole: "Product lead on the PRD (draft v0.2): platform choice, brand direction, the partner chat design and the pilot plan.",
    decisions: [
      {
        title: "Build a PWA first, not a native app",
        why: "It avoids app store spending for now, runs on a free managed backend, and launches in Nigeria first.",
      },
      {
        title: "Put calls and voice notes inside a private partner chat",
        why: "There is no separate Voice tab in Our Space; the call button and voice notes live in the chat.",
      },
      {
        title: "Give it a premium, sophisticated identity",
        why: "People will pay to use it, so the E-heart monogram, teal, terracotta, coral and ivory palette, and Fraunces with Inter were chosen to feel premium.",
      },
    ],
    challenges: "Building it without spending money while keeping it premium. Free tools were used, and the brand was settled early.",
    outcome: "Built and awaiting a pilot with friends. Not yet launched.",
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
    cover: "",
    screenshots: [],
    seoDescription: "PrayFirst case study: product ownership of an Android prayer and Bible reading app.",
    problem: "Opening distracting apps first pulls attention away from prayer and scripture. PrayFirst puts a prayer screen in front of them.",
    users: {
      who: "The owner, as the first user, and people who want a daily prayer habit",
      objective: "Finish all 66 books of the Bible in 365 days, with a prayer screen before chosen apps open",
      measure: "Days read against the plan, shown as a simple Day N of 365 counter",
    },
    myRole: "Product owner: drafted the PRD and set the MVP scope, including the decision to ship all modules together as version 1.",
    decisions: [
      {
        title: "Show the prayer screen once per app, per day",
        why: "It appears before chosen apps open without repeating on every open.",
      },
      {
        title: "Ship all MVP modules together as version 1",
        why: "The prayer journal, testimonies and journey timeline were decided as one release.",
      },
      {
        title: "Use a curated 20-book reading order, then the rest of the Bible",
        why: "The curated order guides the first stage, and two books are read at a time, about two chapters each day.",
      },
    ],
    challenges: "Fitting a curated reading journey into a 365-day plan that covers all 66 books, with long passages like Psalm 119 read alone.",
    outcome: "Built and installed on the owner's phone. No adoption figures claimed.",
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
    cover: "",
    screenshots: [],
    seoDescription: "Giftwyz case study: product management of a gifting platform and marketplace.",
    problem: "Gifting is hard to coordinate: events get missed, choosing a gift takes effort, and delivery is hard to arrange.",
    users: {
      who: "Giftwyzers, the people who give gifts to friends and family through wishlists and events",
      objective: "Make giving gifts simple, from event tracking through to delivery",
      measure: "Closed beta tester feedback, then an open beta planned for October to November 2026",
    },
    myRole: "Product manager: wrote the vendor portal, bill payments and gift card PRDs, and prepared the roadmap and revenue plan.",
    decisions: [
      {
        title: "Charge users a 1.5% service fee, with no vendor commission yet",
        why: "Revenue comes from the service fee, and commission stays off the website.",
      },
      {
        title: "Deliver through Shipbubble, with buyers choosing from the couriers",
        why: "Vendors must not deliver orders themselves, so delivery is handled through the platform.",
      },
      {
        title: "Launch delivery in Lagos first",
        why: "Delivery outside Lagos and abroad comes later, once the first market is working.",
      },
    ],
    challenges: "Delivering gifts of every size, from small items to large cakes, on a new platform with no set shipping volume.",
    outcome: "Preparing for beta launch. Not yet public.",
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
