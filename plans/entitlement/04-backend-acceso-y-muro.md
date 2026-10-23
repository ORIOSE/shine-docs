# 04. Backend: servicio de acceso, prueba por sesiones y muro en `session/generate`

- **Modelo recomendado: Fable.** Lógica de derivación de estado con casos límite (orden de
  cobertura de §4.1 con varios adultos, `grace`, cupo por orden de creación, sesiones gratis
  contadas en todos los dispositivos) y un punto de extensión en `shine_level` que no puede romper
  lo existente.
- Fase: 17, parte 17c. Alcance: Drupal (`shine_entitlement`, `shine_level`, `shine_account`).
- Dependencias: 01c (`learner_access` con roles, `/shine/me`) y 03 (entidad y catálogo).

## Prompt

Lee `docs/monetization.md` §3.3 (último punto, cupo), §4.1 ("Cobertura de un alumno"), §4.2,
§4.4, §5.4 y §5.6 (párrafo "Alumna": sesión pendiente única y regla de 7 días),
`plans/entitlement/README.md` ("Decisiones técnicas": seams de cupo y de puerta, orden de
cobertura, sesión pendiente caducada), `docs/level-system.md` §6 y §8, y en `shine_level`:
`SessionGenerator` (`generate`, `pendingSession`, `plan`, `create`), `SessionPlan`,
`GenerationResult`, `SessionEvaluator::countCompletedSessions`, `SessionGenerateController`,
`SettingsForm` y los tests kernel. Trabaja en `shine/` con `ddev`.

Tareas:

1. **Parámetros en `shine_level.settings`**: `free_regular_sessions` (8) y `pending_max_days`
   (7), con esquema, `config/install`, formulario `/admin/config/shine/level` (texto de ayuda;
   aviso si N no supera `periodic_sessions + evaluation_sessions`) y `shine_level_update_N` que los
   añada a la config existente. Exporta `shine_level.settings.yml` y documenta en
   `docs/level-system.md` §8.
2. **Sesión pendiente caducada** (`shine_level`): `pendingSession()` despublica (sin borrar) una
   pendiente con `created` anterior a `pending_max_days` días y deja constancia en watchdog; el
   árbol genera otra. Una sesión despublicada no cuenta en `countCompletedSessions` (ya exige
   `field_completed_at`; comprueba que `countSessions` y la rotación tampoco la cuentan). Test.
3. **Puerta en `shine_level`**: interfaz `SessionGateInterface::check(AccountInterface $learner,
   SessionPlan $plan): ?GateDenial` (valor con `reason` y `payload`), colector por etiqueta
   `shine_level.session_gate`, y en `SessionGenerator::generate()` la consulta entre `plan()` y
   `create()` (dentro del lock, antes de escribir nada). Si una puerta deniega, lanza
   `SessionGatedException`; el controlador responde `402 {"error":"payment_required", "reason":
   ..., "free_regular_sessions": N, "completed_regular": n, "holder_status": {...}}` (§5.4).
   `shine-level:generate --dry-run` imprime la decisión de las puertas. Sin puertas registradas no
   cambia nada: los tests actuales de `shine_level` deben pasar sin modificarlos.
4. **Servicio `shine_entitlement.access`** (`EntitlementAccessInterface` de §4.2 más
   `maxLearners(holder)` y `canCreateLearner(holder)`), con `HolderStatus` y `Coverage` como
   objetos de valor. Reglas:
   - Titular cubierto = §4.1 (`active`, `trial`, `grace`, `billing_retry`, y `expires_at` nulo o
     futuro). Varios entitlements: el de mayor `max_learners`; a igualdad, el de caducidad más
     lejana. Sin ninguno: plan `free` del catálogo (`max_learners` 1, `covered` false).
   - `coveredBy(learner)` sigue el orden de §4.1: (1) plaza de organización (hasta 10 siempre
     NULL; deja el hueco con una interfaz `OrganizationCoverageInterface` que 10 implementa); (2)
     cualquier adulto con `learner_access` activo cubierto por plan personal y el alumno entre los
     primeros `max_learners` alumnos activos de los que **ese** adulto es `owner`, por `created`;
     (3) `trial` si `completed_regular < free_regular_sessions`; si no, NULL. Los que exceden cupo
     son `paused`.
   - `canGenerateRegular(learner)`: permitido si `coveredBy` no es NULL. Razones de denegación:
     `trial_exhausted` (nadie lo cubre y la prueba agotada), `learner_paused` (algún adulto
     cubierto pero el alumno fuera de su cupo), `learner_not_covered` (archivado o sin ningún adulto
     activo), `released_by_organization` (lo activa 10).
   - `completed_regular` = `countCompletedSessions($learner, 'regular')`: cuenta todas, las haya
     operado quien las haya operado (§5.6).
   - Caché por usuario con etiquetas `user:{uid}`, `entitlement_list`, `entitlement:{id}` y la
     lista de `learner_access`; invalidar al guardar un entitlement y al crear, vincular, retirar o
     archivar un alumno.
5. **Enchufes**: la puerta `EntitlementGate` (etiqueta `shine_level.session_gate`) que llama a
   `canGenerateRegular` **solo cuando `$plan->branch === 'regular'`** (todas las ramas de evaluación
   quedan libres, §5.4); sustitución del servicio `shine_account.learner_quota` por una
   implementación que lea `maxLearners` del acceso; `hook_shine_me_alter` que añade `holder_status`
   y, en cada alumno, `covered_by` (`organization` con nombre, `holder`, `trial` o `none`),
   `paused`, `completed_regular` y `free_regular_sessions` (también en `GET /shine/learners`).
6. **Tests kernel** (en `shine_entitlement`, montando `shine_level` y `shine_account`): bloque
   inicial y periódica libres con la prueba agotada; regular bloqueada al llegar a N sin cobertura
   (402 en el controlador, nada creado, sin lock colgado); regular generada y no completada no
   consume; regular permitida con `grace` y con `billing_retry`; `expired` y `revoked` no cubren;
   `manual` con `expires_at` nulo cubre; cuarto alumno de un plan de 3 en pausa y el archivo del
   primero lo libera; alumno con dos adultos: cubierto si cualquiera de ellos lo cubre, y el
   `guardian` no gasta su propio cupo; dos entitlements eligen el de mayor cupo; invalidación de
   caché al guardar un entitlement; pendiente de 8 días despublicada y nueva creada.
7. **Documentación**: `docs/api-design.md` (402 en `session/generate`, `holder_status` y
   `covered_by` en `/shine/me` con ejemplo), `docs/monetization.md` §4.4 y §5.4 si algo difiere.

Verificación:
- Usuario normal con alumno sin entitlement: N regulares completadas (baja N a 1 en el formulario
  para probar) y la siguiente `POST /shine/session/generate` devuelve 402 con `reason:
  trial_exhausted`, `completed_regular` y `holder_status`; una evaluación pendiente en ese momento
  sí se genera.
- Crear una cortesía desde el admin y repetir: 201 sin reiniciar nada (caché invalidada).
- Con el alumno compartido de 01c: cortesía solo para B y A genera la regular igualmente
  (`covered_by: holder`).
- `GET /shine/me` muestra `holder_status` y `covered_by`/`paused` por alumno coherentes con el cupo.
- Tests de `shine_level`, `shine_account` y `shine_entitlement` en verde; `drush cim -y`
  idempotente; watchdog sin errores nuevos.

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md` y
`CLAUDE.md` (endpoints custom: 402; comandos útiles: `--dry-run` muestra la puerta). **Hito H1**
queda a falta de 05, 06 y 06b.
