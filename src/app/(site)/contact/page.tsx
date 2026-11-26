import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";
import { ContactPanel, ContactPanelFromUrl } from "@/components/contact/ContactPanel";
import { getServices } from "@/lib/back-office";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Tell Goodness about your product idea, existing product or Product Management needs. Enquiries are reviewed personally.",
  path: "/contact",
});

const kicker = "text-[11px] font-medium uppercase tracking-[0.34em] text-gold";
const link = "text-sm text-gold underline underline-offset-8";

export default async function ContactPage() {
  const services = await getServices();
  return (
    <main id="main" className="flex-1 bg-ivory text-charcoal">
      <section aria-labelledby="contact-title" className="grid gap-14 px-6 pt-16 md:mx-[110px] md:mt-[90px] md:grid-cols-[5fr_7fr] md:gap-[100px] md:px-0 md:pt-0">
        <div className="flex flex-col gap-8">
          <span className={kicker}>Contact</span>
          <h1 id="contact-title" className="font-display text-[clamp(2.75rem,6vw,92px)] font-normal leading-[1.04] tracking-[-0.01em]">
            Let&apos;s talk about your product.
          </h1>
          <p className="text-lg leading-[1.7] text-[#4A4034] md:text-[18px]">
            Tell me what you&apos;re building and where you&apos;re stuck. I&apos;ll reply with the next useful step.
          </p>
          <div className="flex flex-col gap-3.5 border-t border-[rgba(28,24,19,0.18)] pt-7 text-[17px]">
            {siteConfig.email ? (
              <a href={`mailto:${siteConfig.email}`} className={`${link} self-start`}>
                {siteConfig.email}
              </a>
            ) : null}
            <a href="https://www.linkedin.com/in/goodness-omojengbesi-040a61210/" className={`${link} self-start`} rel="noopener noreferrer" target="_blank">
              LinkedIn
            </a>
          </div>
        </div>
        <div className="bg-white p-8 md:p-[60px]">
          {/* The fallback is the same form with no preselection, so the page does not shift when ?service= is read. */}
          <Suspense fallback={<ContactPanel initialService="" fallbackEmail={siteConfig.email} services={services} />}>
            <ContactPanelFromUrl fallbackEmail={siteConfig.email} services={services} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
