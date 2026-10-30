# 08. Avisos en el panel y correos: prueba a punto de agotarse, liberación, pago fallido, resumen semanal

- **Agente recomendado: Opus 5.5.** Especificación cerrada, patrón de entidad de campos de código ya
  repetido en el repo, y generadores que cuelgan de eventos que ya existen (cierre de sesión,
  `release`, estados del entitlement). El punto delicado es no mandar correos de más (idempotencia
  por periodo) y respetar las preferencias.
- Fase: 21. Alcance: Drupal (`shine/`): módulo nuevo `shine_notify`, campos de preferencias en
  `user` (`config/sync`), `/panel/avisos` y el contador de la cabecera en `shine_panel`.
- Dependencias: 03 (ficha, para los enlaces) y 05 (plan, para los enlaces); en paralelo con 06.

## Prompt

Lee `docs/dashboards.md` §3.3, §4.1 y §10.2, `docs/monetization.md` §4.4 (aviso suave a partir de
`free_regular_sessions - 3`), §5.6 (texto de liberación) y §6.1 y §6.2 (`billing_retry`),
`docs/lovable/INDEX.md` sección 4 (`panel.avisos.tsx`: tipos de aviso, preferencias de correo) y
`docs/lovable/panel/src/routes/panel.avisos.tsx`. En Drupal: `shine_level` (dónde se cierra una
sesión: `SessionEvaluator` y `POST /shine/session/{uuid}/complete`; si no hay evento ni hook, usa
`hook_node_update` sobre `session` cuando `field_completed_at` pasa de vacío a valor),
`shine_account` (`LearnerManager::release`, `hook_user_update` con `field_released_at`,
`hook_mail_alter` que anula `@shine.invalid`), `shine_entitlement` (cambios de `field_status`:
`hook_entitlement_update`), el sistema de correo de core (`hook_mail`, `MailManager`, `php_mail`;
Mailpit en DDEV), `QueueWorker` y `hook_cron`, y la FASE 18 (`preferred_langcode` del titular:
el correo va en su idioma). Trabaja en `shine/`.

Tareas:

1. **Módulo `shine_notify`** (`package: shine`): entidad `notification` (campos de código:
   `holder` = clave `owner`, `kind` (`trial` | `release` | `payment` | `weekly` | `news`), `title`,
   `body` (texto plano con saltos), `link` (ruta interna del panel), `read` (boolean), `dedupe_key`
   (string único: `{kind}:{objetivo}:{periodo}`, índice único), `created`). Acceso: el titular ve y
   marca las suyas; nadie crea ni borra por JSON:API (`hook_jsonapi_notification_filter_access` con
   `AMONG_OWN`, gotcha 16). Servicio `shine_notify.notifier` (`notify(holder, kind, title, body,
   link, dedupe_key)`: crea la notificación si la clave no existe, y encola el correo si la
   preferencia del titular lo permite).
2. **Preferencias** en `user` (`config/sync`, booleanos, solo visibles en el panel y en el admin):
   `field_notify_weekly` (sí), `field_notify_trial` (sí), `field_notify_release` (sí),
   `field_notify_payment` (sí), `field_notify_news` (no). Solo las edita el propio titular (el panel)
   o `administer users`; un token de alumno no (ya no puede escribir el usuario titular).
3. **Generadores**, cada uno con su clave de deduplicación y un test:
   - `trial`: al completarse una sesión regular de un alumno con `covered_by = trial`, si le quedan
     exactamente 3 o 1 sesiones gratis, aviso a **cada adulto con acceso activo** ("A {alumno} le
     quedan 3 sesiones de prueba"; enlace a `/panel/plan`). Clave `trial:{learner}:{restantes}`.
   - `release`: al liberar a un alumno (`field_released_at` fijado), aviso a los adultos que siguen
     con acceso (el `guardian` promovido) con el texto de `docs/monetization.md` §5.6 y enlace a la
     ficha. Clave `release:{learner}:{released_at}`.
   - `payment`: cuando un entitlement pasa a `billing_retry`, aviso al titular (plan personal) o a
     la coordinación de la organización (licencia), con enlace a `/panel/plan`; al volver a `active`,
     aviso "Pago resuelto". Claves `payment:{entitlement}:{estado}:{event_timestamp}`.
   - `weekly`: `hook_cron` que, una vez por semana (lunes, primera ejecución del cron tras las 07:00
     en la zona del sitio; marca en `state`), encola un resumen por titular con sesiones de la
     semana por alumno, cambios de nivel y racha si `shine_stats` está instalado; sin alumnos con
     actividad, no se manda. Clave `weekly:{holder}:{año-semana}`.
   - `news`: formulario de administración `/admin/shine/notify/news` (permiso `administer shine
     accounts`): título, cuerpo en `es` y `ca`, "Enviar a todos los titulares con la preferencia
     activa"; encolado por lotes. Clave `news:{id del envío}`.
4. **Correo**: `hook_mail` con plantillas de texto plano por tipo e idioma (`es`, `ca`; el de
   `news` lleva ambos textos y elige por `preferred_langcode`), cabecera y pie fijos ("Gestiona tus
   avisos en {enlace a /panel/avisos}"), asunto con prefijo "Shine ·". Envío por `QueueWorker`
   (`shine_notify_mail`, en cron) para no retrasar webhooks ni cierres de sesión; reintento simple
   si `MailManager` falla, y registro en watchdog. Dirección de origen: `system.site.mail`. Un
   titular con email `@shine.invalid` o cuenta borrada nunca recibe correo (ya lo corta
   `hook_mail_alter`, pero no lo encoles).
5. **Panel** (`shine_panel`): `/panel/avisos` con la lista del prototipo (tarjeta por aviso con
   icono por tipo, título, cuerpo, fecha, marca "Sin leer"; clic marca como leído y sigue el
   enlace; "Marcar todo como leído"; estado vacío "Todo al día"), la tarjeta "Emails que quieres
   recibir" con los cinco interruptores (formulario sobre los campos de la tarea 2) y la paginación
   a 20. El contador de la cabecera (`shine_panel.notice_counter` de 02) pasa a contar las no
   leídas (servicio sustituido por `shine_notify`), con etiqueta de caché `notification_list:{uid}`.
   La portada (02) toma sus avisos destacados de las notificaciones `trial` y `release` no leídas,
   para no calcular dos veces.
6. **Tests kernel**: cada generador produce una sola notificación por evento aunque el evento se
   repita (webhook duplicado, `complete` idempotente); el correo se encola solo con la preferencia
   activa y sale en el idioma del titular; el resumen semanal no se manda sin actividad; `news` llega
   a los que tienen la preferencia; titular B no ve las notificaciones de A (`/panel/avisos` y
   JSON:API filtrado).
7. **Documentación**: `docs/dashboards.md` §3.3 y §4.1, `docs/api-design.md` (entidad y campos de
   preferencias; nota para la app: Ajustes podría exponer las mismas preferencias con `PATCH` del
   usuario titular), `CLAUDE.md` (módulo, cron, cola, formulario de novedades), `docs/progress.md`.

Verificación:
- Con un titular gratuito y un alumno con 5 regulares completadas: completar la sexta por la API
  (`private/scripts/drive_api.py` o curl) crea el aviso "quedan 3", la campana marca 1, el correo
  aparece en Mailpit en el idioma del titular; repetir el `complete` no duplica.
- Liberar a una alumna compartida desde `/panel/organizacion` (06): la familia recibe el aviso y
  el correo; desactivar "Liberación por el centro" y repetir con otra alumna: aviso en el panel,
  sin correo.
- Fixture de Stripe `invoice.payment_failed` firmado a mano → aviso de pago a la coordinación;
  `invoice.paid` → "Pago resuelto".
- `drush cron` un lunes (fuerza la marca en `state`) encola y envía el resumen semanal solo a los
  titulares con actividad; un segundo `cron` el mismo día no reenvía.
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_notify`
  en verde; `config:status` limpio.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/dashboards.md`, `docs/api-design.md` y `CLAUDE.md`.
