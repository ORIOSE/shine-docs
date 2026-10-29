Aquí tienes el **diagnóstico experto** detallado sobre el paquete de archivos del vocabulario infantil del castellano (**E03**, basado en el proceso híbrido de **Opus \+ CORPES XXI \+ Banco de Imágenes \+ Muestreo Temático Infantil** para niños de 5 a 8 años).

### 🟢 DIAGNÓSTICO GENERAL Y VALORACIÓN TÉCNICA (E03)

El trabajo realizado para construir la base de vocabulario infantil del castellano (**2.408 lemas y 26.878 formas flexionadas**) resuelve el principal problema de la lectoescritura inicial: **la distorsión de los corpus de adultos**.  
En los corpus de adultos (como CORPES XXI o CREA), términos cotidianos para un niño de 5 a 7 años (*chupete, columpio, tobogán, gominola, pelota*) quedan relegados a posiciones muy bajas (rango \>30.000), mientras que palabras abstractas (*gobierno, mediante, entidad*) aparecen en las primeras posiciones.  
**Puntos fuertes de la solución generada:**

* **Volumen muy superior a los mínimos del catálogo:**  
* **Level0 (5 años):** 867 lemas / 8.686 formas (el mínimo exigido era 500).  
* **Level1 (6 años):** 878 lemas / 18.403 formas acumuladas (mínimo 1.000).  
* **Level2 (7 años):** 663 lemas / 26.878 formas acumuladas (mínimo 2.000).  
* **Rescate activo de léxico infantil por campos semánticos (668 lemas añadidos por Opus):**  
* La inclusión explícita de categorías temáticas de la infancia (juegos, parque, escuela, ropa, cuerpo, familia, animales, alimentos, emociones, onomatopeyas e interjecciones) garantiza que los textos de L0 a L2 sean **naturales, motivadores y representativos del lenguaje oral del niño**.  
* **Descomposición flexional ajustada a la infancia:**  
* Mapear las 26.878 formas flexionadas reales a partir de los lemas asegura que el generador no solo reconozca el infinitivo (*comer*), sino las formas que el niño realmente lee e identifica (*come, comía, comían, comiendo*).

### 📋 ANÁLISIS Y DICTAMEN SOBRE LOS CRITERIOS PEDAGÓGICOS (E03)

\#,Criterio / Pregunta,Dictamen del Experto,Acción / Recomendación Concreta  
1,Regla de flexión verbal por niveles,Aprobado sin reservas.,"• En el nivel del lema: Presente, pretérito perfecto/imperfecto, imperativo, infinitivo, gerundio y participio. • A partir de Level1: Futur y presente de subjuntivo (comerá, coma). • Excluidos en L0-L2: Imperfecto y futuro de subjuntivo (comiera, comiese). Es una regla morfosintáctica impecable."  
2,Nivel por lema vs. Nivel por forma (Casos pragmáticos),Regla general por lema con excepciones por forma.,"• Norma general: Asignar el nivel al lema. • Excepción para fórmulas/fórmulas fijas: Permitir la asignación de nivel a la forma/locución específica cuando el sentido pragmático infantil supera al lema abstracto (p. ej., gracias en Nivel 0 aunque gracia sea L1/L2; vale en Nivel 0; de nada en L0; de repente en L1; los deberes en L1)."  
3,Lista Infantil como 'Bypass' de la General desde Level3,Aprobado (Crucial).,"Aprobar la regla: Toda palabra incluida en la lista infantil (L0, L1 o L2) se considera automáticamente dentro de rango de frecuencia desde Level3 en adelante, anulando cualquier ""penalización"" de ranking del corpus de adultos (columpio, tobogán, gominola)."

### 🔍 ANÁLISIS DE CASOS DUBLINOSES Y DISOCIACIÓN ESTRUCTURAL

* **Gestión de casos dudosos señalados en la revisión:**  
* **papa / fe:** Correcto dejarlas fuera o restrinjir su uso si no representan el léxico infantil primario (diferenciando *papá* en Nivel 0 de *papa/Papa*).  
* **liga / mundial:** Mantener en **Nivel 2** (léxico deportivo muy presente en la conversación escolar de 7 años).  
* **bajo (preposición):** Asignar a **Nivel 2**, priorizando *debajo de* para Nivel 0 y Nivel 1\.  
* **Disociación entre Vocabulario (Semántica) y Estructura Silábica (Descodificación):**  
* El archivo es-infantil.revision-estructura.csv identifica **11.768 formas** cuyo nivel de vocabulario oral es muy temprano (Nivel 0 o 1), pero cuya estructura gráfica exige un nivel de descodificación superior:  
* *chocolate*: Vocabulario **Nivel 0** (comprensión oral), pero **Level1/Level2** por longitud (4 sílabas) y polisílaba.  
* *grande*: Vocabulario **Nivel 0**, pero **Level2** por estructura silábica trabada (CCV: *gran-*).  
* **Dictamen:** Esta separación es la clave del diseño de **Shine**. La lista infantil mide **disponibilidad léxica/comprensión**, mientras que el motor de estructura (estructura.py) filtra la **complejidad de descodificación**. Ambas puertas actúan en coordinación: el generador escoge palabras del nivel de vocabulario del niño, pero respeta la restricción de sílabas del nivel lector.

### 🚀 CONCLUSIÓN Y PRÓXIMOS PASOS

La **lista de vocabulario infantil del castellano (es-infantil.csv \- E03) es excelente y apta para pasar a producción**.

* Se puede dar por aceptada la muestra si el control de revisión de 300 lemas (es-infantil.revision-muestra.csv) supera el **90% de coincidencia** (teniendo en cuenta el margen de \\\\(\\pm 1\\\\) nivel "en caso de duda, el más alto").  
* La aplicación de los criterios de flexión verbal y el "bypass" léxico para Level3+ garantizan la máxima coherencia pedagógica en los lotes de la plataforma.

