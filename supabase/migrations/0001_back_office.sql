-- The Thoughtful PM back office: projects, services and site settings.
-- Insights articles stay in Sanity. Draft this file first; apply only after review.

create table if not exists public.projects (
  slug            text primary key,
  name            text not null,
  tagline         text not null check (char_length(tagline) <= 160),
  category        text,
  platform        text,
  role            text,
  status          text not null default 'Concept'
                    check (status in ('Live', 'In progress', 'Concept')),
  featured        boolean not null default false,
  sort_order      integer not null default 0,
  cover_url       text,
  cover_alt       text,
  problem         text,
  users           jsonb not null default '{}'::jsonb,   -- {who, objective, measure}
  my_role         text,
  decisions       jsonb not null default '[]'::jsonb,   -- [{title, why}], max 3 in app
  screens         jsonb not null default '[]'::jsonb,   -- [{url, alt}], max 2 in app
  challenges      text,
  outcome         text,
  seo_description text check (char_length(seo_description) <= 160),
  published       boolean not null default false,
  updated_at      timestamptz not null default now()
);

create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  summary     text not null,
  sort_order  integer not null default 0,
  visible     boolean not null default true,
  updated_at  timestamptz not null default now()
);

create table if not exists public.site_settings (
  id                  integer primary key default 1 check (id = 1),
  display_name        text not null,
  brand_name          text not null,
  email               text,
  linkedin            text,
  notification_email  text,
  open_to_projects    boolean not null default true,
  show_insights       boolean not null default true,
  default_description text,
  updated_at          timestamptz not null default now()
);

-- Public site reads only published or visible rows.
alter table public.projects      enable row level security;
alter table public.services      enable row level security;
alter table public.site_settings enable row level security;

create policy "public reads published projects"
  on public.projects for select using (published = true);

create policy "public reads visible services"
  on public.services for select using (visible = true);

create policy "public reads site settings"
  on public.site_settings for select using (true);

-- No insert, update or delete policies for anonymous users.
-- Writes come from the admin area, which needs its own authenticated role
-- (not designed yet).
