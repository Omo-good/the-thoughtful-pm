import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center">
      <section aria-labelledby="not-found-title" className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
        <p className="eyebrow">Error 404</p>
        <h1 id="not-found-title" className="mt-4">
          This page isn&apos;t here.
        </h1>
        <p className="mt-6 text-lg text-muted">The link may be outdated, or the page may have moved. Here are a few places you can go.</p>
        <nav aria-label="Helpful links" className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ButtonLink href="/">Go Home</ButtonLink>
          <ButtonLink href="/work" variant="secondary">
            Explore My Work
          </ButtonLink>
          <Link href="/contact" className="text-teal underline">
            Contact
          </Link>
        </nav>
      </section>
    </main>
  );
}
