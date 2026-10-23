# 01b. Backend: alumnos, `learner_access`, `/shine/me` y borrado de cuenta

- **Modelo recomendado: Fable.** Decisiones de acceso (qué rol puede hacer qué sobre un alumno
  con varios adultos), creación de usuarios sin credenciales y borrado de cuenta con alumnos
  compartidos. Los errores aquí son incidentes de privacidad, no bugs.
- Fase: 17, parte 17a. Alcance: solo Drupal (`shine/`), módulo `shine_account`.
- Dependencias: 01a.

## Prompt

Lee `docs/monetization.md` (§3.2, §3.3, §5.1, §5.2, §5.4 el párrafo de `GET /shine/me`, §5.6 el
resumen de permisos y §7 el punto de borrado de cuenta), `plans/entitlement/README.md`
("Decisiones técnicas"), `CLAUDE.md` (gotchas 14, 16 y 17) y, como patrones,
`shine/public_html/modules/custom/activityfeedback/` (entidad sin bundles con campos de código,
`preSave`, handler de acceso, `hook_jsonapi_*_filter_access`) y
`shine/public_html/modules/custom/shine_level/src/Controller/SessionGenerateController.php` con
su `shine_level.routing.yml` (nota sobre `_csrf_request_header_token`). Trabaja en `shine/`.

Tareas:

1. **Entidad `learner_access`** (contenido, sin bundles, campos de código, en `shine_account`):
   `field_learner` (user), `field_holder` (user), `field_role` (`owner` | `guardian` | `staff`),
   `field_origin` (`created` | `invite` | `organization`), `status`, `created`, `changed`, `label`
   autogenerado. Restricción de unicidad (alumno, titular). `preSave` valida listas y que
   `field_learner` sea `learner` y `field_holder` sea `holder`. Acceso: `view` para el propio
   titular (`field_holder`) y para `administer shine accounts` (permiso nuevo); nada de
   `create`/`update`/`delete` por JSON:API (solo código). `hook_jsonapi_learner_access_filter_access`
   (gotcha 16).
2. **`LearnerAccessPolicy`** (servicio `shine_account.learner_access_policy`): única fuente de
   verdad de "¿puede este titular hacer X con este alumno?". Métodos `canOperate` (cualquier acceso
   activo), `canEdit`, `canArchive`, `canInvite` (`owner`; 10 añadirá `coordinator`),
   `canWithdraw` (retirar el propio acceso: `guardian` y `staff`; un `owner` no puede dejar al
   alumno sin `owner`). Todo lo demás pregunta aquí; los controladores no reimplementan reglas.
3. **Comprobación de acceso "solo titulares"**: servicio `shine_account.access_check.holder`
   (requisito de ruta `_shine_holder: 'TRUE'`) que permite solo a usuarios autenticados con
   `field_account_kind == holder`. Todas las rutas de este subplan lo usan.
4. **Servicio `shine_account.learner_manager`** (los controladores solo traducen a HTTP):
   `create(holder, display_name, avatar)`, `listFor(holder)` (alumnos con acceso activo, por
   `created` del acceso; archivados aparte), `update`, `archive`, `withdraw(holder, learner)`.
   Crear = usuario con `name` = `learner-{uuid}` (el UUID ya existe en memoria antes de guardar),
   `mail` = `learner+{uuid}@shine.invalid`, contraseña aleatoria de 32 caracteres que no se devuelve
   a nadie, rol `learner`, `field_account_kind = learner`, `field_display_name`, `field_avatar`,
   `field_onboarding_state = evaluating`, activo, más su `learner_access` `owner`/`created`.
   Archivar = `field_archived_at` y **revocar los `oauth2_token` del alumno** (`auth_user_id`,
   `status 0`); no se bloquea ni se borra; los accesos siguen activos para leer su progreso. Un
   alumno archivado no cuenta para el cupo y no se edita ni desarchiva en v1.
5. **Cupo**: servicio `shine_account.learner_quota` con `LearnerQuotaInterface::maxLearners
   (UserInterface $holder): int`, implementación por defecto 1 (plan gratuito). `create()` cuenta
   los alumnos activos de los que el titular es `owner` (en 10 se excluirán los que estén en plaza
   de una organización; deja el punto de extensión claro) y lanza una excepción propia al llegar al
   cupo. 04 sustituye el servicio por el cálculo con entitlement.
6. **Endpoints** (todos con `_shine_holder`, Bearer OAuth, JSON; 01c añade los de invitación):
   ```
   POST   /shine/learners                  {display_name, avatar?}  → 201 {learner}
   GET    /shine/learners                                            → 200 {learners: [...]}
   PATCH  /shine/learners/{uuid}           {display_name?, avatar?}  → 200 {learner}
   POST   /shine/learners/{uuid}/archive                             → 200 {learner}
   DELETE /shine/learners/{uuid}/access                              → 200 (retirar mi acceso)
   ```
   Forma de `learner`: `uuid`, `display_name`, `avatar`, `created`, `archived_at`,
   `onboarding_state`, `role` (del titular que pregunta), `adults` (lista de `{uuid,
   display_name, role}` de los adultos con acceso activo, para que la app etiquete quién operó cada
   sesión). Errores: 422 `learner_limit` con `max`; 422 `validation` (nombre vacío o de más de 60
   caracteres); 404 si el UUID no es un alumno **al que este titular tenga acceso** (nunca 403,
   para no revelar que existe); 403 `role_not_allowed` cuando el acceso existe pero el rol no
   permite la acción; 409 `archived` al editar un archivado; 409 `last_owner` al retirar el acceso
   del único `owner`.
7. **`GET /shine/me`**: `holder` (`uuid`, `display_name`, `email`, `account_kind`,
   `adult_consent_at`) y `learners` (misma forma que arriba, activos y archivados con su marca), e
   invoca `\Drupal::moduleHandler()->alter('shine_me', $me, $holder)` para que 04 añada
   `holder_status` y la cobertura y 10 añada `organizations`. Documenta el hook en
   `shine_account.api.php`. Si cacheas en el servicio, etiqueta con `user:{uid}` del titular y de
   cada alumno y con la etiqueta de lista de `learner_access`.
8. **`POST /shine/account/delete`** `{password}`: verifica la contraseña con `user.auth`; si no
   coincide, 403 `invalid_password`. Si coincide, en una transacción y siguiendo la regla del README
   ("Borrado de cuenta con alumnos compartidos"): por cada acceso activo del titular, si el alumno
   tiene otro adulto activo (01c) o `field_organization` (10; hoy siempre nulo) → desactivar el
   acceso y promover un `guardian` a `owner` si hacía falta; si no → anonimizar al alumno. Después
   anonimizar al titular: `name` → `deleted-{uuid}`, `mail` → `deleted+{uuid}@shine.invalid`,
   `field_display_name` y `field_avatar` vacíos, `field_archived_at` ahora, bloqueo (`status 0`) y
   revocación de todos sus `oauth2_token`. Nunca se borran summaries, logs, sesiones ni niveles.
   Responde 200 `{deleted: true}`; el token con el que se llamó deja de valer.
9. **Administración mínima**: vista `shine_learners` en `/admin/shine/learners` (alumno, adultos
   con rol, creado, archivado) enlazada desde `/admin/shine`, con el permiso `administer shine
   accounts`. Exporta.
10. **Tests kernel** (`tests/src/Kernel/`): alta con los campos esperados, contraseña inutilizable
    y `learner_access` `owner`; cupo 1 (segundo alumno falla); archivar libera cupo y revoca
    tokens; el titular B no ve ni edita al alumno de A (404 y `canOperate` falso); `guardian`
    opera pero no archiva; retirar el acceso del único `owner` falla; borrado de cuenta del único
    adulto anonimiza al alumno y conserva summaries; borrado de cuenta de un `guardian` solo
    desactiva su acceso.
11. Documenta los endpoints en `docs/api-design.md` (sección nueva "Cuentas y alumnos") con
    ejemplos de respuesta y errores. Exporta config.

Verificación:
- Con dos titulares normales A y B (gotcha 14): A crea un alumno (201), el segundo da 422
  `learner_limit`; B hace `GET /shine/learners/{uuid de A}` y recibe 404; B no puede archivarlo;
  `GET /jsonapi/learner_access/learner_access` como B devuelve solo los suyos (`data: []` al
  principio, nunca los de A).
- Un token de alumno (hasta 02 puedes simularlo con `account_switcher` al usuario alumno) recibe
  403 en `/shine/learners`, `/shine/me` y `/shine/account/delete`.
- `GET /shine/me` como A devuelve `holder` y `learners` con `role: owner` y `adults` con un
  elemento; tras `POST /shine/account/delete`, el mismo token recibe 401 o 403 y en la BD no queda
  email ni nombre real.
- `ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_account` en verde;
  `ddev drush cim -y` idempotente; watchdog sin errores nuevos.

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md` y la
lista de endpoints custom de `CLAUDE.md`; corrige en `docs/monetization.md` §10 que el borrado de
cuenta tiene parte de servidor y que `learner_access` nace en 17a.
