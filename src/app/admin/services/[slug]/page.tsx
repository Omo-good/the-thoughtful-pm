import Link from "next/link";
import { notFound } from "next/navigation";
import { adminRest, requireToken } from "@/lib/admin";
import { saveService } from "../../actions";

type Service = {
  slug: string; name: string; short_name: string; target_customer: string; problem: string;
  deliverables: string[] | null; price_ngn: string; price_usd: string; price_unit: string | null;
  duration: string | null; cta_label: string; enquiry_value: string; note: string | null;
  sort_order: number; visible: boolean;
};

const card = "flex flex-col gap-[18px] bg-white p-7";
const label = "flex flex-col gap-2 text-[13px] font-medium";
const input = "w-full border border-[rgba(28,24,19,0.2)] bg-[#FAF7F0] px-3.5 py-2.5 text-sm font-normal text-charcoal";
const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";

export default async function EditService({ params }: { params: Promise<{ slug: string }> }) {
  const token = await requireToken();
  const { slug } = await params;
  const rows = await adminRest<Service[]>(token, `services?slug=eq.${encodeURIComponent(slug)}&select=*`);
  const s = rows?.[0];
  if (!s) notFound();

  return (
    <form action={saveService} className="flex flex-col gap-7">
      <input type="hidden" name="slug" value={s.slug} />

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/admin/services" className="text-xs text-[#5C5244] underline underline-offset-4">
            ← Services
          </Link>
          <span className={`${kicker} mt-2 block`}>Offer</span>
          <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">{s.name}</h1>
        </div>
        <button type="submit" className="inline-flex h-11 items-center bg-gold px-[22px] text-sm font-medium text-ivory hover:bg-gold-deep">
          Save service
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className={card}>
          <h2 className="font-display text-2xl font-normal">Service</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Name
              <input name="name" defaultValue={s.name} required className={input} />
            </label>
            <label className={label}>
              Short name
              <input name="short_name" defaultValue={s.short_name} required className={input} />
            </label>
          </div>
          <label className={label}>
            Who it is for
            <textarea name="target_customer" defaultValue={s.target_customer} rows={2} required className={input} />
          </label>
          <label className={label}>
            Problem it solves
            <textarea name="problem" defaultValue={s.problem} rows={2} required className={input} />
          </label>
          <label className={label}>
            Deliverables (one per line)
            <textarea name="deliverables" defaultValue={(s.deliverables ?? []).join("\n")} rows={6} className={input} />
          </label>
          <label className={label}>
            Note
            <textarea name="note" defaultValue={s.note ?? ""} rows={2} className={input} />
          </label>
        </div>

        <div className="flex flex-col gap-6">
          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Pricing and enquiry</h2>
            <label className={label}>
              Price in naira
              <input name="price_ngn" defaultValue={s.price_ngn} required className={input} />
            </label>
            <label className={label}>
              Price in dollars
              <input name="price_usd" defaultValue={s.price_usd} required className={input} />
            </label>
            <label className={label}>
              Price unit (e.g. per month)
              <input name="price_unit" defaultValue={s.price_unit ?? ""} className={input} />
            </label>
            <label className={label}>
              Duration
              <input name="duration" defaultValue={s.duration ?? ""} className={input} />
            </label>
            <label className={label}>
              Button label
              <input name="cta_label" defaultValue={s.cta_label} required className={input} />
            </label>
            <label className={label}>
              Enquiry value (must match the contact form)
              <input name="enquiry_value" defaultValue={s.enquiry_value} required className={input} />
            </label>
          </div>

          <div className={card}>
            <h2 className="font-display text-2xl font-normal">Visibility</h2>
            <label className={label}>
              Sort order
              <input name="sort_order" type="number" defaultValue={s.sort_order} className={input} />
            </label>
            <label className="flex items-center justify-between gap-4 text-[13px] font-medium">
              Visible on the site
              <input type="checkbox" name="visible" defaultChecked={s.visible} className="h-4 w-4 accent-gold" />
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
