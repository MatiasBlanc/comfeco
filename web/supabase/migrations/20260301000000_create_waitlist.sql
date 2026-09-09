create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) <= 254),
  wants_updates boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_lower_idx
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- La API escribe con la service role; los clientes públicos no acceden a la tabla.
revoke all on table public.waitlist from anon, authenticated;
