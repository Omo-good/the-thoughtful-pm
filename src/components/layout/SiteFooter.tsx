import Link from "next/link";
import { siteConfig } from "@/data/site-config";
import { CopyrightYear } from "@/components/layout/CopyrightYear";
import { SocialLinks } from "@/components/ui/SocialLinks";

const footerLinks = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-gold/40 bg-paper">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl text-charcoal">{siteConfig.brandName}</p>
          <p className="mt-3 max-w-md text-muted">{siteConfig.tagline}</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
          {footerLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-charcoal hover:text-teal">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          {siteConfig.email ? (
            <a href={`mailto:${siteConfig.email}`} className="text-teal hover:underline">
              {siteConfig.email}
            </a>
          ) : null}
          <SocialLinks />
        </div>
      </div>
      <div className="border-t border-gold/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-muted sm:px-8">
          <p>
            © <CopyrightYear /> {siteConfig.professionalName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
