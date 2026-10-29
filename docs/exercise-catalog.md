# Catálogo de ejercicios, escala de niveles y generación automática

Referencia para crear ejercicios (actividades) de forma automatizada. Describe los cuatro tipos
implementados y los tres que se implementarán en la FASE 13
([13a](../plans/prompts/13a-ejercicio-matriz.md), [13b](../plans/prompts/13b-ejercicio-silabas.md),
[13c](../plans/prompts/13c-ejercicio-segmentacion.md)), la escala de niveles de 0 a 10 y el
mecanismo para generar contenido y cargarlo en Drupal sin pasar por el formulario de administración.

Estado a 2026-10-16. Documentos relacionados:

- [activity-system.md](activity-system.md): cómo se construye un tipo de actividad (Drupal y app).
- [level-system.md](level-system.md): reglas de nivel, sesiones de ajuste y generador de sesiones.
- [conventions.md](conventions.md): nombres de node types, bundles y componentes.
- [plans/design/07-fase-ejecucion/README.md](../plans/design/07-fase-ejecucion/README.md): diseño
  visual de los ejercicios nuevos.

> Los valores de referencia por edad (velocidad lectora, tamaños, tiempos) son orientativos y sirven
> para dimensionar el contenido. Hay que validarlos con el equipo terapéutico antes de generar lotes
> grandes y nunca se muestran al usuario: la regla de producto es comparar solo contra uno mismo.

---

## 1. Resumen

| Tipo | Node type | Estado | Área principal recomendada | Qué entrena | Origen del contenido |
|---|---|---|---|---|---|
| Lista de texto | activity, formato vertical_list | Implementado | Competencia Lingüística y Fonológica o Rendimiento y Velocidad de Procesamiento | Decodificación y fluidez palabra a palabra | Léxico filtrado por nivel |
| Lectura en voz alta | activity, formato audio_reading | Solo en la app (ver 5.2) | Rendimiento y Velocidad de Procesamiento | Fluidez en texto continuo | Textos redactados con restricciones |
| Parpadeo | activity_blink | Implementado | Rendimiento y Velocidad de Procesamiento | Lectura de sílabas y grupos de letras | Inventario silábico |
| Posición de imágenes | activity_image_position | Implementado | Memoria de Trabajo (Auditiva y Visual) | Memoria visoespacial | Banco de imágenes etiquetado |
| Matriz de discriminación visual | activity_letter_matrix | Implementado (13a, 2026-10-21) | Procesos Perceptivos (Discriminación Visual y Auditiva) | Discriminación de letras parecidas, atención selectiva | Totalmente algorítmico |
| Reordenamiento de sílabas | activity_syllable_order | Implementado (13b, 2026-10-21) | Competencia Lingüística y Fonológica | Decodificación silábica, memoria operativa | Léxico con silabeo |
| Segmentación léxica | activity_word_split | Implementado (13c, 2026-10-21) | Competencia Lingüística y Fonológica | Conciencia léxica (evitar unir palabras) | Frases redactadas con restricciones |
| Repetición rápida de palabra | activity_rapid_repetition | Implementado (16a, 2026-10-21) | Rendimiento y Velocidad de Procesamiento | Tasa de articulación: repeticiones por segundo en tiempo fijo | Léxico filtrado por estructura silábica |

Las cinco áreas existen ya como términos del vocabulario areas. Ninguno de los ejercicios nuevos
necesita un área nueva: los prompts 13a y 13c piden crear "discriminación visual" y "conciencia
léxica" si no existen, y ambas quedan cubiertas por Procesos Perceptivos y por Competencia
Lingüística y Fonológica. Añadir áreas multiplica el contenido necesario (sección 3.3) y cambia el
radar, así que no se recomienda.

---

## 2. Escala de niveles

### 2.1 Qué significa un nivel

- **El nivel n equivale a la edad de referencia 5 + n años.** Level0 es lo que maneja con un esfuerzo
  normal un niño de 5 años sin dificultades de aprendizaje; Level10, lo que maneja uno de 15 años.
  Cada nivel corresponde, más o menos, a un curso escolar.
- **Criterio para etiquetar una actividad en el nivel n**: un niño de 5 + n años sin dificultades la
  valoraría "Bien así" (ni "Demasiado fácil" ni "Me ha costado").
- **El nivel es por área, no por persona.** Un usuario de 11 años con dislexia puede estar en Level2
  en Competencia Lingüística y Fonológica (decodifica como un niño de 7 años) y en Level6 en Memoria
  de Trabajo.
- **La edad real no interviene.** Todo usuario empieza en Level0 en todas las áreas y sube con
  evidencia ([level-system.md](level-system.md), sección 1).
- **La escala es interna.** Sirve para crear y etiquetar contenido y para que el generador elija
  actividades. No se enseña al usuario ni se traduce a "edad lectora" en pantalla.

### 2.2 Niveles, edades y perfil esperado

| Nivel | Edad | Curso | Perfil lector de referencia |
|---|---|---|---|
| Level0 | 5 años | 3.º de Educación Infantil | Conoce las vocales y algunas consonantes. Lee sílabas directas simples (ma, pa, lo) y alguna palabra bisílaba muy familiar. Conciencia silábica emergente. |
| Level1 | 6 años | 1.º de Primaria | Aprende a decodificar: todas las sílabas directas, inversas (al, en) y mixtas (sol), diptongos frecuentes. Palabras de 2 y 3 sílabas y frases muy cortas. |
| Level2 | 7 años | 2.º de Primaria | Sílabas trabadas (pla, bra, tre) y grafías como gue, gui, güe. Frases de 4 a 6 palabras y textos breves. |
| Level3 | 8 años | 3.º de Primaria | Domina todas las estructuras silábicas, incluidas las complejas (ins, cons, trans) y los hiatos. Lee párrafos cortos. |
| Level4 | 9 años | 4.º de Primaria | Decodificación automatizada en palabras frecuentes. A partir de aquí la dificultad está en la longitud, la frecuencia de las palabras y la velocidad. |
| Level5 | 10 años | 5.º de Primaria | Lectura fluida de textos narrativos. Vocabulario de frecuencia media. |
| Level6 | 11 años | 6.º de Primaria | Palabras poco frecuentes y compuestas. Frases con subordinadas. |
| Level7 | 12 años | 1.º de ESO | Textos expositivos y vocabulario académico básico. |
| Level8 | 13 años | 2.º de ESO | Textos largos con tecnicismos frecuentes. |
| Level9 | 14 años | 3.º de ESO | Vocabulario técnico y frases largas con varias subordinadas. |
| Level10 | 15 años | 4.º de ESO | Lectura funcional de cualquier texto general. |

El castellano tiene una ortografía muy transparente: la decodificación de todas las estructuras
silábicas se completa hacia los 8 años (Level3). Por eso la progresión por estructura silábica se
concentra en Level0 a Level3, y de Level4 en adelante lo que crece es la longitud, la rareza del
vocabulario, la complejidad sintáctica y la carga de memoria y atención.

#### Perfil lector de referencia en catalán

La escala de edades y cursos y el criterio de etiquetado (un niño de 5 + n años sin dificultades lo
valoraría "Bien así") son comunes a los dos idiomas. Lo que cambia es el perfil lector de cada
nivel: el catalán es menos transparente que el castellano (vocal neutra, codas finales CVC y CVCC,
dígrafos propios, ela geminada, apóstrofos y contracciones), así que la decodificación completa de
todas las estructuras se alarga como mínimo hasta Level3. Fuente: plans/multiidioma/Shine en
Catalán.md (2.2), con los ajustes de plans/multiidioma/estructura-ca.md.

| Nivel | Edad y curso | Perfil lector de referencia en catalán |
|---|---|---|
| Level0 | 5 años, 3.º de Educación Infantil | Coneix les vocals i consonants bàsiques. Llegeix síl·labes directes simples (ma, pa, la) i paraules bisíl·labes molt familiars. Consciència sil·làbica i fonològica emergent. |
| Level1 | 6 años, 1.º de Primaria | Decodifica totes les síl·labes directes, inverses (al, en), mixtes i monosíl·labs CVC molt freqüents en català (gat, pa, sol, cap). Dígrafs simples (ny, ll, qu, gu, ss, rr). Frases molt curtes. |
| Level2 | 7 años, 2.º de Primaria | Síl·labes travades (pla, bra, tre), dígrafs complexos (tx, ig, tg, tj) i reconeixement inicial de la vocal neutra. Frases de 4 a 6 paraules i textos breus. |
| Level3 | 8 años, 3.º de Primaria | Domina l’ela geminada (l·l), l’apòstrof (l’, d’), síl·labes complexes (ins, cons, trans), hiats i diftongs. Llegeix paràgrafs curts amb fluïdesa emergent. |
| Level4 | 9 años, 4.º de Primaria | Decodificació automatitzada de paraules freqüents, dominant la vocal neutra i la distinció o/u i a/e àtones. La dificultat augmenta en longitud, freqüència i velocitat. |
| Level5 | 10 años, 5.º de Primaria | Lectura fluïda de textos narratius. Vocabulari de freqüència mitjana i pronoms febles bàsics. |
| Level6 | 11 años, 6.º de Primaria | Paraules poc freqüents, compostes i derivades. Frases complexes amb oracions subordinades. |
| Level7 | 12 años, 1.º de ESO | Textos expositius i vocabulari acadèmic bàsic. Maneig dels pronoms febles combinats. |
| Level8 | 13 años, 2.º de ESO | Textos extensos amb tecnicismes freqüents i sintaxi complexa. |
| Level9 | 14 años, 3.º de ESO | Vocabulari tècnic especialitzat i frases llargues amb subordinació múltiple. |
| Level10 | 15 años, 4.º de ESO | Lectura funcional i crítica de qualsevol text general adult. |

### 2.3 Referencias lingüísticas por nivel

Base común de todos los generadores: cada tipo toma de esta tabla lo que necesita. V = vocal,
C = consonante (CCV = pla, VC = al, CVC = sol, CCVC = tren).

| Nivel | Estructuras silábicas admitidas | Sílabas por palabra | Frecuencia (rango máximo) | Palabras por frase | Palabras por texto | Velocidad de referencia (palabras por minuto, en voz alta) |
|---|---|---|---|---|---|---|
| Level0 | V y CV con m, p, l, s, t, n, d | 1 a 2 | 500 más frecuentes | no aplica | no aplica | no aplica |
| Level1 | Todas las CV (incluidas c/qu, g/gu, r/rr, ch, ll, ñ, z), VC, CVC, diptongos frecuentes | 2 a 3 | 1.000 | 3 a 5 | 35 a 80 | 30 a 50 |
| Level2 | + CCV con l y r, CCVC, gue/gui/güe/güi | 2 a 3 | 2.000 | 4 a 6 | 35 a 80 | 50 a 70 |
| Level3 | + VCC y CVCC (ins, cons, trans), hiatos | 3 a 4 | 3.000 | 6 a 8 | 35 a 80 | 70 a 90 |
| Level4 | Todas | 3 a 4 | 5.000 | 7 a 10 | 35 a 80 | 90 a 110 |
| Level5 | Todas | 3 a 5 | 7.000 | 8 a 12 | 35 a 80 | 100 a 120 |
| Level6 | Todas | 4 a 5 | 10.000 | 10 a 14 | 35 a 80 | 110 a 130 |
| Level7 | Todas | 4 a 6 | 15.000 | 12 a 16 | 35 a 80 | 120 a 140 |
| Level8 | Todas | 4 a 6 | 20.000 | 14 a 18 | 35 a 80 | 130 a 150 |
| Level9 | Todas | 5 a 7 | Sin límite | 16 a 20 | 35 a 80 | 140 a 160 |
| Level10 | Todas | 5 a 7 o más | Sin límite | 18 a 25 | 35 a 80 | 150 a 170 |

Cómo leer la tabla:

- **Las cifras son máximos.** Una actividad de Level6 puede usar palabras muy frecuentes y sílabas
  CV; lo que no puede es usar algo por encima de su nivel.
- **Frecuencia**: la palabra debe estar entre las N más frecuentes del léxico de referencia
  (sección 4.2). Las palabras del tema del texto pueden saltarse este límite dentro de un margen
  (5.2); los nombres propios solo entran en la lectura en voz alta (3.6).
- **Velocidad de referencia**: lectura en voz alta de un lector sin dificultades al final del curso.
  Se usa solo para dimensionar textos y para calcular field_seconds (5.1 y 5.2), nunca como umbral de
  aprobado.
- **Palabras por texto**: un solo párrafo de 35 a 80 palabras en todos los niveles (decisión del
  grupo de expertos, E10, 2026-10-28: evita el muro de texto y la ansiedad lectora). A partir de
  Level4 la dificultad no crece en volumen, sino en densidad de vocabulario académico o técnico,
  estructuras silábicas complejas y oraciones subordinadas dentro de ese párrafo.

#### Referencias lingüísticas por nivel (catalán)

La misma tabla para el contenido catalán (plans/multiidioma/Shine en Catalán.md, 2.3; el nivel
mínimo por estructura de plans/multiidioma/estructura-ca.md, apartado 5, manda donde difieran).
Nota lingüística del experto: el catalán tiene una proporción mucho mayor de monosílabos y de
palabras acabadas en consonante (codas CVC y CVCC: gat, xoc, temps, mar), apostrofación (l’, d’,
m’) y ortografía átona (vocal neutra). Fuente de frecuencias recomendada: el CTILC (Corpus Textual
Informatitzat de la Llengua Catalana, del Institut d'Estudis Catalans) o la base BDLOC. Las
columnas se leen igual que en la tabla castellana (máximos, no mínimos).

| Nivel | Estructuras silábicas admitidas | Sílabas por palabra | Frecuencia (rango máximo) | Palabras por frase | Palabras por texto | Velocidad de referencia (palabras por minuto, en voz alta) |
|---|---|---|---|---|---|---|
| Level0 | V y CV con m, p, l, s, t, n, d | 1 a 2 | 500 más frecuentes | no aplica | no aplica | no aplica |
| Level1 | Todas las CV (incluidas c/qu, g/gu, r/rr, ny, ll, ss), VC, CVC frecuentes (gat, pa, sol), diptongos simples | 1 a 3 | 1.000 | 3 a 5 | 35 a 80 | 30 a 50 |
| Level2 | + CCV con l y r, CCVC, dígrafos tx, ig, tg, tj, gue/gui, güe/güi, qüe/qüi (que y qui ya en Level1), y como únicas excepciones de coda els, al, als, del, dels, pel, pels y los plurales regulares en -ns y -ls (nens, pans) | 2 a 3 | 2.000 | 4 a 6 | 35 a 80 | 50 a 70 |
| Level3 | + VCC y CVCC, también en monosílabos (ins, trans, forts, temps, dent, porc, gust, camp), ela geminada (l·l), apóstrofo (l’, d’) y contracciones, hiatos | 3 a 4 | 3.000 | 6 a 8 | 35 a 80 | 70 a 90 |
| Level4 | Todas (incluidos los pronombres débiles simples) | 3 a 4 | 5.000 | 7 a 10 | 35 a 80 | 90 a 110 |
| Level5 | Todas | 3 a 5 | 7.000 | 8 a 12 | 35 a 80 | 100 a 120 |
| Level6 | Todas | 4 a 5 | 10.000 | 10 a 14 | 35 a 80 | 110 a 130 |
| Level7 | Todas (pronombres débiles combinados) | 4 a 6 | 15.000 | 12 a 16 | 35 a 80 | 120 a 140 |
| Level8 | Todas | 4 a 6 | 20.000 | 14 a 18 | 35 a 80 | 130 a 150 |
| Level9 | Todas | 5 a 7 | Sin límite | 16 a 20 | 35 a 80 | 140 a 160 |
| Level10 | Todas | 5 a 7 o más | Sin límite | 18 a 25 | 35 a 80 | 150 a 170 |

Diferencias con la tabla castellana:

- **Monosílabos CVC muy frecuentes desde Level1** (gat, sol, cap, pa): el catalán tiene muchos más
  que el castellano y son el léxico infantil básico; en Level1 el rango de sílabas por palabra
  empieza en 1, no en 2.
- **Dígrafos en dos tramos**: los simples (ny, ll, ss, rr, qu, gu) en Level1 y los complejos (tx,
  ig, tg, tj, ix) en Level2. En castellano ch, ll y rr entran juntos en Level1.
- **Level3 concentra lo propio del catalán**: ela geminada, apóstrofo y contracciones e hiatos,
  además de VCC y CVCC. Por eso la decodificación completa no se da por cerrada antes de Level3.
- **Pronombres débiles**: simples desde Level4 y combinados desde Level7 (en castellano los clíticos
  no marcan tramo).
- **Fuente de frecuencias distinta** (CTILC o BDLOC en vez de EsPal o LEXESP, 4.2) y silabeador con
  las reglas del IEC, no las de la RAE.

Decisiones que contradicen la versión castellana (todas confirmadas por el experto el 2026-10-26,
plans/multiidioma/resposta-estructura-ca.md):

- **que y qui en Level1** (grupo c/qu de "Directes resta") y gue/gui, güe/güi, qüe/qüi en Level2. La
  tabla 2.3 del experto ponía "gu/qu + e/i" en Level2; su apartado 7 ponía c/qu y g/gu en Level1.
  Coincide con el castellano (c/qu en Level1, gue/gui en Level2).
- **Monosílabos con coda doble en Level3** (dent, pont, porc, serp, forn, guant, talp, llamp,
  cranc, tronc, gust, camp; verbos surt y dorm). La excepción de Level2 que el experto propuso el
  2026-10-27 quedó retirada por el grupo el 2026-10-29: las codas dobles de raíz (-nt, -rt, -st,
  -mp, -rc...) son Level3 también en monosílabos, como en castellano, y en Level2 solo quedan la
  excepción gramatical y morfológica del punto siguiente.
- **Excepción gramatical y morfológica en Level2** (grupo de expertos, 2026-10-29): els, al, als,
  del, dels, pel y pels, imprescindibles para escribir frases en plural con sintaxis natural, y los
  plurales regulares en -ns y -ls de una base de Level1 o Level2 (nens, pans, trens, pals, galls):
  el niño aplica una flexión transparente, no decodifica una coda de raíz. Las codas complejas de
  raíz (text, verd, disc) siguen en Level3, y los apóstrofos y las contracciones siguen siendo la
  dificultad que se trabaja desde Level3.
- **Silabeo con dígrafos separados**: tx, ix, ig, tg, tj, ss, rr y l·l se parten entre sílabas
  (cot-xe, cai-xa, met-ge, tas-sa, car-ro, col-le-gi), como manda el IEC. En castellano ch, ll y
  rr van unidos (co-che, ca-lle, pe-rro).
- **Ela geminada en Level3 y en el bloque 8 del ciclo**, y **tx en el bloque 4**: el experto la
  situaba en el bloque 4 y tx en el 3 (5.3).
- **Un término por tramo**: el término único "Dígrafs i grafies pròpies" del experto se desglosa en
  Dígrafs simples (Level1), Dígrafs complexos (Level2) y Ela geminada (Level3), porque el nivel
  mínimo se fija por término (3.5).

### 2.4 Cómo usa el sistema los niveles

- Cada actividad lleva uno o varios niveles en field_activity_level. **Recomendación: un solo nivel**,
  aquel para el que se diseñó; como mucho dos consecutivos para contenido de transición. Nunca todos
  (hoy A3 tiene los tres niveles antiguos: es contenido de prueba).
- En una sesión regular, para cada hueco de área el generador busca actividades publicadas con ese
  field_main_area cuyo field_activity_level contenga el nivel vigente del usuario en esa área. Si no
  hay, baja un nivel cada vez hasta Level0; si sigue sin haber, el hueco se salta.
- **Techo por contenido**: un área no puede subir a un nivel en el que no haya ninguna actividad con
  esa área principal. Un hueco en Level7 deja a todos los usuarios de esa área parados en Level6.
- **Si un área no tiene contenido en Level0**, el bloque inicial no la puede probar y la omite con un
  aviso en watchdog.
- Las actividades de un ciclo obligatorio (field_cycle) ignoran el nivel y no cuentan para el techo
  (5.3).

Detalle completo en [level-system.md](level-system.md), secciones 5 y 6.

### 2.5 De 3 a 11 niveles: estado actual y migración

Hoy el vocabulario activity_level tiene tres términos con otra escala:

| Término | Descripción actual | Significado con la escala nueva |
|---|---|---|
| Level0 | 5 - 8 anys | 5 años |
| Level1 | 9 - 12 | 6 años |
| Level2 | 13-16 | 7 años |

Pasos para adoptar la escala. Los pasos 1 a 3 están hechos desde el 2026-10-27: los 11 términos
existen con pesos 0 a 10 y descripción con la edad y el curso (los crea o corrige
`scripts/create-level-terms.php`, idempotente, en cada entorno); las actividades A1 a A3 ya no
existen y todo el catálogo se generó con la escala nueva; los usuarios de prueba se reiniciaron en
la verificación de la FASE 18. Queda el paso 4.

1. Cambiar la descripción de Level0, Level1 y Level2 y crear Level3 a Level10, con pesos 0 a 10. La
   escalera ordena por peso y, a igual peso, por nombre en orden natural (Level2 va antes que
   Level10), así que funciona igual sin pesos, pero con pesos el orden no depende del nombre. Los
   términos son contenido, no configuración: no viajan en config/sync y hay que crearlos en cada
   entorno, igual que las áreas.
2. Reetiquetar las actividades existentes (A1, A2 y A3, de prueba), porque su nivel antiguo cambia
   de significado.
3. Reiniciar los niveles de los usuarios de prueba desde /user/{uid}/levels/reset: sus filas
   userarealevel apuntan a términos que pasan a significar otra edad.
4. Revisar el ritmo del bloque inicial (decisión pendiente, sección 8). La escalera sube un peldaño
   por sesión y el bloque dura como mucho initial_max_sessions = 4 sesiones, así que termina como
   máximo en Level3. Después, cada subida necesita en el mejor caso 3 sesiones regulares "Demasiado
   fácil" y una evaluación de 2 sesiones: unas 5 sesiones por nivel. Un usuario sin dificultades en
   un área tardaría cerca de 35 sesiones en pasar de Level3 a Level10.

---

## 3. Lo común a todos los ejercicios

### 3.1 Campos comunes del nodo

| Campo | Tipo | Obligatorio | Uso |
|---|---|---|---|
| title | texto | Sí | Título que ve el usuario en la intro. Corto y en lenguaje del usuario ("Palabras con pl y tr"), no técnico. |
| field_main_area | referencia a un término de areas | Sí | Área que trabaja: decide en qué hueco de sesión entra y qué nivel se le aplica. Solo una. El "obligatorio" del formulario no protege la creación por código: el cargador debe exigirlo. |
| field_secondary_area | referencia a areas | No | Solo alimenta el radar de áreas. No afecta a niveles. |
| field_activity_level | referencia a activity_level, múltiple | Sí | Nivel (sección 2.4). |
| field_activity_code | texto | Recomendado | Identificador estable (sección 3.4). |
| field_custom_explanation | texto largo | No | Instrucción para el usuario en la intro ("Toca cuando hayas leído cada palabra"). |
| field_explanation | referencia a un explanation_message | No | Mensaje de explicación reutilizable. Hoy existen "Activity vertical text" e "Image Position"; cada tipo nuevo debería tener el suyo. |
| field_cycle y field_cycle_weight | referencia a activity_cycle; entero | No | Solo para actividades de un ciclo obligatorio (5.3). |
| field_sonority | referencia a sonority, múltiple | Recomendado en los tipos de texto | Letras o pares que trabaja la actividad según cómo suenan (3.5). Hoy en activity y activity_blink. |
| field_decoding_effort | referencia a decoding_effort, múltiple | Recomendado en los tipos de texto | Estructuras silábicas y confusiones visuales del material (3.5). Hoy en activity y activity_blink. |
| status | publicado o no | Sí | Solo las publicadas entran en sesiones. |

Ajustes que van por tipo de contenido, no por actividad (pestaña Options del tipo, módulo
activity_options): contar errores y saltar al contar error. Hoy: activity cuenta errores sin
saltar; activity_blink cuenta y salta; activity_image_position no cuenta. El generador no los puede
variar actividad a actividad.

Mensajes de motivación: cada activity_message de tipo motivation_message indica en
field_activity_types a qué tipos de contenido aplica. Cada tipo nuevo debería tener al menos uno
(hoy la app todavía no filtra por tipo: arreglo A6 pendiente).

### 3.2 Reglas del generador de sesiones que afectan al contenido

- **Sesión regular**: 4 huecos de área (regular_slots) más 1 de ciclo, con rotación de áreas. No
  repite actividades usadas en las últimas 5 sesiones (recent_window).
- **Sesión de ajuste**: una actividad por área al nivel que se está probando, evitando las ya usadas
  en evaluaciones anteriores del usuario mientras queden otras. El contenido de cada nivel se
  "gasta" también en evaluaciones.
- **Freno por aciertos**: en los tipos que registran aciertos, un "Demasiado fácil" con menos del
  60 % de aciertos (accuracy_floor) cuenta como "Bien así". Con pocos ítems un solo fallo pesa
  demasiado: **al menos 4 ítems puntuables por actividad, mejor 5 o más**.
- **Duración**: propuesta de 1 a 3 minutos por actividad, para que una sesión de 5 actividades
  quede entre 10 y 15 minutos.

### 3.3 Volumen de contenido necesario

En 5 sesiones regulares hay 20 huecos de área repartidos entre 5 áreas: unos 4 por área. Para no
repetir dentro de la ventana hacen falta al menos 5 actividades distintas por área y nivel, y cada
evaluación completa consume 2 más. De ahí:

| Concepto | Valor |
|---|---|
| Celdas área × nivel | 5 × 11 = 55 |
| Mínimo por celda | 6 actividades |
| Objetivo por celda | 10 actividades |
| Total mínimo | 330 actividades |
| Total objetivo | 550 actividades |
| Ciclo Sílabas (aparte, no cuenta en las celdas) | unas 40 actividades |

Este volumen es el motivo de automatizar. Orden de prioridad al generar:

1. **Level0 en las cinco áreas.** Sin él, el bloque inicial omite el área.
2. **Niveles contiguos de abajo arriba.** Un hueco en un nivel bloquea todos los de encima.
3. **Mínimo de 6 por celda** antes de llegar al objetivo de 10 en ninguna.

### 3.4 Código de actividad

Formato de field_activity_code desde la FASE 18: TIPO-XX-Lnn-AREA-nnn, con XX = idioma de la
actividad en mayúsculas (ES o CA). Ejemplo: MAT-ES-L04-PER-007 es la matriz castellana número 7 de
Level4 en Procesos Perceptivos; MAT-CA-L04-PER-007 es otra actividad, catalana, con su propia
numeración. Si la actividad tiene dos niveles, se usa el más bajo. (Antes de la FASE 18 el código
no llevaba idioma; los lotes de shine/content/ se reescribieron con ES y se reimportaron, decisión 5
de plans/multiidioma/README.md.)

| Prefijo de tipo | Tipo | | Código de área | Área |
|---|---|---|---|---|
| LIS | Lista de texto | | LIN | Competencia Lingüística y Fonológica |
| LEC | Lectura en voz alta | | VEL | Rendimiento y Velocidad de Procesamiento |
| BLK | Parpadeo | | MEM | Memoria de Trabajo (Auditiva y Visual) |
| IMG | Posición de imágenes | | ATE | Funciones Ejecutivas y Atención |
| MAT | Matriz de discriminación visual | | PER | Procesos Perceptivos (Discriminación Visual y Auditiva) |
| SIL | Reordenamiento de sílabas | | | |
| SEG | Segmentación léxica | | | |
| REP | Repetición rápida de palabra | | | |

Actividades de ciclo: TIPO-XX-CIC-CICLO-peso, por ejemplo BLK-ES-CIC-SILABAS-030 (el ciclo catalán
es BLK-CA-CIC-SILABAS-nnn: mismo término de ciclo, traducido, con actividades propias).

Reglas:

- El código es único. El cargador lo usa para decidir si crea o actualiza (Drupal no impone
  unicidad en el campo: la garantiza el cargador).
- Nunca se reutiliza un código para otro contenido.
- **No se cambia el contenido de una actividad que ya tiene activitysummary.** Las estadísticas
  comparan iteraciones de la misma actividad; si el contenido cambia, esa comparación pierde
  sentido. Se crea una actividad nueva con otro código y se despublica la antigua.
- **Una actividad retirada se despublica, nunca se borra.** Conserva el código, los summaries y
  la huella, y así ni el código ni el material se reutilizan: el inventario y el importador (4.4)
  cuentan también las despublicadas.

**Huella de contenido** (desde el 2026-10-21; con idioma desde la FASE 18). Además del código, cada
actividad lleva en field_content_hash el sha256 de (tipo, idioma, forma canónica de su material). La
forma canónica la define
el handler de cada tipo (`canonicalContent`): el conjunto de elementos, sin orden ni segundos, en
el parpadeo y la repetición rápida; las palabras enteras, sin sobrantes, imagen ni corte silábico,
en el reordenamiento de sílabas; las frases en la segmentación; objetivos, dimensiones y
cuadrículas, sin orden de rondas ni tiempo, en la matriz; los grupos de imágenes (slugs en orden y
posición preguntada, sin nombres ni orden de grupos) en la posición de imágenes. La escribe el
módulo shine_content al
guardar cualquier actividad (venga del importador o de la interfaz de Drupal) y
`drush shine-content:rehash` la recalcula en bloque. Dos actividades del mismo tipo con la misma
huella son la misma actividad: el importador no deja entrar la segunda (4.4). La comparación es
por tipo e idioma: la misma palabra en un parpadeo y en un reordenamiento no es duplicado, porque la
mecánica es otra, y el mismo material en castellano y en catalán tampoco (son dos actividades,
plans/multiidioma/analisis.md 2.2: lo compartible se comparte en el lote con `idiomas`, no en
Drupal). La misma huella en dos niveles sí lo es: es un error de etiquetado, no contenido nuevo.

**Unidades léxicas.** Cada tipo declara también sus unidades (`units`): elementos, palabras, frases
o cuadrículas, normalizadas (minúsculas, espacios simples, sin repetidos). Con ellas se mide el
solapamiento entre dos actividades (índice de Jaccard) y el sobreuso de una unidad en un tipo y
nivel; los umbrales están en 4.4 y el inventario las lista por actividad.

### 3.5 Categorización fonológica: sonoridad y esfuerzo de decodificación

Dos vocabularios describen **qué material** trabaja una actividad de lectura o texto, al margen de
su nivel. Salen de [generador/Taxonomía fonológica.md](generador/Taxonomía%20fonológica.md), que
recoge la justificación clínica de cada grupo.

| Vocabulario (vid) | Campo | Grupos (primer nivel) | Términos concretos (segundo nivel) |
|---|---|---|---|
| Sonority (sonority) | field_sonority | Consonantes continuas | m, l, s, f, n, r, j, ñ (2026-10-29) |
| | | Consonantes oclusivas | p, t, b, d, c, k, q, g, ch |
| | | Oposición sorda/sonora | p/b, t/d, k/g, f/v |
| | | Inconsistencias grafema-fonema | s/z/c, k/q/c, ll/y, g/j, b/v, h muda, r/rr (2026-10-29) |
| Decoding effort (decoding_effort) | field_decoding_effort | Esfuerzo bajo | Vocal aislada (V), Directas iniciales (CV) |
| | | Esfuerzo medio | Directas resto (CV), Inversas (VC), Mixtas (CVC) |
| | | Esfuerzo alto estructural | Trabadas con l (CCV), Trabadas con r (CCV), Complejas (CCVC, VCC, CVCC), Hiatos (desde el 2026-10-29) |
| | | Esfuerzo alto perceptivo | Espejo b-d, Espejo p-q, Espejo b-p, Espejo d-q, Rotación n-u, Rotación m-w |
| | | Esfuerzo morfológico y léxico (2026-10-29) | Polisílabas (4 o más sílabas), Palabras compuestas, Derivadas (prefijos y sufijos), Pronombres átonos, Homófonos y parónimos |

**Agrupar por sonoridad y por dificultad** (indicación del usuario, 2026-10-29): siempre que el
tipo lo permita, el material de trabajo de una actividad se agrupa en torno a un término de
sonoridad (un grupo fonético: p/b, s/z/c, ny, tg/tj...) y a uno de esfuerzo, y la actividad lleva
los dos. Si falta un término, se añade a `scripts/phonology-terms.{es,ca}.json` y se crea con
`create-phonology-terms.php`; el grupo de expertos lo valida en la siguiente revisión. El grupo
"Esfuerzo morfológico y léxico" (catalán: "Esforç morfològic i lèxic") cubre la dificultad de
Level4 en adelante; "Polisílabas" lo calcula `estructura.activity_effort` (la mitad o más de las
palabras con 4 o más sílabas), los otros cuatro los pone quien escribe el lote.

Cada término lleva en su descripción las letras, sílabas de ejemplo y el motivo clínico. Respecto
al resumen JSON del documento de origen, el tramo perceptivo se desglosa por pares (el JSON no
incluía b-p ni d-q, que sí aparecen en su texto).

**Reglas de etiquetado.**

- Se marcan siempre **términos de segundo nivel**, nunca el grupo. Si la actividad recorre un grupo
  entero, se marcan todos los suyos. Así, consultar por grupo es un solo filtro sobre el padre:
  `filter[field_sonority.parent.name]=Oposición sorda/sonora`.
- Varios valores cuando la actividad mezcla material: "pa ba ta da" lleva p/b y t/d en sonoridad y
  Directas iniciales (CV) y Directas resto (CV) en esfuerzo.
- Se etiqueta el material **objetivo**, no los elementos de alivio (5.3): una actividad de trabadas
  con "pelo" y "mano" como alivio no lleva Directas iniciales (CV). Así, filtrar por un término
  devuelve las actividades que lo trabajan, no todas las que lo contienen.
- Los dos campos son opcionales en el formulario. El cargador (4.4) debe exigir al menos uno en los
  tipos de texto que trabajen grafías concretas.

**Relación con los niveles.** El esfuerzo describe el material y **no sustituye a
field_activity_level**: tiene cuatro tramos y la escala de niveles, once. El generador de sesiones
no lee estos campos. Para el generador de contenido, el nivel mínimo en que aparece cada estructura
(tabla 2.3) es:

| Término de esfuerzo | Nivel mínimo |
|---|---|
| Vocal aislada (V), Directas iniciales (CV) | Level0 |
| Directas resto (CV), Inversas (VC), Mixtas (CVC) | Level1 |
| Trabadas con l (CCV), Trabadas con r (CCV) | Level2 |
| Complejas (CCVC, VCC, CVCC) | Level2 para CCVC, Level3 para VCC y CVCC |
| Hiatos | Level3 (término añadido por el grupo en la revisión de la tanda 3, 2026-10-29; en catalán, Hiats). Solo etiqueta la actividad si al menos un tercio de sus palabras tienen hiato (revisión de la tanda 5) |
| Espejo y rotaciones | Cualquiera: el esfuerzo perceptivo no depende de la estructura. En la matriz (6.1) lo fija la tabla del tipo. |

**Nivel mínimo por estructura (catalán).** Para el contenido catalán, con los términos de
`decoding_effort` del idioma (plans/multiidioma/estructura-ca.md, apartados 4 y 5, confirmados por
el experto el 2026-10-26):

| Término de esfuerzo (catalán) | Nivel mínimo | Ejemplos |
|---|---|---|
| Vocal aïllada (V), Directes inicials (CV) | Level0 | ma, pa, la, no, so |
| Directes resta (CV), Inverses (VC), Mixtes i finals (CVC), Dígrafs simples | Level1 | gat, pa, sol, cap, nyap, lluna; que, qui |
| Travades amb l (CCV), Travades amb r (CCV), Dígrafs complexos | Level2 | pla, bra, tren, cotxe, metge; gue, gui, güe, güi, qüe, qüi |
| Complexes (CCVC, VCC, CVCC): CCVC | Level2 | plat, tren, drac |
| Complexes (CCVC, VCC, CVCC): VCC y CVCC, también en monosílabos | Level3 | temps, forts, trans, ins, verd, text, disc, dent, porc, gust, camp (2026-10-29) |
| Hiats | Level3 | piano, lleó, país, riure (término del 2026-10-29) |
| Excepción gramatical y morfológica: els, al, als, del, dels, pel, pels y plurales regulares en -ns y -ls de una base de Level1 o Level2 | Level2 | els nens, el pa dels avis, pans, trens, pals, galls (grupo de expertos, 2026-10-29) |
| Ela geminada (l·l), Apostrofació i contraccions | Level3 | col·legi, l’avi, d’un |
| Mirall, rotacions y Grafies diacrítiques i especials | Cualquiera | Transversal; en la matriz (6.1) lo fija la tabla del tipo |

La excepción de los monosílabos con coda simple la pidió el experto para no dejar en Level3
palabras del banco de imágenes tan tempranas como dent o pont; las plurisílabas y las codas menos
frecuentes siguen en Level3. Los nombres de los términos catalanes de sonoridad y esfuerzo son los
de estructura-ca.md, apartados 3 y 4 (datos en `shine/scripts/phonology-terms.ca.json`), y la
justificación clínica está en [generador/Taxonomía fonológica (català).md](generador/Taxonomía%20fonológica%20(català).md).

**Tipos que los llevan.** activity (lista y lectura en voz alta), activity_blink y, desde la FASE 16,
activity_rapid_repetition, que además los **exige**: el importador rechaza un registro de ese tipo
sin `sonoridad` ni `esfuerzo` (`ActivityHandlerInterface::requiresPhonologyTags()`, 6.4). No
activity_image_position, que trabaja con imágenes. Los tipos de texto de la FASE 13 (matriz,
reordenamiento de sílabas y segmentación) deben reutilizar los mismos storages al crearse
(docs/conventions.md); en la matriz el vocabulario natural es el tramo perceptivo.

**Términos en cada entorno, por idioma (FASE 18).** Los vocabularios y campos son config (viajan con
drush cim); los términos son contenido. Cada idioma tiene su propio juego de términos en los mismos
dos vocabularios (términos con `langcode` es o ca, nunca traducciones): la tabla de arriba es la
castellana; la catalana (4 grupos y 33 términos de sonoridad, 4 grupos y 19 de esfuerzo, con
nombres propios como "s sorda", "tx/ig", "grafies s/ss/c/ç", "Dígrafs simples", "Ela geminada (l·l)")
está en `plans/multiidioma/estructura-ca.md`, apartados 3 y 4, definida con el experto. Los datos
viven en `shine/scripts/phonology-terms.es.json` y `phonology-terms.ca.json` (objeto con `langcode`
y `vocabularies`; por vocabulario, lista de grupos con `name`, `description` y `children`, en el
orden que fija el peso) y los crea un script idempotente por idioma, que también corrige padre,
peso y descripción si cambian y nunca borra:

```bash
cd shine && ddev drush php:script scripts/create-phonology-terms.php -- es
cd shine && ddev drush php:script scripts/create-phonology-terms.php -- ca
```

Los nombres son únicos dentro de cada vocabulario e idioma (el script falla si encuentra
duplicados), porque el cargador referencia los términos por nombre dentro del idioma del registro
(4.3). Lectura por JSON:API con `access content`: `GET /jsonapi/taxonomy_term/sonority` y
`GET /jsonapi/taxonomy_term/decoding_effort` devuelven los dos idiomas (filtrar con
`filter[langcode]=ca`).

---

### 3.6 Léxico y frecuencia por nivel (puerta léxica)

La tabla 2.3 fija por nivel hasta qué rango de frecuencia pueden llegar las palabras (500 en
Level0, 1.000 en Level1, 2.000 en Level2, 3.000 en Level3, 5.000 en Level4, 7.000 en Level5, 10.000
en Level6, 15.000 en Level7, 20.000 en Level8, sin límite en Level9 y Level10). Hasta tener listas
reales el criterio lo aplica quien genera y lo valida el experto; con listas, lo comprueba
`shine/content/generadores/lexico.py` antes de la revisión (petición al experto del 2026-10-27 en
plans/multiidioma/peticio-llistes-frequencia.md y su respuesta en
resposta-peticio-llistes-frequencia.md).

**Listas** (privadas, con licencia, en `shine/private/lexico/`, fuera del repositorio):

| Fichero | Uso | Fuentes que recomienda el experto |
|---|---|---|
| `es-general.csv`, `ca-general.csv` | Level3 a Level10 | castellano: EsPal (con edad de adquisición), CORPES XXI o CREA; catalán: CTILC, lista de Softcatalà o CQPweb (UPF) |
| `es-infantil.csv`, `ca-infantil.csv` | Level0 a Level2, con prioridad absoluta sobre la general | castellano: LEXESP (subcorpus escolar); catalán: BDLOC o BDEC, listas de P5 a 2.º (PRODISCAT) |

CSV o TSV en UTF-8 con cabecera y columnas **forma**, **lema**, **categoria** (las tres
obligatorias, pedidas por el experto: en Level0 a Level3 una forma flexionada como "comiéramos"
pesa mucho más que su lema), **frecuencia** (recuento) o **rango** (posición; si falta, se calcula
ordenando por frecuencia) y, si la fuente la tiene, **edad_adquisicion**. Al menos las 20.000
formas más frecuentes. Las listas catalanas siguen la ortografía del IEC de 2017 y la variedad
central.

**Reglas de la comprobación** (acordadas con el experto):

- Level0 a Level2 consultan la lista infantil; Level3 en adelante, la general. Sin lista infantil
  se usa la general con aviso.
- En catalán se quita el apóstrofo y el clítico antes de buscar (l’escola → escola, posa’t →
  posa); la forma completa se conserva en el texto de la actividad.
- Nombres propios (mayúscula fuera de inicio de frase): excluidos de todos los ejercicios salvo la
  lectura en voz alta (decisión E10, 2026-10-28). En Level1 y Level2 solo nombres cortos y
  frecuentes de una o dos sílabas sin trabadas ni hiatos (Pol, Pau, Marc, Pep, Ana, Lola, Sara;
  precisión del grupo, 2026-10-29); Leo, Teo y Mia, con hiato, solo como excepción de nombre muy
  frecuente; prohibidos los de más de dos sílabas, con trabadas u ortografía
  compleja (Gisela, Meritxell, Christopher, Alexander). Desde Level3, cualquiera que cumpla las
  estructuras del nivel, dentro del margen del tema. La puerta léxica (`lexico.py`) lo comprueba.
- Qué se comprueba por tipo: en reordenamiento de sílabas, repetición rápida y parpadeo, cada
  palabra dentro del rango del nivel; en segmentación, lista de texto y lectura en voz alta,
  todas las palabras de la frase o el texto; posición de imágenes queda exenta (el banco ya lleva
  el nivel lector de cada nombre, validado por el experto).
- La lista es la puerta, no el juez: lo que queda fuera o no está en la lista se marca para que
  lo decida el experto en la revisión del 10 %.

Uso: `cd shine/content/generadores && python3 lexico.py --lang ca --lote ../blink-ca-level0-2-v1.json`
(lista las palabras fuera de rango, los nombres propios y las que no están en la lista, por
actividad; sale con error si hay alguna) o `--lang es --level 3 --words "instante transporte"`.

## 4. Mecanismo de automatización

### 4.1 Flujo

1. **Parámetros del nivel**: las tablas de este documento (2.3 y la de cada tipo).
2. **Generador del tipo**: toma contenido de las fuentes (4.2) y la lista de exclusión de lo que ya
   existe (`drush shine-content:inventory`, 4.4) y produce especificaciones (4.3).
3. **Validación automática**: reglas comunes y reglas del tipo. Lo que no pasa se descarta o se
   regenera.
4. **Carga en Drupal** como no publicadas (4.4).
5. **Revisión humana** de una muestra por lote y nivel (4.5).
6. **Publicación y verificación de cobertura** (4.5).

### 4.2 Fuentes de contenido

- **Léxico de referencia.** Una tabla de palabras del castellano con, por palabra: grafía, silabeo
  (pan-ta-lón), número de sílabas, estructura de cada sílaba (CVC, CV, CVC), sílaba tónica, rango de
  frecuencia, categoría gramatical, categoría semántica (animal, comida, objeto...) y si tiene imagen
  en el banco. Se puede construir a partir de una base léxica pública del español con frecuencias,
  por ejemplo EsPal o LEXESP (revisar la licencia), y calcular silabeo y estructura con un
  silabeador según las reglas de la RAE, revisando a mano los casos dudosos (hiatos, prefijos, h
  intercalada). Es la fuente de las listas de texto, del parpadeo, del reordenamiento de sílabas y
  de la validación de frases y textos. Propuesta: versionarlo en el repo (por ejemplo
  content/lexicon.csv).
- **Inventario silábico.** Lista de sílabas con su estructura y el nivel mínimo en que aparecen,
  derivado de la tabla 2.3. Alimenta el parpadeo, el ciclo Sílabas y las pseudopalabras.
- **Tabla de confusiones visuales.** Pares de letras que se confunden (b-d, p-q, b-p, d-q, n-u,
  m-w, m-n), de sílabas (bra-bar, pra-par, dra-bra) y de palabras que difieren en una letra (sacadas
  del léxico). Alimenta la matriz.
- **Banco de imágenes.** Ilustraciones de estilo uniforme (mismo trazo, mismo fondo) para que no se
  distingan por el estilo, cada una con su nombre (sustantivo común) y su categoría, descritas en
  un manifiesto (archivo, nombre, categoría). En Drupal se cargan como media de tipo image.
  Alimenta la posición de imágenes y la pista del reordenamiento de sílabas.
  Especificación de estilo y tamaño, prompt de generación, convención de nombres y lista de
  palabras en [generador/Banco de imágenes.md](generador/Banco%20de%20imágenes.md).
- **Frases y textos.** Redactados por personas o con un modelo de lenguaje al que se pasan las
  restricciones del nivel (longitud, frecuencia, estructuras, tema). Siempre pasan por la
  validación automática y por la revisión humana.

### 4.3 Formato de especificación

El generador escribe un fichero JSON por lote, con un objeto por actividad. Es el contrato entre
generadores y cargador: un generador nuevo solo tiene que producir este formato.

| Clave | Contenido | Ejemplo |
|---|---|---|
| tipo | Node type | activity_letter_matrix |
| codigo | field_activity_code (3.4); con `idiomas`, sin la parte de idioma, que inserta el importador | MAT-ES-L04-PER-007 (con `idiomas`: MAT-L04-PER-007) |
| idioma | Idioma del nodo, es o ca (FASE 18). Obligatorio salvo con `idiomas` | ca |
| idiomas | Lista de idiomas: el importador crea un nodo por idioma con el mismo material | ["es", "ca"] |
| titulo | title; con `idiomas`, un texto o un objeto por idioma | {"es": "Encuentra todas las d", "ca": "Troba totes les d"} |
| area_principal | Nombre exacto del término de areas | Procesos Perceptivos (Discriminación Visual y Auditiva) |
| area_secundaria | Nombre exacto o vacío | Funciones Ejecutivas y Atención |
| niveles | Lista de nombres de término | Level4 |
| instruccion | field_custom_explanation; texto u objeto por idioma | Toca todas las d que veas. |
| explicacion | Título del explanation_message, o vacío | Letter matrix |
| ciclo, peso_ciclo | Solo actividades de ciclo | Sílabas, 30 |
| sonoridad | Nombres de término de sonority (3.5) del idioma del nodo, segundo nivel; con `idiomas`, lista (mismo nombre en los dos idiomas) u objeto por idioma | p/b, t/d |
| esfuerzo | Nombres de término de decoding_effort (3.5) del idioma del nodo, segundo nivel; igual que sonoridad | {"es": ["Trabadas con r (CCV)"], "ca": ["Travades amb r (CCV)"]} |
| contenido | Campos propios del tipo (secciones 5 y 6) | |
| origen | Generador, versión y semilla, para poder regenerar | mat-gen 1.0, semilla 4411 |

Las áreas, niveles, ciclos, mensajes de explicación y términos fonológicos se referencian por
nombre, **nunca por id numérico**: los ids cambian de un entorno a otro (las áreas son los tid 5 a 9
solo en local).

Reglas del contrato que aplica el importador (4.4):

- El fichero es una lista de registros, o un objeto con la clave `actividades` y lo que se quiera
  alrededor (`lote`, `descripcion`, `origen`...), que se ignora. `origen` dentro de un registro se
  acepta y no se guarda.
- Claves desconocidas, en el registro o en `contenido`, son error: así un campo mal escrito no pasa
  en silencio.
- `codigo` debe seguir 3.4; el prefijo tiene que ser el del tipo, `XX` el idioma del registro y
  `Lnn` el nivel más bajo de `niveles`. `CIC` exige `ciclo` y `peso_ciclo`. Un código nunca cambia
  de idioma.
- **Idioma** (FASE 18): todo registro lleva `idioma` (es o ca) o `idiomas` (lista sin repetidos);
  sin ninguna de las dos, error. Con `idiomas` el importador produce un registro por idioma: el
  código se completa con XX, y en cualquier valor (título, instrucción, sonoridad, esfuerzo y
  dentro de `contenido`, por ejemplo el `nombre` de una imagen) un objeto cuyas claves son solo
  idiomas admitidos, {"es": ..., "ca": ...}, se sustituye por el valor del idioma; falta un idioma
  en el objeto, error. Un valor escalar vale para todos. Áreas, niveles, ciclos y explicación se
  referencian siempre por su nombre canónico castellano (son términos únicos, traducidos); los
  términos fonológicos se buscan dentro del idioma del nodo (vocabularios por idioma).
- `sonoridad` y `esfuerzo` admiten solo términos de segundo nivel (3.5).
- Letras admitidas (desde el 2026-10-26): las frases de la segmentación (6.3) y las palabras de la
  repetición rápida (6.4) aceptan las letras del castellano y del catalán (tildes abiertas y
  cerradas, ñ, ü, ï, ç, el punto volado de l·l y el apóstrofo recto o tipográfico). Los demás tipos
  no restringen las letras.
- `area_secundaria` no puede ser la principal.
- El registro es la **verdad completa** de la actividad: al actualizar, lo que no aparece se vacía
  (instrucción, área secundaria, sonoridad...).

### 4.4 Carga en Drupal

**Comando Drush `shine-content:import`** (módulo `shine_content`, desde el 2026-10-16):

```bash
cd shine
ddev drush shine-content:import content/blink-level0-2-v1.json --dry-run   # solo valida
ddev drush shine-content:import content/blink-level0-2-v1.json             # crea sin publicar
ddev drush shine-content:import content/blink-level0-2-v1.json --publish   # crea y publica
```

La ruta es relativa al directorio desde el que se lanza el comando (los lotes viven en
`shine/content/`). Comportamiento:

- Valida **todos** los registros con las reglas comunes (4.3) y las de su tipo (sección 5) y
  lista los errores por registro. Con un solo error no escribe nada: un lote es una unidad, y un
  lote regenerado a medias dejaría huecos y duplicados. Con dry-run solo valida e informa.
- Resuelve áreas, niveles, ciclos, mensajes de explicación, sonoridad y esfuerzo por nombre y
  falla si alguno no existe o hay dos con el mismo nombre: no inventa términos.
- Crea o actualiza por codigo (un código solo puede pertenecer a un tipo). Informa de si cada
  registro se ha creado, actualizado o está sin cambios: volver a importar el mismo lote no toca
  nada. Si la actividad ya tiene activitysummary, se niega a cambiar el contenido (regla de 3.4),
  pero sí admite cambios de metadatos (título, etiquetas, instrucción).
- Crea las actividades sin publicar, con dueño el usuario 1 y con el `langcode` del registro; con
  publish las publica (también las que ya existían). Nunca despublica. El informe lleva una fila
  por idioma (un registro con `idiomas` [es, ca] son dos filas, dos nodos y dos códigos).
- **Duplicados** (desde el 2026-10-21; por idioma desde la FASE 18): tras validar cada registro
  compara su material con el de todas las actividades existentes de su tipo **e idioma** (publicadas
  o no, con la huella calculada al
  momento, no la guardada, para que un nodo sin huella no la esquive) y con los registros
  anteriores del lote. Es **error**, y no se escribe nada: la misma huella con otro código
  ("contenido: idéntico al de BLK-L00-VEL-001 (nodo 9)"), o un solapamiento de unidades del 80 %
  o más. Es **aviso**, y se importa igual: un solapamiento entre el 50 y el 80 %, y las unidades
  que ya están en 3 o más actividades del mismo tipo y nivel. Los elementos marcados `alivio` en
  desglose_tipos no cuentan para el sobreuso: se repiten a propósito. La actividad que se está
  actualizando (mismo código) nunca es duplicado de sí misma. Los avisos salen en una sección
  aparte del informe.
- Si hay actividades sin huella guardada lo dice al final: `drush shine-content:rehash` las
  rellena (una vez tras importar la config en un entorno que ya tenía contenido, y cada vez que
  cambie la forma canónica de algún tipo).
- Al terminar imprime una tabla de cobertura área × nivel de lo publicado **por idioma** (es y ca),
  con la misma definición de contenido que el techo por contenido y el generador de sesiones
  (publicadas, sin ciclo, del idioma del alumno), y marca con * las celdas por debajo del mínimo de
  3.3.

Importa `activity_blink`, los tres tipos de la FASE 13, la repetición rápida (FASE 16) y, desde la
FASE 18, la posición de imágenes (5.4). Cada tipo es un *handler* (`ActivityHandlerInterface`: validar
`contenido`, volcarlo en el nodo, saber si cambió, leerlo del nodo en formato de lote y dar su
forma canónica y sus unidades, 3.4) registrado con el tag `shine_content_handler`
en `shine_content.services.yml`; lo común (código, título, áreas, niveles, instrucción,
explicación, ciclo, sonoridad y esfuerzo, idioma) lo hace `ContentImporter` (con `Localizer` para
los valores por idioma). Añadir `activity` (lista y lectura en voz alta) es una clase más. Tests:
`cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_content`.

**Comando Drush `shine-content:inventory`** (la lista de exclusión del generador): vuelca lo que
ya existe, publicado o no, con filtros `--type`, `--level`, `--area` y `--lang` (es o ca). En tabla:
código, idioma, tipo, niveles, área, publicada y unidades, más el siguiente código libre por prefijo
(con idioma, contando las despublicadas) y las unidades que ya están en 3 o más actividades del
mismo tipo, idioma y nivel. Con `--json` (o `--out=fichero.json`): cada actividad en el formato del
lote, tal como la aceptaría el importador (con `idioma`), más nid, publicada, hash y unidades; aparte
siguiente_codigo y uso_unidades (tipo, idioma, nivel, unidad, número de actividades). Ese fichero es
lo que se le da al generador antes de escribir un lote nuevo: "no uses estas palabras, estas sílabas
ya tienen 4 listas en Level0, el siguiente código es BLK-CA-L00-VEL-008". Sale de la base de datos y
no de los ficheros de lote, porque hay actividades que no vienen de ningún lote.

```bash
ddev drush shine-content:inventory                                   # tabla, los dos idiomas
ddev drush shine-content:inventory --lang=ca --type=activity_blink --level=Level0 --out=private/inventario-blink-l0-ca.json
ddev drush shine-content:rehash                                      # recalcular huellas
```

**Comando Drush `shine-content:import-images`** (FASE 18): importa el banco de imágenes
(docs/generador/Banco de imágenes.md) como media de tipo imagen, uno por entrada aceptada del
manifiesto, con **name y alt = slug del fichero** (platano), la clave neutra entre idiomas que usan
las claves `imagen` de los lotes (5.4 y 6.2). Los ficheros se copian a public://banco-imagenes/.
Idempotente: sin cambios si el fichero es el mismo (sha256), sustituye el fichero del mismo media si
cambió, nunca crea dos media para la misma palabra; las entradas descartadas no se importan.

```bash
ddev drush shine-content:import-images content/images/manifest.json --dry-run
ddev drush shine-content:import-images content/images/manifest.json
```

**Alternativa: JSON:API.** La escritura por JSON:API está habilitada (la app ya la usa para logs y
summaries). Un POST a /jsonapi/node/{tipo} con el token OAuth de un usuario que tenga el permiso de
crear ese tipo de contenido sirve para los tipos de campos simples (lista, lectura, parpadeo,
matriz, segmentación). No se recomienda para los tipos con imágenes o paragraphs: obliga a subir el
fichero, crear el media, crear cada paragraph y enlazarlo todo en peticiones sucesivas, y un fallo a
mitad deja restos.

### 4.5 Revisión y verificación

- **Revisión humana**: una muestra de cada lote (propuesta: el 10 %, al menos 5 por nivel) la revisa
  alguien del equipo terapéutico con la pregunta del criterio 2.1: ¿un niño de esa edad sin
  dificultades lo valoraría "Bien así"?
- **Tras publicar**: ddev drush shine-level:generate {uid} --dry-run con usuarios de prueba en
  varios niveles, y ddev drush watchdog:show --type=shine_level para ver avisos de techo por
  contenido o de huecos vacíos.
- **Calibración con datos reales**: las valoraciones por actividad de las sesiones de ajuste
  (activityfeedback) junto con el nivel del usuario (userarealevel) permiten detectar actividades
  mal etiquetadas. Una actividad que los usuarios de su nivel marcan casi siempre "Demasiado fácil"
  o "Me ha costado" está en el nivel equivocado: se mueve de nivel (o se sustituye si ya tiene
  summaries). Con suficientes datos, los tiempos reales (field_time de los summaries) sirven también
  para recalibrar field_seconds y la tabla 2.3.

---

## 5. Tipos implementados

### 5.1 Lista de texto (node activity, formato vertical_list)

**Qué es.** Aparece un elemento cada vez (sílaba, palabra o frase), en grande. El usuario lo lee y
toca la pantalla para pasar al siguiente. Se mide el tiempo de cada elemento. El adulto que
acompaña puede sumar errores con un botón.

**Área.** Competencia Lingüística y Fonológica si el objetivo es decodificar (palabras nuevas o
pseudopalabras); Rendimiento y Velocidad de Procesamiento si es la rapidez con palabras conocidas.
La otra de las dos como secundaria.

**Modelo en Drupal.**

| Campo | Contenido |
|---|---|
| field_activity_format | vertical_list |
| field_text | Un valor por elemento, en orden. Cada valor es HTML con un solo párrafo y formato de texto activity; la app quita las etiquetas. |
| field_seconds | Tiempo de referencia (decimal). Hoy ningún componente de la app lo lee y su significado no está fijado (A1 tiene 3, A2 tiene 5). Propuesta: segundos por elemento = palabras del elemento × 60 / velocidad de referencia del nivel, con un mínimo de 1,5 s (sección 8). |

**Qué registra.** Un log logverticaltext por elemento (field_item, field_weight con la posición,
field_time en ms, field_iteration, field_errors) y un summary_vertical_text con el tiempo total.

**Parámetros por nivel.**

| Nivel | Elementos | Contenido de cada elemento |
|---|---|---|
| Level0 | 6 | Sílabas directas y palabras bisílabas CV muy frecuentes (mamá, pato, sopa, mesa) |
| Level1 | 8 | Palabras de 2 y 3 sílabas con directas, inversas, mixtas y diptongos (sol, árbol, pelota, huevo) |
| Level2 | 8 | Palabras con trabadas (plato, tren, playa, trigo) o frases de 3 a 4 palabras |
| Level3 | 10 | Palabras de 3 y 4 sílabas con estructuras complejas e hiatos (instante, transporte, país); frases de 5 a 6 palabras |
| Level4 | 10 | Palabras de 4 sílabas de frecuencia media; frases de 6 a 8 |
| Level5 | 12 | Palabras de 4 y 5 sílabas; frases de 8 a 10 |
| Level6 | 12 | Palabras poco frecuentes y compuestas; frases de 10 a 12 con subordinada |
| Level7 | 12 | Vocabulario académico; frases de 12 a 14 |
| Level8 | 15 | Tecnicismos y esdrújulas largas; frases de 14 a 16 |
| Level9 | 15 | Palabras de 6 o más sílabas; frases de 16 a 18 |
| Level10 | 15 | Frases de 18 a 22 palabras con vocabulario general adulto |

Variante de pseudopalabras (desde Level2): palabras inventadas con las sílabas del nivel. Obligan a
leer letra a letra en vez de reconocer la palabra de memoria. Se generan combinando sílabas del
inventario y descartando las que existen en el léxico.

**Validación.**

- Elementos homogéneos dentro de una actividad (todo palabras o todo frases), para que los tiempos
  por elemento se puedan comparar entre intentos.
- Sin elementos repetidos en la lista de texto. En el parpadeo un elemento puede volver a salir
  (la vuelta desordenada del ciclo, 5.3), pero nunca justo detrás de sí mismo: la pantalla parecería
  no avanzar (revisión del experto, 2026-10-27).
- Cada palabra dentro de la estructura silábica, la longitud y la frecuencia del nivel (2.3).
- Longitud máxima por elemento: la app reduce la fuente hasta que el texto ocupe como mucho el 70 %
  del alto de la pantalla; para que siga siendo legible, máximo 20 caracteres en Level0 a Level2, 60
  en Level3 a Level5 y 120 desde Level6 (comprobar en un móvil pequeño).
- Solo texto: ni HTML más allá del párrafo ni emojis.

**Cómo generarlo.**

1. Filtrar el léxico con los criterios del nivel.
2. Elegir N elementos al azar con reparto equilibrado (no todos con la misma consonante inicial ni
   la misma estructura).
3. Para frases: plantillas o redacción asistida, validando cada palabra contra el léxico.
4. Calcular field_seconds si se usa.

Claves de contenido: formato (vertical_list), elementos (lista de textos; al menos 4, sin
repetidos, sin HTML, con el límite de caracteres del nivel de la validación de arriba),
segundos_por_elemento (opcional: número mayor que 0 y hasta 60; sin él, field_seconds queda vacío)
y, solo para revisar el lote y sin guardar, desglose_tipos y grupo_fonetico_objetivo como en el
parpadeo. Importable desde el 2026-10-27 (handler `TextActivityHandler`, prefijo LIS; la misma
clase importa la lectura en voz alta con prefijo LEC según `formato`).

**En catalán.** Léxico y pseudopalabras catalanes, nunca una traducción de la lista castellana:
palabras del léxico catalán dentro de las estructuras de la tabla 2.3 catalana, pseudopalabras con
fonotaxis catalana (pro, pso, frou) y un 25 a 30 % de elementos de alivio del idioma (a, e, ma,
pa, sol), intercalados al azar. Etiquetas con los términos catalanes (3.5). Desde Level1 entran
los monosílabos CVC muy frecuentes (gat, sol, cap) y desde Level3 la ela geminada, los apóstrofos
y las contracciones.

**Ejemplo.**

| Clave | Valor |
|---|---|
| codigo | LIS-L02-LIN-001 |
| titulo | Palabras con pl y tr |
| area_principal | Competencia Lingüística y Fonológica |
| niveles | Level2 |
| contenido.elementos | plato, tren, playa, trigo, pluma, tres, planta, trono |

### 5.2 Lectura en voz alta (node activity, formato audio_reading)

**Qué es.** Se muestra un texto completo. El usuario pulsa "Empezar a leer", lo lee en voz alta y
pulsa "He terminado". Se mide el tiempo total. En el móvil se graba el audio, pero hoy no se envía
al servidor: solo se usa el tiempo.

**Estado (2026-10-27).** Importable: `audio_reading` es un valor permitido de
field_activity_format (config/sync) y el handler `TextActivityHandler` de shine_content escribe
el node `activity` con los dos formatos (prefijo LEC para la lectura, LIS para la lista). El
cuadro de texto del player (AudioReadingPlayer) se desplaza. Lo que valida el importador: formato,
un solo párrafo sin HTML y de hasta 1.200 caracteres, de 35 a 80 palabras con un 10 % de margen
(32 a 88; Level0 se rechaza), y `segundos` entero de 10 a 600. Desde el 2026-10-28 (decisión E10
del grupo de expertos) la lectura es siempre **un solo párrafo de 35 a 80 palabras**; antes el
catálogo escalaba hasta 300 a 340 palabras en 4 o 5 párrafos en Level10. La frase media, la
frecuencia y la legibilidad siguen siendo de la generación y de la revisión del experto.

**Área.** Rendimiento y Velocidad de Procesamiento; secundaria Competencia Lingüística y Fonológica.

**Modelo en Drupal.**

| Campo | Contenido |
|---|---|
| field_activity_format | audio_reading |
| field_text | Un solo valor: el párrafo. Mismo formato que en 5.1. |
| field_seconds | Tiempo de referencia del texto = palabras × 60 / velocidad de referencia del nivel (tabla 2.3), redondeado: 60 palabras son 90 segundos en Level1 (40 ppm) y 23 en Level10 (160 ppm). |

**Qué registra.** Un único log logverticaltext con el tiempo total y los 100 primeros caracteres
del texto como field_item, y un summary_vertical_text. Como el tiempo depende de la longitud del
texto, solo tiene sentido comparar iteraciones de la misma actividad (que es lo que hacen las
estadísticas).

**Parámetros por nivel.**

| Nivel | Palabras | Párrafos | Palabras por frase (media) | Tipo de texto | Dónde crece la dificultad |
|---|---|---|---|---|---|
| Level0 | No recomendado | | | | |
| Level1 | 35 a 80 | 1 | 4 | Narrativo en presente, personajes y objetos cotidianos | Sílabas directas, inversas y mixtas; vocabulario infantil |
| Level2 | 35 a 80 | 1 | 5 | Narrativo | Trabadas (CCV, CCVC); vocabulario infantil |
| Level3 | 35 a 80 | 1 | 7 | Narrativo con diálogo | VCC y CVCC, hiatos; frecuencia hasta 3.000 |
| Level4 | 35 a 80 | 1 | 8 | Narrativo y descriptivo | Frecuencia hasta 5.000; oraciones coordinadas |
| Level5 | 35 a 80 | 1 | 10 | Narrativo y expositivo sencillo | Frecuencia hasta 7.000; primeras subordinadas |
| Level6 | 35 a 80 | 1 | 12 | Expositivo | Frecuencia hasta 10.000; subordinadas |
| Level7 | 35 a 80 | 1 | 14 | Expositivo de ámbito escolar | Frecuencia hasta 15.000; léxico académico |
| Level8 | 35 a 80 | 1 | 16 | Expositivo y argumentativo | Frecuencia hasta 20.000; conectores argumentativos |
| Level9 | 35 a 80 | 1 | 18 | Divulgativo con tecnicismos | Sin límite de frecuencia; tecnicismos |
| Level10 | 35 a 80 | 1 | 20 | Periodístico o divulgativo general | Léxico denso y sintaxis compleja |

**Validación.**

- Número de palabras dentro del rango; frase media y frase más larga dentro del nivel.
- Al menos el 90 % de las palabras dentro de las estructuras silábicas del nivel, y al menos el 95 %
  dentro del rango de frecuencia (los nombres propios admitidos y las palabras del tema cuentan en
  el margen).
- Índice de legibilidad para el español (Fernández Huerta o Szigriszt-Pazos con la escala INFLESZ)
  como control adicional, con umbrales por nivel calibrados con los primeros lotes revisados.
- Tema apto para la edad, sin contenidos sensibles.
- Tiempos verbales del nivel (solo presente en Level1 y Level2; pasados desde Level3; futuro y
  condicional desde Level4; subjuntivo desde Level5), comprobados por la puerta léxica
  (`lexico.py`, `tense_check`, también en segmentación).
- Guía editorial aprobada por el grupo el 2026-10-29 (E11, plans/contenido/encarrecs/lliuraments/
  E11-guia-editorial-es.md y -ca.md): temas por edad y excluidos, la mitad de los textos de Level0 a
  Level3 neutros de edad, cuotas de género y familia, diálogo por nivel (ninguno en Level1 y Level2,
  dos intervenciones en Level3 y Level4, cuatro como mucho desde Level5), números en letras y signos
  por nivel.

**Cómo generarlo.** Redacción asistida: se construye la petición al modelo con los parámetros del
nivel (palabras, frase media, estructuras admitidas, rango de frecuencia, tema), se valida el
resultado, se regeneran los que fallan y se revisa una muestra.

Claves de contenido: formato (audio_reading), parrafos (lista de textos: uno por valor de
field_text), segundos (entero, field_seconds). Huella: el formato y el conjunto de párrafos
normalizados; unidades: las frases del texto (dos lecturas que comparten el 80 % de sus frases
son duplicado; una lista y una lectura con las mismas palabras, no).

**En catalán.** Textos originales en catalán por nivel, nunca traducidos del castellano (cambian
la longitud, la frecuencia y la estructura): entre 30 y 80 palabras en los niveles bajos, con el
léxico y las estructuras de la tabla 2.3 catalana y la velocidad de referencia de su columna. Los
índices de legibilidad calibrados para el castellano no valen; hasta tener uno para el catalán, el
control es la revisión del experto.

**Ejemplo.**

| Clave | Valor |
|---|---|
| codigo | LEC-L01-VEL-001 |
| titulo | El gato de Lola |
| area_principal | Rendimiento y Velocidad de Procesamiento |
| niveles | Level1 |
| contenido.parrafos | Lola tiene un gato. El gato se llama Sol. Sol es pequeño. Come mucho. Por la mañana salta a la cama. Lola lo toma en sus manos. Los dos van a la cocina. Sol come y Lola mira. |
| contenido.segundos | 57 (38 palabras a 40 palabras por minuto) |

### 5.3 Parpadeo (node activity_blink)

**Qué es.** Igual que la lista de texto, pero con sílabas o grupos de letras cortos ("CA SAS",
"FRA CLA") y con su propio tipo de contenido y bundles de seguimiento. El tipo cuenta errores y, al
contar uno, pasa al siguiente elemento.

**Estado.** Implementado (VerticalTextPlayer). El plan de pantallas prevé cuenta atrás y avance
automático cada field_seconds, pero hoy avanza al tocar, como la lista. El formato blink de node
activity es la forma antigua de lo mismo: para contenido nuevo, usar siempre activity_blink.

**Área.** Rendimiento y Velocidad de Procesamiento; secundaria Competencia Lingüística y Fonológica.

**Modelo en Drupal.** field_text (un valor por elemento, como en 5.1) y field_seconds (propuesta:
segundos por elemento).

**Qué registra.** Un log log3_textlistblink por elemento (mismos campos que en 5.1) y un
summary3_vertical_text_blink.

**Parámetros por nivel.**

| Nivel | Elementos | Contenido | field_seconds por elemento (orientativo) |
|---|---|---|---|
| Level0 | 6 | Vocales y sílabas CV con m, p, l, s, t, n, d (ma, pe, li, so) | 3 |
| Level1 | 8 | Resto de CV (que, qui, ce, ci, ge, gi, cha, lla, ña, rra) e inversas VC (al, en, is) | 2,5 |
| Level2 | 8 | Trabadas CCV con l y r (pla, bre, tri, clo, fru) y pares parecidos (pra y par, bla y bal) | 2 |
| Level3 | 10 | CCVC, VCC y CVCC (plan, tras, ins, cons) | 2 |
| Level4 | 10 | Pseudopalabras de 2 sílabas con trabadas (plito, brasu) | 1,8 |
| Level5 | 10 | Pseudopalabras de 3 sílabas | 1,5 |
| Level6 | 12 | Pseudopalabras de 3 sílabas con estructuras complejas | 1,5 |
| Level7 | 12 | Pseudopalabras de 4 sílabas | 1,2 |
| Level8 | 12 | Palabras de baja frecuencia de 4 y 5 sílabas | 1,2 |
| Level9 | 15 | Palabras y pseudopalabras de 5 sílabas | 1 |
| Level10 | 15 | Palabras y pseudopalabras de 5 y 6 sílabas | 1 |

**Validación.** Las mismas que en 5.1, más: cada elemento usa solo sílabas del inventario admitidas
en el nivel y las pseudopalabras no existen en el léxico.

**Cómo generarlo.** Tomar sílabas del inventario según el nivel, combinarlas (para pseudopalabras)
y descartar las combinaciones que formen palabras reales o que no se puedan pronunciar en
castellano.

**Colocación del alivio.** Los elementos de alivio (el 25 a 30 % del total según la
especificación) van **intercalados en posiciones aleatorias** entre el material objetivo, nunca
agrupados al final. La especificación los llama "islas de alivio": su función es cortar la fatiga a
mitad de secuencia, y al final no cortan nada. Regla para el generador: elegir las posiciones al
azar con la semilla del lote, sin dos alivios seguidos, y comprobar en desglose_tipos que no
quedan todos en la cola. Hallazgo del 2026-10-21 sobre el primer lote (sección 8). La misma regla
vale para la repetición rápida (6.4) y la lista de texto (5.1).

Claves de contenido: elementos (lista de textos, mínimo 4, sin el mismo texto dos veces seguidas, sin HTML, con el límite
de caracteres del nivel de 5.1), segundos_por_elemento (mayor que 0), y opcionales
desglose_tipos (el papel de cada elemento en la secuencia de andamiaje: vocal, silaba,
silaba_inversa, silaba_mixta, silaba_trabada, estructura_compleja, pseudopalabra, palabra_real o
alivio; una entrada por elemento) y grupo_fonetico_objetivo. Estos dos últimos no se guardan en
Drupal: sirven para revisar el lote.

**Primer lote**: content/blink-level0-2-v1.json, 20 actividades de Level0 a Level2 (7, 7 y 6)
escritas a mano siguiendo la matriz 2.1 de la especificación (objetivo + pseudopalabras + alivio) y
etiquetadas por sonoridad y esfuerzo, importadas y publicadas el 2026-10-16. Es contenido de prueba
pendiente de revisión por el equipo terapéutico; las pseudopalabras se eligieron para que no sean
palabras en castellano ni en catalán. **Defecto conocido**: en las 20 el alivio ocupa las dos
últimas posiciones (la le li lo lu, a, de...), en contra de la regla de colocación de arriba. No se
reordenan in situ si ya tienen summaries (3.4): se sustituyen con códigos nuevos cuando llegue el
lote definitivo de Level0 a Level2.

**Ciclo obligatorio Sílabas.** Es el uso natural de este tipo: ejercicios por los que pasa todo
usuario, en orden y sin repetir hasta haberlos hecho todos, al margen de su nivel
([level-system.md](level-system.md), sección 7). Mecanismo:

- Crear el término "Sílabas" en el vocabulario activity_cycle (hoy está vacío, en todos los
  entornos).
- Una actividad por familia silábica, con field_cycle = Sílabas y field_cycle_weight con el orden
  pedagógico, de 10 en 10 para poder intercalar después.
- field_activity_level = Level0 y field_main_area = Competencia Lingüística y Fonológica. El
  generador ignora ambos en las actividades de ciclo, pero son obligatorios y se copian al summary.
- Contenido de cada actividad: las 5 sílabas de la familia en orden, las mismas desordenadas y 3
  palabras frecuentes que las contienen (11 a 13 elementos). Cada pantalla es **una sola sílaba o
  vocal**: la vuelta desordenada repite las sílabas de la familia en otro orden, sin ninguna pareja
  consecutiva del orden original y sin empezar por la última de la vuelta ordenada. **Decisión del
  2026-10-27** (revisión del experto, plans/multiidioma/resposta-revisio-lots-ca.md, punto 1): el
  primer ciclo catalán llevaba la vuelta en parejas ("mu ma", "u a") porque el importador rechazaba
  los repetidos; el experto lo descartó porque dos sílabas por pantalla doblan la carga de un niño
  de 5 años y dos vocales juntas se leen como diptongo (ua, oi, eu). Desde entonces el parpadeo admite
  repetidos que no vayan seguidos (5.1) y el ciclo castellano seguirá la misma regla.

Inventario propuesto (unas 40 actividades; sin lote todavía, el castellano no tiene ciclo cargado):

| Bloque | Familias | Actividades | Pesos |
|---|---|---|---|
| Vocales | a e i o u | 1 | 10 |
| Directas iniciales | m, p, l, s, t, n, d | 7 | 20 a 80 |
| Resto de directas | f, b/v, r, rr, ñ, ch, ll/y, j, z/ce/ci, c/qu, g/gu, güe/güi, h, x | 14 | 90 a 220 |
| Inversas | al el il ol ul, an en in on un, as es is os us, ar er ir or ur | 4 | 230 a 260 |
| Trabadas con l | pl, bl, cl, fl, gl | 5 | 270 a 310 |
| Trabadas con r | pr, br, cr, fr, gr, tr, dr | 7 | 320 a 380 |

**Ciclo Síl·labes (catalán).** Mismo mecanismo y mismo término de ciclo (traducido con
content_translation: "Síl·labes"; lo crea `scripts/create-cycle-term.php` y lo traduce
`scripts/translate-interface-terms.php`), con actividades propias en catalán (`langcode` ca, códigos
BLK-CA-CIC-SILABAS-nnn): una por familia, Level0 y Competencia Lingüística y Fonológica, 5 sílabas
en orden, las mismas desordenadas y 3 palabras frecuentes que las contienen. En las familias de
dígrafos que el IEC separa entre sílabas (rr, ss, tg/tj, l·l) y en ix, tx e ig se presentan
**patrones de lectura fluida** (rra, assa, tge, al·la, aix), no sílabas ortográficas: el experto
los validó el 2026-10-27 con la condición de decirlo al tutor. Entrenan el reconocimiento visual
del dígrafo en su contexto vocálico y no sustituyen las reglas de división silábica del IEC que el
niño aprende en la escuela. Inventario de
plans/multiidioma/estructura-ca.md, apartado 2 (unas 44 actividades):

| Bloque | Familias | Actividades | Pesos |
|---|---|---|---|
| 1 Vocals | a e i o u | 1 | 10 |
| 2 Directes inicials | m, p, l, s, t, n, d | 7 | 20 a 80 |
| 3 Resta de directes | f, b/v, r, rr, ny, ll, j/g, z/c/ç, c/qu, g/gu, h, x | 12 | 90 a 200 |
| 4 Dígrafs propis | ss, ix, tx, ig, tg/tj | 5 | 210 a 250 |
| 5 Inverses | al el il ol ul, an en in on un, as es is os us, ar er ir or ur | 4 | 260 a 290 |
| 6 Travades amb l | pl, bl, cl, fl, gl | 5 | 300 a 340 |
| 7 Travades amb r | pr, br, cr, fr, gr, tr, dr | 7 | 350 a 410 |
| 8 Complexes i finals | codas ns, st, ts, cs, nc; ela geminada l·l; apóstrofo l’ y d’ + vocal | 3 | 420 a 440 |

Dos cambios respecto al orden que proponía el experto, confirmados por él: tx pasa del bloque 3 al
4 (es una africada medial o final, no una directa) y la ela geminada pasa del bloque 4 al 8 (su
nivel mínimo es Level3 y el bloque 4 iba antes de las inversas, que son de Level1).

**En catalán.** El parpadeo catalán usa el inventario silábico catalán: sílabas con fonética propia
(ce, ci, ge, gi, ny, tx, ix, l·l), la vocal neutra en posición átona y las codas finales frecuentes
(gat, sol, cap). Las sílabas directas universales (ma me mi mo mu, pa pe pi po pu) se pueden
compartir con el castellano en un registro con `idiomas` [es, ca], pero sílaba a sílaba y con
revisión del experto: ce, ci, ge, gi y las vocales átonas se leen distinto, y el "alivio" de cada
idioma es otro. El alivio catalán (a, e, ma, pa, sol, pa) va intercalado al azar, como en
castellano. Las pseudopalabras siguen la fonotaxis catalana (pro, pso, frou valen) y se descartan
las que sean palabra en catalán o en castellano. Convenciones y prompts de los lotes catalanes en
plans/multiidioma/prompts-contenido/.

### 5.4 Posición de imágenes (node activity_image_position)

**Qué es.** La actividad tiene varios grupos de imágenes. En cada grupo el usuario mira las imágenes
numeradas el tiempo que quiera, pulsa "Siguiente paso" y responde "¿En qué posición estaba?" con el
nombre de una de ellas.

**Área.** Memoria de Trabajo (Auditiva y Visual); secundaria Funciones Ejecutivas y Atención.

**Modelo en Drupal.**

| Campo | Tipo | Contenido |
|---|---|---|
| field_items | paragraphs i1, múltiple | Un paragraph por grupo. |
| i1.field_position_to_ask | entero | Posición que se pregunta (1 = la primera). No es obligatorio en Drupal y la app usa 1 si falta: el generador debe ponerlo siempre. |
| i1.field_items | paragraphs i1_item, múltiple | Las imágenes del grupo, en el orden en que se muestran. |
| i1_item.field_image | media image (obligatorio) | La imagen. |
| i1_item.field_text | texto corto (obligatorio) | Nombre de la imagen; es lo que se lee en la pregunta. |

No lleva field_seconds (decisión B3 de [metrics-tracking.md](metrics-tracking.md)): la métrica es la
precisión, no el tiempo. El tipo no cuenta errores.

**Qué registra.** Un log logimageposition por grupo (field_weight = posición correcta, field_answer
= posición elegida, field_correct) y un summary_image_position con field_correct_count y
field_items_count.

**Parámetros por nivel.**

| Nivel | Imágenes por grupo | Grupos | Relación entre las imágenes | Posición preguntada |
|---|---|---|---|---|
| Level0 | 2 | 4 | Categorías distintas (animal, fruta, objeto) | Primera o última |
| Level1 | 3 | 4 | Categorías distintas | Primera o última |
| Level2 | 3 | 4 | Categorías distintas | Cualquiera |
| Level3 | 4 | 5 | Misma categoría amplia (animales) | Cualquiera |
| Level4 | 4 | 5 | Misma categoría amplia | Preferencia por las centrales |
| Level5 | 5 | 5 | Misma categoría amplia | Centrales |
| Level6 | 5 | 6 | Misma categoría estrecha (animales de granja) | Centrales |
| Level7 | 6 | 6 | Misma categoría estrecha | Centrales |
| Level8 | 6 | 6 | Parecidas en forma o color (perro, lobo, zorro) | Centrales |
| Level9 | 6 | 6 | Parecidas y con nombres que empiezan igual (pato, pala, pan) | Centrales |
| Level10 | 6 | 6 | Parecidas en forma, color y nombre | Centrales |

La primera y la última posición se recuerdan mejor que las centrales; por eso en los niveles bajos
se preguntan los extremos. Tope recomendado de 6 imágenes por grupo: las tarjetas miden 140 px y
con más hay que desplazar la pantalla en un móvil pequeño, y la tarea pasaría a ser de
desplazamiento (comprobar con 6).

**Validación.**

- Imágenes y nombres distintos dentro de cada grupo.
- field_position_to_ask entre 1 y el número de imágenes del grupo, y variado entre grupos (no
  siempre la misma posición).
- La pregunta solo muestra el nombre escrito: en Level0 y Level1 usar nombres CV muy frecuentes
  (mano, pie, sopa) para que la lectura no sea el obstáculo de un ejercicio de memoria.
- Todas las imágenes del mismo estilo.

**Cómo generarlo.**

1. Elegir del banco la categoría según la relación que pide el nivel.
2. Para cada grupo, tomar N imágenes sin repetir dentro de la actividad y fijar la posición a
   preguntar según la columna del nivel.
3. Cargar el lote: el handler crea los paragraphs i1_item e i1 y el nodo; los media del banco
   tienen que existir antes (`drush shine-content:import-images`, 4.4).

**Clave `contenido` del lote** (`ImagePositionActivityHandler`, prefijo IMG, desde la FASE 18):
`grupos`, lista de al menos 2 grupos; cada grupo un objeto con `posicion` (entero entre 1 y el
número de imágenes) e `imagenes` (lista de 2 a 6 objetos con `imagen`, el slug del banco = name del
media, en minúsculas ASCII, y `nombre`, lo que se lee en la pregunta, texto de 1 a 255 caracteres sin
HTML). Imágenes y nombres distintos dentro del grupo; el media tiene que existir exactamente uno.
Bilingüe desde el inicio: en un registro con `idiomas` [es, ca] el `nombre` es un objeto por idioma
({"es": "gato", "ca": "gat"}) y la imagen es la misma (nombres catalanes:
plans/multiidioma/banco-imagenes-equivalencia-ca.csv). Forma canónica: los grupos con sus slugs en
orden y la posición preguntada, sin nombres ni orden de grupos; unidades: los slugs. Al reimportar,
un grupo que no cambia conserva su paragraph; un grupo que cambia se crea de nuevo con sus ítems.

**En catalán.** La imagen es la misma y el nombre cambia: `nombre` sale del bloque `ca` de cada
entrada de shine/content/images/manifest.json (nombre, artículo, silabeo del IEC, nivel lector
catalán, etiquetas y `usable`; viene del CSV plans/multiidioma/banco-imagenes-equivalencia-ca.csv,
validado por el experto). Las 9 entradas con `usable` false no se usan en catalán y no se borran:
su nombre coincide con el de otra imagen (pelota y balón son pilota; clavo y llave, clau; tornillo
y caracol, cargol; bolso y bolsa, bossa: de cada pareja queda usable una sola imagen) o es de varias
palabras o con guion (gall dindi, blat de moro, arc de Sant Martí, gira-sol, io-io). Parejas y
pares mínimos nuevos del catalán, para los niveles altos y nunca para los bajos: gat, got y gos;
llit y llet; gerro y gerra; tapa y tap; ós y os; sal y sol; cap, capa y copa. El nivel lector de la
pregunta es el catalán (`lectura` del bloque ca; los monosílabos con coda doble, como dent, pont o porc, son L3 desde
el 2026-10-29): en Level1 solo nombres con lectura L0 o L1 en catalán. **En Level0 solo
monosílabos (pa, pi, sol, nen) o bisílabos de sílabas abiertas simples (pila, sopa, boca)**, sin
dígrafos, grupos consonánticos ni diptongos, en los dos idiomas (revisión del experto, 2026-10-27:
el primer lote metía taronja y cirera, de tres sílabas, porque el generador aceptaba lectura L1
cuando faltaban nombres L0; la regla es `nombre_simple` de generadores/imagenes.py y deja 48
imágenes). En un registro con `idiomas` [es, ca] el nombre tiene que ser legible en el nivel en los
dos idiomas.

**Ejemplo.**

| Clave | Valor |
|---|---|
| codigo | IMG-ES-L03-MEM-001 |
| idioma | es |
| titulo | ¿Dónde estaba cada animal? |
| area_principal | Memoria de Trabajo (Auditiva y Visual) |
| area_secundaria | Funciones Ejecutivas y Atención |
| niveles | Level3 |
| grupo 1 | gato, perro, vaca, pato · posición 2 |
| grupo 2 | oso, león, mono, cerdo · posición 4 |
| grupo 3 | gallina, conejo, caballo, oveja · posición 1 |
| grupo 4 | tigre, rana, ratón, burro · posición 3 |
| grupo 5 | lobo, pez, toro, cabra · posición 2 |

---

## 6. Tipos de la FASE 13 (implementados el 2026-10-21)

Los modelos de esta sección se implementaron tal como se proponían, con tres ajustes anotados en
cada tipo: la matriz registra **un log por ronda** (no por objetivo), los bundles de la matriz se
llaman `loglettermatrix` / `summary_letter_matrix` (con doble t; los documentos previos escribían
"logletermatrix") y los logs de sílabas y segmentación llevan `field_attempts`. En los tres, el
contenido se guarda ya resuelto en Drupal en lugar de generarse en la app: así el ejercicio es igual
en cada intento, los tiempos y aciertos se pueden comparar entre iteraciones (como en el resto de
tipos) y el contenido se revisa antes de publicarlo. Los tres se importan con
`drush shine-content:import` (handlers `LetterMatrixActivityHandler`, `SyllableOrderActivityHandler`
y `WordSplitActivityHandler`); el lote de ejemplo es `shine/content/fase13-ejemplos-v1.json`. Ninguno
cuenta errores (`activity_options`): se autocorrigen en la app.

### 6.1 Matriz de discriminación visual (prompt 13a, node activity_letter_matrix)

**Qué es.** Una cuadrícula de letras parecidas entre sí (en los niveles altos, sílabas o palabras).
El usuario toca todas las apariciones del objetivo ("Encuentra todas las p") mientras una barra de
tiempo discreta se vacía. Al terminar, las que faltaron se revelan con un aro ámbar, sin mensaje de
fallo. Ejercicio 7.6 del docx.

**Área.** Procesos Perceptivos (Discriminación Visual y Auditiva); secundaria Funciones Ejecutivas y
Atención.

**Modelo (implementado).**

| Campo | Tipo | Contenido |
|---|---|---|
| field_target | texto corto | Objetivo: letra, sílaba o palabra. En doble objetivo, dos separados por coma ("bra, dra"). |
| field_columns | entero | Columnas. Con letras, máximo 6, para que cada celda mida al menos 48 px en un móvil de 375 px de ancho; con palabras, 3. |
| field_rows | entero | Filas (máximo 10). |
| field_cells | texto largo, múltiple | Una ronda por valor: las celdas de izquierda a derecha y de arriba abajo, separadas por espacios (así admite sílabas y palabras). |
| field_time_limit | entero | Segundos de la barra de tiempo por ronda; vacío = sin límite. |

**Qué registra.** Bundles `loglettermatrix` y `summary_letter_matrix`. **Un log por ronda** (no
por objetivo, para que la suma de `field_time` de los logs siga siendo el tiempo total del intento,
como en el resto de tipos): `field_item` = el objetivo, `field_weight` = ronda, `field_correct` =
todos encontrados, `field_correct_count` / `field_items_count` = encontrados / que había en la
ronda, `field_time` = ms de la ronda. En el summary, `field_correct_count` y `field_items_count`
suman las rondas y `field_false_marks` cuenta las celdas marcadas que no eran objetivo al
comprobar. Las marcas falsas no se pintan como error ni van a `field_errors` (el contador del
adulto; el tipo no lo usa).

**Clave `contenido` del lote** (`LetterMatrixActivityHandler`, prefijo MAT): `objetivo` (texto; varios
separados por coma), `columnas` (2 a 6), `filas` (2 a 10), `rondas` (lista: cada ronda un texto con
las celdas separadas por espacios, o una lista de celdas; exactamente columnas × filas celdas y al
menos un objetivo por ronda), `segundos` (opcional, 1 a 600) y `objetivos_por_ronda` (opcional:
cada ronda debe tener exactamente ese número de celdas objetivo).

**Parámetros por nivel.**

| Nivel | Estímulo | Cuadrícula (columnas × filas) | Rondas | Objetivos por ronda | Distractores | Tiempo por ronda |
|---|---|---|---|---|---|---|
| Level0 | Letras muy distintas | 3 × 4 | 2 | 3 | Sin rasgos en común con el objetivo (p entre o, s, a) | Sin límite |
| Level1 | Letras | 4 × 5 | 2 | 4 | Uno parecido (p entre q, o, s) | Sin límite |
| Level2 | Letras | 4 × 6 | 2 | 5 | Dos parecidos (p entre q, b, o) | 60 s |
| Level3 | Letras | 5 × 6 | 2 | 6 | Especulares b, d, p, q | 50 s |
| Level4 | Letras | 6 × 7 | 1 | 7 | b, d, p, q, g | 45 s |
| Level5 | Letras | 6 × 8 | 1 | 8 | b, d, p, q, g más rotaciones n y u, m y w | 35 s |
| Level6 | Letras | 5 × 10 | 1 | 8 | b, d, p, q, g (el ejemplo del docx: 50 letras, 8 objetivos, 20 s) | 25 s |
| Level7 | Sílabas | 4 × 7 | 1 | 7 | Inversiones y trabadas (bra, bar, dra, pra) | 40 s |
| Level8 | Sílabas | 4 × 8 | 1 | 8 | Ídem, con doble objetivo (bra y dra) | 40 s |
| Level9 | Palabras cortas | 3 × 7 | 1 | 6 | Pseudopalabras con una letra cambiada (bola entre dola, pola, bloa) | 45 s |
| Level10 | Palabras | 3 × 8 | 1 | 8 | Palabras reales parecidas (casa entre cosa, caza, capa), doble objetivo | 45 s |

**Validación.**

- El objetivo aparece exactamente el número de veces declarado en cada ronda (ni una más por azar).
- Celdas = columnas × filas.
- Objetivos repartidos: al menos uno en cada mitad de la cuadrícula y, en Level0 a Level3, no más de
  2 en la misma fila.
- Distractores equilibrados: cada uno aparece un número de veces parecido.
- Revisar con las dos fuentes de la app (Nunito y OpenDyslexic): algunas letras cambian de forma
  entre fuentes y un par que se confunde en una puede no confundirse en la otra.

**Cómo generarlo.** Es el tipo más fácil de automatizar: no necesita léxico salvo en Level9 y
Level10.

1. Tomar del nivel el estímulo, el tamaño, los objetivos, el conjunto de distractores y el tiempo.
2. Elegir el objetivo y sus distractores de la tabla de confusiones visuales (4.2).
3. Colocar los objetivos en posiciones al azar que cumplan el reparto.
4. Rellenar el resto con distractores equilibrados.
5. Validar y guardar la semilla en origen para poder regenerar la misma matriz.

Claves de contenido: objetivo, columnas, filas, rondas (lista de cuadrículas), tiempo.

**Variante para Funciones Ejecutivas y Atención.** Hoy ningún tipo tiene esa área como principal
(sección 7). Una matriz "con regla" la cubriría con el mismo modelo más un campo de regla: tocar la
p solo cuando va justo después de una a, o cambiar de objetivo en cada fila. Necesita soporte en el
player. **Decidida por el grupo** (E10.4, 2026-10-29): es el tipo propio del área; mecánica, reglas R1 a R4 y
parámetros por nivel en plans/contenido/encarrecs/lliuraments/E10-4-funcions-executives-proposta.md (3.1).
Mientras no esté, el área no entra en la rotación de las sesiones regulares (no se reserva hueco a un área
sin contenido) y la matriz, la posición de imágenes y la repetición rápida la llevan como secundaria.

**En catalán.** Las matrices de letras universales (p, b, d, q, n, u, m, w, g y los distractores
neutros o, s, a, t) son compartibles: un registro con `idiomas` [es, ca] y título e instrucción por
idioma. Son propias del catalán las que trabajan grafías catalanas: l·l frente a ll, ç frente a c,
ny, ix, acento abierto frente a cerrado (à, è, ò frente a é, ó) y diéresis (ï, ü), con el término de
esfuerzo "Grafies diacrítiques i especials". La de l·l no baja de Level3, el nivel mínimo de la
ela geminada (revisión del experto, 2026-10-27: la primera estaba en Level2 y pasó a
matriz-ca-level3-v1, pendiente de que exista el término Level3); las demás grafías siguen su nivel
mínimo de 3.5 (ç y ny desde Level1, ix desde Level2).
Las celdas de más de un carácter (l·l, ny, ix, tx) van separadas por espacios en `rondas`, igual
que las sílabas y las palabras; el objetivo l·l lleva el punto volado U+00B7. Las sílabas y las
palabras de Level7 en adelante son catalanas (bra, bar, dra; casa, caça, cosa).

**Ejemplo.** codigo MAT-L04-PER-001, titulo "Encuentra todas las d", objetivo d, 6 columnas × 7
filas, 45 s, 7 objetivos (en negrita):

| | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Fila 1 | b | **d** | p | q | b | g |
| Fila 2 | q | b | g | **d** | p | b |
| Fila 3 | p | q | b | q | g | **d** |
| Fila 4 | g | p | **d** | b | q | p |
| Fila 5 | b | q | **d** | p | b | q |
| Fila 6 | **d** | g | b | q | p | g |
| Fila 7 | q | p | g | b | **d** | q |

Distractores: b aparece 10 veces, q 10, p 8 y g 7.

**Matriz con regla (FASE 19, Funciones Ejecutivas y Atención).** Misma mecánica y mismo bundle;
el niño toca solo las celdas que cumplen una regla, y las que se parecen al objetivo sin cumplirla
son **cebos** (comisión impulsiva). Plan, familias y parámetros por nivel en
`plans/funcions-executives/README.md`; código `MAT-XX-Lnn-ATE-nnn`, área principal Funciones
Ejecutivas y Atención. En el lote, `contenido` lleva además:

- `regla`: `{"tipo": "r1"}` (clave de fila: la primera columna es la clave y no se toca; sin
  `objetivo`), `{"tipo": "r2" | "r3", "contexto": "a"}` (después de / menos después de, con
  `objetivo` = una sola celda), o `{"tipo": "r4", "filas": {"clara": {"objetivo": "s"}, "oscura":
  {"objetivo": "m"}}}` (alternancia: filas pares claras, impares oscuras; cada clase admite
  `contexto` para la r2 dentro de la clase de Level10). `"oculta": true` en Level9 y Level10.
- `objetivos_por_ronda` y `cebos_por_ronda`, obligatorios: el importador clasifica las celdas con
  la regla (`MatrixRule`, solo dentro de la fila, sin distinguir mayúsculas), rechaza la ronda si
  los recuentos no coinciden, si una fila empieza con el objetivo justo después de otra que acaba
  con el contexto o si la actividad tiene menos de 5 objetivos en total, y guarda los índices en
  `field_target_cells` y `field_lure_cells` (uno por ronda, como `field_cells`).
- Nodo: `field_rule` (r1 a r4), `field_rule_params` (JSON de la regla canónica, entra en la
  huella), `field_target` con lo que se busca ("p"; en r1, las claves; en r4, "s, m"). Log y
  summary: `field_lure_marks`. El freno por aciertos usa (encontrados − cebos) / objetivos.
- Sin `regla`, la matriz es la de siempre y `cebos_por_ronda` es un error.

### 6.2 Reordenamiento de sílabas (prompt 13b, node activity_syllable_order)

**Qué es.** Las sílabas de una palabra aparecen desordenadas en fichas ("lon", "pan", "ta") y el
usuario las coloca en orden ("pantalón") tocándolas en orden. Un fallo deja en ámbar las
posiciones incorrectas, sin mensaje ni reinicio, hasta que el usuario las corrige; el acierto se
cuenta al conseguirlo. Imagen de apoyo opcional como pista.
Ejercicio 7.8 del docx.

**Área.** Competencia Lingüística y Fonológica; secundaria Memoria de Trabajo (Auditiva y Visual).

**Modelo (implementado).** Una actividad tiene varias palabras. Respuesta a la pregunta abierta de
13b: **las sílabas se guardan explícitas, no se derivan en la app**. El silabeo automático falla en
hiatos, prefijos y h intercalada, y el generador ya tiene el silabeo revisado en el léxico. La app
solo baraja. Interacción elegida: **tocar las fichas en orden** (sin arrastre): accesible y sin
depender de gestos; tocar un hueco devuelve la ficha.

| Campo | Tipo | Contenido |
|---|---|---|
| field_items | paragraphs syllable_word, múltiple | Una palabra por paragraph (mismo patrón que i1_item). |
| syllable_word.field_syllables | texto corto | La palabra con las sílabas separadas por guion, en orden (pan-ta-lón). |
| syllable_word.field_extra_syllables | texto corto, opcional | Sílabas sobrantes que no forman parte de la palabra, separadas por guion (bar). Requiere que el player admita fichas sobrantes. |
| syllable_word.field_image | media image, opcional | Pista. |

Barajado en la app en cada intento, con dos reglas: nunca en el orden correcto y, desde Level4,
ninguna pareja de sílabas consecutivas en su orden original. Si se quiere comparabilidad estricta
entre intentos, se puede guardar también el orden barajado.

**Qué registra.** Bundles `logsyllableorder` y `summary_syllable_order`. Un log por palabra:
`field_item` = la palabra, `field_weight` = posición, `field_correct` = formada al primer intento,
`field_attempts` = intentos hasta formarla, `field_time` = ms hasta formarla. En el summary,
`field_correct_count` (palabras a la primera) y `field_items_count`.

**Clave `contenido` del lote** (`SyllableOrderActivityHandler`, prefijo SIL): `palabras` (lista de al
menos 4; cada una un texto "pan-ta-lón" o un objeto con `silabas`, `sobrantes` opcional en el mismo
formato e `imagen` opcional = slug del banco de imágenes, que es el name del media de tipo imagen
(`drush shine-content:import-images`, 4.4), y debe existir exactamente uno).
Sin palabras repetidas. Los paragraphs existentes se reutilizan si no cambian y se sustituyen si
cambian (los antiguos quedan huérfanos y los purga entity_reference_revisions).

**Parámetros por nivel.**

| Nivel | Palabras | Sílabas por palabra | Estructuras | Sílabas sobrantes | Imagen |
|---|---|---|---|---|---|
| Level0 | 4 | 2 | CV (ma-no, pa-to) | 0 | Siempre |
| Level1 | 5 | 2 a 3 | Directas, inversas, mixtas, diptongos (pe-lo-ta, hue-vo) | 0 | Siempre |
| Level2 | 5 | 3 | Con trabadas (plá-ta-no, glo-bo) | 0 | Siempre |
| Level3 | 6 | 3 a 4 | Complejas e hiatos (trans-por-te, ma-íz) | 0 | Como pista activable |
| Level4 | 6 | 4 | Todas | 0 | Pista |
| Level5 | 6 | 4 | Todas | 1 | Pista |
| Level6 | 6 | 5 | Todas | 1 | Sin imagen |
| Level7 | 6 | 5 | Todas | 1 parecida a una de la palabra (bra si está bar) | Sin imagen |
| Level8 | 6 | 5 a 6 | Baja frecuencia | 1 parecida | Sin imagen |
| Level9 | 6 | 6 | Baja frecuencia | 2 parecidas | Sin imagen |
| Level10 | 6 | 6 a 7 | Vocabulario académico | 2 parecidas | Sin imagen |

**Validación.**

- El silabeo es el del léxico revisado y las sílabas unidas reproducen la palabra exacta, con tilde
  incluida (lón).
- **Sin ambigüedad**: ninguna otra permutación de las sílabas forma una palabra del léxico (co-sa y
  sa-co, ma-lo y lo-ma, to-ma y ma-to). Si la forma, se descarta la palabra (o se aceptan las dos
  respuestas, pero la app hoy solo compararía contra una).
- Las sílabas sobrantes no permiten formar otra palabra válida con las demás.
- Palabras con imagen solo si existe en el banco; sin palabras repetidas en la actividad.

**Cómo generarlo.**

1. Filtrar el léxico por sílabas, estructuras y frecuencia del nivel.
2. Comprobar la ambigüedad de las permutaciones contra el léxico.
3. Elegir las sobrantes de la tabla de confusiones (bra para bar, pla para pal).
4. Asociar la imagen del banco cuando el nivel la pide.

Claves de contenido: palabras, cada una con silabas, sobrantes e imagen.

**En catalán.** Silabeo normativo del IEC, tomado de la columna silabas_ca del CSV (bloque `ca`
del manifiesto para las palabras del banco): los dígrafos tx, ix, ig, tg, tj, ss, rr y l·l se
separan entre sílabas (cot-xe, cai-xa, pet-xi-na, met-ge, plat-ja, tas-sa, car-ro, col-le-gi) y
ny, ll, qu y gu van unidos (pi-nya, llu-na, quin, gui-neu); los hiatos van en sílabas distintas
(pi-a-no, lle-ó, a-vi-ó). Atención a la ela geminada (Level3): el CSV escribe col-le-gi, pero las
fichas tienen que reproducir la palabra al unirse, así que en el lote el punto volado se queda en
la ficha anterior (col·, le, gi); el experto lo validó el 2026-10-27. La ambigüedad de
permutaciones se comprueba contra el léxico catalán (ca-sa y sa-ca) y la palabra se descarta
mientras la app solo acepte el orden declarado (validado por el experto: casa, vaca, pipa, pala,
tapa fuera). Las palabras de una sílaba de una sola vocal (a-la, o-na) valen en Level0. La imagen de apoyo y su nombre salen del banco con el bloque ca.

**Ejemplo.**

| Clave | Valor |
|---|---|
| codigo | SIL-L02-LIN-001 |
| titulo | Ordena las sílabas |
| area_principal | Competencia Lingüística y Fonológica |
| area_secundaria | Memoria de Trabajo (Auditiva y Visual) |
| niveles | Level2 |
| contenido.palabras | plá-ta-no, bru-ja, glo-bo, fre-sa, cla-vel (todas con imagen) |

### 6.3 Segmentación léxica (prompt 13c, node activity_word_split)

**Qué es.** Una frase escrita sin espacios ("hoyymañanairemosajugar"). El usuario toca entre las
letras para poner los espacios y pulsa "Comprobar". Trabaja la conciencia léxica y la tendencia a
unir palabras al leer y escribir. Ejercicio 7.5 del docx.

**Área.** Competencia Lingüística y Fonológica; secundaria Rendimiento y Velocidad de Procesamiento.

**Modelo (implementado).** Como pide 13c, se guarda la frase correcta con espacios y la versión sin
espacios se deriva en la app. Interacción: tocar una letra pone o quita el espacio justo delante de
ella, marcando el inicio de palabra (una zona de toque por letra, 48 px de alto, en vez de zonas
diminutas "entre" letras). Bajo la frase se ven las barras que faltan por colocar, tantas como
espacios tiene la frase; no se pueden poner más y "Comprobar" se activa cuando no queda ninguna.

| Campo | Tipo | Contenido |
|---|---|---|
| field_sentences | texto corto, múltiple | Una frase por valor, con espacios simples, en minúsculas y sin signos de puntuación. |

**Qué registra.** Bundles `logwordsplit` y `summary_word_split`. Un log por frase: `field_item` = la
frase, `field_weight` = posición, `field_correct` = segmentada bien al primer intento,
`field_attempts` = comprobaciones hasta acertar, `field_time`. En el summary, `field_correct_count` y
`field_items_count`. Acierto parcial: los espacios correctos se fijan y se quitan los demás.

**Clave `contenido` del lote** (`WordSplitActivityHandler`, prefijo SEG): `frases` (lista de al menos
4 textos en minúsculas, solo letras del castellano y del catalán (tildes, ñ, ü, ï, ç, l·l y apóstrofo)
y espacios simples, al menos 2 palabras, máximo 120 caracteres, sin repetidas).

**Parámetros por nivel.**

| Nivel | Frases | Palabras por frase | Uniones que se trabajan |
|---|---|---|---|
| Level0 | No recomendado (todavía no lee frases) | | |
| Level1 | 4 | 3 | Palabras muy frecuentes de 1 y 2 sílabas (el sol sale) |
| Level2 | 5 | 4 a 5 | Artículos, preposiciones y conjunciones (el, la, a, en, y) |
| Level3 | 5 | 5 a 6 | Ídem con más longitud (hoy y mañana iremos a jugar) |
| Level4 | 5 | 6 a 7 | Contracciones al y del |
| Level5 | 6 | 7 a 8 | Pronombres átonos delante del verbo (se lo dio, me lo trae) |
| Level6 | 6 | 8 a 9 | Pronombres pegados al verbo, que van juntos (dámelo, ponte) |
| Level7 | 6 | 9 a 10 | Pares que se confunden: a ver y haber, si no y sino, por qué y porque, tan bien y también |
| Level8 | 6 | 10 a 11 | Ídem, con vocabulario menos frecuente |
| Level9 | 6 | 11 a 12 | Dos oraciones coordinadas |
| Level10 | 6 | 12 a 14 | Oraciones con subordinadas |

**Validación.**

- Minúsculas, sin signos de puntuación ni cifras; se conservan tildes, ñ y ü (y en catalán ç, l·l,
  diéresis y apóstrofo). Las mayúsculas delatarían el inicio de las palabras.
- Todas las palabras en el léxico y dentro del rango de frecuencia del nivel; sin nombres propios.
- **Ambigüedad**: la app corrige contra la frase declarada (`correctCuts` de
  shine-app/src/lib/wordSplit.ts), no contra el léxico. Una partición alternativa hecha de palabras
  sueltas sin sentido (casa en ca + sa, pare en pa + re, escola en es + cola) no descarta la frase:
  descartarla quitaba el vocabulario más básico (revisión del experto, 2026-10-27). Se descarta hasta
  Level6 solo si otra partición da una frase con sentido que un niño podría leer ("sinoes": "si no
  es" y "sino es"). Desde Level7 esa ambigüedad es justo lo que se trabaja: la frase debe tener una
  sola lectura gramatical por contexto y la decide la revisión humana.
- Comprobar en un móvil pequeño que la frase cabe sin desplazamiento con la tipografía del ejercicio
  (mínimo 24 px).

**Cómo generarlo.** Redacción asistida o plantillas con el léxico del nivel, pidiendo
explícitamente las uniones de la última columna; después validación de longitud, léxico y
ambigüedad, y revisión de una muestra.

Claves de contenido: frases (lista de textos).

**En catalán.** Frases en minúsculas con las letras del catalán (ç, l·l, acentos abiertos y
cerrados, diéresis), que el importador admite desde el 2026-10-26. La unión propia del catalán son
los apóstrofos y las contracciones (l’avi, d’un, m’ho; al, del, pel): entran desde Level3 (término
"Apostrofació i contraccions") y hasta Level2 las frases los evitan (el gat dorm, la nena menja
pa). El apóstrofo forma parte de la palabra (l’avi es una palabra para la segmentación), recto o
tipográfico en el lote, mejor tipográfico. Los pronombres enclíticos con guion (dona-m’ho) todavía
no pasan la validación: hasta que el importador los admita, en Level6 solo los de apóstrofo
(posa’t, mira’l); el experto lo dio por bueno como solución temporal y pidió la mejora para los
lotes de los niveles altos. Los pares que se confunden de Level7 son los del catalán
(si no y sinó, per què y perquè, tan poc y tampoc, al menys y almenys).

**Ejemplo.**

| Clave | Valor |
|---|---|
| codigo | SEG-L02-LIN-001 |
| titulo | Separa las palabras |
| area_principal | Competencia Lingüística y Fonológica |
| area_secundaria | Rendimiento y Velocidad de Procesamiento |
| niveles | Level2 |
| contenido.frases | el gato come pan; mi tren es azul; la niña va a casa; papá y yo jugamos; el perro salta mucho |

---

### 6.4 Repetición rápida de palabra (prompt 16a, node activity_rapid_repetition, FASE 16)

**Qué es.** Una actividad con varias palabras (o pseudopalabras). Por cada palabra: se muestra en
grande; el tutor pulsa "Comenzar"; la palabra desaparece y arranca una cuenta atrás de N segundos;
el alumno la repite en voz alta lo más rápido que puede y el tutor toca un botón gigante por cada
repetición completa; al llegar a 0 suena un aviso discreto y el conteo se cierra. Métrica:
repeticiones por palabra en tiempo fijo (ritmo, "más es mejor"). Sin aciertos ni errores. Origen:
`docs/ejercicios/Repetición Rápida.md`, con las decisiones del 2026-10-21 (varias palabras por
actividad, sin `tutor_id`, sin tasa en Hz almacenada, sin `is_pseudoword` por palabra) por encima
de la especificación donde difieren.

**Área.** Rendimiento y Velocidad de Procesamiento; secundaria Funciones Ejecutivas y Atención (decisión E10.4 del grupo, 2026-10-29: computa para esa área mientras no exista la matriz con regla; antes, Competencia Lingüística y Fonológica)
(y ninguna más: solo hay un campo secundario).

**Modelo (implementado).**

| Campo | Tipo | Contenido |
|---|---|---|
| field_words | texto corto, múltiple | Una palabra o pseudopalabra por valor, en el orden de presentación. Mínimo 4. |
| field_time_limit | entero, obligatorio | Segundos por palabra, el mismo para todas las de la actividad (storage de la matriz). |
| field_sonority, field_decoding_effort | términos de segundo nivel | Por actividad, no por palabra: las palabras de una actividad comparten el grupo objetivo (el "Trabada PL + Trisílaba" de la especificación es el esfuerzo "Trabadas con l (CCV)" y, si aplica, un término de sonoridad). Se etiqueta solo el material objetivo. **Obligatorio al menos uno** (3.5). |

La dificultad va en field_activity_level (Level0 a Level10); el esfuerzo la describe pero no la
sustituye.

**Qué registra.** Bundles `lograpidrepetition` y `summary_rapid_repetition`. Un log por palabra:
`field_item` = la palabra, `field_weight` = posición, `field_repetitions` = toques de la ronda,
`field_time` = ms reales de la ronda. En el summary, `field_repetitions` = suma y `field_time` =
suma. **Sin `field_correct_count` ni `field_items_count`** en ninguno de los dos: el freno por
aciertos del evaluador (level-system.md 5.5) solo mira esos campos y este tipo no tiene noción de
acierto. Ritmo (derivado, nunca almacenado) = `field_repetitions / (field_time / 1000)`, con un
decimal y coma decimal en pantalla ("0,8 por segundo").

**Clave `contenido` del lote** (`RapidRepetitionActivityHandler`, prefijo REP): `palabras` (lista de
al menos 4 textos; solo letras del castellano y del catalán (tildes, ñ, ü, ï, ç, l·l y apóstrofo), de
1 a 30 caracteres, sin espacios ni HTML, sin repetidas ignorando mayúsculas), `segundos` (entero de 5 a 60) y, opcionales y **no guardados**,
`desglose_tipos` (una entrada por palabra con los papeles de `BlinkActivityHandler::BREAKDOWN`) y
`grupo_fonetico_objetivo` (texto). Clave desconocida = error. Además el registro exige al menos una
de las claves `sonoridad` o `esfuerzo` (`requiresPhonologyTags()`); los demás tipos no la exigen.

**Parámetros por nivel** (a validar por el equipo terapéutico).

| Nivel | Palabras | Segundos por palabra | Material (tabla 2.3) |
|---|---|---|---|
| Level0 | 4 | 10 | Bisílabas CV muy frecuentes (mano, pato); el tutor modela la palabra antes de empezar |
| Level1 y Level2 | 5 | 10 | Inversas y mixtas; trabadas CCV en Level2 (plato, globo) |
| Level3 | 5 | 15 | Complejas e hiatos, 3 a 4 sílabas |
| Level4 a Level6 | 5 a 6 | 15 | 4 a 5 sílabas; una o dos pseudopalabras |
| Level7 a Level10 | 6 | 20 | Polisílabas y vocabulario académico; dos pseudopalabras |

Duración objetivo: unos 2 minutos por actividad (5 palabras × 15 s más pausas).

**Validación.** Palabras pronunciables y del nivel (léxico 4.2); las pseudopalabras, legales en
español; sin repetidas; que la palabra quepa en grande en un móvil (la app reduce la fuente hasta
los 18 px, pero más de unos 12 caracteres ya se lee peor).

**Cómo generarlo.** Elegir el grupo objetivo (estructura silábica y, si procede, sonoridad), tomar
del léxico las palabras del nivel que lo cumplan y fijar los segundos de la tabla. Es el tipo más
sencillo de generar después de la matriz: no necesita silabeo ni frases. Si lleva palabras de
alivio, van intercaladas al azar, no al final (regla de colocación de 5.3).

**En catalán.** Palabras y pseudopalabras catalanas elegidas por estructura silábica, con los
términos catalanes de esfuerzo y sonoridad: en Level0 bisílabas CV muy frecuentes y concretas
para un niño de 5 años (mapa, moto, sopa, pala, nina, pila; el experto retiró sala y dona); en Level1 las codas finales muy frecuentes del catalán (gat, sol, cap, pa) y las
inversas; en Level2 trabadas (plat, globus, tren) y dígrafos complejos (cotxe, metge). Las
pseudopalabras, pronunciables con la fonotaxis catalana y que no sean palabra en ninguno de los dos
idiomas. El importador admite ç, l·l, diéresis y apóstrofo en `palabras`.

**Ejemplo.** Lote `shine/content/fase16-ejemplos-v1.json` (3 actividades Level0 a Level2, 4 o 5
palabras, 10 s):

| Clave | Valor |
|---|---|
| codigo | REP-L00-VEL-001 |
| titulo | Repite rápido: palabras con m y p |
| area_principal | Rendimiento y Velocidad de Procesamiento |
| area_secundaria | Competencia Lingüística y Fonológica |
| niveles | Level0 |
| sonoridad / esfuerzo | m, p / Directas iniciales (CV) |
| contenido.palabras | mano, mapa, pato, pipa |
| contenido.segundos | 10 |

---

## 7. Cobertura de áreas

| Área | Tipos que la tienen como principal | Niveles cubiertos | Actividades publicadas hoy |
|---|---|---|---|
| Competencia Lingüística y Fonológica | Lista de texto (decodificación), reordenamiento de sílabas, segmentación léxica | 0 a 10 (segmentación desde 1) | 1 (A2) + 4 del lote de ejemplo de la FASE 13 (SIL L0 y L2, SEG L1 y L2) |
| Rendimiento y Velocidad de Procesamiento | Parpadeo, lista de texto (velocidad), lectura en voz alta, repetición rápida de palabra | 0 a 10 (lectura desde 1) | 24 (A1, las 20 de content/blink-level0-2-v1.json y las 3 de content/fase16-ejemplos-v1.json: 9, 8 y 7 en Level0 a Level2) |
| Memoria de Trabajo (Auditiva y Visual) | Posición de imágenes | 0 a 10 | 1 (A3) |
| Funciones Ejecutivas y Atención | Ninguno; secundaria de la matriz, la posición de imágenes y la repetición rápida (E10.4, 2026-10-29); en desarrollo: matriz con regla (6.1) | Ninguno | 0 |
| Procesos Perceptivos (Discriminación Visual y Auditiva) | Matriz | 0 a 10 | 3 del lote de ejemplo de la FASE 13 (MAT L0, L1 y L2) |

Cobertura por idioma a 2026-10-26 (publicadas, sin ciclo, Level0 / Level1 / Level2), tras los
lotes bilingües de matriz y posición de imágenes y los catalanes del subplan 05: en castellano,
Lingüística 2 / 1 / 2, Memoria 4 / 3 / 3, Perceptivos 5 / 4 / 4, Velocidad 8 / 8 / 7; en catalán,
Lingüística 3 / 6 / 6, Memoria 4 / 3 / 3, Perceptivos 4 / 3 / 3 (la matriz de l·l pasó a Level3 el
2026-10-27), Velocidad 10 / 13 / 11, más las 44 del ciclo Síl·labes. Funciones Ejecutivas sigue en 0 en los dos idiomas. El catalán cumple el mínimo
de apertura del subplan 05 (3 por celda) en las cuatro áreas con tipo; ningún idioma llega al mínimo
de régimen de 3.3 (6 por celda). La tabla de arriba es la foto castellana anterior a la FASE 18.

Con el lote de ejemplo de la FASE 13, Procesos Perceptivos ya tiene Level0 (el bloque inicial deja
de omitirla); sigue faltando Funciones Ejecutivas y Atención, que necesita la variante con regla de
la matriz o alguno de los ejercicios que quedan fuera de este documento (instrucciones encadenadas).
El contenido de ejemplo es de prueba: una actividad por celda, pendiente de revisión terapéutica.

Fuera de alcance de este documento quedan los otros siete ejercicios del docx "ejercicios -
tipo.docx", previstos para v1.1: 7.1 segmentación silábica, 7.2 omisión silábica, 7.3 intruso
rímico, 7.4 dictado de pseudopalabras, 7.7 ortografía con código de colores, 7.9 dictado inverso y
7.10 instrucciones encadenadas. El léxico con silabeo, el inventario silábico y el formato de
especificación de este documento les sirven igual.

---

## 8. Decisiones pendientes y hallazgos

| Tema | Situación | Propuesta |
|---|---|---|
| Escala de 11 niveles | Drupal tiene 3 términos con otra escala (2.5). | Crear Level3 a Level10, reetiquetar y reiniciar usuarios de prueba. |
| Ritmo del bloque inicial | Con un peldaño por sesión y 4 sesiones, el bloque acaba como mucho en Level3 (2.5). | Saltos de 2 niveles con "Demasiado fácil" dentro del bloque inicial (Level0, Level2, Level4...) y vuelta de 1 con "Me ha costado", o subir initial_max_sessions. Requiere cambiar SessionEvaluator y la sección 5.1 de level-system.md. |
| Significado de field_seconds | Ningún componente lo lee; A1 y A2 tienen valores sin criterio común. | Segundos por elemento en lista y parpadeo; tiempo total en lectura en voz alta. Fijarlo antes de generar en masa. |
| Lectura en voz alta | Resuelto el 2026-10-27: valor permitido, handler LIS/LEC y player con desplazamiento (5.1 y 5.2). | Generar los lotes. |
| Parpadeo | El plan prevé avance automático cada field_seconds; hoy avanza al tocar. | Decidir si se implementa; afecta al significado de field_seconds. |
| Ciclo Sílabas | El vocabulario activity_cycle está vacío. | Crear el término en cada entorno y cargar el inventario de 5.3. |
| Etiquetado fonológico | Vocabularios, términos y campos creados (3.5). Etiquetadas las 20 del primer lote de parpadeo; A1 y A2 (de prueba) no. | Que el generador de contenido rellene sonoridad y esfuerzo desde la especificación (4.3). |
| Área sin contenido | Funciones Ejecutivas y Atención no tiene ningún tipo como principal. | Matriz con regla (6.1). |
| Modelos de 13a, 13b y 13c | Implementados el 2026-10-21 (sección 6). | Generar lotes reales por nivel; la variante de matriz "con regla" para Funciones Ejecutivas sigue pendiente. |
| Comando de importación | shine-content:import importa activity_blink, los tres tipos de la FASE 13 y activity_rapid_repetition. Desde el 2026-10-21 detecta duplicados por huella y solapamiento, y shine-content:inventory da la lista de exclusión (4.4). | Falta el handler de activity (lista y lectura en voz alta); al escribirlo, definir su forma canónica y sus unidades (3.4). |
| Modelo de 16a | Implementado el 2026-10-21 (6.4), con lote de ejemplo pendiente de revisión terapéutica. | Lotes reales por nivel (Level3 a Level10 cuando exista la escala). |
| Mensajes de motivación | La app no filtra por tipo (A6). | Un mensaje como mínimo por cada tipo nuevo en field_activity_types. |
| Colocación del alivio | En las 20 actividades del primer lote de parpadeo los elementos de alivio van siempre en las dos últimas posiciones (hallazgo del 2026-10-21). | El generador los intercala en posiciones aleatorias (regla de 5.3, también para 6.4 y 5.1). Añadir a BlinkActivityHandler y RapidRepetitionActivityHandler un aviso cuando todos los alivio de desglose_tipos estén al final. |
| Contenido catalán | Subplan 05 de plans/multiidioma (2026-10-26): catálogo, taxonomía y guía de parametrización catalanas, términos por idioma, bloque ca del manifiesto del banco, ciclo Síl·labes y primeros lotes de Level0 a Level2 (convenciones y prompts en plans/multiidioma/prompts-contenido/). | Level3 en adelante cuando existan los términos de activity_level (2.5); lista de texto y lectura en voz alta cuando exista el handler de activity; revisión del experto de cada lote (muestra del 10 %) antes de publicar en producción. |
| Elementos repetidos en el ciclo | Cerrada el 2026-10-27 por el experto: una sílaba por pantalla. BlinkActivityHandler admite repetidos que no vayan seguidos y el ciclo catalán se rehízo (5.3). | Cargar el ciclo castellano con la misma regla. |
| Enclíticos con guion | La segmentación no admite el guion (dona-m’ho); el experto lo acepta como solución temporal (6.3). | Admitir el guion en WordSplitActivityHandler antes de los lotes de Level6 en adelante. |
