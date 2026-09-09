# COMFECO Waitlist

Waitlist de COMFECO con registro de correo en Supabase.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Variables requeridas:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://comfeco.vercel.app
```

Aplica `supabase/migrations/20260301000000_create_waitlist.sql` en el SQL Editor de Supabase antes de publicar.

## Validación

```bash
npm run lint
npm run build
```

## Recursos

Los logos, el favicon, la imagen Open Graph y el banner histórico optimizado están en `public/`.
