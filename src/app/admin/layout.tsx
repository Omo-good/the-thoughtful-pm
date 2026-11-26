import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "./actions";
import { currentToken } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Back office",
  robots: { index: false, follow: false },
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/settings", label: "Site settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = Boolean(await currentToken());

  if (!signedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ivory px-6 text-charcoal">
        <div className="w-full max-w-md">{children}</div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen bg-ivory text-charcoal md:grid-cols-[240px_1fr]">
      <aside aria-label="Back office navigation" className="flex flex-col gap-1 bg-charcoal px-5 py-8 text-[#EFE6D4]">
        <p className="mx-2.5 mb-8 font-display text-[22px]">
          The Thoughtful PM<span className="text-[#D2B98E]">.</span>
        </p>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-10 items-center px-3.5 text-sm text-[#CDBFA6] hover:text-ivory"
          >
            {item.label}
          </Link>
        ))}
        <form action={signOut} className="mt-auto">
          <button type="submit" className="flex h-10 w-full items-center px-3.5 text-left text-sm text-[#CDBFA6] hover:text-ivory">
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex flex-col gap-7 px-6 py-10 md:px-14 md:py-11">{children}</main>
    </div>
  );
}
