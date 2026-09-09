# COMFECO Waitlist

Landing de **COMFECO — Community Fest and Code** con una presentación breve y una waitlist que solo solicita el correo.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- Componentes shadcn/ui
- Supabase
- Vercel-ready

## Desarrollo local

Requisitos: Node.js 20.9 o superior y un proyecto de Supabase.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Configurar Supabase

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/migrations/20260301000000_create_waitlist.sql` desde el SQL Editor, o enlaza el proyecto con la CLI y ejecuta:

```bash
supabase link --project-ref TU_PROJECT_REF
supabase db push
```

3. Copia la URL del proyecto y la **service role key** en `.env.local`:

```dotenv
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

La tabla tiene RLS habilitado y no concede acceso a los roles públicos. Las altas pasan por `app/api/waitlist/route.ts`; la service role nunca se expone al navegador.

## Variables

Consulta `.env.example`:

- `SUPABASE_URL`: URL privada usada por el route handler.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privada del servidor.
- `NEXT_PUBLIC_SITE_URL`: dominio canónico de producción.

## Analytics

La landing emite estos eventos:

- `waitlist_started`
- `waitlist_submitted`

`lib/analytics.ts` publica `comfeco:analytics` en `window` y, si existe `window.dataLayer`, también inserta el evento allí. Esto permite conectar GTM, Vercel Analytics u otro proveedor sin acoplar el formulario.

## Validaciones

```bash
npm run lint
npm run build
```

## Deploy en Vercel

1. Importa el repositorio en Vercel.
2. Configura las variables de `.env.example` para Production y Preview.
3. Despliega con el preset de Next.js.

No se requiere autenticación, CMS ni procesos adicionales.

## Imagen

La fotografía de fondo es de [Product School](https://unsplash.com/@productschool) y se distribuye bajo la licencia de Unsplash.
