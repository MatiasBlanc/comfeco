-- Datos adicionales de la waitlist para conocer a la comunidad.
alter table public.waitlist
  add column if not exists name text check (name is null or char_length(name) <= 120),
  add column if not exists country text check (country is null or char_length(country) <= 80),
  add column if not exists profile text check (profile is null or char_length(profile) <= 60),
  add column if not exists interests text[],
  add column if not exists feedback text check (feedback is null or char_length(feedback) <= 1000);
