# CLAUDE.md — Shine Project Reference

Guía de referencia para Claude Code. Actualizar con cada descubrimiento técnico relevante.

---

## Configuración en un PC nuevo

Pasos completos para arrancar el proyecto desde cero en una máquina nueva.

### 1. Requisitos previos

Instalar estas herramientas antes de empezar:

- **Docker Desktop** (o OrbStack) — requerido por DDEV
- **DDEV** — [docs.ddev.com/install](https://ddev.readthedocs.io/en/stable/users/install/)
- **mkcert** — imprescindible para el SSL local de DDEV. Sin él, `ddev start` falla con
  `mkcert: executable file not found in $PATH` y el navegador rechaza `https://shine.ddev.site`
  (la app da "Failed to fetch" al llamar a `/oauth/userinfo`). Instalar y registrar la CA:
  ```bash
  brew install mkcert nss   # nss = soporte Firefox
  mkcert -install           # añade la CA local al llavero del sistema
  ddev restart              # regenera el certificado del proyecto
  ```
- **nvm** — para gestionar versiones de Node
- **Node 21** — instalar y fijar como default:
  ```bash
  nvm install 21
  nvm alias default 21
  ```
- **Git**

### 2. Clonar el repositorio

```bash
git clone <URL_DEL_REPO> shine.test
cd shine.test
```

### 3. Configurar Drupal con DDEV

```bash
cd shine/

# Arrancar el entorno Docker
ddev start

# Instalar dependencias PHP
ddev composer install

# Importar la configuración (crea tablas, módulos, etc.)
ddev drush site:install --existing-config -y

# Importar configuración exportada (si ya existe BD)
# ddev drush cim -y

# Reconstruir cache
ddev drush cr

# Términos que no viajan en config/sync: sonoridad y esfuerzo de decodificación, por idioma (FASE 18)
ddev drush php:script scripts/create-phonology-terms.php -- es
ddev drush php:script scripts/create-phonology-terms.php -- ca
# Los 11 niveles Level0 a Level10 (contenido, por entorno: nombre, peso y descripción con edad y curso), el término
# del ciclo obligatorio "Sílabas" y las traducciones catalanas de áreas, ciclo y mensajes
ddev drush php:script scripts/create-level-terms.php
ddev drush php:script scripts/create-cycle-term.php
ddev drush php:script scripts/translate-interface-terms.php
# Banco de imágenes como media (name = slug; el manifiesto lleva el bloque ca de cada imagen)
ddev drush shine-content:import-images content/images/manifest.json
# FASE 19: mensajes de explicación de la matriz con regla (uno por familia, con imagen de ejemplo)
ddev drush php:script scripts/create-rule-explanations.php
# FASE 20: mensajes de explicación de la secuencia con regla (uno por familia)
ddev drush php:script scripts/create-sequence-explanations.php

# Verificar que todo va bien
ddev drush status
```

> La URL local será `https://shine.ddev.site` (DDEV gestiona el SSL automáticamente).
>
> `settings.php` no está en git. Debe fijar `$settings['config_sync_directory'] = '../config/sync';`
> **antes** del include de `settings.ddev.php`; si no, DDEV la pone en `sites/default/files/sync`
> (vacío) y `drush cex` / `cim` / `config:status` trabajan contra otro directorio. Comprobar con
> `ddev drush php-eval 'echo \Drupal\Core\Site\Settings::get("config_sync_directory");'`.

### 4. Generar las claves RSA para OAuth2

Las claves **no se guardan en git** (están en `.gitignore`). Hay que regenerarlas:

```bash
ddev exec "mkdir -p /var/www/html/private/oauth-keys"
ddev exec "openssl genrsa -out /var/www/html/private/oauth-keys/private.key 2048"
ddev exec "openssl rsa -in /var/www/html/private/oauth-keys/private.key -pubout -out /var/www/html/private/oauth-keys/public.key"
ddev exec "chmod 600 /var/www/html/private/oauth-keys/private.key"
```

### 5. Verificar el scope OAuth2

Después de `drush cim`, comprobar que el nombre del scope es correcto (ver gotcha #3):

```bash
ddev drush php-eval "
\$scope = \Drupal::entityTypeManager()->getStorage('oauth2_scope')->load('authenticated_user_access');
echo \$scope->getName();
"
# Debe imprimir exactamente: authenticated_user_access
# Si no, corregir:
ddev drush php-eval "
\$s = \Drupal::entityTypeManager()->getStorage('oauth2_scope')->load('authenticated_user_access');
\$s->set('name', 'authenticated_user_access')->save();
"
```

### 6. Crear usuario administrador

```bash
ddev drush user:create admin --mail="admin@example.com" --password="password"
ddev drush user:role:add administrator admin
# O resetear contraseña de user 1:
ddev drush user:password admin "nueva_password"
```

### 7. Instalar dependencias de la app Expo

```bash
cd ../shine-app/
nvm use 21
npm install --legacy-peer-deps
npx expo install --fix
```

### 8. Consumer OAuth2: grant `password` y redirect URI

El consumer no viaja en `config/sync`. Tras crearlo, habilitar el grant `password` (ver sección
"OAuth2 → Consumer configurado"). Solo si se quiere probar el flujo Authorization Code (la app no lo
usa) hace falta añadir el redirect URI del entorno local:

```bash
cd ../shine/
ddev drush php-eval "
\$consumers = \Drupal\consumers\Entity\Consumer::loadMultiple();
foreach (\$consumers as \$c) {
  if (\$c->get('client_id')->value === 'shine_expo_app') {
    \$uris = \$c->get('redirect')->getValue();
    \$uris[] = ['value' => 'http://localhost:8081'];
    \$c->set('redirect', \$uris)->save();
    echo 'OK';
  }
}
"
```

### 9. Arrancar y probar

```bash
# Terminal 1 — Drupal ya está corriendo con DDEV
# Verificar: https://shine.ddev.site

# Terminal 2 — App Expo
cd shine-app/
nvm use 21
npm run web    # abre http://localhost:8081
```

### Archivos que NO están en git y hay que crear/configurar manualmente

| Archivo/Directorio | Motivo | Cómo obtenerlo |
|---|---|---|
| `shine/public_html/sites/default/settings.local.php` | Credenciales locales | Copiar de `settings.php` y ajustar |
| `shine/private/oauth-keys/private.key` | Clave privada RSA | Regenerar (paso 4) |
| `shine/private/oauth-keys/public.key` | Clave pública RSA | Regenerar (paso 4) |
| `shine-app/.env.local` | Variables de entorno locales (`EXPO_PUBLIC_API_BASE`, `EXPO_PUBLIC_OAUTH_CLIENT_ID`) | Copiar de `shine-app/.env.example`. Opcional en desarrollo: `src/lib/config.ts` tiene defaults (`https://shine.ddev.site`, `shine_expo_app`) |
| `$settings['shine_entitlement.revenuecat_webhook_secret']` en `settings.php` | Secreto del webhook de RevenueCat (FASE 17, subplan 07). Sin él, `POST /shine/webhooks/revenuecat` responde 401 a todo | El mismo valor que la cabecera "Authorization header value" del webhook en el panel de RevenueCat. **Sin el prefijo `Bearer `** (simple_oauth lo interceptaría). En local: `local-dev-secret` |

---

## Estructura del proyecto

```
shine.test/
├── shine/                    ← raíz del proyecto Drupal (Composer root)
│   ├── composer.json
│   ├── public_html/          ← web root (Drupal)
│   │   ├── core/
│   │   ├── modules/
│   │   │   └── custom/       ← 5 módulos custom
│   │   ├── themes/
│   │   │   └── custom/shine/ ← tema activo
│   │   └── sites/default/
│   ├── config/sync/          ← config exportada (drush cex)
│   ├── content/              ← lotes JSON de actividades (drush shine-content:import)
│   └── scripts/              ← scripts drush php:script (términos por entorno, backfills)
├── shine-app/                ← proyecto Expo (React Native + web)
│   ├── app/                  ← rutas Expo Router
│   │   ├── _layout.tsx       ← root layout con auth guard
│   │   ├── index.tsx         ← redirect inicial
│   │   ├── login.tsx         ← email + contraseña in-app (grant password)
│   │   ├── register.tsx      ← crear cuenta (REST user_registration, con consentimiento de adulto) + login automático
│   │   └── (auth)/
│   │       ├── dashboard.tsx
│   │       ├── learners/new.tsx     ← "¿Con quién vas a trabajar?": alta de alumno (FASE 17)
│   │       ├── learners/select.tsx  ← selector de alumno (FASE 17)
│   │       ├── learners/join.tsx    ← "Tengo un código": vínculo por código (FASE 17, 06; acepta ?code=)
│   │       ├── learners/[uuid]/     ← ficha (index: acciones por rol), edit (nombre y avatar), invite (código + QR) (FASE 17, 06)
│   │       ├── settings.tsx         ← sección "Alumnos" (activos, archivados plegados, añadir, código) + fuente + cerrar sesión
│   │       ├── session/[id].tsx
│   │       └── statistics/index.tsx
│   ├── src/
│   │   ├── types/            ← jsonapi.ts, activity.ts, session.ts, activitylog.ts, activitysummary.ts
│   │   ├── lib/
│   │   │   ├── storage.ts    ← SecureStore (móvil) / localStorage (web)
│   │   │   ├── stripHtml.ts
│   │   │   ├── authForm.ts   ← validación y mensajes de entrar/crear cuenta (lógica pura, testeada)
│   │   │   ├── activityKinds/ ← definición pura por tipo de actividad + buildTracking (payloads log/summary)
│   │   │   ├── letterMatrix.ts, syllableOrder.ts, wordSplit.ts ← lógica pura del contenido de los tipos de la FASE 13
│   │   │   ├── rapidRepetition.ts ← lógica pura de la repetición rápida (FASE 16): palabras, suma, ritmo, formato con coma
│   │   │   ├── sessionCards.ts ← tarjetas del dashboard, sesión pendiente, nombres de sesiones de ajuste, copy del 402
│   │   │   ├── startRoute.ts, learnerForm.ts, learnerCopy.ts, avatars.ts ← FASE 17: ruta de arranque, alta de alumno, textos de cobertura, set de avatares (lógica pura, testeada)
│   │   │   ├── learnerScreens.ts ← FASE 17 (06): textos de alumnos/invitación/código por pantalla (`*_COPY`), acciones por rol, código de vínculo, quién operó cada sesión
│   │   │   └── api/          ← client.ts (doble token), tokenFlow.ts (qué token y reintento, puro), errors.ts (ApiError, PaymentRequiredError, LearnerError), auth.ts (login/registro), me.ts (/shine/me), learners.ts (/shine/learners*), activities.ts, sessions.ts (getSessions, generate, complete), tracking.ts (postLog/postSummary), statistics.ts, messages.ts
│   │   ├── store/            ← auth.ts (titular + alumno activo), session.ts (Zustand)
│   │   └── components/
│   │       ├── activities/   ← ActivityRouter → ActivityBase (todo lo común) → VerticalTextPlayer, AudioReadingPlayer, ImageGroupPlayer, LetterMatrixPlayer, SyllableOrderPlayer, WordSplitPlayer (solo el juego)
│   │       └── statistics/   ← ActivityEvolutionChart, AccuracyEvolutionChart (ejercicios con aciertos), AreaRadarChart, SessionComparisonTable, StatsDataTable
│   ├── package.json
│   ├── app.json
│   └── README.md
├── docs/                     ← documentación del proyecto
│   ├── description.md
│   ├── structure.md
│   ├── architecture.md
│   ├── roadmap.md
│   ├── progress.md           ← ESTADO ACTUAL — leer primero al reanudar
│   ├── conventions.md
│   ├── activity-system.md
│   ├── exercise-catalog.md   ← tipos de ejercicio, escala de niveles 0-10 y generación automática de contenido
│   ├── api-design.md
│   ├── metrics-tracking.md
│   └── statistics-design.md
└── CLAUDE.md                 ← este fichero
```

> **Antes de trabajar**: leer `docs/progress.md` para saber en qué fase estamos.
>
> **Seguimiento del contenido**: `plans/contenido/SEGUIMENT.md` (encargos, revisiones, dudas, fases y
> actividades por idioma, área, tipo y nivel). Se genera con `python3 shine/content/generadores/seguiment.py`
> desde Drupal y `plans/contenido/seguiment-registre.json`; tras cada avance se actualiza el registro y se
> regenera. No se edita a mano. Tablero visual (claude.ai, privado): https://claude.ai/artifact/7JkStNDLcYkg8H74rvokZv;
> para actualizarlo, `seguiment.py --export plans/contenido/seguiment-dades`, subir cada JSON cambiado como asset del
> artifact y actualizar `url` y `updated` del dataset correspondiente.
>
> **Fuentes de datos**: toda fuente externa o de criterio que se use para generar, filtrar o validar
> contenido (listas de frecuencia, corpus, documentos de expertos, imágenes) se registra en
> `docs/fuentes-de-datos.md` con cita, versión, fecha, licencia y uso **antes** de usarla. Los
> ficheros con licencia van a `dades-privades/lexico/fuentes/` (git de docs, privado; `shine/private/lexico` es un
> enlace). El CORPES (130 MB) queda fuera de git. Mapa de enlaces y cómo recrearlos en `dades-privades/README.md`.

---

## Entorno de desarrollo

- **DDEV** (Docker). Todos los comandos Drupal se ejecutan con prefijo `ddev` desde `shine/`.
- **Web root**: `shine/public_html/`
- **Config sync**: `shine/config/sync/`
- **URL local**: `https://shine.ddev.site`
- **Node**: se requiere >= 20. Usar `nvm use 21`. Default: `nvm alias default 21`.

Comandos frecuentes:
```bash
ddev start / ddev stop
ddev drush <comando>
ddev composer <comando>
ddev exec bash -c '<comando-dentro-del-contenedor>'
```

> **Importante**: para URLs con `&` en curl dentro de `ddev exec`, usar comillas simples:
> ```bash
> ddev exec bash -c 'curl -s "https://shine.ddev.site/ruta?a=1&b=2"'
> ```
> Sin comillas simples, el shell interpreta `&` como "ejecutar en background" y se pierde el resto de la URL.

### Arrancar la app Expo

```bash
cd shine-app
nvm use 21          # o nvm alias default 21 para hacerlo permanente
npm run web         # navegador en localhost:8081
npm start           # QR para Expo Go (SDK 54)
```

---

## Stack actual (2026-03-27)

| Componente | Versión | Notas |
|---|---|---|
| Drupal | 11.4.10 | Upgrade desde D10; core update a 11.4 reconciliado en config el 2026-07-22 (split search_help/search_node, gzip→compress). 11.4.10 el 2026-10-16 (SA-CORE-2026-013 a 016) |
| PHP | 8.3 | |
| MariaDB | 10.11 | |
| Drush | 13.8.0 | |
| composer-patches | 2.0.0 | Sin parches. Los parches van en `extra.patches` y se fijan en `patches.lock.json` (versionado). Tras añadir uno: `ddev composer patches-relock && ddev composer patches-repatch` |
| simple_oauth | 6.1.1 | OAuth2. La app usa el grant `password` (login in-app) |
| simple_oauth_password_grant | 2.1.0 | Contrib: re-añade el grant `password` a simple_oauth 6 (con flood control y login por email) |
| rest (core) | core | Solo el recurso `user_registration` (`POST /user/register?_format=json`) |
| JSON:API | core | Habilitado |
| CORS | services.yml | Habilitado, `allowedOrigins: ['*']` |
| Expo SDK | 54 | SDK 55 incompatible con Expo Go actual |
| React Native | 0.76.7 | |
| Expo Router | 4.x | File-based routing |
| Zustand | 5.x | Estado global |

---

## OAuth2 — Cómo funciona en este proyecto

### Versión y flujo

`simple_oauth v6` eliminó el Password Grant de serie (OAuth 2.1). Desde la **FASE 14 (2026-09-29)** lo
re-añade el contrib **`simple_oauth_password_grant`** y la app hace **login in-app** con
`grant_type=password` (email + contraseña dentro de la app, sin abrir el navegador). Motivo: la app
se publicará en los stores dentro de Capacitor, y un flujo con redirect al navegador externo es
frágil en un WebView. El grant `authorization_code` sigue habilitado en el consumer pero la app ya
no lo usa (se eliminaron `expo-auth-session` y `expo-web-browser`).

### Login y registro in-app (FASE 14)

```
POST /oauth/token                          grant_type=password&client_id=shine_expo_app
                                           &username={email}&password={pass}&scope=authenticated_user_access
POST /user/register?_format=json           {"name":{"value":email},"mail":{"value":email},
  (anónimo, REST core user_registration)    "pass":{"value":pass},"field_display_name":{"value":"Marta"},
                                            "field_adult_consent":{"value":true}}
```

- **Consentimiento de adulto (FASE 17)**: sin `field_adult_consent: true` el registro anónimo da
  `422` con `field_adult_consent: ...` en el mensaje (restricción `ShineAdultConsent` de
  `shine_account`). `drush user:create` y el admin crean usuarios sin él. Hasta el subplan 05 la
  app no lo envía: registrarse desde la app da 422; probar con las cuentas existentes.

- **Identidad**: el `name` (username) de Drupal **es el email**; el nombre humano va en el campo
  `field_display_name` (string, 60) del usuario. `shine_oauth` implementa `hook_user_format_name_alter()`
  para que `getDisplayName()` (y por tanto el claim `name` de `/oauth/userinfo` y el admin de Drupal)
  devuelva ese nombre. El módulo de password grant acepta username **o email** en `username`.
- **Política de registro** (`user.settings`): `register: visitors`, `verify_mail: false`. Sin
  aprobación ni email de verificación: el usuario elige contraseña en la app y entra al momento.
- **Permiso**: rol `anonymous` tiene `restful post user_registration`. Config exportada en
  `rest.resource.user_registration.yml` (POST, json, auth `cookie`; una petición anónima sin cookie
  de sesión no requiere token CSRF).
- **Errores que maneja la app** (`src/lib/api/auth.ts`): `400 invalid_grant` (credenciales),
  `403 flood_user_blocked` / `flood_ip_blocked` (flood control con los límites de `user.flood`),
  `422` con "already taken" (email repetido) u otra validación.
- **Cliente público**: el consumer sigue sin secret; `ClientRepository::validateClient` de simple_oauth
  no exige secret a consumers `confidential: false`. Verificado con curl.
- **Fase 2 (futuro)**: cobro recurrente para registrados. La identidad es el UUID del user de Drupal
  (`sub` de userinfo): cualquier estado de suscripción se cuelga de ese usuario.

### Endpoints OAuth2

```
POST /oauth/token         ← password grant (login in-app) / refresh / shine_learner (token de alumno, FASE 17)
GET  /oauth/userinfo      ← info del usuario autenticado (JWT); sub = UUID, name = field_display_name
GET  /oauth/jwks          ← claves públicas JWT
GET  /oauth/authorize     ← Authorization Code (sigue activo, la app NO lo usa)
```

- **Token de alumno (FASE 17, `shine_account`)**: `POST /oauth/token` con `Authorization: Bearer
  {token del titular}` y `grant_type=shine_learner&client_id=shine_expo_app&learner={uuid}&scope=authenticated_user_access`
  → access token **del alumno**, 12 h, **sin refresh** (se vuelve a pedir con el del titular), con
  el claim `operated_by` = UUID del titular, que `hook_node_presave` copia a `field_operated_by` de
  las sesiones nuevas. Con ese token toda la API es la del alumno; las rutas de cuenta dan 403.
  Alumno ajeno, archivado o inexistente → `400 invalid_grant` (un solo error). Detalle en
  `docs/api-design.md` ("Token de alumno").

### Endpoints custom (no JSON:API)

```
POST /shine/session/generate          ← sesión pendiente del usuario o generar la siguiente (FASE 15, shine_level)
POST /shine/session/{uuid}/complete   ← cierre de sesión + reglas de nivel (FASE 15, módulo shine_level)
```
Bearer OAuth en ambos. `generate`: 200 con la pendiente (`created: false`) o 201 con la nueva
(`created: true`); 409 `in_progress` (lock por usuario); 422 `no_content` si el catálogo no
tiene actividades para la sesión decidida; **402 `payment_required`** (FASE 17, subplan 04) si
la sesión decidida es **regular** y nadie cubre al alumno (`reason`: `trial_exhausted` |
`learner_paused` | `learner_not_covered` | `released_by_organization`, más
`free_regular_sessions`, `completed_regular` y `holder_status`); las evaluaciones nunca dan 402.
Una pendiente de más de `pending_max_days` (7) días se despublica y se genera otra. `complete`:
solo el dueño; 409 `incomplete` si falta algún `activitysummary`; idempotente
(`field_completed_at`). La app debe llamar a `complete` **después** de enviar `sessionfeedback`
/ `activityfeedback`. Detalle en `docs/api-design.md` ("Sesiones generadas, cierre y niveles").
Para depurar el árbol de decisión y la puerta: `ddev drush shine-level:generate {uid} --dry-run`.

```
POST   /shine/learners                  ← crear alumno {display_name, avatar?} → 201 (FASE 17, shine_account)
GET    /shine/learners                  ← mis alumnos (activos y archivados)
GET    /shine/learners/{uuid}           ← un alumno
PATCH  /shine/learners/{uuid}           ← nombre y avatar (solo owner)
POST   /shine/learners/{uuid}/archive   ← archivar (solo owner; revoca sus tokens)
DELETE /shine/learners/{uuid}/access    ← retirar mi acceso (409 last_owner si soy el único owner)
POST   /shine/learners/{uuid}/invite    ← código de vínculo para otro adulto (solo owner) → 201 {code, expires_at}; el código no se guarda
POST   /shine/learners/join             ← canjear {code} → guardian; 422 invite_invalid / own_invite; 429 por intentos (flood)
GET    /shine/me                        ← titular + alumnos (otros módulos amplían con hook_shine_me_alter)
POST   /shine/account/delete            ← borrar (anonimizar) mi cuenta {password}
```
Solo **titulares** (`_shine_holder`, por `field_account_kind`): un token de alumno recibe 403. Un
alumno que no sea mío es **404, nunca 403**. Cupo del plan gratuito: 1 alumno
(`shine_account.learner_quota`, lo sustituye 04). Forma de `learner`, errores y reglas por rol en
`docs/api-design.md` ("Cuentas y alumnos").

```
POST   /shine/organizations/join        ← canjear un código de centro {code} → miembro con el rol del código (FASE 17e, 10, shine_org)
GET    /shine/organizations             ← mis organizaciones (forma: uuid, label, kind, role, covered, plan, max_learners, used_seats)
GET    /shine/organizations/{uuid}      ← una organización (+ members[] si soy coordinador); .../learners → alumnos en plaza (coordinador)
POST   /shine/learners                  ← con `organization` (UUID): alumno en plaza (403 not_member, 422 organization_limit)
POST   /shine/learners/{uuid}/staff     ← {member} acceso staff a otro miembro (coordinador); DELETE .../staff/{member_uuid} lo retira (409 not_staff)
POST   /shine/learners/{uuid}/release   ← fin de la plaza (owner o coordinador): guardian → owner o archivo; 409 not_in_organization
```
Detalle en `docs/api-design.md` ("Organizaciones"). Un alumno en plaza cubre a todos sus adultos
(`covered_by: organization`) y no gasta cupo ni prueba; tras el `release`, `released_by` y el 402
con `reason: released_by_organization` durante 30 días.

```
POST /shine/webhooks/revenuecat      ← webhook de RevenueCat (FASE 17, 07, shine_entitlement): anónimo, cabecera
                                       Authorization = $settings['shine_entitlement.revenuecat_webhook_secret']
```
200 siempre que el evento sea nuestro (aplicado, repetido o ignorado), 401 secreto, 422 producto
fuera del catálogo (RevenueCat reintenta), 400 cuerpo inválido. El entitlement es (`store`,
`original_transaction_id`); tabla de eventos y respuestas en `docs/api-design.md` ("Webhooks").
Fixtures reales para probar con curl en `shine_entitlement/tests/fixtures/revenuecat/`.

### Consumer configurado

- **client_id**: `shine_expo_app`
- **client_secret**: (vacío) — desde 2026-07-21 el consumer es **cliente público** (B4). Con PKCE el secreto es innecesario y en un bundle JS sería público de facto. NO reintroducir secret.
- **UUID**: `5393c7d5-0f7b-4482-a770-0e5ce00639c2`
- **grant_types**: `authorization_code`, `refresh_token`, `password` (login de la app) y `shine_learner` (token de alumno, FASE 17)
- **scope**: `authenticated_user_access`
- **redirect_uris configuradas**:
  - `exp://localhost:19000/--/oauth2redirect` — Expo Go (móvil)
  - `http://localhost:8081` — web dev
- **confidential**: false (cliente público)

> El consumer es una **entidad de contenido** (vive en BD, no en `config/sync`): `drush cex` no lo captura y hay que recrearlo/ajustarlo en cada entorno (ver "Configuración en un PC nuevo"). Al crearlo, poner `confidential: false`, no asignar secret y **marcar los grants `password` y `shine_learner`** (sin ellos, `/oauth/token` devuelve `unsupported_grant_type`):
> ```bash
> ddev drush php-eval "
> \$c = \Drupal::entityTypeManager()->getStorage('consumer')->loadByProperties(['client_id' => 'shine_expo_app']);
> \$c = reset(\$c); \$g = array_column(\$c->get('grant_types')->getValue(), 'value');
> foreach (['password', 'shine_learner'] as \$grant) { if (!in_array(\$grant, \$g)) { \$g[] = \$grant; } }
> \$c->set('grant_types', \$g)->save(); echo implode(',', \$g);
> "
> ```
>
> El rol `authenticated` tiene el permiso `grant simple_oauth codes` (exportado en `config/sync/user.role.authenticated.yml`), **imprescindible** para que un usuario normal pueda completar `/oauth/authorize`. Sin él solo el user 1 (super user) puede hacer login.
>
> `automatic_authorization` del consumer está en `off`: se muestra una pantalla de consentimiento "Allow" en cada login. Activarlo si se quiere login sin fricción.

### Scope — BUG CONOCIDO Y CORREGIDO

`simple_oauth` v6 busca el scope con `loadByName()` → `loadByProperties(['name' => $identifier])`.
El campo `name` es el label humano, **NO** el machine name. Por tanto, el `name` del scope entity
**debe ser idéntico al identifier enviado en el request OAuth**.

**Correcto**: scope con `name = 'authenticated_user_access'` (sin mayúsculas, con guiones bajos).
**Incorrecto**: scope con `name = 'Authenticated user access'` → devuelve `invalid_scope`.

Si aparece `invalid_scope`, verificar con:
```bash
ddev drush php-eval "
\$scope = \Drupal::entityTypeManager()->getStorage('oauth2_scope')->load('authenticated_user_access');
echo \$scope->getName();  // debe ser exactamente 'authenticated_user_access'
"
```
Para corregir:
```bash
ddev drush php-eval "
\$s = \Drupal::entityTypeManager()->getStorage('oauth2_scope')->load('authenticated_user_access');
\$s->set('name', 'authenticated_user_access')->save();
"
```

### Scope configurado

- **ID**: `authenticated_user_access`
- **name**: `authenticated_user_access` (igual que el ID — ver bug arriba)
- **Granularidad**: Rol `authenticated`
- **grant_types habilitados**: `authorization_code`, `refresh_token`, `password`, `shine_learner` (exportado en `simple_oauth.oauth2_scope.authenticated_user_access.yml`; si falta uno, ese grant da `invalid_scope`). Cada grant necesita un tipo de esquema `grant_type.{id}` (el de `shine_learner` está en `shine_account.schema.yml`)

### Claves RSA

- Dentro del contenedor DDEV: `/var/www/html/private/oauth-keys/private.key` y `public.key`
- Re-generar con:
  ```bash
  ddev exec "openssl genrsa -out /var/www/html/private/oauth-keys/private.key 2048"
  ddev exec "openssl rsa -in /var/www/html/private/oauth-keys/private.key -pubout > /var/www/html/private/oauth-keys/public.key"
  ```

### Añadir redirect URI al consumer (desarrollo)

```bash
ddev drush php-eval "
\$consumers = \Drupal\consumers\Entity\Consumer::loadMultiple();
foreach (\$consumers as \$c) {
  if (\$c->get('client_id')->value === 'shine_expo_app') {
    \$uris = \$c->get('redirect')->getValue();
    \$uris[] = ['value' => 'TU_URI_AQUI'];
    \$c->set('redirect', \$uris)->save();
    echo 'OK';
  }
}
"
```

---

## Expo App — Puntos clave

### expo-secure-store no funciona en web

`expo-secure-store` lanza error en web. Usar el wrapper en `src/lib/storage.ts`:
```typescript
// usa SecureStore en móvil, localStorage en web
import { getItem, setItem, deleteItem } from '@/lib/storage';
```
**Nunca importar expo-secure-store directamente** en código compartido móvil/web.

### Expo SDK y Expo Go

- **SDK 54** → compatible con Expo Go actual en App Store.
- **SDK 55** → requiere development build (Expo Go dice "incompatible").
- Si se quiere SDK 55: `eas build --platform ios --profile development`.

### Instalación desde cero

```bash
nvm use 21
npm install --legacy-peer-deps
npx expo install --fix   # ajusta versiones exactas para el SDK
npm run web              # o npm start para móvil
```

### Dependencias que hay que instalar manualmente

Estas no están en `package.json` porque no se puede ejecutar expo install desde Claude (Node 16 del sistema vs Node 21 de nvm):

```bash
# Web support (ya instalado si npm install funcionó)
npx expo install react-dom react-native-web @expo/metro-runtime

# Fase 6 — gráficas
npx expo install victory-native react-native-svg

# Fase 7 — audio
npx expo install expo-av
```

### Formatos de actividad reales (field_activity_format)

| Valor | Descripción | Player |
|---|---|---|
| `blink` | Auto-avance cada `field_seconds` segundos | `VerticalTextPlayer` |
| `vertical_list` | Tap para avanzar, animación slide | `VerticalTextPlayer` |
| `audio_reading` | Lectura en voz alta con cronómetro | `AudioReadingPlayer` |

Tipos con node type propio (sin `field_activity_format`): `activity_blink` → `VerticalTextPlayer`;
`activity_image_position` → `ImageGroupPlayer`; FASE 13: `activity_letter_matrix` → `LetterMatrixPlayer`,
`activity_syllable_order` → `SyllableOrderPlayer`, `activity_word_split` → `WordSplitPlayer`; FASE 16:
`activity_rapid_repetition` → `RapidRepetitionPlayer` (sin aciertos ni errores: la métrica es el ritmo); FASE 20:
`activity_rule_sequence` → `RuleSequencePlayer` (secuencia con regla, tipo CPT; el kind define `elapsed` porque
`time` de cada entrada es el tiempo de reacción). Registro en
`src/lib/activityKinds/index.ts`; detalle en `docs/activity-system.md`.

### Doble token: titular y alumno (FASE 17, subplan 05)

La app tiene dos identidades (docs/monetization.md §5.3). `src/lib/api/client.ts`:
- **Titular** (`actor: 'holder'`): tokens del grant `password` en `shine_access_token` /
  `shine_refresh_token`. Solo para `/shine/me`, `/shine/learners*`, `/shine/account/*` y
  `/oauth/token`. 401 → refresh y un reintento.
- **Alumno** (`actor: 'learner'`, **por defecto** en `apiFetch`): token del grant `shine_learner`
  (12 h, sin refresh) en `shine_learner_token` + `shine_learner_uuid`. Todo lo que es actividades,
  sesiones, tracking, feedback, estadísticas, mensajes y `field_dyslexic_font` va con él. 401 →
  `requestLearnerToken()` con el del titular (renovándolo si hace falta) y un reintento; una sola
  renovación en vuelo. Sin alumno activo, `NoActiveLearnerError`: **nunca** se cae al token del
  titular. Lógica en `tokenFlow.ts` (pura, testeada); `shineFetch()` para `/shine/*` (JSON plano).
- 402 de `session/generate` → `PaymentRequiredError` (`reason`, `completedRegular`,
  `freeRegularSessions`, `holderStatus`); `generateErrorCopy(e, { learnerName })` lo traduce a un
  texto neutro (sin "pago", "bloqueado" ni "error"; el paywall es de 08).

`src/store/auth.ts`: `holder` (userinfo del titular), `me` (`GET /shine/me`), `activeLearner` y
**`user` = identidad activa (el alumno)**: su `sub` es el UUID de los filtros `uid.id`, así que
las pantallas de siempre no cambian. `selectLearner(uuid)` pide el token, persiste la elección y
carga la fuente del alumno; `refreshMe()`; `clearLearner()`; `logout` borra los dos tokens;
`initialize` restaura el alumno guardado (token caducado → se renueva en silencio; alumno
archivado o ajeno → se olvida). Guard de arranque en `app/_layout.tsx` con
`decideStartRoute()` (`src/lib/startRoute.ts`): sin sesión → login; sin alumnos →
`/(auth)/learners/new`; un alumno (no en pausa) → se elige solo; varios → `/(auth)/learners/select`;
con alumno activo → dashboard. Avatares: set fijo de emojis en `src/lib/avatars.ts`
(`field_avatar` = clave); componente `Avatar` en `src/components/ui`. El avatar de la cabecera del
dashboard abre el selector; el engranaje, Ajustes. Gestión de alumnos (06): Ajustes → "Alumnos" →
ficha `learners/[uuid]` con acciones según `role` (`learnerActions`: owner edita, invita y archiva;
guardian/staff solo "Dejar de trabajar"), confirmación en línea (`ConfirmPanel`, nunca `Alert`),
invitación con QR (`react-native-qrcode-svg`, codifica `Linking.createURL('/learners/join?code=')`)
y "Compartir" (hoja nativa; en web, copiar al portapapeles). Los textos de estas pantallas viven
en objetos `*_COPY` de `src/lib/learnerScreens.ts` (listos para traducir). El guard deja ir a
Ajustes y a "Tengo un código" sin alumno activo.

> Cuentas anteriores a la FASE 17 que jugaban como titular (p. ej. `jose@test.com`): al entrar
> la app les pide crear su primer alumno; sus sesiones antiguas quedan en el titular y no se ven.

### field_text — formato HTML

`field_text` devuelve array de `{ value: "<p>CA SA</p>", processed: "<p>CA SA</p>" }`.
Usar `stripHtml()` de `src/lib/stripHtml.ts` para obtener texto plano.

---

## JSON:API — Puntos clave

### Headers siempre requeridos

```
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json
Authorization: Bearer {access_token}
```

### Entidades expuestas

- `GET /jsonapi/node/activity` — actividades (`field_activity_format`, `field_text`, `field_seconds`)
- `GET /jsonapi/node/session?include=field_activities` — sesiones
- `GET /jsonapi/node/group_session` — grupos de sesiones
- `GET /jsonapi/activity_message/explanation_message` — requiere auth
- `GET /jsonapi/activity_message/motivation_message` — requiere auth
- `POST /jsonapi/activitylog/logverticaltext` — crear log
- `POST /jsonapi/activitysummary/summary_vertical_text` — crear resumen
- FASE 13: `GET /jsonapi/node/activity_letter_matrix/{uuid}`, `GET /jsonapi/node/activity_syllable_order/{uuid}?include=field_items,field_items.field_image,field_items.field_image.field_media_image`, `GET /jsonapi/node/activity_word_split/{uuid}`; tracking en `/jsonapi/activitylog/{loglettermatrix|logsyllableorder|logwordsplit}` y `/jsonapi/activitysummary/{summary_letter_matrix|summary_syllable_order|summary_word_split}`
- FASE 16: `GET /jsonapi/node/activity_rapid_repetition/{uuid}` (`field_words[]`, `field_time_limit`); tracking en `/jsonapi/activitylog/lograpidrepetition` y `/jsonapi/activitysummary/summary_rapid_repetition` (`field_repetitions`; **sin** `field_correct_count` ni `field_items_count`, para no activar el freno por aciertos del evaluador)
- FASE 20: `GET /jsonapi/node/activity_rule_sequence/{uuid}` (`field_elements[]`, `field_rule_params`, `field_target_cells`, `field_lure_cells`, `field_stimulus_ms`, `field_gap_ms`, `field_practice`); tracking en `/jsonapi/activitylog/logrulesequence` (`field_response`) y `/jsonapi/activitysummary/summary_rule_sequence` (con `field_lures_count`, el evaluador usa tasa de aciertos − tasa de falsas alarmas)
- `GET /jsonapi/activitysummary/summary_vertical_text?filter[uid.id]={uuid}` — mis resúmenes
- `POST /jsonapi/sessionfeedback/sessionfeedback` — auto-evaluación de fin de sesión
- `GET /jsonapi/sessionfeedback/sessionfeedback?filter[uid.id]={uuid}&include=easiest_activity.field_main_area,...` — mis auto-evaluaciones con las áreas de cada actividad
- `POST /jsonapi/activityfeedback/activityfeedback` — valoración "¿Cómo ha ido?" (`rating`: `easy`|`ok`|`hard`) tras cada actividad de una sesión de ajuste; relaciones `session` y `activity` (FASE 15). Solo se puede referenciar una sesión propia (node grants, gotcha 17)
- `GET /jsonapi/activityfeedback/activityfeedback?filter[session.id]={uuid}` — valoraciones de una sesión (también `filter[uid.id]`)
- `GET /jsonapi/userarealevel/userarealevel?filter[uid.id]={uuid}&include=area,level` — mi nivel por área (FASE 15; solo lectura, lo escribe el servidor). `GET /jsonapi/userarealevel_log/userarealevel_log?filter[uid.id]={uuid}` — mi histórico de cambios
- `GET /jsonapi/taxonomy_term/areas` — las áreas de trabajo (vértices del gráfico radial); lectura con `access content`
- `GET /jsonapi/taxonomy_term/activity_cycle` — ciclos obligatorios (FASE 15, hoy solo "Sílabas", término de contenido que crea `scripts/create-cycle-term.php` en cada entorno; traducido "Síl·labes"); lectura con `access content`. Las actividades lo referencian con `field_cycle` + `field_cycle_weight`
- `GET /jsonapi/taxonomy_term/sonority` y `GET /jsonapi/taxonomy_term/decoding_effort`: categorización fonológica (dos niveles: grupo y término concreto). Términos de contenido, se crean con `scripts/create-phonology-terms.php`. `activity` y `activity_blink` los referencian con `field_sonority` y `field_decoding_effort` (múltiples, solo términos de segundo nivel); por grupo: `filter[field_sonority.parent.name]=Oposición sorda/sonora`. Detalle en `docs/exercise-catalog.md` §3.5
- `node/session` (FASE 15) añade `field_session_kind` (`regular`|`evaluation`), `field_evaluation_scope`, `field_evaluation_reason`, `field_evaluation_seq`; `sessionfeedback` añade `overall` (`easy`|`ok`|`hard`); `user` añade `field_onboarding_state` (`evaluating`|`regular`)
- FASE 17 (`shine_account`): `user` añade `field_account_kind` (`holder`|`learner`), `field_adult_consent`, `field_adult_consent_at`, `field_archived_at`, `field_avatar`; `node/session` añade `field_operated_by` (ref a user, el titular que generó la sesión). Solo los escribe el servidor (PATCH → 403), salvo `field_avatar` y `field_adult_consent` al registrarse. Detalle en `docs/api-design.md` ("Campos de cuenta"). FASE 17e (`shine_org`, 10): `user` añade `field_organization` (plaza), `field_released_by` y `field_released_at`; `entitlement` añade `field_organization` (licencia). Solo servidor. `GET /jsonapi/organization/organization`, `organization_membership/organization_membership` y `organization_invite/organization_invite`: solo lectura de lo propio
- `GET /jsonapi/learner_access/learner_access` (FASE 17): accesos adulto→alumno del titular autenticado (`field_holder` es la clave `owner`; solo lectura, 403 al escribir). `filter[field_learner.id]` devuelve vacío para un titular normal (el alumno es otro usuario y `authenticated` no tiene `access user profiles`); la app usa `/shine/learners`

### Filtros útiles para estadísticas

```
?filter[uid.id]={user-uuid}
&filter[field_activityid.id]={activity-uuid}
&filter[field_sessionid.id]={session-uuid}
&sort=created
&page[limit]=50
```

### Permisos JSON:API (rol `authenticated`)

- `create activitylog entities`
- `view own activitylog entities`
- `create activitysummary entities`
- `view own activitysummary entities`
- `create sessionfeedback entities`
- `view own sessionfeedback entities`
- `create activityfeedback entities`
- `view own activityfeedback entities`
- `view own userarealevel entities`
- `view own userarealevel_log entities`
- `view activity_message`
- `access content`

### Acceso implementado mediante hooks

Los módulos `activitylog`, `activitysummary`, `sessionfeedback` y `activityfeedback` tienen implementados en sus `.module`:
- `hook_activitylog_access()` / `hook_activitysummary_access()` — permite `view own`
- `hook_activitylog_create_access()` / `hook_activitysummary_create_access()` — permite `create`

---

## Idiomas (FASE 18, multiidioma)

Desde el 2026-10-26 el sitio tiene dos idiomas de contenido: **`es`** (por defecto, sin prefijo de URL)
y **`ca`** (prefijo `/ca`). `en` sigue instalado solo porque toda la configuración lleva
`langcode: en` (756 ficheros); no se negocia (prefijo `/en`) y no tiene contenido. Modelo completo en
`plans/multiidioma/analisis.md`; plan de ejecución en `plans/multiidioma/README.md`.

- **Alumno**: su idioma de trabajo es `preferred_langcode` (`es` | `ca`). Se elige en el alta
  (`POST /shine/learners {langcode}`; ausente = `es`) y se cambia con `PATCH` (solo `owner`): el cambio
  **reinicia el progreso** en una transacción (`LearnerManager::setLanguage()` →
  `hook_shine_learner_language_change()` → `LevelReset::resetForLanguageChange()`: niveles a Level0 con
  razón `language_change`, logs, resúmenes y valoraciones borrados, sesiones despublicadas) y la
  respuesta lleva `reset: true`. Guardar el usuario revoca su token (gotcha 20). Dos idiomas = dos
  perfiles del mismo niño.
- **Actividades y sesiones**: nodos de un solo idioma (`langcode` del nodo), **nunca traducciones**.
  `LevelLadder::contentQuery(area, nivel, langcode)` y `languageOf(cuenta)` son la única definición
  de "qué contenido hay": generador, techo por contenido, ciclo (`nextOfCycle`) y cobertura filtran
  por el idioma del alumno; `SessionGenerator::create()` fija el `langcode` de la sesión.
  `drush shine-level:generate {uid} --dry-run` imprime `langcode` y "Idioma: xx." en la explicación.
- **Traducidos con `content_translation`** (mismo uuid en los dos idiomas): términos de `areas` y
  `activity_cycle` y los `activity_message`. JSON:API devuelve la traducción según el prefijo:
  `GET /jsonapi/taxonomy_term/areas` (es) frente a `GET /ca/jsonapi/taxonomy_term/areas` (ca). Los
  nombres catalanes son los del experto (`plans/multiidioma/estructura-ca.md`, apartado 1); los
  textos catalanes de los mensajes son los del experto (2026-10-27). La app solo muestra los de
  motivación (`description`); al empezar enseña la instrucción de la actividad, no el mensaje de explicación.
- **Ajustes por bundle** (`language.content_settings.*`, en `config/sync`): todo con idioma por
  defecto `es` y `language_alterable: true`; traducción habilitada solo en `taxonomy_term.areas`,
  `taxonomy_term.activity_cycle`, `activity_message.explanation_message` y
  `activity_message.motivation_message`.
- **Scripts** (`shine/scripts/`, contenido, por entorno): `migrate-langcode-en-to-es.php` (migración
  única del contenido anterior: toda tabla con columna `langcode` más `preferred_langcode`; idempotente,
  la segunda pasada dice "sin cambios") y `translate-interface-terms.php` (traducción `ca` de áreas,
  ciclo y mensajes; idempotente; avisa si falta el original, hoy el ciclo "Sílabas" no existe en
  local). Orden en un entorno nuevo: `drush cim`, migración si había contenido `en`, traducciones.
- **Pruebas**: `jose@test.com` tiene una cortesía familiar y dos alumnos, Marta (`es`) y Pau (`ca`);
  el `ca` recibe `422 no_content` hasta que haya contenido catalán (subplan 02 y 05). Los kernel
  tests de idioma están en `shine_level/tests/src/Kernel/LanguageTest.php` y en
  `LearnerEndpointsTest::testLearnerLanguage()` (módulo de prueba `shine_account_test`).
- **Lotes y catálogo (subplan 02, 2026-10-26)**: todo registro lleva `idioma` (es | ca) o `idiomas`
  ([es, ca]: un nodo por idioma con el mismo material; título, instrucción, etiquetas fonológicas y
  `nombre` de las imágenes admiten un objeto por idioma, `Localizer`). Códigos `TIPO-XX-Lnn-AREA-nnn`
  (`BLK-CA-L00-VEL-001`); huella sha256(tipo, idioma, material); duplicados, sobreuso, inventario
  (`--lang`) y cobertura por idioma. Términos fonológicos por idioma con
  `scripts/create-phonology-terms.php -- es|ca` (datos en `scripts/phonology-terms.{es,ca}.json`;
  los catalanes los definió el experto, `plans/multiidioma/estructura-ca.md`). Banco de imágenes:
  `drush shine-content:import-images` crea los 432 media con name y alt = slug (clave `imagen` de
  los lotes); handler `ImagePositionActivityHandler` (prefijo IMG, paragraphs i1 e i1_item). Lote
  de ejemplo bilingüe en `content/fase18-ejemplos-v1.json`. Detalle en `docs/exercise-catalog.md`
  (3.4, 3.5, 4.3, 4.4, 5.4).
- **App (subplan 03, 2026-10-26)**: ningún texto visible en el código. Catálogos
  `shine-app/src/locales/{es,ca}.json` (mismas claves, lo comprueba `i18n.test.ts`) con `ui.*`
  (tutor) y `player.*` (niño); `t('ui.dashboard...')` de `src/lib/i18n.ts` con claves tipadas
  desde es.json, plurales con `count`, `dateLocale()`, `formatDecimal()`, `formatDayMonth()`.
  Nada calculado al cargar un módulo (el idioma cambia en caliente; el layout raíz usa el idioma
  como `key` de la pila). Convención en `docs/conventions.md` §3. El título del nodo de sesión va en el idioma del alumno
  (`SessionGenerator::TITLES`). Textos nativos y de tienda en `shine-app/native-locales/`.
  La traducción catalana es provisional (revisión nativa pendiente, lista en `docs/progress.md`).
- **App, idioma del alumno (subplan 04, 2026-10-26)**: la app habla el idioma del alumno activo
  (suscripción al final de `src/store/auth.ts`; sin alumno, el del dispositivo; alumno sin
  `langcode` = es). Alta con selector de idioma obligatorio (`LanguagePicker`, preseleccionado el
  de la app); ficha con "Idioma: ..." y "Cambiar idioma" (solo owner, `ConfirmPanel` con "Crear
  otro perfil"): `PATCH {langcode}` reinicia en el servidor, luego `refreshMe()` y
  `selectLearner(uuid, { freshToken: true })` (el token anterior queda revocado) y al inicio.
  Etiqueta ES/CA (`LanguageTag`) en el selector y en Ajustes solo si hay alumnos en los dos
  idiomas. `apiFetch(..., { lang })` → `API_BASE/ca/jsonapi` para áreas y mensajes (caché por
  idioma en `areas.ts` y `messages.ts`). La sesión cargada se compara con el alumno
  (`sessionPlayerLocale`): si no coincide, aviso en consola y `player.*` en el idioma de la sesión.
- **Contenido catalán (subplan 05, 2026-10-26)**: documentos `docs/generador/Taxonomía fonológica
  (català).md` y `Guía de Parametrización (català).md`, catálogo con el catalán en cada sección,
  manifiesto del banco con el bloque `ca` por imagen (fuente única del nombre catalán; `usable`
  false = no se usa en catalán), ciclo "Sílabas" creado por `scripts/create-cycle-term.php`, y los
  primeros lotes en `shine/content/` (matriz y posición de imágenes bilingües con `idiomas`;
  parpadeo, ciclo Síl·labes (44), sílabas, repetición y segmentación catalanes) generados con
  `shine/content/generadores/*.py` (semilla) o a mano según los prompts de
  `plans/multiidioma/prompts-contenido/`. Publicados en local como contenido de prueba; la revisión
  del experto va en `plans/multiidioma/revisio-lots-ca.md` y nada se publica en producción sin ella.
  Los handlers de segmentación y repetición admiten las letras catalanas (ç, à, è, ò, ï, l·l, apóstrofo).
- **Verificación bilingüe (subplan 06, 2026-10-27)**: recorrido completo por la API como usuario
  normal (token del titular + token de alumno) con Marta (`es`) y Pau (`ca`): bloque inicial,
  regular, auto-evaluación, estadísticas, cambio de idioma con reinicio, lotes bilingües y con
  error, inventario y cobertura por idioma; en Expo web, dashboard, estadísticas, Ajustes y una
  sesión regular entera jugada en catalán. Kernel tests de los cuatro módulos custom en verde
  (`shine_entitlement` necesitaba `installLanguages()` en su harness desde la FASE 18). Pendiente:
  Expo Go en dispositivo real. Para repetir el recorrido: `python3 private/scripts/drive_api.py
  status|session|stats {Marta|Pau}` y `private/scripts/langchange.py` (scripts locales, gitignored).
- **Bloque inicial y áreas sin contenido** (corregido en 06): un área abierta que no se puede
  probar (sin actividades en su nivel de prueba ni por debajo, en el idioma del alumno) cuenta
  como cerrada al terminar el bloque; antes, con Funciones Ejecutivas vacía, el bloque nunca
  terminaba y `session/generate` daba `422 no_content` para siempre en los dos idiomas
  (`docs/level-system.md` §5.1). `scripts/migrate-langcode-en-to-es.php` ya no toca `search_*`
  (índice derivado; chocaba con la clave primaria en la segunda pasada).

---

## Módulos custom

| Módulo | Función |
|---|---|
| `activity_message` | Entidad `activity_message` (bundles: `explanation_message`, `motivation_message`) |
| `activitylog` | Entidad `activitylog` (bundles: `logverticaltext`, `log3_textlistblink`, `logimageposition`; FASE 13: `loglettermatrix`, `logsyllableorder`, `logwordsplit`; FASE 16: `lograpidrepetition`) |
| `activitysummary` | Entidad `activitysummary` (bundles: `summary_vertical_text`, `summary3_vertical_text_blink`, `summary_image_position`; FASE 13: `summary_letter_matrix`, `summary_syllable_order`, `summary_word_split`; FASE 16: `summary_rapid_repetition`). Implementa `hook_jsonapi_ENTITY_TYPE_filter_access()` (gotcha 16) |
| `shine_oauth` | Reescribe el claim `sub` de OIDC al UUID del usuario (gotcha 15). Imprescindible: sin él la app no encuentra sus propios datos. Desde FASE 14 también `hook_user_format_name_alter()`: el display name del usuario es `field_display_name` (el username es el email) |
| `sessionfeedback` | Entidad `sessionfeedback` (sin bundles, campos de código): auto-evaluación de fin de sesión. Alimenta el mapa de áreas (gráfico radial) de "Mi progreso". Implementa `hook_jsonapi_ENTITY_TYPE_filter_access()` (gotcha 16) |
| `activityfeedback` | Entidad `activityfeedback` (sin bundles, campos de código, calcada de `sessionfeedback`): valoración `easy`/`ok`/`hard` por actividad en sesiones de ajuste (FASE 15). Dato crudo para las reglas de nivel; `preSave` rechaza un `rating` fuera de la lista. Implementa `hook_jsonapi_ENTITY_TYPE_filter_access()` (gotcha 16) |
| `shine_session_access` | Node grants para `node.session` (FASE 15): realm `shine_session_owner`, gid = uid. Cada usuario ve solo sus sesiones, también en colecciones JSON:API y Views; `bypass node access` lo ve todo. Reconstruye `node_access` al instalarse (gotcha 17) |
| `shine_level` | Sistema de niveles (FASE 15): entidades `userarealevel` (nivel vigente por usuario y área, índice único uid+area) y `userarealevel_log` (histórico inmutable), servicios `shine_level.level_repository` (`getForUser`, `logChange`) y `shine_level.level_ladder` (orden de `activity_level` por peso y nombre natural; `hasContent` = techo por contenido), config `shine_level.settings` (§8) con formulario en `/admin/config/shine/level`, y `hook_entity_field_access` que impide al usuario editar `field_onboarding_state`. `shine_level.level_reset` (`LevelReset`, "Reiniciar niveles", subplan 08), vistas de administración en `/admin/shine/*` y pestaña `/user/{uid}/levels`, `shine_level.evaluator` (`SessionEvaluator`, reglas §5 y `POST /shine/session/{uuid}/complete`) y `shine_level.session_generator` (`SessionGenerator`, árbol §6 y ciclos §7, `POST /shine/session/generate`, drush `shine-level:generate`). FASE 17 (04): `SessionGateInterface` + colector `shine_level.session_gates` (etiqueta `shine_level.session_gate`) que el generador consulta entre `plan()` y `create()` y cuya denegación es `SessionGatedException` → 402; parámetros `free_regular_sessions` (8) y `pending_max_days` (7, pendiente caducada despublicada en `pendingSession()`); `sessionQuery()` y `countCompletedSessions()` solo miran sesiones publicadas. FASE 18 (06): `SessionEvaluator::probeable()` (un área abierta sin contenido cuenta como cerrada al terminar el bloque inicial) y sesión de confirmación en `planInitial()` cuando ninguna área abierta tiene actividades. 2026-10-29: `planRegular()` solo rota las áreas con actividades en su nivel o por debajo (`hasContentUpTo()`) y un hueco sin candidatas pasa a la siguiente área (antes se perdía). Tests: `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_level` |
| `shine_content` | Importación de lotes de actividades generadas (`docs/exercise-catalog.md` §4): `drush shine-content:import {lote.json} [--dry-run] [--publish]`. Valida el lote entero (con un error no escribe nada), resuelve áreas, niveles, ciclos, explicación, sonoridad y esfuerzo por nombre, crea o actualiza por `field_activity_code` (contenido congelado si ya hay summaries), crea sin publicar y al final imprime la cobertura área × nivel. Un handler por tipo (`ActivityHandlerInterface`, tag `shine_content_handler`): `activity_blink`, los tres de la FASE 13, `activity_rapid_repetition` (FASE 16; `requiresPhonologyTags()` = TRUE: exige `sonoridad` o `esfuerzo`), `activity_image_position` (FASE 18) y, desde el 2026-10-27, `activity` (`TextActivityHandler`: lista de texto `vertical_list` con prefijo LIS y lectura en voz alta `audio_reading` con prefijo LEC (un solo párrafo de 35 a 80 palabras en todos los niveles, decisión E10 del 2026-10-28), decidido por `contenido.formato`; `ContentPrefixInterface` para que el prefijo dependa del contenido). Desde el 2026-10-21, **huella de contenido**: `field_content_hash` (sha256 de tipo + forma canónica del material, en los 7 bundles de actividad, escrito en `hook_node_presave`, servicio `shine_content.fingerprint`), detección de duplicados al importar (misma huella con otro código u 80 % de solapamiento de unidades = error; 50 % o unidad en 3+ actividades del mismo tipo y nivel = aviso), `drush shine-content:inventory` (lista de exclusión del generador: actividades en formato de lote con hash y unidades, siguiente código libre por prefijo, uso de unidades) y `drush shine-content:rehash`. Un handler nuevo debe implementar también `extractContent`, `canonicalContent` y `units`. Lotes en `shine/content/`. FASE 18 (2026-10-26): idioma en el registro (`idioma` / `idiomas`, `Localizer`), códigos y huella con idioma, términos fonológicos del idioma del nodo (`TermResolver` por idioma), cobertura e inventario por idioma (`--lang`), `drush shine-content:import-images` (`ImageBankImporter`: media del banco con name = slug) y `ImagePositionActivityHandler` (prefijo IMG, paragraphs i1 e i1_item, bilingüe). FASE 19 (2026-10-29): matriz con regla, clave `regla` del lote validada y clasificada por `MatrixRule` (objetivos y cebos por ronda en `field_target_cells` / `field_lure_cells`, catálogo 6.1). FASE 20 (2026-10-29): secuencia con regla, `RuleSequenceActivityHandler` (prefijo SEQ) y `SequenceRule` (catálogo 6.5). Tests: `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_content` |
| `shine_account` | Modelo de cuentas de la FASE 17 (`docs/monetization.md` §3, `plans/entitlement/`). **01a**: campos de cuenta en `user` (`field_account_kind`, `field_adult_consent` + `field_adult_consent_at` que fija `hook_user_presave`, `field_archived_at`, `field_avatar`) y `field_operated_by` en `node.session` (config en `config/sync`); restricción `ShineAdultConsent` (consentimiento obligatorio solo en el registro anónimo); `hook_entity_field_access` que deja esos campos solo al servidor/admin (`administer users`) y `field_adult_consent` solo editable en cuentas nuevas; rol `learner` sin permisos; `hook_mail_alter` que anula el correo a `@shine.invalid` (emails sintéticos de alumnos y cuentas borradas); `shine_account_update_11001` reclasifica a los usuarios existentes como `holder`. **01b**: entidad `learner_access` (alumno, titular, `field_role` owner/guardian/staff, `field_origin`, `status`; índice único por pareja, `field_holder` es la clave `owner`, `hook_jsonapi_learner_access_filter_access`), `LearnerAccessPolicy` (`shine_account.learner_access_policy`: única fuente de "quién puede qué"), `LearnerManager` (`shine_account.learner_manager`: alta con transacción y lock, `grantAccess` crea o reactiva, listado, edición, archivo con revocación de tokens, retirada de acceso, cupo y forma JSON), `LearnerQuotaInterface` (`shine_account.learner_quota`, 1 por defecto; 04 lo sustituye), `TokenRevoker`, `AccountDeleter` (`shine_account.account_deleter`: anonimización en transacción, regla de alumnos compartidos, etiquetas de acceso regeneradas), access check `_shine_holder` (`HolderAccessCheck`), controladores de `/shine/learners*`, `/shine/me` (con `hook_shine_me_alter`, ver `shine_account.api.php`) y `/shine/account/delete` (contraseña + `flood`), permiso `administer shine accounts`, vista `shine_learners` (`/admin/shine/learners`), `shine_account_update_11002` instala la entidad. **01c**: entidad `learner_invite` (alumno, creador = clave `owner`, `field_code_hash` HMAC con `hash_salt` y oculto por `hook_entity_field_access`, caducidad, usada por/cuándo, `status`; índice único por hash), `LearnerInviteRepository` (`shine_account.learner_invite_repository`: alfabeto, normalizar, hash, viva por alumno, anular) y `LearnerInviteManager` (`shine_account.learner_invite_manager`: `create` anula la anterior, `redeem` concede `guardian`/`invite` y gasta el código), config `shine_account.settings` (`invite_ttl_days`, límites de `flood`), rutas `invite`/`join`, `shine_account_update_11003`. **02**: grant OAuth `shine_learner` (plugin `Oauth2Grant` + `OAuth\LearnerGrant`: token de alumno de 12 h sin refresh para un titular con acceso activo, validando su Bearer con el resource server), `LearnerTokenContext` + `hook_simple_oauth_private_claims_alter` (claim `operated_by`), `CurrentOperator` (`shine_account.current_operator`) + `hook_node_presave` (`field_operated_by` en sesiones nuevas de alumnos), esquema `grant_type.shine_learner`, y `hook_entity_field_access` que impide al alumno editar su `field_display_name` y `field_avatar` con su token. Tests: `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_account` |
| `shine_entitlement` | Acceso de pago de la FASE 17 (`docs/monetization.md` §4, `plans/entitlement/03`). Entidad `entitlement` (titular = clave `owner`, `field_catalog_plan` → catálogo, plan, origen, estado, fechas, asientos, cupo copiado del catálogo si viene vacío, id externo único por origen con índice + restricción `ShineEntitlementExternalIdUnique`, rastro de webhooks visible solo a admins); config entity `shine_entitlement_plan` (catálogo: `free`, `family`, `professional`, `school_classroom`); servicio `shine_entitlement.plan_catalog` (`resolveExternal` lanza `UnknownExternalPlanException`); `shine_entitlement.max_learners_recalculator` + drush `shine-entitlement:recalc`; formulario de cortesías (origen `manual`), vista `shine_entitlements`, pestaña "Acceso" del perfil, permisos `administer shine entitlements` y `view own entitlement entities` (lo tiene `authenticated`). Depende de `shine_account` y `shine_level`. **04**: `shine_entitlement.access` (`EntitlementAccess`, `src/Access/`: `holderStatus`, `coveredBy`, `canGenerateRegular`, `maxLearners`, `canCreateLearner`; objetos de valor `HolderStatus`, `Coverage`, `AccessDecision`; caché por usuario con etiquetas), `EntitlementGate` (puerta `shine_level.session_gate`, solo rama `regular` → 402), `EntitlementLearnerQuota` (decora `shine_account.learner_quota`), hueco `OrganizationCoverageInterface` (`shine_entitlement.organization_coverage`, lo rellena 10), `hook_shine_me_alter` (`holder_status`) y `hook_shine_learner_alter` (`covered_by`, `paused`, `blocked_reason`, `completed_regular`, `free_regular_sessions`). **07**: `POST /shine/webhooks/revenuecat` (`RevenueCatWebhookController`: secreto en `settings.php` comparado con `hash_equals`) y `shine_entitlement.revenuecat_processor` (`RevenueCat\RevenueCatProcessor`: titular por `app_user_id`/`aliases`, entitlement por (`store`, `original_transaction_id`), máquina de estados de §6.1, idempotencia por `field_last_event_id` y `field_event_timestamp`, `TRANSFER` entre titulares, transacción e invalidación de caché), `WebhookResult`, `SubscriberRefreshInterface` + `NullSubscriberRefresh` (refresco contra la API de RevenueCat, sin clave todavía; flag `shine_entitlement.settings: revenuecat_refresh`), fixtures reales en `tests/fixtures/revenuecat/`. Tests: `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_entitlement` |
| `shine_org` | Organizaciones de la FASE 17e (`docs/monetization.md` §3.4 y §5.6, `plans/entitlement/10`, 2026-10-29). Entidades `organization` (`field_org_kind` practice/school, `field_owner` = clave `owner`, `status`), `organization_membership` (organización, titular = `owner`, `field_role` coordinator/professional/teacher, `status`, índice único por pareja) y `organization_invite` (código de centro de 8 caracteres, HMAC en `field_code_hash` oculto por `hook_entity_field_access`, multiuso con `field_max_uses`/`field_uses`, caducidad); handlers de acceso y `hook_jsonapi_*_filter_access` en las tres (gotcha 16). Servicios: `shine_org.organizations` (`OrganizationManager`: membresías, `addMember`, forma JSON), `shine_org.invites` (`OrganizationInviteManager`: generar y canjear), `shine_org.coverage` (`OrganizationCoverage`, **decora** `shine_entitlement.organization_coverage`: licencia = entitlement con `field_organization` que cubre, plazas por orden de alta, `releasedBy` con ventana `released_notice_days`), `shine_org.learners` (accesos `staff`, alumnos del centro), `shine_org.roles` y `shine_org.placement` (decoran `shine_account.organization_roles` y `shine_account.learner_placement`: coordinador sin `learner_access` y alumno en plaza desde `POST /shine/learners`). `hook_entity_base_field_info` añade `field_organization` al entitlement (licencia, nunca plan personal: `EntitlementAccess::isOrganizationLicense()`); `hook_entitlement_presave` exige plan professional/school; `hook_organization_insert` hace coordinador al titular responsable; `hook_shine_me_alter` (`organizations[]`) y `hook_shine_learner_alter` (`organization`, `released_by`). Campos de usuario en `config/sync`: `field_organization`, `field_released_by`, `field_released_at` (solo servidor). Admin en `/admin/shine/organizations` (ficha con miembros, códigos, alumnos en plaza y licencias; "Conceder licencia" abre el formulario de entitlements con `?organization=`), permiso `administer shine organizations`; config `shine_org.settings`. Plan de catálogo nuevo `school_individual` (1 alumno por asiento). En `shine_account`: `LearnerAccessPolicy` gana `canSee`, `canRelease`, `effectiveRole` (`coordinator`), `LearnerManager::create()` acepta `organization` y `LearnerManager::release()`. Tests: `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_org` |
| `preprocess` | Hooks `preprocess_node` (inyecta mensaje motivación en plantillas Drupal acopladas) |

> `activitylog_register` (endpoint legacy `POST /activitylog-register/add`) fue
> **retirado en la FASE 9** el 2026-07-21: la app escribe por JSON:API y el
> endpoint tenía el bug B1. Ya no existe.

---

## Comandos útiles

```bash
# Estado general
ddev drush status

# Reconstruir cache
ddev drush cr

# Importar/exportar config
ddev drush cim -y
ddev drush cex -y

# Permisos
ddev drush role:perm:add authenticated "permission1,permission2"

# Ver módulos habilitados
ddev drush pm:list --status=enabled

# Habilitar módulo
ddev drush pm:enable nombre_modulo -y

# PHP eval (útil para debug)
ddev drush php-eval "echo Drupal::VERSION;"

# Acceder a la BD
ddev mysql

# Ver logs de error recientes
ddev drush watchdog:show --count=20 --severity=Error

# Sistema de niveles: qué sesión le tocaría a un usuario y por qué (sin crearla); al final
# dice si la puerta (muro de pago) la dejaría pasar y el cuerpo del 402 si no
ddev drush shine-level:generate {uid} --dry-run
# Avisos del generador (techo por contenido, huecos vacíos)
ddev drush watchdog:show --type=shine_level --count=20 --extended

# Entitlements: aplicar a lo ya vendido un cambio de cupo del catálogo (solo vivos)
ddev drush shine-entitlement:recalc --dry-run
ddev drush shine-entitlement:recalc --plan=family

# Importar un lote de actividades (ruta relativa al directorio actual; lotes en shine/content/)
ddev drush shine-content:import content/blink-level0-2-v1.json --dry-run   # solo valida (también duplicados)
ddev drush shine-content:import content/blink-level0-2-v1.json --publish   # importa y publica; cobertura por idioma al final

# Banco de imágenes (FASE 18): un media por entrada aceptada del manifiesto, name y alt = slug; idempotente
ddev drush shine-content:import-images content/images/manifest.json --dry-run
ddev drush shine-content:import-images content/images/manifest.json

# Qué hay ya en el catálogo (lista de exclusión del generador): tabla, o JSON con --json / --out; --lang=es|ca
ddev drush shine-content:inventory --lang=ca --type=activity_blink --level=Level0 --out=private/inventario-blink-l0-ca.json
# Recalcular la huella de contenido (tras cim en un entorno que ya tenía actividades, o si cambia la forma canónica)
ddev drush shine-content:rehash

# Idiomas (FASE 18): migrar contenido en → es (una vez, idempotente), crear el término del ciclo, traducir áreas,
# ciclo y mensajes al catalán y crear los términos fonológicos de cada idioma desde scripts/phonology-terms.{es,ca}.json
ddev drush php:script scripts/migrate-langcode-en-to-es.php
ddev drush php:script scripts/create-level-terms.php
ddev drush php:script scripts/create-cycle-term.php
ddev drush php:script scripts/translate-interface-terms.php
ddev drush php:script scripts/create-phonology-terms.php -- es
ddev drush php:script scripts/create-phonology-terms.php -- ca
```

### Administración del sistema de niveles (FASE 15, subplan 08) y de cuentas y acceso (FASE 17)

Las de niveles, con el permiso `administer shine level`; las de la FASE 17, con el que indica cada
fila. Las vistas están en `config/sync`:

| Ruta | Qué |
|---|---|
| `/admin/shine` | Menú "Shine" de la barra de administración |
| `/admin/shine/levels` | Vista `shine_levels`: nivel vigente por usuario y área (filtros usuario y área), enlace "ver histórico" por fila |
| `/admin/shine/levels/log[/{uid}[/{tid}]]` | Vista `shine_level_log`: cambios de nivel con razón y sesión (filtros usuario, área y razón) |
| `/admin/shine/sessions` | Vista `shine_sessions`: sesiones con dueño, tipo, razón, secuencia, creada, completada y publicada |
| `/user/{uid}/levels` | Pestaña "Niveles" del perfil: estado de onboarding y las dos vistas filtradas por el usuario. También con `view any userarealevel entities` + `view any userarealevel_log entities` (perfil terapeuta) |
| `/user/{uid}/levels/reset` | "Reiniciar niveles" (confirmación): vuelve al bloque inicial; log `reset` por área y pendientes despublicadas. Para probar el bloque inicial varias veces con el mismo usuario |
| `/admin/shine/learners` | Vista `shine_learners` (FASE 17, `shine_account`): alumnos con sus adultos, rol y origen. Permiso `administer shine accounts` |
| `/admin/shine/entitlements` | Vista `shine_entitlements` (FASE 17, `shine_entitlement`): acceso de pago por titular, con filtros por titular, tipo, origen y estado. Permiso `administer shine entitlements` |
| `/admin/shine/entitlements/add` | "Conceder una cortesía": entitlement de origen `manual` (tipo `courtesy` por defecto, plan del catálogo, asientos, fechas vacías = ahora / no caduca). `?holder={uid}` rellena el titular |
| `/user/{uid}/entitlements` | Pestaña "Acceso" del perfil: los entitlements del titular y el botón de cortesía |
| `/admin/config/shine/plans` | Catálogo de planes (`shine_entitlement.plan.*` en `config/sync`): cupo por asiento y productos/precios. `free` no se borra. Tras cambiar un cupo: `ddev drush shine-entitlement:recalc [--plan=ID] [--dry-run]` |
| `/admin/shine/organizations` | Organizaciones (FASE 17e, `shine_org`): lista y alta; ficha `/admin/shine/organizations/{id}` con miembros, códigos de centro (el código se muestra una sola vez al generarlo), alumnos en plaza y licencias. Colecciones `/admin/shine/organization-memberships` y `/admin/shine/organization-invites`. Permiso `administer shine organizations` |

---

## Gotchas conocidos

1. **`&` en curl dentro de ddev exec** → siempre usar `ddev exec bash -c 'curl -s "...?a=1&b=2"'`

2. **simple_oauth v6 no trae Password Grant de serie** → lo aporta el contrib `simple_oauth_password_grant`; hay que habilitar `password` tanto en el **consumer** (entidad de contenido, por entorno) como en el **scope** (config). Ver "Login y registro in-app"

3. **simple_oauth `invalid_scope`** → el campo `name` del scope entity debe ser igual al identifier OAuth (ver sección OAuth2 arriba)

4. **expo-secure-store en web** → lanza error. Usar `src/lib/storage.ts` como wrapper

5. **Claude Code usa Node 16 del sistema** → los comandos `npx expo install` fallan desde Claude. Ejecutar siempre en terminal del usuario con `nvm use 21`. Para `tsc`, lint y tests sí basta con cargar nvm en el mismo comando: `source ~/.nvm/nvm.sh && nvm use 21 && npx tsc --noEmit && npm run lint && npm test` (comprobado en FASE 15)

6. **Expo SDK 55 incompatible con Expo Go** → usar SDK 54 para desarrollo con Expo Go. SDK 55 requiere development build

7. **Renombrar bundles de entidades custom** → NO se puede con `drush cim`. Requiere actualizar BD + recrear bundle programáticamente

8. **Parches D8/D9/D10 en composer.json** → NO funcionan en D11. Eliminados el 2026-10-16 (no se aplicaba ninguno), junto con los paquetes privados de digitalbakers (`db/domain`, `db/lang_dropdown`, `db/rename_admin_paths`) y librerías huérfanas. Solo se usa el repo `packages.drupal.org`

9. **Módulo `devel` en system.schema sin estar instalado** → puede bloquear `pm:enable`. Limpiar con:
   ```php
   ddev drush php-eval "\Drupal::keyValue('system.schema')->delete('devel');"
   ddev drush php-eval "\$c = \Drupal::configFactory()->getEditable('core.extension'); \$m = \$c->get('module'); unset(\$m['devel']); \$c->set('module', \$m)->save();"
   ```

10. **Temas con `core_version_requirement: ^10`** → no cargan en D11. Actualizar a `^10 || ^11`.

11. **`drush core:requirements --severity=2`** → no funciona en Drush 13. Para ver solo errores: `ddev drush core:requirements --format=csv | grep ",Error,"`.

12. **`npm install` en shine-app** → siempre con `--legacy-peer-deps` por conflictos de peer deps de Expo.

13. **JSON:API POST a activitylog/activitysummary devuelve 422** → el campo `label` (base field) es **required** aunque no aparece en los campos `field_*`. Siempre incluirlo en `attributes`: `{ label: "...", field_item: ..., ... }`.

14. **Probar siempre con un usuario normal, NUNCA solo con el usuario 1** → el super usuario se salta las comprobaciones de permisos y de filtrado de JSON:API. Los dos bugs de los gotchas 15 y 16 estuvieron meses ocultos porque todo se probaba con el user 1. Para probar como otro usuario sin montar el flujo OAuth completo:
    ```bash
    ddev drush php-eval "
    \$s = \Drupal::service('account_switcher');
    \$s->switchTo(\Drupal\user\Entity\User::load(2));
    \$r = \Symfony\Component\HttpFoundation\Request::create('/jsonapi/...', 'GET');
    \$r->headers->set('Accept','application/vnd.api+json');
    \$res = \Drupal::service('http_kernel')->handle(\$r, \Symfony\Component\HttpKernel\HttpKernelInterface::SUB_REQUEST);
    echo \$res->getStatusCode() . PHP_EOL . \$res->getContent();
    \$s->switchBack();
    "
    ```

15. **`/oauth/userinfo` devuelve `sub` = uid entero, no UUID** → la app usa `user.sub` como UUID en `filter[uid.id]` y en `/jsonapi/user/user/{uuid}`. Lo corrige el módulo custom **`shine_oauth`** con `hook_simple_oauth_oidc_claims_alter()`. Si aparecen 404 al guardar ajustes del usuario o colecciones vacías, comprobar que está habilitado: `ddev drush pm:list --status=enabled --filter=shine`.

16. **Entidad custom en JSON:API: cualquier `filter[...]` devuelve 200 con `data: []`** → falta `hook_jsonapi_ENTITY_TYPE_filter_access()`. Sin él, JSON:API añade la condición imposible `id < 1 AND id > 1` a toda consulta filtrada (`TemporaryQueryGuard`), sin emitir ningún error. Solo se nota con usuarios normales (ver gotcha 14). Implementado en `activitysummary.module`; **pendiente en `activitylog`** y obligatorio en cada entidad nueva de la FASE 13. Patrón:
    ```php
    function MODULO_jsonapi_ENTIDAD_filter_access(EntityTypeInterface $entity_type, AccountInterface $account) {
      return [
        JsonApiFilter::AMONG_ALL => AccessResult::allowedIfHasPermission($account, 'view any ... entities'),
        JsonApiFilter::AMONG_OWN => AccessResult::allowedIfHasPermission($account, 'view own ... entities'),
      ];
    }
    ```

17. **Acceso por dueño a `node.session` = node grants, no `hook_node_access`** → para nodos, lo único que filtra a la vez el detalle y las colecciones (JSON:API, Views, entity queries) es `hook_node_grants` + `hook_node_access_records` (módulo `shine_session_access`, realm `shine_session_owner`, gid = uid, solo bundle `session` publicado). El gotcha 16 no aplica a nodos. Avisos:
    - Un usuario normal **solo ve las sesiones cuyo `uid` es el suyo**; las hechas a mano (uid 1) no salen en su dashboard. Reasignar: `$node->setOwnerId($uid)->save()` (los registros se recalculan al guardar).
    - Si `node_access` queda incompleta (p. ej. se importó el módulo sin que corriera `hook_modules_installed`), **todas las sesiones se ven con `access content`**. Reconstruir con `ddev drush php-eval '\Drupal::service(\Drupal\node\NodeAccessRebuild::class)->rebuild();'` o desde `/admin/reports/status`. `node_access_rebuild()` está deprecado desde 11.4.
    - El rebuild del módulo va en `hook_modules_installed`, no en `hook_install`: `node` marca "needs rebuild" después de `hook_install` y dejaría un aviso falso en el informe de estado.
    - Probar siempre con dos usuarios normales (A ve lo suyo, B recibe `data: []` y 403 en detalle); el user 1 tiene `bypass node access` y no detecta nada (gotcha 14).

18. **`updb`: "The installed version of the Block Content / Taxonomy module is too old to update"** → la BD saltó al upgrade a D11 sin ejecutar `block_content_update_10300` (índice en `block_content_field_data.reusable`) ni `taxonomy_update_10100` (rutas de revisión en la definición instalada de `taxonomy_term`). Corregido en la BD local el 2026-10-16 replicando ambas con las clases de D11 y fijando la versión con `\Drupal::service('update.update_hook_registry')->setInstalledVersion('block_content', 10300)` (`taxonomy` → 10100). Cualquier otra copia de la BD (producción, otro PC) arrastra lo mismo: comprobar con `getInstalledVersion()`. En la misma BD faltaba el registro `entity.storage_schema.sql` de `activity_message.field_activity_types` (error "Entity/field definitions"); con la tabla vacía se arregla con `\Drupal::entityDefinitionUpdateManager()->updateFieldStorageDefinition($def)`. El 2026-10-23 `drush updb` listaba como error "too old to update" a block_content, contact, editor, filter, media, node, system, taxonomy y views: no eran versiones de esquema, sino 15 **`post_update` eliminados en 11.0.0** que la BD nunca registró como ejecutados (`key_value` `post_update.existing_updates`; los detecta `SystemRequirementsHooks::checkRequirements('update')`). Como su efecto es config (manda `config/sync`) o datos de módulos vacíos, se registraron como hechos con `\Drupal::service('update.post_update_registry')->registerInvokedUpdates([...])` y el aviso desapareció. Receta para diagnosticar: comparar `getRemovedPostUpdates($module)` con `existing_updates`.

19. **Tipo de actividad nuevo → 422 en `sessionfeedback` / `activityfeedback`** → sus campos `easiest_activity`, `hardest_activity` y `activity` son campos base con `target_bundles` fijados en `ACTIVITY_BUNDLES` (`Sessionfeedback.php`, `Activityfeedback.php`). Añadir el bundle ahí y sincronizar la definición instalada con un `hook_update_N` (`updateFieldStorageDefinition`, ver `sessionfeedback_update_11002`) + `drush updb`. Los síntomas en la app: "No hemos podido guardarlo" en "¿Cuál te ha costado un poco más?" y en "¿Cómo ha ido?". Checklist completo en `docs/activity-system.md`. Los bundles de summary **sin** contadores de acierto (ritmo, FASE 16) son válidos: `SessionEvaluator::effectiveRating()` comprueba `hasField()` antes de aplicar el freno por aciertos.

20. **Guardar un usuario borra todos sus access tokens** → simple_oauth 6.1.1 implementa `hook_user_update` (`TokenExpiryTriggerHandler::handleUserUpdate`) y borra los `oauth2_token` del usuario en **cualquier** guardado, no solo al cambiar contraseña o roles; los refresh tokens se conservan. La app lo absorbe porque en un 401 hace refresh (`client.ts`), pero tras el `PATCH` de `field_dyslexic_font` o cuando `shine_level` mueve `field_onboarding_state` el token anterior ya no vale. Afecta a los tokens sin refresh (el token de alumno de la FASE 17): cualquier guardado del usuario alumno lo invalida. Al probar con curl, pedir token nuevo después de cada escritura sobre el usuario.

23. **YAML de config escrita a mano: importar antes de exportar** → `drush cex` hace que `config/sync` sea igual a la BD, así que **borra** cualquier YAML que aún no esté importada (una vista nueva escrita a mano, por ejemplo). Orden correcto: 1) si se ha habilitado un módulo con `drush en`, `drush cex` primero (para que `core.extension` lo incluya; si no, `cim` rechaza la YAML que depende del módulo); 2) escribir la YAML; 3) `drush cim -y`; 4) `drush cex -y` para normalizar (Views reordena claves). Pasó dos veces con `views.view.shine_entitlements` (subplan 03). Además, en Views la columna `operations` de una entidad custom solo existe si la entidad declara `list_builder` (si no, el handler sale `Broken` y la página da 500 en cuanto hay filas).

22. **Ids de plugin con `:`** → el gestor de plugins de Drupal trata `:` como separador de derivativas (`PluginBase::DERIVATIVE_SEPARATOR`): `createInstance('urn:shine:learner')` buscaría el plugin base `urn` con derivativa `shine:learner`. Como simple_oauth usa el id del plugin `Oauth2Grant` como valor de `grant_type`, el grant de alumno se llama `shine_learner`. Cosas que hay que tocar al añadir un grant: el plugin, `grant_types` del consumer (contenido, por entorno), `grant_types` del scope (config) y un tipo de esquema `grant_type.{id}` en `config/schema` (sin él los kernel tests fallan con "missing schema"). Además, el proveedor de autenticación de simple_oauth es **global** y se aplica a cualquier ruta si la petición lleva `Authorization: Bearer …`: en `/oauth/token` un Bearer inválido da 401 antes de llegar al grant y uno válido deja al usuario actual autenticado dentro del grant; en un webhook anónimo (RevenueCat, 07) un secreto con prefijo `Bearer ` da 401 antes del controlador, y la opción de ruta `_oauth_skip_auth` **no lo evita en rutas solo POST** (simple_oauth localiza la ruta con una petición GET de prueba, no la encuentra y no llega a leer la opción). Los secretos de webhook van sin ese prefijo.

21. **`hook_update_N` en un módulo nuevo no corre nunca** → al instalar un módulo Drupal fija su versión de esquema a la última update disponible **antes** de `hook_install` (`ModuleInstaller.php`), así que `drush updb` no la ve. Si la update depende de config que llega con `drush cim` (que instala el módulo antes de crear los campos), dejarla pendiente desde `hook_install` con `\Drupal::service('update.update_hook_registry')->setInstalledVersion('modulo', 11000)` y lanzar `drush updb` después de `cim`, como en `shine_account.install`. La update debe lanzar `UpdateException` si falta la config, para seguir pendiente.
