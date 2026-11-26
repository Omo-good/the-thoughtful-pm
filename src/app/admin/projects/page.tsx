import Link from "next/link";
import { adminRest, requireToken } from "@/lib/admin";
import { setPublished } from "../actions";

type Row = {
  slug: string;
  name: string;
  tagline: string;
  category: string | null;
  role: string | null;
  platform: string | null;
  status: string;
  published: boolean;
  cover_url: string | null;
};

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const action = "ml-3.5 text-[13px] text-gold underline underline-offset-4";

export default async function AdminProjects({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const token = await requireToken();
  const { saved } = await searchParams;
  const rows =
    (await adminRest<Row[]>(
      token,
      "projects?select=slug,name,tagline,category,role,platform,status,published,cover_url&order=sort_order.asc,name.asc",
    )) ?? [];

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className={kicker}>Portfolio</span>
          <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">Projects</h1>
        </div>
      </div>
      {saved ? <p className="text-sm text-teal">Saved {saved}.</p> : null}

      <div className="overflow-x-auto bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["Project", "My role", "Platform", "Status", "Cover", ""].map((h) => (
                <th key={h} className="bg-[#FAF7F0] px-[18px] py-4 text-left text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-t border-[rgba(28,24,19,0.1)]">
                <td className="px-[18px] py-4 align-middle">
                  <div className="font-medium">{row.name}</div>
                  <div className="text-xs text-[#5C5244]">
                    {[row.category, row.tagline].filter(Boolean).join(" · ")}
                  </div>
                </td>
                <td className="px-[18px] py-4 align-middle">{row.role ?? "—"}</td>
                <td className="px-[18px] py-4 align-middle">{row.platform ?? "—"}</td>
                <td className="px-[18px] py-4 align-middle">
                  <span
                    className={`inline-flex h-6 items-center px-2.5 text-[11px] font-semibold tracking-[0.04em] ${
                      row.published ? "bg-sand text-[#2B2116]" : "bg-panel text-[#5C5244] shadow-[inset_0_0_0_1px_rgba(154,107,47,0.5)]"
                    }`}
                  >
                    {row.published ? "Live" : "Draft"}
                  </span>
                </td>
                <td className="px-[18px] py-4 align-middle text-xs text-[#5C5244]">{row.cover_url ? "Added" : "Cover needed"}</td>
                <td className="px-[18px] py-4 text-right align-middle">
                  <Link href={`/admin/projects/${row.slug}`} className={action}>
                    Edit
                  </Link>
                  <Link href={`/work/${row.slug}`} className={action}>
                    Preview
                  </Link>
                  <form action={setPublished} className="inline">
                    <input type="hidden" name="slug" value={row.slug} />
                    <input type="hidden" name="published" value={row.published ? "false" : "true"} />
                    <button type="submit" className={action}>
                      {row.published ? "Unpublish" : "Publish"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#5C5244]">
        Only projects marked Live appear on the public site. Drafts are never shown to visitors. Each project&apos;s case study uses the fields in its editor.
      </p>
    </>
  );
}
