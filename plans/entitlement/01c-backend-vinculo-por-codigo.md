# 01c. Backend: vínculo de un segundo adulto por código (`learner_invite`)

- **Modelo recomendado: Fable.** Códigos de un solo uso que dan acceso a los datos de un menor:
  generación, almacenamiento y canje con límite de intentos, y las reglas de roles que §5.6 deja
  en prosa.
- Fase: 17, parte 17a (base del flujo centro-familia de §5.6, pero válido también para dos adultos
  de una misma familia). Alcance: solo Drupal (`shine/`), módulo `shine_account`.
- Dependencias: 01b. Puede ir en paralelo con 02.

## Prompt

Lee `docs/monetization.md` §3.3 y §5.6 (pasos 5 de "Centro", 2 y 7 de "Familia", y el resumen
de permisos), `plans/entitlement/README.md` ("Códigos de vínculo", "Borrado de cuenta con alumnos
compartidos", "Incoherencias" sobre §5.6) y el código de 01b (`LearnerAccessPolicy`,
`LearnerManager`, rutas). Trabaja en `shine/` con `ddev`. El `release` (liberar a un alumno de la
plaza de un centro) **no** es de este subplan: lo hace 10 porque depende de `organization`.

Tareas:

1. **Entidad `learner_invite`** (contenido, campos de código): `field_learner`, `field_created_by`
   (titular), `field_code_hash` (hash del código, nunca el código en claro), `field_expires`
   (creación + 14 días), `field_used_at`, `field_used_by`, `status`. Código de 6 caracteres de un
   alfabeto sin ambigüedades (sin 0/O ni 1/I), generado con `random_int`. Solo se devuelve en claro
   en la respuesta del `POST` que lo crea. Acceso: `view` para quien lo creó y admin; filtro
   JSON:API (gotcha 16).
2. **Endpoints** (con `_shine_holder`):
   ```
   POST /shine/learners/{uuid}/invite              → 201 {code, expires_at}
   POST /shine/learners/join        {code}         → 200 {learner}  (crea learner_access guardian/invite)
   ```
   `invite`: solo `canInvite` (`owner`; 10 añade `coordinator`); invalida las invitaciones
   anteriores vivas del mismo alumno (una viva por alumno). `join`: normaliza el código
   (mayúsculas, sin espacios), busca por hash, exige vivo, no usado y no caducado; crea el
   `learner_access` `guardian`/`invite` para el titular que canjea (si ya tiene acceso, 200 sin
   duplicar); marca la invitación usada. Un código caducado, usado o inexistente responde
   `422 {"error":"invite_invalid"}` sin distinguir el motivo. El propio `owner` no puede canjear su
   código. Límite de intentos con el servicio `flood` (por titular y por IP; umbrales en
   `shine_account.settings`), respuesta 429 al superarlo.
3. **Roles en `LearnerAccessPolicy`**: `guardian` puede operar (token de alumno), ver progreso,
   invitar a nadie, retirar su propio acceso (`DELETE /shine/learners/{uuid}/access` de 01b) y no
   puede editar, archivar ni invitar. Deja escrito en la clase qué añadirá 10 (`staff`,
   `coordinator`, promoción de `guardian` a `owner` en el `release`).
4. **`/shine/me` y `GET /shine/learners`**: `adults` ya existe (01b); añade `invite` por alumno
   cuando el titular es `owner` y hay una invitación viva (`expires_at`, sin el código).
5. **Tests kernel**: invitar y canjear crea `guardian` y marca la invitación; segundo canje 422;
   caducada 422; el `owner` no canjea la suya; `guardian` obtiene lista y acceso al alumno pero no
   puede archivar ni invitar (403 `role_not_allowed`); retirar acceso del `guardian` lo desactiva
   y el alumno sigue con su `owner`; flood: N intentos fallidos → 429; borrado de cuenta del
   `owner` con `guardian` activo promueve al `guardian` (regla de 01b).
6. **Documentación**: `docs/api-design.md` ("Cuentas y alumnos": invitación y vínculo);
   `docs/monetization.md` §5.6 (cierra la pregunta del punto 7 de "Familia" con la regla del
   README y corrige la numeración 5.5/5.6).

Verificación:
- Con dos titulares normales A y B (gotcha 14): A invita, B canjea y pide token del alumno (02,
  o `account_switcher` si 02 no está): B ve las sesiones y summaries del alumno y genera una
  sesión; B intenta archivar y recibe 403; B retira su acceso y deja de poder pedir token.
- Seis canjes erróneos seguidos como B → 429; el código correcto después de esperar el plazo del
  flood funciona.
- `ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_account` en verde;
  `ddev drush cim -y` idempotente.

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md` y la
lista de endpoints custom de `CLAUDE.md`.
