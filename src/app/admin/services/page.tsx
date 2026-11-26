import Link from "next/link";
import { adminRest, requireToken } from "@/lib/admin";

type Row = { slug: string; name: string; price_ngn: string; price_usd: string; price_unit: string | null; visible: boolean };

export default async function AdminServices({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const token = await requireToken();
  const { saved } = await searchParams;
  const rows = (await adminRest<Row[]>(token, "services?select=slug,name,price_ngn,price_usd,price_unit,visible&order=sort_order.asc")) ?? [];
  return (
    <section>
      <h1 className="font-display text-3xl">Services</h1>
      <p className="mt-2 text-sm text-muted">Edit prices and wording here. Hidden services do not appear on the site.</p>
      {saved ? <p className="mt-4 text-sm text-teal">Saved {saved}.</p> : null}
      <ul className="mt-8 divide-y divide-gold/30 border-y border-gold/30">
        {rows.map((row) => (
          <li key={row.slug} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <Link href={`/admin/services/${row.slug}`} className="font-medium underline-offset-4 hover:underline">{row.name}</Link>
              <p className="text-sm text-muted">{row.price_ngn} / {row.price_usd}{row.price_unit ? ` ${row.price_unit}` : ""}</p>
            </div>
            <span className="text-sm">{row.visible ? "Visible" : "Hidden"}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
