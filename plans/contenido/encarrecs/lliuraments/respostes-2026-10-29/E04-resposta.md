Aquí tienes el **diagnóstico experto** detallado sobre el paquete de archivos del vocabulario infantil del catalán (**E04**, basado en el proceso híbrido de **Opus \+ Softcatalà / LanguageTool \+ Banco de Imágenes \+ Muestreo Temático Infantil** para niños de 5 a 8 años en catalán central y normativa IEC 2017).

### 🟢 DIAGNÓSTICO GENERAL Y VALORACIÓN TÉCNICA (E04)

Al igual que en el castellano, las listas generales de frecuencia en catalán (como el CTILC o corpus generales) están fuertemente sesgadas hacia el lenguaje adulto, periodístico y formal (*tanmateix, mitjançant, entitat*), mientras que el léxico de uso cotidiano infantil (*xumet, gronxador, llaminadura, nino, pilota*) queda artificialmente desplazado a posiciones muy bajas.  
El trabajo realizado en **ca-infantil.csv (2.554 lemas y 12.511 formas flexionadas)** soluciona este desajuste y proporciona una puerta léxica infantil sólida y adaptada a la realidad escolar de Catalunya.  
**Puntos fuertes del trabajo realizado:**

* **Cobertura muy superior a los mínimos del encargo:**  
* **Level0 (5 años / P5):** 615 lemas / 2.657 formas (mínimo exigido: 500).  
* **Level1 (6 años / 1.º Primaria):** 979 lemas / 7.938 formas acumuladas (mínimo exigido: 1.000).  
* **Level2 (7 años / 2.º Primaria):** 960 lemas / 12.511 formas acumuladas (mínimo exigido: 2.000).  
* **Rescate activo de 873 lemas infantiles por campos temáticos:**  
* La incorporación de palabras clave de la vida diaria del niño (*xumet, gronxador, llaminadura, nino, xocolata*) evita que los generadores automáticos produzcan textos fríos o distantes.  
* **Adecuación dialectal y normativa:**  
* Normalización estricta al **catalán central** (priorizando *vermell* frente a *roig*) y alineación con la **normativa IEC del 2017**.  
* **Descomposición flexional ajustada al habla infantil:**  
* Las 12.511 formas incluyen las flexiones reales en boca de un niño (*menja, mengen, menjava, menjarà, menjat*) eliminando formas verbales arcaicas o no utilizadas en el lenguaje oral infantil.

### 📋 ANÁLISIS Y DICTAMEN SOBRE LOS CRITERIOS PEDAGÓGICOS (E04)

\#,Criterio / Pregunta,Dictamen del Experto,Acción / Recomendación Concreta  
1,Tiempos verbales y exclusión del pasado simple,Aprobado sin reservas.,"• En el nivel del lema: Presente, imperfecto, imperativo, infinitivo, gerundio y participio. • A partir de Level1: Futuro, condicional y presente de subjuntivo. • Exclusiones acertadas: Se excluyen el imperfecto de subjuntivo y el pasado simple sintético (menjà), ya que los niños en catalán central usan exclusivamente el pasado perifrástico (va menjar)."  
2,Resolución de conflictos con lotes ya revisados (75 casos),Aprobar el rescate (Ajustar a la baja en la lista).,"Aprobar la propuesta: Las palabras que el grupo de expertos ya validó en los lotes de L0-L2 (ala, pipa, lila, lupa, dau, fil, tela, carro) deben bajar su nivel en la lista infantil a Nivel 0 o Nivel 1\. La revisión del lote constituye la prueba clínica definitiva de su idoneidad. Las sílabas aisladas (lla, lli, aix, eix) se ignoran en el filtro léxico."  
3,Un nivel por lema,Aprobado como regla general.,"Asignar el nivel al lema para simplificar el motor de la puerta léxica, permitiendo excepciones pragmáticas puntuales (papa \= Nivel 0; llar d'infants / llar \= Nivel 2)."  
4,Lista Infantil como 'Bypass' de la General desde Level3,Aprobado (Crucial).,"Aprobar la regla: Toda palabra incluida en la lista infantil catalana (E04) se considera dentro de rango de frecuencia desde Level3 en adelante, evitando que el ranking del corpus de adultos bloquee palabras sencillas (gronxador, 36.604)."

### ⚡ RESOLUCIÓN DE CASOS DUBLINOSES SEÑALADOS EN LA REVISIÓN

* **Coloquialismos e influencias del castellano:**  
* **maco / guapo:** Mantener en **Nivel 0** (admitidos en el DIEC y de uso natural infantil).  
* **tio:** **Descartar** por castellanismo no normativo.  
* **Nombres de letras (*cu, ge, pe*):**  
* Asignar a **Nivel 1** (coincidiendo con el inicio de la enseñanza formal del abecedario y la lectura sintética).  
* **Polisemia y vocabulario pragmático:**  
* **papa:** Asignar a **Nivel 0** (en el sentido de *pare* / padre).  
* **dret:** Asignar a **Nivel 1** (como adjetivo: *estar dret* / de pie).  
* **ple / bé (como sustantivos):** Descartar como sustantivos abstractos, manteniendo *ple* como adjetivo (L0) y *bé* como adverbio/interjección (L0).  
* **mam, nones, bua, nino-nino:** **Aceptar en Nivel 0** como onomatopeyas y lenguaje infantil en ejercicios de conciencia fonológica inicial.

### 🔍 DISOCIACIÓN ENTRE VOCABULARIO Y ESTRUCTURA GRÁFICA

El archivo ca-infantil.revision-estructura.csv identifica **6.063 formas** donde el nivel de comprensión oral/vocabulario es muy temprano (Nivel 0 o 1), pero la estructura silábica exige un nivel de descodificación lectora superior:

* **gat, sol, pa, cap, dit:** Vocabulario de **Nivel 0** (comprensión oral), pero con estructura de **Level1** (monosílabo con coda / CVC). La regla aprobada permite utilizarlas como vocabulario desde Nivel 0, dejando que el filtro de estructura controle cuándo introducirlas según el tipo de ejercicio.  
* **xocolata:** Vocabulario **Nivel 0**, pero **Level2** por longitud polisilábica.  
* **cotxe, gronxador:** Vocabulario **Nivel 0**, pero **Level2** por dígrafos (*tx*) y estructura mixta.  
* **col·legi:** Vocabulario **Nivel 1**, pero **Level3** por ela geminada (*l·l*).

### 🚀 CONCLUSIÓN Y PRÓXIMOS PASOS

La **lista de vocabulario infantil del catalán (ca-infantil.csv \- E04) está excelente y lista para producción**.

* Se acepta la muestra si el control de revisión de 300 lemas (ca-infantil.revision-muestra.csv) alcanza o supera el **90% de coincidencia**.  
* Con la aplicación automática del ajuste a la baja en los 75 conflictos de lotes y la regla del *bypass* para Level3+, el sistema dispone de una base léxica completamente coordinada con el currículo de Educación Infantil y Cicle Inicial en Catalunya.

