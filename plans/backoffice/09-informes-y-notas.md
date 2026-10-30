# 09. Informes (alumno, cartera, organización) y notas profesionales

- **Agente recomendado: Opus 5.5.** Especificación cerrada, datos que ya calculan 03, 04 y 06, y
  una entidad nueva calcada de las existentes. La decisión de acceso a las notas está escrita en la
  matriz de `docs/dashboards.md` §8 y aquí se cierra la pendiente de §11 (notas compartibles por
  nota, privadas por defecto).
- Fase: 21. Alcance: Drupal (`shine/`): módulo nuevo `shine_notes`, rutas `/panel/informes*` en
  `shine_panel`, pestaña "Notas" y "Informe PDF" de la ficha.
- Dependencias: 04 (estadísticas) y 06 (organización). En paralelo con 08.

## Prompt

Lee `docs/dashboards.md` §5.3, §6.5, §7.5, §7.6, §8 y §11, `plans/backoffice/README.md` (decisión
sobre notas; PDF), `docs/lovable/INDEX.md` sección 4 (`panel.informes.tsx`, pestañas "Notas" y
"Exportar" de `panel.alumnos.$id.tsx`) y 5 (`LevelDistributionChart`), los ficheros
`docs/lovable/panel/src/routes/panel.informes.tsx`, `panel.alumnos.$id.tsx` (notas) y
`docs/lovable/panel/src/data/report.ts`, y los estilos de impresión de
`docs/lovable/panel/src/styles.css` (`@media print`, `.print-area`, `.no-print`). En Drupal:
`shine_stats` (04: `StatsCalculator`, series por actividad, "actividades que más han costado"),
`shine_panel` (`LearnerActivity`, `Areas`, `Levels`, los CSV de 03, la librería de gráficas de 01),
`shine_org` (`OrganizationLearners`, miembros), `shine_level` (`userarealevel`, `userarealevel_log`),
`activityfeedback`/`sessionfeedback` como patrón de entidad de campos de código y
`LearnerAccessPolicy`. Trabaja en `shine/`.

Tareas:

1. **Módulo `shine_notes`**: entidad `learner_note` (campos de código: `learner` (user),
   `author` = clave `owner`, `organization` (opcional: la del alumno en el momento de escribir),
   `body` (texto largo plano), `shared` (boolean, por defecto falso), `created`, `changed`). Quién
   puede qué, en un servicio `shine_notes.policy` que usa `LearnerAccessPolicy` y las membresías:
   **escribir** solo quien opera profesionalmente con el alumno: miembro activo de la organización
   del alumno con acceso (`owner` o `staff`) o coordinación de esa organización, o titular con rol
   profesional (membresía `professional` o plan `professional`) que sea `owner` o `staff` del alumno;
   **leer todas** los mismos; **leer solo las compartidas** la familia (`owner` o `guardian` sin
   condición profesional); **editar y borrar** solo el autor (y la coordinación de la organización
   puede borrar). Handler de acceso de la entidad con esas reglas, `hook_jsonapi_learner_note_filter_access`
   (lectura de las propias y de las compartidas de alumnos a los que se tiene acceso; sin escritura
   por JSON:API) y endpoint `GET /shine/learners/{uuid}/notes` (`_shine_holder`, misma política) para
   que la app pueda enseñar a la familia las notas compartidas más adelante. Aviso fijo en la
   interfaz y en la documentación: no escribir diagnósticos ni datos de salud. Tests kernel con la
   matriz completa (familia no ve privadas, guardian ve compartidas, staff escribe, coordinación
   borra, profesional de otra organización 404).
2. **Pestaña "Notas"** de la ficha (solo si la política permite escribir o hay compartidas que
   leer): aviso ámbar del prototipo; formulario "Nueva nota" con el interruptor "Compartir con la
   familia" (apagado por defecto); lista con autor, fecha, badge "Compartida con la familia" /
   "Solo profesionales", texto, y para el autor los botones de cambiar el reparto, editar y borrar.
   La familia ve solo las compartidas, sin formulario. Cada escritura va a `audit_log` sin el
   texto (solo ids).
3. **Informe de alumno** (`/panel/informes` para profesional y coordinación, con `?alumno=` desde la
   ficha; para la familia, el mismo informe desde "Exportar" de la ficha en su variante): selector
   de alumno (solo autorizados), periodo ("Últimas 4 semanas", "Últimas 12 semanas", "Este curso"
   desde el 1 de septiembre), "Observaciones" (texto libre que **no se guarda**: va en la URL de la
   vista de impresión o en un campo oculto del formulario; anótalo en la interfaz) y "Descargar
   PDF", que abre la vista de impresión `/panel/informes/alumno/{uuid}?periodo=&obs=` con
   `@media print` (botón que llama a `window.print()`, el único JavaScript de la página; la página
   es legible también sin imprimir). Contenido, como el prototipo: cabecera "Informe de {nombre}",
   periodo y organización o "Familia" (variante por emisor: con notas compartidas y observaciones
   si lo emite un profesional; sin ellas si lo emite la familia), cifras (sesiones del periodo,
   últimas 4 semanas, responsable), niveles por área al inicio y al final del periodo (de
   `userarealevel_log`), evolución (gráfica de 04 con su tabla; en impresión, solo la tabla),
   "Actividades que le han costado más" (04) y, para profesionales, las observaciones. Sin PDF en
   servidor en v1: el prototipo también imprime desde el navegador; deja anotado en
   `docs/dashboards.md` §11 que un PDF en servidor (dompdf sobre esta misma página, sin gráficas) es
   la siguiente mejora si los centros lo piden.
4. **Informe de cartera (CSV)**: todos los alumnos autorizados del titular con
   `alumno;estado;responsable;sesiones;ultimas_4_semanas;` más una columna de nivel por área (nombre
   del área, en el idioma del titular). `report.export` en `audit_log`.
5. **Informe de organización** (solo coordinación, pestaña "Informe de organización"): periodo
   ("Este trimestre", "Este curso"); cifras (alumnos en plaza, sesiones del periodo, nivel medio por
   área, miembros activos); "Distribución de niveles por área" (barras apiladas Inicial / Intermedio
   / Avanzado por área, con la librería de 01 y tabla accesible); "Uso por miembro" (alumnos a cargo
   y sesiones operadas en el periodo); "Descargar PDF" (vista de impresión) y "Descargar CSV" (una
   fila por alumno con responsable, sesiones del periodo y nivel por área). `report.export` en
   `audit_log` con la organización.
6. **Enlaces pendientes de 03**: activa "Informe PDF" en la pestaña Exportar de la ficha y "Informes"
   en la cabecera de la organización.
7. **Documentación**: `docs/dashboards.md` §5.3, §6.5, §7.5, §7.6 y §11 (notas: decisión cerrada;
   PDF en servidor: pendiente), `docs/api-design.md` (`GET /shine/learners/{uuid}/notes`),
   `CLAUDE.md` (módulo `shine_notes`, rutas de informes), `docs/progress.md`.

Verificación:
- Con el gabinete de prueba de 06: una profesional escribe dos notas sobre la alumna compartida (una
  compartida); `jose@test.com` ve solo la compartida en la ficha y en `GET
  /shine/learners/{uuid}/notes` con su token de titular; la coordinadora ve las dos y puede borrar;
  un profesional de otro gabinete recibe 404.
- Informe de alumno de 12 semanas impreso a PDF desde el navegador (Chrome, "Guardar como PDF"): sin
  cabecera del panel, con las tablas en lugar de las gráficas, dos páginas como mucho, legible en
  blanco y negro (ninguna información solo por color). La variante de familia no muestra
  observaciones ni notas privadas.
- CSV de cartera y de organización con acentos correctos y una columna por área en catalán cuando
  el titular está en `ca`.
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_notes`
  y `.../shine_panel` en verde; `config:status` limpio.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/dashboards.md`, `docs/api-design.md` y `CLAUDE.md`.
