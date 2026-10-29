# Banco de imágenes de Shine: especificación y prompt de generación

Documento de trabajo para generar, con un modelo de imágenes, el banco de ilustraciones que
alimenta la actividad "Posición de imágenes" (node activity_image_position) y la pista opcional
de "Ordena las sílabas" (node activity_syllable_order). Estado a 2026-10-21.


> **Estado a 2026-10-26: banco completo.** Las tres prioridades generadas con Cowork y revisadas:
> 432 imágenes aceptadas de 437 palabras; 5 descartadas tras la revisión visual (mota, suma, tela,
> dama y codo, marcadas DESCARTADA en la tabla; las cuatro primeras eran palabras de apoyo y codo era
> indistinguible de brazo). Ficheros en shine/content/images/ con su manifest.json; hojas de contacto,
> resúmenes y prompts en shine/content/images/_revision/. Importado en Drupal con
> `drush shine-content:import-images` (FASE 18, 02: un media por imagen con name = slug) y, desde el
> 2026-10-26 (FASE 18, 05), el manifiesto lleva en cada entrada el **bloque ca** con la ficha
> catalana validada por el experto (sección 4 y 5.4). Primeros lotes bilingües de posición de
> imágenes: shine/content/imagenes-es-ca-level0-2-v1.json, generado con
> shine/content/generadores/imagenes.py (prompt para lotes nuevos en
> plans/multiidioma/prompts-contenido/02-posicio-imatges.md). Cautelas para montar grupos en 5.7.

> **Lote 2 (2026-10-29, encargo E09)**: 122 imágenes nuevas para los grupos de Level9 y Level10
> (40 imprescindibles en cualquier opción y 82 que solo usa la opción A). Prompt listo para pegar:
> [Banco de imágenes - lote 2 (E09).md](Banco%20de%20imágenes%20-%20lote%202%20(E09).md); fichas en
> shine/content/images/manifest-lote2.json, generadas con shine/content/generadores/imagenes_lote2.py.
> Al recibirlas: posproceso, revisión, fusión en manifest.json y `drush shine-content:import-images`.

Tiene dos partes:

1. **Notas internas** (secciones 1 a 4): de dónde salen las decisiones (tamaños reales del player,
   contrato del importador, nombres) y qué herramienta usar. Son para nosotros.
2. **El prompt** (sección 5 hasta el final): lo que se pega en la herramienta de generación. Es
   autocontenido e incluye la lista de palabras. Se puede pegar entero desde el título "Prompt".

Documentos relacionados: [exercise-catalog.md](../exercise-catalog.md) (sección 4.2 "Banco de
imágenes", 5.4 "Posición de imágenes" y 6.2 "Reordenamiento de sílabas"),
[activity-system.md](../activity-system.md) y [Guía de Parametrización.md](Guía%20de%20Parametrización.md).

---

## 1. Decisiones en una tabla

| Tema | Decisión | Por qué |
|---|---|---|
| Tamaño del fichero final | 512 x 512 píxeles, cuadrado | El player muestra la imagen a 110 x 110 puntos en una tarjeta de 140; en una pantalla 3x son 330 píxeles reales. 512 cubre eso con margen y permite crecer la tarjeta sin regenerar. Más grande solo pesa. |
| Tamaño de generación | 1024 x 1024 y después reducir | Los modelos generan mejor a su tamaño nativo; reducir a la mitad limpia los bordes. |
| Formato | PNG con fondo transparente | La tarjeta del player tiene fondo blanco roto (#F7F5F2) y la pista de sílabas se recorta a 120 x 90 con esquinas redondeadas: con transparencia la imagen se integra en los dos sitios y en cualquier fondo futuro. Drupal admite png, jpg, gif y webp. |
| Fallback si la herramienta no da transparencia | Fondo plano del color exacto #F7F5F2, sin sombra ni degradado | Es el color de fondo del player: visualmente equivale a transparente. |
| Zona segura | El objeto ocupa como mucho el 72 % del alto y el 80 % del ancho, centrado | La pista de sílabas recorta el 12,5 % superior e inferior (120 x 90 con "cover"). Con ese margen no se pierde nada del objeto. |
| Estilo | Ilustración vectorial plana, trazo limpio, colores planos, sin fondo ni escena, un solo objeto | Se parece a un juego infantil-juvenil, se lee en 110 puntos y no hay detalles que distraigan en un ejercicio de memoria. Las fotos tienen fondos y texturas que compiten con el objeto. |
| Una imagen por palabra, nombre del media = la palabra | Media de Drupal con name = "plátano", alt = "plátano", fichero platano.png | El importador de sílabas localiza el media por su nombre exacto y exige que haya uno solo. El nombre es también lo que el niño lee en la pregunta. |
| Herramienta | Script contra la API de imágenes de OpenAI, ejecutado por Codex (o Claude Code), con tres imágenes ancla como referencia de estilo | Reproducible, por lotes, nombres deterministas, se puede regenerar una palabra suelta. El chat de ChatGPT solo para retocar unas pocas. |
| Dónde viven | shine/content/images/{slug}.png y shine/content/images/manifest.json | Los lotes de contenido ya viven en shine/content/; el importador de cada entorno necesita los ficheros. Unos 440 PNG de 512 px pesan entre 20 y 25 MB. |

---

## 2. Dónde se usan las imágenes y qué tamaño necesitan (lo que dice el código)

**Posición de imágenes** (ImageGroupPlayer.tsx):

- Fase memorizar: tarjetas de 140 puntos de ancho en una rejilla que envuelve, con un círculo
  numerado encima y la imagen a 110 x 110 puntos con resizeMode "contain" (se ve entera, sin
  recorte). Fondo de la tarjeta #F7F5F2 con borde fino. Con 6 imágenes por grupo caben dos filas
  de tres en un móvil de 375 puntos.
- Fase pregunta: no se ven las imágenes. Se muestra "¿En qué posición estaba?" y, en grande, el
  texto del campo field_text del ítem (el nombre). **El niño lee el nombre y tiene que recordar la
  imagen**: por eso la ilustración debe evocar exactamente esa palabra y no un sinónimo (si la
  imagen es un cachorro, el niño piensa "perro" solo si la ilustración es claramente un perro).
- Modelo de datos: field_items (paragraphs i1, uno por grupo) con field_position_to_ask y
  field_items (paragraphs i1_item) con field_image (media image, obligatorio) y field_text
  (texto corto, obligatorio). Detalle en exercise-catalog.md 5.4.

**Ordena las sílabas** (SyllableOrderPlayer.tsx):

- La imagen de pista se muestra a 120 x 90 puntos con resizeMode "cover" y radio grande: de una
  imagen cuadrada se ve la franja central (se pierde el 12,5 % por arriba y por abajo). De ahí la
  zona segura del 72 % de alto.
- Modelo: paragraph syllable_word con field_image opcional. En el lote, la clave imagen de cada
  palabra es el **nombre del media** (SyllableOrderActivityHandler::findMedia busca
  bundle image con ese name y falla si hay cero o más de uno). El catálogo pide imagen siempre en
  Level0 a Level2 y como pista en Level3 a Level5.

**Densidad de píxeles**: 110 puntos a 3x son 330 píxeles; 120 a 3x son 360. Un máster de 512
sobra incluso si un día las tarjetas crecen a 160 puntos. No hace falta 1024 en producción.

**Banco actual**: 4 media de tipo image, todos de prueba (image0.jpeg "muy bien", y tres fotos
"descarga.jpeg" con alt mano, pie y cabeza, que usa la actividad A3). Se sustituyen por las
ilustraciones nuevas de mano, pie y cabeza; la actividad A3 se reasigna cuando exista el
importador del tipo.

**Importador**: hoy shine_content no tiene handler para activity_image_position (catálogo 4.4,
"los tipos con imágenes o paragraphs necesitarán crear media y paragraphs desde el handler"). El
manifiesto de la sección 5.4 está pensado para que ese handler cree los media a partir de
fichero y nombre sin inventar nada, y para que el lote de sílabas pueda referenciar la imagen por
nombre desde el primer día.

---

## 3. Herramienta recomendada y cómo lanzar la generación

**Recomendación: la API de imágenes de OpenAI desde un script, ejecutado por Codex o por Claude
Code**, no el chat de ChatGPT. Motivos:

- El chat genera de una en una, con límites por ventana de tiempo que OpenAI no publica (fuentes
  de terceros hablan de unas 40 a 50 imágenes cada 3 horas en Plus, cifra no verificada) y sin
  nombres de fichero deterministas. Un banco de unas 440 palabras con dos candidatas por palabra son
  cerca de 900 imágenes: semanas de trabajo manual.
- Con la API: el mismo bloque de estilo en todas, nombres de fichero desde el manifiesto,
  reintentos, posproceso automático (recorte, margen, 512 px) y regenerar solo las rechazadas.
- Modelos (según la documentación de OpenAI a 2026-10-21): la familia GPT Image 2.5
  (gpt-image-2.5-flare para generación rápida de uso general, gpt-image-2.5-sunburst cuando prima
  la precisión de edición) admite fondo transparente con salida png o webp, tamaños 1024 x 1024 y
  calidad low, medium, high. gpt-image-2 **no** documenta fondo transparente. gpt-image-1.5 es el
  modelo anterior, también válido. Precio orientativo: a calidad media, en torno a 3 o 4 céntimos
  de dólar por imagen de 1024; el banco completo con dos candidatas por palabra cuesta del orden
  de 30 a 40 dólares. Comprobar en la calculadora de precios de OpenAI antes de lanzar.
- Consistencia de estilo: la API admite una o varias imágenes de referencia en la generación.
  El flujo es generar primero tres **imágenes ancla** (gato, manzana, coche), aprobarlas a mano y
  pasarlas como referencia en todas las llamadas siguientes junto con el bloque de estilo.

Cowork no aporta nada aquí (no genera imágenes por sí mismo); Codex o Claude Code sirven para
escribir y ejecutar el script. La clave de API va en una variable de entorno, nunca en el repo.

Si por lo que sea se usa el chat de ChatGPT: pegar el prompt de la sección 5, adjuntar las tres
imágenes ancla en cada mensaje, pedir **una** palabra por mensaje (las rejillas de varios objetos
en una sola imagen obligan a recortar a mano y pierden consistencia) y descargar cada PNG con el
nombre de fichero del manifiesto.

---

## 4. Apuntes sobre los nombres (para crear ejercicios después)

- **Fichero**: el slug de la palabra, en minúsculas y ASCII puro: sin tildes, la ñ pasa a n y
  la ü a u (plátano → platano.png, muñeca → muneca.png, pingüino → pinguino.png). Sin espacios ni
  guiones: el banco solo tiene sustantivos de una palabra. Así la URL no necesita codificación y
  el nombre se puede derivar de la palabra sin tabla.
- **Nombre del media en Drupal** (name) y **alt**: el slug del fichero ("platano"), neutro entre
  idiomas (decidido en la FASE 18, plans/multiidioma/analisis.md 3.7: la misma imagen sirve en
  castellano y en catalán y la palabra cambia). Es la clave `imagen` de los lotes de sílabas y de
  posición de imágenes; los crea `drush shine-content:import-images` a partir del manifiesto.
  **Tiene que ser único** en el banco: una imagen por palabra. Si se generan variantes, se elige
  una y las demás no se cargan.
- **field_text del ítem**: la palabra en el idioma de la actividad, en minúsculas, en singular,
  sin artículo ("pato", no "el pato" ni "Pato"; en catalán "ànec"). La pone el lote en la clave
  `nombre` (un objeto por idioma cuando el registro lleva `idiomas`), no el media. El player la
  muestra en grande; el artículo va en el manifiesto por si en el futuro se lee en voz alta.
- **Plurales fijos**: gafas, tijeras, maracas, macarrones, palomitas, canicas, castañuelas se
  nombran en plural porque así se dicen; la ilustración muestra el objeto completo (las dos
  lentes, las dos maracas).
- **El manifiesto lleva el silabeo** (pan-ta-lón) y el nivel lector orientativo de cada palabra,
  para poder montar lotes de "Ordena las sílabas" directamente desde él (la clave imagen del lote
  es el slug) y para elegir nombres legibles en Level0 y Level1 de posición de imágenes (en
  Level1, solo palabras con lectura L0 o L1; en Level0, solo monosílabos o bisílabos de sílabas
  abiertas simples en los dos idiomas, sin dígrafos ni grupos consonánticos: regla `nombre_simple`
  de generadores/imagenes.py, pedida por el experto el 2026-10-27, que cumplen 48 imágenes).
- **Bloque ca del manifiesto** (FASE 18, 05): cada entrada lleva la ficha catalana en la clave
  `ca`: `nombre` (singular, minúsculas, el más natural para un niño de 5 a 7 años), `articulo`
  (el, la, l'), `silabas` con el silabeo del IEC (los dígrafos tx, ix, ig, tg, tj, ss, rr y l·l se
  separan: cot-xe, cai-xa, col-le-gi; ny, ll, qu, gu van unidos: pi-nya, llu-na), `lectura` (nivel
  lector catalán según la tabla 2.3 catalana del catálogo; los monosílabos con coda doble, como
  dent, pont o porc, son L3 desde el 2026-10-29), `etiquetas` (fon: sílaba inicial,
  espejo: letras b d p q, graf: dígrafos y grafías propias, sib: sibilante sorda o sonora),
  `usable` y, si hace falta, `nota`. **usable: false** marca las 9 imágenes que no se usan en
  catalán (el nombre coincide con el de otra imagen, tiene varias palabras o lleva guion); la
  imagen no se borra y sigue sirviendo en castellano. **A partir de ahora la fuente del nombre
  catalán es el manifiesto**; plans/multiidioma/banco-imagenes-equivalencia-ca.csv queda como
  registro de la validación del experto (2026-10-26) y no se edita: un cambio de ficha se hace en
  el manifiesto. Las claves comunes (fichero, categoria, subcategoria, etiquetas vis:) son neutras
  entre idiomas; las castellanas siguen en la raíz de la entrada.
- **Categoría, subcategoría y etiquetas** son lo que necesita la tabla de niveles de 5.4 del
  catálogo: categorías distintas (Level0 a Level2), misma categoría amplia (Level3 a Level5),
  misma categoría estrecha (Level6 y Level7), parecidas en forma o color (Level8), con nombres
  que empiezan igual (Level9) y las dos cosas (Level10). Las etiquetas "vis:" marcan grupos de
  parecido visual y las "fon:" grupos con la misma sílaba inicial o pares mínimos.
- **Nunca se renombra una imagen ya cargada**: las actividades la referencian por el media y
  la huella de contenido del importador no incluye la imagen, pero el nombre sí es la clave de
  los lotes. Una imagen nueva para la misma palabra sustituye el fichero del media existente,
  no crea otro media.
- **Código de las actividades**: IMG-XX-Lnn-MEM-nnn (catálogo 3.4, XX = ES o CA). El banco no lleva
  código; lo llevan las actividades que lo usan.

---

## Prompt

> Todo lo que sigue, hasta el final del fichero, se pega en la herramienta de generación.

Actúas como director de arte y como ingeniero de contenido de **Shine**, una aplicación de
ejercicios de lectura para niños y jóvenes con dislexia (de 5 a 15 años), que usan acompañados
de un familiar o terapeuta. Necesitamos un **banco de ilustraciones** de objetos cotidianos,
animales, alimentos y personajes. Cada imagen representa **una sola palabra** del español y se
usa en dos ejercicios:

1. **Posición de imágenes** (memoria visoespacial): se muestran de 2 a 6 ilustraciones en
   tarjetas numeradas, se ocultan y se pregunta "¿En qué posición estaba?" mostrando solo el
   nombre escrito. El niño tiene que reconocer la palabra en la imagen sin ninguna duda.
2. **Ordena las sílabas**: la ilustración aparece pequeña (120 x 90 puntos, recortada a 4:3) como
   pista de la palabra que hay que formar.

Tu trabajo: generar las imágenes de la lista de la sección 5.6 siguiendo exactamente el estilo,
el formato y los nombres de fichero de abajo, y entregar el manifiesto. Si una palabra no se puede
ilustrar sin ambigüedad, no la fuerces: márcala en el manifiesto como descartada con el motivo.

### 5.1 Estilo visual (igual en todas las imágenes)

Las imágenes se ven juntas en una rejilla y se comparan de memoria: **ninguna debe destacar por
el estilo**, solo por lo que representa. Todas comparten:

- **Tipo**: ilustración vectorial plana, estilo tarjeta educativa o libro ilustrado infantil
  moderno. Nada de foto, nada de 3D, nada de acuarela ni lápiz, nada de pixel art.
- **Trazo**: contorno limpio y continuo en gris carbón oscuro (#1E1E2E), grosor uniforme y medio
  en toda la imagen y en todo el banco. Formas redondeadas y simplificadas, sin detalles
  pequeños: la imagen se verá a 110 puntos de lado.
- **Color**: colores planos, saturados pero suaves, como mucho una sombra plana por color (dos
  tonos). Sin degradados, sin texturas, sin brillos fotográficos. **El objeto conserva su color
  natural y más reconocible** (el plátano es amarillo, el tomate rojo, el elefante gris): el color
  es una pista de memoria, no se estiliza. Evita el rojo intenso como color dominante salvo que el
  objeto lo sea (fresa, tomate).
- **Composición**: un solo objeto, entero (nunca recortado por el borde), centrado, visto de
  frente o en tres cuartos, en la misma escala aparente en todo el banco (una hormiga y un
  elefante llenan el encuadre igual). Sin fondo, sin escena, sin suelo, sin sombra proyectada,
  sin marco ni borde, sin viñeta.
- **Tono**: amable y claro. Animales y personajes con expresión simpática y ojos sencillos.
  Personajes sin rasgos caricaturescos de ninguna cultura ni género; cuando el personaje sea una
  persona, variar el tono de piel entre personajes y hacerlo reconocible por sus atributos (el
  bombero por el casco y la manguera). Nada que pueda asustar (dragón, monstruo, bruja y fantasma
  son versiones amistosas).
- **Prohibido en la imagen**: texto, letras, números, logotipos, marcas, marcas de agua, firmas,
  manos sosteniendo el objeto, varios objetos cuando la palabra es singular, etiquetas, flechas,
  bocadillos de diálogo, patrones de fondo. Los números son especialmente importantes: el ejercicio
  numera las tarjetas y una cifra dentro de la ilustración confunde.

Bloque de estilo que se repite literalmente en cada generación (en inglés porque los modelos de
imagen responden mejor):

```
Flat vector illustration of a single {SUBJECT}, children's educational flashcard style.
Clean continuous dark charcoal (#1E1E2E) outline of uniform medium weight, simple rounded shapes,
flat colors with at most one flat shade per color, no gradients, no textures.
The object keeps its natural, most recognizable colors. Whole object visible, centered,
front or three-quarter view, occupying about 70% of the canvas with clear margins on all sides.
Transparent background. No scene, no ground, no cast shadow, no frame, no border.
No text, no letters, no numbers, no logos, no watermark, no hands, no extra objects.
Friendly, calm, modern picture-book look; consistent with the reference images.
```

Donde {SUBJECT} se sustituye por la "pista visual" de la palabra en la tabla (por ejemplo
"a bare human foot, side view"). La pista desambigua (pie no es una tarta; pila es una pila
eléctrica) y fija la variante más reconocible.

### 5.2 Formato técnico

| Parámetro | Valor |
|---|---|
| Generación | 1024 x 1024, calidad media, fondo transparente, salida png |
| Entrega | 512 x 512 píxeles, PNG de 8 bits por canal con canal alfa, sRGB, sin metadatos |
| Zona segura | Tras recortar la imagen al contenido real (bounding box del alfa), se centra y se rellena hasta cuadrado dejando un margen transparente del 14 % por cada lado. Resultado: el objeto ocupa como mucho el 72 % del alto. Nunca se deforma. |
| Si la herramienta no admite transparencia | Fondo plano uniforme del color exacto #F7F5F2, sin sombra ni degradado, y mismo posproceso de margen. Se indica en el manifiesto (fondo: "plano") |
| Canal alfa | Los modelos entregan el interior del objeto con alfa entre 240 y 254 y algo de ruido casi invisible en el fondo. Antes de guardar: todo alfa igual o mayor que 240 pasa a 255 y todo alfa igual o menor que 16 pasa a 0; el borde antialiasado (17 a 239) se deja como está. Comprobado en las tres anclas del 2026-10-21 |
| Peso | Por debajo de 120 KB por fichero; lo normal son 30 a 70 KB |
| Nombre de fichero | {slug}.png, slug = la palabra en minúsculas y ASCII puro: sin tildes, ñ → n, ü → u. Sin espacios, guiones ni sufijos |
| Candidatas | Dos por palabra en la primera pasada ({slug}-1.png y {slug}-2.png en una carpeta de trabajo); una vez elegida, se guarda como {slug}.png. Las candidatas no entregadas no se conservan en el banco |

### 5.3 Flujo de trabajo

1. **Anclas de estilo**: genera primero gato, manzana y coche (seis candidatas en total), elige
   una de cada y entrégalas para aprobación antes de seguir. Son la referencia visual de todo el
   banco: en cada llamada posterior se pasan como imágenes de referencia junto con el bloque de
   estilo.
2. **Lotes por categoría** en el orden de prioridad del manifiesto (P1 primero): genera las dos
   candidatas, aplica el posproceso, y produce una **hoja de contacto** por categoría (rejilla con
   el slug bajo cada imagen) para revisión humana. Importante: el slug solo va en la hoja de
   contacto, nunca dentro del PNG.
3. **Revisión**: por cada imagen, la prueba es "¿un niño de 5 años, viendo solo esta imagen, diría
   esta palabra y no otra?". Se rechaza si hay ambigüedad (gorro y gorra tienen que ser
   inconfundibles entre sí; pato no puede parecer pollo), si rompe el estilo, si contiene texto o
   cifras, o si el objeto toca el borde.
4. **Regeneración** solo de las rechazadas, con la pista visual ajustada. Máximo tres rondas por
   palabra; si no sale, se descarta y se anota.
5. **Entrega**: la carpeta images/ con un {slug}.png por palabra aceptada y el manifest.json de
   5.4. Si lo haces con un script, entrega también el script y la lista de llamadas fallidas.

Con la API, el script sigue estas reglas: lee el manifiesto, salta las palabras que ya tienen
fichero final (idempotente), respeta los límites de imágenes por minuto con reintentos
exponenciales, guarda la respuesta cruda antes del posproceso, y escribe en el manifiesto el
estado de cada palabra (pendiente, candidatas, aceptada, descartada) y la fecha.

### 5.4 Manifiesto

Un único fichero manifest.json con una entrada por palabra. Es el contrato con el importador de
Drupal (`drush shine-content:import-images`, desde la FASE 18), que crea un media de tipo imagen
por entrada aceptada con name = slug del fichero y alt = slug (no la palabra: la clave es neutra
entre idiomas), y con los generadores de ejercicios, que eligen palabras por categoría, etiquetas
y nivel lector.

```json
{
  "version": "1.0",
  "estilo": "flat-vector-v1",
  "generado_con": "gpt-image-2.5-flare, calidad media, fondo transparente",
  "imagenes": [
    {
      "fichero": "platano.png",
      "nombre": "plátano",
      "articulo": "el",
      "silabas": "plá-ta-no",
      "lectura": "L2",
      "categoria": "frutas",
      "subcategoria": "fruta amarilla",
      "etiquetas": ["vis:amarillo", "vis:alargado", "fon:pla-"],
      "pista_visual": "a single ripe yellow banana, slightly curved",
      "prioridad": 1,
      "estado": "aceptada",
      "fondo": "transparente",
      "ca": {
        "nombre": "plàtan",
        "articulo": "el",
        "silabas": "plà-tan",
        "lectura": "L2",
        "etiquetas": ["fon:pla-", "graf:tr"],
        "usable": true
      }
    }
  ]
}
```

Campos:

- **fichero**, **nombre**, **articulo**, **silabas**, **lectura**, **categoria**,
  **subcategoria**, **etiquetas**, **pista_visual** y **prioridad** se copian de la tabla de 5.6
  (la tabla es la fuente; si corriges algo al revisar, corrígelo en las dos).
- **lectura** es el nivel lector orientativo de la palabra, según la estructura silábica y la
  longitud (escala de exercise-catalog.md 2.3): L0 = 1 o 2 sílabas, solo vocales y sílabas
  consonante + vocal con m, p, l, s, t, n, d; L1 = cualquier sílaba directa, inversa o mixta y
  diptongos, 2 o 3 sílabas; L2 = con sílabas trabadas (pl, br, tr...) o gue, gui, güe, güi;
  L3 = grupos complejos, hiatos o 4 sílabas; L5 = 5 sílabas o más. Sirve para elegir nombres
  legibles en los niveles bajos y para filtrar palabras en "Ordena las sílabas". El léxico de
  referencia del proyecto, cuando exista, prevalece sobre esta columna.
- **estado**: pendiente, candidatas, aceptada o descartada (con **motivo** si se descarta).
- **ca** (FASE 18, 05): la ficha catalana de la imagen, descrita en la sección 4 (nombre, artículo,
  silabeo del IEC, lectura catalana, etiquetas, usable y nota). Sale del CSV validado por el
  experto; la raíz del manifiesto lo registra en la clave `idiomas.ca` (fuente, fecha, entradas y
  usables). El importador de media no la lee (name y alt siguen siendo el slug); la leen los
  generadores de lotes: con `idiomas` [es, ca], `nombre` de cada imagen es {es: nombre, ca:
  ca.nombre}, y en Level0 y Level1 el nombre tiene que ser legible en los dos idiomas (lectura L0
  o L1 en `lectura` y en `ca.lectura`).

### 5.5 Criterios de aceptación (resumen)

- Una sola lectura posible: la imagen evoca la palabra exacta, en singular (salvo los plurales
  fijos), sin sinónimos más probables.
- Mismo trazo, misma paleta, misma escala y mismo encuadre que las anclas.
- Sin texto, cifras, logotipos, fondo, sombra, marco ni objetos extra.
- Objeto entero dentro de la zona segura; fichero 512 x 512 PNG con alfa; nombre de fichero igual
  al slug de la tabla.
- Dentro de un mismo grupo de etiquetas "vis:" las imágenes se parecen por lo que son, no porque
  el dibujo sea calcado: un lobo y un zorro comparten silueta y tamaño, pero se distinguen por
  color y orejas.

### 5.6 Lista de palabras

Unas 440 palabras en 19 categorías. **Prioridad 1** (unas 160) cubre lo que necesitan los niveles
Level0 a Level5 de los dos ejercicios y se genera primero; **prioridad 2** (unas 150) completa las
categorías estrechas y los grupos de parecido para Level6 a Level10; **prioridad 3** (unas 130) es
variedad extra. Si
hay que recortar, se recorta por prioridad y nunca por categoría.

Columnas: fichero, nombre, artículo, sílabas, lectura (nivel lector orientativo), pista visual
para el modelo (en inglés, es lo que va en {SUBJECT}) y etiquetas con la prioridad.

#### Animales domésticos y de granja

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| gato.png | gato | el | ga-to | L1 | orange tabby cat sitting, front view | vis:felinos, fon:ga-, ANCLA, P1 |
| perro.png | perro | el | pe-rro | L1 | friendly brown dog standing, side view, floppy ears (same pose as the other canids) | vis:cánidos, fon:pe-, P1 |
| vaca.png | vaca | la | va-ca | L1 | black and white dairy cow standing, side view | vis:granja, fon:va-, P1 |
| cerdo.png | cerdo | el | cer-do | L1 | pink pig standing, side view, curly tail | vis:granja, P1 |
| oveja.png | oveja | la | o-ve-ja | L1 | fluffy white sheep with black face, side view | vis:granja, P1 |
| cabra.png | cabra | la | ca-bra | L2 | white goat with small horns and beard, side view | vis:granja, fon:ca-, P1 |
| caballo.png | caballo | el | ca-ba-llo | L1 | brown horse standing, side view, flowing mane | vis:granja, fon:ca-, P1 |
| burro.png | burro | el | bu-rro | L1 | grey donkey standing, long ears, side view | vis:granja, espejo:b, P2 |
| gallina.png | gallina | la | ga-lli-na | L1 | brown hen standing, red comb, side view | vis:aves, vis:granja, fon:ga-, P1 |
| gallo.png | gallo | el | ga-llo | L1 | rooster with big red comb and colorful tail, side view | vis:aves, vis:granja, fon:ga-, P2 |
| pollito.png | pollito | el | po-lli-to | L1 | small fluffy yellow chick, front view | vis:amarillo, vis:aves, fon:po-, P2 |
| pato.png | pato | el | pa-to | L0 | white duck with orange beak standing, side view | vis:aves, fon:pa-, P1 |
| pavo.png | pavo | el | pa-vo | L1 | turkey standing, side view, brown fanned tail visible, red wattle, same profile pose as the duck and the hen | vis:aves, fon:pa-, P2 |
| conejo.png | conejo | el | co-ne-jo | L1 | white rabbit sitting, long upright ears | fon:co-, P1 |
| raton.png | ratón | el | ra-tón | L1 | small grey mouse, round ears, long thin tail | fon:ra-, P1 |
| toro.png | toro | el | to-ro | L1 | black bull standing with horns, side view | vis:granja, fon:to-, P2 |
| mula.png | mula | la | mu-la | L0 | brown mule standing, side view | vis:granja, fon:mu-, P3 |

#### Animales salvajes

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| leon.png | león | el | le-ón | L3 | male lion sitting with big mane, front view | vis:felinos, vis:amarillo, P1 |
| tigre.png | tigre | el | ti-gre | L2 | orange tiger sitting, front view, same seated frontal pose as the cat, black stripes simplified into a few large shapes | vis:felinos, P1 |
| oso.png | oso | el | o-so | L0 | brown bear standing on four legs, side view | vis:marrón, fon:o-, P1 |
| lobo.png | lobo | el | lo-bo | L1 | grey wolf standing, side view, pointed ears | vis:cánidos, fon:lo-, P1 |
| zorro.png | zorro | el | zo-rro | L1 | orange fox with white chest and bushy tail, side view | vis:cánidos, fon:-rro, P1 |
| mono.png | mono | el | mo-no | L0 | brown monkey sitting, long tail, friendly face | fon:mo-, P1 |
| elefante.png | elefante | el | e-le-fan-te | L3 | grey elephant standing, side view, trunk down | vis:gris, P1 |
| jirafa.png | jirafa | la | ji-ra-fa | L1 | giraffe standing, full body, side view | vis:amarillo, P1 |
| cebra.png | cebra | la | ce-bra | L2 | zebra standing, side view | vis:rayas, P1 |
| hipopotamo.png | hipopótamo | el | hi-po-pó-ta-mo | L5 | hippopotamus standing, side view, grey-purple | vis:gris, P2 |
| rinoceronte.png | rinoceronte | el | ri-no-ce-ron-te | L5 | rhinoceros standing, side view, one horn | vis:gris, P2 |
| cocodrilo.png | cocodrilo | el | co-co-dri-lo | L3 | green crocodile, side view, mouth closed | vis:verde, fon:co-, P1 |
| serpiente.png | serpiente | la | ser-pien-te | L1 | green snake coiled with head raised, friendly | vis:verde, P1 |
| canguro.png | canguro | el | can-gu-ro | L1 | kangaroo standing upright, side view | P2 |
| koala.png | koala | el | ko-a-la | L3 | grey koala hugging a short branch | vis:gris, P2 |
| panda.png | panda | el | pan-da | L1 | black and white panda sitting, front view | fon:pan-, P2 |
| camello.png | camello | el | ca-me-llo | L1 | camel with two humps standing, side view | fon:ca-, P2 |
| ciervo.png | ciervo | el | cier-vo | L1 | deer with antlers standing, side view | vis:marrón, P2 |
| ardilla.png | ardilla | la | ar-di-lla | L1 | brown squirrel sitting with bushy tail, holding nothing | vis:marrón, P2 |
| erizo.png | erizo | el | e-ri-zo | L1 | hedgehog with brown spines, side view | P2 |
| murcielago.png | murciélago | el | mur-cié-la-go | L3 | friendly bat with open wings, front view | P2 |
| puma.png | puma | el | pu-ma | L0 | tan puma (cougar) sitting, front view, same seated frontal pose as the cat and the tiger, plain coat with no stripes | vis:felinos, fon:pu-, P2 |
| leopardo.png | leopardo | el | le-o-par-do | L3 | leopard with clearly visible spots sitting, front view, same seated frontal pose as the cat and the tiger | vis:felinos, P2 |
| pantera.png | pantera | la | pan-te-ra | L1 | black panther sitting, front view, same seated frontal pose as the cat and the tiger | vis:felinos, fon:pan-, P2 |
| lince.png | lince | el | lin-ce | L1 | lynx sitting, front view, tufted ears, short tail, same seated frontal pose as the cat and the tiger | vis:felinos, P3 |
| guepardo.png | guepardo | el | gue-par-do | L2 | cheetah sitting, front view, black tear stripes from the eyes, plain round black spots, same seated frontal pose as the cat and the tiger | vis:felinos, P3 |
| hiena.png | hiena | la | hie-na | L1 | spotted hyena standing, side view | vis:cánidos, P2 |
| coyote.png | coyote | el | co-yo-te | L1 | coyote standing, side view, sandy coat | vis:cánidos, fon:co-, P3 |
| topo.png | topo | el | to-po | L0 | mole with pink nose and big paws, front view | fon:to-, P3 |
| foca.png | foca | la | fo-ca | L1 | grey seal lying, head up, side view | vis:gris, vis:mar, fon:fo-, P2 |
| tortuga.png | tortuga | la | tor-tu-ga | L1 | green turtle walking, side view | vis:verde, fon:tor-, P1 |
| rana.png | rana | la | ra-na | L1 | green frog sitting, front view | vis:verde, fon:ra-, P1 |
| sapo.png | sapo | el | sa-po | L0 | brown warty toad sitting, front view | fon:sa-, P3 |
| lagarto.png | lagarto | el | la-gar-to | L1 | green lizard, side view | vis:verde, fon:la-, P3 |
| caracol.png | caracol | el | ca-ra-col | L1 | snail with spiral brown shell, side view | fon:ca-, P1 |
| gusano.png | gusano | el | gu-sa-no | L1 | smiling green earthworm, side view | vis:verde, P2 |

#### Aves

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| pajaro.png | pájaro | el | pá-ja-ro | L1 | small blue songbird standing on its own feet, side view, same profile pose as the duck, no branch | vis:aves, fon:pa-, P1 |
| paloma.png | paloma | la | pa-lo-ma | L1 | white dove standing, side view | vis:aves, vis:blanco, fon:pa-, P1 |
| loro.png | loro | el | lo-ro | L1 | green parrot with red and yellow wing, side view | vis:aves, vis:verde, fon:lo-, P1 |
| buho.png | búho | el | bú-ho | L3 | brown owl standing, front view, two big round eyes, small ear tufts (front view on purpose: the eyes are what identifies an owl) | vis:aves, espejo:b, P1 |
| aguila.png | águila | el | á-gui-la | L2 | eagle standing on its own feet, white head, side view, no branch, same profile pose as the other birds | vis:aves, P2 |
| ciguena.png | cigüeña | la | ci-güe-ña | L2 | white stork standing on two legs, side view, long red beak, same profile pose as the other birds | vis:aves, vis:blanco, P2 |
| flamenco.png | flamenco | el | fla-men-co | L2 | pink flamingo standing on two legs, side view, long curved neck, same profile pose as the other birds | vis:aves, vis:rosa, P2 |
| pinguino.png | pingüino | el | pin-güi-no | L2 | penguin standing, side view, same profile pose as the duck, black back and white belly, flipper and feet visible | vis:aves, fon:pin-, P1 |
| tucan.png | tucán | el | tu-cán | L1 | toucan with big colorful beak, side view | vis:aves, P3 |
| cisne.png | cisne | el | cis-ne | L1 | white swan standing, side view, long curved neck, same profile pose as the duck | vis:aves, vis:blanco, P3 |

#### Animales marinos

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| pez.png | pez | el | pez | L1 | orange goldfish, side view | vis:mar, fon:pe-, P1 |
| tiburon.png | tiburón | el | ti-bu-rón | L1 | friendly grey shark, side view | vis:mar, vis:gris, P1 |
| delfin.png | delfín | el | del-fín | L1 | grey-blue dolphin jumping, side view | vis:mar, P1 |
| ballena.png | ballena | la | ba-lle-na | L1 | blue whale, side view, small water spout | vis:mar, vis:azul, P1 |
| pulpo.png | pulpo | el | pul-po | L1 | purple octopus, front view, eight tentacles | vis:mar, fon:pu-, P1 |
| cangrejo.png | cangrejo | el | can-gre-jo | L2 | friendly red crab, front view, claws up, a few legs on each side (the exact leg count does not matter) | vis:mar, P2 |
| medusa.png | medusa | la | me-du-sa | L1 | pink translucent jellyfish, front view | vis:mar, fon:me-, P3 |
| gamba.png | gamba | la | gam-ba | L1 | pink shrimp, side view | vis:mar, P3 |
| concha.png | concha | la | con-cha | L1 | scallop seashell, fan shaped, front view | vis:mar, P3 |
| caballito.png | caballito | el | ca-ba-lli-to | L3 | yellow seahorse, side view | vis:mar, fon:ca-, P3 |

#### Insectos y bichos

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| abeja.png | abeja | la | a-be-ja | L1 | striped yellow and black bee, front view | vis:insectos, vis:amarillo, P1 |
| mariposa.png | mariposa | la | ma-ri-po-sa | L3 | butterfly with open blue and orange wings, top view | vis:insectos, fon:ma-, P1 |
| mosca.png | mosca | la | mos-ca | L1 | housefly, top view, transparent wings | vis:insectos, fon:mo-, P2 |
| hormiga.png | hormiga | la | hor-mi-ga | L1 | black ant, top view, three body segments, six legs spread out (three on each side), two antennae | vis:insectos, P1 |
| mariquita.png | mariquita | la | ma-ri-qui-ta | L3 | red ladybug with black dots, top view | vis:insectos, vis:rojo, fon:ma-, P1 |
| arana.png | araña | la | a-ra-ña | L1 | friendly black spider, eight legs, front view | vis:insectos, P2 |
| saltamontes.png | saltamontes | el | sal-ta-mon-tes | L3 | green grasshopper, side view | vis:insectos, vis:verde, P2 |
| libelula.png | libélula | la | li-bé-lu-la | L3 | blue dragonfly, top view | vis:insectos, P3 |
| escarabajo.png | escarabajo | el | es-ca-ra-ba-jo | L5 | shiny green beetle, top view | vis:insectos, P3 |
| mosquito.png | mosquito | el | mos-qui-to | L1 | mosquito, side view, long legs | vis:insectos, fon:mo-, P3 |
| oruga.png | oruga | la | o-ru-ga | L1 | green caterpillar, side view | vis:insectos, vis:verde, P3 |

#### Frutas

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| manzana.png | manzana | la | man-za-na | L1 | red apple with leaf | vis:rojo, vis:redondo, fon:man-, ANCLA, P1 |
| pera.png | pera | la | pe-ra | L1 | green pear with stem | vis:verde, fon:pe-, P1 |
| platano.png | plátano | el | plá-ta-no | L2 | single ripe yellow banana | vis:amarillo, fon:pla-, P1 |
| naranja.png | naranja | la | na-ran-ja | L1 | whole orange fruit with leaf | vis:naranja, vis:redondo, P1 |
| limon.png | limón | el | li-món | L1 | whole yellow lemon | vis:amarillo, fon:li-, P1 |
| fresa.png | fresa | la | fre-sa | L2 | red strawberry with green leaves | vis:rojo, fon:fre-, P1 |
| uva.png | uva | la | u-va | L1 | bunch of purple grapes | vis:morado, P1 |
| sandia.png | sandía | la | san-dí-a | L3 | watermelon slice, red with black seeds | vis:rojo, vis:verde, P1 |
| melon.png | melón | el | me-lón | L1 | whole green melon with a cut wedge | vis:verde, fon:me-, P2 |
| cereza.png | cereza | la | ce-re-za | L1 | two red cherries joined by stem | vis:rojo, vis:redondo, P1 |
| pina.png | piña | la | pi-ña | L1 | whole pineapple | vis:amarillo, fon:pi-, P1 |
| kiwi.png | kiwi | el | ki-wi | L1 | kiwi fruit cut in half showing green inside | vis:verde, P2 |
| melocoton.png | melocotón | el | me-lo-co-tón | L3 | whole peach, orange-pink | vis:redondo, fon:me-, P2 |
| ciruela.png | ciruela | la | ci-rue-la | L1 | whole purple plum | vis:morado, vis:redondo, P3 |
| granada.png | granada | la | gra-na-da | L2 | pomegranate, whole, dark red | vis:rojo, vis:redondo, P3 |
| coco.png | coco | el | co-co | L1 | whole brown coconut | vis:marrón, vis:redondo, fon:co-, P2 |
| mandarina.png | mandarina | la | man-da-ri-na | L3 | small orange tangerine with leaf | vis:naranja, vis:redondo, fon:man-, P3 |
| higo.png | higo | el | hi-go | L1 | purple fig, whole | vis:morado, P3 |
| aguacate.png | aguacate | el | a-gua-ca-te | L3 | avocado cut in half with pit | vis:verde, P3 |

#### Verduras y comida

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| tomate.png | tomate | el | to-ma-te | L1 | red tomato with green stem | vis:rojo, vis:redondo, fon:to-, P1 |
| zanahoria.png | zanahoria | la | za-na-ho-ria | L3 | orange carrot with green leaves | vis:naranja, vis:alargado, P1 |
| patata.png | patata | la | pa-ta-ta | L1 | brown potato | vis:marrón, fon:pa-, P1 |
| cebolla.png | cebolla | la | ce-bo-lla | L1 | whole yellow onion | vis:redondo, P2 |
| lechuga.png | lechuga | la | le-chu-ga | L1 | green lettuce head | vis:verde, P2 |
| maiz.png | maíz | el | ma-íz | L3 | corn cob with husk partly open | vis:amarillo, fon:ma-, P2 |
| pimiento.png | pimiento | el | pi-mien-to | L1 | red bell pepper | vis:rojo, fon:pi-, P2 |
| calabaza.png | calabaza | la | ca-la-ba-za | L3 | orange pumpkin | vis:naranja, vis:redondo, fon:ca-, P2 |
| seta.png | seta | la | se-ta | L0 | mushroom with brown cap | fon:se-, P1 |
| pepino.png | pepino | el | pe-pi-no | L1 | green cucumber | vis:verde, vis:alargado, fon:pe-, P3 |
| berenjena.png | berenjena | la | be-ren-je-na | L3 | purple eggplant | vis:morado, P3 |
| pan.png | pan | el | pan | L1 | loaf of bread (baguette style) | vis:marrón, fon:pan-, fon:pa-, P1 |
| queso.png | queso | el | que-so | L1 | wedge of yellow cheese with holes | vis:amarillo, espejo:q, P1 |
| huevo.png | huevo | el | hue-vo | L1 | fried egg, top view | vis:blanco, vis:amarillo, P1 |
| leche.png | leche | la | le-che | L1 | glass of milk with a milk carton behind it | vis:blanco, fon:le-, P1 |
| sopa.png | sopa | la | so-pa | L0 | bowl of soup with steam | fon:so-, P1 |
| pizza.png | pizza | la | piz-za | L1 | whole round pizza, top view | vis:redondo, P1 |
| tarta.png | tarta | la | tar-ta | L1 | layered birthday cake without candles or text | fon:tar-, P1 |
| helado.png | helado | el | he-la-do | L1 | ice cream cone with two scoops | P1 |
| galleta.png | galleta | la | ga-lle-ta | L1 | round chocolate chip cookie | vis:redondo, vis:marrón, fon:ga-, P1 |
| caramelo.png | caramelo | el | ca-ra-me-lo | L3 | wrapped candy with twisted ends | fon:ca-, P2 |
| chocolate.png | chocolate | el | cho-co-la-te | L3 | chocolate bar, partly unwrapped, no text | vis:marrón, P2 |
| jamon.png | jamón | el | ja-món | L1 | cured ham leg (Spanish jamón) | P2 |
| pollo.png | pollo | el | po-llo | L1 | roast chicken on a plate | fon:po-, P2 |
| arroz.png | arroz | el | a-rroz | L1 | bowl of white rice | vis:blanco, P2 |
| macarrones.png | macarrones | los | ma-ca-rro-nes | L3 | plate of macaroni with tomato sauce | fon:ma-, P3 |
| zumo.png | zumo | el | zu-mo | L1 | glass of orange juice with straw | vis:naranja, P2 |
| yogur.png | yogur | el | yo-gur | L1 | yogurt cup with spoon, no text | vis:blanco, P3 |
| miel.png | miel | la | miel | L1 | honey jar with wooden dipper, no label | vis:amarillo, P3 |
| bocadillo.png | bocadillo | el | bo-ca-di-llo | L3 | baguette sandwich | fon:bo-, P2 |
| hamburguesa.png | hamburguesa | la | ham-bur-gue-sa | L3 | hamburger with lettuce and cheese | P2 |
| tortilla.png | tortilla | la | tor-ti-lla | L1 | Spanish potato omelette, one wedge cut | fon:tor-, P3 |
| salchicha.png | salchicha | la | sal-chi-cha | L1 | single sausage | P3 |
| palomitas.png | palomitas | las | pa-lo-mi-tas | L3 | striped popcorn bucket with popcorn, no text | fon:pa-, P3 |
| rosquilla.png | rosquilla | la | ros-qui-lla | L1 | ring doughnut with pink glaze | vis:redondo, P3 |
| magdalena.png | magdalena | la | mag-da-le-na | L3 | plain cupcake in paper liner | P3 |

#### Casa y muebles

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| casa.png | casa | la | ca-sa | L1 | simple house with red roof and door | fon:ca-, P1 |
| mesa.png | mesa | la | me-sa | L0 | wooden table, front view | fon:me-, P1 |
| silla.png | silla | la | si-lla | L1 | wooden chair, front view | fon:si-, P1 |
| cama.png | cama | la | ca-ma | L1 | bed with pillow and blue blanket | fon:ca-, P1 |
| sofa.png | sofá | el | so-fá | L1 | green two-seat sofa | fon:so-, P1 |
| lampara.png | lámpara | la | lám-pa-ra | L1 | table lamp with shade, switched off | P1 |
| puerta.png | puerta | la | puer-ta | L1 | closed wooden door with handle | vis:marrón, P1 |
| ventana.png | ventana | la | ven-ta-na | L1 | window with four panes and curtains | P1 |
| espejo.png | espejo | el | es-pe-jo | L1 | oval mirror with frame | P1 |
| reloj.png | reloj | el | re-loj | L1 | round wall clock without numerals, hands at ten past ten | vis:redondo, P1 |
| telefono.png | teléfono | el | te-lé-fo-no | L3 | smartphone with blank screen | fon:te-, P1 |
| ordenador.png | ordenador | el | or-de-na-dor | L3 | laptop open with blank screen | P2 |
| television.png | televisión | la | te-le-vi-sión | L3 | flat TV with blank screen on stand | fon:te-, P2 |
| nevera.png | nevera | la | ne-ve-ra | L1 | white refrigerator, closed | vis:blanco, P2 |
| alfombra.png | alfombra | la | al-fom-bra | L2 | rectangular patterned rug, top view | P3 |
| cojin.png | cojín | el | co-jín | L1 | square cushion | fon:co-, P3 |
| armario.png | armario | el | ar-ma-rio | L1 | wardrobe with two doors, closed | P2 |
| cortina.png | cortina | la | cor-ti-na | L1 | curtain on a rod, tied with a ribbon | P3 |
| escalera.png | escalera | la | es-ca-le-ra | L3 | wooden step ladder | P2 |
| banera.png | bañera | la | ba-ñe-ra | L1 | white bathtub with foam | vis:blanco, P2 |
| cuna.png | cuna | la | cu-na | L1 | baby crib with bars | fon:cu-, P2 |
| llave.png | llave | la | lla-ve | L1 | single old-style key | vis:amarillo, P1 |
| escoba.png | escoba | la | es-co-ba | L1 | broom standing | P2 |
| cubo.png | cubo | el | cu-bo | L1 | blue plastic bucket with handle | fon:cu-, P1 |
| jabon.png | jabón | el | ja-bón | L1 | bar of soap with a few bubbles | P2 |
| cepillo.png | cepillo | el | ce-pi-llo | L1 | toothbrush | P2 |
| peine.png | peine | el | pei-ne | L1 | hair comb | fon:pe-, P2 |
| toalla.png | toalla | la | to-a-lla | L3 | folded blue towel | fon:to-, P2 |
| vela.png | vela | la | ve-la | L1 | lit candle | fon:ve-, P1 |
| bombilla.png | bombilla | la | bom-bi-lla | L1 | light bulb | vis:amarillo, espejo:b, fon:bo-, P2 |
| cuadro.png | cuadro | el | cua-dro | L2 | framed painting of a simple mountain landscape | P3 |
| jarron.png | jarrón | el | ja-rrón | L1 | blue vase with three flowers | P3 |
| maceta.png | maceta | la | ma-ce-ta | L1 | terracotta flower pot with a green plant | fon:ma-, P2 |

#### Cocina y mesa

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| plato.png | plato | el | pla-to | L2 | empty white round plate, slight top view | vis:redondo, vis:blanco, fon:pla-, P1 |
| vaso.png | vaso | el | va-so | L1 | clear drinking glass with water | fon:va-, P1 |
| taza.png | taza | la | ta-za | L1 | mug with handle, steam | fon:ta-, P1 |
| cuchara.png | cuchara | la | cu-cha-ra | L1 | metal spoon | fon:cu-, P1 |
| tenedor.png | tenedor | el | te-ne-dor | L1 | metal fork | fon:te-, P1 |
| cuchillo.png | cuchillo | el | cu-chi-llo | L1 | table knife with rounded tip | fon:cu-, P2 |
| olla.png | olla | la | o-lla | L1 | cooking pot with lid and two handles | fon:o-, P2 |
| sarten.png | sartén | la | sar-tén | L1 | frying pan | P2 |
| botella.png | botella | la | bo-te-lla | L1 | water bottle with blue cap, no label | fon:bo-, P1 |
| jarra.png | jarra | la | ja-rra | L1 | glass pitcher of water | P3 |
| tetera.png | tetera | la | te-te-ra | L1 | teapot | fon:te-, P3 |
| bandeja.png | bandeja | la | ban-de-ja | L1 | empty serving tray | P3 |
| tapa.png | tapa | la | ta-pa | L0 | pot lid with knob, seen alone | fon:ta-, P3 |
| horno.png | horno | el | hor-no | L1 | kitchen oven, closed | P3 |
| cesta.png | cesta | la | ces-ta | L1 | wicker basket with handle | P2 |

#### Colegio y juguetes

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| libro.png | libro | el | li-bro | L2 | closed book with blue cover, no title | fon:li-, P1 |
| lapiz.png | lápiz | el | lá-piz | L1 | yellow pencil with pink eraser | vis:amarillo, vis:alargado, fon:la-, P1 |
| goma.png | goma | la | go-ma | L1 | pink eraser block | fon:go-, P1 |
| tijeras.png | tijeras | las | ti-je-ras | L1 | scissors with red handles, closed | P1 |
| mochila.png | mochila | la | mo-chi-la | L1 | school backpack | fon:mo-, P1 |
| pizarra.png | pizarra | la | pi-za-rra | L1 | green chalkboard on a wooden easel with a simple white chalk drawing of a sun on it (the drawing keeps the board opaque), no letters or numbers | fon:pi-, P2 |
| cuaderno.png | cuaderno | el | cua-der-no | L1 | spiral notebook, closed, blank cover | P2 |
| regla.png | regla | la | re-gla | L2 | wooden ruler without numbers, tick marks only | vis:alargado, P2 |
| pincel.png | pincel | el | pin-cel | L1 | paintbrush with blue paint on tip | fon:pin-, P2 |
| pegamento.png | pegamento | el | pe-ga-men-to | L3 | glue stick, no label | fon:pe-, P3 |
| papel.png | papel | el | pa-pel | L1 | single blank sheet of white paper, slightly tilted | vis:blanco, fon:pa-, P2 |
| sacapuntas.png | sacapuntas | el | sa-ca-pun-tas | L3 | pencil sharpener | fon:sa-, P3 |
| rotulador.png | rotulador | el | ro-tu-la-dor | L3 | felt-tip marker, green, cap on | P3 |
| estuche.png | estuche | el | es-tu-che | L1 | zipped pencil case | P3 |
| pelota.png | pelota | la | pe-lo-ta | L1 | small red bouncing ball | vis:redondo, vis:rojo, fon:pe-, P1 |
| balon.png | balón | el | ba-lón | L1 | classic black and white football | vis:redondo, P1 |
| muneca.png | muñeca | la | mu-ñe-ca | L1 | rag doll with yarn hair and dress | fon:mu-, P1 |
| cometa.png | cometa | la | co-me-ta | L1 | diamond kite with tail (a kite, not a comet) | fon:co-, P1 |
| globo.png | globo | el | glo-bo | L2 | single red party balloon on a string | vis:rojo, vis:redondo, fon:glo-, P1 |
| puzle.png | puzle | el | puz-le | L1 | four jigsaw pieces joined | P2 |
| dado.png | dado | el | da-do | L0 | white six-sided die showing dots only, no digits | espejo:d, fon:da-, P1 |
| peonza.png | peonza | la | pe-on-za | L3 | wooden spinning top | fon:pe-, P2 |
| tobogan.png | tobogán | el | to-bo-gán | L1 | playground slide | fon:to-, P2 |
| columpio.png | columpio | el | co-lum-pio | L1 | playground swing, empty | fon:co-, P2 |
| pala.png | pala | la | pa-la | L0 | small sand shovel | fon:pa-, P1 |
| peluche.png | peluche | el | pe-lu-che | L1 | teddy bear plush toy sitting | vis:marrón, fon:pe-, P2 |
| robot.png | robot | el | ro-bot | L1 | friendly toy robot, front view | P1 |
| canicas.png | canicas | las | ca-ni-cas | L1 | three glass marbles | vis:redondo, fon:ca-, P3 |
| yoyo.png | yoyó | el | yo-yó | L1 | red yo-yo with string | vis:redondo, P3 |

#### Vehículos

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| coche.png | coche | el | co-che | L1 | small blue car, side view | vis:vehículos, fon:co-, ANCLA, P1 |
| camion.png | camión | el | ca-mión | L1 | red truck, side view | vis:vehículos, fon:ca-, P1 |
| autobus.png | autobús | el | au-to-bús | L1 | yellow bus, side view, no text | vis:vehículos, vis:amarillo, P1 |
| moto.png | moto | la | mo-to | L0 | motorbike, side view | vis:vehículos, fon:mo-, P1 |
| bicicleta.png | bicicleta | la | bi-ci-cle-ta | L3 | bicycle, side view | vis:vehículos, P1 |
| tren.png | tren | el | tren | L2 | steam locomotive with one wagon, side view | vis:vehículos, fon:tr-, P1 |
| barco.png | barco | el | bar-co | L1 | small boat with sail, side view | vis:vehículos, vis:mar, P1 |
| avion.png | avión | el | a-vión | L1 | passenger airplane, side view, nose pointing right | vis:vehículos, P1 |
| cohete.png | cohete | el | co-he-te | L1 | space rocket, horizontal side view, nose pointing right | vis:vehículos, fon:co-, P1 |
| tractor.png | tractor | el | trac-tor | L2 | green farm tractor, side view | vis:vehículos, vis:granja, fon:tr-, P2 |
| helicoptero.png | helicóptero | el | he-li-cóp-te-ro | L5 | helicopter, side view | vis:vehículos, P2 |
| ambulancia.png | ambulancia | la | am-bu-lan-cia | L3 | ambulance, side view, red cross only (no text) | vis:vehículos, P2 |
| patin.png | patín | el | pa-tín | L1 | single roller skate (four wheels) | fon:pa-, P2 |
| patinete.png | patinete | el | pa-ti-ne-te | L3 | kick scooter, side view | fon:pa-, P2 |
| submarino.png | submarino | el | sub-ma-ri-no | L3 | yellow submarine, side view | vis:vehículos, vis:mar, P2 |
| canoa.png | canoa | la | ca-no-a | L3 | canoe with paddle | vis:mar, fon:ca-, P3 |
| grua.png | grúa | la | grú-a | L3 | construction crane | P3 |
| trineo.png | trineo | el | tri-ne-o | L3 | wooden sled | fon:tr-, P3 |
| furgoneta.png | furgoneta | la | fur-go-ne-ta | L3 | white van, side view | vis:vehículos, P3 |
| excavadora.png | excavadora | la | ex-ca-va-do-ra | L5 | yellow digger (excavator), side view | vis:vehículos, vis:amarillo, P3 |

#### Ropa y complementos

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| camiseta.png | camiseta | la | ca-mi-se-ta | L3 | plain green t-shirt | vis:ropa, fon:ca-, P1 |
| pantalon.png | pantalón | el | pan-ta-lón | L1 | blue jeans | vis:ropa, fon:pan-, P1 |
| falda.png | falda | la | fal-da | L1 | red skirt | vis:ropa, P1 |
| vestido.png | vestido | el | ves-ti-do | L1 | simple yellow dress | vis:ropa, P1 |
| zapato.png | zapato | el | za-pa-to | L1 | single classic brown leather dress shoe with thin dark sole and low heel, side view, toe pointing right (not a sneaker) | vis:calzado, P1 |
| bota.png | bota | la | bo-ta | L1 | single yellow rain boot | vis:calzado, fon:bo-, P1 |
| calcetin.png | calcetín | el | cal-ce-tín | L1 | single striped sock | vis:ropa, P1 |
| gorro.png | gorro | el | go-rro | L1 | knitted winter hat with pom-pom | vis:sombreros, fon:go-, P1 |
| gorra.png | gorra | la | go-rra | L1 | baseball cap with visor, side view | vis:sombreros, fon:go-, P1 |
| bufanda.png | bufanda | la | bu-fan-da | L1 | striped scarf | vis:ropa, P1 |
| guante.png | guante | el | guan-te | L1 | single blue winter glove | vis:ropa, P2 |
| abrigo.png | abrigo | el | a-bri-go | L2 | winter coat with buttons | vis:ropa, P2 |
| chaqueta.png | chaqueta | la | cha-que-ta | L1 | zipped jacket | vis:ropa, P2 |
| pijama.png | pijama | el | pi-ja-ma | L1 | two-piece pajamas with stars pattern | vis:ropa, fon:pi-, P2 |
| gafas.png | gafas | las | ga-fas | L1 | pair of eyeglasses | fon:ga-, P1 |
| sombrero.png | sombrero | el | som-bre-ro | L2 | wide-brim straw hat, side view, front pointing right, same viewpoint as the baseball cap | vis:sombreros, P2 |
| corbata.png | corbata | la | cor-ba-ta | L1 | red necktie | vis:ropa, P3 |
| cinturon.png | cinturón | el | cin-tu-rón | L1 | leather belt with buckle | P3 |
| zapatilla.png | zapatilla | la | za-pa-ti-lla | L3 | single sports sneaker, side view | vis:calzado, P2 |
| sandalia.png | sandalia | la | san-da-lia | L1 | single sandal | vis:calzado, P3 |
| boton.png | botón | el | bo-tón | L1 | single large four-hole button | vis:redondo, fon:bo-, P2 |
| collar.png | collar | el | co-llar | L1 | bead necklace | fon:co-, P2 |
| anillo.png | anillo | el | a-ni-llo | L1 | gold ring with a blue gem | vis:redondo, P2 |
| corona.png | corona | la | co-ro-na | L1 | gold royal crown | vis:amarillo, fon:co-, P1 |
| bolso.png | bolso | el | bol-so | L1 | handbag with strap | fon:bo-, P2 |
| paraguas.png | paraguas | el | pa-ra-guas | L1 | open umbrella | fon:pa-, P1 |
| maleta.png | maleta | la | ma-le-ta | L1 | suitcase with handle | fon:ma-, P2 |
| capa.png | capa | la | ca-pa | L1 | red superhero cape shown alone, flowing | fon:ca-, P3 |
| banador.png | bañador | el | ba-ña-dor | L1 | swimming trunks | vis:ropa, P3 |
| lazo.png | lazo | el | la-zo | L1 | red ribbon bow | vis:rojo, fon:la-, P3 |
| cremallera.png | cremallera | la | cre-ma-lle-ra | L3 | zipper, partly open | P3 |

#### Cuerpo

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| mano.png | mano | la | ma-no | L0 | open human hand, palm forward | vis:cuerpo, fon:ma-, P1 |
| pie.png | pie | el | pie | L1 | bare human foot, side view (a foot, not a pie) | vis:cuerpo, fon:pi-, P1 |
| cabeza.png | cabeza | la | ca-be-za | L1 | child head only, short brown hair, front view, friendly neutral smile, no neck or shoulders | vis:cuerpo, fon:ca-, P1 |
| ojo.png | ojo | el | o-jo | L1 | single human eye with eyebrow | vis:cuerpo, fon:o-, P1 |
| nariz.png | nariz | la | na-riz | L1 | human nose, front view | vis:cuerpo, P1 |
| boca.png | boca | la | bo-ca | L1 | smiling mouth with lips and teeth | vis:cuerpo, fon:bo-, P1 |
| oreja.png | oreja | la | o-re-ja | L1 | single human ear | vis:cuerpo, fon:o-, P1 |
| dedo.png | dedo | el | de-do | L0 | single index finger pointing up | vis:cuerpo, espejo:d, fon:de-, P1 |
| pelo.png | pelo | el | pe-lo | L0 | hair only: a brown wig-like shape of hair, no face | vis:cuerpo, fon:pe-, P2 |
| diente.png | diente | el | dien-te | L1 | single white tooth | vis:cuerpo, vis:blanco, P1 |
| brazo.png | brazo | el | bra-zo | L2 | human arm bent at the elbow, shown alone | vis:cuerpo, P2 |
| pierna.png | pierna | la | pier-na | L1 | human leg with foot, shown alone | vis:cuerpo, P2 |
| rodilla.png | rodilla | la | ro-di-lla | L1 | bent knee, close-up of leg | vis:cuerpo, P3 |
| lengua.png | lengua | la | len-gua | L1 | open mouth sticking out a pink tongue | vis:cuerpo, P2 |
| corazon.png | corazón | el | co-ra-zón | L1 | red heart symbol | vis:rojo, fon:co-, P1 |
| barriga.png | barriga | la | ba-rri-ga | L1 | round belly with navel, torso only | vis:cuerpo, P3 |
| una.png | uña | la | u-ña | L1 | fingertip with a painted pink nail, close-up | vis:cuerpo, P3 |
| codo.png | codo | el | co-do | L1 | bent elbow, close-up of arm | vis:cuerpo, fon:co-, P3, DESCARTADA (un brazo doblado es igual que brazo) |
| hueso.png | hueso | el | hue-so | L1 | cartoon bone | vis:blanco, P2 |
| esqueleto.png | esqueleto | el | es-que-le-to | L3 | friendly cartoon skeleton standing | vis:blanco, P3 |
| bigote.png | bigote | el | bi-go-te | L1 | curly black mustache, shown alone | P3 |

#### Naturaleza

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| sol.png | sol | el | sol | L1 | yellow sun with rays, smiling softly | vis:amarillo, vis:redondo, vis:cielo, fon:so-, P1 |
| luna.png | luna | la | lu-na | L0 | crescent moon | vis:cielo, fon:lu-, P1 |
| estrella.png | estrella | la | es-tre-lla | L2 | five-point yellow star | vis:amarillo, vis:cielo, P1 |
| nube.png | nube | la | nu-be | L1 | fluffy white cloud | vis:cielo, vis:blanco, fon:nu-, P1 |
| lluvia.png | lluvia | la | llu-via | L1 | grey cloud with falling raindrops | vis:cielo, P1 |
| arcoiris.png | arcoíris | el | ar-co-í-ris | L3 | rainbow arc | vis:cielo, P1 |
| arbol.png | árbol | el | ár-bol | L1 | round green tree with brown trunk | vis:verde, vis:plantas, P1 |
| flor.png | flor | la | flor | L2 | single simple flower with five petals and stem | vis:plantas, fon:fl-, P1 |
| hoja.png | hoja | la | ho-ja | L1 | single green leaf | vis:verde, vis:plantas, P1 |
| montana.png | montaña | la | mon-ta-ña | L1 | mountain with snowy peak | fon:mon-, P1 |
| rio.png | río | el | rí-o | L3 | winding blue river between green banks, top view | vis:azul, P2 |
| playa.png | playa | la | pla-ya | L2 | beach: sand, sea and a parasol | fon:pla-, P2 |
| fuego.png | fuego | el | fue-go | L1 | campfire flames on logs | vis:naranja, P1 |
| piedra.png | piedra | la | pie-dra | L2 | grey rounded stone | vis:gris, fon:pi-, P2 |
| cactus.png | cactus | el | cac-tus | L1 | green cactus in a pot | vis:verde, vis:plantas, P2 |
| rosa.png | rosa | la | ro-sa | L1 | single red rose with stem | vis:rojo, vis:plantas, fon:ro-, P2 |
| girasol.png | girasol | el | gi-ra-sol | L1 | sunflower | vis:amarillo, vis:plantas, P2 |
| trebol.png | trébol | el | tré-bol | L2 | four-leaf clover | vis:verde, vis:plantas, fon:tr-, P3 |
| rayo.png | rayo | el | ra-yo | L1 | yellow lightning bolt | vis:amarillo, vis:cielo, fon:ra-, P2 |
| volcan.png | volcán | el | vol-cán | L1 | volcano with a little lava | P2 |
| isla.png | isla | la | is-la | L1 | small island with one palm tree | P3 |
| ola.png | ola | la | o-la | L0 | single ocean wave | vis:azul, vis:mar, fon:o-, P3 |
| planeta.png | planeta | el | pla-ne-ta | L2 | ringed planet | vis:cielo, fon:pla-, P2 |
| nido.png | nido | el | ni-do | L0 | bird nest with three eggs | fon:ni-, P2 |
| cueva.png | cueva | la | cue-va | L1 | cave entrance in a rock | P3 |
| tronco.png | tronco | el | tron-co | L2 | cut log, side view | vis:marrón, fon:tr-, P3 |
| bellota.png | bellota | la | be-llo-ta | L1 | acorn | vis:marrón, P3 |
| margarita.png | margarita | la | mar-ga-ri-ta | L3 | daisy with white petals and yellow center | vis:plantas, vis:blanco, P3 |
| tulipan.png | tulipán | el | tu-li-pán | L1 | red tulip with stem | vis:plantas, vis:rojo, P3 |
| palmera.png | palmera | la | pal-me-ra | L1 | palm tree | vis:plantas, vis:verde, P2 |
| pino.png | pino | el | pi-no | L0 | pine tree, triangular, green | vis:plantas, vis:verde, fon:pi-, P1 |
| rama.png | rama | la | ra-ma | L1 | tree branch with a few leaves | vis:plantas, fon:ra-, P3 |

#### Lugares y construcciones

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| castillo.png | castillo | el | cas-ti-llo | L1 | stone castle with towers and flags | vis:edificios, P1 |
| escuela.png | escuela | la | es-cue-la | L1 | school building with a bell, no text | vis:edificios, P2 |
| tienda.png | tienda | la | tien-da | L1 | small shop front with striped awning, no text | vis:edificios, P3 |
| puente.png | puente | el | puen-te | L1 | arched stone bridge | P2 |
| faro.png | faro | el | fa-ro | L1 | striped lighthouse | vis:edificios, vis:mar, P2 |
| iglu.png | iglú | el | i-glú | L2 | igloo | vis:blanco, P3 |
| cabana.png | cabaña | la | ca-ba-ña | L1 | wooden log cabin | vis:edificios, fon:ca-, P3 |
| torre.png | torre | la | to-rre | L1 | tall stone tower | vis:edificios, fon:to-, P3 |
| granja.png | granja | la | gran-ja | L2 | red barn with silo | vis:edificios, vis:granja, P2 |
| hospital.png | hospital | el | hos-pi-tal | L1 | hospital building with red cross, no text | vis:edificios, P3 |
| piscina.png | piscina | la | pis-ci-na | L1 | swimming pool with ladder, top view | vis:azul, P3 |
| molino.png | molino | el | mo-li-no | L1 | windmill | vis:edificios, fon:mo-, P3 |
| piramide.png | pirámide | la | pi-rá-mi-de | L3 | Egyptian pyramid | fon:pi-, P3 |
| jaula.png | jaula | la | jau-la | L1 | empty bird cage | P3 |
| semaforo.png | semáforo | el | se-má-fo-ro | L3 | traffic light with three colors | P2 |
| buzon.png | buzón | el | bu-zón | L1 | yellow Spanish-style mailbox, no text | vis:amarillo, P3 |
| fuente.png | fuente | la | fuen-te | L1 | park fountain with water | P3 |
| farola.png | farola | la | fa-ro-la | L1 | street lamp | P3 |

#### Herramientas y objetos

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| martillo.png | martillo | el | mar-ti-llo | L1 | claw hammer | vis:herramientas, fon:mar-, P1 |
| tornillo.png | tornillo | el | tor-ni-llo | L1 | single screw | vis:herramientas, fon:tor-, P3 |
| sierra.png | sierra | la | sie-rra | L1 | handsaw | vis:herramientas, P2 |
| clavo.png | clavo | el | cla-vo | L2 | single iron nail | vis:herramientas, P3 |
| rastrillo.png | rastrillo | el | ras-tri-llo | L2 | garden rake | vis:herramientas, P3 |
| regadera.png | regadera | la | re-ga-de-ra | L3 | green watering can | vis:verde, P2 |
| caja.png | caja | la | ca-ja | L1 | closed cardboard box | vis:marrón, fon:ca-, P1 |
| bolsa.png | bolsa | la | bol-sa | L1 | paper shopping bag with handles, blank | fon:bo-, P2 |
| regalo.png | regalo | el | re-ga-lo | L1 | wrapped gift box with bow | P1 |
| campana.png | campana | la | cam-pa-na | L1 | golden bell | vis:amarillo, fon:cam-, P2 |
| bandera.png | bandera | la | ban-de-ra | L1 | plain green flag on a pole | espejo:b, P2 |
| cuerda.png | cuerda | la | cuer-da | L1 | coiled rope | fon:cu-, P3 |
| linterna.png | linterna | la | lin-ter-na | L1 | flashlight, switched on | P2 |
| brujula.png | brújula | la | brú-ju-la | L2 | compass with needle, no letters | vis:redondo, P3 |
| lupa.png | lupa | la | lu-pa | L0 | magnifying glass | vis:redondo, fon:lu-, P1 |
| pila.png | pila | la | pi-la | L0 | single AA battery, no text | vis:alargado, fon:pi-, P2 |
| camara.png | cámara | la | cá-ma-ra | L1 | photo camera, front view | fon:ca-, P2 |
| carta.png | carta | la | car-ta | L1 | folded letter page coming out of an envelope | fon:car-, P3 |
| sobre.png | sobre | el | so-bre | L2 | closed white envelope | vis:blanco, fon:so-, P3 |
| sello.png | sello | el | se-llo | L1 | postage stamp with a simple flower design, no text | fon:se-, P3 |
| moneda.png | moneda | la | mo-ne-da | L1 | gold coin with a star, no numbers | vis:redondo, vis:amarillo, fon:mo-, P2 |
| cofre.png | cofre | el | co-fre | L2 | wooden treasure chest, closed | vis:marrón, fon:co-, P2 |
| mapa.png | mapa | el | ma-pa | L0 | folded treasure map with a dotted path and an X | fon:ma-, P2 |
| silbato.png | silbato | el | sil-ba-to | L1 | referee whistle | P3 |
| medalla.png | medalla | la | me-da-lla | L1 | gold medal on a ribbon, no numbers | vis:redondo, vis:amarillo, fon:me-, P3 |
| copa.png | copa | la | co-pa | L1 | gold trophy cup with two handles | vis:amarillo, fon:co-, P2 |
| ancla.png | ancla | el | an-cla | L2 | ship anchor | vis:mar, P3 |
| iman.png | imán | el | i-mán | L1 | red and grey horseshoe magnet | vis:rojo, P3 |
| aguja.png | aguja | la | a-gu-ja | L1 | sewing needle with thread | P3 |
| hilo.png | hilo | el | hi-lo | L1 | spool of blue thread | P3 |
| lana.png | lana | la | la-na | L0 | ball of wool yarn with two knitting needles | fon:la-, P2 |
| tubo.png | tubo | el | tu-bo | L1 | plain short pipe tube | vis:alargado, fon:tu-, P3 |
| palo.png | palo | el | pa-lo | L0 | plain wooden stick | vis:alargado, vis:marrón, fon:pa-, P2 |
| rueda.png | rueda | la | rue-da | L1 | car wheel with tire | vis:redondo, P2 |
| candado.png | candado | el | can-da-do | L1 | closed padlock | P3 |
| cadena.png | cadena | la | ca-de-na | L1 | short metal chain | fon:ca-, P3 |
| balanza.png | balanza | la | ba-lan-za | L1 | two-pan balance scale | P3 |
| termometro.png | termómetro | el | ter-mó-me-tro | L3 | thermometer without numbers | vis:alargado, P3 |
| tirita.png | tirita | la | ti-ri-ta | L1 | adhesive bandage | P3 |
| pesa.png | pesa | la | pe-sa | L0 | small dumbbell | fon:pe-, P3 |
| red.png | red | la | red | L1 | fishing net | vis:mar, P3 |
| sal.png | sal | la | sal | L1 | salt shaker | fon:sa-, P3 |

#### Instrumentos musicales

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| guitarra.png | guitarra | la | gui-ta-rra | L2 | acoustic guitar | vis:instrumentos, P1 |
| piano.png | piano | el | pia-no | L1 | upright piano | vis:instrumentos, fon:pi-, P1 |
| violin.png | violín | el | vio-lín | L1 | violin with bow | vis:instrumentos, P2 |
| tambor.png | tambor | el | tam-bor | L1 | drum with two sticks | vis:instrumentos, P1 |
| flauta.png | flauta | la | flau-ta | L2 | recorder flute, upright vertical, straight front view, complete body and finger holes visible | vis:instrumentos, vis:viento, fon:fl-, P1 |
| trompeta.png | trompeta | la | trom-pe-ta | L2 | brass trumpet, upright vertical, front view, entire instrument visible | vis:instrumentos, vis:viento, fon:tr-, P2 |
| clarinete.png | clarinete | el | cla-ri-ne-te | L3 | black clarinet, upright vertical, front view, entire instrument visible | vis:instrumentos, vis:viento, P2 |
| saxofon.png | saxofón | el | sa-xo-fón | L1 | brass saxophone, upright vertical, front view, entire instrument visible | vis:instrumentos, vis:viento, fon:sa-, P2 |
| trombon.png | trombón | el | trom-bón | L2 | brass trombone, upright vertical, front view, entire instrument visible | vis:instrumentos, vis:viento, fon:tr-, P2 |
| tuba.png | tuba | la | tu-ba | L1 | brass tuba, upright vertical, front view, entire instrument visible | vis:instrumentos, vis:viento, fon:tu-, P2 |
| bateria.png | batería | la | ba-te-rí-a | L3 | drum kit | vis:instrumentos, P2 |
| maracas.png | maracas | las | ma-ra-cas | L1 | pair of maracas | vis:instrumentos, fon:ma-, P2 |
| pandereta.png | pandereta | la | pan-de-re-ta | L3 | tambourine | vis:instrumentos, vis:redondo, fon:pan-, P2 |
| xilofono.png | xilófono | el | xi-ló-fo-no | L3 | colorful toy xylophone with two mallets | vis:instrumentos, P2 |
| acordeon.png | acordeón | el | a-cor-de-ón | L3 | accordion | vis:instrumentos, P3 |
| arpa.png | arpa | el | ar-pa | L1 | harp | vis:instrumentos, P3 |
| castanuelas.png | castañuelas | las | cas-ta-ñue-las | L3 | pair of castanets | vis:instrumentos, P3 |
| armonica.png | armónica | la | ar-mó-ni-ca | L3 | harmonica, upright vertical, front view, clearly visible row of holes | vis:instrumentos, vis:viento, P3 |
| microfono.png | micrófono | el | mi-cró-fo-no | L3 | handheld microphone | P3 |

#### Personajes y profesiones

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| bombero.png | bombero | el | bom-be-ro | L1 | firefighter with helmet and hose, full body | vis:personas, fon:bo-, P2 |
| medico.png | médico | el | mé-di-co | L1 | doctor with white coat and stethoscope, full body | vis:personas, fon:me-, P2 |
| policia.png | policía | el | po-li-cí-a | L3 | police officer in uniform with cap, full body | vis:personas, fon:po-, P2 |
| cocinero.png | cocinero | el | co-ci-ne-ro | L3 | chef with tall white hat holding a spoon, full body | vis:personas, fon:co-, P2 |
| pirata.png | pirata | el | pi-ra-ta | L1 | friendly pirate with hat and eye patch, no weapon | vis:personas, fon:pi-, P1 |
| rey.png | rey | el | rey | L1 | king with crown and red cape, full body | vis:personas, P2 |
| reina.png | reina | la | rei-na | L1 | queen with crown and gown, full body | vis:personas, P2 |
| bruja.png | bruja | la | bru-ja | L2 | friendly witch with pointed hat and broom | vis:personas, P1 |
| dragon.png | dragón | el | dra-gón | L2 | friendly green dragon with small wings | vis:verde, P1 |
| fantasma.png | fantasma | el | fan-tas-ma | L1 | cute white ghost | vis:blanco, P1 |
| astronauta.png | astronauta | el | as-tro-nau-ta | L3 | astronaut in white spacesuit with helmet | vis:personas, vis:blanco, P1 |
| princesa.png | princesa | la | prin-ce-sa | L2 | princess with small crown and pink dress | vis:personas, P2 |
| mago.png | mago | el | ma-go | L1 | magician with top hat and wand | vis:personas, fon:ma-, P2 |
| hada.png | hada | el | ha-da | L1 | fairy with wings and wand | vis:personas, P2 |
| unicornio.png | unicornio | el | u-ni-cor-nio | L3 | white unicorn with rainbow mane | vis:blanco, P1 |
| dinosaurio.png | dinosaurio | el | di-no-sau-rio | L3 | friendly green long-neck dinosaur | vis:verde, P1 |
| sirena.png | sirena | la | si-re-na | L1 | mermaid with green tail, sitting | vis:mar, fon:si-, P2 |
| caballero.png | caballero | el | ca-ba-lle-ro | L3 | knight in armor with shield, no sword | vis:personas, fon:ca-, P3 |
| monstruo.png | monstruo | el | mons-truo | L3 | cute fluffy purple monster with one horn | vis:morado, P2 |
| payaso.png | payaso | el | pa-ya-so | L1 | clown with red nose and colorful outfit | vis:personas, fon:pa-, P1 |
| bebe.png | bebé | el | be-bé | L1 | smiling baby in a onesie, sitting | vis:personas, espejo:b, P1 |
| superheroe.png | superhéroe | el | su-per-hé-ro-e | L5 | superhero with mask and cape, no logo on chest | vis:personas, P3 |
| duende.png | duende | el | duen-de | L1 | small elf with green hat and pointed ears | vis:personas, vis:verde, P3 |
| granjero.png | granjero | el | gran-je-ro | L2 | farmer with straw hat and overalls | vis:personas, vis:granja, P3 |
| cartero.png | cartero | el | car-te-ro | L1 | mail carrier with bag and a letter | vis:personas, fon:car-, P3 |

#### Pares y palabras cortas (niveles bajos y grupos fonológicos)

Palabras cortas y pares mínimos que no caben en otra categoría. Son las que permiten nombres
legibles en Level0 y Level1 y los grupos de parecido fonológico de Level9 y Level10 (casa, taza,
cara, copa, capa, cuna; pato, pala, pan, pino, patín, payaso; mono, mano; dado, dedo).

| Fichero | Nombre | Art. | Sílabas | Lect. | Pista visual | Etiquetas, prio |
|---|---|---|---|---|---|---|
| cara.png | cara | la | ca-ra | L1 | simple round smiling face icon: eyes, eyebrows, nose, mouth and ears, NO hair and no neck (must look different from cabeza, which has hair) | fon:ca-, P2 |
| polo.png | polo | el | po-lo | L0 | ice lolly on a stick, orange | fon:po-, P2 |
| lima.png | lima | la | li-ma | L0 | green lime fruit, whole | vis:verde, vis:redondo, fon:li-, P3 |
| lata.png | lata | la | la-ta | L0 | plain tin can without label | fon:la-, P2 |
| ala.png | ala | el | a-la | L0 | single feathered bird wing | fon:a-, P3 |
| mota.png | mota | la | mo-ta | L0 | single large polka dot on a small piece of fabric | fon:mo-, P3, DESCARTADA (un lunar sobre tela no se nombra "mota") |
| nata.png | nata | la | na-ta | L0 | swirl of whipped cream in a small bowl | vis:blanco, fon:na-, P3 |
| tapon.png | tapón | el | ta-pón | L1 | cork stopper | fon:ta-, P3 |
| pipa.png | pipa | la | pi-pa | L0 | single sunflower seed with striped shell | fon:pi-, P3 |
| nene.png | nene | el | ne-ne | L0 | toddler standing, smiling | vis:personas, fon:ne-, P3 |
| dama.png | dama | la | da-ma | L0 | elegant lady in a long dress | vis:personas, fon:da-, P3, DESCARTADA (se confunde con princesa) |
| tela.png | tela | la | te-la | L0 | folded piece of blue fabric | fon:te-, P3, DESCARTADA (una tela doblada es igual que la toalla) |
| suma.png | suma | la | su-ma | L0 | plus sign made of two wooden blocks (no digits) | fon:su-, P3, DESCARTADA (el signo más de madera se lee "cruz") |

Nota para esta última tabla: son palabras de apoyo para completar grupos; si una no se ilustra
sin ambigüedad (mota, suma, tela), se descarta sin más.

### 5.7 Grupos ya previstos (para montar actividades)

Los generadores de ejercicios usan estas agrupaciones; conviene que, dentro de cada grupo, las
imágenes compartan silueta y tamaño pero se distingan a primera vista.

- **Parecido visual, forma o color** (etiquetas vis:): cánidos (perro, lobo, zorro, hiena,
  coyote); felinos (gato, tigre, león, puma, leopardo, pantera, lince, guepardo); grises
  (elefante, hipopótamo, rinoceronte, foca, tiburón, koala, piedra); rojo redondo (manzana,
  tomate, cereza, granada, pelota, globo, mariquita); amarillo (plátano, limón, sol, pollito,
  queso, maíz, autobús, lápiz, estrella, corona); verde (pera, kiwi, rana, tortuga, cocodrilo,
  serpiente, lechuga, pepino, cactus, dragón, dinosaurio); redondo (naranja, balón, reloj, galleta,
  moneda, medalla, rueda, botón, anillo); aves (pájaro, paloma, loro, búho, águila, cigüeña,
  flamenco, pingüino, gallina, pato, pavo); instrumentos de viento (flauta, trompeta, clarinete,
  saxofón, trombón, tuba, armónica); vehículos (coche, camión, autobús, moto, tractor,
  ambulancia, furgoneta); sombreros (gorro, gorra, sombrero); calzado (zapato, bota, zapatilla,
  sandalia).
- **Misma sílaba inicial** (etiquetas fon:): pa- (pato, pala, pan, patín, payaso, pavo, papel,
  paloma, pájaro, patata, pantalón, paraguas); ca- (casa, cama, capa, cara, caja, cabra,
  caballo, camión, caracol, cámara, camiseta, calabaza); ma- (mano, mapa, manzana, maleta,
  mariposa, mariquita, maracas, maceta, martillo); pe- (pera, pelo, pelota, peine, perro, pez,
  pesa, peluche, pepino); co- (coche, copa, cohete, cometa, conejo, corona, collar, cofre, cojín,
  codo, corazón); bo- (bota, boca, bolsa, botella, botón, bolso, bombilla, bocadillo); to- (toro,
  topo, tomate, toalla, tobogán, torre); mo- (moto, mono, mochila, mosca, moneda, molino); lu-
  (luna, lupa); pi- (pino, piano, pie, piña, pila, pizarra, pijama, pimiento, pirata).
- **Pares mínimos y casi mínimos** (Level10): casa, taza, cara, copa, capa, cuna; pato, palo,
  pala, pavo, pan; gorro, gorra; dado, dedo; bota, boca; mono, mano; pino, piano; oso, ojo,
  olla, ola; luna, lupa, lana, lima, lata; polo, pelo, palo; sol, sal.
- **Parejas casi iguales que solo deben coincidir en un grupo de Level8 o superior** (en los
  niveles bajos la pregunta "¿en qué posición estaba?" sería injusta): naranja y mandarina; carta y
  sobre; gusano y oruga; pierna y rodilla; rana y sapo; leopardo y guepardo; lobo y coyote.
- **Letras espejo en el nombre** (b, d, p, q, para la discriminación visual): bebé, dado, dedo,
  bota, pato, búho, burro, pulpo, puma, queso, bombilla, bandera, pelota, pipa, dama, polo.

**En catalán** (FASE 18, 05; nombres del bloque ca del manifiesto):

- **Parejas que dejan de serlo**: pilota es balón y pelota (se deja usable balón); clau es llave
  y clavo (usable llave); cargol es caracol y tornillo (usable caracol); bossa es bolsa y bolso
  (usable bolsa). No usables en catalán, además, pavo (gall dindi), yoyo (io-io), arcoíris (arc de
  Sant Martí), girasol (gira-sol) y maíz (blat de moro): varias palabras o guion.
- **Pares mínimos nuevos** (no van juntos en un grupo por debajo de Level8; en Level10 son el
  material): gat, got y gos (gato, vaso, perro); llit y llet (cama, leche); gerro y gerra (jarrón,
  jarra); tapa y tap (tapa, tapón); ós y os (oso, hueso: solo cambia el acento); sal y sol; cap,
  capa y copa (cabeza, capa, copa).
- **Misma sílaba inicial en catalán**: pa- (pala, pa, patí, paper, pastís, pallasso, pantalons,
  papallona); ca- (casa, cap, capa, cara, caixa, cabra, cavall, camió, cargol, càmera); po- (poma,
  polo, pop, porc, pont, porta); ma- (mà, mapa, maleta, maduixa, martell, magrana). Los grupos
  castellanos de sílaba inicial no valen en catalán (pato es ànec, perro es gos): se eligen con
  las etiquetas fon: del bloque ca.
- Las parejas casi iguales de arriba (naranja y mandarina, rana y sapo...) y las de letras espejo
  valen igual en los dos idiomas: son la misma imagen.

### 5.8 Qué devolver

1. Las tres anclas para aprobación (antes de nada).
2. Por lote: la carpeta de PNG finales, la hoja de contacto y el manifest.json actualizado.
3. Al final: resumen con el número de aceptadas, descartadas (con motivo) y las palabras cuya
   pista visual hubo que cambiar, para actualizar esta tabla.

### 5.9 Mensaje para cada lote (si se trabaja en el chat de ChatGPT)

El chat no sabe qué hay ya en la carpeta: hay que decírselo en cada mensaje. La regla es que
**solo genera lo que va en la lista numerada** y que las imágenes ya aprobadas viajan adjuntas
como referencia de estilo, nunca como trabajo pendiente. Si es una conversación nueva, pegar antes
el prompt completo (desde el título "Prompt") y adjuntar los PNG aprobados.

Plantilla (sustituir lo que va entre llaves):

> Las imágenes adjuntas ({lista de ficheros aprobados}) están aprobadas y son la referencia de
> estilo del banco: úsalas como referencia en cada imagen que generes. No las vuelvas a generar ni
> las retoques. Tampoco generes ninguna palabra que no esté en la lista de abajo.
>
> Lote {n}: genera estas palabras, de una en una y en este orden, con el mismo bloque de estilo,
> el mismo encuadre y el mismo posproceso que las anclas (512 x 512, PNG con transparencia, recorte
> al contenido y margen del 14 %, alfa fijado a 255 por encima de 240 y a 0 por debajo de 16).
> Nombre de fichero exacto, sin sufijos:
>
> 1. {fichero}: {pista visual}
> 2. ...
>
> Antes de entregar, revisa: {parejas que deben distinguirse y palabras con riesgo de ambigüedad
> del lote}. Ninguna imagen lleva cifras, letras ni logotipos.
>
> Entrega: los PNG del lote, una hoja de contacto con todas las imágenes aprobadas hasta ahora más
> las nuevas, con el nombre de fichero debajo de cada una (solo en la hoja, nunca dentro del PNG),
> y el manifiesto con estado "aceptada" para las aprobadas y "candidatas" para las nuevas. Si una
> palabra no sale sin ambigüedad en tres intentos, márcala como descartada con el motivo y sigue
> con la siguiente.

Primer lote de prueba propuesto (elegido para estresar lo difícil antes del volumen): perro, lobo,
zorro (cánidos que deben distinguirse por color y orejas), gorro y gorra, pato y pollito, pie (un
pie, no una tarta), pila (eléctrica, sin texto) y dado (solo puntos, sin cifras).
