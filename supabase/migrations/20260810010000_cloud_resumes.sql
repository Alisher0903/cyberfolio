create table public.cloud_resumes (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null unique check (char_length(key_hash) = 64),
  name text not null default '',
  title text not null default '',
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.resume_access_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

alter table public.cloud_resumes enable row level security;
alter table public.resume_access_attempts enable row level security;

create policy "admins read cloud resumes"
on public.cloud_resumes for select to authenticated
using (public.is_portfolio_admin());

create policy "admins delete cloud resumes"
on public.cloud_resumes for delete to authenticated
using (public.is_portfolio_admin());

create index cloud_resumes_updated_idx on public.cloud_resumes(updated_at desc);
create index resume_access_attempts_ip_created_idx
on public.resume_access_attempts(ip_hash, created_at desc);
