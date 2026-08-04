# AlisherDev monorepo

## Applications

- `apps/web` — public Next.js portfolio (`localhost:3000`)
- `apps/admin` — private Next.js CMS (`localhost:3001`)
- `apps/api` — Node.js/Hono serverless API (`localhost:3002`)

## Shared infrastructure

- `packages/shared` — shared content contracts
- `packages/database` — Supabase client factories
- `supabase/migrations` — PostgreSQL schema, RLS, Auth and Storage policies
- `supabase/seed.sql` — current static portfolio content

## Local setup

1. Create one Supabase project.
2. Apply `supabase/migrations/20260730010000_portfolio_cms.sql`.
3. Apply `supabase/seed.sql`.
4. Create the owner in Supabase Auth.
5. Insert the owner's Auth UUID into `public.admin_users`.
6. Copy each app's `.env.example` to `.env.local` and provide the keys.
7. Run `pnpm dev`.

The public website intentionally keeps bundled fallback content. If the free
Supabase project is paused or the API is temporarily unavailable, the existing
portfolio design and core content still render.
