create table public.contact_rate_limits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index contact_rate_limits_lookup_idx
on public.contact_rate_limits(ip_hash, created_at desc);

alter table public.contact_rate_limits enable row level security;

-- No client policies: only the server-side service role may access this table.
