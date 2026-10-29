# Clasificar lemas por edad de vocabulario infantil (5 a 7 años)

Contexto: app de lectura para niños con dislexia. Esta lista decide qué palabras pueden aparecer en
los ejercicios de los tres primeros niveles: Level0 (5 años, P5), Level1 (6 años, 1.º de primaria) y
Level2 (7 años, 2.º de primaria). Las listas de frecuencia de adultos engañan aquí: "gobierno" o
"tanmateix" están altísimos y "chupete" o "xumet" muy abajo.

Variedad: **castellano peninsular** tal como lo usa un niño en Cataluña, o **catalán central**
(norma IEC 2017), según la tanda.

## Qué hacer con CADA fila

Columnas de entrada: lema, categoria, rango_lema (posición del lema en la lista general de adultos;
vacío si viene de otra fuente), banco_imagenes (sí si hay una ilustración del objeto en la app),
lotes_L0_L2 (sí si ya sale en ejercicios de Level0 a Level2 revisados por expertos).

Asigna `nivel`:
- **0**: la palabra forma parte del vocabulario (activo o pasivo) de un niño de 5 años sin
  dificultades: familia, cuerpo, casa, comida, animales comunes, juguetes, colores, números
  pequeños, acciones cotidianas (comer, jugar, dormir), adjetivos básicos (grande, bonito) y las
  palabras gramaticales que ya usa (el, de, y, que, mi, no, con, por, para, muy...).
- **1**: la conoce a los 6 años (primer curso): escuela, más animales y alimentos, oficios, tiempo,
  verbos y adjetivos algo menos frecuentes.
- **2**: la conoce a los 7 años (segundo curso).
- **no**: no es vocabulario habitual de un niño de 7 años (abstracto, técnico, formal, adulto:
  "gobierno", "mediante", "sin embargo", "tanmateix", "mitjançant"), o es un nombre propio, o es
  vulgar, o no es de la variedad pedida.

Reglas:
1. El nivel es el del **vocabulario**, no el de la lectura: "chocolate" o "xocolata" son nivel 0
   aunque sean difíciles de leer; la estructura la filtra otro proceso.
2. **En caso de duda, el nivel más alto** (o "no" si dudas entre 2 y "no").
3. Las palabras gramaticales sí cuentan: si un niño de 5 años las usa, nivel 0.
4. Si el lema o la categoría están mal (p. ej. un nombre común como npropi, un lema erróneo),
   escribe la corrección en las columnas `lema_correcto` y `categoria_correcta`; si no, déjalas vacías.
5. Categorías permitidas: nom, verb, adj, adv, det, pron, prep, conj, interj, num.

## Salida

TSV (UTF-8, tabulador, con cabecera) con **TODAS** las filas de la tanda, en el mismo orden:

```
lema	categoria	nivel	lema_correcto	categoria_correcta	nota
gato	nom	0
gobierno	nom	no
pelota	nom	0
```

Sin comillas, sin columnas de más. Lee la tanda entera (unas 1.100 líneas, por partes con offset y
limit) y decide fila a fila; no uses scripts que decidan por ti (Bash solo para leer o comprobar el
formato). No escribas fuera de tu fichero de salida y tu carpeta temporal. Al acabar, responde solo
con el número de filas por nivel (0, 1, 2, no) y 5 casos dudosos.
