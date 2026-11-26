import type { Metadata } from "next";
import { signOut } from "./actions";
import { AdminNav } from "./AdminNav";
import { currentToken } from "@/lib/admin";

// Run the back office in London, next to the Supabase database, to cut round-trip time.
export const preferredRegion = "lhr1";

export const metadata: Metadata = {
  title: "Back office",
  robots: { index: false, follow: false },
};

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
        <p className="mx-2.5 mb-10 font-display text-[24px] leading-tight">
          The Thoughtful PM<span className="text-[#D2B98E]">.</span>
        </p>
        <AdminNav />
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
