import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getProjects } from "@/lib/back-office";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description: "Product case studies by Goodness: Everwoven, PrayFirst and Giftwyz.",
  path: "/work",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Work" }];

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <section aria-labelledby="work-title" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          as="h1"
          id="work-title"
          eyebrow="Portfolio"
          title="Product work, with the decisions behind it."
          intro="Each case study shows my role, the platform and where the product stands today."
        />
        <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} as="h2" />
            </li>
          ))}
        </ul>
      </section>

      <CTASection headline="Read a case study. Then let's talk about yours." ctaLabel="Work With Me" ctaHref="/contact" secondaryLabel="Request a Product Audit" secondaryHref="/contact?service=Product%20Audit" />
    </main>
  );
}
