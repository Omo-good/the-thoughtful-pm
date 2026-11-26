import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { getServices, getShowPrices } from "@/lib/back-office";
import { siteConfig, absoluteUrl } from "@/data/site-config";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Services",
  description:
    "Product discovery, PRD and requirements sprints, product audits and fractional Product Management for founders, startups and growing businesses.",
  path: "/services",
});

const kicker = "text-[11px] font-medium uppercase tracking-[0.34em] text-gold";

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
    <main id="main" className="flex-1 bg-ivory text-charcoal">
      <JsonLd data={serviceJsonLd} />

      <section aria-labelledby="services-title" className="px-6 pt-16 md:px-[110px] md:pt-[90px]">
        <span className={kicker}>Services</span>
        <h1 id="services-title" className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] font-normal leading-[1.04] tracking-[-0.01em]">
          How we can work together.
        </h1>
        <p className="mt-10 max-w-[640px] text-lg leading-[1.7] text-[#4A4034] md:text-[19px]">
          Each service has a defined scope and deliverables. Pick the one that matches where you are, or describe your situation and we&apos;ll find the right starting point.
        </p>
      </section>

      <section className="mt-16 px-6 md:mt-[110px] md:px-[110px]">
        <ol className="border-t border-[rgba(28,24,19,0.18)]">
          {services.map((service, index) => (
            <li
              key={service.slug}
              className="grid gap-6 border-b border-[rgba(28,24,19,0.18)] py-10 md:grid-cols-[4fr_8fr] md:gap-20 md:py-16"
            >
              <div className="flex flex-col gap-4">
                <span className={kicker}>{String(index + 1).padStart(2, "0")}</span>
                <h2 className="font-display text-[30px] leading-[1.12] md:text-[48px] md:leading-[1.08]">{service.name}</h2>
              </div>
              <div className="flex flex-col gap-6 md:gap-7">
                <p className="max-w-[620px] text-base leading-[1.7] text-[#4A4034] md:text-[19px]">{service.summary}</p>
                {showPrices ? (
                  <p className="text-sm text-charcoal">
                    {service.price.ngn} · {service.price.usd}
                    {service.price.unit ? ` ${service.price.unit}` : ""}
                  </p>
                ) : null}
                <Link
                  href={`/contact?service=${encodeURIComponent(service.enquiryValue)}`}
                  className="self-start text-sm text-gold underline underline-offset-8"
                >
                  Request this service →
                </Link>
              </div>
            </li>
          ))}
        </ol>
        {showPrices ? (
          <p className="mt-6 text-sm text-[#4A4034]">
            Prices are indicative starting points, in NGN and USD. They are not converted between currencies.
          </p>
        ) : null}
      </section>

      <section className="mx-6 mt-24 flex flex-col gap-8 bg-gold px-8 py-16 text-ivory md:mx-[110px] md:mt-[150px] md:flex-row md:items-center md:justify-between md:gap-15 md:px-[90px] md:py-[110px]">
        <h2 className="max-w-[760px] font-display text-[clamp(2.5rem,5vw,4rem)] font-normal leading-[1.05]">Not sure which service fits?</h2>
        <Link
          href="/contact"
          className="inline-flex h-14 shrink-0 items-center bg-ivory px-10 text-[15px] font-medium text-charcoal hover:bg-sand md:h-[60px]"
        >
          Start a Conversation
        </Link>
      </section>
    </main>
  );
}
