# 01. Backend: modelo de idioma (idiomas, alumno, generador, traducciones)

- **Modelo recomendado: Fable.** Migración de todo el contenido existente a otro idioma, cambio
  del idioma por defecto del sitio, reinicio transaccional por cambio de idioma y una condición
  nueva en la consulta de la que dependen el generador y el techo por contenido.
- Fase: 18 (multiidioma). Alcance: solo Drupal (shine/).
- Dependencias: FASE 17 subplanes 01b (alumnos) y 02 (token de alumno).

## Prompt

Lee plans/multiidioma/analisis.md (secciones 1, 2, 3.1, 3.2, 3.3, 3.5, 3.6 y 4),
plans/multiidioma/README.md (decisiones), CLAUDE.md (gotchas 14, 17, 20 y 23), docs/level-system.md
(§5 techo por contenido, §6 generador, §7 ciclos) y docs/monetization.md §3 (alumnos). Trabaja en
shine/ con ddev. El contenido y las estadísticas actuales son de ejemplo: puedes borrar y
reimportar; no escribas hook_update para conservar nada.

Tareas:

1. **Idiomas.** Añade es y ca (drush language:add) y fija es como idioma por defecto. Prefijos de
   URL: es sin prefijo, ca con ca. Mantén en hasta terminar la migración y bórralo al final si
   no queda nada en ese idioma. Orden seguro: añadir es, migrar langcodes (tarea 2), cambiar el
   defecto, exportar config. Deja en scripts/ el script de migración idempotente con un comentario
   que explique el orden.
2. **Migración en a es** de todo lo existente: nodos (y sus paragraphs), términos, media,
   activity_message y usuarios (langcode y preferred_langcode). Comprueba después con una consulta
   por tabla que no queda nada en en.
3. **Ajustes de idioma por bundle** (language.content_settings): los siete bundles de actividad
   y session con idioma por defecto es, language_alterable true y sin traducción. areas,
   activity_cycle y activity_message con traducción habilitada (content_translation). Exporta.
4. **Traducciones de interfaz**: traduce al catalán el name de los cinco términos de areas y del
   ciclo "Sílabas" con los nombres definitivos del experto (plans/multiidioma/estructura-ca.md,
   apartado 1: Competència Lingüística i Fonològica, Rendiment i Velocitat de Processament,
   Memòria de Treball (Auditiva i Visual), Funcions Executives i Atenció, Processos Perceptius
   (Discriminació Visual i Auditiva); ciclo Síl·labes), y el título y cuerpo de los
   activity_message existentes (texto provisional marcado como tal; se sustituye en 05). Son contenido:
   déjalo en un script scripts/translate-interface-terms.php idempotente, como
   create-phonology-terms.php. Comprueba que /ca/jsonapi/taxonomy_term/areas devuelve los nombres
   catalanes y /jsonapi/taxonomy_term/areas los castellanos, con el mismo uuid.
5. **Alumno con idioma** (shine_account): POST /shine/learners acepta langcode obligatorio (es o
   ca; otro valor, 422 con campo langcode; si falta, es durante la transición). LearnerManager::
   create fija preferred_langcode y langcode del usuario alumno. PATCH /shine/learners/{uuid}
   acepta langcode (solo owner): si cambia, ejecuta en la misma transacción el reinicio de la
   tarea 6 y responde con reset: true. /shine/me y la forma learner incluyen langcode. El token
   de alumno no cambia.
6. **Reinicio por cambio de idioma** (shine_level, servicio nuevo o extensión de LevelReset):
   LevelReset con razón language_change en el histórico, borrado de activitylog, activitysummary,
   sessionfeedback y activityfeedback del alumno y despublicación de todas sus sesiones. Una
   transacción; log en watchdog. El guardado del usuario ya revoca sus tokens (gotcha 20): dilo en
   la respuesta de la API y en docs/api-design.md.
7. **Generador y techo por idioma** (shine_level): LevelLadder::contentQuery y la consulta de
   ciclo de SessionGenerator añaden condition langcode = preferred_langcode del alumno. Con eso
   hasContent, Coverage (shine_content) y el árbol de decisión quedan por idioma: compruébalo con
   un kernel test que cree una actividad ca y otra es en la misma área y nivel. SessionGenerator
   fija el langcode del nodo sesión al del alumno. shine-level:generate --dry-run imprime el idioma
   y lo incluye en los avisos de techo y hueco vacío.
8. **Vistas de administración**: columna y filtro de idioma en shine_sessions y en la vista de
   actividades si existe; en shine_levels basta con el idioma del alumno.
9. **Datos de prueba**: borra las sesiones y estadísticas de ejemplo que estorben; crea un alumno
   ca de prueba para jose@test.com además del es. Documenta en la memoria de cuentas locales si
   cambian.
10. **Docs**: docs/api-design.md (langcode en learners y me, reset, prefijo de idioma y recursos
    traducidos, regla "la API no devuelve textos para mostrar"), docs/level-system.md (idioma en
    §5 y §6), CLAUDE.md (idiomas, prefijo, alta con langcode) y docs/progress.md (sección nueva
    "FASE 18: multiidioma").

## Verificación

- drush cex y config:status sin diferencias; segunda ejecución de los scripts sin cambios.
- Consultas por tabla: ningún langcode en. Idioma por defecto es; /ca/jsonapi/... responde.
- Como usuario normal (gotcha 14): crear alumno es y alumno ca; /shine/me muestra langcode;
  generate del alumno ca devuelve 422 no_content (todavía no hay contenido catalán) y el del es
  sigue funcionando; PATCH langcode del alumno es a ca reinicia niveles (log language_change),
  borra sus summaries y despublica sus sesiones; su token anterior deja de valer.
- Kernel tests de shine_level y shine_account en verde, incluido el del filtro por idioma.
- watchdog sin errores nuevos.

## Al terminar

Marca la fila en plans/multiidioma/README.md y anota en docs/progress.md qué se hizo, decisiones
y pendientes (por ejemplo, las traducciones provisionales de mensajes que 05 debe revisar).
