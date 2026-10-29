# E04. Vocabulari infantil del català: proposta per revisar

**Estat**: feta per l'equip (Claude, model Opus) el 2026-10-28 amb el procés híbrid que el grup va
aprovar el mateix dia, perquè no tenim accés al BDLOC ni al PRODISCAT. Pendent de la revisió del
grup. Fins que no estigui revisada, la porta lèxica la fa servir per a Level0 a Level2, però cap lot
es publica només amb el seu aval.

## Què hi ha

`shine/private/lexico/ca-infantil.csv` (fora de git): **2.554 lemes** classificats per edat i
**12.511 formes**, en català central i amb la norma del 2017.

| Nivell | Lemes | Formes | Formes acumulades | Mínim de l'encàrrec |
|---|---|---|---|---|
| 0 (5 anys) | 615 | 2.657 | 2.657 | 500 |
| 1 (6 anys) | 979 | 5.281 | 7.938 | 1.000 |
| 2 (7 anys) | 960 | 4.573 | 12.511 | 2.000 |

Les columnes són les de l'encàrrec (forma, lema, categoria, nivell, frequencia) més
`rango_general` (el de `ca-general.csv`), `estructura_min` i `estructura_motivo` (nivell mínim per
estructura segons la taula de l'apartat 5 de `estructura-ca.md`) i `fuente` (general, banco,
lotes o temas).

## Com s'ha fet

1. **Lemes candidats**: els 3.000 lemes més freqüents de la llista general (sense noms propis ni
   paraules marcades), els 423 noms catalans del banc d'imatges i les paraules dels lots de Level0
   a Level2 ja revisats pel grup.
2. **Vocabulari que les llistes d'adults deixen fora**: Opus n'ha afegit 873 lemes per temes
   ("xumet", "gronxador", "llaminadura").
3. **Nivell de cada lema**: Opus ha classificat els 3.340 candidats un per un, amb el criteri de
   l'encàrrec. N'han quedat fora 1.657 ("tanmateix", "mitjançant", i "roig", perquè en català central
   els nens diuen "vermell").
4. **Formes**: les del diccionari de Softcatalà per a cada lema, amb aquesta regla per als verbs:
   - present, imperfet, imperatiu, infinitiu, gerundi i participi, al nivell del lema;
   - futur, condicional i present de subjuntiu, com a mínim a nivell 1;
   - sense imperfet de subjuntiu ni passat simple (el nen diu "va menjar", no "menjà").
   Sense formes apostrofades com a entrades, com demana l'encàrrec.
5. **Estructura**: cada forma porta el seu nivell mínim per estructura, informatiu. Els monosíl·labs
   amb coda ("gat", "sol", "pa") són vocabulari de nivell 0 encara que l'estructura sigui de Level1,
   tal com diu el criteri 3.

Respostes a les preguntes de l'encàrrec:

- **D'on surt i com s'ha assignat el nivell**: dels quatre orígens dels punts 1 i 2; el nivell, el
  judici d'Opus lema a lema.
- **Paraules conegudes però difícils de llegir**: 6.063 formes ("xocolata" i "gat", vocabulari 0 i
  estructura de Level1; "cotxe" i "gronxador", estructura de Level2; "col·legi", Level3). Són a
  `ca-infantil.revision-estructura.csv`.

## Què us demanem revisar, per ordre

1. **Mostra de qualitat** (`ca-infantil.revision-muestra.csv`, 300 lemes a l'atzar): omplir
   "correcto (sí/no)" i el nivell bo si no ho és. Proposem acceptar la llista amb el 90 % o més de
   nivells correctes, contant com a correcte una diferència d'un nivell cap amunt.
2. **Conflictes amb els lots ja revisats** (`ca-infantil.revision-conflictos-lotes.csv`, 75 files):
   paraules que el grup ja va acceptar en lots de Level0 a Level2 i que Opus posa a un nivell més
   alt ("lupa" i "puma" de nivell 2 en lots de Level0; "mula", "mapa", "pila", "ala" de nivell 1),
   o que ha deixat fora ("roig"). Per a cada una: o es baixa el nivell a la llista o es canvia
   l'activitat. Proposta: baixar-les a la llista, perquè la vostra revisió dels lots ja n'és la
   prova. Algunes files són síl·labes dels lots de repetició que coincideixen amb una paraula
   ("fra", "pro"): es poden ignorar.
3. **Llista completa de lemes** (`ca-infantil.revision-lemas.csv`, 2.554), si la mostra dona molts
   errors.
4. **Casos dubtosos que ha assenyalat Opus**:
   - col·loquialismes: "maco" i "guapo" (nivell 0, el DIEC els recull), "tio" (fora, castellanisme);
   - noms de lletres: "cu", "ge", "pe" (nivell 1);
   - polisèmia: "papa" (0, pel pare), "dret" (1, com a adjectiu), "ple" i "bé" com a noms (fora),
     "llar" (2, per "llar d'infants");
   - llenguatge infantil afegit per temes que cal confirmar: "mam", "nones", "bua", "nino-nino".

## Criteris que ha de decidir el grup

1. **Temps verbals** (punt 4 de "Com s'ha fet"): d'acord amb la regla, també amb deixar fora el
   passat simple?
2. **Conflictes amb els lots** (punt 2 de la revisió): baixem el nivell a la llista?
3. **Una paraula, un nivell**: el nivell és per lema i val per a totes les formes. D'acord?
4. **Llista infantil a partir de Level3** (proposta de E02, criteri 8): una paraula de nivell 0 a 2
   d'aquesta llista es considera dins de rang a qualsevol nivell, encara que la llista general la
   posi molt avall ("gronxador", 36.604). D'acord?

## On tornar-ho

La mostra omplerta, la decisió sobre els conflictes i les respostes als quatre criteris, a
`plans/contenido/encarrecs/lliuraments/E04-revisio-resposta.md`. Si la persona no té accés al
repositori, cal adjuntar-li els fitxers de `shine/private/lexico/` que comencen per `ca-infantil`.
