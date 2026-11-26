import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";

export function ProjectCard({ project, as: Heading = "h3" }: { project: Project; as?: "h2" | "h3" }) {
  return (
    <article aria-labelledby={`project-${project.slug}`} className="card flex h-full flex-col overflow-hidden">
      <Link href={`/work/${project.slug}`} tabIndex={-1} aria-hidden="true" className="block">
        <Image
          src={project.cover}
          alt=""
          width={1200}
          height={900}
          unoptimized
          sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3] h-auto w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="eyebrow">{project.tag}</p>
        <Heading id={`project-${project.slug}`} className="text-3xl">
          {project.name}
        </Heading>
        <p className="text-charcoal/90">{project.tagline}</p>
        <Link
          href={`/work/${project.slug}`}
          className="mt-auto inline-flex min-h-11 items-center pt-2 font-medium text-teal hover:underline"
          aria-label={`View case study: ${project.name}`}
        >
          View case study →
        </Link>
      </div>
    </article>
  );
}
