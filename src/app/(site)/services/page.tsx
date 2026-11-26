import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { getServices, getShowPrices } from "@/lib/back-office";
import { siteConfig, absoluteUrl } from "@/data/site-config";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ServiceCard } from "@/components/services/ServiceCard";
import { CTASection } from "@/components/ui/CTASection";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Product discovery, PRD and requirements sprints, product audits and fractional Product Management for founders, startups and growing businesses.",
  path: "/services",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Services" }];

export default async function ServicesPage() {
  const services = await getServices();
  const showPrices = await getShowPrices();

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.brandName,
    provider: { "@type": "Person", name: siteConfig.professionalName, jobTitle: siteConfig.professionalTitle },
    url: absoluteUrl("/services"),
    areaServed: "Worldwide",
    serviceType: services.map((s) => s.name),
  };

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd data={serviceJsonLd} />

      <section aria-labelledby="services-title" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <SectionHeading
          as="h1"
          id="services-title"
          eyebrow="Services"
          title="Clear product support, scoped to what you need."
          intro="Each service has a defined scope and deliverables. Pick the one that matches where you are, or describe your situation and we'll find the right starting point."
        />
        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {services.map((service) => (
            <li key={service.slug} className="flex">
              <ServiceCard service={service} showDeliverables as="h2" showPrices={showPrices} />
            </li>
          ))}
        </ul>
        <div className="mt-12 grid gap-6 rounded-lg border border-gold/50 bg-paper p-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl">How pricing works</h2>
            <p className="mt-3 text-muted">
              {showPrices
                ? "Prices shown are indicative starting points, in NGN and USD. They are not converted between currencies."
                : "Prices are provided on request after a short conversation about your needs."}
            </p>
          </div>
          <div>
            <h2 className="text-2xl">How to engage</h2>
            <p className="mt-3 text-muted">
              Choose a service and send an enquiry. The form keeps your chosen service so the conversation starts from the right place. Fractional engagement hours, availability and responsibilities are agreed before work begins.
            </p>
          </div>
        </div>
      </section>

      <CTASection headline="Not sure which service fits?" body="Describe where your product is today and we'll talk through the best next step." ctaLabel="Start a Conversation" ctaHref="/contact" />
    </main>
  );
}
