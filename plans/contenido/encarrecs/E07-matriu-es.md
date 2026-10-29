# E07. Material per a la matriu de discriminació visual de Level7 a Level10, castellà

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus. Per revisar:
> `lliuraments/E07-E08-revisio.md`.

**Per a**: logopeda o especialista en lectoescriptura, castellà.

**Objectiu**: a la matriu el nen toca totes les aparicions d'un objectiu en una graella amb
distractors que s'hi assemblen. Fins a Level6 les cel·les són lletres (b, d, p, q, g, n, u) i les
genera un programa. De Level7 a Level10 les cel·les són síl·labes, paraules i pseudoparaules de
cada idioma, i necessitem els conjunts validats per endavant.

## Què cal lliurar

Un fitxer `E07-matriu-es.csv`, UTF-8, amb capçalera; una fila per conjunt:

| Columna | Contingut |
|---|---|
| nivell | 7, 8, 9 o 10 |
| objectiu | la cel·la objectiu; a Level8 i Level10 poden ser dues, separades per una barra vertical ("bra\|dra") |
| distractors | de 3 a 5, separats per barra vertical ("bar\|dar\|pra\|bla") |
| tipus | inversio (bra/bar), mirall (ba/da, pa/qa), travada (bra/bla/dra), pseudo_1_lletra (casa/cesa), parell_real (casa/caza/cosa) |
| nota | opcional |

Exemple:

```
nivell,objectiu,distractors,tipus,nota
7,bra,bar|dra|bla|pra,inversio,
8,bra|dra,bar|dar|pra|bla,travada,doble objectiu
9,casa,cesa|caso|cama|casi,pseudo_1_lletra,"caso" i "cama" són paraules: si es volen només pseudos, canviar
10,casa|caza,cosa|cada|capa|tasa,parell_real,doble objectiu
```

## Criteris per nivell (catàleg 6.1)

| Nivell | Cel·les | Objectius per ronda | Distractors |
|---|---|---|---|
| Level7 | síl·labes | 7 | inversions i travades: bra, bar, dra, pra |
| Level8 | síl·labes | 8 (entre dos objectius) | ídem, amb doble objectiu ("bra, dra") |
| Level9 | paraules curtes | 6 | pseudoparaules amb una lletra canviada (casa: cesa, cava?, casu) |
| Level10 | paraules | 8 (entre dos objectius) | paraules reals semblants, doble objectiu |

1. **Distractors**: s'assemblen a l'objectiu per forma (inversió de lletres, lletres mirall b d p
   q, mateixa travada amb una lletra canviada), mai per significat. A Level9 han de ser
   pseudoparaules reals de "una lletra canviada" que no siguin paraules; a Level10, paraules
   reals freqüents.
2. **Ortografia** del castellà; minúscules; a les paraules, accents si en porten.
3. **Quantitat**: 10 conjunts per nivell (40 en total); amb 6 activitats per nivell en tindrem
   de sobres per no repetir.
4. **Paraules** de Level9 i Level10 dins del vocabulari d'un nen de 14 o 15 anys (sense límit
   de freqüència, però sense tecnicismes).

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `docs/exercise-catalog.md (apartat 6.1)`: el contracte de la matriu: taula per nivell, parelles de confusió i regles de cada ronda.
- `plans/multiidioma/prompts-contenido/01-matriu.md`: el prompt de generació de matrius dels dos idiomes, amb la forma exacta del registre.
- `docs/generador/Guía de Parametrización.md (apartat 5)`: exemples de matrius per nivell.

## On lliurar-ho

`plans/contenido/encarrecs/lliuraments/E07-matriu-es.csv`.
