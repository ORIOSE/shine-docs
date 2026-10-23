# 03. Backend: entidad `entitlement`, catálogo de planes y admin de cortesías

- **Modelo recomendado: Opus.** Especificación cerrada en `docs/monetization.md` §4.1 y §4.3;
  entidad de campos de código calcada de `activityfeedback`, config entity con formulario y list
  builder, y un comando drush. Sin lógica de acceso: esa es de 04.
- Fase: 17, parte 17c. Alcance: solo Drupal (`shine/`), módulo nuevo `shine_entitlement`.
- Dependencias: 01a (el módulo depende de `shine_account`, aunque este subplan solo use el
  usuario titular). Puede ir en paralelo con 01b, 01c y 02.

## Prompt

Lee `docs/monetization.md` §4.1 y §4.3, `plans/entitlement/README.md` ("Decisiones técnicas":
plan `free`, idempotencia), `CLAUDE.md` (gotcha 16) y, como patrones,
`shine/public_html/modules/custom/activityfeedback/` (entidad sin bundles con campos de código,
`preSave`, handler de acceso, `hook_jsonapi_*_filter_access`) y
`shine/public_html/modules/custom/shine_level/` (`SettingsForm`, vistas en `config/sync`, drush
`ShineLevelCommands`). Trabaja en `shine/` con `ddev`.

Tareas:

1. **Módulo `shine_entitlement`** (`package: shine`, depende de `shine_account`, `user`, `options`).
2. **Entidad de contenido `entitlement`** (sin bundles, campos de código, tabla `entitlement`),
   con los campos de §4.1 **salvo `field_organization`** (referencia a `organization`, que no
   existe hasta 10: ese subplan lo añade con `hook_update_N`) y estos añadidos: `field_cancelled_at` (timestamp), `field_event_timestamp`
   (integer grande, milisegundos del último evento aplicado), `field_last_event_id` (string),
   `created`, `changed`, `label` autogenerado en `preSave` ("Familia · app_store · marta@…").
   Listas cerradas como constantes públicas (`PLANS`, `SOURCES`, `STATUSES`) con `preSave` que
   rechace valores fuera de lista (patrón `Activityfeedback::RATINGS`). Reglas de `preSave`:
   `field_expires_at` solo puede ser nulo con `source` `manual` u `organization`;
   `field_max_learners` se calcula del catálogo (`learners_per_seat × quantity`) **si está vacío**
   y se respeta si viene informado (denormalizado a propósito, §4.3). Unicidad de
   (`field_source`, `field_external_id`) con una restricción propia que ignore los nulos.
3. **Acceso**: handler con `view` para `administer shine entitlements` y para el dueño
   (`field_holder == cuenta`, permiso `view own entitlement entities`); `create`/`update`/`delete`
   solo admin. `hook_jsonapi_entitlement_filter_access` (gotcha 16). La app no consulta esta
   entidad (usa `/shine/me`), pero JSON:API la expone igual y no puede filtrar nada ajeno.
4. **Catálogo**: config entity `shine_entitlement_plan` (`shine_entitlement.plan.{id}.yml`) con
   `id`, `label`, `plan`, `learners_per_seat`, `groups_per_seat`, `external_ids` (secuencia de
   cadenas `source:identificador`). Esquema en `config/schema`. `config/install` con cuatro
   entradas: `free` (plan `family`, 1 alumno, sin ids), `family` (3), `professional` (15),
   `school_classroom` (0 alumnos, 1 grupo); los ids de producto y precio de ejemplo del diseño
   como marcadores claros (`stripe:price_REEMPLAZAR_pro_monthly`). Formulario y list builder en
   `/admin/config/shine/plans` (hay un bloque `/admin/config/shine` ya). Validación: un mismo
   `source:id` no puede estar en dos planes.
5. **Servicio `shine_entitlement.plan_catalog`**: `get(id)`, `all()`, `resolveExternal(source,
   external_id): ?Plan` y `maxLearners(plan_id, quantity)`. Excepción tipada cuando el id externo
   no está en el catálogo (07 y 11 la traducen a 422 + watchdog).
6. **Admin de cortesías y licencias manuales**: formulario de la entidad con autocompletado del
   titular, selector de plan del catálogo, cantidad, fechas, `source` limitado a `manual` cuando
   se crea desde el admin, `status` `active` por defecto; lista en `/admin/shine/entitlements`
   (vista exportada con filtros por titular, plan, origen y estado, y enlace desde `/admin/shine`).
   Pestaña "Acceso" en `/user/{uid}/entitlements` para ver los del titular (permiso
   `administer shine entitlements`).
7. **Drush `shine-entitlement:recalc [--plan=ID] [--dry-run]`**: recalcula `field_max_learners`
   desde el catálogo para los entitlements vivos, imprime cuántos cambian.
8. **Tests kernel**: CRUD con `preSave` (label, max_learners desde catálogo, valores inválidos),
   unicidad de external id por source, `resolveExternal` con id desconocido, `recalc` cambia solo
   los que difieren, acceso: el dueño ve el suyo y no el ajeno, filtro JSON:API vacío para un
   usuario normal sin `view own`.
9. Documenta en `docs/api-design.md` (sección "Entitlements", solo la parte de modelo y admin) y
   exporta config.

Verificación:
- Crear una cortesía desde `/admin/shine/entitlements/add` para un usuario normal: aparece en la
  lista y en su pestaña; el propio usuario puede leerla por
  `GET /jsonapi/entitlement/entitlement?filter[field_holder.id]={su uuid}` y no ve la de otro.
- `ddev drush shine-entitlement:recalc --dry-run` no escribe; sin `--dry-run` corrige un
  entitlement al que hayas cambiado a mano `field_max_learners`.
- `ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_entitlement` en
  verde; `ddev drush cim -y` idempotente.

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md`, la
tabla de módulos de `CLAUDE.md` y la tabla de administración ("Administración del sistema de
niveles" gana las rutas nuevas).
