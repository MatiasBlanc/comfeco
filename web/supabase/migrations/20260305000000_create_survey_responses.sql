-- Respuestas de discovery, una por persona de la waitlist.
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  waitlist_id uuid not null references public.waitlist(id) on delete restrict,
  hackathon_format text not null check (
    hackathon_format in ('online', 'presencial', 'hibrido')
  ),
  challenge_type text not null check (
    challenge_type in (
      'producto',
      'open_source',
      'impacto_social',
      'ai_datos',
      'diseno',
      'abierto'
    )
  ),
  learning_formats text[] not null check (cardinality(learning_formats) between 1 and 8),
  build_learn_balance smallint not null check (build_learn_balance between 1 and 5),
  competitions text[] not null check (cardinality(competitions) between 1 and 8),
  motivations text[] not null check (cardinality(motivations) between 1 and 8),
  year_round_events text[] not null check (cardinality(year_round_events) between 1 and 8),
  feedback text check (feedback is null or char_length(feedback) <= 1000),
  created_at timestamptz not null default now()
);

create unique index if not exists survey_responses_waitlist_id_idx
  on public.survey_responses (waitlist_id);

alter table public.survey_responses enable row level security;

revoke all on table public.survey_responses from anon, authenticated;

-- Resumen operativo de waitlist para /pulse. security_invoker evita fugas
-- si alguien otorga SELECT por error.
create or replace view public.waitlist_summary
with (security_invoker = true) as
select
  count(*)::int as waitlist,
  count(*) filter (
    where created_at >= date_trunc('day', timezone('utc', now()))
  )::int as today,
  count(*) filter (
    where created_at >= timezone('utc', now()) - interval '7 days'
  )::int as last_7_days,
  count(*) filter (where survey_sent_at is not null)::int as survey_sent,
  count(*) filter (where survey_completed_at is not null)::int as survey_completed,
  case
    when count(*) filter (where survey_sent_at is not null) = 0 then 0
    else round(
      (
        100.0 * count(*) filter (where survey_completed_at is not null)
        / count(*) filter (where survey_sent_at is not null)
      )::numeric,
      1
    )
  end as response_rate
from public.waitlist;

-- Agregados de la encuesta, listos para una versión posterior de Pulse.
create or replace view public.survey_summary
with (security_invoker = true) as
select
  count(*)::int as responses,
  round(avg(build_learn_balance)::numeric, 1) as avg_build_learn_balance,
  (
    select jsonb_object_agg(hackathon_format, total)
    from (
      select hackathon_format, count(*)::int as total
      from public.survey_responses
      group by hackathon_format
    ) formats
  ) as hackathon_formats,
  (
    select jsonb_object_agg(challenge_type, total)
    from (
      select challenge_type, count(*)::int as total
      from public.survey_responses
      group by challenge_type
    ) challenges
  ) as challenge_types,
  (
    select jsonb_object_agg(value, total)
    from (
      select unnest(competitions) as value, count(*)::int as total
      from public.survey_responses
      group by value
    ) competition_counts
  ) as competitions,
  (
    select jsonb_object_agg(value, total)
    from (
      select unnest(motivations) as value, count(*)::int as total
      from public.survey_responses
      group by value
    ) motivation_counts
  ) as motivations,
  (
    select jsonb_object_agg(value, total)
    from (
      select unnest(year_round_events) as value, count(*)::int as total
      from public.survey_responses
      group by value
    ) year_round_counts
  ) as year_round_events,
  (
    select coalesce(
      jsonb_agg(
        jsonb_build_object('feedback', feedback, 'created_at', created_at)
        order by created_at desc
      ),
      '[]'::jsonb
    )
    from (
      select feedback, created_at
      from public.survey_responses
      where feedback is not null and char_length(trim(feedback)) > 0
      order by created_at desc
      limit 10
    ) recent
  ) as recent_feedback
from public.survey_responses;

revoke all on public.waitlist_summary from anon, authenticated;
revoke all on public.survey_summary from anon, authenticated;
