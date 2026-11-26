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
