import { ButtonLink } from "@/components/ui/ButtonLink";

export function HeroSection() {
  return (
    <section aria-labelledby="hero-heading" className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-16 sm:px-8 md:pt-24 lg:grid-cols-12 lg:items-center">
      <div className="lg:col-span-7">
        <p className="eyebrow">Product Manager · Independent Consultant</p>
        <h1 id="hero-heading" className="mt-6">
          Building products with <em className="text-teal">curiosity, clarity &amp; care.</em>
        </h1>
        <p className="mt-8 max-w-xl text-lg text-charcoal/85">
          Hi, I&apos;m Goodness — a Product Manager who believes building great products starts with asking better questions, understanding people and bringing clarity to complex problems.
        </p>
        <p className="mt-4 max-w-xl text-muted">
          I help founders and businesses turn ideas into clearly defined, user-centred digital products through thoughtful Product Management.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/contact">Work With Me</ButtonLink>
          <ButtonLink href="/work" variant="secondary">
            Explore My Work
          </ButtonLink>
        </div>
      </div>
      {/* No portrait supplied (PRD §6.1): typographic treatment instead of a fabricated image. */}
      <aside aria-label="Brand statement" className="lg:col-span-5">
        <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-lg border border-gold/50 bg-paper p-8 sm:p-10">
          <span className="eyebrow">The Thoughtful PM</span>
          <p className="font-display text-3xl leading-snug text-charcoal sm:text-4xl">
            &ldquo;Products are built by people, for people.&rdquo;
          </p>
          <div className="rule w-16" aria-hidden="true" />
        </div>
      </aside>
    </section>
  );
}
