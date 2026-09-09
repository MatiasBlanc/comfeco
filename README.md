# COMFECO Website

Waitlist de COMFECO desarrollada con React, Vite y Tailwind CSS v4. El correo se guarda en Supabase mediante una Vercel Function.

## Desarrollo

```bash
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
