import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, as: Heading = "h3" }: { project: Project; as?: "h2" | "h3" }) {
  return (
    <article aria-labelledby={`project-${project.slug}`} className="card flex h-full flex-col gap-4 p-7">
      <p className="eyebrow">{project.category}</p>
      <Heading id={`project-${project.slug}`} className="text-3xl">
        {project.name}
      </Heading>
      <p className="text-charcoal/90">{project.cardDescription}</p>
      <dl className="mt-auto grid gap-2 text-sm">
        <div>
          <dt className="inline font-medium">My role: </dt>
          <dd className="inline text-muted">{project.role}</dd>
        </div>
        {project.platform ? (
          <div>
            <dt className="inline font-medium">Platform: </dt>
            <dd className="inline text-muted">{project.platform}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href={`/work/${project.slug}`}
        className="mt-2 inline-flex min-h-11 items-center font-medium text-teal hover:underline"
        aria-label={`View case study: ${project.name}`}
      >
        View Case Study →
      </Link>
    </article>
  );
}
