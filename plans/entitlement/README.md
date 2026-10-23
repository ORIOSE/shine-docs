# Plan de planes: monetización y modelo de cuentas (FASE 17)

Implementa `docs/monetization.md` (decisiones de producto del 2026-10-22, revisado el 2026-10-23
con la entidad `learner_access` y el flujo centro-familia de §5.6). Cada fichero de esta carpeta
es un prompt autocontenido para una sesión de Claude Code, con el mismo formato que
`plans/level-sistem/` y `plans/prompts/`. El diseño es la fuente de verdad; si un subplan necesita
apartarse de él, lo anota en `docs/monetization.md` y lo dice en `docs/progress.md`.

Lo que se construye, en una frase: el titular adulto crea alumnos (o se vincula a uno por código)
y trabaja "en nombre de" cada uno con un token propio; el servidor decide el acceso con una
entidad `entitlement` que alimentan RevenueCat (stores), Stripe (profesionales y centros) y el
admin (cortesías); la prueba gratuita se mide en sesiones regulares completadas por alumno.

## Cómo usarlos

1. Abrir Claude Code en la raíz del proyecto con el modelo indicado en la cabecera del fichero.
2. Pedir: "ejecuta plans/entitlement/XX-....md" (o pegar su sección "Prompt").
3. Al terminar: verificar según su sección "Verificación", marcar la fila en la tabla de abajo y
   actualizar `docs/progress.md` en la sección "FASE 17" (Monetización y modelo de cuentas).

## Criterio de modelo

- **Fable**: decisiones de modelo de datos o de acceso (quién puede operar sobre qué alumno),
  seguridad (emisión de tokens, códigos de invitación, webhooks con secreto, borrado de cuenta),
  lógica de estado con casos límite (orden de cobertura, idempotencia de eventos de pago) y los
  cambios transversales en la app (doble token en `client.ts`).
- **Opus**: tareas con especificación cerrada y patrón ya existente en el repo (entidad de campos
  de código calcada de `activityfeedback`, pantallas con el design system, configuración guiada de
  consolas de stores, informes drush).
- No se asigna Sonnet ni Haiku: ningún subplan es puramente mecánico; las partes que lo son van
  dentro del subplan que las necesita.

El propio plan de planes se ha escrito con Fable.

## Orden de ejecución

| Orden | Fichero | Fase del diseño | Modelo | Depende de | Hecho |
|---|---|---|---|---|---|
| 1 | `01a-backend-campos-de-cuenta.md` | 17a | Opus | nada | [x] 2026-10-23 |
| 2 | `01b-backend-alumnos-y-cuenta.md` | 17a | Fable | 01a | [x] 2026-10-23 |
| 3 | `02-backend-token-de-alumno.md` | 17a | Fable | 01b | [x] 2026-10-23 |
| 4 | `01c-backend-vinculo-por-codigo.md` | 17a y §5.6 | Fable | 01b (en paralelo con 02) | [x] 2026-10-23 |
| 5 | `03-backend-entitlement-y-catalogo.md` | 17c | Opus | 01a (en paralelo con 01b, 01c y 02) | [x] 2026-10-23 |
| 6 | `04-backend-acceso-y-muro.md` | 17c | Fable | 01c, 03 | [ ] |
| 7 | `05-app-doble-token-y-alumnos.md` | 17b | Fable | 02, 04 | [ ] |
| 8 | `06-app-alumnos-y-vinculo.md` | 17b y §5.6 | Opus | 05 | [ ] |
| 9 | `06b-app-plan-y-borrado-de-cuenta.md` | 17b | Opus | 05 (en paralelo con 06) | [ ] |
| 10 | `09-stores-y-revenuecat-configuracion.md` | 17d | Opus | identidad de la app (`plans/prompts/14b`); **empezar cuanto antes**, en paralelo | [ ] |
| 11 | `07-backend-webhook-revenuecat.md` | 17d | Fable | 03, 04 | [ ] |
| 12 | `08-app-paywall-y-compras.md` | 17d | Opus | 05, 06b, 07, 09 | [ ] |
| 13 | `10-backend-organizaciones.md` | 17e y §5.6 | Fable | 01c, 04 | [ ] |
| 14 | `11-backend-stripe.md` | 17e | Fable | 03, 10 | [ ] |
| 15 | `12-app-centros-y-profesionales.md` | 17e y §5.6 | Opus | 06, 10 | [ ] |
| 16 | `13-backend-instrumentacion-embudo.md` | §9 (opcional) | Opus | 04, 08 | [ ] |
| 17 | `14-verificacion-e2e-y-docs.md` | todas | Fable | todo lo anterior | [ ] |

Camino crítico: 01a → 01b → 02 → 04 → 05 → 06. El 01c y el 03 van en paralelo con 02; el 09 son
altas en consolas con días de espera (contratos de Apple, cuenta de comerciante de Google) y debe
arrancar el primer día aunque el código llegue después.

Hitos:

- **H1, producto cerrado con muro** (tras 06 y 06b): se puede pilotar en TestFlight o Play
  interno con cortesías creadas desde el admin (`source = manual`), sin stores ni Stripe. Es el
  hito mínimo antes de cualquier publicación (el diseño pide 17a y 17c antes de publicar).
- **H2, compras reales** (tras 08): una compra en sandbox de Apple y Google llega al entitlement
  por webhook y abre el acceso sin reiniciar la app.
- **H3, canal profesional** (tras 12): código de centro, alumno compartido centro-familia y
  Stripe en modo test.

Publicar en stores requiere además `plans/prompts/14a` y `14b` (backend de producción, EAS y
fichas), que no son de esta carpeta.

## Módulos y dónde cae cada cosa

| Módulo | Nuevo | Qué contiene | Subplanes |
|---|---|---|---|
| `shine_account` | sí | Campos y rol de alumno, entidades `learner_access` y `learner_invite`, endpoints `/shine/learners*` (alta, edición, archivo, invitación, vínculo, retirar acceso), `/shine/me` (con `hook_shine_me_alter`), `/shine/account/delete`, grant `shine_learner` y claim `operated_by` | 01a, 01b, 01c, 02 |
| `shine_entitlement` | sí | Entidad `entitlement`, catálogo de planes (config entity), servicio `shine_entitlement.access`, admin de cortesías, drush `recalc`, webhooks RevenueCat y Stripe, billing Stripe | 03, 04, 07, 11 |
| `shine_org` | sí | `organization`, `organization_membership`, `organization_invite`, `field_organization` en usuario y entitlement, `POST /shine/organizations/join`, alumnos en plaza, `release`, cobertura por organización | 10 |
| `shine_analytics` | sí (opcional) | Eventos de cliente e informe del embudo | 13 |
| `shine_level` | no | `free_regular_sessions` y `pending_max_days` en `shine_level.settings`; interfaz de puerta (`session gate`) que el generador consulta antes de crear; excepción que el controlador traduce a 402; sesión pendiente caducada | 04 |
| `shine_oauth` | no | Sin cambios previstos: `sub` = UUID ya sirve para el alumno | |

El diseño (§3.3) deja la entidad `learner_access` "en `shine_entitlement` o en un módulo propio":
va en `shine_account`, porque el acceso al alumno existe aunque no haya monetización.

Principio que no se negocia (§3.2 y §5.3): **un usuario Drupal = un alumno**. Ningún subplan toca
`shine_level`, sesiones, summaries, feedback ni estadísticas para que distingan titular de alumno;
todo eso sigue trabajando con el `uid` del token. La única marca nueva en una sesión es
`field_operated_by` (quién la generó), y la escribe un `presave` de `shine_account`.

## Decisiones que el diseño deja abiertas (§11) y quién las resuelve

| Decisión | Dónde se decide | Valor por defecto si nadie decide antes |
|---|---|---|
| N exacto de sesiones gratis (y su relación con X e Y) | 04 | `free_regular_sessions = 8`; el formulario de ajustes avisa si N no supera `periodic_sessions + evaluation_sessions` |
| Cupo de Profesional y precio de ampliación | 03 (catálogo) y 09 | `learners_per_seat = 15`, ampliación subiendo `quantity` en Stripe |
| Derivación centro → familia | ya decidida en §5.6 (vínculo, nunca transferencia); 10 cierra el punto en §11 | |
| Facturación profesional: Commerce o Stripe Checkout | 11 | Stripe Checkout + Customer Portal, la factura la emite Stripe; sin Commerce |
| Prueba gratuita de store | 09 | No (§4.4) |

## Decisiones técnicas que el diseño no cubre y que los subplanes deben cerrar

- **Consentimiento de adulto** (01a): el diseño dice "boolean + timestamp". Un booleano
  `field_adult_consent` (lo que manda la app) y un timestamp `field_adult_consent_at` que fija el
  servidor en `presave` la primera vez que pasa a verdadero. La exigencia de consentimiento (422)
  solo aplica al registro anónimo: drush y el admin crean usuarios sin él.
- **El alumno no puede entrar solo** (01a, 01b): Drupal no tiene permiso de "login". La barrera es
  contraseña aleatoria que nadie conoce, email no enrutable (`learner+{uuid}@shine.invalid`,
  comprobar que el validador lo acepta), `hook_mail_alter` que anula el correo a `.invalid`, y el
  rol `learner` para filtros y futuros permisos.
- **`learner_access` sustituye a cualquier campo "gestionado por"** (01b): no existe
  `field_managed_by`. Quien crea un alumno recibe un `learner_access` `owner`/`created`; "mis
  alumnos" es una consulta sobre esa entidad. Único por (alumno, titular); revocar = `status 0`.
- **Qué es "archivar"** (01b): `field_archived_at` en el usuario alumno, sin bloquearlo (sus datos
  se siguen leyendo con su token). Al archivar se revocan sus `oauth2_token` y no se emiten nuevos.
- **Rutas solo para titulares** (01b, 02): comprobación de acceso propia sobre
  `field_account_kind == holder` (servicio `access_check`), no por rol: el alumno también tiene el
  rol `authenticated` y los permisos de escritura JSON:API que necesita para jugar. Quién puede
  hacer qué sobre un alumno lo decide `LearnerAccessPolicy` (01b) a partir de `field_role`:
  `owner` y `coordinator` del centro editan, invitan, liberan y archivan; `guardian` opera, ve
  progreso y retira su propio acceso; `staff` opera y ve progreso.
- **Avatar** (01b): `field_avatar` (string: clave de un set de avatares de la app), no
  `user_picture`. Subir imágenes por JSON:API para esto es desproporcionado en v1.
- **`/shine/me` lo componen tres módulos** (01b, 04, 10): `shine_account` monta `holder`,
  `learners[]` (con `role` y `adults[]`) e invoca `hook_shine_me_alter(array &$me, UserInterface
  $holder)`; `shine_entitlement` añade `holder_status` y, por alumno, `covered_by`, `paused`,
  `completed_regular` y `free_regular_sessions`; `shine_org` añade `organizations[]` y
  `released_by`. Así `shine_account` no depende de los otros dos.
- **Cupo de alumnos antes de que exista el entitlement** (01b, 04): `shine_account` define el
  servicio `shine_account.learner_quota` con `maxLearners(UserInterface $holder): int` (por defecto
  1, plan gratuito); `shine_entitlement` lo sustituye por el cálculo real. Se cuenta sobre los
  alumnos activos de los que el titular es `owner` y que no están en plaza de una organización.
- **Quién operó la sesión** (01a, 02): `field_operated_by` (referencia a usuario) en
  `node.session`. El grant de alumno añade al JWT el claim privado `operated_by` (UUID del titular)
  con `hook_simple_oauth_private_claims_alter`; un servicio de `shine_account` lee ese claim del
  Bearer de la petición actual (ya verificado por simple_oauth) y un `hook_node_presave` lo copia
  en toda sesión nueva de un alumno. `shine_level` no se entera.
- **Dónde se cuelga el muro** (04): `shine_level` gana una interfaz `SessionGateInterface` con un
  colector por etiqueta de servicio; `SessionGenerator::generate()` consulta las puertas entre
  `plan()` y `create()` y lanza `SessionGatedException`; el controlador responde 402. Sin
  `shine_entitlement` instalado no hay puertas y nada cambia (los tests de `shine_level` siguen
  pasando). Solo la rama `regular` pasa por la puerta (§5.4).
- **Sesión pendiente caducada** (04): regla general de §5.6, parámetro `pending_max_days = 7` en
  `shine_level.settings`; `pendingSession()` despublica la que supere ese plazo y el árbol genera
  otra. Una sesión despublicada no cuenta como completada ni para la prueba.
- **Orden de cobertura** (04): el de §4.1 (plaza de organización → plan personal de algún adulto
  con acceso, contando solo sus alumnos `owner` → prueba por sesiones). Varios entitlements
  personales: el vigente es el que cubre con mayor `max_learners`; a igualdad, el de `expires_at`
  más lejano (nulo cuenta como infinito).
- **Plan gratuito en el catálogo** (03): se añade una entrada `free` (`learners_per_seat = 1`, sin
  `external_ids`) que no se materializa en ningún entitlement; `holderStatus()` la devuelve cuando
  el titular no tiene ninguno.
- **Campos que apuntan a `organization`** (03, 10): `organization` no existe hasta 10, así que
  `field_organization` del usuario y del entitlement los crea 10 (en el entitlement, con
  `hook_update_N` que instale la definición del campo base). 03 deja el hueco documentado.
- **Id del grant de alumno** (02): el diseño propone `urn:shine:learner`, pero simple_oauth usa el
  id del plugin como `grant_type` y el gestor de plugins de Drupal trata `:` como separador de
  derivativas. Se usa `shine_learner`.
- **Códigos de vínculo** (01c): `learner_invite` con código de 6 caracteres sin ambigüedades
  (sin 0/O ni 1/I), hash del código en BD (como una contraseña), un solo uso, 14 días; intentos
  de canje limitados con el servicio `flood` para que no se pueda adivinar.
- **Secretos de webhooks** (07, 11): en `settings.php` (`$settings[...]`), nunca en config ni en
  git; la ruta es anónima y compara el secreto en tiempo constante.
- **Borrado de cuenta con alumnos compartidos** (01b): para cada acceso activo del titular, si el
  alumno tiene otro adulto activo o está en plaza de un centro, solo se desactiva ese acceso (si
  el que se va era el único `owner` y hay `guardian`, se promueve, misma regla que el `release` de
  §5.6); si el titular era el único adulto, el alumno se anonimiza con él. Anonimizar = nombre,
  email, display name y avatar; bloqueo y revocación de tokens; los summaries y niveles se
  conservan sin identidad. Pide la contraseña del titular en el cuerpo. El criterio RGPD queda
  anotado para la política de privacidad (14).
- **Idempotencia de webhooks** (07, 11): el entitlement guarda `field_event_timestamp` y
  `field_last_event_id` además de `field_raw_event`; se descarta todo evento anterior al último
  aplicado.

## Incoherencias detectadas en `docs/monetization.md`

Se corrigen en el propio documento al ejecutar el subplan indicado:

- §3.1 lista `field_organization` entre los campos del usuario de 17a, pero referencia a
  `organization`, que nace en 17e: se crea en 10.
- §5.6 está numerado después de §5.5 pero aparece antes en el texto; el último párrafo de
  "Familia" (punto 7) contiene una pregunta sin cerrar ("¿pasa a contar como owner?"). 01c deja la
  regla limpia: sigue siendo `guardian` y se promueve a `owner` en el `release` si no queda otro.
- §10 no menciona `learner_access`, `learner_invite` ni los endpoints de §5.6 en ninguna fase:
  01c y 10 los añaden a 17a y 17e.
- §10 sitúa "borrado de cuenta" en la fase de app (17b), pero necesita el endpoint de servidor
  `POST /shine/account/delete` (01b).
- §10 sitúa `/shine/me` en 17a, pero `holder_status` no existe hasta 17c (lo resuelve
  `hook_shine_me_alter`, 01b y 04).
- §11 sigue listando "derivación centro → familia" como pendiente cuando §5.6 ya la decide; 10
  cierra el punto.
- `docs/api-design.md` sigue hablando de Capacitor (§1 del diseño lo da por error): 01a lo corrige.
- Entre 01a y 05 el registro desde la app devuelve 422 por falta de consentimiento. Es aceptable
  porque la app no está publicada; en local, probar con las cuentas existentes.

## Riesgos conocidos

- Gotcha 14 de CLAUDE.md: todo se prueba con **dos titulares normales**, cada uno con alumnos, y
  desde 01c con un alumno compartido entre ambos. El user 1 se salta permisos, node grants y
  filtros JSON:API, y aquí la pregunta central es "¿puede A tocar los alumnos de B?".
- Gotcha 16: `learner_access`, `learner_invite`, `entitlement`, `organization`,
  `organization_membership`, `organization_invite` y cualquier entidad nueva quedan expuestas en
  JSON:API por defecto; cada una necesita handler de acceso y
  `hook_jsonapi_ENTITY_TYPE_filter_access`, aunque la app no las consulte.
- Gotcha 17: las sesiones del alumno solo se ven con el token del alumno (realm por `uid`). Es lo
  deseado y es lo que hace que dos adultos vean lo mismo; no añadir grants para el titular.
- El token de alumno es un token de impersonación acotada: cualquier fallo en la comprobación de
  `learner_access` es un incidente de privacidad. Tests kernel obligatorios en 02 y 01c.
- `react-native-purchases` no funciona en Expo Go ni en web: desde 08 el desarrollo móvil pasa a
  development builds de EAS, y la web necesita un stub del módulo de compras.
- Apple revisa el paywall (3.1.2) y el borrado de cuenta (5.1.1): los textos y enlaces de 08 y 06b
  no son opcionales.
- Los webhooks llegan en orden arbitrario y repetidos; una regresión en la idempotencia da acceso
  gratis o lo quita a quien paga. Fixtures reales en los tests de 07 y 11.

## Fuera de alcance de esta carpeta

- **17f, modo aula** (§5.5): grupos `learner_group`, sesión `field_session_kind = group` y
  estadísticas de grupo. El modelo lo admite sin cambios (el entitlement `school_classroom` ya
  tiene `groups_per_seat`), pero no se planifica aquí.
- Facturación con IVA propia, DPA para centros y textos legales definitivos (§8): el 14 deja la
  lista de lo que falta; redactarlos no es trabajo de Claude Code.
