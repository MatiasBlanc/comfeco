create extension if not exists pgcrypto;

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null unique check (char_length(email) <= 254),
  country text,
  profiles text[] not null default '{}',
  interests text[] not null default '{}',
  team_preference text,
  source text,
  wishlist text check (char_length(wishlist) <= 1000),
  wants_updates boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists waitlist_email_lower_idx
  on public.waitlist (lower(email));

alter table public.waitlist enable row level security;

-- La API usa service_role en servidor. Los clientes públicos no leen ni escriben la tabla.
revoke all on table public.waitlist from anon, authenticated;
