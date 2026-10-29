# Revisión de una tanda de la lista de frecuencia general del castellano

Contexto: app de lectura para niños con dislexia (5 a 15 años, castellano peninsular). Esta lista
sirve de puerta léxica: el generador de ejercicios rechaza palabras por encima del rango de
frecuencia de su nivel. Las frecuencias vienen de wordfreq (mezcla de subtítulos, Wikipedia,
noticias, libros, redes sociales; castellano de España y de América). El lema y la categoría
vienen de los treebanks UD AnCora y GSD (columna `origen` = ud, `ud_n` = apariciones en UD;
`otras_ud` = otras lecturas vistas en UD, formato categoria:lema:apariciones) o faltan
(`origen` = pendiente).

Categorías permitidas: nom, verb, adj, adv, det, pron, prep, conj, interj, num, npropi.

## Qué hacer con CADA fila de tu tanda

1. **pendiente**: rellenar lema y categoría (acción `completar`) o descartar la forma.
2. **ud**: comprobar lema y categoría. Si son erróneos, `corregir`. Desconfía sobre todo de
   `ud_n` 1 o 2 (errores típicos: "hagas" con lema "hagar", "vengo" con lema "vengar", nombres
   comunes etiquetados npropi por ir en mayúscula en un título). Con `ud_n` alto, corrige solo
   si es claramente erróneo. La categoría debe ser la lectura más frecuente de la forma en el
   uso general, no una rara.
3. **descartar** (acción `descartar`, con motivo en nota) lo que no es una palabra castellana
   normal escrita bien: palabras inglesas u otras lenguas sin uso en castellano ("the", "you"),
   jerga de internet ("jaja", "xd", "lol"), letras sueltas salvo a, e, o, u, y; abreviaturas y
   siglas ("sr", "vs", "http", "dr"); errores ortográficos o formas sin la tilde obligatoria
   ("ahi", "pais", "algun", "tambien"; nota: `sin tilde: ahí`); fragmentos y onomatopeyas
   de chat ("jajaja", "mmm"). No descartes nombres propios: van como npropi (personas, lugares,
   marcas), aunque sean extranjeros.
4. **marcar** (columna `marca`, se puede combinar con completar o corregir; si solo marcas, acción
   `marcar`):
   - `malsonante`: vulgar, sexual, insulto o tabú ("joder", "puto", "pedo" en sentido vulgar).
     Ante la duda, márcala: es una app infantil.
   - `americano`: forma o palabra de uso americano y no peninsular: voseo ("tenés", "tenes",
     "querés", "sos", "vos"), y léxico como "computadora", "carro" (coche), "celular",
     "manejar" no (tiene usos generales). Marca solo si el
     uso dominante de la forma es americano. "ustedes" NO es americano.
   - `extranjera`: préstamo no adaptado de uso frecuente en castellano ("online", "show",
     "email", "ok" si no lo descartas).
   Varias marcas se unen con `+` ("malsonante+americano").

Convención de lemas (diccionario de la RAE): verbos en infinitivo (también con clíticos:
"hacerlo" → hacer, "dime" → decir); nombres en singular; adjetivos en masculino singular;
determinantes y pronombres demostrativos y posesivos en masculino singular ("estas" → este,
"tuya" → tuyo); pronombres personales: "ella", "ellos", "ellas" → él; "nosotras" → nosotros;
"vosotras" → vosotros; "me", "te", "se", "nos", "os", "lo", "la", "los", "las", "le", "les",
"mí", "ti", "usted", "ustedes" (→ usted), "vos", "conmigo", "contigo" son su propio lema;
"yo", "tú", "nosotros", "vosotros" también. Contracciones "al", "del": lema la propia forma,
categoría prep. Números escritos ("tres", "mil") → num. Participios usados como adjetivo
("cansado"): adj si ese es el uso dominante.

## Salida

Escribe un fichero TSV (UTF-8, tabulador, con cabecera) SOLO con las filas que cambian o se
marcan. Las filas `ud` que no aparezcan se aceptan tal cual; TODAS las `pendiente` deben
aparecer (completar o descartar).

```
forma	accion	lema	categoria	marca	nota
hagas	corregir	hacer	verb
jaja	descartar				internet
tenes	marcar	tener	verb	americano
carajo	marcar	carajo	interj	malsonante
```

- En `corregir`, `completar` y `marcar` pon siempre lema y categoría finales (aunque no cambien).
- En `descartar`, lema, categoría y marca vacíos; motivo breve en `nota`.
- Sin comillas, sin columnas de más, una fila por forma.

Lee tu tanda entera (son unas 4.500 líneas; léela en partes con offset y limit) y revisa todas
las filas, no solo una muestra. Al acabar, responde solo con: número de filas en el fichero de
salida por acción, y 5 casos dudosos que convenga que revise un lingüista (forma y por qué).
