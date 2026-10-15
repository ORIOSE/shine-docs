# 01a. Backend: campos y vocabularios nuevos

- **Modelo recomendado: Opus.** Especificación cerrada en `docs/level-system.md` §4 y §7; es
  añadir campos siguiendo los patrones del repo y exportar config.
- Fase: 15 (sistema de niveles). Alcance: solo Drupal (`shine/`).
- Dependencias: ninguna.

## Prompt

Lee `docs/level-system.md` (§4 "Modelo de datos" y §7 "Ciclos obligatorios"), `CLAUDE.md`
(secciones "Entorno de desarrollo" y "Gotchas") y `docs/conventions.md`. Trabaja en `shine/`
con `ddev`, creando los campos por UI o con `drush php-eval` y exportando siempre con
`ddev drush cex -y`. No crees módulos nuevos en este subplan: todo son campos, vocabularios y
opciones de lista.

Tareas:

1. **`node.session`**: añade `field_session_kind` (list_string, requerido, valores `regular` |
   `evaluation`, por defecto `regular`), `field_evaluation_scope` (entity_reference a
   `taxonomy_term` del vocabulario `areas`, opcional, single) y `field_evaluation_reason`
   (list_string, opcional: `initial` | `periodic` | `trigger_easy` | `trigger_hard` |
   `evidence`). Añade también `field_evaluation_seq` (integer, opcional): posición de la sesión
   dentro de una evaluación de varias sesiones (1 o 2). El README de esta carpeta explica por
   qué hace falta aunque no esté en el diseño; anótalo en `docs/level-system.md` §4.
   Las sesiones existentes deben quedar con `field_session_kind = regular` (rellena el valor con
   un `php-eval` tras importar).
2. **`sessionfeedback`**: añade el campo base `overall` (list_string: `easy` | `ok` | `hard`,
   opcional) en `Sessionfeedback::baseFieldDefinitions()` con el patrón de los campos
   existentes, y aplica la actualización de esquema (`drush updb` con un
   `hook_update_N` que instale la definición vía `entity.definition_update_manager`). Expón el
   campo en JSON:API (es base field: sale solo) y compruébalo con un GET.
3. **`user`**: añade `field_onboarding_state` (list_string: `evaluating` | `regular`, por
   defecto `evaluating`). Los usuarios existentes deben quedar en `evaluating` (son cuentas de
   prueba; todos pasan por el bloque inicial). Oculta el campo del formulario de registro REST
   si aparece como requerido: no debe romper `POST /user/register`.
4. **Ciclos (§7)**: vocabulario `activity_cycle` con un término "Sílabas". Campos compartidos
   `field_cycle` (entity_reference a `activity_cycle`, opcional) y `field_cycle_weight`
   (integer, opcional) en **todos** los bundles de actividad (`activity`, `activity_blink`,
   `activity_image_position` y cualquier otro `activity_*` que exista; compruébalo en
   `config/sync/node.type.*`). Un solo storage por campo, instancias por bundle.
5. Permisos: el rol `authenticated` debe poder leer `taxonomy_term--activity_cycle` por JSON:API
   (hoy ya lee `areas` con `access content`; verifica que basta).
6. Exporta config y comprueba que `ddev drush cim -y` es idempotente (segunda ejecución sin
   cambios).

Verificación:
- `GET /jsonapi/node/session` muestra los cuatro campos nuevos; `GET /jsonapi/sessionfeedback/sessionfeedback` muestra `overall`.
- `POST /user/register?_format=json` sigue funcionando y el usuario creado tiene `field_onboarding_state = evaluating`.
- Probar los GET con un usuario normal (gotcha 14), no solo con el user 1.
- `ddev drush cim -y` idempotente; `ddev drush watchdog:show --severity=Error` sin errores nuevos.

Al terminar: marca la fila en `plans/level-sistem/README.md`, añade la sección "FASE 15" en
`docs/progress.md` y actualiza la tabla de entidades JSON:API de `CLAUDE.md` si has añadido
tipos expuestos.
