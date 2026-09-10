-- Agregar columna country a survey_responses
alter table public.survey_responses
  add column if not exists country text;

-- Recrear la vista survey_summary para incluir desglose por país
drop view if exists public.survey_summary cascade;

create view public.survey_summary
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
    select jsonb_object_agg(coalesce(country, 'No especificado'), total)
    from (
      select country, count(*)::int as total
      from public.survey_responses
      group by country
    ) countries
  ) as countries,
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

revoke all on public.survey_summary from anon, authenticated;
