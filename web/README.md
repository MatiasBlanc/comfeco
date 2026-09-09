# COMFECO web

Proyecto web oficial de COMFECO. Actualmente sirve la primera fase del sitio: la waitlist. Está desarrollado con React, Vite y Tailwind CSS v4; los correos se guardan en Supabase mediante una Vercel Function.

## Desarrollo

Desde la raíz del repositorio:

```bash
cd web
npm install
npm run dev
```

Para probar también `/api/waitlist`, usa `vercel dev` con estas variables:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Aplica `supabase/migrations/20260301000000_create_waitlist.sql` en el SQL Editor de Supabase antes de publicar.

## Validación

```bash
npm run lint
npm run build
```
