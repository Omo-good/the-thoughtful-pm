import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { projects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description: "Product case studies by Arewa: Everwoven, PrayFirst and GiftWize, covering the problem, strategy, product decisions and outcomes.",
  path: "/work",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Work" }];

export default function WorkPage() {
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
          intro="Each case study explains the problem, the product thinking, my role and what was actually built, so you can see where ownership sat and where other people's implementation took over."
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
