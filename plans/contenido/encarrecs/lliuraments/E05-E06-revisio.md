# E05 i E06. Bancs de pseudoparaules: proposta per revisar

**Estat**: fets per l'equip (Claude, model Opus, i un filtre automàtic) el 2026-10-28. Pendents de
la revisió del grup.

## Què hi ha

| Fitxer | Pseudoparaules | Per nivell (Level1 a Level10) |
|---|---|---|
| `lliuraments/E05-pseudoparaules-es.csv` (castellà) | 672 | 57, 62, 65, 68, 70, 70, 70, 70, 70, 70 |
| `lliuraments/E06-pseudoparaules-ca.csv` (català) | 670 | 61, 55, 66, 68, 70, 70, 70, 70, 70, 70 |

Totes superen el mínim de 40 per nivell. Les columnes són les de l'encàrrec: pseudoparaula,
nivell, sillabes, estructura (calculada per programa a partir de les síl·labes), grup i nota. Al
costat, `E05-pseudoparaules-es-descarts.csv` i `E06-pseudoparaules-ca-descarts.csv` porten les que
el filtre ha tret, amb el motiu.

## Com s'ha fet

1. **Candidates**: Opus n'ha proposat 70 per nivell i idioma (700 per idioma), repartides entre els
   grups fonològics del nivell, amb les estructures i la llargada dels criteris 3 i 4.
2. **Filtre automàtic** (`shine/content/generadores/pseudo_filtre.py`), que descarta:
   - les que **existeixen** en castellà o en català: s'han comprovat contra 1,67 milions de formes
     (les llistes generals i infantils, el diccionari de Softcatalà i les formes del CORPES XXI);
   - les que **es llegeixen com una paraula real amb una lletra canviada**. Interpretació del
     criteri 5 a partir dels vostres exemples: es descarta quan la paraula real comença igual i
     només canvia una lletra més endavant ("gata" per "gato"), però no quan canvia la primera
     lletra ("ñopa" i "copa", que l'encàrrec dona com a bona). Paraules reals: les 30.000 més
     freqüents de cada llista general i les llistes infantils, dels dos idiomes;
   - les ja usades en lots (`pseudoparaules-existents.txt`);
   - les que tenen una llargada fora del nivell o una estructura de nivell mínim més alt (amb la
     taula de nivell mínim del catàleg).
3. **Resultat**: en castellà, 28 descartades (20 per semblança, 5 per estructura, 3 perquè
   existeixen); en català, 30 (27 per semblança, 3 per estructura).

## Què us demanem revisar

1. **Pronunciabilitat i naturalitat**: si alguna sona impossible o massa estranya en l'idioma (el
   filtre no ho pot jutjar). Les de Level7 a Level10 surten en bona part d'un generador amb regles
   fonotàctiques que Opus ha repassat; són les que convé mirar més.
2. **Semblança amb paraules**: si alguna us recorda una paraula real, un nom propi o una paraula
   malsonant que el filtre no ha vist.
3. **El criteri 5**: confirmeu la interpretació (es permet canviar la primera lletra) o digueu-nos
   que la volem estricta, i en aquest cas tornem a passar el filtre.
4. **Grups**: si el repartiment entre grups fonològics de cada nivell us sembla equilibrat.

Una manera ràpida de revisar: marqueu a la columna `nota` "fora" les que no valguin, o en un
document a part la llista de les que traiem.

## On tornar-ho

Els dos CSV amb la columna `nota` omplerta, o la llista de descarts, a
`plans/contenido/encarrecs/lliuraments/E05-E06-revisio-resposta.md`.
