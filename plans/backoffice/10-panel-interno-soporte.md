# 10. Panel interno de Shine: rol `support`, titulares, "ver como" con auditoría y log de webhooks

- **Agente recomendado: Fable 5.1.** Impersonación de titulares y acciones de soporte sobre cuentas
  ajenas: cada atajo mal acotado es un acceso indebido. Cerrar con `/security-review`.
- Fase: 21. Alcance: solo Drupal (`shine/`): módulo nuevo `shine_support` (`/admin/shine/*`, Gin),
  un cambio en `shine_entitlement` (log de eventos de webhook) y uno pequeño en `shine_account`
  (`unarchive`). Nada en el tema del panel salvo el banner de impersonación.
- Dependencias: 02 (concha del panel, para el banner, y el módulo `shine_audit`).

## Prompt

Lee `docs/dashboards.md` §9 y §10.2, `plans/backoffice/README.md` (decisión sobre impersonación:
con registro de auditoría y banner, sin aviso al titular en v1), lo que ya existe en `/admin/shine`
(`CLAUDE.md`, "Administración del sistema de niveles y de cuentas y acceso": vistas `shine_levels`,
`shine_level_log`, `shine_sessions`, `shine_learners`, `shine_entitlements`, organizaciones,
catálogo de planes), el módulo `shine_audit` creado en 02 (entidad `audit_log` y servicio
`shine_audit.logger`), los procesadores de webhooks (`RevenueCat\RevenueCatProcessor`,
`Stripe\StripeProcessor`, `WebhookResult`) y `LearnerManager` (`archive`, `grantAccess`,
`withdraw`). Para "ver como", evalúa el módulo contrib `drupal/masquerade` (2.x, compatible con
D11): se usa si cubre el cambio de usuario y la vuelta con seguridad; la auditoría y la restricción
de a quién se puede suplantar son nuestras. Trabaja en `shine/`.

Tareas:

1. **Rol `support`** (`user.role.support.yml`, "Soporte"): `access administration pages`,
   `access toolbar`, `view the administration theme`, `access shine support` (permiso nuevo de
   `shine_support`), `view any userarealevel entities`, `view any userarealevel_log entities`,
   `access site reports` **no** (el log de Drupal expone demasiado). Sin `administer users`, sin
   `administer shine accounts/entitlements/organizations` (esos siguen siendo de administrador): las
   acciones de soporte se hacen por rutas propias que validan cada caso. Documenta la matriz
   permiso → acción en el README del módulo.
2. **Vista "Titulares"** (`views.view.shine_holders`, `/admin/shine/holders`, permiso `access shine
   support`): base usuarios con `field_account_kind = holder`; columnas email, nombre para mostrar,
   alta, último acceso, nº de alumnos activos (campo de Views propio `shine_support_learner_count`),
   plan vigente y estado (campo propio que llama a `EntitlementAccess::holderStatus`),
   organizaciones (campo propio), operaciones ("Ficha"). Filtros: texto en email o nombre, plan,
   estado de cobertura, con alumnos archivados. Exportada a `config/sync` (gotcha 23: `cim` antes de
   `cex`). Enlace en `/admin/shine`.
3. **Ficha de titular** (`/admin/shine/holders/{user}`, controlador): cuenta (email, nombre,
   consentimiento y fecha, idioma, fuente, último acceso, estado), alumnos con acceso (rol, origen,
   activo, archivado, cobertura, sesiones regulares completadas, enlace a `/user/{uid}/levels`),
   entitlements (enlace a la pestaña "Acceso"), organizaciones y rol, últimos 20 eventos de webhook
   del titular (tarea 6), y las acciones de soporte como formularios de confirmación:
   - **Ver como** (tarea 4).
   - **Reenviar correo de restablecimiento de contraseña** (`_user_mail_notify('password_reset')`).
   - **Reactivar un alumno archivado** (`LearnerManager::unarchive()`, creado en 03: borra
     `field_archived_at` si el cupo del `owner` lo permite; si no, 422 explicado).
   - **Añadir un adulto a un alumno** (email del titular, rol `owner` o `guardian`;
     `grantAccess`) y **retirar un acceso** (`withdraw`, con la regla de último `owner`). Con esto se
     resuelve "trasladar alumno entre titulares" sin ningún concepto nuevo: se añade al nuevo y se
     retira al antiguo. Nunca sobre alumnos en plaza de una organización (eso lo hace la
     coordinación).
   Cada acción escribe en `audit_log` (actor, acción, titular, alumno, motivo opcional que pide el
   formulario) y deja mensaje.
4. **Ver como**: ruta `/admin/shine/holders/{user}/ver-como` (confirmación con motivo obligatorio):
   solo titulares (`holder`) activos; nunca administradores ni usuarios con `support`; escribe en
   `audit_log` (`support.masquerade.start`) y cambia de usuario (con `masquerade` si lo adoptas, o
   un servicio propio sobre `account_switcher` + sesión, documentado). Mientras dura: banner
   permanente en la concha del panel (`shine_panel`, componente `notice` en variante de aviso:
   "Estás viendo el panel como {nombre}. Volver a tu cuenta") y en Gin; al volver,
   `support.masquerade.end`. Durante la impersonación quedan **bloqueadas** las acciones
   irreversibles del panel (borrar cuenta, cerrar sesión en todos los dispositivos, cambiar
   contraseña, liberar alumno): `shine_panel.access` las deniega si la sesión está impersonada.
   Caducidad de la impersonación: 30 minutos o al cerrar el navegador.
5. **Vista de auditoría** (`views.view.shine_audit`, `/admin/shine/audit`, `access shine support`):
   entradas de `audit_log` con filtros por actor, acción, titular, organización y fechas. Las
   entradas que escriben 03, 06 y 09 (invitaciones, liberaciones, reasignaciones, exportaciones) se
   ven aquí también.
6. **Log de eventos de webhook** (`shine_entitlement`): entidad `webhook_event` (origen
   `revenuecat` | `stripe`, id del evento, tipo, titular resuelto si lo hay, entitlement si lo hay,
   resultado `applied` | `skipped` | `ignored` | `error`, motivo, cuerpo crudo visible solo con
   `administer shine entitlements`, recibido el). La escriben los dos controladores de webhook para
   **todo** evento recibido (también los 422 de precio desconocido, que hoy no dejan rastro).
   Vista `/admin/shine/webhooks` con filtros y "Reintentar" para los `error` y los 422: vuelve a
   pasar el cuerpo guardado por el procesador (firma ya verificada en su día; la idempotencia por
   entitlement sigue aplicando). `hook_update_N` instala la entidad; retención: `shine-entitlement:
   prune-webhooks --days=90` (drush) y nota en `docs/deploy.md` o CLAUDE.md para el cron.
7. **Embudo** (§9): fuera de alcance mientras no exista `shine_analytics`
   (`plans/entitlement/13`); deja en `/admin/shine` un enlace deshabilitado con esa nota.
8. **Tests kernel**: `support` no puede ver como un administrador ni como otro `support`; la
   impersonación escribe inicio y fin; con sesión impersonada, `POST /shine/account/delete` y el
   borrado desde el panel devuelven 403; reactivar sobre cupo lleno → 422; `webhook_event` se escribe
   en `applied`, `skipped` y `unknown_price`, y el reintento tras añadir el precio aplica.
9. **Documentación**: `docs/dashboards.md` §9 (implementado y qué falta), `docs/api-design.md`
   ("Webhooks": log y reintento), `CLAUDE.md` (módulo `shine_support`, rol, rutas, drush),
   `docs/progress.md`.

Verificación:
- Un usuario con rol `support` (créalo con drush) entra en `/admin/shine/holders`, busca
  `jose@test.com`, abre la ficha, ve como él, navega `/panel` y `/panel/alumnos/{uuid}` con el
  banner, intenta borrar la cuenta (403), vuelve; `/admin/shine/audit` muestra inicio, fin y motivo.
  El mismo usuario no puede ver como el usuario 1 (403) ni entrar en `/admin/config` ni
  `/admin/people` (403).
- Reenviar restablecimiento: el correo llega a Mailpit de DDEV. Reactivar a un alumno archivado de
  `jose@test.com` con cupo libre funciona; con el cupo lleno explica por qué no.
- Con los fixtures de `shine_entitlement/tests/fixtures/{revenuecat,stripe}/` firmados a mano
  (CLAUDE.md), cada envío deja una fila en `/admin/shine/webhooks` con su resultado; un
  `unknown_price` se reintenta con éxito tras añadir el precio al catálogo.
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_support`
  y `.../shine_entitlement` en verde; `config:status` limpio; `/security-review` sin hallazgos
  abiertos.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/dashboards.md`, `docs/api-design.md` y `CLAUDE.md`.
