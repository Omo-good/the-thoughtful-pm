import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/back-office";
import type { Project } from "@/data/projects";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description: "Product case studies by Goodness: Everwoven, PrayFirst and Giftwyz.",
  path: "/work",
});

// Filters and pagination use URL parameters, so the page works without client-side JavaScript
// and stays practical as the number of case studies grows.
const PAGE_SIZE = 6;
const kicker = "text-[11px] font-medium uppercase tracking-[0.34em] text-gold";

interface WorkPageProps {
  searchParams: Promise<{ q?: string; tag?: string; page?: string }>;
}

function filterProjects(projects: Project[], q: string, tag: string) {
  const term = q.trim().toLowerCase();
  return projects.filter((p) => {
    if (tag && p.tag.toLowerCase() !== tag.toLowerCase()) return false;
    if (!term) return true;
    return `${p.name} ${p.tag} ${p.tagline} ${p.role}`.toLowerCase().includes(term);
  });
}

function buildHref(params: { q: string; tag: string; page: number }) {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.tag) search.set("tag", params.tag);
  if (params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `/work?${query}` : "/work";
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const { q = "", tag = "", page = "1" } = await searchParams;
  const projects = await getProjects();

  const tags = Array.from(new Set(projects.map((p) => p.tag)));
  const filtered = filterProjects(projects, q, tag);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, Number.parseInt(page, 10) || 1), totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
  const to = Math.min(current * PAGE_SIZE, filtered.length);

  return (
    <main id="main" className="flex-1 bg-ivory text-charcoal">
      <section className="px-6 pt-16 md:px-[110px] md:pt-[90px]">
        <span className={kicker}>Work</span>
        <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,6rem)] font-normal leading-[1.02]">Selected work.</h1>
        <p className="mt-8 max-w-[640px] text-lg leading-[1.7] text-[#4A4034]">
          Each case study shows my role, the platform and where the product stands today.
        </p>
      </section>

      <section className="mt-14 flex flex-col gap-6 px-6 md:mt-16 md:flex-row md:items-center md:justify-between md:px-[110px]">
        <nav aria-label="Filter by category" className="flex flex-wrap gap-6 text-sm">
          <Link href={buildHref({ q, tag: "", page: 1 })} className={!tag ? "text-gold underline underline-offset-8" : "text-charcoal"}>
            All <span className="text-muted">{projects.length}</span>
          </Link>
          {tags.map((t) => {
            const count = projects.filter((p) => p.tag === t).length;
            const active = tag.toLowerCase() === t.toLowerCase();
            return (
              <Link
                key={t}
                href={buildHref({ q, tag: t, page: 1 })}
                className={active ? "text-gold underline underline-offset-8" : "text-charcoal"}
              >
                {t} <span className="text-muted">{count}</span>
              </Link>
            );
          })}
        </nav>
        <form action="/work" role="search" className="flex w-full md:w-80">
          {tag ? <input type="hidden" name="tag" value={tag} /> : null}
          <label className="sr-only" htmlFor="work-search">
            Search projects
          </label>
          <input
            id="work-search"
            name="q"
            defaultValue={q}
            placeholder="Search projects"
            className="h-11 w-full border border-[rgba(28,24,19,0.22)] bg-white px-4 text-[15px] text-charcoal placeholder:text-muted"
          />
        </form>
      </section>

      <section className="mt-10 grid gap-7 px-6 md:mt-12 md:grid-cols-3 md:px-[110px]">
        {pageItems.map((project) => (
          <Link key={project.slug} href={`/work/${project.slug}`} className="group flex flex-col border border-[rgba(28,24,19,0.14)] bg-white">
            {project.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.cover} alt="" className="aspect-[16/9] w-full object-cover" />
            ) : (
              <div className="flex aspect-[16/9] w-full items-end bg-[linear-gradient(120deg,#E8D9BE,#DCC9A6)] p-4 text-[11px] uppercase tracking-[0.2em] text-[#5C5244]">
                Cover · 2400 × 1350 px
              </div>
            )}
            <div className="flex flex-1 flex-col gap-3 p-7">
              <span className={kicker}>
                {project.tag} · {project.role}
              </span>
              <span className="font-display text-[34px] leading-none">{project.name}</span>
              <span className="text-[15px] leading-[1.6] text-[#4A4034]">{project.tagline}</span>
              <span className="mt-auto pt-4 text-sm text-gold underline underline-offset-8">Read the case study →</span>
            </div>
          </Link>
        ))}
        {filtered.length === 0 ? <p className="text-lg text-[#4A4034] md:col-span-3">No case studies match that search yet.</p> : null}
      </section>

      <section className="mt-12 flex flex-col gap-6 px-6 md:mt-14 md:flex-row md:items-center md:justify-between md:px-[110px]">
        <span className="text-sm text-[#4A4034]">
          Showing {from}–{to} of {filtered.length}
        </span>
        {totalPages > 1 ? (
          <nav aria-label="Pagination" className="flex flex-wrap gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={buildHref({ q, tag, page: n })}
                aria-current={n === current ? "page" : undefined}
                className={`inline-flex h-10 w-10 items-center justify-center text-sm ${
                  n === current ? "bg-gold text-ivory" : "border border-[rgba(28,24,19,0.22)] text-charcoal"
                }`}
              >
                {n}
              </Link>
            ))}
          </nav>
        ) : null}
      </section>

      <section className="mx-6 mt-24 flex flex-col gap-8 bg-gold px-8 py-16 text-ivory md:mx-[110px] md:mt-[120px] md:flex-row md:items-center md:justify-between md:px-[90px] md:py-[100px]">
        <h2 className="max-w-[720px] font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-normal leading-[1.08]">
          Read a case study. Then let&apos;s talk about yours.
        </h2>
        <Link href="/contact" className="inline-flex h-14 shrink-0 items-center bg-ivory px-10 text-[15px] font-medium text-charcoal hover:bg-sand md:h-[60px]">
          Work With Me
        </Link>
      </section>
    </main>
  );
}
