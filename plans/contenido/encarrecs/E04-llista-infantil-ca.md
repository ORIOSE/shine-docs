# E04. Llista de vocabulari infantil del català (5 a 8 anys)

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus (procés híbrid aprovat pel grup).
> Per revisar: `lliuraments/E04-revisio.md`.

**Per a**: logopeda o mestre d'infantil i cicle inicial, o una persona amb accés a un corpus de
llengua infantil o escolar del català (BDLOC o BDEC, llistes de vocabulari de P5 a 2n, materials
del PRODISCAT, o equivalent).

**Objectiu**: la llista de paraules que un nen de 5 a 8 anys coneix i fa servir en català, per
als exercicis de Level0 (5 anys), Level1 (6) i Level2 (7). En aquests tres nivells aquesta llista
mana per sobre de la general: "tanmateix" o "mitjançant" són altíssims en un corpus adult i
inútils aquí; "xumet" o "pilota" hi queden molt avall.

## Què cal lliurar

Un fitxer `ca-infantil.csv`, UTF-8, separat per comes, amb capçalera i una fila per forma:

| Columna | Obligatòria | Contingut |
|---|---|---|
| forma | sí | la paraula en minúscules, amb accents, dièresis, ç i l·l amb punt volat |
| lema | sí | entrada de diccionari |
| categoria | sí | nom, verb, adj, adv, det, pron, prep, conj, interj, num |
| nivell | sí | primer nivell en què la paraula és habitual: 0 (5 anys), 1 (6 anys) o 2 (7 anys) |
| frequencia | no | si la font en té |
| edat_adquisicio | no | si la font la té |

Exemple:

```
forma,lema,categoria,nivell,frequencia
mare,mare,nom,0,
pilota,pilota,nom,0,
arbre,arbre,nom,1,
platja,platja,nom,2,
menja,menjar,verb,0,
```

## Criteris

1. **Mida**: totes les que la font tingui; si es construeix a mà, com a mínim 500 de nivell 0,
   1.000 acumulades a nivell 1 i 2.000 acumulades a nivell 2.
2. **Nivell** = edat a partir de la qual la paraula és del vocabulari del nen. En cas de dubte,
   el més alt.
3. **Formes**: flexions habituals en boca d'un nen (menja, mengen, menjava; gat, gats; gran,
   grans), no només el lema. Els monosíl·labs amb coda (gat, sol, pa, cap, dit) són vocabulari de
   nivell 0 o 1 encara que l'estructura sigui de Level1: el nivell que volem és el del
   vocabulari; l'estructura la filtra el generador a part.
4. **Ortografia de l'IEC del 2017, varietat central**; sense formes apostrofades com a entrades
   (el generador busca la paraula sense l'apòstrof).
5. **Sense noms propis**.
6. **Font i llicència** en `ca-infantil.LLICENCIA.txt`.

## Què respondre a més del fitxer

- D'on surt la llista i com s'ha assignat el nivell.
- Paraules que el nen coneix però no pot llegir al seu nivell per l'estructura (xocolata,
  col·legi), per saber que ja s'ha tingut en compte.

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `plans/multiidioma/resposta-peticio-llistes-frequencia.md`: on el grup demana una llista infantil per a Level0 a Level2 i cita BDLOC/BDEC i el PRODISCAT.
- `plans/multiidioma/estructura-ca.md (apartats 1, 2 i 5)`: perfil lector català per nivell, el cicle de síl·labes i el nivell mínim de cada estructura.
- `plans/multiidioma/Shine en Catalán.md`: la resposta original de l’expert amb la taula 2.3 catalana.

## On lliurar-ho

`shine/private/lexico/ca-infantil.csv` i el fitxer de llicència. Fora de git.
