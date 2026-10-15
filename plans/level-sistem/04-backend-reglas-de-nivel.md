# 04. Backend: reglas de nivel y cierre de sesión

- **Modelo recomendado: Fable.** Es el corazón del sistema: derivación de estado con tablas
  de casos, rachas, evidencia, salvaguardas e idempotencia. Hay que decidir además cómo se
  entera el servidor de que una sesión ha terminado.
- Fase: 15. Alcance: solo Drupal.
- Dependencias: 02 (`activityfeedback`), 03 (`shine_level` base).

## Prompt

Lee `docs/level-system.md` §3, §5 completo y §8, el README de `plans/level-sistem/` (apartado
"Decisiones técnicas que el diseño no cubre") y el módulo `shine_level` tal como lo dejó el
subplan 03. Lee también `shine-app/src/lib/sessionRun.ts` (`shouldAskSessionFeedback`) para
entender cuándo sabe la app que una sesión ha terminado.

Objetivo: un servicio `shine_level.evaluator` que, dado un nodo `session` completado por su
dueño, aplique las reglas de §5 sobre las filas `userarealevel` del usuario y deje rastro en
`userarealevel_log`. Toda la lógica de §5 vive aquí; el generador (05) solo consulta estado.

Tareas:

1. **Cierre de sesión.** Implementa el endpoint `POST /shine/session/{uuid}/complete`
   (controlador en `shine_level`, auth por OAuth como el resto de la API, respuesta JSON).
   Reglas: solo el dueño de la sesión; idempotente (si ya se procesó, devuelve el mismo
   resultado sin volver a mover nada; guarda la marca en el nodo con un campo
   `field_completed_at` que añades en este subplan); antes de procesar verifica contra
   `activitysummary` que cada actividad de `field_activities` tiene al menos un summary del
   usuario en esa sesión; si falta alguna, 409 con la lista. Razona y documenta por qué un
   endpoint explícito y no un hook sobre `sessionfeedback`/`activityfeedback` (pista: una
   sesión regular puede cerrarse con la auto-evaluación saltada, y en una de ajuste no hay
   un "último" evento fiable).
2. **Sesión regular completada** (§3.1, §5.3, §5.4): lee el `sessionfeedback` de la sesión si
   existe; aplica la tabla de evidencia de §5.4 sobre el área principal de
   `easiest_activity` / `hardest_activity`; las rachas de `overall` no se almacenan: se
   derivan del histórico de `sessionfeedback` del usuario ordenado por sesión (expón
   `getStreaks(user)` para que 05 lo use). No muevas niveles.
3. **Sesión de ajuste completada** (§5.1 y §5.2): lee los `activityfeedback` de la sesión.
   - Si `field_evaluation_reason = initial` (bloque inicial): tabla de §5.1 por área, un solo
     `easy` sube `probe_level`; cierre del bloque cuando todas cerradas o al alcanzar
     `initial_max_sessions` (cuenta las sesiones `initial` completadas del usuario); al cerrar,
     `field_onboarding_state = regular` y un log por área con `reason = initial`.
   - Resto de razones: una evaluación son `evaluation_sessions` sesiones (2) enlazadas por
     `field_evaluation_seq`; la regla de §5.2 se ejecuta al completar la última (o la única,
     en `evidence`, que lleva `targeted_activities` actividades de la misma área). Para
     agrupar valoraciones de las dos sesiones, consulta los `activityfeedback` de ambas
     (misma `reason`, mismo usuario, posteriores a `last_evaluated` del área). Documenta el
     criterio de agrupación en `docs/level-system.md` §5.2.
   - Tras la evaluación: `probe_level = level`, `evidence = 0`, `last_evaluated = ahora` en
     las áreas incluidas; log por cada cambio.
4. **Salvaguardas (§5.5)**: techo por contenido con `LevelLadder::hasContent`; freno por
   aciertos leyendo `field_correct_count` / `field_items_count` del summary de esa actividad y
   sesión (si `items_count > 0` y ratio `< accuracy_floor`, un `easy` cuenta como `ok`; el
   `activityfeedback` no se modifica); histéresis con `min_ratings_after_change` (cuenta
   valoraciones en evaluación desde el último log del área).
5. **Tests kernel** con fixtures mínimos (5 áreas, 3 niveles, actividades por área y nivel):
   - Escalera inicial: `easy, easy` lleva a Level2 y cierra por techo; `easy, hard` deja Level0;
     `ok` cierra en el nivel probado; saltada no cambia y se vuelve a probar.
   - Cierre forzado a las 4 sesiones.
   - Periódica: `easy+easy` sube; `hard+hard` baja; `easy+hard` no cambia; una sola valoración
     no cambia.
   - Freno por aciertos convierte `easy` en `ok`.
   - Idempotencia del endpoint.
   - Evidencia: `overall=easy` + `easiest` suma al área principal; `hard` + `hardest` resta.
6. Exporta config (`field_completed_at`, rutas, permisos).

Verificación:
- Tests kernel en verde.
- Con un usuario normal y OAuth real: crear una sesión de ajuste a mano, hacer las
  actividades, enviar `activityfeedback` y llamar a `/complete`; comprobar en
  `userarealevel` y en el log el resultado esperado. Repetir la llamada: sin cambios.

Al terminar: marca la fila en `plans/level-sistem/README.md`, documenta el endpoint en
`docs/api-design.md` y en `CLAUDE.md` ("Endpoints"), y actualiza `docs/progress.md` y
`docs/level-system.md` con las decisiones tomadas.
