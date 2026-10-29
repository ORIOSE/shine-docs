# Completar el vocabulario infantil por temas (5 a 7 años)

Contexto: app de lectura para niños con dislexia. Estamos construyendo la lista de vocabulario de
los niveles Level0 (5 años), Level1 (6 años) y Level2 (7 años). Ya tenemos unos 3.300 lemas
candidatos sacados de una lista de frecuencia de adultos, del banco de imágenes de la app y de los
ejercicios ya revisados (fichero de candidatos, un lema por línea). Las listas de adultos dejan
fuera mucho vocabulario infantil ("chupete", "columpio", "tobogán", "gominola"; "xumet",
"gronxador", "llaminadura"). Tu trabajo es añadir ese vocabulario.

Variedad: **castellano peninsular** tal como lo usa un niño en Cataluña, o **catalán central**
(norma IEC 2017), según se indique.

## Qué hacer

Recorre estos temas y escribe los lemas que un niño de 5 a 7 años conoce y que **no están** en el
fichero de candidatos (compruébalo con grep antes de escribirlos):

familia y personas; cuerpo y salud; ropa y calzado; casa, muebles y objetos de casa; cocina y
utensilios; comida, frutas, verduras, dulces y bebidas; animales domésticos, de granja, salvajes,
insectos, aves y del mar; juguetes y juegos; parque y calle; escuela y material escolar;
transportes; oficios; tiempo atmosférico, estaciones y naturaleza; plantas y flores; colores y
formas; números, medidas y tiempo (días, meses, horas); fiestas y celebraciones (cumpleaños,
Navidad: solo nombres comunes); música y deportes; emociones y sentimientos; acciones cotidianas
(verbos); cualidades (adjetivos); posiciones y lugares (adverbios y preposiciones); palabras del
lenguaje infantil (chuche, cole, guau, nana; xixi, pipí, mam, nyam si son de uso real) y
onomatopeyas comunes.

Para cada lema, `nivel`: 0 (lo conoce a los 5 años), 1 (a los 6), 2 (a los 7). En caso de duda, el
más alto. El nivel es el del vocabulario, no el de la lectura. Sin nombres propios, sin palabras
vulgares, sin regionalismos ajenos a la variedad pedida, solo palabras reales de uso corriente.
Categorías: nom, verb, adj, adv, det, pron, prep, conj, interj, num.

Objetivo: entre 500 y 900 lemas nuevos, repartidos por todos los temas.

## Salida

TSV (UTF-8, tabulador, con cabecera):

```
lema	categoria	nivel	tema
chupete	nom	0	casa
columpio	nom	0	parque
```

Sin comillas ni columnas de más, una fila por lema, ninguno repetido ni presente en los candidatos.
No escribas fuera de tu fichero de salida y tu carpeta temporal. Al acabar, responde solo con el
número de lemas por nivel y por tema.
