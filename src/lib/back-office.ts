import { projects as localProjects, type Project } from "@/data/projects";
import { services as localServices, type Service } from "@/data/services";
import { siteConfig } from "@/data/site-config";

/**
 * Reads the back office (Supabase) through the public REST API.
 * Row Level Security limits anonymous reads to published rows, so the publishable key is safe here.
 * When no published rows exist, or Supabase cannot be reached, the local case studies are used.
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

type ProjectRow = {
  slug: string;
  name: string;
  tagline: string;
  category: string | null;
  platform: string | null;
  role: string | null;
  status_note: string | null;
  highlights: string[] | null;
  cover_url: string | null;
  seo_description: string | null;
  problem: string | null;
  users: { who?: string; objective?: string; measure?: string } | null;
  my_role: string | null;
  decisions: { title: string; why: string }[] | null;
  challenges: string | null;
  outcome: string | null;
  hero_url: string | null;
  hero_alt: string | null;
  screenshots: { url: string; alt?: string }[] | null;
};

export async function rest<T>(path: string): Promise<T | null> {
  if (!URL_BASE || !KEY) return null;
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
      headers: { apikey: KEY, Authorization: `Bearer ${KEY}` },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    name: row.name,
    tag: row.category ?? "",
    tagline: row.tagline,
    role: row.role ?? "",
    platform: row.platform,
    status: row.status_note ?? "",
    points: row.highlights ?? [],
    cover: row.cover_url ?? "",
    hero: row.hero_url ? { src: row.hero_url, alt: row.hero_alt ?? "" } : null,
    screenshots: (row.screenshots ?? [])
      .filter((shot) => shot.url)
      .map((shot) => ({ src: shot.url, alt: shot.alt ?? "" })),
    seoDescription: row.seo_description ?? row.tagline,
    problem: row.problem,
    users: row.users?.who || row.users?.objective || row.users?.measure
      ? { who: row.users?.who ?? "", objective: row.users?.objective ?? "", measure: row.users?.measure ?? "" }
      : null,
    myRole: row.my_role,
    decisions: row.decisions ?? [],
    challenges: row.challenges,
    outcome: row.outcome,
  };
}

const PROJECT_COLUMNS =
  "slug,name,tagline,category,platform,role,status_note,highlights,cover_url,seo_description,problem,users,my_role,decisions,challenges,outcome,hero_url,hero_alt,screenshots";

/** Published case studies in display order. Falls back to the local set when none are published. */
export async function getProjects(): Promise<Project[]> {
  const rows = await rest<ProjectRow[]>(
    `projects?select=${PROJECT_COLUMNS}&published=eq.true&order=sort_order.asc,name.asc`,
  );
  if (rows && rows.length > 0) return rows.map(toProject);
  return localProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

type ServiceRow = {
  slug: string; name: string; short_name: string; target_customer: string; problem: string;
  deliverables: string[] | null; price_ngn: string; price_usd: string; price_unit: string | null;
  duration: string | null; cta_label: string; enquiry_value: string; note: string | null;
};

function toService(row: ServiceRow): Service {
  // The services table has no summary column yet, so the summary comes from the local service data.
  const summary = localServices.find((s) => s.slug === row.slug)?.summary ?? row.problem;
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    summary,
    targetCustomer: row.target_customer,
    problem: row.problem,
    deliverables: row.deliverables ?? [],
    price: { ngn: row.price_ngn, usd: row.price_usd, ...(row.price_unit ? { unit: row.price_unit } : {}) },
    duration: row.duration,
    ctaLabel: row.cta_label,
    enquiryValue: row.enquiry_value,
    ...(row.note ? { note: row.note } : {}),
  };
}

const SERVICE_COLUMNS =
  "slug,name,short_name,target_customer,problem,deliverables,price_ngn,price_usd,price_unit,duration,cta_label,enquiry_value,note";

/** Visible services in display order. Falls back to the local list if the back office has none. */
export async function getServices(): Promise<Service[]> {
  const rows = await rest<ServiceRow[]>(`services?select=${SERVICE_COLUMNS}&visible=eq.true&order=sort_order.asc`);
  if (rows && rows.length > 0) return rows.map(toService);
  return localServices;
}

/** Whether public prices are shown. Falls back to the site config value. */
export async function getShowPrices(): Promise<boolean> {
  const rows = await rest<{ show_prices: boolean }[]>("site_settings?select=show_prices&id=eq.1");
  if (rows && rows.length > 0) return rows[0].show_prices;
  return siteConfig.pricing.showPrices;
}

/** The owner's portraits: one for the About page, one for the homepage. Null when not uploaded. */
export async function getPortraits(): Promise<{
  about: { src: string; alt: string } | null;
  aboutSecond: { src: string; alt: string } | null;
  home: { src: string; alt: string } | null;
}> {
  const rows = await rest<{
    portrait_url: string | null; portrait_alt: string | null;
    about_second_url: string | null; about_second_alt: string | null;
    home_portrait_url: string | null; home_portrait_alt: string | null;
  }[]>("site_settings?select=portrait_url,portrait_alt,about_second_url,about_second_alt,home_portrait_url,home_portrait_alt&id=eq.1");
  const row = rows?.[0];
  return {
    about: row?.portrait_url ? { src: row.portrait_url, alt: row.portrait_alt ?? "" } : null,
    aboutSecond: row?.about_second_url ? { src: row.about_second_url, alt: row.about_second_alt ?? "" } : null,
    home: row?.home_portrait_url ? { src: row.home_portrait_url, alt: row.home_portrait_alt ?? "" } : null,
  };
}
