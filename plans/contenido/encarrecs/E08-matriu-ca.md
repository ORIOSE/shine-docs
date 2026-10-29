# E08. Material per a la matriu de discriminació visual de Level7 a Level10, català

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus. Per revisar:
> `lliuraments/E07-E08-revisio.md`.

**Per a**: logopeda o especialista en lectoescriptura, català.

**Objectiu**: a la matriu el nen toca totes les aparicions d'un objectiu en una graella amb
distractors que s'hi assemblen. Fins a Level6 les cel·les són lletres i les genera un programa.
De Level7 a Level10 les cel·les són síl·labes, paraules i pseudoparaules catalanes, i necessitem
els conjunts validats per endavant. A més, les grafies pròpies del català (l·l, ny, ç, ix, accents
oberts i tancats, dièresi) tenen matrius pròpies des de Level2 que també volem llistades.

## Què cal lliurar

Un fitxer `E08-matriu-ca.csv`, UTF-8, amb capçalera; una fila per conjunt:

| Columna | Contingut |
|---|---|
| nivell | 2 a 10 (de 2 a 6 només per a grafies pròpies; de 7 a 10, síl·labes i paraules) |
| objectiu | la cel·la objectiu; a Level8 i Level10 poden ser dues, separades per barra vertical |
| distractors | de 3 a 5, separats per barra vertical |
| tipus | grafia (l·l entre ll i l), inversio (bra/bar), mirall, travada, pseudo_1_lletra, parell_real |
| nota | opcional |

Exemple:

```
nivell,objectiu,distractors,tipus,nota
2,ç,c|s|o,grafia,
3,l·l,ll|l|il,grafia,punt volat U+00B7
4,è,é|e|ê,grafia,accent obert
7,bra,bar|dra|bla|pra,inversio,
8,tra|dra,tar|dar|tre|bra,travada,doble objectiu
9,casa,cosa|caça|capa|casu,pseudo_1_lletra,
10,gat|got,gos|gat|gel|gas,parell_real,doble objectiu
```

## Criteris per nivell (catàleg 6.1)

| Nivell | Cel·les | Objectius per ronda | Distractors |
|---|---|---|---|
| Level2 a Level6 | grafies pròpies | el del nivell (5 a 8) | la grafia veïna: l·l entre ll i l; ç entre c i s; ny entre n, y i in; ix entre x, is i xi; è/é, ò/ó, ï/i/í |
| Level7 | síl·labes | 7 | inversions i travades (bra, bar, dra, pra) |
| Level8 | síl·labes | 8 (entre dos objectius) | ídem amb doble objectiu |
| Level9 | paraules curtes | 6 | pseudoparaules amb una lletra canviada |
| Level10 | paraules | 8 (entre dos objectius) | parells mínims reals (casa, caça, cosa; got, gat, gos; sal, sol) |

1. **Nivell mínim de les grafies**: ç i ny des de Level1, ix des de Level2, l·l des de Level3
   (estructura-ca.md 5). Una matriu no baixa del nivell mínim del seu objectiu.
2. **Distractors** per forma, mai per significat. Síl·labes amb fonètica catalana (ce, ci, ge,
   gi, tx, ix) i sil·labeig de l'IEC.
3. **Ortografia** de l'IEC; minúscules; punt volat a l·l.
4. **Quantitat**: 10 conjunts per nivell de Level7 a Level10, i 6 per nivell de Level2 a Level6
   per a les grafies pròpies.

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `docs/exercise-catalog.md (apartat 6.1, paràgraf "En catalán")`: el contracte de la matriu i les grafies pròpies del català.
- `plans/multiidioma/estructura-ca.md (apartats 4 i 5)`: el terme "Grafies diacrítiques i especials" i el nivell mínim de ç, ny, ix i l·l.
- `plans/multiidioma/prompts-contenido/01-matriu.md`: el prompt de generació, amb l’exemple de registre català (ç, l·l).
- `plans/multiidioma/resposta-revisio-lots-ca.md (punt 3)`: on el grup va moure la matriu de l·l de Level2 a Level3.

## On lliurar-ho

`plans/contenido/encarrecs/lliuraments/E08-matriu-ca.csv`.
