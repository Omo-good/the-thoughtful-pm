import Link from "next/link";
import { primaryNavigation } from "@/data/navigation";
import { services } from "@/data/services";
import { siteConfig } from "@/data/site-config";
import { CopyrightYear } from "@/components/layout/CopyrightYear";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-gold/40 bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl text-charcoal">{siteConfig.brandName}</p>
          <p className="mt-3 max-w-md text-muted">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer">
          <h2 className="eyebrow">Explore</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-charcoal hover:text-teal">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="eyebrow">Services</h2>
          <ul className="mt-4 flex flex-col gap-2">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href="/services" className="text-charcoal hover:text-teal">
                  {service.shortName}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3">
            {siteConfig.email ? (
              <a href={`mailto:${siteConfig.email}`} className="text-teal hover:underline">
                {siteConfig.email}
              </a>
            ) : null}
            <SocialLinks />
          </div>
        </div>
      </div>
      <div className="border-t border-gold/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © <CopyrightYear /> {siteConfig.professionalName}. All rights reserved.
          </p>
          <Link href="/privacy" className="text-charcoal hover:text-teal">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
