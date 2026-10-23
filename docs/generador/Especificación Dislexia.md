# ESPECIFICACIÓN TÉCNICA DEL GENERADOR AUTOMÁTICO DE CONTENIDO (v2.0)

**Sistema de Entrenamiento Lector y Tratamiento de la Dislexia***Fecha de actualización: 16 de octubre de 2026*

## 1\. INTRODUCCIÓN Y REGLAS CLÍNICAS INCORPORADAS

Esta versión de la especificación técnica actualiza los algoritmos de generación automática de actividades para responder a cuatro principios pedagógicos y neuropsicológicos clave:

1. **Andamiaje subléxico graduado:** Combinación explícita de sílabas, pseudopalabras (combinaciones no existentes pero fonotácticamente válidas) y palabras reales dentro del mismo ejercicio (ejemplo: *Fa* \\\\(\\rightarrow\\\\) *fau* \\\\(\\rightarrow\\\\) *Fauna*).  
2. **Prevención de la fatiga cognitiva (Islas de alivio):** Intercalado sistemático (25-30%) de elementos de baja exigencia (Level0/Level1) en ejercicios de niveles intermedios y avanzados.  
3. **Contención del "muro de texto":** Restricción de la lectura en voz alta a un **máximo estricto de 1 párrafo** (30 a 80 palabras), concentrando la dificultad en la densidad léxica y las estructuras silábicas en lugar del volumen.  
4. **Reducción del hacinamiento visual (*Visual Crowding*):** Inserción de un 40-50% de distractores neutros/distantes en las matrices de discriminación visual para agilizar el rastreo y mantener la motivación.

## 2\. REGLAS GLOBALES DE COMPOSICIÓN LÉXICA Y ESTRUCTURAL

   ┌────────────────────────────────────────────────────────────────────────┐  
   │                       ESTRUCTURA DE SECUENCIA                          │  
   │  \[ Ítem Objetivo \] ──► \[ Pseudopalabra \] ──► \[ Ítem de Alivio (L0/L1) \]│  
   └────────────────────────────────────────────────────────────────────────┘

### 2.1. Matriz de Distribución de Contenido por Actividad Secuencial (vertical\_list y activity\_blink)

Nivel Target,Total Ítems,Ítems Nivel Target (Palabras Reales),Pseudopalabras / Patrones del Nivel,Ítems de Alivio Cognitivo (L0/L1)  
Level0 (5 años),6,4 (CV simples),0,2 (Vocales / CV directa)  
Level1 (6 años),8,4 (2-3 sílabas),"2 (CV/VC no palabras: pso, pro)",2 (CV alta frecuencia)  
Level2 (7 años),8,4 (Trabadas CCV),2 (Trabadas no palabras: frou),2 (Bisílabas L0/L1)  
Level3 (8 años),10,5 (Complejas/Hiatos),2 (Pseudopalabras CCVC),3 (Directas sencillas)  
Level4 (9 años),10,5 (Frecuencia media),2 (Pseudopalabras 2 sílabas),3 (Bisílabas frecuentes)  
Level5 (10 años),12,6 (4-5 sílabas),3 (Pseudopalabras 3 sílabas),3 (Monosílabas/Bisílabas)  
Level6 (11 años),12,6 (Compuestas/Raras),3 (Pseudopalabras complejas),3 (Palabras L1)  
Level7 (12 años),12,6 (Vocabulario académico),3 (Pseudopalabras 4 sílabas),3 (Palabras L1/L2)  
Level8 (13 años),15,8 (Tecnicismos),3 (Baja frecuencia raras),4 (Palabras frecuentes)  
Level9 (14 años),15,8 (Polisílabas 6+ sílabas),3 (Pseudopalabras 5 sílabas),4 (Palabras frecuentes)  
Level10 (15 años),15,8 (Sintaxis/Léxico denso),3 (Pseudopalabras complejas),4 (Palabras frecuentes)

## 3\. ESPECIFICACIÓN DETALLADA POR TIPO DE EJERCICIO

### 3.1. Lista de Texto (vertical\_list)

* **Node Type:** activity  
* **Formato:** vertical\_list  
* **Área Principal:** Competencia Lingüística y Fonológica o Rendimiento y Velocidad de Procesamiento.  
* **Mecánica:** Muestra un elemento a la vez en fuente adaptada. Avance mediante toque. Medición de latencia por elemento (field\_time en ms).

#### Reglas del Generador:

1. **Agrupación Fonética:** El generador seleccionará un grupo consonántico o patrón objetivo por lote (ejemplo: /pr/, /br/, /f/).  
2. **Secuencia de Andamiaje:** Organizar el lote en tríadas: *Síliba/Patrón* \\\\(\\rightarrow\\\\) *Pseudopalabra derivada* \\\\(\\rightarrow\\\\) *Palabra real del grupo* \\\\(\\rightarrow\\\\) *Ítem de alivio*.  
3. **Límite de Caracteres por Pantalla:** Máximo 20 caracteres (Level0-Level2), 60 caracteres (Level3-Level5), 120 caracteres (Level6-Level10).

#### Esquema de JSON para la Generación:

{  
  "tipo": "activity",  
  "formato": "vertical\_list",  
  "codigo": "LIS-L02-LIN-004",  
  "titulo": "Familia F y Fr con alivio",  
  "area\_principal": "Competencia Lingüística y Fonológica",  
  "area\_secundaria": "Rendimiento y Velocidad de Procesamiento",  
  "niveles": \["Level2"\],  
  "instruccion": "Lee cada palabra con atención y toca la pantalla para pasar a la siguiente.",  
  "contenido": {  
    "grupo\_fonetico\_objetivo": "F / FR",  
    "elementos": \[  
      "Fa",  
      "fau",  
      "Fauna",  
      "pelo",  
      "fra",  
      "frou",  
      "Franja",  
      "mano",  
      "fle",  
      "Flecha"  
    \],  
    "desglose\_tipos": \[  
      "silaba",  
      "pseudopalabra",  
      "palabra\_real",  
      "alivio",  
      "silaba",  
      "pseudopalabra",  
      "palabra\_real",  
      "alivio",  
      "silaba",  
      "palabra\_real"  
    \],  
    "segundos\_por\_elemento": 2.5  
  }  
}

### 3.2. Lectura en Voz Alta (audio\_reading)

* **Node Type:** activity  
* **Formato:** audio\_reading  
* **Área Principal:** Rendimiento y Velocidad de Procesamiento.  
* **Mecánica:** Presentación de un **único párrafo continuo**. Registro del audio y medición del tiempo total de lectura para cálculo de PCPM (Palabras Correctas Por Minuto).

#### Reglas del Generador:

* **Límite Estricto de Extensión:** **Exactamente 1 párrafo** en todos los niveles.  
* **Escala de Longitud por Nivel:**  
* **Level1:** 30 a 40 palabras.  
* **Level2 \- Level3:** 40 a 50 palabras.  
* **Level4 \- Level6:** 50 a 65 palabras.  
* **Level7 \- Level10:** 65 a 80 palabras (Máximo absoluto).  
* **Progresión por Densidad Léxica:** La dificultad se ajusta incrementando la proporción de palabras compuestas, sílabas complejas (CCVC/CVCC), tecnicismos y sintaxis subordinada dentro de ese párrafo único.

#### Ejemplo de Párrafo por Nivel (Level2 vs. Level10):

* **Level2 (45 palabras \- Grupos /tr/ y /pr/):**  
* "El tren de Pedro cruza el prado verde. En la playa hay una planta pequeña y un plato con fruta fresca. Pedro camina con prisa para no perder el tren mientras su hermano prueba una trampa de juguete."  
* **Level10 (75 palabras \- Densidad léxica académica y sintaxis compleja):**  
* "La interconexión de los mercados financieros globales exige una regulación transparente que prevenga crisis sistémicas. Aunque la implementación de estas medidas macroeconómicas genera discrepancias entre los analistas, la reestructuración de las infraestructuras digitales resulta imprescindible para garantizar la estabilidad institucional frente a la volatilidad internacional."

#### Esquema de JSON para la Generación:

{  
  "tipo": "activity",  
  "formato": "audio\_reading",  
  "codigo": "LEC-L06-VEL-002",  
  "titulo": "Desafíos de la biodiversidad",  
  "area\_principal": "Rendimiento y Velocidad de Procesamiento",  
  "area\_secundaria": "Competencia Lingüística y Fonológica",  
  "niveles": \["Level6"\],  
  "instruccion": "Pulsa 'Empezar a leer', lee el texto en voz alta y pulsa 'He terminado'.",  
  "contenido": {  
    "parrafos": \[  
      "Aunque la biodiversidad del planeta enfrenta desafíos extraordinarios, los científicos trabajan en laboratorios subterráneos para proteger especies en peligro. La observación constante de estos ecosistemas permite diseñar estrategias eficaces antes de que las transformaciones climáticas causen daños irreversibles en la vegetación local."  
    \],  
    "numero\_palabras": 44,  
    "grupo\_fonetico\_densidad": "Sílabas complejas y palabras compuestas",  
    "segundos\_referencia": 30.0  
  }  
}

### 3.3. Parpadeo / Lectura Ágil (activity\_blink)

* **Node Type:** activity\_blink  
* **Área Principal:** Rendimiento y Velocidad de Procesamiento.  
* **Mecánica:** Muestra sílabas, pseudopalabras o combinaciones breves. Salto automático o por toque rápido según el parámetro field\_seconds.

#### Reglas del Generador:

* **Estructura idéntica a vertical\_list:** Intercalado de alivio (25-30%) y estructuración por familias fonéticas.  
* **Velocidad de Exposición Ajustada (field\_seconds por elemento):**  
* **Level0:** 3.0 s | **Level1:** 2.5 s | **Level2-Level3:** 2.0 s | **Level4:** 1.8 s | **Level5-Level6:** 1.5 s | **Level7-Level8:** 1.2 s | **Level9-Level10:** 1.0 s.

#### Esquema de JSON para la Generación:

{  
  "tipo": "activity\_blink",  
  "codigo": "BLK-L03-VEL-005",  
  "titulo": "Ráfaga de sílabas trabadas TR y BL",  
  "area\_principal": "Rendimiento y Velocidad de Procesamiento",  
  "area\_secundaria": "Competencia Lingüística y Fonológica",  
  "niveles": \["Level3"\],  
  "instruccion": "Lee cada combinación antes de que desaparezca.",  
  "contenido": {  
    "elementos": \[  
      "tra",  
      "trau",  
      "trapo",  
      "no",  
      "bla",  
      "blau",  
      "blanco",  
      "si",  
      "trans",  
      "trasgo"  
    \],  
    "desglose\_tipos": \[  
      "silaba\_trabada",  
      "pseudopalabra",  
      "palabra\_real",  
      "alivio",  
      "silaba\_trabada",  
      "pseudopalabra",  
      "palabra\_real",  
      "alivio",  
      "estructura\_compleja",  
      "palabra\_real"  
    \],  
    "segundos\_por\_elemento": 2.0  
  }  
}

### 3.4. Matriz de Discriminación Visual (activity\_letter\_matrix)

* **Node Type:** activity\_letter\_matrix  
* **Área Principal:** Procesos Perceptivos (Discriminación Visual y Auditiva).  
* **Mecánica:** Cuadrícula de caracteres donde el usuario debe pulsar todas las instancias del estímulo objetivo en un tiempo determinado.

#### Reglas del Generador (Poblado Mixto):

* **Composición de Distractores:**  
* **50% Distractores de Alta Confusión (Afines/Espejo):** Letras/sílabas con alta similitud gráfica (ejemplo: *b, p, q* para objetivo *d*).  
* **50% Distractores Neutros/Distantes:** Letras/sílabas sin rasgos gráficos compartidos (ejemplo: *o, s, m, t*).  
* **Distribución Espacial:** Los objetivos deben distribuirse de manera uniforme en la cuadrícula sin adyacencias inmediatas (no más de 2 objetivos seguidos en la misma fila o columna).

   Ejemplo de Cuadrícula Mixta (Level3 \- Objetivo 'd'):  
   ┌───┬───┬───┬───┬───┬───┐  
   │ o │ d │ s │ q │ m │ b │  \<-- Mezcla de neutros (o, s, m)  
   ├───┼───┼───┼───┼───┼───┤      y confusos (q, b)  
   │ p │ m │ o │ d │ s │ q │  
   └───┴───┴───┴───┴───┴───┘

#### Esquema de JSON para la Generación:

{  
  "tipo": "activity\_letter\_matrix",  
  "codigo": "MAT-L03-PER-002",  
  "titulo": "Encuentra la letra d",  
  "area\_principal": "Procesos Perceptivos (Discriminación Visual y Auditiva)",  
  "area\_secundaria": "Funciones Ejecutivas y Atención",  
  "niveles": \["Level3"\],  
  "instruccion": "Toca todas las 'd' que veas antes de que acabe el tiempo.",  
  "contenido": {  
    "objetivo": \["d"\],  
    "columnas": 6,  
    "filas": 5,  
    "distractores\_confusos": \["b", "p", "q"\],  
    "distractores\_neutros": \["o", "s", "m", "t"\],  
    "tiempo\_limite\_segundos": 50,  
    "rondas": \[  
      \[  
        "o", "d", "s", "q", "m", "b",  
        "p", "m", "o", "d", "s", "q",  
        "s", "b", "d", "m", "o", "p",  
        "d", "o", "p", "s", "b", "m",  
        "m", "q", "s", "d", "o", "b"  
      \]  
    \]  
  }  
}

### 3.5. Posición de Imágenes (activity\_image\_position)

* **Node Type:** activity\_image\_position  
* **Área Principal:** Memoria de Trabajo (Auditiva y Visual).  
* **Mecánica:** Muestra un grupo de \\\\(N\\\\) imágenes. Tras pulsar "Siguiente", se pregunta en qué posición estaba un elemento concreto.

#### Configuración por Nivel:

* **Level0 \- Level1:** 2 a 3 imágenes/grupo. Pregunta sobre extremos (posición 1 o última). Nombres CV muy frecuentes.  
* **Level2 \- Level5:** 3 a 5 imágenes/grupo. Pregunta sobre posiciones centrales. Categorías amplias o específicas.  
* **Level6 \- Level10:** 5 a 6 imágenes/grupo. Elementos con alta similitud visual, cromática o fonológica (*pato, pala, pan, pino*).

#### Esquema de JSON para la Generación:

{  
  "tipo": "activity\_image\_position",  
  "codigo": "IMG-L04-MEM-003",  
  "titulo": "¿Dónde estaba cada objeto?",  
  "area\_principal": "Memoria de Trabajo (Auditiva y Visual)",  
  "area\_secundaria": "Funciones Ejecutivas y Atención",  
  "niveles": \["Level4"\],  
  "instruccion": "Observa las imágenes detenidamente y memoriza su orden.",  
  "contenido": {  
    "grupos": \[  
      {  
        "posicion\_preguntada": 3,  
        "imagenes": \[  
          {"nombre": "león", "fichero": "leon.png"},  
          {"nombre": "oso", "fichero": "oso.png"},  
          {"nombre": "caballo", "fichero": "caballo.png"},  
          {"nombre": "oveja", "fichero": "oveja.png"}  
        \]  
      }  
    \]  
  }  
}

### 3.6. Reordenamiento de Sílabas (activity\_syllable\_order)

* **Node Type:** activity\_syllable\_order  
* **Área Principal:** Competencia Lingüística y Fonológica.  
* **Mecánica:** Fichas desordenadas que el usuario debe arrastrar o tocar en secuencia para reconstruir la palabra.

#### Reglas del Generador:

1. **Silabeo Explícito:** Almacenamiento directo de las sílabas separadas por guion en la base de datos (evita fallos de silabeadores automáticos en runtime).  
2. **Validación de Unicidad (Desambiguación):** Comprobar mediante el léxico que las sílabas proporcionadas no permitan formar otra palabra válida diferente (ejemplo: descarta *co-sa / sa-co* salvo que se controle de forma explícita).  
3. **Sílabas Sobrantes (Level5 en adelante):** Incorporar 1 o 2 sílabas distractora de alta confusión ortográfica (*bra* cuando la palabra lleva *bar*).

#### Esquema de JSON para la Generación:

{  
  "tipo": "activity\_syllable\_order",  
  "codigo": "SIL-L07-LIN-002",  
  "titulo": "Ordena las sílabas complejas",  
  "area\_principal": "Competencia Lingüística y Fonológica",  
  "area\_secundaria": "Memoria de Trabajo (Auditiva y Visual)",  
  "niveles": \["Level7"\],  
  "instruccion": "Arrastra las sílabas para formar la palabra correcta.",  
  "contenido": {  
    "palabras": \[  
      {  
        "palabra\_completa": "embarrada",  
        "silabas\_ordenadas": \["em", "ba", "rra", "da"\],  
        "silabas\_sobrantes": \["bra"\],  
        "imagen\_pista": null  
      }  
    \]  
  }  
}

### 3.7. Segmentación Léxica (activity\_word\_split)

* **Node Type:** activity\_word\_split  
* **Área Principal:** Competencia Lingüística y Fonológica.  
* **Mecánica:** Muestra oraciones amalgamadas (sin espacios). El usuario toca entre las letras para insertar los límites de palabra.

#### Configuración de Desafíos Léxicos por Nivel:

* **Level1 \- Level3:** Uniones de artículos, preposiciones y conjunciones (*el, la, en, y*).  
* **Level4 \- Level6:** Contracciones (*al, del*) y pronombres átonos o enclíticos (*se lo dio, dámelo*).  
* **Level7 \- Level10:** Homófonos y pares dudosos (*a ver / haber, si no / sino, por qué / porque*).

#### Esquema de JSON para la Generación:

{  
  "tipo": "activity\_word\_split",  
  "codigo": "SEG-L07-LIN-001",  
  "titulo": "Separa las palabras correctamente",  
  "area\_principal": "Competencia Lingüística y Fonológica",  
  "area\_secundaria": "Rendimiento y Velocidad de Procesamiento",  
  "niveles": \["Level7"\],  
  "instruccion": "Toca entre las letras para insertar los espacios que faltan.",  
  "contenido": {  
    "frases": \[  
      {  
        "cadena\_amalgamada": "vamosaversiayerañadiobienlascuentas",  
        "oracion\_resuelta": "vamos a ver si ayer añadió bien las cuentas"  
      }  
    \]  
  }  
}

## 4\. MATRIZ RESUMEN DE COBERTURA Y BALANCE DE CONTENIDO

Para garantizar la cobertura completa de las 5 áreas de evaluación y entrenamiento en los 11 niveles de la aplicación, el generador automático debe cumplir con los siguientes mínimos por celda:  
   ┌────────────────────────────────────────────────────────────────────────┐  
   │                          OBJETIVO DE CONTENIDO                         │  
   │  55 celdas (5 áreas × 11 niveles) × 10 actividades \= 550 actividades   │  
   └────────────────────────────────────────────────────────────────────────┘  
Prefijo,Tipo de Actividad,Área Principal de Asignación,Mínimo por Celda (Nivel)  
LIS,Lista de texto,Competencia Lingüística / Velocidad,10 actividades  
LEC,Lectura en voz alta,Rendimiento y Velocidad de Procesamiento,10 actividades  
BLK,Parpadeo,Rendimiento y Velocidad de Procesamiento,10 actividades  
IMG,Posición de imágenes,Memoria de Trabajo (Auditiva y Visual),10 actividades  
MAT,Matriz visual,Procesos Perceptivos,10 actividades  
SIL,Reorden de sílabas,Competencia Lingüística y Fonológica,10 actividades  
SEG,Segmentación léxica,Competencia Lingüística y Fonológica,10 actividades

## 5\. RECOMENDACIÓN DE IMPLEMENTACIÓN PIPELINE (DRUPAL / DRUSH)

Para procesar e importar este volumen de contenido generado, se utilizará el comando de importación masiva en Drupal:  
\# Validación previa sin escritura en BD  
ddev drush shine-content:import \--file=lote\_level2\_v2.json \--dry-run

\# Importación y publicación automática  
ddev drush shine-content:import \--file=lote\_level2\_v2.json \--publish  
Este comando valida automáticamente las restricciones de longitud, densidad léxica, formato de imágenes y unicidad del código field\_activity\_code antes de escribir en la base de datos de producción.  
He actualizado la especificación completa del generador de contenido con todas las reglas clínicas y de composición acordadas. ¿Hay algún otro detalle de la pipeline de importación o del catálogo que te gustaría ajustar?  
