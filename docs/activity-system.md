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

## Sesiones y grupos

Las actividades se organizan en sesiones:

```
group_session
  └── field_ref_session (M) → session
        └── field_activities (M) → activity / activity_blink / activity_image_position
```

En la app, la pantalla `app/(auth)/session/[id].tsx` encadena las actividades de la sesión; cada log y summary lleva `field_sessionid`. Desde la FASE 15 cada usuario solo ve sus propias sesiones (generadas por el servidor) y `group_session` no se usa.

---

## Cómo añadir un nuevo tipo de actividad

### Checklist completo

**En Drupal (backend)**:
- [ ] Crear `node.type.activity_{tipo}.yml` en `config/install` del módulo correspondiente (o en config sync si se hace via UI)
- [ ] Reutilizar los campos comunes existentes: `field_activity_level`, `field_explanation`, `field_custom_explanation`, `field_activity_code`
- [ ] Añadir campos específicos del tipo (con prefijo `field_`, siguiendo convenciones)
- [ ] Crear bundle nuevo en `activitylog` si las métricas a capturar son diferentes a `logverticaltext` (ver `docs/metrics-tracking.md`)
- [ ] Si hay bundle nuevo en activitylog, crear bundle equivalente en `activitysummary`
- [ ] Exportar config: `drush cex`

**En el frontend Expo** (desde FASE 15, plan 07b):
- [ ] Definición pura del tipo en `src/lib/activityKinds/{tipo}.ts` (`ActivityKind<A, E>`): bundles de log y summary, `summaryBundle`, `activityType`, `motivationFormat`, icono de la intro, atributos propios de log y summary y métricas extra de la pantalla final. Si el player registra algo más que `item`/`time`/`errors`, una interfaz `{Tipo}Entry extends TrackedEntry` en `types.ts`
- [ ] Player en `src/components/activities/{Tipo}Player.tsx`: recibe `activity`, `included`, `onEnd(entries)` y `errors`, y **solo pinta el juego** (sin `PlayerShell`, intro, pantalla final ni guardado). `ErrorButton` va dentro del player
- [ ] Una línea en el registro (`KINDS` en `src/lib/activityKinds/index.ts`) y otra en `renderPlayerFor` de `ActivityRouter`
- [ ] Tipos TypeScript: el nodo en `src/types/activity.ts` y los payloads de creación en `src/types/activitylog.ts` / `activitysummary.ts` (y añadirlos a las uniones `CreateLogPayload` / `CreateSummaryPayload`)
- [ ] Tests de payload en `src/lib/activityKinds/__tests__/` (como `goldenPayloads.test.ts`): logs y summary exactos con y sin sesión, con y sin contar errores
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
    │  - intro: icono del tipo (kind.icon), título, field_custom_explanation, ajustes de fuente
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
    └── ImageGroupPlayer.tsx     (node--activity_image_position)
```

Reparto:

| Dónde | Qué |
|---|---|
| `src/lib/activityKinds/types.ts` | `TrackedEntry` (`item`, `time`, `errors`), `TextEntry` (+`weight`), `ImageEntry` (+`correctPosition`, `answer`), `Metric`, `ActivityKind<A, E>` |
| `src/lib/activityKinds/{verticalText,blink,imagePosition}.ts` | Definición pura de cada tipo |
| `src/lib/activityKinds/tracking.ts` | `buildTracking(kind, activity, entries, ctx)`: campos comunes (`label`, `field_item`, `field_time`, `field_iteration`, `field_activity_type`, `field_errors` si se cuentan) y relaciones (`field_activityid`, `field_sessionid`, `field_activitylogs`, área y nivel) |
| `src/lib/activityKinds/index.ts` | Registro `kindFor(activity)` por `activity.type` |
| `src/lib/api/tracking.ts` | `postLog(logType, payload)` / `postSummary(summaryType, payload)`; la ruta sale del tipo (`activitylog--X` → `/activitylog/X`) |

Lo que cada tipo escribe (fijado por los tests de oro, `src/lib/activityKinds/__tests__/goldenPayloads.test.ts`):

| Tipo | `field_activity_type` | Motivación | Log propio | Summary propio | Métricas extra |
|---|---|---|---|---|---|
| `vertical_text` (`node--activity`) | `field_activity_format` | `field_activity_format` | `field_weight` | ninguno | ninguna |
| `blink` (`node--activity_blink`) | `activity_blink` | `blink` | `field_weight` | ninguno | ninguna |
| `image_position` | `image_position` | `image_position` | `field_weight` = posición correcta, `field_answer`, `field_correct` | `field_correct_count`, `field_items_count` | Aciertos `correctas / total` |

La sesión (`app/(auth)/session/[id].tsx`) carga cada actividad con la función correcta según `ref.type`:
```typescript
'node--activity_image_position' → getImageGroupActivity()
'node--activity_blink'          → getBlinkActivity()
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
