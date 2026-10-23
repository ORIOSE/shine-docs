# 14. Verificación de extremo a extremo, cierre de documentación y lista legal

- **Modelo recomendado: Fable.** Hay que recorrer los flujos con criterio de producto y de
  seguridad, encontrar lo que los subplanes no probaron entre sí (dos adultos, centro y familia,
  stores y Stripe sobre el mismo alumno) y dejar la documentación coherente.
- Fase: 17, cierre. Alcance: backend, app y `docs/`.
- Dependencias: todo lo anterior (13 opcional).

## Prompt

Lee `docs/monetization.md` entero, `plans/entitlement/README.md`, `docs/progress.md` (FASE 17)
y `docs/api-design.md`. No implementes nada nuevo salvo correcciones de lo que encuentres roto;
si un fallo es grande, abre un subplan nuevo en esta carpeta y anótalo en el README.

Tareas:

1. **Guion E2E** con cuentas limpias (gotcha 14; `/user/{uid}/levels/reset` para repetir el
   bloque inicial) y registra el resultado en `docs/progress.md`:
   - Familia: registro con consentimiento → primer alumno → bloque inicial → N regulares (N bajado
     en el admin) → 402 con resumen de progreso → cortesía desde el admin → sigue; segundo alumno
     por invitación entre dos titulares; token de alumno de A rechazado para B sin vínculo;
     borrado de cuenta de A con alumno compartido (B sigue) y de B solo (alumno anonimizado).
   - Stores (development build): compra mensual en sandbox iOS y Android → cobertura en segundos;
     cancelar → acceso hasta caducidad → `expired`; reembolso → `revoked`; restaurar compras en
     reinstalación; cambio de mensual a anual (`PRODUCT_CHANGE`).
   - Centro: coordinador, docente y familia como en 10 y 12, con Stripe en modo test (alta,
     subida de cantidad, impago, cancelación) y `release`.
   - Robustez: webhook repetido y desordenado (fixtures con curl), sesión pendiente de 8 días,
     dos dispositivos con el mismo alumno, token de alumno caducado a mitad de actividad.
   - Admin: listas de `/admin/shine/*`, cortesías, `recalc`, `shine-level:generate --dry-run`
     con puerta, `shine-analytics:funnel` si existe 13.
2. **Seguridad**: repasa cada ruta nueva con tres tokens (titular ajeno, alumno, anónimo) y con
   el user 1; confirma `hook_jsonapi_*_filter_access` en todas las entidades nuevas (gotcha 16)
   pidiendo colecciones filtradas como usuario normal; busca secretos en git.
3. **Documentación**: `docs/monetization.md` (todas las decisiones cerradas en esta carpeta
   trasladadas al texto, §10 y §11 al día), `docs/api-design.md` (todos los endpoints nuevos con
   ejemplos, 402, webhooks, billing, sin menciones a Capacitor), `docs/level-system.md` §8,
   `CLAUDE.md` (módulos, endpoints, consumer con `shine_learner`, development builds, secretos,
   gotchas nuevos), `docs/architecture.md` y `docs/structure.md` si listan módulos o rutas,
   `plans/prompts/README.md` (fila que apunta a esta carpeta), `docs/stores.md` y `docs/deploy.md`.
4. **Lista legal y de stores** (§8) para que el usuario la encargue fuera: términos y política de
   privacidad con las métricas y los eventos (13), base jurídica, DPA para centros, textos de
   "Account deletion" y "App Privacy" de Apple, Data safety de Google, categoría y rating. Deja la
   lista en `docs/monetization.md` §8 con lo que ya cumple la app y lo que falta.
5. **Decisiones para después**: 17f modo aula, `weakest_first`, derivación de familia a otra
   familia, refresco bajo demanda de RevenueCat si quedó apagado, prueba de store si cambia la
   decisión. Anótalas en `docs/monetization.md` §11.

Verificación:
- Todos los tests de `shine_account`, `shine_entitlement`, `shine_org`, `shine_level` y
  `shine_content` en verde; `npx tsc --noEmit`, `npm run lint`, `npm test` limpios; `drush cim -y`
  idempotente; watchdog sin errores en todo el guion.
- `docs/progress.md` marca la FASE 17 como completada con fecha y con la lista de lo que queda
  fuera.

Al terminar: marca la fila en `plans/entitlement/README.md` y cierra la sección en
`docs/progress.md`.
