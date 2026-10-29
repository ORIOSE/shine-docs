Aquí tienes el **diagnóstico experto** detallado sobre el paquete de archivos de la lista general de frecuencia del castellano (**v2**, basada en **CORPES XXI** \+ **Opus** \+ **UD Treebanks**).

### 🟢 DIAGNÓSTICO GENERAL Y VALORACIÓN TÉCNICA

El paso de la versión 1 (basada en wordfreq) a la versión 2 (basada en **CORPES XXI v1.5**, con 453 millones de formas) representa un **salto cualitativo extraordinario**. La metodología aplicada soluciona los principales cuellos de botella de la generación de contenidos educativos y logopédicos:

1. **Reparto de elementos multipalabra (MWE):** Descomponer 10,5 millones de apariciones de locuciones y tiempos compuestos (*"han sido"* \\\\(\\rightarrow\\\\) *haber* y *ser*; *"sin embargo"* \\\\(\\rightarrow\\\\) *embargo*, que escala del rango 15.251 al 178\) es una **decisión metodológica brillante**. El niño decodifica token a token en pantalla, por lo que la frecuencia individual del término refleja su dificultad real.  
2. **Ajuste peninsular de la 2.ª persona del plural (*vosotros*):** Corregir el sesgo latinoamericano del CORPES alineando el rango de *tenéis, vosotros, os, vuestro* al de sus equivalentes de 3.ª persona (*tienen, ustedes*) resuelve limpiamente la nivelación en España sin alterar el dato de origen (rango\_corpes).  
3. **Integración de SUBTLEX-ESP:** Contar con SUBTLEX-ESP como columna de consulta psicológica/infantil complementa el filtro sin comprometer la licencia.

### 📋 ANÁLISIS Y DICTAMEN SOBRE LOS 9 CRITERIOS PEDAGÓGICOS

\#,Criterio,Dictamen del Experto,Acción / Recomendación Concreta  
1,Ajuste de vosotros,Aprobado sin reservas.,Mantener la regla actual (asignar el rango de la 3.ª persona del plural). Es clínicamente imprescindible para el castellano peninsular.  
2,Vocabulario infantil en corpus de adultos,Aprobado con regla de rescate.,"Aprobar la propuesta: Si una palabra está en la Lista Infantil (E03), se considera dentro de rango desde Level3 en adelante, aunque su posición en CORPES sea baja (bolígrafo, columpio, tobogán)."  
3,Formas flexionadas raras (jugábamos),Regla mixta (Lema \+ Tiempo Verbal).,"El filtrado estricto por forma aísla formas verbales habituales. Propuesta de flexibilización: Permitir una forma flexionada si su lema está en rango Y el tiempo verbal pertenece al currículo del nivel (p. ej., pretérito imperfecto en L3-L4)."  
4,"Voseo (tenés, querés, sos)",Aprobado.,Mantener la marca americano.  
5,Separación Malsonante vs. Sensible,Aprobado (Crucial).,"Dividir en dos marcas: • malsonante: insueltos o vulgaridades (joder, mierda, culo). Bloqueo automático. • sensible: temas anatómicos, de salud o biológicos (sexual, semen, suicidio). Se permiten en textos informativos/educativos a partir de nivels superiores (L5+) con revisión."  
6,Palabras polisémicas con sentido vulgar,Criterio por subgrupos.,"• Retirar marca: caca, pito (uso infantil/neutro habitual en España). • Mantener marca sensible: concha, zorra, perra, pelotas, mariquita. Generan alerta en el creador pero no se bloquean si el contexto es neutro."  
7,Americanismos con uso peninsular secundario,Mantener marca americano.,"Mantener la marca para advertir al generador de que en España existen alternativas preferentes (zumo vs jugo, enfadar vs enojar, bonito vs lindo)."  
8,"Siglas (psoe, tve, ugt)",Mantener descarte en generador.,"Correcto descartarlas para ejercicios de descodificación fonológica. En lectura continua (L4+), si aparecen, se tratan como npropi."  
9,Lema de diminutivos (mesita \\\\(\\rightarrow\\\\) mesa),Aprobado.,"Asignar la base léxica como lema (mesita \\\\(\\rightarrow\\\\) mesa) para el recuento de sobreuso, evaluando la dificultad de descodificación sobre la forma escrita."

### 🔍 DIAGNÓSTICO DE LOS ARCHIVOS DE REVISIÓN (CSV)

* **es-general.revision-muestra.csv (300 formas):**  
* El umbral del **3% máximo de error** (\\\\(\\le 9\\\\) errores sobre 300\) es un criterio de calidad psicométrica y lexicográfica totalmente robusto para dar por aceptada la lista.  
* **es-general.revision-descartes.csv (1.198 formas):**  
* Los 27 descartes de alta frecuencia (\\\\(\>20\\\\)/millón: *l, b, pp, p, c, II, eeh, psoe, km, adn*) están **correctamente filtrados**. Son letras sueltas, números romanos, siglas u onomatopeyas orales que entorpecerían la generación de actividades fonológicas.  
* **es-general.revision-marcas.csv (776 formas):**  
* La categorización inicial es muy acertada. Aplicar la división entre malsonante y sensible resolverá los casos de términos científicos o corporales.  
* **es-general.revision-discrepancias.csv (221 formas):**  
* Las divergencias entre CORPES y v1 (*cuando* adv/conj, *primer* num/adj, *mismo* pron/adj) responden a la ambigüedad categorial propia del español. El esquema de 11 categorías simplificadas y el sesgo de la categoría principal resuelven este solapamiento correctamente.

### 🚀 CONCLUSIÓN Y PRÓXIMOS PASOS

La **versión 2 de es-general.csv es plenamente apta para producción** y constituye una base lexicográfica de altísimo nivel para la puerta léxica de **Shine**.  
Se pueden validar las respuestas a los 9 criterios descritos para que el equipo técnico aplique los últimos ajustes en la tubería de generación (build/es-general/corpes.py).  
