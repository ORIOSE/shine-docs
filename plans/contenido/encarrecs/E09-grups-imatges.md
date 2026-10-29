# E09. Grups d'imatges per a posició d'imatges de Level9 i Level10

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus. Per revisar:
> `lliuraments/E09-revisio.md`.

**Per a**: logopeda, amb la llista del banc d'imatges adjunta (`lliuraments/banc-imatges.csv`).

**Objectiu**: a "Posició d'imatges" el nen memoritza on era cada dibuix d'un grup i després
respon llegint el nom escrit d'un d'ells. A Level9 els dibuixos d'un grup s'han d'assemblar en
forma o color **i** els noms han de començar igual; a Level10, a més, els noms han de ser parells
mínims (casa, caça, cosa; got, gat, gos). El banc actual té 423 imatges usables i només 11 grups
fonològics prou grans per idioma: no arribem als 6 grups de 6 imatges per activitat que demana
el catàleg en aquests dos nivells. Cal decidir i, si cal, encarregar imatges noves.

## Què cal lliurar

Un fitxer `E09-grups-imatges.csv`, UTF-8, amb capçalera; una fila per imatge dins d'un grup:

| Columna | Contingut |
|---|---|
| nivell | 9 o 10 |
| idioma | es o ca (un grup és d'un sol idioma: els noms no coincideixen) |
| grup | identificador del grup (es-9-01, ca-10-03...) |
| nom | el nom tal com el llegirà el nen |
| existent | sí si és una imatge del banc (posar el seu slug a la columna següent), no si cal fer-la |
| slug | el fitxer del banc sense .png, si existeix |
| criteri | què comparteixen les imatges del grup ("rodó i vermell + pa-", "parell mínim c_sa") |

I, a part, una resposta curta a la pregunta de sota.

## Criteris

1. **Grups de 6 imatges** (ideal) o de 4 (si acceptem reduir-ho en aquests dos nivells; vegeu
   la pregunta). Dins d'un grup, noms diferents i imatges diferents.
2. **Level9**: mateixa etiqueta visual (forma o color) i mateixa síl·laba inicial en l'idioma
   del grup. **Level10**: parells o trios mínims reals de l'idioma, i semblança visual si és
   possible.
3. **Llegibilitat**: a Level9 i Level10 no hi ha límit de freqüència, però els noms han de ser
   coneguts per un nen de 14 o 15 anys.
4. **Quantitat**: per idioma i nivell, 6 activitats × 6 grups = 36 grups. Si surten de les 423
   imatges, perfecte; si no, les files amb `existent = no` seran l'encàrrec d'imatges noves.
5. **Noms nous**: substantius d'una sola paraula, sense guionet, dibuixables amb l'estil del banc
   (objecte sencer, fons transparent), amb el seu sil·labeig i nivell lector com la resta.

## Pregunta a respondre

Per a Level9 i Level10, preferiu (a) grups de 6 amb imatges noves (calculem entre 60 i 120
imatges noves per idioma), o (b) grups de 4 amb les imatges actuals més unes poques de noves?
La mecànica de l'exercici no canvia; canvia la càrrega de memòria.

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `docs/generador/Banco de imágenes.md (apartats 4, 5.4 i 5.7)`: com és el banc, el manifest amb el bloc català i els grups i parells mínims ja previstos.
- `plans/multiidioma/estructura-ca.md (apartat 6) i resposta-estructura-ca.md`: els parells mínims catalans i les imatges no usables en català.
- `docs/exercise-catalog.md (apartat 5.4)`: el contracte de posició d’imatges: imatges per grup, grups i relació per nivell.
- `plans/multiidioma/prompts-contenido/02-posicio-imatges.md`: el prompt de generació dels dos idiomes.

## On lliurar-ho

`plans/contenido/encarrecs/lliuraments/E09-grups-imatges.csv` i la resposta en un `E09-resposta.md`.
