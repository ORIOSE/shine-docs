# FASE 20. Secuencia con regla (segundo tipo de Funciones Ejecutivas y Atención)

Opción (d) de la propuesta E10.4, que el grupo dejó como segundo tipo del área (respuesta del
2026-10-29). Propuesta de mecánica y parámetros: `plans/contenido/encarrecs/E13-sequencia-amb-regla.md`.

## Decisiones cerradas (grupo de expertos, 2026-10-29)

Respuesta en `plans/contenido/encarrecs/lliuraments/E13-resposta.md`: las 13 preguntas aprobadas.
Mecánica, familias y niveles de entrada, ritmos, número de elementos y duración, acierto efectivo
Pr ("innegociable"), tiempo de reacción solo en estadísticas, práctica en Level0, Level2, Level5 y
Level6, pulso neutro, regla oculta en Level9 y Level10, pausa del adulto, apertura con 3 por celda
(que con las 3 de la matriz con regla dan las 6 del área). Área secundaria: **Rendimiento y
Velocidad de Procesamiento**, porque el ritmo lo marca la app (la pone el lote).

Todo lo que el grupo puede cambiar (ritmo, número de elementos, objetivos, cebos, práctica, regla
oculta) va en el lote, no en el código.

## Mecánica (resumen de E13)

Los elementos (símbolos, letras o sílabas) aparecen de uno en uno en una tarjeta central a ritmo
fijo (`ms_visible` + `ms_pausa`). El niño toca un botón grande solo cuando el elemento cumple la
regla. Un toque durante el elemento o la pausa que lo sigue cuenta para ese elemento; varios toques,
uno. Sin feedback de acierto en el juego (pulso neutro); práctica opcional de 6 elementos con
feedback, que no puntúa; pausa del adulto (el elemento interrumpido no cuenta).

| Regla | Objetivo | Cebo |
|---|---|---|
| s1 detección | el elemento `objetivo` | todos los demás (no hay cebo específico; las falsas alarmas se cuentan sobre ellos) |
| s2 todos menos | todo lo que no es `excepto` | el elemento `excepto` |
| s3 después de | `objetivo` justo después de `contexto` | `objetivo` sin `contexto` justo antes, y lo que sigue a `contexto` sin ser `objetivo` |
| s4 alternancia | el objetivo de su fondo (`fondos.claro` / `fondos.oscuro`) | el objetivo del otro fondo |

Elementos que no son ni objetivo ni cebo: neutros (un toque sobre ellos es una "falsa marca").

## Modelo de datos

**Node type `activity_rule_sequence`** (código `SEQ-XX-Lnn-ATE-nnn`, área principal Funciones
Ejecutivas; secundaria Velocidad, que pone el lote). Campos comunes clonados de
`activity_letter_matrix`; propios:

| Campo | Tipo | Qué |
|---|---|---|
| `field_elements` | string, múltiple | Los elementos en orden |
| `field_dark_items` | string_long | Índices (0 = primero) con fondo oscuro, separados por espacios (solo s4) |
| `field_sequence_rule` | list_string s1 a s4 | Familia de la regla |
| `field_rule_params` | string_long (storage de la FASE 19) | JSON de la regla canónica (`SequenceRule::canonical`) |
| `field_target_cells`, `field_lure_cells` | string_long (storages de la FASE 19) | Un valor: índices de objetivos y de cebos, calculados por el importador |
| `field_stimulus_ms`, `field_gap_ms` | integer | Tiempo visible y pausa por elemento |
| `field_practice` | string_long | JSON `{"elementos": [...], "oscuros": [...]}` de la práctica, o vacío |

**Log `logrulesequence`**: uno por objetivo, por cebo y por toque sobre un neutro. Comunes de
`loglettermatrix` (`field_item` = elemento, `field_weight` = posición, `field_time` = tiempo de
reacción en ms o 0 sin toque, `field_correct`) y `field_response` (list_string: `hit`, `miss`,
`lure_tap`, `lure_ok`, `false_tap`).

**Summary `summary_rule_sequence`**: comunes de `summary_letter_matrix` con `field_correct_count`
(objetivos tocados), `field_items_count` (objetivos), `field_lure_marks` (cebos tocados) y
`field_false_marks` (toques sobre neutros); nuevos `field_lures_count` (cebos presentados),
`field_reaction_ms` (media del tiempo de reacción de los aciertos) y `field_reaction_sd_ms`
(desviación típica).

## Subplanes

1. **Modelo en Drupal**: script `private/scripts/fase20-01-backend.php` (patrón de
   `fase16-backend.php`), `drush cex`, `ACTIVITY_BUNDLES` de `Sessionfeedback` y `Activityfeedback`
   con sus `hook_update_N`, `node.session.field_activities`, motivación y `explanation_message`
   "Rule sequence".
2. **Importador**: `SequenceRule` (validar, forma canónica, clasificar) y
   `RuleSequenceActivityHandler` (prefijo SEQ; claves `regla`, `elementos`, `oscuros`, `objetivos`,
   `cebos`, `ms_visible`, `ms_pausa`, `practica`), con kernel tests. Composición que valida: al
   menos 5 objetivos, ninguno en los 3 primeros elementos, ningún par especular b/d/p/q entre
   objetivo, cebo y neutros.
3. **Evaluador**: si el summary tiene `field_lures_count`, acierto efectivo = objetivos tocados /
   objetivos − cebos tocados / cebos (índice Pr, E13 punto 4) contra `accuracy_floor` (0,6). Test.
4. **App**: `src/lib/ruleSequence.ts` (clasificar como el PHP, asignar toques a elementos,
   puntuar, media y desviación del tiempo de reacción) con tests; kind `ruleSequence.ts`,
   `RuleSequencePlayer` (reloj con `setTimeout` encadenado y `Date.now()`, `onPressIn` para el
   tiempo de reacción, práctica, pausa, regla en chips oculta al empezar si `oculta`), tipos, carga
   en la sesión, router, estadísticas (aciertos) e icono; tests de payload.
5. **Generador y lotes**: `generadores/secuencia_regla.py` con la tabla de E13 apartado 5, lotes
   bilingües (`idiomas` [es, ca]) de Level0 a Level10, 3 por celda (régimen de apertura).
   Importados **sin publicar** hasta la respuesta del grupo y la revisión de lotes.
6. **Mensajes y verificación**: cuatro `explanation_message` por familia (es y ca); recorrido como
   usuario normal por la API y en Expo web; docs (`activity-system.md`, `exercise-catalog.md`,
   `level-system.md`, `progress.md`, CLAUDE.md).
