import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getProjects, getProjectBySlug } from "@/lib/back-office";
import { ScreenStrip } from "./ScreenStrip";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Case study not found" };
  return buildMetadata({ title: `${project.name} case study`, description: project.seoDescription, path: `/work/${project.slug}` });
}

const kicker = "text-[11px] font-medium uppercase tracking-[0.34em] text-gold";
const placeholder = "bg-[linear-gradient(160deg,#E8D9BE,#C9A774)]";
const bigText = "font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.25]";

// Every section always renders, as on the approved board. Empty fields show the board's bracketed prompts.
function Section({ id, label, empty, children }: { id: string; label: string; empty?: boolean; children: React.ReactNode }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-label`}
      className={`scroll-mt-24 grid border-t border-[rgba(28,24,19,0.18)] md:grid-cols-[4fr_8fr] md:gap-20 ${empty ? "gap-3 py-6 md:py-8" : "gap-8 py-14 md:py-20"}`}
    >
      <span id={`${id}-label`} className={`${kicker} md:pt-2`}>
        {label}
      </span>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  // Only sections with content are shown, so no empty blocks are left on the page.
  const decisions = project.decisions ?? [];
  const userFields = [
    ["Who", project.users?.who],
    ["Objective", project.users?.objective],
    ["Measure", project.users?.measure],
  ].filter((field): field is [string, string] => Boolean(field[1]));
  const hasRole = Boolean(project.myRole || project.roleImage);
  const hasScreens = project.screenshots.length > 0;

  const jump: [string, string][] = [
    ["problem", "Problem"],
    ["users", "Users and goals"],
    ["role", "My role"],
    ["decisions", "Key decisions"],
    ["screens", "Product screens"],
  ];

  return (
    <main id="main" className="flex-1 overflow-x-clip bg-ivory text-charcoal">
      <section className="px-6 pt-12 md:px-[110px] md:pt-[80px]">
        <Link href="/work" className="text-sm text-gold underline underline-offset-8">
          ← All work
        </Link>
        <span className={`${kicker} mt-12 block`}>
          {project.tag} · {project.role}
        </span>
        <h1 className="mt-4 font-display text-[clamp(4.5rem,11vw,10rem)] font-normal leading-[0.95] tracking-[-0.02em]">{project.name}</h1>
        <div className="mt-10 grid gap-10 border-t border-[rgba(28,24,19,0.18)] pt-10 md:grid-cols-[7fr_5fr] md:items-start md:gap-20">
          <p className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] italic leading-[1.35] text-charcoal">{project.tagline}</p>
          <dl className="grid gap-6 text-[15px] md:grid-cols-3">
            <div>
              <dt className={kicker}>Role</dt>
              <dd className="mt-2">{project.role}</dd>
            </div>
            <div>
              <dt className={kicker}>Status</dt>
              <dd className="mt-2">{project.status}</dd>
            </div>
            <div>
              <dt className={kicker}>Platform</dt>
              <dd className="mt-2">{project.platform || "[Platform]"}</dd>
            </div>
          </dl>
        </div>
        {project.productUrl || project.storeUrl ? (
          <div className="mt-8 flex flex-wrap gap-4">
            {project.productUrl ? (
              <a href={project.productUrl} target="_blank" rel="noopener noreferrer" className="border border-gold px-6 py-3 text-sm font-medium text-gold hover:bg-gold hover:text-ivory">
                Visit the product ↗
              </a>
            ) : null}
            {project.storeUrl ? (
              <a href={project.storeUrl} target="_blank" rel="noopener noreferrer" className="bg-gold px-6 py-3 text-sm font-medium text-ivory hover:bg-gold-deep">
                Download the app ↗
              </a>
            ) : null}
          </div>
        ) : null}
        <nav aria-label="Jump to section" className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-y border-[rgba(28,24,19,0.18)] py-5 text-sm">
          {jump.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="text-[#4A4034] hover:text-gold">
              {label}
            </a>
          ))}
        </nav>
      </section>

      {/* Full-width hero. Uses the uploaded hero image, or a placeholder until one is added in the back office. */}
      {project.hero ? (
        <section className="relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.hero.src} alt={project.hero.alt} className="block h-auto w-full" />
        </section>
      ) : (
        <section className={`relative left-1/2 mt-12 flex h-[220px] w-screen -translate-x-1/2 items-end md:h-[min(78vh,820px)] ${placeholder} p-8 md:p-12`}>
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#5C5244]">Hero image · 2400 × 1350 px minimum, full width</span>
        </section>
      )}

      <div className="px-6 md:px-[110px]">
        <Section id="problem" label="Problem" empty={!project.problem}>
          {project.problem ? <p className={bigText}>{project.problem}</p> : null}
        </Section>

        <Section id="users" label="Users and goals" empty={userFields.length === 0}>
          {userFields.length > 0 ? (
            <dl className="grid gap-8 md:grid-cols-3">
              {userFields.map(([label, value]) => (
                <div key={label}>
                  <dt className={kicker}>{label}</dt>
                  <dd className="mt-3 font-display text-[22px] leading-[1.35]">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </Section>

        <Section id="role" label="My role" empty={!hasRole}>
          <div className="flex flex-col gap-10">
            {project.myRole ? <p className={bigText}>{project.myRole}</p> : null}
            {project.roleImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={project.roleImage.src} alt={project.roleImage.alt} className="block h-auto w-full" />
            ) : null}
          </div>
        </Section>

        <Section id="decisions" label="Key decisions" empty={decisions.length === 0}>
          <ol className="border-t border-[rgba(28,24,19,0.14)]">
            {decisions.map((decision, i) => (
              <li key={`${i}-${decision.title}`} className="grid gap-3 border-b border-[rgba(28,24,19,0.14)] py-8 md:grid-cols-[88px_1fr] md:gap-6">
                <span className="font-display text-[28px] italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] leading-[1.2]">{decision.title}</h3>
                  {decision.why ? <p className="mt-3 text-[17px] leading-[1.7] text-[#4A4034]">{decision.why}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="screens" label="Product screens" empty={!hasScreens}>
          {hasScreens ? <ScreenStrip shots={project.screenshots} /> : null}
        </Section>

      </div>

      <section className="mt-4 flex flex-col gap-8 border-t border-[rgba(28,24,19,0.18)] px-6 py-16 md:flex-row md:items-end md:justify-between md:px-[110px] md:py-20">
        {next && next.slug !== project.slug ? (
          <div className="flex flex-col gap-4">
            <span className={kicker}>Next case study</span>
            <Link href={`/work/${next.slug}`} className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-none hover:text-gold">
              {next.name} →
            </Link>
          </div>
        ) : null}
        <Link href="/work" className="text-sm text-gold underline underline-offset-8">
          ← All work
        </Link>
      </section>
    </main>
  );
}
