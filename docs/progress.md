# Progreso de implementación — Shine

> Actualizado en tiempo real. Si el desarrollo se interrumpe, retomar desde el primer ítem sin marcar de la fase en curso.

**Última actualización**: 2026-09-29 (sesión 12 — FASE 14: login y registro in-app, sin navegador; decisión de publicar en stores vía Capacitor)

---

## FASE 0 — Limpieza y prerequisitos
**Estado**: ✅ Completada

- [x] Eliminar `/structure.md` de la raíz (ya no existía)
- [x] Corregir typo `motiviation_message` → `motivation_message` (DB + config YAMLs + preprocess.module)
- [x] Actualizar `.info.yml` de módulos custom (descripción real + `package: shine` + `^10 || ^11`)
- [x] Verificar que `docs/` contiene todos los documentos de referencia
- [x] Eliminado config huérfano `odiseanb5.settings.yml`

---

## FASE 1 — Upgrade Drupal 10 → 11
**Estado**: ✅ Completada

- [x] Verificar módulos incompatibles con D11 (eliminados ~80 módulos no usados)
- [x] Actualizar `composer.json` a `^11` (+ quitar parches D8/D9/D10, actualizar constraints)
- [x] Ejecutar `composer update` (Drupal 11.3.5 instalado)
- [x] Ejecutar `drush updb` (40+ updates aplicados, sin pendientes)
- [x] Verificar estado del sitio post-upgrade (Drupal 11.3.5 activo, bootstrap exitoso)

---

## FASE 2 — Habilitar JSON:API + Auth
**Estado**: ✅ Completada

- [x] Habilitar módulo `jsonapi` (ya estaba habilitado en D11)
- [x] Instalar `drupal/simple_oauth` v6.1.0 (D11 compatible) + `drupal/consumers`
- [x] Configurar CORS en `services.yml` (allowedOrigins: *, métodos GET/POST/PATCH/DELETE/OPTIONS)
- [x] Crear Consumer OAuth2 "Shine Expo App" (client_id: shine_expo_app, UUID: 5393c7d5-0f7b-4482-a770-0e5ce00639c2)
- [x] Configurar permisos JSON:API (create/view activitylog, activitysummary, activity_message para authenticated)
- [x] Exportar config (`drush cex`)

---

## FASE 3 — Refactorizar endpoint de registro
**Estado**: ✅ Completada

- [x] Verificar viabilidad de escritura directa a JSON:API (viable — activitylog/activitysummary expuestos)
- [x] Actualizar permisos para escritura de activitylog/activitysummary (create/view own para `authenticated`)
- [x] Documentar nuevo flujo en api-design.md (OAuth2 Authorization Code + PKCE, simple_oauth v6)
- [x] Mantener endpoint legacy hasta migración frontend (sigue activo en `/activitylog-register/add`)

---

## FASE 4 — Proyecto Expo (estructura base)
**Estado**: ✅ Completada

- [x] Crear proyecto Expo con TypeScript (Expo SDK 55, React Native 0.83, Node >=20)
- [x] Instalar dependencias: expo-router, expo-auth-session, expo-web-browser, expo-secure-store, expo-crypto, zustand
- [x] Configurar `app.json` (scheme: "shine") y `tsconfig.json` (path alias @/*)
- [x] Crear estructura de directorios: src/types, src/lib/api, src/store, src/hooks, src/components
- [x] Tipos TypeScript: jsonapi.ts, activity.ts, session.ts, activitylog.ts, activitysummary.ts
- [x] Cliente API (`src/lib/api/client.ts`): fetch autorizado + refresh automático de token
- [x] Módulos API: activities.ts, sessions.ts, tracking.ts
- [x] Stores Zustand: auth.ts (isAuthenticated, login, logout, initialize), session.ts
- [x] Expo Router: _layout.tsx (root con guard de auth), (auth)/_layout.tsx, login.tsx, dashboard.tsx
- [x] Flujo OAuth2 Authorization Code + PKCE implementado en login.tsx (expo-auth-session)

---

## FASE 5 — Activity Player
**Estado**: ✅ Completada

- [x] `ActivityBase` — intro + playing + completed con animación fade
- [x] `VerticalTextPlayer` — maneja formatos `blink` (auto-avance) y `vertical_list` (tap)
- [x] `ActivityRouter` — selecciona el player según `field_activity_format`
- [x] Tracking: crea logs individuales (activitylog) + resumen (activitysummary) via JSON:API
- [x] Mensaje de motivación aleatorio al finalizar
- [x] Pantalla de sesión `app/(auth)/session/[id].tsx` con lista de actividades y estado completado
- [x] Dashboard enlaza a sesión (tap en tarjeta → `/session/[id]`)
- [ ] `ImagePositionPlayer` (pospuesto, sin bundle activitylog específico aún)

---

## FASE 6 — Estadísticas y gráficas
**Estado**: ✅ Completada (pendiente instalar victory-native)

- [x] `ActivityEvolutionChart` (gráfica de líneas — victory-native)
- [x] `StandardComparison` (gráfica de barras vs tiempo estándar)
- [x] `SessionProgressBar` (barra de progreso accesible)
- [x] `SessionComparisonTable` (tabla de sesiones con agrupación en cliente)
- [x] `StatsDataTable` (tabla accesible bajo cada gráfica — WCAG)
- [x] `statistics/index.tsx` — pantalla con resumen + historial por sesión
- [x] Enlace "Estadísticas" en dashboard
- [x] `src/lib/api/statistics.ts` — queries JSON:API + helpers
- [ ] Instalar: `npx expo install victory-native react-native-svg`
- [ ] Añadir `field_standard_time` a `node.activity` en Drupal (para comparativa)

---

## FASE 7 — Soporte de audio y micrófono
**Estado**: ✅ Completada (pendiente instalar expo-av)

- [x] Permisos de micrófono en `app.json` (iOS infoPlist + plugin expo-av)
- [x] `AudioReadingPlayer` — muestra texto, mide tiempo, graba audio (fallback si falla)
- [x] Formato `audio_reading` añadido a `ActivityFormat` y `ActivityRouter`
- [x] Funciona en web (solo tiempo) y móvil (graba + tiempo)
- [ ] Instalar: `npx expo install expo-av`
- [ ] Crear node type `activity_audio_reading` en Drupal

---

## FASE 7b — Separación activity_blink
**Estado**: ✅ Completada

### Drupal
- [x] Nuevo node type `activity_blink` ("Activity3-text list blink") — sin `field_activity_format` (el formato es implícitamente blink)
- [x] Nuevo activitylog bundle `log3_textlistblink` ("Log3-textlistblink")
- [x] Nuevo activitysummary bundle `summary3_vertical_text_blink` ("Summary3-Vertical text list blink")
- [x] 29 YAMLs de config generados e importados con `drush cim --partial -y`
- [x] `field.field.node.session.field_activities.yml` actualizado para aceptar `activity_blink`
- [x] Endpoints JSON:API verificados: `/jsonapi/node/activity_blink`, `/jsonapi/activitylog/log3_textlistblink`, `/jsonapi/activitysummary/summary3_vertical_text_blink`

### App
- [x] `src/types/activity.ts` — añadido `BlinkActivityAttributes`, `BlinkActivityResource`; `AnyActivityResource` actualizado
- [x] `src/types/activitylog.ts` — añadido `BlinkLogResource`, `CreateBlinkLogPayload`
- [x] `src/types/activitysummary.ts` — añadido `BlinkSummaryResource`, `CreateBlinkSummaryPayload`
- [x] `src/lib/api/tracking.ts` — añadido `createBlinkLog`, `createBlinkSummary`
- [x] `src/lib/api/activities.ts` — añadido `getBlinkActivities`, `getBlinkActivity`
- [x] `ActivityBase.tsx` — `handleEnd` ramifica por `activity.type`: blink usa bundles `log3_textlistblink`/`summary3_vertical_text_blink`; vertical_list sigue usando los originales
- [x] `VerticalTextPlayer.tsx` — prop `activity` ampliado a `ActivityResource | BlinkActivityResource`
- [x] `ActivityRouter.tsx` — rama `node--activity_blink` añadida antes del cast a `ActivityResource`
- [x] `app/(auth)/session/[id].tsx` — carga actividades blink con `getBlinkActivity()` en lugar de `getActivity()`

---

## FASE 9 — Saneamiento técnico (ver plans/02-plan-ejecucion-v1.md)
**Estado**: ✅ Completada (2026-07-21) — **Backend** (09a) + **App**: config por entorno (09b), bugs de datos A1/A4/A5 (09c), manejo de errores + limpieza A7 + tooling A9 (09d). Único pendiente diferido: restringir CORS a orígenes reales (FASE 14).

### Backend (prompt 09a) — 2026-07-21

**B4 — Consumer OAuth como cliente público** ✅
- Consumer `shine_expo_app` (id=2) cambiado a `confidential: false` y `secret` vaciado.
- El backend **ya no exige `client_secret`**: flujo Authorization Code + PKCE verificado por curl end-to-end **con un usuario normal** (no super user): login → `/oauth/authorize` (con pantalla de consentimiento "Allow") → `/oauth/token` **sin enviar `client_secret`** → respuesta `200` con `access_token` + `refresh_token`.
- ⚠️ El consumer es una **entidad de contenido** (vive en BD, no en `config/sync`). Por eso `drush cex` NO lo captura y el cambio **debe reaplicarse en cada entorno** (script en `CLAUDE.md` → "Configuración en un PC nuevo"). Actualizar ese script para poner `confidential: false` al crear el consumer.
- Pendiente en la app (prompt 09b): dejar de enviar `client_secret` en el POST a `/oauth/token`.

**Permiso `grant simple_oauth codes`** ✅ (concedido 2026-07-21)
- Se detectó que el rol `authenticated` NO tenía `grant simple_oauth codes`, permiso que simple_oauth exige para completar `/oauth/authorize` (`Oauth2AuthorizeController::authorize`). Sin él, solo el user 1 (super user) podía completar el login.
- Concedido al rol `authenticated` y **exportado a config** (`config/sync/user.role.authenticated.yml` + dependencia `simple_oauth`). `config:status` sin diff → idempotente.
- Verificado: un usuario normal (rol authenticated) completa el flujo completo sin secret (token `200`).
- Nota UX: `automatic_authorization` del consumer sigue en `off`, así que el usuario ve una pantalla de consentimiento "Allow" en cada login. Si se quiere login sin fricción (recomendable para una app propia), activar `automatic_authorization` en el consumer (vive en BD, como el resto de sus ajustes).

**B1 — Endpoint legacy `/activitylog-register/add`: RETIRADO** ✅
- Decisión con evidencia: **retirar** (módulo `activitylog_register` desinstalado + código eliminado).
- Evidencia:
  - La app Expo escribe el tracking **solo por JSON:API** (`shine-app/src/lib/api/tracking.ts`: POST a `/activitylog/*` y `/activitysummary/*` por bundle). No hay ninguna referencia a `/activitylog-register/add` en la app.
  - El único consumidor del endpoint era el **frontend Drupal acoplado** (`activitylog_register_preprocess_node` adjuntaba `logregister.js` a las plantillas `node--activity`/`node--session`/`node--activity-image-position`, con `startButton`), sustituido por la app Expo en el pivote de 2026-03-27.
  - El endpoint tenía el bug B1 (creaba siempre bundles `logverticaltext`/`summary_vertical_text` ignorando `activityType`): retirarlo lo elimina de raíz.
- Acciones: `drush pm:uninstall activitylog_register`; borrado `public_html/modules/custom/activitylog_register/`; línea eliminada de `config/sync/core.extension.yml`; `drush cr`.
- Verificado: `GET /activitylog-register/add` → **404**; `GET /jsonapi/activitylog/logverticaltext` → **200** (write path de la app intacto). `activitylog` y `activitysummary` siguen habilitados.
- Nota: las plantillas del frontend acoplado (`node--activity.html.twig` con `startButton`) siguen en los themes `shine`/`stablechild`; sin el módulo su `startButton` queda inerte (no es parte de la v1). El módulo `preprocess` (inyecta mensaje de motivación en esas plantillas Drupal) también es solo del frontend acoplado; se deja intacto por estar fuera de alcance.

**B5 — CORS** ✅ (preparado)
- `services.yml` mantiene `allowedOrigins: ['*']` para desarrollo.
- Añadido comentario en el propio `services.yml` con el valor de producción (orígenes reales del build web; las apps nativas no envían `Origin`). **Activar en FASE 14.**

**Verificación general**
- `drush watchdog:show --severity=Error`: sin errores nuevos atribuibles a estos cambios (las entradas de la sesión son el 404 esperado del endpoint retirado y un "user denied" de una iteración del test PKCE previa a activar la autorización automática).
- Config: mi único cambio en `config/sync` (quitar `activitylog_register` de `core.extension.yml`) es idempotente — active y sync coinciden respecto a ese módulo. El resto de diffs de `drush config:status` (`search_help`/`search_node`, `backup_migrate`, `olivero`, `system.performance`) son **drift pre-existente ajeno** a esta tarea; NO se ejecutó un `cim` global para no arrastrarlos.

### App (prompt 09b) — 2026-07-21

**A3 — Configuración por entorno + eliminación de `client_secret`** ✅
- **Único punto de verdad**: nuevo módulo `shine-app/src/lib/config.ts` que lee de `expo-constants` (`Constants.expoConfig.extra`) con defaults de desarrollo y exporta `API_BASE`, `OAUTH_CLIENT_ID`, `JSONAPI_BASE`, `OAUTH` (endpoints `authorize`/`token`/`userinfo` derivados) y `OAUTH_SCOPE`.
- **`app.config.ts`** creado: extiende `app.json` (que sigue siendo la base estática) e inyecta en `extra` las variables `EXPO_PUBLIC_API_BASE` y `EXPO_PUBLIC_OAUTH_CLIENT_ID`.
- **`client_secret` eliminado por completo de la app**: quitado del `useAuthRequest` y del intercambio de token en `app/login.tsx`, y del refresh en `src/lib/api/client.ts`. El backend ya es cliente público con PKCE (ver 09a). No queda ningún secret en el bundle.
- Sustituidos todos los hardcodeos (`https://shine.ddev.site`, `shine_expo_app`) en `login.tsx`, `src/lib/api/client.ts` (ahora re-exporta `API_BASE`/`JSONAPI_BASE` desde config para consumidores existentes) y `src/store/auth.ts` (userinfo).
- **`.env.example`** creado con las dos variables `EXPO_PUBLIC_*` y nota de que no existe secret. `.env*.local` ya estaba en `.gitignore`.
- Verificación: `npx tsc --noEmit` limpio; `grep` de `shine.ddev.site`/`shine_dev_secret`/`shine_expo_app` en `src`+`app` solo aparece en `src/lib/config.ts` (defaults), sin ningún secret. Login web pendiente de probar por el usuario (`npm run web`).

### App (prompt 09c) — 2026-07-21 · bugs de datos A1 / A4 / A5

**A1 — Filtro por usuario en la capa API** ✅
- `getMySummaries` y `getMyImageSummaries` (`src/lib/api/statistics.ts`) ignoraban el `userUuid` que recibían (dependían solo del access hook del servidor). Ahora ambas aplican `filter[uid.id]={uuid}`.
- Revisado el resto de la capa API: `getMyActivitySummaries` (tracking.ts) ya filtraba; los helpers nuevos también. No queda ninguna función que reciba uuid y no lo aplique.

**A4/B6 — Iteración por actividad calculada desde el servidor** ✅
- Antes `iteration` era un contador global en `src/store/session.ts` que se incrementaba en cada actividad y no se reseteaba entre sesiones ni distinguía actividades → corrompía la gráfica de evolución.
- Nuevo `getNextIteration(bundle, uid, activityId)` en statistics.ts: consulta el último summary del usuario para esa actividad (`filter[uid.id]` + `filter[field_activityid.id]` + `sort=-created` + `page[limit]=1`) y devuelve `field_iteration + 1` (o 1 si no hay). Se calcula **justo antes de crear el summary** en `ActivityBase` (bundles `summary_vertical_text` y `summary3_vertical_text_blink`) e `ImageGroupPlayer` (`summary_image_position`).
- Eliminado el prop `iteration` de `ActivityRouter`/`ActivityBase`/`ImageGroupPlayer` y el consumo del contador global en `session/[id].tsx`.
- **Limitación conocida (B6, severidad baja)**: el cálculo se fía del cliente; con dos dispositivos a la vez pueden duplicarse iteraciones. Documentado en el JSDoc de `getNextIteration`; no se resuelve aquí (requeriría cálculo atómico en servidor).

**A5 — Estado "completada" derivado del servidor** ✅
- El completado era local (`completedIds` en `session/[id].tsx`) y se perdía al navegar.
- Nuevo `getCompletedActivityIds(uid, sessionId)` en statistics.ts: consulta los 3 bundles de summary filtrando por `uid` + `field_sessionid` y devuelve el `Set` de `field_activityid` (una actividad con summary en esa sesión ⇒ completada). Un fallo en un bundle no tumba el resto.
- `session/[id].tsx` deriva `completedIds` del servidor al cargar (efecto con deps `[id, user?.sub]`) y mantiene el estado local solo como **cache optimista** tras completar.

**Store huérfano** — `src/store/session.ts` ya no lo consume nadie tras estos cambios. Marcado en el propio fichero como candidato a eliminación en el prompt 09d (limpieza A7); no se borra aquí.

**Verificación** — `npx tsc --noEmit` limpio. Recorrido manual (completar → salir → volver y ver completada; dos navegadores sin duplicar iteraciones) pendiente de probar por el usuario.

### App (prompt 09d) — 2026-07-21 · errores + limpieza A7 + tooling A9

**Manejo de errores** ✅
- `session/[id].tsx`: `loadSession` envuelto en try/catch/finally con estado `error`; vista de error con `EmptyState` (icono `cloud-off`) + botones **Reintentar** (relanza la carga) y **Volver**, usando los componentes de `src/components/ui` y tokens de `src/theme`.
- `ActivityRouter`: nuevo fallback `UnsupportedActivity` (EmptyState + botón Volver) para `field_activity_format` fuera de `['blink','vertical_list','audio_reading']` y para tipos de nodo desconocidos. Se añadió el prop `onExit` (la pantalla de sesión lo conecta a volver a la lista). Ya no devuelve `null` → no hay pantalla en blanco.
- Login: el estado de error (alerta + botón "Reintentar") de 09b sigue cubierto (verificado).

**A7 — Código huérfano eliminado** ✅ (confirmado sin usos por grep antes de borrar)
- Borrados: `src/components/statistics/SessionProgressBar.tsx`, `src/components/statistics/StandardComparison.tsx`, `src/store/session.ts` (ya huérfano tras 09c).
- Funciones borradas: `getGroupSessions` (+ import `GroupSessionResource`) en `sessions.ts`; `getExplanationMessage` + interfaz `ExplanationMessageResource` en `messages.ts`.
- Contraste con FASE 12: la "barra de progreso real" del detalle de sesión usará el `ProgressBar` del design system (`src/components/ui/ProgressBar.tsx`), no el `SessionProgressBar` legacy; FASE 12 explícitamente evita comparaciones negativas, así que `StandardComparison` no se necesita. `git` conserva ambos si hicieran falta.

**A9 — Tooling** ✅ (ficheros creados; el usuario instala las dev-deps)
- `eslint.config.js` (flat config: `eslint-config-expo/flat` + `eslint-config-prettier`), `.prettierrc`, `.prettierignore`.
- `jest.config.js` (preset `jest-expo`, alias `@/*`), primer test `src/lib/__tests__/stripHtml.test.ts` (andamiaje para los tests de stats de FASE 10).
- Scripts en `package.json`: `lint`, `format`, `format:check`, `test`.
- Tests aislados del typecheck principal: `tsconfig.json` excluye `**/*.test.ts(x)` y `**/__tests__/**` (así `npx tsc --noEmit` sigue limpio sin `@types/jest`).

- Dev-deps ya declaradas en `package.json` (instaladas por el usuario 2026-07-21): `eslint ^9`, `eslint-config-expo ~10`, `eslint-config-prettier ^10`, `prettier ^3`, `jest-expo ~54`, `jest ^29.7`, `@types/jest ^29.5`.
- ⚠️ **`jest` fijado a `^29` (no 30)**: `jest-expo@54` depende del ecosistema Jest 29 (`@jest/globals ^29`, `jest-environment-jsdom ^29`…). Con Jest 30 el runner peta con `this._moduleMocker.clearMocksOnScope is not a function`. No subir Jest a 30 hasta que jest-expo lo soporte.
- ⚠️ Los tests requieren **Node ≥ 18** (el preset carga el winter runtime de Expo, que usa `FormData` global). Con Node 16 fallan con `FormData is not defined`. Ejecutar siempre con `nvm use 21`.

**Verificación (2026-07-21, Node 21)** ✅ — `npx tsc --noEmit` limpio; `npm test` → **4/4 pasan** (`stripHtml`); `npm run lint` → **0 errores** (15 warnings preexistentes: `react-hooks/exhaustive-deps`, `@typescript-eslint/array-type`, algún unused var; no bloquean). Sin referencias colgantes a lo eliminado. Fallback de formato desconocido y estado de error de sesión: pendientes de prueba manual visual por el usuario.

### ⚠️ Hallazgos para revisar
- **Contraseña del user 1 (`admin`) reseteada a `Test1234!`** durante las pruebas (no se conocía la original). Cambiarla si procede.
- **`automatic_authorization` del consumer en `off`**: el usuario ve una pantalla de consentimiento "Allow" en cada login. Valorar activarla para una experiencia de login sin fricción (decisión de producto, no bloqueante).

---

## FASE 10 — Capa de datos de estadísticas (ver plans/02-plan-ejecucion-v1.md)
**Estado**: ✅ Completada (2026-07-22) — Backend (10a) + App (10b).

### Backend (prompt 10a) — 2026-07-22

**Campos denormalizados en los 3 bundles de activitysummary** ✅
- Creados con storage compartido (entity_type `activitysummary`): `field_main_area` (entity_ref → taxonomy `areas`, cardinalidad 1), `field_activity_level` (entity_ref → taxonomy `activity_level`, múltiple como en los nodos), `field_correct_count` y `field_items_count` (integers, min 0). Instancias en `summary_vertical_text`, `summary3_vertical_text_blink` y `summary_image_position`, con widgets/formatters en form y view displays.
- Script de creación (one-off, idempotente) guardado en `shine/scripts/create-summary-stats-fields.php`; la fuente de verdad es la config exportada (16 YAMLs nuevos + 6 displays en `config/sync`).
- Verificado en JSON:API: `GET /jsonapi/activitysummary/summary_vertical_text` expone `field_correct_count`/`field_items_count` (attributes) y `field_main_area`/`field_activity_level` (relationships).

**Backfill de summaries históricos** ✅
- Script idempotente `shine/scripts/backfill-summary-area-level.php` (`ddev drush php:script`): copia área/nivel desde el nodo actividad (via `field_activityid`) solo si el campo está vacío; para `summary_image_position` deriva `field_correct_count`/`field_items_count` contando sus `field_activitylogs` (`field_correct`).
- Resultado: 15 procesados, **8 actualizados**, 7 sin actividad resoluble (todos apuntan al nodo 2, borrado — datos de prueba de mayo, irrecuperables). Segunda pasada: 0 cambios (idempotencia verificada).
- Muestreo verificado: niveles del summary = niveles del nodo; counts de imágenes = conteo real de logs (correct 1/1, items 2/2).
- En la primera pasada `field_main_area` quedó vacío porque ningún nodo actividad tenía área asignada (el "required + default" del campo solo aplica en formulario). **Resuelto el 2026-07-22**: se asignó área a A1 (Rendimiento y Velocidad), A2 (Competencia Lingüística y Fonológica) y A3 (Memoria de Trabajo) y se re-ejecutó el backfill: los 9 summaries con actividad resoluble tienen área verificada contra su nodo (✓ en los 9).

**B3 — `field_seconds` en `activity_image_position`: NO se añade** ✅
- La métrica de imágenes es precisión (correct/items), no tiempo; una zona objetivo temporal incentivaría velocidad sobre acierto (contra § 2.3 del plan). Documentado con el razonamiento completo en `docs/metrics-tracking.md` (incluida la corrección del inexistente `field_standard_time` → `field_seconds`).

**Índices** ✅
- Nota de esquema: la entidad no es revisionable ni traducible → la tabla base es `activitysummary` (no existe `activitysummary_field_data` como decía el plan).
- `activitysummary_update_10001()` (nuevo `activitysummary.install`, ejecutado con `drush updb`): índice compuesto `activitysummary__uid_created (uid, created)` en la tabla base. Verificado con `SHOW INDEX`.
- `(uid, field_activityid)`: `field_activityid` vive en tabla dedicada `activitysummary__field_activityid`, que ya tiene el índice `field_activityid_target_id` creado por core; junto al índice de uid de la base cubre el patrón de filtros de la app.

### App (prompt 10b) — 2026-07-22

**Campos denormalizados rellenados al crear summaries (los 3 tipos)** ✅
- Nuevo helper `summaryStatsRelationships(activity)` en `src/lib/api/tracking.ts`: extrae `field_main_area` y `field_activity_level` del nodo actividad que la app ya tiene cargado (JSON:API siempre devuelve el linkage de relaciones sin `include`; coste cero) y tolera nodos sin área/nivel.
- `ActivityBase` (bundles `summary_vertical_text` y `summary3_vertical_text_blink`) e `ImageGroupPlayer` (`summary_image_position`) añaden esas relaciones al payload; el de imágenes añade además `field_correct_count` (respuestas acertadas) y `field_items_count` (total) como attributes.
- Tipos TS actualizados: `SummaryStatsRelationships`/`SummaryStatsAttributes` compartidos por los 3 payloads en `src/types/activitysummary.ts` (+ campos en los resources), `field_main_area` en los relationships de `src/types/activity.ts`.
- Verificado contra el backend real: POST del payload exacto de la app → **201** con área, 3 niveles y contadores persistidos; el summary de prueba se borró después (queda pendiente una pasada manual desde la app por el usuario).

**Módulo `src/lib/stats/`** ✅ (puro: sin React ni imports de `src/lib/api`)
- Modelo propio `StatsSummary` + adaptador `toStatsSummary(resource)` (solo importa tipos): una única descarga de summaries alimenta todas las funciones.
- Funciones (plan § 2.4): `movingAverage` (ventana 5, serie suavizada de la misma longitud), `personalBest` (mayor precisión si el ejercicio la tiene, menor tiempo si no), `baselineVsRecent` (3 primeros vs 5 últimos; solo devuelve mejora > 10%, nunca negativa, null con < 5 intentos), `streak` (vigente si hoy o ayer; `today` inyectable), `weeklyBuckets` (lunes a domingo local, actividades y minutos por día + total), `areaAggregation` (dedicación por área ordenada ascendente — la menos trabajada primero, para "Para seguir practicando"), `accuracy` (% desde contadores, null si no aplica).
- **44 tests nuevos** en `src/lib/stats/__tests__/` (uno por función + adaptador): listas vacías, 1 y 4 intentos, racha rota, summaries sin área/fecha, empates, ventanas parciales. `npm test` → **45/45**; `npx tsc --noEmit` limpio; lint 0 errores.

**Nombres reales de actividad y sesión** ✅
- Elección: `include=field_activityid,field_sessionid` en la propia query de summaries (1 request; JSON:API lo soporta también en referencias multi-bundle) frente a fetch complementario (N requests). Verificado contra el backend: `included` trae los títulos reales.
- `getMySummaries` ahora devuelve `{ summaries, included }` y `getMyImageSummaries` amplía su include; nuevo helper `titlesFromIncluded()`. La pantalla de estadísticas usa títulos reales; eliminados los placeholders `Actividad ${idx+1}` y `Sesión ${uuid...}` (fallbacks humanos para nodos borrados: "Actividad ya no disponible" / "Sin sesión").
- Nota: los nodos referenciados borrados no vienen en `included`; el fallback cubre ese caso (hay 7 summaries históricos así).

**Config y drift** ✅
- `drush cex -y` + commit de TODO el diff: además de mis 22 ficheros, la exportación **reconcilia el drift preexistente del upgrade a core 11.4.4** (split del módulo search → `search_help`/`search_node` en `core.extension` y `search.page.*`, `gzip`→`compress` en `system.performance`, `field.settings` eliminado de core, schema nuevo de `backup_migrate`, `olivero.settings`) y recupera el permiso `grant simple_oauth codes` en `user.role.authenticated.yml` que en 09a no llegó a commitearse.
- Verificado: `drush config:status` → "No differences"; `drush cim -y` → "no changes" (idempotente).
- Sin errores en watchdog atribuibles a la sesión (2026-07-22 limpio).

---

## FASE 11 — Design system en código (ver plans/02-plan-ejecucion-v1.md)
**Estado**: ✅ Completada (2026-07-22)

- [x] `src/theme/` creado: colors, spacing, radii, shadows, typography + index. Portado del proyecto "Shine Design System" de claude.ai/design (fuente de verdad visual)
- [x] `src/components/ui/` creado: Button, Card, Icon (SVG propio con react-native-svg, sin deps nuevas), LevelChip, AreaChip, StatTile, MotivationCard, EmptyState, ProgressBar, BottomNav + barrel index
- [x] `tsc --noEmit` limpio
- [x] Fuente Nunito instalada y conectada (2026-07-21): `useFonts` en `app/_layout.tsx`, familias por peso en `src/theme/typography.ts` (Nunito_400Regular a Nunito_800ExtraBold)
- [x] Componente `Screen` (2026-07-22, prompt 11a): `src/components/ui/Screen.tsx`. Marco exterior `colors.shell` en web con columna centrada a `layout.appMaxWidth` (480), `colors.bgScreen` a pantalla completa en móvil; safe areas configurables (`edges`) y gutter opcional (`layout.screenGutter`). Exportado en el barrel.
- [x] Migrar pantallas existentes a los tokens (2026-07-22, prompt 11a): `dashboard.tsx` reescrito por completo con tokens + componentes DS (Card, Button, Icon, Screen); eliminados los objetos locales `C`/`FONT`/`Icon` Material y la paleta azul de facto (`#006b57`, `#3dbfa0`, `rgba(61,191,160,…)`). `session/[id].tsx` y `statistics/index.tsx` envueltos en `Screen` (centrado 480 en web) y sus `styles.screen`/`errorScreen` redundantes limpiados. Los componentes de `activities/` y `statistics/` ya estaban tokenizados (sin cambios). Añadido el icono `log-out` al set de `Icon.tsx`. Verificado: grep de hex/rgba sin resultados fuera de `theme`/`ui`, `tsc --noEmit` limpio (exit 0), sin unused locals. Falta el recorrido visual en web por el usuario.
- [x] Elección de fuente por el usuario (Nunito / OpenDyslexic) (2026-07-22, prompt 11b). Backend: campo `field_dyslexic_font` (boolean, default false) en la entidad user, expuesto en JSON:API; el usuario edita SU propia cuenta vía `PATCH /jsonapi/user/user/{uuid}` con el acceso self-edit de core (verificado: update propio ALLOWED, otro usuario DENIED, campo edit/view ALLOWED) — no se abrió ningún permiso extra; config exportada. App: OpenDyslexic (SIL OFL, `OFL.txt` incluido) en `assets/fonts/` en 3 pesos, cargada con `expo-font` junto a Nunito en el layout raíz; solo tiene Regular y Bold, mapeo de los 5 pesos del tema documentado en `src/theme/typography.ts` (regular/medium→Regular, semibold/bold/extrabold→Bold). Store `src/store/settings.ts` (Zustand + cache local en `@/lib/storage` + sync con el servidor al hacer login y al cambiar, best-effort). Hooks `useFamilies()`/`useText()` en `@/theme` (los `families`/`text` estáticos quedan como base interna Nunito); migrados a los hooks TODOS los componentes de `ui/`, las pantallas (`dashboard`, `session/[id]`, `statistics`, `login`), los players (`ActivityBase`, `VerticalTextPlayer`, `AudioReadingPlayer`, `ImageGroupPlayer`) y las tablas/gráficas de `statistics/`. Pantalla nueva `app/(auth)/settings.tsx`: selector por vista previa (dos tarjetas con la misma frase en cada fuente, "¿Cómo prefieres leer?", sin nombres técnicos ni "dislexia") + botón de cerrar sesión (movido aquí desde el BottomNav del dashboard). Acceso: avatar del dashboard → Ajustes (icono `settings` nuevo) y enlace discreto "Ajustar cómo se ven las letras" en la intro de ActivityBase. QA: `numberOfLines`/`flexShrink`/`adjustsFontSizeToFit` en Button, StatTile y el BottomNav para la mayor anchura de OpenDyslexic; sin bifurcar estilos por fuente. `tsc --noEmit` limpio, `npm run lint` sin errores (solo warnings pre-existentes), 45/45 tests verdes. Falta el recorrido visual en dispositivo por el usuario.

---

## FASE 12 — Pantallas v1 (ver plans/02-plan-ejecucion-v1.md)
**Estado**: 🔄 En curso (2026-07-22)

- [x] Dashboard (prompt 12a): `app/(auth)/dashboard.tsx` reescrito portando el mockup aprobado `HomeScreen.jsx` del proyecto "Shine Design System" (claude.ai/design). Muestra: saludo con nombre y momento del día (buenos días/tardes/noches) + fecha larga; resumen semanal (actividades y minutos) con `StatTile`, solo si hubo práctica esta semana (sin ceros tristes; minutos sub-minuto se muestran como "<1"); racha en positivo con `MotivationCard` (omitida si es 0); tarjeta "Continuar" con la sesión a medias más reciente (0 < progreso < 100) y CTA directo; lista de sesiones con descripción, chips `AreaChip`/`LevelChip` derivados de sus actividades, `ProgressBar` real (X de Y actividades) y badge "Completada"; `EmptyState` amable sin sesiones; skeletons de carga (no spinner); `BottomNav` con Inicio/Mi progreso. Datos: **2 queries** — `getSessions` (con include anidado `field_activities.field_main_area,field_activities.field_activity_level` para traer área/nivel en la misma petición) + `getMySummaries`; todo lo demás derivado en cliente con `@/lib/stats` (`weeklyBuckets`, `streak`, `toStatsSummary`) y el helper puro nuevo `src/lib/sessionCards.ts` (progreso por sesión, mapeo de área a etiqueta+icono por palabra clave, nivel Level0/1/2→beginner/intermediate/advanced tomando el mínimo). Reglas de producto respetadas (esfuerzo, sin comparaciones, sin "error"). Verificación: `tsc --noEmit` limpio, `npm run lint` sin errores (solo warnings pre-existentes); derivaciones (semana=2, racha=1, progreso por sesión) contrastadas contra los summaries reales de user 1. Falta el recorrido visual con usuario real por el usuario.
- [x] Detalle de sesión (prompt 12b): `app/(auth)/session/[id].tsx`. El grueso entró sin documentar dentro del lote del 2026-07-22 (commit `5c62165`, titulado "update funcion elegir fuente"): barra `ProgressBar` "X de Y actividades completadas", icono por tipo de ejercicio (`book-open`/`zap`/`mic`/`image`), badge Completada/Pendiente, "Hecha N veces", CTA inferior que alterna Empezar/Continuar/Repetir abriendo la primera pendiente, celebración con `MotivationCard` al 100%, y estados de carga (skeletons), error con reintento y sesión sin actividades. **Completado el 2026-09-16** con lo único que faltaba de la spec: los chips de área y nivel en la cabecera. Para ello `getSession` usa ahora el mismo include anidado que `getSessions` (`field_activities.field_main_area,field_activities.field_activity_level`) y la pantalla reutiliza `deriveSessionCards()` de `src/lib/sessionCards.ts` para derivar los chips (el progreso lo sigue llevando `counts`, que admite la cache optimista tras completar). `tsc --noEmit` y `npm run lint` limpios.
- [ ] Player: cuenta atrás en blink, permiso de micro denegado con fallback amable, guardado resiliente.
- [ ] Actividad completada: mejor marca personal, variante sesión completa, sin comparaciones negativas.
- [ ] Mi progreso: las 5 secciones del prompt 06.
- [ ] Mensajes de motivación filtrados por tipo de actividad (arreglo A6).

---

## Por qué "Mi progreso" salía siempre vacío — tres bugs (2026-09-16)

Los dos primeros son invisibles con el **usuario 1**, porque el super usuario se
salta las comprobaciones. Todo el desarrollo hasta el 2026-09-16 se había probado
con él, así que la app parecía funcionar mientras estaba rota para cualquier
cuenta real. El tercero afectaba a todos por igual.

### 1. `sub` devolvía el uid entero, no el UUID — módulo `shine_oauth` (2026-07-22)

La app usa `user.sub` **en todas partes como si fuera el UUID**: `filter[uid.id]`
en estadísticas, `PATCH /jsonapi/user/user/{uuid}` para la preferencia de fuente,
`getNextIteration`, `getCompletedActivityCounts`. Pero `simple_oauth` sirve en
`/oauth/userinfo` el claim `sub` con el **uid interno** (`1`, `2`…), así que esas
llamadas devolvían 404 o colecciones vacías.

Solución: módulo custom **`shine_oauth`** (`public_html/modules/custom/shine_oauth/`)
que implementa `hook_simple_oauth_oidc_claims_alter()` y reescribe `sub` con
`$account->uuid()`. No toca ningún otro claim ni la validación del token (el JWT
del access token conserva su propio subject interno). Está en `core.extension.yml`,
así que `drush cim` lo activa solo en un entorno nuevo.

Verificado: `sub` = `5e11b1f1-…` en lugar de `1`.

### 2. Cualquier `filter[...]` devolvía 0 resultados — `hook_jsonapi_ENTITY_TYPE_filter_access()` (2026-09-16)

**Síntoma**: "Mi progreso" siempre vacío, el progreso de las sesiones siempre a
cero, todas las actividades siempre "Pendiente", y `field_iteration` guardado
siempre como 1 (dos intentos de la misma actividad quedaban ambos como "intento 1").

**Causa**: JSON:API protege el filtrado con
`TemporaryQueryGuard::getAccessConditionForKnownSubsets()`. Si **ningún** módulo
implementa `hook_jsonapi_entity_filter_access()` / `hook_jsonapi_ENTITY_TYPE_filter_access()`
para ese tipo de entidad, JSON:API no sabe qué subconjunto puede filtrar el
usuario y, por seguridad, añade a la consulta la condición imposible
`id < 1 AND id > 1`. Resultado: **HTTP 200 con `data: []`**, sin ningún error que
delate el problema. Core lo implementa para sus entidades (nodos, etc.), pero las
entidades custom tienen que hacerlo ellas.

Comprobado antes del arreglo, como usuario 2 (2 resúmenes propios):

| Petición | Resultado |
|---|---|
| sin filtro | 2 |
| `filter[uid.id]=<su propio uuid>` | **0** |
| `filter[field_iteration][value]=1` (valor que sí existe) | **0** |
| lo mismo como usuario 1 | 11 |

**Solución**: `activitysummary_jsonapi_activitysummary_filter_access()` en
`activitysummary.module`, declarando los mismos permisos que ya usa el
`hook_entity_access` del módulo: `view any …` habilita `AMONG_ALL` y
`view own …` habilita `AMONG_OWN`. Con `AMONG_OWN`, JSON:API añade por su cuenta
la condición `uid = <usuario actual>`, así que **filtrar no expone nada nuevo**.

Verificado tras el arreglo: el usuario 2 recibe sus 2 + 2 + 2 resúmenes en los
tres bundles, y al filtrar por el UUID de otro usuario sigue recibiendo 0.

> **Al crear una entidad custom nueva expuesta en JSON:API** (por ejemplo los
> bundles de la FASE 13) hay que implementar este hook desde el principio, o el
> ejercicio nuevo tendrá estadísticas vacías sin dar ningún error.
>
> `activitylog` **todavía no lo implementa**: hoy la app no filtra esa colección
> (solo la trae por `include`, que usa otra ruta de acceso), pero en cuanto se
> filtre habrá que añadírselo.

### 3. La app solo consultaba 1 de los 3 bundles de summary (2026-09-16)

Con el filtrado ya arreglado seguía faltando información, porque tanto el
dashboard como "Mi progreso" llamaban a `getMySummaries()`, que consultaba
únicamente `summary_vertical_text`. Los ejercicios **blink** y los de
**imágenes** no contaban para nada:

- "Mi progreso" no mostraba ninguna gráfica de blink.
- El resumen semanal y los minutos salían por debajo de lo real.
- La racha se rompía en días en los que solo se habían hecho ejercicios blink o de imágenes.
- El progreso de cada sesión no contaba esas actividades, así que una actividad blink ya completada seguía apareciendo como pendiente.

**Solución**: nueva `getAllMySummaries(userUuid)` en `src/lib/api/statistics.ts`,
que consulta los tres bundles en paralelo (cada uno con su `include`; el de
imágenes arrastra además sus logs para la precisión) y devuelve los resúmenes
combinados. Un bundle que falle no tumba a los demás. La pantalla de progreso
separa los de imágenes por su `type` (`IMAGE_SUMMARY_TYPE`) para su gráfica de
precisión, y el resto van juntos a las gráficas de evolución, que ya se agrupan
por actividad y llevan el título real de cada una.

`getMySummaries()` y `getMyImageSummaries()` quedaron huérfanas y **se han
eliminado** (limpieza A7). Nota: el `page[limit]` es ahora 50, que es el máximo
real de JSON:API (`OffsetPage::SIZE_MAX`); el 100 anterior se recortaba en
silencio.

Verificado con el usuario 2: 2 + 2 + 2 = **6 resúmenes** y títulos reales
resueltos (A1, A2, A3, S1). `tsc`, `lint` y 45/45 tests limpios.

---

## FASE 8 — PWA completa y publicación en stores
**Estado**: ⏳ Pendiente

> **Decisión 2026-09-29**: se publicará en App Store y Google Play usando **Capacitor** como
> puente a los servicios nativos (envolviendo el build web de la app). Revisar las tareas de
> EAS Build de abajo cuando se llegue aquí. Prerrequisito ya resuelto: login/registro sin
> navegador externo (FASE 14). Más adelante (fase 2 de auth) se prevé cobro recurrente para
> usuarios registrados.

- [ ] Configurar `app.json` (bundle ID, iconos, splash)
- [ ] Configurar EAS Build
- [ ] Build de preview para pruebas
- [ ] Build de producción
- [ ] Publicar en Google Play
- [ ] Publicar en App Store
- [ ] Deploy versión web

---

## FASE 14 — Login y registro in-app (sin navegador)
**Estado**: ✅ Completada (2026-09-29) — backend + app. Pendiente: subir las pantallas al design system.

**Por qué**: la app se publicará en los stores dentro de Capacitor. El flujo Authorization Code
abría el navegador del sistema y volvía por redirect; dentro de un WebView instalado eso es
frágil. Ahora el usuario escribe email y contraseña en la app y esta habla con Drupal "por
detrás". Decisiones del usuario: registro abierto sin verificación de email; identidad por
email; codificar las pantallas ya con los tokens del DS.

### Backend (Drupal)
- [x] `drupal/simple_oauth_password_grant` 2.1.0 (contrib) → grant `password` para simple_oauth 6. Trae flood control (`user.flood`) y login por email.
- [x] Grant `password` habilitado en el consumer `shine_expo_app` (entidad de contenido, por entorno) y en el scope `authenticated_user_access` (config).
- [x] Cliente público sin secret verificado con el password grant (`ClientRepository::validateClient` no exige secret si `confidential: false`).
- [x] `rest` (core) habilitado solo con el recurso `user_registration` (`POST /user/register?_format=json`, json, auth cookie). Permiso `restful post user_registration` al rol `anonymous`.
- [x] `user.settings`: `register: visitors`, `verify_mail: false`.
- [x] Campo `field_display_name` (string 60) en user: el username es el email, el nombre humano va aquí. En form/view display por defecto.
- [x] `shine_oauth`: `hook_user_format_name_alter()` → display name = `field_display_name` (claim `name` de userinfo y admin de Drupal).
- [x] Config exportada (`drush cex`).
- [x] Probado con curl como usuario nuevo (no user 1): registro 200 → token 200 → userinfo (`sub` UUID, `name` display) → JSON:API propio 200; 400 `invalid_grant`, 422 duplicado, 422 sin password.

### App (Expo)
- [x] `src/lib/api/auth.ts`: `requestPasswordToken()` y `registerAccount()` con `AuthError` tipado (`invalid_credentials`, `too_many_attempts`, `email_taken`, `validation`, `network`, `server`).
- [x] `src/lib/authForm.ts`: validación de formularios y mensajes amables; 9 tests en `src/lib/__tests__/authForm.test.ts`.
- [x] `useAuthStore.signIn(email, password)`; `login(tokens)` y el refresh de `client.ts` sin cambios.
- [x] `app/login.tsx` reescrito: email + contraseña, errores por campo, aviso ámbar, enlace a crear cuenta.
- [x] `app/register.tsx`: nombre + email + contraseña; al crear, entra automáticamente.
- [x] UI nueva con tokens del DS: `TextField` (52px, borde gris→teal→rojo, ojo mostrar/ocultar) e `InlineAlert` (aviso ámbar extraído del login). Iconos `eye-off`, `mail`, `lock`, `user`.
- [x] Eliminados `expo-auth-session` y `expo-web-browser` (y el plugin en `app.json`). `expo-linking` reinstalado explícitamente: era dependencia transitiva y expo-router lo necesita.
- [x] `tsc`, `eslint` y 95/95 tests en verde.
- [ ] Subir `LoginScreen` (con formulario), `RegisterScreen`, `TextField` e `InlineAlert` al Shine Design System (claude.ai/design) para que el DS siga siendo la fuente de verdad.
- [ ] Recuperar contraseña desde la app (hoy solo por la web de Drupal `/user/password`).

---

## Notas técnicas y decisiones

| Fecha | Nota |
|---|---|
| 2026-09-29 | Publicación en stores vía **Capacitor**. Toda funcionalidad nueva debe funcionar dentro de un WebView instalado: nada de redirects al navegador externo, Bearer tokens en vez de cookies. |
| 2026-09-29 | Login in-app con `grant_type=password` (contrib `simple_oauth_password_grant`). Hay que habilitar `password` en el consumer (BD, por entorno) **y** en el scope (config); si falta en el consumer → `unsupported_grant_type`, si falta en el scope → `invalid_scope`. |
| 2026-09-29 | `npm uninstall expo-auth-session` arrastra `expo-linking`, que expo-router necesita: Metro falla con `ENOENT expo-linking/build/Linking.js`. Solución: `npx expo install expo-linking` (queda como dependencia directa). |
| 2026-03-27 | Frontend cambiado de Next.js a Expo por requisito de publicación en App Store iOS y acceso nativo al micrófono |
| 2026-03-27 | El typo `motiviation_message` no se puede renombrar con un simple find/replace: requiere migración de bundle en BD + rename de config. Ver sección de notas en Fase 0. |
| 2026-03-27 | `simple_oauth v6` NO tiene Password Grant (eliminado por OAuth 2.1). Usar Authorization Code + PKCE. Ver `docs/api-design.md`. |
| 2026-03-27 | Al testear endpoints OAuth con curl dentro de ddev exec, el `&` en URLs debe estar en comillas simples: `ddev exec bash -c 'curl -s "...?a=1&b=2"'` |
| 2026-03-27 | Consumer OAuth2: client_id=`shine_expo_app`, secret=`shine_dev_secret_2026` (cambiar en prod), scope=`authenticated_user_access` |
| 2026-03-27 | Claves RSA OAuth: `/var/www/html/private/oauth-keys/` (dentro del contenedor DDEV) |
| 2026-05-20 | `activity_blink` es un node type propio (no usa `field_activity_format`). La sesión debe cargar sus actividades con `getBlinkActivity()` — si se usa `getActivity()` devuelve 404 y el tipo queda mal resuelto. |
| 2026-05-20 | `drush cim` falló con sync divergente (gin theme, devel huérfano). Solución: usar `--partial` + neutralizar conflictos de theme/extension escribiendo la config activa en sync con `$sync->write()`. |

---

## Mapa de áreas y auto-evaluación (2026-09-17)

**Estado**: ✅ Completada — backend + app.

**Por qué**: la idea original era puntuar el progreso con los campos de referencia de cada
ejercicio (sobre todo `field_seconds`). Se descarta: fijar un "tiempo de normalidad" por
actividad **y** por nivel no es realista ni defendible pedagógicamente. En su lugar el propio
usuario se auto-evalúa al terminar cada sesión y ese dato dibuja un gráfico radial de áreas.

### 1. "Mi progreso" adelgaza

`shine-app/app/(auth)/statistics/index.tsx` conserva solo las tres tarjetas de esfuerzo
(intentos, actividades, tiempo total), la tarjeta "Vas por buen camino" y el mapa de áreas
nuevo. Las gráficas de evolución por ejercicio, la de posición de imágenes y el historial por
sesión se mueven tal cual a una pantalla nueva, **Detalle de estadísticas**
(`app/(auth)/statistics/detail.tsx`, ruta `/statistics/detail`, registrada en
`app/(auth)/_layout.tsx`), a la que se entra desde una tarjeta con chevron al final de
"Mi progreso".

### 2. Gráfico radial de áreas

- `src/components/statistics/AreaRadarChart.tsx`: radar de una sola serie sobre
  `react-native-svg`, un vértice por término del vocabulario `areas` (hoy 5). Retícula de 4
  anillos recesiva, polígono teal con relleno al 28%, punto de 5 px con anillo blanco en cada
  vértice. Las etiquetas son `Text` de React Native (no `<Text>` de SVG) para que respeten la
  fuente elegida por el usuario y puedan partirse en dos líneas; 14 px mínimo, en tinta, nunca
  del color de la serie. Sin leyenda (una sola serie, cada vértice va escrito) y con tabla de
  datos colapsable como alternativa textual (WCAG).
- **Vacío al registrarse**: con cero auto-evaluaciones se dibuja solo la retícula y un texto que
  invita a terminar la primera sesión. Los vértices existen desde el primer día: el radar no
  cambia de silueta según los datos.
- `src/lib/api/areas.ts` (`getAreas`) trae los términos completos, no solo los trabajados.

### 3. Auto-evaluación al terminar la sesión

- Backend: módulo nuevo `sessionfeedback` con una entidad de contenido **sin bundles** y campos
  de código (no configurables por Field UI): `session`, `easiest_activity`, `hardest_activity`,
  más `label` (se autogenera en `preSave`, así un POST sin `label` no da el 422 del gotcha 13),
  `uid`, `created` y `changed`. Permisos `create` y `view own` concedidos a `authenticated`, más
  `hook_jsonapi_sessionfeedback_filter_access()` (gotcha 16, obligatorio) y el handler de acceso
  con la misma política que `activitysummary`. Editar y borrar quedan reservados a administración:
  es un registro histórico y reescribirlo falsearía el mapa acumulado.
- App: `src/components/session/SessionFeedbackPrompt.tsx`, dos preguntas encadenadas
  ("¿Con cuál te has sentido mejor?" y "¿Cuál te ha costado un poco más?"), la segunda sin la
  actividad ya elegida, siempre saltable con "Ahora no". `app/(auth)/session/[id].tsx` gana el
  modo `feedback`.
- **Reglas de recorrido en `src/lib/sessionRun.ts`** (puro y testeado): `nextActivityIndex()`
  encadena a la siguiente actividad sin completar y `shouldAskSessionFeedback()` pregunta cuando
  ya no queda ninguna por hacer. La primera versión las tenía dentro de la pantalla y encadenaba
  por el histórico de intentos: al repetir una sesión ya completada se cortaba tras la primera
  actividad y la pregunta saltaba a mitad de sesión. Quedó resuelto del todo al adoptar el modelo
  de una sola vez por sesión (ver más abajo).
- Se guarda el dato crudo y **nada derivado**: la puntuación por área se recalcula entera en
  cliente, así que la fórmula se puede ajustar sin migrar datos.

### 4. Acumulación sobre el radar

`src/lib/stats/areaRadar.ts` (puro, sin React ni capa API) parte de una base de 50 sobre 100 por
área y, por cada auto-evaluación, mueve ±6 el área principal y ±3 la secundaria de la actividad
señalada (`field_main_area` / `field_secondary_area` del nodo), con techo 100 y suelo 10.
`toRadarFeedback` (`radarAdapter.ts`) resuelve las áreas desde el `included` del include anidado,
en **una sola petición**, y tolera nodos borrados o respuestas a medias. `areaToPractice()` y
`strongestArea()` generan la frase de debajo del gráfico, siempre en positivo: se invita a seguir
practicando el vértice más bajo, nunca se señala una debilidad.

### 5. Bug corregido de paso

`areaChipMeta()` en `src/lib/sessionCards.ts` mapeaba **dos** áreas reales a la misma etiqueta:
"Procesos Perceptivos (Discriminación Visual y Auditiva)" casaba con la regla de velocidad por la
palabra "proces" y salía como "Velocidad de proceso". En el radar aparecían dos vértices con el
mismo nombre. Corregido reordenando las reglas (la perceptiva antes que la de velocidad) y
estrechando esa regla a `procesamiento`. Afectaba también a los chips del dashboard y del detalle
de sesión. Cubierto con test permanente sobre los cinco nombres reales del vocabulario.

### Verificación

- Backend con **usuario normal** (nunca el user 1, gotcha 14): POST → **201** con `uid` y `label`
  correctos; `GET` con `filter[uid.id]` → 1 fila (sin el hook de filtro habría devuelto `data: []`);
  include anidado de 4 niveles → las áreas de ambas actividades en la misma respuesta.
- Ciclo completo contra el backend real: dos auto-evaluaciones enviadas con el payload exacto de
  la app, leídas con la query exacta de la app y pasadas por `toRadarFeedback` + `areaRadar`. Los
  cinco vértices dieron los valores esperados a mano (59 / 59 / 38 / 44 / base sin tocar). Los
  datos de prueba se borraron después.
- `npx tsc --noEmit` limpio, `npm run lint` con **0 errores** (13 warnings preexistentes),
  `npm test` → **77/77** (32 nuevos: radar, adaptador, etiquetas de área y reglas de tanda).
- Config exportada (`drush cex`): `core.extension` y `user.role.authenticated`.

**Pendiente**: recorrido visual en web y móvil por el usuario (el radar y las dos preguntas no se
han visto todavía en pantalla real).

---

## Una actividad, una vez por sesión (2026-09-17)

**Estado**: ✅ Completada — app.

Dos peticiones del usuario tras probar el flujo anterior.

### Reiniciar la actividad en curso

`PlayerShell` acepta `onRestart` y pinta un botón discreto en la esquina superior derecha, sin
fondo y en tinta secundaria, con área táctil de 48 px y etiqueta accesible "Volver a empezar esta
actividad". Solo existe mientras la actividad está en curso: las pantallas de "completada" no
montan ese chrome, así que el botón desaparece justo cuando dejaría de tener sentido.

`ActivityBase`, `ImageGroupPlayer` y `ActivityRouter` se limitan a propagar la prop. El reinicio en
sí lo resuelve la pantalla de sesión con un contador `attempt` en el `key` del `ActivityRouter`:
cambiarlo remonta el player desde la introducción, sin que ningún player tenga que saber
reiniciarse por dentro.

### Una actividad completada queda cerrada en esa sesión

Decisión del usuario: el cierre es **permanente**, pero por pareja (sesión, actividad). Como las
sesiones van a ser dinámicas, una actividad ya hecha que aparezca en una sesión nueva sale
disponible allí. Esto ya salía gratis: `getCompletedActivityCounts()` filtra por
`filter[field_sessionid.id]`, así que lo completado siempre se lee dentro de la sesión.

- La tarjeta de una actividad completada deja de ser pulsable, pierde el chevron y se atenúa
  (fondo `bgScreen`, icono en tinta secundaria). El texto mantiene el contraste AA.
- Fuera el botón **"Repetir sesión"** y la frase que invitaba a repetir. Una sesión terminada
  muestra solo la felicitación y "Te espera otra cuando quieras seguir".
- Fuera también el contador "Hecha N veces": con una sola vez posible, sobraba.
- `sessionRun.ts` se simplifica en consecuencia: desaparecen `runDone` y `pendingAtRunStart` de la
  pantalla, porque con el modelo de una sola vez el histórico de la sesión ya es la única verdad.
  La auto-evaluación se pide exactamente una vez por sesión, al cerrar la última actividad que
  quedaba, tanto si se hace del tirón como si se retoma otro día.

**Consecuencia asumida**: cada sesión aporta como mucho una auto-evaluación, así que el mapa de
áreas crece al ritmo de las sesiones nuevas, no de las repeticiones.

### Verificación

`npx tsc --noEmit` limpio, `npm run lint` con 0 errores, `npm test` → **73/73** (las reglas de
recorrido se reescribieron y sus tests con ellas).

**Pendiente**: recorrido visual por el usuario. Ojo al probar: una sesión ya completada queda
bloqueada entera, así que hace falta una sesión con actividades pendientes.

---

## FASE 15 — Sistema de niveles por área y sesiones dinámicas

Implementa `docs/level-system.md` siguiendo los subplanes de `plans/level-sistem/`.

### 01a. Backend: campos y vocabularios (2026-10-15)

Todo es config exportada en `shine/config/sync`, salvo el campo base de `sessionfeedback`.

- **`node.session`**: `field_session_kind` (list_string, requerido, `regular` | `evaluation`,
  por defecto `regular`), `field_evaluation_scope` (ref a `areas`, opcional),
  `field_evaluation_reason` (list_string, opcional: `initial` | `periodic` | `trigger_easy` |
  `trigger_hard` | `evidence`) y `field_evaluation_seq` (integer 1..2, opcional). Las sesiones
  existentes (1) se rellenaron a `regular` con un script tras crear el campo.
- **`sessionfeedback`**: campo base `overall` (list_string `easy` | `ok` | `hard`, opcional),
  instalado con `sessionfeedback_update_11001()` (`drush updb`). La definición vive en
  `Sessionfeedback::overallFieldDefinition()` para que el update instale exactamente la misma.
  El módulo declara ahora la dependencia `drupal:options`.
- **`user`**: `field_onboarding_state` (list_string `evaluating` | `regular`, por defecto
  `evaluating`, no requerido). Oculto en formularios y vistas: es estado interno. Los 5 usuarios
  existentes quedaron en `evaluating`. `POST /user/register` sigue funcionando y el usuario nuevo
  nace en `evaluating`.
- **Ciclos (§7)**: vocabulario `activity_cycle` y campos `field_cycle` (ref a `activity_cycle`)
  y `field_cycle_weight` (integer) en `activity`, `activity_blink` y `activity_image_position`,
  un storage por campo. El término **"Sílabas" es contenido**: no viaja en `config/sync` y hay
  que crearlo en cada entorno.
- **Acceso**: `GET /jsonapi/taxonomy_term/activity_cycle` responde 200 al rol `authenticated`
  con `access content`; no hizo falta ningún permiso nuevo.

**Verificación** (usuario 2, gotcha 14): `GET /jsonapi/node/session` muestra los cuatro campos
y admite `filter[field_session_kind]=regular`; `GET /jsonapi/node/activity` muestra
`field_cycle` y `field_cycle_weight`; `GET /jsonapi/sessionfeedback/sessionfeedback` muestra
`overall`; registro + login por password grant correctos. `drush cim -y` dos veces sin cambios.
Sin errores nuevos en watchdog.

**Para subplanes siguientes**:
- `field_onboarding_state` sale en `GET /jsonapi/user/user/{uuid}` y, como cualquier campo del
  usuario, el propio usuario podría cambiarlo con un PATCH. Lo debe blindar el módulo
  `shine_level` (03) con `hook_entity_field_access()` (editable solo por el servidor/admin).
- Ya había una actualización de definición pendiente ajena a esta fase
  (`activity_message.field_activity_types`, visible en `getChangeSummary()`); no se ha tocado.

### 01b. Backend: sesiones con dueño y acceso por usuario (2026-10-15)

Módulo nuevo **`shine_session_access`** (solo `.info.yml` + `.module`, sin permisos ni config
propia). Cada usuario ve únicamente sus sesiones en `GET /jsonapi/node/session`, en colección y
en detalle; el admin lo sigue viendo todo.

**Mecanismo elegido: node grants de core** (`hook_node_grants` + `hook_node_access_records`),
realm `shine_session_owner` con gid = uid del dueño, solo para el bundle `session` y solo para
nodos publicados. Es la única API que filtra a la vez el acceso a un nodo y las consultas de
colección (JSON:API, Views, entity queries con `accessCheck`); un `hook_node_access` no toca las
colecciones y `hook_jsonapi_*_filter_access` es solo para entidades custom. Los demás bundles no
devuelven registros y conservan el grant `all`: su acceso no cambia.

Alternativas descartadas:
- Contrib `node_view_permissions` (hay 2.0.x para D11): resuelve lo mismo con permisos
  `view own/any X content`, pero escribe registros para **todos** los tipos de contenido, así que
  habría que repartir permisos nuevos a `activity*`, `page` y `group_session` para que nada
  dejara de verse. Cambia el modelo de acceso de todo el sitio para una necesidad de un bundle.
- Meterlo en `shine_level` (subplan 03): la política de acceso debe sobrevivir aunque el motor
  de niveles se cambie o se desactive, y el rebuild de `node_access` va ligado a instalar el
  módulo que implementa los grants. Módulo aparte, de ~40 líneas.

Detalle que hace falta saber:
- `node_access_rebuild()` está **deprecado en Drupal 11.4** (se elimina en D13). Se usa el
  servicio `\Drupal\node\NodeAccessRebuild`.
- El rebuild se lanza desde **`hook_modules_installed`**, no desde `hook_install`: el módulo
  `node` marca "needs rebuild" en su propio `hook_modules_installed`, que corre *después* de
  `hook_install`. Reconstruir allí dejaba la tabla bien pero la bandera puesta (aviso falso en
  el informe de estado). Nuestro hook corre tras el de `node` (orden alfabético) y `rebuild()`
  limpia la bandera al terminar. Verificado: `needsRebuild() === false` tras `pm:enable`.
- Los registros se recalculan al guardar el nodo: reasignar una sesión es
  `$node->setOwnerId($uid)->save()`.

**Sesiones existentes**: la única hecha a mano (S1, nid 3, uid 1) se conserva como material de
referencia visible solo para el admin. Consecuencia: **el dashboard de cualquier usuario normal
queda vacío hasta que exista el generador (subplan 05)**. Para probar la app mientras tanto,
reasignar o clonar una sesión al usuario de prueba:
```bash
ddev drush php-eval '$n = \Drupal\node\Entity\Node::load(3); $c = $n->createDuplicate(); $c->setTitle("S1 de jose")->setOwnerId(2)->save(); echo $c->id();'
```

**`group_session`**: hoy la app solo tiene el tipo TS; no lo consulta. Con sesiones generadas por
usuario la agrupación manual pierde sentido. Propuesta anotada en `docs/level-system.md` §10:
retirar `group_session` (tipo + `field_ref_session`) cuando la app pase a sesiones dinámicas (07).
No se toca en esta fase; sigue con grant `all`.

**Verificación** (usuarios A y B creados por REST, editor con rol `content_editor` sin
`bypass node access`, patrón `account_switcher` + sub-request del gotcha 14):

| Usuario | Colección (`filter[status]=1&include=field_activities`) | Detalle sesión de A | Detalle S1 | `/admin/content` |
|---|---|---|---|---|
| A | solo "Sesión de A", `included` con sus 2 actividades | 200 | 403 | solo la suya |
| B | `data: []` | 403 | 403 | vacío |
| editor | `data: []` | 403 | 403 | vacío |
| user 1 | S1 + sesión de A | 200 | 200 | ambas |

`GET /jsonapi/node/activity` sigue devolviendo lo mismo a todos (bundles no afectados).
`drush cim -y` dos veces sin cambios; solo cambia `core.extension`. Sin errores nuevos en
watchdog.

Datos de prueba que quedan en la BD local: usuarios `usuario.a.fase15@`, `usuario.b.fase15@`,
`editor.fase15@example.com` (contraseña `Prueba1234!`) y el nodo 9 "Sesión de A (prueba 01b)".

### 02. Backend: entidad `activityfeedback` (2026-10-15)

Módulo nuevo **`activityfeedback`**, calcado de `sessionfeedback`: entidad de contenido sin
bundles con campos base `uid`, `session` (ref a `node.session`), `activity` (ref a `activity`,
`activity_blink`, `activity_image_position`), `rating` (list_string `easy` | `ok` | `hard`,
requerido), `label` (autogenerada en `preSave` si no llega: `Feedback: {actividad} ({rating})`),
`created` y `changed`. Interfaz, access handler, list builder (`/admin/content/activityfeedback`)
y enlace de menú como el original.

- Permisos: `create`, `view own`, `view any` y `administer activityfeedback entities`. El rol
  `authenticated` tiene `create` y `view own` (exportado en `user.role.authenticated.yml`).
  Editar y borrar solo con `administer` (es histórico: reescribirlo falsearía decisiones de
  nivel ya tomadas).
- Hooks `hook_activityfeedback_access`, `hook_activityfeedback_create_access` y
  `hook_jsonapi_activityfeedback_filter_access` (gotcha 16).
- Sin reglas de nivel: solo dato crudo. `preSave` rechaza un `rating` fuera de la lista
  (cubre guardados por código o drush; por JSON:API ya da 422 la restricción del campo).

**Verificación** (usuarios A y B, `account_switcher` + sub-request):
- A: `POST` con `label`, `rating`, `session` y `activity` → 201 (también contra `activity_blink`);
  `rating: "fatal"` → 422.
- A: `filter[uid.id]=A` → sus 2; `filter[uid.id]=B` → 0; `filter[session.id]=sesión de A` → 2.
- B: `filter[session.id]=sesión de A` → 0; `filter[uid.id]=B` → la suya.
- B: `POST` que referencia la sesión de A → **422** "This entity (node: 9) cannot be referenced".
  Lo impone la validación de referencias combinada con los node grants de 01b, sin código extra:
  nadie puede valorar sobre una sesión ajena.
- `preSave` con `rating: "meh"` por API de entidades → excepción. Deja un `[error]` en
  watchdog (provocado a propósito en la prueba, no es un fallo).
- `drush cim -y` dos veces sin cambios.

### 03. Backend: módulo `shine_level`, entidades de nivel y parámetros (2026-10-15)

Módulo nuevo **`shine_level`** (`shine/public_html/modules/custom/shine_level/`). Deja el modelo
de datos listo para las reglas (04) y el generador (05); **sin lógica de nivel**.

**Entidades** (content entities sin bundles, campos de código, expuestas en JSON:API):
- `userarealevel`: `uid`, `area` (ref `areas`), `level` y `probe_level` (ref `activity_level`),
  `closed` (boolean), `evidence` (integer con signo), `last_evaluated` (timestamp, nullable),
  `changed`, `label` siempre derivada ("{usuario} / {área}"). Unicidad (uid, area) por partida
  doble: `preSave` (consulta + `LogicException` con mensaje claro) e **índice único
  `userarealevel__uid_area`** en la tabla vía `storage_schema` handler
  (`UserAreaLevelStorageSchema`, mismo patrón que `UserStorageSchema`). Es el índice lo que
  protege ante dos peticiones concurrentes.
- `userarealevel_log`: `uid`, `area`, `from_level`, `to_level`, `reason` (string 32, validado
  contra el enum `ChangeReason`), `session` (ref `node.session`, opcional), `created`, `label`
  ("{usuario} / {área}: Level0 → Level1 (initial)"). **Inmutable**: `preSave` rechaza cualquier
  guardado de una entidad existente y el access handler deniega `update` **también al admin**
  (se corta en `access()` antes del atajo de `admin_permission`); `delete` solo con
  `administer shine level`. Sin formulario de edición.
- Permisos: `administer shine level`, `view own|any userarealevel entities`,
  `view own|any userarealevel_log entities`. `authenticated` tiene los dos `view own`
  (exportado). Nadie crea por JSON:API: solo el servidor.
- `hook_jsonapi_*_filter_access` para las dos (gotcha 16).

**Servicios**:
- `shine_level.level_ladder` (`LevelLadder`): `rungs()`, `first()`, `last()`, `next()`,
  `previous()`, `position()`, `hasContent(area, level)` y `activityBundles()`. **Orden de la
  escalera: por `weight` del término y, a igual peso, por nombre en orden natural**. Hoy
  Level0/1/2 tienen los tres peso 0, así que manda el nombre; "Level0" es *el primer peldaño*,
  no un término buscado por nombre. `hasContent` es el techo por contenido de §5.5: busca
  cualquier bundle de nodo con `field_main_area` + `field_activity_level` (hoy `activity`,
  `activity_blink`, `activity_image_position`), publicado, con esa área principal y ese nivel;
  sin comprobación de acceso (pregunta sobre el catálogo).
- `shine_level.level_repository` (`LevelRepository`): `getForUser(account)` devuelve una fila
  por término de `areas` (indexado por tid, orden del vocabulario), creando en Level0 las que
  faltan; `logChange(row, from, to, ChangeReason, ?session)` escribe el log y pone
  `last_evaluated`, **sin tocar `level`/`probe_level`** (eso es de 04); `areas()`.
- `ChangeReason`: enum PHP (`initial`, `periodic`, `trigger_easy`, `trigger_hard`, `evidence`),
  mismos valores que `field_evaluation_reason`.

**Configuración** `shine_level.settings` con los 13 parámetros de §8 (`config/install` +
`config/schema` con restricciones `Range`/`Choice`). Formulario en `/admin/config/shine/level`
(`ConfigFormBase` con `#config_target`: los límites viven solo en el esquema), bajo una página
nueva "Shine" en `/admin/config/shine` para futuros ajustes. Verificado por código: valores
válidos se guardan (`drush cget` los refleja); `regular_slots=0`, `accuracy_floor=1.5` y
`area_selection=random` dan error de validación.

**Blindaje de `field_onboarding_state`** (deuda anotada en 01a): `hook_entity_field_access`
deniega `edit` al propio usuario (un PATCH JSON:API ya no puede pasarse a `regular`); lectura
abierta; el admin con `administer shine level` sí puede.

**Tests kernel** (`tests/src/Kernel/`): `LevelRepositoryTest` (creación bajo demanda, orden,
idempotencia, filas por usuario, solo rellena las que faltan, duplicado rechazado, índice único
existe, `logChange`, log inmutable, motivo desconocido) y `LevelLadderTest` (orden natural con
Level10, peso gana al nombre, next/previous/position, `hasContent` con publicada/no publicada).
Infraestructura nueva: `shine/phpunit.xml` (copia reducida de `core/phpunit.xml.dist` con la BD
de DDEV) y `.gitignore` con `/.phpunit.cache/`. Comando:
```bash
cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_level
```
Resultado: **13 tests, 286 aserciones, OK**. Los kernel tests usan tablas con prefijo en la
misma BD y las borran; no tocan datos del sitio. Primera ejecución: hay que crear
`public_html/sites/simpletest/browser_output` (ya ignorado en git).

**Verificación con usuarios A y B** (`account_switcher` + sub-request): tras `getForUser(A)`,
`GET /jsonapi/userarealevel/userarealevel?filter[uid.id]=A&include=area,level` como A → 5 filas
en Level0; como B → 0 filas y 403 en el detalle; `userarealevel_log` igual. `cim -y` dos veces
sin cambios (`shine_level.settings`, `core.extension`, `user.role.authenticated`).

**Observación sobre el contenido real** (`hasContent` hoy): Competencia Lingüística no tiene
actividad en Level0 (solo Level1 y Level2); Funciones Ejecutivas y Procesos Perceptivos no
tienen ninguna; Velocidad solo Level0. Con este catálogo el techo de §5.5 cerrará casi todo en
Level0: el subplan 09 debe crear contenido de prueba antes de juzgar las reglas.

Datos de prueba nuevos en la BD local: 5 filas `userarealevel` del usuario A y 1 log
(Competencia Lingüística Level0 → Level1, `initial`, sesión 9).

### 04. Backend: reglas de nivel y cierre de sesión (2026-10-15)

Servicio **`shine_level.evaluator`** (`SessionEvaluator`) y endpoint
**`POST /shine/session/{uuid}/complete`** (`SessionCompleteController`). Toda la lógica de §5
vive en el servicio; el generador (05) solo consulta estado.

**Cierre de sesión.** Endpoint explícito y no hook sobre `sessionfeedback`/`activityfeedback`:
una regular puede cerrarse con la auto-evaluación saltada (no hay entidad que dispare nada) y en
una de ajuste la valoración de cada actividad puede saltarse (no hay "último" evento fiable);
además los summaries llegan en peticiones separadas. El cliente es el único que sabe que la
sesión terminó, lo dice llamando al endpoint y el servidor comprueba que no miente. Reglas:
- Bearer OAuth (proveedor `oauth2` global); `_csrf_request_header_token` solo afecta a cookies.
- Solo el dueño (`403 not_owner`); UUID desconocido `404 not_found`.
- Verifica contra `activitysummary` (uid + `field_sessionid` + `field_activityid`) que cada
  actividad de `field_activities` tiene summary: si no, `409 incomplete` con `missing[]`.
- Idempotente: marca `field_completed_at` (campo nuevo en `node.session`, exportado; visible en
  JSON:API) y las llamadas siguientes devuelven el mismo `CompletionResult` con
  `already_completed: true`. La respuesta se deriva íntegramente del estado guardado
  (`level_changes` = logs de esa sesión, `areas` = filas del usuario), por eso es reproducible.
- Lock por sesión (`lock` de core): dos llamadas simultáneas → `409 in_progress` en la segunda.
- **La app debe llamarlo después de enviar `sessionfeedback` / el último `activityfeedback`**
  (donde hoy `shouldAskSessionFeedback` decide mostrar la pregunta). Lo recoge 06/07.

**Sesión regular (§5.3, §5.4).** Lee el `sessionfeedback` de la sesión: `overall = easy` suma +1
de evidencia al `field_main_area` de `easiest_activity`; `hard` resta 1 al de `hardest_activity`;
`ok` o saltado, nada. Nunca mueve niveles. Las rachas **no se almacenan**: `getStreaks(user)` las
deriva del `sessionfeedback` del usuario (más reciente primero, solo sesiones regulares, solo
posterior al último `last_evaluated` del usuario; un `overall` vacío rompe la racha).

**Bloque inicial (§5.1).** Tabla por área sobre la valoración efectiva: `easy` → `level =
probe`, y `probe + 1` si hay contenido o `closed`; `ok` → `level = probe`, `closed`; `hard` →
`level = max(probe - 1, Level0)`, `closed`; sin valoración → nada (se vuelve a probar). Cierre
del bloque cuando todas cerradas o al llegar a `initial_max_sessions` sesiones `initial`
completadas (se cuentan por `field_completed_at`): cada área se fija (`closed`, `probe = level`,
`evidence = 0`), un log por área `Level0 → level` con `reason = initial` y
`field_onboarding_state = regular`.

**Evaluación fuera del bloque (§5.2).** La regla corre al completar la última sesión
(`field_evaluation_seq >= evaluation_sessions`, siempre en `evidence`, o si `seq` está vacío:
sesión única). Criterio de agrupación de las dos sesiones, documentado en `level-system.md`
§5.2: `activityfeedback` del usuario cuya sesión es de ajuste con la **misma `reason`** y está
completada (o es esta), con `created > last_evaluated` del área; agrupados por `field_main_area`.
Por área con ≥ 2 valoraciones: todas `easy` → `level = probe` si se probó arriba, si no
`level + 1` con contenido; ≥ 2 `hard` → `level - 1` (en Level0 no baja); otra cosa, nada. Después
`probe = level`, `evidence = 0`, `last_evaluated = ahora` en todas las áreas del alcance, y log
por cambio con la `reason` de la sesión.

**Salvaguardas (§5.5).** Techo por contenido con `LevelLadder::hasContent`. Freno por aciertos:
un `easy` cuyo summary de esa actividad y sesión tenga `field_items_count > 0` y
`correct / items < accuracy_floor` cuenta como `ok` (el `activityfeedback` no se toca; también
aplica en el bloque inicial). Histéresis: el área solo cambia si tiene ≥
`min_ratings_after_change` valoraciones en evaluación posteriores a su último log.

**Expuesto para 05**: `getStreaks()`, `lastEvaluatedAt()`, `countCompletedSessions(user, kind,
?reason, ?since)` y `missingActivities()`.

**Tests kernel** (`SessionEvaluatorTest`, 19 tests): escalera inicial (easy×3 hasta techo,
easy+hard → L0, ok cierra, saltada no cambia), cierre por todas cerradas y forzado a las 4,
periódica (easy+easy sube, hard+hard baja y no baja de L0, mixta/una sola no cambia, la primera
de dos no decide), probe arriba (`trigger_easy`), dirigida por evidencia (una sesión, un área,
no toca las demás), no se reutilizan valoraciones de una evaluación anterior, freno por aciertos
(periódica e inicial), histéresis, idempotencia, 409 por summary faltante, evidencia y rachas en
regulares, rachas a cero tras evaluación. Usa un reloj mutable (`MutableTime` sustituye a
`datetime.time`) porque en un kernel test todo ocurre en el mismo segundo y las comparaciones
"posterior a" no se podrían probar. Fixture propio: bundles `activity`, `session` y
`summary_test` con los campos reales, creados en el test. **Suite completa: 32 tests, 756
aserciones, OK.**

**Verificación con OAuth real** (usuario A, password grant): sesión `initial` con A2
(Competencia, L1/L2) y A1 (Velocidad, L0) + summaries por código; `activityfeedback` por JSON:API
(`easy` y `ok`, 201); `/complete` → 200: Competencia `Level0`, probe `Level1`, abierta;
Velocidad `Level0`, cerrada; segunda llamada idéntica con `already_completed: true`;
`field_completed_at` visible en `GET /jsonapi/node/session/{uuid}`. Sesión sin summaries → 409
con `missing: [A2]`; como B → 403; sin token → 403. `cim -y` idempotente. Sin errores nuevos en
watchdog (los tres de hoy son pruebas deliberadas).

Datos de prueba que quedan en la BD local: sesiones 10 a 12 de A (dos cerradas, una sin
summaries), sus summaries y dos `activityfeedback`.

### 05. Backend: generador de sesiones y endpoint de generación (2026-10-15)

Servicio **`shine_level.session_generator`** (`SessionGenerator`), endpoint
**`POST /shine/session/generate`** (`SessionGenerateController`) y comando
**`drush shine-level:generate {uid} [--dry-run]`** (`ShineLevelCommands`, Drush 13 con
atributos y `AutowireTrait`, sin `drush.services.yml`).

**Forma del servicio.** `generate(user)` devuelve la **pendiente** (propia, publicada, sin
`field_completed_at`) si existe, y si no `plan(user)` + `create(user, plan)`. `plan()` es el
árbol de §6 y devuelve un `SessionPlan` (rama, kind/reason/scope/seq, título, nids, `probe_level`
a fijar, explicación en frases y avisos) sin escribir nada; `create()` fija los `probe_level` en
las filas `userarealevel`, crea el nodo (`uid`, `status = 1`, campos de evaluación) y manda los
avisos a watchdog (canal `shine_level`, servicio `logger.channel.shine_level`) con una entrada
`info` por sesión que dice la rama y por qué. Separar decidir de crear es lo que permite el
`--dry-run` del comando. Lock por usuario (`lock` de core) → `409 in_progress`; sesión sin
ninguna actividad → `EmptySessionException` → `422 no_content` y no se crea nada.

**Desviación del diseño (anotada en `level-system.md` §6).** La "evaluación de 2 sesiones a
medias" se comprueba **antes** de los disparadores, no al final: las rachas, la evidencia y el
contador de regulares solo se ponen a cero al cerrar la última sesión de la evaluación, así que
con el orden literal el disparador seguía activo tras la primera y generaba otra "sesión 1" en
bucle. Criterio: la última sesión completada del usuario es de ajuste `periodic` / `trigger_*`
con `seq < evaluation_sessions`; la siguiente hereda `reason` y `scope`, `seq + 1`, sin tocar
`probe_level`.

**Decisiones de implementación:**
- `probe_level` se **escribe en las filas** al crear la sesión de ajuste; el evaluador (04) lo
  lee de ahí. Dirigida: `level + 1` si la evidencia es positiva y hay contenido, si no `level`
  (aviso de techo). Racha "fácil": `level + 1` por área donde haya contenido, resto al vigente
  (aviso). Racha "me ha costado" y periódica: `level`.
- Techo al elegir actividad: si no hay material en el `probe_level` se baja peldaño a peldaño y
  se fija el nivel donde lo hay (aviso); si no hay en ninguno, el área se omite (aviso). El techo
  **solo baja**: hoy "Competencia Lingüística" (solo A2 en L1/L2) no entra en el bloque inicial
  hasta que tenga una actividad en Level0.
- `LevelLadder::hasContent()` ahora **excluye las actividades de ciclo** (`field_cycle`) y
  expone `contentQuery(area, level)` para que techo y generador usen la misma definición de
  contenido. Sin este cambio un nivel con solo material de ciclo era "alcanzable" para el
  evaluador pero vacío para el generador.
- Sesiones de ajuste: una actividad por área (o `targeted_activities` de la misma área en la
  dirigida), evitando las usadas en **cualquier** sesión de ajuste anterior del usuario mientras
  queden otras; nunca una de ciclo; sin hueco de ciclo.
- Regular: `regular_slots` huecos por rotación sobre el orden del vocabulario `areas` (peso y
  nombre, **no** el de creación), empezando por el área siguiente a la que abrió la última
  regular (`field_activities[0].field_main_area`); candidatas al nivel vigente excluyendo las
  que tienen `activitysummary` del usuario en sus últimas `recent_window` sesiones (por
  `created`); sin candidatas baja hasta Level0 y si sigue vacío salta el hueco (aviso). Más un
  hueco por término de `activity_cycle`: `nextOfCycle()` = menos summaries del usuario (consulta
  agregada), luego menor `field_cycle_weight` (sin peso al final), luego aleatorio.
- `area_selection = weakest_first` **no implementado** en servidor (el radar vive en
  `shine-app/src/lib/stats/areaRadar.ts`): se usa rotación con aviso en watchdog y el
  formulario de `/admin/config/shine/level` lo advierte.
- Títulos: "Sesión N" (N = regulares del usuario + 1), "Sesión para conocerte N", "Sesión de
  ajuste" / "Sesión de ajuste 2". Usuario sin `field_onboarding_state` cuenta como `evaluating`.
- Un usuario en `evaluating` con todas las áreas cerradas (no debería pasar) recibe una sesión
  `initial` con todas las áreas al nivel vigente para que el evaluador cierre el bloque.

**Tests kernel** (`SessionGeneratorTest`, 19 tests; fixtures compartidas movidas a
`ShineLevelKernelTestBase`: `createSessionBundle`, `createSummaryBundle`, `createField`,
`createCycleFields`): inicial solo con áreas abiertas y al `probe_level`; evita actividades de
evaluaciones previas y repite si no queda otra; área sin contenido se omite y sin ninguna no hay
sesión; `generate` dos veces devuelve la misma y es por usuario; dirigida por evidencia (3
actividades distintas, un área, `probe = level + 1`, el nivel no se toca), signo negativo y
techo; racha de 3 `easy` → `trigger_easy` con probe arriba donde hay contenido; 2 `easy` no
bastan y 2 `hard` → `trigger_hard`; continuación de la sesión 1 → 2 con misma `reason`, sin
repetir actividad, y vuelta a regular al cerrar; continuación respeta `scope`; periódica solo con
sesiones **y** días; rotación con vuelta completa; ventana de no repetición (1 y 5) y 422 al
agotarse; degradación de nivel y huecos saltados; `weakest_first` cae a rotación con aviso; ciclo
avanza por peso, da la vuelta y nunca entra por el hueco de área; `nextOfCycle` por summaries y
peso; sesiones de ajuste sin ciclo. **Suite completa: 51 tests, 1200 aserciones, OK.**

**Verificación con OAuth real** (usuarios A y B, password grant): B (`evaluating`, sin sesiones)
`POST /shine/session/generate` → **201** "Sesión para conocerte 1", `initial`, 2 actividades
(A3 en Memoria y A1 en Velocidad; las otras tres áreas no tienen material en Level0, avisos en
watchdog); segunda llamada → **200** misma sesión con `created: false`; sin token → 403.
`GET /jsonapi/node/session` como B muestra solo esa; como A no aparece y su detalle da 403.
`drush shine-level:generate 8 --dry-run` imprime la rama `initial`, la explicación y los avisos
sin crear nada; con un usuario con pendiente (9) avisa y no genera. `config:status` sin cambios
(todo es código). Sin errores en watchdog.

Datos de prueba que quedan en la BD local: sesión 13 "Sesión para conocerte 1" de B (pendiente).

**Para 07 (app):** llamar a `generate` cuando el dashboard no tenga pendiente (o con el botón),
navegar con `session` (UUID) y leer `kind` para decidir si mostrar `ActivityFeedbackPrompt`.
**Para 09:** crear contenido en Level0 de todas las áreas; mientras no exista, el bloque inicial
omite esas áreas y se cierran en Level0 por falta de material (riesgo ya anotado en el README).

### 06. App: valoración "¿Cómo ha ido?" en sesión y por actividad (2026-10-15)

Solo `shine-app/`. Sin cambios en Drupal.

- **Tipos**: `Rating` (`easy` | `ok` | `hard`) y su orden fijo `RATINGS` viven solo en
  `src/types/rating.ts`. `session.ts` gana `field_session_kind`, `field_evaluation_reason`,
  `field_evaluation_seq`, `field_completed_at` y la relación `field_evaluation_scope`, más
  `sessionKind()` (una sesión sin tipo, hecha a mano, cuenta como `regular`).
  `sessionfeedback.ts` gana `overall`; nuevo `activityfeedback.ts`.
- **Textos**: todos en `RATING_COPY` (`src/lib/rating.ts`): pregunta "¿Cómo ha ido?", opciones
  "Demasiado fácil" / "Bien así" / "Me ha costado" y "Ahora no". Solo castellano por ahora.
- **Icono**: tres pesas rusas de tamaño creciente (`weight-sm`, `weight-md`, `weight-lg` en
  `Icon.tsx`, dibujadas con el mismo trazo y apoyadas en la base para que solo cambie el
  tamaño).
- **`RatingPicker`** (`src/components/session/`): tres botones en fila (área táctil de más de
  48 px, roles `radiogroup` / `radio` con `selected`) y "Ahora no" opcional como enlace
  secundario.
- **`SessionFeedbackPrompt`**: "¿Cómo ha ido?" es la primera de las tres preguntas. Los pasos y
  qué se guarda están en `src/lib/sessionFeedback.ts`. **"Ahora no" salta solo la pregunta en
  curso** (antes cerraba todo el prompt); en la última termina con lo respondido. Si se saltan
  todas no se crea `sessionfeedback`; tras un error al guardar, "Ahora no" sale sin insistir.
- **`ActivityFeedbackPrompt`**: en la pantalla "Actividad completada", antes de la motivación,
  solo si la pantalla de sesión pasa `askRating` (sesiones `evaluation`). Un toque en una opción
  ya es la respuesta; mientras se pregunta no se ven la motivación ni los botones de avanzar.
  Está en `ActivityBase` y también en `ImageGroupPlayer`, que no pasa por `ActivityBase` y
  también puede salir en una sesión de ajuste.
- **Pantalla de sesión**: en sesiones de ajuste no hay preguntas de fin de sesión
  (`shouldAskSessionFeedback(ids, done, kind)`); al cerrar la última actividad se va directo a
  la lista con la misma tarjeta "¡Has completado esta sesión!". Los POST de `activityfeedback`
  se guardan en un ref y **`completeSession()` espera a que terminen** antes de llamar a
  `POST /shine/session/{uuid}/complete`. En sesiones regulares el cierre va tras guardar o
  saltar la auto-evaluación. Si falla, `console.warn` y nada más; al volver a abrir una sesión
  terminada sin `field_completed_at` se reintenta en silencio.
- `completeSession()` y `CompleteSessionResponse` en `src/lib/api/sessions.ts`;
  `createActivityFeedback()` junto a `createSessionFeedback()` en `src/lib/api/sessionFeedback.ts`.

**Tests**: `sessionFeedback.test.ts` (orden de pasos, qué se guarda al saltar, orden fijo de las
opciones, ninguna palabra que juzgue en `RATING_COPY`) y `sessionRun.test.ts` ampliado (tipos de
sesión). `tsc --noEmit` limpio, `npm run lint` sin errores (12 avisos ya existentes), `npm test`
110/110.

**Verificación contra Drupal** (sub-requests como usuarios normales, gotcha 14, con los mismos
payloads que envía la app; lo creado se borró después): `sessionfeedback` con `overall: hard`
→ 201 y uid 9; sin `overall` → 201 con `overall: null`; `activityfeedback` `easy` como usuario
10 en su sesión de ajuste → 201 y uid 10; `complete` con cabeceras JSON sobre una sesión ya
cerrada → 200 `already_completed: true`; `field_completed_at` llega por JSON:API como fecha ISO.

**Pendiente de recorrido manual** (en la app, `npm run web`): sesión regular (tres preguntas, la
primera "¿Cómo ha ido?") y sesión de ajuste (pregunta tras cada actividad, sin preguntas
finales). La sesión 13 de B (`usuario.b.fase15@`) es de ajuste y sigue pendiente.

### 07b. App: `ActivityBase` con lo común y una definición por tipo de actividad (2026-10-15)

Solo `shine-app/`. Sin cambios en Drupal. Hay un único camino para jugar cualquier actividad:
`ActivityRouter` → `ActivityBase` (intro, marco, guardado, pantalla final) → player del tipo
(solo el juego). Detalle y reparto en `docs/activity-system.md` ("Jerarquía de componentes
React Native").

- **Tests de oro primero** (`src/lib/activityKinds/__tests__/goldenPayloads.test.ts`): logs y
  summary exactos de los tres tipos, con y sin sesión y con y sin contar errores, escritos
  leyendo `ActivityBase.handleEnd()` e `ImageGroupPlayer.finishActivity()` antes de tocarlos.
  Pasan sin retoques al terminar: **ningún payload ha cambiado**.
- **Definiciones puras** en `src/lib/activityKinds/`: `types.ts` (`TrackedEntry`, `TextEntry`,
  `ImageEntry`, `Metric`, `ActivityKind<A, E>`), `verticalText.ts`, `blink.ts`,
  `imagePosition.ts`, el registro `kindFor()` en `index.ts` y `buildTracking()` en
  `tracking.ts`, que pone los campos y relaciones comunes (también área y nivel del summary,
  que leen las reglas de nivel). `summaryStatsRelationships` se mudó ahí desde la capa API.
- **API**: `postLog(logType, payload)` y `postSummary(summaryType, payload)` en
  `src/lib/api/tracking.ts` (la ruta sale del tipo). Retirados los seis `create*Log` /
  `create*Summary`. Las uniones `CreateLogPayload` / `CreateSummaryPayload` y `LogType` /
  `SummaryType` están en `src/types/activitylog.ts` y `activitysummary.ts`.
- **`ActivityBase` genérico**: métricas "Tu tiempo" + las del tipo + "Errores" (con tres o más,
  disposición apilada); el icono de la intro sale del tipo (imágenes conserva `image`) y la
  intro de imágenes gana el enlace a ajustes de fuente.
- **Fallo al guardar** (antes `ActivityBase` no lo capturaba e `ImageGroupPlayer` lo
  silenciaba): `InlineAlert` "No hemos podido guardar esta actividad" con "Reintentar", que
  repite todo el guardado (iteración incluida; los logs del intento fallido quedan huérfanos y
  no cuentan). Hasta guardar, "Siguiente actividad" está deshabilitado y "Volver a la sesión"
  sale con `onExit`, sin marcar la actividad hecha. La valoración "¿Cómo ha ido?" se entrega a
  la sesión solo cuando la actividad ya está guardada, para no dejar un `activityfeedback` sin
  su summary.
- **`ImageGroupPlayer`** queda solo con el juego (`resolveGroups`, memorizar/preguntar,
  `ErrorButton`, `skipOnError`); los errores van por `errors.onError()`.

**Tests**: tests de oro + `activityKinds.test.ts` (`kindFor`, `buildTracking` con y sin
errores y sesión, `metrics()` de imágenes `"3 / 4"`). `tsc --noEmit` limpio, `npm run lint` sin
errores (10 avisos, todos de los que ya había).

**Referencia para comparar**: último summary con sus logs de los tres tipos del usuario 2,
guardados antes de jugar con el código nuevo. Ojo: el comando del plan usa
`->condition("type", $b)`, pero la clave de bundle de `activitysummary` es `bundle`.

**Pendiente de recorrido manual** (`npm run web`, usuario normal): los tres tipos en sesión
regular y de ajuste, contador de errores con `count_errors` y `skip_on_error` en imágenes,
salir y reiniciar a mitad, y red cortada al terminar (aviso, "Siguiente" bloqueado, reintento).

### 07. App: dashboard con sesiones propias y generación bajo demanda (2026-10-15)

Solo `shine-app/`. Sin cambios en Drupal.

- **Decisión §10: botón explícito.** Sin sesión pendiente, el dashboard enseña "Nueva sesión"
  (`POST /shine/session/generate`, `generateSession()` en `src/lib/api/sessions.ts`), navega a
  la sesión devuelta y refresca la lista. `AUTO_GENERATE_SESSION` en `src/lib/config.ts`
  (`false`) la pediría sola al cargar, sin botón.
- **Origen de datos**: `getSessions(userUuid)` con `filter[uid.id]` (defensa en profundidad:
  el servidor ya solo devuelve las propias), `sort=-created` y páginas de 20
  (`SESSIONS_PAGE_SIZE`, unas tres semanas a una sesión por día) con "Ver sesiones anteriores"
  siguiendo `links.next`. El include ya no trae `field_activity_level`.
- **Pendiente** (`pickPendingId`): sesión sin `field_completed_at` y con actividades por hacer;
  si hay varias, la empezada con actividad más reciente o, si no, la más nueva. La tarjeta
  "Continuar" dice "Tu sesión / Empezar sesión" si aún no se ha empezado. Antes de pedir otra,
  el dashboard cierra las sesiones que tienen todo hecho pero siguen abiertas
  (`unclosedFinishedIds`), porque el servidor las tomaría por pendientes.
- **Refresco al volver**: el dashboard recarga con `useFocusEffect` (antes solo al cambiar de
  usuario, así que al volver de una sesión no veía el progreso nuevo).
- **Nombres**: `sessionDisplay()` presenta las sesiones de ajuste como "Sesión para conocerte"
  (bloque inicial) o "Sesión de ajuste" (el resto), sin numerar y con un subtítulo breve
  (`SESSION_COPY`); nunca "evaluación". Las regulares y las antiguas usan su título y cuerpo.
  Igual en la cabecera del detalle de sesión.
- **`LevelChip` retirado** de tarjetas y detalle (§9) y eliminado de `src/components/ui`.
  Iconos nuevos `plus` y `chevron-down`.
- **Errores al generar** con `InlineAlert` (`generateErrorCopy`): 422 `no_content` ("Aún no
  tenemos actividades para ti"), 409 `in_progress` y red.
- **Mi progreso**: sin cambios. Todas sus consultas filtran por `uid` y las sesiones solo llegan
  por `include`; una sesión que el usuario ya no puede ver sale como "Sesión ya no disponible".

**Tests**: `sessionCards.test.ts` (pendiente con lista vacía, todas cerradas, todo hecho sin
cerrar, varias abiertas; nombre según `kind` y `reason`; ningún texto dice "evaluación";
errores de generación). `npm test` 146/146.

**Verificación contra Drupal**: la consulta del dashboard como usuarios 2 y 9 devuelve solo las
propias y 0 al filtrar por el otro. Con un usuario registrado por la API: lista vacía →
`generate` 201 "Sesión para conocerte 1" → `generate` otra vez 200 con la misma
(`created: false`) → jugada por la API con los payloads de `buildTracking` (imagen y blink, con
valoración) → `complete` 200 → la siguiente `generate` da **422 `no_content`**: en local solo
una de las cuatro áreas tiene actividades (techo por contenido, ver riesgos del README de
`plans/level-sistem/`). El recorrido "la segunda del bloque" necesita el contenido de prueba
del subplan 09. Quedan en BD los usuarios de prueba `prueba07+…@example.com` (uid 14, con su sesión pendiente) y
`prueba07b+…@example.com` (uid 15) con sus sesiones.

**Pendiente de recorrido manual** (`npm run web`): usuario nuevo desde la app, dashboard vacío,
"Nueva sesión", completarla con valoraciones, volver al dashboard; segundo usuario sin ver
nada del primero.

### 08. Backend: administración y auditoría de niveles (2026-10-15)

Solo Drupal (`shine_level` + tres vistas en `config/sync`). Objetivo: explicar "por qué este
usuario está en este nivel" sin tocar la BD. Rutas en `CLAUDE.md` ("Administración del
sistema de niveles").

- **Vistas exportadas** (Views, no list builders): `shine_levels` (`/admin/shine/levels`),
  `shine_level_log` (`/admin/shine/levels/log`, admite `/{uid}/{tid}` como argumentos, que es lo
  que usa "ver histórico" en cada fila de la anterior) y `shine_sessions`
  (`/admin/shine/sessions`, con `disable_sql_rewrite` para que un admin sin `bypass node
  access` vea las sesiones de todos). Filtro "Usuario" combinado sobre email y nombre visible;
  área con desplegable del vocabulario; razón del histórico con desplegable
  (`UserAreaLevelLogViewsData` + `ChangeReason::options()`). Menú "Shine" en la barra de
  administración (`/admin/shine`). Las listas de `/admin/content/userarealevel*` siguen
  existiendo.
- **Pestaña "Niveles"** del perfil (`/user/{uid}/levels`, `UserLevelsController`): estado de
  onboarding, botón "Reiniciar niveles" y los displays `embed_user` de las dos vistas por ese
  usuario. Acceso con `administer shine level` o con los dos `view any` (perfil terapeuta).
- **"Reiniciar niveles"** (`/user/{uid}/levels/reset`, `LevelResetForm` + servicio
  `shine_level.level_reset`): todas las áreas a Level0 (nivel y nivel en prueba), abiertas, sin
  evidencia, un log `reset` por área (`ChangeReason::Reset`, añadido también a §4 del diseño),
  `field_onboarding_state = evaluating` y las sesiones pendientes **despublicadas** (si no, el
  generador devolvería la pendiente en vez de empezar el bloque). No borra nada.
- **Corrección necesaria para el reinicio**: el tope `initial_max_sessions` contaba todas las
  sesiones iniciales completadas de la historia del usuario, así que tras un reinicio el bloque
  se habría cerrado a la primera. Ahora `SessionEvaluator` solo cuenta las completadas desde
  `lastEvaluatedAt()`, que el log de reinicio fija en ese momento (para un usuario nuevo es
  NULL y cuenta todas, como antes).

**Tests**: `SessionEvaluatorTest::testResetRestartsInitialBlock` (bloque cerrado por tope →
reinicio → Level0, 5 logs `reset` con su `from`, pendiente despublicada, `evaluating`, y una
sesión inicial más no cierra el bloque). `phpunit` del módulo 52/52.

**Verificación en el sitio**: usuario normal (9) → 403 en `/admin/shine`, las tres vistas, la
pestaña, el reinicio y `/admin/content/userarealevel`; admin → 200 en todo y en Views UI.
Usuario 14 preparado como "avanzado" (regular, Level1 en todas, evidencia 2, una sesión
pendiente) y reiniciado por el formulario real (POST con token): Level0/abiertas/evidencia 0,
`evaluating`, 0 pendientes publicadas, y `shine-level:generate 14 --dry-run` da `evaluation`
/ `initial`. El histórico filtrado por `reason=reset` y `/admin/shine/levels/log/14/{tid}`
muestran los cambios; los enlaces "ver histórico" llevan a `/{uid}/{tid}`. `drush cex` solo
exportó las tres vistas y `cim` posterior: sin cambios.

Pendiente: el número del título de las sesiones iniciales ("Sesión para conocerte N") sigue
contando también las del bloque anterior a un reinicio. Es solo cosmético (la app no lo
enseña) y no se ha tocado.
