# Plan de planes: FASE 19, matriz con regla (Funciones Ejecutivas y Atención)

Da a "Funciones Ejecutivas y Atención" su tipo de ejercicio propio. Fuente de verdad: la propuesta
plans/contenido/encarrecs/lliuraments/E10-4-funcions-executives-proposta.md (apartado 3.1, mecánica
y parámetros por nivel; 3.2, coste por pieza) y la respuesta del grupo de expertos
(lliuraments/E10-4-funcions-executives-proposta-respostes.md y resposta-experts-Per-revisar.md,
2026-10-29). Si un subplan necesita apartarse de la propuesta, lo anota aquí y en docs/progress.md.

Lo que se construye, en una frase: la matriz de discriminación visual (activity_letter_matrix)
admite una **regla**; el niño toca solo las celdas que la cumplen; las que se parecen al objetivo
pero no la cumplen son **cebos** y se cuentan aparte (la comisión impulsiva); el área principal de
estas actividades es Funciones Ejecutivas y Atención.

## Decisiones cerradas (grupo de expertos, 2026-10-29)

1. Opción (a) de la propuesta: matriz con regla, como fase propia.
2. Se adoptan los **valores por defecto** de la propuesta para todo lo que el grupo no respondió
   en detalle: las cuatro familias de regla y su nivel de entrada, símbolos en Level0 y Level2,
   cebos que restan del acierto, tiempos por ronda y regla oculta al empezar la ronda en Level9 y
   Level10.
3. Mientras no haya contenido del área, la matriz, la posición de imágenes y la repetición rápida
   la llevan como secundaria, y el generador no le reserva hueco (hecho el 2026-10-29).

## Parámetros por defecto (propuesta 3.1)

| Regla | Enunciado | Objetivo | Cebo | Entra en |
|---|---|---|---|---|
| R1 Clave de fila | "En cada fila, toca las que son iguales a la primera" | iguales a la clave de su fila (primera columna, no tocable) | iguales a la clave de otra fila | Level0, Level1 |
| R2 Después de | "Toca la p solo si justo antes hay una a" | la p con una a justo a la izquierda en la misma fila | la p sin esa a, o al principio de fila | Level2 a Level4, Level7, Level9 |
| R3 Menos después de | "Toca todas las p, menos las que tienen una a justo antes" | las p sin a justo antes | las p con a justo antes | Level5, Level8 |
| R4 Alternancia | "En las filas claras toca la s; en las oscuras, la m" | el objetivo de la fila según su fondo | el objetivo de la otra clase de fila | Level6, Level10 (con R2) |

| Nivel | Estímulo | Regla | Cuadrícula (col × filas) | Rondas | Objetivos | Cebos | Regla visible | Tiempo por ronda |
|---|---|---|---|---|---|---|---|---|
| Level0 | símbolos (● ▲ ■ ★) | R1 | 4 × 3 (1 clave + 3) | 2 | 3 | 2 | sí | sin límite |
| Level1 | letras muy distintas | R1 | 5 × 4 (1 clave + 4) | 2 | 6 | 3 | sí | sin límite |
| Level2 | símbolos | R2 | 4 × 4 | 2 | 3 | 2 | sí | sin límite |
| Level3 | letras muy distintas | R2 | 5 × 5 | 2 | 5 | 4 | sí | 60 s |
| Level4 | letras | R2 | 6 × 6 | 1 | 6 | 6 | sí | 50 s |
| Level5 | letras | R3 | 6 × 6 | 1 | 7 | 5 | sí | 45 s |
| Level6 | letras | R4 | 6 × 7 | 1 | 8 | 6 | sí | 45 s |
| Level7 | sílabas CV | R2 | 4 × 7 | 1 | 6 | 4 | sí | 45 s |
| Level8 | sílabas CV y CVC | R3 | 4 × 8 | 1 | 7 | 5 | sí | 40 s |
| Level9 | palabras cortas (artículo + nombre) | R2 | 3 × 8 | 2 | 4 | 4 | se oculta al empezar | 50 s |
| Level10 | palabras cortas | R4 + R2 | 3 × 8 | 2 | 4 | 5 | se oculta al empezar | 50 s |

Acierto efectivo para el freno por aciertos del evaluador: (objetivos encontrados − cebos tocados)
/ objetivos, con mínimo 0. Al revelar, los cebos tocados vuelven al color neutro sin mensaje de
error (como las falsas marcas de hoy).

## Subplanes

| N.º | Subplan | Qué incluye | Criterio de aceptación |
|---|---|---|---|
| 01 | Modelo en Drupal | En `activity_letter_matrix`: `field_rule` (R1 a R4 o vacío), `field_rule_params` (contexto, objetivo por clase de fila, si la regla se oculta) y celdas objetivo y cebo por ronda calculadas por el importador. En el log y el summary de la matriz: `field_lure_marks`. Config en config/sync, `drush cim` limpio. | Una matriz sin regla se comporta igual que hoy; los campos nuevos salen por JSON:API. |
| 02 | Importador | Clave `regla` en `contenido` de `LetterMatrixActivityHandler`: validación por familia, cálculo de objetivos y cebos a partir de la regla (el lote declara los recuentos y el importador los comprueba), huella con la regla, prefijo y área `ATE` (`MAT-XX-Lnn-ATE-nnn`). Kernel tests. | Un lote con un recuento que no cuadra se rechaza; los lotes de matriz actuales se reimportan sin cambios. |
| 03 | Evaluador | `SessionEvaluator`: acierto efectivo con cebos en el freno por aciertos cuando el summary tiene `field_lure_marks` (comprobando `hasField`, como en la repetición rápida). Tests. | Un niño que toca todos los objetivos y todos los cebos no puede subir de nivel por acierto. |
| 04 | App | `letterMatrix.ts`: objetivos por índice de celda, no por texto; columna de clave (R1); fondo alterno de filas (R4); enunciado de la regla con fichas ([a] → [p]); regla oculta al empezar la ronda (Level9 y Level10); cebos tocados en el log y el summary; textos es y ca en los catálogos de idioma. Tests de la lógica pura y de los payloads. | Se juega una matriz de cada regla en Expo web, en los dos idiomas, y los registros llegan a Drupal con los cebos. |
| 05 | Generador y lotes | `shine/content/generadores/matriz_regla.py` con semilla: material de baja semejanza visual (nunca b, d, p, q como objetivo y cebo), 40 a 50 % de celdas neutras, regla mirada solo dentro de la fila, sin parejas que cumplan la regla por azar. Lotes compartidos es y ca de Level0 a Level8 (registro con `idiomas`) y por idioma en Level9 y Level10, 6 actividades por nivel, con revisión del grupo (protocolo E12). | Cobertura del área con 6 actividades por nivel en los dos idiomas tras la revisión. |
| 06 | Mensajes y verificación | Un mensaje de explicación por familia de regla, con imagen de ejemplo, en los dos idiomas; el área vuelve a la rotación sola en cuanto tiene contenido (no hay que tocar el generador); recorrido completo con un alumno de cada idioma; documentación (catálogo 6.1, activity-system, CLAUDE.md, progress). | Sesiones regulares con un hueco de Funciones Ejecutivas lleno y radar del área moviéndose por actividad principal. |

Orden: 01 → 02 → 03 y 04 en paralelo → 05 → 06. El 05 puede empezar en cuanto exista el contrato del
02 (la forma del lote), con el generador probado contra el validador.

## Riesgos y notas

- Sin cambios en sesiones, carga de la sesión, `ACTIVITY_BUNDLES` ni estadísticas: es el mismo bundle.
- La regla "antes" es "a la izquierda en el sentido de lectura", con flecha; si el grupo detecta
  problemas de lateralidad en la revisión del 05, se cambia el enunciado, no la mecánica.
- Las referencias bibliográficas de la propuesta están marcadas "a verificar"; no se citan en la
  app ni en la web hasta que el grupo las confirme (docs/fuentes-de-datos.md).
