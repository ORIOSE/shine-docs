# Sistema de niveles por área y sesiones dinámicas

Diseño acordado el 2026-10-14. Describe cómo se determina el nivel de un usuario en cada área,
cómo se genera cada sesión a partir de esos niveles y qué señales mueven el nivel. Sirve de
base para el prompt de implementación. Los números marcados como parámetro viven en
configuración (`shine_level.settings`), no en código.

---

## 1. Principios

1. **Todo el mundo empieza por abajo.** Al registrarse, el usuario tiene Level0 en todas las
   áreas, independientemente de su edad. El sistema sube el nivel a partir de evidencia, nunca
   por declaración previa.
2. **El nivel va por área, no por usuario.** Un usuario puede tener facilidad en retención
   visual y dificultad en lectura de párrafos. Cada término del vocabulario `areas` tiene su
   propio nivel por usuario.
3. **Las actividades están en Drupal, las sesiones se generan.** Las actividades se introducen y
   configuran a mano (área principal, área secundaria, niveles). Las sesiones se montan en
   servidor para cada usuario a partir de sus niveles por área.
4. **La evaluación es la única autoridad sobre el nivel.** Solo las sesiones de ajuste
   (evaluación) cambian niveles. Las sesiones regulares aportan señales que disparan u orientan
   una evaluación, pero no mueven el nivel por sí mismas. Así cualquier cambio de nivel se
   explica en una frase: "subió en X porque en la sesión de ajuste del día D marcó dos veces
   muy fácil".
5. **Se guarda el dato crudo.** Las valoraciones se almacenan tal cual; los niveles se derivan
   con una regla que se puede cambiar y recalcular desde el histórico.
6. **Sin juicio.** Las preguntas miden esfuerzo vivido, no acierto. Nunca aparecen "mal",
   "error", "test" ni "evaluación" en pantalla.

---

## 2. Vocabulario de la valoración

Misma pregunta y mismas tres opciones en todos los contextos (fin de sesión regular, fin de
cada actividad en sesión de ajuste), para que el gesto se aprenda una sola vez.

| Clave (`rating`) | Texto en pantalla | Significado para el sistema |
|---|---|---|
| `easy` | Demasiado fácil | Señal de subir de nivel |
| `ok` | Bien así | Nivel correcto |
| `hard` | Me ha costado | Señal de bajar de nivel |

- Pregunta: **"¿Cómo ha ido?"**, sin pronombre, para que valga tanto si responde el propio
  usuario como si responde el tutor por un niño.
- Opción de saltar ("Ahora no") siempre presente pero visualmente secundaria. Una valoración
  saltada no cuenta ni a favor ni en contra.
- Orden fijo de las opciones (de "Demasiado fácil" a "Me ha costado"), nunca aleatorizado, para que
  el gesto sea motor y no exija leer cada vez.
- Iconografía sin valencia emocional: no usar caras (la cara triste convierte "me ha costado"
  en una emoción negativa). Usar una metáfora de esfuerzo: tres pesas de tamaño creciente, o
  camino plano / cuesta / montaña. El mensaje de motivación posterior puede reforzar el
  esfuerzo ("hoy has subido una buena cuesta").

Descartado y por qué:
- **Bien / mal**: juzga el resultado, no la experiencia; contradice la regla de producto de no
  señalar debilidades; el dato es ambiguo (mal = me costó, me aburrí o no entendí).
- **Más nivel / menos nivel**: pide al usuario la decisión que debe tomar el sistema; abstracto
  para un niño; sesga hacia la infradeclaración de "menos nivel".
- **Difícil** a secas: en este público funciona como etiqueta ("se me da mal"). Se sustituye
  por la formulación de esfuerzo en primera persona.

Nombres de las sesiones en pantalla: "sesión para conocerte" (bloque inicial), "sesión de
ajuste" (periódicas y disparadas). Misma celebración al terminar que una sesión regular.

---

## 3. Tipos de sesión

### 3.1 Sesión regular

- Composición: N huecos de área (parámetro, por defecto 4) más 1 hueco de ciclo (ver §7).
- Al cerrar la última actividad se pregunta **una vez**:
  1. "¿Cómo ha ido?" (`easy` / `ok` / `hard`) → campo `overall` de `sessionfeedback`.
  2. "¿Con cuál te has sentido mejor?" → `easiest_activity` (ya implementado).
  3. "¿Cuál te ha costado un poco más?" → `hardest_activity` (ya implementado).
- Efectos: `overall` alimenta los disparadores de evaluación (§5.3) y el contador de evidencia
  por área (§5.4). `easiest_activity` / `hardest_activity` siguen alimentando el radar como
  hasta ahora y, combinados con `overall`, el contador de evidencia. **Ninguna de las tres
  respuestas mueve niveles directamente.**

### 3.2 Sesión de ajuste (evaluación)

- Composición: una actividad por área a evaluar, al nivel que esa área esté probando. Sin
  hueco de ciclo: cortas y limpias.
- Al terminar **cada actividad**, antes del mensaje de motivación, se pregunta "¿Cómo ha ido?"
  → una entidad `activityfeedback` por actividad.
- No se hacen las preguntas de fin de sesión.
- Alcance (`field_evaluation_scope`): todas las áreas, o una sola área (evaluación dirigida,
  §5.4).
- Son las únicas sesiones que cambian niveles. La regla se ejecuta en servidor al completarse
  la sesión.

---

## 4. Modelo de datos

### Existente que se reutiliza

- `taxonomy.activity_level`: Level0, Level1, Level2.
- `taxonomy.areas`: un término por área (hoy 5).
- `node.activity*`: `field_activity_level` (múltiple), `field_main_area`, `field_secondary_area`.
- `activitysummary.*`: copia de área/nivel, `field_correct_count` / `field_items_count` donde
  aplica. Es la fuente de "qué ha hecho ya este usuario".
- `sessionfeedback`: entidad sin bundles (uid, session, easiest_activity, hardest_activity).

### Cambios y entidades nuevas

**`node.session`** gana:
- `uid` como dueño real (las sesiones generadas son por usuario). Implica filtro de acceso
  JSON:API por `uid` y que el dashboard filtre por usuario. Implementado en 01b con **node
  grants** (módulo `shine_session_access`, gotcha 17 en CLAUDE.md), no con el gotcha 16, que es
  solo para entidades custom: el servidor filtra las colecciones, la app no necesita
  `filter[uid.id]`. Las sesiones hechas a mano (uid 1) quedan como referencia solo para el admin.
- `field_session_kind` (list_string): `regular` | `evaluation`.
- `field_evaluation_scope` (entity_ref → `areas`, opcional): vacío = todas las áreas.
- `field_evaluation_reason` (list_string, opcional): `initial` | `periodic` | `trigger_easy` |
  `trigger_hard` | `evidence`. Solo informativo, para auditoría.
- `field_evaluation_seq` (integer 1..2, opcional): posición de la sesión dentro de una
  evaluación de varias sesiones. Añadido en la implementación (subplan 01a): el diseño habla de
  "una evaluación de 2 sesiones a medias" pero no decía cómo se enlazan las dos; con la
  secuencia, la segunda se reconoce por `seq = 2` y mismo `field_evaluation_scope`.

**`sessionfeedback`** gana `overall` (list_string: `easy` | `ok` | `hard`, opcional).

**`activityfeedback`** (entidad de contenido nueva, sin bundles, calcada de `sessionfeedback`
en permisos, handler de acceso y `hook_jsonapi_*_filter_access`):
- `uid`, `session` (ref node), `activity` (ref node), `rating` (`easy`|`ok`|`hard`), `created`,
  `label` autogenerada en `preSave`.
- Solo se crea en sesiones de ajuste.

**`userarealevel`** (entidad nueva, una fila por pareja usuario-área; se crea bajo demanda en
Level0 la primera vez que se consulta):
- `uid`, `area` (ref term), `level` (ref term `activity_level`): nivel vigente.
- `probe_level` (ref term): nivel que se está probando en el bloque de evaluación en curso.
  Igual a `level` fuera de evaluación.
- `closed` (boolean): el área ya se ha fijado dentro del bloque inicial.
- `evidence` (integer, con signo): contador de evidencia de sesiones regulares (§5.4).
- `last_evaluated` (timestamp).
- Implementación (03): módulo `shine_level`; unicidad (uid, área) con índice único en tabla;
  "Level0" es el **primer peldaño** de la escalera (orden por peso del término y, a igual
  peso, por nombre natural), no un término buscado por nombre. Las filas se crean bajo demanda
  en `LevelRepository::getForUser()`.

**`userarealevel_log`** (entidad nueva, histórico inmutable):
- `uid`, `area`, `from_level`, `to_level`, `reason` (texto corto: `initial`, `periodic`,
  `trigger_easy`, `trigger_hard`, `evidence`, `reset`), `session` (ref), `created`.
- `reset` (añadido en 08): reinicio manual desde la administración ("Reiniciar niveles" en la
  pestaña Niveles del usuario). Todas las áreas a Level0, abiertas y sin evidencia,
  `field_onboarding_state = evaluating` y las sesiones pendientes despublicadas. No borra nada.
  Solo existe en el histórico, nunca en `field_evaluation_reason` de una sesión. El log de
  reinicio fija `last_evaluated`, y el bloque inicial solo cuenta las sesiones completadas
  desde entonces para el tope `initial_max_sessions`.

**`user`** gana `field_onboarding_state` (list_string): `evaluating` | `regular`. Mientras es
`evaluating`, todas las sesiones generadas son de ajuste (bloque inicial).

---

## 5. Reglas

### 5.1 Bloque inicial (escalera por área)

Objetivo: situar cada área en su nivel en 3 o 4 sesiones, probando material de niveles
superiores sin esperar a que el usuario lo pida.

Estado inicial: `level = Level0`, `probe_level = Level0`, `closed = false` en todas las áreas.

Cada sesión del bloque lleva una actividad por área **no cerrada**, al `probe_level` del área.
Al completarse la sesión, por cada `activityfeedback`:

| rating | efecto sobre el área |
|---|---|
| `easy` | `level = probe_level`; si existe contenido en `probe_level + 1`, `probe_level += 1`; si no, `closed = true` |
| `ok` | `level = probe_level`; `closed = true` |
| `hard` | `level = max(probe_level - 1, Level0)`; `closed = true` |
| saltada | sin cambio; el área se vuelve a probar en la siguiente sesión al mismo nivel |

Aquí **un solo `easy` basta para subir el nivel de prueba**, porque el error se corrige dentro
del bloque (si Level1 resulta `hard`, el área queda en Level0) y la evaluación periódica es la
red de seguridad.

Fin del bloque: cuando todas las áreas están cerradas, o al completar `initial_max_sessions`
(parámetro, por defecto 4). Con tres niveles, la escalera completa Level0 → Level2 se recorre en
3 sesiones; la cuarta confirma las áreas que subieron en la tercera. Al terminar, cualquier área
no cerrada se fija en su `level` actual, `field_onboarding_state = regular`, se registra un
`userarealevel_log` por área con `reason = initial`.

### 5.2 Evaluación periódica y disparada

Fuera del bloque inicial, una evaluación consta de **2 sesiones de ajuste** consecutivas (una
por día de práctica), con una actividad por área incluida en el alcance, al `probe_level`.

- Periódica: `probe_level = level` en todas las áreas.
- Disparada por "fácil" (§5.3): `probe_level = level + 1` (si hay contenido); la hipótesis es
  que el usuario va sobrado.
- Disparada por "me ha costado" (§5.3): `probe_level = level`.
- Dirigida por evidencia (§5.4): una sola área, 3 actividades en **1 sesión**, `probe_level`
  según el signo de la evidencia (positivo → `level + 1`, negativo → `level`).

Al completar la segunda sesión (o la única, en la dirigida), por cada área con 2 o más
valoraciones no saltadas:

| valoraciones del área | efecto |
|---|---|
| todas `easy` | `level = probe_level` si se probó arriba; si se probó al nivel actual, `level += 1` (si hay contenido) |
| 2 o más `hard` | `level = max(level - 1, Level0)` |
| cualquier otra combinación | sin cambio |

Un área con menos de 2 valoraciones (saltadas) no cambia. Tras la evaluación, `probe_level =
level`, `evidence = 0` y `last_evaluated = ahora` en todas las áreas incluidas. Cada cambio
genera un `userarealevel_log`.

**Criterio de agrupación de las sesiones de una evaluación (decidido en 04).** No hay campo de
enlace entre las dos sesiones. Al completar la última (`field_evaluation_seq >=
evaluation_sessions`, o siempre en `evidence`, o si `field_evaluation_seq` está vacío), se
toman los `activityfeedback` del usuario que cumplen a la vez: (1) su sesión es de ajuste con el
mismo `field_evaluation_reason` que la que se cierra; (2) esa sesión está completada (o es la
que se cierra); (3) `created` es posterior al `last_evaluated` del área de la actividad. Como
toda evaluación termina poniendo `last_evaluated = ahora` en sus áreas, los restos de una
evaluación anterior quedan fuera solos, y una evaluación dirigida intermedia solo "roba" las
valoraciones de su propia área. Las valoraciones se agrupan por el `field_main_area` de la
actividad; las de un área fuera del alcance se ignoran. El freno por aciertos (§5.5) se aplica
antes de contar. Implementado en `SessionEvaluator::evaluationRatings()`.

**Cierre de sesión (decidido en 04).** El servidor se entera de que una sesión ha terminado por
`POST /shine/session/{uuid}/complete`, que llama la app donde hoy decide mostrar la
auto-evaluación, después de enviar `sessionfeedback` o el último `activityfeedback`. No se usa
un hook sobre esas entidades porque una sesión regular puede cerrarse con la auto-evaluación
saltada y en una de ajuste no hay un "último" evento fiable. El endpoint verifica contra
`activitysummary` que cada actividad tiene summary del dueño (409 si falta alguna), es
idempotente (`field_completed_at` en el nodo) y solo lo puede llamar el dueño.

Lanzamiento de la periódica: cada `periodic_sessions` sesiones regulares completadas
(parámetro, por defecto 6) **y** al menos `periodic_min_days` días desde la última evaluación
(parámetro, por defecto 7). Se cuenta por sesiones y no solo por días porque 10 días son 4
sesiones para quien practica tres veces por semana y 10 para quien practica a diario.

### 5.3 Disparadores desde sesiones regulares (`overall`)

- `trigger_easy_streak` (por defecto 3) sesiones regulares consecutivas con `overall = easy`
  → se ofrece una evaluación con `probe_level = level + 1`.
- `trigger_hard_streak` (por defecto 2) sesiones consecutivas con `overall = hard` → se ofrece
  una evaluación con `probe_level = level`.

La asimetría es deliberada: con dislexia, el coste de ir pasado de nivel es el abandono, así que
se reacciona antes. Una sola sesión es ruido (el generador pudo sacar actividades blandas ese
día). Las sesiones con `overall` saltado rompen la racha. Tras cualquier evaluación, las rachas
se ponen a cero.

"Se ofrece" significa que la siguiente sesión generada es de ajuste; no se pide confirmación al
usuario, para no añadir pantallas.

### 5.4 Contador de evidencia por área

Es la forma en que la actividad más fácil / más difícil de cada sesión regular influye en el
nivel: no lo mueve, pero adelanta y orienta una evaluación.

| `overall` | `easiest_activity` | `hardest_activity` |
|---|---|---|
| `easy` | +1 al área principal de la actividad | nada |
| `ok` | nada | nada |
| `hard` | nada | -1 al área principal de la actividad |

Cuando `abs(evidence) >= evidence_threshold` (por defecto 3) en un área, la siguiente sesión
generada es una evaluación dirigida a esa área (§5.2). El contador del área se pone a cero tras
cualquier evaluación que la incluya.

Solo cuenta el **área principal** de la actividad señalada. La secundaria sigue alimentando el
radar (±3) pero no la evidencia ni los niveles, para que cada señal tenga un único destinatario.

### 5.5 Salvaguardas

- **Techo por contenido**: un área no puede subir a un nivel en el que no exista ninguna
  actividad con esa área principal. El generador comprueba la existencia antes de fijar
  `probe_level`. Decidido en 05: las actividades de ciclo (§7) **no cuentan** como contenido
  del área y nivel, porque no se sirven por los huecos de área; un nivel que solo tuviera
  material de ciclo sería inalcanzable para el generador. El techo solo baja: si un área no
  tiene contenido en Level0 pero sí en Level1, el bloque inicial no puede probarla (se omite
  con aviso en watchdog) hasta que exista material en Level0.
- **Freno por aciertos**: donde el summary tenga `field_items_count > 0`, un `easy` con
  `field_correct_count / field_items_count < accuracy_floor` (por defecto 0,6) se trata como
  `ok` a efectos de nivel. La valoración cruda se guarda intacta.
- **Histéresis**: tras un cambio de nivel en un área, esa área no vuelve a cambiar hasta
  haber recibido al menos `min_ratings_after_change` (por defecto 2) valoraciones nuevas en
  evaluación. En la práctica lo garantiza el propio formato de 2 sesiones, pero se deja
  explícito por si se cambia el formato.

---

## 6. Generador de sesiones

Se ejecuta en servidor (servicio `shine_level.session_generator`) cuando el usuario no tiene
ninguna sesión pendiente. Devuelve un nodo `session` con `uid` del usuario.

```
generarSesion(usuario):
  niveles = cargar userarealevel del usuario (crear en Level0 las que falten)

  si usuario.onboarding_state == evaluating:
      areas = niveles sin closed
      return sesionAjuste(areas, probe_level de cada una, reason=initial)

  si existe area con abs(evidence) >= evidence_threshold:
      return sesionAjuste([area], probe segun signo, reason=evidence, actividades=3)

  si racha_easy >= trigger_easy_streak:
      return sesionAjuste(todas, level+1, reason=trigger_easy)
  si racha_hard >= trigger_hard_streak:
      return sesionAjuste(todas, level, reason=trigger_hard)

  si sesiones_regulares_desde_ultima_eval >= periodic_sessions
     y dias_desde_ultima_eval >= periodic_min_days:
      return sesionAjuste(todas, level, reason=periodic)

  si hay una evaluacion de 2 sesiones a medias (1 completada):
      return segunda sesion de esa evaluacion

  return sesionRegular(niveles)
```

```
sesionRegular(niveles):
  huecos = []
  areasOrdenadas = rotacion(areas)        # ver nota
  para i en 1..regular_slots:
      area = areasOrdenadas[i mod n]
      candidatas = actividades con field_main_area == area
                   y field_activity_level contiene niveles[area].level
                   y no hechas por el usuario en las ultimas recent_window sesiones
      si vacio: repetir con level - 1 hasta Level0; si sigue vacio, saltar hueco
      huecos += aleatoria(candidatas)
  huecos += siguienteDelCiclo(usuario)     # §7, uno por ciclo activo
  return crear node session(kind=regular, field_activities=huecos)
```

**Orden del árbol (ajustado en 05).** La comprobación "evaluación de 2 sesiones a medias" se
ejecuta justo después del bloque inicial y **antes** de los disparadores, no al final como en
el pseudocódigo. Motivo: las rachas, el contador de evidencia y el contador de sesiones
regulares solo se ponen a cero al completar la evaluación entera (cuando se cierra la última
sesión y se fija `last_evaluated`), así que con el orden literal el disparador que abrió la
evaluación seguiría activo tras la primera sesión y generaría otra "sesión 1" en bucle en vez de
la segunda. Se continúa la evaluación cuando la **última sesión completada** del usuario es de
ajuste con `reason` periódica o por racha y `field_evaluation_seq < evaluation_sessions`; la
segunda hereda `reason` y `scope` y no toca los `probe_level` (ya fijados por la primera). La
inicial y la dirigida nunca se continúan.

Otros detalles cerrados en 05: la sesión pendiente (propia, publicada, sin
`field_completed_at`) se devuelve en vez de generar otra; `probe_level` se escribe en las filas
`userarealevel` al crear la sesión de ajuste (el evaluador lo lee de ahí al cerrarla); el
`probe_level` de una evaluación con "un nivel por encima" se capa al vigente si no hay contenido
arriba (aviso en watchdog); si al elegir actividad no hay material en el `probe_level` se baja
hasta encontrarlo y se fija ese; las actividades ya usadas en cualquier sesión de ajuste del
usuario se evitan mientras queden otras; si ninguna área tiene contenido no se crea la sesión
(422 `no_content`). `area_selection = weakest_first` **no está implementado en el servidor** (el
radar se calcula en la app): el generador usa rotación y deja un aviso; el formulario lo dice.

Nota sobre la rotación de áreas: v1 usa rotación simple (cada sesión empieza por el área
siguiente a la que abrió la anterior), para cubrir todas las áreas por igual. Queda como
parámetro `area_selection` la variante ponderada hacia el vértice más bajo del radar, coherente
con la frase "te invitamos a practicar" que ya muestra la app.

`sesionAjuste` toma, por área, una actividad aleatoria con `field_main_area == area` y nivel
que contenga `probe_level`, excluyendo las ya usadas en evaluaciones anteriores del usuario
mientras haya alternativas.

---

## 7. Ciclos obligatorios (sílabas)

Hay ejercicios por los que todo usuario debe pasar, al margen de su nivel, en orden y sin repetir
ninguno hasta haberlos hecho todos (todas las sílabas que suelen dar dificultad: la le li lo lu,
bra bre bri bro bru, etc.). Marcar todos los niveles en la actividad hace que aparezcan, pero no
garantiza ni orden ni cobertura, y mezcla dos conceptos distintos (dificultad y obligatoriedad).
Se separa con un vocabulario propio.

- `taxonomy.activity_cycle`: un término por recorrido obligatorio ("Sílabas").
- En las actividades: `field_cycle` (ref term, opcional) y `field_cycle_weight` (integer,
  opcional) para el orden pedagógico. Las actividades con ciclo **ignoran el filtro de nivel**
  en el generador.
- `siguienteDelCiclo(usuario)`: para cada ciclo, la actividad del ciclo con menos
  `activitysummary` del usuario (en cualquier sesión, no solo la actual); a igualdad, la de
  menor `field_cycle_weight`; sin peso, aleatoria entre las empatadas. Así la vuelta 2 no
  empieza hasta que todas tienen 1 summary, la vuelta 3 hasta que todas tienen 2, etc., sin
  campos nuevos en el summary.
- Una sesión nunca lleva dos actividades del mismo ciclo. Los ciclos solo entran en sesiones
  regulares. Las actividades con `field_cycle` quedan fuera de los huecos de área, de las
  sesiones de ajuste y del techo por contenido (§5.5).
- El cierre por pareja (sesión, actividad) ya implementado no afecta: los summaries persisten
  entre sesiones.

---

## 8. Parámetros (`shine_level.settings`)

| Clave | Por defecto | Uso |
|---|---|---|
| `regular_slots` | 4 | huecos de área por sesión regular |
| `recent_window` | 5 | sesiones hacia atrás en las que no se repite actividad |
| `initial_max_sessions` | 4 | tope del bloque inicial |
| `periodic_sessions` | 6 | sesiones regulares entre evaluaciones periódicas |
| `periodic_min_days` | 7 | días mínimos entre evaluaciones |
| `trigger_easy_streak` | 3 | sesiones `easy` seguidas para ofrecer evaluación |
| `trigger_hard_streak` | 2 | sesiones `hard` seguidas para ofrecer evaluación |
| `evidence_threshold` | 3 | evidencia por área para evaluación dirigida |
| `evaluation_sessions` | 2 | sesiones por evaluación completa |
| `targeted_activities` | 3 | actividades en una evaluación dirigida |
| `accuracy_floor` | 0.6 | aciertos mínimos para que un `easy` cuente |
| `min_ratings_after_change` | 2 | histéresis |
| `area_selection` | `rotation` | `rotation` o `weakest_first` |

---

## 9. Consecuencias en la app

- `SessionFeedbackPrompt` gana la pregunta "¿Cómo ha ido?" como primera de las tres, con las
  opciones de §2.
- Nuevo `ActivityFeedbackPrompt` (misma pregunta y opciones) que `ActivityBase` muestra tras
  la actividad solo cuando `session.field_session_kind == evaluation`, antes del mensaje de
  motivación. POST a `activityfeedback`.
- `LevelChip` en tarjetas de sesión deja de tener sentido con sesiones mezcladas por área. Se
  retira de las tarjetas. **Hecho (07)**: retirado de tarjetas y detalle y eliminado del código. Si se quiere mostrar el nivel, el sitio es el radar de áreas, como
  etiqueta en cada vértice; también es aceptable no mostrarlo (regla de no comparar).
- Dashboard: lista solo sesiones del usuario; la tarjeta "Continuar" y la lista funcionan igual.
  Si no hay sesión pendiente, un botón "Nueva sesión" pide al servidor que genere una
  (endpoint `POST /shine/session/generate`, o generación automática al cargar el dashboard).
- Las sesiones de ajuste se presentan con su nombre de §2 y la misma celebración al terminar.

---

## 10. Pendiente de decidir

- ~~Si la generación es automática al abrir la app o bajo demanda con botón.~~ **Decidido (07)**:
  botón "Nueva sesión" en el dashboard cuando no hay sesión pendiente (menos sorpresas al
  probar). `AUTO_GENERATE_SESSION` en `shine-app/src/lib/config.ts` (hoy `false`) cambia a
  generación automática al cargar el dashboard sin tocar nada más.
- Si en la evaluación periódica el usuario puede posponerla (hoy: no, la siguiente sesión es de
  ajuste sin preguntar).
- Textos definitivos en catalán e inglés de las tres opciones. **Castellano decidido (06)**:
  "¿Cómo ha ido?", "Demasiado fácil" / "Bien así" / "Me ha costado" y "Ahora no", todos en
  `RATING_COPY` (`shine-app/src/lib/rating.ts`) para traducir sin tocar componentes. Catalán e
  inglés siguen pendientes.
- ~~Icono definitivo de las tres opciones.~~ **Decidido (06)**: tres pesas rusas de tamaño
  creciente (`weight-sm` / `weight-md` / `weight-lg` en `Icon.tsx`), mismo trazo, solo cambia
  el tamaño. Si se prefiere camino/cuesta/montaña basta con cambiar `RATING_ICONS`.
- Si el radar pasa a alimentarse también de `activityfeedback` (una marca por actividad) o
  sigue solo con easiest/hardest.
- **`group_session`** (propuesta de 01b): con sesiones generadas por usuario, la agrupación
  manual de sesiones deja de tener sentido (la app solo tiene el tipo TS `node--group_session`,
  no lo consulta). Propuesta: retirar el tipo `group_session` y `field_ref_session` cuando la
  app pase a sesiones dinámicas (07). Hasta entonces sigue existiendo y visible para todos.
  **Estado tras 07**: la app ya trabaja solo con sesiones generadas y no consulta
  `group_session`; retirarlo es trabajo de backend (no entraba en 07, que es solo app) y sigue
  pendiente.
