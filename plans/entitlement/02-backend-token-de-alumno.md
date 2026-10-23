# 02. Backend: token de alumno (grant OAuth `shine_learner`) y `operated_by`

- **Modelo recomendado: Fable.** Emisión de tokens de impersonación acotada dentro de
  simple_oauth y league/oauth2-server: hay que leer código contrib, decidir dónde se valida el token
  del titular, añadir un claim privado y cubrirlo con tests de seguridad.
- Fase: 17, parte 17a. Alcance: solo Drupal (`shine/`), módulo `shine_account`.
- Dependencias: 01b (`LearnerAccessPolicy::canOperate`, `field_archived_at`, `field_operated_by`).

## Prompt

Lee `docs/monetization.md` §5.3, `plans/entitlement/README.md` ("Id del grant de alumno",
"Quién operó la sesión"), `CLAUDE.md` (sección OAuth2 completa, gotchas 2, 3 y 15) y el contrib
que ya hace algo parecido: `shine/public_html/modules/contrib/simple_oauth_password_grant/`
(plugin `Password`, repositorio de usuario, su test kernel `PasswordTest` y
`AuthorizedRequestBase`). Mira también cómo `simple_oauth` construye el servidor de autorización
a partir de los `grant_types` del consumer (`Oauth2GrantManager`, controlador de `/oauth/token`),
qué servicio valida un Bearer entrante (el que usa su proveedor de autenticación) y
`hook_simple_oauth_private_claims_alter` (`simple_oauth.api.php`,
`Entities/AccessTokenEntity::convertToJWT`). Trabaja en `shine/` con `ddev`.

Decisión tomada en el README: el grant se llama **`shine_learner`** (id de plugin = valor de
`grant_type`), no `urn:shine:learner`, porque el gestor de plugins trata `:` como separador de
derivativas. Si al investigar ves que no es así, documenta por qué y usa el URN.

Tareas:

1. **Plugin `Oauth2Grant` `shine_learner`** en `shine_account/src/Plugin/Oauth2Grant/` que
   devuelve un grant de League propio (`LearnerGrant extends AbstractGrant`) con:
   - Identificador `shine_learner`. Petición:
     ```
     POST /oauth/token
     Authorization: Bearer {access token del titular}
     grant_type=shine_learner&client_id=shine_expo_app&learner={uuid}&scope=authenticated_user_access
     ```
   - Validación del cliente como en el resto de grants (consumer público, sin secret).
   - Identidad del titular: si el proveedor de autenticación de simple_oauth ya ha autenticado la
     petición a `/oauth/token` (compruébalo), usa el usuario actual; si no, valida el Bearer con el
     resource server de simple_oauth dentro del grant. En ambos casos exige `field_account_kind ==
     holder`.
   - Comprobaciones sobre `learner`: existe, `field_account_kind == learner`,
     `LearnerAccessPolicy::canOperate(titular, alumno)` (acceso activo con cualquier rol), sin
     `field_archived_at`, activo. Cualquier fallo responde `invalid_grant` (400) sin distinguir
     "no existe" de "no es tuyo".
   - Emite **solo access token** para el usuario alumno con los scopes validados, TTL fijo de 12 h
     (ignora el TTL del consumer que llega por parámetro; deja la constante en un sitio visible) y
     **sin refresh token**. El token debe persistirse como `oauth2_token` (lo hace
     `issueAccessToken` con el repositorio de simple_oauth) para que la revocación de 01b funcione.
2. **Claim `operated_by`**: `hook_simple_oauth_private_claims_alter` en `shine_account` añade
   `operated_by` = UUID del titular a los tokens emitidos por este grant (el grant deja el UUID
   accesible al hook: atributo de la petición o servicio con estado de petición; decide y
   documenta). Los tokens del grant `password` no llevan el claim.
3. **Servicio `shine_account.current_operator`**: lee el Bearer de la petición actual, decodifica
   el payload del JWT (ya verificado por simple_oauth; comprueba que su `sub` coincide con el
   usuario actual) y devuelve el titular de `operated_by` o NULL. `hook_node_presave` en
   `shine_account`: si el nodo es `session`, es nuevo, su dueño es `learner` y hay operador, fija
   `field_operated_by`. Con token de titular (usuarios antiguos que juegan ellos mismos) queda vacío.
4. **Configuración**: añade `shine_learner` a `grant_types` del scope
   `authenticated_user_access` (exporta `simple_oauth.oauth2_scope.authenticated_user_access.yml`)
   y al consumer `shine_expo_app` (entidad de contenido: hazlo por `php-eval` y actualiza el snippet
   de CLAUDE.md "Consumer configurado" para que lo incluya junto a `password`).
5. **Que el alumno no escale**: con un token de alumno, `grant_type=shine_learner` debe fallar
   (el alumno no es titular); `grant_type=password` con el usuario alumno es imposible (contraseña
   desconocida); `refresh_token` no aplica. Comprueba que `/oauth/userinfo` con el token de alumno
   devuelve `sub` = UUID del alumno y `name` = su `field_display_name` (ya lo hace `shine_oauth`).
6. **Tests kernel** (modelo: `PasswordTest`): token para alumno propio (200, sin
   `refresh_token`, `expires_in` cercano a 43200, el JWT lleva el uid del alumno y el claim
   `operated_by` del titular); alumno de otro titular → 400 `invalid_grant`; alumno con acceso
   `guardian` → 200; acceso revocado → 400; alumno archivado → 400; UUID de un titular en
   `learner` → 400; petición firmada con token de alumno → 400; sin Bearer → 400 o 401; con el
   token emitido, `POST /jsonapi/activitysummary/...` crea la entidad con `uid` del alumno,
   `POST /shine/session/generate` crea una sesión con `field_operated_by` = titular, y
   `POST /shine/learners` devuelve 403.
7. **Documentación**: `docs/api-design.md` (sección "Cuentas y alumnos": el intercambio, el TTL,
   la ausencia de refresh, cómo renovar y el claim `operated_by`); `docs/monetization.md` §5.3
   (grant elegido y nombre); CLAUDE.md (endpoint y gotcha nuevo sobre el `:` en ids de plugin si se
   confirma).

Verificación:
- Con curl y dos titulares normales (gotcha 14; recuerda las comillas simples del gotcha 1): A
  obtiene token para su alumno y con él `GET /jsonapi/node/session` solo devuelve sesiones del
  alumno (ninguna al principio) y `POST /shine/session/generate` crea una sesión cuyo `uid` es el
  alumno y cuyo `field_operated_by` es A; B con el UUID del alumno de A recibe 400 `invalid_grant`;
  tras el vínculo de 01c, B obtiene token y su sesión lleva `field_operated_by` = B.
- Tras `POST /shine/learners/{uuid}/archive`, el token de alumno ya emitido recibe 401 en JSON:API
  y no se puede emitir otro.
- `ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_account` en verde;
  `ddev drush cim -y` idempotente.

Al terminar: marca la fila en `plans/entitlement/README.md` y actualiza `docs/progress.md`.
