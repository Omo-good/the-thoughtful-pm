import { ButtonLink } from "@/components/ui/ButtonLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function IntroSection() {
  return (
    <section aria-labelledby="intro-heading" className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <SectionHeading as="h2" id="intro-heading" eyebrow="The philosophy" title="What thoughtful Product Management means." />
      <div className="mt-8 space-y-6 text-lg text-charcoal/90">
        <p>
          Products are built by people, for people. I believe good Product Management goes beyond managing backlogs and writing requirements. It involves understanding problems, asking meaningful questions, making informed decisions and helping teams create solutions that matter.
        </p>
        <p>
          Understanding people matters because a product only creates value when it fits how people actually live and work. Clarity and strategic thinking matter because each product decision shapes outcomes long after it is made.
        </p>
      </div>
      <div className="mt-10">
        <ButtonLink href="/about" variant="ghost">
          More About Me →
        </ButtonLink>
      </div>
    </section>
  );
}
