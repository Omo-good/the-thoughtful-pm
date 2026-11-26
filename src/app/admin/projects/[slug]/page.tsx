import Link from "next/link";
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
  hero_url: string | null; hero_alt: string | null; screenshots: { url: string; alt?: string }[] | null;
};

const card = "flex flex-col gap-[18px] bg-white p-7";
const label = "flex flex-col gap-2 text-[13px] font-medium";
const input =
  "w-full border border-[rgba(28,24,19,0.2)] bg-[#FAF7F0] px-3.5 py-2.5 text-sm font-normal text-charcoal";
const help = "text-xs font-normal text-[#5C5244]";

function Dropzone({ src, name, empty, wide = false }: { src: string | null; name: string; empty: string; wide?: boolean }) {
  return (
    <label className={`flex cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden border-[1.5px] border-dashed border-[rgba(154,107,47,0.5)] bg-[#FAF7F0] text-[13px] ${wide ? "h-[150px]" : "h-[170px]"}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-[#5C5244]">{empty}</span>
      )}
      <input type="file" name={name} accept="image/*" className="sr-only" />
      <span className="sr-only">Choose an image file</span>
    </label>
  );
}

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const token = await requireToken();
  const { slug } = await params;
  const rows = await adminRest<Project[]>(token, `projects?slug=eq.${encodeURIComponent(slug)}&select=*`);
  const p = rows?.[0];
  if (!p) notFound();

  const decisionText = (p.decisions ?? []).map((d) => `${d.title} | ${d.why}`).join("\n");
  const highlightText = (p.highlights ?? []).join("\n");
  const shots = (p.screenshots ?? []).filter((shot) => shot.url);

  return (
    <form action={saveProject} className="flex flex-col gap-7">
      <input type="hidden" name="slug" value={p.slug} />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/projects" className="text-xs text-[#5C5244] underline underline-offset-4">
            ← Projects
          </Link>
          <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">{p.name}</h1>
          <p className="mt-1 text-xs text-[#5C5244]">
            {p.published ? "Live" : "Draft"}. Save here, then publish or unpublish from the Projects list.
          </p>
        </div>
        <button type="submit" className="inline-flex h-11 items-center bg-gold px-[22px] text-sm font-medium text-ivory hover:bg-gold-deep">
          Save project
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="flex flex-col gap-6">
          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Overview</h2>
            <label className={label}>
              Project name
              <input name="name" defaultValue={p.name} required className={input} />
            </label>
            <label className={label}>
              Tagline (one sentence, max 160)
              <textarea name="tagline" defaultValue={p.tagline} maxLength={160} rows={2} className={input} />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={label}>
                Category
                <input name="category" defaultValue={p.category ?? ""} className={input} />
              </label>
              <label className={label}>
                Platform
                <input name="platform" defaultValue={p.platform ?? ""} className={input} />
              </label>
              <label className={label}>
                My role
                <input name="role" defaultValue={p.role ?? ""} className={input} />
              </label>
              <label className={label}>
                Status
                <select name="status" defaultValue={p.status} className={input}>
                  <option>Live</option>
                  <option>In progress</option>
                  <option>Concept</option>
                </select>
              </label>
              <label className={`${label} sm:col-span-2`}>
                Status note
                <input name="status_note" defaultValue={p.status_note ?? ""} className={input} />
              </label>
            </div>
          </div>

          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Case study</h2>
            <label className={label}>
              Problem
              <textarea name="problem" defaultValue={p.problem ?? ""} rows={3} className={input} />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className={label}>
                Who
                <input name="users_who" defaultValue={p.users?.who ?? ""} className={input} />
              </label>
              <label className={label}>
                Objective
                <input name="users_objective" defaultValue={p.users?.objective ?? ""} className={input} />
              </label>
              <label className={label}>
                Measure
                <input name="users_measure" defaultValue={p.users?.measure ?? ""} className={input} />
              </label>
            </div>
            <label className={label}>
              My role in detail
              <textarea name="my_role" defaultValue={p.my_role ?? ""} rows={3} className={input} />
            </label>
            <label className={label}>
              Key decisions (up to 3, one per line as “Title | Why it mattered”)
              <textarea name="decisions" defaultValue={decisionText} rows={4} className={input} />
            </label>
            <label className={label}>
              Challenges and lessons
              <textarea name="challenges" defaultValue={p.challenges ?? ""} rows={3} className={input} />
            </label>
            <label className={label}>
              Outcome and status
              <textarea name="outcome" defaultValue={p.outcome ?? ""} rows={3} className={input} />
            </label>
            <label className={label}>
              Highlights (one per line)
              <textarea name="highlights" defaultValue={highlightText} rows={3} className={input} />
            </label>
            <span className={help}>Leave a section empty to hide it on the public page.</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Cover image</h2>
            <input type="hidden" name="cover_url" value={p.cover_url ?? ""} />
            <Dropzone src={p.cover_url} name="cover_file" empty="Drop an image here" />
            <span className={help}>{p.cover_url ? "Uploaded" : "Not uploaded yet"}. Minimum 2400 × 1350 px. Choose a new file to replace it.</span>
            <label className={label}>
              Cover alt text
              <input name="cover_alt" defaultValue={p.cover_alt ?? ""} className={input} />
            </label>
          </div>

          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Case study hero</h2>
            <input type="hidden" name="hero_url_current" value={p.hero_url ?? ""} />
            <Dropzone src={p.hero_url} name="hero_file" empty="Drop a full-width image here" wide />
            <span className={help}>Full-width band at the top of the case study. Minimum 2400 × 1350 px.</span>
            <label className="flex items-center gap-2 text-[13px] font-medium">
              <input type="checkbox" name="clear_hero" className="h-4 w-4 accent-gold" />
              Remove the hero image
            </label>
            <label className={label}>
              Hero alt text
              <input name="hero_alt" defaultValue={p.hero_alt ?? ""} className={input} />
            </label>
          </div>

          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Product screens</h2>
            <input type="hidden" name="screenshots_json" value={JSON.stringify(shots)} />
            {shots.length > 0 ? (
              <ul className="flex flex-col gap-4">
                {shots.map((shot, i) => (
                  <li key={shot.url} className="flex gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={shot.url} alt="" className="h-20 w-28 shrink-0 object-cover" />
                    <div className="flex flex-1 flex-col gap-2">
                      <input name={`shot_alt_${i}`} defaultValue={shot.alt} placeholder="Alt text" className={input} />
                      <label className="flex items-center gap-2 text-[12px] font-medium">
                        <input type="checkbox" name={`shot_remove_${i}`} className="h-4 w-4 accent-gold" />
                        Remove
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-[90px] items-center justify-center bg-[#FAF7F0] text-[13px] text-[#5C5244]">No product screens yet</div>
            )}
            <label className="flex flex-col gap-2 text-[13px] font-medium">
              Add product screens (up to 8 in total)
              <input type="file" name="screenshot_files" accept="image/*" multiple className="text-sm" />
            </label>
            <span className={help}>Minimum 1600 × 1200 px each. The first two show on the case study.</span>
          </div>

          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Visibility and search</h2>
            <label className={label}>
              Search description (max 160)
              <textarea name="seo_description" defaultValue={p.seo_description ?? ""} maxLength={160} rows={3} className={input} />
            </label>
            <label className={label}>
              Sort order
              <input name="sort_order" type="number" defaultValue={p.sort_order} className={input} />
            </label>
            <label className="flex items-center gap-2 text-[13px] font-medium">
              <input type="checkbox" name="featured" defaultChecked={p.featured} className="h-4 w-4 accent-gold" />
              Show on the homepage
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
