# Progreso de implementación — Shine

> Actualizado en tiempo real. Si el desarrollo se interrumpe, retomar desde el primer ítem sin marcar de la fase en curso.

**Última actualización**: 2026-10-27 (Generador de contenido 05: lista de texto y lectura en voz alta importables, niveles Level3 a Level10; FASE 18, 06: verificación bilingüe y cierre de la fase; antes 05: revisión del experto de los lotes catalanes aplicada); 2026-10-26 (FASE 18, 05: contenido catalán, primeros lotes Level0 a Level2; antes el mismo día FASE 18 00 a 04, FASE 17 07 y Generador de contenido 04)

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

## FASE 13 — Nuevos ejercicios (primer lote)
**Estado**: ✅ Completada (2026-10-21) — backend + app de los tres tipos (prompts 13a, 13b y 13c en una sola pasada). Pendiente: revisión terapéutica del contenido de ejemplo y lotes reales por nivel.

### Qué hay

| Ejercicio | Node type | Bundles | Player | Lógica pura |
|---|---|---|---|---|
| 7.6 Matriz de discriminación visual (13a) | `activity_letter_matrix` (`field_target`, `field_columns`, `field_rows`, `field_cells` múltiple = una ronda por valor, `field_time_limit`) | `loglettermatrix` / `summary_letter_matrix` | `LetterMatrixPlayer` | `src/lib/letterMatrix.ts` |
| 7.8 Reordenamiento de sílabas (13b) | `activity_syllable_order` (`field_items` → paragraph `syllable_word`: `field_syllables` "pan-ta-lón", `field_extra_syllables`, `field_image`) | `logsyllableorder` / `summary_syllable_order` | `SyllableOrderPlayer` | `src/lib/syllableOrder.ts` |
| 7.5 Segmentación léxica (13c) | `activity_word_split` (`field_sentences` múltiple, con espacios) | `logwordsplit` / `summary_word_split` | `WordSplitPlayer` | `src/lib/wordSplit.ts` |

Los tres reutilizan los campos comunes de `activity_blink` (área principal con el área por defecto
del tipo, área secundaria, nivel, código, instrucción, explicación, ciclo, sonoridad y esfuerzo),
no cuentan errores (`activity_options`) y siguen el camino único `ActivityRouter` → `ActivityBase`
→ player. Modelado final en `docs/exercise-catalog.md` §6 y `docs/activity-system.md`.

### Decisiones

- **Un log por ronda en la matriz**, no por objetivo (la propuesta del catálogo): así la suma de
  `field_time` de los logs sigue siendo el tiempo del intento, que es lo que `buildTracking` y
  "Tu tiempo" asumen para todos los tipos. El log lleva `field_correct_count` / `field_items_count`
  de la ronda (storages nuevos en `activitylog`) y el summary suma las rondas más `field_false_marks`
  (celdas marcadas que no eran objetivo), aparte de `field_errors`.
- **Bundles con doble t**: `loglettermatrix` (plan, prompt y catálogo escribían "logletermatrix";
  renombrar un bundle después es el gotcha 7, así que se corrigió antes de crearlo).
- **Sílabas explícitas** (`pan-ta-lón`) y **tocar en orden** en vez de arrastrar (accesible, sin
  gestos; tocar un hueco devuelve la ficha). La app baraja sin dejar nunca el orden correcto y
  evitando parejas consecutivas. Un fallo deja en ámbar las posiciones incorrectas, sin mensaje ni
  reinicio, hasta que el usuario las corrige (decisión del usuario al probar; antes se devolvían
  las fichas con un "Casi"); `field_attempts` cuenta los llenados completos hasta acertar y
  `field_correct` = a la primera. Para que nada salte, la bandeja conserva la altura que tiene con
  todas las fichas y el pie reserva siempre el hueco del botón "Siguiente".
- **Segmentación**: tocar una letra pone el espacio justo delante de ella, marcando el inicio de
  palabra (zonas de 48 px por letra, en vez de zonas minúsculas "entre" letras; decisión del
  usuario al probar, antes iba detrás). Bajo la frase se ven las barras pendientes de colocar
  (tantas como espacios tiene la frase) y desaparecen al ponerlas; no se pueden poner más de las
  necesarias y "Comprobar" se activa cuando no queda ninguna. Acierto parcial: los espacios
  correctos se fijan en verde y se quitan los demás (sus barras vuelven abajo).
- **Áreas**: no hizo falta ningún término nuevo (discriminación visual = Procesos Perceptivos,
  conciencia léxica = Competencia Lingüística).
- **Sin textos de instrucción durante el juego, en ningún tipo** (decisión del usuario al probar):
  la explicación va en la intro. Cada tipo declara `instructions(activity)` en su definición
  (`src/lib/activityKinds/`) y `ActivityBase` la muestra cuando el nodo no trae
  `field_custom_explanation` (la `instruccion` del lote, que manda si existe). Retirados de los
  players: "Toca para continuar" (lista vertical), "Lee el texto en voz alta" (lectura), "Memoriza
  la posición de cada imagen" (imágenes), "La que faltaba lleva un aro" (matriz), "¿dónde empieza
  cada palabra?" y las pistas de sílabas y segmentación. Se quedan el enunciado explícito
  ("Encuentra todas las p", "¿En qué posición estaba?"), el progreso discreto y los avisos de
  resultado ("Casi. Prueba otra vez.", acierto parcial) en un hueco de alto fijo para que nada se
  mueva; la bandeja de fichas y el bloque de acierto de las sílabas comparten altura por lo mismo.
- **Estadísticas**: `ACCURACY_SUMMARY_TYPES` / `isAccuracySummary` sustituyen a
  `IMAGE_SUMMARY_TYPE`; `computeAccuracy` lee primero `field_correct_count` / `field_items_count` y
  solo deriva de los logs si faltan. "Detalle de estadísticas" tiene una sección "Ejercicios con
  aciertos" (una tarjeta por actividad, `AccuracyEvolutionChart`, antes
  `ImagePositionEvolutionChart`) y el historial por sesión cuenta todos los tipos.
- **Importador**: handlers `LetterMatrixActivityHandler`, `SyllableOrderActivityHandler` y
  `WordSplitActivityHandler` en `shine_content` (contratos de `contenido` en el catálogo §6) y lote
  `shine/content/fase13-ejemplos-v1.json` (7 actividades Level0 a Level2, importado y publicado;
  cuadrículas generadas con semilla 20261021). Hallazgo: `hasAffectingChanges()` de
  entity_reference_revisions solo mira el primer delta, así que cambiar un paragraph que no es el
  primero no se detectaba como cambio; `ContentImporter` marca UPDATED también cuando el handler
  dice que el contenido difiere.
- **Backend creado por script** `drush php:script` idempotente (tipos, campos clonados de
  `activity_blink`, bundles clonados de `logimageposition` / `summary_image_position`, displays,
  `node.session.field_activities`, `field_activity_types` del mensaje de motivación) y después
  `drush cex`; el script no se versiona, la config exportada es la verdad. Contenido por entorno:
  tres `explanation_message` ("Letter matrix", "Syllable order", "Word split").

### Bugs encontrados por el camino

- `ActivityBase` renderizaba `field_custom_explanation` tal cual; con el importador el campo llega
  como objeto `{value, format, processed}` (text_long) y React rompía al abrir cualquier actividad
  importada con instrucción (también las de parpadeo de octubre). Arreglado con
  `formattedTextToPlain()` (`src/lib/stripHtml.ts`), tipo `CustomExplanation`.
- `expo start` con `CI=1` desactiva la vigilancia de ficheros: Metro sirve el bundle viejo tras
  editar. Arrancar sin `CI` (con `< /dev/null` si no hay terminal interactiva).
- La auto-evaluación de fin de sesión ("¿Cuál te ha costado un poco más?") y el "¿Cómo ha ido?"
  devolvían 422 al señalar una actividad nueva: `easiest_activity`, `hardest_activity`
  (`sessionfeedback`) y `activity` (`activityfeedback`) son campos base con `target_bundles`
  limitados a los tres tipos antiguos. Corregido añadiendo los tres a `ACTIVITY_BUNDLES` de las dos
  entidades y sincronizando la definición instalada con `sessionfeedback_update_11002()` y
  `activityfeedback_update_11001()` (`drush updb`). Verificado con POST 201 como usuario 2.

### Verificación (2026-10-21)

- Drupal: `drush cex` / `config:status` sin diferencias; segunda pasada del script y del lote sin
  cambios; kernel tests de `shine_content` 14 tests / 501 aserciones en verde; JSON:API como
  usuario normal (gotcha 14): sesión con los cuatro tipos incluidos, detalle de cada tipo con sus
  campos, POST 201 en los seis bundles nuevos y `filter[uid.id]` funcionando (gotcha 16).
- App: `tsc --noEmit` limpio, `lint` 0 errores, `jest` 22 suites / 166 tests (nuevos:
  `fase13Logic.test.ts`, `fase13Payloads.test.ts`, `formattedTextToPlain`).
- Recorrido en navegador (Expo web, usuario local de prueba `fase13@shine.test`, uid 6) con la
  sesión mixta "FASE 13 de prueba" (parpadeo + matriz + sílabas + segmentación): intro, juego y
  pantalla final de los tres; marca falsa que vuelve a neutro y aro ámbar en la que faltó; ronda que
  se cierra sola; "Casi" con fichas de vuelta; acierto parcial con espacio fijado. Summaries en BD
  con área, nivel, sesión y contadores (5/6 con 1 marca falsa; 4/5; 3/4) y logs por ronda / palabra /
  frase con `field_attempts`. "Mi progreso" 3 intentos y "Detalle de estadísticas" con los tres en
  "Ejercicios con aciertos" (83 %, 80 %, 75 %) e historial de la sesión. Sin errores en consola ni
  en watchdog.
- La sesión "FASE 13 de jose" (nid 36, uid 2) queda disponible para probar con jose@test.com.

### Pendiente / siguiente

- Revisión terapéutica del lote de ejemplo y lotes reales por nivel (y Level3 a Level10 cuando
  exista la escala completa).
- Variante de matriz "con regla" para Funciones Ejecutivas y Atención (sigue sin tipo principal).
- Imágenes de pista para las sílabas: el campo y el `include` existen, pero no hay banco de
  imágenes; el lote no usa `imagen`.
- Ejes de Victory con un solo intento muestran ticks "#0.9999…" (ya pasaba con imágenes; cosmético).

---

## FASE 16 — Nuevos ejercicios (segundo lote)
**Estado**: ✅ Completada (2026-10-21) — repetición rápida de palabra (prompt 16a): backend, app y la tercera familia de métrica (ritmo) en estadísticas. Pendiente: revisión terapéutica del lote de ejemplo y lotes reales por nivel.

### Qué hay

| Ejercicio | Node type | Bundles | Player | Lógica pura |
|---|---|---|---|---|
| Repetición rápida de palabra (16a) | `activity_rapid_repetition` (`field_words` múltiple = una ronda por palabra, `field_time_limit` obligatorio = segundos por palabra, igual para todas) | `lograpidrepetition` / `summary_rapid_repetition` (storage nuevo `field_repetitions` en los dos) | `RapidRepetitionPlayer` | `src/lib/rapidRepetition.ts` |

Por cada palabra: se enseña en grande, el tutor pulsa "Comenzar", la palabra desaparece y arranca
una cuenta atrás (barra ámbar, sin números) de `field_time_limit` segundos; el alumno la repite en
voz alta y el tutor toca un botón gigante por cada repetición completa ("Quitar una" para los
toques por error). Al llegar a 0 suena un aviso corto, el botón se bloquea con el número congelado
y aparece "palabra: N repeticiones". Un log por palabra; el summary suma. Métrica: ritmo =
repeticiones por segundo (derivado con `field_repetitions` y `field_time`, nunca guardado). Área
Velocidad; secundaria Lingüística. No cuenta errores ni aciertos. Modelado en
`docs/exercise-catalog.md` §6.4 y `docs/activity-system.md`.

### Decisiones

- **Sin contadores de acierto, ni en log ni en summary** (decisión 6 del prompt):
  `SessionEvaluator::effectiveRating()` degrada un "Demasiado fácil" a "Bien así" cuando el summary
  tiene `field_items_count > 0` y pocos aciertos. El bundle no tiene esos campos y el tipo no entra
  en `ACCURACY_SUMMARY_TYPES`. Hallazgo: con un bundle **sin** esos campos el evaluador reventaba
  (`get('field_items_count')` sobre un campo inexistente); ahora comprueba `hasField()` antes
  (`testNoAccuracyFloorWithoutCounters`).
- **Tercera familia de métrica, "ritmo"**: `RATE_SUMMARY_TYPES` / `isRateSummary` / `computeRate`
  en `src/lib/api/statistics.ts`; en `src/lib/stats/`, `StatsSummary.repetitions`, `rate(summary)`,
  `personalBest` con métrica `'rate'` ("mayor es mejor", misma prioridad que `accuracy`: un
  ejercicio tiene aciertos, ritmo o tiempo, nunca dos) y `baselineVsRecent` por ritmo si todos los
  intentos lo tienen. "Detalle de estadísticas" reparte los summaries en tres grupos (lectura,
  aciertos, ritmo); los de ritmo no caen en la gráfica de tiempo (el tiempo es fijo, saldría una
  línea plana) y tienen su sección "Ejercicios de ritmo" con `RateEvolutionChart` (barras de
  repeticiones por segundo por intento y tabla "17 repeticiones · 0,4 por segundo"). "Mi progreso"
  cuenta los tres grupos en los totales. La pantalla "Actividad completada" no muestra hoy la mejor
  marca (12d no la implementó), así que `'rate'` solo vive en la stats lib.
- **Tiempo límite por actividad** (`field_time_limit`, storage de la matriz, obligatorio aquí), no
  por palabra. `field_time` del log son los ms reales medidos con `Date.now()` desde "Comenzar"; la
  ronda la cierra un `setTimeout` y la barra `Animated` solo la dibuja.
- **Señal de fin de ronda**: `assets/sounds/round-end.wav` (160 ms, Mi5 con fundido, generado con
  un script propio; sin assets de terceros), cargado una vez con `expo-av`
  (`playsInSilentModeIOS`), descargado al desmontar; cualquier fallo se traga porque la señal
  visual (botón bloqueado, número congelado) está siempre. Háptica fuera de alcance: `expo-haptics`
  no está instalado (comentario en el player).
- **Sin textos de instrucción en el juego**: la consigna al tutor va en `instructions` del kind y
  en `field_custom_explanation` del lote. Huecos de alto fijo: escenario (la palabra antes de
  empezar, el botón gigante después), barra, "Quitar una", resultado y pie ("Comenzar" /
  "Siguiente" / "Terminar"). El ritmo en la pantalla final se escribe "0,4/s" (en el detalle de
  estadísticas, "0,4 por segundo").
- **Etiquetado fonológico obligatorio en este tipo** (§3.5): `ActivityHandlerInterface::
  requiresPhonologyTags()` (FALSE en los tipos anteriores, TRUE aquí) y `ContentImporter` exige al
  menos una de `sonoridad` o `esfuerzo` con lista no vacía. `desglose_tipos` y
  `grupo_fonetico_objetivo` se aceptan y no se guardan, como en el parpadeo.
- **`TimeBar` compartido** (`src/components/activities/TimeBar.tsx`): extraído de
  `LetterMatrixPlayer` sin cambiar su comportamiento.
- **Backend por script** `drush php:script` idempotente (en `shine/private/scripts/`, fuera de
  git): node type con `activity_options` sin contar errores, campos comunes clonados de
  `activity_word_split` (área por defecto Velocidad, secundaria Lingüística), `field_time_limit`
  de la matriz, storage nuevo `node.field_words`, bundles clonados de `logwordsplit` /
  `summary_word_split` sin `field_correct`, `field_attempts` ni contadores,
  `node.session.field_activities`, el mensaje de motivación y el `explanation_message` "Rapid
  repetition" (contenido por entorno). Después `drush cex` y `drush updb`
  (`sessionfeedback_update_11003`, `activityfeedback_update_11002`).

### Bugs encontrados por el camino

- El evaluador de niveles no toleraba summaries de un bundle sin `field_items_count` (ver
  decisiones): habría roto `POST /shine/session/{uuid}/complete` en cualquier sesión de ajuste con
  una repetición rápida valorada "Demasiado fácil".
- `Fase13HandlersTest` y `ContentImporterTest` fijaban la lista exacta de tipos importables;
  actualizados con el quinto.

### Verificación (2026-10-21)

- Drupal: `drush cex` / `config:status` sin diferencias; segunda pasada del script y del lote
  (`content/fase16-ejemplos-v1.json`: 3 actividades Level0 a Level2, publicadas, nids 39, 40 y
  41) sin cambios; kernel tests de `shine_content` 18 tests / 630 aserciones y
  `SessionEvaluatorTest` 21 tests en verde; como usuario 2 (gotcha 14): GET del nodo con
  `field_words` y `field_time_limit`, POST 201 en `lograpidrepetition` y
  `summary_rapid_repetition`, `filter[uid.id]` con datos en los dos (gotcha 16), POST 201 de
  `activityfeedback` y `sessionfeedback` sobre la actividad nueva. `shine-level:generate
  --dry-run` con un usuario nuevo: Velocidad Level0 pasa de 8 a 9 candidatas. Sin errores nuevos
  en watchdog.
- App: `tsc --noEmit` limpio, `lint` 0 errores, `jest` 25 suites / 187 tests (nuevos:
  `rapidRepetition.test.ts`, `rate.test.ts`, `fase16Payloads.test.ts` y casos de ritmo en
  `personalBest`, `baselineVsRecent` y `adapter`).
- Recorrido en navegador (Expo web, `jose@test.com`, sesión "FASE 16 de jose", nid 42, parpadeo +
  repetición rápida): intro con la consigna del tutor e icono `repeat`; por cada palabra, palabra
  en grande → "Comenzar" → palabra oculta, barra y botón gigante contando ("Quitar una" resta) →
  bloqueo a los 10 s con "mano: 6 repeticiones" → "Siguiente"; pantalla final con "Tu tiempo 40 s",
  "Repeticiones 17", "Ritmo 0,4/s" y sin "Errores". En BD, summary 117 con `field_repetitions` 17,
  área, nivel y sesión, sin contadores de acierto, y 4 logs (6, 2, 4 y 5). Con un segundo intento
  (23 repeticiones, creado por JSON:API como usuario 2), "Mi progreso" cuenta 2 intentos y
  "Detalle de estadísticas" muestra "Ejercicios de ritmo" con dos barras y la tabla.
- Nivel: sesión inicial real generada para un usuario desechable con la repetición rápida en el
  hueco de Velocidad, summary `summary_rapid_repetition` y "Demasiado fácil": la fila de Velocidad
  queda en Level0 con `probe_level` Level1 y abierta (el easy se conserva), mientras las áreas con
  "Bien así" cierran en Level0.

### Pendiente / siguiente

- Revisión terapéutica del lote de ejemplo (`content/fase16-ejemplos-v1.json`) y lotes reales por
  nivel (Level3 a Level10 cuando exista la escala completa).
- Háptica al cerrar la ronda cuando se instale `expo-haptics`.
- Mejor marca por ritmo en "Actividad completada" si 12d llega a mostrarla.
- Cosmético: el tile "Tiempo total" de "Mi progreso" recorta "1m 20s" en web (ya pasaba).

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

**Recorrido manual (2026-10-29, Expo web, titular jose con la alumna Marta y su token de alumno)**:
- Sesión regular con lista vertical, lectura en voz alta, parpadeo e imágenes: intro, juego,
  pantalla final y siguiente en los cuatro; contador de errores en los de texto; "Error y
  siguiente" en el parpadeo (`skip_on_error`); reiniciar a mitad vuelve a la intro con el contador
  a 0 y no guarda nada; salir a mitad deja la actividad pendiente y "Continuar" la retoma.
  Auto-evaluación de fin de sesión y `field_completed_at` puesto (sin `409 incomplete`),
  `field_operated_by` = jose.
- Sesión de ajuste (creada a mano, `periodic`, lista, parpadeo e imágenes): "¿Cómo ha ido?" en los
  tres, también en imágenes; los tres `activityfeedback` guardados; cierre correcto. Imágenes con
  `count_errors` y `skip_on_error` (activados de forma temporal en el **tipo** de contenido: son
  third-party settings del `NodeType`, expuestos como campos calculados, no un campo del nodo):
  contador, "Error y siguiente" en memorizar (pasa a la pregunta) y en preguntar (respuesta 0, sin
  acierto), tres métricas apiladas (tiempo, aciertos 3/4, errores 2).
- Red cortada al terminar (fallo simulado de las peticiones de tracking): aviso "No hemos podido
  guardar esta actividad", "Siguiente actividad" deshabilitado, y al recuperar la red "Reintentar"
  guarda un solo summary y desbloquea.
- Payloads: imágenes coincide campo por campo con el último summary anterior de Marta. El
  parpadeo nuevo lleva `field_errors` y la referencia no, pero la referencia la escribió el script
  de verificación por API de la FASE 18, no la app; la regla es la de los tests de oro.
- **Fallo encontrado y corregido**: con el aviso de guardado fallido (y en pantallas bajas), el
  cuerpo de la pantalla final, centrado y sin scroll, se desbordaba: el icono salía cortado por
  arriba y la tarjeta de motivación se metía debajo de "Siguiente actividad". Ahora el cuerpo va en
  un `ScrollView` (como la intro); comprobado en el navegador a 585 px de alto. `tsc` limpio, lint
  con los avisos de siempre, 293 tests en verde.
- Ojo al probar: `CI=1 npx expo start` desactiva la recarga al cambiar ficheros.

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

---

## Generador de contenido (docs/generador/)

Preparación del contenido generado automáticamente. Referencias: `docs/exercise-catalog.md` y los
tres documentos de `docs/generador/`.

### 01. Vocabularios de sonoridad y esfuerzo de decodificación (2026-10-16)

Solo Drupal. Implementa `docs/generador/Taxonomía fonológica.md` para categorizar las actividades
de lectura y texto por el material que trabajan. Detalle de uso en `docs/exercise-catalog.md` §3.5.

- **Vocabularios** (config): `sonority` y `decoding_effort`, de dos niveles (grupo y término
  concreto). 28 términos en sonoridad (continuas, oclusivas, pares sorda/sonora, inconsistencias
  grafema-fonema) y 18 en esfuerzo (bajo, medio, alto estructural, alto perceptivo). Cada término
  lleva en la descripción letras, ejemplos y motivo clínico. El tramo perceptivo se desglosa por
  pares (b-d, p-q, b-p, d-q, n-u, m-w): el resumen JSON del documento de origen omitía b-p y d-q.
- **Términos** (contenido, no viajan en `config/sync`): `shine/scripts/create-phonology-terms.php`,
  idempotente (crea, corrige padre, peso y descripción, nunca borra; falla si hay nombres
  duplicados). Añadido como paso de instalación en `CLAUDE.md`. Ejecutado dos veces: 46 creados y
  luego 46 sin cambios.
- **Campos**: `field_sonority` y `field_decoding_effort` (entity_reference a término, múltiples,
  opcionales), un storage cada uno compartido por `activity` y `activity_blink`. Formulario con
  checkboxes jerárquicos tras las áreas; vista con etiqueta inline. No se añaden a
  `activity_image_position` (trabaja con imágenes). Los tipos de texto de la FASE 13 deben
  reutilizar los storages.
- **Regla de etiquetado**: solo términos de segundo nivel; consultar por grupo con
  `filter[field_sonority.parent.name]=...`. El esfuerzo no sustituye a `field_activity_level` y el
  generador de sesiones no lee estos campos.
- **Entorno**: `settings.php` (no versionado) se había regenerado sin `config_sync_directory` y
  DDEV la fijaba en `sites/default/files/sync`, vacío: `config:status` daba los 523 objetos como
  "Only in DB". Corregido en local con `../config/sync` antes del include de DDEV (nota en
  `CLAUDE.md`). Antes de tocar nada se comprobó con `cim --source=config/sync` que la BD y el sync
  coincidían exactamente.

**Verificación** (usuario 2, gotcha 14, `account_switcher` + sub-request): `GET
/jsonapi/taxonomy_term/sonority` 200 con 28 términos y `decoding_effort` 200 con 18, con el padre
correcto ("Inversas (VC)" cuelga de "Esfuerzo medio"). Con A1 etiquetada de forma temporal:
`include=field_sonority,field_decoding_effort` trae los cuatro términos; `filter[field_sonority.name]=p/b`
da 1 resultado y `ll/y` 0; `filter[field_decoding_effort.parent.name]=Esfuerzo alto estructural` da
1 en `activity_blink` y 0 en `activity`. Formulario `/node/8/edit` como admin: 28 y 18 checkboxes
con sangría jerárquica. A1 se dejó sin etiquetas. `drush cex` solo exportó los 8 ficheros nuevos y
los 5 displays de los dos tipos; `config:status` sin diferencias. Sin errores nuevos en watchdog.

**Pendiente**: etiquetar contenido. Las actividades actuales (A1, A2) son de prueba; lo natural es
que el generador de contenido rellene `sonoridad` y `esfuerzo` desde la especificación (§4.3) y el
cargador los valide (§4.4).

### 02. Importador de lotes y primer lote de parpadeo (2026-10-16)

Módulo nuevo **`shine_content`** (`shine/public_html/modules/custom/shine_content/`) con el comando
**`drush shine-content:import {lote.json} [--dry-run] [--publish]`** que pedía
`docs/exercise-catalog.md` §4.4, y primer lote **`shine/content/blink-level0-2-v1.json`**: 20
actividades `activity_blink` de Level0 a Level2 (7, 7 y 6), ya etiquetadas por sonoridad y esfuerzo.
Los dos quedan en el repo (decisión del usuario): el lote es la fuente del contenido y se puede
reimportar.

**Importador.** `ContentImporter` (lo común a todo tipo) + un handler por node type
(`ActivityHandlerInterface`, tag `shine_content_handler`; hoy solo `BlinkActivityHandler`) +
`TermResolver` (todo por nombre, nunca por id) + `Coverage` (tabla área × nivel con la misma
definición de contenido que `LevelLadder::contentQuery`). Decisiones:
- **El lote es una unidad**: se validan todos los registros y con un solo error no se escribe
  nada (un lote regenerado a medias dejaría huecos y duplicados). Los errores se listan por
  registro y clave (`contenido.elementos[3]: ... supera los 20 caracteres del nivel`).
- **Contrato estricto**: claves desconocidas son error; `codigo` con prefijo del tipo y `Lnn` igual
  al nivel más bajo; `sonoridad` y `esfuerzo` solo de segundo nivel; `area_secundaria` distinta de
  la principal; `desglose_tipos` con una entrada por elemento y valores de una lista cerrada. El
  fichero puede ser una lista o un objeto con `actividades` (lo demás se ignora).
- **Crear o actualizar por código** y distinguir creada / actualizada / sin cambios
  (`hasTranslationChanges()`): reimportar el mismo lote no toca nada. El registro es la verdad
  completa (lo que no aparece se vacía). Con `activitysummary` el contenido queda congelado
  (§3.4) pero los metadatos se pueden cambiar.
- Sin publicar y con dueño el usuario 1 salvo `--publish`; nunca despublica. Escritura en una
  transacción.
- La ruta del lote es relativa al directorio desde el que se lanza el comando: Drush cambia al web
  root al arrancar, así que se resuelve con `$this->getConfig()->cwd()`.

**Lote.** Composición por nivel según la matriz 2.1 de `docs/generador/Especificación
Dislexia.md` (Level0: 4 CV + 2 alivio; Level1 y Level2: 4 objetivo + 2 pseudopalabras + 2 alivio)
y los ejemplos de la Guía de Parametrización §3, en minúsculas, con 3,0 / 2,5 / 2,0 segundos por
elemento. Familias: m, p, l, s, t, n, d (L0); f, ch, j, c/qu, z/ce/ci, ll/y e inversas (L1);
pl/pr, bl/br, tr/dr, fl/fr, cl/cr/gl/gr y pares pra/par (L2). Las etiquetas describen solo el
material objetivo, no los elementos de alivio (regla añadida a §3.5). Las pseudopalabras se
eligieron para no ser palabras en castellano ni en catalán. Es contenido de prueba: falta la
revisión del equipo terapéutico (§4.5).

**Tests kernel** (`ContentImporterTest`, 7 tests, 227 aserciones; reutiliza
`ShineLevelKernelTestBase`): creación con todos los campos, dry-run sin escribir, un error
rechaza el lote entero, 21 mensajes de validación, actualización por código con contenido
congelado por summary y metadatos editables, publicación y cobertura, actividad de ciclo fuera de
la cobertura. Hubo que recrear `public_html/sites/simpletest/browser_output` (ignorado en git).

**Verificación en el sitio**: `--dry-run` (20 por crear, 0 errores) → `--publish` (20 creadas,
nids 9 a 28) → segunda pasada 20 "sin cambios". Como usuario 2: 21 publicadas en Velocidad,
`filter[field_activity_level.name]=Level1` 7, `filter[field_sonority.name]=p` 3,
`filter[field_decoding_effort.parent.name]=Esfuerzo alto estructural` las 6 de L2, detalle con
texto, segundos, instrucción y términos incluidos. Cobertura de Velocidad: **8 / 7 / 6** (antes
1 / 0 / 0). `shine-level:generate 5 --dry-run`: Velocidad en Level0 tiene 8 candidatas y la sesión
inicial elige BLK-L00-VEL-002. Config exportada (`core.extension`). La BD local ya no tiene los
usuarios ni sesiones de prueba de la FASE 15 (se reinstaló limpia el 2026-10-16).

**Pendiente**: handler de `activity` (lista y lectura en voz alta) y de los tipos de la FASE 13;
lotes para las otras cuatro áreas (el bloque inicial sigue omitiendo Lingüística, Ejecutivas y
Perceptivos por falta de Level0); revisión terapéutica del lote. `docs/generador/Especificación
Dislexia.md` §5 muestra el comando con `--file=`; el real toma la ruta como argumento.

### 03. Huella de contenido, detección de duplicados e inventario (2026-10-21)

Pregunta de origen: cómo evitar, al generar cientos de actividades en lotes sucesivos, repetir
material que ya existe. Hasta ahora el importador solo detectaba duplicados **por código**: el
mismo material con otro código entraba sin aviso. Todo en `shine_content`, sin tocar la app.

**Huella de contenido.** `ActivityHandlerInterface` gana tres métodos que todo tipo tiene que
implementar: `extractContent` (el nodo en formato de lote, inverso de `applyContent`),
`canonicalContent` (lo que hace que dos actividades sean "la misma") y `units` (unidades léxicas
normalizadas con `Units::normalize`). Formas canónicas: conjunto de elementos sin orden ni segundos
(parpadeo, repetición rápida); palabras enteras sin sobrantes, imagen ni corte silábico (sílabas);
frases (segmentación); objetivos + dimensiones + cuadrículas sin orden de rondas ni tiempo
(matriz). `ContentFingerprint` (servicio `shine_content.fingerprint`, recoge los handlers con el
mismo tag que el importador) calcula `sha256(tipo, forma canónica)` y `hook_node_presave` lo guarda
en el campo nuevo **`field_content_hash`** (string 64, en los 7 bundles de actividad, oculto en los
formularios; config exportada con `drush cex`). `drush shine-content:rehash` lo recalcula en bloque.

**Detección en el importador.** Tras validar cada registro, `ContentFingerprint::check` lo compara
con todas las actividades existentes de su tipo (publicadas o no, con la huella calculada al
momento y no la guardada: un nodo sin huella no la esquiva) y con los registros anteriores del
lote. Error, y no se escribe nada: misma huella con otro código, o solapamiento de unidades
(Jaccard) del 80 % o más. Aviso, y se importa: solapamiento entre el 50 y el 80 %, y unidades que
ya están en 3 o más actividades del mismo tipo y nivel; los elementos marcados `alivio` en
`desglose_tipos` no cuentan para el sobreuso. La actividad del mismo código nunca es duplicado de
sí misma; los existentes que el propio lote sustituye tampoco. `ImportResult` gana `warnings`, el
informe una sección "Avisos (no bloquean)" y al final avisa si hay actividades sin huella guardada.

**Inventario.** `drush shine-content:inventory [--type --level --area] [--json | --out=f.json]`
(`Inventory`, servicio `shine_content.inventory`): cada actividad en formato de lote, tal como la
aceptaría el importador (probado: reimportar lo exportado da "sin cambios"), más `nid`,
`publicada`, `hash` y `unidades`; aparte `siguiente_codigo` por prefijo (contando despublicadas) y
`uso_unidades` (tipo, nivel, unidad, actividades). Es la lista de exclusión que se le da al
generador antes de escribir un lote. En tabla muestra además las unidades sobreusadas.

**Decisiones.** La comparación es por tipo: la misma palabra en un parpadeo y en un reordenamiento
no es duplicado (la mecánica es otra), y la huella incluye el tipo. La misma huella en dos niveles
sí lo es (error de etiquetado). Las actividades retiradas se despublican, nunca se borran:
conservan código, summaries y huella. El campo se creó con un script de un solo uso en
`private/scripts/` y se exportó con `drush cex`: no hay `hook_update_N` que lo cree, para no chocar
de UUID con `cim` según el orden de despliegue; en un entorno con contenido, tras `cim` hay que
lanzar `shine-content:rehash` una vez (el importador lo recuerda). La huella guardada es la
identidad de la actividad (JSON:API, vistas); la detección usa siempre la viva.

**Tests kernel**: 28 tests, 919 aserciones en el módulo (antes 18 / 630). Nuevo
`ContentFingerprintTest` (8 tests): huella estable ante orden, mayúsculas y segundos; duplicado
contra existente y dentro del lote; solapamiento 71 % aviso / 86 % error; sobreuso solo en el mismo
nivel y sin contar alivio; presave en nodos hechos a mano (también cuentan como existentes);
rehash de nodos sin huella con la detección intacta; inventario con reimportación sin cambios,
siguiente código y filtros. Round trip de huella e inventario en `Fase13HandlersTest` (matriz,
sílabas y segmentación, con duplicados reordenados, cortados de otra forma o en otro orden) y en
`Fase16HandlerTest`. Dos tests antiguos importaban el mismo material con dos códigos y ahora llevan
material distinto.

**Verificación en el sitio**: `shine-content:rehash` 31 actividades, 31 huellas (segunda pasada
0); inventario de Level0: 11 actividades, siguiente código por prefijo (BLK-L00-VEL-008,
MAT-L00-PER-002...), ninguna unidad sobreusada; `--out` escribe el JSON (8 parpadeos de Level0);
los tres lotes reimportados con `--dry-run` salen "sin cambios", 0 errores y 0 avisos; un lote
sintético con el material de BLK-L00-VEL-001 invertido bajo otro código da "contenido: idéntico al
de BLK-L00-VEL-001 (nodo 9)" y bloquea el lote, y uno con 5 de 6 elementos en común sale como aviso
"solapa el 71 %". Documentado en `docs/exercise-catalog.md` (3.4, 4.1, 4.4 y 8) y `CLAUDE.md`.

**Pendiente**: handler de `activity` (lista y lectura en voz alta) con su forma canónica y sus
unidades; aviso en los handlers de parpadeo y repetición rápida cuando todos los `alivio` de
`desglose_tipos` estén al final (hallazgo del primer lote, catálogo 5.3 y 8).

### 04. Banco de imágenes para posición de imágenes y sílabas (2026-10-21 a 2026-10-26)

Contenido, no código. Generado con ChatGPT Cowork (herramienta de imágenes integrada) a partir de
`docs/generador/Banco de imágenes.md`, que fija el estilo (vector plano, contorno carbón, colores
planos, sin fondo ni texto), el formato (512 x 512 PNG con alfa, margen del 14 %, alfa
normalizado), los nombres (fichero = slug ASCII; nombre del media = la palabra con tilde, única) y
la lista de 437 palabras en 19 categorías con silabeo, nivel lector, pista visual y etiquetas de
grupos de parecido (`vis:`) y fonológicos (`fon:`).

- **Resultado**: 432 imágenes aceptadas en `shine/content/images/` con `manifest.json` (el
  contrato para el importador y para los generadores de ejercicios); 5 descartadas en la revisión
  (mota, suma, tela, dama, codo). Hojas de contacto, resúmenes por prioridad y prompt de cada
  imagen en `shine/content/images/_revision/` (material de proceso, unos 33 MB).
- **Cómo se hizo**: 3 anclas aprobadas a mano (gato, manzana, coche) y después tres prioridades
  por lotes, con las anclas más hasta dos aceptadas de la misma categoría como referencia de
  estilo; revisión visual por hojas de contacto tras cada prioridad; regeneraciones puntuales
  (perro de pie, búho de frente, cara sin pelo, hormiga cenital, pizarra con dibujo de tiza) y
  poses uniformes dentro de cada grupo de parecido (felinos sentados de frente, aves y cánidos de
  perfil, vehículos mirando a la derecha, instrumentos de viento verticales).
- **Hallazgos**: el modelo entrega el interior del objeto con alfa entre 240 y 254 (se normaliza
  en posproceso); el recorte de transparencia se come las superficies planas grandes (pizarra) y se
  evita poniendo un detalle encima; el recuento anatómico no es criterio de rechazo (un cangrejo de
  seis patas se reconoce igual); las palabras de apoyo con doble sentido (mota, suma, tela) no
  salen inequívocas y se descartan sin insistir.
- **Hecho en la FASE 18, 02 (2026-10-26)**: `drush shine-content:import-images` crea los media
  (name y alt = slug, no la palabra: la clave es neutra entre idiomas) y
  `ImagePositionActivityHandler` crea los paragraphs `i1` / `i1_item` desde el lote (catálogo 4.4
  y 5.4); A3 y sus 3 fotos de prueba se borraron con el resto del contenido de demostración.
- **Pendiente**: decidir si `_revision/` sale del repo (hoy está versionado). Las parejas casi
  iguales (naranja y mandarina, carta y sobre...) solo deben coincidir en grupos de Level8 o
  superior (documento, sección 5.7).

---

### 05. Lista de texto y lectura en voz alta importables; escala de 11 niveles (2026-10-27)

Preparación para generar todo el catálogo (Level0 a Level10, dos idiomas, ocho tipos; decisiones
del 2026-10-27: 6 actividades por área y nivel, los dos tipos que faltaban se hacen ahora, el
experto revisa todo, no hay otro entorno de producción).

- [x] **Escala de 11 niveles**: los términos Level3 a Level10 los creó el usuario en el admin;
  `scripts/create-level-terms.php` (idempotente) deja los 11 con peso 0 a 10 y descripción con la
  edad y el curso de referencia (catálogo 2.2) y corrigió las descripciones viejas de Level0 a
  Level2 ("5 - 8 anys", "9 - 12", "13-16"). La escalera los ordena Level0 > ... > Level10.
  Catálogo 2.5 actualizado (pasos 1 a 3 hechos; queda el ritmo del bloque inicial).
- [x] **Handler `TextActivityHandler`** (shine_content) para el node `activity`: `contenido.formato`
  decide el ejercicio, `vertical_list` (lista de texto, código LIS: `elementos` sin repetidos,
  límite de caracteres por nivel, `segundos_por_elemento` opcional, `desglose_tipos` y
  `grupo_fonetico_objetivo` solo de revisión) o `audio_reading` (lectura en voz alta, código LEC:
  `parrafos`, palabras dentro del rango del nivel de la tabla 5.2 con un 10 % de margen, Level0
  rechazado, `segundos` de 10 a 600). Huella por formato y textos; unidades: elementos o frases.
  `ContentPrefixInterface` nueva: el importador pide el prefijo con el contenido. Kernel test
  `TextActivityHandlerTest` (5 tests); shine_content 42 tests OK. Dry-run real con LIS es, LEC es y
  LEC ca: 3 creadas.
- [x] `audio_reading` añadido a los valores permitidos de `field_activity_format` (config/sync,
  importado; `config:status` limpio).
- [x] App: el texto de `AudioReadingPlayer` va en un `ScrollView` (los textos de Level3 en adelante
  no cabían) con etiqueta accesible `player.audioReading.textLabel` en es y ca. tsc, lint y 288
  tests OK.
- [x] Petición de listas de frecuencia para el experto en
  plans/multiidioma/peticio-llistes-frequencia.md (una lista general por idioma de 20.000 formas
  con lema, categoría y frecuencia; una de vocabulario infantil de 5 a 8 años; fuente y licencia).
  Respuesta en resposta-peticio-llistes-frequencia.md: aprueba los umbrales, exige lema y
  categoría, recomienda fuentes (EsPal, CORPES/CREA y LEXESP; CTILC, Softcatalà o CQPweb y
  BDLOC/BDEC) y fija tres reglas (infantil en Level0 a Level2, quitar apóstrofo y clítico en
  catalán antes de buscar, nombres propios solo en lectura desde Level4). **No llegó ningún
  fichero**: las listas siguen pendientes. Formato y reglas en el catálogo 3.6; comprobador
  `shine/content/generadores/lexico.py` (selftest OK) listo para `shine/private/lexico/{es,ca}-{general,infantil}.csv`.
- [x] **Prompts y plan del catálogo completo (2026-10-28)**: plans/contenido/README.md (volumen,
  reparto de tipos por área, orden de trabajo, proceso por tanda, preguntas abiertas) y
  plans/contenido/prompts-es/03 a 09 (parpadeo, ciclo castellano de 38 familias, sílabas,
  repetición, segmentación, lista de texto y lectura en voz alta, con las reglas del castellano:
  silabeo RAE, ambigüedades como sopa/paso, enclíticos sin guion, pares a ver/haber); en catalán,
  08-llista-de-text.md y 09-lectura-en-veu-alta.md junto a los siete existentes. Los de matriz y
  posición de imágenes (01 y 02) ya eran bilingües. `generadores/matriz.py` cubre Level0 a Level6
  (`--levels` para generar solo algunos; Level0 a Level2 siguen saliendo idénticos al lote cargado).
  Pregunta abierta al experto: longitud de la lectura en voz alta (su guía, un párrafo de 35 a 75
  palabras; el catálogo 5.2, hasta 340 en 4 o 5 párrafos; manda el catálogo mientras no decida).
- [x] **Encargos para el grupo de expertos (2026-10-28)**: plans/contenido/encarrecs/E01 a E12
  (listas de frecuencia general e infantil por idioma, bancos de pseudopalabras, material de
  matriz de Level7 a Level10, grupos de imágenes de Level9 y Level10, cuatro decisiones
  pedagógicas, guía editorial y protocolo de revisión), con índice en su README y los adjuntos en
  lliuraments/ (pseudopalabras ya usadas, lista del banco de imágenes). El grupo es numeroso y
  revisa rápido: los lotes se generan en cuanto lleguen E10 y los bancos de los niveles bajos.
- [x] **Decisiones E10.1 a E10.3 del grupo (2026-10-28)** (plans/multiidioma/respostes-dubtes-expert.md
  y una segunda respuesta en el chat): lectura en voz alta de **un solo párrafo de 35 a 80 palabras
  en todos los niveles** (`TextActivityHandler::READING_WORDS` = [35, 80] y
  `MAX_READING_PARAGRAPHS` = 1; 32 a 88 con el margen; catálogo 2.3 y 5.2, prompts 09 de los dos
  idiomas; la primera respuesta decía 30 a 80, manda la segunda); nombres propios en la lectura
  desde Level1, cortos y de sílabas directas en Level1 y Level2 (`lexico.py`, `short_proper()`);
  manda la tabla de nivel mínimo por estructura (ejemplos de Level1 con trabadas anotados como
  error en la guía). Orden de lotes aprobado tal cual. shine_content: 42 tests OK. Sigue abierta
  E10.4 (Funciones Ejecutivas).
- [x] **Cambio de modelo con los expertos (2026-10-28)**: los entregables de los encargos los
  redactamos nosotros con Opus y el grupo los revisa. **E01 hecho (versión 2, CORPES XXI)**:
  `shine/private/lexico/es-general.csv` (87.611 formas, 102.001 filas, una por categoría con al
  menos el 10 % de la forma). Fuente: el listado de frecuencias del CORPES XXI 1.5 que pasó el grupo
  (en `shine/private/lexico/fuentes/`, fuera de git; lo dejaron en plans/ y se movió). Los
  elementos de varias palabras (tiempos compuestos, locuciones, nombres propios compuestos, 10,5
  millones de apariciones) se reparten entre sus palabras ("han" del rango 1.250 al 61). Ajuste
  peninsular: las formas de vosotros toman el rango de su equivalente de tercera del plural
  (tenéis = tienen) y vosotros/os/vuestro el de ustedes (82 formas; rango original en
  `rango_corpes`). La versión 1 (wordfreq + UD AnCora y GSD + revisión Opus completa en 8 tandas)
  queda como columna de contraste y aporta descartes y marcas; Opus revisó además las 1.772 formas
  del CORPES de las 25.000 primeras que la v1 no tenía. 1.198 descartes, 776 formas marcadas.
  Tubería en `shine/private/lexico/build/es-general/corpes.py`. Hoja para el grupo (muestra de 300,
  marcas, descartes, discrepancias y nueve criterios, entre ellos el ajuste de vosotros y el
  vocabulario infantil que el CORPES deja muy abajo): plans/contenido/encarrecs/lliuraments/E01-revisio.md.
  SUBTLEX-ESP (OSF oficial, CC BY-NC-SA 4.0, no comercial) añadido como columna de consulta, fuera
  del rango. **Registro de fuentes**: `docs/fuentes-de-datos.md` (cita, versión, fecha, licencia y
  uso de cada fuente; regla en CLAUDE.md). `lexico.py` lee la
  columna `marca` y la lista en el informe (no bloquea).
- [x] **E02 hecho (2026-10-28)**: `shine/private/lexico/ca-general.csv` (51.547 formas). Frecuencia de
  wordfreq (catalán; se prefirió a la lista de Softcatalà porque documenta sus corpus, y la de
  Softcatalà queda como contraste); lema y categoría de UD_Catalan-AnCora o del diccionario de
  Softcatalà (LanguageTool); normalización a la norma del IEC de 2017 con la clasificación de
  diacríticos de Softcatalà (144 formas con grafías antiguas sumadas; "sóc" pasa a "soc" y los
  compuestos van sin acento, aunque la lista del encargo decía otra cosa); enclíticos con apóstrofo
  sumados al verbo y elisiones como entradas ("l'", "d'"). Revisión Opus de las 36.000 primeras en 8
  tandas: 599 completadas, 1.850 correcciones, 2.610 descartes, 574 marcas (dialectal, malsonante,
  extranjera). Fuentes copiadas en `shine/private/lexico/fuentes/softcatala/` y registradas en
  `docs/fuentes-de-datos.md` §1.5; tubería en `shine/private/lexico/build/ca-general/`. Hoja para el
  grupo con nueve criterios: plans/contenido/encarrecs/lliuraments/E02-revisio.md.
- [x] **E03 y E04 hechos (2026-10-28)**: `shine/private/lexico/es-infantil.csv` (2.408 lemas, 26.878
  formas) y `ca-infantil.csv` (2.554 lemas, 12.511 formas), con columna `nivel`/`nivell` (0, 1, 2).
  Proceso híbrido aprobado por el grupo: lemas candidatos de la lista general, el banco de imágenes
  y los lotes revisados, más vocabulario añadido por temas; nivel por lema asignado por Opus (6
  tandas de clasificación y 2 de temas); formas del CORPES (es) y del diccionario de Softcatalà
  (ca), con futuro, condicional y presente de subjuntivo a nivel 1 como mínimo y sin imperfecto de
  subjuntivo (ni pretérito simple en catalán). Nuevo `shine/content/generadores/estructura.py`:
  silabeo y nivel mínimo por estructura de la tabla del catálogo, en los dos idiomas (columna
  `estructura_min`, informativa). `lexico.py`: lee la columna nivel de las listas infantiles (una
  palabra vale en LevelN si su nivel es N o menor) y extrae bien las palabras de ordena las
  sílabas. 75 conflictos catalanes entre la lista y los lotes ya revisados ("lupa", "puma" en
  Level0) para que decida el grupo. Hojas: plans/contenido/encarrecs/lliuraments/E03-revisio.md y
  E04-revisio.md.
- [x] **E05 a E11 hechos (2026-10-28)**: bancos de pseudopalabras (672 es, 670 ca; candidatas de Opus
  filtradas con el nuevo `shine/content/generadores/pseudo_filtre.py` contra 1,67 millones de formas
  reales de los dos idiomas, con la regla de una letra cambiada que conserva la primera letra);
  matriz de Level7 a Level10 y grafías catalanas de Level2 a Level6 (40 es, 70 ca) con el nuevo
  `generadores/matriz_conjuntos.py` (semilla fija); grupos de imágenes de Level9 y Level10 con dos
  opciones (A, grupos de 6: 41 imágenes nuevas es y 83 ca; B, grupos de 4: 11 y 29), validados por
  programa; propuesta para Funciones Ejecutivas (recomienda la matriz con regla, coste pequeño a
  medio); guías editoriales es y ca con sus decisiones a confirmar. Índice de envío a los revisores
  con ficheros y rutas: plans/contenido/encarrecs/PER-REVISAR.md; paquetes zip por encargo en
  `shine/private/enviament-2026-10-28/` (fuera de git). Hallazgo de la propuesta E10.4: el hueco de
  un área sin contenido se pierde en vez de pasar a otra área, y 4 de cada 5 sesiones regulares
  salen con 3 actividades de área (pendiente de corregir en `SessionGenerator`).
- [x] **E10.4 respondida (2026-10-29)**: el grupo elige, a corto plazo, que la matriz y la repetición
  rápida computen como secundaria de Funciones Ejecutivas (la matriz ya lo hacía; la repetición pasa
  de Lingüística a Ejecutivas en los lotes, los nodos, el catálogo 6.4 y los prompts 06) y, como
  desarrollo, la matriz con regla (propuesta 3.1). Corregido `SessionGenerator::planRegular()`: solo
  rotan las áreas con contenido en su nivel o por debajo (`hasContentUpTo()`) y un hueco sin
  candidatas pasa a la siguiente área; Marta y Pau vuelven a tener 4 actividades de área por
  sesión. shine_level: 61 tests OK (nuevo `testRegularSkipsAreasWithoutContentAndRefillsSlots`).
- [x] **Lote del ciclo castellano (2026-10-29)**: `shine/content/ciclo-silabas-es-v1.json`, 38 actividades
  de parpadeo en 6 bloques (pesos 10 a 380), generado con `shine/content/generadores/ciclo_silabas_es.py`
  (tabla de familias a mano, vuelta desordenada con `random.Random(peso)`); importado **sin
  publicar** (dry-run limpio). Revisión del grupo en plans/contenido/revision/ciclo-silabas-es-v1.md
  (paquete `LOT-ciclo-silabas-es-v1.zip`). Tras la revisión: correcciones, `--publish` y
  `shine-level:generate 42 --dry-run` con el hueco de ciclo.
- [x] **Etiquetas fonológicas (2026-10-29)**: `estructura.py` calcula los términos de `decoding_effort` de
  una palabra y de una actividad (`structure_terms`, `activity_effort`: las estructuras de nivel más
  alto del material) y `generadores/etiquetar_lote.py` comprueba o rellena `esfuerzo` en ordena las
  sílabas, segmentación, lista de texto y repetición rápida, y avisa de las palabras con estructura por
  encima del nivel. Rellenadas las 12 de ordena las sílabas y las 8 de segmentación ya importadas
  (reimportadas sin `--publish`: conservan su estado). Prompts 05, 07 y 08 de los dos idiomas con la
  regla (`esfuerzo` obligatorio; `sonoridad` solo si se trabaja un grupo fonético) y paso añadido al
  proceso por tanda. Hallazgos: en los lotes de ejemplo de la FASE 13 hay "za" y "gato" en Level0 y
  "brilla" en Level1 (se sustituyen en la tanda 2); en segmentación catalana de Level2, "verd", "els"
  y "nens" (Level3 por la tabla), pregunta al grupo en PER-REVISAR.md. La matriz lleva esfuerzo solo
  con letras espejo (las 9 de Level0 sin pareja espejo quedan sin él) y la posición de imágenes no
  tiene estos campos.
- [x] **Tanda 2, Level0 a Level2 (2026-10-29)**: 9 lotes importados **sin publicar**, 48 registros (64 nodos):
  castellano `silabas-es-level0-2-v1` (6), `segmentacion-es-level1-2-v1` (3), `lista-es-level0-2-v1` (9),
  `lectura-es-level1-2-v1` (2), `repeticion-es-level0-v1` (1); catalán `llista-ca-level0-2-v1` (9),
  `lectura-ca-level1-2-v1` (2); bilingües `matriz-es-ca-level0-2-v2` (8, con `matriz.py --targets`) e
  `imagenes-es-ca-level0-2-v2` (8). Textos escritos por dos agentes Opus con los prompts como contrato;
  comprobaciones independientes limpias (estructura, puerta léxica infantil, dry-run). Al aprobarse,
  todas las celdas de Level0 a Level2 quedan con 6 o más en los dos idiomas y se despublican
  SIL-ES-L00-LIN-001, SIL-ES-L00-LIN-002 y SEG-ES-L01-LIN-001. Revisión:
  plans/contenido/revision/tanda2-level0-2.md (paquete `LOT-tanda2-level0-2.zip`). Nuevo
  `generadores/revision_lote.py` (fichero de revisión de cualquier lote). Corregidos de paso: el
  catálogo 5.2 (la lectura vuelve a tener secundaria Lingüística; el cambio de E10.4 era para 6.4) y
  `estructura.py` (cranc y tronc, monosílabos con trabada y coda nc, en Level2 como dice la tabla).
- [x] **Respuestas del grupo aplicadas (2026-10-29)**: once respuestas en
  plans/contenido/encarrecs/lliuraments/respostes-2026-10-29/. Ciclo castellano y tanda 2 aprobados con
  cambios (lata, prisa, boxeo, gue/gui; pato en SIL-ES-L00-LIN-005) y **publicados**; despublicados
  SIL-ES-L00-LIN-001, SIL-ES-L00-LIN-002 y SEG-ES-L01-LIN-001 (siguen en los lotes de ejemplo de las
  fases 13 y 18: no reimportarlos con `--publish`). Puerta léxica (`lexico.py`): rescate infantil desde
  Level3, lema más tiempo verbal, malsonante bloqueado, sensible bloqueado por debajo de Level5 y
  comprobación de tiempos en lectura y segmentación (corregido LEC-ES-L02-VEL-001). Listas ajustadas
  con `generadores/ajustos_llistes.py` (idempotente). E07 y E08 regenerados con sustituciones dentro
  de la misma familia de forma. E09: castellano opción A, catalán mixta con Level9 rehecho sin
  profesiones abstractas (`generadores/e09_definitiu.py`, lliuraments/E09-revisio-resposta.md); 37
  etiquetas visuales nuevas en el manifiesto; 22 imágenes pendientes del lote 2 ya no hacen falta.
  E10.4: detalle en plans/funcions-executives/README.md. E11: guías aprobadas y ajustadas (diálogo por
  nivel, futuro y condicional en Level4, mitad de textos neutros de Level0 a Level3, lugares por
  nivel), prompts 07, 08 y 09 y catálogo 5.2. Dudas abiertas: muestras de 300 filas de E01 a E04 sin
  resultado, casos dudosos de malsonante y sensible, tilde de las pseudopalabras (trumidal) y el
  "els" catalán en Level2.
- [x] **Segunda ronda de respuestas (2026-10-29)**: muestras de E01 a E04 revisadas (listas
  aceptadas); tilde de las pseudopalabras solo con la regla general; en catalán, Level2 admite els,
  al, als, del, dels, pel, pels y los plurales regulares en -ns y -ls de una base de Level1 o Level2
  (`estructura.py`, catálogo 3.5, estructura-ca.md, guía catalana, prompts 07 y 08; columna
  `estructura_min` de `ca-infantil.csv` recalculada, 253 filas). "verd" sigue en Level3:
  SEG-CA-L02-LIN-001 pasa de "un drac verd i gros" a "un drac groc i gros" (mismo código; borrados
  antes su summary y sus 3 logs, de Pau, cuenta de prueba: hoy todos los datos y usuarios son de
  prueba, decisión del usuario). Dudas abiertas: marcas malsonante,
  sensible o ninguna (tabla en PER-REVISAR.md), gust y camp (st y mp) y al, del y pel.
- [x] **Tanda 3, Level3 (2026-10-29)**: 15 lotes importados **sin publicar**, 49 actividades (24 es,
  25 ca): por idioma `silabas`, `segmentacion`, `lista`/`llista`, `blink`, `repeticion` y `lectura`
  `-{es,ca}-level3-v1` (12 registros por idioma, escritos por dos agentes Opus con los prompts como
  contrato), y bilingües `matriz-es-ca-level3-v1` (`matriz.py --seed 20261030 --levels 3 --targets
  "L3=b,d,p,q,n,u" --first "L3=2"`: el 001 catalán es la matriz de l·l de `matriz-ca-level3-v1`, que
  entra ahora) e `imagenes-es-ca-level3-v1` (`imagenes.py --seed 20261030 --levels 3 --per-level 6`).
  6 por área y nivel en los dos idiomas (Perceptivos 7 en catalán). Comprobaciones repetidas por
  separado: estructura, puerta léxica y dry-run limpios. Revisión: plans/contenido/revision/tanda3-level3.md
  (siete decisiones para validar: mezcla del parpadeo 5 + 2 + 3, sin término de esfuerzo para hiatos,
  lectura sin diálogo...), paquete `shine/private/enviament-2026-10-30/LOT-tanda3-level3.zip`.
- [x] **Tanda 3 aprobada y publicada (2026-10-29)**: el grupo aprueba las 49 actividades y las siete
  decisiones sin cambios (respostes-2026-10-30/LOT-tanda3-level3-resposta.md). Decisión 2: término de
  esfuerzo nuevo **Hiatos** (es) / **Hiats** (ca) en "Esfuerzo alto estructural"
  (`scripts/phonology-terms.{es,ca}.json`, `create-phonology-terms.php`), `estructura.structure_terms()`
  lo da a toda palabra con hiato; 12 actividades de Level3 reetiquetadas y reimportadas.
- [x] **Tanda 4, Level4 (2026-10-29)**: 14 lotes `*-level4-v1` importados **sin publicar**, 48
  actividades (24 es, 24 ca): textos por dos agentes Opus con los lotes aprobados de Level3 como
  modelo, `matriz.py --seed 20261029 --levels 4 --targets "L4=b,d,p,q,n,u"` e `imagenes.py --seed
  20261029 --levels 4 --per-level 6`. Comprobaciones repetidas por separado, limpias. Revisión
  plans/contenido/revision/tanda4-level4.md (ocho decisiones: parpadeo castellano 7 + 3 frente al 5 +
  2 + 3 catalán, futuro en segmentación, pronombres débiles en la lectura catalana, lugares reales,
  tusòria...), paquete `shine/private/enviament-2026-10-29-tanda4/LOT-tanda4-level4.zip`.
- [x] **Tanda 4 aprobada y publicada (2026-10-29)**: las 48 actividades y las ocho decisiones sin
  cambios (respostes-2026-10-30/LOT-tanda4-level4-resposta.md). Decisión 1: modelo mixto de
  parpadeo desde Level3 (palabras reales + pseudopalabras + 25 a 30 % de alivio), escrito en los
  prompts 03 de los dos idiomas.
- [x] **Lotes de Level9 y Level10 de posición de imágenes, escritos (2026-10-29)**:
  `generadores/e09_lots.py --seed 20261029` reparte los 36 grupos definitivos de E09 por nivel e
  idioma en 6 actividades de 6 grupos sin repetir imagen dentro de una actividad (en Level10 los
  grupos de pares mínimos comparten imágenes; por orden salían 45 repeticiones en catalán) y, si se
  puede, sin repetir familia; posición preguntada central. `imagenes-{es,ca}-level9-10-v1.json`, 12
  actividades por idioma. El dry-run solo falla por las 25 imágenes de la tirada del 2026-10-30
  (las 20 pendientes y las 5 repeticiones): tras la tirada, `fusionar_ampliacion122.py`,
  `import-images` y el import de estos dos lotes. Level8 (parecidas en forma o color) no sale de
  E09: se monta en la tanda 8 con el prompt 02.
- [x] **Tanda 5, Level5 (2026-10-29)**: 14 lotes `*-level5-v1` importados **sin publicar**, 48
  actividades (24 es, 24 ca), mismo circuito que la tanda 4 (`matriz.py` e `imagenes.py --seed
  20261029 --levels 5`). Parpadeo con el modelo mixto. Revisión plans/contenido/revision/tanda5-level5.md
  (ocho decisiones: sílabas sobrantes, termómetro, pronombres combinados en segmentación, etiqueta de
  hiato demasiado ancha...), paquete `shine/private/enviament-2026-10-29-tanda5/LOT-tanda5-level5.zip`.
- [x] **Tanda 5 aprobada y publicada (2026-10-29)**: las 48 y las ocho decisiones sin cambios
  (respostes-2026-10-30/LOT-tanda5-level5-resposta.md). Termómetro permitido en los dos idiomas;
  pronombres combinados (li ho, se'n) en segmentación desde Level7 (prompt 07 catalán); la etiqueta
  de hiato solo si al menos un tercio de las palabras lo tienen (`estructura.HIATUS_SHARE`,
  `activity_effort`): 17 actividades de Level3 a Level5 reetiquetadas y reimportadas.
- Tanda 6 (Level6, en curso, 2026-10-29): `matriz-es-ca-level6-v1` e `imagenes-es-ca-level6-v1`
  importados sin publicar (24 nodos). `imagenes.py` no llegaba a 6 actividades en Level6 (relación
  estrecha): si la primera imagen de un grupo no deja completarlo, ahora prueba la siguiente como
  primera y libera las del intento (los lotes que ya salían bien salen iguales; comprobado con
  Level5). Textos por dos agentes con los lotes de Level5 como modelo.
- Tanda 6: textos de los dos agentes comprobados por separado e importados sin publicar; 48
  actividades en total. Revisión plans/contenido/revision/tanda6-level6.md (siete decisiones: sílabas
  sin dibujo, lecturas expositivas, enclíticos con apóstrofo...), paquete
  `shine/private/enviament-2026-10-29-tanda6/LOT-tanda6-level6.zip`.
- [x] **Tanda 6 aprobada y publicada (2026-10-29)**: las 48 y las siete decisiones sin cambios
  (respostes-2026-10-30/LOT-tanda6-level6-resposta.md).
- [x] **Taxonomías ampliadas (2026-10-29, a petición del usuario: agrupar siempre por sonoridad y
  dificultad)**: sonoridad es + ñ, b/v, h muda, r/rr; ca + grafies r/rr; grupo de esfuerzo nuevo
  "Esfuerzo morfológico y léxico" / "Esforç morfològic i lèxic" (Polisílabas, Compuestas,
  Derivadas, Pronombres átonos / Pronoms febles, Homófonos y parónimos), 9 + 7 términos creados.
  `activity_effort` añade Polisílabas (la mitad o más de las palabras con 4 o más sílabas). 40
  actividades de Level3 a Level6 reetiquetadas y reimportadas. Pendiente de validar por el grupo.
- Tanda 7: `matriz.py` amplía Level7 (sílabas trabadas compartibles: bra, dra, pra, pla, tra,
  gra entre su inversión y otras trabadas; instrucción de sílabas; esfuerzo de trabada).
  `imagenes-es-ca-level7-v1` con semilla 20261030 (con la de Level6 la primera actividad repetía
  el 83 % de la de Level6). Los dos importados sin publicar.
- [x] **Sonoridad en lo ya publicado (2026-10-29)**: `generadores/sonoritat.py` propone, para cada
  actividad sin `sonoridad`, el grupo de so que ya comparten sus palabras de trabajo (sin las de
  alivio: un sonido o grafía en el 80 %, o una oposición con las dos bandas en el 30 % y juntas en el
  80 %). Revisadas a mano: 28 actividades de Level3 a Level6 etiquetadas (r y l en las trabadas, s
  en las codas ns/bs, t en las codas finales catalanas, grafies l/ll/l·l en la ela geminada) y
  reimportadas publicadas. Descartadas las coincidencias (t/d o r en ordena las sílabas y en las
  compuestas). Las otras 53 actividades no comparten ningún grupo: se agruparán al escribir nuevas.
- **Corregido (2026-10-29)**: `create-phonology-terms.php` buscaba el término con
  `loadByProperties`, y la comparación de MariaDB no distingue la ñ de la n: al añadir "ñ" sobrescribió
  la descripción y el peso de "n". Ahora filtra por el nombre exacto; "n" restaurado y "ñ" creado
  (término 147). `TermResolver` del importador ya comparaba en PHP por nombre exacto.
- Tanda 7: textos de los dos agentes (con la regla de sonoridad y dificultad: cada actividad con su
  grupo de so y su esfuerzo) comprobados por separado e importados sin publicar; 48 actividades.
  Revisión plans/contenido/revision/tanda7-level7.md (siete decisiones, la primera los términos
  nuevos), paquete `shine/private/enviament-2026-10-29-tanda7/LOT-tanda7-level7.zip`.
- [x] **Tanda 7 aprobada y publicada (2026-10-29)**: las 48 y las siete decisiones sin cambios,
  incluidos los términos nuevos de las taxonomías (respostes-2026-10-30/LOT-tanda7-level7-resposta.md).
- Tanda 8 (Level8, en curso, 2026-10-29): `imagenes.py` genera Level8 (relación `visual`: el grupo
  comparte una etiqueta vis:, con las parejas casi iguales permitidas; `--avoid` con los cuatro
  oficios que el grupo quitó de E09) y `matriz.py` Level8 (doble objetivo de sílabas trabadas, bra
  y dra, repartido a partes iguales; la salida de los niveles de un solo objetivo no cambia,
  comprobado con Level3 y Level7). Los dos importados sin publicar; textos por dos agentes.
- **Corregido (2026-10-29)**: `lexico.py` marcaba "així" y "matí" como pretérito simple (la
  morfología de Softcatalà las tiene también como formas raras de aixir y matar). Ahora la
  comprobación de tiempos se salta las formas que las listas solo conocen como no verbo
  (`Lexicon.never_verb`, columna categoria); menjà se sigue marcando.
- Tanda 8: textos importados sin publicar (listas de 15 elementos en Level8, como el catálogo 5.1: el
  primer encargo decía 12 por error y se corrigió). 48 actividades. Revisión
  plans/contenido/revision/tanda8-level8.md, paquete
  `shine/private/enviament-2026-10-29-tanda8/LOT-tanda8-level8.zip`.
- [x] **Tanda 8 aprobada y publicada (2026-10-29)**: las 48 y las siete decisiones sin cambios
  (respostes-2026-10-30/LOT-tanda8-level8-resposta.md).
- Tanda 9 (2026-10-29): 14 lotes `*-level9-v1` importados sin publicar (36 actividades), con las
  matrices de palabras escritas por idioma (`matriz-{es,ca}-level9-v1`, 3 × 7, 6 objetivos entre
  pseudopalabras de una letra cambiada) y dos sílabas sobrantes en ordena las sílabas (catálogo
  6.2). La revisión incluye la posición de imágenes de Level9 y Level10 (pendiente de la tirada).
  Revisión plans/contenido/revision/tanda9-level9.md, paquete
  `shine/private/enviament-2026-10-29-tanda9/LOT-tanda9-level9.zip`.
- [x] **Tanda 9 aprobada y publicada (2026-10-29)**: las 36 y las siete decisiones sin cambios,
  incluida la posición de imágenes de Level9 y Level10, que se importa y publica tras la tirada
  (respostes-2026-10-30/LOT-tanda9-level9-resposta.md).
- Tanda 10 (2026-10-29), la última: 14 lotes `*-level10-v1` importados sin publicar (36
  actividades), matrices de doble objetivo con palabras reales por idioma. Comprobado que el
  fichero temporal compartido por los dos agentes no mezcló idiomas. Revisión
  plans/contenido/revision/tanda10-level10.md, paquete
  `shine/private/enviament-2026-10-29-tanda10/LOT-tanda10-level10.zip`.
- [x] **Tanda 10 aprobada y publicada (2026-10-29)**: la primera respuesta del grupo citaba material
  que no era el del lote (su herramienta no leyó el paquete); se pidió una revisión complementaria de
  las actividades afectadas, que sí cita el material real y lo aprueba
  (respostes-2026-10-30/LOT-tanda10-level10-resposta*.md). **El catálogo de texto y matriz de
  Level0 a Level10 está publicado en los dos idiomas.** Lección: comprobar siempre que la revisión
  cita el material del lote antes de publicar.
- [x] **Datos privados bajo git (2026-10-29)**: `shine/private/lexico`, los `shine/private/enviament-*` y
  `shine/content/images/_revision` se movieron a `dades-privades/` (git de docs, privado) y en su
  sitio quedan enlaces simbólicos, así que las rutas de los scripts y de esta documentación siguen
  valiendo; `shine/private/scripts` se copia a `dades-privades/scripts-copia` (el original se ejecuta
  en ddev). Fuera de git: el CORPES (130 MB, límite de GitHub), las claves OAuth, settings.php y las
  copias de base de datos. `_revision` y `__pycache__` dejan de estar en el git de Drupal. Mapa y
  cómo recrear los enlaces en `dades-privades/README.md`. Comprobado: lexico.py, la fusión de
  imágenes, etiquetar_lote y el dry-run del importador funcionan a través de los enlaces.
- [x] **Últimas dudas del grupo cerradas (2026-10-29)**: respuesta en
  `plans/contenido/encarrecs/lliuraments/respostes-2026-10-30/dubtes-oberts-resposta.md`. Marcas de
  las listas (`ajustos-llistes.json` + `ajustos_llistes.py`): cul, teta, tonto/tonta (también en
  castellano), canalla, chusma, gentuza y desgraciado/desgraciat, sensibles; pixa y todas las formas
  de cardar, malsonantes; pitu y tita, sin marca. Catalán: se retira la excepción de Level2 de
  monosílabos con coda doble (2026-10-27); en `estructura.py` Level2 solo admite las formas
  gramaticales (els, al, als, del, dels, pel, pels) y los plurales regulares en -ns y -ls; dent, pont,
  porc, gust, camp... son Level3. Recalculados `estructura_min` de `ca-infantil.csv` (72 palabras) y
  la `lectura` catalana de 12 imágenes del manifiesto. Corregidas REP-CA-L02-VEL-003 (nens, pals en
  lugar de dent, pont; summary de prueba borrado) e IMG-L02-MEM-004 (pantera y libro en lugar de topo
  y concha). Catálogo, taxonomía y guía catalanas, banco de imágenes, estructura-ca y prompt 06
  actualizados.
- Pendiente (siguiente): tirada de imágenes del 2026-10-30 (fusión, import-images, posición de
  imágenes de Level9 y Level10, ya aprobada); Funcions Executives de 3 a 6 por celda.

## FASE 17 — Monetización y modelo de cuentas

Implementa `docs/monetization.md` siguiendo los subplanes de `plans/entitlement/` (orden y
modelo en su README).

### 01a. Backend: campos de cuenta, rol de alumno y consentimiento (2026-10-23)

Módulo nuevo **`shine_account`** (`package: shine`). Los campos son config exportada en
`shine/config/sync` (creados con un script de un solo uso en `private/scripts/` y `drush cex`);
en el módulo solo hay código.

- **`user`**: `field_account_kind` (list_string requerido, `holder` | `learner`, por defecto
  `holder`), `field_adult_consent` (boolean, por defecto falso), `field_adult_consent_at`
  (timestamp), `field_archived_at` (timestamp) y `field_avatar` (string 32). Ninguno traducible.
  En el formulario del usuario: tipo de cuenta (solo lo ve quien tiene `administer users`, para
  reclasificar a mano) y la casilla de consentimiento (solo en el alta: admin y registro web); el
  resto oculto. Ocultos en las vistas.
- **`node.session`**: `field_operated_by` (referencia a usuario, opcional). Vacío hasta el
  subplan 02. En el formulario y la vista por defecto junto a los demás campos de sistema.
- **Consentimiento**: `hook_user_presave` fija `field_adult_consent_at` cuando el booleano pasa
  a verdadero (cuenta nueva, o antes era falso) y está vacío; no lo vuelve a tocar. Restricción
  `ShineAdultConsent` (plugin `Constraint` + `hook_entity_bundle_field_info_alter`): falla si la
  cuenta es nueva, el usuario actual es anónimo y el valor no es verdadero. Cubre el registro REST
  y el formulario web de registro; drush (no valida la entidad) y el admin (tiene sesión) quedan
  fuera.
- **Campos del servidor**: `hook_entity_field_access` deniega `edit` de `field_account_kind`,
  `field_adult_consent_at`, `field_archived_at` y `field_operated_by` sin `administer users`, y
  de `field_adult_consent` en cualquier cuenta ya guardada.
- **Rol `learner`** ("Alumno"), sin permisos (`user.role.learner.yml`).
- **Correo**: `hook_mail_alter` quita de `to` las direcciones `@shine.invalid` y anula el
  correo si no queda ninguna (`send = FALSE`, sin error en el log). El validador de Drupal acepta
  `learner+{uuid}@shine.invalid` (58 caracteres, cabe en el username de 60): se queda el dominio
  del diseño.
- **Reclasificación**: `shine_account_update_11001` pone `holder` y consentimiento sin hora a
  los usuarios que no los tienen. Aplicada en local a los 4 existentes (1, 2, 5 y 6): ninguno es
  un alumno.

**Desviación del subplan (técnica, no de diseño)**: Drupal registra un módulo nuevo con la
versión de su última update **antes** de `hook_install`, así que una `hook_update_N` en un módulo
recién creado no corre nunca. `shine_account_install()` deja la versión en 11000 para que la
11001 quede pendiente: en cada entorno, `drush cim` (instala el módulo y crea los campos) y luego
`drush updb`. Si los campos aún no existen la update lanza `UpdateException` y sigue pendiente.
Para que la update no invente una hora de consentimiento, marca la entidad con
`shineLegacyConsent` y el presave la respeta. Anotado como gotcha 21 en `CLAUDE.md`.

**Verificación** (usuario 2 con token real de password grant, gotcha 14):
- `POST /user/register?_format=json` sin `field_adult_consent` o con `false` → 422
  `field_adult_consent: You must confirm...`; con `field_account_kind: learner` → 403 (`Access
  denied on creating field`); con `{"value": true}` → 200, `holder` y `field_adult_consent_at`
  relleno.
- `drush user:create prueba ...` crea sin consentimiento (`holder`, consentimiento falso); el alta
  desde `/admin/people/create` sin marcar la casilla, también.
- `PATCH /jsonapi/user/user/{uuid}`: `field_account_kind`, `field_adult_consent`,
  `field_adult_consent_at` y `field_archived_at` → 403; mismo valor de `field_account_kind` → 200;
  `field_dyslexic_font` → 200 en ambos sentidos. `GET /jsonapi/node/session` trae
  `field_operated_by` con `data: null`.
- Alumno de prueba creado por un titular autenticado (sin violaciones de validación) y correo al
  alumno anulado; en una lista mixta solo sale la dirección real. Usuarios de prueba borrados.
- `drush updb` aplicó la 11001 (4 usuarios) y después "No database updates required";
  `drush cim -y` sin cambios y `config:status` limpio; tests de `shine_level` 53/53 (1249
  aserciones); watchdog sin errores nuevos (solo los warnings de los 4xx provocados).
- `docs/api-design.md`: corregido Capacitor (Expo + EAS Build), registro con consentimiento y su
  422, tabla "Campos de cuenta" y `field_operated_by` en Sesiones. `docs/monetization.md` §1,
  §3.1 (tabla con los campos reales; `field_organization` se crea en 10) y §3.2 (`field_avatar`
  en lugar de `user_picture`, email sintético comprobado).

**Para subplanes siguientes**:
- **Gotcha 20 (02, 05)**: simple_oauth borra los access tokens de un usuario en **cada**
  guardado del usuario. El token de alumno no tiene refresh: cualquier `save()` del usuario alumno
  lo invalida, también el de `SessionEvaluator` al pasar `field_onboarding_state` a `regular` al
  cerrar el bloque inicial. La app (05) debe volver a pedir el token de alumno ante un 401, o 02
  debe evitar el borrado para el grant de alumno.
- **02 o 01b**: con su propio token, el alumno puede hacer `PATCH` de su `field_display_name`,
  `field_avatar` y `field_dyslexic_font` (es el dueño de su usuario). El diseño dice que nombre y
  avatar solo los edita el `owner` vía `/shine/learners/{uuid}`: si se quiere cerrar, ampliar el
  `hook_entity_field_access` de `shine_account` para cuentas `learner`.
- **05**: la app no envía `field_adult_consent` y hoy convierte ese 422 en
  `AuthError('validation')`; reconocerlo por `field_adult_consent:` en el mensaje.
- `field_account_kind` vacío no debería darse ya (requerido, por defecto `holder`, update
  aplicada); aun así, el `access_check` de titulares (01b) debe tratar vacío como `holder`, igual
  que `shine_level` trata `field_onboarding_state` vacío como `evaluating`.

### 01b. Backend: alumnos, `learner_access`, `/shine/me` y borrado de cuenta (2026-10-23)

Todo en `shine_account`. Código y tests en el módulo; en `config/sync` solo la vista
`views.view.shine_learners`. Detalle de la API en `docs/api-design.md` ("Cuentas y alumnos").

- **Entidad `learner_access`** (sin bundles, campos de código, calcada de `activityfeedback`):
  `field_learner`, `field_holder`, `field_role` (`owner` | `guardian` | `staff`), `field_origin`
  (`created` | `invite` | `organization`), `status`, `created`, `changed`, `label` generado.
  Índice único (alumno, titular) en `LearnerAccessStorageSchema` más comprobación en `preSave`
  (que también exige alumno `learner` y titular `holder` y valida las listas). **`field_holder` es
  la clave `owner`** de la entidad: así el filtro "own" de JSON:API es el titular sin código extra.
  Acceso: `view` al titular y a `administer shine accounts`; `create`/`update`/`delete` solo con ese
  permiso (JSON:API no escribe). `hook_jsonapi_learner_access_filter_access` (gotcha 16).
  Instalada en entornos existentes con `shine_account_update_11002` (idempotente).
- **`LearnerAccessPolicy`** (`shine_account.learner_access_policy`): `accessFor`, `anyAccessFor`
  (para reactivar), `adultsOf`, `accessesOf`, `roleOf`, `canOperate` (acceso activo), `canEdit` /
  `canArchive` / `canInvite` (`owner`; 10 añade `coordinator` aquí), `canWithdraw` (`guardian` y
  `staff` siempre; `owner` solo si queda otro `owner`), `hasOtherOwner`. No mira
  `field_archived_at`: el progreso de un archivado se sigue leyendo.
- **`_shine_holder`** (`HolderAccessCheck`, `shine_account.access_check.holder`): autenticado,
  `field_account_kind == holder` (vacío cuenta como titular), activo y sin `field_archived_at`.
  Cacheado por usuario y dependiente de la entidad.
- **`LearnerManager`** (`shine_account.learner_manager`): `create` (valida nombre 1..60 y avatar
  `[A-Za-z0-9_-]{1,32}`, cupo, lock por titular, transacción; usuario `learner-{uuid}` /
  `learner+{uuid}@shine.invalid` / contraseña aleatoria de 32 / rol `learner` /
  `field_onboarding_state = evaluating` + acceso `owner`/`created`), `grantAccess` (crea o
  **reactiva** la fila de la pareja; sobre una activa no cambia el rol), `listFor` (activos y después
  archivados, por antigüedad del acceso), `learnerFor(holder, uuid)` (NULL si no existe, no es alumno
  o no hay acceso activo: el controlador responde 404 en los tres casos), `update`, `archive`
  (`field_archived_at` + `TokenRevoker`; idempotente; no bloquea), `withdraw`, `quotaUsage`
  (alumnos activos de los que es `owner` y no están en plaza de organización) y `toArray` (forma
  JSON con `role` del que pregunta y `adults`).
- **Cupo**: `LearnerQuotaInterface` / `DefaultLearnerQuota` = 1 (`shine_account.learner_quota`).
  04 sustituye la clase del servicio.
- **`TokenRevoker`**: revoca todos los `oauth2_token` (access y refresh) de un usuario. simple_oauth
  ya borra los access tokens en cada guardado del usuario (gotcha 20) pero deja los refresh; con uno
  la app podría volver a entrar como un archivado o una cuenta borrada.
- **Endpoints** (`LearnersController`, `MeController`, `AccountDeleteController`; todos con
  `_shine_holder` y `_csrf_request_header_token` en los no-GET): `POST/GET /shine/learners`,
  `GET/PATCH /shine/learners/{uuid}` (el `GET` individual no estaba en el subplan; se añade porque la
  verificación lo pide y a la app le sirve para refrescar uno), `POST .../archive`,
  `DELETE .../access`, `GET /shine/me` (con `alter('shine_me')`, documentado en
  `shine_account.api.php`) y `POST /shine/account/delete`.
- **`AccountDeleter`** (`shine_account.account_deleter`): en una transacción, por cada acceso activo
  del titular lo desactiva y, si al alumno no le queda otro adulto activo ni plaza de organización,
  lo anonimiza; si era el único `owner` y queda un `guardian`, promueve al más antiguo (solo
  `staff`: no se promueve nadie). Después anonimiza al titular: `deleted-{uuid}`,
  `deleted+{uuid}@shine.invalid` también en `init` (el email inicial que guarda Drupal), nombre para
  mostrar, avatar e imagen vacíos, contraseña aleatoria, bloqueo y revocación de tokens. **Hallazgo
  de la verificación**: la etiqueta de `learner_access` conservaba los nombres reales tras
  anonimizar (se regenera al guardar y el acceso se guardaba antes que los usuarios); ahora
  `anonymize()` vuelve a guardar los accesos que nombran a la cuenta y la etiqueta queda
  `deleted-… → deleted-… (owner)`. El controlador exige la contraseña (`user.auth`) y limita los
  fallos con `flood` (5 por hora por usuario; con el flood activo tampoco vale la correcta).
- **Administración**: permiso `administer shine accounts`; vista `shine_learners` en
  `/admin/shine/learners` (base `learner_access` con relaciones a alumno y adulto; alumno, alta,
  archivado, adulto, rol, origen, activo, acceso desde, operaciones; filtros alumno, adulto, rol y
  estado; enlace en `/admin/shine`), colección de la entidad en `/admin/content/learner-access`.
  Para el filtro de rol se usa el plugin `string`: en una base field `list_string` Views no ofrece
  `list_field`.

**Decisiones**:
- `GET /shine/learners` devuelve una sola lista con `archived_at` como marca (igual que
  `/shine/me`), activos primero; "archivados aparte" del subplan se interpreta como orden, no como
  segunda clave.
- Un `grantAccess` sobre un acceso **activo** no cambia el rol: subir o bajar a alguien es una
  decisión explícita (10), no un efecto lateral de volver a invitar.
- El alumno nace con `field_adult_consent` falso y sin hora; la restricción `ShineAdultConsent` solo
  mira creaciones anónimas y el alumno lo crea un titular autenticado.
- Los 403 de `_shine_holder` son la página 403 de Drupal (sin `_format`), como en `shine_level`; a la
  app le basta el código.

**Tests kernel** (`tests/src/Kernel/`, 16 tests): `LearnerManagerTest` (alta con todos los campos
y contraseña inutilizable, cupo 1, archivar libera cupo y revoca tokens sin tocar los del titular,
B no ve ni edita al alumno de A, guardian opera pero no gestiona, retirar y reactivar, validación,
guardas de la entidad), `AccountDeleterTest` (único adulto anonimiza al alumno y conserva un
`activitysummary` suyo, guardian solo pierde su acceso, owner con guardian lo promueve, owner con
solo staff no promueve) y `LearnerEndpointsTest` por HTTP con `http_kernel` (ciclo completo con
códigos, 404 para B en las cuatro rutas por UUID, 403 para alumno y anónimo en todas, `/shine/me`,
borrado con contraseña y flood). La base de tests instala `simple_oauth` para los tokens y crea los
campos de usuario de 01a (viven en `config/sync`, no en el módulo).

**Verificación en el sitio** (dos titulares nuevos registrados por REST, gotcha 14): A `POST
/shine/learners` 201 (forma completa con `adults`), segundo 422 `learner_limit` `max 1`, sin nombre
422 `validation`; `GET /shine/learners`, `GET /shine/learners/{uuid}` y `GET /shine/me` 200. B:
`learners: []` y 404 `not_found` en `GET`, `PATCH`, `archive` y `access` del alumno de A.
JSON:API `learner_access`: A ve 1 (también con `filter[field_holder.id]`), B 0 con y sin filtros.
Alumno simulado (`account_switcher`): 403 "Only holder accounts can use this route" en
`/shine/learners`, `/shine/learners/{uuid}`, `/shine/me` y `/shine/account/delete`.
`/admin/shine/learners` 200 con la fila del alumno, enlazada desde `/admin/shine`;
`/admin/content/learner-access` 200. A `PATCH` 200; borrado: sin contraseña 422, mal 403
`invalid_password`, bien 200 `{deleted: true}`; el mismo token da 401 y el login `invalid_grant`;
en BD titular y alumno con `deleted-{uuid}`, `init` sustituido, `status 0`, nombre para mostrar
`NULL`, `field_archived_at` puesto, 0 tokens activos y el acceso con `status 0`. Usuarios de prueba
borrados después. `cim -y` sin cambios; `updatedb:status` sin pendientes; watchdog sin errores
nuevos; `shine_level` 53/53.

**Para subplanes siguientes**:
- **02**: `LearnerAccessPolicy::canOperate()` es la comprobación del token de alumno; añadir
  "no archivado" (`LearnerManager::isArchived()`) antes de emitirlo. `TokenRevoker` ya existe para
  revocar al archivar. El claim `operated_by` y el `hook_node_presave` de `field_operated_by` van en
  este módulo. Recordar el gotcha 20: cualquier `save()` del usuario alumno borra sus access tokens.
- **01c**: `LearnerManager::grantAccess($learner, $holder, 'guardian', 'invite')` es la alta del
  vínculo por código (crea o reactiva la fila); `canInvite` ya responde `owner`. `withdraw` y
  `DELETE /shine/learners/{uuid}/access` ya están.
- **04**: sustituir la clase de `shine_account.learner_quota`; `LearnerManager::quotaUsage()` ya
  excluye alumnos con `field_organization` (cuando el campo exista) y archivados. `hook_shine_me_alter`
  para `holder_status` y la cobertura por alumno.
- **10**: `coordinator` se añade en `LearnerAccessPolicy` (`canEdit`/`canArchive`/`canInvite`), no en
  los controladores. `AccountDeleter` ya trata "en plaza de organización" como motivo para no
  anonimizar al alumno (`LearnerManager::isInOrganization()`).
- **05 (app)**: los 403 de las rutas de cuenta llegan como HTML; mirar el código, no el cuerpo. La
  forma de `learner` y los códigos de error están en `docs/api-design.md`.
- Sigue abierto de 01a: con su propio token, el alumno puede hacer `PATCH` de su
  `field_display_name` y `field_avatar` por JSON:API. Cerrarlo en 02 ampliando
  `shine_account_entity_field_access` para cuentas `learner`.

### 01c. Backend: vínculo de un segundo adulto por código (2026-10-23)

Todo en `shine_account`. En `config/sync`: `shine_account.settings` (nuevo). Detalle de la API en
`docs/api-design.md` ("Cuentas y alumnos").

- **Entidad `learner_invite`** (campos de código, calcada de `learner_access`): `field_learner`,
  `field_created_by` (clave `owner`), `field_code_hash`, `field_expires`, `field_used_at`,
  `field_used_by`, `status`, `label` generado sin el código. Índice único por hash
  (`LearnerInviteStorageSchema`). `preSave` exige alumno `learner`, creador `holder`, hash y
  caducidad. Acceso: `view` al creador y a `administer shine accounts`; nada de escritura por
  JSON:API; `hook_jsonapi_learner_invite_filter_access`. **`field_code_hash` no sale por JSON:API
  ni vistas** (`hook_entity_field_access`, salvo administradores). Instalada con
  `shine_account_update_11003`, que también crea la config por defecto.
- **Código**: 6 caracteres de `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (32 símbolos, sin 0/O ni 1/I; 2^30
  combinaciones) con `random_int`. En BD solo su **HMAC-SHA256 con clave derivada de `hash_salt`**
  (`settings.php`): "como una contraseña" en el sentido de que no está en claro, pero con clave,
  porque un hash sin clave de un espacio de 2^30 se invertiría en segundos a partir de un volcado y
  un hash con sal aleatoria no permitiría buscar por él. Normalización al teclear: mayúsculas, sin
  espacios ni guiones.
- **`LearnerInviteRepository`** (`shine_account.learner_invite_repository`): formato, hash,
  `findByHash`, `liveInviteFor` (activa, sin usar, sin caducar; una por alumno) e `invalidateFor`.
  Sin política, para que `LearnerManager` pueda usarlo (`invite` en `toArray()` solo para el
  `owner`; archivar anula las invitaciones) sin dependencia circular.
- **`LearnerInviteManager`** (`shine_account.learner_invite_manager`): `create` (`canInvite`, no
  archivado, anula la viva anterior, repite el sorteo si el hash existe, caducidad
  `invite_ttl_days`), `redeem` (normaliza, exige forma válida, viva, alumno `learner` no archivado;
  el creador recibe `OwnInviteException`; quien ya tiene acceso activo recibe el alumno sin gastar el
  código; si no, `grantAccess` `guardian`/`invite` y marca usada, en transacción). Cualquier otro
  fallo es `InviteInvalidException`, sin distinguir el motivo.
- **Endpoints** (`LearnerInvitesController`): `POST /shine/learners/{uuid}/invite` → 201
  `{code, expires_at, learner}` (404 ajeno, 403 `role_not_allowed`, 409 `archived`);
  `POST /shine/learners/join {code}` → 200 `{learner}` (422 `validation`, `invite_invalid`,
  `own_invite`; 429 `too_many_attempts`). Flood por titular (5 fallos/hora) y por IP (30/hora),
  umbrales en `shine_account.settings`; el intento con el código propio no cuenta como fallo; con el
  flood activo tampoco entra el código correcto. `join` no choca con `/shine/learners/{uuid}`
  porque el requisito de UUID no admite la palabra.
- **`LearnerAccessPolicy`**: sin cambios de reglas (`guardian` ya operaba sin editar, archivar ni
  invitar); documentado en la clase lo que añade 10 (`coordinator`, `staff` por organización,
  promoción de `guardian` a `owner` en el `release`).
- **Forma de `learner`**: gana `invite` (`{created, expires_at}` o `null`), solo con valor para el
  `owner` y nunca con el código.

**Decisiones**:
- Quien ya tiene acceso activo y canjea otro código recibe 200 y **no gasta** la invitación: puede
  ser para otro adulto. Un acceso revocado (se fue y vuelve) sí la gasta al reactivarse.
- `own_invite` es un error distinto de `invite_invalid` y no registra flood: solo lo ve el creador
  sobre su propio código, no revela nada, y a la app le sirve para explicar "este código es tuyo".
- Archivar un alumno anula sus invitaciones y el canje comprueba además que el alumno no esté
  archivado: un archivado no gana adultos.
- Un HMAC con clave, no un hash con sal aleatoria: el canje necesita buscar por hash.

**Tests kernel** (`LearnerInviteTest`, 7 tests; la suite de `shine_account` queda en 23 tests y
645 aserciones): invitar y canjear crea `guardian` y gasta el código (con el código tecleado en
minúsculas y con separadores), el `owner` no canjea el suyo y el código sigue vivo, caducada, mal
formada e inexistente fallan igual, la nueva anula la anterior, un archivado no tiene invitaciones
ni admite otras, `guardian` opera pero no invita ni archiva, se va y vuelve con el mismo código (que
se gasta entonces), el borrado del `owner` promueve al `guardian`, y por HTTP: 201 con `code`,
`invite` en `/shine/me`, 404 para un titular ajeno, `own_invite`, 200 al canjear con rol `guardian`
y dos adultos, 403 `role_not_allowed` al archivar e invitar, cinco fallos → sexto 429 también con
el código bueno, tras limpiar el flood entra, y retirar el acceso devuelve 404.

**Verificación en el sitio** (tres titulares nuevos, gotcha 14): A invita (201, código `65MEWP`,
`invite` en `/shine/me` sin código), C ajeno 404, A canjea el suyo 422 `own_invite`, B canjea
`" 65m-EWP "` → 200 `guardian` con `adults` Ana/owner y Bea/guardian, segundo canje 422
`invite_invalid`; B archivar, invitar y editar → 403 `role_not_allowed`. Como alumno
(`account_switcher`): `drush shine-level:generate` crea "Sesión para conocerte 1" (rama `initial`)
y `GET /jsonapi/node/session` la devuelve, `userarealevel` 5 filas; con el token de B, 0 sesiones
(gotcha 17, es lo esperado hasta el token de alumno de 02). B retira su acceso → 200, después 404 y
`canOperate` falso. C se equivoca cinco veces (422) y a la sexta 429; con el código correcto sigue
429; tras limpiar el flood, 200 `guardian`. JSON:API `learner_invite`: A 2 (sin
`field_code_hash` en atributos), B y C 0. `/admin/content/learner-invite` 200. Usuarios de prueba,
accesos, invitaciones, sesión y niveles del alumno borrados después. `cim -y` sin cambios;
watchdog sin errores nuevos.

**Saneado de la BD local (mismo día)**: `drush updb` listaba como error "too old to update" a nueve
módulos de core. No eran versiones de esquema sino 15 `post_update` eliminados en 11.0.0 que esta
BD nunca registró como ejecutados (`post_update.existing_updates`). Se registraron con
`registerInvokedUpdates()` y el aviso desapareció (gotcha 18 actualizado).

**Para subplanes siguientes**:
- **02**: `LearnerAccessPolicy::canOperate()` + `LearnerManager::isArchived()` es la comprobación
  del token de alumno, también para un `guardian` recién vinculado. Añadir el
  `hook_entity_field_access` que impide al alumno editar `field_display_name` y `field_avatar` con
  su propio token (acordado el 2026-10-23).
- **05/06 (app)**: pantalla "Tengo un código" → `POST /shine/learners/join`; mostrar `invite` del
  alumno como "código activo hasta {expires_at}" y botón "Generar código" → el `code` del 201 como
  texto y QR; tratar 429 con el texto de espera.
- **10**: `release` reutiliza `LearnerAccessPolicy::hasOtherOwner()` y la promoción de
  `AccountDeleter::delete()`; `coordinator` en `isManager()`.

### 02. Backend: token de alumno (grant `shine_learner`) y `operated_by` (2026-10-23)

Todo en `shine_account`, que ahora depende de `simple_oauth`. En `config/sync`:
`simple_oauth.oauth2_scope.authenticated_user_access` gana `shine_learner`. Detalle de la API en
`docs/api-design.md` ("Token de alumno").

- **Grant `shine_learner`**: plugin `Oauth2Grant` (`src/Plugin/Oauth2Grant/ShineLearner.php`) que
  devuelve `LearnerGrant extends AbstractGrant` (League 9.4.1). Petición: `POST /oauth/token` con
  `Authorization: Bearer {token del titular}` y
  `grant_type=shine_learner&client_id=shine_expo_app&learner={uuid}&scope=authenticated_user_access`.
  Emite **solo access token** para el usuario alumno, TTL fijo de **12 h**
  (`LearnerGrant::ACCESS_TOKEN_TTL = 'PT12H'`; se ignora el del consumer, que es para titulares),
  sin refresh; se persiste como `oauth2_token` del alumno, así que la revocación de 01b lo alcanza.
- **Identidad del titular**: el proveedor de autenticación de simple_oauth es global y se aplica a
  `/oauth/token` en cuanto hay un Bearer (lo comprobé: la petición llega al grant ya autenticada
  como el titular, y un Bearer inválido da 401 antes de llegar). Aun así el grant valida el Bearer
  con el resource server de simple_oauth (firma, caducidad, revocación), exige que sea del mismo
  cliente, que su usuario sea un titular activo y sin archivar, y que coincida con el usuario
  actual si la petición venía autenticada. Así no depende de cómo esté configurada la ruta.
- **Comprobaciones del alumno**: existe, `field_account_kind = learner`, activo, sin
  `field_archived_at` y `LearnerAccessPolicy::canOperate(titular, alumno)` (cualquier rol). Todo
  fallo es `400 invalid_grant` sin distinguir "no existe" de "no es tuyo". Falta `learner` o falta
  la cabecera → `400 invalid_request`.
- **Claim `operated_by`**: `hook_simple_oauth_private_claims_alter` lee
  `shine_account.learner_token_context` (`LearnerTokenContext`, servicio con estado de petición que
  el grant rellena justo antes de `issueAccessToken`) y añade el UUID del titular solo si el token
  que se firma es del alumno anotado. Los tokens del grant `password` no lo llevan. Elegí el
  servicio y no un atributo de la petición porque `convertToJWT()` no recibe la petición.
- **`shine_account.current_operator`** (`CurrentOperator`): decodifica el payload del Bearer de la
  petición actual (ya verificado por simple_oauth), exige `sub` = usuario actual y devuelve el
  titular de `operated_by` (o NULL: token de titular, drush, `sub` distinto). `hook_node_presave`:
  sesión nueva cuyo dueño es `learner` y hay operador → `field_operated_by`. `shine_level` no se
  entera.
- **Configuración**: `shine_learner` en `grant_types` del scope (config) y del consumer (contenido,
  por `php-eval`; snippet de CLAUDE.md actualizado). Hace falta además un tipo de esquema
  `grant_type.shine_learner` (`config/schema/shine_account.schema.yml`, como hace el contrib del
  password grant): sin él los kernel tests fallan con "missing schema".
- **Nombre del grant**: `shine_learner`, no `urn:shine:learner`. Confirmado: el gestor de plugins
  trata `:` como separador de derivativas (`PluginBase::DERIVATIVE_SEPARATOR`). Gotcha 22 en
  `CLAUDE.md`.

**Tests kernel** (`LearnerGrantTest`, 3 tests; la suite de `shine_account` queda en 26): monta el
servidor OAuth real (claves de `SimpleOauthTestTrait`, scope y consumer como en el sitio) y saca el
token del titular con el grant `password`, como la app. Cubre: solo access token, `expires_in`
43200 aunque el consumer diga 3600, `sub` = uid del alumno, `operated_by` = UUID del titular, `aud` y
`scope`, persistencia como `oauth2_token` sin refresh, el token `password` sin claim; `guardian` →
200 con su propio `operated_by`; B, UUID de un titular, UUID desconocido → `invalid_grant`; sin
`learner` o sin Bearer → `invalid_request`; Bearer inválido → 401; token de alumno como Bearer →
`invalid_grant`; acceso revocado → `invalid_grant`; archivado: el token emitido pasa a 401 en
`/oauth/userinfo` y no se emite otro, el del titular sigue valiendo; con el token de alumno:
`/oauth/userinfo` da `sub` = UUID del alumno y `name` = Marta (shine_oauth), `/shine/me` y
`POST /shine/learners` 403, `POST /jsonapi/activitysummary/summary_test` crea la entidad con `uid`
del alumno, `CurrentOperator` + presave fijan `field_operated_by` = titular, el mismo Bearer con otro
usuario actual no cuenta, un token de titular y una creación sin petición dejan el campo vacío.
Detalle del harness: las rutas OAuth se piden con `?_format=json` porque un 401 renderizado como
página HTML hace una subpetición que, dentro de un kernel test, deja el contexto del router con otro
método y la siguiente petición recibe 405 (no ocurre en el sitio: cada petición es un proceso).

**Verificación en el sitio** (dos titulares nuevos, gotcha 14): A obtiene token de alumno
(`expires_in` 43200, sin `refresh_token`; claims `sub` = uid del alumno, `operated_by` = UUID de A;
el token de A no lleva el claim). B con el alumno de A, A con el UUID de B y el propio token de
alumno pidiendo otro → `400 invalid_grant` (pistas distintas, mismo error); sin Bearer → `400
invalid_request`; Bearer inválido → 401; el token de alumno como `refresh_token` → `invalid_grant`.
Con el token de alumno: `/oauth/userinfo` `sub` = UUID del alumno y `name` Marta; `GET
/jsonapi/node/session` 0; `/shine/me` y `POST /shine/learners` 403; `POST /shine/session/generate`
201 "Sesión para conocerte 1" con `uid` del alumno y `field_operated_by` = A; después 1 sesión con
el token de alumno y 0 con el de A (gotcha 17, esperado). Tras el vínculo de 01c, B obtiene token
con `operated_by` = B y, despublicada la pendiente de A (regla de los 7 días, a mano), genera
"Sesión para conocerte 2" con `field_operated_by` = B. Archivar: los 2 tokens de alumno pasan a
revocados, A y B reciben `invalid_grant` al pedir otro y el token de A sigue valiendo. Usuarios,
sesiones, tokens y accesos de prueba borrados (también 6 `oauth2_token` huérfanos de verificaciones
anteriores: simple_oauth no los borra al borrar el usuario). `cim -y` sin cambios; watchdog sin
errores nuevos.

**Para subplanes siguientes**:
- **05 (app)**: guardar el token de alumno aparte del de titular; usarlo en todo lo que sea
  actividad, sesiones, feedback y estadísticas; ante un 401 con él, volver a pedirlo con el del
  titular (no hay refresh). Gotcha 20: cualquier guardado del usuario alumno borra sus access tokens
  (p. ej. al cerrar el bloque inicial), así que el "volver a pedir" tiene que ser automático.
- **04**: el muro se evalúa en `session/generate` con el `uid` del alumno; el titular que opera
  está en `shine_account.current_operator` si hiciera falta para el texto del 402.
- **Cerrado lo acordado en 01a/01b**: `shine_account_entity_field_access` deniega `edit` de
  `field_display_name` y `field_avatar` cuando la cuenta es `learner` (salvo `administer users`):
  el alumno ya no se renombra ni cambia de avatar con su token por JSON:API (403); lo hace su
  `owner` por `/shine/learners/{uuid}` (código, no pasa por el hook). `field_dyslexic_font` sigue
  siendo suya (200). Un titular sí se renombra a sí mismo. Cubierto en `LearnerGrantTest` con
  `PATCH /jsonapi/user/user/{uuid}` reales.

### 03. Backend: entidad `entitlement`, catálogo de planes y admin de cortesías (2026-10-23)

Módulo nuevo **`shine_entitlement`** (`package: shine`; depende de `shine_account` y de
`shine_level`, que es dueño de `/admin/shine` y `/admin/config/shine`, donde cuelgan sus enlaces, y
al que 04 enganchará la puerta de sesiones). En `config/sync`: los cuatro planes
`shine_entitlement.plan.*`, la vista `views.view.shine_entitlements`, `core.extension` y
`user.role.authenticated` (gana `view own entitlement entities`). Detalle en `docs/api-design.md`
("Entitlements").

- **Entidad `entitlement`** (campos de código, calcada de `activityfeedback`): los campos de §4.1
  salvo `field_organization` (llega con 10), más `field_catalog_plan`, `field_cancelled_at`,
  `field_event_timestamp` (integer big, ms), `field_last_event_id`, `created`, `changed` y `label`
  generada ("Cortesía · manual · jose@…"). `field_holder` es la clave `owner`. Listas como
  constantes públicas (`PLANS`, `SOURCES`, `STATUSES`, más `ENDED_STATUSES` y
  `NON_EXPIRING_SOURCES`) y `isLive()`. `preSave`: valores fuera de lista, titular que no es
  `holder`, plan de catálogo inexistente o `free`, caducidad vacía en un origen de pago y asientos
  < 1 lanzan `InvalidArgumentException`; vacíos se rellenan: asientos 1, `field_plan` del catálogo,
  `field_max_learners` = `learners_per_seat × asientos` (si viene informado, se respeta), inicio =
  ahora.
- **Unicidad (`field_source`, `field_external_id`)**: restricción de entidad
  `ShineEntitlementExternalIdUnique` (mensaje en `validate()`, ignora vacíos) + índice único en la
  tabla (`EntitlementStorageSchema`; MySQL admite varios NULL, así que las cortesías sin id no
  chocan). Mismo patrón de doble barrera que `learner_access`.
- **Acceso**: `view` para `administer shine entitlements` y para el titular con `view own
  entitlement entities`; `create`/`update`/`delete` solo admin; `hook_jsonapi_entitlement_filter_access`
  (gotcha 16). `field_raw_event`, `field_event_timestamp` y `field_last_event_id` solo los ven los
  administradores (`hook_entity_field_access`): pueden llevar datos de la store que el titular no
  necesita. `hook_user_update` vuelve a guardar los entitlements de un titular si cambia su email
  (también al anonimizar la cuenta), para que la etiqueta no conserve el email antiguo: la misma
  fuga que se corrigió en 01b con `learner_access`.
- **Catálogo**: config entity `shine_entitlement_plan` (`id`, `label`, `plan`,
  `learners_per_seat`, `groups_per_seat`, `external_ids`), esquema con `Choice` y `Range`, cuatro
  entradas en `config/install` (`free` 1, `family` 3 con los productos reales de las stores,
  `professional` 15 y `school_classroom` 0 + 1 grupo con marcadores `stripe:price_REEMPLAZAR_...`).
  Formulario y list builder en `/admin/config/shine/plans`; el formulario valida la forma
  `origen:identificador` y que un id no esté en otro plan, y junta todos los problemas en un solo
  mensaje (Drupal guarda un error por elemento). `free` no se puede borrar (handler de acceso).
- **`shine_entitlement.plan_catalog`** (`PlanCatalog`): `get`, `all`, `free`, `resolveExternal`
  (lanza `UnknownExternalPlanException` con `source` y `externalId`; devuelve plan, nunca NULL),
  `maxLearners`, `planForExternalId`.
- **Admin de cortesías**: `EntitlementForm` en `/admin/shine/entitlements/add` (origen forzado
  `manual` y oculto; al editar, origen bloqueado; tipo `courtesy` y estado `active` por defecto;
  `free` fuera del selector; `?holder={uid}` rellena el titular; error de formulario si el titular
  es un alumno o si un origen de pago se queda sin caducidad). Vista `shine_entitlements` en
  `/admin/shine/entitlements` (filtros por titular, tipo, origen y estado como desplegables gracias
  a `EntitlementViewsData`, acción "Conceder una cortesía", enlace en `/admin/shine`) y pestaña
  "Acceso" en `/user/{uid}/entitlements` (display `embed_user`, permiso `administer shine
  entitlements`).
- **Drush `shine-entitlement:recalc [--plan=ID] [--dry-run]`** sobre
  `shine_entitlement.max_learners_recalculator`: recalcula el cupo de los vivos (ni `expired` ni
  `revoked` ni caducados), imprime tabla antes/después y "N de M cambian"; un plan desconocido falla;
  un entitlement cuyo plan ya no existe se avisa y no se toca.

**Decisión**: `field_catalog_plan` (referencia a la entrada del catálogo) no estaba en el subplan.
Sin él no hay forma de calcular el cupo ni de recalcularlo: `field_plan` no identifica la entrada
(`courtesy` no tiene una propia y un centro puede tener varias), y `field_external_id` es el id de la
suscripción, no del producto. Anotado en `docs/monetization.md` §4.1.

**Fallos encontrados en la verificación (no los cubrían los kernel tests) y corregidos**:
- La lista daba 500 en cuanto había filas: la columna `operations` de Views solo existe si la entidad
  declara `list_builder`; sin él el handler es `Broken`. Añadido `EntitlementListBuilder`.
- El widget `datetime_timestamp` de core convierte una fecha vacía en "ahora": una cortesía "sin
  caducidad" se guardaba caducando en el momento de crearla (y dejaba de estar viva). `EntitlementForm`
  trata la fecha vacía como campo vacío.
- `PlanForm` copiaba el textarea de productos tal cual a la propiedad `external_ids` (tipada como
  array): `TypeError`. Ahora `copyFormValuesToEntity()` lo convierte en lista y los números en
  enteros, y las propiedades del config entity van sin tipo, como en core.
- Al escribir la vista a mano, `drush cex` la borró dos veces antes de importarla. Gotcha 23 en
  `CLAUDE.md` (orden correcto, y lo de `list_builder`).

**Tests kernel** (9 tests, 212 aserciones): `EntitlementTest` (preSave deriva etiqueta, tipo, cupo y
fechas del catálogo y respeta un cupo escrito; `isLive`; nueve valores inválidos rechazados y
`organization` sin caducidad aceptado; unicidad por origen con `validate()` y con el índice, mismo id
en otro origen y varias cortesías sin id; catálogo, `resolveExternal` con desconocidos,
`maxLearners`, `planForExternalId`; `free` no se borra; `recalc` solo toca los vivos que difieren,
`--dry-run` no escribe, filtro por plan, segunda pasada vacía y bajar el cupo del catálogo no afecta a
lo existente hasta el recálculo; la etiqueta sigue al email) y `EntitlementAccessTest` (acceso de
entidad y de campo; JSON:API con `view own` solo lo propio, filtro sobre otro titular vacío, detalle
ajeno 403, `field_raw_event` fuera de los atributos; sin `view own`, colecciones vacías sin error).
La base de tests ocupa el uid 1 con una cuenta de relleno: el primer usuario de un kernel test es
superusuario y se salta los permisos (gotcha 14).

**Verificación en el sitio**: cortesía para jose desde `/admin/shine/entitlements/add` (Familia,
sin caducidad → cupo 3, `caduca NULL`) y licencia manual de 2 asientos Profesional para oriol (cupo
30, caduca 2027-10-23); los dos en la lista, el filtro activo + manual + cortesía deja solo el de
jose, la pestaña `/user/2/entitlements` solo el de jose con el botón de cortesía. Un alumno como
titular → error "es un alumno: el acceso se concede a su titular". JSON:API con el token real de
jose: `filter[field_holder.id]` propio 1 (sin los campos de auditoría), el de oriol 0, sin filtro 1,
detalle del de oriol 403, `PATCH` del suyo 403. Catálogo: duplicado + línea mal formada → dos
errores y no se crea; un plan válido se crea y `resolveExternal` lo encuentra; borrar `free` → 403.
`recalc --dry-run` lista el cupo cambiado a mano (9 → 3) sin escribir; sin `--dry-run` lo corrige;
`--plan=gold` falla. Datos de prueba borrados; `cim -y` sin cambios; sin updates pendientes;
watchdog sin errores nuevos tras las correcciones (los de las 16:39 son de los tres fallos de arriba).

**Para subplanes siguientes**:
- **04**: `PlanCatalog::free()` para el titular sin entitlement; `Entitlement::isLive()` y la lista
  de estados que cubren (§4.1: active, trial, grace, billing_retry) para "cubierto"; cupo en
  `field_max_learners`. Recordar invalidar caché al guardar un entitlement (tags de la entidad).
- **07 / 11**: buscar por (`field_source`, `field_external_id`) y hacer upsert (el índice único
  impide duplicar); `resolveExternal` + `UnknownExternalPlanException` → 422 + watchdog;
  `field_event_timestamp` en ms para descartar eventos viejos; al crear, dejar `field_max_learners`
  vacío para que lo calcule el catálogo, o escribirlo si el plan cambia (`PRODUCT_CHANGE`).
- **09 / 11**: sustituir los `stripe:price_REEMPLAZAR_*` del catálogo por los ids reales (formulario
  o `config/sync`).
- **10**: `field_organization` como campo base nuevo con `hook_update_N` (la entidad ya existe).

### 04. Backend: servicio de acceso, prueba por sesiones y muro en `session/generate` (2026-10-23)

Tres módulos. En `config/sync`: `shine_level.settings` gana `free_regular_sessions` (8) y
`pending_max_days` (7). Detalle de la API en `docs/api-design.md` ("Generar (u obtener) la
siguiente sesión" → 402; "Cuentas y alumnos" → forma de `learner` y `holder_status`;
"Entitlements → Acceso").

**`shine_level`** (sin depender de nadie):
- **Parámetros**: esquema (`free_regular_sessions` mínimo 0, `pending_max_days` mínimo 1),
  `config/install`, grupo "Prueba gratuita y sesión pendiente (FASE 17)" en
  `/admin/config/shine/level` y `shine_level_update_11001` (añade las claves que falten; el módulo
  estaba en la versión 8000 porque no tenía `.install`). El formulario avisa, al guardar, si N es
  **menor** que `periodic_sessions + evaluation_sessions`: el subplan decía "si no supera", pero con
  los valores por defecto 8 = 6 + 2 eso avisaría siempre, y con N = X + Y la periódica llega antes
  del muro (la prueba se evalúa al pedir la regular siguiente). Documentado en `level-system.md` §8.
- **Puertas**: `SessionGateInterface::check(AccountInterface, SessionPlan): ?GateDenial`
  (`reason` + `payload`), colector `shine_level.session_gates` (`service_collector` sobre la
  etiqueta `shine_level.session_gate`, por prioridad) y `SessionGenerator::gate()`. `generate()` las
  consulta entre `plan()` y `create()`, dentro del lock y antes de escribir nada, y lanza
  `SessionGatedException` (con cuenta, plan y denegación). El controlador responde `402
  {error: payment_required, reason, branch} + payload`. `shine-level:generate` imprime "Puerta: pasa"
  o "Puerta: denegado, {reason}" con el cuerpo del 402, y sin `--dry-run` no crea la sesión si la
  puerta la deniega. Sin puertas registradas nada cambia: los 53 tests anteriores pasan intactos.
- **Pendiente caducada**: `pendingSession()` recorre las pendientes publicadas, despublica (no
  borra) las creadas hace más de `pending_max_days` días con un `notice` en watchdog y devuelve la
  primera que sigue viva. `sessionQuery()` y `SessionEvaluator::countCompletedSessions()` ahora
  solo miran sesiones **publicadas**: una despublicada (caducada o por "Reiniciar niveles") no
  numera, no rota, no excluye actividades y no cuenta como completada ni para la prueba.
- Tests (`SessionGeneratorTest`, 55 en total): puerta de prueba registrada en el contenedor
  (`TestGate`, decide por closure) que deniega `regular` → excepción, nada creado, dos intentos
  seguidos sin lock colgado, el bloque inicial sale y sin closure la regular vuelve; pendiente de 6
  días se conserva, de 8 se despublica y la nueva repite el número ("Sesión 1"), una fecha de
  cierre puesta a mano en la despublicada no cuenta, y con `pending_max_days = 30` no caduca.

**`shine_account`**: `LearnerManager::toArray()` invoca `hook_shine_learner_alter(array &$data,
UserInterface $learner, UserInterface $holder)` (documentado en `shine_account.api.php`). Es la
forma `learner` de **todas** las rutas de alumnos (`/shine/learners*`, `/shine/me`, `join`), así
que lo que añade `shine_entitlement` sale igual en todas sin tocar controladores; `hook_shine_me_alter`
queda para lo que es del titular (`holder_status`).

**`shine_entitlement`** (`src/Access/`):
- **`EntitlementAccessInterface`** / `EntitlementAccess` (`shine_entitlement.access`):
  `holderStatus`, `learnerCovered`, `coveredBy`, `canGenerateRegular`, `maxLearners`,
  `canCreateLearner`, `completedRegular`, `freeRegularSessions`. Objetos de valor `HolderStatus`
  (plan, estado, origen, caducidad, cupo, entitlement, `toArray()`), `Coverage`
  (`organization` | `holder` | `trial`, con entitlement, adulto y nombre de centro) y
  `AccessDecision` (permitido con cobertura, o motivo; siempre con `completed_regular` y
  `free_regular_sessions`; `isPaused()`, `remainingFree()`).
- **Reglas**: titular cubierto = entitlement con estado `active`/`trial`/`grace`/`billing_retry`,
  `field_starts_at` pasado y caducidad vacía o futura; varios → mayor cupo, a igualdad el que caduca
  más tarde (nulo = infinito), a igualdad el más antiguo; sin ninguno, `free` del catálogo.
  Alumno: (1) `OrganizationCoverageInterface` (servicio `shine_entitlement.organization_coverage`,
  hoy `NullOrganizationCoverage`; 10 lo sustituye y aporta también `releasedBy()`), (2) adultos con
  acceso activo del más antiguo al más nuevo: si está cubierto y es `owner`, el alumno tiene que caer
  entre los primeros `max_learners` de `ownedActiveLearnerIds()` (activos, no archivados, no en
  organización, por `created` del usuario y uid), (3) prueba. Motivos de denegación, en este orden:
  `learner_not_covered` (archivado, bloqueado o sin adulto activo), `learner_paused`,
  `released_by_organization` (si 10 informa de una liberación), `trial_exhausted`.
- **`EntitlementGate`** (etiqueta `shine_level.session_gate`): solo `$plan->branch === 'regular'`.
  El `holder_status` del 402 es el del titular del claim `operated_by`
  (`shine_account.current_operator`); sin claim, el `owner` más antiguo del alumno; una cuenta
  `holder` que juega consigo misma, la suya; sin nadie, el plan gratuito.
- **`EntitlementLearnerQuota`** decora `shine_account.learner_quota` (`decorates` en
  services.yml): `POST /shine/learners` admite `max_learners` del plan vigente.
- **Hooks**: `hook_shine_me_alter` → `holder_status`; `hook_shine_learner_alter` → `covered_by`,
  `covered_by_organization`, `paused`, `blocked_reason`, `completed_regular`,
  `free_regular_sessions`.
- **Caché** (`cache.default`): estado del titular con `user:{uid}` + `entitlement_list` y
  `expire` en la caducidad o inicio futuro más cercano de sus entitlements vivos; cobertura "por
  plan" del alumno con `user:{alumno}`, `learner_access_list`, `entitlement_list`, `user:{adulto}` y
  `user:{hermano}` de cada lista de cupo consultada, con `expire` heredado de los adultos. Drupal
  invalida `{tipo}_list` y `{tipo}:{id}` en cada guardado, así que guardar un entitlement (admin,
  webhooks de 07 y 11), crear, vincular, retirar o archivar un alumno invalidan sin código extra. El
  contador de la prueba no se cachea (una consulta de recuento que cambia al cerrar sesiones). Al
  leer, además, se comprueba que lo cacheado siga cubriendo (reloj) antes de usarlo.

**Decisiones**:
- **Un `guardian` o `staff` con plan cubre al alumno sin gastar su propio cupo** (lectura de §4.1
  punto 2 que exige el subplan: "cortesía solo para B y A genera igual"; la condición del cupo solo
  tiene sentido para el `owner`). Anotado en `monetization.md` §4.1.
- **"En pausa" solo cuando ni el cupo ni la prueba cubren**: un alumno fuera del cupo con prueba
  por gastar sigue jugando con `covered_by: trial`; `paused` es `reason === learner_paused`.
- **Cuenta titular que juega consigo misma** (anteriores a la FASE 17, p. ej. jose@test.com): se
  cubre con su propio plan, sin cupo, y si no con la prueba. Así la app actual sigue funcionando
  hasta 05.
- **`field_starts_at` futuro no cubre** hasta su fecha (una cortesía programada); la caché caduca
  justo entonces.
- **`released_by_organization`** se devuelve cuando `releasedBy()` informa de un centro, nadie cubre
  y la prueba se agotó; más específico que el `trial_exhausted` que §5.6 cita para ese caso, para
  que la app pueda mostrar "el centro ha dejado de cubrir" desde el propio 402. Lo activa 10.
- **Forma de `holder_status`**: `plan`, `catalog_plan`, `status` (`none` en el gratuito), `source`,
  `expires_at` (ISO o null), `max_learners`, `covered`, `entitlement` (UUID). Sin
  `learners_covered[]` (§4.2): la cobertura va en cada alumno. Por alumno, además de lo que pedía
  el subplan, `blocked_reason` (el `reason` que daría el 402, o null) y `covered_by_organization`.
- **Las ramas de evaluación se consultan a las puertas pero ninguna puerta las deniega**: es la
  puerta, no el generador, quien decide qué ramas mira (`§5.4`: solo `regular`).
- Las sesiones de cuentas `holder` en `/jsonapi` no cambian; `shine_level` sigue sin saber qué es
  un titular o un alumno (principio de §3.2).

**Tests kernel** (`shine_entitlement`, 23 en total, 861 aserciones): base
`EntitlementAccessKernelTestBase` que **extiende `ShineLevelKernelTestBase` de otro módulo** (el
bootstrap de PHPUnit registra `Drupal\Tests\{módulo}\` de todos los módulos) y añade campos de
cuenta, rol `learner`, entidades de `shine_account`, catálogo, `field_operated_by` y reloj
controlable. `CoverageTest` (8): plan gratuito y cupo 1 con `LearnerLimitException`, prueba de 8 y
agotada; qué estados cubren, caducado por fecha, cortesía sin caducidad, inicio futuro; mayor cupo
y caducidad más lejana; cobertura por el `owner`, archivado y sin adultos; cupo por orden de
creación (cuarto de un plan que baja a 3 en pausa, con prueba sigue, archivar el primero lo libera);
alumna compartida cubierta por la `guardian` sin gastar su cupo y vuelta a la `owner` al retirarse;
invalidación de caché al crear, revocar, caducar (reloj), vincular y retirar; titular que juega
consigo mismo. `SessionGateTest` (6): bloque inicial y periódica con prueba agotada; regular → 402
por HTTP con el cuerpo completo, dos veces sin 409, nada creado, cortesía → 201 "Sesión 3"; regular
generada sin completar no consume; alumna compartida con cortesía solo de la `guardian` y
`field_operated_by` del operador; `holder_status` del 402 según el claim `operated_by` (y un `sub`
ajeno no cuenta); `/shine/me`, `/shine/learners` y `/shine/learners/{uuid}` con la cobertura y 403
con token de alumno. Detalle del harness: un `Bearer` sin firmar da 401 en `http_kernel` (proveedor
de simple_oauth), así que lo que depende de `CurrentOperator` se prueba empujando la petición con el
JWT en `request_stack` (`operatingAs()`) y llamando al generador; la firma la cubre
`LearnerGrantTest` (02).

**Verificación en el sitio** (dos titulares registrados por REST, tokens `password` y
`shine_learner` reales, gotcha 14; `free_regular_sessions` a 1 por `config:set`): A crea a Marta
(`covered_by: trial` ya en el 201); con su token, "Sesión para conocerte 1" (201, evaluación);
cierre a mano del bloque; "Sesión 1" regular 201; cerrada, la siguiente → **402** `trial_exhausted`,
`free_regular_sessions 1`, `completed_regular 1`, `holder_status` plan `free`; `drush
shine-level:generate {uid} --dry-run` imprime "Puerta: denegado, trial_exhausted" con el cuerpo;
con evidencia 3 en un área, la evaluación dirigida sale (201) con la prueba agotada. Cortesía para
A creada por código (como el admin) → la siguiente llamada 201 "Sesión 2" sin reiniciar nada;
`/shine/me` de A: `holder_status` `courtesy`/`manual`/cupo 3, alumna `covered_by: holder`. A invita,
B canjea (`guardian`); revocada la cortesía de A → 402 (`completed_regular 2`) y `/shine/me` de A con
`covered_by: none`, `blocked_reason: trial_exhausted`; cortesía para B → A genera "Sesión 3" (201)
con `field_operated_by` = A, `/shine/me` de A: `holder_status.plan free` y `covered_by: holder`;
`/shine/me` de B: `courtesy`; `GET /shine/learners` de B con las mismas claves. Pendiente envejecida
8 días → despublicada (`status 0`, sin fecha de cierre) y nueva "Sesión 3" (201). Formulario:
guardar con N = 5 muestra el aviso (6 + 2 = 8) y con 8 no. Usuarios, sesiones, niveles, tokens,
accesos, invitaciones y entitlements de prueba borrados; N de vuelta a 8; `config:status` limpio,
`cim -y` sin cambios, `updb` sin pendientes; watchdog sin errores nuevos (solo los avisos de
`shine_level` por huecos del catálogo local). `shine_level` 55/55, `shine_account` 26/26,
`shine_entitlement` 23/23.

**Para subplanes siguientes**:
- **05 (app)**: tratar `402` de `POST /shine/session/generate` → paywall con `reason`,
  `completed_regular`, `free_regular_sessions` y `holder_status`; aviso suave con
  `free_regular_sessions - completed_regular` ≤ 3 de `/shine/me`; `blocked_reason` por alumno
  permite pintar el estado antes de pedir sesión. Gotcha 20 sigue: cada guardado del usuario alumno
  (cerrar el bloque inicial) invalida el token de alumno.
- **06b**: `holder_status` lleva `expires_at` ISO, `source` y `catalog_plan` para la pantalla de
  plan; `covered: false` con `plan: free` es "sin plan".
- **07 / 11**: basta con guardar el entitlement (estado, caducidad, cupo): la caché se invalida por
  `entitlement_list`. `field_starts_at` futuro no cubre hasta esa fecha. `paused` de la store no
  cubre; `grace` y `billing_retry` sí.
- **10**: implementar `OrganizationCoverageInterface` (`coverageFor` con `Coverage::ORGANIZATION`,
  nombre y `cacheTags` de la organización y su entitlement; `releasedBy`) y sustituir el servicio
  `shine_entitlement.organization_coverage`; `ownedActiveLearnerIds()` ya excluye `field_organization`
  cuando exista. Añadir `released_by` a la forma de `learner` por `hook_shine_learner_alter`.
- **Pendiente conocida**: `POST /shine/session/{uuid}/complete` sigue aceptando una sesión
  despublicada (caducada) si el dispositivo la tenía abierta; se cierra pero no cuenta para nada.
  Si molesta, rechazarla con 409 en `SessionEvaluator::complete()`.

### 05. App: doble token, onboarding con primer alumno y selector de alumno (2026-10-23)

Solo `shine-app/`. Detalle de lo nuevo en `CLAUDE.md` ("Expo App → Doble token").

- **Tipos y API**: `src/types/me.ts` (`Me`, `Learner` con `role`, `adults`, `invite`,
  `covered_by`, `covered_by_organization`, `paused`, `blocked_reason`, `completed_regular`,
  `free_regular_sessions`; `HolderStatus`), `src/lib/api/me.ts` (`getMe`), `src/lib/api/learners.ts`
  (`createLearner`, `listLearners`, `getLearner`, `updateLearner`, `archiveLearner`,
  `withdrawAccess`, `inviteAdult`, `joinLearner`, `requestLearnerToken`; errores como `LearnerError`
  con los códigos de `docs/api-design.md`), `registerAccount` envía `field_adult_consent`
  (`consent_required` si el servidor lo rechaza), `SessionResource.relationships.field_operated_by`.
- **Dos tokens** (`src/lib/api/client.ts` + `tokenFlow.ts` + `errors.ts`): claves separadas para
  titular y alumno; `apiFetch(path, init, { actor })` con `learner` por defecto y `holder` explícito
  en las rutas de cuenta; `shineFetch` para `/shine/*`. Sin alumno activo una llamada `learner`
  lanza `NoActiveLearnerError` (nunca cae al titular). 401 de alumno → token nuevo con el del titular
  (renovado si hace falta) y un reintento, con una sola renovación en vuelo; 401 de titular →
  refresh como antes. 402 → `PaymentRequiredError`. `fetchAsActor()` es puro y se prueba con un
  transporte falso.
- **Store** (`src/store/auth.ts`): `holder`, `me`, `activeLearner` y `user` = alumno activo (su
  `sub` es el UUID de todos los filtros `uid.id`, así que dashboard, sesión, estadísticas,
  `ActivityBase` y ajustes no cambian). `selectLearner`, `refreshMe`, `clearLearner`; `logout` borra
  los dos tokens; `initialize` restaura el alumno guardado (reutiliza su token si no ha caducado
  por `exp`, si no pide otro; alumno archivado o ajeno → se olvida; `invalid_grant` → se olvida);
  un 401 de `/shine/me` tras el refresh cierra la sesión.
- **Arranque** (`app/_layout.tsx` + `src/lib/startRoute.ts`, puro): sin sesión → login; sin
  alumnos activos → `learners/new`; un alumno no en pausa → se elige solo (ref para no repetirlo);
  varios, o uno en pausa → `learners/select`; con alumno activo → dashboard. Sin `/shine/me` (sin
  red): con alumno guardado al dashboard, sin él al selector (que ofrece reintentar).
- **Pantallas**: `register.tsx` con la casilla "Soy mayor de edad y responsable de la persona con la
  que voy a trabajar" (botón inactivo sin ella; `validateRegister` también la exige);
  `(auth)/learners/new.tsx` ("¿Con quién vas a trabajar?": nombre o apodo, 12 avatares emoji de
  `src/lib/avatars.ts`, `learner_limit` en neutro, enlace "Tengo un código del centro" que deja una
  nota hasta 06; flecha atrás solo si ya hay alumnos); `(auth)/learners/select.tsx` ("¿Con quién
  trabajamos hoy?": tarjetas con `Avatar`, nombre y `coverageLine`, los `paused` sin pulsar y con
  explicación, "Añadir a otra persona", engranaje a Ajustes, estado sin red con reintento). En el
  dashboard la cabecera saluda al alumno; su avatar abre el selector y un engranaje nuevo, Ajustes.
- **Sesión de otro adulto** (§5.6): `SessionCard.operatedBy`; la tarjeta "Continuar" añade
  "Sesión empezada con {nombre}" (`startedWithLabel`, con `adults`) y se continúa igual; no hay
  descarte.
- **402 y aviso suave**: `generateErrorCopy(e, { learnerName })` → `paymentRequiredCopy`
  ("Habéis completado las N sesiones de prueba de Marta", singular con N = 1; textos propios para
  `learner_paused`, `learner_not_covered` y `released_by_organization`; sin acción de compra); tras
  un 402 se refresca `/shine/me`. Tarjeta discreta `trialNotice` cuando `covered_by === 'trial'` y
  quedan 3 o menos ("A Marta le queda 1 sesión de prueba"). El dashboard refresca `/shine/me` en
  cada carga.
- **Tests** (`src/lib/__tests__/`, 225 en total, 29 suites): `tokenFlow` (elección por actor,
  refresh del titular, renovación y reintento del alumno, sin alumno → error sin tocar el titular,
  `exp` del JWT), `startRoute` (todos los casos del guard), `learnerForm` (validación y mensajes
  neutros), `learnerCopy` (aviso, línea de cobertura, "empezada con", 402 por motivo, campos del
  error), `sessionCards` (402 y `operatedBy`) y `authForm` (consentimiento).

**Decisiones**:
- Las cuentas anteriores a la FASE 17 que jugaban como titular tienen que crear un alumno al
  entrar (el diseño no contempla inicio sin alumno); sus sesiones antiguas quedan en el titular.
- Un alumno en pausa no se elige en el selector ni se auto-selecciona si es el único: el selector
  explica la pausa (la compra o ampliación llega con 06b/08).
- `user.name` del alumno es su `display_name` sin pasar por `/oauth/userinfo`: una petición menos
  por cambio de alumno y la misma información.
- La preferencia de fuente es del alumno activo (se lee al seleccionarlo y se guarda con su token
  en su propio usuario), no del titular.
- Un `Bearer` de alumno revocado en el servidor (gotcha 20) se detecta por el 401 de la primera
  llamada y se renueva sin pasar por login; además, al restaurar se comprueba `exp` para no gastar
  una petición con un token caducado.

**Verificación**: `npx tsc --noEmit`, `npm run lint` (0 errores; 4 avisos previos) y `npm test`
limpios. Recorrido en web (Expo + Chrome) con dos titulares nuevos: registro de Ana con la casilla
(sin marcarla, botón inactivo) → "¿Con quién vas a trabajar?" → Marta con zorro → dashboard "Buenas
tardes, Marta" → "Sesión para conocerte 1" creada para el uid del alumno con `field_operated_by` =
Ana. Cierre del bloque inicial por drush (invalida el token de alumno, gotcha 20) y N = 1: recargar
restaura a Marta y renueva el token en silencio, el aviso "A Marta le queda 1 sesión de prueba"
aparece, "Nueva sesión" crea "Sesión 1". Cerrada por drush, "Nueva sesión" muestra "Habéis
completado la sesión de prueba de Marta" sin romper nada y el aviso desaparece. Cortesía para Ana
y tokens de Marta revocados: "Nueva sesión" renueva y crea "Sesión 2" (cubierta). Selector: "Hola,
Ana", Marta "Acceso activado"; "Añadir a otra persona" → Lucas con búho → dashboard de Lucas vacío;
el selector muestra los dos; elegir a Marta vuelve a sus sesiones (Sesión 2 pendiente, Sesión 1,
Sesión para conocerte). Cerrar sesión desde Ajustes → login. Bea se registra, drush la vincula
como `guardian` de Marta, al recargar Marta se elige sola y la tarjeta dice "Sesión empezada con
Ana"; Bea la abre y continúa; su selector: "Hola, Bea", Marta "Acceso activado". Datos de prueba
borrados; N de vuelta a 8.

**Para subplanes siguientes**:
- **06**: `inviteAdult` y `joinLearner` ya están en `src/lib/api/learners.ts` (errores
  `invite_invalid`, `own_invite`, `too_many_attempts`); el enlace "Tengo un código del centro" de
  `learners/new.tsx` solo deja una nota; `updateLearner`, `archiveLearner` y `withdrawAccess` también
  están listos para la ficha del alumno. `Learner.invite` llega en la forma.
- **06b**: `me.holder_status` (plan, origen, caducidad ISO, cupo, `covered`) y `describeLearnerError`
  para `learner_limit` (hoy texto neutro con `max`).
- **08**: `PaymentRequiredError` en `handleNewSession` del dashboard es el punto donde entra el
  paywall; `trialNotice` es la tarjeta previa.
- **Pendiente conocida**: el `InlineAlert` del 402 usa el icono genérico (`cloud-off`); cuando 08
  ponga el paywall, darle icono y acción propios.

### 06. App: gestión de alumnos en Ajustes, invitar a otro adulto y vincularse por código (2026-10-23)

Solo `shine-app/` (más `react-native-qrcode-svg` 6.3.27 en `package.json`, instalado con
`npx expo install` y nvm 21). Textos de cada pantalla en objetos `*_COPY` de
`src/lib/learnerScreens.ts`; los de cobertura de 05 pasan a `COVERAGE_COPY` (`learnerCopy.ts`).

- **Ajustes → "Alumnos"**: tarjetas de los alumnos activos (avatar, nombre, chip "En pausa" o
  "Ahora" si es el activo, línea de `covered_by`) que abren la ficha; "Añadir a otra persona"
  (pantalla de 05, que ya explica `learner_limit` en neutro) y "Tengo un código"; archivados
  plegados al final ("Archivado (1)", con fecha y sin acciones). `/shine/me` se refresca al volver
  a la pantalla.
- **Ficha** `(auth)/learners/[uuid]/index.tsx`: identidad, "Quién practica con {nombre}" (los
  adultos, "Tú" para el titular) y acciones según `learnerActions(role)`: `owner` → "Cambiar
  nombre o avatar", "Invitar a otro adulto" (con "Hay un código activo hasta el {fecha}" si lo hay)
  y "Archivar"; `guardian`/`staff` → "Dejar de trabajar con {nombre}". Archivar y dejar de trabajar
  piden un segundo paso en línea (`ConfirmPanel`, no un `Alert` del sistema: se lee igual en web)
  que explica que el progreso se conserva y que se libera una plaza, o que el alumno sigue con los
  demás adultos (nombrados con `otherAdultsNames`). Si era el alumno activo, se vuelve al selector
  (o a crear uno si no queda ninguno: el guard decide).
- **Edición** `[uuid]/edit.tsx`: mismo formulario que el alta (componente nuevo
  `src/components/learners/LearnerFormFields.tsx`, que también usa `learners/new.tsx`).
- **Invitación** `[uuid]/invite.tsx`: sin código vivo lo genera al entrar; lo enseña en grande
  agrupado ("AG9 ST3"), "Sirve una sola vez, hasta el {fecha}", instrucciones, QR del enlace
  `Linking.createURL('/learners/join', {code})` (abre "Tengo un código" con el código escrito) y
  "Compartir" (hoja nativa con `Share`; en web, copiar al portapapeles con "Copiado"). Como el
  servidor solo devuelve el código una vez, se recuerda en memoria por alumno mientras siga vivo;
  si hay uno vivo que esta ejecución no conoce, lo dice y ofrece "Generar otro" (anula el anterior).
- **"Tengo un código"** `(auth)/learners/join.tsx`: campo con mayúsculas al escribir, normalización
  como el servidor (`normalizeInviteCode`: fuera todo lo que no sea letra o número) y validación
  local de forma (6 caracteres del alfabeto sin O/0/I/1) para no gastar intentos;
  `invite_invalid` → "Este código no sirve o ha caducado. Pide otro a quien te lo dio",
  `too_many_attempts` → "Demasiados intentos, espera un momento…", `own_invite` propio. Con éxito,
  `selectLearner` y al inicio. Se llega desde "¿Con quién vas a trabajar?" ("¿Vienes de un centro o
  te han invitado? Tengo un código"), desde Ajustes y por el QR (`?code=`).
- **Quién operó cada sesión** (§5.6): `operatorLabel` → "Contigo", "Con {nombre}" (de `adults`),
  "Con otra persona" si ese adulto ya no está, nada si la sesión no lo sabe. En el detalle de sesión
  bajo el título, y en "Detalle de estadísticas" (al que se llega desde "Mi progreso") como columna
  "Con quién" del historial, a partir de los nodos `session` incluidos con los summaries
  (`operatorsBySession`). Sin estadísticas por adulto.
- **Guard** (`app/_layout.tsx`): sin alumnos se puede ir a "Tengo un código" y a Ajustes (antes,
  sin alumno activo, Ajustes redirigía al selector y no había forma de cerrar sesión); en
  "¿Con quién vas a trabajar?" sin alumnos hay un engranaje a Ajustes. `selectLearner` refresca
  `/shine/me` si el alumno aún no está (recién creado o vinculado) y marca `selectingLearner` para
  que el guard no repita la selección en paralelo.
- **Iconos nuevos**: `share`, `archive`, `user-plus`, `pencil`, `copy`, `users`.
- **Tests** (`learnerScreens.test.ts`, 17; total 243 en 30 suites): acciones por rol y archivados,
  normalización, validación y formato del código, fechas y caducidad, mensajes de canje y de
  gestión (sin "error", "pago" ni "bloqueado"), textos sin género, otros adultos, etiqueta de
  operador y su extracción de `included`, texto de `covered_by`.

**Decisiones**:
- La ficha es una pantalla propia (`learners/[uuid]`) y no acciones sueltas en la lista de
  Ajustes: caben la lista de adultos y la confirmación en dos pasos sin saturar Ajustes.
- La invitación se genera sola al entrar si no hay ninguna viva (es lo que se pide al pulsar
  "Invitar a otro adulto"); con una viva que la app no conoce se pregunta antes de anularla.
- Los textos no asumen el género del alumno ("dejará de aparecer en tu lista", "las personas que
  practican con este perfil"); un test lo vigila.
- La marca de operador va en el detalle de estadísticas: "Mi progreso" no tiene lista de sesiones.

**Verificación**: `npx tsc --noEmit`, `npm run lint` (0 errores, los 4 avisos de siempre) y
`npm test` limpios. Recorrido en web (Expo + Chrome) con dos titulares nuevos: Ana registra a
Marta (zorro), su "Sesión para conocerte" y su "Sesión 1" muestran "Contigo" (cerradas por drush con
summaries de prueba); Ajustes → Alumnos → Marta ("Ahora", "7 sesiones de prueba") → ficha con las
tres acciones → "Invitar a otro adulto" muestra "AG9 ST3", caducidad del 6 de noviembre y QR;
"Copiar código" → "Copiado"; la ficha muestra "Hay un código activo hasta el 6 de noviembre" y al
volver a entrar se ve el mismo código. Bea se registra → "Tengo un código": "ab1" → "El código tiene
6 letras y números"; "ag9-st3" → inicio de Marta con su actividad y sin bloque inicial. En el
detalle de estadísticas de Bea, las dos sesiones "Con Ana"; su ficha de Marta solo tiene "Dejar de
trabajar con Marta" (con su confirmación). Código caducado (expirado por drush) → "Este código no
sirve o ha caducado…"; cuatro códigos falsos más → el sexto intento, "Demasiados intentos, espera un
momento…". Bea genera la "Sesión 2" ("Contigo"); Ana la ve "Con Bea". Ana renombra a Martina con
búho y la archiva en dos pasos: sin alumnos vuelve a "¿Con quién vas a trabajar?", Ajustes la lista
en "Archivado (1)"; Bea al entrar ya no la tiene en el selector. Datos de prueba borrados, flood
vaciado, `recent_window` de vuelta a 5 (se bajó a 0 durante la prueba porque el catálogo local no
daba para otra regular); `config:status` limpio; el único error de watchdog es ese 422
`no_content` provocado a propósito.

**Hallazgos de la verificación (corregidos)**: "Tú dejarás de verla" y "practican con ella"
asumían el género del alumno; el título de la edición decía "Cambiar a Marta" (ahora "Nombre y
avatar de Marta"); el ejemplo del campo era "ABC 123", con un 1 que los códigos nunca llevan (ahora
"ABC 234").

**Para subplanes siguientes**:
- **06b**: Ajustes ya tiene la sección "Alumnos"; la de plan y borrado de cuenta va debajo.
  `describeLearnerError('learner_limit')` sigue en neutro con el máximo.
- **08**: el cupo agotado al añadir alumno llega por el 422 de `learners/new`; el paywall puede
  colgarse ahí y en el 402 del dashboard.
- **10/12**: `covered_by_organization` ya se pinta ("Acceso activado por {centro}") en el selector,
  Ajustes y la ficha; `staff` ya ve solo "Dejar de trabajar".
- En Expo Go el QR codifica `exp://…/--/learners/join?code=…`; en un development build,
  `shine://learners/join?code=…`. Abrirlo sin sesión lleva al login y se pierde el código.

### 06b. App: "Tu plan" y borrado de cuenta en Ajustes (2026-10-29)

El código ya estaba en el árbol (entró con los commits del multiidioma, con los textos en el
catálogo de la FASE 18, no en objetos `*_COPY` como pedía el plan); esta entrada cierra el
subplan con la verificación.

- **Lógica pura** en `src/lib/accountScreens.ts`: `planLabel` (free "Prueba gratuita", family
  "Familia", courtesy "Invitación", professional, school; desconocido, tal cual), `statusLabel`
  (active/trial "Activo"; grace/billing_retry "Pendiente de renovación"; paused; expired/revoked
  "Caducado"; nada en el gratuito), `expiryLabel` ("Válido hasta el..." / "Sin fecha de fin"),
  `quotaUsage`/`quotaText` (activos de los que es `owner` y que no ocupan plaza de un centro,
  §3.3), `trialLines` (sesiones de prueba que le quedan a cada alumno), `organizationLines`
  ("Acceso de X activado por Y"), `deletionImpact` (la regla de `AccountDeleter`: en un centro o
  con otro adulto, solo pierdes el acceso; si no, se anonimiza; incluye los archivados),
  `validateDeletePassword` y `describeDeleteError` (`invalid_password` al campo; flood, sesión
  caducada, red y fallo genérico a un aviso sin "error"). Tests en `accountScreens.test.ts` (10).
- **Ajustes** (`app/(auth)/settings.tsx`): tarjeta "Tu plan" con plan, estado, caducidad, cupo
  "N de M", líneas de prueba y de centro, y "Gestionar suscripción" / "Restaurar compras"
  desactivados con la nota "Muy pronto..." (sin precios ni enlaces a las tiendas hasta 08); se
  refresca con `refreshMe()` en `useFocusEffect`. Sección "Cuenta": email, "Cerrar sesión" y
  "Borrar cuenta". La ayuda de la fuente dice "Se guarda para {nombre}".
- **Borrar cuenta** (`app/(auth)/account/delete.tsx`, `src/lib/api/account.ts`): a dos toques
  desde Ajustes (Apple 5.1.1 v). Explica qué pasa con cada alumno, pide la contraseña y llama a
  `POST /shine/account/delete`; con éxito, `logout()` con despedida y `/login` la muestra.

**Verificación**: `tsc` limpio, lint sin errores (4 avisos anteriores, ninguno en estos
ficheros), 307 tests en 36 suites. En Expo web con un titular nuevo (`borrar06b@test.com`,
registrado por la API con consentimiento): con un alumno, "Prueba gratuita", "1 de 1" y "Lía:
quedan 8 sesiones de prueba"; tras darle una cortesía familiar y dos alumnos más (Teo, solo
suyo; Nora, compartida con jose por código), al volver a Ajustes sin recargar: "Invitación ·
Activo · Sin fecha de fin", "3 de 3". "Borrar cuenta": Lía y Teo "solo trabaja contigo: se
borran su nombre y su avatar..."; Nora "sigue con otra persona" (jose no tiene
`field_display_name` y sale el respaldo). Contraseña incorrecta → "Esa contraseña no es la de tu
cuenta." en el campo; correcta → login con "Tu cuenta se ha borrado". En el servidor: titular,
Lía y Teo anonimizados (`deleted-*`, bloqueados), login con la contraseña antigua → 400
`invalid_grant`, y jose sigue viendo a Nora, promovido de `guardian` a `owner` (regla de §5.6).
Nora archivada después para no pasar el cupo de jose.

**Hito H1** (producto cerrado con muro): alcanzado con 06 y 06b.

**Para subplanes siguientes**:
- **08**: activar "Gestionar suscripción" y "Restaurar compras" en la tarjeta de `settings.tsx`
  (hoy `disabled` con `ui.settings.plan.soon`).

### 07. Backend: webhook de RevenueCat (2026-10-26)

Todo en `shine_entitlement`. En `config/sync`: `shine_entitlement.settings` (nuevo, solo el flag
`revenuecat_refresh = false`). El secreto va en `settings.php`, no en git. Detalle de la API en
`docs/api-design.md` ("Webhooks").

- **`POST /shine/webhooks/revenuecat`** (`RevenueCatWebhookController`): ruta anónima
  (`_access: TRUE`, sin CSRF porque no hay cookie). La cabecera `Authorization` se compara en
  tiempo constante (`hash_equals`) con `$settings['shine_entitlement.revenuecat_webhook_secret']`;
  sin secreto configurado, todo es 401 (`webhook_not_configured`) con error en watchdog; cabecera
  ausente o distinta, 401 (`unauthorized`) con aviso (sin registrar el valor recibido). Cuerpo sin
  objeto `event`, 400. Un producto fuera del catálogo, 422 con `source` y `product_id` para que
  RevenueCat reintente cuando se añada (§4.3). Lo demás responde 200 siempre: aplicado, repetido
  (`skipped`) o ignorado.
- **`shine_entitlement.revenuecat_processor`** (`RevenueCat\RevenueCatProcessor`): titular por
  `app_user_id` (y `aliases` / `original_app_user_id` como respaldo; un id anónimo o un usuario
  borrado se ignora con 200); entitlement por (`store` → `source`, `field_external_id` =
  **`original_transaction_id`**); solo `APP_STORE`, `MAC_APP_STORE` y `PLAY_STORE` (Stripe va por
  11; `PROMOTIONAL`, `AMAZON`, `TEST_STORE`... se ignoran con aviso). El producto se resuelve en el
  catálogo al crear y en cada evento que activa, así el cupo sigue al producto vigente. Todo en
  una transacción, con `field_raw_event`, `field_last_event_id` y `field_event_timestamp` (ms), e
  invalidación de `entitlement_list` y `user:{uid}` de los titulares tocados al terminar (la caché
  del acceso de 04). `TRANSFER` no trae transacción: mueve los entitlements de store de los
  `transferred_from` al primer titular de `transferred_to`.
- **Máquina de estados** (tabla en `api-design.md`): activadores (`INITIAL_PURCHASE`, `RENEWAL`,
  `UNCANCELLATION`, `PRODUCT_CHANGE`, `SUBSCRIPTION_EXTENDED`, `REFUND_REVERSED`) → `active` o
  `trial`, caducidad del evento, `cancelled_at` vacío; `CANCELLATION` → `cancelled_at`, y si
  `cancel_reason = CUSTOMER_SUPPORT` es un reembolso → `revoked` al momento; `BILLING_ISSUE` →
  `billing_retry` hasta el fin del periodo de gracia; `EXPIRATION` → `expired` (`revoked` por
  `CUSTOMER_SUPPORT`, `paused` por `SUBSCRIPTION_PAUSED`); `SUBSCRIPTION_PAUSED` solo anota;
  `TEST` y el resto de tipos, ignorados.
- **Idempotencia**: mismo `id` que el último aplicado → `duplicate`; `event_timestamp_ms` anterior
  → `stale`; 200 con `applied: false` y nada escrito.
- **Refresco bajo demanda**: sin clave de API todavía. Queda `SubscriberRefreshInterface` +
  `NullSubscriberRefresh` (`shine_entitlement.revenuecat_refresh`), el flag en
  `shine_entitlement.settings` (con `shine_entitlement_update_11001`, el módulo no tenía
  `.install`) y anotado dónde iría la clave (`$settings['shine_entitlement.revenuecat_api_key']`).

**Decisiones y desviaciones del diseño** (anotadas en `monetization.md` §6.1):
- `original_transaction_id` como id externo, no `original_app_user_id`: dos suscripciones del mismo
  usuario chocarían y un `TRANSFER` lo mueve.
- RevenueCat **no tiene eventos `REFUND` ni `REVOKED`** (comprobado en su documentación): el
  reembolso es `CANCELLATION` con `cancel_reason = CUSTOMER_SUPPORT`.
- `SUBSCRIPTION_PAUSED` llega antes de que acabe el periodo pagado; ponerlo en `paused` cortaría el
  acceso antes de tiempo. Se anota, y la `EXPIRATION` posterior (`expiration_reason =
  SUBSCRIPTION_PAUSED`) deja `paused`.
- `BILLING_ISSUE`: caducidad = fin del periodo de gracia si lo hay, si no la del evento. Una primera
  versión tomaba el máximo de tres fechas y ocultaba fixtures incoherentes.
- **El secreto no puede empezar por `Bearer `**: el proveedor de autenticación de simple_oauth es
  global y daría 401 antes del controlador; `_oauth_skip_auth` **no lo evita en una ruta solo POST**
  (simple_oauth la busca con un GET de prueba y no la encuentra). Lo pensaba usar y lo descubrió el
  test. Documentado en CLAUDE.md (gotcha 22 y tabla de ficheros fuera de git) y el controlador avisa
  en watchdog si el secreto configurado lleva el prefijo.
- Un evento de una suscripción sin compra registrada (webhook perdido) crea el entitlement con el
  estado que toque: rastro sin dar acceso.

**Tests kernel** (`RevenueCatWebhookTest`, 8 tests, sobre `EntitlementAccessKernelTestBase` para
que la cobertura la diga el servicio de 04; la suite de `shine_entitlement` queda en 31 tests y
1266 aserciones). Fixtures reales en `tests/fixtures/revenuecat/` (uno por tipo, 15 ficheros, con
la forma del webhook y `{{APP_USER_ID}}` como marcador; el reloj de pruebas se pone en el instante
de la compra). Cubre: 401 sin cabecera, con otra y sin secreto, y 401 de simple_oauth con prefijo
`Bearer `; compra → `billing_retry` con gracia (cubre) → renovación → evento antiguo y repetido sin
efecto → cancelación (cubre hasta caducar; `/shine/me` cubierto) → `EXPIRATION` (no cubre;
`/shine/me` plan `free` sin limpiar cachés); prueba de store, reembolso y reembolso revertido; pausa
de Play y su `EXPIRATION`; cambio de producto y vuelta con la renovación; `TRANSFER` entre titulares
(repetido, desconocido); producto desconocido 422, UUID desconocido y alumno ignorados, alias
anónimo que resuelve, `TEST`, tipo y store no soportados, sin transacción, cuerpos inválidos;
`EXPIRATION` sin compra previa.

**Verificación en el sitio** (jose, uid 2, con los fixtures y `local-dev-secret` en
`settings.php`): sin cabecera y con otra → 401; `/shine/me` pasa de `free`/no cubierto a
`family`/`active`/cubierto con `INITIAL_PURCHASE`, sigue cubierto en `billing_retry` (caducidad al
fin de la gracia), `active` tras `RENEWAL`, evento antiguo `stale` y repetido `duplicate` sin
cambios, sigue cubierto tras `CANCELLATION` y vuelve a `free`/no cubierto tras `EXPIRATION`, todo
sin `drush cr`; producto desconocido 422, UUID desconocido, `TEST` y store `STRIPE` ignorados con
200. Watchdog con los avisos esperados y 0 errores. Entitlement de prueba borrado; `cim -y` sin
cambios.

**Para subplanes siguientes**:
- **08 (app)**: `Purchases.logIn(uuid del titular)` es lo que hace que `app_user_id` resuelva; tras
  una compra, `refreshMe()` y, si el webhook aún no ha llegado, reintentar unos segundos (RevenueCat
  entrega en segundos pero no antes de responder a la app).
- **09**: configurar en RevenueCat la URL `https://{dominio}/shine/webhooks/revenuecat` y un
  "Authorization header value" sin `Bearer `; el mismo valor en `settings.php` de producción. Los
  `product_id` reales de las stores van al catálogo (`family`); con Play de 2023 en adelante el
  formato es `subscripcion:plan_base`.
- **11 (Stripe)**: mismo patrón (`RevenueCatProcessor` como modelo: resolver, upsert por
  (`stripe`, id de suscripción), idempotencia por `created` del evento, transacción, invalidación).
  Los eventos `STRIPE` que RevenueCat pudiera mandar se ignoran a propósito.
- Refresco bajo demanda: implementar `SubscriberRefreshInterface` cuando haya clave de API y
  engancharlo en `GET /shine/me` (04) detrás de `revenuecat_refresh`.

### 09. Stores y RevenueCat: identificadores y checklist (2026-10-29, en curso)

Las altas de Apple y Google están en trámite; RevenueCat ya existe sin configurar. Titular legal:
persona física (autónomo). Nombre definitivo, bundle id y package por decidir (14b). Precios
pendientes.

- **`docs/stores.md`** (nuevo): titular y estado de cada cuenta con fecha, efectos de ser persona
  física (vendedor con nombre propio, dirección pública en las dos fichas por DSA y por Google,
  prueba cerrada de 12 testers durante 14 días en cuentas personales de Play), tabla de
  identificadores (los decididos y los **EJEMPLO** a sustituir), dónde vive cada secreto,
  checklist de Apple, Google y RevenueCat, guion de sandbox para 08 y decisiones.
- **Planes base de Play decididos**: `monthly` y `annual`. Con ellos RevenueCat manda en el webhook
  `shine_family_monthly:monthly` y `shine_family_annual:annual`, así que se añadieron al catálogo
  `shine_entitlement.plan.family` (`config/sync`, importado y comprobado con `resolveExternal`).
  Siguen los ids sin plan base que usan los fixtures de 07.
- `docs/monetization.md` §2 y §11: precios pendientes, sin prueba de store, categoría Educación
  (no Kids), nombre y bundle id como bloqueo.

**Pendiente para cerrar 09**: completar las altas siguiendo el checklist de `docs/stores.md`,
sustituir los valores **EJEMPLO**, fijar precios y comprobar en RevenueCat los cuatro productos
sin avisos.

---

## FASE 20 — Secuencia con regla (segundo tipo de Funciones Ejecutivas y Atención)
**Estado**: 🔄 En curso (2026-10-29). Plan en `plans/funcions-executives/sequencia/README.md`;
propuesta E13 (`plans/contenido/encarrecs/E13-sequencia-amb-regla.md`) aprobada por el grupo el
mismo día sin cambios de parámetros, con secundaria Velocidad (`lliuraments/E13-resposta.md`).

- [x] **01. Modelo**: node type `activity_rule_sequence`, bundles `logrulesequence` y
  `summary_rule_sequence` (campos en `docs/activity-system.md`), `node.session.field_activities`,
  `ACTIVITY_BUNDLES` de sessionfeedback y activityfeedback (`sessionfeedback_update_11004`,
  `activityfeedback_update_11003`), motivación y `explanation_message` "Rule sequence". Script
  `private/scripts/fase20-01-backend.php` (copia en `dades-privades/scripts-copia/`) y `drush cex`.
- [x] **02. Importador**: `SequenceRule` y `RuleSequenceActivityHandler` (prefijo SEQ); tests
  `SequenceRuleTest` y `Fase20HandlerTest` (61 tests de shine_content en verde).
- [x] **03. Evaluador**: con `field_lures_count`, acierto = tasa de aciertos − tasa de falsas
  alarmas (`docs/level-system.md` §5.5); dos tests nuevos (25 en `SessionEvaluatorTest`).
- [x] **04. App**: `src/lib/ruleSequence.ts`, `ruleSequenceKind` (con el nuevo `elapsed` opcional
  del contrato de tipos: duración de la serie, porque `time` de cada entrada es el tiempo de
  reacción), `RuleSequencePlayer`, tipos, carga, router, estadísticas e iconos `target` y `pause`.
  `tsc` limpio, lint sin errores nuevos, jest 36 suites y 307 tests.
- [x] **05. Generador y lote**: `content/generadores/secuencia_regla.py` y
  `content/secuencia-regla-es-ca-level0-10-v1.json` (33 registros, 66 nodos), importado **sin
  publicar**.
- [x] **06 (parte)**: cuatro mensajes de explicación por familia (`scripts/create-sequence-explanations.php`,
  es y ca). Verificado como usuario normal (alumno 42): GET del nodo, POST 201 de log y summary,
  filtros por `uid` con datos (`private/scripts/fase20-verify.php`, deja todo como estaba).
- [x] **Respuesta E13 aplicada**: secundaria Velocidad en el lote; el generador evita tiradas del
  mismo elemento y tres objetivos encadenados (en Level9 salían "ma sol ma sol ma sol..."), lote
  regenerado y reimportado sin publicar. Revisión del lote R-SEQ1:
  `plans/contenido/revision/fe-secuencia-regla-v1.md`, paquete
  `shine/private/enviament-2026-10-29-E13/LOT-fe-secuencia-regla-v1.zip`.
- [x] **R-SEQ1 aprobada y publicada (2026-10-29)**: el grupo aprueba los 33 registros sin cambios
  (`lliuraments/respostes-2026-10-30/LOT-fe-secuencia-regla-v1-resposta.md`; cita los códigos, los
  pares y los recuentos reales del lote). `--publish`: 66 nodos publicados; Funciones Ejecutivas
  queda con 6 por celda de Level0 a Level10 en los dos idiomas (3 de la matriz y 3 de la secuencia).
- [x] **Recorrido en Expo web (2026-10-29)**: `jose@test.com`, sesiones de prueba de
  `private/scripts/fase20-session.php` (Marta, es: s1 con práctica, s3, s4 y s3 con regla oculta;
  Pau, ca: s2 y s4). Toques simulados con un script en la página según los índices del nodo, con un
  objetivo dejado pasar y un cebo tocado a propósito: todas las pantallas finales y los summaries
  cuadran (por ejemplo s3 9/10 y 7/8, s2 21/22 y 7/8, regla oculta 13/14 y 9/10). Práctica con
  "¡Esa sí!"; pausa: el elemento interrumpido no cuenta y el tiempo en pausa no suma (47,5 s); en
  Drupal 23 logs con `field_response` y tiempos de reacción de 459 a 500 ms. Textos catalanes
  correctos. **Cambio**: el fondo oscuro de s4 pasa de gris claro (el de las filas oscuras de la
  matriz) a la tinta del sistema de diseño con texto blanco, y la fila clara de la regla lleva
  borde: con una tarjeta nueva cada 1,6 a 1,8 s el gris no se distinguía.
- [ ] Pendiente: prueba en un móvil real (precisión del reloj y del toque).

## FASE 19 — Matriz con regla (Funciones Ejecutivas y Atención)

- [x] **Plan (2026-10-29)**: plans/funcions-executives/README.md, aprobado por el grupo como fase propia
  con los valores por defecto de la propuesta E10.4 (cuatro familias de regla, cebos que restan del
  acierto, tiempos por ronda, regla oculta en Level9 y Level10). Seis subplanes: modelo en Drupal,
  importador, evaluador, app, generador y lotes, mensajes y verificación. Las 12 respuestas de detalle
  (aro ámbar en los objetivos que faltan, flecha para "antes", apertura con 3 por celda; opción (d) y
  (b) para la v1.1) se añadieron al plan el 2026-10-29.
- [x] **01. Modelo (2026-10-29)**: en `activity_letter_matrix`, `field_rule` (list_string r1 a r4),
  `field_rule_params` (JSON de la regla canónica), `field_target_cells` y `field_lure_cells`
  (string_long múltiples, índices por ronda); `field_lure_marks` (integer) en `loglettermatrix` y
  `summary_letter_matrix`. Creados con `private/scripts/fase19-01-campos-regla.php` y `drush cex`
  (la API de campos de lista quiere `allowed_values` como clave => etiqueta).
- [x] **02. Importador (2026-10-29)**: `MatrixRule` (lógica pura: validar, forma canónica,
  clasificar celdas en objetivos y cebos, filas ambiguas, texto de `field_target`) y la clave `regla`
  en `LetterMatrixActivityHandler` con `objetivos_por_ronda` y `cebos_por_ronda` obligatorios;
  inventario con la regla y los recuentos (reimportar da "sin cambios"); huella con la regla solo si
  la hay (las matrices de siempre conservan la suya). Contrato en el catálogo 6.1. Tests: unit
  `MatrixRuleTest` y dos kernel en `Fase13HandlersTest`; `shine_content` 50 en verde.
- [x] **03. Evaluador (2026-10-29)**: `SessionEvaluator::effectiveRating()` resta `field_lure_marks`
  de los aciertos si el summary lo tiene (`hasField`, mínimo 0). Test `testLuresSubtractFromAccuracy`;
  `shine_level` 62 en verde.
- [x] **04. App (2026-10-29)**: `src/lib/letterMatrix.ts` (`parseRule`, `parseRuleRounds`: objetivos
  y cebos por índice desde `field_target_cells` / `field_lure_cells`; `evaluateRound` separa
  `lureMarks` de `falseMarks`; `isKeyCell`, `rowClass`), `LetterMatrixPlayer` (regla en fichas
  [a] → [p] en lugar del objetivo, columna de clave no tocable en r1, fondo de las filas oscuras en
  r4, con `oculta` cada ronda empieza enseñando la regla y el tiempo corre al pulsar "Empezar a
  buscar"), `field_lure_marks` en log y summary solo con regla (la matriz de siempre no cambia de
  payload), textos `player.letterMatrix.rule.*` en es y ca. `tsc`, lint y 293 tests en verde.
  **Pendiente**: jugar una matriz de cada regla en Expo web (hace falta contenido publicado).
- [x] **05. Generador y lotes (2026-10-29)**: `shine/content/generadores/matriz_regla.py` (semilla,
  misma clasificación que `MatrixRule`, sin b/d/p/q, neutros sin rasgos comunes con objetivo y
  contexto, objetivos en las dos mitades, tope por fila hasta Level3, sin filas ambiguas).
  `matriz-regla-es-ca-level0-8-v1` (27 registros, `idiomas`) y `matriz-regla-level9-10-v1` (6 por
  idioma, artículo + nombre): 66 actividades, 3 por nivel e idioma, importadas **sin publicar**.
  Revisión plans/contenido/revision/fe-matriz-regla-v1.md (`revision_lote.py` muestra la regla y
  cada ronda por filas con objetivos en negrita y cebos en cursiva), paquete
  `shine/private/enviament-2026-10-30/LOT-fe-matriz-regla-v1.zip`.
- [x] **Revisión y publicación (2026-10-29)**: el grupo aprueba el lote entero y las seis decisiones
  (respostes-2026-10-30/LOT-fe-matriz-regla-v1-resposta.md); los 66 nodos publicados con
  `--publish`. Funciones Ejecutivas tiene 3 por nivel en los dos idiomas y entra en la rotación
  (la siguiente sesión de Marta ya trae MAT-ES-L00-ATE). Jugada en Expo web con Marta: la clave de
  fila no se toca, el cebo marcado vuelve a neutro sin mensaje, y llegan `field_lure_marks` 1 al
  summary y al log de la ronda 1 (`field_correct` falso). El click del extensión de Chrome no
  dispara las tarjetas del selector de alumno (sí `element.click()`): es de la herramienta, no de la app.
- [x] **06. Mensajes y verificación (2026-10-29)**: `shine/scripts/rule-explanation-images.php`
  (GD, sin fuentes: cuatro PNG de ejemplo en `content/images/explicaciones/`, objetivos en teal con
  check, clave en gris, flecha del contexto, fondo de las filas oscuras) y
  `shine/scripts/create-rule-explanations.php` (contenido por entorno, idempotente: media `regla-r1`
  a `regla-r4` y los `explanation_message` "Rule key row", "Rule after", "Rule except after" y "Rule
  alternate", texto para el adulto en es y traducción ca). `matriz_regla.py` referencia el de cada
  familia; lotes reimportados (solo cambia `explicacion`). App: `getExplanationMessage()`
  (`src/lib/api/messages.ts`, caché por idioma) y la intro de `ActivityBase` enseña la imagen y el
  texto si el mensaje trae imagen (los mensajes genéricos no cambian nada), con la intro desplazable
  y sin el icono grande para que quepa. En la matriz, ●, ■ y ◆ se agrandan (`SYMBOL_SCALE`): con la
  fuente del sistema salían mucho más pequeños que ▲ y ★. Recorrido en Expo web con Pau (ca): intro
  con la imagen y el texto catalán, matriz r1 en catalán. 293 tests en verde. Metro no recarga los
  cambios hechos fuera del editor: tras editar, `npx expo start --web --clear`.
- Pendiente: jugar en la app r2, r3, r4 y la regla oculta (cuando un alumno llegue a esos niveles o
  con un alumno de prueba subido de nivel) y las 6 por celda del régimen ordinario.

## FASE 18 — Multiidioma (castellano y catalán)
**Estado**: ✅ Completada el 2026-10-27 (06), con los pendientes listados en 06 y en `plans/multiidioma/README.md` ("Lo que quedó fuera"). Plan de planes en `plans/multiidioma/README.md`; análisis en `plans/multiidioma/analisis.md`.

Decisiones de producto (cerradas el 2026-10-26): cada alumno elige idioma al darse de alta; cambiar
de idioma reinicia su progreso; dos idiomas = dos perfiles del mismo niño; de momento la interfaz
comparte el idioma del alumno activo; el contenido y las estadísticas anteriores eran de ejemplo.

### 00. Estructura catalana del experto (2026-10-26)

- [x] `plans/multiidioma/estructura.md` (documento para el experto) y respuesta en
  `plans/multiidioma/Shine en Catalán.md`: áreas, perfil lector y referencias por nivel, tipos,
  ciclo de 8 bloques, sonoridad (4 grupos, 33 términos) y esfuerzo (4 grupos, 19 términos).
- [x] Versión normalizada en `plans/multiidioma/estructura-ca.md` (nombres definitivos y únicos,
  ciclo con pesos, nivel mínimo, 8 preguntas abiertas al experto: desglose de dígrafos, orden del
  ciclo, que/qui y gue/gui, codas CVCC e hiatos en L3, silabeo de tx según el IEC).
- [x] Datos listos para importar: `shine/scripts/phonology-terms.es.json` (copia de los 38
  términos actuales) y `phonology-terms.ca.json` (52 términos). El script que los lee llega en 02.
- [x] CSV del banco de imágenes relleno por Fable (432 fichas: 423 usables, 9 no usables; nivel
  lector por la tabla 2.3 catalana; grupos fon:, espejo:, graf: y sib: generados del nombre).
  Pendiente de revisión del experto (criterios en `estructura.md` 9.1).

### 01. Backend: modelo de idioma (2026-10-26)

- [x] Idiomas `es` (por defecto, sin prefijo) y `ca` (`/ca`). `en` se mantiene instalado sin
  negociar (prefijo `/en`) porque las 756 entidades de configuración llevan `langcode: en`;
  borrarlo las dejaría huérfanas.
- [x] `scripts/migrate-langcode-en-to-es.php`: migración por SQL de toda tabla con columna
  `langcode` (11.632 filas: nodos, paragraphs, términos, media, usuarios, `preferred_langcode`,
  `node_access`, `path_alias`, índice de búsqueda) sin disparar presaves. Idempotente; ninguna fila
  queda en `en`.
- [x] `language.content_settings` para los 10 bundles de nodo, 5 vocabularios, 2 paragraphs, media y
  los 2 mensajes: idioma por defecto `es`, alterable; traducción (`content_translation`) solo en
  `areas`, `activity_cycle` y `activity_message`.
- [x] `scripts/translate-interface-terms.php`: traducción `ca` de las 5 áreas (nombres del
  experto) y de los 7 mensajes (texto provisional, a revisar en 05); el ciclo "Sílabas" no existe
  en local y el script lo dice. `GET /ca/jsonapi/taxonomy_term/areas` devuelve los nombres catalanes
  con el mismo uuid que `GET /jsonapi/taxonomy_term/areas`.
- [x] `shine_account`: `POST /shine/learners` acepta `langcode` (es | ca; ausente = es; otro,
  422 `langcode`), `LearnerManager::create()` fija `preferred_langcode` (y el `langcode` de la
  entidad si el idioma está instalado), la forma `learner` lleva `langcode`, `PATCH` con `langcode`
  llama a `LearnerManager::setLanguage()` (solo owner, transacción, hook nuevo
  `hook_shine_learner_language_change()`) y responde `reset: true|false`.
- [x] `shine_level`: `ChangeReason::LanguageChange`, `LevelReset::reset($user, $reason)` y
  `resetForLanguageChange()` (borra activitylog, activitysummary, sessionfeedback y
  activityfeedback del alumno y despublica todas sus sesiones), hook implementado en
  `shine_level.module`; `LevelLadder::contentQuery(area, nivel, langcode)`, `hasContent()` y
  `languageOf()`; generador, evaluador, ciclo y `SessionPlan` con idioma; la sesión nace con el
  `langcode` del alumno; `--dry-run` imprime `langcode` e "Idioma: xx.".
- [x] Vistas: columna y filtro de idioma en `shine_sessions`; idioma del alumno en `shine_levels`.
- [x] Tests: `shine_level` 58 tests (nuevo `LanguageTest`: techo por idioma, generador y ciclo solo
  del idioma del alumno, reinicio por cambio de idioma) y `shine_account` 27 tests (nuevo
  `testLearnerLanguage` con el módulo de prueba `shine_account_test`: alta, validación, mismo idioma
  sin reinicio, fallo del hook deshace el cambio, reset con token revocado, guardian 403, `/shine/me`).
- [x] Verificado en el sitio como jose (gotcha 14): sesiones y estadísticas de ejemplo borradas;
  cortesía familiar y dos alumnos, Marta (`es`, uid 42) y Pau (`ca`, uid 43); `generate` de Pau
  422 `no_content` y de Marta 201 con sesión `es`; `PATCH langcode` inválido 422; es → ca `reset:
  true`, token de alumno anterior 401, sesión despublicada, 5 entradas `language_change`; vuelta a
  es y mismo idioma `reset: false`. `config:status` sin diferencias; watchdog sin errores nuevos.
- Hallazgos: el storage SQL no carga los valores de campo guardados en un idioma no instalado
  (por eso el `langcode` de la entidad solo toma el idioma si existe; en kernel tests sin
  `language` solo hay `en`); un nodo creado con un `langcode` no instalado guarda el valor pero
  `language()` devuelve el del sitio (los kernel tests de idioma instalan `language` y crean es y ca).
- Pendiente para los siguientes subplanes: 02 (importador: clave `idioma`, códigos con idioma,
  huella y cobertura por idioma, términos desde los JSON, handler de imágenes), 03 y 04 (app), 05
  (contenido catalán y revisión de mensajes y CSV), 06 (verificación). Hasta 02 no hay contenido
  catalán: un alumno `ca` recibe 422 `no_content`.

### 02. Backend: importador bilingüe, banco de imágenes y posición de imágenes (2026-10-26)

- [x] Respuesta del experto a las 8 preguntas (`plans/multiidioma/resposta-estructura-ca.md`): todo
  confirmado; la única novedad es Level2 para monosílabos muy frecuentes con coda final simple
  (dent, pont, font, porc, serp, forn, guant, talp, llamp, cranc, tronc, test), aplicada al CSV del
  banco (validado por el experto: 22 L0, 248 L1, 89 L2, 64 L3, 4 L5) y a `estructura-ca.md`.
- [x] Contrato del lote: `idioma` (es | ca) o `idiomas` (lista) obligatorio; con `idiomas` un nodo
  por idioma con el mismo material, y cualquier valor puede ser un objeto por idioma (`Localizer`:
  título, instrucción, sonoridad, esfuerzo, `nombre` de cada imagen). Código `TIPO-XX-Lnn-AREA-nnn`
  (con `idiomas` el lote lo escribe sin XX y el importador lo inserta); un código no cambia de
  idioma. Informe con una fila por idioma.
- [x] Huella sha256(tipo, idioma, material); duplicados y solapamiento solo dentro del idioma;
  sobreuso por tipo, idioma y nivel; `TermResolver` busca sonoridad y esfuerzo dentro del idioma
  del nodo y áreas, niveles, ciclos y explicación por su nombre canónico castellano.
- [x] `scripts/create-phonology-terms.php -- es|ca` lee `scripts/phonology-terms.{es,ca}.json`
  (idempotente por vocabulario, idioma y nombre): es sin cambios (46 términos con grupos), ca
  creados 60 (8 grupos, 33 + 19 términos).
- [x] Cobertura por idioma al final de cada importación; `shine-content:inventory --lang`, código
  siguiente por prefijo con idioma, `uso_unidades` por tipo, idioma y nivel, clave `idioma` en
  cada registro exportado (el inventario sigue siendo reimportable sin cambios).
- [x] `drush shine-content:import-images content/images/manifest.json` (`ImageBankImporter`): 432
  media de imagen con name y alt = slug, ficheros en public://banco-imagenes/, idempotente (segunda
  pasada 432 sin cambios), descartados omitidos (5). Los 4 media de prueba antiguos se borraron.
- [x] `ImagePositionActivityHandler` (prefijo IMG, paragraphs i1 e i1_item, media por slug, nombres
  por idioma; forma canónica sin nombres ni orden de grupos; unidades = slugs). Primer handler con
  media y paragraphs nacido bilingüe.
- [x] Contenido: borradas las 33 actividades de demostración (A1, A2, A3 incluidas) y la sesión
  que quedaba; los tres lotes de `shine/content/` reescritos con `idioma: es` y códigos ES y
  reimportados (30 actividades); lote de ejemplo `content/fase18-ejemplos-v1.json` (matriz p/b/d/q
  y posición de imágenes con `idiomas` [es, ca], parpadeo solo ca, sílabas es con imagen por slug):
  dry-run, importación, publicación y segunda pasada sin cambios.
- [x] Hito de control del README: `shine-level:generate --dry-run` del alumno ca recibe la matriz,
  la posición de imágenes y el parpadeo catalanes (nada en castellano); el es recibe solo
  castellano. JSON:API devuelve la actividad de sílabas con el media `gato` y el fichero de
  `banco-imagenes/` (200 por HTTP). `config:status` sin diferencias; watchdog sin errores nuevos.
- [x] Tests: `shine_content` 34 tests (nuevos `Fase18LanguageTest`: Localizer, idioma obligatorio
  y código con idioma, un nodo por idioma con términos de cada idioma, duplicados por idioma,
  inventario y cobertura por idioma; `ImageBankTest`: banco por slug idempotente con sustitución
  de fichero, handler de imágenes con paragraphs, reutilización, validación, huella y bilingüe) y
  `shine_level` 58; los tests existentes se pasaron al formato de código con idioma y al helper
  `installLanguages()` de `ShineLevelKernelTestBase` (es por defecto y ca, como en el sitio).
- Hallazgo: en kernel tests sin el módulo `language` el idioma por defecto es `en` y los términos
  nacen en `en`; con vocabularios por idioma eso rompe la resolución, por eso el helper.
- Pendiente: 03 y 04 (app), 05 (contenido catalán: lotes por tipo con los nombres del CSV; los
  tres lotes castellanos y el de ejemplo son material de prueba), 06 (verificación). El bloque
  ca del manifiesto (05) sale del CSV validado.

### 03. App: infraestructura de idiomas y extracción de textos (2026-10-26)

- [x] i18n-js 4.5 y expo-localization 17 (instalados con npx expo install y Node 21 desde la sesión).
  src/lib/i18n.ts: t() con claves tipadas a partir de es.json (una clave inexistente no compila),
  plurales con count, es por defecto y de reserva, setLocale, getLocale, deviceLocale (es o ca,
  si no es), useLocale, dateLocale (es-ES o ca-ES), formatDecimal y formatDayMonth (el mes va con
  su preposición en el catálogo por el apóstrofo catalán: 1 d’octubre). El layout raíz usa el
  idioma como key de la pila: al cambiar, se repintan todas las pantallas.
- [x] Catálogos src/locales/es.json y ca.json con 464 textos cada uno, en ui.* (tutor) y player.*
  (niño): ui.common, ui.date, ui.auth, ui.account, ui.settings, ui.learners, ui.operator, ui.api,
  ui.dashboard, ui.session, ui.nav, ui.components, ui.activities, ui.statistics, player.common,
  player.rating, player.feedback y un espacio por tipo de actividad. Convención en
  docs/conventions.md §3 "Textos e idiomas".
- [x] Extracción completa de app/, src/components y src/lib: desaparecen todos los objetos *_COPY
  (learnerScreens, sessionCards, accountScreens, learnerCopy, RATING_COPY y los demás); las
  funciones de src/lib conservan nombre y firma y devuelven el texto traducido. Ningún texto
  calculado al cargar un módulo. El escáner de literales (cadenas y texto JSX sin comentarios)
  deja cero textos visibles en castellano; quedan solo mensajes internos de errores que nunca se
  pintan y el label interno de los logs que se envían a Drupal (los fijan los golden payloads).
- [x] Formatos: fechas con dateLocale(); coma decimal en el ritmo (formatPerSecond con "por
  segundo" del catálogo), en los segundos de la pantalla de resultado, de las tablas y de los
  ejes de los gráficos. En castellano el único cambio visible es ese: "16,9 s" donde antes salía
  "16.9 s".
- [x] Fuentes: Nunito (400 a 800) y OpenDyslexic (Regular y Bold) tienen ç, l·l (U+00B7), ï, ü, à,
  è, ò, ’ y «» (comprobado en la tabla de caracteres de cada fichero) y se ven bien en web.
  Pendiente la misma comprobación en Expo Go: la línea de glifos de Ajustes (abajo) la muestra en
  las cuatro combinaciones.
- [x] Tienda: app.json con el plugin expo-localization (supportedLocales es y ca:
  CFBundleLocalizations en iOS y localeConfig en Android) y locales con los textos nativos por
  idioma en shine-app/native-locales (nombre visible y avisos de micrófono y voz). Nota sobre la
  ficha en dos idiomas en plans/prompts/14b.
- [x] Conmutador temporal "Idioma de la app (pruebas)" en Ajustes, guardado en el dispositivo
  (store de settings), con la línea de glifos en Nunito y OpenDyslexic, regular y bold. Lo
  sustituye el subplan 04 (idioma del alumno activo).
- [x] Backend: el título del nodo de sesión va en el idioma del alumno (SessionGenerator::TITLES:
  "Sessió 1", "Sessió per conèixer-te 1", "Sessió d’ajust"), porque la app muestra tal cual el
  título de las regulares y el historial de estadísticas. Test en LanguageTest; shine_level 58 OK.
- [x] Verificación: tsc limpio, lint sin errores (4 avisos anteriores), jest 32 suites y 268 tests
  (nuevo i18n.test.ts: mismas claves en es y ca, mismos marcadores, plurales completos, toda clave
  literal del código existe, fechas y coma decimal; casos en catalán en los tests de textos).
  Recorrido en web: entrar, crear cuenta, selector, inicio, Ajustes, "Mi progreso" y su detalle en
  los dos idiomas; sesión completa en catalán con Pau (posición de imágenes, matriz de letras y
  parpadeo, con las valoraciones y el fin de sesión) y ordenar sílabas con Marta. Dos fallos
  encontrados y corregidos en el recorrido: las opciones de "¿Cómo ha ido?" se calculaban al
  cargar el módulo y salían en castellano, y el punto decimal de los segundos.
- Traducción catalana **provisional**, pendiente de revisión por hablante nativo (05 o el experto).
  Puntos marcados por los agentes: "sobrenom" por apodo, "Configuració" por Ajustes, "Tancar la
  sessió", "Esborrar el compte", "Lletres arrodonides / molt separades", la frase de muestra de la
  letra, "Que es creï un compte a Shine, premi «Tinc un codi»..." (registro), "No passa res: a
  tothom li costa alguna cosa", "t’ha sortit més rodona", "En tens una altra a punt", "Canviar
  d’alumne", "Bon dia, tu", "Sessió per conèixer-te", "El teu punt fort: X" (evita el género de
  fort/forta), "Continua brillant!", "Compara’t sempre amb tu", "Intent" en los ejes, "Totes les
  N!", "N’has trobat X de Y!", "Troba totes les", "Espai" por hueco, "Treure’n una", "Comptar
  error", "Error i següent", "Bona feina! Has acabat aquesta activitat." y "En quina posició
  estava?". Las frases con "de" delante de un nombre se reformularon para no depender del
  apóstrofo ("%{name}: nom i avatar"); "Soc" y "Vens" ya sin diacrítico (IEC 2017).
- Pendiente:
  - Expo Go en dispositivo: glifos y recorrido (solo se ha probado en web).
  - Recorrido en navegador de partir palabras, repetición rápida y lectura en voz alta (sus textos
    pasan los tests y tsc, pero no se han jugado).
  - Fallo anterior, no de idioma: en el parpadeo, tocar varias veces durante la animación de 150 ms
    suma avances y el índice se salta el final ("8 / 7", la actividad no termina). Un niño que
    toca rápido puede provocarlo.
  - Fallo anterior: con un solo intento, los ejes de los gráficos de detalle muestran marcas
    fraccionarias ("#0.9999999999").
  - Contenido (05): la instrucción del lote de ejemplo usa apóstrofo recto (d'ells); conviene fijar
    el tipográfico en los lotes catalanes como en el catálogo.
  - Hecho en 04 (abajo): el conmutador ya no existe; idioma del alumno y /ca/jsonapi.

### 04. App: idioma del alumno (2026-10-26)

- [x] API: createLearner y updateLearner con langcode; updateLearner devuelve { learner, reset };
  Learner.langcode (opcional: un alumno sin idioma, anterior a la FASE 18, se trata como es con
  learnerLocale()); langcode de la sesión en SessionAttributes.
- [x] Alta "¿Con quién vas a trabajar?": selector obligatorio con dos tarjetas grandes
  (Castellano, Català, sin banderas), preseleccionado el idioma de la app, con la nota "Para
  trabajar en los dos idiomas, crea un perfil por idioma" (componente LanguagePicker).
  learnerForm valida el idioma del alta (es o ca) y no lo exige en la edición de nombre y avatar.
- [x] Ficha del alumno: "Idioma: Castellano"; "Cambiar idioma" (solo owner, nueva acción
  language de learnerActions) con ConfirmPanel que avisa del reinicio y ofrece "Crear otro
  perfil" (ConfirmPanel admite ahora una alternativa). Tras el PATCH: refreshMe(), token de
  alumno nuevo (selectLearner con freshToken, el anterior queda revocado) y el inicio, vacío. En
  las frases el idioma va en minúscula y en el idioma de la app ("¿Pasar a catalán?", "Vols
  passar a castellà?").
- [x] Etiqueta discreta ES o CA (LanguageTag) en el selector y en la lista de Ajustes, solo si el
  titular tiene alumnos activos en los dos idiomas.
- [x] Idioma de la app ligado al alumno activo: una suscripción al store de auth aplica el del
  alumno al elegirlo, restaurarlo o refrescarlo, y el del dispositivo al soltarlo o cerrar la
  sesión. startRoute no cambia. Fuera el conmutador temporal de 03 (Ajustes y store de settings)
  y sus textos.
- [x] Juego: los mensajes de motivación se piden en el idioma del juego. La sesión cargada se
  compara con el alumno (sessionPlayerLocale): si no coincide, aviso en consola y player.* en el
  idioma de la sesión (setPlayerLocale, que solo afecta a player.*; es la pieza para separar
  interfaz y juego en una v2).
- [x] Recursos traducidos: apiFetch con opción lang (jsonapiBase: API_BASE/jsonapi para es,
  API_BASE/ca/jsonapi para ca); la usan areas.ts y messages.ts, con caché por idioma. El ciclo
  no se muestra en la app. El resto de llamadas no cambia.
- [x] Textos: 17 claves nuevas en ui.learners.language (es y ca).
- [x] Tests: 34 suites y 288 tests (nuevos: store de auth con el idioma al elegir, sin idioma,
  al soltar y al cerrar sesión, y freshToken; jsonapiBase; learnerForm con idioma;
  learnerScreens con etiquetas, nombres y acción language; sessionPlayerLocale; i18n con
  learnerLocale y el idioma del juego). startRoute y tokenFlow sin cambios. tsc limpio, lint sin
  errores.
- [x] Recorrido en web con jose@test.com: selector con ES y CA; Pau pone la app en catalán (y la
  conserva al recargar), Marta en castellano; áreas y mensajes pedidos a /ca/jsonapi con Pau;
  Pau juega en catalán con el mensaje de motivación catalán; "Cambiar idioma" de Marta a catalán
  pide confirmación, reinicia, deja inicio y estadísticas vacíos y la sesión nueva es de
  contenido catalán; y vuelta a castellano desde la ficha en catalán (Marta queda en es, como
  estaba). El alta enseña el selector con el idioma de la app preseleccionado.
- Nota del recorrido: en esa pestaña del navegador automatizado los clics de ratón no llegaban a
  la app (ni en el selector ni en la barra inferior); con clics por JavaScript todo funciona. Es
  del entorno de pruebas, pero conviene repetir el recorrido a mano en web y en Expo Go.
- Pendiente: 05 (contenido catalán) y 06 (verificación bilingüe completa, incluido Expo Go).

### 05. Contenido catalán: escala, taxonomía, términos, manifiesto y lotes (2026-10-26)

- [x] Catálogo (docs/exercise-catalog.md): perfil lector catalán (2.2), referencias lingüísticas
  catalanas con la fuente CTILC o BDLOC (2.3), nivel mínimo por estructura catalán (3.5), ciclo
  Síl·labes con sus 8 bloques y pesos (5.3), un párrafo "En catalán" en cada tipo (5.1 a 6.4),
  letras admitidas (4.3), cobertura por idioma (7), filas de estado y de la decisión del ciclo (8) y
  la lista de decisiones que contradicen la versión castellana.
- [x] docs/generador/Taxonomía fonológica (català).md (grupos, términos definitivos, letras,
  ejemplos, motivo clínico, nivel mínimo, lo propio del catalán, JSON de resumen) con la
  verificación en Drupal: create-phonology-terms.php -- ca sin cambios (60), términos ca iguales al
  JSON y castellanos intactos, filtros JSON:API por grupo dentro del idioma como usuario normal
  (gotcha 14): sonority ca 37 (33 términos más 4 grupos), parent "Oposició sorda/sonora" 7, blink ca
  con sonoridad m solo la catalana.
- [x] docs/generador/Guía de Parametrización (català).md: 8 tipos (la castellana no tenía la
  repetición rápida), 86 ejemplos originales en catalán de Level0 a Level10, reglas comunes
  (silabeo del IEC, apóstrofos desde Level3, alivio, vocal neutra). Provisional, pendiente del experto.
- [x] Traducciones de interfaz: áreas y ciclo son ya las del experto; los textos de los mensajes
  los revisó el equipo técnico (apóstrofo tipográfico, mismo tono que la app) y quedan pendientes
  del experto, que no entregó textos de mensajes. Término del ciclo "Sílabas": nuevo
  scripts/create-cycle-term.php (idempotente, antes de translate-interface-terms.php; añadido a
  CLAUDE.md), traducción "Síl·labes" creada.
- [x] Banco de imágenes: bloque ca en las 432 entradas del manifiesto (nombre, artículo, silabeo
  del IEC, nivel lector catalán, etiquetas, usable, nota), desde el CSV validado; 423 usables y 9
  no usables marcadas (no borradas); clave idiomas en la raíz. El manifiesto pasa a ser la fuente
  única del nombre catalán; el CSV queda como registro. docs/generador/Banco de imágenes.md
  actualizado (4, 5.4, 5.7: parejas que dejan de serlo, pares mínimos nuevos, grupos de sílaba
  inicial catalanes). No hizo falta ninguna imagen nueva.
- [x] Importador: los handlers de segmentación y repetición rápida admiten las letras del catalán
  (ç, à, è, ò, ï, ü, l·l con U+00B7 y apóstrofo recto o tipográfico); dos tests nuevos; shine_content
  36 tests OK. Era un bloqueo real para los lotes catalanes (el plan decía "sin código nuevo").
- [x] Lotes (shine/content/, convenciones en plans/multiidioma/prompts-contenido/README.md; todos
  con dry-run sin errores, importados y publicados en local como contenido de prueba):
  matriz-es-ca-level0-2-v1 (9 bilingües + 1 catalana con l·l; generadores/matriz.py, semilla 4411),
  imagenes-es-ca-level0-2-v1 (9 bilingües, 96 imágenes sin repetir; generadores/imagenes.py,
  semilla 1805), blink-ca-level0-2-v1 (24: 6, 10 y 8), ciclo-sillabes-ca-v1 (44, pesos 10 a 440),
  silabas-ca-level0-2-v1 (9, con imagen y silabeo del manifiesto), repeticion-ca-level0-2-v1 (9) y
  segmentacion-ca-level1-2-v1 (6). 111 registres, 129 nodos nuevos (los bilingües son dos). Prompts
  para Cowork o Codex por tipo (01 a 07) con la misma estructura que Banco de imágenes.md.
- [x] Cobertura publicada (sin ciclo, Level0 / Level1 / Level2): catalán Lingüística 3 / 6 / 6,
  Memoria 4 / 3 / 3, Perceptivos 4 / 3 / 4, Velocidad 10 / 13 / 11; castellano Lingüística 2 / 1 / 2,
  Memoria 4 / 3 / 3, Perceptivos 5 / 4 / 4, Velocidad 8 / 8 / 7. El catalán cumple el mínimo de
  apertura (3 por celda) en las cuatro áreas con tipo; Funciones Ejecutivas sigue en 0 en los dos
  idiomas (ningún tipo la tiene como principal). Ninguna celda llega al mínimo de régimen (6).
- [x] Verificación: shine-level:generate 43 --dry-run con Pau en estado regular (puesto y restaurado
  a mano) da "Sessió 1" con tres huecos de área (Lingüística, Memoria, Perceptivos) más el ciclo
  (BLK-CA-CIC-SILABAS-010) y salta Funciones Ejecutivas, como en castellano; Marta no recibe ciclo
  (el castellano no tiene lote de ciclo). Watchdog sin avisos de techo nuevos. Inventario ca: 114
  actividades; es: 51.
- [x] Revisión del experto: plans/multiidioma/revisio-lots-ca.md (tabla por lote con código,
  nivel, título y material, columnas para el veredicto; como los lotes tienen 3 por nivel, la
  muestra es el lote entero y del ciclo al menos una por bloque) más la lista de dudas de cada
  generador (pseudopalabras, grupos de lectura del ciclo, ambigüedad en sílabas y segmentación,
  frecuencia de palabras).
- Hallazgos:
  - El importador no admite elementos repetidos y el diseño del ciclo pide "las mismas
    desordenadas": el ciclo catalán va en parejas (mu ma, mi me). Decisión pendiente (catálogo 8).
  - Ela geminada en "Ordena las sílabas": col-le-gi daría "collegi" al unir fichas; propuesta col·,
    le, gi (solo Level3). Enclíticos con guion (dona-m’ho) no pasan el patrón de segmentación.
  - Los mensajes de explicación castellanos "Activity vertical text" (lorem ipsum) y "Rapid
    repetition" (vacío) siguen sin texto en castellano.
- [x] **Revisión del experto de los lotes (2026-10-27)**: respuesta en
  plans/multiidioma/resposta-revisio-lots-ca.md, aplicada y registrada en revisio-lots-ca.md
  (apartado "Resultat de la revisió"). Cambios:
  - Ciclo: una sílaba o vocal por pantalla. BlinkActivityHandler admite repetidos que no vayan
    seguidos (rechaza el mismo elemento dos veces seguidas); test nuevo, shine_content 37 tests OK.
    Las 44 actividades del ciclo reimportadas con la vuelta desordenada en sílabas sueltas.
  - Segmentación: recuperadas casa, pare, mare, pilota, vola y a la (la app ya corregía contra la
    frase declarada); 4 de las 6 actividades corregidas. La regla de ambigüedad del catálogo 6.3
    pasa a "descartar solo si otra partición tiene sentido", también en castellano.
  - Matriz de l·l: MAT-CA-L02-PER-001 despublicada; el registro es MAT-CA-L03-PER-001 en
    content/matriz-ca-level3-v1.json (generador con --catalan), sin importar hasta que exista Level3.
  - Level0: posición de imágenes solo con monosílabos o bisílabos simples en los dos idiomas
    (`nombre_simple` en generadores/imagenes.py, 48 imágenes) y Level0 regenerado; IMG-L00-MEM-003
    tenía un summary de Marta, así que sus dos nodos están despublicados y el material nuevo es
    IMG-L00-MEM-005. Repetición rápida: sala y dona por pota y pila.
  - Validados sin cambios: col·, le, gi en sílabas (Level3), descarte por permutación, ala y ona en
    Level0, etiquetas CVC, enclíticos solo con apóstrofo como solución temporal.
  - Cobertura ca publicada (Level0 / Level1 / Level2): Lingüística 3 / 6 / 6, Memoria 4 / 3 / 3,
    Perceptivos 4 / 3 / 3, Velocidad 10 / 13 / 11; sigue el mínimo de apertura en las cuatro áreas.
  - Sin respuesta del experto: pseudopalabras, grupos de lectura del ciclo, frecuencias, codas de
    surt y dorm, documentos de taxonomía y parametrización y textos de los mensajes.
- [x] **Respuesta del experto a las dudas restantes (2026-10-27)**:
  plans/multiidioma/resposta-dubtes-revisio-lots-ca.md, registrada en revisio-lots-ca.md. Cambios:
  - Pseudopalabras, frecuencias, blau, flor, plat y tren en Level2, y los dos documentos catalanes
    validados sin cambios en los lotes.
  - surt y dorm pasan a Level2: la excepción de monosílabos frecuentes con coda simple incluye
    ahora rm (estructura-ca.md, catálogo 3.5, taxonomía catalana); corregido el ejemplo de Level1
    de segmentación en la guía catalana.
  - Ciclo: los grupos que no son sílabas del IEC (rra, assa, tge, aix, al·la) se mantienen como
    patrones de lectura fluida, con la nota para el tutor en el catálogo 5.3, el lote y el prompt.
    La app no tiene un sitio para el tutor donde mostrarla.
  - Mensajes: textos catalanes del experto en scripts/translate-interface-terms.php (dos ajustes a
    la mecánica real) y tres mensajes de motivación nuevos con original castellano. Script
    ejecutado y comprobado por HTTP como jose en es y ca.
  - **Bug de la app corregido**: ActivityBase leía `field_motivation_text`, un campo que
    activity_message no tiene, así que siempre salía el texto de reserva y nunca un mensaje de
    Drupal. Ahora lee `description` (src/lib/api/messages.ts). tsc, lint y 288 tests OK.
  - Hallazgos sin tocar: los mensajes de explicación de Drupal no los muestra la app (enseña la
    instrucción de la actividad o la del catálogo `ui.activities.instructions`); el original
    castellano de "Image Position" está escrito en catalán, el de "Word split" dice que el espacio va
    "justo después" de la letra (la app lo pone delante) y "Activity vertical text" sigue en lorem
    ipsum.
- Pendiente: guion de los
  enclíticos en WordSplitActivityHandler antes de los lotes de Level6; lote del
  ciclo castellano (con la regla nueva de repetidos); Level3 a Level10 (faltan los términos, catálogo 2.5) y el handler de activity
  (lista y lectura) en los dos idiomas; cobertura castellana de Lingüística (2 / 1 / 2) por debajo
  del mínimo; 06 (verificación bilingüe completa, incluido Expo Go).

### 06. Verificación bilingüe de extremo a extremo y documentación (2026-10-27)

- [x] Recorrido por la API como usuario normal (gotcha 14), con el grant `password` del titular y
  el grant `shine_learner` de cada alumno (script local `shine/private/scripts/drive_api.py`):
  Marta (`es`) y Pau (`ca`) con los niveles reiniciados, bloque inicial completo (3 sesiones de
  escalera con `easy`, `ok` y `hard` mezclados más la de confirmación), primera sesión regular con
  `sessionfeedback` y estadísticas por JSON:API. Toda actividad servida es del idioma del alumno
  (`langcode` comprobado una a una); el ciclo solo entra en las regulares; las reglas de nivel dan
  el mismo resultado en los dos idiomas (Lingüística, Memoria y Velocidad en Level2, Perceptivos en
  Level1 tras un `hard`).
- [x] **Bug corregido: bloque inicial bloqueado por un área sin contenido.** Con las cuatro áreas
  con contenido cerradas y Funciones Ejecutivas abierta (sin actividades en ningún idioma),
  `initialCompleted()` no cerraba el bloque y `planInitial()` producía una sesión vacía: `422
  no_content` en cada llamada, sin salida, en los dos idiomas, a cualquier alumno nuevo a la
  tercera o cuarta sesión (en 05 no se vio porque los alumnos se pusieron en `regular` a mano).
  Corrección: un área abierta que no se puede probar (sin actividades en su `probe_level` ni por
  debajo, en el idioma del alumno) cuenta como cerrada al decidir el fin del bloque
  (`SessionEvaluator::probeable()`), y `planInitial()` genera una sesión de confirmación con todas
  las áreas al nivel vigente si ninguna abierta tiene contenido (para usuarios ya atrapados). Dos
  kernel tests nuevos y uno ajustado (`testInitialEasyClimbsUntilCeiling` daba por bueno el
  estado bloqueado); shine_level 60 tests OK. docs/level-system.md §5.1.
- [x] Cambio de idioma `es` → `ca` con un tercer alumno (Prova06, dentro del cupo 3 de la
  cortesía): `PATCH` devuelve `reset: true`, el token de alumno anterior da 401, niveles a Level0
  con 5 logs `language_change`, resúmenes, valoraciones y sesiones a cero por JSON:API, `/shine/me`
  con `langcode: ca`, siguiente sesión "Sessió per conèixer-te 1" con 4 actividades `ca`.
  Archivado después (token 401).
- [x] Importación (`--dry-run`): lote bilingüe (matriz, 2 nodos `creada`), solo `ca` (`creada`),
  errores de idioma (`fr` no admitido; código `ES` con `idioma ca`; `idioma` e `idiomas` a la
  vez), duplicado dentro del idioma (`contenido: idéntico al de BLK-CA-L00-VEL-002`) y el mismo
  material en castellano (permitido, aviso de solapamiento del 71 %). Inventario y cobertura por
  idioma ya verificados en 05.
- [x] Técnica: `config:status` sin diferencias; kernel tests shine_account 27, shine_level 60,
  shine_content 37 y **shine_entitlement 31** (sus 4 fallos no eran de hoy: desde la FASE 18
  `LearnerManager::create()` da de alta al alumno en `es` y el harness no instalaba idiomas, así
  que las actividades de prueba nacían en `en` y ninguna sesión tenía contenido; `installLanguages()`
  en `EntitlementAccessKernelTestBase`); app `tsc`, lint (4 avisos previos) y 288 tests OK;
  términos fonológicos 24 + 14 `es` y 33 + 19 `ca` con nombres únicos; segunda ejecución de los
  cinco scripts sin cambios (`migrate-langcode-en-to-es.php` chocaba con la clave primaria de
  `search_dataset` por las 86 filas `en` de `help_search`: ya no toca `search_*`); ninguna fila de
  contenido en `en`; watchdog solo con los dos `no_content` del bug (ya corregido) y errores
  antiguos de sesiones de desarrollo.
- [x] Expo web en Chrome: selector de alumno con etiquetas ES/CA, dashboard de Pau en catalán
  (fecha "Dimarts, 27 d’octubre", chips, racha), "El meu progrés" y su detalle (comas decimales
  "5,4s", "27/10/2026", "Amb tu"), Ajustes (alumnos, archivado, plan) y una sesión regular entera
  jugada en catalán: parpadeo con dígrafos (cotxe, caixa, boig), ciclo con una síl·laba por
  pantalla, matriz y posición de imágenes, mensajes de motivación de Drupal en catalán al acabar
  cada actividad (los nuevos del experto), "Com ha anat?" con las tres preguntas y cierre
  (`sessionfeedback` guardado). Dashboard de Marta en castellano.
- Hallazgos sin corregir (pendientes):
  - Expo Go en dispositivo real (punto 6 del plan): no probado; en web los glifos catalanes (l·l,
    ny, ç, ï) se ven bien en la fuente del player.
  - Sesiones regulares castellanas cortas: Lingüística `es` tiene 2 actividades en Level2 y, con
    la ventana de no repetición (5 sesiones), el hueco se queda vacío o baja a Level0; Funciones
    Ejecutivas sigue sin contenido en los dos idiomas y la rotación de 4 huecos sobre 5 áreas deja
    sesiones de 2 o 3 actividades. Falta también el lote del ciclo castellano.
  - Gráficas del detalle con un solo intento: Victory inventa ticks (`#0.9999999999`,
    `7,4999999999`) que salen en el texto accesible; cosmético, no es de idioma.
  - Accesibilidad: los botones de "¿Con cuál te has sentido mejor?" y "¿Cuál te ha costado un poco
    más?" no tienen nombre accesible (salen como `button` sin etiqueta).
  - `area_name` en la respuesta de `complete` va en castellano (etiqueta original del término); la
    app no lo muestra.
  - Los de 05 que siguen: mensajes de explicación no mostrados por la app y originales castellanos
    a revisar; guion de los enclíticos; Level3 a Level10; handler de lista y lectura.

