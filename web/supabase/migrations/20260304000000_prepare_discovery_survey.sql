-- Prepara la waitlist para la encuesta de discovery de una etapa posterior.
create extension if not exists pgcrypto;
set local search_path = public, extensions;

alter table public.waitlist
  add column if not exists survey_token text,
  add column if not exists survey_sent_at timestamptz,
  add column if not exists survey_completed_at timestamptz;

-- Los registros existentes también quedan listos para recibir una encuesta.
update public.waitlist
set survey_token = encode(gen_random_bytes(32), 'hex')
where survey_token is null;

alter table public.waitlist
  alter column survey_token set default encode(gen_random_bytes(32), 'hex');

alter table public.waitlist
  alter column survey_token set not null;

create unique index if not exists waitlist_survey_token_idx
  on public.waitlist (survey_token);
