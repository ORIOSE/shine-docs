# 04. Estadísticas en PHP (`shine_stats`): paridad con la app, servicio, endpoint y "Rendimiento" de la ficha

- **Agente recomendado: Fable 5.1.** Es una portabilidad numérica con casos límite (listas vacías,
  summaries antiguos sin área ni contadores, zonas horarias, "hoy" inyectado) cuyo criterio de éxito
  es dar exactamente los mismos números que la app. Un error aquí enseña a una familia un progreso
  distinto del que ve en el móvil.
- Fase: 21. Alcance: Drupal (`shine/`): módulo nuevo `shine_stats`, sección "Rendimiento" de la
  ficha de alumno en `shine_panel`; en la app (`shine-app/`) solo un test de paridad que lee los
  mismos fixtures. No cambia ninguna pantalla de la app.
- Dependencias: 02 (concha del panel y acceso); se ejecuta en paralelo con 03, que crea la ficha.
  Si 03 no ha terminado, deja la sección preparada como un bloque que 03 incrusta
  (`shine_stats.performance_block`).

## Prompt

Lee `docs/statistics-design.md` entero (fuente de datos, módulo `src/lib/stats/`, pantallas y el
principio de no desmoralizar), `plans/design/README.md` ("Principio rector del diseño de
estadísticas") y `plans/design/06-progreso-estadisticas.md`, `docs/dashboards.md` §7.4 y §10.1, el
módulo TypeScript completo `shine-app/src/lib/stats/` (`index.ts`, `types.ts`, `adapter.ts` y las
once funciones con sus tests en `__tests__/`, incluido `helpers.ts`), las pantallas que lo consumen
(`shine-app/app/(auth)/statistics/index.tsx` y `shine-app/src/components/statistics/*.tsx`) para
saber qué se dibuja y con qué datos, el prototipo `docs/lovable/panel/src/components/shine/charts.tsx`
(qué gráficas espera la ficha) y `docs/lovable/INDEX.md` (sección 5). En Drupal, lee
`activitysummary` (bundles y campos: `field_time`, `field_iteration`, `field_correct_count`,
`field_items_count`, `field_repetitions`, `field_main_area`, `field_activity_level`,
`field_activityid`, `field_sessionid`, `uid`, `created`) y `shine_level` (`LevelRepository`,
`userarealevel_log`). Trabaja en `shine/` y, para el test de paridad, en `shine-app/`.

Tareas:

1. **Módulo `shine_stats`** (`package: shine`, depende de `activitysummary`, `shine_account`,
   `shine_level`): espacio `Drupal\shine_stats\Calc\` con una clase por función de la app,
   **misma firma y mismo nombre** (`MovingAverage::compute`, `PersonalBest`, `BaselineVsRecent`,
   `Streak`, `WeeklyBuckets`, `AreaAggregation`, `Accuracy`, `Rate`, `AreaRadar` con
   `areaToPractice`, `strongestArea` y las constantes `BASELINE_SCORE`, `MIN_SCORE`, `MAX_SCORE`,
   `STEP_MAIN`, `STEP_SECONDARY`, y `RadarAdapter::toRadarFeedback`), un objeto de valor
   `StatsSummary` idéntico a `types.ts` y `SummaryAdapter::fromEntity()` equivalente a
   `toStatsSummary` pero desde la entidad `activitysummary` (no desde JSON:API). Todo puro: sin
   servicios de Drupal, sin reloj global. Las funciones que dependen de "hoy" (`streak`,
   `weeklyBuckets`) reciben `\DateTimeImmutable $now` y una `\DateTimeZone`; el `dayKey` se calcula
   en esa zona (en la app es la del dispositivo; en el panel, la zona del titular, `user->getTimeZone()`,
   por defecto la del sitio).
2. **Paridad probada**: fixtures JSON en `shine_stats/tests/fixtures/parity/*.json`, uno por
   función, con `input`, `now`, `timezone` y `expected`, cubriendo los casos de los tests TS
   (vacíos, incompletos, bordes de semana, racha vigente hoy y ayer, mejora solo si supera el 10 %,
   nunca negativa). Test PHP `ParityTest` (kernel no hace falta: unit) que recorre los fixtures.
   En la app, `shine-app/src/lib/stats/__tests__/parity.test.ts` lee **los mismos ficheros** por
   ruta relativa (`../../../../../shine/public_html/modules/custom/shine_stats/tests/fixtures/parity`,
   sobrescribible con `SHINE_STATS_FIXTURES`) y se salta con un aviso si no existen. Si para
   algún caso la app y el PHP no coinciden, manda la app y se corrige el PHP; si descubres un
   error en la app, no la cambies: anótalo en `docs/progress.md` para un subplan de la app.
3. **Carga de datos** (`shine_stats.summaries`, `SummaryLoader`): `forLearner(UserInterface
   $learner, ?\DateTimeImmutable $since = NULL): StatsSummary[]` con una sola entity query sobre
   `activitysummary` (`accessCheck(FALSE)`, orden `created`), más los nombres reales de actividades
   y sesiones cargados en bloque. **Nunca lo llames sin comprobar antes el acceso**: el servicio
   recibe el alumno ya autorizado; quien lo invoca (controlador del panel, endpoint) pasa por
   `LearnerAccessPolicy::canSee($holder, $learner)` o `OrganizationLearners` (coordinación). Un
   test kernel con un titular ajeno demuestra que el controlador devuelve 404 sin consultar.
4. **Servicio de alto nivel** (`shine_stats.calculator`, `StatsCalculator::forLearner()`): devuelve
   un objeto `LearnerStats` con lo que pinta la app en "Mi progreso": resumen (actividades y minutos
   totales y de la semana, racha, mejor marca por actividad), `weekly` (buckets L a D), `areas`
   (dedicación), `radar` (desde `sessionfeedback` y `userarealevel` como la app, con
   `toRadarFeedback`), `activities[]` (serie por actividad con media móvil, precisión o ritmo según la
   familia de métrica, mejor marca, mejora si procede) y `period`. Caché por alumno con etiquetas
   `activitysummary_list`, `sessionfeedback_list`, `userarealevel_list` y `user:{uid}`.
5. **Endpoint `GET /shine/learners/{uuid}/stats`** (`shine_stats`, `_shine_holder`, acceso por
   `canSee`; `?since=YYYY-MM-DD`): la forma JSON de `LearnerStats`, pensada para que la app pueda
   dejar de calcular en cliente más adelante (fuera de alcance aquí). 404 para un alumno ajeno o
   inexistente, nunca 403. Documentado en `docs/api-design.md` ("Estadísticas").
6. **Sección "Rendimiento" de la ficha** (`/panel/alumnos/{uuid}`, `shine_panel`): con la librería
   `shine_panel/charts` de 01 y el inicializador `data-chart`: evolución por actividad (línea
   suavizada protagonista, puntos crudos en gris claro, mejor marca marcada), radar de áreas, barras
   de la semana, dedicación por área (la menos trabajada primero, como la app), "actividades que
   más han costado" en el periodo (`sessionfeedback` y `activityfeedback`). **Cada gráfica lleva
   debajo su tabla accesible** (misma información, `<table>` con `caption`), que es también lo que
   sale al imprimir (`@media print` oculta los canvas). Selector de periodo (4 semanas, 3 meses,
   todo). Texto de ayuda con el principio de la app: constancia y esfuerzo antes que rendimiento;
   ninguna frase que se lea como "empeora". Estado vacío cuando no hay summaries.
7. **Drush**: `shine-stats:learner {uid} [--since=]` imprime el resumen (para soporte y para
   comparar con la app a ojo).
8. **Documentación**: `docs/statistics-design.md` (nuevo apartado "Cálculo en servidor:
   `shine_stats`", paridad y endpoint), `docs/api-design.md`, `docs/dashboards.md` §7.4 y §11
   (decisión cerrada), `CLAUDE.md` (módulo, comando, endpoint), `docs/progress.md`.

Verificación:
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_stats`
  en verde (paridad, loader con titular ajeno → 404, calculadora con un alumno con 20 summaries de
  tres actividades de familias de métrica distintas: tiempo, aciertos, ritmo).
- `cd shine-app && source ~/.nvm/nvm.sh && nvm use 21 && npm test -- stats` en verde con el test
  de paridad leyendo los fixtures del módulo (gotcha 5).
- Con Marta (`es`, uid 42) y su titular `jose@test.com` (memoria de cuentas de prueba): los
  números de `/panel/alumnos/{uuid}` (resumen, racha, mejor marca por actividad, buckets de la
  semana) coinciden con los de "Mi progreso" de la app en Expo web para el mismo alumno y el mismo
  día; `drush shine-stats:learner 42` imprime lo mismo. Con el otro titular normal, 404.
- Navegador a 390 px y 1280 px: gráficas legibles, tablas accesibles debajo, impresión sin canvas,
  `prefers-reduced-motion` sin animación.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/statistics-design.md`, `docs/api-design.md`, `docs/dashboards.md` y `CLAUDE.md`.
