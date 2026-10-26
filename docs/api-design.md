# Diseño de API — Shine

## Resumen

El sistema expone los datos de Drupal mediante **JSON:API** (módulo core de Drupal). La autenticación es **OAuth 2.0** via `drupal/simple_oauth`. El frontend Expo se comunica exclusivamente a través de estos endpoints.

---

## Autenticación

### Flujo actual (FASE 14) — login y registro in-app

La app **no abre el navegador**: el usuario escribe email y contraseña dentro de la app y esta
los intercambia por tokens contra Drupal. Es el flujo que necesita la app nativa publicada en las
stores (Expo / React Native; los binarios los genera EAS Build): nada de redirects al navegador
externo. simple_oauth v6 no trae el password grant; lo aporta el contrib
`simple_oauth_password_grant`, que además acepta email como `username` y aplica flood control
con los límites de `user.flood`.

#### Entrar

```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=password
&client_id=shine_expo_app
&username={email}
&password={contraseña}
&scope=authenticated_user_access
```

Sin `client_secret`: el consumer es público (`confidential: false`). Respuesta: el mismo JSON de
tokens (`access_token` JWT + `refresh_token`) que el resto de grants; el refresh no cambia.

| Respuesta | Significado | Qué hace la app (`src/lib/api/auth.ts`) |
|---|---|---|
| `200` | Tokens | `useAuthStore.login()` → `/oauth/userinfo` |
| `400 invalid_grant` | Email o contraseña incorrectos | `AuthError('invalid_credentials')` |
| `403 flood_user_blocked` / `flood_ip_blocked` | Demasiados intentos | `AuthError('too_many_attempts')` |
| `400 unsupported_grant_type` | Falta `password` en el consumer | Error de configuración (ver CLAUDE.md) |
| `400 invalid_scope` | Falta `password` en el scope | Error de configuración |

#### Crear cuenta

Recurso REST de core `user_registration`, abierto al rol `anonymous` (permiso
`restful post user_registration`). Política: `register: visitors`, `verify_mail: false`.

```
POST /user/register?_format=json
Content-Type: application/json

{
  "name":               { "value": "marta@example.com" },   ← username = email
  "mail":               { "value": "marta@example.com" },
  "pass":               { "value": "Secreta-2026" },
  "field_display_name": { "value": "Marta" },               ← nombre para el saludo
  "field_adult_consent": { "value": true }                  ← obligatorio desde la FASE 17
}
```

`field_adult_consent` es la declaración "soy mayor de edad y responsable de la persona con la que
voy a trabajar" (`docs/monetization.md` §5.1). Quien se registra es siempre un **titular**: el
servidor fija `field_account_kind = holder` (valor por defecto) y `field_adult_consent_at` con la
hora del registro. La exigencia la pone la restricción `ShineAdultConsent` del módulo
`shine_account` y solo aplica a cuentas nuevas creadas sin sesión: `drush user:create` y el alta
desde el admin no piden consentimiento.

| Respuesta | Significado |
|---|---|
| `200` | Cuenta creada y activa. La app llama acto seguido a `/oauth/token` con las mismas credenciales |
| `422` con `already taken` | Email ya registrado → `AuthError('email_taken')` |
| `422` con `field_adult_consent:` | Falta el consentimiento o es `false` (ver abajo) |
| `422` (otro) | Validación de Drupal (email inválido, sin password) → `AuthError('validation')` |
| `403` `Access denied on creating field '...'` | El cuerpo incluye un campo que fija el servidor (`field_account_kind`, `field_adult_consent_at`, `field_archived_at`) |

Respuesta sin consentimiento (la app la reconoce por el nombre del campo, no por el texto):
```json
{"message":"Unprocessable Entity: validation failed.\nfield_adult_consent: You must confirm that you are an adult and responsible for the person you will work with.\n"}
```

La petición es anónima sin cookie de sesión, por lo que no requiere token CSRF aunque el
recurso use el proveedor `cookie`.

#### Identidad del usuario

- `/oauth/userinfo` devuelve `sub` = **UUID** del usuario (módulo `shine_oauth`) y `name` =
  `field_display_name` (hook `shine_oauth_user_format_name_alter`); `preferred_username` y
  `email` son el email.
- Pensado para la fase 2 (cobro recurrente): cualquier estado de suscripción se asocia a ese UUID.

#### Campos de cuenta (FASE 17)

Salen en `GET /jsonapi/user/user/{uuid}` como cualquier campo del usuario. Los marcados como
"servidor" devuelven `403` en un `PATCH` que cambie su valor (un `PATCH` que mande el mismo valor
pasa); el `PATCH` de `field_dyslexic_font` que hace la app no se ve afectado.

| Campo | Tipo | Quién lo escribe |
|---|---|---|
| `field_account_kind` | `holder` \| `learner` | Servidor. `holder` al registrarse; `learner` al crear un alumno (01b) |
| `field_adult_consent` | boolean | El titular en el registro; después ya no se puede cambiar |
| `field_adult_consent_at` | timestamp | Servidor, la primera vez que el consentimiento pasa a `true`. Vacío con consentimiento = cuenta anterior a la FASE 17 |
| `field_archived_at` | timestamp | Servidor, al archivar un alumno (01b) |
| `field_avatar` | string (32) | Clave de un avatar del set de la app. En una cuenta `learner`, solo su `owner` por `/shine/learners/{uuid}` (el alumno recibe 403 al cambiarlo con su token); un titular puede ponerse uno por JSON:API |
| `field_display_name` | string (60) | En una cuenta `learner`, igual que `field_avatar`: solo su `owner` por `/shine/learners/{uuid}`. Un titular se renombra a sí mismo por JSON:API |

Los alumnos llevan un email sintético no enrutable, `learner+{uuid}@shine.invalid`; el servidor
anula cualquier correo a ese dominio.

### Flujo legacy — Authorization Code + PKCE (la app ya no lo usa)

El grant `authorization_code` sigue habilitado en el consumer para pruebas desde navegador, pero
la app eliminó `expo-auth-session` y `expo-web-browser`. Se conserva la documentación:

#### Paso 1 — Abrir el navegador del dispositivo

```
GET /oauth/authorize
  ?client_id=shine_expo_app
  &response_type=code
  &redirect_uri=exp://localhost:19000/--/oauth2redirect
  &code_challenge={PKCE_CHALLENGE}
  &code_challenge_method=S256
  &scope=authenticated_user_access
```

- El usuario ve el formulario de login de Drupal
- Tras el login, acepta el acceso (o se autoriza automáticamente si `automatic_authorization=true`)
- El servidor redirige a `redirect_uri?code={AUTH_CODE}`

En Expo usar `expo-auth-session`:
```typescript
import * as AuthSession from 'expo-auth-session';

const request = new AuthSession.AuthRequest({
  clientId: 'shine_expo_app',
  scopes: ['authenticated_user_access'],
  redirectUri: AuthSession.makeRedirectUri({ scheme: 'shine' }),
  usePKCE: true,
});
```

#### Paso 2 — Intercambiar código por token

```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&client_id=shine_expo_app&code={AUTH_CODE}
&redirect_uri=exp://localhost:19000/--/oauth2redirect
&code_verifier={PKCE_VERIFIER}
```

**Respuesta:**
```json
{
  "token_type": "Bearer",
  "expires_in": 86400,
  "access_token": "eyJ...",
  "refresh_token": "def50200..."
}
```

El `access_token` se incluye en todas las requests autenticadas:
```
Authorization: Bearer eyJ...
Content-Type: application/vnd.api+json
```

El token se almacena en `expo-secure-store` (nunca en AsyncStorage).

### Refresh del token

```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token={refresh_token}
&client_id=shine_expo_app```

### Configuración del Consumer (Drupal admin)

- **consumer_id**: 2 (entity ID)
- **client_id**: `shine_expo_app`
- **client_secret**: vacío (cliente público desde 2026-07-21; no reintroducir)
- **UUID**: `5393c7d5-0f7b-4482-a770-0e5ce00639c2`
- **grant_types**: `authorization_code`, `refresh_token`, `password` (la app usa `password`)
- **scopes**: `authenticated_user_access` (con `password` habilitado en el scope)
- **redirect**: `exp://localhost:19000/--/oauth2redirect`, `http://localhost:8081` (solo flujo legacy)
- **pkce**: false (PKCE optional — el cliente lo añade igualmente)
- **confidential**: false

### Scopes disponibles

| Scope ID | Descripción | Granularidad |
|---|---|---|
| `authenticated_user_access` | Acceso como usuario autenticado | Rol: authenticated |

### Notas de implementación

- El authorize endpoint redirige a `/user/login` si el usuario no está autenticado — esto es el comportamiento correcto en el flujo Authorization Code
- Para testing con curl, el `&` en la URL debe estar dentro de comillas simples: `curl -s 'https://shine.ddev.site/oauth/authorize?client_id=...&response_type=code'`
- `simple_oauth v6` no trae Password Grant de serie: lo aporta `simple_oauth_password_grant` (ver "Flujo actual")
- Las claves RSA se encuentran en `/var/www/html/private/oauth-keys/` (dentro del contenedor DDEV)

---

## Headers globales

Todas las requests a JSON:API:
```
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json
Authorization: Bearer {access_token}
```

---

## Endpoints de lectura

### Actividades

```
GET /jsonapi/node/activity
GET /jsonapi/node/activity/{uuid}
GET /jsonapi/node/activity_blink
GET /jsonapi/node/activity_blink/{uuid}
GET /jsonapi/node/activity_image_position
GET /jsonapi/node/activity_image_position/{uuid}
GET /jsonapi/node/activity_letter_matrix/{uuid}                       ← FASE 13a: field_target, field_columns, field_rows, field_cells[], field_time_limit
GET /jsonapi/node/activity_syllable_order/{uuid}?include=field_items,field_items.field_image,field_items.field_image.field_media_image
                                                                       ← FASE 13b: paragraphs syllable_word (field_syllables, field_extra_syllables)
GET /jsonapi/node/activity_word_split/{uuid}                          ← FASE 13c: field_sentences[]
GET /jsonapi/node/activity_rapid_repetition/{uuid}                    ← FASE 16a: field_words[], field_time_limit (sin include)
```

Tracking de la FASE 13 (mismo patrón que `logimageposition` / `summary_image_position`):
`POST /jsonapi/activitylog/{loglettermatrix|logsyllableorder|logwordsplit}` y
`POST /jsonapi/activitysummary/{summary_letter_matrix|summary_syllable_order|summary_word_split}`.
Los atributos exactos los fijan los tests `src/lib/activityKinds/__tests__/fase13Payloads.test.ts`.

Tracking de la FASE 16 (repetición rápida): `POST /jsonapi/activitylog/lograpidrepetition` (un log por
palabra, con `field_repetitions`) y `POST /jsonapi/activitysummary/summary_rapid_repetition`
(`field_repetitions` = suma; **sin** `field_correct_count` ni `field_items_count`). Lectura:
`GET /jsonapi/activitysummary/summary_rapid_repetition?filter[uid.id]={uuid}&include=field_activityid,field_sessionid`.
Payloads de oro en `src/lib/activityKinds/__tests__/fase16Payloads.test.ts`.

**Parámetros de filtro útiles:**
```
?filter[field_activity_level.name]=Básico
?filter[status]=1
?include=field_activity_level,field_explanation
?sort=title
?page[limit]=10&page[offset]=0
```

**Include recomendado** (evita N+1 requests):
```
?include=field_activity_level,field_explanation.field_media
```

---

### Sesiones

```
GET /jsonapi/node/session
GET /jsonapi/node/session/{uuid}
```

**Con actividades incluidas:**
```
GET /jsonapi/node/session/{uuid}?include=field_activities,field_activities.field_activity_level
```

`field_operated_by` (relación a `user--user`, FASE 17): el titular que generó la sesión con el
token de un alumno (`docs/monetization.md` §5.3 y §5.6). Lo escribe el servidor al crear la sesión
(subplan 02); vacío (`data: null`) en las sesiones que el usuario genera con su propio token y en
todas las anteriores a la FASE 17. No se puede editar por JSON:API.

---

### Grupos de sesión

```
GET /jsonapi/node/group_session
GET /jsonapi/node/group_session/{uuid}?include=field_ref_session,field_ref_session.field_activities
```

---

### Mensajes de actividad

```
GET /jsonapi/activity_message/explanation_message/{uuid}?include=field_media
GET /jsonapi/activity_message/motivation_message
```

**Filtrar mensajes de motivación por tipo de actividad:**
```
GET /jsonapi/activity_message/motivation_message?filter[field_activity_types.type]=activity
```

> **Nota**: el typo `motiviation_message` fue corregido en Fase 0. El bundle correcto es `motivation_message`.

---

### Niveles de actividad (taxonomía)

```
GET /jsonapi/taxonomy_term/activity_level
GET /jsonapi/taxonomy_term/activity_level/{uuid}
```

---

## Endpoints de escritura

### Crear un activitylog (reemplaza POST /activitylog-register/add)

```
POST /jsonapi/activitylog/logverticaltext
```

**Body:**
```json
{
  "data": {
    "type": "activitylog--logverticaltext",
    "attributes": {
      "label": "A-{sessionId}-{activityId}-{iteration}-{weight}",
      "field_activity_type": "vertical_text",
      "field_item": "palabra",
      "field_weight": 1,
      "field_iteration": 3,
      "field_time": 1450
    },
    "relationships": {
      "field_activityid": {
        "data": { "type": "node--activity", "id": "{activity-uuid}" }
      },
      "field_sessionid": {
        "data": { "type": "node--session", "id": "{session-uuid}" }
      }
    }
  }
}
```

**Respuesta 201 Created:**
```json
{
  "data": {
    "type": "activitylog--logverticaltext",
    "id": "{nuevo-uuid}",
    ...
  }
}
```

---

### Crear un activitylog blink

```
POST /jsonapi/activitylog/log3_textlistblink
```

**Body:**
```json
{
  "data": {
    "type": "activitylog--log3_textlistblink",
    "attributes": {
      "label": "A-{sessionId}-{activityId}-{iteration}-{weight}",
      "field_activity_type": "activity_blink",
      "field_item": "ca",
      "field_weight": 1,
      "field_iteration": 1,
      "field_time": 1200
    },
    "relationships": {
      "field_activityid": {
        "data": { "type": "node--activity_blink", "id": "{activity-uuid}" }
      },
      "field_sessionid": {
        "data": { "type": "node--session", "id": "{session-uuid}" }
      }
    }
  }
}
```

---

### Crear un activitysummary blink

```
POST /jsonapi/activitysummary/summary3_vertical_text_blink
```

**Body:**
```json
{
  "data": {
    "type": "activitysummary--summary3_vertical_text_blink",
    "attributes": {
      "label": "Summary-{activityTitle}-intento {n}",
      "field_iteration": 1,
      "field_time": 12500
    },
    "relationships": {
      "field_activityid": {
        "data": { "type": "node--activity_blink", "id": "{activity-uuid}" }
      },
      "field_sessionid": {
        "data": { "type": "node--session", "id": "{session-uuid}" }
      },
      "field_activitylogs": {
        "data": [
          { "type": "activitylog--log3_textlistblink", "id": "{log-uuid-1}" }
        ]
      }
    }
  }
}
```

---

### Crear un activitysummary (vertical_list)

```
POST /jsonapi/activitysummary/summary_vertical_text
```

**Body:**
```json
{
  "data": {
    "type": "activitysummary--summary_vertical_text",
    "attributes": {
      "label": "Summary-{sessionId}-{activityId}-{iteration}",
      "field_activity_type": "vertical_text",
      "field_iteration": 3,
      "field_time": 12500
    },
    "relationships": {
      "field_activityid": {
        "data": { "type": "node--activity", "id": "{activity-uuid}" }
      },
      "field_sessionid": {
        "data": { "type": "node--session", "id": "{session-uuid}" }
      },
      "field_activitylogs": {
        "data": [
          { "type": "activitylog--logverticaltext", "id": "{log-uuid-1}" },
          { "type": "activitylog--logverticaltext", "id": "{log-uuid-2}" }
        ]
      }
    }
  }
}
```

---

### Consultar historial del usuario actual

```
GET /jsonapi/activitysummary/summary_vertical_text?filter[uid.id]={user-uuid}
GET /jsonapi/activitysummary/summary_vertical_text?filter[field_activityid.id]={activity-uuid}&filter[uid.id]={user-uuid}&sort=created
```

---

## Sesiones generadas, cierre y niveles (FASE 15)

### Generar (u obtener) la siguiente sesión

```
POST /shine/session/generate
Authorization: Bearer {access_token}
```

Sin cuerpo. Siempre actúa sobre el usuario autenticado. La app lo llama cuando el dashboard no
tiene ninguna sesión pendiente (o al pulsar "Nueva sesión"); se puede llamar sin mirar antes,
porque si ya hay una pendiente la devuelve en vez de crear otra.

Reglas:
- **Pendiente** = sesión propia, publicada y sin `field_completed_at`. Si existe, `200` con esa
  sesión y `created: false`. Si no, el servidor recorre el árbol de decisión de
  `docs/level-system.md` §6 (bloque inicial → evaluación a medias → evidencia → rachas →
  periódica → regular), crea el nodo con `uid` del usuario y responde `201` con `created: true`.
- Lock por usuario: dos llamadas simultáneas → `409 {"error":"in_progress"}` en la segunda.
- Sin actividades con que llenar la sesión (catálogo vacío para esas áreas y niveles):
  `422 {"error":"no_content","branch":...,"kind":...,"reason":...}` y no se crea nada. El
  detalle (qué área, qué nivel) queda en watchdog, canal `shine_level`.
- **Muro de pago (FASE 17, subplan 04)**: si el árbol decide una sesión **regular** y el alumno
  no puede recibirla, `402` y no se crea nada:
  ```json
  {
    "error": "payment_required",
    "reason": "trial_exhausted",
    "branch": "regular",
    "free_regular_sessions": 8,
    "completed_regular": 8,
    "paused": false,
    "released_by": null,
    "holder_status": { "plan": "free", "catalog_plan": "free", "status": "none", "source": null, "expires_at": null, "max_learners": 1, "covered": false, "entitlement": null }
  }
  ```
  `reason`: `trial_exhausted` (nadie cubre al alumno y ya completó `free_regular_sessions`
  regulares, las haya operado quien sea), `learner_paused` (algún adulto `owner` tiene plan pero
  el alumno queda fuera de su cupo), `learner_not_covered` (archivado o sin ningún adulto con
  acceso activo) o `released_by_organization` (subplan 10). `holder_status` es el del titular que
  opera (claim `operated_by` del token de alumno; con un token de titular, el suyo; sin claim, el
  `owner` más antiguo del alumno), con la misma forma que en `GET /shine/me`. **Toda sesión de
  evaluación** (bloque inicial, periódica, por racha, dirigida, continuación) se genera siempre,
  con la prueba agotada o sin plan. La regla completa está en `docs/monetization.md` §4.1 y §5.4;
  la decisión la toma el servicio `shine_entitlement.access` (ver "Entitlements → Acceso").
- **Pendiente caducada** (`pending_max_days`, 7): una sesión pendiente creada hace más de N días se
  despublica (no se borra) en la siguiente llamada y se genera otra. La app deja de verla por
  JSON:API (node grants solo sobre publicadas) y no cuenta para nada: ni numeración, ni prueba
  gratuita, ni contadores de evaluación.
- Sin token: `403`.

Respuesta `201` / `200`:
```json
{
  "session": "8fd6f3b3-...",
  "nid": 13,
  "title": "Sesión para conocerte 1",
  "kind": "evaluation",
  "reason": "initial",
  "scope": null,
  "seq": null,
  "activities": ["uuid-actividad", "uuid-actividad"],
  "created": true,
  "branch": "initial"
}
```

- `kind`, `reason`, `scope` (UUID del área o `null`) y `seq` son los campos del nodo
  (`field_session_kind`, `field_evaluation_reason`, `field_evaluation_scope`,
  `field_evaluation_seq`).
- `activities` son los UUID en el orden de `field_activities`; la app puede navegar con
  `session` directamente y cargar el detalle por JSON:API como hasta ahora.
- `branch` dice qué rama del árbol la ha creado (`initial`, `continue_evaluation`, `evidence`,
  `trigger_easy`, `trigger_hard`, `periodic`, `regular`). Es informativo; en una sesión ya
  pendiente va `null`.
- Títulos generados, pensados para la tarjeta: "Sesión N" (regulares), "Sesión para conocerte N"
  (bloque inicial), "Sesión de ajuste" y "Sesión de ajuste 2" (evaluaciones).

Comando de apoyo (solo servidor): `ddev drush shine-level:generate {uid} [--dry-run]` imprime la
rama tomada, por qué, las actividades elegidas, los avisos (techo por contenido, huecos
vacíos) y lo que dicen las puertas ("Puerta: pasa" o "Puerta: denegado, trial_exhausted" con el
cuerpo del 402); sin `--dry-run` crea la sesión igual que el endpoint, y con la puerta cerrada
no la crea.

### Cerrar una sesión

```
POST /shine/session/{uuid}/complete
Authorization: Bearer {access_token}
```

Sin cuerpo. La app lo llama cuando ya no queda ninguna actividad por hacer en la sesión
(`shouldAskSessionFeedback` → true) y **después** de haber enviado el `sessionfeedback`
(sesión regular) o el último `activityfeedback` (sesión de ajuste). Si se llama antes, la
valoración enviada después no cuenta.

Reglas:
- Solo el dueño de la sesión (`uid` del nodo). Otro usuario: `403 {"error":"not_owner"}`.
- Verifica que cada actividad de `field_activities` tiene al menos un `activitysummary` del
  usuario en esa sesión. Si falta alguna: `409 {"error":"incomplete","missing":[{"id":uuid,"title":...}]}`.
- Idempotente: la primera llamada aplica las reglas de nivel (`docs/level-system.md` §5) y
  marca `field_completed_at`; las siguientes devuelven lo mismo con `already_completed: true`
  sin tocar nada. Si dos llamadas coinciden: `409 {"error":"in_progress"}` en la segunda.
- UUID desconocido o que no es una sesión: `404 {"error":"not_found"}`.

Respuesta `200`:
```json
{
  "session": "36a3c27c-...",
  "kind": "evaluation",
  "reason": "initial",
  "completed_at": 1792060000,
  "already_completed": false,
  "onboarding_state": "evaluating",
  "level_changes": [
    { "area": "uuid-area", "area_name": "Memoria de Trabajo", "from": "Level0", "to": "Level1", "reason": "initial" }
  ],
  "areas": [
    { "area": "uuid-area", "area_name": "...", "level": "Level0", "probe_level": "Level1", "closed": false, "evidence": 0, "last_evaluated": null }
  ]
}
```

`level_changes` son los `userarealevel_log` escritos para esta sesión; `areas` es el estado de
todas las áreas del usuario tras el cierre. Todo se deriva del estado guardado, por eso la
respuesta repetida es idéntica.

### Mi nivel por área

```
GET /jsonapi/userarealevel/userarealevel?filter[uid.id]={uuid}&include=area,level,probe_level
GET /jsonapi/userarealevel_log/userarealevel_log?filter[uid.id]={uuid}&sort=-created
```

Solo lectura: las filas las crea y mueve el servidor.

---

## Cuentas y alumnos (FASE 17)

Módulo `shine_account` (`docs/monetization.md` §3 y §5; subplanes `plans/entitlement/01a` y
`01b`). El **titular** (el adulto que se registra) crea **alumnos**: usuarios Drupal sin
credenciales (`field_account_kind = learner`, rol `learner`, nombre de usuario `learner-{uuid}`,
email sintético `learner+{uuid}@shine.invalid`, contraseña aleatoria que nadie conoce) con los que
trabaja. Quién puede operar con cada alumno lo dice la entidad `learner_access` (alumno, titular,
`role`: `owner` quien lo creó | `guardian` familia vinculada por código | `staff` otro docente del
centro). El token de alumno con el que la app juega "en nombre de" un alumno llega en el subplan 02.

Todas las rutas de esta sección exigen Bearer de un **titular** (requisito de ruta `_shine_holder`,
decidido por `field_account_kind`, no por rol): un token de alumno, un anónimo o una cuenta borrada
reciben `403` (la página 403 de Drupal; el código es lo que cuenta). Cuerpos y respuestas en JSON
(`Content-Type: application/json`).

### Forma de `learner`

```json
{
  "uuid": "dedaec37-...",
  "display_name": "Marta",
  "avatar": "fox",                       ← clave del set de avatares de la app, o null
  "created": "2026-10-23T11:19:41+00:00",
  "archived_at": null,                   ← fecha ISO si está archivado
  "onboarding_state": "evaluating",      ← field_onboarding_state del alumno (shine_level)
  "langcode": "ca",                      ← FASE 18: idioma de trabajo del alumno, "es" | "ca" (preferred_langcode)
  "role": "owner",                       ← rol del titular que pregunta sobre este alumno
  "adults": [                            ← adultos con acceso activo, del más antiguo al más nuevo
    { "uuid": "c468dfeb-...", "display_name": "Ana", "role": "owner" }
  ],
  "invite": null,                        ← solo para el owner: {created, expires_at} si hay un código vivo (nunca el código)
  "covered_by": "trial",                 ← FASE 17 (04): "organization" | "holder" | "trial" | "none"
  "covered_by_organization": null,       ← nombre del centro, solo si covered_by = organization (subplan 10)
  "paused": false,                       ← fuera del cupo de un adulto con plan (visible, no operable)
  "blocked_reason": null,                ← por qué no recibiría una regular (el `reason` del 402), o null
  "completed_regular": 3,                ← regulares completadas, las haya operado quien sea
  "free_regular_sessions": 8             ← para el aviso "te quedan N sesiones gratis"
}
```

Las seis últimas claves las añade `shine_entitlement` por `hook_shine_learner_alter()`
(`shine_account.api.php`) y salen en **todas** las rutas que devuelven un `learner` (también
`/shine/me` y el canje de códigos). Reglas de cobertura en "Entitlements → Acceso".

### Endpoints

```
POST   /shine/learners                  {display_name, avatar?, langcode?}   → 201 {learner}
GET    /shine/learners                                            → 200 {learners: [...]}
GET    /shine/learners/{uuid}                                     → 200 {learner}
PATCH  /shine/learners/{uuid}           {display_name?, avatar?, langcode?}  → 200 {learner, reset}
POST   /shine/learners/{uuid}/archive                             → 200 {learner}
DELETE /shine/learners/{uuid}/access                              → 200 {withdrawn: true}
POST   /shine/learners/{uuid}/invite                              → 201 {code, expires_at, learner}
POST   /shine/learners/join             {code}                    → 200 {learner}
GET    /shine/me                                                  → 200 {holder, learners}
POST   /shine/account/delete            {password}                → 200 {deleted: true}
```

- **`POST /shine/learners`**: el servidor crea el usuario alumno (`field_onboarding_state =
  evaluating`, activo) y su `learner_access` `owner`/`created`, en una transacción. Cupo: servicio
  `shine_account.learner_quota` (plan gratuito, **1** alumno; `shine_entitlement` lo sustituye en el
  subplan 04). Contra el cupo cuentan los alumnos **activos** (no archivados) de los que el titular
  es `owner` y que no ocupan plaza de una organización (subplan 10).
- **`GET /shine/learners`**: una sola lista, activos primero y archivados después, cada grupo por
  antigüedad del acceso. Los archivados se distinguen por `archived_at`.
- **`PATCH`**: `display_name` se recorta (espacios) y admite hasta 60 caracteres; `avatar: null` o
  `""` quitan el avatar, ausente = no tocar. Solo `owner`.
- **Idioma del alumno (FASE 18)**: `langcode` (`es` | `ca`, sin distinguir mayúsculas) se elige en
  el alta junto con el nombre; ausente, `es`. Otro valor: `422 validation` con `field: langcode`.
  El `PATCH` con `langcode` cambia el idioma de trabajo y, si es distinto del actual, **reinicia
  el progreso del alumno** en la misma transacción (`plans/multiidioma/analisis.md` 2.3): niveles a
  Level0 con razón `language_change` en el histórico, logs, resúmenes y valoraciones borrados,
  todas sus sesiones despublicadas. La respuesta lleva `reset: true`; con el mismo idioma (o sin
  `langcode` en el cuerpo), `reset: false` y nada cambia. Guardar el usuario revoca sus tokens
  (gotcha 20 de CLAUDE.md): tras un `reset: true` la app pide un token de alumno nuevo y vuelve a
  un dashboard vacío. Solo `owner`. Para trabajar en los dos idiomas, dos perfiles del mismo niño.
- **`archive`**: fija `field_archived_at` y **revoca todos los `oauth2_token` del alumno**; no se
  bloquea ni se borra, sigue saliendo en la lista y su progreso se sigue leyendo. Libera cupo.
  Idempotente. En v1 no se desarchiva ni se edita. Solo `owner`.
- **`DELETE .../access`**: el titular retira **su propio** acceso. `guardian` y `staff` siempre
  pueden; un `owner` solo si queda otro `owner` activo. La fila se desactiva (`status 0`), no se
  borra; un vínculo posterior de la misma pareja la reactiva.
- **`POST /shine/learners/{uuid}/invite`** (subplan 01c): el `owner` genera un **código de vínculo**
  para que otro adulto (familia, otro tutor) acceda al alumno. Seis caracteres de un alfabeto sin
  0/O ni 1/I (`ABCDEFGHJKLMNPQRSTUVWXYZ23456789`), un solo uso, caduca a los `invite_ttl_days`
  (14, `shine_account.settings`). **El código solo sale en esta respuesta**: en la base de datos
  vive su HMAC con clave derivada de `hash_salt` (`settings.php`), de modo que un volcado de la
  tabla no sirve para adivinarlos. Una invitación viva por alumno: generar otra anula la anterior.
  Archivar al alumno anula sus invitaciones. La app lo muestra como texto o QR; `invite` en
  `learner` dice si hay una viva (sin el código). Solo `owner`; alumno archivado → 409.
- **`POST /shine/learners/join {code}`**: el titular teclea el código (se normaliza: mayúsculas,
  sin espacios ni guiones) y recibe un `learner_access` **`guardian`/`invite`**; la invitación
  queda gastada. Si ya tenía acceso activo, 200 sin duplicar y sin gastar el código. Un acceso
  revocado antes se reactiva como `guardian`. El propio creador del código recibe `422
  own_invite` (no cuenta como fallo). Código caducado, usado, inexistente o de un alumno archivado:
  `422 invite_invalid` **sin distinguir el motivo**. Límite de intentos con `flood`: 5 fallos por
  titular y hora (30 por IP, `shine_account.settings`) → `429 too_many_attempts` hasta que pase la
  ventana, también con el código correcto.
- **`GET /shine/me`**: `holder` = `{uuid, display_name, email, account_kind, adult_consent_at}`,
  `learners` (misma forma que arriba, con la cobertura de cada uno) y, desde el subplan 04,
  `holder_status`, el plan vigente del titular:
  ```json
  "holder_status": {
    "plan": "family",            ← "free" | "family" | "professional" | "school" | "courtesy"
    "catalog_plan": "family",    ← entrada del catálogo (free, family, professional, school_classroom)
    "status": "active",          ← "none" (gratuito) | "active" | "trial" | "grace" | "billing_retry"
    "source": "app_store",       ← null en el gratuito
    "expires_at": "2026-11-22T10:00:00+00:00",   ← null = no caduca
    "max_learners": 3,
    "covered": true,
    "entitlement": "uuid"        ← null en el gratuito
  }
  ```
  Con varios entitlements que cubren, el de mayor cupo (a igualdad, el que caduca más tarde).
  La app lo llama al arrancar y tras cada compra. Otros módulos amplían la respuesta con
  `hook_shine_me_alter(array &$me, UserInterface $holder)` y cada alumno con
  `hook_shine_learner_alter()` (los dos en `shine_account.api.php`); el 10 añade `organizations`
  y `released_by`.
- **`POST /shine/account/delete`**: pide la contraseña aunque la petición ya lleve el token (un
  dispositivo desbloqueado no debe poder borrar la cuenta). "Borrar" es **anonimizar**: nombre de
  usuario `deleted-{uuid}`, email e `init` `deleted+{uuid}@shine.invalid`, nombre para mostrar,
  avatar e imagen vacíos, contraseña aleatoria, bloqueo y revocación de todos los tokens. Por cada
  alumno del titular: si le queda otro adulto activo o está en plaza de un centro, solo se retira el
  acceso del titular (y si era el único `owner` se promueve al `guardian` más antiguo); si no, el
  alumno se anonimiza igual. Summaries, logs, sesiones y niveles se conservan sin identidad; la
  etiqueta de los `learner_access` se regenera sin nombres. Todo en una transacción. El token con el
  que se llamó deja de valer (`401` en la siguiente petición) y el login da `invalid_grant`.

### Errores

| Código | `error` | Cuándo |
|---|---|---|
| 400 | `invalid_json` | El cuerpo no es un objeto JSON |
| 403 | (403 de Drupal) | El token no es de un titular: alumno, anónimo, cuenta borrada |
| 403 | `role_not_allowed` | El acceso existe pero el rol no permite la acción (`guardian` o `staff` editando o archivando) |
| 403 | `invalid_password` | Borrado de cuenta con contraseña incorrecta |
| 403 | `too_many_attempts` | Cinco contraseñas incorrectas en una hora (servicio `flood`); tampoco se acepta la correcta hasta que pase |
| 404 | `not_found` | El UUID no es de un alumno al que este titular tenga acceso activo. También si existe y es de otro titular: **nunca 403**, para no revelar que existe |
| 409 | `archived` | Editar un alumno archivado o generarle un código de vínculo |
| 409 | `last_owner` | Retirar el acceso del único `owner` |
| 409 | `in_progress` | Otra creación de alumno del mismo titular en curso (lock) |
| 422 | `learner_limit` (`max`) | Cupo de alumnos alcanzado |
| 422 | `validation` (`field`, `message`) | Nombre vacío o de más de 60 caracteres, avatar que no es una clave (`[A-Za-z0-9_-]{1,32}`), `langcode` que no es `es` ni `ca`, contraseña o código ausentes |
| 422 | `invite_invalid` | Código de vínculo caducado, usado, inexistente, mal formado o de un alumno archivado (un solo error para todos) |
| 422 | `own_invite` | El titular canjea un código que generó él mismo |
| 429 | `too_many_attempts` | Demasiados canjes fallidos (5 por titular y hora, 30 por IP) |

### Idiomas (FASE 18)

El sitio tiene dos idiomas, `es` (por defecto, sin prefijo de URL) y `ca` (prefijo `/ca`); `en`
sigue instalado solo porque las entidades de configuración llevan `langcode: en`, y no se negocia
(prefijo `/en`, sin contenido). Qué significa el idioma en cada cosa
(`plans/multiidioma/analisis.md` 2.1):

- **Alumno**: `preferred_langcode` del usuario (`langcode` en la forma `learner`). Lo fija el alta
  y solo lo cambia el `PATCH` con reinicio. El token de alumno no cambia.
- **Actividades**: nodos independientes por idioma (`langcode` del nodo), nunca traducciones. El
  generador, el techo por contenido y el ciclo solo miran actividades del idioma del alumno, y la
  sesión nace con el `langcode` del alumno. Las consultas JSON:API de actividades, sesiones y
  seguimiento **no cambian**: un alumno `ca` solo recibe sesiones con actividades `ca`.
- **Recursos traducidos** (`content_translation`): áreas (`taxonomy_term/areas`), ciclos
  (`taxonomy_term/activity_cycle`) y mensajes (`activity_message/*`). El mismo `uuid` en los dos
  idiomas; se piden con el prefijo de idioma en la URL y JSON:API devuelve esa traducción:
  `GET /jsonapi/taxonomy_term/areas` (castellano) y `GET /ca/jsonapi/taxonomy_term/areas`
  (catalán, `langcode: ca` en los atributos). Sin traducción, la original.
- **Textos de la app**: la API no devuelve textos de interfaz; la app los tiene en sus catálogos
  `src/locales/es.json` y `ca.json` (subplan 03) y elige el idioma por el alumno activo (04).
- **Scripts por entorno**: `scripts/migrate-langcode-en-to-es.php` (migración única del contenido
  anterior a la FASE 18), `scripts/translate-interface-terms.php` (traducción `ca` de áreas,
  ciclo y mensajes; idempotente) y, desde el subplan 02, los términos fonológicos por idioma.

### Token de alumno (grant OAuth `shine_learner`)

La app juega "en nombre de" un alumno con un **token de alumno**: un access token OAuth cuyo
usuario es el alumno, emitido al titular que tiene acceso a él (subplan 02; `docs/monetization.md`
§5.3). Con ese token **todo el resto de la API funciona sin cambios**: JSON:API escribe el `uid`
del alumno en logs, summaries y feedback; `session/generate` y `session/complete` operan sobre él;
`shine_level` ajusta sus niveles; `/oauth/userinfo` devuelve `sub` = UUID del alumno y `name` = su
nombre. Las rutas de cuenta (`/shine/learners*`, `/shine/me`, `/shine/account/delete`) le
responden 403. Es el motivo de mantener "un usuario Drupal = un alumno".

```
POST /oauth/token
Authorization: Bearer {access token del titular}
Content-Type: application/x-www-form-urlencoded

grant_type=shine_learner
&client_id=shine_expo_app
&learner={uuid del alumno}
&scope=authenticated_user_access
```

Respuesta `200`: `{"token_type": "Bearer", "expires_in": 43200, "access_token": "..."}`. **Sin
`refresh_token`** y con TTL fijo de **12 horas** (`LearnerGrant::ACCESS_TOKEN_TTL`; se ignora el del
consumer, que es para titulares): para renovarlo la app vuelve a pedirlo con el token del titular,
que sí se refresca como hasta ahora. El JWT lleva `sub` = uid del alumno y el claim privado
**`operated_by`** = UUID del titular que lo pidió; el servidor lo copia a `field_operated_by` de
cada sesión nueva que se cree con ese token (`hook_node_presave` + servicio
`shine_account.current_operator`, que lee el claim del Bearer de la petición y exige que su `sub`
sea el usuario actual). Los tokens del grant `password` no llevan el claim, y las sesiones que un
titular genera para sí mismo quedan con `field_operated_by` vacío.

Qué comprueba el servidor (`LearnerGrant`): el Bearer del titular es válido (firma, caducidad,
revocación; lo valida el resource server de simple_oauth dentro del grant, además de la
autenticación de la ruta, y si la petición venía autenticada debe ser la misma persona), es del
mismo cliente y su usuario es un titular activo; el alumno existe, es alumno, está activo, no está
archivado y el titular tiene acceso activo a él con cualquier rol
(`LearnerAccessPolicy::canOperate`). El token se persiste como `oauth2_token` del alumno, así que
**archivarlo o borrar la cuenta revocan los tokens ya emitidos** (siguiente petición: 401) y no se
emiten más. Un token de alumno no sirve para pedir otro (el alumno no es titular), ni como
`refresh_token`, ni su usuario tiene contraseña para el grant `password`.

| Respuesta | Cuándo |
|---|---|
| `400 invalid_grant` | El alumno no existe, no es alumno, está archivado o inactivo, o el titular no tiene acceso activo (un solo error: no se revela si existe). También si quien firma no es un titular activo o su token es de otro cliente |
| `400 invalid_request` | Falta `learner` o falta la cabecera `Authorization` |
| `401` | El Bearer del titular no es válido o está revocado (lo rechaza el proveedor de autenticación de simple_oauth antes de llegar al grant: es global y se aplica a `/oauth/token` en cuanto hay un Bearer) |
| `400 unsupported_grant_type` / `invalid_scope` | Falta `shine_learner` en los `grant_types` del consumer o del scope (configuración; ver CLAUDE.md) |

El grant se llama `shine_learner` (no `urn:shine:learner`: el gestor de plugins de Drupal trata `:`
como separador de derivativas). Está habilitado en el consumer `shine_expo_app` (entidad de
contenido, por entorno) y en el scope `authenticated_user_access` (`config/sync`).

### `learner_access` por JSON:API

`GET /jsonapi/learner_access/learner_access` devuelve solo los accesos del titular autenticado
(`field_holder` es la clave `owner` de la entidad, así que el filtro "own" de JSON:API es el titular;
`administer shine accounts` los ve todos). Solo lectura: crear, editar o borrar por JSON:API da 403,
los escribe el servidor. `filter[field_holder.id]={uuid}` funciona; `filter[field_learner.id]`
devuelve vacío para un titular normal porque el alumno es **otro** usuario y el rol `authenticated`
no tiene `access user profiles` (restricción de JSON:API core sobre las relaciones a `user`). La app
no necesita esta colección: usa `/shine/learners`.

`GET /jsonapi/learner_invite/learner_invite`: igual, solo las invitaciones creadas por el titular
autenticado (`field_created_by` es la clave `owner`), solo lectura, y **sin `field_code_hash`**
(`hook_entity_field_access` lo oculta a todo el mundo salvo `administer shine accounts`).

Administración: vista `shine_learners` en `/admin/shine/learners` (alumno, adultos con rol, origen,
activo, fechas; filtros por alumno, adulto, rol y estado) y las colecciones de las entidades en
`/admin/content/learner-access` y `/admin/content/learner-invite`, todo con `administer shine
accounts`.

---

## Entitlements (FASE 17)

Módulo `shine_entitlement` (`docs/monetization.md` §4; subplanes `plans/entitlement/03` y `04`).
El modelo, la administración y la decisión de acceso (quién está cubierto, cupo efectivo, muro
402); los webhooks que crean entitlements de pago son de 07 (RevenueCat) y 11 (Stripe). **La app
no consulta esta entidad**: le llega lo que necesita por `GET /shine/me` y por el 402 de
`POST /shine/session/generate`.

### Acceso: servicio `shine_entitlement.access` (subplan 04)

`EntitlementAccessInterface` (`src/Access/`): `holderStatus(holder)` → `HolderStatus`;
`coveredBy(learner)` → `Coverage` (`organization` | `holder` | `trial`) o NULL;
`learnerCovered(learner)`; `canGenerateRegular(learner)` → `AccessDecision` (permitido con su
cobertura, o motivo `trial_exhausted` | `learner_paused` | `learner_not_covered` |
`released_by_organization`, siempre con `completed_regular` y `free_regular_sessions`);
`maxLearners(holder)` y `canCreateLearner(holder)`.

Reglas (`docs/monetization.md` §4.1):
- **Titular cubierto** = algún entitlement suyo con estado `active`, `trial`, `grace` o
  `billing_retry`, ya empezado (`field_starts_at`) y con `field_expires_at` vacío o futuro.
  `paused`, `expired`, `revoked` y los caducados no cubren. Sin ninguno: plan `free` del catálogo
  (cupo 1).
- **Cobertura de un alumno**, en orden: (1) plaza de organización (hueco
  `OrganizationCoverageInterface`, servicio `shine_entitlement.organization_coverage`, que el
  subplan 10 sustituye); (2) cualquier adulto con `learner_access` activo cubierto por un plan: si
  es `owner`, el alumno tiene que estar entre los primeros `max_learners` alumnos activos de los que
  es `owner` por fecha de creación (los que sobran quedan `paused`); un `guardian` o `staff` cubre
  **sin gastar su propio cupo**; (3) prueba gratuita: menos de `free_regular_sessions` regulares
  completadas, contando todas las del alumno (también las operadas por otro adulto). Nada de eso:
  `covered_by: none`.
- Una cuenta `holder` que juega consigo misma (anteriores a la FASE 17) se cubre con su propio
  plan, sin cupo, y si no con la prueba.
- **Cupo de alumnos**: `shine_account.learner_quota` queda decorado por
  `EntitlementLearnerQuota`: `POST /shine/learners` admite hasta `max_learners` del plan vigente.
- **Muro**: `EntitlementGate` (etiqueta `shine_level.session_gate`) solo actúa en la rama
  `regular`; el controlador traduce la denegación a `402` ("Generar (u obtener) la siguiente
  sesión").
- **Caché** (`cache.default`): plan vigente por titular con etiquetas `user:{uid}` y
  `entitlement_list`; cobertura "por plan" por alumno con las de todos los usuarios y accesos
  consultados (`learner_access_list`, `entitlement_list`, `user:{adulto}`, `user:{hermano}`). Guardar
  un entitlement, crear, vincular, retirar o archivar un alumno la invalidan solos; las caducidades
  e inicios futuros caducan por `expire`. El contador de la prueba no se cachea.

### Entidad `entitlement`

Un derecho de acceso de pago de un **titular**, independiente de quién cobra.

| Campo | Tipo | Notas |
|---|---|---|
| `field_holder` | ref a `user` | El titular cubierto (cuenta `holder`, nunca un alumno). Es la clave `owner` de la entidad |
| `field_catalog_plan` | ref a `shine_entitlement_plan` | De qué entrada del catálogo sale el cupo. No puede ser `free` |
| `field_plan` | `family` \| `professional` \| `school` \| `courtesy` | Vacío = el `plan` de la entrada del catálogo |
| `field_source` | `app_store` \| `play_store` \| `stripe` \| `organization` \| `manual` | Quién cobra o quién lo concedió |
| `field_status` | `active` \| `trial` \| `grace` \| `billing_retry` \| `paused` \| `expired` \| `revoked` | Por defecto `active` |
| `field_starts_at` / `field_expires_at` | timestamp | Inicio vacío = ahora. Caducidad vacía = no caduca, **solo** con origen `manual` u `organization` |
| `field_quantity` | integer | Asientos comprados (Stripe `quantity`; 1 en stores) |
| `field_max_learners` | integer | Cupo de alumnos. **Vacío al guardar = `learners_per_seat` del catálogo × asientos**; si viene informado se respeta. Copiado a propósito: un cambio del catálogo no afecta a lo ya vendido |
| `field_external_id` | string (128) | Id de la suscripción en RevenueCat o Stripe. Único por origen (índice único + restricción `ShineEntitlementExternalIdUnique`); vacío en cortesías |
| `field_cancelled_at` | timestamp | El titular canceló la renovación; el acceso sigue hasta la caducidad |
| `field_raw_event`, `field_event_timestamp` (ms), `field_last_event_id` | | Rastro de los webhooks para auditoría e idempotencia (07, 11). **Solo los ven los administradores** |
| `label` | | Generada: "Familia · app_store · marta@…" (se regenera si cambia el email del titular, también al borrar la cuenta) |

`field_organization` (ref a `organization`) llega con el subplan 10. Valores fuera de lista, plan
`free`, titular que es alumno, asientos < 1 o caducidad vacía en un origen de pago: el guardado
falla (`preSave`), también desde código.

**JSON:API** (`/jsonapi/entitlement/entitlement`): el titular ve **solo los suyos** con el permiso
`view own entitlement entities` (lo tiene `authenticated`): `filter[field_holder.id]={su uuid}`
devuelve los suyos y cualquier filtro sobre otro titular, `data: []`; el detalle de uno ajeno, 403.
Nadie salvo `administer shine entitlements` crea, edita ni borra por JSON:API.

### Catálogo de planes

Config entity `shine_entitlement_plan` (`shine_entitlement.plan.{id}.yml`, en `config/sync`):
`id`, `label`, `plan`, `learners_per_seat`, `groups_per_seat` y `external_ids` (lista de
`origen:identificador`, orígenes `app_store`, `play_store`, `stripe`). Un mismo identificador no
puede estar en dos planes (lo valida el formulario).

| id | plan | Alumnos por asiento | Grupos | Productos y precios |
|---|---|---|---|---|
| `free` | family | 1 | 0 | — (el de quien no tiene entitlement; no se borra ni se concede) |
| `family` | family | 3 | 0 | `app_store:` y `play_store:` `shine_family_monthly` / `shine_family_annual` |
| `professional` | professional | 15 | 0 | `stripe:price_REEMPLAZAR_pro_monthly` / `_annual` (marcadores: los ids reales llegan con 09 y 11) |
| `school_classroom` | school | 0 | 1 | `stripe:price_REEMPLAZAR_classroom_annual` |

Servicio `shine_entitlement.plan_catalog` (`PlanCatalog`): `get(id)`, `all()`, `free()`,
`resolveExternal(source, external_id)` (lanza `UnknownExternalPlanException` si no está: los
webhooks lo traducen a 422 + watchdog para que la store o Stripe reintenten),
`maxLearners(plan_id, quantity)` y `planForExternalId('origen:id')`.

### Administración

| Ruta | Qué |
|---|---|
| `/admin/shine/entitlements` | Vista `shine_entitlements`: titular, plan del catálogo, tipo, origen, estado, asientos, cupo, fechas, id externo y operaciones; filtros por titular (email o nombre), tipo, origen y estado. Acción "Conceder una cortesía" |
| `/admin/shine/entitlements/add` | Cortesías y licencias manuales: origen siempre `manual`, tipo `courtesy` y estado `active` por defecto, plan del catálogo (sin `free`), asientos, fechas (vacías = ahora / no caduca) y cupo opcional. `?holder={uid}` rellena el titular |
| `/admin/shine/entitlements/{id}/edit` | Editar (p. ej. revocar a mano). El origen no se cambia |
| `/user/{uid}/entitlements` | Pestaña "Acceso" del perfil: los entitlements del titular y el botón de cortesía |
| `/admin/config/shine/plans` | Catálogo de planes (alta, edición; `free` no se borra) |

Todo con el permiso `administer shine entitlements`. Para aplicar a lo ya vendido un cambio del
catálogo: `ddev drush shine-entitlement:recalc [--plan=ID] [--dry-run]` (solo entitlements vivos:
ni `expired` ni `revoked` ni caducados).

---

## Webhooks (FASE 17)

### RevenueCat

`POST /shine/webhooks/revenuecat` (módulo `shine_entitlement`, subplan 07; `docs/monetization.md`
§6.1). Ruta anónima: la autentica la cabecera `Authorization`, que debe ser **exactamente** el
valor de `$settings['shine_entitlement.revenuecat_webhook_secret']` (`settings.php`, nunca en
config ni en git) y el mismo que se configura en el panel de RevenueCat (Integrations → Webhooks →
"Authorization header value"). Comparación en tiempo constante. **El valor no puede empezar por
`Bearer `**: el proveedor de autenticación de simple_oauth es global y toma cualquier
`Authorization: Bearer …` por un token OAuth (401 antes del controlador), y `_oauth_skip_auth` no
lo evita en una ruta solo POST (simple_oauth la busca con un GET y no la encuentra). Se procesan
tanto `environment: SANDBOX` como `PRODUCTION`: las compras de TestFlight y de las pruebas
internas de Play llegan como sandbox.

Cuerpo: el de RevenueCat (`{"api_version": "1.0", "event": {...}}`). El evento se guarda entero en
`field_raw_event`.

| Respuesta | Cuándo |
|---|---|
| `200 {applied: true, type, event, entitlement, status}` | Evento aplicado |
| `200 {applied: false, outcome: "skipped", reason: "duplicate" \| "stale"}` | Mismo `id` que el último aplicado, o `event_timestamp_ms` anterior al último aplicado (idempotencia) |
| `200 {applied: false, ignored: true, reason}` | No es para nosotros y RevenueCat no debe reintentar: `test`, `unsupported_type`, `unsupported_store` (solo `APP_STORE`, `MAC_APP_STORE` y `PLAY_STORE`; Stripe va por su propio webhook, subplan 11), `unknown_holder` (ni `app_user_id`, ni `aliases`, ni `original_app_user_id` son el UUID de un titular activo: usuario borrado o id anónimo), `no_transaction_id`, `unknown_transfer_target`, `nothing_to_transfer` |
| `400 {error: invalid_payload}` / `400 {outcome: "invalid", reason}` | Sin objeto `event`; sin `type`, `id` o `event_timestamp_ms`; un evento que activa sin `product_id` o sin `expiration_at_ms` |
| `401 {error: unauthorized \| webhook_not_configured}` | Cabecera ausente o distinta; secreto sin configurar |
| `422 {error: unknown_product, source, product_id}` | El producto no está en el catálogo de planes: RevenueCat reintenta; añadirlo en `/admin/config/shine/plans` (§4.3) |

Identidades: el titular es `app_user_id` (la app hace `Purchases.logIn(uuid del titular)`), con
`aliases` y `original_app_user_id` como respaldo. El entitlement es la pareja (origen por `store`,
`field_external_id` = **`original_transaction_id`**, el id de la suscripción, estable entre
renovaciones en las dos stores; `transaction_id` si faltara). `original_app_user_id` no vale: dos
suscripciones del mismo usuario chocarían y un `TRANSFER` lo mueve. Un `TRANSFER` no trae
transacción: mueve todos los entitlements de store de los `transferred_from` al primer titular de
`transferred_to`.

Tabla de eventos tal como ha quedado:

| Evento | Qué hace |
|---|---|
| `INITIAL_PURCHASE`, `RENEWAL`, `UNCANCELLATION`, `SUBSCRIPTION_EXTENDED`, `REFUND_REVERSED` | Crea o actualiza: `active` (`trial` si `period_type = TRIAL`), `expires_at` = `expiration_at_ms`, `cancelled_at` vacío. Plan y cupo del producto del evento (`PlanCatalog::resolveExternal`) |
| `PRODUCT_CHANGE` | Igual, con el producto de `new_product_id` (si viene) o `product_id`. El cupo sigue al producto del último evento que activa: la `RENEWAL` siguiente trae el vigente |
| `CANCELLATION` | `cancelled_at` = momento del evento; el acceso sigue hasta `expires_at`. Si `cancel_reason = CUSTOMER_SUPPORT` es un **reembolso**: `revoked` y `expires_at` = ahora (RevenueCat no tiene evento `REFUND`) |
| `BILLING_ISSUE` | `billing_retry` (sigue cubriendo); `expires_at` = `grace_period_expiration_at_ms` si hay gracia, si no la caducidad del evento |
| `EXPIRATION` | `expired`; `revoked` si `expiration_reason = CUSTOMER_SUPPORT`; `paused` si `SUBSCRIPTION_PAUSED`. `expires_at` = la caducidad del evento, nunca después de ahora |
| `SUBSCRIPTION_PAUSED` (Play) | Solo anuncia la pausa al final del periodo: el estado no cambia; el acceso lo corta la `EXPIRATION` posterior |
| `TRANSFER` | Los entitlements de store pasan al titular de `transferred_to` |
| `TEST` | Ignorado (200) |
| `NON_RENEWING_PURCHASE`, `TEMPORARY_ENTITLEMENT_GRANT`, `INVOICE_ISSUANCE`, `PURCHASE_REDEEMED`, `PRICE_INCREASE_*`, `EXPERIMENT_ENROLLMENT`, `VIRTUAL_CURRENCY_TRANSACTION`, `SUBSCRIBER_ALIAS` | Ignorados con aviso en watchdog (no vendemos nada de eso) |

Cualquier evento de una suscripción de la que no llegó la compra crea el entitlement con el estado
que toque (una `EXPIRATION` suelta deja un `expired`): queda el rastro y nadie gana acceso. Cada
evento se aplica en una transacción y deja `field_last_event_id` y `field_event_timestamp` (ms); al
terminar se invalidan `entitlement_list` y `user:{uid}` de los titulares tocados, así que
`GET /shine/me` cambia sin limpiar cachés. Todo queda en watchdog, canal `shine_entitlement`.

**Refresco bajo demanda** (§6.1, consultar la API REST de RevenueCat si el entitlement de store
caduca en menos de una hora): sin implementar, no hay clave de API todavía. Queda
`SubscriberRefreshInterface` (servicio `shine_entitlement.revenuecat_refresh`, hoy
`NullSubscriberRefresh`) y el flag `shine_entitlement.settings: revenuecat_refresh = false`; la
clave iría en `$settings['shine_entitlement.revenuecat_api_key']`.

Probar en local con los fixtures de `tests/fixtures/revenuecat/` (uno por tipo de evento),
sustituyendo `{{APP_USER_ID}}` por el UUID del titular:
```bash
curl -s -X POST https://shine.ddev.site/shine/webhooks/revenuecat \
  -H 'Authorization: local-dev-secret' -H 'Content-Type: application/json' \
  -d "$(sed "s/{{APP_USER_ID}}/$UUID/" shine/public_html/modules/custom/shine_entitlement/tests/fixtures/revenuecat/initial_purchase.json)"
```

---

## Endpoint legacy (actual, acoplado)

Existe mientras se completa la migración a JSON:API:

```
POST /activitylog-register/add
Content-Type: application/x-www-form-urlencoded
(requiere sesión Drupal activa, no JWT)

activityId={nid}
activityType={bundle}
sessionId={nid}
items=[{"text":"palabra","weight":1}]   (JSON serializado)
times=[1200,980,1500]                   (JSON serializado)
weights=[1,2,3]                         (JSON serializado)
```

**Respuesta:** texto plano con mensaje de éxito.

> Este endpoint se eliminará en Fase 3 del roadmap.

---

## Endpoint de audio (futuro — Fase 7)

```
POST /jsonapi/activitylog/logaudioreading
```

```json
{
  "data": {
    "type": "activitylog--logaudioreading",
    "attributes": {
      "label": "Audio-{sessionId}-{activityId}-{iteration}",
      "field_activity_type": "audio_reading",
      "field_recorded_time": 8500,
      "field_iteration": 1
    },
    "relationships": {
      "field_activityid": {
        "data": { "type": "node--activity_audio_reading", "id": "{uuid}" }
      },
      "field_sessionid": {
        "data": { "type": "node--session", "id": "{uuid}" }
      }
    }
  }
}
```

---

## Configuración de CORS (Drupal)

En `sites/default/services.yml` (ya configurado en el proyecto):

```yaml
parameters:
  cors.config:
    enabled: true
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-CSRF-Token']
    allowedMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
    allowedOrigins: ['*']
    exposedHeaders: false
    maxAge: 86400
    supportsCredentials: false
```

En producción, reemplazar `allowedOrigins: ['*']` por el dominio específico de la app.

---

## Errores comunes

| Código | Causa | Solución |
|---|---|---|
| 401 | Token expirado o inválido | Hacer refresh del token |
| 403 | Sin permisos para el recurso | Verificar permisos JSON:API en Drupal |
| 422 | Payload malformado | Verificar tipos y UUIDs en relationships |
| 404 | UUID no existe | Verificar que el recurso existe y está publicado |
