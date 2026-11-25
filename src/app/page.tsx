import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";
import { expertise } from "@/data/expertise";
import { services } from "@/data/services";
import { projects } from "@/data/projects";
import { getPublishedInsights } from "@/lib/content";
import { HeroSection } from "@/components/homepage/HeroSection";
import { IntroSection } from "@/components/homepage/IntroSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ExpertiseCard } from "@/components/expertise/ExpertiseCard";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "The Thoughtful PM | Arewa — Product Manager & Consultant",
  description: siteConfig.description,
  path: "/",
});

const principles = [
  "Understand before solving.",
  "People before features.",
  "Clarity before execution.",
  "Evidence before assumptions.",
  "Outcomes over output.",
  "Thoughtful collaboration.",
];

export default function HomePage() {
  // Only published articles appear, and only the three most recent (PRD §6.1 Section 7).
  const recentArticles = getPublishedInsights().slice(0, 3);

  return (
    <main id="main" className="flex-1">
      <HeroSection />
      <IntroSection />

      <section aria-labelledby="expertise-heading" className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading id="expertise-heading" eyebrow="Areas of expertise" title="Core product capabilities." intro="The disciplines I bring to every engagement, whether it is a new idea or a product that needs direction." />
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((item, index) => (
              <ExpertiseCard key={item.title} index={index + 1} title={item.title} description={item.description} />
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="work-heading" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="work-heading" eyebrow="Selected work" title="Product work, in depth." />
          <ButtonLink href="/work" variant="ghost">
            Explore My Work →
          </ButtonLink>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug} className="flex">
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="services-heading" className="bg-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <SectionHeading id="services-heading" eyebrow="Consulting" title="How I can help." intro="Clear, scoped engagements for founders, startups and growing businesses." />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug} className="flex">
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href="/services" variant="ghost">
              Explore Services →
            </ButtonLink>
          </div>
        </div>
      </section>

      {recentArticles.length > 0 ? (
        <section aria-labelledby="insights-heading" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading id="insights-heading" eyebrow="Insights" title="Recent thinking." />
            <ButtonLink href="/insights" variant="ghost">
              Explore All Insights →
            </ButtonLink>
          </div>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {recentArticles.map((article) => (
              <li key={article.slug} className="flex">
                <ArticleCard article={article} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section aria-labelledby="principles-heading" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <SectionHeading id="principles-heading" eyebrow="Working philosophy" title="The principles behind the work." />
        <ol className="mt-12 grid gap-px overflow-hidden rounded-lg border border-gold/50 bg-gold/40 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <li key={principle} className="flex items-center gap-4 bg-paper p-7">
              <span className="font-display text-2xl text-teal" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-2xl text-charcoal">{principle}</span>
            </li>
          ))}
        </ol>
      </section>

      <CTASection
        id="conversion-heading"
        headline="Have an idea worth building?"
        body="Whether you're defining a new product, improving an existing experience or looking for flexible Product Management support, let's explore how we can work together."
        ctaLabel="Start a Conversation"
        ctaHref="/contact"
      />
    </main>
  );
}
