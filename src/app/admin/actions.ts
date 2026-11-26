"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminRest, adminWrite, requireToken, signInWithPassword, uploadCaseImage } from "@/lib/admin";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const session = await signInWithPassword(email, password);
  if (!session) redirect("/admin/login?error=1");
  (await cookies()).set(ADMIN_COOKIE, session.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/admin",
    maxAge: session.expires_in,
  });
  redirect("/admin/projects");
}

export async function signOut() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/admin" });
  redirect("/admin/login");
}

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/work", "layout");
  revalidatePath("/about");
  revalidatePath("/sitemap.xml");
}

export async function setPublished(formData: FormData) {
  const token = await requireToken();
  const slug = String(formData.get("slug") ?? "");
  const published = formData.get("published") === "true";
  await adminRest(token, `projects?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    body: { published, updated_at: new Date().toISOString() },
    prefer: "return=minimal",
  });
  revalidatePublic();
  revalidatePath("/admin/projects");
}

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function fileOf(value: FormDataEntryValue | null): File | null {
  return value && typeof value !== "string" && value.size > 0 ? value : null;
}

type Shot = { url: string; alt: string };

function parseShots(value: FormDataEntryValue | null): Shot[] {
  try {
    const parsed = JSON.parse(String(value ?? "[]")) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((s): s is Shot => typeof s?.url === "string" && s.url.length > 0)
      .map((s) => ({ url: s.url, alt: typeof s.alt === "string" ? s.alt : "" }));
  } catch {
    return [];
  }
}

export async function saveProject(formData: FormData) {
  const token = await requireToken();
  const slug = String(formData.get("slug") ?? "");

  // Images: a new upload replaces the URL; otherwise the typed or current URL is kept.
  let uploadFailed = false;
  let coverUrl = String(formData.get("cover_url") ?? "").trim() || null;
  const coverFile = fileOf(formData.get("cover_file"));
  if (coverFile) {
    const url = await uploadCaseImage(token, slug, coverFile);
    if (url) coverUrl = url;
    else uploadFailed = true;
  }

  let heroUrl = String(formData.get("hero_url_current") ?? "").trim() || null;
  if (formData.get("clear_hero") === "on") heroUrl = null;
  const heroFile = fileOf(formData.get("hero_file"));
  if (heroFile) {
    const url = await uploadCaseImage(token, slug, heroFile);
    if (url) heroUrl = url;
    else uploadFailed = true;
  }

  const shots: Shot[] = parseShots(formData.get("screenshots_json"))
    .flatMap((shot, i) =>
      formData.get(`shot_remove_${i}`) === "on"
        ? []
        : [{ url: shot.url, alt: String(formData.get(`shot_alt_${i}`) ?? shot.alt).trim() }],
    );
  for (const value of formData.getAll("screenshot_files")) {
    if (shots.length >= 8) break;
    const file = fileOf(value);
    if (!file) continue;
    const url = await uploadCaseImage(token, slug, file);
    if (url) shots.push({ url, alt: "" });
    else uploadFailed = true;
  }

  // One decision per line, written as "Title | Why it mattered".
  const decisions = lines(formData.get("decisions"))
    .slice(0, 3)
    .map((line) => {
      const [title, ...why] = line.split("|");
      return { title: title.trim(), why: why.join("|").trim() };
    });

  const body = {
    name: String(formData.get("name") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim() || null,
    platform: String(formData.get("platform") ?? "").trim() || null,
    role: String(formData.get("role") ?? "").trim() || null,
    status: String(formData.get("status") ?? "Concept"),
    status_note: String(formData.get("status_note") ?? "").trim() || null,
    featured: formData.get("featured") === "on",
    sort_order: Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    cover_url: coverUrl,
    cover_alt: String(formData.get("cover_alt") ?? "").trim() || null,
    hero_url: heroUrl,
    hero_alt: String(formData.get("hero_alt") ?? "").trim() || null,
    screenshots: shots,
    seo_description: String(formData.get("seo_description") ?? "").trim() || null,
    problem: String(formData.get("problem") ?? "").trim() || null,
    users: {
      who: String(formData.get("users_who") ?? "").trim(),
      objective: String(formData.get("users_objective") ?? "").trim(),
      measure: String(formData.get("users_measure") ?? "").trim(),
    },
    my_role: String(formData.get("my_role") ?? "").trim() || null,
    decisions,
    challenges: String(formData.get("challenges") ?? "").trim() || null,
    outcome: String(formData.get("outcome") ?? "").trim() || null,
    highlights: lines(formData.get("highlights")),
    updated_at: new Date().toISOString(),
  };

  const saved = await adminWrite(token, `projects?slug=eq.${encodeURIComponent(slug)}`, body);
  revalidatePublic();
  const problem = !saved ? "&error=save" : uploadFailed ? "&error=upload" : "";
  redirect(`/admin/projects/${encodeURIComponent(slug)}?saved=1${problem}`);
}

export async function saveSettings(formData: FormData) {
  const token = await requireToken();

  let uploadFailed = false;
  let portraitUrl = String(formData.get("portrait_url_current") ?? "").trim() || null;
  if (formData.get("clear_portrait") === "on") portraitUrl = null;
  const portraitFile = fileOf(formData.get("portrait_file"));
  if (portraitFile) {
    const url = await uploadCaseImage(token, "site", portraitFile);
    if (url) portraitUrl = url;
    else uploadFailed = true;
  }

  let homePortraitUrl = String(formData.get("home_portrait_url_current") ?? "").trim() || null;
  if (formData.get("clear_home_portrait") === "on") homePortraitUrl = null;
  const homePortraitFile = fileOf(formData.get("home_portrait_file"));
  if (homePortraitFile) {
    const url = await uploadCaseImage(token, "site", homePortraitFile);
    if (url) homePortraitUrl = url;
    else uploadFailed = true;
  }

  const body = {
    portrait_url: portraitUrl,
    portrait_alt: String(formData.get("portrait_alt") ?? "").trim() || null,
    home_portrait_url: homePortraitUrl,
    home_portrait_alt: String(formData.get("home_portrait_alt") ?? "").trim() || null,
    display_name: String(formData.get("display_name") ?? "").trim(),
    brand_name: String(formData.get("brand_name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || null,
    linkedin: String(formData.get("linkedin") ?? "").trim() || null,
    notification_email: String(formData.get("notification_email") ?? "").trim() || null,
    open_to_projects: formData.get("open_to_projects") === "on",
    show_prices: formData.get("show_prices") === "on",
    show_insights: formData.get("show_insights") === "on",
    default_description: String(formData.get("default_description") ?? "").trim() || null,
    updated_at: new Date().toISOString(),
  };
  const saved = await adminWrite(token, "site_settings?id=eq.1", body);
  revalidatePublic();
  const problem = !saved ? "&error=save" : uploadFailed ? "&error=upload" : "";
  redirect(`/admin/settings?saved=1${problem}`);
}

export async function saveService(formData: FormData) {
  const token = await requireToken();
  const slug = String(formData.get("slug") ?? "");
  const deliverables = lines(formData.get("deliverables"));
  const body = {
    name: String(formData.get("name") ?? "").trim(),
    short_name: String(formData.get("short_name") ?? "").trim(),
    target_customer: String(formData.get("target_customer") ?? "").trim(),
    problem: String(formData.get("problem") ?? "").trim(),
    deliverables,
    price_ngn: String(formData.get("price_ngn") ?? "").trim(),
    price_usd: String(formData.get("price_usd") ?? "").trim(),
    price_unit: String(formData.get("price_unit") ?? "").trim() || null,
    duration: String(formData.get("duration") ?? "").trim() || null,
    cta_label: String(formData.get("cta_label") ?? "").trim(),
    enquiry_value: String(formData.get("enquiry_value") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim() || null,
    sort_order: Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
    visible: formData.get("visible") === "on",
    updated_at: new Date().toISOString(),
  };
  await adminRest(token, `services?slug=eq.${encodeURIComponent(slug)}`, { method: "PATCH", body, prefer: "return=minimal" });
  revalidatePublic();
  redirect(`/admin/services?saved=${encodeURIComponent(slug)}`);
}
