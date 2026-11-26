import Link from "next/link";
import { adminRest, requireToken } from "@/lib/admin";

type Row = { slug: string; name: string; short_name: string; price_ngn: string; price_usd: string; price_unit: string | null; visible: boolean };

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const action = "ml-3.5 text-[13px] text-gold underline underline-offset-4";

export default async function AdminServices({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const token = await requireToken();
  const { saved } = await searchParams;
  const rows =
    (await adminRest<Row[]>(token, "services?select=slug,name,short_name,price_ngn,price_usd,price_unit,visible&order=sort_order.asc")) ?? [];

  return (
    <>
      <div>
        <span className={kicker}>Offer</span>
        <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">Services</h1>
      </div>
      {saved ? <p className="text-sm text-teal">Saved {saved}.</p> : null}

      <div className="overflow-x-auto bg-white">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {["Service", "Price", "Visibility", ""].map((h) => (
                <th key={h} className="bg-[#FAF7F0] px-[18px] py-4 text-left text-[11px] font-medium uppercase tracking-[0.22em] text-gold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.slug} className="border-t border-[rgba(28,24,19,0.1)]">
                <td className="px-[18px] py-4 align-middle font-medium">
                  {String(index + 1).padStart(2, "0")} · {row.name}
                </td>
                <td className="px-[18px] py-4 align-middle text-xs text-[#5C5244]">
                  {row.price_ngn} / {row.price_usd}
                  {row.price_unit ? ` ${row.price_unit}` : ""}
                </td>
                <td className="px-[18px] py-4 align-middle">
                  <span
                    className={`inline-flex h-6 items-center px-2.5 text-[11px] font-semibold tracking-[0.04em] ${
                      row.visible ? "bg-sand text-[#2B2116]" : "bg-panel text-[#5C5244] shadow-[inset_0_0_0_1px_rgba(154,107,47,0.5)]"
                    }`}
                  >
                    {row.visible ? "On page" : "Hidden"}
                  </span>
                </td>
                <td className="px-[18px] py-4 text-right align-middle">
                  <Link href={`/admin/services/${row.slug}`} className={action}>
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-[#5C5244]">
        Each service has its own section on the Services page and a &ldquo;Request this service&rdquo; link to the contact form. Hidden services do not appear on the site.
      </p>
    </>
  );
}
