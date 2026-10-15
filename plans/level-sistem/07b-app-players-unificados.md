# 07b. App: `ActivityBase` con lo común y una definición por tipo de actividad

- **Modelo recomendado: Opus.** Refactorización con especificación cerrada: el contrato de cada
  tipo está definido abajo y los payloads que hoy se envían a Drupal quedan fijados con tests
  antes de tocar nada. No hay decisiones de modelado pendientes.
- Fase: 15. Alcance: solo app (`shine-app/`). Sin cambios en Drupal.
- Dependencias: 06 (valoración por actividad). Independiente de 07 y 08 (no comparten
  ficheros). **Debe ir antes de 09**, para que la verificación de extremo a extremo recorra la
  versión definitiva de los players.

## Por qué

Hoy hay dos caminos para jugar una actividad:

- `node--activity` y `node--activity_blink` pasan por `ActivityBase` (intro, marco de juego,
  guardado, pantalla "Actividad completada") con un player hijo (`VerticalTextPlayer`,
  `AudioReadingPlayer`).
- `node--activity_image_position` lo hace todo `ImageGroupPlayer` por su cuenta, porque su
  resultado tiene otra forma (respuesta y posición correcta por grupo), escribe otros bundles
  (`logimageposition` / `summary_image_position` con `field_correct_count` y
  `field_items_count`) y enseña otra tarjeta de métricas (aciertos).

`docs/activity-system.md` dibuja a `ImageGroupPlayer` como hijo de `ActivityBase`, pero no lo
es. Consecuencia: intro, motivación, botones de avanzar y (desde 06) la pregunta "¿Cómo ha ido?"
están duplicados y cada cambio hay que hacerlo dos veces. Con más tipos de actividad por venir,
cada uno con su guardado, esto crece linealmente.

Además, hay una regla del servidor que hoy depende de que cada player la cumpla por su cuenta:
`POST /shine/session/{uuid}/complete` responde `409 incomplete` si falta el `activitysummary`
de alguna actividad, y las reglas de nivel leen el área y el nivel de ese summary. Si los campos
comunes del summary los pone siempre `ActivityBase`, ningún tipo nuevo puede olvidarlos.

## Reparto (decisión cerrada)

**`ActivityBase` se queda con todo lo común**, para cualquier tipo:

- Intro (título, `field_custom_explanation`, icono del tipo, enlace a ajustes de fuente).
- Marco de juego: `PlayerShell` con salir, reiniciar, barra de progreso y contador de errores.
  El contador lo lleva `ActivityBase` (`errors.onError`), como ya hacen los players de texto.
- Guardado: `getNextIteration(summaryBundle)` → un POST por entrada de log → POST del summary.
  Pone él los campos comunes: `label`, `field_iteration`, `field_activity_type`, `field_time`,
  `field_item`, `field_errors` (solo si el tipo cuenta errores), y las relaciones
  `field_activityid`, `field_sessionid`, `field_activitylogs` y las de área/nivel
  (`summaryStatsRelationships`).
- Pantalla "Actividad completada": cabecera, tarjeta de métricas, "¿Cómo ha ido?" si
  `askRating`, motivación y botones. Estado `sending` que bloquea "Siguiente actividad".

**Cada tipo de actividad aporta una definición pura** (sin React) y un player:

```ts
// src/lib/activityKinds/types.ts

/** Lo mínimo que registra un player por cada elemento jugado. */
export interface TrackedEntry {
  item: string;
  /** ms en pantalla de este elemento. */
  time: number;
  /** Errores contados mientras este elemento estaba en pantalla. */
  errors: number;
}

export interface Metric {
  label: string;           // "Aciertos"
  value: string;           // "3 / 4"
  icon: IconName;
  tone?: 'primary' | 'success' | 'accent';
}

export interface ActivityKind<A extends AnyActivityResource, E extends TrackedEntry> {
  /** Clave estable; con ella `ActivityRouter` elige el player. */
  key: 'vertical_text' | 'blink' | 'image_position';
  /** Bundles JSON:API en los que escribe. */
  logType: 'activitylog--logverticaltext' | 'activitylog--log3_textlistblink' | 'activitylog--logimageposition';
  summaryType: 'activitysummary--summary_vertical_text' | 'activitysummary--summary3_vertical_text_blink' | 'activitysummary--summary_image_position';
  /** Bundle para `getNextIteration` (tipo `SummaryBundle` de statistics.ts). */
  summaryBundle: SummaryBundle;
  /** Valor de `field_activity_type` en logs. Hoy: el formato, 'activity_blink' o 'image_position'. */
  activityType(activity: A): string;
  /** Formato con el que se piden los mensajes de motivación. */
  motivationFormat(activity: A): string;
  /** Icono de la intro ('sparkles' para texto, 'image' para imágenes). */
  icon: IconName;
  /** Atributos propios de cada log, además de los comunes. */
  logAttributes(entry: E): Record<string, unknown>;
  /** Atributos propios del summary, además de los comunes. */
  summaryAttributes(entries: E[]): Record<string, unknown>;
  /** Métricas que se enseñan al terminar, además de "Tu tiempo" y "Errores". */
  metrics(entries: E[]): Metric[];
}
```

Valores que tiene que reproducir cada definición (son los payloads de hoy, no se cambia nada
de lo que llega a Drupal):

| Tipo | `activityType` | motivación | `logAttributes` | `summaryAttributes` | métricas extra |
|---|---|---|---|---|---|
| `vertical_text` (`node--activity`) | `field_activity_format` | `field_activity_format` | `field_weight` | ninguno | ninguna |
| `blink` (`node--activity_blink`) | `'activity_blink'` | `'blink'` | `field_weight` | ninguno | ninguna |
| `image_position` | `'image_position'` | `'image_position'` | `field_weight` = posición correcta, `field_answer`, `field_correct` | `field_correct_count`, `field_items_count` | Aciertos `correct / total` |

El player de cada tipo recibe `activity`, `included`, `onEnd(entries: E[])` y `errors`
(`PlayerErrorProps`), y **solo pinta el contenido del juego**: ni `PlayerShell`, ni intro, ni
pantalla final. `ErrorButton` sigue dentro del player, donde ya está en los de texto.

**Registro** (`src/lib/activityKinds/index.ts`): `kindFor(activity): ActivityKind | null` por
`activity.type`; `null` para tipos desconocidos. `ActivityRouter` mapea `kind.key` (y, para
`vertical_text`, el formato) al componente player: `audio_reading` → `AudioReadingPlayer`, el
resto de formatos conocidos → `VerticalTextPlayer`, `image_position` → `ImageGroupPlayer`;
formato desconocido o `kindFor` null → `UnsupportedActivity`, como hoy.

Añadir un tipo nuevo serán: una definición en `src/lib/activityKinds/`, un player, una línea en
el registro y otra en `ActivityRouter`. `ActivityBase` no se toca.

## Prompt

Lee `docs/activity-system.md` (sección "Jerarquía de componentes React Native" y checklist),
`docs/metrics-tracking.md`, `src/components/activities/*.tsx`, `src/lib/api/tracking.ts`,
`src/lib/api/statistics.ts` (`getNextIteration`, `SummaryBundle`), `src/types/activitylog.ts`,
`src/types/activitysummary.ts` y el patrón de tests de `src/lib/__tests__/`. Respeta el reparto
y el contrato de la sección anterior tal cual.

Tareas:

0. **Tests de oro antes de refactorizar.** Lee el código actual de `ActivityBase.handleEnd()` e
   `ImageGroupPlayer.finishActivity()` y escribe en `src/lib/activityKinds/__tests__/` un test
   por tipo que, dada una actividad de ejemplo, unas entradas y un contexto (`iteration`,
   `sessionId`, `countErrors`), espere **exactamente** los payloads de log y de summary que se
   envían hoy (atributos, relaciones y tipos; con y sin `sessionId`; con y sin contar errores;
   para `image_position`, `field_correct` y los contadores). Estos tests fijan el contrato con
   Drupal y deben pasar al terminar sin haberlos retocado.
1. **Definiciones puras** en `src/lib/activityKinds/` (`types.ts`, `verticalText.ts`,
   `blink.ts`, `imagePosition.ts`, `index.ts`) y un constructor de payloads común
   `buildTracking(kind, activity, entries, ctx)` que devuelve `{ logs: payload[], summary: (logIds) => payload }`.
   Mueve ahí `LogEntry` (hoy exportado desde `ActivityBase.tsx`) como `TextEntry extends TrackedEntry { weight }`
   y el `LogEntry` interno de `ImageGroupPlayer` como `ImageEntry extends TrackedEntry { correctPosition; answer }`.
2. **API de tracking**: en `src/lib/api/tracking.ts` añade `postLog(logType, payload)` y
   `postSummary(summaryType, payload)` genéricos (la ruta JSON:API se deriva del tipo:
   `activitylog--X` → `/activitylog/X`). Deja las interfaces de payload por bundle en
   `src/types/`. Elimina los seis `create*Log` / `create*Summary` cuando ya no tengan usos.
3. **`ActivityBase` genérico** sobre `ActivityKind<A, E>`: recibe `kind`, `activity`,
   `included`, el player como `renderPlayer(onEnd, errors)` (como hoy) y el resto de props
   actuales (`askRating`, `onRating`, `onNext`, `onExit`, `onRestart`, progreso). El guardado
   usa `buildTracking`. La tarjeta de métricas pinta "Tu tiempo", las de `kind.metrics()` y
   "Errores" si procede; con tres o más métricas usa la disposición apilada que hoy tiene
   `ImageGroupPlayer` (`perfItemCompact`). Mantén la animación de entrada, la motivación y el
   enlace a ajustes de fuente.
4. **Fallo al guardar** (hoy `ActivityBase` no lo captura e `ImageGroupPlayer` lo silencia):
   si falla algún POST, muestra un `InlineAlert` en la pantalla final ("No hemos podido guardar
   esta actividad. Vuelve a intentarlo.") con botón de reintento que repite **todo** el guardado
   (iteración incluida; los logs ya creados de un intento fallido se ignoran: son huérfanos
   inocuos). Mientras no se haya guardado, "Siguiente actividad" queda deshabilitado y solo se
   puede "Volver a la sesión"; la pantalla de sesión no marca la actividad como hecha
   (`onComplete` / `onNext` solo se disparan tras guardar). Sin usuario autenticado no se guarda
   nada, como hoy.
5. **`ImageGroupPlayer`** pasa a ser solo el juego: quita intro, `PlayerShell`, pantalla final,
   guardado, motivación, valoración y `useAuthStore`. Conserva `resolveGroups`, las fases
   viewing/questioning, `ErrorButton` y la lógica de `skipOnError`; los errores se comunican
   con `errors.onError()`. Al acabar llama a `onEnd(entries)`.
6. **`ActivityRouter`**: resuelve `kindFor(activity)`, elige el player según la tabla del
   registro y monta un único `ActivityBase`. Las props que recibe de `session/[id].tsx` no
   cambian. En `session/[id].tsx`, `activityIcon()` puede pasar a usar `kind.icon` para los
   tipos sin formato; opcional.
7. **Tests**: los de oro del paso 0 más `kindFor` (los tres tipos y un tipo desconocido),
   `buildTracking` con `countErrors` true/false y con/sin sesión, y `metrics()` de
   `image_position` (`"3 / 4"`). Si hay tests existentes que importen `LogEntry` desde
   `ActivityBase`, actualízalos.
8. **Docs**: reescribe en `docs/activity-system.md` la sección "Jerarquía de componentes React
   Native" con el reparto real y sustituye la parte frontend del checklist "Cómo añadir un nuevo
   tipo de actividad" por: definición en `src/lib/activityKinds/`, player, registro, línea en
   `ActivityRouter`, tipos en `src/types/`, tests de payload. Quita `prepare()/play()/end()`
   y la referencia a `activitylog_register.module` (retirado en FASE 9); marca la sección
   "Jerarquía de clases JS (código acoplado actual)" como histórica. Repasa
   `docs/metrics-tracking.md` "Cómo añadir métricas para un nuevo tipo de actividad" y
   `docs/conventions.md` por si nombran `ActivityBase` o `tracking.ts` de forma que ya no sea
   cierta.

Verificación:
- `source ~/.nvm/nvm.sh && nvm use 21 && npx tsc --noEmit && npm run lint && npm test` limpios
  (lint: solo los avisos ya existentes).
- Antes de empezar, guarda como referencia el último summary con sus logs de un usuario de
  prueba para cada uno de los tres tipos, y al terminar juega los tres tipos de nuevo y compara
  (mismos atributos y relaciones, salvo `label`, `field_iteration` y fechas):
  ```bash
  cd shine && ddev drush php-eval '
  foreach (["summary_vertical_text","summary3_vertical_text_blink","summary_image_position"] as $b) {
    $ids = \Drupal::entityQuery("activitysummary")->condition("bundle",$b)->condition("uid",UID)->sort("id","DESC")->range(0,1)->accessCheck(FALSE)->execute();
    foreach (\Drupal::entityTypeManager()->getStorage("activitysummary")->loadMultiple($ids) as $s) {
      echo "== $b\n", json_encode($s->toArray(), JSON_PRETTY_PRINT), "\n";
      foreach ($s->get("field_activitylogs")->referencedEntities() as $l) echo json_encode($l->toArray()), "\n";
    }
  }'
  ```
- Recorrido manual con un usuario normal (gotcha 14): los tres tipos en una sesión regular
  (intro → juego → completada → siguiente) y en una de ajuste (la pregunta "¿Cómo ha ido?"
  aparece para los tres, también en imágenes). Contador de errores con `count_errors` y con
  `skip_on_error` en imágenes. Salir y reiniciar a mitad. Con la red cortada al terminar una
  actividad: aparece el aviso con reintento, "Siguiente actividad" bloqueado, y al recuperar la
  red el reintento guarda y desbloquea.
- `POST /shine/session/{uuid}/complete` responde 200 tras una sesión con los tres tipos
  (ningún `409 incomplete`).

Al terminar: marca la fila en `plans/level-sistem/README.md` y añade la sección en
`docs/progress.md` (FASE 15, 07b), anotando cualquier payload que haya tenido que cambiar
respecto a los tests de oro (no debería haber ninguno).
