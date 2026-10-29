# Plan de planes: multiidioma (castellano y catalán)

Implementa plans/multiidioma/analisis.md (análisis del 2026-10-26). Cada fichero numerado de esta
carpeta es un prompt autocontenido para una sesión de Claude Code, con el mismo formato que
plans/entitlement/ y plans/prompts/. El análisis es la fuente de verdad; si un subplan necesita
apartarse de él, lo anota en analisis.md y lo dice en docs/progress.md.

Lo que se construye, en una frase: cada alumno tiene un idioma; las actividades son de un idioma
(nodos independientes con langcode, nunca traducciones); el generador, el techo por contenido, el
importador, la huella y la cobertura trabajan por idioma; la app habla en el idioma del alumno
activo con un catálogo de textos en castellano y catalán; y el contenido catalán (escala, taxonomía
fonológica, léxico, lotes y fichas del banco de imágenes) lo define un experto con el documento
plans/multiidioma/estructura.md.

Estado del orden 0 (2026-10-26): el experto ha entregado la estructura catalana en
plans/multiidioma/Shine en Catalán.md. Su versión normalizada (nombres definitivos de términos,
ciclo con pesos, nivel mínimo por estructura y preguntas abiertas) es
plans/multiidioma/estructura-ca.md; los términos ya están como datos en
shine/scripts/phonology-terms.es.json y phonology-terms.ca.json (los lee el script de 02); el
CSV del banco de imágenes lo rellenó Fable y el experto lo validó el mismo día, junto con las
ocho preguntas de estructura-ca.md (respuesta en resposta-estructura-ca.md: todo confirmado, con
la excepción de Level2 para monosílabos frecuentes con coda final simple, ya aplicada).

## Decisiones de producto (cerradas)

1. Al dar de alta un alumno se elige su idioma, junto con el nombre y el avatar.
2. Si un alumno cambia de idioma, se reinician sus estadísticas y niveles.
3. Para trabajar los dos idiomas, el tutor crea dos perfiles del mismo niño, uno por idioma, y
   gasta dos plazas de su cupo.
4. De momento la interfaz comparte el idioma del alumno activo (sin alumno, el del dispositivo si
   es castellano o catalán, y castellano si no). El catálogo de textos se separa desde el principio
   en ui (tutor) y player (niño) para poder separarlos en una v2.
5. El contenido actual de la app y las estadísticas son de ejemplo. Nada es definitivo: las
   migraciones pueden ser destructivas (borrar y reimportar), no hace falta conservar códigos,
   sesiones ni resúmenes existentes.

## Decisiones técnicas (del análisis)

- Idioma del alumno en preferred_langcode del usuario; idioma de la sesión en el langcode del
  nodo, copiado del alumno; idioma de la actividad en el langcode del nodo.
- Sin traducción de actividades. content_translation solo para areas, activity_cycle y
  activity_message. Las taxonomías sonority y decoding_effort son vocabularios distintos por
  idioma (términos con langcode propio), no traducciones.
- Código de actividad con idioma: TIPO-XX-Lnn-AREA-nnn (BLK-CA-L00-VEL-001). Huella =
  sha256(tipo, idioma, contenido canónico). Duplicados, unidades, sobreuso y cobertura por idioma.
- Un registro de lote puede declarar idiomas [es, ca]: el importador crea un nodo por idioma con
  el mismo material (lo compartible se comparte en el lote, no en Drupal).
- Clave del media del banco de imágenes = slug del fichero (platano), neutra entre idiomas.
- JSON:API: las actividades y sesiones no cambian; los recursos traducidos (areas, ciclo,
  mensajes) se piden con el prefijo de idioma en la URL (/ca/jsonapi/...).
- Cambio de idioma de un alumno = reinicio destructivo en una transacción (LevelReset más borrado
  de logs, resúmenes y feedback y despublicación de sesiones).
- App: i18n-js con expo-localization, catálogos src/locales/es.json y ca.json, espacios ui y
  player; el idioma de la app se fija al seleccionar alumno.
- Como el contenido es de ejemplo: la migración de langcode en a es se hace con un script, los
  lotes existentes se reescriben con códigos ES y se reimportan tras borrar las actividades de
  demostración, y las sesiones y estadísticas de prueba se borran. Sin hook_update de códigos.

## Cómo usarlos

1. Abrir Claude Code en la raíz del proyecto con el modelo indicado en la cabecera del fichero.
2. Pedir: "ejecuta plans/multiidioma/XX-....md" (o pegar su sección "Prompt").
3. Al terminar: verificar según su sección "Verificación", marcar la fila en la tabla de abajo y
   actualizar docs/progress.md en una sección nueva "FASE 18: multiidioma".

## Criterio de modelo

- **Fable**: decisiones de modelo de datos con migración de contenido (idiomas, langcode,
  reinicio por cambio de idioma), cambios transversales en el importador y la huella (código con
  idioma, duplicados por idioma, registro multilingüe), el handler de posición de imágenes (media
  más paragraphs, primera pieza nacida bilingüe), la elaboración de la taxonomía y la escala
  catalanas con el experto, y la verificación final.
- **Opus**: tareas con especificación cerrada y patrón ya existente: extracción de cadenas a un
  catálogo (mecánica, larga, sin decisiones), pantallas de alta y ficha de alumno con el design
  system, prefijo de idioma en dos peticiones.
- Cowork y Codex: generación de lotes catalanes con los documentos ya cerrados, como se hizo con
  el banco de imágenes; nunca para decidir la taxonomía o la escala.

El propio plan de planes, el análisis y estructura.md se han escrito con Fable.

## Orden de ejecución

| Orden | Fichero | Alcance | Modelo | Depende de | Hecho |
|---|---|---|---|---|---|
| 0 | estructura.md, Shine en Catalán.md, estructura-ca.md y banco-imagenes-equivalencia-ca.csv | Documento para el experto y su respuesta: áreas, niveles, tipos, ciclo, sonoridad, esfuerzo y fichas del banco | Experto (con Fable de apoyo) | nada | [x] 2026-10-26: estructura entregada y normalizada, preguntas respondidas y CSV validado |
| 1 | 01-backend-idioma-modelo.md | Idiomas es y ca, migración en a es, langcode en actividades y sesiones, alumno con idioma y reinicio, generador y techo por idioma, traducción de áreas, ciclo y mensajes, vistas | Fable | FASE 17 (shine_account, 01b y 02) | [x] 2026-10-26 (en se mantiene instalado sin negociar; mensajes ca provisionales) |
| 2 | 02-backend-importador-bilingue.md | Clave idioma e idiomas en el lote, códigos con idioma, huella, duplicados y cobertura por idioma, términos fonológicos por idioma desde JSON, clave del media por slug, handler de posición de imágenes, lotes reescritos y reimportados | Fable | 01 | [x] 2026-10-26 (hito de control superado: el alumno ca recibe solo actividades ca) |
| 3 | 03-app-i18n.md | i18n-js, catálogos es y ca, extracción de las 881 líneas en ui y player, fechas y números por idioma, fuentes, locales de tienda | Opus | nada (en paralelo con 01 y 02) | [x] 2026-10-26 |
| 4 | 04-app-alumno-idioma.md | Selector de idioma en el alta, ficha con cambio de idioma y confirmación, idioma de la app ligado al alumno activo, prefijo en áreas y mensajes | Opus | 01, 03 | [x] 2026-10-26 |
| 5 | 05-contenido-catalan.md | De estructura-ca.md y Shine en Catalán.md a catálogo y taxonomía catalanas, bloque ca del manifiesto desde el CSV revisado, y lotes catalanes por tipo con cobertura mínima | Fable (documentos y términos); Cowork y Codex (lotes) | 0, 02 | [x] 2026-10-26 (primeros lotes Level0 a Level2 en local); revisión del experto de los lotes y respuesta a sus dudas aplicadas el 2026-10-27 (revisio-lots-ca.md) |
| 6 | 06-verificacion-bilingue-y-docs.md | Recorrido completo con un alumno es y otro ca, cambio de idioma, cobertura, inventario; CLAUDE.md y docs | Fable | 01 a 05 | [x] 2026-10-27 (recorrido por API y Expo web; bug del bloque inicial corregido; Expo Go en dispositivo pendiente) |

Camino crítico: 0 → 05 (contenido) es el más largo y no depende del código hasta importar; 01 →
02 → 04 es el del software. 03 puede empezar el primer día. Con la estructura ya entregada, lo
que sigue bloqueando a 05 es la revisión del CSV por el experto; el resto de 05 puede avanzar.

Hito de control: tras 01 y 02, importar un lote mínimo compartido (una matriz de letras y una
posición de imágenes con idiomas [es, ca]) y comprobar con shine-level:generate --dry-run que un
alumno ca recibe solo actividades ca y que el techo por contenido le para donde debe; que
/ca/jsonapi/taxonomy_term/areas devuelve los nombres catalanes; y que el cambio de idioma de un
alumno deja sus niveles en Level0 y sus estadísticas vacías.

## Documentación a actualizar al ejecutar

CLAUDE.md (idiomas, prefijo JSON:API, alta de alumno con langcode, códigos con idioma, clave del
media), docs/api-design.md, docs/level-system.md, docs/exercise-catalog.md (3.4, 4.3, 4.4 y una
sección 2.3 por idioma), docs/conventions.md (claves ui y player), docs/generador/Banco de
imágenes.md (clave del media y bloque ca), docs/monetization.md (dos perfiles por idioma) y
docs/progress.md (sección "FASE 18: multiidioma").

## Lo que quedó fuera (cierre del 2026-10-27)

- Expo Go en dispositivo real (punto 6 del 06): no probado; en Expo web los glifos catalanes (l·l,
  ny, ç, ï) se ven bien en el player.
- Contenido: Funciones Ejecutivas sin actividades en los dos idiomas; Lingüística castellana con 2
  actividades en Level2 (sesiones regulares cortas); sin lote del ciclo castellano; Level3 a Level10
  (faltan los términos de nivel); handler de lista de texto y lectura en voz alta; guion de los
  enclíticos en la segmentación (Level6).
- App: botones de "¿Con cuál te has sentido mejor?" sin nombre accesible; ticks absurdos de las
  gráficas con un solo intento; los mensajes de explicación de Drupal no se muestran (la app enseña
  la instrucción de la actividad).
- Backend: `area_name` de `session/{uuid}/complete` en castellano (informativo); los mensajes de
  explicación castellanos "Activity vertical text" (lorem ipsum), "Image Position" (en catalán) y
  "Word split" (dice que el espacio va detrás) siguen sin corregir.
- Experto: textos de los mensajes validados; los lotes de Level0 a Level2 publicados solo en local
  hasta que se publiquen en producción con su revisión ya aplicada (revisio-lots-ca.md).
