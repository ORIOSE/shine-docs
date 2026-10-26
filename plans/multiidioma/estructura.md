# Estructura actual de Shine (castellano) para trabajar su equivalencia en catalán

Documento de trabajo para el experto en lectura y dislexia que va a definir el catalán. Describe,
tal como existe hoy en el sistema, cómo se organizan las áreas de trabajo, la escala de niveles,
los tipos de ejercicio y los dos vocabularios fonológicos (sonoridad y esfuerzo de decodificación),
y deja en cada apartado las columnas o tablas que hay que rellenar para el catalán. Lo que se
rellene aquí se importa después en la plataforma sin reinterpretarlo, así que conviene respetar
el formato.

Estado a 2026-10-26. Fuente: la base de datos de Shine y docs/exercise-catalog.md.

**Respuesta del experto**: entregada el 2026-10-26 en plans/multiidioma/Shine en Catalán.md
(apartados 1 a 8). La versión normalizada que usa el equipo técnico (nombres definitivos de
términos, ciclo con pesos, nivel mínimo y preguntas abiertas) está en
plans/multiidioma/estructura-ca.md. El CSV del apartado 9 lo ha rellenado Fable como borrador
(apartado 9.1), validado por el experto el 2026-10-26 (plans/multiidioma/resposta-estructura-ca.md).

---

## 0. Cómo usar este documento

- **Las columnas "catalán" están vacías a propósito.** Se rellenan en este mismo fichero (o en
  una copia en Google Docs con las mismas tablas).
- **Los nombres en castellano son claves del sistema**: no se cambian ni se traducen en su
  columna. El catalán va siempre en su propia columna o tabla.
- **Equivalencia no es traducción.** En las áreas y los tipos de ejercicio sí basta con
  traducir. En los vocabularios fonológicos (apartados 5 y 6) la pregunta es otra: qué grupos y
  qué términos necesita el catalán. Un término castellano puede no tener equivalente ("no
  aplica"), un término catalán puede no existir en castellano (se añade una fila nueva) y un
  grupo puede tener distinto número de términos. La única restricción es la forma: dos niveles
  (grupo y término concreto), nombres cortos y únicos dentro de cada vocabulario, y una
  descripción con letras, ejemplos y motivo clínico por término.
- **Las pistas marcadas "a confirmar"** son sugerencias nuestras sobre el catalán para que el
  experto las valide, corrija o descarte. No son decisiones.
- Entregables: este documento relleno, el fichero banco-imagenes-equivalencia-ca.csv (apartado 9)
  relleno y, si se considera, la lista ordenada de sílabas del ciclo catalán (apartado 4).

---

## 1. Áreas de trabajo

Cinco áreas, universales. Cada actividad tiene una área principal (decide en qué hueco de la
sesión entra y qué nivel se le aplica) y, opcionalmente, una secundaria (solo alimenta el gráfico
radial de progreso). El nivel del alumno se lleva por área, no por persona.

| Nombre en castellano (clave) | Qué entrena y tipos de ejercicio que la trabajan | Nombre en catalán |
|---|---|---|
| Competencia Lingüística y Fonológica | Decodificación, conciencia silábica y léxica: lista de texto, reordenamiento de sílabas, segmentación léxica; secundaria de la repetición rápida | |
| Rendimiento y Velocidad de Procesamiento | Fluidez y automatización: parpadeo, lectura en voz alta, repetición rápida; también lista de texto | |
| Memoria de Trabajo (Auditiva y Visual) | Memoria visoespacial y operativa: posición de imágenes; secundaria del reordenamiento de sílabas | |
| Funciones Ejecutivas y Atención | Atención sostenida y selectiva: secundaria de la matriz y de la posición de imágenes | |
| Procesos Perceptivos (Discriminación Visual y Auditiva) | Discriminación de letras parecidas: matriz de discriminación visual | |

---

## 2. Escala de niveles

### 2.1 Qué es un nivel

- El nivel n equivale a la edad de referencia 5 + n años (Level0 = 5 años, Level10 = 15 años), un
  curso escolar por nivel. **Esta escala es común a los dos idiomas** y no se traduce.
- Criterio para etiquetar una actividad en el nivel n: un niño de 5 + n años sin dificultades la
  valoraría "Bien así" (ni "Demasiado fácil" ni "Me ha costado").
- Todo alumno empieza en Level0 en todas las áreas y sube con evidencia. La escala es interna:
  nunca se muestra al usuario como "edad lectora".

### 2.2 Perfil lector de referencia por nivel

Lo que describe cada nivel sí depende del idioma. La columna catalana es la que hay que escribir.

| Nivel | Edad y curso | Perfil lector en castellano (actual) | Perfil lector en catalán |
|---|---|---|---|
| Level0 | 5 años, 3.º de Infantil | Conoce las vocales y algunas consonantes. Lee sílabas directas simples (ma, pa, lo) y alguna palabra bisílaba muy familiar. Conciencia silábica emergente. | |
| Level1 | 6 años, 1.º de Primaria | Todas las sílabas directas, inversas (al, en) y mixtas (sol), diptongos frecuentes. Palabras de 2 y 3 sílabas y frases muy cortas. | |
| Level2 | 7 años, 2.º | Sílabas trabadas (pla, bra, tre) y grafías como gue, gui, güe. Frases de 4 a 6 palabras y textos breves. | |
| Level3 | 8 años, 3.º | Domina todas las estructuras silábicas, incluidas las complejas (ins, cons, trans) y los hiatos. Lee párrafos cortos. | |
| Level4 | 9 años, 4.º | Decodificación automatizada en palabras frecuentes. A partir de aquí la dificultad está en la longitud, la frecuencia y la velocidad. | |
| Level5 | 10 años, 5.º | Lectura fluida de textos narrativos. Vocabulario de frecuencia media. | |
| Level6 | 11 años, 6.º | Palabras poco frecuentes y compuestas. Frases con subordinadas. | |
| Level7 | 12 años, 1.º de ESO | Textos expositivos y vocabulario académico básico. | |
| Level8 | 13 años, 2.º de ESO | Textos largos con tecnicismos frecuentes. | |
| Level9 | 14 años, 3.º de ESO | Vocabulario técnico y frases largas con varias subordinadas. | |
| Level10 | 15 años, 4.º de ESO | Lectura funcional de cualquier texto general. | |

### 2.3 Referencias lingüísticas por nivel

Es la tabla que usan todos los generadores de contenido para decidir qué puede entrar en cada
nivel. Las cifras son máximos: una actividad de un nivel puede usar material de niveles
inferiores, nunca superiores. V = vocal, C = consonante (CV = ma, VC = al, CVC = sol, CCV = pla,
CCVC = tren).

Castellano (actual):

| Nivel | Estructuras silábicas admitidas | Sílabas por palabra | Frecuencia (rango máximo del léxico) | Palabras por frase | Palabras por texto | Velocidad de referencia (palabras por minuto en voz alta) |
|---|---|---|---|---|---|---|
| Level0 | V y CV con m, p, l, s, t, n, d | 1 a 2 | 500 más frecuentes | no aplica | no aplica | no aplica |
| Level1 | Todas las CV (incluidas c/qu, g/gu, r/rr, ch, ll, ñ, z), VC, CVC, diptongos frecuentes | 2 a 3 | 1.000 | 3 a 5 | 30 a 50 | 30 a 50 |
| Level2 | + CCV con l y r, CCVC, gue/gui/güe/güi | 2 a 3 | 2.000 | 4 a 6 | 50 a 70 | 50 a 70 |
| Level3 | + VCC y CVCC (ins, cons, trans), hiatos | 3 a 4 | 3.000 | 6 a 8 | 70 a 90 | 70 a 90 |
| Level4 | Todas | 3 a 4 | 5.000 | 7 a 10 | 130 a 160 | 90 a 110 |
| Level5 | Todas | 3 a 5 | 7.000 | 8 a 12 | 150 a 180 | 100 a 120 |
| Level6 | Todas | 4 a 5 | 10.000 | 10 a 14 | 165 a 195 | 110 a 130 |
| Level7 | Todas | 4 a 6 | 15.000 | 12 a 16 | 240 a 280 | 120 a 140 |
| Level8 | Todas | 4 a 6 | 20.000 | 14 a 18 | 260 a 300 | 130 a 150 |
| Level9 | Todas | 5 a 7 | Sin límite | 16 a 20 | 280 a 320 | 140 a 160 |
| Level10 | Todas | 5 a 7 o más | Sin límite | 18 a 25 | 300 a 340 | 150 a 170 |

Catalán (a rellenar; dejar la celda igual si no cambia):

| Nivel | Estructuras silábicas admitidas | Sílabas por palabra | Frecuencia | Palabras por frase | Palabras por texto | Velocidad de referencia |
|---|---|---|---|---|---|---|
| Level0 | | | | | | |
| Level1 | | | | | | |
| Level2 | | | | | | |
| Level3 | | | | | | |
| Level4 | | | | | | |
| Level5 | | | | | | |
| Level6 | | | | | | |
| Level7 | | | | | | |
| Level8 | | | | | | |
| Level9 | | | | | | |
| Level10 | | | | | | |

Pistas a confirmar para el catalán: la ortografía es menos transparente que la castellana (vocal
neutra en a y e átonas y o átona que suena u en catalán central; e y o abiertas y cerradas),
las consonantes finales son muy frecuentes (pa, sol, gat, cap, peix: la estructura CVC aparece
mucho antes), hay dígrafos propios (ny, ll, l·l, ix, tx, tg, tj, ig, ss, rr, gu, qu), apóstrofo y
contracciones (l'avi, d'un, al, del, pel), acentos abiertos y cerrados y diéresis (ï, ü). Todo
ello suele retrasar el momento en que la decodificación queda completa respecto al castellano
(Level3 en la tabla castellana) y pide una columna de estructuras distinta en Level1 a Level3.
También conviene indicar qué fuente de frecuencias léxicas se usará en catalán.

---

## 3. Tipos de ejercicio

Ocho tipos. La mecánica y la aplicación son idénticas en los dos idiomas; lo que cambia es el
material. "Compartible" indica si una misma actividad puede valer para los dos idiomas tal cual.

| Tipo (clave) | Mecánica | Área principal por defecto | Material | ¿Compartible es/ca? | Qué hay que definir para el catalán |
|---|---|---|---|---|---|
| Lista de texto (activity, formato vertical_list) | Lectura ítem a ítem con avance al tocar; mide el tiempo por ítem | Competencia Lingüística o Velocidad | Sílabas, pseudopalabras y palabras del léxico, con un 25 a 30 % de ítems de alivio | No | Léxico catalán por nivel, pseudopalabras con fonotaxis catalana, qué cuenta como alivio |
| Lectura en voz alta (activity, formato audio_reading) | Lectura de un párrafo con cronómetro y grabación | Velocidad | Un párrafo redactado con las restricciones del nivel | No | Textos catalanes por nivel (no se traducen: cambian longitud, frecuencia y sintaxis) |
| Parpadeo (activity_blink) | Cada elemento aparece unos segundos y desaparece; sílabas y grupos de letras | Velocidad | Inventario silábico, pseudopalabras, palabras | Parcialmente: sílabas directas universales (ma me mi mo mu...), revisadas una a una | Inventario silábico catalán por nivel; sílabas que suenan distinto (ce, ci, ge, gi, vocales átonas); alivio catalán |
| Posición de imágenes (activity_image_position) | Memorizar la posición de varias imágenes y responder "¿en qué posición estaba?" leyendo el nombre | Memoria de Trabajo | Ilustraciones del banco con su nombre escrito | La imagen sí; el nombre no | Nombres catalanes del banco (apartado 9); en Level0 y Level1 solo nombres fáciles de leer en catalán |
| Matriz de discriminación visual (activity_letter_matrix) | Cuadrícula de letras, sílabas o palabras parecidas; tocar todas las apariciones del objetivo, con tiempo | Procesos Perceptivos | Letras espejo (b d p q, n u, m w), sílabas y palabras confundibles | Sí para letras y sílabas universales; no con ç, l·l, ny, ix o palabras | Confusiones visuales y silábicas propias del catalán (si las hay además de las universales) |
| Reordenamiento de sílabas (activity_syllable_order) | Formar una palabra tocando sus sílabas desordenadas; sílabas sobrantes en niveles altos; imagen de pista opcional | Competencia Lingüística | Palabras con silabeo explícito (pan-ta-lón) | No | Léxico catalán con silabeo según las reglas catalanas (dígrafos, l·l, diptongos, hiatos) |
| Segmentación léxica (activity_word_split) | Frase sin espacios; tocar donde empieza cada palabra | Competencia Lingüística | Frases en minúsculas sin signos | No | Frases catalanas; decidir qué hacer con apóstrofos y contracciones (l'avi: ¿una palabra o dos?) |
| Repetición rápida de palabra (activity_rapid_repetition) | La palabra se muestra, se oculta y el niño la repite en voz alta tantas veces como pueda en N segundos; el tutor cuenta | Velocidad | Palabras y pseudopalabras agrupadas por estructura silábica | No | Palabras catalanas por estructura (trabadas, dígrafos...) y pseudopalabras |

Cada tipo lleva además un mensaje de explicación (texto que ve el tutor en la intro, hoy en
castellano, uno por tipo) y uno o varios mensajes de motivación al terminar. Se traducen en la
plataforma; no hace falta hacerlo aquí.

---

## 4. Ciclo obligatorio de sílabas

Además de los huecos por área, cada sesión regular incluye una actividad de un recorrido
obligatorio de sílabas ordenado por peso (de más fácil a más difícil), que no depende del nivel
del alumno: avanza una actividad por sesión. Hoy existe un solo ciclo, "Sílabas", con actividades
de parpadeo en castellano.

Para el catalán hace falta el mismo recorrido con su propio inventario, en orden. A rellenar:

| Orden | Grupo de sílabas (ejemplos) | Observaciones (por qué este orden, nivel orientativo) |
|---|---|---|
| 1 | | |
| 2 | | |
| ... | | |

Nombre del ciclo en catalán: __________

---

## 5. Sonoridad (vocabulario "sonority")

Describe **cómo suenan** las letras y pares que trabaja una actividad (discriminación acústica y
fonoarticulatoria). Dos niveles: grupo y término concreto. Las actividades se etiquetan siempre
con términos concretos, nunca con el grupo; si recorren un grupo entero, con todos sus términos.

Para el catalán: en cada grupo, decir si se mantiene, se cambia o no aplica, y rellenar los
términos catalanes con su descripción (letras, ejemplos, motivo clínico). Añadir filas si hacen
falta. Pistas a confirmar al final de cada grupo.

### 5.1 Grupo "Consonantes continuas"

Descripción actual: prolongables, el sonido se puede alargar sin cortar el aire (mmmiel), igual
que las vocales. Son las más fáciles para empezar la estimulación fonológica porque permiten
aislar el sonido inicial.

| Término castellano | Descripción actual | Término catalán | Descripción catalana (letras, ejemplos, motivo) |
|---|---|---|---|
| m | | | |
| l | | | |
| s | | | |
| f | | | |
| n | | | |
| r | | | |
| j | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: en catalán la j no es la fricativa velar castellana sino una fricativa
palatal sonora (jardí), y puede que la lista de continuas deba incluir también la s sonora, la x
o ix (caixa) y la ll y ny como nasales y laterales palatales prolongables.

### 5.2 Grupo "Consonantes oclusivas"

Descripción actual: discontinuas, breves o explosivas; interrumpen el aire y no se pueden
alargar. Piden más precisión auditiva para captarlas aisladas.

| Término castellano | Descripción actual | Término catalán | Descripción catalana |
|---|---|---|---|
| p | | | |
| t | | | |
| b | | | |
| d | | | |
| c | | | |
| k | | | |
| q | | | |
| g | | | |
| ch | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: ch no existe como tal en catalán; las africadas se escriben tx (cotxe), tg
y tj (metge, platja) e ig en final (boig).

### 5.3 Grupo "Oposición sorda/sonora"

Descripción actual: pares que se articulan en el mismo punto de la boca y solo se diferencian en
si vibran o no las cuerdas vocales. Causa frecuente de sustituciones fonéticas.

| Término castellano | Descripción actual | Término catalán | Descripción catalana |
|---|---|---|---|
| p/b | Oclusivas bilabiales: /p/ sorda, /b/ sonora. | | |
| t/d | Oclusivas dentales: /t/ sorda, /d/ sonora. | | |
| k/g | Velares: /k/ (c, k, q) sorda, /g/ (g, gu) sonora. | | |
| f/v | Fricativa labiodental /f/ sorda frente a /b/ (b, v) sonora. | | |
| (nuevo) | | | |
| (nuevo) | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: el catalán tiene pares sordo/sonoro que el castellano no distingue: s sorda y
s sonora (caça y casa; ss, c, ç, s frente a s intervocálica y z), x y j o g (xoc, joc; caixa,
Egipte), tx y tg o tj. En cambio, la oposición f/v puede ser menos relevante en catalán central,
donde b y v suenan igual.

### 5.4 Grupo "Inconsistencias grafema-fonema"

Descripción actual: grupos homófonos, letras distintas que representan el mismo sonido.
Confunden la ruta fonológica y la ortográfica.

| Término castellano | Descripción actual | Término catalán | Descripción catalana |
|---|---|---|---|
| s/z/c | Sibilante e interdental: sapo, zapato, cine. | | |
| k/q/c | Velar: kilo, queso, casa. | | |
| ll/y | Palatal: llave, yema. | | |
| g/j | Velar fricativa: gente, jarrón. | | |
| (nuevo) | | | |
| (nuevo) | | | |
| (nuevo) | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: en catalán los grupos homófonos probables son s, ss, c, ç y z para la
sibilante (sol, passa, cel, caça, zero); g y j para la palatal sonora (girafa, jersei); x e ix
para la palatal sorda (xocolata, caixa); b y v (en catalán central); c, qu y k; l·l y l (col·legi
frente a color); h muda; ll e y no son homófonas en catalán (la y apenas existe).

---

## 6. Esfuerzo de decodificación (vocabulario "decoding_effort")

Describe el **esfuerzo de procesamiento** del material: estructura silábica, carga de memoria y
esfuerzo perceptivo. Dos niveles, como la sonoridad. El esfuerzo no sustituye al nivel (tiene
cuatro tramos y la escala de niveles tiene once): describe el material.

### 6.1 Grupo "Esfuerzo bajo"

Descripción actual: estructuras directas simples y de alta frecuencia. Ejemplos: ma, pa, lo,
se, tu, na; sopa, pato, mesa, mano.

| Término castellano | Descripción actual | Término catalán | Descripción catalana |
|---|---|---|---|
| Vocal aislada (V) | a, e, i, o, u. | | |
| Directas iniciales (CV) | Consonante + vocal con m, p, l, s, t, n, d. | | |
| (nuevo) | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: el catalán tiene más vocales que letras vocálicas (vocal neutra, e y o
abiertas y cerradas); quizá "vocal aislada" deba desglosarse o acompañarse de un término para
las vocales átonas.

### 6.2 Grupo "Esfuerzo medio"

Descripción actual: directas con consonantes complejas o inconsistentes, inversas y mixtas.
Ejemplos: sol, árbol, huevo, pelota, franja.

| Término castellano | Descripción actual | Término catalán | Descripción catalana |
|---|---|---|---|
| Directas resto (CV) | Consonante + vocal con f, b/v, r, rr, ñ, ch, ll/y, j, z/ce/ci, c/qu, g/gu, güe/güi, h, x. | | |
| Inversas (VC) | Vocal + consonante. Con l: al, el, il, ol, ul. Con n: an, en, in, on, un. Con s: as, es, is, os, us. Con r: ar, er, ir, or, ur. | | |
| Mixtas (CVC) | Consonante + vocal + consonante: sol, árbol. | | |
| (nuevo) | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: los dígrafos (ny, ll, l·l, ix, tx, ig, gu, qu) probablemente merecen su
propio término; las consonantes finales (CVC) son tan frecuentes en catalán que quizá bajen de
tramo o se desglosen (final en s, en t, en x o ix, en ny, en ig).

### 6.3 Grupo "Esfuerzo alto estructural"

Descripción actual: sílabas trabadas (sinfones) y estructuras complejas. Ejemplos: plato, tren,
playa, trigo, transporte, instante.

| Término castellano | Descripción actual | Término catalán | Descripción catalana |
|---|---|---|---|
| Trabadas con l (CCV) | pl, bl, cl, fl, gl: pla, ble, cli, flo, glu. | | |
| Trabadas con r (CCV) | pr, br, cr, fr, gr, tr, dr: pra, bre, cri, fro, tru, tra, dri. | | |
| Complejas (CCVC, VCC, CVCC) | plan, tras, ins, cons, trans. | | |
| (nuevo) | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: en catalán son habituales los grupos consonánticos finales (CVCC: parcs,
temps, forts) y las palabras monosílabas con coda compleja; el apóstrofo y las contracciones
(l'home, d'aigua, al, del) son una dificultad propia de la segmentación que no encaja en
ninguna estructura silábica y puede merecer término propio.

### 6.4 Grupo "Esfuerzo alto perceptivo"

Descripción actual: letras espejo y rotaciones; comparten rasgos gráficos y solo cambia la
orientación. Suben el esfuerzo atencional y perceptivo sea cual sea la estructura silábica.

| Término castellano | Descripción actual | Término catalán | Descripción catalana |
|---|---|---|---|
| Espejo b-d | Reversibilidad horizontal. | | |
| Espejo p-q | Reversibilidad horizontal. | | |
| Espejo b-p | Reversibilidad vertical. | | |
| Espejo d-q | Reversibilidad vertical. | | |
| Rotación n-u | Giro de 180 grados. | | |
| Rotación m-w | Giro de 180 grados. | | |
| (nuevo) | | | |

Grupo en catalán: nombre __________ ; se mantiene / cambia / no aplica: __________

Pistas a confirmar: este grupo es casi seguro idéntico (es gráfico, no fonológico). Cabe añadir
confusiones propias de la grafía catalana: l·l frente a ll, ç frente a c, ï y ü frente a i y u,
acento abierto frente a cerrado.

---

## 7. Nivel mínimo en que aparece cada estructura

Vincula el esfuerzo con la escala de niveles: el generador de contenido no mete una estructura
antes del nivel indicado. Rellenar la columna catalana con los términos catalanes de 6.

| Término de esfuerzo (castellano) | Nivel mínimo (castellano) | Término catalán | Nivel mínimo (catalán) |
|---|---|---|---|
| Vocal aislada (V), Directas iniciales (CV) | Level0 | | |
| Directas resto (CV), Inversas (VC), Mixtas (CVC) | Level1 | | |
| Trabadas con l (CCV), Trabadas con r (CCV) | Level2 | | |
| Complejas: CCVC | Level2 | | |
| Complejas: VCC y CVCC | Level3 | | |
| Espejo y rotaciones | Cualquiera (no depende de la estructura) | | |

---

## 8. Reglas de etiquetado (iguales en los dos idiomas)

- Se etiquetan términos concretos, nunca grupos. Si la actividad recorre un grupo entero, se
  marcan todos sus términos.
- Varios valores cuando se mezcla material: "pa ba ta da" lleva p/b y t/d en sonoridad, y
  Directas iniciales y Directas resto en esfuerzo.
- Se etiqueta el material objetivo, no los elementos de alivio.
- Los nombres de los términos son únicos dentro de su vocabulario y son la clave con la que los
  lotes de contenido los referencian: una vez importados, cambiarlos obliga a reescribir lotes.

---

## 9. Banco de imágenes

Hay 432 ilustraciones (animales, comida, casa, cuerpo, naturaleza, vehículos, personajes...)
que valen para los dos idiomas tal cual: no llevan texto y representan un objeto inequívoco.
Lo que cambia es la ficha de cada palabra. El fichero banco-imagenes-equivalencia-ca.csv
(separado por punto y coma; se abre en Excel, Numbers o Google Sheets) tiene una fila por
imagen con la ficha castellana y las columnas catalanas vacías:

| Columna | Qué poner |
|---|---|
| nombre_ca | La palabra que diría un niño al ver la imagen, en minúsculas y singular (salvo plurales fijos como les ulleres). Si no hay una palabra única y clara, dejar vacío y poner usable_ca = no |
| articulo_ca | el, la, l', els, les |
| silabas_ca | La palabra con las sílabas separadas por guion según las reglas catalanas (pan-ta-ló); los dígrafos no se parten salvo donde la norma lo marque (l·l, rr, ss, ix según el caso) |
| lectura_ca | Nivel lector orientativo de la palabra en catalán, con la escala de 2.3 catalana (L0, L1, L2, L3, L5), una vez definida |
| grupos_fon_ca | Grupos para hacer parejas: misma sílaba inicial (fon:pa-), pares mínimos, letras espejo en el nombre (espejo:b). Mismo formato que la columna castellana |
| usable_ca | sí o no. "No" cuando el nombre catalán es ambiguo, compuesto, poco frecuente para un niño o coincide con el de otra imagen del banco |
| observaciones | Lo que haga falta: alternativas de nombre, parejas que dejan de serlo, sugerencias de palabras nuevas que convendría ilustrar |

### 9.1 Criterios del CSV (Fable, 2026-10-26; validado por el experto el mismo día)

Criterios aplicados en las 432 filas:

- nombre_ca: el nombre más frecuente y natural para un niño de 5 a 7 años, singular y en
  minúsculas (plural solo en plurales fijos: bales, tisores, ulleres, castanyoles, maraques,
  pantalons, macarrons, crispetes). Si el nombre catalán tiene varias palabras o guion (gall
  dindi, blat de moro, arc de Sant Martí, gira-sol, io-io) o coincide con el de otra imagen
  (pilota, bossa, clau, cargol), usable_ca = no y la alternativa va en observaciones. 9 filas.
- articulo_ca: el, la, l', els, les.
- silabas_ca: silabeo normativo del IEC. No se parten ny, ll, qu, gu ni ig final; se parten rr,
  ss, tx, tg, tj y la ela geminada (col-le-gi, con el guion en lugar del punto volado); en ix la
  i queda con la vocal anterior (cai-xa). La nota del experto decía mantener tx unido; se ha
  seguido el IEC (cot-xe, pet-xi-na) y queda como pregunta.
- lectura_ca: calculado con la tabla 2.3 catalana del experto a partir de las sílabas: L0 solo
  V y CV con m, p, l, s, t, n, d y 1 o 2 sílabas; L1 el resto de CV, VC, CVC, diptongos, ç, ny,
  ll, ss, rr, que/qui y hasta 3 sílabas; L2 trabadas (CCV, CCVC), tx, ig, tg, tj, ix, gue/gui y
  diéresis y, por decisión del experto, los monosílabos muy frecuentes con coda final simple
  (nt, rt, st, mp, rc, rp, rn, lp, nc: dent, pont, font, porc, serp, forn, guant, talp, llamp,
  cranc, tronc); L3 el resto de codas complejas (VCC, CVCC: elefant, temps), ela geminada, hiatos
  (pi-a-no, lle-ó, a-vi-ó) y 4 sílabas; L5 cinco sílabas. Los acentos no cambian el nivel.
  Resultado: 22 L0, 248 L1, 89 L2, 64 L3 y 4 L5.
- grupos_fon_ca, generado del nombre catalán: fon:xx- cuando dos o más imágenes usables
  comparten la primera sílaba (sin acentos) o el grupo consonántico inicial (fon:tr-);
  espejo:b, espejo:d, espejo:p o espejo:q cuando el nombre empieza por esa letra; graf:ll,
  graf:ny, graf:ç, graf:ix, graf:tx, graf:tg, graf:tj, graf:ig, graf:ss, graf:l·l y graf:x
  (x inicial) cuando el nombre lleva esa grafía; sib:sorda o sib:sonora cuando hay una sibilante
  entre vocales (tassa, bossa, ocell frente a casa, rosa, zebra). Los pares mínimos detectados
  (gat/got/gos, llit/llet, tap/tapa, cap/capa/copa, sal/sol, gerra/gerro, os/ós) van en
  observaciones.

Notas: las columnas categoria, subcategoria y etiquetas_visuales son neutras (describen la
imagen) y no se tocan. Las parejas castellanas de parecido fonológico (pato, pala, pan, pino;
casa, taza, cara, copa, capa, cuna) no se trasladan: hay que buscar las catalanas sobre las
mismas imágenes. Si para el catalán faltan imágenes de palabras importantes, se anotan al final
del CSV y se generan después con el mismo estilo.

---

## 10. Formato de entrega y qué pasa después

- Este documento relleno (tablas de 1, 2.2, 2.3, 4, 5, 6 y 7) y el CSV de 9.
- Con ello, el equipo técnico: traduce las áreas y el ciclo en la plataforma, crea los términos
  catalanes de sonoridad y esfuerzo con un script a partir de las tablas 5 y 6 (dos niveles,
  nombre y descripción, en el mismo orden en que estén escritos), incorpora la tabla 2.3 catalana
  al catálogo de ejercicios y el bloque catalán al manifiesto del banco de imágenes, y a partir de
  ahí genera los lotes catalanes tipo a tipo, que vuelven al experto para revisión de una muestra.
- Orden previsto de generación: matriz de letras y posición de imágenes (lo que más se comparte),
  parpadeo de sílabas, y después lo que exige léxico (sílabas, repetición rápida) y redacción
  (segmentación, lista de texto, lectura en voz alta).
