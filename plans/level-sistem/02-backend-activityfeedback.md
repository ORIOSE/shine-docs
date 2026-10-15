# 02. Backend: entidad `activityfeedback`

- **Modelo recomendado: Opus.** Es clonar `sessionfeedback` cambiando dos campos; el patrón
  (access handler, tres hooks, permisos, list builder) ya está en el repo.
- Fase: 15. Alcance: solo Drupal.
- Dependencias: 01a (no estrictamente, pero conviene que `node.session` ya tenga
  `field_session_kind` para probar).

## Prompt

Lee `docs/level-system.md` §3.2 y §4 (apartado `activityfeedback`), el módulo
`shine/public_html/modules/custom/sessionfeedback/` entero (es la plantilla) y los gotchas 13,
14 y 16 de `CLAUDE.md`.

Tareas:

1. Módulo `activityfeedback` calcado de `sessionfeedback`: entidad de contenido sin bundles con
   campos base `uid` (owner), `session` (entity_reference a `node`, bundle `session`),
   `activity` (entity_reference a `node`, cualquier bundle `activity*`), `rating` (list_string
   `easy` | `ok` | `hard`, requerido), `created`, `label` (autogenerada en `preSave` con el
   patrón de `Sessionfeedback`). Interfaz, handler de acceso, list builder y enlace de menú
   en admin como el original.
2. Permisos: `create activityfeedback entities`, `view own activityfeedback entities`,
   `view any activityfeedback entities`, `administer activityfeedback entities`. Asigna
   `create` y `view own` al rol `authenticated` y exporta `user.role.authenticated.yml`.
3. Hooks en `activityfeedback.module`: `hook_activityfeedback_access`,
   `hook_activityfeedback_create_access` y, obligatorio,
   `hook_jsonapi_activityfeedback_filter_access` (gotcha 16). Copia el comentario explicativo
   del original.
4. No implementes aquí ninguna regla de nivel: la entidad solo guarda el dato crudo. Lo
   único que se valida en `preSave` es que `rating` esté en el vocabulario.
5. Habilita el módulo, exporta config y comprueba la idempotencia de `cim`.

Verificación (con un usuario normal por `account_switcher`, nunca solo con el user 1):
- `POST /jsonapi/activityfeedback/activityfeedback` con `label`, `rating`, relaciones `session`
  y `activity` devuelve 201 (recuerda gotcha 13: `label` es obligatorio).
- `GET /jsonapi/activityfeedback/activityfeedback?filter[uid.id]={uuid}` devuelve las propias y
  no las de otro usuario.
- `GET ...?filter[session.id]={uuid-sesion}` también funciona (es el filtro que usará la regla
  de nivel y la app).

Al terminar: marca la fila en `plans/level-sistem/README.md`, añade la entidad a las tablas de
`CLAUDE.md` ("Entidades expuestas", "Permisos JSON:API", "Módulos custom") y actualiza
`docs/progress.md`.
