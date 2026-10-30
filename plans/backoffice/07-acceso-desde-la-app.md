# 07. Acceso al panel desde la app sin volver a escribir credenciales y cierre de sesión global

- **Agente recomendado: Fable 5.1.** Emite una sesión de navegador a partir de un token OAuth: un
  fallo (token adivinable, reutilizable, sin caducidad, destino abierto) es una suplantación. Cerrar
  con `/security-review`.
- Fase: 21. Alcance: Drupal (`shine/`, módulo `shine_panel`) y app (`shine-app/`: un botón en
  Ajustes y una función de API).
- Dependencias: 02 (panel y `/panel/cuenta`).

## Prompt

Lee `docs/dashboards.md` §3.1, `plans/backoffice/README.md` (decisión 3: sesión de Drupal por
cookie), `docs/api-design.md` ("Cuentas y alumnos", "Token de alumno"), el código de
`shine_account` que ya resuelve problemas parecidos (`LearnerInviteRepository`: alfabeto, hash HMAC
con `hash_salt`, caducidad; `TokenRevoker`; el uso de `flood` en `AccountDeleteController` y en
`join`), `HolderAccessCheck`, y en core `user_login_finalize()`, `SessionManager::delete()` y
`user.flood_control`. En la app, `shine-app/src/lib/api/client.ts` (`shineFetch`, actor `holder`),
`app/(auth)/settings.tsx` y `src/lib/accountScreens.ts`. Trabaja primero en `shine/`, luego en
`shine-app/`.

Tareas:

1. **Emisión del enlace**: `POST /shine/panel/link` (`shine_panel`, `_shine_holder`,
   `_csrf_request_header_token`, token OAuth **del titular**: un token de alumno recibe 403 como el
   resto de rutas de cuenta) con cuerpo opcional `{destination}` (ruta interna del panel; por defecto
   `/panel`). Responde `201 {url, expires_at}` con `url` = `{base}/panel/auth/{token}`. El token son
   32 bytes aleatorios en base64url; en el servidor solo se guarda su HMAC (`hash_salt`, como los
   códigos de invitación) en el key-value con caducidad `shine_panel.panel_links`, con `uid`,
   `destination` y `created`; TTL 5 minutos; un solo uso. Límite: 10 emisiones por titular y hora
   (`flood`), 429 al superarlo.
2. **Canje**: `GET /panel/auth/{token}` (anónimo, `no_cache`): busca el HMAC, comprueba caducidad y
   que el titular siga activo, sin `field_archived_at` y `holder`; **borra la entrada antes de
   iniciar sesión** (un solo uso incluso con dos peticiones simultáneas); si hay otra sesión de
   navegador iniciada con un usuario distinto, la cierra primero; `user_login_finalize()`; redirige
   a `destination` solo si es una ruta local que empieza por `/panel` o `/ca/panel` (si no, `/panel`).
   Token inválido, caducado o usado: página del tema "Este enlace ya no sirve. Vuelve a abrir el
   panel desde la app." (sin distinguir motivo) con estado 410; 10 fallos por IP y hora → 429
   (`flood`). Nada se registra en el log con el token en claro.
3. **Cerrar sesión en todos los dispositivos** (`/panel/cuenta`, botón con confirmación): borra
   todas las sesiones de Drupal del titular (`SessionManager::delete($uid)`, incluida la actual, que
   redirige a `/user/login` con un mensaje), revoca sus tokens OAuth (`TokenRevoker`: access y
   refresh) y los tokens de alumno emitidos con su `operated_by` (los access tokens de los alumnos
   cuyo claim `operated_by` es el titular; documenta cómo los localizas: simple_oauth no indexa
   claims, así que la opción razonable es revocar todos los access tokens de los alumnos de los que
   el titular tiene acceso activo, que caducan en 12 h de todas formas y la app los vuelve a pedir).
   Pide la contraseña, como el borrado de cuenta.
4. **App**: en Ajustes, sección "Tu cuenta", botón "Abrir el panel web" (`ui.settings.panel.open`
   en `es.json` y `ca.json`): llama a `POST /shine/panel/link` con `shineFetch(..., {actor:
   'holder'})` y abre `url` con `Linking.openURL` (en web, `window.open(url, '_blank')`); en error,
   texto neutro con reintento. Lógica pura en `src/lib/accountScreens.ts` (qué destino mandar:
   `/panel/alumnos/{uuid}` si hay alumno activo, `/panel` si no) con test.
5. **Tests kernel** (`shine_panel/tests/src/Kernel/PanelLinkTest.php`, por HTTP con `http_kernel`
   como `LearnerEndpointsTest`): emisión con token de titular (201, HMAC guardado, nada en claro),
   con token de alumno 403, canje válido inicia sesión y redirige al destino, segundo canje 410,
   caducado 410, destino externo o fuera de `/panel` → `/panel`, titular archivado o bloqueado 410,
   flood por IP 429, cierre global borra sesiones y tokens.
6. **Documentación**: `docs/api-design.md` ("Panel web: enlace de acceso"), `docs/dashboards.md`
   §3.1 (implementado), `CLAUDE.md` (endpoints y módulo), `docs/progress.md`.

Verificación:
- Como `jose@test.com` en Expo web, "Abrir el panel web" abre una pestaña ya dentro de
  `/panel/alumnos/{uuid de Marta}`; abrir la misma URL otra vez da la página 410 del tema; tras 5
  minutos un enlace sin usar también. En la pestaña Red no viaja el token más que en la URL del
  canje (una sola petición, `no_cache`, `Referrer-Policy: no-referrer` en esa respuesta).
- Un token de alumno contra `/shine/panel/link` → 403. Con otra cuenta iniciada en el navegador,
  el canje la sustituye por la del titular del enlace.
- "Cerrar sesión en todos los dispositivos" desde el panel: la app pierde la sesión (el refresh
  falla y vuelve al login) y el navegador vuelve a `/user/login`.
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_panel`
  en verde; `cd shine-app && source ~/.nvm/nvm.sh && nvm use 21 && npx tsc --noEmit && npm run lint
  && npm test` en verde; `/security-review` sin hallazgos abiertos.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/api-design.md`, `docs/dashboards.md` y `CLAUDE.md`.
