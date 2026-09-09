# Task — COMFECO Landing Page

Quiero convertir la web actual de COMFECO en una landing pública simple, promocional y rápida.

Antes de modificar código debes leer:

- `docs/product.md`
- `docs/brand.md`
- `docs/content.md`
- `docs/roadmap.md`
- `docs/rules.md`

Estas fuentes tienen prioridad sobre cualquier decisión que tomes.

---

## Objetivo

Construir la V0.5 de COMFECO.

No es la plataforma del evento.

Es una landing pública cuya función es:

1. explicar COMFECO,
2. generar interés,
3. conseguir waitlist,
4. mostrar que el proyecto está activo,
5. abrir contacto con sponsors / partners.

Debe poder entenderse en menos de 10 segundos.

---

# Stack

Mantener el stack existente.

Si el proyecto todavía no está configurado:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase

No añadir dependencias salvo necesidad clara.

---

# Diseño

Usar estrictamente la identidad definida en:

`docs/brand.md`

Usar los assets existentes en:

`public/brand`

Preferencias:

- Barlow Condensed para headings
- Barlow para UI/body
- purple como color dominante
- gold como acento
- gradientes solo en detalles

No crear una estética SaaS genérica.

No inventar logo.

---

# Estructura

La página debe ser corta.

Máximo estas secciones:

## 1. Header

Logo COMFECO.

Links:

- COMFECO
- Waitlist
- Community

CTA:

`Unirme`

No crear navegación compleja.

---

## 2. Hero

Eyebrow:

`Community Fest and Code`

Heading:

`Donde la comunidad tech de LATAM vuelve a encontrarse.`

Texto:

`COMFECO reúne a developers de toda Latinoamérica para aprender, construir y conectar a través de hackathons, workshops, charlas y comunidad.`

CTA principal:

`Quiero estar en COMFECO`

CTA secundario:

`Conocer más`

El principal debe llevar a la waitlist.

---

## 3. Qué es COMFECO

Usar tres conceptos.

### Construir

Hackathons y proyectos.

### Aprender

Charlas, workshops y mentorías.

### Conectar

Developers, comunidades y empresas.

No añadir más de tres cards.

---

## 4. Community

Una pequeña sección que explique que COMFECO está siendo construido con la comunidad.

Texto sugerido:

`No queremos diseñar COMFECO solos.`

`Queremos saber qué debería tener para que realmente quieras participar.`

CTA hacia la waitlist.

---

## 5. Waitlist

Reutilizar el formulario existente.

No reconstruirlo sin necesidad.

Campos:

- nombre
- email
- país
- perfil tech
- intereses
- feedback

Mantener:

- loading
- error
- success
- duplicate email

---

## 6. Sponsors

Sección pequeña.

Heading:

`¿Quieres construir COMFECO con nosotros?`

Texto:

`Estamos comenzando a conversar con empresas, comunidades y organizaciones interesadas en apoyar COMFECO.`

CTA:

`Hablar sobre partnerships`

No crear todavía página separada.

---

## 7. Footer

Minimalista.

Logo.

Community Fest and Code.

Links disponibles:

- GitHub
- Discord
- X

Solo agregar links que realmente existan.

---

# UX

Debe ser:

- mobile first
- rápida
- simple
- clara

No usar:

- sliders
- carousels
- video backgrounds
- particles
- 3D
- scroll effects pesados
- animaciones exageradas

---

# Responsiveness

Validar al menos:

- 375px
- 768px
- 1440px

---

# Performance

Priorizar Lighthouse alto.

Optimizar imágenes.

Evitar Client Components salvo necesidad.

---

# SEO

Title:

`COMFECO — Community Fest and Code`

Description:

`COMFECO reúne a developers de Latinoamérica para aprender, construir y conectar a través de hackathons, workshops, charlas y comunidad.`

Agregar:

- Open Graph
- favicon
- canonical
- metadata básica

---

# Restrictions

No inventar:

- fecha
- lugar
- sponsors
- premios
- speakers
- número de participantes
- tracks

No agregar:

- login
- dashboard
- registro al evento
- teams
- judging
- submissions
- CMS

---

# Definition of Done

La tarea está terminada cuando:

- la landing funciona
- la waitlist sigue funcionando
- mobile está cuidado
- branding COMFECO es consistente
- no existen datos inventados
- `npm run lint` pasa
- `npm run build` pasa
- no se agregaron features fuera de scope
