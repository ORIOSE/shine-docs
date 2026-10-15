# 03. Backend: módulo `shine_level`, entidades de nivel y parámetros

- **Modelo recomendado: Fable.** Fija el modelo de datos sobre el que se apoyan las reglas y
  el generador (creación bajo demanda, histórico inmutable, config con esquema). Si aquí se
  modela mal, 04 y 05 lo pagan.
- Fase: 15. Alcance: solo Drupal.
- Dependencias: 01a.

## Prompt

Lee `docs/level-system.md` §1, §4 (apartados `userarealevel` y `userarealevel_log`) y §8, la
memoria de preferencias (estándares Drupal, config exportable) y los gotchas 14 y 16.

Crea el módulo `shine_level` (`shine/public_html/modules/custom/shine_level/`). Este subplan
deja el módulo listo para que 04 añada las reglas y 05 el generador: entidades, repositorio y
configuración. Sin lógica de nivel todavía.

Tareas:

1. **Entidad `userarealevel`** (content entity, sin bundles, con `uid` como owner): campos
   `area` (ref `taxonomy_term`, vocab `areas`), `level` (ref `taxonomy_term`, vocab
   `activity_level`), `probe_level` (ídem), `closed` (boolean), `evidence` (integer con signo),
   `last_evaluated` (timestamp, nullable), `changed`. Restricción de unicidad lógica por
   (`uid`, `area`): impónla en `preSave` (consulta y excepción) y con un índice único en el
   esquema si la API de entidades lo permite sin pelearse con `entity.definition_update_manager`.
   `label` autogenerada ("{usuario} / {área}").
2. **Entidad `userarealevel_log`** (histórico inmutable): `uid`, `area`, `from_level`,
   `to_level`, `reason` (string corto), `session` (ref `node`, opcional), `created`. Sin
   formulario de edición; el access handler deniega `update` y `delete` salvo al admin.
3. **Expón ambas en JSON:API** con permisos `view own ... entities` para `authenticated`
   (lectura solo; la escritura es siempre del servidor). Implementa
   `hook_jsonapi_*_filter_access` para las dos (gotcha 16). Verifica el filtro con un usuario
   normal.
4. **Servicio `shine_level.level_repository`**: `getForUser(AccountInterface): array<area_tid, UserAreaLevel>`
   que devuelve una fila por término del vocabulario `areas`, creando en Level0 (`level` y
   `probe_level` al término cuyo nombre es "Level0"; búscalo por nombre o por peso 0 y deja
   claro cuál en un comentario) las que falten. Método `logChange(UserAreaLevel, from, to, reason, ?session)`
   que escribe el log y actualiza `last_evaluated`. Nada más: las reglas van en 04.
5. **Configuración `shine_level.settings`** con los 13 parámetros de §8 y sus valores por
   defecto, `config/install/shine_level.settings.yml` y `config/schema/shine_level.schema.yml`.
   Formulario de administración en `/admin/config/shine/level` (ConfigFormBase) con un campo
   por parámetro, validaciones mínimas (enteros positivos, `accuracy_floor` entre 0 y 1,
   `area_selection` entre `rotation` y `weakest_first`). Enlace de menú y permiso
   `administer shine level`.
6. **Helper de niveles** (`LevelLadder` o similar): dado un término de `activity_level`,
   devolver el siguiente y el anterior según el peso de los términos, y `hasContent(area, level)`
   que consulta si existe algún nodo `activity*` publicado con `field_main_area = area` y
   `field_activity_level` que contenga `level`. Es el "techo por contenido" de §5.5; el
   generador lo reutilizará.
7. Tests: PHPUnit kernel tests en `shine_level/tests/src/Kernel/` para el repositorio (creación
   bajo demanda, unicidad, log). Si el proyecto no tiene `phpunit.xml` para DDEV, crea uno
   mínimo en `shine/` apuntando a `public_html/core` y documenta el comando
   (`ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_level`).
8. Exporta config; `cim` idempotente.

Verificación:
- Un usuario nuevo consulta `GET /jsonapi/userarealevel/userarealevel?filter[uid.id]={uuid}`
  tras una llamada a `getForUser` y ve 5 filas (una por área) en Level0.
- Los tests kernel pasan.
- El formulario de ajustes guarda y `drush cget shine_level.settings` refleja el cambio.

Al terminar: marca la fila en `plans/level-sistem/README.md`, añade `shine_level` a "Módulos
custom" en `CLAUDE.md` con el comando de tests, y actualiza `docs/progress.md`.
