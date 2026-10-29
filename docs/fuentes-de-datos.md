# Fuentes de datos del contenido

Registro de todas las fuentes externas y de criterio de las que salen los ejercicios: listas de
frecuencia, anotación lingüística, criterios pedagógicos, imágenes y generación de textos. Sirve
para que la app y la web puedan documentar de dónde sale cada dato y dar veracidad a los
ejercicios, y para saber qué licencia obliga a qué.

**Regla**: toda fuente nueva que se use para generar, filtrar o validar contenido se añade aquí
**antes** de usarla en un lote, con su cita, versión, fecha de obtención, licencia, uso y ubicación.
Los ficheros con licencia viven en `shine/private/lexico/fuentes/` (fuera de git); este registro sí
está en git.

Última actualización: 2026-10-28.

## 1. Frecuencia léxica y anotación (puerta léxica, `shine/content/generadores/lexico.py`)

### 1.1 CORPES XXI (Real Academia Española)

| Campo | Valor |
|---|---|
| Cita | REAL ACADEMIA ESPAÑOLA: Banco de datos (CORPES XXI) [en línea]. *Corpus del Español del Siglo XXI* (CORPES). https://www.rae.es. Listado de frecuencias de elementos, versión 1.5. |
| Qué es | Corpus de referencia del español del siglo XXI, escrito y oral, de España y América (453 millones de formas sin signos ortográficos en el listado). Forma, lema, etiqueta morfológica y frecuencia. |
| Obtenido | 2026-10-28, facilitado por el grupo de expertos (`frecuencia_elementos_corpes_1_5.txt`). |
| Ubicación | `shine/private/lexico/fuentes/frecuencia_elementos_corpes_1_5.txt` (fuera de git) |
| Licencia | Datos de la RAE. Uso interno del proyecto, sin redistribución. **Pendiente de confirmar con la RAE** las condiciones de uso en un producto comercial y cómo citarlo en la app. |
| Uso | Fuente principal de `es-general.csv` (encargo E01): frecuencia, rango, lema y categoría de cada forma del castellano. Decide qué palabras admite cada nivel de Level3 a Level10. |
| Tratamiento | Elementos de varias palabras repartidos entre sus palabras; formas de "vosotros" con el rango de su equivalente de tercera del plural (ajuste peninsular). Detalle en `plans/contenido/encarrecs/lliuraments/E01-revisio.md`. |

### 1.2 SUBTLEX-ESP

| Campo | Valor |
|---|---|
| Cita | Cuetos, F., Glez-Nosti, M., Barbón, A. y Brysbaert, M. (2011). SUBTLEX-ESP: Spanish word frequencies based on film subtitles. *Psicológica*, 32, 133-143. Datos: https://osf.io/xp6sz/ |
| Qué es | Frecuencias del castellano en subtítulos de películas y series (40 millones de palabras, 94.261 formas). Referencia psicolingüística: predice mejor los tiempos de lectura que las frecuencias de texto escrito. |
| Obtenido | 2026-10-28, `SUBTLEX-ESP.xlsx` del OSF oficial (Marc Brysbaert). |
| Ubicación | `shine/private/lexico/fuentes/subtlex-esp/` (xlsx original, `license.txt` y `subtlex-esp.tsv` convertido) |
| Licencia | **CC BY-NC-SA 4.0** (atribución, **no comercial**, compartir igual). |
| Uso | Solo columna de consulta en `es-general.csv` (`frecuencia_subtlex`, `rango_subtlex`) para la revisión de los expertos. **No entra en el rango de la puerta léxica** por la cláusula no comercial: antes de que influya en el contenido de una app de pago hay que pedir permiso a los autores. |

### 1.3 wordfreq

| Campo | Valor |
|---|---|
| Cita | Speer, R. (2022). *rspeer/wordfreq* v3.0. Zenodo. https://doi.org/10.5281/zenodo.7199437 (paquete 3.1.1). |
| Qué es | Frecuencias combinadas de subtítulos (OpenSubtitles), Wikipedia, noticias, libros (Google Books), redes sociales y web. |
| Obtenido | 2026-10-28, paquete de PyPI (lista "large" del español). |
| Licencia | Datos CC BY-SA 4.0; código Apache 2.0. |
| Uso | Versión 1 de `es-general.csv` (antes de tener el CORPES); hoy columna de contraste (`frecuencia_wordfreq`, `rango_wordfreq`). |

### 1.4 Universal Dependencies: UD_Spanish-AnCora y UD_Spanish-GSD

| Campo | Valor |
|---|---|
| Cita | Taulé, M., Martí, M. A. y Recasens, M. (2008). AnCora: Multilevel Annotated Corpora for Catalan and Spanish. *LREC 2008*. McDonald, R. et al. (2013). Universal Dependency Annotation for Multilingual Parsing. *ACL 2013*. Treebanks en https://universaldependencies.org, versión 2.18 (commits 20adddb y 267f353, 2026-05-06). |
| Qué es | Corpus del castellano con lema y categoría anotados a mano. |
| Obtenido | 2026-10-28, repositorios de GitHub de UniversalDependencies. |
| Licencia | AnCora: CC BY 4.0. GSD: CC BY-SA 4.0. |
| Uso | Lema y categoría de la versión 1 de `es-general.csv`; de esa revisión salen los descartes y las marcas que conserva la versión 2. |

### 1.5 Catalán: wordfreq, UD_Catalan-AnCora y Softcatalà (encargo E02)

| Fuente | Cita y versión | Licencia | Uso |
|---|---|---|---|
| wordfreq (catalán) | Speer, R. (2022), ver 1.3; lista "large" del catalán (Viquipèdia, subtítulos, noticias, web, redes; todo el dominio lingüístico). Obtenido 2026-10-28. | Datos CC BY-SA 4.0 | Frecuencia y rango principales de `ca-general.csv`. Se eligió frente a la lista de Softcatalà porque documenta sus corpus. |
| UD_Catalan-AnCora | Taulé, M., Martí, M. A. y Recasens, M. (2008), ver 1.4; Universal Dependencies 2.18 (commit 7f3d23e, 2026-05-06). | CC BY 4.0 | Lema y categoría anotados a mano (primera opción). |
| Diccionari de Softcatalà (catalan-dict-tools) | Softcatalà, *catalan-dict-tools*, https://github.com/Softcatala/catalan-dict-tools, commit 32d7abc (2026-10-28): diccionario morfológico de LanguageTool (1,29 millones de formas con lema y etiqueta EAGLES) y clasificación de diacríticos antiguos y de la norma del IEC de 2017. | LGPL 2.1 o GPL 2.0 | Lema y categoría cuando UD no tiene la forma; columna `en_diccionari`; conversión de los diacríticos antiguos ("dóna" pasa a "dona") a la norma del 2017. |
| Frecuencias de Softcatalà | Mismo repositorio, `frequencies/frequencies-dict-forms.txt` y `frequencies-dict-lemmas.txt` (commit de 2019, 127 millones de apariciones de formas del diccionario). El repositorio no documenta de qué corpus salen. | LGPL 2.1 o GPL 2.0 | Columna de contraste `frecuencia_softcatala`; frecuencia de lema para elegir entre lecturas del diccionario. |

Copias en `shine/private/lexico/fuentes/softcatala/`. Pendiente: el CTILC del IEC, fuente
normativa recomendada por el grupo, que no tiene exportación abierta.

### 1.6 Vocabulario infantil (encargos E03 y E04)

| Campo | Valor |
|---|---|
| Qué es | `es-infantil.csv` y `ca-infantil.csv`: vocabulario de 5 a 7 años por nivel (0, 1, 2), con sus formas flexionadas. Mandan en la puerta léxica de Level0 a Level2. |
| Método | Proceso híbrido aprobado por el grupo el 2026-10-28 (sin acceso a LEXESP, BDLOC ni PRODISCAT): lemas candidatos de las listas generales (secciones 1.1 y 1.5), del banco de imágenes (sección 3) y de los lotes de Level0 a Level2 revisados por el grupo; vocabulario infantil añadido por temas y nivel de cada lema asignado por Claude (Anthropic), modelo Opus; formas del CORPES XXI (castellano) y del diccionario de Softcatalà (catalán). |
| Estructura | Columna `estructura_min` calculada con `shine/content/generadores/estructura.py` a partir de la tabla de nivel mínimo por estructura del catálogo (criterio del grupo de expertos). |
| Validación | Pendiente de la revisión del grupo (`plans/contenido/encarrecs/lliuraments/E03-revisio.md` y `E04-revisio.md`). |
| Ubicación | `shine/private/lexico/{es,ca}-infantil.csv`; tubería en `shine/private/lexico/build/infantil/`. |
| Pendiente | Sustituir o contrastar con una fuente infantil de referencia (LEXESP, BDLOC, listas escolares) cuando haya acceso. |

### 1.7 Material derivado: pseudopalabras y matriz (encargos E05 a E08)

| Campo | Valor |
|---|---|
| Pseudopalabras (E05, E06) | Candidatas propuestas por Claude (Anthropic), modelo Opus; filtradas con `shine/content/generadores/pseudo_filtre.py` contra las fuentes de las secciones 1.1, 1.5 y 1.6 (que no existan, que no se lean como una palabra con una letra cambiada, estructura y longitud del nivel). Los agentes de Opus consultaron además SUBTLEX-ESP (sección 1.2) solo para descartar candidatas que existen; no aporta ningún dato al banco. |
| Matriz (E07, E08) | Generada con `shine/content/generadores/matriz_conjuntos.py` (semilla fija) a partir de las listas infantiles y generales; los distractores de Level9 se comprueban contra las mismas fuentes. |
| Validación | Pendiente del grupo (`plans/contenido/encarrecs/lliuraments/E05-E06-revisio.md` y `E07-E08-revisio.md`). |

### 1.8 Revisión por modelo de lenguaje

| Campo | Valor |
|---|---|
| Qué es | Claude (Anthropic), modelo Opus: revisión forma a forma de las listas (lema, categoría, descartes, marcas malsonante, americano, extranjera). |
| Fecha | 2026-10-28: castellano, 35.804 formas (versión 1, 8 tandas) y 1.772 formas del CORPES (versión 2); catalán, 36.000 formas (8 tandas, `shine/private/lexico/build/ca-general/`); vocabulario infantil, 3.314 lemas castellanos y 3.340 catalanes clasificados por edad y 1.541 añadidos por temas (`build/infantil/`). |
| Instrucciones | `shine/private/lexico/build/es-general/instrucciones.md`; salidas en `build/es-general/out/` y `v2/`. |
| Validación | Pendiente de la revisión del grupo de expertos (`plans/contenido/encarrecs/lliuraments/E01-revisio.md`). |

## 2. Criterios pedagógicos y clínicos

Documentos del grupo de expertos que fijan las reglas de
los ejercicios. Son la fuente de autoridad de la escala de niveles, la taxonomía fonológica y los
parámetros de cada tipo.

| Documento | Contenido | Ubicación |
|---|---|---|
| Especificación técnica del generador (v2.0, 2026-10-16) | Principios clínicos: andamiaje subléxico, islas de alivio, contención del muro de texto, reducción del hacinamiento visual | `docs/generador/Especificación Dislexia.md` |
| Taxonomía fonológica (castellano y catalán) | Agrupación de letras y sílabas por sonoridad y por esfuerzo de decodificación | `docs/generador/Taxonomía fonológica.md`, `... (català).md` |
| Guía de parametrización (castellano y catalán) | Parámetros y ejemplos por tipo de ejercicio y nivel | `docs/generador/Guía de Parametrización.md`, `... (català).md` |
| Estructura del catalán | Escala catalana, términos fonológicos, nivel mínimo por estructura | `plans/multiidioma/estructura-ca.md`, `plans/multiidioma/Shine en Catalán.md` |
| Respuestas y decisiones del grupo | Revisión de lotes catalanes, listas de frecuencia, decisiones E10 (lectura de un párrafo de 35 a 80 palabras, nombres propios, tabla de nivel mínimo, orden de lotes) | `plans/multiidioma/resposta-*.md`, `plans/multiidioma/respostes-dubtes-expert.md` |

Las referencias bibliográficas que citan esos documentos (las llamadas numeradas del texto) no
están recogidas todavía: **pendiente pedir al grupo la bibliografía completa** para poder citarla en
la web.

## 3. Imágenes

| Campo | Valor |
|---|---|
| Qué es | Banco de 432 ilustraciones vectoriales planas de objetos cotidianos (posición de imágenes y ordena las sílabas). |
| Origen | Generadas con un modelo de imágenes (herramienta integrada image_gen de Cowork, modelo no expuesto; el manifiesto registra lote, fecha y posproceso). Revisadas una a una. Nombres castellano y catalán revisados por el experto. |
| Ubicación | `shine/content/images/` y `manifest.json`; especificación en `docs/generador/Banco de imágenes.md`. |
| Licencia | Contenido propio generado para el proyecto. **Pendiente**: confirmar las condiciones de uso comercial de la herramienta de generación. |
| Lote 2 | 122 imágenes nuevas para Level9 y Level10 (encargo E09), mismo estilo y anclas; prompt en `docs/generador/Banco de imágenes - lote 2 (E09).md`, fichas en `shine/content/images/manifest-lote2.json`. Pendientes de generar (2026-10-29). |

## 4. Textos y lotes de actividades

| Campo | Valor |
|---|---|
| Origen | Redactados por Claude (Anthropic) en el repositorio siguiendo los prompts de `plans/contenido/prompts-es/` y `plans/multiidioma/prompts-contenido/`; matriz y posición de imágenes con generadores deterministas con semilla (`shine/content/generadores/`). |
| Validación | Puerta léxica (sección 1), importador (`shine_content`) y revisión del grupo de expertos antes de publicar. |

## 5. Fuentes pendientes

| Fuente | Para qué | Estado |
|---|---|---|
| CTILC (Institut d'Estudis Catalans) | Lista general del catalán (E02); hoy se usa wordfreq con revisión | por conseguir |
| Vocabulario infantil castellano (LEXESP u otro) | Contrastar la lista infantil (E03), hoy hecha con el proceso híbrido | por conseguir |
| BDLOC, PRODISCAT o equivalente | Contrastar la lista infantil catalana (E04) | por conseguir |
| Estimaciones de familiaridad del castellano (Brysbaert y col., https://osf.io/frc6a/) | Posible apoyo para el vocabulario infantil en Level3 y más (decisión 2 de E01) | localizada, no descargada |

## 6. Cómo citarlo en la app y la web (propuesta)

Texto corto para una pantalla "Sobre los ejercicios", a confirmar cuando estén cerradas las
licencias:

> Los ejercicios de Shine siguen los criterios de un grupo de expertos en dislexia y lectura
> (composición del grupo por confirmar). El vocabulario de cada nivel se elige con las frecuencias del Corpus del Español del
> Siglo XXI (CORPES XXI) de la Real Academia Española y se revisa a mano.
