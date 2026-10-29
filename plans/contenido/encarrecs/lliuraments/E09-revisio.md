# E09. Grups d'imatges per a Level9 i Level10: proposta per revisar

**Estat**: fet per l'equip (Claude, model Opus) el 2026-10-28. Pendent de la decisió i la
revisió del grup.

## Què hi ha

| Fitxer | Contingut |
|---|---|
| `lliuraments/E09-grups-imatges-es.csv` | castellà: les dues opcions, 36 grups per nivell i opció |
| `lliuraments/E09-grups-imatges-ca.csv` | català: el mateix |
| `lliuraments/E09-resum-es.md` | castellà: xifres, llista d'imatges noves, dubtes i recomanació |
| `lliuraments/E09-resum-ca.md` | català: el mateix |

Columnes dels CSV: les de l'encàrrec més `opcio` (A o B). Els grups 01 a 06 són l'activitat 1,
els 07 a 12 l'activitat 2, i així successivament.

## La pregunta de l'encàrrec, amb xifres

Amb el banc actual **no surt cap grup de Level9**: cap etiqueta visual reuneix 4 imatges que
comencin per la mateixa síl·laba. Level10 sí que es pot fer gairebé tot amb el banc, perquè hi ha
famílies de parells mínims grans.

| Opció | Castellà: imatges noves | Català: imatges noves |
|---|---|---|
| A: grups de 6 | 41 (39 per a Level9) | 83 (70 per a Level9) |
| B: grups de 4 | 11 (totes per a Level9) | 29 (totes per a Level9) |
| Mixta (català): Level9 de 4 i Level10 de 6 | | 42 |

Les imatges de la B són totes dins de l'A: començar per la B no fa perdre cap dibuix. La
recomanació del castellà és l'A (Level7 i Level8 ja fan servir 6 imatges); la del català, la B o
la mixta, perquè Level9 en català demana moltes imatges noves. La decisió és vostra.

## Comprovacions fetes

Un programa independent ha verificat els dos fitxers: 144 grups per idioma, cadascun amb la mida
de la seva opció, sense noms repetits dins d'un grup, tots els slugs existeixen al banc amb el nom
correcte, cap imatge "nova" és ja al banc, i a Level10 cada nom té un parell mínim real (una
lletra de diferència) dins del seu grup.

## Què us demanem

1. **Decidir l'opció** (A, B o mixta) per idioma.
2. **Revisar la llista d'imatges noves** de l'opció triada (als resums): que siguin conegudes per
   un noi de 14 o 15 anys, dibuixables sense ambigüitat i que no es confonguin amb dibuixos del
   banc (per exemple, "canario" amb el pollet; "cacatua" amb el lloro). En català n'hi ha diverses
   d'oficis i persones ("paleontòleg", "camarògraf", "pitonissa") que potser no són prou clares en
   dibuix.
3. **Etiquetes del banc**: el resum castellà llista 37 imatges que tenen el color o la forma però
   no l'etiqueta visual al manifest (caballo, marrón; camión, rojo). Si les hi afegim, surten més
   grups amb imatges existents i cal encarregar-ne menys.
4. **Repetició**: en castellà, la síl·laba ca- domina els grups de Level9, sobretot a la B.
   Indiqueu si és acceptable.

## Imatges noves: ja encarregades

Com que es poden generar fins a 150 imatges d'una tirada, s'encarreguen les 122 de l'opció A
d'entrada (inclouen les 40 de la B). Si el grup tria la B o la mixta, simplement no se'n fan servir
algunes. Prompt: `docs/generador/Banco de imágenes - lote 2 (E09).md`. Una imatge que el grup
rebutgi en aquesta revisió no s'importa.

## On tornar-ho

L'opció triada i la llista d'imatges noves corregida, a
`plans/contenido/encarrecs/lliuraments/E09-revisio-resposta.md`. Amb això es fa l'encàrrec
d'imatges noves (amb l'especificació de `docs/generador/Banco de imágenes.md`).
