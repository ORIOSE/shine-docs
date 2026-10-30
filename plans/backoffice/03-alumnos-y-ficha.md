# 03. Alumnos: lista de familia, cartera profesional, ficha (cabecera, niveles, sesiones, exportar CSV) y acciones

- **Agente recomendado: Opus 5.5 con la skill `frontend-design`.** Especificación cerrada
  (`docs/dashboards.md` §4.2, §7.1 a 7.3, §7.6 y la matriz §8), prototipo detallado y servicios ya
  existentes para cada acción; el acceso lo resuelve `PanelAccess` (02) y la política de
  `shine_account`. La parte visual (tabla que se convierte en tarjetas, ficha con pestañas) pide la
  skill.
- Fase: 21. Alcance: Drupal (`shine/`): `shine_panel` (rutas `/panel/alumnos*`, formularios, una
  View exportada), un método nuevo en `shine_account` (`LearnerManager::unarchive()`), constantes
  de áreas y niveles en `shine_panel`.
- Dependencias: 02. En paralelo con 04 (que añade la pestaña "Rendimiento") y 05.

## Prompt

Lee `docs/dashboards.md` §4.2, §5.2, §7.1, §7.2, §7.3, §7.6 y §8, `docs/lovable/INDEX.md` secciones
3.1 (modelo mock: qué columnas y estados maneja el prototipo), 4 (`panel.alumnos.index.tsx`,
`panel.alumnos.$id.tsx`) y 8 (qué del prototipo no existe en el backend: tipos de sesión, lugar,
valoraciones, bandas de nivel), y los ficheros `docs/lovable/panel/src/routes/panel.alumnos.index.tsx`,
`panel.alumnos.$id.tsx`, `docs/lovable/panel/src/components/shine/DataTable.tsx` y `ui.tsx`
(`LevelChip`, `AreaChip`, `StatusBadge`, `TrendIndicator`). En Drupal: `shine_account`
(`LearnerManager`: `create`, `update`, `archive`, `withdraw`, `release`, `listFor`, `toArray`;
`LearnerInviteManager::create`; `LearnerInviteRepository`; `LearnerAccessPolicy`;
`LearnerManager::setLanguage()` y el reinicio de la FASE 18), `shine_level` (`LevelRepository`,
`userarealevel` con `probe_level` si existe, `userarealevel_log` y sus razones en
`docs/level-system.md`, `node.session`: `field_session_kind`, `field_evaluation_scope`,
`field_evaluation_reason`, `field_evaluation_seq`, `field_completed_at`, `field_operated_by`,
`field_activities`), `sessionfeedback` (`overall`, `easiest_activity`, `hardest_activity`),
`activityfeedback` (`rating`), `activitysummary` (campos por bundle: `field_time`,
`field_correct_count`, `field_items_count`, `field_repetitions`, `field_lures_count`),
`docs/activity-system.md` (qué métrica tiene sentido por tipo), la app (`shine-app/src/lib/learnerScreens.ts`
y `learnerCopy.ts`: textos y acciones por rol que ya están decididos; `src/lib/avatars.ts`;
`src/locales/es.json` para las etiquetas de tipos de sesión y razones) y `shine_org`
(`OrganizationLearners`). Trabaja en `shine/`.

Principio: la ficha enseña lo mismo que la app y con las mismas palabras (razones de cambio de
nivel, tipos de sesión, cobertura); donde el prototipo inventa (bandas de nivel, "Gabinete / Casa /
Centro", "Buen ritmo"), se sustituye por el dato real con una etiqueta clara.

Tareas:

1. **Constantes compartidas** (`shine_panel`): `Areas` (lista de términos de `areas` del idioma del
   titular, ordenados por peso, con color de una paleta fija asignado por orden y un icono del sprite
   por nombre con icono por defecto; sin campos nuevos en la taxonomía) y `Levels` (los once
   `activity_level` por peso, con banda Inicial = Level0 a Level3, Intermedio = Level4 a Level6,
   Avanzado = Level7 a Level10, documentada en `docs/dashboards.md`; el chip muestra el nombre real
   del nivel y la banda). Etiquetas de sesión: regular → "Regular"; evaluación → "Evaluación" más
   el motivo (`field_evaluation_reason` traducido con las mismas palabras que la app: bloque
   inicial, periódica, por facilidad, por dificultad, evidencia, confirmación). "Dónde se hizo":
   `field_operated_by` → si ese titular tiene membresía activa en la organización del alumno, "En
   el centro" (o "En el gabinete"); si no, "En casa"; si el campo está vacío, "Sin dato".
2. **Lista de familia** (`/panel/alumnos`, rol sin cartera): cabecera "Alumnos" con "Tengo un código
   del centro" y "Añadir alumno"; barra "x de y alumnos de tu plan" (`maxLearners`); tarjeta por
   alumno (avatar emoji, nombre, badge de cobertura, etiqueta ES/CA solo si hay alumnos en dos
   idiomas, como la app) con "Ver ficha" y, según `LearnerAccessPolicy`, "Editar" y "Archivar" (owner)
   o "Retirar mi acceso" (guardian/staff); archivados plegados debajo con "Restaurar". Diálogo
   "Añadir alumno" (nombre o apodo con la pista del prototipo, avatar del set de la app, idioma con
   el `LanguagePicker` equivalente) con el aviso de cupo si está lleno (`canCreateLearner`); diálogo
   "Código del centro" (6 caracteres, `LearnerInviteManager::redeem`, errores `invite_invalid` /
   `own_invite` / 429 con los textos de `learnerScreens.ts`).
3. **Cartera** (`/panel/alumnos`, roles profesional, coordinación y docente): `data-table` con
   buscador por nombre, filtro de estado ("Activos y en pausa" por defecto, "Activos", "En pausa",
   "Archivados"), filtro por responsable (coordinación), selección múltiple con "Archivar" y
   "Exportar CSV" (cartera), y columnas del prototipo con datos reales de `LearnerActivity` (02):
   Nombre, Responsable (coordinación), Última sesión, Totales, Últimas 4 semanas, Área más baja y
   Área más alta (chip de área + chip de nivel desde `LevelRepository`), Tendencia (de
   `userarealevel_log` en 8 semanas: más subidas que bajadas → "Sube", al revés → "Baja", si no
   "Estable"; **solo en la cartera profesional**, nunca en la vista de familia), Estado (Activo / En
   pausa / Archivado), Familia ("Sí" si hay un `guardian` activo, "Invitación pendiente" si hay un
   `learner_invite` vivo, "No" con enlace "Invitar"). En móvil, tarjetas con los mismos datos. Alta
   desde la cartera ("Dar de alta", ocupa plaza de la organización elegida si pertenece a alguna:
   `LearnerManager::create` con `organization`; errores `organization_limit` y `learner_limit`
   explicados). Implementa la lista como controlador con `LearnerActivity`, no como View: las
   columnas calculadas no salen de una consulta de Views sin plugins propios.
4. **Ficha** (`/panel/alumnos/{uuid}`, pestañas por URL `?tab=`):
   - **Cabecera**: avatar grande, nombre, badge de estado, cobertura (`covered_by` con el nombre del
     plan o del centro, prueba con sesiones restantes, "sin acceso", "en pausa"), responsable
     (`owner`), otros adultos con rol (`adults[]`), centro (`organization`), idioma, última sesión.
     Acciones según `LearnerAccessPolicy` (mismo criterio que `learnerActions` de la app): "Editar"
     (nombre, avatar; y "Cambiar idioma" aparte con el diálogo de confirmación de la app: reinicia
     el progreso), "Archivar" / "Restaurar", "Invitar a otro adulto" (owner: código de 6 caracteres
     mostrado una sola vez, QR generado en servidor como SVG sin librería externa o con una pequeña
     dependencia composer con licencia MIT anotada, enlace `shine://learners/join?code=` y botón
     "Copiar"; sin envío de email en v1: el prototipo lo tiene y el backend no, anótalo), "Liberar
     de la licencia" (owner de alumno en plaza o coordinación; diálogo con el texto del prototipo
     adaptado a `docs/monetization.md` §5.6), "Retirar mi acceso" (guardian/staff; owner solo si hay
     otro owner), "Reasignar responsable" (solo coordinación, lo implementa 06: aquí enlace
     deshabilitado). Cada acción escribe en `audit_log` y deja mensaje.
   - **Niveles**: una tarjeta por área con icono, nombre, chip "Level N · Banda", nivel de sondeo si
     lo hay, fecha de la última evaluación y evidencia acumulada (de `userarealevel`); "Evolución"
     (línea por área a partir de `userarealevel_log`, 12 semanas, con la librería `shine_panel/charts`
     y tabla accesible debajo; sin `shine_stats`: esto es solo el log); "Historial de cambios" (fecha,
     área, "De Level2 a Level3" o "Empieza en Level0", razón con las palabras de la app).
   - **Sesiones**: acordeón de sesiones publicadas del alumno, de la más reciente a la más antigua
     (paginado de 20): fecha, tipo y motivo, dónde se hizo, número de actividades, valoración global
     (`overall` → "Fácil" / "Bien" / "Me ha costado", con el mismo criterio de color que la app:
     ámbar para "me ha costado", nunca rojo), duración (suma de `field_time` de sus summaries). Al
     desplegar, tabla de actividades (área, título, nivel, y la métrica según el tipo: tiempo,
     aciertos "x de y", ritmo "n repeticiones", o tasa de aciertos menos falsas alarmas en secuencia
     con regla; valoración por actividad en las de ajuste). Sesión pendiente sin completar arriba,
     marcada "Empezada el {fecha}". Estado vacío del prototipo.
   - **Rendimiento**: la rellena 04; aquí una pestaña con "Disponible en breve" si `shine_stats` no
     está instalado.
   - **Notas**: 09; sin pestaña hasta entonces.
   - **Exportar**: "Sesiones en CSV" (desde fecha; descarga real con `;`, UTF-8 con BOM, columnas
     `fecha;tipo;motivo;donde;actividades;valoracion;minutos`, y una segunda descarga
     "Actividades en CSV" con una fila por summary: `fecha;sesion;actividad;area;nivel;tiempo_ms;
     aciertos;items;repeticiones;valoracion`); escribe `report.export` en `audit_log`. "Informe
     PDF" enlaza a 09 (deshabilitado hasta entonces).
5. **Restaurar**: `LearnerManager::unarchive(UserInterface $learner)` en `shine_account`: borra
   `field_archived_at` si el cupo del `owner` lo permite (`canCreateLearner` sobre el titular dueño;
   si no, excepción con `learner_limit`), idempotente, test kernel. Expuesto también como
   `POST /shine/learners/{uuid}/unarchive` (solo owner) para que la app pueda usarlo más adelante
   (documentado en `docs/api-design.md`).
6. **Tests kernel**: cartera con un docente que solo ve a sus alumnos (`owner` o `staff`) y no a los
   de otra docente; tendencia calculada en los tres casos; CSV de sesiones con el contenido esperado
   y 404 para un alumno ajeno; `unarchive` con cupo lleno; acciones de la ficha según rol (guardian no
   archiva: 403 en el formulario, botón ausente).
7. **Documentación**: `docs/dashboards.md` §4.2, §5.2 y §7 (implementado y diferencias con el
   prototipo: tendencia solo profesional, sin email en la invitación), `docs/api-design.md`
   (`unarchive`), `CLAUDE.md`, `docs/progress.md`.

Verificación:
- Con `jose@test.com`: lista de familia con Marta (es) y Pau (ca) con etiqueta ES/CA, cobertura
  "cortesía familiar"; ficha de Marta con niveles y sesiones iguales a los de la app ("Mi progreso"
  y la lista de sesiones del dashboard); CSV descargable y abrible en Numbers o LibreOffice con
  acentos correctos.
- Con el segundo titular (guardian de un alumno compartido, créalo por código desde el propio
  panel): ve la ficha, no ve "Archivar", puede "Retirar mi acceso"; tras retirarlo, 404.
- Con un coordinador y una docente de un centro de prueba: la cartera de la docente solo lista a
  sus alumnos; la del coordinador, todos los del centro, con la columna Responsable; dar de alta
  desde la cartera ocupa plaza (`used_seats` sube en `/shine/organizations`).
- Navegador a 390 px: la tabla de cartera se lee como tarjetas; la ficha se navega por pestañas con
  teclado; nada por debajo de 14 px.
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_panel`
  y `.../shine_account` en verde; `config:status` limpio.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/dashboards.md`, `docs/api-design.md` y `CLAUDE.md`.
