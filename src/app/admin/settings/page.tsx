import { adminRest, requireToken } from "@/lib/admin";
import { saveSettings } from "../actions";
import { Dropzone } from "../Dropzone";

type Settings = {
  display_name: string; brand_name: string; email: string | null; linkedin: string | null;
  notification_email: string | null; open_to_projects: boolean; show_insights: boolean;
  default_description: string | null;
  show_prices: boolean;
  portrait_url: string | null; portrait_alt: string | null;
  home_portrait_url: string | null; home_portrait_alt: string | null;
};

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const card = "flex flex-col gap-[18px] bg-white p-7";
const label = "flex flex-col gap-2 text-[13px] font-medium";
const input = "w-full border border-[rgba(28,24,19,0.2)] bg-[#FAF7F0] px-3.5 py-2.5 text-sm font-normal text-charcoal";
const help = "text-xs font-normal text-[#5C5244]";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const token = await requireToken();
  const { saved, error } = await searchParams;
  const rows = await adminRest<Settings[]>(token, "site_settings?id=eq.1&select=*");
  const s = rows?.[0];
  if (!s) return <p className="text-sm text-[#5C5244]">No settings row found. Check the site_settings table in Supabase.</p>;

  return (
    <form action={saveSettings} className="flex flex-col gap-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className={kicker}>Configuration</span>
          <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">Site settings</h1>
          {saved && !error ? <p className="mt-2 text-sm text-teal">Settings saved.</p> : null}
          {error === "upload" ? <p className="mt-2 text-sm text-[#9A3B2B]">Settings saved, but an image did not upload. Try a JPG or PNG under 8 MB.</p> : null}
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
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>Show that I am open to projects</span>
            <span className="relative inline-flex">
              <input type="checkbox" name="open_to_projects" defaultChecked={s.open_to_projects} className="peer sr-only" />
              <span className="bg-[#E8D9BE] px-3 py-1 text-[11px] font-medium text-charcoal peer-checked:hidden">Off</span>
              <span className="hidden bg-gold px-3 py-1 text-[11px] font-medium text-ivory peer-checked:inline">On</span>
            </span>
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>Show the Insights section</span>
            <span className="relative inline-flex">
              <input type="checkbox" name="show_insights" defaultChecked={s.show_insights} className="peer sr-only" />
              <span className="bg-[#E8D9BE] px-3 py-1 text-[11px] font-medium text-charcoal peer-checked:hidden">Off</span>
              <span className="hidden bg-gold px-3 py-1 text-[11px] font-medium text-ivory peer-checked:inline">On</span>
            </span>
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            <span>Show prices on the services pages</span>
            <span className="relative inline-flex">
              <input type="checkbox" name="show_prices" defaultChecked={s.show_prices} className="peer sr-only" />
              <span className="bg-[#E8D9BE] px-3 py-1 text-[11px] font-medium text-charcoal peer-checked:hidden">Off</span>
              <span className="hidden bg-gold px-3 py-1 text-[11px] font-medium text-ivory peer-checked:inline">On</span>
            </span>
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
          <h2 className="font-display text-2xl font-normal">About page portrait</h2>
          <input type="hidden" name="portrait_url_current" value={s.portrait_url ?? ""} />
          <Dropzone src={s.portrait_url} name="portrait_file" empty="Drop a portrait here" />
          <span className={help}>Shows on the About page. Minimum 1600 × 2000 px. {s.portrait_url ? "Uploaded." : "Not uploaded yet."}</span>
          <label className="flex items-center gap-2 text-[13px] font-medium">
            <input type="checkbox" name="clear_portrait" className="h-4 w-4 accent-gold" />
            Remove this portrait
          </label>
          <label className={label}>
            Alt text
            <input name="portrait_alt" defaultValue={s.portrait_alt ?? ""} className={input} />
          </label>
        </div>

        <div className={card}>
          <h2 className="font-display text-2xl font-normal">Homepage portrait</h2>
          <input type="hidden" name="home_portrait_url_current" value={s.home_portrait_url ?? ""} />
          <Dropzone src={s.home_portrait_url} name="home_portrait_file" empty="Drop a portrait here" />
          <span className={help}>Shows in the large image band on the homepage. Minimum 1600 × 2000 px. {s.home_portrait_url ? "Uploaded." : "Not uploaded yet."}</span>
          <label className="flex items-center gap-2 text-[13px] font-medium">
            <input type="checkbox" name="clear_home_portrait" className="h-4 w-4 accent-gold" />
            Remove this portrait
          </label>
          <label className={label}>
            Alt text
            <input name="home_portrait_alt" defaultValue={s.home_portrait_alt ?? ""} className={input} />
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
