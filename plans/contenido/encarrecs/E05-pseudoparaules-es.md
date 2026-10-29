# E05. Banc de pseudoparaules per nivell, castellà

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus. Per revisar:
> `lliuraments/E05-E06-revisio.md`.

**Per a**: logopeda amb criteri fonològic del castellà.

**Objectiu**: un banc de pseudoparaules validades d'una vegada, perquè els exercicis de
parpelleig (Level1 en amunt) i de llista de text (Level2 en amunt) les prenguin d'aquí i la
revisió de cada lot no s'hagi d'aturar a comprovar-les. Les pseudoparaules obliguen a llegir
lletra a lletra en lloc de reconèixer la paraula de memòria.

## Què cal lliurar

Un fitxer `E05-pseudoparaules-es.csv`, UTF-8, amb capçalera:

| Columna | Contingut |
|---|---|
| pseudoparaula | en minúscules, amb accent si la pronúncia natural el demana ("brasún") |
| nivell | el primer nivell en què es pot usar (1 a 10) |
| sillabes | separades per guió ("bra-sún") |
| estructura | de cada síl·laba, separada per guió: CV, CVC, CCV, CCVC, VC, V ("CCV-CVC") |
| grup | la síl·laba o grup que treballa ("pl", "tr", "ñ", "ch", "inversa n"), o buit si és general |
| nota | opcional |

Exemple:

```
pseudoparaula,nivell,sillabes,estructura,grup,nota
ñopa,1,ño-pa,CV-CV,ñ,
plimo,2,pli-mo,CCV-CV,pl,
brasún,4,bra-sún,CCV-CVC,br,
trumidal,5,tru-mi-dal,CCV-CV-CVC,tr,
```

## Criteris

1. **No existeixen** en castellà ni en català: ni com a paraula, ni com a forma flexionada, ni
   com a col·loquialisme, marca, nom propi o paraula malsonant. Comprovar-ho en tots dos idiomes.
2. **Pronunciables** amb la fonotaxi del castellà: només síl·labes possibles (no "pso", "ftra").
3. **Estructures admeses per nivell** (taula de nivell mínim del catàleg): Level1, només CV
   (incloses ñ, ch, ll, j, z/ce/ci, c/qu, g/gu), VC i CVC; Level2, a més travades CCV amb l i r i
   CCVC; Level3, a més VCC i CVCC i hiats; Level4 en amunt, totes.
4. **Llargada per nivell**: Level1 a Level3, 2 síl·labes; Level4, 2 síl·labes amb travades i
   codes; Level5 i Level6, 3 síl·labes; Level7, 4; Level8, 4 o 5; Level9 i Level10, 5 o 6.
5. **Que no s'assemblin a una paraula real canviant una sola lletra** ("gata" per "gato" no
   val; "ñopa" sí). Les d'una lletra canviada són un altre material (encàrrec E07).
6. **Quantitat**: com a mínim 40 per nivell de Level1 a Level10 (400 en total), repartides entre
   els grups fonològics del nivell (a Level1, per exemple: ñ, ch, ll, j, z/c, c/qu, g/gu, f, b/v,
   r/rr, inverses, mixtes).
7. **Sense repetir** cap pseudoparaula del primer lot castellà ni del català; les trobareu a
   `lliuraments/pseudoparaules-existents.txt` (l'adjuntem amb l'encàrrec).

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `docs/generador/Taxonomía fonológica.md`: grups de sonoritat i esforç del castellà i el nivell mínim de cada estructura (també a docs/exercise-catalog.md 3.5).
- `docs/generador/Guía de Parametrización.md`: exemples de pseudoparaules per nivell a la llista de text i al parpelleig (alguns exemples de Level1 porten travades, que la taula posa a Level2: mana la taula).
- `lliuraments/pseudoparaules-existents.txt`: les ja usades als lots.

## On lliurar-ho

`plans/contenido/encarrecs/lliuraments/E05-pseudoparaules-es.csv`.
