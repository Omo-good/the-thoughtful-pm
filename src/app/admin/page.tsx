import Link from "next/link";
import { redirect } from "next/navigation";
import { adminRest, currentToken } from "@/lib/admin";

type ProjectRow = { published: boolean; cover_url: string | null };
type ServiceRow = { visible: boolean };

const kicker = "text-[11px] font-medium uppercase tracking-[0.3em] text-gold";
const card = "flex flex-col gap-3 bg-white p-7";

export default async function AdminDashboard() {
  const token = await currentToken();
  if (!token) redirect("/admin/login");

  const projects = (await adminRest<ProjectRow[]>(token, "projects?select=published,cover_url")) ?? [];
  const services = (await adminRest<ServiceRow[]>(token, "services?select=visible")) ?? [];

  const live = projects.filter((p) => p.published).length;
  const drafts = projects.length - live;
  const coversMissing = projects.filter((p) => !p.cover_url).length;
  const servicesOnPage = services.filter((s) => s.visible).length;

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className={kicker}>Back office</span>
          <h1 className="mt-2 font-display text-[44px] font-normal leading-tight">Dashboard</h1>
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
        <p className="text-sm text-[#5C5244]">
          Projects with no cover image yet, and drafts waiting to be published, are listed on the Projects page. Only projects marked Live appear on the public site.
        </p>
      </div>
    </>
  );
}
