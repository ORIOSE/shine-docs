# Plan de planes: sistema de niveles por área y sesiones dinámicas

Implementa `docs/level-system.md` (diseño acordado el 2026-10-14). Cada fichero de esta carpeta
es un prompt autocontenido para una sesión de Claude Code, con el mismo formato que
`plans/prompts/`. El diseño es la fuente de verdad; si un subplan necesita apartarse de él, lo
anota en `docs/level-system.md` y lo dice en `docs/progress.md`.

## Cómo usarlos

1. Abrir Claude Code en la raíz del proyecto con el modelo indicado en la cabecera del fichero.
2. Pedir: "ejecuta plans/level-sistem/XX-....md" (o pegar su sección "Prompt").
3. Al terminar: verificar según su sección "Verificación", marcar la fila en la tabla de abajo y
   actualizar `docs/progress.md` con una sección "FASE 15" (nombre de esta fase).

## Criterio de modelo

- **Fable**: decisiones de modelo de datos o de acceso, lógica de derivación de estado con
  casos límite (reglas de nivel, generador), y la verificación de extremo a extremo con criterio
  pedagógico.
- **Opus**: tareas con especificación cerrada y patrón ya existente en el repo (clonar una
  entidad, añadir campos y exportar config, pantallas con componentes del design system).

El propio plan de planes se ha escrito con Fable.

## Orden de ejecución

| Orden | Fichero | Modelo | Depende de | Hecho |
|---|---|---|---|---|
| 1 | `01a-backend-campos.md` | Opus | nada | [x] |
| 2 | `01b-backend-sesiones-con-dueno.md` | Fable | 01a | [x] |
| 3 | `02-backend-activityfeedback.md` | Opus | 01a | [x] |
| 4 | `03-backend-shine-level-base.md` | Fable | 01a | [x] |
| 5 | `04-backend-reglas-de-nivel.md` | Fable | 02, 03 | [x] |
| 6 | `05-backend-generador-sesiones.md` | Fable | 01b, 04 | [x] |
| 7 | `06-app-valoracion.md` | Opus | 01a, 02 (en paralelo con 03 a 05) | [x] |
| 8 | `07-app-sesiones-dinamicas.md` | Opus | 01b, 05, 06 | [x] |
| 8b | `07b-app-players-unificados.md` | Opus | 06 (antes de 09; independiente de 07 y 08) | [x] |
| 9 | `08-backend-admin-y-auditoria.md` | Opus | 03, 04 | [x] |
| 10 | `09-verificacion-e2e-y-docs.md` | Fable | todo lo anterior | [ ] |

Camino crítico: 01a → 01b → (03 → 04) → 05 → 07 → 09. Los pasos 02, 06 y 08 pueden ir en
paralelo con el backend de reglas.
07b (unificar los players bajo `ActivityBase`) surge al implementar 06, cuando la valoración
hubo que añadirla dos veces; va en cualquier momento después de 06 y antes de 09.

## Decisiones que el diseño deja abiertas (§10) y quién las resuelve

| Decisión | Dónde se decide | Valor por defecto si nadie decide antes |
|---|---|---|
| Generación automática al abrir la app o botón "Nueva sesión" | 07 | **Decidido (07): botón explícito**; flag `AUTO_GENERATE_SESSION` en `config.ts` para cambiarlo |
| Posponer la evaluación periódica | fuera de alcance de v1 | no se puede posponer (tal como dice §5.3) |
| Textos definitivos en catalán e inglés | 06 | solo castellano, con las claves centralizadas en un único objeto `RATING_COPY` para traducir después |
| Icono de las tres opciones | 06 | tres pesas de tamaño creciente (metáfora de esfuerzo, sin valencia) |
| Radar alimentado también por `activityfeedback` | fuera de alcance de v1 | el radar sigue solo con easiest/hardest |

## Decisiones técnicas que el diseño no cubre y que los subplanes deben cerrar

Se listan aquí para que quien ejecute cada subplan sepa que tiene que decidir y documentar:

- **Acceso a sesiones por dueño** (01b): cómo se hace que un usuario solo vea sus sesiones en
  JSON:API sin romper el admin ni las sesiones antiguas hechas a mano.
- **Qué pasa con las sesiones existentes** (01b): hoy hay sesiones creadas a mano, sin usuario
  real. Hay que decidir si se conservan como plantillas, si se reasignan o si se ocultan.
- **Cómo sabe el servidor que una sesión se ha completado** (04): la regla de nivel se ejecuta
  "al completarse la sesión", pero hoy nadie avisa al servidor. Se propone un endpoint
  idempotente `POST /shine/session/{uuid}/complete` que verifique contra `activitysummary` y
  ejecute la regla; la app lo llama donde hoy decide mostrar la auto-evaluación.
- **Cómo se enlazan las dos sesiones de una evaluación** (04 y 05): el diseño habla de "una
  evaluación de 2 sesiones a medias" pero no define cómo se relacionan. Hace falta un campo en
  `node.session` (secuencia dentro de la evaluación o referencia a la primera sesión).
- **Rachas de `overall`** (04): se derivan del histórico de `sessionfeedback` en cada cálculo,
  sin contador almacenado, de acuerdo con el principio 5 ("se guarda el dato crudo").

## Riesgos conocidos

- Gotcha 14 de CLAUDE.md: todo se prueba con un usuario normal, nunca solo con el user 1. Es
  especialmente grave aquí porque el acceso por dueño y los filtros JSON:API son invisibles
  para el user 1.
- Gotcha 16: toda entidad nueva expuesta en JSON:API necesita `hook_jsonapi_ENTITY_TYPE_filter_access`.
- El techo por contenido (§5.5) depende de que haya actividades en cada área y nivel. Hasta
  que el contenido real esté cargado, la mayoría de áreas se cerrarán en Level0 por falta de
  material, no por el usuario. El subplan 09 crea contenido de prueba para que esto no
  enmascare bugs.
