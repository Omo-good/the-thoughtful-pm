import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig, absoluteUrl } from "@/data/site-config";
import { getPortraits } from "@/lib/back-office";
import { AboutPhotos } from "./AboutPhotos";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "About Goodness, The Thoughtful PM: a Product Manager and independent consultant on product strategy, discovery, requirements and delivery.",
  path: "/about",
});

const kicker = "text-[11px] font-medium uppercase tracking-[0.34em] text-gold";

const expertise = [
  "Product Strategy",
  "Product Discovery",
  "Requirements Engineering",
  "MVP Definition and Planning",
  "Product Roadmapping",
  "Feature Prioritisation",
  "User Journey Mapping",
  "Stakeholder Management",
  "Product Delivery Coordination",
  "AI-Assisted Product Execution",
];

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.professionalName,
  jobTitle: siteConfig.professionalTitle,
  url: absoluteUrl("/about"),
};

export default async function AboutPage() {
  const { about: portrait, aboutSecond } = await getPortraits();
  return (
    <main id="main" className="flex-1 bg-ivory text-charcoal">
      <JsonLd data={personJsonLd} />

      {/* Portrait with the gold block offset behind it. Replace the placeholder with the approved portrait (at least 1600 × 2000 px). */}
      <section className="grid gap-10 px-6 pt-16 md:mx-[110px] md:mt-[90px] md:grid-cols-[5fr_7fr] md:gap-[90px] md:px-0 md:pt-0">
        <AboutPhotos portrait={portrait} second={aboutSecond} />
        <div className="flex flex-col gap-8">
          <span className={kicker}>About</span>
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.08]">Products are built by people, for people.</h1>
          <p className="text-lg leading-[1.75] text-[#4A4034] md:text-xl">
            Hi, I&apos;m Goodness, a Product Manager who believes building great products starts with asking better questions, understanding people and bringing clarity to complex problems.
          </p>
          <p className="text-lg leading-[1.75] text-[#4A4034] md:text-xl">
            I believe good Product Management goes beyond managing backlogs and writing requirements. It involves understanding problems, asking meaningful questions, making informed decisions and helping teams create solutions that matter.
          </p>
        </div>
      </section>

      <section className="mt-20 px-6 md:mt-[150px] md:px-[110px]">
        <div className="border-t border-[rgba(28,24,19,0.18)] pt-12 md:pt-16">
          <div className="flex flex-col gap-4">
            <span className={kicker}>Expertise</span>
            <h2 className="font-display text-[clamp(2rem,4vw,3.25rem)] font-normal">Where I add the most value</h2>
          </div>
          <ol className="mt-10 grid gap-x-16 md:grid-cols-2">
            {expertise.map((item, index) => (
              <li key={item} className="flex items-baseline gap-6 border-b border-[rgba(28,24,19,0.14)] py-5">
                <span className="w-7 font-display text-base text-gold">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-lg">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-6 mt-20 flex flex-col items-start gap-8 bg-gold px-8 py-16 text-ivory md:mx-[110px] md:mt-[150px] md:flex-row md:items-center md:justify-between md:px-[90px] md:py-[110px]">
        <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-normal leading-[1.05]">Let&apos;s build something meaningful.</h2>
        <Link href="/contact" className="inline-flex h-14 shrink-0 items-center bg-ivory px-10 text-[15px] font-medium text-charcoal hover:bg-sand md:h-[60px]">
          Work With Me
        </Link>
      </section>
    </main>
  );
}
