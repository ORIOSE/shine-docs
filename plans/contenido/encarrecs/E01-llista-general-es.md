# E01. Llista de freqüència general del castellà

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus. Per revisar:
> `lliuraments/E01-revisio.md`.

**Per a**: una persona amb accés a un corpus de referència del castellà (EsPal, CORPES XXI o
CREA, o equivalent) i capacitat d'exportar-ne dades.

**Objectiu**: una llista de formes del castellà ordenades per freqüència, amb lema i categoria,
perquè el generador d'activitats comprovi automàticament que cap paraula d'un exercici queda
per sobre del rang del seu nivell (Level3: 3.000 formes més freqüents; Level4: 5.000; Level5:
7.000; Level6: 10.000; Level7: 15.000; Level8: 20.000; Level9 i Level10: sense límit).

## Què cal lliurar

Un fitxer `es-general.csv`, UTF-8, separat per comes, amb capçalera i una fila per forma:

| Columna | Obligatòria | Contingut |
|---|---|---|
| forma | sí | la paraula tal com s'escriu, en minúscules i amb accents ("comíamos", "árbol") |
| lema | sí | l'entrada de diccionari ("comer", "árbol") |
| categoria | sí | una d'aquestes: nom, verb, adj, adv, det, pron, prep, conj, interj, num, npropi |
| frecuencia | sí (o rango) | recompte o freqüència per milió a la font |
| rango | sí (o frecuencia) | posició de la forma ordenant per freqüència descendent (1 = la més freqüent) |
| edad_adquisicion | no | edat d'adquisició si la font la té (EsPal), amb un decimal |
| etiqueta_font | no | l'etiqueta original de la font (EAGLES o la que sigui) si la categoria s'ha hagut de simplificar |

Exemple de files:

```
forma,lema,categoria,frecuencia,rango,edad_adquisicion
de,de,prep,65545.2,1,
casa,casa,nom,980.4,118,3.5
comíamos,comer,verb,4.1,18420,
```

## Criteris

1. **Mida**: com a mínim les 20.000 formes més freqüents; si la font en té més, totes.
2. **Formes, no només lemes**: el nen llegeix "comíamos", no "comer"; el rang que necessitem és
   el de la forma. El lema serveix per agrupar flexions i per comptar el sobreús.
3. **Varietat**: castellà peninsular (formes de "vosotros" incloses).
4. **Noms propis**: si la font els porta, marcar-los amb categoria `npropi`; no eliminar-los.
5. **Sense duplicats** de forma; si una forma té més d'una categoria (como "casa" nom i verb),
   una fila per categoria amb la seva freqüència, o la més freqüent si la font no les separa.
6. **Font i llicència**: indicar en un fitxer `es-general.LLICENCIA.txt` d'on surt la llista i en
   quines condicions es pot fer servir. La guardarem fora del repositori i no la redistribuirem.

## Què respondre a més del fitxer

- Si la font no dona rang sinó recompte, dir-ho (el calcularem nosaltres).
- Si la categoria s'ha simplificat des d'un etiquetari més fi, dir quin era.
- Si hi ha formes amb accent que la font escriu sense (textos antics), dir-ho.

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `plans/multiidioma/peticio-llistes-frequencia.md`: la petició original de les llistes, amb els llindars per nivell i com les farem servir.
- `plans/multiidioma/resposta-peticio-llistes-frequencia.md`: la resposta del grup: fonts recomanades (EsPal, CORPES XXI, CREA), columnes obligatòries i regles de tractament; aquest encàrrec en surt.
- `docs/exercise-catalog.md (apartats 2.3 i 3.6)`: la taula de rangs de freqüència per nivell i la puerta lèxica.

## On lliurar-ho

`shine/private/lexico/es-general.csv` (i el fitxer de llicència al costat). Fora de git.
