# E07 i E08. Material de la matriu: proposta per revisar

**Estat**: fet per l'equip el 2026-10-28 amb un generador determinista
(`shine/content/generadores/matriz_conjuntos.py`, amb llavor fixa: es pot tornar a generar igual).
Pendent de la revisió del grup.

## Què hi ha

| Fitxer | Conjunts |
|---|---|
| `lliuraments/E07-matriu-es.csv` (castellà) | 40: 10 per nivell de Level7 a Level10 |
| `lliuraments/E08-matriu-ca.csv` (català) | 70: 6 per nivell de grafies pròpies de Level2 a Level6 i 10 per nivell de Level7 a Level10 |

Les columnes són les de l'encàrrec: nivell, objectiu, distractors, tipus, nota.

## Com s'ha fet

- **Level7**: una síl·laba travada (bra, cla, fre) i distractors per forma: la inversió (bra, bar),
  la travada amb la lletra mirall (bra, dra, pra), el canvi entre l i r (bra, bla) i el canvi de
  vocal (bra, bre). Només travades possibles en tots dos idiomes (sense tl ni dl).
- **Level8**: el mateix amb doble objectiu (bra|dra), triant com a segon objectiu un dels
  distractors naturals del primer.
- **Level9**: un nom de la llista infantil, en forma base, de 4 a 6 lletres i de nivell 0 o 1 (el
  nen el coneix bé), i 4 pseudoparaules amb una lletra canviada per una de forma semblant (b, d,
  p, q; m, n, u; a, o, e, c; i, l; f, t). S'ha comprovat que **cap distractor existeix** en
  castellà ni en català (llistes generals, diccionari de Softcatalà i CORPES XXI).
- **Level10**: dos objectius que formen un parell mínim real (nata|mata, pau|pou) i distractors
  que també són paraules reals i freqüents amb una lletra de forma semblant canviada.
- **Grafies pròpies del català (Level2 a Level6)**: ç, ny i ix a Level2; l·l a Level3, que és el
  seu nivell mínim; accents oberts i tancats (è, é; ò, ó) a Level4; dièresi (ï, ü, güe, qüi) a
  Level5; accents diacrítics (més, mes; són, son; pèl, pel) a Level6. Alguns distractors són
  grafies que no existeixen en català (ë, ö, â): serveixen només per la forma, com l'exemple de
  l'encàrrec (è entre é, e i ê).

## Què us demanem revisar

1. Cada conjunt: si el tipus i els distractors són bons per al nivell. A la columna `nota` podeu
   escriure "fora" o el canvi exacte.
2. A Level9, si alguna pseudoparaula sembla massa estranya per llegir-la (per exemple "blcho",
   amb la i canviada per una l). És intencionat, perquè la matriu treballa la discriminació
   visual, però es pot limitar a canvis entre vocals i entre consonants.
3. A Level10, algun parell es repeteix amb lleus variants ("cera|cara" i "cero|caro"). Si en voleu
   més varietat, digueu-nos quins traiem.
4. Si voleu que Level9 i Level10 només facin servir paraules del vocabulari d'un nen de 14 o 15
   anys (com diu l'encàrrec) o, com ara, paraules molt conegudes, perquè el que es mesura és la
   discriminació i no el vocabulari.

## On tornar-ho

Els dos CSV amb les notes, a `plans/contenido/encarrecs/lliuraments/E07-E08-revisio-resposta.md`
(o els mateixos fitxers amb la columna nota omplerta).
