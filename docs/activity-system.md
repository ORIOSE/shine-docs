# Sistema de Actividades — Diseño y extensibilidad

## Concepto

Una **actividad** es la unidad básica de entrenamiento. Tiene partes comunes (siempre presentes) y partes específicas del tipo (varían según el tipo de actividad). Esta separación es lo que permite añadir nuevos tipos sin modificar la lógica existente.

---

## Anatomía de una actividad (partes comunes)

Toda actividad, independientemente del tipo, tiene estos elementos:

```
┌─────────────────────────────────────────┐
│  1. INTRO / DESCRIPCIÓN                  │
│     body + field_text (el enunciado)     │
│     field_custom_explanation (texto libre│
│     de apoyo adicional)                  │
├─────────────────────────────────────────┤
│  2. MENSAJE DE EXPLICACIÓN               │
│     field_explanation →                  │
│     activity_message.explanation_message │
│     (puede incluir imagen media)         │
├─────────────────────────────────────────┤
│  3. NIVEL DE DIFICULTAD                  │
│     field_activity_level →               │
│     taxonomy.activity_level              │
├─────────────────────────────────────────┤
│  4. CONTENIDO ESPECÍFICO DEL TIPO        │
│     (varía por bundle / node type)       │
├─────────────────────────────────────────┤
│  5. MENSAJE DE MOTIVACIÓN                │
│     activity_message.motivation_message  │
│     (inyectado aleatoriamente por tipo)  │
├─────────────────────────────────────────┤
│  6. TRACKING / LOG                       │
│     activitylog + activitysummary        │
│     (siempre presente en todo tipo)      │
└─────────────────────────────────────────┘
```

Los elementos 1, 2, 3, 5 y 6 son siempre los mismos. Solo el elemento 4 varía.

---

## Tipos de actividad actuales

### `activity` — Lista de texto vertical
**Node type**: `node.activity`
**Activitylog bundle**: `logverticaltext`

**Mecánica**: Se muestra una lista de palabras o frases en vertical. El usuario hace clic/tap para ir avanzando a la siguiente. Se registra el tiempo entre clics y el peso (posición) de cada elemento.

**Campos específicos**:
- `field_text` (text_long): el contenido de la lista (palabras/frases separadas)
- `field_activity_code` (string): código identificador de la actividad
- `field_activity_format` (list_string): formato de presentación (REQUERIDO)
- `field_seconds` (decimal): duración esperada en segundos
- `field_sonority` → taxonomy `sonority` y `field_decoding_effort` → taxonomy `decoding_effort` (opcionales, múltiples): categorización fonológica del material. Ver `docs/exercise-catalog.md` §3.5

**Métricas capturadas** (en activitylog):
- `field_item`: texto del elemento
- `field_weight`: posición del elemento en la lista
- `field_time`: tiempo en ms desde el inicio o desde el elemento anterior
- `field_iteration`: número de intento

**Implementación en la app**: definición `verticalTextKind` (`src/lib/activityKinds/verticalText.ts`) y `VerticalTextPlayer` / `AudioReadingPlayer` según el formato. (Histórico: la clase JS `ActivityTextList` de `activitylog_register`, retirado en la FASE 9.)

---

### `activity_blink` — Texto en parpadeo (sílabas / conjuntos de letras)
**Node type**: `node.activity_blink`
**Activitylog bundle**: `log3_textlistblink`
**Activitysummary bundle**: `summary3_vertical_text_blink`

**Mecánica**: Se muestra una palabra corta, sílaba o conjunto de letras a la vez. El usuario avanza manualmente con tap (igual que `vertical_list`). Pensado para ejercicios de lectura de sílabas o reconocimiento de patrones en autismo.

**Diferencia clave respecto a `activity`**: No tiene `field_activity_format` — el formato es implícitamente blink. El node type propio elimina la ambigüedad y permite bundles de tracking propios.

**Campos específicos**:
- `field_text` (text_long): contenido de la lista (palabras cortas, sílabas)
- `field_seconds` (decimal): duración esperada en segundos
- `field_activity_code` (string): código identificador
- `field_activity_level` → taxonomy `activity_level` (requerido)
- `field_custom_explanation` (text_long): texto libre de apoyo
- `field_explanation` → `activity_message.explanation_message`
- `field_sonority` → taxonomy `sonority` y `field_decoding_effort` → taxonomy `decoding_effort` (opcionales, múltiples): categorización fonológica del material. Ver `docs/exercise-catalog.md` §3.5

**Métricas capturadas** (`log3_textlistblink`):
- `field_item`: texto del elemento
- `field_weight`: posición en la lista
- `field_time`: tiempo en ms
- `field_iteration`: número de intento
- `field_activity_type`: siempre `"activity_blink"`

**Routing en la app**: `ActivityRouter` detecta `activity.type === 'node--activity_blink'` y renderiza `VerticalTextPlayer` dentro de `ActivityBase`. La sesión carga el nodo con `getBlinkActivity()` (endpoint `/jsonapi/node/activity_blink/{uuid}`).

---

### `activity_image_position` — Posicionamiento de imágenes
**Node type**: `node.activity_image_position`
**Activitylog bundle**: *(sin bundle específico aún, comparte logverticaltext)*

**Mecánica**: Se muestran imágenes que el usuario debe posicionar o clasificar.

**Campos específicos**:
- `field_items` → `paragraph.i1` (grupos de imágenes)
  - `paragraph.i1.field_items` → `paragraph.i1_item` (imagen individual)
    - `field_image` → `media.image` (REQUERIDO)
    - `field_text` (text_long): etiqueta de la imagen
  - `field_position_to_ask` (integer): posición correcta esperada

**Implementación en la app**: definición `imagePositionKind` (`src/lib/activityKinds/imagePosition.ts`) y `ImageGroupPlayer` (fases memorizar y preguntar por grupo). Escribe `logimageposition` / `summary_image_position` con los contadores de acierto.

---

### `activity_letter_matrix` — Matriz de discriminación visual (FASE 13a)
**Node type**: `node.activity_letter_matrix`
**Activitylog bundle**: `loglettermatrix`
**Activitysummary bundle**: `summary_letter_matrix`
**Área por defecto**: Procesos Perceptivos; secundaria Funciones Ejecutivas y Atención. Diseño 7.6 de `plans/design/07-fase-ejecucion/`.

**Mecánica**: cuadrícula de letras (o sílabas / palabras) parecidas; el usuario toca todas las apariciones del objetivo. Tocar marca (teal), volver a tocar desmarca. Con límite de tiempo, una barra ámbar discreta se vacía. Al comprobar (o al acabar el tiempo), las encontradas llevan un check y las que faltaban se revelan con un aro ámbar, sin mensaje de fallo. Si se marcan exactamente todos los objetivos la ronda se cierra sola. Varias rondas por actividad.

**Campos específicos**:
- `field_target` (string): objetivo; doble objetivo separado por coma (`bra, dra`)
- `field_columns`, `field_rows` (integer): dimensiones (con letras, máximo 6 columnas para que cada celda mida 48 px en un móvil de 375)
- `field_cells` (string_long, múltiple): una ronda por valor, celdas separadas por espacios de izquierda a derecha y de arriba abajo
- `field_time_limit` (integer): segundos por ronda; vacío = sin límite
- Comunes: `field_main_area`, `field_secondary_area`, `field_activity_level`, `field_activity_code`, `field_custom_explanation`, `field_explanation`, `field_cycle`, `field_cycle_weight`, `field_sonority`, `field_decoding_effort` (mismos storages que `activity_blink`)

**Métricas capturadas** (`loglettermatrix`, **un log por ronda**, no por objetivo):
- `field_item`: el objetivo ("p" o "bra, dra")
- `field_weight`: índice de la ronda
- `field_correct`: todos los objetivos de la ronda encontrados
- `field_correct_count` / `field_items_count`: encontrados / que había en la ronda
- `field_time`: ms de la ronda
- `field_activity_type`: `letter_matrix`

En el summary, `field_correct_count` y `field_items_count` suman las rondas y `field_false_marks` cuenta las celdas marcadas que no eran objetivo. Las marcas falsas **no** van a `field_errors` (el contador del adulto); el tipo no cuenta errores (`activity_options`).

**Implementación en la app**: `src/lib/letterMatrix.ts` (parseo de objetivo y rondas, evaluación), `letterMatrixKind` (`src/lib/activityKinds/letterMatrix.ts`) y `LetterMatrixPlayer`.

---

### `activity_syllable_order` — Reordenamiento de sílabas (FASE 13b)
**Node type**: `node.activity_syllable_order`
**Activitylog bundle**: `logsyllableorder`
**Activitysummary bundle**: `summary_syllable_order`
**Área por defecto**: Competencia Lingüística y Fonológica; secundaria Memoria de Trabajo. Diseño 7.8.

**Mecánica**: las sílabas de una palabra aparecen barajadas en fichas; tocar una ficha la coloca en el primer hueco libre y tocar un hueco la devuelve a la bandeja (se eligió **tocar en orden** en vez de arrastrar: accesible y sin gestos). Con todos los huecos llenos se comprueba sola: si la palabra es correcta, fichas alternando teal/ámbar y la palabra con 🌟; si no, las posiciones incorrectas quedan en ámbar, sin mensaje ni reinicio, hasta que el usuario devuelve alguna ficha y la recoloca (cada llenado completo cuenta un intento en `field_attempts`). Imagen de pista opcional. Nada cambia de sitio durante la palabra: la bandeja conserva la altura que tiene con todas las fichas y el pie reserva siempre el hueco del botón "Siguiente".

**Campos específicos**:
- `field_items` → `paragraph.syllable_word` (múltiple; mismo storage `node.field_items` que `activity_image_position`)
  - `field_syllables` (string, requerido): la palabra con las sílabas separadas por guion y en orden (`pan-ta-lón`). **Las sílabas se guardan explícitas**: la app no silabea, solo baraja (nunca en el orden correcto y evitando parejas consecutivas en su orden original)
  - `field_extra_syllables` (string): sílabas sobrantes separadas por guion (`bar-pla`), opcional
  - `field_image` → `media.image`, opcional (pista)
- Comunes: como la matriz

**Métricas capturadas** (`logsyllableorder`, un log por palabra):
- `field_item`: la palabra; `field_weight`: posición
- `field_correct`: formada a la primera; `field_attempts`: intentos hasta formarla
- `field_time`: ms hasta formarla; `field_activity_type`: `syllable_order`

Summary: `field_correct_count` = palabras a la primera, `field_items_count` = palabras.

**Implementación en la app**: `src/lib/syllableOrder.ts` (fichas con id, barajado, comprobación), `syllableOrderKind` y `SyllableOrderPlayer`. La sesión carga el nodo con `getSyllableOrderActivity()` (include de paragraphs, media y fichero).

---

### `activity_word_split` — Segmentación léxica (FASE 13c)
**Node type**: `node.activity_word_split`
**Activitylog bundle**: `logwordsplit`
**Activitysummary bundle**: `summary_word_split`
**Área por defecto**: Competencia Lingüística y Fonológica; secundaria Rendimiento y Velocidad. Diseño 7.5.

**Mecánica**: la frase se muestra sin espacios; tocar una letra pone (o quita) el espacio justo **delante** de ella (marca el inicio de palabra; la primera letra no se puede tocar), con una barrita teal. Bajo la frase se ven las barras que faltan por colocar (tantas como espacios tiene la frase) y van desapareciendo según se ponen: no se pueden poner más de las necesarias y "Comprobar" se habilita cuando no queda ninguna. Acierto: palabras en fichas teal y "¡N palabras! 🌟". Acierto parcial: los espacios correctos se fijan (barrita verde, ya no se pueden quitar), los demás se quitan (sus barras vuelven abajo) y se invita a revisar el resto.

**Campos específicos**:
- `field_sentences` (string, múltiple): una frase por valor, **con espacios**, en minúsculas y sin signos de puntuación; la app deriva la versión continua y las posiciones de corte
- Comunes: como la matriz

**Métricas capturadas** (`logwordsplit`, un log por frase): `field_item` = la frase, `field_weight` = posición, `field_correct` = segmentada bien a la primera, `field_attempts` = comprobaciones hasta acertar, `field_time`, `field_activity_type` = `word_split`. Summary: `field_correct_count` / `field_items_count`.

**Implementación en la app**: `src/lib/wordSplit.ts` (cadena continua, cortes correctos = índices de las letras que empiezan palabra, comprobación), `wordSplitKind` y `WordSplitPlayer`.

---

### `activity_rapid_repetition` — Repetición rápida de palabra (FASE 16a)
**Node type**: `node.activity_rapid_repetition`
**Activitylog bundle**: `lograpidrepetition`
**Activitysummary bundle**: `summary_rapid_repetition`
**Área por defecto**: Rendimiento y Velocidad de Procesamiento; secundaria Competencia Lingüística y Fonológica. Especificación en `docs/ejercicios/Repetición Rápida.md` y modelo en `docs/exercise-catalog.md` §6.4.

**Mecánica** (uso acompañado: el tutor maneja la app). Por cada palabra: se muestra en grande; el tutor pulsa "Comenzar"; la palabra **desaparece** y arranca una cuenta atrás de `field_time_limit` segundos (barra ámbar, sin números); el alumno la repite en voz alta lo más rápido que puede y el tutor toca un botón gigante ("+1") por cada repetición completa, con un "Quitar una" pequeño para los toques por error. Al llegar a 0 suena un aviso corto, el botón se bloquea con el número congelado y la palabra reaparece en la línea de resultado ("mano: 12 repeticiones"); "Siguiente" pasa a la siguiente palabra. No hay forma de volver a enseñar la palabra a mitad de ronda. Sin aciertos ni errores: la métrica es el ritmo.

**Campos específicos**:
- `field_words` (string, múltiple, requerido): una palabra o pseudopalabra por valor, en orden (mínimo 4)
- `field_time_limit` (integer, requerido): segundos por palabra, el mismo para todas (storage de la matriz)
- Comunes: como la matriz (`field_sonority` y `field_decoding_effort` por actividad, no por palabra)

**Métricas capturadas** (`lograpidrepetition`, un log por palabra): `field_item` = la palabra, `field_weight` = posición, `field_repetitions` = toques de la ronda, `field_time` = ms reales de la ronda (`Date.now()` desde "Comenzar" hasta el cierre), `field_activity_type` = `rapid_repetition`. Summary: `field_repetitions` = suma de las rondas y `field_time` = suma de los tiempos. **Ni log ni summary llevan `field_correct_count` / `field_items_count`**: con ellos el evaluador de niveles degradaría un "Demasiado fácil" por el freno por aciertos (`docs/level-system.md` §5.5). El ritmo (repeticiones por segundo, un decimal, coma decimal) se deriva en la app y nunca se guarda.

**Implementación en la app**: `src/lib/rapidRepetition.ts` (palabras limpias, suma, ritmo, formato), `rapidRepetitionKind` (`src/lib/activityKinds/rapidRepetition.ts`), `RapidRepetitionPlayer` y `TimeBar` (barra compartida con la matriz). El sonido de fin de ronda es `assets/sounds/round-end.wav` con `expo-av`; si falla, la señal visual basta. En estadísticas es la tercera familia ("ritmo"): `RATE_SUMMARY_TYPES`, `computeRate`, `rate()` de la stats lib y `RateEvolutionChart`.

---

## Sesiones y grupos

Las actividades se organizan en sesiones:

```
group_session
  └── field_ref_session (M) → session
        └── field_activities (M) → activity / activity_blink / activity_image_position
                                   / activity_letter_matrix / activity_syllable_order / activity_word_split
                                   / activity_rapid_repetition
```

En la app, la pantalla `app/(auth)/session/[id].tsx` encadena las actividades de la sesión; cada log y summary lleva `field_sessionid`. Desde la FASE 15 cada usuario solo ve sus propias sesiones (generadas por el servidor) y `group_session` no se usa.

---

## Cómo añadir un nuevo tipo de actividad

### Checklist completo

**En Drupal (backend)** (en la FASE 13 todo esto se hizo con un script `drush php:script` idempotente que crea tipos, campos, bundles y displays clonando los de `activity_blink` / `logimageposition` / `summary_image_position`, y después `drush cex`; la config exportada es la fuente de verdad, el script no se versiona):
- [ ] Crear el node type `activity_{tipo}` con `activity_options` (contar errores sí/no; los tipos que se autocorrigen en la app no cuentan)
- [ ] Reutilizar los campos comunes existentes (mismo storage): `field_main_area` (requerido, con el área por defecto del tipo), `field_secondary_area`, `field_activity_level` (requerido, múltiple), `field_activity_code`, `field_custom_explanation`, `field_explanation`, `field_cycle`, `field_cycle_weight` y, en los tipos de texto, `field_sonority` y `field_decoding_effort`
- [ ] Añadir campos específicos del tipo (con prefijo `field_`, siguiendo convenciones); contenido con imágenes o varios campos por elemento → paragraphs (patrón `field_items`)
- [ ] Crear bundle nuevo en `activitylog` (`log{tipo}`) y en `activitysummary` (`summary_{tipo}`) con los campos comunes del storage compartido: en el log `field_activityid` (target_bundles = el node type), `field_sessionid`, `field_activity_type`, `field_item`, `field_weight`, `field_time`, `field_iteration`, `field_errors` y, si hay acierto, `field_correct`; en el summary además `field_activitylogs` (target_bundles = el log nuevo), `field_main_area`, `field_activity_level`, `field_correct_count`, `field_items_count` (ver `docs/metrics-tracking.md`). Los tipos **sin** acierto (ritmo, FASE 16) no llevan los contadores: el evaluador de niveles trataría un `field_items_count > 0` como freno por aciertos; llevan su propio campo (`field_repetitions`)
- [ ] Añadir el node type a `target_bundles` de `node.session.field_activities` (si no, el generador y el admin no pueden meterlo en sesiones) y a `field_activity_types` de al menos un `motivation_message`
- [ ] Añadir el node type a `ACTIVITY_BUNDLES` de `Sessionfeedback.php` y `Activityfeedback.php` (campos base `easiest_activity`, `hardest_activity`, `activity`) y sincronizar la definición instalada con un `hook_update_N` que llame a `updateFieldStorageDefinition()` (ver `sessionfeedback_update_11002`). Si no, la auto-evaluación de fin de sesión y el "¿Cómo ha ido?" devuelven 422 al señalar una actividad del tipo nuevo
- [ ] Un `explanation_message` para el tipo (contenido, por entorno) y un handler en `shine_content` (`ActivityHandlerInterface`) para poder importar lotes
- [ ] Exportar config: `drush cex`; comprobar `drush config:status` sin diferencias
- [ ] No hacen falta permisos nuevos: `create/view own activitylog|activitysummary entities` son por entidad, no por bundle

**En el frontend Expo** (desde FASE 15, plan 07b):
- [ ] Definición pura del tipo en `src/lib/activityKinds/{tipo}.ts` (`ActivityKind<A, E>`): bundles de log y summary, `summaryBundle`, `activityType`, `motivationFormat`, icono de la intro, `instructions` (cómo se juega; la intro lo usa cuando el nodo no trae `field_custom_explanation`), atributos propios de log y summary y métricas extra de la pantalla final. Si el player registra algo más que `item`/`time`/`errors`, una interfaz `{Tipo}Entry extends TrackedEntry` en `types.ts`
- [ ] Player en `src/components/activities/{Tipo}Player.tsx`: recibe `activity`, `included`, `onEnd(entries)` y `errors`, y **solo pinta el juego** (sin `PlayerShell`, intro, pantalla final ni guardado). `ErrorButton` va dentro del player
- [ ] **Sin textos de instrucción durante el juego** (criterio fijado el 2026-10-21): nada de "Toca para continuar", "Memoriza la posición…" o pistas; eso va en la intro (`instructions` del tipo o `field_custom_explanation` del nodo). En el juego solo quedan el enunciado explícito del ejercicio ("Encuentra todas las p", "¿En qué posición estaba?"), el progreso discreto ("3 / 10") y los avisos de resultado ("Casi. Prueba otra vez."), en un hueco de alto fijo para que nada se mueva
- [ ] Una línea en el registro (`KINDS` en `src/lib/activityKinds/index.ts`) y otra en `renderPlayerFor` de `ActivityRouter`
- [ ] Tipos TypeScript: el nodo en `src/types/activity.ts` (y en `AnyActivityResource`) y los payloads de creación en `src/types/activitylog.ts` / `activitysummary.ts` (y añadirlos a las uniones `LogType`, `SummaryType`, `CreateLogPayload`, `CreateSummaryPayload`, `AnySummaryResource`)
- [ ] Carga del nodo: función en `src/lib/api/activities.ts` (con `include` si el contenido va en paragraphs) y su rama en `loadSession` e `activityIcon` de `app/(auth)/session/[id].tsx`
- [ ] Estadísticas: el bundle del summary en `SummaryBundle`, `SUMMARY_BUNDLES` y `SUMMARY_INCLUDES` de `src/lib/api/statistics.ts` (si no, el dashboard no lo ve como completada ni cuenta su tiempo); si tiene aciertos, también en `ACCURACY_SUMMARY_TYPES` para que salga en "Ejercicios con aciertos" del detalle de estadísticas; si su métrica es un ritmo (más es mejor en tiempo fijo), en `RATE_SUMMARY_TYPES` para la sección "Ejercicios de ritmo" (y el adapter de `src/lib/stats/` debe leer su campo)
- [ ] Lógica pura del contenido en `src/lib/{tipo}.ts` con tests en `src/lib/__tests__/` (como `fase13Logic.test.ts`)
- [ ] Tests de payload en `src/lib/activityKinds/__tests__/` (como `goldenPayloads.test.ts` y `fase13Payloads.test.ts`): logs y summary exactos con y sin sesión, con y sin contar errores
- [ ] Icono del tipo en `src/components/ui/Icon.tsx` si hace falta uno nuevo
- [ ] `ActivityBase` **no se toca**

---

## Jerarquía de clases JS (histórico)

> **Histórico.** Describe el JavaScript del Drupal acoplado (`activitylog_register`), retirado en la FASE 9. Se conserva como referencia de cómo funcionaba; la app no lo usa.

```
Activity (clase base — activitylog_register/js/logregister.js)
│
│  Métodos base:
│  - constructor(element)
│  - initActivity()         → escucha click en startButton
│  - prepareActivity()      → configura timer, oculta intro
│  - startActivity()        → llama prepareActivity()
│  - playActivity()         → llama playActivityItem(), comprueba ended
│  - endActivity()          → prepara datos, llama sendLog()
│  - showMotivationMessage()→ muestra mensaje de motivación + confetti
│  - showConfetti()         → animación canvas-confetti (3 segundos)
│  - nextActivityProcess()  → siguiente actividad o recarga
│  - sendLog()              → POST a /activitylog-register/add via fetch
│  - prepareLogObject()     → serializa arrays a JSON
│
├── ActivityTextList (implementado)
│   Propiedades: counter, posicioItem, elements, activeElement, translateY
│   Sobreescribe: prepareActivity(), startActivity(), playActivityItem()
│   Añade: addRegisterLog() — registra tiempo, peso e ítem en arrays
│
└── ActivityImagePosition (parcialmente implementado)
    Propiedades: subActivities (array de SubActivity)
    Sobreescribe: constructor (crea SubActivity por cada .image-item)
    Pendiente: prepareActivity(), playActivityItem()

SubActivity (helper interno para image position)
  - getCurrentStep(), gotoNextStep(), gotoPrevStep()
  - Gestiona navegación entre pasos dentro de una imagen
```

---

## Jerarquía de componentes React Native

Desde la FASE 15 (plan 07b) hay un solo camino para jugar cualquier actividad:
`ActivityRouter` → `ActivityBase` (todo lo común) → player del tipo (solo el juego).

```
ActivityRouter (src/components/activities/ActivityRouter.tsx)
│  kindFor(activity) → definición del tipo (src/lib/activityKinds/)
│  tipo o formato desconocido → UnsupportedActivity
│
└── ActivityBase<A, E> (src/components/activities/ActivityBase.tsx)
    │  Props: kind, activity, sessionId, renderPlayer(onEnd, errors), onComplete, onNext,
    │         onExit, onRestart, progressCurrent/Total, askRating, onRating
    │  Fases: intro | playing | completed
    │  - intro: icono del tipo (kind.icon), título, field_custom_explanation o kind.instructions(activity), ajustes de fuente
    │  - playing: PlayerShell (salir, reiniciar, progreso, contador de errores) + player
    │  - el player llama onEnd(entries) → guardado:
    │      getNextIteration(kind.summaryBundle) → buildTracking(kind, …)
    │      → postLog por entrada → postSummary con los ids de los logs
    │  - completed: métricas ("Tu tiempo", kind.metrics(), "Errores" si cuenta errores;
    │    con 3 o más se apilan), "¿Cómo ha ido?" si askRating, motivación, botones
    │  - si falla algún POST: InlineAlert + "Reintentar" (repite todo el guardado);
    │    "Siguiente actividad" bloqueado y "Volver a la sesión" sale sin marcarla hecha
    │
    ├── VerticalTextPlayer.tsx   (node--activity vertical_list/blink y node--activity_blink)
    ├── AudioReadingPlayer.tsx   (node--activity con formato audio_reading)
    ├── ImageGroupPlayer.tsx     (node--activity_image_position)
    ├── LetterMatrixPlayer.tsx   (node--activity_letter_matrix, FASE 13a)
    ├── SyllableOrderPlayer.tsx  (node--activity_syllable_order, FASE 13b)
    ├── WordSplitPlayer.tsx      (node--activity_word_split, FASE 13c)
    └── RapidRepetitionPlayer.tsx (node--activity_rapid_repetition, FASE 16a; TimeBar.tsx compartido con la matriz)
```

Reparto:

| Dónde | Qué |
|---|---|
| `src/lib/activityKinds/types.ts` | `TrackedEntry` (`item`, `time`, `errors`), `TextEntry` (+`weight`), `ImageEntry` (+`correctPosition`, `answer`), `MatrixRoundEntry` (+`round`, `found`, `targets`, `falseMarks`), `AttemptEntry` (+`weight`, `attempts`), `RepetitionEntry` (+`weight`, `repetitions`), `Metric`, `ActivityKind<A, E>` |
| `src/lib/activityKinds/{verticalText,blink,imagePosition,letterMatrix,syllableOrder,wordSplit,rapidRepetition}.ts` | Definición pura de cada tipo |
| `src/lib/activityKinds/tracking.ts` | `buildTracking(kind, activity, entries, ctx)`: campos comunes (`label`, `field_item`, `field_time`, `field_iteration`, `field_activity_type`, `field_errors` si se cuentan) y relaciones (`field_activityid`, `field_sessionid`, `field_activitylogs`, área y nivel) |
| `src/lib/activityKinds/index.ts` | Registro `kindFor(activity)` por `activity.type` |
| `src/lib/api/tracking.ts` | `postLog(logType, payload)` / `postSummary(summaryType, payload)`; la ruta sale del tipo (`activitylog--X` → `/activitylog/X`) |

Lo que cada tipo escribe (fijado por los tests de oro, `src/lib/activityKinds/__tests__/goldenPayloads.test.ts`):

| Tipo | `field_activity_type` | Motivación | Log propio | Summary propio | Métricas extra |
|---|---|---|---|---|---|
| `vertical_text` (`node--activity`) | `field_activity_format` | `field_activity_format` | `field_weight` | ninguno | ninguna |
| `blink` (`node--activity_blink`) | `activity_blink` | `blink` | `field_weight` | ninguno | ninguna |
| `image_position` | `image_position` | `image_position` | `field_weight` = posición correcta, `field_answer`, `field_correct` | `field_correct_count`, `field_items_count` | Aciertos `correctas / total` |
| `letter_matrix` (un log por ronda) | `letter_matrix` | `letter_matrix` | `field_weight` = ronda, `field_correct`, `field_correct_count`, `field_items_count` | `field_correct_count`, `field_items_count`, `field_false_marks` | Encontradas `encontradas / objetivos` |
| `syllable_order` | `syllable_order` | `syllable_order` | `field_weight`, `field_correct` (a la primera), `field_attempts` | `field_correct_count`, `field_items_count` | A la primera `n / total` |
| `word_split` | `word_split` | `word_split` | `field_weight`, `field_correct` (a la primera), `field_attempts` | `field_correct_count`, `field_items_count` | A la primera `n / total` |
| `rapid_repetition` (un log por palabra) | `rapid_repetition` | `rapid_repetition` | `field_weight`, `field_repetitions` | `field_repetitions` (sin contadores de acierto) | Repeticiones `total`; Ritmo `r/s` |

La sesión (`app/(auth)/session/[id].tsx`) carga cada actividad con la función correcta según `ref.type`:
```typescript
'node--activity_image_position' → getImageGroupActivity()
'node--activity_blink'          → getBlinkActivity()
'node--activity_letter_matrix'  → getLetterMatrixActivity()
'node--activity_syllable_order' → getSyllableOrderActivity()   // include de paragraphs + media
'node--activity_word_split'     → getWordSplitActivity()
'node--activity_rapid_repetition' → getRapidRepetitionActivity()   // FASE 16, sin include
default                         → getActivity()
```

---

## Mensajes de motivación — lógica de selección

Los `activity_message.motivation_message` tienen el campo `field_activity_types` que referencia tipos de contenido (node_type). Esto permite filtrar qué mensajes aplican a qué tipo de actividad.

**Lógica actual (acoplada, en `preprocess.module`)**:
1. Al hacer preprocess del nodo `activity`, carga todos los `motivation_message` cuyo `field_activity_types` incluye el tipo actual
2. Selecciona uno aleatoriamente
3. Lo inyecta en la variable `$vars['message']`

**Lógica objetivo (desacoplada, en Expo)**:
1. Al cargar una actividad, hacer `GET /jsonapi/activity_message/motivation_message?filter[field_activity_types.type]={activityFormat}`
2. Seleccionar uno aleatoriamente en el cliente
3. Mostrar al finalizar la actividad

> **Nota**: el bundle se llama `motiviation_message` (con typo) en la base de datos actual. Esto se corrige en Fase 0 del roadmap.
