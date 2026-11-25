import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { projects, findProject } from "@/data/projects";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProjectGallery } from "@/components/portfolio/ProjectGallery";
import { CTASection } from "@/components/ui/CTASection";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return { title: "Case study not found" };
  return buildMetadata({ title: `${project.name} case study`, description: project.seoDescription, path: `/work/${project.slug}` });
}

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const previous = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;
  const related = projects.filter((p) => p.slug !== project.slug);
  const crumbs = [{ label: "Home", href: "/" }, { label: "Work", href: "/work" }, { label: project.name }];

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-4xl px-5 pb-4 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <article aria-labelledby="case-title" className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">
        <header className="flex flex-col gap-5 border-b border-gold/40 pb-12">
          <p className="eyebrow">{project.category}</p>
          <h1 id="case-title">{project.name}</h1>
          <p className="max-w-2xl text-lg text-charcoal/90">{project.summary}</p>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-charcoal">My role</dt>
              <dd className="text-muted">{project.role}</dd>
            </div>
            {project.platform ? (
              <div>
                <dt className="font-medium text-charcoal">Platform</dt>
                <dd className="text-muted">{project.platform}</dd>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <dt className="font-medium text-charcoal">Status</dt>
              <dd className="text-muted">{project.status}</dd>
            </div>
          </dl>
        </header>

        <div className="mt-12 space-y-12">
          {project.sections.map((section) => (
            <section key={section.heading} aria-labelledby={`section-${section.heading.replace(/\W+/g, "-").toLowerCase()}`}>
              <h2 id={`section-${section.heading.replace(/\W+/g, "-").toLowerCase()}`} className="text-3xl">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-lg text-charcoal/90">
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-4 grid list-disc gap-2 pl-6 text-charcoal/90 marker:text-gold">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          {project.screenshots.length > 0 ? (
            <section aria-labelledby="gallery-heading">
              <h2 id="gallery-heading" className="text-3xl">
                Screens
              </h2>
              <div className="mt-6">
                <ProjectGallery screenshots={project.screenshots} name={project.name} />
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <nav aria-label="Case study navigation" className="mx-auto flex max-w-4xl flex-col gap-4 border-t border-gold/40 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
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

      {related.length > 0 ? (
        <section aria-labelledby="related-projects" className="mx-auto max-w-4xl px-5 pb-16 sm:px-8">
          <h2 id="related-projects" className="text-2xl">
            Related case studies
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <ButtonLink href={`/work/${item.slug}`} variant="ghost">
                  {item.name} — {item.category} →
                </ButtonLink>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CTASection headline="Facing something similar?" body="If your product has a comparable problem, let's look at it together." ctaLabel="Work With Me" ctaHref="/contact" />
    </main>
  );
}
