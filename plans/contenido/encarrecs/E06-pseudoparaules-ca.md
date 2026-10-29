# E06. Banc de pseudoparaules per nivell, català

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus. Per revisar:
> `lliuraments/E05-E06-revisio.md`.

**Per a**: logopeda amb criteri fonològic del català.

**Objectiu**: un banc de pseudoparaules catalanes validades d'una vegada, perquè els exercicis
de parpelleig (Level1 en amunt) i de llista de text (Level2 en amunt) les prenguin d'aquí i la
revisió de cada lot no s'hagi d'aturar a comprovar-les.

## Què cal lliurar

Un fitxer `E06-pseudoparaules-ca.csv`, UTF-8, amb capçalera:

| Columna | Contingut |
|---|---|
| pseudoparaula | en minúscules, amb accent obert o tancat si la pronúncia natural el demana, dièresi, ç o l·l si cal |
| nivell | primer nivell en què es pot usar (1 a 10) |
| sillabes | separades per guió, amb el sil·labeig de l'IEC ("nyo-pa", "pot-xa") |
| estructura | de cada síl·laba: CV, CVC, CCV, CCVC, VC, V, CVCC |
| grup | la síl·laba o grup que treballa ("ny", "ll", "tx", "pl", "inversa n", "l·l") o buit |
| nota | opcional |

Exemple:

```
pseudoparaula,nivell,sillabes,estructura,grup,nota
nyopa,1,nyo-pa,CV-CV,ny,
plimo,2,pli-mo,CCV-CV,pl,
potxa,2,pot-xa,CVC-CV,tx,
trosp,3,trosp,CCVCC,coda complexa,
pil·lo,3,pil-lo,CVC-CV,l·l,punt volat a la primera síl·laba al partir
```

## Criteris

1. **No existeixen** en català ni en castellà: ni com a paraula, ni com a forma flexionada, ni
   com a col·loquialisme, marca, nom propi o paraula malsonant. Comprovar-ho en tots dos idiomes.
2. **Pronunciables** amb la fonotaxi del català, inclosos els finals consonàntics propis (-nt,
   -rt, -sp) on el nivell ho admeti.
3. **Estructures admeses per nivell** (estructura-ca.md, apartat 5): Level1, CV (inclosos ny,
   ll, ss, rr, qu, gu, ç, x), VC i CVC; Level2, a més travades CCV i CCVC, dígrafs complexos
   (tx, ix, ig, tg, tj) i gue/gui/güe/güi; Level3, a més VCC i CVCC, hiats i l·l; Level4 en
   amunt, totes. La vocal neutra no es marca.
4. **Llargada per nivell**: Level1 a Level3, 1 o 2 síl·labes; Level4, 2 amb travades i codes;
   Level5 i Level6, 3; Level7, 4; Level8, 4 o 5; Level9 i Level10, 5 o 6.
5. **Que no s'assemblin a una paraula real canviant una sola lletra**.
6. **Quantitat**: com a mínim 40 per nivell (400 en total), repartides entre els grups
   fonològics del nivell.
7. **Sense repetir** les del primer lot català (fulo, fipa, nyopa, nyufa, llupa, llomi, jopi,
   gemu, cupi, quelo, cefo, tuça, vobi, bimu, xofi, xufi, olpe, unfa, nol, tep, plimo, prute,
   blimo, brofe, trumi, drifo, flusi, crofe, glumi, grofe, prali, tralo, potxa, fitge, guesa,
   güipo) ni les de la guia de parametrització catalana (nyola, plim, trum, trosp, insfa,
   pil·lo): es poden incloure al banc tal qual, marcades a la nota com a "ja usada", però no
   cal crear-ne de noves iguals.

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `plans/multiidioma/estructura-ca.md (apartats 3, 4 i 5)`: termes de sonoritat i esforç del català i nivell mínim de cada estructura.
- `docs/generador/Guía de Parametrización (català).md`: exemples de pseudoparaules per nivell.
- `plans/multiidioma/revisio-lots-ca.md i resposta-revisio-lots-ca.md`: la revisió del primer lot català, on el grup va validar les primeres 36 pseudoparaules i el criteri.
- `lliuraments/pseudoparaules-existents.txt`: les ja usades als lots.

## On lliurar-ho

`plans/contenido/encarrecs/lliuraments/E06-pseudoparaules-ca.csv`.
