# Multiidioma (castellano y catalán): análisis y plan

Análisis de arquitectura, a 2026-10-26, de lo que implica que Shine funcione en castellano y
catalán: Drupal, JSON:API, app Expo y la generación masiva de ejercicios. Parte del código tal
como está hoy (FASE 17 en curso, banco de imágenes cerrado) y de tres decisiones ya tomadas:

1. Al dar de alta un alumno se elige su idioma, junto con el nombre y el avatar.
2. Si un alumno cambia de idioma, sus estadísticas se reinician.
3. Para trabajar los dos idiomas, el tutor crea dos perfiles del mismo niño, uno por idioma, y
   gasta dos plazas de su cupo.
4. De momento la interfaz comparte el idioma del alumno activo (confirmado el 2026-10-26; ver
   2.5 para el camino hacia una v2 con interfaz del tutor y juego del niño).
5. El contenido actual de la app y las estadísticas son de ejemplo, nada es definitivo: las
   migraciones pueden borrar y reimportar; no hay que conservar códigos, sesiones ni resúmenes.

El plan de ejecución derivado está en plans/multiidioma/README.md; el documento para el experto en
catalán, en plans/multiidioma/estructura.md. El experto respondió el 2026-10-26 (Shine en
Catalán.md); la versión normalizada con nombres definitivos, ciclo, nivel mínimo y preguntas
abiertas es plans/multiidioma/estructura-ca.md, y los vocabularios ya están como datos en
shine/scripts/phonology-terms.es.json y phonology-terms.ca.json.

Documentos relacionados: docs/exercise-catalog.md (catálogo y escala de niveles, hoy solo
castellano), docs/level-system.md (generador y techo por contenido), docs/monetization.md
(cuentas, alumnos y cupo), docs/generador/Banco de imágenes.md (banco de 432 ilustraciones).

---

## 0. Resumen ejecutivo

- **El idioma es una propiedad del alumno**, no de la cuenta ni del dispositivo. Vive en el
  campo preferred_langcode del usuario alumno (ya existe en Drupal), se fija al crearlo y lo
  devuelve /shine/me. Todo lo demás se deriva de ahí: qué actividades entran en sus sesiones, en
  qué idioma se le habla en el player y qué se le enseña en las estadísticas.
- **Las actividades no se traducen: cada actividad es de un idioma.** Un nodo de actividad lleva
  su langcode (es o ca) y el generador de sesiones solo mira actividades del idioma del alumno.
  El sistema de traducción de contenidos de Drupal se usa únicamente para lo que es interfaz:
  los nombres de las áreas, los mensajes de explicación y motivación y el nombre del ciclo.
  Razones en la sección 2.2; en corto: las actividades "iguales" en los dos idiomas son la
  excepción, y un nodo con dos contenidos distintos rompe la huella, el código, la comparación
  de iteraciones y la detección de duplicados.
- **Lo que es compartible se comparte en el lote, no en Drupal**: un registro del lote puede
  declarar los dos idiomas y el importador crea dos nodos, uno por idioma, con el mismo material.
  Así "la le li lo lu" o una matriz de p/b/d/q se escriben una vez y existen dos veces.
- **El banco de imágenes se reutiliza al cien por cien como imagen y al cero por ciento como
  metadato lingüístico**: nombre, silabeo, nivel lector y grupos fonológicos hay que rehacerlos en
  catalán, y algunas parejas dejan de serlo. La clave del media pasa a ser neutra (el slug), no la
  palabra castellana.
- **El trabajo grande no es técnico, es de contenido**: una escala de niveles catalana (la tabla
  2.3 del catálogo describe la adquisición lectora del castellano, que es más transparente), una
  taxonomía fonológica catalana con sus términos, un léxico catalán con silabeo y frecuencia, y
  lotes catalanes para los siete tipos. Sin cobertura catalana por área y nivel, un alumno catalán
  se queda en Level0 por el techo por contenido.
- **En la app, el idioma de la interfaz en v1 es el del alumno activo** (y el del dispositivo
  mientras no lo hay). Los textos se extraen a un catálogo de claves con dos espacios separados:
  lo que lee el tutor y lo que lee el niño, para poder separar los dos idiomas en una v2 sin
  rehacer nada.
- Tamaño: dos prompts de backend, dos de app y un bloque de contenido que depende del equipo
  terapéutico (sección 8). El handler de importación de posición de imágenes, pendiente, debe
  hacerse ya con idioma.

---

## 1. Punto de partida: lo que hay hoy

Comprobado en el código y en la base de datos local el 2026-10-26.

| Capa | Estado | Consecuencia |
|---|---|---|
| Módulos Drupal | language y content_translation habilitados; locale y config_translation no | La infraestructura existe pero no se usa |
| Idiomas configurados | Solo en (inglés), idioma por defecto del sitio en; negociación por prefijo de URL activa con prefijo vacío para en | Herencia del Drupal 10 original. Hay que añadir es y ca y cambiar el defecto |
| Langcode del contenido | Todo en: 39 nodos (actividades, sesiones, página), 55 términos, 7 mensajes, 4 media, 5 usuarios | Migración en a es de todo lo existente antes de nada |
| Traducibilidad de campos | En las actividades, ningún campo field_ es traducible (storage translatable false); solo title. En paragraph syllable_word, field_syllables sí | Confirma que traducir actividades exigiría reconfigurar storages; con nodos por idioma no hace falta tocarlos |
| Ajustes de traducción | language.content_settings existe para activity, activity_blink, activity_image_position y areas, con language_alterable false | Los bundles de la FASE 13 y 16 ni siquiera tienen ajuste; hay que crear los siete con language_alterable true |
| Generador de sesiones | LevelLadder::contentQuery filtra por tipo, publicado, área, nivel y sin ciclo. SessionGenerator crea la sesión sin langcode (hereda el defecto) | Falta la condición de idioma en contentQuery y en la consulta de ciclo, y fijar el langcode de la sesión |
| Techo por contenido y cobertura | hasContent y Coverage usan la misma consulta, sin idioma | Un área "con contenido" en castellano permitiría subir de nivel a un alumno catalán sin actividades catalanas |
| Importador shine_content | Registro sin idioma; código TIPO-Lnn-AREA-nnn; términos resueltos por nombre; huella = sha256(tipo, contenido canónico); duplicados y sobreuso por tipo y nivel | Todo ello necesita la dimensión idioma |
| Alumno | Usuario Drupal; LearnerManager::create(holder, display_name, avatar); /shine/me devuelve uuid, display_name, avatar, role... | Falta langcode en alta, edición y lectura |
| App | 881 líneas con texto en castellano en 103 ficheros; una parte ya en objetos *_COPY (learnerScreens, sessionCards, accountScreens, learnerCopy); sin librería i18n; sin locales en app.json | Trabajo mecánico pero grande; los *_COPY ya centralizados adelantan parte |
| Fuentes | Nunito (Google Fonts) y OpenDyslexic (local) | Ambas cubren Latin-1 y latín extendido: ç, l·l (punto volado U+00B7), ï, ü, à, è, ò. Comprobar en pantalla, no en teoría |
| Contenido y documentación | Catálogo, taxonomía fonológica, guía de parametrización, lotes y banco de imágenes: todo castellano | Sección 6 |

---

## 2. Modelo de idioma

### 2.1 Dónde vive el idioma

| Entidad | Campo | Quién lo fija | Uso |
|---|---|---|---|
| Alumno (user, account_kind learner) | preferred_langcode (existe) | POST /shine/learners al crear; PATCH con reinicio al cambiar | Idioma de contenido y, en v1, de la interfaz mientras está activo |
| Titular (user, holder) | preferred_langcode | Registro (idioma de la app en ese momento); editable en Ajustes | Idioma de la interfaz cuando no hay alumno activo y correos futuros |
| Actividad (los 7 bundles) | langcode del nodo, editable (language_alterable) | Importador (clave idioma) o formulario | Filtro del generador, techo por contenido, cobertura, inventario, huella |
| Sesión | langcode del nodo | SessionGenerator, copiando el del alumno | Trazabilidad; permite auditar sesiones por idioma en /admin/shine/sessions |
| Paragraphs (i1, i1_item, syllable_word) | langcode heredado del nodo | Importador | Nada más |
| Logs, summaries, feedback | Sin idioma propio | Siempre del alumno, que tiene uno | Las estadísticas de un alumno son siempre de un solo idioma |
| Términos: areas, activity_cycle | Traducción del name (content_translation) | Admin, una vez | Chips y radar en la app, en el idioma de interfaz |
| Términos: activity_level | Sin traducción (Level0 a Level10 son internos) | | No se muestran al usuario |
| Términos: sonority, decoding_effort | Términos distintos por idioma, con langcode propio (no traducción) | Script por entorno, uno por idioma | El importador resuelve el nombre dentro del idioma del registro |
| activity_message (explicación y motivación) | Traducción (content_translation) | Admin | La app los pide en el idioma del alumno |
| Media (imágenes) | Neutro (langcode irrelevante); name = slug | Importador del banco | Clave compartida por los dos idiomas |

### 2.2 Traducción de contenidos o actividades independientes

Tres opciones sobre la mesa:

- **A. Traducir las actividades** con content_translation: un nodo, dos traducciones, mismo uuid
  y mismo código.
- **B. Actividades independientes por idioma**: cada nodo tiene langcode es o ca; nada se traduce.
  Lo compartible se duplica en la importación.
- **C. Híbrido**: traducir las actividades "neutras" y crear nodos aparte para las demás.

| Criterio | A. Traducción | B. Independientes | C. Híbrido |
|---|---|---|---|
| Cuánto contenido es realmente igual en los dos idiomas | Poco: sílabas CV universales, matrices de letras sin ç ni ny, posición de imágenes (solo las imágenes; los nombres cambian). El léxico, el silabeo, las frases, los textos y las pseudopalabras cambian siempre | Igual de poco; se resuelve en el lote | Igual |
| Modelo de datos | Hay que hacer traducibles los storages de contenido (hoy ninguno lo es) y decidir campo a campo qué se comparte | Un campo que ya existe (langcode) | Lo peor de A y de B a la vez |
| Código de actividad y huella de contenido | Un código y una huella por nodo, pero dos contenidos: la huella deja de identificar el material; los duplicados se detectan mal | Código con idioma; huella = tipo + idioma + contenido | Dos reglas distintas según el nodo |
| Estadísticas (iteraciones por field_activityid) | Si un alumno cambiara de idioma, compararía intentos de dos contenidos distintos. Con la decisión 2 (reinicio) no pasa, pero el modelo lo permite | Imposible por construcción | Depende del nodo |
| Generador y techo por contenido | Hay que comprobar que exista la traducción en el idioma del alumno, no el nodo | Una condición de langcode | Las dos comprobaciones |
| JSON:API desde la app | Cada petición de actividad debe negociar el idioma (prefijo de URL); si falta la traducción, Drupal devuelve el original sin avisar | Nada: la sesión ya referencia nodos del idioma correcto | Prefijo igualmente |
| Edición manual por un terapeuta | Flujo de traducción de Drupal (pestaña Translate, campos compartidos o no) | Crea un nodo y elige el idioma | Tiene que saber cuál es cuál |
| Contenido no traducible (matriz con ç, l·l, ny; frases) | Nodo solo con una traducción: casos especiales por todas partes | Es el caso normal | Es el caso normal |
| Inglés en el futuro | Más traducciones por nodo | Más nodos con langcode en | |

**Decisión recomendada: B.** Actividades independientes por idioma, con el langcode del nodo, y
content_translation solo para las entidades de interfaz (areas, activity_cycle, activity_message).
La reutilización del contenido neutro se hace en la importación: el registro del lote declara
idiomas [es, ca] y el importador crea dos nodos con el mismo material y códigos distintos
(sección 3.4). Un terapeuta que edite a mano nunca ve el flujo de traducción.

### 2.3 Cambio de idioma de un alumno = reinicio

La decisión 2 dice que al cambiar de idioma se reinician las estadísticas. Dos formas de hacerlo:

- **Reinicio destructivo** (recomendado): en una transacción, LevelReset (ya existe: niveles a
  Level0, pendientes despublicadas, log reset) con razón language_change en el histórico,
  borrado de activitylog, activitysummary, sessionfeedback y activityfeedback del alumno, y
  despublicación de sus sesiones (no se borran: /admin/shine/sessions sigue mostrando lo que
  hubo). El guardado del usuario ya revoca sus tokens (gotcha 20), así que el alumno pide token
  nuevo y arranca limpio. Toca un solo sitio en el servidor y nada en la app.
- **Corte por fecha** (descartado): un campo stats_since en el alumno y filtrar por created en
  todas las consultas: las de estadísticas de la app (statistics.ts), countCompletedSessions,
  getStreaks y lastEvaluatedAt del evaluador, el cálculo de "hecha N veces" de la sesión... Más
  sitios, más fácil dejarse uno.

La app pide confirmación explícita ("Cambiar el idioma reinicia el progreso de este alumno") y
recuerda la alternativa: crear otro perfil.

### 2.4 Dos perfiles por idioma

No exige ningún cambio en cuentas ni en acceso de pago: el cupo ya se cuenta en alumnos
(max_learners), y dos perfiles son dos alumnos. Solo copy en la pantalla de alta: "Para trabajar
en los dos idiomas, crea un perfil por idioma". Conviene anotarlo en docs/monetization.md como
caso de uso previsto, para que nadie "optimice" después el cupo por niño.

### 2.5 Idioma de la interfaz e idioma del niño

Son dos cosas: el tutor lee los menús, las estadísticas y las instrucciones de la intro; el niño
lee lo que hay dentro del juego ("¿En qué posición estaba?", "Encuentra todas las p", "¡Casi!",
"plátano: 12 repeticiones"). Una familia castellanohablante con un niño escolarizado en catalán
querría interfaz en castellano y juego en catalán.

Propuesta: **v1 con un solo idioma de app, el del alumno activo** (en login y registro, el del
dispositivo si es es o ca, y es si no), porque en Cataluña el tutor lee los dos y porque reduce a
la mitad la casuística de pantallas. Pero el catálogo de textos nace ya con dos espacios de
nombres: ui.* (tutor) y player.* (niño), y el player toma siempre su idioma del alumno. Pasar
en v2 a "interfaz del tutor, juego del niño" es entonces un cambio de una línea en el selector de
idioma, no una migración de textos.

---

## 3. Cambios en Drupal

### 3.1 Idiomas y migración del contenido existente

1. Añadir es y ca (drush language:add) y fijar es como idioma por defecto del sitio. Prefijos
   de URL: es sin prefijo, ca con ca. El idioma en no se borra hasta que todo esté migrado.
2. Migrar el langcode de todo lo existente de en a es: nodos (y sus paragraphs), términos,
   media, activity_message y usuarios (preferred_langcode y langcode). Un hook_update_N o un
   script php:script idempotente, en una ventana con copia de la base de datos. Los uuid no
   cambian, así que la app no se entera.
3. Ajustes de traducción (language.content_settings) para los siete bundles de actividad y para
   session: idioma por defecto es, language_alterable true, sin traducción. Para areas,
   activity_cycle y activity_message: traducción habilitada.
4. locale y config_translation no hacen falta: ningún usuario final ve la interfaz de Drupal.
   La administración sigue en el idioma que esté.

Riesgo conocido: cambiar el idioma por defecto con contenido en otro idioma puede dejar
contenido "sin traducción al idioma por defecto" si se hace en el orden equivocado. Orden seguro:
añadir es, migrar langcodes, cambiar el defecto, exportar config.

### 3.2 Alumno con idioma (shine_account)

- POST /shine/learners acepta langcode obligatorio (es o ca; cualquier otro valor, 422 con
  campo langcode). Durante la transición, si falta, es.
- PATCH /shine/learners/{uuid} acepta langcode; si cambia, ejecuta el reinicio de 2.3 en la misma
  transacción y responde con el alumno y un indicador reset: true. Solo owner, como nombre y
  avatar.
- /shine/me y la forma learner incluyen langcode.
- LearnerManager::create fija preferred_langcode y langcode del usuario alumno; la validación va
  en LearnerManager como la del avatar.
- Los mensajes de error de la API siguen siendo códigos estables (field + mensaje en castellano
  para depurar); la app pone el texto en el idioma de la interfaz, como ya hace con auth y
  learners. Regla a dejar escrita en docs/api-design.md: ningún texto de la API se muestra tal
  cual al usuario.

### 3.3 Generador, evaluador y niveles (shine_level)

- LevelLadder::contentQuery y la consulta de ciclo de SessionGenerator añaden
  condition langcode = idioma del alumno. Con eso, hasContent (techo por contenido), el árbol de
  decisión y el ciclo quedan por idioma sin más cambios: todos pasan por esa consulta.
- SessionGenerator fija el langcode del nodo sesión al crearlo.
- shine-level:generate --dry-run imprime el idioma del alumno y, en los avisos de techo o hueco
  vacío, el idioma ("sin contenido en catalán para Memoria de Trabajo en Level2").
- SessionEvaluator no cambia: razona sobre sesiones y feedback del alumno, que son de su idioma.
- LevelReset gana una razón language_change (o se reutiliza reset con nota) para el histórico.
- Las vistas de administración (/admin/shine/sessions, /admin/shine/levels) ganan una columna y
  un filtro de idioma.

### 3.4 Importador, huella, inventario y cobertura (shine_content)

- **Clave idioma** en el registro del lote: idioma (es o ca) o idiomas (lista). Obligatoria;
  sin ella, error. Con idiomas de más de un valor, el importador crea un nodo por idioma a partir
  del mismo registro; title e instruccion admiten un escalar (vale para los dos) o un objeto por
  idioma ({es: ..., ca: ...}).
- **Código con idioma**: TIPO-XX-Lnn-AREA-nnn, por ejemplo BLK-CA-L00-VEL-001. El importador
  exige que XX coincida con el idioma del nodo. Los códigos existentes (castellano) se migran
  insertando ES: como el contenido es de ejemplo (decisión 5), no hace falta hook_update: se
  borran las actividades de demostración, se reescriben los tres lotes de shine/content/ con
  códigos ES y se reimportan. Alternativa descartada: dejar el castellano sin marca; la
  asimetría acaba en errores.
- **Huella**: sha256(tipo, idioma, contenido canónico). El mismo material en es y ca son dos
  huellas distintas y no es duplicado; dentro de un idioma, la regla no cambia. Al implantarlo,
  shine-content:rehash recalcula todo.
- **Unidades y sobreuso** por tipo, nivel e idioma. **Duplicados** se comparan solo dentro del
  idioma.
- **Términos por nombre**: areas, niveles y ciclos se resuelven por el nombre canónico en
  castellano, que es el del término original (la traducción catalana del área es solo para
  mostrar). sonoridad y esfuerzo se resuelven por nombre dentro del langcode del registro,
  porque son vocabularios distintos por idioma (3.5).
- **Cobertura** área por nivel por idioma; la tabla final del importador y shine-content:inventory
  ganan --lang. El mínimo de 3.3 del catálogo se exige por idioma.
- **Hook de presave** que escribe field_content_hash: incluye el idioma.
- El handler pendiente de activity_image_position se escribe ya con todo esto; es la primera
  pieza nueva que debería nacer bilingüe.

### 3.5 Taxonomías

- **areas**: 5 términos, traducir name al catalán. La app los recibe en el idioma del prefijo.
- **activity_cycle**: "Sílabas" traducido. Las actividades del ciclo son nodos con idioma, así que
  el ciclo funciona por idioma sin más.
- **activity_level**: nombres internos, sin traducir. Los pesos y la escalera no dependen del
  idioma; lo que sí depende es la descripción pedagógica de cada nivel (sección 6).
- **sonority y decoding_effort**: no son traducciones, son taxonomías distintas. Las oposiciones
  y las inconsistencias grafema-fonema del catalán no son las del castellano (s sorda y sonora,
  ç y ss, g y j, x e ix, b y v, los dígrafos ny, ll, l·l, tx, ig, el apóstrofo). Términos con
  langcode ca creados por un script create-phonology-terms-ca.php hermano del actual, diseñados
  con el equipo terapéutico (hoy no existe el documento catalán equivalente a
  docs/generador/Taxonomía fonológica.md). Los filtros JSON:API por grupo (parent.name) siguen
  funcionando dentro de cada idioma.

### 3.6 Mensajes de explicación y motivación

activity_message con traducción al catalán de título y cuerpo. Son pocos (6 explicaciones, 1
motivación) y los lee el niño o el tutor en la intro y al terminar: imprescindibles desde el día
uno del catalán. La app los pide con el prefijo del idioma del alumno (sección 4).

### 3.7 Banco de imágenes en Drupal

Los media son neutros. Cambia la convención de clave del banco antes de importarlo, que todavía
no se ha hecho: name del media = slug del fichero (platano), no la palabra con tilde; alt = slug.
El importador de sílabas busca el media por name, así que la clave imagen del lote pasa a ser
el slug en los dos idiomas. Hay que actualizar la sección 4 de docs/generador/Banco de
imágenes.md y el manifiesto (sección 6.3).

---

## 4. JSON:API

- **Actividades, sesiones, logs, summaries, feedback, niveles**: sin cambios de ruta ni de
  filtros. Los recursos ya exponen el atributo langcode; la app no necesita filtrar porque la
  sesión referencia nodos del idioma del alumno. Solo conviene que la app lea langcode de la
  sesión para fijar el idioma del player (defensa en profundidad frente a un alumno cambiado
  de idioma a medias).
- **Entidades traducidas** (areas, activity_cycle, activity_message): JSON:API devuelve cada
  traducción como un recurso con el mismo uuid y los atributos en el idioma negociado por la
  URL. La app construye la base con el prefijo cuando el idioma no es el por defecto:
  API_BASE/jsonapi para es y API_BASE/ca/jsonapi para ca. Si una traducción no existe, Drupal
  devuelve el original en castellano sin error: la revisión de contenido debe cubrirlo.
  Alternativa descartada: negociación por cabecera Accept-Language (método browser); el prefijo
  es explícito, cacheable y visible en los logs.
- **Escrituras**: POST de logs, summaries y feedback no cambian. No hace falta fijar langcode en
  ellos.
- **Filtros de administración**: filter[langcode]=ca en colecciones de actividades sirve al
  inventario y a la depuración; no lo usa la app.
- **Caché**: Drupal varía la caché por idioma de URL. Nada que hacer.
- **Documentar** en docs/api-design.md: dónde va el prefijo, qué recursos están traducidos y la
  regla de que la API no devuelve textos para mostrar.

---

## 5. App Expo

### 5.1 Infraestructura de textos

- Librería: i18n-js con expo-localization (la combinación que documenta Expo para el SDK 54;
  sin proveedor ni contexto, funciona en lógica pura y en componentes). react-i18next es la
  alternativa si se quiere interpolación de componentes; no hace falta.
- Catálogos src/locales/es.json y src/locales/ca.json con claves por pantalla y los dos espacios
  de nombres de 2.5: ui.* y player.*. Pluralización con count donde haga falta ("3 de 10
  actividades", "N palabras").
- Migración de las 881 líneas: los objetos *_COPY (learnerScreens, sessionCards, accountScreens,
  learnerCopy, RATING_COPY...) se convierten en claves con un cambio mecánico; el resto está
  repartido por componentes y pantallas (statistics, dashboard, session/[id], players, authForm,
  activityKinds/types con las instrucciones de cada tipo). Los tests que comparan textos
  (authForm, learnerForm, sessionCards, rapidRepetition formatRate) pasan a comparar claves o a
  cargar el catálogo es.
- Formato de números y fechas: coma decimal en los dos idiomas; las fechas de las estadísticas
  con el locale del idioma (es-ES o ca-ES), no con uno fijo.
- Fuentes: comprobar en dispositivo ç, l·l con punto volado, ï, ü, à, è, ò en Nunito y
  OpenDyslexic, en los tres pesos. En la matriz de letras, las celdas multicarácter (l·l, ny, ix)
  ya se admiten porque las celdas se separan por espacios; fitText no cambia.
- app.json: locales de tienda (CFBundleLocalizations es y ca; android locales) y nombre y
  descripción de la ficha en los dos idiomas (afecta al prompt 14b de publicación).

### 5.2 Alta y edición de alumno

- Pantalla "¿Con quién vas a trabajar?": selector de idioma obligatorio, dos tarjetas grandes
  ("Castellano", "Català"), preseleccionado el idioma de la app, con la nota "Para trabajar en los
  dos idiomas, crea un perfil por idioma". learnerForm (lógica pura) valida el valor.
- Ficha del alumno: muestra el idioma; "Cambiar idioma" con ConfirmPanel que avisa del reinicio
  y ofrece "Crear otro perfil" como alternativa.
- Selector de alumno y tarjetas: indicador discreto del idioma cuando el titular tiene alumnos en
  los dos (bandera no: una etiqueta "CA" o "ES", o el nombre del idioma).
- startRoute y el store de auth: al seleccionar alumno, fijar el idioma de la app al suyo; al
  salir del alumno, volver al del dispositivo o del titular.

### 5.3 Peticiones

- apiFetch gana una opción lang que antepone el prefijo a la base de JSON:API; la usan solo
  areas.ts y messages.ts (y el ciclo si se muestra). Caché por idioma de esas dos listas.
- El player toma el idioma de player.* del alumno activo (y comprueba el langcode de la sesión).

### 5.4 Lo que no cambia

Players, tracking, estadísticas, niveles, cuentas, acceso de pago. El modelo de doble token y
el alumno activo ya dan el contexto que hace falta.

---

## 6. Contenido y generación masiva

### 6.1 Qué es específico de cada idioma

| Pieza | Castellano (existe) | Catalán (por hacer) |
|---|---|---|
| Escala de niveles por edad (catálogo 2.1, 2.2) | Sí | Misma escala de edades y cursos; mismo criterio "Bien así" |
| Referencias lingüísticas por nivel (catálogo 2.3) | Sí: estructuras silábicas, frecuencia, palabras por frase y texto, velocidad | Nueva: el catalán tiene vocal neutra, consonantes finales, dígrafos (ny, ll, l·l, ix, tx, ig), apóstrofos y contracciones, acentos abiertos y cerrados y la ç; es menos transparente que el castellano y la decodificación se alarga. Lo fija el equipo terapéutico, no el código |
| Taxonomía fonológica (sonoridad, esfuerzo) | docs/generador/Taxonomía fonológica.md y 46 términos | Documento y términos nuevos (3.5) |
| Léxico de referencia (grafía, silabeo, frecuencia, categoría) | Previsto, no hecho | Previsto, no hecho; otra fuente y otro silabeador (las reglas de silabeo catalanas son otras) |
| Confusiones visuales (b d p q, n u, m w) | Sí | Idénticas: la matriz de letras es casi toda compartible |
| Pseudopalabras | Fonotaxis castellana | Fonotaxis catalana (nuevas) |
| Frases y textos (segmentación, lectura) | Redactados | Redactados en catalán; no se traducen (cambian longitud, frecuencia y estructura) |
| Guía de parametrización (ejemplos por nivel) | Sí | Nueva |
| Banco de imágenes | 432 ilustraciones con metadatos castellanos | Mismas ilustraciones; metadatos catalanes nuevos (6.3) |

### 6.2 Qué se comparte y cómo

- **Mecánica y players**: todo, sin cambios.
- **Matriz de letras**: los objetivos y distractores de letras (p, b, d, q, n, u, m, w) y de
  sílabas universales son compartibles: un registro con idiomas [es, ca]. Las matrices con ç,
  l·l, ny, ix o palabras son de un idioma.
- **Parpadeo**: las sílabas directas universales (ma me mi mo mu, pa pe pi po pu) son
  compartibles; pero hay que revisar sílaba a sílaba con el equipo terapéutico, porque algunas
  se leen distinto (ce, ci, ge, gi, la e y la o átonas) y el "alivio" de cada idioma es otro.
- **Posición de imágenes**: la imagen es la misma; el nombre no. El registro es por idioma (o
  compartido con nombre por idioma), y la imagen se referencia por su slug.
- **Reordenamiento de sílabas, repetición rápida, segmentación, lista y lectura**: nunca
  compartibles.

Mecánica en el lote: idiomas [es, ca] en un registro crea dos nodos con códigos
TIPO-ES-... y TIPO-CA-... y el mismo contenido; titulo e instruccion pueden ser un objeto por
idioma. Un registro con idioma simple sigue igual que hoy. Un lote puede mezclar registros de
los dos idiomas.

### 6.3 Banco de imágenes

- Las 432 ilustraciones sirven tal cual: no llevan texto, el color y la forma son universales.
- El manifiesto gana, por entrada, un bloque por idioma: ca con nombre, artículo, silabeo y
  nivel lector catalán, y etiquetas fon_ca con los grupos de sílaba inicial y pares mínimos del
  catalán. Las etiquetas vis y la categoría son neutras. Lo redacta y revisa un hablante nativo
  con criterio terapéutico, no se traduce automáticamente: hay parejas que dejan de serlo
  (palabras que en catalán comparten nombre o se dicen con dos palabras) y aparecen otras nuevas.
- Palabras del banco cuyo nombre catalán sea ambiguo, compuesto o poco frecuente se marcan como
  no usables en catalán en el manifiesto (estado por idioma), no se borran.
- La clave del media pasa a ser el slug (3.7) y la clave imagen del lote también, en los dos
  idiomas. Hay que actualizar docs/generador/Banco de imágenes.md (sección 4) y el manifiesto.
- Para generar catalán con Cowork el prompt es el mismo documento con el bloque ca de la tabla;
  no hay que generar ninguna imagen nueva salvo que el equipo catalán pida palabras que no estén.

### 6.4 Pipeline y orden del contenido catalán

1. Documentos: tabla 2.3 catalana, taxonomía fonológica catalana, guía de parametrización
   catalana. Es el cuello de botella y es trabajo del equipo terapéutico con apoyo nuestro.
2. Términos: script de sonoridad y esfuerzo en catalán; traducción de areas, ciclo y mensajes.
3. Manifiesto del banco con el bloque ca.
4. Lotes, por este orden de rentabilidad: matriz de letras (casi todo compartido), posición de
   imágenes (solo nombres), parpadeo de sílabas universales (compartido con revisión), y después
   lo que exige léxico catalán (sílabas, repetición rápida) y redacción (segmentación, lista,
   lectura). Cobertura mínima por área y nivel en Level0 a Level2 antes de abrir el catalán a
   usuarios: si no, el techo por contenido deja a todo alumno catalán en Level0.
5. Revisión terapéutica catalana de una muestra por lote, como en castellano.

---

## 7. Riesgos y decisiones pendientes

- **Cambio del idioma por defecto del sitio con contenido en inglés**: hacerlo con copia de
  seguridad y en el orden de 3.1. Probar primero en local con una copia de la base de datos.
- **Nombres de término en los lotes**: se mantienen en castellano como nombre canónico (las
  traducciones son para mostrar). Si un día se quieren lotes escritos íntegramente en catalán,
  el importador tendría que resolver también por la traducción; no en esta fase.
- **Techo por contenido por idioma**: es correcto y a la vez es el riesgo de producto: catalán
  sin cobertura es catalán parado en Level0. Lanzar catalán solo con la cobertura mínima de 6.4.
- **Idioma de interfaz y del niño separados** (2.5): aplazado a v2 con el camino preparado.
- **Inglés**: el modelo B escala sin cambios estructurales; el coste es el de contenido.
- **Cuentas de prueba** (jose@test.com y las de la FASE 17): sus alumnos quedan en es tras la
  migración. Crear al menos un alumno ca de prueba y una sesión catalana de ejemplo.
- **Códigos de actividad**: los códigos antiguos desaparecen con la reimportación (decisión 5).
  Hoy solo los usan los lotes del repo y el inventario.
- **Lo que no se toca**: entitlement, cupo, token de alumno, estadísticas, players.

---

## 8. Plan de ejecución propuesto

| Orden | Bloque | Alcance | Tamaño | Modelo | Depende de |
|---|---|---|---|---|---|
| 1 | 18a backend: modelo de idioma | 3.1 idiomas y migración en a es; 3.2 alumno con idioma y reinicio; 3.3 generador, techo, sesión, vistas; 3.5 traducción de areas, ciclo y mensajes; docs api-design y level-system | L | Fable (migración y modelo de datos) | FASE 17 (shine_account) |
| 2 | 18b backend: importador bilingüe | 3.4 clave idioma, códigos con idioma y migración de los existentes, huella, unidades, duplicados, cobertura e inventario por idioma; 3.5 script de términos catalanes (estructura vacía hasta que exista la taxonomía); 3.7 clave del media por slug; handler de posición de imágenes nacido bilingüe; reescritura de los lotes | L | Fable | 18a |
| 3 | 18c app: i18n | 5.1 librería, catálogos es y ca, extracción de las 881 líneas en ui.* y player.*, formato de fechas, fuentes, locales de tienda | L (mecánico y largo) | Opus | nada (puede ir en paralelo con 18a) |
| 4 | 18d app: alumno con idioma | 5.2 alta, ficha, cambio con reinicio, selector; 5.3 prefijo en areas y mensajes; idioma de la app ligado al alumno activo | M | Opus | 18a, 18c |
| 5 | Contenido catalán | 6.4 pasos 1 a 3 (documentos, términos, manifiesto) y después lotes por tipo | XL, equipo terapéutico | Cowork y Codex como en el banco | 18b para importar; los documentos pueden empezar hoy |
| 6 | QA bilingüe | Recorrido completo con un alumno es y otro ca del mismo titular; sesión, player, estadísticas, cambio de idioma, inventario y cobertura | M | | todo lo anterior |

Hito de control: tras 18a y 18b, importar un lote catalán mínimo (una matriz y una posición de
imágenes compartidas, con idiomas [es, ca]) y comprobar con shine-level:generate --dry-run que un
alumno ca recibe solo actividades ca y que el techo por contenido le para donde debe.

Documentación a actualizar al ejecutar: CLAUDE.md (idiomas, prefijo JSON:API, alta de alumno con
langcode, códigos con idioma), docs/api-design.md, docs/level-system.md, docs/exercise-catalog.md
(3.4 códigos, 4.3 contrato con idioma, 4.4 cobertura por idioma, una sección por idioma en 2.3),
docs/conventions.md (claves de texto ui.* y player.*), docs/generador/Banco de imágenes.md
(clave del media y bloque ca del manifiesto), docs/monetization.md (dos perfiles por idioma) y
docs/progress.md.
