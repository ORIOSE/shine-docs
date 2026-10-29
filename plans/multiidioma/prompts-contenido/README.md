# Prompts de generación del contenido catalán

Un fichero por tipo de ejercicio, con la misma estructura que docs/generador/Banco de imágenes.md:
notas internas (contexto y decisiones) y, desde el título "Prompt", lo que se pega en Cowork o en
Codex para generar un lote. Cada prompt es autocontenido: lleva las reglas del tipo, las del
catalán y la forma exacta del registro del lote.

Los primeros lotes (Level0 a Level2, subplan 05, 2026-10-26) se generaron desde estos mismos
criterios: los de matriz y posición de imágenes con los scripts de shine/content/generadores/
(deterministas, con semilla, la clave origen del lote dice cuál y con qué semilla) y el resto a
mano. Todos pasan por drush shine-content:import --dry-run, se importan, los revisa el experto
(muestra del 10 %, al menos 5 por nivel) y se publican. En local se publican ya como contenido de
prueba, igual que los castellanos; en producción no se publica nada sin la revisión.

## Convenciones comunes a todos los lotes

- **Fuentes**: plans/multiidioma/estructura-ca.md (niveles, ciclo, términos, nivel mínimo por
  estructura), docs/exercise-catalog.md (contrato del lote, 4.3; parámetros por tipo, 5 y 6; lo
  que cambia en catalán, en cada tipo), docs/generador/Taxonomía fonológica (català).md y Guía de
  Parametrización (català).md, y para las imágenes el bloque ca de
  shine/content/images/manifest.json (nombre, artículo, silabeo del IEC, nivel lector catalán,
  etiquetas y usable; sale del CSV validado por el experto).
- **Ficheros**: shine/content/{tipo}-{idiomas}-level{a}-{b}-v{n}.json (matriz-es-ca-level0-2-v1.json,
  blink-ca-level0-2-v1.json, ciclo-sillabes-ca-v1.json). Objeto con lote, descripcion, origen y
  actividades.
- **Idioma**: registro compartible (mismo material en los dos idiomas: matriz de letras universales,
  posición de imágenes) con idiomas [es, ca], código sin XX y titulo, instruccion y nombre de las
  imágenes como objeto {es, ca}. Registro propio del catalán con idioma ca y código TIPO-CA-Lnn-AREA-nnn.
  Nunca se traduce un lote castellano: el material catalán se redacta en catalán.
- **Códigos**: antes de cada lote, drush shine-content:inventory --lang=ca --type=... (y --lang=es
  si el lote lleva idiomas) para tomar el siguiente número libre; con idiomas el número tiene que
  estar libre en los dos idiomas. Nunca se reutiliza un código.
- **Niveles**: hoy existen Level0, Level1 y Level2 en local (los demás términos de activity_level
  están pendientes, catálogo 2.5). Objetivo mínimo del subplan 05: 3 actividades publicadas por
  área y nivel en Level0 a Level2 (el mínimo de régimen del catálogo 3.3 es 6).
- **Áreas, niveles, ciclo y explicación** se referencian por su nombre canónico castellano
  (Competencia Lingüística y Fonológica, Level1, Sílabas, Letter matrix); los **términos de
  sonoridad y esfuerzo**, por su nombre catalán (estructura-ca.md 3 y 4): "Directes inicials (CV)",
  "Dígrafs simples", "tx/ig", "grafies s/ss/c/ç"...
- **Textos del registro en catalán**: título corto en lenguaje del niño ("Síl·labes amb m",
  "Troba totes les b", "On era?"), instrucción con tratamiento de tú, apóstrofo tipográfico (’),
  comillas «» y punto volado U+00B7 en l·l. Instrucciones de referencia:
  - parpadeo: "Llegeix cada síl·laba en veu alta així que aparegui i toca per passar a la següent."
  - matriz: "Toca totes les lletres iguals a la que et demanem. Si en marques una per error,
    torna-la a tocar. Quan les tinguis totes, prem Comprovar."
  - posición de imágenes: "Mira bé on és cada dibuix. Després et preguntarem en quina posició era
    un d’ells."
  - reordenamiento de sílabas: "Mira el dibuix i toca les síl·labes en ordre per formar el seu
    nom." (sin imagen: "Toca les síl·labes en ordre per formar la paraula.")
  - segmentación: "La frase està escrita sense espais. Toca una lletra per posar-hi un espai just
    al davant, fins a separar totes les paraules, i prem Comprovar."
  - repetición rápida: "Digues tu primer la paraula perquè l’alumne la senti i ensenya-la-hi. Quan
    premis Començar, la paraula s’amagarà: l’alumne l’ha de repetir en veu alta tantes vegades com
    pugui mentre tu comptes."
- **Ortografía y silabeo**: normativa del IEC. Los dígrafos tx, ix, ig, tg, tj, ss, rr, l·l se
  separan entre sílabas (cot-xe, cai-xa, pet-xi-na, met-ge, plat-ja, tas-sa, car-ro, col-le-gi) y
  ny, ll, qu, gu van unidos (pi-nya, llu-na, quin, gui-neu). Hiatos en sílabas distintas (pi-a-no,
  lle-ó). Las contracciones y apóstrofos (al, del, l’avi, d’un) aparecen desde Level3.
- **Alivio**: en parpadeo, repetición rápida y lista, el 25 a 30 % de los elementos son de alivio
  (sílabas o palabras de Level0, en catalán: a, e, ma, pa, sol, pa), intercalados en posiciones al
  azar, nunca agrupados al final, y sin etiquetar en sonoridad ni esfuerzo.
- **Letras**: el importador admite en frases y palabras las letras del castellano y del catalán
  (tildes abiertas y cerradas, ñ, ü, ï, ç, l·l y apóstrofo). Los elementos del parpadeo tienen
  como mucho 20 caracteres en Level0 a Level2.
- **Validación**: drush shine-content:import content/{lote}.json --dry-run (duplicados y
  solapamiento por idioma incluidos); después --publish en local. Revisión del experto registrada
  en plans/multiidioma/revisio-lots-ca.md.

## Desde el 2026-10-28: catálogo completo

Los prompts 08 (llista de text) y 09 (lectura en veu alta) se añadieron al hacerse importables
esos dos tipos. El plan del catálogo completo (Level0 a Level10, los dos idiomas, 6 por celda), el
orden de trabajo y los prompts castellanos están en plans/contenido/README.md y
plans/contenido/prompts-es/. Los de matriz (01) y posición de imágenes (02) de aquí sirven para
los dos idiomas.
