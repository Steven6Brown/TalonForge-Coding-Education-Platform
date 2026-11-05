-- TalonForge initial schema. Run in the Supabase SQL editor (or `supabase db push`).
-- Principles: RLS ON for every table, least privilege, no plaintext secrets.

-- ---------------------------------------------------------------------------
-- 1) Learner progress (one row per user). Mirrors the local-first progress JSON.
-- ---------------------------------------------------------------------------
create table if not exists public.user_progress (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  -- cheap server-side size guard (progress is tiny)
  constraint progress_size check (pg_column_size(data) < 100000)
);
alter table public.user_progress enable row level security;

create policy "own progress: select" on public.user_progress
  for select to authenticated using (user_id = (select auth.uid()));
create policy "own progress: insert" on public.user_progress
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own progress: update" on public.user_progress
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own progress: delete" on public.user_progress
  for delete to authenticated using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- 2) Security audit log. Written by the server (service role); readable by admins.
--    Roles live in auth.users.raw_app_meta_data->>'role' (only the server can edit app_metadata).
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id         bigint generated always as identity primary key,
  user_id    uuid references auth.users (id) on delete set null,
  event      text not null check (char_length(event) <= 64),
  meta       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_log_user_event_idx on public.audit_log (user_id, event, created_at desc);
alter table public.audit_log enable row level security;

create policy "admins read audit log" on public.audit_log
  for select to authenticated
  using ((select auth.jwt()) -> 'app_metadata' ->> 'role' = 'admin');
create policy "users read own audit events" on public.audit_log
  for select to authenticated using (user_id = (select auth.uid()));
-- No insert/update/delete policies: only the service role (which bypasses RLS) can write.

-- ---------------------------------------------------------------------------
-- 3) MFA recovery codes (hashed). No policies at all => clients can never read or write them;
--    only server code using the service role touches this table.
-- ---------------------------------------------------------------------------
create table if not exists public.mfa_recovery_codes (
  id         bigint generated always as identity primary key,
  user_id    uuid not null references auth.users (id) on delete cascade,
  code_hash  text not null,           -- "<salt>:<scrypt hash>", never plaintext
  used_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists mfa_recovery_user_idx on public.mfa_recovery_codes (user_id);
alter table public.mfa_recovery_codes enable row level security;

-- ---------------------------------------------------------------------------
-- 4) Make an admin (run manually, once, for yourself):
--    update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}' where email = 'you@example.com';
-- ---------------------------------------------------------------------------
