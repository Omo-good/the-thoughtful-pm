import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { ContactPanel, ContactPanelFromUrl } from "@/components/contact/ContactPanel";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Tell Arewa about your product idea, existing product or Product Management needs. Enquiries are reviewed personally.",
  path: "/contact",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Contact" }];

export default function ContactPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <section aria-labelledby="contact-title" className="mx-auto grid max-w-7xl gap-14 px-5 py-16 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 id="contact-title" className="mt-4">
            Let&apos;s build something meaningful.
          </h1>
          <p className="mt-6 text-lg text-charcoal/90">
            Have a product idea, an existing product that needs attention, or a team that needs Product Management support? Tell me what you&apos;re working on.
          </p>
          {siteConfig.email ? (
            <p className="mt-8 text-muted">
              Prefer email? Write to{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-teal underline">
                {siteConfig.email}
              </a>
              .
            </p>
          ) : null}
        </div>
        <div className="lg:col-span-7">
          {/* The fallback is the same form with no preselection, so the page does not shift when ?service= is read. */}
          <Suspense fallback={<ContactPanel initialService="" fallbackEmail={siteConfig.email} />}>
            <ContactPanelFromUrl fallbackEmail={siteConfig.email} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
