import Link from "next/link";
import { redirect } from "next/navigation";
import { adminRest, currentToken } from "@/lib/admin";

type ProjectRow = { published: boolean; cover_url: string | null };
type ServiceRow = { visible: boolean };
type SettingsRow = { display_name: string };

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const card = "flex flex-col gap-3 bg-white p-7";

export default async function AdminDashboard() {
  const token = await currentToken();
  if (!token) redirect("/admin/login");

  const [projects, services, settings] = await Promise.all([
    adminRest<ProjectRow[]>(token, "projects?select=published,cover_url").then((r) => r ?? []),
    adminRest<ServiceRow[]>(token, "services?select=visible").then((r) => r ?? []),
    adminRest<SettingsRow[]>(token, "site_settings?id=eq.1&select=display_name").then((r) => r ?? []),
  ]);
  const firstName = settings[0]?.display_name?.split(" ")[0] || "there";

  // Greeting in Lagos time, matching the owner's working day.
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Africa/Lagos" }).format(new Date()));
  const greeting = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";

  const live = projects.filter((p) => p.published).length;
  const drafts = projects.length - live;
  const coversMissing = projects.filter((p) => !p.cover_url).length;
  const servicesOnPage = services.filter((s) => s.visible).length;

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className={kicker}>Back office</span>
          <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">Good {greeting}, {firstName}</h1>
        </div>
        <Link href="/admin/projects" className="inline-flex h-11 items-center bg-gold px-[22px] text-sm font-medium text-ivory hover:bg-gold-deep">
          Manage projects
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className={card}>
          <span className="font-display text-[44px] leading-none">{live}</span>
          <span className="text-xs text-[#5C5244]">Live projects</span>
        </div>
        <div className={card}>
          <span className="font-display text-[44px] leading-none">{drafts}</span>
          <span className="text-xs text-[#5C5244]">Drafts in progress</span>
        </div>
        <div className={card}>
          <span className="font-display text-[44px] leading-none">{servicesOnPage}</span>
          <span className="text-xs text-[#5C5244]">Services on the page</span>
        </div>
        <div className={card}>
          <span className="font-display text-[44px] leading-none">{coversMissing}</span>
          <span className="text-xs text-[#5C5244]">Project covers missing</span>
        </div>
      </div>

      <div className={card}>
        <h2 className="font-display text-2xl font-normal">Next steps</h2>
        <p className="text-sm text-[#5C5244]">Items that need your attention. Only projects marked Live appear on the public site.</p>
        <ul className="flex flex-col gap-2 pt-2 text-[15px]">
          <li>Project covers missing: {coversMissing}</li>
          <li>Drafts waiting to be published: {drafts}</li>
          <li>Services hidden from the page: {services.length - servicesOnPage}</li>
        </ul>
      </div>
    </>
  );
}
