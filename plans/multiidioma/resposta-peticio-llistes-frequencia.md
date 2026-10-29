El documento **peticio-llistes-frequencia.md** elaborado por el equipo de desarrollo es **sumamente oportuno, riguroso y está perfectamente alineado con las necesidades de escalabilidad del proyecto**.  
Establecer un filtrado léxico automatizado para alimentar la generación de contenidos desde **Level3 hasta Level10** es imprescindible para poder construir las más de 550 actividades necesarias sin sesgos subjetivos ni errores de nivelación.  
A continuación, presento un **análisis detallado y preciso** de la petición, evaluando sus puntos fuertes, identificando matices técnicos/lingüísticos cruciales y proporcionando las recomendaciones concretas sobre fuentes, licencias y tratamiento de datos que debes trasladar al equipo.

### 1\. ANÁLISIS DE LOS PUNTOS CLAVE DE LA PETICIÓN

#### A. Llindars de Freqüència per Nivell (L0 a L10)

* **Valoración:** **Correcto y coherente con el catálogo.**  
* **Análisis:** La progresión de rangos establecida (500 palabras en L0, 1.000 en L1, 2.000 en L2, 3.000 en L3, 5.000 en L4, 7.000 en L5, 10.000 en L6, 15.000 en L7, 20.000 en L8 y sin límite en L9-L10) encaja de forma impecable con la escala de edad de referencia (5 a 15 años).

#### B. Diferenciación entre Vocabulario Infantil (L0-L2) y Frecuencia General (L3-L10)

* **Valoración:** **Imprescindible y clínicamente imprescindible.**  
* **Análisis:** Los desarrolladores han identificado con gran acierto la principal trampa de los corpus de frecuencia de adultos (como el CREA/CORPES XXI en español o el CTILC en catalán). En estos corpus, palabras abstractas o funcionales como *gobierno, mediante, embargo, doncs, tanmateix* ocupan posiciones muy altas en el rango de frecuencia, pero son conceptual y sintácticamente inasumibles para un niño de 5 a 7 años. Por contra, palabras infantiles básicas (*mico, chupete, peixet, pelota*) aparecen en rangos mucho más bajos en corpus adultos.  
* **Regla algorítmica recomendada:**  
* **Level0 a Level2:** Prima de forma absoluta la **Lista de Vocabulario Infantil / Escolar**.  
* **Level3 a Level10:** Se utiliza la **Lista de Frecuencia General**.

#### C. Estructura de las Columnas del Archivo CSV/TSV

En la petición, los desarrolladores proponen las columnas forma, lema (opcional), categoría gramatical (opcional) y frecuencia/rango.

* **Recomendación crítica:** Las columnas lema y categoría gramatical **NO deben ser opcionales, sino OBLIGATORIAS**.  
* *Motivo lingüístico:* Para un niño con dislexia en niveles iniciales (L0-L3), la complejidad morfológica de un verbo conjugado (ejemplo: *menjàssim* o *comiéramos*) añade una carga de decodificación enorme respecto al lema infinitivo (*menjar* / *comer*), aunque compartan raíz. El algoritmo debe poder filtrar no solo la forma, sino también el tipo de flexión morfológica.

### 2\. FUENTES CONCRETAS RECOMENDADAS Y LICENCIAS

Para responder a la solicitud de fuentes oficiales y utilizables dentro del repositorio del proyecto, se recomiendan las siguientes bases de datos lexicográficas:

#### Para la Lengua Catalana:

* **Frecuencia General (L3-L10):**  
* **CTILC (Corpus Tècnic de l'Institut d'Estudis Catalans):** Es la fuente normativa de referencia oficial para la ortografía del IEC de 2017 y la variedad del catalán central.  
* **Llista de Freqüència de Softcatalà / CQPweb (UPF):** Extraída de corpus abiertos en catalán, con licencia libre (GPL/Creative Commons), muy fácil de exportar a CSV con formas y lemas.  
* **Vocabulario Infantil / Escolar (L0-L2):**  
* **BDLOC / BDEC (Base de Dades Lexicogràfica de Llengua Infantil i Escolar):** Corpus de adquisición de lenguaje infantil y textos escolares de educación primaria en catalán.  
* **Llistes d'Educació Primària (P5 a 2n de Primària):** Listas de vocabulario temático y de lectura inicial estandarizadas en los protocolos educativos de Catalunya (como los materiales del PRODISCAT).

#### Para la Lengua Castellana:

* **Frecuencia General (L3-L10):**  
* **EsPal (Spanish Psycholinguistic Database):** Es la base de datos de referencia psicolingüística en español. Incluye frecuencia por millón, número de sílabas, vecinos ortográficos e indicadores de imaginabilidad y **Edad de Adquisición (AoA)**.  
* **CORPES XXI / CREA (Real Academia Española):** Diccionario de frecuencias del español normativo.  
* **Vocabulario Infantil / Escolar (L0-L2):**  
* **LEXESP (Léxico Informatizado del Español):** Contiene sub-corpus escolares e infantiles ampliamente validados en la evaluación psicométrica de la lectura (base de pruebas como el PROLEC-R y PROLEXIA).

### 3\. MATICES TÉCNICOS Y REGLAS DE TRATAMIENTO LINGÜÍSTICO

Debes indicar a los desarrolladores los siguientes **tres criterios de procesamiento automático** para evitar errores en el motor de generación:

* **Tratamiento de la Apostrofación y Clíticos en Catalán (l', d', m', n', s'):**  
* Tal como indican los desarrolladores, las formas apostrofadas no deben buscarse como entradas únicas en la lista de frecuencia general.  
* *Regla de stripping:* El algoritmo debe limpiar el apóstrofe y el clítico antes de consultar el rango de frecuencia en la base de datos (ejemplo: ante *l'escola*, debe buscar el rango de *escola*). Sin embargo, la forma completa con apóstrofe debe conservarse en el texto final presentado al usuario (activity\_word\_split o audio\_reading).  
* **Filtro de Nombres Propios:**  
* Confirmar la regla de los desarrolladores: **se excluyen todos los nombres propios** (antropónimos y topónimos) de los ejercicios, excepto en textos de lectura en voz alta a partir de Level4, donde se permiten dentro del margen de flexibilidad del tema.  
* **Confirmación Ortográfica y Variedad Dialectal (Catalán):**  
* Debe confirmarse explícitamente que todas las listas para el catalán siguen la **normativa ortográfica del IEC de 2017** y la **variedad dialectal del catalán central** (de acuerdo con lo establecido en estructura-ca.md).

### 4\. VALIDACIÓN DEL USO DE LAS LISTAS POR TIPO DE EJERCICIO

Las reglas de uso propuestas por el equipo de desarrollo para cada tipo de actividad son **totalmente correctas**:  
Tipos de Ejercicio,Regla de Filtrado Algoritmico,Estado  
Reordenamiento de sílabas (SIL) Repetición rápida (REP) Parpadeo de palabras (BLK),La palabra seleccionada debe pertenecer estrictamente al rango de frecuencia del nivel objetivo (o inferior).,Aprobado  
Segmentación léxica (SEG) Lista de texto (LIS) Lectura en voz alta (LEC),Todas las palabras de la frase o párrafo deben estar dentro del rango de frecuencia del nivel objetivo.,Aprobado  
Posición de imágenes (IMG),"Exento del filtro: No requiere consulta de frecuencia porque las palabras proceden del banco de imágenes, cuyos nombres ya han sido evaluados y etiquetados por el experto en el CSV.",Aprobado

### 📋 RESUMEN Y PRÓXIMOS PASOS

1. **Aprobar la petición del equipo de desarrollo**, felicitándolos por la iniciativa de automatización.  
2. **Proporcionar/confirmar los archivos CSV de frecuencia** para castellano (**EsPal / CREA**) y catalán (**CTILC / BDLOC / Softcatalà**).  
3. **Exigir las columnas obligatorias:** forma, lema, categoria\_gramatical, frecuencia\_rango y, si está disponible, edad\_adquisicion.  
4. **Validar que las listas pre-filtradas actuarán como puerta de enlace (gatekeeper)** para que el generador automático nunca proponga palabras fuera de nivel, reservando la revisión humana final para el muestreo del 10% de control de calidad.

