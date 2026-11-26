import { adminRest, requireToken } from "@/lib/admin";
import { saveSettings } from "../actions";

type Settings = {
  display_name: string; brand_name: string; email: string | null; linkedin: string | null;
  notification_email: string | null; open_to_projects: boolean; show_insights: boolean;
  default_description: string | null;
  show_prices: boolean;
};

const field = "flex flex-col gap-1 text-sm";
const input = "border border-gold/50 bg-paper px-3 py-2";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const token = await requireToken();
  const { saved } = await searchParams;
  const rows = await adminRest<Settings[]>(token, "site_settings?id=eq.1&select=*");
  const s = rows?.[0];
  if (!s) return <p className="text-muted">No settings row found. Check the site_settings table in Supabase.</p>;

  return (
    <section>
      <h1 className="font-display text-3xl">Site settings</h1>
      {saved ? <p className="mt-4 text-sm text-teal">Settings saved.</p> : null}
      <form action={saveSettings} className="mt-8 grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={field}>Display name<input name="display_name" defaultValue={s.display_name} required className={input} /></label>
          <label className={field}>Brand name<input name="brand_name" defaultValue={s.brand_name} required className={input} /></label>
          <label className={field}>Contact email<input name="email" type="email" defaultValue={s.email ?? ""} className={input} /></label>
          <label className={field}>Notification email<input name="notification_email" type="email" defaultValue={s.notification_email ?? ""} className={input} /></label>
          <label className={`${field} sm:col-span-2`}>LinkedIn URL<input name="linkedin" type="url" defaultValue={s.linkedin ?? ""} className={input} /></label>
        </div>
        <label className={field}>Default description (search results)<textarea name="default_description" defaultValue={s.default_description ?? ""} rows={3} className={input} /></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="open_to_projects" defaultChecked={s.open_to_projects} /> Show that I am open to projects</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="show_prices" defaultChecked={s.show_prices} /> Show prices on the services pages</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="show_insights" defaultChecked={s.show_insights} /> Show the Insights section</label>
        <button type="submit" className="justify-self-start bg-teal px-5 py-2.5 text-paper hover:bg-charcoal">Save settings</button>
      </form>
    </section>
  );
}
