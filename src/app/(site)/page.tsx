import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";
import { siteConfig } from "@/data/site-config";

export const metadata: Metadata = buildMetadata({
  title: "The Thoughtful PM | Goodness — Product Manager & Consultant",
  description: siteConfig.description,
  path: "/",
});

// Copy from the approved homepage boards. Mobile and desktop wording differ, as on the boards.
const services = [
  {
    n: "01",
    title: "PRD & Requirements Writing",
    mobile: "Turn a product idea into clear requirements.",
    desktop: "Turn a product idea into clear requirements that developers and designers can build from.",
  },
  {
    n: "02",
    title: "MVP Planning",
    mobile: "Decide what the first release should contain.",
    desktop: "Decide what the first release should contain, and what should wait.",
  },
  {
    n: "03",
    title: "Product Discovery",
    mobile: "Find the opportunities worth pursuing.",
    desktop: "Understand the problem you're solving, and find the opportunities worth pursuing.",
  },
];

const kicker = "text-[11px] font-medium uppercase tracking-[0.34em] text-gold";
const link = "text-sm text-gold underline underline-offset-8";

export default function HomePage() {
  return (
    <main id="main" className="flex-1 bg-ivory text-charcoal">
      {/* Hero */}
      <section className="flex flex-col gap-8 px-6 pt-16 md:gap-10 md:px-[110px] md:pt-[110px]">
        <span className={kicker}>
          <span className="md:hidden">Product Strategy · Discovery · Requirements</span>
          <span className="hidden md:inline">Product Management</span>
        </span>
        <h1 className="font-display text-[clamp(2.75rem,8vw,8.25rem)] font-normal leading-[0.98] tracking-[-0.02em]">
          Great products don&apos;t happen by accident.{" "}
          <em className="text-gold">They&apos;re built with intention.</em>
        </h1>
        <div className="grid gap-10 md:mt-5 md:grid-cols-[5fr_4fr] md:items-end md:gap-20">
          <p className="text-lg leading-[1.75] text-[#4A4034] md:text-xl">
            I help founders turn ideas into clearly defined products through thoughtful discovery, strategic planning and development-ready requirements.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row md:justify-end md:gap-6">
            <Link href="/contact" className="inline-flex h-14 items-center justify-center bg-gold px-10 text-[15px] font-medium text-ivory hover:bg-gold-deep md:h-[60px]">
              Work With Me
            </Link>
            <Link href="/work" className="inline-flex h-14 items-center justify-center px-10 text-[15px] shadow-[inset_0_0_0_1px_rgba(212,162,76,0.6)] hover:bg-sand md:h-[60px]">
              Explore My Work
            </Link>
          </div>
        </div>
      </section>

      {/* Portrait placeholder: replace with the approved portrait (at least 1600 × 2000 px). */}
      <section
        aria-label="Portrait"
        className="mx-6 mt-16 flex h-[420px] items-end justify-between bg-[linear-gradient(120deg,#E8D9BE_0%,#DCC9A6_60%,#F8F4EC_100%)] p-8 md:mx-[110px] md:mt-[140px] md:h-[720px] md:p-12"
      >
        <span className="font-display text-xl italic text-[#4A4034] md:text-[26px]">
          Portrait · 1600 × 2000 px minimum
          <span className="mt-1 block font-sans text-xs not-italic md:text-xs">Add your photo, or a studio image at 2400 × 1350 px</span>
        </span>
        <span className="hidden text-[11px] font-medium uppercase tracking-[0.34em] text-charcoal md:block">Discovery · Strategy · Delivery</span>
      </section>

      {/* About */}
      <section className="mx-6 mt-20 grid gap-8 md:mx-[110px] md:mt-40 md:grid-cols-[4fr_8fr] md:gap-[100px]">
        <div className="flex flex-col gap-5 md:gap-[22px]">
          <span className={kicker}>About</span>
          <h2 className="font-display text-[clamp(2.25rem,4.5vw,3.75rem)] font-normal leading-[1.08]">Products are built by people, for people.</h2>
        </div>
        <div className="flex flex-col gap-7 md:gap-9">
          <p className="font-display text-2xl leading-[1.45] md:text-[30px] md:text-charcoal">
            I believe good Product Management goes beyond managing backlogs and writing requirements. It involves understanding problems, asking meaningful questions, making informed decisions and helping teams create solutions that matter.
          </p>
          <Link href="/about" className={`${link} self-start tracking-[0.06em] md:tracking-normal`}>More about me</Link>
        </div>
      </section>

      {/* Services */}
      <section className="mx-6 mt-20 border-t border-sand md:mx-[110px] md:mt-40">
        <div className="flex items-baseline justify-between pb-8 pt-10 md:pb-10 md:pt-12">
          <div className="flex flex-col gap-3">
            <span className={`${kicker} md:hidden`}>Services</span>
            <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-normal">
              <span className="md:hidden">What I can help with</span>
              <span className="hidden md:inline">Services</span>
            </h2>
          </div>
          <Link href="/services" className={`${link} hidden sm:inline`}>All services</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((s) => (
            <div key={s.n} className="flex flex-col gap-3 bg-panel p-8 md:min-h-[300px] md:gap-[18px] md:p-12">
              <span className={kicker}>{s.n}</span>
              <span className="font-display text-[26px] leading-[1.15] md:text-[32px]">{s.title}</span>
              <span className="text-base leading-[1.7] text-[#4A4034] md:text-base">
                <span className="md:hidden">{s.mobile}</span>
                <span className="hidden md:inline">{s.desktop}</span>
              </span>
            </div>
          ))}
        </div>
        <Link href="/services" className={`${link} mt-8 inline-block sm:hidden`}>All services</Link>
      </section>

      {/* Selected work */}
      <section className="mx-6 mt-20 md:mx-[110px] md:mt-40">
        <div className="flex flex-col gap-4 pb-8 sm:flex-row sm:items-end sm:justify-between md:pb-9">
          <div className="flex flex-col gap-4">
            <span className={kicker}>Selected work</span>
            <h2 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] font-normal leading-[1.05]">Products I&apos;ve shaped</h2>
          </div>
          <Link href="/work" className={link}>All work</Link>
        </div>
        <div className="grid gap-7 md:grid-cols-[7fr_5fr] md:gap-7">
          <Link
            href="/work/everwoven"
            className="relative flex min-h-[360px] flex-col justify-end bg-[linear-gradient(160deg,#E8D9BE_0%,#B8935A_100%)] p-8 text-charcoal md:h-[700px] md:p-10"
          >
            <span className="mb-3.5 text-[11px] uppercase tracking-[0.3em] opacity-80">Relationships · Product Lead</span>
            <span className="font-display text-5xl leading-none md:text-[64px]">Everwoven</span>
            <span className="mt-3.5 max-w-[520px] text-[15px] leading-[1.6] opacity-90">A courtship and marriage ecosystem for intentional relationships.</span>
            <span className="mt-5 text-[13px] underline underline-offset-[6px]">Read the case study →</span>
          </Link>
          <div className="grid gap-7">
            <Link
              href="/work/prayfirst"
              className="relative flex min-h-[300px] flex-col justify-end bg-[#2B2116] p-8 text-ivory md:h-[336px] md:p-10"
            >
              <span className="mb-3.5 text-[11px] uppercase tracking-[0.3em] opacity-80">Wellbeing · Product Lead</span>
              <span className="font-display text-[40px] leading-none">PrayFirst</span>
              <span className="mt-3.5 max-w-[520px] text-[15px] leading-[1.6] opacity-90">A prayer habit app that asks for a pause before other apps open.</span>
              <span className="mt-5 text-[13px] underline underline-offset-[6px]">Read the case study →</span>
            </Link>
            <Link
              href="/work/giftwyz"
              className="relative flex min-h-[300px] flex-col justify-end bg-[linear-gradient(160deg,#EFE6D4,#DCC9A6)] p-8 text-charcoal md:h-[336px] md:p-10"
            >
              <span className="mb-3.5 text-[11px] uppercase tracking-[0.3em] opacity-80">Gifting · Product Manager</span>
              <span className="font-display text-[40px] leading-none">Giftwyz</span>
              <span className="mt-3.5 max-w-[520px] text-[15px] leading-[1.6] opacity-90">A digital gifting platform with a vendor portal.</span>
              <span className="mt-5 text-[13px] underline underline-offset-[6px]">Read the case study →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-6 mt-20 flex flex-col items-start gap-10 bg-gold px-8 py-16 text-ivory md:mx-[110px] md:mt-40 md:flex-col md:items-start md:gap-5 md:px-[100px] md:py-28">
        <h2 className="font-display text-[clamp(2.75rem,6vw,4.75rem)] font-normal leading-[1.05]">Have an idea worth building?</h2>
        <p className="hidden max-w-[560px] text-lg leading-[1.6] md:block">Tell me what you&apos;re working on and we can explore whether I can help.</p>
        <Link href="/contact" className="inline-flex h-14 shrink-0 items-center bg-ivory px-10 text-[15px] font-medium text-charcoal hover:bg-sand md:h-16 md:px-11">
          Work With Me
        </Link>
      </section>
    </main>
  );
}
