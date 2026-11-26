import Link from "next/link";
import { Suspense } from "react";
import { NavLinksFallback } from "@/components/navigation/NavLinksFallback";
import { headerCta } from "@/data/navigation";
import { siteConfig } from "@/data/site-config";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-gold/30 bg-ivory">
      <div className="flex h-[76px] items-center justify-between gap-6 px-6 md:h-auto md:px-[110px] md:py-[30px]">
        <Link href="/" className="font-display text-[22px] font-normal text-charcoal md:text-[26px]" aria-label={`${siteConfig.brandName} home`}>
          The Thoughtful PM<span className="text-gold">.</span>
        </Link>
        <div className="flex items-center gap-9">
          {/* Active-link state depends on the current path, so it streams in after the static shell. */}
          <Suspense fallback={<NavLinksFallback />}>
            <DesktopNavigation />
          </Suspense>
          <Link
            href={headerCta.href}
            className="hidden h-11 items-center bg-gold px-6 text-sm font-medium text-ivory transition-colors hover:bg-gold-deep md:inline-flex"
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
