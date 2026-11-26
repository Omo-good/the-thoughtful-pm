import Link from "next/link";
import { adminRest, requireToken } from "@/lib/admin";
import { setPublished } from "../actions";

type Row = { slug: string; name: string; status: string; published: boolean; updated_at: string };

export default async function AdminProjects({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const token = await requireToken();
  const { saved } = await searchParams;
  const rows =
    (await adminRest<Row[]>(token, "projects?select=slug,name,status,published,updated_at&order=sort_order.asc,name.asc")) ?? [];

  return (
    <section>
      <h1 className="font-display text-3xl">Projects</h1>
      <p className="mt-2 text-sm text-muted">Only published projects appear on the site.</p>
      {saved ? <p className="mt-4 text-sm text-teal">Saved {saved}.</p> : null}
      <ul className="mt-8 divide-y divide-gold/30 border-y border-gold/30">
        {rows.map((row) => (
          <li key={row.slug} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <Link href={`/admin/projects/${row.slug}`} className="font-medium underline-offset-4 hover:underline">{row.name}</Link>
              <p className="text-sm text-muted">{row.status}</p>
            </div>
            <form action={setPublished} className="flex items-center gap-3 text-sm">
              <input type="hidden" name="slug" value={row.slug} />
              <input type="hidden" name="published" value={row.published ? "false" : "true"} />
              <span>{row.published ? "Published" : "Draft"}</span>
              <button type="submit" className="border border-gold px-3 py-1.5 hover:bg-sand">
                {row.published ? "Unpublish" : "Publish"}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </section>
  );
}
