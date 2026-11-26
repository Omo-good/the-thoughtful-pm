import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getProjects, getProjectBySlug } from "@/lib/back-office";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { CTASection } from "@/components/ui/CTASection";

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

function CaseSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="eyebrow">{title}</h2>
      <div className="mt-5 max-w-3xl">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === project.slug);
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const crumbs = [{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: project.name }];

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-5xl px-5 pb-4 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <article aria-labelledby="case-title" className="mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <header className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">{project.tag}</p>
            <h1 id="case-title">{project.name}</h1>
            <p className="text-lg text-charcoal/90">{project.tagline}</p>
          </div>
          <div className="card overflow-hidden">
            <Image
              src={project.cover}
              alt=""
              width={1200}
              height={900}
              unoptimized
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[4/3] h-auto w-full object-cover"
            />
          </div>
        </header>

        <dl className="mt-12 grid gap-6 border-t border-gold/40 pt-8 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-medium text-charcoal">My role</dt>
            <dd className="mt-1 text-muted">{project.role}</dd>
          </div>
          {project.platform ? (
            <div>
              <dt className="font-medium text-charcoal">Platform</dt>
              <dd className="mt-1 text-muted">{project.platform}</dd>
            </div>
          ) : null}
          <div className={project.platform ? "" : "sm:col-span-2"}>
            <dt className="font-medium text-charcoal">Status</dt>
            <dd className="mt-1 text-muted">{project.status}</dd>
          </div>
        </dl>

        {project.problem ? (
          <CaseSection id="problem-heading" title="The problem">
            <p className="text-lg leading-relaxed text-charcoal/90">{project.problem}</p>
          </CaseSection>
        ) : null}

        {project.users ? (
          <CaseSection id="users-heading" title="Who it was for">
            <dl className="grid gap-6 sm:grid-cols-3">
              {[
                ["Who", project.users.who],
                ["Objective", project.users.objective],
                ["Measure of success", project.users.measure],
              ]
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-sm font-medium text-charcoal">{label}</dt>
                    <dd className="mt-1 text-muted">{value}</dd>
                  </div>
                ))}
            </dl>
          </CaseSection>
        ) : null}

        {project.myRole ? (
          <CaseSection id="role-heading" title="My role">
            <p className="leading-relaxed text-charcoal/90">{project.myRole}</p>
          </CaseSection>
        ) : null}

        {project.decisions && project.decisions.length > 0 ? (
          <CaseSection id="decisions-heading" title="Key decisions">
            <ol className="grid gap-8">
              {project.decisions.map((decision, i) => (
                <li key={decision.title} className="grid gap-2 border-t border-gold/40 pt-6 sm:grid-cols-[3rem_1fr]">
                  <span className="font-display text-2xl text-gold-deep">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl">{decision.title}</h3>
                    {decision.why ? <p className="mt-2 leading-relaxed text-muted">{decision.why}</p> : null}
                  </div>
                </li>
              ))}
            </ol>
          </CaseSection>
        ) : null}

        {project.challenges ? (
          <CaseSection id="challenges-heading" title="Challenges">
            <p className="leading-relaxed text-charcoal/90">{project.challenges}</p>
          </CaseSection>
        ) : null}

        {project.outcome ? (
          <CaseSection id="outcome-heading" title="Outcome">
            <p className="leading-relaxed text-charcoal/90">{project.outcome}</p>
          </CaseSection>
        ) : null}

        <section aria-labelledby="highlights-heading" className="mt-12">
          <h2 id="highlights-heading" className="sr-only">
            Highlights
          </h2>
          <ul className="grid gap-4 md:grid-cols-3">
            {project.points.map((point) => (
              <li key={point} className="card p-6 text-charcoal">
                {point}
              </li>
            ))}
          </ul>
        </section>

        {project.screenshots.length > 0 ? (
          <section aria-labelledby="gallery-heading" className="mt-16">
            <h2 id="gallery-heading" className="text-3xl">
              Screens
            </h2>
            <div className="mt-6">
              <ProjectGallery screenshots={project.screenshots} name={project.name} />
            </div>
          </section>
        ) : null}
      </article>

      <nav aria-label="Case study navigation" className="mx-auto flex max-w-5xl flex-col gap-4 border-t border-gold/40 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/work" className="font-medium text-teal hover:underline">
          ← Back to Work
        </Link>
        <div className="flex gap-6 text-sm">
          {previous ? (
            <Link href={`/work/${previous.slug}`} className="text-teal hover:underline">
              ← {previous.name}
            </Link>
          ) : null}
          {next ? (
            <Link href={`/work/${next.slug}`} className="text-teal hover:underline">
              {next.name} →
            </Link>
          ) : null}
        </div>
      </nav>

      <CTASection headline="Facing something similar?" ctaLabel="Work With Me" ctaHref="/contact" />
    </main>
  );
}
