import Link from "next/link";
import { requireToken } from "@/lib/admin";

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const card = "flex flex-col gap-[18px] bg-white p-7";

// Insights are written in Sanity Studio, which is built into the site at /studio.
// Its own sign-in runs when the studio opens, so this page only links to it.
export default async function AdminInsights() {
  await requireToken();
  return (
    <>
      <div>
        <span className={kicker}>Content</span>
        <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">Insights</h1>
      </div>

      <div className={card}>
        <h2 className="font-display text-2xl font-normal">Write and publish insights</h2>
        <p className="max-w-2xl text-[15px] leading-[1.7] text-[#4A4034]">
          Insights are written in Sanity Studio. Open it to sign in to Sanity, then create, edit or publish an article. Published articles appear on the Insights page of the site.
        </p>
        <div>
          <Link href="/studio" className="inline-flex h-11 items-center bg-gold px-6 text-sm font-medium text-ivory hover:bg-gold-deep">
            Open Sanity Studio →
          </Link>
        </div>
      </div>
    </>
  );
}
