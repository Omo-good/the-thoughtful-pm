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
    screenshots: [],
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
  "slug,name,tagline,category,platform,role,status_note,highlights,cover_url,seo_description,problem,users,my_role,decisions,challenges,outcome";

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
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
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
