import Link from "next/link";
import { Suspense } from "react";
import { NavLinksFallback } from "@/components/navigation/NavLinksFallback";
import { headerCta } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-gold/30 bg-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-ivory/85">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 sm:px-10">
        <Link href="/" className="font-display text-2xl font-normal text-charcoal" aria-label={`${siteConfig.brandName} home`}>
          The Thoughtful PM<span className="text-gold">.</span>
        </Link>
        <div className="flex items-center gap-6">
          {/* Active-link state depends on the current path, so it streams in after the static shell. */}
          <Suspense fallback={<NavLinksFallback />}>
            <DesktopNavigation />
          </Suspense>
          <Link
            href={headerCta.href}
            className="hidden min-h-11 items-center bg-teal px-5 text-sm font-medium text-paper transition-colors hover:bg-charcoal md:inline-flex"
          >
            {headerCta.label}
          </Link>
          <Suspense fallback={null}>
            <MobileNavigation />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
