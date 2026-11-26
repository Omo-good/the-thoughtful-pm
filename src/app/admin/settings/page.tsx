import { adminRest, requireToken } from "@/lib/admin";
import { saveSettings } from "../actions";

type Settings = {
  display_name: string; brand_name: string; email: string | null; linkedin: string | null;
  notification_email: string | null; open_to_projects: boolean; show_insights: boolean;
  default_description: string | null;
  show_prices: boolean;
};

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const card = "flex flex-col gap-[18px] bg-white p-7";
const label = "flex flex-col gap-2 text-[13px] font-medium";
const input = "w-full border border-[rgba(28,24,19,0.2)] bg-[#FAF7F0] px-3.5 py-2.5 text-sm font-normal text-charcoal";
const toggle = "flex items-center justify-between gap-4 text-[13px] font-medium";
const help = "text-xs font-normal text-[#5C5244]";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const token = await requireToken();
  const { saved } = await searchParams;
  const rows = await adminRest<Settings[]>(token, "site_settings?id=eq.1&select=*");
  const s = rows?.[0];
  if (!s) return <p className="text-sm text-[#5C5244]">No settings row found. Check the site_settings table in Supabase.</p>;

  return (
    <form action={saveSettings} className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className={kicker}>Configuration</span>
          <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">Site settings</h1>
          {saved ? <p className="mt-2 text-sm text-teal">Settings saved.</p> : null}
        </div>
        <button type="submit" className="inline-flex h-11 items-center bg-gold px-[22px] text-sm font-medium text-ivory hover:bg-gold-deep">
          Save settings
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className={card}>
          <h2 className="font-display text-2xl font-normal">Profile</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={label}>
              Display name
              <input name="display_name" defaultValue={s.display_name} required className={input} />
            </label>
            <label className={label}>
              Brand name
              <input name="brand_name" defaultValue={s.brand_name} required className={input} />
            </label>
          </div>
          <label className={label}>
            Public email
            <input name="email" type="email" defaultValue={s.email ?? ""} className={input} />
          </label>
          <label className={label}>
            LinkedIn URL
            <input name="linkedin" type="url" defaultValue={s.linkedin ?? ""} className={input} />
          </label>
        </div>

        <div className={card}>
          <h2 className="font-display text-2xl font-normal">Homepage and Insights</h2>
          <label className={toggle}>
            Show that I am open to projects
            <input type="checkbox" name="open_to_projects" defaultChecked={s.open_to_projects} className="h-4 w-4 accent-gold" />
          </label>
          <label className={toggle}>
            Show the Insights section
            <input type="checkbox" name="show_insights" defaultChecked={s.show_insights} className="h-4 w-4 accent-gold" />
          </label>
          <label className={toggle}>
            Show prices on the services pages
            <input type="checkbox" name="show_prices" defaultChecked={s.show_prices} className="h-4 w-4 accent-gold" />
          </label>
          <span className={help}>The Insights section appears once at least one article is published.</span>
        </div>

        <div className={card}>
          <h2 className="font-display text-2xl font-normal">Enquiry form</h2>
          <span className={help}>Messages go to the notification address below. The delivery key stays on the server and is never shown here.</span>
          <label className={label}>
            Notification email
            <input name="notification_email" type="email" defaultValue={s.notification_email ?? ""} className={input} />
          </label>
        </div>

        <div className={card}>
          <h2 className="font-display text-2xl font-normal">Search and sharing</h2>
          <label className={label}>
            Default description
            <textarea name="default_description" defaultValue={s.default_description ?? ""} rows={3} className={input} />
          </label>
          <span className={help}>Around 150 characters.</span>
        </div>
      </div>
    </form>
  );
}
