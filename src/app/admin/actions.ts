"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, adminRest, requireToken, signInWithPassword } from "@/lib/admin";

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

export async function saveProject(formData: FormData) {
  const token = await requireToken();
  const slug = String(formData.get("slug") ?? "");

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
    cover_url: String(formData.get("cover_url") ?? "").trim() || null,
    cover_alt: String(formData.get("cover_alt") ?? "").trim() || null,
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

  await adminRest(token, `projects?slug=eq.${encodeURIComponent(slug)}`, {
    method: "PATCH",
    body,
    prefer: "return=minimal",
  });
  revalidatePublic();
  redirect(`/admin/projects?saved=${encodeURIComponent(slug)}`);
}

export async function saveSettings(formData: FormData) {
  const token = await requireToken();
  const body = {
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
  await adminRest(token, "site_settings?id=eq.1", { method: "PATCH", body, prefer: "return=minimal" });
  revalidatePublic();
  redirect("/admin/settings?saved=1");
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
