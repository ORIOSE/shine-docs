Aquí tienes el **diagnóstico experto** detallado sobre el paquete de archivos de la lista general de frecuencia del catalán (**E02**, basada en **wordfreq \+ UD AnCora \+ Softcatalà / LanguageTool \+ revisión Opus de las 36.000 primeras formas**).

### 🟢 DIAGNÓSTICO GENERAL Y VALORACIÓN TÉCNICA (E02)

El trabajo de adaptación y depuración de la lista general del catalán (**51.547 formas**) demuestra una **solvencia lingüística y técnica extraordinaria**, resolviendo los desafíos estructurales de la lengua catalana en el entorno escolar y digital:

* **Normalización estricta a la reforma ortográfica del IEC (2017):**  
* La fusión de 144 formas diacríticas antiguas (*dóna, vénen, fóra* \\\\(\\rightarrow\\\\) *dona, venen, fora*) y la eliminación del diacrítico en compuestos (*rodamon, entresol, marededeu*) garantiza que los niños no reciban inputs desactualizados.  
* La corrección sobre el listado del encargo (excluyendo *sóc, seu* e incorporando los 15 oficiales: *bé, déu, és, mà, més, món, pèl, què, sé, sí, sòl, són, té, ús, vós*) deja la base **100% ajustada a la normativa vigente del IEC**.  
* **Tratamiento sistemático de la apostrofación y enclíticos:**  
* Descomponer e integrar las formas enclíticas (*dona'm, deixa'ls* \\\\(\\rightarrow\\\\) sumadas al verbo base) mientras se mantienen las elisiones aisladas (*l', d', m', n', s', t'*) es la solución óptima: el motor de la puerta léxica limpia el apóstrofe (*l'escola* \\\\(\\rightarrow\\\\) consulta *escola*), asegurando la concordancia de nivel.  
* **Estandarización tipográfica:**  
* La conversión sistemática a la **ela geminada con punto volado (l·l, Unicode U+00B7)** evita errores de parseo y renderizado en la aplicación.

### 📋 ANÁLISIS Y DICTAMEN SOBRE LOS 9 CRITERIOS PEDAGÓGICOS (E02)

\#,Criterio,Dictamen del Experto,Acción / Recomendación Concreta  
1,Diacríticos IEC 2017,Aprobado sin reservas.,"Confirmar la lista oficial de los 15 diacríticos (bé, déu, és, mà, més, món, pèl, què, sé, sí, sòl, són, té, ús, vós) y mantener los compuestos sin accentuar (rodamon, entresol)."  
2,"Formas homógrafas que suelen ser faltas/castellano (series, varem, presencia, creo, beso, anular)",Descartar por minoritarias.,"Aprobar la propuesta: Descartar la entrada si el uso correcto sin acento/diacrítico es muy minoritario en el corpus frente a la forma acentuada (sèries, vàrem, presència, anul·lar) o frente al castellano (creo, beso). Evita falsos positivos en el generador."  
3,"Topónimos no catalanizados (tokio, nigeria, austria, palencia)",Descartar si existe forma catalana.,"Descartar las grafías no catalanizadas (tokio, palencia) y exigir la forma normativa (Tòquio, Palència) categorizada como npropi."  
4,"Siglas de organizaciones (psc, erc, fgc)",Aprobado descarte.,"Correcto descartarlas para ejercicios de descodificación fonológica. Si aparecen en lectura continua (L4+), se tratan como npropi."  
5,Separación Malsonante vs. Sensible e Identidad,Aprobado (Crucial).,"• Malsonante / Sensible: Dividir en malsonante (insultos/vulgaridades) y sensible (anatomía, sexualidad, violencia). • Identidad: Retirar cualquier marca a términos de diversidad o identidad (gai, lesbiana, bisexual). No son palabras sensibles ni vulgares."  
6,"Dialectalismos (Valenciano, Balear, Occidental)",Aprobado con marcas regionalizadas.,"Mantener la marca dialectal en formas valencianas (xiquet, hui, este), baleares (al·lot, sa) u occidentales (tomata). • podis, xic: Mantener como estándar/central col·loquial. • mos: Marcar como dialectal."  
7,Coloquialismos de origen castellano,Criterio por aceptación del DIEC2.,"• Conservar: tio, nòvio, tonteria (admitidos o de uso coloquial extendido). • Descartar: barco, apretar, arrancar (barbarismos claros donde la forma normativa es vaixell, prémer, arrencar)."  
8,Vocabulario infantil en corpus de adultos,Aprobado con regla de rescate.,"Aprobar la propuesta: Si una palabra está en la Lista Infantil (E04), se considera dentro de rango desde Level3 en adelante, aunque su posición en el corpus general sea baja (llapis, joguina, bolígraf, maduixa, tobogan, estoig, gronxador)."  
9,"Formas flexionadas de imperfecto/subjuntivo (menjàvem, jugàvem)",Regla mixta (Lema \+ Tiempo Verbal).,Flexibilizar la puerta léxica si el lema está en rango Y la conjugación verbal corresponde al nivel curricular del alumno.

### 🔍 DIAGNÓSTICO DE LOS ARCHIVOS DE REVISIÓN (CSV)

* **ca-general.revision-muestra.csv (300 formas):**  
* El umbral del **3% máximo de error** (\\\\(\\le 9\\\\) errores sobre 300\) es el estándar psicométrico adecuado para dar por validada la lista.  
* **ca-general.revision-descartes.csv (2.610 descartes, 74 de alta frecuencia):**  
* La depuración de castellanismos (*bueno, barco*), faltas de acentuación (*presencia* por *presència*), siglas y palabras en otros idiomas es impecable y limpia la base de ruido.  
* **ca-general.revision-diacritics.csv (144 fusiones):**  
* La suma de frecuencias de las formas antiguas a las vigentes asegura que la posición en el ranking de la palabra normativa refleja su frecuencia real acumulada.  
* **ca-general.revision-marcas.csv (574 formas):**  
* La distribución (260 dialectales, 141 malsonantes, 173 extranjerismos) permite un control muy preciso en el generador.  
* **ca-general.revision-cambios.csv (1.850 correcciones de Opus):**  
* Corregir las desambiguaciones erróneas de UD AnCora (donde sustantivos comunes como *govern* o *col·legi* aparecían etiquetados como npropi por salir en titulares) ha sido un acierto lexicográfico clave.

### 🚀 CONCLUSIÓN Y PRÓXIMOS PASOS

La **lista general del catalán (ca-general.csv \- E02) es plenamente apta para producción**.  
Con la aplicación de estos 9 criterios, el motor de **Shine** dispone de una puerta léxica robusta, normativamente actualizada al IEC 2017 y adaptada a la realidad del aprendizaje de la lectura en Cataluña.  
