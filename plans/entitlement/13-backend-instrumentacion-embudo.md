# 13. Backend: instrumentación mínima del embudo (opcional)

- **Modelo recomendado: Opus.** Un endpoint pequeño, una entidad de eventos y un informe drush
  que cruza datos que ya existen; la lista de eventos está cerrada en el diseño §9.
- Fase: 17, §9. Alcance: Drupal (`shine_analytics`) y dos llamadas en la app.
- Dependencias: 04 (entitlements) y 08 (paywall). Opcional: se puede posponer hasta tener piloto.

## Prompt

Lee `docs/monetization.md` §9, `plans/entitlement/README.md` y los comandos drush de
`shine_level` y `shine_content` como patrón de informe. Decisión recomendada (confírmala con el
usuario): sin proveedor externo en v1; casi todos los eventos de §9 ya están en la base de datos y
solo hace falta registrar los de cliente y un comando que calcule las dos cifras que importan
(retención a 4 semanas y conversión bloque inicial → pago).

Tareas:

1. **Módulo `shine_analytics`** con la entidad `analytics_event` (`name`, `uid` del titular,
   `learner` opcional, `props` JSON, `created`; sin exposición útil en JSON:API: solo `create` para
   titulares y lectura admin, con filtro JSON:API cerrado, gotcha 16) y el endpoint
   `POST /shine/events {name, learner?, props?}` (titular; lista cerrada de nombres:
   `paywall_viewed`, `paywall_dismissed`, `trial_warning_viewed`, `restore_tapped`; 422 fuera de
   lista; flood por titular).
2. **Eventos de servidor** que no requieren escritura nueva (se derivan al informar): registro de
   titular (`user.created` con `holder`), alumno creado (`learner_access` `created`), bloque inicial
   completado (`userarealevel_log` con `reason initial` o `field_onboarding_state = regular`),
   suscripción iniciada, renovada y cancelada (`entitlement` y `field_raw_event`), regular
   completada (`node.session`). Si alguna no se puede derivar con fiabilidad, escribe un
   `analytics_event` desde un hook y documenta cuál.
3. **Drush `shine-analytics:funnel [--since=YYYY-MM-DD] [--until=] [--json]`**: por cohorte
   semanal de registro: titulares, con alumno, con bloque inicial completado, que vieron el paywall,
   que pagaron (entitlement de store o Stripe), y retención a 4 semanas (al menos una regular
   completada entre los días 22 y 28). Tabla legible y JSON.
4. **App**: `src/lib/api/events.ts` con `track(name, props)` best effort (sin bloquear ni mostrar
   errores) llamado desde el paywall (abrir, cerrar, restaurar) y desde la tarjeta de aviso de la
   prueba. Nada más: ni identificadores de dispositivo ni SDKs.
5. **Tests kernel**: nombres fuera de lista 422; informe con una cohorte sintética (dos
   titulares, uno paga y retiene, otro no).
6. **Privacidad**: añade al borrador de política de privacidad (14) qué eventos se guardan y con
   qué fin; sin terceros.

Verificación:
- Abrir el paywall en la app crea un `analytics_event`; `ddev drush shine-analytics:funnel
  --since=2026-10-01` imprime la cohorte con las columnas descritas; `--json` es parseable.
- Tests en verde; `drush cim -y` idempotente.

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md` y
`CLAUDE.md` (módulo y comando).
