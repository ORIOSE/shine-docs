# Parpadeo en catalán (activity_blink): prompt de generación

Notas internas y, desde el título "Prompt", lo que se pega en Cowork o Codex para generar un lote.
Convenciones comunes en [README.md](README.md); el contrato del tipo en docs/exercise-catalog.md
5.3; la estructura catalana en plans/multiidioma/estructura-ca.md (tabla 2.3 catalana del
catálogo, apartados 3 y 4 para los términos, apartado 5 para el nivel mínimo de cada estructura).

## Notas internas

- **Primer lote** (2026-10-26): shine/content/blink-ca-level0-2-v1.json, 24 actividades escritas a
  mano (Level0 6, Level1 10, Level2 8), códigos BLK-CA-L00-VEL-002 a 007, L01-VEL-001 a 010 y
  L02-VEL-001 a 008. La BLK-CA-L00-VEL-001 (m) venía del lote de ejemplo fase18-ejemplos-v1. Todas
  importadas y publicadas en local como contenido de prueba; pendientes de la revisión del experto.
- **Qué cambia respecto al castellano**: las familias de Level1 incluyen los dígrafos simples
  catalanes (ny, ll, qu, gu, ss, rr) y las mixtas CVC, que en catalán son muy frecuentes (gat,
  sol, cap, dit); la ç y la x entran en Level1; gue/gui/güe/güi, los dígrafos complejos (tx, ix,
  ig, tg, tj) y las trabadas van a Level2; la ela geminada y los apóstrofos no aparecen hasta
  Level3. La vocal neutra no se marca: las sílabas con e y o átonas se leen igual.
- **Pseudopalabras**: fonotaxis catalana (sílabas admitidas en el nivel, sin finales imposibles) y
  comprobadas contra el catalán y el castellano. Las del primer lote: fulo, fipa, nyopa, nyufa,
  llupa, llomi, jopi, gemu, cupi, quelo, cefo, tuça, vobi, bimu, xofi, xufi, olpe, unfa, nol, tep,
  plimo, prute, blimo, brofe, trumi, drifo, flusi, crofe, glumi, grofe, prali, tralo, potxa, fitge,
  guesa, güipo. Un lote nuevo no debe repetirlas (sobreuso) y debe pasar el mismo filtro.
- **Alivio**: sílabas o palabras de Level0 en catalán (a, e, i, o, u, ma, pa, la, no, so, sol),
  intercaladas en posiciones al azar, nunca las dos al final ni seguidas; sin etiquetar.
- **Etiquetas**: sonoridad y esfuerzo solo del material objetivo, con los nombres catalanes
  (shine/scripts/phonology-terms.ca.json): m, l, s sorda, f, n, r, j/g, s sonora, x/ix, ny, ll, p,
  t, b, d, c/qu/k, g/gu, tx/ig, tg/tj, grafies s/ss/c/ç, grafies b/v, grafies c/qu/k, h muda...;
  Directes inicials (CV), Directes resta (CV), Inverses (VC), Mixtes i finals (CVC), Dígrafs simples,
  Dígrafs complexos, Travades amb l (CCV), Travades amb r (CCV), Complexes (CCVC, VCC, CVCC), Ela
  geminada (l·l), Apostrofació i contraccions.
- **Validación**: cd shine && ddev drush shine-content:import content/{lote}.json --dry-run; el
  importador rechaza el mismo elemento dos veces seguidas (también si solo cambian las mayúsculas;
  desde el 2026-10-27 admite repetidos no seguidos, para el ciclo), más de 20
  caracteres por elemento en Level0 a Level2 (60 en Level3 a Level5, 120 desde Level6), huellas
  idénticas y solapamientos del 80 % o más con otra actividad del mismo tipo e idioma, y avisa
  del sobreuso (una unidad en 3 o más actividades del mismo nivel).

---

## Prompt

> Todo lo que sigue se pega en la herramienta de generación. Antes, adjuntar o pegar la salida
> de `ddev drush shine-content:inventory --lang=ca --type=activity_blink --json` (lo que ya
> existe: no repetir material ni códigos) y plans/multiidioma/estructura-ca.md.

Actúas como logopeda y como ingeniero de contenido de **Shine**, una aplicación de ejercicios de
lectura para niños y jóvenes con dislexia (5 a 15 años) que usan acompañados de un adulto. Vas a
generar un lote de actividades de **parpadeo en catalán** (`activity_blink`): aparece un elemento
cada vez (sílaba, grupo de letras, pseudopalabra o palabra), el niño lo lee en voz alta y toca
para pasar al siguiente; el adulto cuenta errores y, al contar uno, se salta el elemento.

### Reglas del material

1. **Idioma**: catalán normativo (IEC), minúsculas, sin puntuación. Dígrafos tx, ix, ig, tg, tj,
   ss, rr y l·l separados entre sílabas cuando el elemento es una palabra silabeada (no se silabea
   en este tipo: el elemento es la sílaba o la palabra entera); ny, ll, qu, gu unidos.
2. **Nivel = edad de referencia 5 + n** (Level0 = 5 años). Un niño de esa edad sin dificultades
   la valoraría "Bé així". Estructuras admitidas por nivel (tabla 2.3 catalana):
   - Level0: vocales y CV con m, p, l, s, t, n, d. 6 elementos, 3,0 s por elemento.
   - Level1: resto de CV (f, b/v, r, rr, ny, ll, j/g, z/c/ç, c/qu, g/gu, h, x), inversas VC (al,
     en, is, or), mixtas CVC muy frecuentes (gat, sol, cap, dit), diptongos simples, que/qui.
     8 elementos, 2,5 s.
   - Level2: trabadas CCV con l y r (pla, bre, tri, clo, fru) y pares trabada/mixta (pra y par,
     bla y bal), CCVC (plat, tren), dígrafos complejos (tx, ix, ig, tg, tj), gue/gui/güe/güi.
     8 elementos, 2,0 s.
   - Level3: VCC y CVCC (ins, cons, trans, temps, forts), ela geminada (l·l), apóstrofos y
     contracciones (l’avi, d’un, al, del), hiatos (pi-a-no, lle-ó). 10 elementos, 2,0 s.
   - Level4: pseudopalabras de 2 sílabas con trabadas y codas (plito, brasun). 10 elementos, 1,8 s.
   - Level5: pseudopalabras de 3 sílabas. 10 elementos, 1,5 s.
   - Level6: pseudopalabras de 3 sílabas con estructuras complejas y dígrafos. 12 elementos, 1,5 s.
   - Level7: pseudopalabras de 4 sílabas. 12 elementos, 1,2 s.
   - Level8: palabras catalanas de baja frecuencia de 4 y 5 sílabas. 12 elementos, 1,2 s.
   - Level9: palabras y pseudopalabras de 5 sílabas. 15 elementos, 1 s.
   - Level10: palabras y pseudopalabras de 5 y 6 sílabas. 15 elementos, 1 s.
3. **Composición** de cada actividad (andamiaje): sílabas o grupo objetivo (4 en Level0 a Level2,
   6 en Level3, el resto con pseudopalabras o palabras), **pseudopalabras** del grupo desde Level1
   (2 por actividad en Level1 a Level3) y **alivio** (25 a 30 % de los elementos): sílabas o
   palabras de Level0 (a, e, i, o, u, ma, pa, la, no, so, sol), **intercaladas en posiciones al
   azar, nunca al final ni dos seguidas**.
   **Desde Level3, modelo mixto** (grupo de expertos, revisiones de las tandas 3 y 4, 2026-10-29):
   palabras reales con la estructura o la longitud del nivel como material de trabajo, más
   pseudopalabras de esa misma estructura y alivio del 25 a 30 %. Con 10 elementos, 5 + 2 + 3; con
   12, 6 + 3 + 3; con 15, 8 + 3 + 4. Las filas de Level4 a Level7 describen la estructura de las
   pseudopalabras; las palabras reales siguen la misma.
4. **Pseudopalabras**: pronunciables con la fonotaxis catalana, formadas con sílabas del nivel y
   que **no sean palabras** en catalán ni en castellano (ni formas verbales ni coloquialismos).
   No repetir las que ya están en el inventario.
5. **Límites del importador**: en estas actividades de nivel, sin elementos repetidos dentro de
   la actividad (ni cambiando mayúsculas; el importador solo rechaza los seguidos), máximo 20 caracteres por elemento hasta Level2 (60 hasta Level5, 120 después), al
   menos 4 elementos; una actividad no puede tener la misma huella (mismo conjunto de elementos)
   que otra ni solapar el 80 % de sus unidades con ella; evitar que una misma sílaba o palabra
   objetivo esté en 3 o más actividades del mismo nivel.
6. **Etiquetas** (solo del material objetivo, nunca del alivio), términos de segundo nivel con el
   nombre catalán exacto: sonoridad (m, l, s sorda, f, n, r, j/g, s sonora, x/ix, ny, ll, p, t,
   b, d, c/qu/k, g/gu, tx/ig, tg/tj, p/b, t/d, k/g, f/v, s sorda/s sonora, x/j, tx/tg, grafies
   s/ss/c/ç, grafies c/qu/k, grafies l/ll/l·l, grafies g/j, grafies x/ix, grafies b/v, h muda) y
   esfuerzo (Vocal aïllada (V), Directes inicials (CV), Directes resta (CV), Inverses (VC), Mixtes
   i finals (CVC), Dígrafs simples, Dígrafs complexos, Travades amb l (CCV), Travades amb r (CCV),
   Complexes (CCVC, VCC, CVCC), Ela geminada (l·l), Apostrofació i contraccions).
7. **Códigos**: BLK-CA-Lnn-VEL-nnn correlativos a partir del "siguiente código libre" del
   inventario; nunca se reutiliza un código.

### Forma exacta del registro

```json
{
  "tipo": "activity_blink",
  "codigo": "BLK-CA-L01-VEL-011",
  "idioma": "ca",
  "titulo": "Síl·labes amb ny",
  "area_principal": "Rendimiento y Velocidad de Procesamiento",
  "area_secundaria": "Competencia Lingüística y Fonológica",
  "niveles": ["Level1"],
  "instruccion": "Llegeix cada síl·laba en veu alta així que aparegui i toca per passar a la següent.",
  "explicacion": "Activity vertical text",
  "sonoridad": ["ny"],
  "esfuerzo": ["Directes resta (CV)", "Dígrafs simples"],
  "contenido": {
    "grupo_fonetico_objetivo": "ny",
    "elementos": ["nya", "pa", "nye", "nyi", "nyopa", "a", "nyo", "nyufa"],
    "desglose_tipos": ["silaba", "alivio", "silaba", "silaba", "pseudopalabra", "alivio", "silaba", "pseudopalabra"],
    "segundos_por_elemento": 2.5
  }
}
```

`desglose_tipos` admite vocal, silaba, silaba_inversa, silaba_mixta, silaba_trabada,
estructura_compleja, pseudopalabra, palabra_real y alivio, una entrada por elemento. Las áreas,
niveles y explicación van con su nombre castellano canónico; el título y la instrucción, en
catalán (tratamiento de tú, apóstrofo tipográfico ’).

### Entrega

Un fichero shine/content/blink-ca-level{a}-{b}-v{n}.json con `lote`, `descripcion`, `origen`
(generador, versión, semilla o "manual" y nota) y `actividades`; por nivel, al menos 6 actividades
(objetivo 10) con familias distintas, y una lista aparte de las pseudopalabras usadas y de las
dudas de registro o frecuencia para el experto. Antes de entregar: `ddev drush shine-content:import
content/{lote}.json --dry-run` sin errores.
