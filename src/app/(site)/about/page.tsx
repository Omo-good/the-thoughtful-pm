import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "About Goodness, The Thoughtful PM: a Product Manager and independent consultant on product strategy, discovery, requirements and delivery.",
  path: "/about",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "About" }];

const background = [
  "Product Management experience.",
  "Industrial Chemistry academic background.",
  "Product Management training through AltSchool Africa.",
  "Work on digital product initiatives.",
  "Experience collaborating with design and development teams.",
  "Experience using AI-assisted development tools.",
];

const philosophy = [
  "Problem understanding.",
  "User empathy.",
  "Strategic thinking.",
  "Systems thinking.",
  "Prioritisation.",
  "Communication.",
  "Continuous learning.",
];

const interests = [
  "Product Strategy.",
  "Human-Centred Design.",
  "AI and Product Management.",
  "Startup Development.",
  "Product Operations.",
  "African Technology Ecosystem.",
  "Product Thinking and Systems.",
];

const principles = [
  "Understand before solving.",
  "People before features.",
  "Clarity before execution.",
  "Evidence before assumptions.",
  "Outcomes over output.",
  "Thoughtful collaboration.",
];

export default function AboutPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-4xl px-5 pb-6 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <section aria-labelledby="about-intro" className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <SectionHeading as="h1" id="about-intro" eyebrow="About" title="Hi, I'm Goodness, your Thoughtful PM." />
        <p className="mt-8 text-lg text-charcoal/90">
          The Thoughtful PM is the expression of my professional philosophy, experiences and perspectives on building products.
        </p>
      </section>

      <section aria-labelledby="background-heading" className="mx-auto max-w-4xl border-t border-gold/40 px-5 py-16 sm:px-8">
        <h2 id="background-heading" className="text-3xl">
          Professional background
        </h2>
        <ul className="mt-6 grid list-disc gap-3 pl-6 text-lg text-charcoal/90 marker:text-gold">
          {background.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="philosophy-heading" className="mx-auto max-w-4xl border-t border-gold/40 px-5 py-16 sm:px-8">
        <h2 id="philosophy-heading" className="text-3xl">
          Product Management philosophy
        </h2>
        <p className="mt-6 text-lg text-charcoal/90">
          Product Management involves more than feature delivery. It is about understanding the problem, making informed decisions and helping teams create solutions that matter. The areas I focus on include:
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {philosophy.map((item) => (
            <li key={item} className="card px-5 py-3 text-charcoal">
              {item.replace(/\.$/, "")}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="interests-heading" className="mx-auto max-w-4xl border-t border-gold/40 px-5 py-16 sm:px-8">
        <h2 id="interests-heading" className="text-3xl">
          Areas of interest
        </h2>
        <ul className="mt-6 flex flex-wrap gap-3">
          {interests.map((item) => (
            <li key={item} className="rounded-full border border-teal/40 px-4 py-2 text-teal">
              {item.replace(/\.$/, "")}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="principles-about" className="mx-auto max-w-4xl border-t border-gold/40 px-5 py-16 sm:px-8">
        <h2 id="principles-about" className="text-3xl">
          Working principles
        </h2>
        <ol className="mt-6 grid list-decimal gap-3 pl-6 text-lg text-charcoal/90 marker:font-display marker:text-gold">
          {principles.map((item) => (
            <li key={item}>{item.replace(/\.$/, "")}</li>
          ))}
        </ol>
      </section>

      <CTASection headline="Let's build something meaningful." body="Tell me what you're working on and we can explore whether I can help." ctaLabel="Work With Me" ctaHref="/contact" secondaryLabel="Explore Services" secondaryHref="/services" />
    </main>
  );
}
