import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";
import { Breadcrumbs, breadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How The Thoughtful PM handles information submitted through the contact form, and what cookies or analytics are used.",
  path: "/privacy",
});

const crumbs = [{ label: "Home", href: "/" }, { label: "Privacy Policy" }];

export default function PrivacyPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-3xl px-5 pb-6 pt-12 sm:px-8">
        <Breadcrumbs items={crumbs} />
      </div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <article aria-labelledby="privacy-title" className="mx-auto max-w-3xl px-5 pb-20 pt-6 sm:px-8">
        <h1 id="privacy-title">Privacy Policy</h1>

        <div className="mt-10 space-y-8 text-lg text-charcoal/90">
          <section aria-labelledby="p-collect">
            <h2 id="p-collect" className="text-2xl">What the contact form collects</h2>
            <p className="mt-3">
              The contact form asks for your name, email address and project details. Company, website, location, project stage, budget range and preferred currency are optional. You must tick a box confirming you have read this policy before an enquiry can be sent.
            </p>
          </section>
          <section aria-labelledby="p-why">
            <h2 id="p-why" className="text-2xl">Why it is collected</h2>
            <p className="mt-3">Your details are used only to understand your enquiry and respond to it.</p>
          </section>
          <section aria-labelledby="p-process">
            <h2 id="p-process" className="text-2xl">How enquiries are processed</h2>
            <p className="mt-3">
              Enquiries are sent to a third-party form service that forwards them to the site owner by email. The form service processes the submission on the site owner&apos;s behalf. Email is the primary contact method if the form is unavailable.
            </p>
          </section>
          <section aria-labelledby="p-cookies">
            <h2 id="p-cookies" className="text-2xl">Cookies and analytics</h2>
            <p className="mt-3">
              This site does not currently use analytics or non-essential tracking. If that changes, this policy will be updated and any tracking will respect applicable consent requirements first.
            </p>
          </section>
          <section aria-labelledby="p-rights">
            <h2 id="p-rights" className="text-2xl">Your choices and contact</h2>
            <p className="mt-3">
              You can ask what information I hold about you, ask for it to be corrected or deleted, or withdraw consent.{" "}
              {siteConfig.email ? (
                <>
                  Write to{" "}
                  <a href={`mailto:${siteConfig.email}`} className="text-teal underline">
                    {siteConfig.email}
                  </a>
                  .
                </>
              ) : (
                "Use the contact form to get in touch."
              )}
            </p>
          </section>
          <section aria-labelledby="p-compliance">
            <h2 id="p-compliance" className="text-2xl">Compliance</h2>
            <p className="mt-3">This policy has not been assessed against any specific privacy regulation or certification.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
