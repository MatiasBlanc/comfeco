# COMFECO — Development Rules

Estas reglas aplican a cualquier persona o agente de IA que trabaje en este repositorio.

---

# 1. Keep it simple

No sobrearquitecturar.

No crear:

- abstracciones innecesarias
- providers sin uso real
- factories
- repositories innecesarios
- sistemas de plugins
- microservicios
- monorepo

si el producto actual no lo necesita.

---

# 2. No construir features futuras

Antes de implementar algo preguntarse:

> ¿Esto es necesario para la versión actual?

Si la respuesta es no, no implementarlo.

---

# 3. Reutilizar componentes

Preferir:

- shadcn/ui
- componentes existentes
- primitives simples

antes que crear sistemas propios.

---

# 4. Componentes pequeños pero no absurdos

No dividir cada sección en 10 archivos.

Crear un componente cuando:

- se reutiliza
- tiene lógica propia
- mejora claramente la legibilidad

No crear un componente para 5 líneas de HTML.

---

# 5. Mobile first

Todas las interfaces deben funcionar correctamente desde móvil.

Después adaptar a desktop.

---

# 6. Accessibility

Siempre usar:

- labels reales
- semantic HTML
- keyboard navigation
- focus visible
- buen contraste

---

# 7. Performance

Evitar:

- imágenes gigantes
- dependencias pesadas
- client components innecesarios
- animaciones costosas

Preferir Server Components.

---

# 8. TypeScript

No usar `any` salvo casos excepcionales.

Preferir tipos explícitos en:

- API
- DB
- forms
- domain objects

---

# 9. Validation

Toda entrada del usuario debe validarse server-side.

La validación del frontend sirve solo para UX.

---

# 10. Secrets

Nunca exponer:

- service role keys
- API secrets
- database passwords
- private tokens

en código cliente.

---

# 11. Supabase

El cliente nunca debe poder leer datos privados de la waitlist.

Toda operación sensible debe pasar por servidor.

---

# 12. Branding

Consultar siempre:

`docs/brand.md`

antes de realizar cambios importantes en UI.

No inventar colores, logos o tipografías sin motivo.

---

# 13. Content

Consultar:

`docs/content.md`

No inventar:

- sponsors
- fechas
- speakers
- cifras
- premios
- tracks

---

# 14. Source of truth

Documentación:

- producto → `docs/product.md`
- branding → `docs/brand.md`
- copy → `docs/content.md`
- roadmap → `docs/roadmap.md`
- reglas → `docs/rules.md`

No duplicar información sin necesidad.

---

# 15. Dependencies

Antes de instalar una dependencia nueva:

1. comprobar si ya existe algo equivalente,
2. comprobar si puede resolverse con código simple,
3. justificar por qué es necesaria.

---

# 16. UI consistency

Todos los:

- buttons
- inputs
- selects
- textareas
- badges
- cards

deben compartir estilos consistentes.

---

# 17. Error states

Toda interacción async debe contemplar:

- loading
- success
- error

Nunca dejar al usuario sin feedback.

---

# 18. Naming

Usar nombres descriptivos.

Bueno:

`waitlist-form.tsx`

Malo:

`form2.tsx`

---

# 19. Commits

Preferir commits pequeños y semánticos.

Ejemplos:

`feat: add waitlist form`

`fix: handle duplicate emails`

`style: improve mobile spacing`

---

# 20. Build

Antes de considerar una tarea terminada:

```bash
npm run lint
npm run build
```

Ambos deben pasar.

---

# 21. No redesign without permission

No realizar un redesign completo si la tarea pide modificar una sección específica.

Mantener consistencia con el diseño existente.

---

# 22. Prefer editing over rewriting

Si una implementación funciona, mejorarla.

No reescribir módulos completos sin una razón técnica clara.

---

# 23. Current priority

La prioridad actual es:

1. waitlist
2. landing pública
3. validación
4. sponsors
5. comunidad

No la plataforma completa del evento.
