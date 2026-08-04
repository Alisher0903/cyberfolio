create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published');

create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null,
  subtitle text not null default '',
  description text not null default '',
  tech text[] not null default '{}',
  color text not null default '#00FF87',
  accent_color text not null default '#00CC6A',
  category text not null default '',
  year text not null default '',
  live_url text not null default '',
  github_url text not null default '',
  metrics jsonb not null default '[]'::jsonb,
  cover_image_path text,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_details (
  project_id uuid primary key references public.projects(id) on delete cascade,
  challenge text not null default '',
  solution text not null default '',
  impact text not null default '',
  timeline text not null default '',
  team_size text not null default '',
  role text not null default '',
  highlights text[] not null default '{}',
  code_snippet text not null default '',
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  company text not null,
  period text not null default '',
  description text not null default '',
  tags text[] not null default '{}',
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  skills text[] not null default '{}',
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  handle text not null default '',
  href text not null,
  color text not null default '#00FF87',
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 320),
  message text not null check (char_length(message) between 10 and 5000),
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  user_agent text,
  created_at timestamptz not null default now()
);

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.project_details enable row level security;
alter table public.experiences enable row level security;
alter table public.skill_categories enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_messages enable row level security;

create policy "admin can view own membership"
on public.admin_users for select to authenticated
using (user_id = auth.uid());

create policy "public can read site settings"
on public.site_settings for select to anon, authenticated
using (true);

create policy "admins manage site settings"
on public.site_settings for all to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "public reads published projects"
on public.projects for select to anon, authenticated
using (status = 'published' or public.is_portfolio_admin());

create policy "admins manage projects"
on public.projects for all to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "public reads published project details"
on public.project_details for select to anon, authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = project_details.project_id
      and (projects.status = 'published' or public.is_portfolio_admin())
  )
);

create policy "admins manage project details"
on public.project_details for all to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "public reads published experiences"
on public.experiences for select to anon, authenticated
using (status = 'published' or public.is_portfolio_admin());

create policy "admins manage experiences"
on public.experiences for all to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "public reads published skill categories"
on public.skill_categories for select to anon, authenticated
using (status = 'published' or public.is_portfolio_admin());

create policy "admins manage skill categories"
on public.skill_categories for all to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "public reads published social links"
on public.social_links for select to anon, authenticated
using (status = 'published' or public.is_portfolio_admin());

create policy "admins manage social links"
on public.social_links for all to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admins read contact messages"
on public.contact_messages for select to authenticated
using (public.is_portfolio_admin());

create policy "admins update contact messages"
on public.contact_messages for update to authenticated
using (public.is_portfolio_admin())
with check (public.is_portfolio_admin());

create policy "admins delete contact messages"
on public.contact_messages for delete to authenticated
using (public.is_portfolio_admin());

create index projects_status_sort_idx on public.projects(status, sort_order);
create index experiences_status_sort_idx on public.experiences(status, sort_order);
create index skill_categories_status_sort_idx on public.skill_categories(status, sort_order);
create index social_links_status_sort_idx on public.social_links(status, sort_order);
create index contact_messages_status_created_idx on public.contact_messages(status, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio',
  'portfolio',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "public reads portfolio assets"
on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio');

create policy "admins upload portfolio assets"
on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio' and public.is_portfolio_admin());

create policy "admins update portfolio assets"
on storage.objects for update to authenticated
using (bucket_id = 'portfolio' and public.is_portfolio_admin())
with check (bucket_id = 'portfolio' and public.is_portfolio_admin());

create policy "admins delete portfolio assets"
on storage.objects for delete to authenticated
using (bucket_id = 'portfolio' and public.is_portfolio_admin());
