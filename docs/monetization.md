# Monetización y modelo de cuentas — Shine

Especificación de la "Fase 17". Recoge las decisiones de producto tomadas el 2026-10-22 y el
diseño técnico para ejecutarlas. Complementa `level-system.md` (sesiones y niveles) y
`api-design.md` (autenticación y endpoints). Las cifras de precio son hipótesis de partida, no
decisiones.

---

## 1. Decisiones de producto

- El **titular** de la cuenta es siempre un adulto (padre, madre, tutor, profesional, docente).
  Se registra con email y contraseña como hasta ahora. Es quien paga y quien maneja la app.
- El titular crea uno o varios **alumnos** (perfiles gestionados) con los que trabaja. El alumno
  no tiene email ni contraseña ni entra solo. No se pide edad; el titular declara en el alta que
  es mayor de edad y responsable de la persona con la que va a trabajar.
- Tres planes: **Familia** (cobrado por App Store / Google Play, hasta 3 alumnos),
  **Profesional** (logopedas y gabinetes, cobrado por web, cupo amplio de alumnos) y **Centro**
  (escuelas, factura anual, modo aula de nivel fijo más perfiles individuales opcionales).
- La prueba se mide en **sesiones, no en días**: todas las sesiones de evaluación (iniciales y
  de ajuste) y las primeras N sesiones regulares de cada alumno son gratis, sin tarjeta. N se
  fija en la configuración de `shine_level` junto a X e Y, y debe ser mayor que el número de
  sesiones necesario para que se dispare la primera evaluación de ajuste, de modo que el tutor
  y el alumno vean al menos un cambio de nivel antes del muro. Hipótesis de partida: N = 8. No
  se usa la prueba gratuita de la store.
- Las **sesiones de grupo** (aula) no alteran niveles individuales: son un tipo de sesión propio
  asociado a una organización, con nivel fijado por el docente.
- El acceso se decide **siempre en servidor** mediante una entidad `entitlement`, independiente
  de quién cobra. La app solo muestra el muro.
- Stores: se delega la validación de recibos y las notificaciones de renovación en
  **RevenueCat**; Drupal recibe un webhook y mantiene el entitlement. Canal profesional y
  centros: **Stripe** (suscripción o factura) con webhook propio.
- La app es **Expo / React Native**; no se usa Capacitor. EAS Build genera los binarios. La
  mención a Capacitor en `api-design.md` era un resto y se corrigió en 01a (2026-10-23).

---

## 2. Planes y precios (hipótesis a validar)

| Plan | Quién | Cobro | Alumnos | Precio de partida |
|---|---|---|---|---|
| Familia mensual | Familias | Store (IAP) | hasta 3 | 9,99 a 12,99 €/mes |
| Familia anual | Familias | Store (IAP) | hasta 3 | 59,99 a 79,99 €/año |
| Profesional | Logopeda, gabinete | Web (Stripe) | hasta 15 por profesional, ampliable | 25 a 40 €/mes por profesional, anual con descuento |
| Centro | Escuela | Factura anual | por docente/aula (modo aula); por alumno si se activan perfiles individuales | a definir con los primeros centros |

Notas:
- El anual es el ancla; el mensual existe para que el anual parezca razonable.
- Un único producto por periodo en cada store (`shine_family_monthly`, `shine_family_annual`).
  No hay productos por número de alumnos: el límite es un atributo del plan.
- Comisiones vigentes (octubre 2026): Apple en la UE 15 % con el Small Business Program (26 %
  estándar); Google Play 10 % + 5 % de billing en suscripciones. Contar con un 15 % efectivo.
- Referentes de precio a contrastar: Glifing, Dytective, Nessy, Lexercise.
- 2026-10-29 (subplan 09): precios de Familia **pendientes**; se fijan antes de enviar las
  suscripciones a revisión. Sin prueba de store. Ids, planes base de Play (`monthly`, `annual`) y
  estado de las altas en `docs/stores.md`.

---

## 3. Modelo de cuentas

### 3.1 Titular (usuario Drupal existente)

Sin cambios estructurales. Campos nuevos en `user`:

| Campo | Tipo | Uso |
|---|---|---|
| `field_account_kind` | list_string: `holder`, `learner` | Distingue titular de alumno gestionado. Requerido, por defecto `holder`. Solo lo escribe el servidor. |
| `field_organization` | entity_reference (organization) | Solo en alumnos de centro o gabinete: la organización en cuya licencia ocupan plaza. Nulo en alumnos de familia. **Creado en 17e** (subplan 10, 2026-10-29) junto con `field_released_by` (organization) y `field_released_at` (timestamp), que registran la liberación de §5.6. Los tres en `config/sync`; solo los escribe el servidor. |
| `field_adult_consent` | boolean | Aceptación en el registro ("soy mayor de edad y responsable del alumno"). Obligatoria en el registro anónimo (422 si falta); solo se escribe al crear la cuenta. |
| `field_adult_consent_at` | timestamp | Lo fija el servidor la primera vez que `field_adult_consent` pasa a verdadero. Vacío con consentimiento = cuenta anterior a la FASE 17. |
| `field_archived_at` | timestamp | Alumno archivado (§5.2). Solo lo escribe el servidor. |
| `field_avatar` | string (32) | Clave de un avatar del set de la app (alumnos). Sustituye a `user_picture` de §3.2. |

Implementación en el módulo `shine_account` (subplan 01a, 2026-10-23).

La relación titular-alumno no es un campo del usuario sino la entidad `learner_access` (§3.3),
porque un alumno puede tener más de un adulto que trabaje con él (docente y familia, §5.6).

Los usuarios existentes pasan a `holder` con una `hook_update_N`. Los datos que ya cuelgan de
ellos (niveles, sesiones) se conservan; si alguno es en realidad un alumno, se reclasifica a mano.

### 3.2 Alumno gestionado (usuario Drupal sin credenciales)

Se mantiene "un usuario Drupal = un alumno" para **no tocar** `shine_level`, sesiones,
`activitysummary`, feedback ni estadísticas, que siguen trabajando con `uid`.

- `field_account_kind = learner`, `field_display_name` = nombre o apodo, `field_avatar`
  opcional (clave de avatar). Quién puede operar con él lo dice `learner_access`.
- Sin email (se genera uno sintético no enrutable, `learner+{uuid}@shine.invalid`: el validador
  de Drupal lo acepta y mide 58 caracteres, dentro del límite de 60 del username; el correo a
  ese dominio se anula en `hook_mail_alter`), sin contraseña utilizable, rol `learner` (nuevo,
  sin permisos propios; Drupal no tiene permiso de "login").
- Un alumno puede, en el futuro, recibir credenciales propias (adolescente) cambiando el email y
  la contraseña; no hay migración de datos.
- **Idioma (FASE 18)**: `preferred_langcode` del alumno (`es` o `ca`), elegido en el alta. Todo lo
  que recibe (sesiones, actividades, textos de la app) va en ese idioma. Cambiarlo reinicia su
  progreso (niveles a Level0, resúmenes y valoraciones borrados, sesiones despublicadas, token
  revocado): dos idiomas son dos perfiles del mismo niño, y el cupo del plan los cuenta como dos
  alumnos.

### 3.3 Acceso al alumno: entidad `learner_access`

Entidad de contenido en `shine_account` (subplan 01b, 2026-10-23: el acceso al alumno existe
aunque no haya monetización). Una fila por pareja (índice único); revocar es `status = 0` y un
vínculo posterior de la misma pareja reactiva la fila. Las reglas de "quién puede qué" viven en un
solo sitio, el servicio `shine_account.learner_access_policy`:

| Campo | Tipo | Valores / notas |
|---|---|---|
| `field_learner` | entity_reference (user, learner) | El alumno. |
| `field_holder` | entity_reference (user, holder) | El adulto que puede operar con él. |
| `field_role` | list_string | `owner` (quien lo creó: familia o docente), `guardian` (familia vinculada por código), `staff` (otro docente del mismo centro). |
| `field_origin` | list_string | `created`, `invite`, `organization`. |
| `status` | boolean | Un acceso revocado se desactiva, no se borra (auditoría). |

Reglas:
- Único por (alumno, titular). Todo titular con `learner_access` activo puede pedir el token de
  alumno (§5.3), ver su progreso y generar sesiones; cada sesión registra quién la operó
  (`field_operated_by`, §5.6).
- Solo el `owner` (o un `coordinator` de la organización del alumno) edita nombre y avatar,
  archiva, invita a la familia o libera al alumno. El `guardian` no puede eliminar el perfil
  mientras el centro lo tenga en plaza; su "borrar cuenta" solo retira su propio acceso.
- Al crear un alumno se crea automáticamente su `learner_access` `owner`/`created`.
- El cupo de un plan (`max_learners`) se cuenta sobre los alumnos de los que el titular es
  `owner` y que no están en plaza de ninguna organización; los alumnos vinculados por invitación
  de un centro no consumen cupo del titular familiar mientras el centro los cubra.

### 3.4 Organización y membresía (canal profesional y centros)

Entidades de contenido nuevas en un módulo `shine_org`:

**`organization`**: `label`, `field_org_kind` (`practice` gabinete, `school` centro), `field_tax_id`,
`field_billing_email`, `field_owner` (user), `status`.

**`organization_membership`**: `field_organization`, `field_user` (titular), `field_role`
(`coordinator`, `professional`, `teacher`), `status`. Un titular puede pertenecer a varias
organizaciones.

Los alumnos de una organización son usuarios `learner` con `field_organization` fijado y un
`learner_access` `owner` del docente que los creó (más `staff` para otros docentes a los que el
coordinador dé acceso). Ocupan una plaza de la licencia del centro mientras `field_organization`
esté fijado; liberar al alumno (§5.6) pone el campo a nulo y libera la plaza. La derivación a la
familia se hace por invitación de vínculo (§5.6), nunca por transferencia ni por copia: hay un
solo perfil y un solo historial.

**Códigos de invitación**: entidad `organization_invite` (`code`, `field_organization`,
`field_role`, `field_max_uses`, `field_expires`). El profesional o docente lo introduce en la app
("Tengo un código de centro") y se crea la membresía.

### 3.5 Grupos de aula (plan Centro)

Entidad `learner_group`: `field_organization`, `label`, `field_teacher` (user), `field_learners`
(users). Sirve para el modo aula (§5.5) y para estadísticas de grupo. No forma parte de la v1 de
monetización; se especifica aquí para que el modelo lo admita sin cambios.

---

## 4. Entitlements

### 4.1 Entidad `entitlement` (módulo `shine_entitlement`)

| Campo | Tipo | Valores / notas |
|---|---|---|
| `field_holder` | entity_reference (user) | Titular cubierto. Para origen `organization`, el titular miembro. |
| `field_organization` | entity_reference (organization) | La licencia de un gabinete o centro (plan `professional` o `school`, cualquier origen: `manual` hoy, `stripe` en 11). **Añadido en 17e** (subplan 10) como campo base que aporta `shine_org` con `hook_entity_base_field_info()`. Un entitlement con organización no es el plan personal de su titular. |
| `field_catalog_plan` | entity_reference (`shine_entitlement_plan`) | **Añadido en 03 (2026-10-23)**: la entrada del catálogo de la que sale el cupo. Hace falta para calcular `max_learners` y para `recalc`: `field_plan` no basta (`courtesy` no tiene entrada propia y un centro puede tener varias). Nunca `free`. |
| `field_plan` | list_string | `family`, `professional`, `school`, `courtesy`. Vacío = el `plan` de la entrada del catálogo. |
| `field_source` | list_string | `app_store`, `play_store`, `stripe`, `organization`, `manual` |
| `field_status` | list_string | `active`, `trial`, `grace`, `billing_retry`, `paused`, `expired`, `revoked` |
| `field_starts_at` / `field_expires_at` | timestamp | `expires_at` nulo = sin caducidad (manual). |
| `field_max_learners` | integer | Copiado del catálogo de planes (§4.3) en el momento de crear o actualizar el entitlement: `learners_per_seat × quantity`. Denormalizado a propósito (ver §4.3). |
| `field_quantity` | integer | Asientos comprados (Stripe `quantity`; 1 en stores). |
| `field_external_id` | string | ID de suscripción en RevenueCat / Stripe. Único por source. |
| `field_raw_event` | json / text long | Último evento recibido, para auditoría. Solo lo ven los administradores. |
| `field_event_timestamp` / `field_last_event_id` | integer (ms) / string | Idempotencia de webhooks: se descarta todo evento anterior al último aplicado (07, 11). |
| `field_cancelled_at` | timestamp | Cancelación de la renovación (`CANCELLATION`): el acceso sigue hasta `expires_at`. |

Implementado en `shine_entitlement` (subplan 03, 2026-10-23); modelo completo, catálogo y
administración en `api-design.md`, "Entitlements".

Reglas:
- **Cubierto** = existe un entitlement del titular con status en {`active`, `trial`, `grace`,
  `billing_retry`} y (`expires_at` nulo o > ahora). `grace` y `billing_retry` dan acceso: la
  store sigue intentando cobrar y expulsar al usuario en ese momento es la primera causa de
  cancelaciones evitables.
- **Cobertura de un alumno**, en este orden (la primera que se cumpla decide):
  1. Su `field_organization` tiene un entitlement `school`/`professional` cubierto y el alumno
     está dentro de la plaza (`max_learners` de la organización, por orden de alta). Cubre a
     **todos** sus titulares, también a la familia vinculada: la plaza del centro incluye el uso
     en casa.
  2. Alguno de sus titulares con `learner_access` activo está cubierto por un plan personal
     (`family`, `courtesy`) y el alumno figura entre los primeros `max_learners` alumnos de los que
     ese titular es `owner` (orden de creación). **Lectura implementada en 04 (2026-10-23)**: la
     condición del cupo solo aplica si ese adulto es `owner`; un `guardian` o `staff` con plan
     cubre al alumno sin gastar su propio cupo (su cupo solo cuenta sus alumnos `owner`, §3.3).
  3. Prueba gratuita por sesiones (§4.4).
  Los alumnos que exceden un cupo quedan "en pausa", visibles pero no operables, hasta que se
  amplíe el plan o se archive otro. Mientras les quede prueba gratuita siguen jugando con ella
  (`covered_by: trial`); "en pausa" es lo que queda cuando ni el cupo ni la prueba los cubren.
  Un entitlement con `field_starts_at` futuro no cubre hasta esa fecha.
- Nunca se consume cupo ni prueba de la familia por un alumno que un centro ya tiene en plaza.
- `courtesy`/`manual` sirve para betas, logopedas colaboradores y soporte. Se crea desde el
  admin de Drupal.

### 4.2 Servicio `shine_entitlement.access`

```php
interface EntitlementAccessInterface {
  public function holderStatus(UserInterface $holder): HolderStatus;   // plan, status, source, expires_at, max_learners, covered, entitlement
  public function learnerCovered(UserInterface $learner): bool;
  public function canGenerateRegular(UserInterface $learner): AccessDecision; // allowed + coverage, o reason: trial_exhausted | learner_not_covered | learner_paused | released_by_organization; siempre completed_regular y free_regular_sessions
  public function coveredBy(UserInterface $learner): ?Coverage;             // organization | holder | trial, con el entitlement, el adulto y, si aplica, el nombre del centro
  public function maxLearners(UserInterface $holder): int;                  // cupo del plan vigente (sustituye a shine_account.learner_quota)
  public function canCreateLearner(UserInterface $holder): bool;
  public function completedRegular(UserInterface $learner): int;
  public function freeRegularSessions(): int;
}
```

Implementado en 04 (2026-10-23, `shine_entitlement/src/Access/`; detalle en `api-design.md`,
"Entitlements → Acceso"). `holderStatus()` no devuelve `learners_covered[]`: la cobertura va en
cada alumno de `GET /shine/me`. Caché en `cache.default` por usuario con etiquetas `user:{uid}`,
`entitlement_list`, `learner_access_list` y las de los usuarios consultados, de modo que guardar
un entitlement (webhooks, admin) o tocar accesos y alumnos invalida sin código extra; lo que
depende del reloj caduca por `expire`. La cobertura por organización (punto 1 de §4.1) es un
hueco, `OrganizationCoverageInterface`, que rellena el subplan 10.

### 4.3 Catálogo de planes (config entity `shine_entitlement.plan`)

De aquí salen los cupos. Es configuración exportable a `config/sync`, no código:

| Campo | Ejemplo Familia | Ejemplo Profesional | Ejemplo Centro (aula) |
|---|---|---|---|
| `id` | `family` | `professional` | `school_classroom` |
| `label` | Familia | Profesional | Centro, modo aula |
| `plan` | `family` | `professional` | `school` |
| `learners_per_seat` | 3 | 15 | 0 (sin perfiles individuales) |
| `groups_per_seat` | 0 | 0 | 1 |
| `external_ids` | `app_store:shine_family_monthly`, `app_store:shine_family_annual`, `play_store:shine_family_monthly`, `play_store:shine_family_annual` | `stripe:price_xxx_pro_monthly`, `stripe:price_xxx_pro_annual` | `stripe:price_xxx_classroom_annual` |

Añadido en 10 (2026-10-29): `school_individual` ("Centro, perfiles individuales", `school`, 1 alumno
por asiento, 0 grupos): la licencia de un centro que trabaja con alumnos individuales se compra por
plazas (`quantity` = alumnos). Un centro puede tener las dos.

Resolución en los webhooks:
- RevenueCat: `product_id` + `store` → busca en `external_ids` → plan y `learners_per_seat`;
  `quantity` = 1. `max_learners = learners_per_seat`.
- Stripe: `price_id` + `quantity` del ítem de suscripción → `max_learners = learners_per_seat ×
  quantity`. Ampliar un gabinete es subir `quantity` en Stripe; `customer.subscription.updated`
  recalcula.
- Manual/cortesía y licencias de centro creadas en el admin: el administrador elige el plan del
  catálogo y la cantidad; el cupo se calcula igual.
- Un `product_id` o `price_id` que no esté en el catálogo hace fallar el webhook con log en
  watchdog (canal `shine_entitlement`) y respuesta `422`, para que RevenueCat o Stripe lo
  reintenten una vez añadido.

Por qué el cupo se copia al entitlement en vez de leerse del catálogo en cada petición: para que
un cambio futuro del plan (p. ej. Familia pasa de 3 a 2) no afecte a quien ya compró con 3
mientras no cambie de plan, y para que la decisión de acceso no dependa de config en caliente.
Un comando `drush shine-entitlement:recalc [--plan=]` permite recalcular a propósito cuando sí
se quiera aplicar un cambio a todos.

### 4.4 Qué es gratis (prueba por sesiones)

- Registro, creación de alumnos (hasta `max_learners` del plan gratuito = 1), estadísticas de
  lo hecho.
- **Todas las sesiones de evaluación**, siempre: bloque inicial, periódicas y por racha. Nunca
  cuentan para la prueba ni requieren cobertura.
- **Las primeras `free_regular_sessions` sesiones regulares completadas de cada alumno**
  (parámetro en `shine_level.settings`, junto a X e Y; N = 8 desde 04, 2026-10-23). Se cuentan
  sesiones **publicadas** con `field_session_kind = regular` y `field_completed_at` no nulo del
  alumno. Una sesión regular generada pero no completada no consume cupo; una despublicada
  (pendiente caducada, reinicio de niveles) tampoco.
- Regla de ajuste de N: debe superar el número de regulares que, con X e Y vigentes, garantiza
  al menos una evaluación de ajuste (periódica a los Y días a tres sesiones por semana, o por
  racha). El objetivo es que "Mi progreso" muestre un cambio de nivel antes del muro. El
  formulario `/admin/config/shine/level` avisa si N es menor que `periodic_sessions +
  evaluation_sessions` (8 = 6 + 2 con los valores por defecto).
- Aviso suave en la app a partir de `free_regular_sessions - 3` ("te quedan 3 sesiones gratis").
- Sin prueba gratuita de store (evita doble prueba y tarjeta antes de ver valor).
- Abuso por re-creación de alumnos: no se mitiga; el plan gratuito permite un alumno y un alumno
  nuevo parte de Level0 en todas las áreas.
- Todo lo demás (regulares a partir de N+1, alumnos adicionales) requiere cobertura.

---

## 5. Flujos

### 5.1 Registro del titular

`POST /user/register?_format=json` como hoy, añadiendo `field_adult_consent: true`. Si falta,
`422`. Tras el registro la app lleva directamente a **crear el primer alumno** (no es un segundo
registro: una pantalla "¿Con quién vas a trabajar?" con nombre y avatar). No hay dashboard sin al
menos un alumno.

### 5.2 Alta, edición y archivo de alumnos

```
POST   /shine/learners                 {display_name, avatar?}      → 201 {learner uuid, covered: bool}
GET    /shine/learners                                              → lista con covered / paused por alumno
PATCH  /shine/learners/{uuid}          {display_name?, avatar?}
POST   /shine/learners/{uuid}/archive                               → libera cupo; datos conservados
```

El servidor crea el usuario `learner`, su `learner_access` `owner` y, si el titular actúa como
miembro de una organización (parámetro `organization` en el `POST`), fija `field_organization` y
comprueba la plaza del centro. En `POST` aplica el cupo que corresponda
(`422 {"error":"learner_limit","max":3}` si se excede, salvo que el plan permita crear en pausa).
`GET /shine/learners` devuelve, por alumno, `role` del titular, `covered_by`
(`organization` con el nombre del centro, `holder`, `trial` o `none`) y `completed_regular`.

FASE 18: `POST /shine/learners` acepta `langcode` (ausente = `es`) y `PATCH` con `langcode` cambia
el idioma con reinicio (`reset: true`), solo para el `owner`. Verificado de extremo a extremo en
el subplan 06 (docs/progress.md).

### 5.3 Trabajar "en nombre de" un alumno (token de alumno)

El titular se autentica con su token (password grant, sin cambios). Para operar como un alumno
la app pide un **token de alumno**:

```
POST /oauth/token
Authorization: Bearer {token del titular}
grant_type=shine_learner&client_id=shine_expo_app&learner={uuid}&scope=authenticated_user_access
→ 200 {access_token, expires_in: 43200}     (sin refresh_token; se vuelve a pedir con el del titular)
```

El servidor comprueba que existe un `learner_access` activo (alumno, titular) y que el alumno no
esté archivado, y emite un access token JWT **para el usuario alumno** con el mismo consumer
`shine_expo_app` y scope `authenticated_user_access`, caducidad de 12 h. Implementación (02,
2026-10-23): grant personalizado registrado como plugin `Oauth2Grant` de simple_oauth, todo en
`/oauth/token`. Se llama **`shine_learner`**, no `urn:shine:learner`, porque el gestor de plugins de
Drupal trata `:` como separador de derivativas. Detalle en `api-design.md`, "Token de alumno".

Con ese token, **todo el resto de la API funciona sin cambios**: JSON:API escribe `uid` del
alumno en logs, summaries y feedback; `session/generate` y `session/complete` operan sobre el
alumno; `shine_level` ajusta los niveles del alumno. Esta es la razón de mantener "un usuario =
un alumno".

Alternativa descartada: cabecera `X-Shine-Learner` con suplantación en servidor. Obligaría a
interceptar todas las escrituras JSON:API y el filtro `uid.id` de las lecturas.

Seguridad: el token de alumno no puede crear alumnos, pedir tokens ni cambiar la cuenta (el rol
`learner` carece de esos permisos). El `shine_session_access` existente sigue limitando sesiones
al `uid` propietario. El token lleva un claim `operated_by` con el UUID del titular que lo pidió;
`session/generate` lo copia a `field_operated_by` de la sesión creada.

### 5.4 Muro de pago

`POST /shine/session/generate` incorpora, **después** de decidir la rama del árbol de
`level-system.md` §6 y antes de escribir nada (implementado en 04, 2026-10-23, como una
puerta `SessionGateInterface` de `shine_level` que registra `shine_entitlement`):

```
$plan = $generator->plan($learner);              // árbol de decisión de level-system.md §6
if ($plan->branch === 'regular' && !$access->canGenerateRegular($learner)->allowed) {
  return 402 {"error":"payment_required",
              "reason":"trial_exhausted"|"learner_not_covered"|"learner_paused"|"released_by_organization",
              "branch":"regular", "free_regular_sessions": 8, "completed_regular": 8,
              "paused": false, "released_by": null,
              "holder_status": {plan, catalog_plan, status, source, expires_at, max_learners, covered, entitlement}}
}
```

`holder_status` es el del titular que opera (claim `operated_by` del token de alumno; sin él, el
`owner` más antiguo). La prueba gratuita es el último paso de la cobertura (§4.1), así que
`canGenerateRegular` ya la incluye. Forma exacta en `api-design.md`.

Toda rama que produzca una sesión de evaluación (`initial`, `continue_evaluation`, `evidence`,
`trigger_easy`, `trigger_hard`, `periodic`) queda fuera del gating. Solo la rama `regular`
consulta el cupo gratuito y la cobertura. `session/complete` no cambia: el muro se evalúa al
pedir la siguiente sesión, de modo que siempre llega tras una sesión completada y la app puede
mostrarlo con el resumen de progreso ("en estas 8 sesiones, Memoria de Trabajo ha pasado de
Level0 a Level1"). La app, al recibir `402`, muestra el paywall (Familia) o la pantalla "Tu
centro o profesional debe activar tu acceso" (si el titular es miembro de una organización sin
entitlement).

`GET /shine/me` incluye por alumno `covered_by`, `paused`, `blocked_reason`, `completed_regular`
y `free_regular_sessions` para el aviso suave y para el texto del muro (también en
`GET /shine/learners`).

`GET /shine/me` (nuevo) devuelve en una sola llamada: titular, `holder_status` (plan, status,
expires_at, max_learners, source), alumnos con su cobertura, y organizaciones con rol. La app lo
llama al arrancar y tras cada compra.

### 5.5 Modo aula (plan Centro, fase posterior)

```
POST /shine/groups/{uuid}/session   {levels: {area_uuid: "Level2", ...}}
```

Crea una sesión `field_session_kind = group`, `uid` = docente, `field_group` = grupo, con
actividades elegidas por el `SessionGenerator` a los niveles indicados (sin consultar
`userarealevel`). `session/complete` sobre una sesión `group` no escribe `userarealevel_log` ni
cambia niveles; registra summaries con `uid` del docente y `field_group`. Estadísticas de grupo:
fuera de alcance aquí.

### 5.6 Alumno compartido entre centro y familia

Caso: un centro trabaja individualmente con una alumna y quiere que la familia continúe en casa.
No hay transferencia ni copia: un solo perfil, un solo historial de niveles, dos adultos con
acceso. Mientras el centro la tenga en plaza, la familia no paga.

**Centro**
1. Contrata el plan Centro con perfiles individuales (§6.2) y firma el contrato de encargado de
   tratamiento. Se crean la organización y su entitlement `school`.
2. El coordinador invita a docentes con `organization_invite`; cada docente se registra como
   titular y entra el código → `organization_membership`.
3. La docente crea a la alumna desde su cuenta como miembro del centro:
   `POST /shine/learners {display_name, avatar, organization}` → `field_organization` = centro,
   `learner_access` `owner`, plaza consumida. El consentimiento de la familia para tratar los
   datos lo tiene el centro; la app no pide nada más.
4. Trabaja con ella individualmente (token de alumno; bloque inicial, regulares, ajustes).
5. Para que la familia siga en casa: `POST /shine/learners/{uuid}/invite` → entidad
   `learner_invite` (`code` de 6 caracteres, `field_learner`, `field_created_by`, un solo uso,
   caduca a los 14 días). La app lo muestra como texto y QR, y puede enviarlo por correo.
6. Ve en "Mi progreso" todas las sesiones, con la marca de dónde se hizo cada una
   (`field_operated_by` → centro o familia). Puede seguir trabajando en paralelo.
7. Al acabar el curso o cuando decida: `POST /shine/learners/{uuid}/release` → `field_organization`
   a nulo (plaza liberada), `learner_access` del personal del centro desactivados. El historial
   permanece con la familia. Si no hay ningún `guardian`, el alumno se archiva.

**Familia**
1. Se registra como titular (correo, contraseña, declaración de adulto responsable).
2. En "¿Con quién vas a trabajar?" elige "Tengo un código del centro":
   `POST /shine/learners/join {code}` → `learner_access` `guardian`/`invite`. Un código caducado o
   ya usado: `422 {"error":"invite_invalid"}`.
3. La alumna aparece con nombre, avatar y niveles ya calculados; no se repite el bloque inicial.
4. Trabaja en casa con las mismas sesiones. Sin muro: `covered_by = organization` ("acceso
   activado por {centro}"). No consume su prueba ni su cupo.
5. Ve el progreso completo, incluido el del aula.
6. Puede crear otros alumnos propios, que se rigen por el plan gratuito y Familia.
7. Cuando el centro libera a la alumna, `GET /shine/me` devuelve `covered_by = none` con
   `released_by = {centro}`; la app muestra "El centro ha dejado de cubrir el acceso de {alumna}.
   Para seguir, elige un plan". Si la prueba por sesiones ya se agotó durante el periodo del
   centro (se cuentan todas las regulares completadas, también las del aula), la siguiente
   regular devuelve `402 trial_exhausted`; las evaluaciones y las estadísticas siguen
   disponibles. La familia sigue siendo `guardian` mientras el centro tenga a la alumna; en el
   `release`, si no queda ningún `owner` activo, el `guardian` más antiguo se promueve a `owner`
   (misma regla que el borrado de cuenta de un `owner`, 01b) y a partir de ahí la alumna cuenta
   en su cupo como cualquier alumno propio.

**Alumna**
Mismo perfil en dos dispositivos. La sesión pendiente es única por alumno: si la docente genera
una y no la termina, en casa se abre esa misma sesión; la app lo indica ("sesión empezada en el
centro") y permite continuarla. No se permite descartarla desde otro dispositivo; si lleva más
de 7 días sin completarse, `session/generate` la despublica y crea una nueva (regla general,
no específica de este caso; parámetro `pending_max_days` de `shine_level.settings`, implementado
en 04).

Permisos resumidos: `owner` y `coordinator` del centro editan, invitan, liberan y archivan;
`guardian` opera, ve progreso y retira su propio acceso; `staff` opera y ve progreso. Implementado
en el servicio `shine_account.learner_access_policy` (01b); `coordinator` (sin `learner_access`,
por la membresía) y el `release` llegaron con las organizaciones (10, 2026-10-29; módulo
`shine_org`, detalle en `api-design.md`, "Organizaciones"). Decisiones de 10: el coordinador
gestiona pero no opera sin darse acceso `staff`; el `release` desactiva los accesos de origen
`organization` (el `owner` docente y los `staff`); `released_by` se informa durante
`released_notice_days` (30) mientras ningún plan cubra al alumno; una licencia de centro con
perfiles individuales es el plan de catálogo `school_individual` (un asiento por alumno).

El vínculo por código (pasos 5 de "Centro" y 2 de "Familia") está implementado en 01c
(2026-10-23) y vale igual para dos adultos de una misma familia: `POST /shine/learners/{uuid}/invite`
(solo `owner`; una invitación viva por alumno) y `POST /shine/learners/join {code}` (`guardian`;
`422 invite_invalid` sin distinguir motivo, `422 own_invite`, `429` por intentos). Detalle en
`api-design.md`, "Cuentas y alumnos".

---

## 6. Integración de pagos

### 6.1 Stores vía RevenueCat

- SDK `react-native-purchases` en la app (requiere development build EAS; Expo Go no sirve).
- `Purchases.logIn(holderUuid)` tras el login del titular: el `app_user_id` de RevenueCat es el
  UUID de Drupal del titular (`sub` de `/oauth/userinfo`). Nunca el del alumno.
- Productos: `shine_family_monthly`, `shine_family_annual` en ambas stores; un entitlement
  `family` en RevenueCat; una oferta por defecto con los dos.
- Webhook RevenueCat → `POST /shine/webhooks/revenuecat` (módulo `shine_entitlement`),
  autenticado por cabecera secreta. Eventos a mapear:

| Evento RevenueCat | Acción en `entitlement` |
|---|---|
| `INITIAL_PURCHASE`, `RENEWAL`, `UNCANCELLATION`, `PRODUCT_CHANGE`, `SUBSCRIPTION_EXTENDED`, `REFUND_REVERSED` | upsert `active`, `expires_at` = `expiration_at_ms`, `source` según `store`, plan y cupo del producto del evento |
| `period_type = TRIAL` en cualquiera de los anteriores | `trial` |
| `CANCELLATION` | no cambia el acceso; anota `cancelled_at`; expira sola al llegar `expires_at`. Con `cancel_reason = CUSTOMER_SUPPORT` es un reembolso: `revoked` inmediato (RevenueCat no tiene evento `REFUND`) |
| `BILLING_ISSUE` | `billing_retry` (acceso mantenido hasta el fin del periodo de gracia) |
| `EXPIRATION` | `expired` (`revoked` si `expiration_reason = CUSTOMER_SUPPORT`, `paused` si `SUBSCRIPTION_PAUSED`) |
| `SUBSCRIPTION_PAUSED` (Play) | solo anuncia la pausa al final del periodo; el estado lo cambia la `EXPIRATION` posterior |
| `TRANSFER` | mover los entitlements de store de `transferred_from` al titular de `transferred_to` |

Implementado en 07 (2026-10-26) tal como está en `api-design.md`, "Webhooks": la tabla anterior
hablaba de `REFUND`/`REVOKED`, que no existen en RevenueCat, y ponía `paused` en el
`SUBSCRIPTION_PAUSED`, que llega antes de que acabe el periodo pagado.

- Idempotencia: el entitlement es (`source`, `field_external_id` = `original_transaction_id`);
  guarda el `id` y el `event_timestamp_ms` del último evento aplicado y descarta los repetidos y
  los anteriores.
- Además del webhook, `GET /shine/me` puede refrescar bajo demanda consultando la API REST de
  RevenueCat (subscriber endpoint) si el entitlement local está a menos de 1 h de expirar; cubre
  webhooks perdidos.
- Restaurar compras: botón en el paywall que llama a `Purchases.restorePurchases()`; RevenueCat
  emite `TRANSFER` o reactiva.

### 6.2 Canal profesional y centros vía Stripe

- Portal web (puede ser el propio Drupal, con Commerce o con Stripe Checkout + Customer Portal)
  donde el profesional o el centro contrata. El checkout crea o reutiliza el titular por email.
- Webhook Stripe → `POST /shine/webhooks/stripe`: `customer.subscription.created/updated/deleted`,
  `invoice.paid`, `invoice.payment_failed` → entitlement `professional` o `school` con
  `source = stripe`, `field_organization` enlazada, `max_learners` según el producto/cantidad.
- Facturación con IVA y datos fiscales: Stripe Tax o facturación propia; fuera de este documento.
- En la app el profesional **nunca ve un paywall de store**: si no está cubierto se le indica
  que active o renueve desde la web (sin enlace de compra en iOS; texto neutro).

### 6.3 Principio de aislamiento

Ni la app ni los players conocen RevenueCat ni Stripe más allá del SDK de compra. El backend
solo consulta `entitlement`. Cambiar de proveedor es cambiar el receptor del webhook.

---

## 7. Cambios en la app

- **Onboarding**: registro → consentimiento de adulto → "¿Con quién vas a trabajar?" → bloque
  inicial. Si ya hay alumnos, selector de alumno tras el login (y en el avatar del dashboard).
- **Store de sesión** (`src/store/auth.ts`): guarda token del titular y token del alumno activo
  (`expo-secure-store`); `client.ts` usa el del alumno en todo lo que es actividad, sesiones,
  feedback y estadísticas, y el del titular en `/shine/learners*`, `/shine/me`, ajustes de cuenta
  y borrado.
- **`src/lib/api/me.ts`**: `getMe()`; store `entitlement` en Zustand con `covered`, `plan`,
  `expiresAt`, `learners[]`.
- **Paywall** (`app/(auth)/paywall.tsx`): precios desde el SDK (nunca hardcodeados), periodo,
  renovación automática, enlaces a términos y privacidad, "Restaurar compras". Variante
  "activa tu acceso desde tu centro" cuando el titular es miembro de una organización.
- **Manejo del `402`** en `sessions.ts` → navegación al paywall con `reason`.
- **Ajustes**: gestionar alumnos (crear, renombrar, archivar), ver estado del plan, "Gestionar
  suscripción" (abre la gestión de la store), **borrar cuenta** (obligatorio para Apple):
  `POST /shine/account/delete` que anonimiza titular y alumnos.
- **Código de centro**: pantalla "Tengo un código" → `POST /shine/organizations/join {code}`.
- **Build**: pasar de Expo Go a development builds EAS (`eas build --profile development`).

---

## 8. Requisitos de store y legales

- Pantalla de paywall con precio, duración, renovación automática y enlaces a Términos y
  Privacidad (Apple 3.1.2). Sin menciones a precios o compra en la web en iOS.
- Borrado de cuenta accesible desde la app (Apple 5.1.1 v).
- Plan Profesional/Centro activado por código: amparado por la excepción de organizaciones
  (Apple 3.1.3 c); Familia debe ser comprable por IAP (3.1.1).
- No publicar en categoría Kids; público declarado: familias y profesionales; rating de edad
  según contenido.
- RGPD: titular adulto con consentimiento explícito; alumnos sin email real ni edad; política
  de privacidad que describa las métricas de ejecución (tiempos, aciertos) y su finalidad; DPA
  para centros (encargado de tratamiento). Revisar si alguna métrica debe tratarse como dato de
  categoría especial y documentar la base jurídica.
- Elección de modelo de pago en la UE (Apple): IAP; se mantiene 12 meses.

---

## 9. Instrumentación mínima del embudo

Eventos (en un módulo `shine_analytics` o vía RevenueCat + un proveedor ligero):
`holder_registered`, `learner_created`, `initial_block_completed`, `paywall_viewed`,
`trial_started`, `subscription_started`, `subscription_renewed`, `subscription_cancelled`,
`session_regular_completed` (semanal por titular). Con esto, retención a 4 semanas y
conversión bloque inicial → pago, que son las dos cifras que deciden el precio.

---

## 10. Fases de ejecución

**17a. Modelo de cuentas (backend)**: campos de usuario, rol `learner`, entidad `learner_access`
(§3.3) con su política de acceso, endpoints `/shine/learners*` (alta, edición, archivo, retirada
de acceso), `/shine/me` (con `hook_shine_me_alter` para que 17c y 17e añadan lo suyo),
`POST /shine/account/delete` (la parte de servidor del borrado de cuenta: anonimiza titular y
alumnos sin otro adulto), token de alumno, `hook_update_N` de reclasificación, tests kernel (alta
con cupo, token solo para alumnos propios, archivo libera cupo y revoca tokens, borrado con alumnos
compartidos).

**17c. Entitlements**: entidad, catálogo de planes, servicio de acceso, gating en
`session/generate` (402), admin de cortesías, `free_regular_sessions` en
`shine_level.settings`; tests: todas las
ramas de evaluación libres; regular N+1 bloqueada sin cobertura y permitida con ella; regular
generada y no completada no consume; `grace` cubre; alumno 4.º en pausa.

**17b. Modelo de cuentas (app)**: onboarding con primer alumno, selector de alumno, doble token
en `client.ts`, gestión de alumnos en ajustes, pantalla de borrado de cuenta (el endpoint es de
17a).

**17d. Stores**: EAS development build, SDK RevenueCat, productos en App Store Connect y Play
Console, paywall, webhook `revenuecat`, restaurar compras, pruebas en sandbox y TestFlight /
pruebas internas de Play.

**17e. Organizaciones y canal web**: `shine_org` (organizaciones, membresías, códigos de centro,
alumnos en plaza, cobertura por organización, accesos `staff`, `release` del alumno y
`field_organization` en usuario y entitlement; subplan 10, 2026-10-29), Stripe Checkout y webhook
(11), pantalla de código en la app, estado "activa tu acceso desde tu centro" (12).

**17f. Modo aula** (posterior): grupos, sesión `group`, estadísticas de grupo.

Orden recomendado: 17a → 17c → 17b → 17d → 17e. 17a y 17c antes de cualquier publicación.

---

## 11. Decisiones pendientes

- X, Y y N (`free_regular_sessions`): N se fija en función de X e Y para garantizar una
  evaluación de ajuste dentro de la prueba. Hipótesis N = 8.
- Cupo exacto de Profesional y precio de ampliación.
- Derivación centro → familia: **cerrada** (§5.6, implementada en 01c y 10): vínculo por código,
  nunca transferencia ni copia; el `release` promueve al `guardian` a `owner`.
- Facturación profesional: Drupal Commerce vs Stripe Checkout + facturación externa.
- Precios de partida de Familia (mensual y anual): pendientes desde el subplan 09 (2026-10-29).
- Nombre definitivo de la app, bundle id y package: bloquean el registro en las dos stores
  (14b). Titular legal de las cuentas: persona física (autónomo); efectos en `docs/stores.md` §1.
- Ficha: categoría Educación, no Kids; clasificación por edades según el cuestionario.
