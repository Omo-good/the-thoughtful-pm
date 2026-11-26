import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How The Thoughtful PM handles information submitted through the contact form, and what cookies or analytics are used.",
  path: "/privacy",
});

const kicker = "text-[11px] font-medium uppercase tracking-[0.34em] text-gold";

const sections: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "p-collect",
    title: "What the contact form collects",
    body: "The contact form asks for your name, email address, company or startup name, what you are building, what kind of help you need and an additional message. Company and what you are building are optional. You must tick a box confirming you have read this policy before an enquiry can be sent.",
  },
  {
    id: "p-why",
    title: "Why it is collected",
    body: "Your details are used only to understand your enquiry and respond to it.",
  },
  {
    id: "p-process",
    title: "How enquiries are processed",
    body: "Enquiries are sent to a third-party form service that forwards them to the site owner by email. The form service processes the submission on the site owner's behalf. Email is the primary contact method if the form is unavailable.",
  },
  {
    id: "p-cookies",
    title: "Cookies and analytics",
    body: "This site does not currently use analytics or non-essential tracking. If that changes, this policy will be updated and any tracking will respect applicable consent requirements first.",
  },
  {
    id: "p-rights",
    title: "Your choices and contact",
    body: (
      <>
        You can ask what information I hold about you, ask for it to be corrected or deleted, or withdraw consent.{" "}
        {siteConfig.email ? (
          <>
            Write to{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-gold underline underline-offset-4">
              {siteConfig.email}
            </a>
            .
          </>
        ) : (
          "Use the contact form to get in touch."
        )}
      </>
    ),
  },
  {
    id: "p-compliance",
    title: "Compliance",
    body: "This policy has not been assessed against any specific privacy regulation or certification.",
  },
];

export default function PrivacyPage() {
  return (
    <main id="main" className="flex-1 bg-ivory text-charcoal">
      <article aria-labelledby="privacy-title" className="px-6 pb-24 pt-16 md:px-[110px] md:pt-[90px]">
        <span className={kicker}>Legal</span>
        <h1 id="privacy-title" className="mt-6 font-display text-[clamp(2.75rem,6vw,5.5rem)] font-normal leading-[1.04]">
          Privacy policy
        </h1>
        <p className="mt-6 text-sm text-[#5C5244]">Last updated: 26 November 2026</p>

        <div className="mt-14 max-w-[760px] border-t border-[rgba(28,24,19,0.18)]">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id} className="border-b border-[rgba(28,24,19,0.14)] py-10">
              <h2 id={section.id} className="font-display text-[28px] font-normal leading-tight">
                {section.title}
              </h2>
              <p className="mt-4 text-[17px] leading-[1.8] text-[#4A4034]">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
