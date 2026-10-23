# 05. App: doble token, onboarding con primer alumno y selector de alumno

- **Modelo recomendado: Fable.** Cambio transversal en `client.ts` y en el store de
  autenticación (dos identidades, renovación del token de alumno, qué llamada va con cuál) y un
  flujo de arranque nuevo. Un error aquí mezcla datos de alumnos o rompe el login.
- Fase: 17, parte 17b. Alcance: solo app (`shine-app/`).
- Dependencias: 02 (grant `shine_learner`) y 04 (`/shine/me` con `holder_status` y `covered_by`).

## Prompt

Lee `docs/monetization.md` §5 y §7, `docs/api-design.md` (secciones "Cuentas y alumnos" y el
402 de `session/generate`), `plans/entitlement/README.md`, y en la app: `src/lib/api/client.ts`,
`src/lib/api/auth.ts`, `src/store/auth.ts`, `src/lib/storage.ts`, `src/lib/config.ts`,
`app/_layout.tsx` (guard), `app/register.tsx`, `app/(auth)/dashboard.tsx` (uso de
`generateSession` y `generateErrorCopy`), `src/lib/sessionCards.ts` (sesión pendiente) y
`src/lib/api/settings.ts` (PATCH del usuario). Respeta el tono de la app (nunca "pago",
"bloqueado" ni "error" en pantalla; ver `docs/level-system.md` §2). Comandos de comprobación en
terminal del usuario o con `source ~/.nvm/nvm.sh && nvm use 21` (gotcha 5).

Tareas:

1. **Tipos y API**: `src/types/me.ts` (`Me`, `Learner` con `role`, `adults`, `covered_by`,
   `paused`, `completed_regular`, `free_regular_sessions`, `HolderStatus`) espejo de `/shine/me`;
   `src/lib/api/me.ts` (`getMe`); `src/lib/api/learners.ts` (`createLearner`, `listLearners`,
   `updateLearner`, `archiveLearner`, `withdrawAccess`, `requestLearnerToken` contra
   `/oauth/token` con `grant_type=shine_learner`; `inviteAdult` y `joinLearner` los consume 06);
   `registerAccount` envía `field_adult_consent: {value: true}`; `SessionResource` gana
   `field_operated_by`.
2. **Dos tokens en `client.ts`**: claves de almacenamiento separadas para el titular (las
   actuales) y el alumno (`shine_learner_token`, `shine_learner_uuid`). `apiFetch(path, init,
   {actor})` con `actor: 'learner' | 'holder'`; por defecto `learner` cuando hay alumno activo (todo
   lo que es actividades, sesiones, tracking, feedback, estadísticas, mensajes y preferencia de
   fuente), y `holder` explícito en `/shine/learners*`, `/shine/me`, `/shine/account/*` y
   `/oauth/token`. Si una llamada `learner` llega sin alumno activo, lanza un error claro en vez de
   caer al token del titular. 401 con token de alumno → pedir otro con el del titular (renovando
   el del titular si hace falta) y reintentar una vez; 401 del titular → refresh como hoy. 402 →
   `PaymentRequiredError` con `reason`, `completedRegular`, `freeRegularSessions` y
   `holderStatus`, que los callers pueden distinguir.
3. **Store `auth.ts`**: `holder` (userinfo del titular), `me` (respuesta de `/shine/me`),
   `activeLearner`, y `user` pasa a ser la identidad **activa** (el alumno: su `sub` es el UUID que
   usan los filtros `uid.id` de estadísticas y sesiones), para no tocar pantallas. Acciones:
   `selectLearner(uuid)` (pide token, persiste la selección, recarga preferencia de fuente del
   alumno), `refreshMe()`, `clearLearner()`; `logout` borra ambos tokens; `initialize` restaura el
   alumno guardado y, si el token caducó, lo renueva en silencio.
4. **Flujo de arranque** en `app/_layout.tsx`: sin sesión → login; con sesión y `me.learners`
   activos vacío → `/(auth)/learners/new`; con alumnos y ninguno activo → uno solo se selecciona
   solo, varios → `/(auth)/learners/select`; con alumno activo → dashboard.
5. **Pantallas**: `app/register.tsx` gana la casilla de consentimiento (texto: "Soy mayor de edad
   y responsable de la persona con la que voy a trabajar"; sin ella el botón sigue inactivo);
   `app/(auth)/learners/new.tsx` ("¿Con quién vas a trabajar?": nombre o apodo y avatar de un set
   fijo en `src/lib/avatars.ts`, con `field_avatar` como clave; maneja 422 `learner_limit` con un
   texto neutro que 06b y 08 ampliarán; deja un enlace "Tengo un código del centro" que 06
   implementa); `app/(auth)/learners/select.tsx` (tarjetas por alumno con avatar y nombre; los
   `paused` se ven pero no se seleccionan, con una línea de explicación; bajo cada uno, `covered_by`
   en lenguaje llano: "acceso activado por {centro}" cuando sea `organization`). En el dashboard,
   el avatar o nombre del alumno activo en cabecera lleva al selector.
6. **Sesión pendiente de otro adulto** (§5.6): si la sesión pendiente tiene `field_operated_by`
   distinto del titular, la tarjeta "Continuar" lo dice ("sesión empezada con {nombre}", usando
   `adults`) y permite continuarla; no hay forma de descartarla desde la app.
7. **402 en el dashboard**: `generateErrorCopy` gana el caso `PaymentRequiredError` con un texto
   neutro y sin acción de compra ("Habéis completado las {N} sesiones de prueba de {nombre}"); el
   paywall llega en 08. Aviso suave cuando `free_regular_sessions - completed_regular <= 3` y
   `covered_by` es `trial` (tarjeta discreta, no modal).
8. **Tests** (`src/lib/__tests__/`, lógica pura): elección de token por `actor`; reintento tras 401
   de alumno; decisión de ruta de arranque según `me`; validación del formulario de alumno (añade a
   `authForm.ts` o crea `learnerForm.ts`); mapeo de 402 a copy; texto de la tarjeta "Continuar" con
   `operated_by`.

Verificación:
- `npx tsc --noEmit`, `npm run lint`, `npm test` limpios.
- Recorrido manual con **dos titulares nuevos** (gotcha 14): registro con consentimiento →
  primer alumno → bloque inicial → "Mi progreso" muestra datos solo del alumno activo; crear un
  segundo alumno (requiere cortesía de 2 o más, créala en el admin) y cambiar entre ellos cambia
  sesiones y estadísticas; cerrar la app y volver conserva el alumno activo; caducar el token de
  alumno (borra su `oauth2_token` en el admin) y la siguiente acción lo renueva sin pasar por login.
- Con el alumno compartido de 01c (vincula por curl hasta que 06 tenga pantalla): B lo ve en su
  selector, la sesión que A dejó a medias aparece como "empezada con A" y B la continúa.
- Con N bajado a 1 en el admin: tras la primera regular completada, el dashboard muestra el texto
  del 402 y no rompe nada.

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md` y la
sección "Expo App" de `CLAUDE.md` (doble token, rutas nuevas, `avatars.ts`).
