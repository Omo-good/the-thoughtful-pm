import Link from "next/link";
import { primaryNavigation } from "@/data/navigation";

/** Server-rendered desktop links shown until the client navigation (which needs the current path) streams in. */
export function NavLinksFallback() {
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-8">
        {primaryNavigation.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="py-2 text-[0.95rem] text-charcoal transition-colors hover:text-teal">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
