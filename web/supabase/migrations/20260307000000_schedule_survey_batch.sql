-- Programar el envío de la encuesta de discovery hoy jueves a las 10:00 AM (-03:00) / 13:00 UTC
create extension if not exists pg_cron with schema extensions;
create extension if not exists pg_net with schema extensions;

-- Eliminar job anterior si existe
select cron.unschedule(jobid)
from cron.job
where jobname = 'send-discovery-batch-thursday-10am';

-- Programar el job para las 13:00 UTC (10:00 AM America/Santiago UTC-3) del 10 de septiembre
select
  cron.schedule(
    'send-discovery-batch-thursday-10am',
    '0 13 10 9 *',
    $$
    select
      net.http_post(
        url := 'https://wkvzpzkcrkdhbthgudnv.supabase.co/functions/v1/send-discovery-batch',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer <DISCOVERY_SEND_SECRET>'
        ),
        body := jsonb_build_object('limit', 50)
      ) as request_id;
    $$
  );
