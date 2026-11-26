import Link from "next/link";
import type { Project } from "@/data/projects";
import { ScreenStrip } from "./ScreenStrip";

const label = "text-[11px] font-medium uppercase tracking-[0.34em]";
const pull = "font-display text-[clamp(1.9rem,3.6vw,3.2rem)] leading-[1.18]";

// Light editorial option: an ivory magazine spread with a serif pull-quote voice,
// a narrow reading column, and wide images between the text.
export function CaseStudyEditorial({ project, next }: { project: Project; next: Project | null }) {
  const decisions = project.decisions ?? [];
  const userFields = [
    ["Who", project.users?.who],
    ["Objective", project.users?.objective],
    ["Measure", project.users?.measure],
  ].filter((field): field is [string, string] => Boolean(field[1]));
  const hasRole = Boolean(project.myRole || project.roleImage);
  const hasScreens = project.screenshots.length > 0;

  return (
    <main id="main" className="flex-1 overflow-x-clip bg-ivory text-charcoal">
      <header className="mx-auto max-w-[1280px] px-6 pb-14 pt-12 md:px-[110px] md:pb-20 md:pt-16">
        <Link href="/work" className="text-sm text-gold underline underline-offset-8">
          ← All work
        </Link>
        <p className={`${label} mt-14 text-gold-deep`}>
          {project.tag} · {project.role}
        </p>
        <h1 className="mt-6 font-display text-[clamp(3.75rem,10vw,9rem)] font-normal leading-[0.95] tracking-[-0.02em]">{project.name}</h1>
        <div className="mt-12 grid gap-10 md:grid-cols-[1fr_300px] md:gap-20">
          <p className="font-display text-[clamp(1.5rem,2.4vw,2.1rem)] italic leading-[1.4] text-[#4A4034]">{project.tagline}</p>
          <dl className="grid grid-cols-2 gap-6 self-end border-l border-gold/40 pl-8 text-[15px] md:grid-cols-1">
            <div>
              <dt className={`${label} text-gold`}>Status</dt>
              <dd className="mt-2">{project.status}</dd>
            </div>
            {project.platform ? (
              <div>
                <dt className={`${label} text-gold`}>Platform</dt>
                <dd className="mt-2">{project.platform}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        {project.productUrl || project.storeUrl ? (
          <div className="mt-10 flex flex-wrap gap-4">
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
      </header>

      {project.hero ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={project.hero.src} alt={project.hero.alt} className="block h-auto w-full" />
      ) : (
        <div className="mx-auto max-w-[1280px] px-6 md:px-[110px]">
          <div className="flex h-[240px] items-end bg-sand p-8 md:h-[520px] md:p-12">
            <span className={`${label} text-[#5C5244]`}>Hero image · 2400 × 1350 px minimum</span>
          </div>
        </div>
      )}

      <article className="mx-auto max-w-[1000px] px-6 py-20 md:px-0 md:py-28">
        {project.problem ? (
          <section id="problem" className="scroll-mt-24">
            <h2 className={`${label} text-gold-deep`}>Problem</h2>
            <p className={`${pull} mt-8`}>{project.problem}</p>
          </section>
        ) : null}

        {userFields.length > 0 ? (
          <section id="users" className="mt-24 scroll-mt-24 border-t border-gold/30 pt-16">
            <h2 className={`${label} text-gold-deep`}>Users and goals</h2>
            <dl className="mt-10 grid gap-10 md:grid-cols-3">
              {userFields.map(([text, value]) => (
                <div key={text}>
                  <dt className={`${label} text-gold`}>{text}</dt>
                  <dd className="mt-4 font-display text-[22px] leading-[1.4]">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}

        {hasRole ? (
          <section id="role" className="mt-24 scroll-mt-24 border-t border-gold/30 pt-16">
            <h2 className={`${label} text-gold-deep`}>My role</h2>
            {project.myRole ? <p className={`${pull} mt-8`}>{project.myRole}</p> : null}
          </section>
        ) : null}

        {project.challenges ? (
          <section id="lessons" className="mt-24 scroll-mt-24 border-t border-gold/30 pt-16">
            <h2 className={`${label} text-gold-deep`}>Challenges and lessons</h2>
            <p className={`${pull} mt-8`}>{project.challenges}</p>
          </section>
        ) : null}
      </article>

      {project.roleImage ? (
        <div className="mx-auto max-w-[1280px] px-6 md:px-[110px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.roleImage.src} alt={project.roleImage.alt} className="block h-auto w-full" />
        </div>
      ) : null}

      {decisions.length > 0 ? (
        <section id="decisions" className="mx-auto max-w-[1000px] scroll-mt-24 px-6 py-24 md:px-0">
          <h2 className={`${label} text-gold-deep`}>Key decisions</h2>
          <ol className="mt-12 flex flex-col">
            {decisions.map((decision, i) => (
              <li key={`${i}-${decision.title}`} className="grid gap-4 border-t border-gold/30 py-10 md:grid-cols-[80px_1fr]">
                <span className="font-display text-3xl italic text-gold">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.2]">{decision.title}</h3>
                  {decision.why ? <p className="mt-4 text-[17px] leading-[1.8] text-[#4A4034]">{decision.why}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {project.outcome ? (
        <section id="outcome" className="mx-auto max-w-[1000px] scroll-mt-24 px-6 pb-24 md:px-0">
          <h2 className={`${label} text-gold-deep`}>Outcome</h2>
          <p className={`${pull} mt-8 italic text-gold-deep`}>{project.outcome}</p>
        </section>
      ) : null}

      {hasScreens ? (
        <section id="screens" className="scroll-mt-24 bg-sand py-20 md:py-28">
          <div className="mx-auto max-w-[1280px] px-6 md:px-[110px]">
            <h2 className={`${label} text-gold-deep`}>Product screens</h2>
            <div className="mt-12">
              <ScreenStrip shots={project.screenshots} />
            </div>
          </div>
        </section>
      ) : null}

      {next && next.slug !== project.slug ? (
        <Link href={`/work/${next.slug}`} className="group mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-24 md:px-[110px]">
          <span className={`${label} text-gold-deep`}>Next case study</span>
          <span className="flex items-end justify-between font-display text-[clamp(3rem,8vw,7rem)] leading-none group-hover:text-gold-deep">
            {next.name}
            <span className="transition-transform group-hover:translate-x-2">→</span>
          </span>
        </Link>
      ) : null}
    </main>
  );
}
