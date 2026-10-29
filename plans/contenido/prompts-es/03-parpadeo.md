# 03. Parpadeo en castellano (activity_blink): prompt de generación

Notas internas y, desde el título "Prompt", lo que se pega en la herramienta de generación.
Contrato del tipo en docs/exercise-catalog.md 5.3; estructuras por nivel en la tabla 2.3
castellana; términos en docs/generador/Taxonomía fonológica.md (y
shine/scripts/phonology-terms.es.json); nivel mínimo por estructura en el catálogo 3.5. Versión
catalana: plans/multiidioma/prompts-contenido/03-parpelleig.md.

## Notas internas

- **Primer lote** (2026-10-16): shine/content/blink-level0-2-v1.json, 20 actividades de Level0 a
  Level2 (7, 7 y 6), códigos BLK-ES-L00-VEL-001 a 007, L01-VEL-001 a 007 y L02-VEL-001 a 006.
  **Defecto conocido**: el alivio va al final en las 20 (catálogo 5.3); las que ya tienen
  summaries no se tocan: el lote definitivo de Level0 a Level2 las sustituye con códigos nuevos y
  las viejas se despublican.
- **Pseudopalabras del primer lote** (no repetirlas: sobreuso): las lista el inventario
  (`--lang=es --type=activity_blink --json`, clave unidades).
- **Alivio**: sílabas o palabras de Level0 (a, e, i, o, u, ma, pa, la, no, sol, sopa, mesa),
  intercaladas en posiciones al azar, nunca al final ni dos seguidas; sin etiquetar.
- **Etiquetas**: sonoridad y esfuerzo solo del material objetivo, con los nombres castellanos:
  m, l, s, f, n, r, j, p, t, b, d, c, k, q, g, ch, p/b, t/d, k/g, f/v, s/z/c, k/q/c, ll/y, g/j;
  Vocal aislada (V), Directas iniciales (CV), Directas resto (CV), Inversas (VC), Mixtas (CVC),
  Trabadas con l (CCV), Trabadas con r (CCV), Complejas (CCVC, VCC, CVCC).
- **Validación**: `cd shine && ddev drush shine-content:import content/{lote}.json --dry-run`;
  el importador rechaza el mismo elemento dos veces seguidas, más de 20 caracteres por elemento
  en Level0 a Level2 (60 en Level3 a Level5, 120 desde Level6), huellas idénticas y
  solapamientos del 80 % o más con otra actividad del mismo tipo e idioma, y avisa del sobreuso
  (una unidad en 3 o más actividades del mismo nivel). Con listas de frecuencia:
  `python3 content/generadores/lexico.py --lang es --lote content/{lote}.json`.

---

## Prompt

> Antes, adjuntar la salida de `ddev drush shine-content:inventory --lang=es --type=activity_blink
> --json` (lo que ya existe: no repetir material ni códigos).

Actúas como logopeda y como ingeniero de contenido de **Shine**, una aplicación de ejercicios de
lectura para niños y jóvenes con dislexia (5 a 15 años) que usan acompañados de un adulto. Vas a
generar un lote de actividades de **parpadeo en castellano** (`activity_blink`): aparece un
elemento cada vez (sílaba, grupo de letras, pseudopalabra o palabra), el niño lo lee en voz alta
y toca para pasar al siguiente; el adulto cuenta errores y, al contar uno, se salta el elemento.

### Reglas del material

1. **Idioma**: castellano normativo (RAE), minúsculas, sin puntuación; tildes y diéresis donde
   corresponda (pingüino, güe). Dígrafos ch, ll, rr, qu, gu nunca se separan; el elemento es la
   sílaba o la palabra entera, no se silabea.
2. **Nivel = edad de referencia 5 + n** (Level0 = 5 años). Un niño de esa edad sin dificultades
   la valoraría "Bien así". Estructuras admitidas por nivel (tabla 2.3):
   - Level0: vocales y CV con m, p, l, s, t, n, d. 6 elementos, 3,0 s por elemento.
   - Level1: resto de CV (f, b/v, r, rr, ñ, ch, ll/y, j, z/ce/ci, c/qu, g/gu, güe/güi, h, x),
     inversas VC (al, en, is, or), mixtas CVC (sol, pan, mar), diptongos frecuentes (ai, ei, au,
     ue, ie). 8 elementos, 2,5 s.
   - Level2: trabadas CCV con l y r (pla, bre, tri, clo, fru) y pares trabada/mixta (pra y par,
     bla y bal), CCVC (plan, tren), gue/gui/güe/güi. 8 elementos, 2,0 s.
   - Level3: VCC y CVCC (ins, cons, trans), hiatos (pa-ís, le-er, ba-úl), tildes. 10 elementos,
     2,0 s.
   - Level4: pseudopalabras de 2 sílabas con trabadas y codas (plito, brasun). 10 elementos, 1,8 s.
   - Level5: pseudopalabras de 3 sílabas. 10 elementos, 1,5 s.
   - Level6: pseudopalabras de 3 sílabas con estructuras complejas. 12 elementos, 1,5 s.
   - Level7: pseudopalabras de 4 sílabas. 12 elementos, 1,2 s.
   - Level8: palabras de baja frecuencia de 4 y 5 sílabas. 12 elementos, 1,2 s.
   - Level9: palabras y pseudopalabras de 5 sílabas. 15 elementos, 1 s.
   - Level10: palabras y pseudopalabras de 5 y 6 sílabas. 15 elementos, 1 s.
3. **Composición** de cada actividad (andamiaje): sílabas o grupo objetivo (4 en Level0 a Level2,
   6 en Level3, el resto con pseudopalabras o palabras), **pseudopalabras** del grupo desde Level1
   (2 por actividad en Level1 a Level3) y **alivio** (25 a 30 % de los elementos): sílabas o
   palabras de Level0 (a, e, i, o, u, ma, pa, la, no, sol, sopa, mesa), **intercaladas en
   posiciones al azar, nunca al final ni dos seguidas**.
4. **Pseudopalabras**: pronunciables con la fonotaxis castellana, formadas con sílabas del nivel y
   que **no sean palabras** en castellano ni en catalán (ni formas verbales, ni coloquialismos,
   ni nombres propios). No repetir las que ya están en el inventario.
5. **Frecuencia** (palabras reales): hasta las 500 más frecuentes en Level0, 1.000 en Level1,
   2.000 en Level2, 3.000 en Level3, 5.000 en Level4, 7.000 en Level5, 10.000 en Level6, 15.000
   en Level7, 20.000 en Level8, sin límite desde Level9 (catálogo 3.6).
6. **Límites del importador**: sin elementos repetidos dentro de la actividad (el importador solo
   rechaza los seguidos, pero en una actividad de nivel no se repite ninguno), máximo 20
   caracteres por elemento hasta Level2 (60 hasta Level5, 120 después), al menos 4 elementos;
   una actividad no puede tener la misma huella (mismo conjunto de elementos) que otra ni solapar
   el 80 % de sus unidades con ella; evitar que una misma sílaba o palabra objetivo esté en 3 o
   más actividades del mismo nivel.
7. **Etiquetas** (solo del material objetivo, nunca del alivio), términos de segundo nivel con el
   nombre exacto: sonoridad (m, l, s, f, n, r, j, p, t, b, d, c, k, q, g, ch, p/b, t/d, k/g, f/v,
   s/z/c, k/q/c, ll/y, g/j) y esfuerzo (Vocal aislada (V), Directas iniciales (CV), Directas resto
   (CV), Inversas (VC), Mixtas (CVC), Trabadas con l (CCV), Trabadas con r (CCV), Complejas (CCVC,
   VCC, CVCC)). Desde Level4 (pseudopalabras largas) basta el esfuerzo.
8. **Códigos**: BLK-ES-Lnn-VEL-nnn correlativos a partir del "siguiente código libre" del
   inventario; nunca se reutiliza un código.

### Forma exacta del registro

```json
{
  "tipo": "activity_blink",
  "codigo": "BLK-ES-L01-VEL-008",
  "idioma": "es",
  "titulo": "Sílabas con ñ",
  "area_principal": "Rendimiento y Velocidad de Procesamiento",
  "area_secundaria": "Competencia Lingüística y Fonológica",
  "niveles": ["Level1"],
  "instruccion": "Lee cada sílaba en voz alta en cuanto aparezca y toca para pasar a la siguiente.",
  "explicacion": "Activity vertical text",
  "sonoridad": ["n"],
  "esfuerzo": ["Directas resto (CV)"],
  "contenido": {
    "grupo_fonetico_objetivo": "ñ",
    "elementos": ["ña", "pa", "ñe", "ñi", "ñopa", "a", "ño", "ñuca"],
    "desglose_tipos": ["silaba", "alivio", "silaba", "silaba", "pseudopalabra", "alivio", "silaba", "pseudopalabra"],
    "segundos_por_elemento": 2.5
  }
}
```

`desglose_tipos` admite vocal, silaba, silaba_inversa, silaba_mixta, silaba_trabada,
estructura_compleja, pseudopalabra, palabra_real y alivio, una entrada por elemento. Título en
lenguaje del niño ("Sílabas con ñ", "Trabadas con pl y pr", "Palabras largas"), instrucción con
tratamiento de tú.

### Entrega

Un fichero shine/content/blink-es-level{a}-{b}-v{n}.json con `lote`, `descripcion`, `origen`
(generador, versión, semilla o "manual" y nota) y `actividades`; por nivel, las actividades que
se pidan (reparto del catálogo completo: 3 por nivel en Velocidad, 4 en Level0), con familias
distintas, y una lista aparte de las pseudopalabras usadas y de las dudas de frecuencia para el
experto. Antes de entregar: `ddev drush shine-content:import content/{lote}.json --dry-run` sin
errores.
