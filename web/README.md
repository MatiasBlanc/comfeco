# COMFECO web

Proyecto web oficial de COMFECO. Actualmente sirve la waitlist pública, la encuesta de discovery `/survey` y el tablero interno `/pulse`. Está desarrollado con React, Vite y Tailwind CSS v4; los datos se guardan en Supabase mediante Vercel Functions. El envío de la encuesta se hace a mano con Edge Functions y Resend.

## Desarrollo

Desde la raíz del repositorio:

```bash
cd web
npm install
npm run dev
```

Para probar `/api/waitlist`, `/api/survey` y `/api/pulse`, usa `vercel dev` con estas variables:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PULSE_PASSWORD=change-me
SITE_URL=https://comfeco-website.vercel.app
```

Aplica en orden estas migraciones en el SQL Editor de Supabase antes de publicar:

1. `supabase/migrations/20260301000000_create_waitlist.sql`
2. `supabase/migrations/20260304000000_prepare_discovery_survey.sql`
3. `supabase/migrations/20260305000000_create_survey_responses.sql`

La waitlist pública solo pide email. El `survey_token` se genera al registrarse, pero el correo de discovery no se envía en ese momento.

## Encuesta y Pulse

- `/survey?token=...` valida el token en servidor y no vuelve a pedir el email.
- `/pulse` es privado. La primera versión usa `PULSE_PASSWORD` y una cookie httpOnly. Nunca expone la service role key.

## Envío de discovery

Configura en Supabase estos secrets:

```text
RESEND_API_KEY
RESEND_FROM
SITE_URL
DISCOVERY_SEND_SECRET
```

`RESEND_FROM` debe ser un remitente verificado en Resend, por ejemplo `COMFECO <hola@tu-dominio.com>`.

Despliega las funciones:

```bash
npx supabase functions deploy send-survey-email --project-ref wkvzpzkcrkdhbthgudnv
npx supabase functions deploy send-discovery-batch --project-ref wkvzpzkcrkdhbthgudnv
```

Envío de una persona:

```bash
curl -X POST "$SUPABASE_URL/functions/v1/send-survey-email" \
  -H "Authorization: Bearer $DISCOVERY_SEND_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"waitlist_id":"<uuid>"}'
```

Lote manual, máximo 50 correos:

```bash
curl -X POST "$SUPABASE_URL/functions/v1/send-discovery-batch" \
  -H "Authorization: Bearer $DISCOVERY_SEND_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"limit":20}'
```

Si Resend falla, `survey_sent_at` no se marca. No hay cron ni recordatorios en esta versión.

## Validación

```bash
npm run lint
npm run build
```
