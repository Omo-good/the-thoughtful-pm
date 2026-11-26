import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { getProjects, getProjectBySlug } from "@/lib/back-office";
import { CaseStudyEditorial } from "./CaseStudyEditorial";

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

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const projects = await getProjects();
  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : null;

  return <CaseStudyEditorial project={project} next={next} />;
}
