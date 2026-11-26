import { notFound } from "next/navigation";
import { adminRest, requireToken } from "@/lib/admin";
import { saveService } from "../../actions";

type Service = {
  slug: string; name: string; short_name: string; target_customer: string; problem: string;
  deliverables: string[] | null; price_ngn: string; price_usd: string; price_unit: string | null;
  duration: string | null; cta_label: string; enquiry_value: string; note: string | null;
  sort_order: number; visible: boolean;
};

const field = "flex flex-col gap-1 text-sm";
const input = "border border-gold/50 bg-paper px-3 py-2";

export default async function EditService({ params }: { params: Promise<{ slug: string }> }) {
  const token = await requireToken();
  const { slug } = await params;
  const rows = await adminRest<Service[]>(token, `services?slug=eq.${encodeURIComponent(slug)}&select=*`);
  const s = rows?.[0];
  if (!s) notFound();

  return (
    <section>
      <h1 className="font-display text-3xl">{s.name}</h1>
      <form action={saveService} className="mt-8 grid gap-5">
        <input type="hidden" name="slug" value={s.slug} />
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={field}>Name<input name="name" defaultValue={s.name} required className={input} /></label>
          <label className={field}>Short name<input name="short_name" defaultValue={s.short_name} required className={input} /></label>
          <label className={field}>Price in naira<input name="price_ngn" defaultValue={s.price_ngn} required className={input} /></label>
          <label className={field}>Price in dollars<input name="price_usd" defaultValue={s.price_usd} required className={input} /></label>
          <label className={field}>Price unit (e.g. per month)<input name="price_unit" defaultValue={s.price_unit ?? ""} className={input} /></label>
          <label className={field}>Duration<input name="duration" defaultValue={s.duration ?? ""} className={input} /></label>
          <label className={field}>Button label<input name="cta_label" defaultValue={s.cta_label} required className={input} /></label>
          <label className={field}>Enquiry value (must match the contact form)<input name="enquiry_value" defaultValue={s.enquiry_value} required className={input} /></label>
          <label className={field}>Sort order<input name="sort_order" type="number" defaultValue={s.sort_order} className={input} /></label>
        </div>
        <label className={field}>Who it is for<textarea name="target_customer" defaultValue={s.target_customer} rows={2} required className={input} /></label>
        <label className={field}>Problem it solves<textarea name="problem" defaultValue={s.problem} rows={2} required className={input} /></label>
        <label className={field}>Deliverables (one per line)<textarea name="deliverables" defaultValue={(s.deliverables ?? []).join("\n")} rows={6} className={input} /></label>
        <label className={field}>Note<textarea name="note" defaultValue={s.note ?? ""} rows={2} className={input} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="visible" defaultChecked={s.visible} /> Visible on the site</label>
        <button type="submit" className="justify-self-start bg-teal px-5 py-2.5 text-paper hover:bg-charcoal">Save service</button>
      </form>
    </section>
  );
}
