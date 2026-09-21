-- Kai Asher Studio — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) after
-- creating a new project. Safe to re-run: guarded with IF NOT EXISTS /
-- DROP POLICY IF EXISTS where relevant.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------

create table if not exists projects (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  category     text not null check (category in ('wedding','portrait','fashion','events','commercial','travel')),
  description  text not null default '',
  year         int not null,
  location     text not null default '',
  client       text,
  cover_image  text not null,
  featured     boolean not null default false,
  published    boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists projects_category_idx on projects (category);
create index if not exists projects_published_idx on projects (published);
create index if not exists projects_featured_idx on projects (featured);

create table if not exists project_media (
  id            uuid primary key default uuid_generate_v4(),
  project_id    uuid not null references projects (id) on delete cascade,
  type          text not null check (type in ('image','video')),
  media_url     text not null,
  thumbnail_url text,
  alt_text      text not null default '',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists project_media_project_id_idx on project_media (project_id);

create table if not exists services (
  id           uuid primary key default uuid_generate_v4(),
  title        text not null,
  slug         text not null unique,
  description  text not null default '',
  deliverables text[] not null default '{}',
  image        text not null,
  price        text,
  badge        text,
  note         text,
  sort_order   int not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table services add column if not exists sort_order int not null default 0;
alter table services add column if not exists price text;
alter table services add column if not exists badge text;
alter table services add column if not exists note  text;

create table if not exists testimonials (
  id           uuid primary key default uuid_generate_v4(),
  client_name  text not null,
  project_type text not null,
  testimonial  text not null,
  image        text,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists inquiries (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  event_type  text not null,
  event_date  date,
  location    text,
  budget      text,
  service     text,
  message     text,
  status      text not null default 'new' check (status in ('new','contacted','booked','archived')),
  created_at  timestamptz not null default now()
);

create index if not exists inquiries_status_idx on inquiries (status);

-- Videos shown on the Videography page (managed from /admin/dashboard/videos).
create table if not exists reels (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  category    text not null check (category in ('wedding','commercial','short','event','social')),
  year        int not null,
  video_url   text not null,
  showreel    boolean not null default false,
  sort_order  int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- The studio owner's admin account. Rows are created ONLY by the one-time
-- registration page (/admin/register) using the server's service-role key;
-- there is deliberately no insert policy for anyone else.
create table if not exists admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  created_at  timestamptz not null default now()
);

-- True only for a signed-in user listed in `admins`. security definer so it
-- can read `admins` from inside other tables' policies.
create or replace function is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------
-- updated_at trigger for projects
-- ---------------------------------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute procedure set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------

alter table projects enable row level security;
alter table project_media enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table inquiries enable row level security;
alter table reels enable row level security;
alter table admins enable row level security;

-- Public (anon) read access — published content only.
drop policy if exists "Public can read published projects" on projects;
create policy "Public can read published projects" on projects
  for select using (published = true);

drop policy if exists "Public can read media of published projects" on project_media;
create policy "Public can read media of published projects" on project_media
  for select using (
    exists (select 1 from projects p where p.id = project_media.project_id and p.published = true)
  );

drop policy if exists "Public can read published services" on services;
create policy "Public can read published services" on services
  for select using (published = true);

drop policy if exists "Public can read published testimonials" on testimonials;
create policy "Public can read published testimonials" on testimonials
  for select using (published = true);

-- Anyone can submit an inquiry, but only authenticated admins can read them.
drop policy if exists "Anyone can submit an inquiry" on inquiries;
create policy "Anyone can submit an inquiry" on inquiries
  for insert with check (true);

drop policy if exists "Public can read published reels" on reels;
create policy "Public can read published reels" on reels
  for select using (published = true);

-- An account may see only its own row in `admins` (used by the login check).
drop policy if exists "Admins can read own row" on admins;
create policy "Admins can read own row" on admins
  for select using (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- Admin-only access. Being signed in is NOT enough: only the account
-- registered in `admins` can read inquiries or change any content, so even
-- if someone creates another Supabase Auth user they can do nothing.
-- ---------------------------------------------------------------------

-- Remove the older "any authenticated user" policies if this schema was run before.
drop policy if exists "Authenticated users can read inquiries" on inquiries;
drop policy if exists "Authenticated users manage projects" on projects;
drop policy if exists "Authenticated users manage project media" on project_media;
drop policy if exists "Authenticated users manage services" on services;
drop policy if exists "Authenticated users manage testimonials" on testimonials;
drop policy if exists "Authenticated users manage inquiries" on inquiries;
drop policy if exists "Authenticated users delete inquiries" on inquiries;

drop policy if exists "Admin can read inquiries" on inquiries;
create policy "Admin can read inquiries" on inquiries
  for select using (is_admin());

drop policy if exists "Admin manages inquiries" on inquiries;
create policy "Admin manages inquiries" on inquiries
  for update using (is_admin()) with check (is_admin());

drop policy if exists "Admin deletes inquiries" on inquiries;
create policy "Admin deletes inquiries" on inquiries
  for delete using (is_admin());

drop policy if exists "Admin manages projects" on projects;
create policy "Admin manages projects" on projects
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Admin manages project media" on project_media;
create policy "Admin manages project media" on project_media
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Admin manages services" on services;
create policy "Admin manages services" on services
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Admin manages testimonials" on testimonials;
create policy "Admin manages testimonials" on testimonials
  for all using (is_admin()) with check (is_admin());

drop policy if exists "Admin manages reels" on reels;
create policy "Admin manages reels" on reels
  for all using (is_admin()) with check (is_admin());
