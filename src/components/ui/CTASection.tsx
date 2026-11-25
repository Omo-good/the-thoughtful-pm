import { ButtonLink } from "./ButtonLink";

interface CTASectionProps {
  headline: string;
  body?: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  id?: string;
}

export function CTASection({ headline, body, ctaLabel, ctaHref, secondaryLabel, secondaryHref, id }: CTASectionProps) {
  return (
    <section aria-labelledby={id ?? "cta-heading"} className="bg-teal text-paper">
      <div className="mx-auto max-w-4xl px-5 py-20 text-center sm:px-8">
        <h2 id={id ?? "cta-heading"} className="text-paper">
          {headline}
        </h2>
        {body ? <p className="mx-auto mt-5 max-w-2xl text-lg text-paper/90">{body}</p> : null}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href={ctaHref} className="bg-paper text-teal hover:bg-gold hover:text-charcoal">
            {ctaLabel}
          </ButtonLink>
          {secondaryLabel && secondaryHref ? (
            <ButtonLink href={secondaryHref} variant="ghost" className="text-paper hover:underline">
              {secondaryLabel}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}
