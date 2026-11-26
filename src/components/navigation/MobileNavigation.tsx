"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { headerCta, primaryNavigation } from "@/data/navigation";

export function MobileNavigation() {
  const pathname = usePathname();
  const panelId = useId();
  // Store the route the drawer was opened on. Navigating changes the pathname, which closes it without an effect.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const close = () => setOpenedOn(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenedOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpenedOn(open ? null : pathname)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-charcoal hover:text-teal"
      >
        {open ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[77px] z-40 overflow-y-auto bg-ivory px-5 pb-10 pt-6"
      >
        <nav aria-label="Mobile primary">
          <ul className="flex flex-col divide-y divide-gold/40">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="block py-4 font-display text-3xl text-charcoal"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <Link href={headerCta.href} onClick={close} className="mt-8 flex min-h-12 items-center justify-center bg-gold px-6 py-3 font-medium text-ivory hover:bg-gold-deep">
          {headerCta.label}
        </Link>
      </div>
    </div>
  );
}
