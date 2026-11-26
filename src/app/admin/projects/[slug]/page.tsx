import { notFound } from "next/navigation";
import { adminRest, requireToken } from "@/lib/admin";
import { saveProject } from "../../actions";

type Decision = { title: string; why: string };
type Users = { who?: string; objective?: string; measure?: string };
type Project = {
  slug: string; name: string; tagline: string; category: string | null; platform: string | null;
  role: string | null; status: string; status_note: string | null; featured: boolean; sort_order: number;
  cover_url: string | null; cover_alt: string | null; seo_description: string | null; problem: string | null;
  users: Users | null; my_role: string | null; decisions: Decision[] | null; challenges: string | null;
  outcome: string | null; highlights: string[] | null; published: boolean;
};

const field = "flex flex-col gap-1 text-sm";
const input = "border border-gold/50 bg-paper px-3 py-2";

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const token = await requireToken();
  const { slug } = await params;
  const rows = await adminRest<Project[]>(token, `projects?slug=eq.${encodeURIComponent(slug)}&select=*`);
  const p = rows?.[0];
  if (!p) notFound();

  const decisionText = (p.decisions ?? []).map((d) => `${d.title} | ${d.why}`).join("\n");
  const highlightText = (p.highlights ?? []).join("\n");

  return (
    <section>
      <h1 className="font-display text-3xl">{p.name}</h1>
      <p className="mt-1 text-sm text-muted">{p.published ? "Published" : "Draft"}. Save, then publish from the list.</p>
      <form action={saveProject} className="mt-8 grid gap-5">
        <input type="hidden" name="slug" value={p.slug} />

        <label className={field}>Name<input name="name" defaultValue={p.name} required className={input} /></label>
        <label className={field}>Tagline (max 160)<textarea name="tagline" defaultValue={p.tagline} maxLength={160} rows={2} className={input} /></label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={field}>Category<input name="category" defaultValue={p.category ?? ""} className={input} /></label>
          <label className={field}>Platform<input name="platform" defaultValue={p.platform ?? ""} className={input} /></label>
          <label className={field}>My role<input name="role" defaultValue={p.role ?? ""} className={input} /></label>
          <label className={field}>Status
            <select name="status" defaultValue={p.status} className={input}>
              <option>Live</option><option>In progress</option><option>Concept</option>
            </select>
          </label>
          <label className={field}>Status note<input name="status_note" defaultValue={p.status_note ?? ""} className={input} /></label>
          <label className={field}>Sort order<input name="sort_order" type="number" defaultValue={p.sort_order} className={input} /></label>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={p.featured} /> Featured</label>

        <label className={field}>Problem<textarea name="problem" defaultValue={p.problem ?? ""} rows={3} className={input} /></label>
        <fieldset className="grid gap-4 border border-gold/40 p-4">
          <legend className="px-1 text-sm">Users</legend>
          <label className={field}>Who<input name="users_who" defaultValue={p.users?.who ?? ""} className={input} /></label>
          <label className={field}>Objective<input name="users_objective" defaultValue={p.users?.objective ?? ""} className={input} /></label>
          <label className={field}>Measure<input name="users_measure" defaultValue={p.users?.measure ?? ""} className={input} /></label>
        </fieldset>
        <label className={field}>My role in detail<textarea name="my_role" defaultValue={p.my_role ?? ""} rows={3} className={input} /></label>
        <label className={field}>Key decisions (up to 3, one per line as “Title | Why it mattered”)
          <textarea name="decisions" defaultValue={decisionText} rows={4} className={input} />
        </label>
        <label className={field}>Challenges<textarea name="challenges" defaultValue={p.challenges ?? ""} rows={3} className={input} /></label>
        <label className={field}>Outcome<textarea name="outcome" defaultValue={p.outcome ?? ""} rows={3} className={input} /></label>
        <label className={field}>Highlights (one per line)<textarea name="highlights" defaultValue={highlightText} rows={3} className={input} /></label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={field}>Cover image URL<input name="cover_url" defaultValue={p.cover_url ?? ""} className={input} /></label>
          <label className={field}>Cover alt text<input name="cover_alt" defaultValue={p.cover_alt ?? ""} className={input} /></label>
        </div>
        <label className={field}>SEO description (max 160)<textarea name="seo_description" defaultValue={p.seo_description ?? ""} maxLength={160} rows={2} className={input} /></label>

        <button type="submit" className="justify-self-start bg-teal px-5 py-2.5 text-paper hover:bg-charcoal">Save project</button>
      </form>
    </section>
  );
}
