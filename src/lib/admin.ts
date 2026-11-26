import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Admin session helpers. The owner signs in with Supabase Auth (password), and the access
 * token is kept in an HTTP-only cookie. Row Level Security allows only the owner's email to
 * read drafts and write content, so the token is the only thing that grants admin access.
 */

export const ADMIN_COOKIE = "tp_admin";
const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

export function supabaseConfigured(): boolean {
  return Boolean(URL_BASE && KEY);
}

export async function currentToken(): Promise<string | null> {
  return (await cookies()).get(ADMIN_COOKIE)?.value ?? null;
}

/** Use at the top of every admin page or action: sends signed-out visitors to the login. */
export async function requireToken(): Promise<string> {
  const token = await currentToken();
  if (!token) redirect("/admin/login");
  return token;
}

/** Calls the Supabase REST API as the signed-in owner. */
export async function adminRest<T>(
  token: string,
  path: string,
  init: { method?: string; body?: unknown; prefer?: string } = {},
): Promise<T | null> {
  const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
    method: init.method ?? "GET",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.prefer ? { Prefer: init.prefer } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T | null;
}

export async function signInWithPassword(email: string, password: string) {
  const res = await fetch(`${URL_BASE}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as { access_token: string; expires_in: number };
}

export const CASE_IMAGE_BUCKET = "case-images";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Uploads an image to the public case-images bucket as the signed-in owner. Returns its public URL, or null. */
export async function uploadCaseImage(token: string, slug: string, file: File): Promise<string | null> {
  if (!file.type.startsWith("image/") || file.size === 0 || file.size > MAX_IMAGE_BYTES) return null;
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-80) || "image";
  const path = `${encodeURIComponent(slug)}/${Date.now()}-${safeName}`;
  const res = await fetch(`${URL_BASE}/storage/v1/object/${CASE_IMAGE_BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
      "Cache-Control": "max-age=31536000",
      "x-upsert": "false",
    },
    body: await file.arrayBuffer(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  return `${URL_BASE}/storage/v1/object/public/${CASE_IMAGE_BUCKET}/${path}`;
}
