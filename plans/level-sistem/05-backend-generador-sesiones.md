# 05. Backend: generador de sesiones y endpoint de generación

- **Modelo recomendado: Fable.** Orden de prioridad entre disparadores, rotación de áreas,
  ventana de no repetición, ciclos obligatorios y techo por contenido. Muchos caminos y todos
  tienen que producir una sesión válida o una razón clara de por qué no.
- Fase: 15. Alcance: solo Drupal.
- Dependencias: 01b (sesiones con dueño), 04 (reglas y rachas).

## Prompt

Lee `docs/level-system.md` §6 y §7 completos, §5.2 (formatos de evaluación) y §8, más el
estado de `shine_level` tras 03 y 04.

Objetivo: servicio `shine_level.session_generator` que crea un nodo `session` para un usuario
siguiendo el pseudocódigo de §6, y endpoint `POST /shine/session/generate` que lo invoca.

Tareas:

1. **Endpoint `POST /shine/session/generate`**: auth OAuth; si el usuario ya tiene una sesión
   pendiente (propia, publicada, sin `field_completed_at`), devuelve esa en lugar de crear
   otra (200 con la sesión existente; 201 si se ha creado). Respuesta: el `uuid` y el `nid`
   de la sesión, el `kind` y la `reason`, para que la app pueda navegar directamente.
   Protege contra dobles clics con un lock por usuario (`\Drupal::lock()`).
2. **Árbol de decisión de §6** en ese orden exacto, apoyándote en `shine_level.evaluator`
   para rachas y en el repositorio para evidencia y estado del bloque inicial. Hay que
   contemplar también "evaluación de 2 sesiones a medias": busca la última sesión de ajuste
   completada del usuario con `field_evaluation_seq = 1` y sin pareja `seq = 2`, y genera la
   segunda con la misma `reason` y `scope`.
3. **`sesionAjuste`**: una actividad por área del alcance con `field_main_area = area` y
   `field_activity_level` que contenga `probe_level`; excluir las usadas en evaluaciones
   anteriores del usuario mientras queden alternativas; si un área no tiene contenido en
   `probe_level`, aplicar el techo (§5.5) bajando el `probe_level` y registrando en el log de
   watchdog (canal `shine_level`) que se ha capado. La dirigida por evidencia lleva
   `targeted_activities` actividades de la misma área.
4. **`sesionRegular`**: `regular_slots` huecos con rotación simple (`area_selection =
   rotation`; implementa también `weakest_first` leyendo el radar si el cálculo ya existe en
   servidor, y si no, déjalo documentado como no implementado y que el formulario lo avise);
   la rotación arranca en el área siguiente a la que abrió la última sesión regular del
   usuario; candidatas por área y nivel excluyendo las hechas en las últimas `recent_window`
   sesiones del usuario (consulta `activitysummary` por sesión); degradación de nivel hasta
   Level0 y salto del hueco si sigue vacío. Más el hueco de ciclo.
5. **Ciclos (§7)**: `siguienteDelCiclo(usuario)` tal como lo define el diseño (menos summaries
   del usuario, luego menor `field_cycle_weight`, luego aleatoria). Las actividades con
   `field_cycle` no entran por los huecos de área ni se filtran por nivel. Nunca dos del mismo
   ciclo en una sesión; solo en sesiones regulares.
6. **Título y presentación del nodo**: título generado ("Sesión 12", "Sesión para conocerte 2",
   "Sesión de ajuste") pensado para la tarjeta de la app; `uid` del usuario; `status = 1`;
   `field_session_kind`, `field_evaluation_scope`, `field_evaluation_reason`,
   `field_evaluation_seq` según corresponda.
7. **Tests kernel** con fixtures: usuario en `evaluating` recibe sesión `initial` con una
   actividad por área no cerrada; evidencia por encima del umbral produce la dirigida; racha
   de 3 `easy` produce `trigger_easy` con `probe_level + 1`; periódica solo si se cumplen las
   dos condiciones; sesión regular no repite actividades en la ventana; el ciclo avanza y da
   la vuelta; `generate` dos veces seguidas devuelve la misma sesión.
8. Comando drush de apoyo para pruebas manuales: `ddev drush shine-level:generate {uid}` que
   imprime qué rama del árbol se ha tomado y por qué (reutilizable en el subplan 09).

Verificación:
- Tests en verde.
- Con un usuario normal por OAuth: `generate` devuelve una sesión `initial`, visible en
  `GET /jsonapi/node/session` para ese usuario y no para otro.

Al terminar: marca la fila en `plans/level-sistem/README.md`, documenta el endpoint y el
comando drush en `docs/api-design.md` y `CLAUDE.md`, y actualiza `docs/progress.md`.
