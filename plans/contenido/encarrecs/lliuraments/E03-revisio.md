# E03. Vocabulari infantil del castellà: proposta per revisar

**Estat**: feta per l'equip (Claude, model Opus) el 2026-10-28 amb el procés híbrid que el grup va
aprovar el mateix dia, perquè no tenim accés a LEXESP. Pendent de la revisió del grup. Fins que no
estigui revisada, la porta lèxica la fa servir per a Level0 a Level2, però cap lot es publica només
amb el seu aval.

## Què hi ha

`shine/private/lexico/es-infantil.csv` (fora de git): **2.408 lemes** classificats per edat i
**26.878 formes** (les flexions habituals de cada lema).

| Nivell | Lemes | Formes | Formes acumulades | Mínim de l'encàrrec |
|---|---|---|---|---|
| 0 (5 anys) | 867 | 8.686 | 8.686 | 500 |
| 1 (6 anys) | 878 | 9.717 | 18.403 | 1.000 |
| 2 (7 anys) | 663 | 8.475 | 26.878 | 2.000 |

| Columna | Contingut |
|---|---|
| forma, lema, categoria | com a la llista general |
| nivel | 0, 1 o 2: primer nivell en què la paraula és habitual |
| frecuencia, rango_general | els de la forma a `es-general.csv` (CORPES XXI), si hi és |
| estructura_min, estructura_motivo | nivell mínim per estructura sil·làbica segons la taula del catàleg, i per què |
| fuente | d'on ve el lema: general, banco (banc d'imatges), lotes (lots ja revisats), temas (afegit per temes) |

## Com s'ha fet

1. **Lemes candidats**: els 3.000 lemes més freqüents de la llista general (sense noms propis ni
   paraules marcades), els 429 noms del banc d'imatges i les paraules dels lots de Level0 a Level2
   ja revisats.
2. **Vocabulari que les llistes d'adults deixen fora**: Opus n'ha afegit 668 lemes per temes
   (família, cos, roba, casa, menjar, animals, joguines, parc, escola, transports, oficis, natura,
   colors, nombres, festes, emocions, accions, qualitats i llenguatge infantil): "chupete",
   "columpio", "gominola", "tobogán".
3. **Nivell de cada lema**: Opus ha classificat els 3.314 candidats un per un (nivell 0, 1, 2 o
   fora) amb el criteri de l'encàrrec: el nivell és el del vocabulari, no el de la lectura, i en
   cas de dubte, el més alt. N'han quedat fora 1.565 ("gobierno", "mediante", "agregar").
4. **Formes**: les del CORPES XXI per a cada lema, amb aquesta regla per als verbs:
   - present, pretèrit, imperfet, imperatiu, infinitiu, gerundi i participi, al nivell del lema;
   - futur, condicional i present de subjuntiu, com a mínim a nivell 1 ("comerá", "coma");
   - sense imperfet ni futur de subjuntiu ("comiera", "comiese");
   - els temps menys corrents, només si surten 20 vegades o més al corpus.
5. **Estructura**: cada forma porta el seu nivell mínim per estructura
   (`shine/content/generadores/estructura.py`, que aplica la taula del catàleg). És informativa:
   la porta lèxica comprova el vocabulari, i l'estructura la filtra qui genera el lot.

Respostes a les preguntes de l'encàrrec:

- **D'on surt i com s'ha assignat el nivell**: dels quatre orígens del punt 1 i 2; el nivell, el
  judici d'Opus lema a lema, que és el que us demanem que reviseu.
- **Paraules conegudes però difícils de llegir**: 11.768 formes tenen una estructura de nivell més
  alt que el seu vocabulari ("chocolate", vocabulari de nivell 0 i estructura de Level1;
  "grande", vocabulari 0 i estructura de Level2). Són a `es-infantil.revision-estructura.csv`.

## Què us demanem revisar, per ordre

1. **Mostra de qualitat** (`es-infantil.revision-muestra.csv`, 300 lemes a l'atzar): omplir
   "correcto (sí/no)" i, si no ho és, el nivell bo. Proposem acceptar la llista si el nivell és
   correcte en el 90 % dels lemes o més, contant com a correcte una diferència d'un nivell cap amunt
   (el criteri de l'encàrrec és "en cas de dubte, el més alt").
2. **Llista completa de lemes** (`es-infantil.revision-lemas.csv`, 2.408): per repassar per temes
   o per nivell si la mostra dona molts errors.
3. **Casos dubtosos que ha assenyalat Opus**:
   - paraules que només són infantils en una expressió: "gracia" (nivell 0 per "gracias"),
     "valer" (0 per "vale"), "caso" (2, "hacer caso"), "repente" (1, "de repente"), "deber"
     (1, "los deberes"), "tal" (1, "¿qué tal?");
   - "fe" i "papa": fora (no són vocabulari infantil en el seu sentit principal);
   - "liga", "mundial" (2): coneguts pel futbol;
   - "bajo" com a preposició (2): els nens diuen "debajo de".

## Criteris que ha de decidir el grup

1. **Temps verbals** (punt 4 de "Com s'ha fet"): d'acord amb la regla?
2. **Una paraula, un nivell**: el nivell és per lema i s'aplica a totes les seves formes. Per això
   "gracia" és de nivell 0, encara que el nen només conegui "gracias". Ho deixem així o voleu nivell
   per forma en aquests casos?
3. **Llista infantil a partir de Level3** (proposta de E01, criteri 2): ara que la tenim, una
   paraula de nivell 0 a 2 d'aquesta llista es considera dins de rang a qualsevol nivell, encara que
   el CORPES la posi molt avall ("columpio", 34.316). D'acord?

## On tornar-ho

La mostra omplerta, les correccions i les respostes als tres criteris, a
`plans/contenido/encarrecs/lliuraments/E03-revisio-resposta.md`. Si la persona no té accés al
repositori, cal adjuntar-li els fitxers de `shine/private/lexico/` que comencen per `es-infantil`.
