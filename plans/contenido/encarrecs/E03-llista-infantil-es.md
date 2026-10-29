# E03. Llista de vocabulari infantil del castellà (5 a 8 anys)

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus (procés híbrid aprovat pel grup).
> Per revisar: `lliuraments/E03-revisio.md`.

**Per a**: logopeda o mestre d'infantil i primer cicle, o una persona amb accés a un corpus de
llengua infantil o escolar del castellà (LEXESP i els seus subcorpus escolars, llistes de
vocabulari de P5 a 2n de primària, o equivalent).

**Objectiu**: la llista de paraules que un nen de 5 a 8 anys coneix i fa servir, per als
exercicis de Level0 (5 anys), Level1 (6) i Level2 (7). Les llistes de freqüència d'adults
enganyen en aquests nivells: "gobierno" o "mediante" hi són altíssims, i "chupete" o "pelota"
hi queden molt avall. En aquests tres nivells aquesta llista mana per sobre de la general.

## Què cal lliurar

Un fitxer `es-infantil.csv`, UTF-8, separat per comes, amb capçalera i una fila per forma:

| Columna | Obligatòria | Contingut |
|---|---|---|
| forma | sí | la paraula en minúscules i amb accents |
| lema | sí | entrada de diccionari |
| categoria | sí | nom, verb, adj, adv, det, pron, prep, conj, interj, num |
| nivel | sí | el primer nivell en què la paraula és habitual: 0 (5 anys), 1 (6 anys) o 2 (7 anys) |
| frecuencia | no | si la font en té; si no, es deixa buida |
| edad_adquisicion | no | si la font la té |

Exemple:

```
forma,lema,categoria,nivel,frecuencia
mamá,mamá,nom,0,
pelota,pelota,nom,0,
árbol,árbol,nom,1,
playa,playa,nom,2,
come,comer,verb,0,
```

## Criteris

1. **Mida**: totes les que la font tingui; si es construeix a mà, com a mínim 500 paraules de
   nivell 0, 1.000 acumulades a nivell 1 i 2.000 acumulades a nivell 2 (són els llindars del
   catàleg).
2. **Nivell** = edat a partir de la qual la paraula forma part del vocabulari actiu o passiu
   d'un nen sense dificultats. En cas de dubte, el més alt.
3. **Formes**: incloure les flexions habituals en boca d'un nen (come, comen, comía; gato, gatos;
   grande, grandes), no només el lema.
4. **Castellà peninsular**, vocabulari d'ús a Catalunya (pot incloure formes compartides).
5. **Sense noms propis**.
6. **Font i llicència** en `es-infantil.LLICENCIA.txt`.

## Què respondre a més del fitxer

- D'on surt la llista i com s'ha assignat el nivell (font, curs escolar, criteri propi).
- Si hi ha paraules que un nen coneix però no sap llegir als 5 anys per l'estructura (per
  exemple "chocolate": coneguda a nivell 0 però amb tres síl·labes i dígraf). El nivell que
  volem és el del vocabulari; l'estructura la filtra el generador a part.

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `plans/multiidioma/resposta-peticio-llistes-frequencia.md`: on el grup demana que a Level0 a Level2 mani una llista infantil o escolar i cita LEXESP.
- `docs/exercise-catalog.md (apartats 2.2 i 2.3)`: el perfil lector de referència de cada nivell i les estructures admeses.
- `docs/generador/Taxonomía fonológica.md`: els grups de sonoritat i esforç del castellà, per si voleu etiquetar.

## On lliurar-ho

`shine/private/lexico/es-infantil.csv` i el fitxer de llicència. Fora de git.
