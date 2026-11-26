import type { Metadata } from "next";
import { signOut } from "./actions";
import { currentToken } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Back office",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = Boolean(await currentToken());
  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      <header className="flex items-center justify-between border-b border-gold/40 px-6 py-4">
        <p className="font-display text-lg">Back office</p>
        {signedIn ? (
          <nav className="flex items-center gap-5 text-sm">
            <a href="/admin/projects" className="underline-offset-4 hover:underline">Projects</a>
            <a href="/admin/services" className="underline-offset-4 hover:underline">Services</a>
            <a href="/admin/settings" className="underline-offset-4 hover:underline">Settings</a>
            <form action={signOut}>
              <button type="submit" className="underline-offset-4 hover:underline">Sign out</button>
            </form>
          </nav>
        ) : null}
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
