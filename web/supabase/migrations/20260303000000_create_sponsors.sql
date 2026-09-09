create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) <= 120),
  email text not null check (char_length(email) <= 254),
  organization text not null check (char_length(organization) <= 160),
  message text not null check (char_length(message) <= 1000),
  created_at timestamptz not null default now()
);

create unique index if not exists sponsors_email_lower_idx
  on public.sponsors (lower(email));

alter table public.sponsors enable row level security;

-- La API escribe con la service role; los clientes públicos no acceden a la tabla.
revoke all on table public.sponsors from anon, authenticated;
