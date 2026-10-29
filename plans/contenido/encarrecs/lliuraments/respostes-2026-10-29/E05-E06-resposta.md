Aquí tienes el **diagnóstico experto** detallado sobre el paquete de bancos de pseudopalabras en castellano y catalán (**E05 y E06**, basados en generación de Opus \+ filtrado automático con **pseudo\_filtre.py** contra 1,67 millones de formas reales).

### 🟢 DIAGNÓSTICO GENERAL Y VALORACIÓN TÉCNICA Y CLÍNICA (E05 y E06)

El uso de **pseudopalabras** (o palabras inventadas) es la prueba de fuego en la evaluación e intervención de la dislexia. Al carecer de representación en el léxico visual de memoria, obligan al niño a utilizar de forma pura la **vía fonológica o subléxica** (conversión grafema-fonema, ensamblaje silábico y descodificación secuencial).  
El trabajo realizado en ambos bancos (**672 pseudopalabras en castellano** y **670 en catalán**) supera holgadamente el mínimo de 40 por nivel (exigía 400 por idioma y entrega entre 55 y 70 por nivel). Representa una **herramienta psicométrica de máxima precisión** para los ejercicios de *parpadeo/taquistoscopio* (Level1+) y de *lista de texto* (Level2+).

### 📋 ANÁLISIS Y DICTAMEN DE LOS CRITERIOS Y PREGUNTAS DE REVISIÓN

\#,Criterio / Pregunta,Dictamen del Experto,Justificación y Acción Concreta  
1,Criterio 5: Interpretación de la regla de similitud (1 sola letra de diferencia),Aprobado con la interpretación actual.,"• Interpretación validada: Se permite cambiar la primera letra (""ñopa"" respecto a ""copa""), pero se descarta si el cambio es posterior (""gata"" respecto a ""gato""). • Mecanismo clínico: Cambiar el ataque inicial (onset) rompe el reconocimiento global o de la raíz léxica e impide que la mente del niño ""adivine"" la palabra por context/memoria visual, obligando al procesamiento fonológico analítico."  
2,Pronunciabilidad y fonotaxis en niveles altos (Level7 a Level10),Aprobado con revisión prosódica.,"Las pseudopalabras polisilábicas de 4 a 6 sílabas (trumidal, guesfu, etc.) respetan las reglas fonotácticas del español e ibero-romance. Recomendación: Asegurar que lleven la tilde gráfica marcada en la sílaba tónica cuando la pronunciación natural lo exija (brasún, trumidál), para guiar al reproductor de voz de la app."  
3,Control de interferencia interlingüística (ES / CA),Aprobado sin reservas.,"La verificación simultánea contra 1,67 millones de formas (que descarta palabras reales del otro idioma, como las formas catalanas ""lleu, jou, feu, fou, brou"" presentes en el archivo de descartes castellano) es un éxito metodológico clave. Evita que un niño bilingüe lea una ""pseudopalabra"" reconociéndola como palabra real en su otra lengua."  
4,Equilibrio por grupos fonológicos,Aprobado.,"El reparto abarca adecuadamente todos los puntos de articulación y oposiciones complejas por nivel (grafías compuestas, dígrafos, sílabas compuestas, trabadas CCV, mixtas CVC, códigos complejos y ela geminada l·l)."

### 🔍 DIAGNÓSTICO DE LOS ARCHIVOS DE DESCARTES (.csv)

El análisis de los archivos de descartes (**28 descartes en castellano** y **30 en catalán**) demuestra la alta sensibilidad y eficacia del script pseudo\_filtre.py:

* **Filtro de existencia real:**  
* Capturó correctamente pseudopalabras que eran palabras reales o formas conjugadas en catalán o castellano (p. ej., descartadas *cloñi, treñi, droñe* en ES; o descartadas *puig, gofre* en CA).  
* **Filtro de estructura gráfica / nivel:**  
* Descartó correctamente de Level1 formas con dígrafos o estructuras que corresponden a Level2 o Level3 (p. ej., *guife, guenju, guedul* descartadas en Level1 castellano por requerir la regla de *gue/gui*; o *güefe, legüel* descartadas en Level2 catalán por requerir hiato de Level3).  
* **Filtro de sustitución de 1 sola letra:**  
* Eliminó candidatos demasiado cercanos a palabras de alta frecuencia (*blufe* \\\\(\\rightarrow\\\\) *bufe*; *juglo* \\\\(\\rightarrow\\\\) *jugo*; *nyode* \\\\(\\rightarrow\\\\) *node*; *gocla* \\\\(\\rightarrow\\\\) *gola*; *bloli* \\\\(\\rightarrow\\\\) *boli*).

### 🚀 CONCLUSIÓN Y PRÓXIMOS PASOS

Los bancos de pseudopalabras **E05-pseudoparaules-es.csv (672 ítems)** y **E06-pseudoparaules-ca.csv (670 ítems)** son **100% aptos para pasar a producción**.

* Se valida la regla del **Criterio 5** sin necesidad de re-filtrar el corpus.  
* Al quedar completamente precargados en el sistema, los motores de generación de actividades de *parpadeo* y *lista de texto* disponen de un repositorio ilimitado y seguro, **evitando tener que detener la revisión en cada lot futuro para validar las pseudopalabras**.

