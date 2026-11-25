import Link from "next/link";
import type { Service } from "@/data/services";
import { siteConfig } from "@/data/site-config";

type HeadingLevel = "h2" | "h3";

interface ServiceCardProps {
  service: Service;
  showDeliverables?: boolean;
  as?: HeadingLevel;
}

export function ServiceCard({ service, showDeliverables = false, as: Heading = "h3" }: ServiceCardProps) {
  const enquiryHref = `/contact?service=${encodeURIComponent(service.enquiryValue)}`;
  const showPrices = siteConfig.pricing.showPrices;
  const headingId = `service-${service.slug}`;

  return (
    <article aria-labelledby={headingId} className="card flex h-full flex-col gap-5 p-7">
      <div className="flex flex-col gap-2">
        <Heading id={headingId} className="text-3xl">
          {service.name}
        </Heading>
        <p className="text-sm text-muted">
          <span className="font-medium text-charcoal">For:</span> {service.targetCustomer}
        </p>
      </div>
      <p className="text-charcoal/90">
        <span className="font-medium">Problem solved:</span> {service.problem}
      </p>
      {showDeliverables ? (
        <div>
          <p className="eyebrow">Key deliverables</p>
          <ul className="mt-3 grid list-disc gap-1.5 pl-5 text-charcoal/90 marker:text-gold">
            {service.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="mt-auto flex flex-col gap-4 border-t border-gold/40 pt-5">
        {showPrices ? (
          <p className="text-sm text-muted">
            Starting from <span className="font-medium text-charcoal">{service.price.ngn}</span> / {service.price.usd}
            {service.price.unit ? ` ${service.price.unit}` : ""}
            {service.duration ? ` · ${service.duration}` : ""}
          </p>
        ) : (
          <p className="text-sm text-muted">Pricing on request{service.duration ? ` · ${service.duration}` : ""}</p>
        )}
        <Link href={enquiryHref} className="inline-flex min-h-11 items-center font-medium text-teal hover:underline">
          {service.ctaLabel} →
        </Link>
      </div>
    </article>
  );
}
