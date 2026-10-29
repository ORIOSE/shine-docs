# Matriz de discriminación visual: notas y prompt de generación

Lotes de `activity_letter_matrix` (prefijo MAT) para los dos idiomas. Notas internas en las
secciones 1 a 3; desde el título "Prompt", lo que se pega en Cowork o en Codex. Convenciones
comunes de todos los lotes en [README.md](README.md).

## 1. Qué es compartible y qué no

- **Compartible** (un registro con `idiomas` [es, ca], el importador crea un nodo por idioma con el
  mismo material): las matrices de letras universales y sus confusiones visuales, que son las
  mismas en los dos idiomas: espejos b-d, p-q, b-p, d-q, rotaciones n-u, m-w, y la g como
  distractor extra desde Level4. También las de sílabas y palabras cuyas celdas se lean igual en
  los dos idiomas (bra, bar, dra, pra en Level7 y Level8), siempre que el equipo terapéutico lo
  confirme sílaba a sílaba.
- **Propio de cada idioma** (`idioma` ca o es, código con XX): las matrices con grafías de un solo
  idioma. En catalán: l·l entre ll y l, ç entre c (y ç/c/s), ny entre n y y, ix entre x e is,
  accentos abiertos y cerrados (à/á, è/é, ò/ó), dièresi (ï, ü). Son el término de esfuerzo
  "Grafies diacrítiques i especials" (estructura-ca.md 4.4), válido en cualquier nivel; el primer
  lote las coloca desde Level2, cuando el niño ya lee los dígrafos (tabla 2.3 catalana). Las de
  palabras reales (Level9 y Level10: casa, caça, cosa; got, gat, gos) son siempre de un idioma.

## 2. Primer lote (2026-10-26, subplan 05)

`shine/content/matriz-es-ca-level0-2-v1.json`, generado con
`shine/content/generadores/matriz.py` (Python 3 estándar, determinista):

```bash
cd shine/content && python3 generadores/matriz.py --seed 4411 --out matriz-es-ca-level0-2-v1.json
```

- 9 matrices con `idiomas` [es, ca] (18 nodos): Level0 con d, q y m (p y b ya existían), Level1 con
  b, d y n, Level2 con d, q y u; parámetros de docs/exercise-catalog.md 6.1 (3×4, 4×5 y 4×6; 2
  rondas; 3, 4 y 5 objetivos por ronda; sin tiempo en Level0 y Level1, 60 s en Level2).
  Distractores: en Level0 solo neutros (o, s, a); en Level1 uno parecido más dos neutros; en Level2
  dos parecidos más dos neutros. El esfuerzo va por idioma (`{"es": ["Espejo b-d"], "ca": ["Mirall
  b-d"]}`) solo cuando hay un distractor parecido (Level0 no lleva).
- 1 matriz solo catalana de l·l entre ll, l e il, esfuerzo "Grafies diacrítiques i especials".
  Era MAT-CA-L02-PER-001; el experto la movió a Level3, el nivel mínimo de la ela geminada
  (resposta-revisio-lots-ca.md, punto 3, 2026-10-27). El nodo de Level2 está despublicado y el
  registro es ahora MAT-CA-L03-PER-001 en shine/content/matriz-ca-level3-v1.json
  (`python3 generadores/matriz.py --catalan --seed 4411 --out matriz-ca-level3-v1.json`, 5 × 6,
  6 objetivos, 50 s), que se importa cuando exista el término Level3 (catálogo 2.5).
- **Nivel mínimo de las grafías catalanas** (estructura-ca.md 5): ç y ny desde Level1, ix desde
  Level2, l·l desde Level3. Una matriz no baja del nivel mínimo de su objetivo.
- **Level3 a Level6 en el generador** (2026-10-28): `LEVELS` y `TARGETS` cubren ya Level0 a Level6
  (letras; Level5 añade las rotaciones n y u como distractores, y desde Level4 no hay tope por
  fila). Level7 a Level10 (sílabas, palabras, pseudopalabras) son material de cada idioma y los
  escribe el prompt. `--levels 0,1,2` limita la generación a esos niveles.
- Reglas que el generador comprueba por ronda: el objetivo exactamente N veces, al menos uno en
  cada mitad, como mucho 2 por fila (Level0 a Level3), distractores con diferencia máxima de 1 y
  las dos rondas distintas. Semilla 4411; `--first L0=3,L1=2,L2=2` es el primer número libre por
  nivel en los dos idiomas según el inventario de ese día.
- Importado y publicado en local el 2026-10-26 (dry-run sin errores ni avisos; 19 nodos; la segunda
  pasada da 19 sin cambios). Pendiente de la revisión del experto (revisio-lots-ca.md).

## 3. Antes de cada lote nuevo

```bash
cd shine
ddev drush shine-content:inventory --type=activity_letter_matrix            # los dos idiomas
ddev drush shine-content:inventory --type=activity_letter_matrix --lang=ca  # solo catalán
```

Con `idiomas` el número de código tiene que estar libre en es y en ca a la vez (hoy, tras el
primer lote: Level0 006, Level1 005, Level2 005). Para volver a generar con el script, cambiar
`TARGETS`, `FIRST_CODE` (o `--first`) y la semilla; para niveles nuevos, añadir sus parámetros a
`LEVELS`.

---

## Prompt

> Todo lo que sigue se pega en Cowork o en Codex. Sustituir lo que va entre llaves.

Actúas como generador de contenido de **Shine**, una aplicación de ejercicios de lectura para
niños y jóvenes con dislexia (5 a 15 años) en castellano y en catalán. Tienes que producir un lote
de **matrices de discriminación visual** (`activity_letter_matrix`): una cuadrícula de letras,
sílabas o palabras parecidas entre sí en la que el niño toca todas las apariciones del objetivo
("Encuentra todas las p" / "Troba totes les p") mientras una barra de tiempo se vacía. El lote es
un fichero JSON que importa `drush shine-content:import`; con un solo error no se importa nada,
así que cada registro tiene que cumplir las reglas de abajo exactamente.

### Qué generar

{Nivel o niveles, número de matrices por nivel, objetivos a usar o evitar, e idioma: compartibles
con `idiomas` [es, ca] o propias del catalán. Ejemplo: "6 matrices de Level3 con idiomas [es, ca],
objetivos b, d, p y q, y 3 matrices solo catalanas de Level3 con ç, l·l y ny".}

Lo que ya existe (no repetir material ni códigos): {salida de
`drush shine-content:inventory --type=activity_letter_matrix`, o el JSON de `--out`}.

### Parámetros por nivel (docs/exercise-catalog.md 6.1)

| Nivel | Estímulo | Columnas × filas | Rondas | Objetivos por ronda | Distractores | Tiempo por ronda (segundos) |
|---|---|---|---|---|---|---|
| Level0 | Letras muy distintas | 3 × 4 | 2 | 3 | Sin rasgos en común con el objetivo (p entre o, s, a) | sin tiempo |
| Level1 | Letras | 4 × 5 | 2 | 4 | Uno parecido más neutros (p entre q, o, s) | sin tiempo |
| Level2 | Letras | 4 × 6 | 2 | 5 | Dos parecidos más neutros (p entre q, b, o, s) | 60 |
| Level3 | Letras | 5 × 6 | 2 | 6 | Especulares b, d, p, q más neutros | 50 |
| Level4 | Letras | 6 × 7 | 1 | 7 | b, d, p, q, g | 45 |
| Level5 | Letras | 6 × 8 | 1 | 8 | b, d, p, q, g más rotaciones n, u, m, w | 35 |
| Level6 | Letras | 5 × 10 | 1 | 8 | b, d, p, q, g, densa | 25 |
| Level7 | Sílabas | 4 × 7 | 1 | 7 | Inversiones y trabadas (bra, bar, dra, pra) | 40 |
| Level8 | Sílabas | 4 × 8 | 1 | 8 | Ídem, con doble objetivo ("bra, dra") | 40 |
| Level9 | Palabras cortas | 3 × 7 | 1 | 6 | Pseudopalabras con una letra cambiada | 45 |
| Level10 | Palabras | 3 × 8 | 1 | 8 | Palabras reales parecidas, doble objetivo | 45 |

Pares de confusión: espejos b-d, p-q, b-p, d-q; rotaciones n-u, m-w; g como distractor extra de
b, d, p, q. Distractores neutros: o, s, a, e, i, t, c, r (nunca una letra que se parezca al
objetivo). Con letras, como mucho 6 columnas; con palabras, 3.

### Catalán: grafías propias (solo con `idioma` ca)

- Objetivos y distractores con grafías del catalán: **l·l** (con el punto volado U+00B7, nunca un
  punto normal ni un guion) entre **ll** y **l**; **ç** entre **c** y **s**; **ny** entre **n**,
  **y** e **in**; **ix** entre **x**, **is** y **xi**; vocales con acento abierto y cerrado (**è**
  entre **é** y **e**; **ò** entre **ó** y **o**) y con dièresi (**ï** entre **i** e **í**).
- Las celdas se separan por espacios: una celda puede tener más de un carácter ("l·l", "ny").
- Desde Level2 (el niño ya lee los dígrafos); el término de esfuerzo es "Grafies diacrítiques i
  especials". Sílabas y palabras con fonética catalana (ce, ci, ge, gi, vocal neutra) nunca van
  en un registro compartido.
- Sílabas y palabras en Level7 a Level10: léxico catalán (silabeo del IEC: cot-xe, cai-xa) y
  pseudopalabras con fonotaxis catalana; pares mínimos reales en Level10 (casa, caça, cosa; got,
  gat, gos; pala, bala; sol, sal).

### Reglas de cada ronda

1. El objetivo aparece **exactamente** `objetivos_por_ronda` veces (ni una más por azar) y los
   distractores nunca coinciden con él. Con doble objetivo ("bra, dra"), la suma de los dos es
   `objetivos_por_ronda`.
2. Celdas = columnas × filas.
3. Objetivos repartidos: al menos uno en la mitad de arriba y otro en la de abajo y, en Level0 a
   Level3, como mucho 2 en la misma fila.
4. Distractores equilibrados: cada uno aparece un número de veces parecido (diferencia máxima
   de 1).
5. Las rondas de una misma actividad son distintas entre sí, y ninguna cuadrícula se repite en el
   lote ni en el inventario.
6. Minúsculas; sin HTML ni cifras.

### Forma del registro

Registro compartible (letras universales):

```json
{
  "tipo": "activity_letter_matrix",
  "codigo": "MAT-L01-PER-005",
  "idiomas": ["es", "ca"],
  "titulo": {"es": "Encuentra todas las q", "ca": "Troba totes les q"},
  "area_principal": "Procesos Perceptivos (Discriminación Visual y Auditiva)",
  "area_secundaria": "Funciones Ejecutivas y Atención",
  "niveles": ["Level1"],
  "instruccion": {
    "es": "Toca todas las letras iguales a la que te pedimos. Si marcas una por error, vuelve a tocarla. Cuando las tengas todas, pulsa Comprobar.",
    "ca": "Toca totes les lletres iguals a la que et demanem. Si en marques una per error, torna-la a tocar. Quan les tinguis totes, prem Comprovar."
  },
  "explicacion": "Letter matrix",
  "esfuerzo": {"es": ["Espejo p-q"], "ca": ["Mirall p-q"]},
  "contenido": {
    "objetivo": "q",
    "columnas": 4,
    "filas": 5,
    "rondas": [
      "q o p s s q o p o q s p o s q p o p s o",
      "p q s o q p o s q o s p q s o p o q s p"
    ],
    "objetivos_por_ronda": 4
  },
  "origen": {"generador": "{herramienta}", "version": "{versión}", "semilla": {semilla}}
}
```

Registro propio del catalán:

```json
{
  "tipo": "activity_letter_matrix",
  "codigo": "MAT-CA-L02-PER-005",
  "idioma": "ca",
  "titulo": "Troba totes les ç",
  "area_principal": "Procesos Perceptivos (Discriminación Visual y Auditiva)",
  "area_secundaria": "Funciones Ejecutivas y Atención",
  "niveles": ["Level2"],
  "instruccion": "Toca totes les lletres iguals a la que et demanem. Si en marques una per error, torna-la a tocar. Quan les tinguis totes, prem Comprovar.",
  "explicacion": "Letter matrix",
  "esfuerzo": ["Grafies diacrítiques i especials"],
  "contenido": {
    "objetivo": "ç",
    "columnas": 4,
    "filas": 6,
    "rondas": ["ç c s o c ç o s s o c ç c s ç o o ç s c c o s ç", "..."],
    "objetivos_por_ronda": 5,
    "segundos": 60
  },
  "origen": {"generador": "{herramienta}", "version": "{versión}", "semilla": {semilla}}
}
```

Notas del contrato:

- `codigo`: MAT-Lnn-PER-nnn con `idiomas` (sin idioma: lo inserta el importador y el número tiene
  que estar libre en es y en ca), MAT-CA-Lnn-PER-nnn o MAT-ES-Lnn-PER-nnn con `idioma`. `Lnn` es el
  nivel; nnn empieza en el siguiente número libre del inventario y nunca se reutiliza.
- `titulo` e `instruccion`: texto, o un objeto por idioma con `idiomas`. Títulos en lenguaje del
  niño: "Encuentra todas las {objetivo}" / "Troba totes les {objetiu}"; con doble objetivo,
  "Encuentra las bra y las dra" / "Troba les bra i les dra".
- `esfuerzo`: términos de segundo nivel del idioma del nodo; con `idiomas`, un objeto por idioma.
  Castellano: Espejo b-d, Espejo p-q, Espejo b-p, Espejo d-q, Rotación n-u, Rotación m-w. Catalán:
  Mirall b-d, Mirall p-q, Mirall b-p, Mirall d-q, Rotació n-u, Rotació m-w, Grafies diacrítiques i
  especials. Solo cuando hay un distractor parecido (en Level0, ninguno). `sonoridad` no se usa.
- `segundos` solo en los niveles con tiempo (entero de 1 a 600). `objetivos_por_ronda` siempre.
- `origen` no se guarda en Drupal; sirve para regenerar el lote.
- El fichero del lote es un objeto `{"lote": "...", "descripcion": "...", "origen": {...},
  "actividades": [...]}`. Nombre: `shine/content/matriz-{es-ca|ca}-level{a}-{b}-v{n}.json`.

### Entrega

1. El fichero JSON del lote, con la semilla (o el método) en `origen`.
2. Resultado de `cd shine && ddev drush shine-content:import content/{lote}.json --dry-run`: cero
   errores; si hay avisos de solapamiento o sobreuso, explicarlos. Después, importar sin publicar
   (la publicación la decide el equipo tras la revisión del experto; en local se puede publicar
   con `--publish` como contenido de prueba).
3. Una lista de 5 matrices por nivel (o el 10 % si son más) para la revisión del experto, con la
   pregunta del catálogo 2.1: ¿un niño de esa edad sin dificultades la valoraría "Bien así"?
4. El inventario después de importar (`drush shine-content:inventory --type=activity_letter_matrix`)
   para confirmar los códigos creados en cada idioma.
