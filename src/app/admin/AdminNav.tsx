"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/insights", label: "Insights" },
  { href: "/admin/settings", label: "Site settings" },
];

/** Sidebar links with the current section highlighted in gold, as on the approved back-office boards. */
export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Back office sections" className="flex flex-col gap-1">
      {navItems.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-10 items-center border-l-2 px-3.5 text-sm transition-colors ${
              active ? "border-gold bg-[#2B2116] text-ivory" : "border-transparent text-[#CDBFA6] hover:text-ivory"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
