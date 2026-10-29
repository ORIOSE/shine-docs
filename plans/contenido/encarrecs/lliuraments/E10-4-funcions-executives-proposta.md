# E10, pregunta 4. Funcions Executives i Atenció: proposta per al grup d'experts

> Proposta redactada per l'equip (Claude, model Opus) el 2026-10-28 perquè decideixi el grup d'experts.

Aquest document no pren cap decisió. Presenta quatre opcions, una recomanació argumentada i les
preguntes que el grup ha de respondre. La resposta es lliura, com les altres de l'encàrrec, a
`plans/contenido/encarrecs/lliuraments/E10-decisions.md`.

---

## 1. El problema

1. "Funcions Executives i Atenció" és una de les cinc àrees de l'app i un vèrtex del gràfic radial,
   però cap dels vuit tipus d'exercici la té com a àrea principal: no hi ha cap activitat, ni en
   castellà ni en català.
2. El sistema de nivells la salta (no la pot provar al bloc inicial i la dona per tancada), però
   les sessions regulars ho paguen: amb 4 forats d'àrea que roten entre 5 àrees, 4 de cada 5
   sessions regulars reserven un forat per a aquesta àrea, no troben res i surten amb 3 activitats
   d'àrea en lloc de 4.
3. El radar ja la mou una mica, perquè la matriu i la posició d'imatges la porten com a àrea
   secundària (pas de 3 punts sobre 100), però no hi ha cap exercici que la treballi de debò ni cap
   nivell que la mesuri.

---

## 2. Opcions

Components de les funcions executives que fem servir per comparar (model d'unitat i diversitat de
Miyake i col., 2000; Diamond, 2013): **inhibició** (frenar una resposta automàtica), **memòria de
treball** (mantenir i actualitzar informació), **flexibilitat cognitiva** (canviar de regla o de
criteri) i, com que l'àrea també diu "Atenció", **atenció sostinguda i selectiva**.

Un punt de partida comú a totes les opcions: l'app ja té una àrea pròpia de Memòria de Treball
(Auditiva i Visual), amb la posició d'imatges. Perquè l'àrea de Funcions Executives no dupliqui
aquella, el seu exercici hauria de carregar sobretot **inhibició, flexibilitat i atenció**, i la
memòria de treball només com a suport.

### Opció (a). Matriu amb regla

**Què és.** La mateixa quadrícula de la matriu de discriminació (catàleg 6.1), però l'objectiu no
és "totes les p": és una regla que obliga a mirar el context i a frenar la resposta automàtica
("toca la p només si just abans hi ha una a").

**Què treballa.** Inhibició (hi ha p que conviden a tocar i no s'han de tocar), atenció selectiva
i sostinguda (escombratge sistemàtic de tota la quadrícula), memòria de treball lleugera (mantenir
la regla) i, amb les variants de canvi de regla, flexibilitat.

**Raonament clínic.** És la família de les proves de cancel·lació amb regla que els professionals
ja coneixen: el test d2 (Brickenkamp) demana marcar la d només quan porta dues ratlles, entre d i p
amb un altre nombre de ratlles; el CARAS-R és una cancel·lació de diferències; el subtest
d'Inhibició de la NEPSY-II passa de denominar a inhibir i a canviar de regla, que és exactament la
progressió que proposem per nivells. La regla "X només després de Y" és la versió espacial del
paradigma AX-CPT de control atencional. A més, escombrar la quadrícula d'esquerra a dreta i mirar
la cel·la anterior és un hàbit lector, cosa que acosta l'exercici a la lectura.

Les metaanàlisis troben dificultats executives en la dislèxia, sobretot en memòria de treball,
inhibició i canvi (Booth, Boyle i Kelly, 2010), i una comorbiditat amb el TDAH que se sol xifrar
entre el 25 i el 40 % (Willcutt i Pennington, 2000). Advertència honesta: l'entrenament executiu
millora sobretot la tasca entrenada i tasques properes, i la transferència llunyana (per exemple, a
la lectura) és feble (Melby-Lervåg i Hulme, 2013; Kassai i col., 2019). Per això convé que el
material siguin lletres, síl·labes i paraules i no figures abstractes en tots els nivells: si hi ha
transferència, serà a material lector.

**Què canvia a l'app. Cost: petit a mitjà.** Mirant el codi:

- No cal cap tipus de node nou: es reutilitza `activity_letter_matrix`. L'àrea és un camp de cada
  activitat (`field_main_area`), no del tipus, així que una matriu amb regla pot tenir Funcions
  Executives com a àrea principal sense tocar res. Tampoc canvien les sessions, la càrrega de
  l'activitat a la sessió, la llista de tipus de les valoracions (`ACTIVITY_BUNDLES`) ni les
  estadístiques: el resum continua sent `summary_letter_matrix`, que ja surt a "Exercicis amb
  encerts".
- Drupal: dos o tres camps nous a la matriu (tipus de regla, cel·les objectiu i cel·les esquer per
  ronda, calculades per l'importador) i un comptador `field_lure_marks` al log i al resum.
  L'importador (`LetterMatrixActivityHandler`) aprèn una clau `regla`, calcula les cel·les objectiu
  i esquer, valida els recomptes i inclou la regla a la forma canònica de l'empremta de contingut.
- App: avui `src/lib/letterMatrix.ts` decideix què és objectiu comparant el text de la cel·la amb
  `field_target` (`parseRounds`). Amb regla, ha de llegir els índexs guardats en lloc de comparar
  text (lògica pura i testejable). `LetterMatrixPlayer.tsx` (395 línies) ha de pintar l'enunciat de
  la regla en lloc de "Troba totes les", una columna de clau no tocable en una de les regles i el
  fons alternat de files en una altra. La resta (marcar, desmarcar, barra de temps, revelar amb
  l'aro ambre, tancament automàtic) es queda igual.
- Si el grup ho accepta, un canvi petit al fre per encerts del servidor
  (`SessionEvaluator::effectiveRating`) perquè les comissions sobre esquers comptin (pregunta 5).
- Contingut: totalment algorítmic, com la matriu actual. De Level0 a Level8 el material (símbols,
  lletres i síl·labes universals) és compartible entre els dos idiomes en un sol registre amb
  `idiomas` [es, ca]: només canvien el títol i la instrucció.

**Riscos.**

- Que l'àrea tingui una sola mecànica: el nen faria matrius amb regla a cada sessió en aquesta àrea
  (avui Memòria de Treball també en té una sola). Es mitiga amb quatre famílies de regla i, més
  endavant, amb un segon tipus (opció d).
- Que es confongui amb Processos Perceptius si la dificultat creix per semblança visual. Regla de
  disseny: **la dificultat creix per la regla, no per la semblança de les lletres** (distractors
  visualment distants, mai b, d, p, q com a parell crític).
- "Abans" vol dir "a l'esquerra en el sentit de lectura": la lateralitat no és estable fins als 6 o
  7 anys, i en dislèxia la confusió esquerra i dreta és freqüent. Per això la regla condicional no
  apareix fins a Level2 i sempre amb una pista visual amb fletxa.
- La regla ha d'entendre's abans de jugar: la llegeix l'adult a la introducció i, a Level0 i en
  cada regla nova, l'adult fa un exemple, com a la repetició ràpida.

### Opció (b). Instruccions encadenades

**Què és.** L'exercici 7.10 del document de tipus: escoltar una ordre de diversos passos ("toca el
gos, després la poma i porta el llapis a la caixa") i executar-la sobre una escena amb objectes.
El disseny visual existeix (`plans/design/07-fase-ejecucion/`, 7.10) i el pla el va deixar per a la
v1.1 perquè necessita àudio.

**Què treballa.** Sobretot memòria de treball verbal i seqüenciació, amb comprensió oral i una mica
de planificació. Poca inhibició i poca flexibilitat si no s'hi afegeixen condicions ("si el gos és
blau, ...").

**Raonament clínic.** És una tasca ecològica, molt propera al que es demana a l'aula, i a la
literatura "seguir instruccions" es fa servir precisament com a mesura de memòria de treball
(Gathercole i col., 2008). Aquí hi ha el problema: mesura sobretot el que ja mesura l'àrea de
Memòria de Treball (Auditiva i Visual), i en nens amb dislèxia, amb alta comorbiditat amb el
trastorn del llenguatge, es barreja amb la comprensió oral.

**Què canvia a l'app. Cost: gran.**

- Tipus de node nou amb paràgrafs (escena, objectes, passos, condició d'encert per pas), bundles de
  log i resum nous, entrada a `ACTIVITY_BUNDLES` amb el seu `hook_update_N`, càrrega a la sessió,
  estadístiques, handler d'importació i tests: el recorregut complet de la llista de
  `docs/activity-system.md`.
- Player nou de zero: escena amb objectes col·locats, toc i, segons el disseny, arrossegament, que
  l'app no té enlloc (el reordenament de síl·labes va triar tocar en ordre per evitar gestos).
- Àudio: locucions en castellà i català o una veu sintètica de qualitat, que encara no existeixen. Si
  en lloc d'àudio la llegeix l'adult, la velocitat, l'entonació i les repeticions de cada adult fan
  que els intents no siguin comparables.
- Contingut: plantilles gramaticals per idioma amb connectors temporals i condicionals graduats per
  nivell, i revisió del nivell de comprensió oral de cada ordre. Molt més car que una quadrícula.

**Riscos.** Mesura memòria de treball i llenguatge més que funcions executives; depèn d'una peça
(l'àudio) que no tenim; és l'opció que trigaria més a donar contingut a les 11 cel·les en dos
idiomes.

### Opció (c). Deixar l'àrea buida i treure-la del radar

**Què treballa.** Res: l'àrea desapareix de la vista fins que hi hagi un exercici.

**Raonament clínic.** Defensable si el grup considera que les funcions executives no són objecte
directe d'una app de lectura i que el seu tractament correspon al professional. Té un cost clínic:
les dificultats executives i atencionals són freqüents en aquest públic i l'adult perd un indicador.

**Què canvia a l'app. Cost: petit.**

- Treure-la del radar: despublicar el terme de l'àrea en cada entorn (l'app llegeix les àrees per
  JSON:API i no veuria el terme despublicat; el servidor, que les carrega totes, continuaria creant
  la seva fila de nivell a Level0 sense efecte) o filtrar-la a la pantalla d'estadístiques.
- Imprescindible en aquesta opció, i recomanable en qualsevol mentre l'àrea no tingui contingut: que
  la rotació de les sessions regulars (`SessionGenerator::planRegular`) només reparteixi forats
  entre àrees amb contingut en l'idioma de l'alumne. Avui el forat es perd i la sessió s'escurça.
- Es perd el moviment que avui li donen la matriu i la posició d'imatges com a àrea secundària.
  Quan torni, el radar es recalcula des de les dades crues i el vèrtex reapareix amb la seva
  història.

**Riscos.** Contradiu la promesa de cinc àrees (documents, radar, materials per a famílies). Si
s'allarga, l'àrea queda oblidada.

**Variant descartada d'entrada.** Posar Funcions Executives com a àrea principal a matrius normals
(cost zero). Una cancel·lació simple sí que és una tasca d'atenció selectiva, però el mateix
exercici serviria per a dues àrees: el nivell d'una i de l'altra es mourien amb la mateixa
evidència i el radar perdria sentit.

### Opció (d), pròpia. Seqüència amb regla (parpelleig en mode "toca quan...")

**Què és.** Reaprofitar la idea del parpelleig: els elements (símbols, lletres o síl·labes) apareixen
un per un, sols, a un ritme fix, i el nen toca un botó gran només quan apareix l'objectiu ("toca quan
surti la p"), o només quan l'objectiu va just després d'un altre ("toca la p només si abans ha sortit
la a").

**Què treballa.** Atenció sostinguda i inhibició en el temps: és el paradigma de rendiment continu
(CPT) i la seva variant AX-CPT, els més usats clínicament per mesurar atenció sostinguda i
impulsivitat. Dona encerts, omissions, comissions i temps de reacció, que són els indicadors que un
neuropsicòleg reconeix.

**Raonament clínic.** És complementari de la matriu amb regla: la matriu és autoregulada (el nen
decideix el ritme) i la seqüència és imposada (la màquina marca el ritme). Junts cobririen l'àrea
amb dues mecàniques. Hi ha treballs que relacionen l'entrenament atencional amb millores en lectura
en nens amb dislèxia (Franceschini i col., 2013, amb videojocs d'acció), però l'evidència per a
tasques tipus CPT com a entrenament és limitada.

**Què canvia a l'app. Cost: mitjà a gran.** El parpelleig d'avui avança en tocar: l'avanç automàtic
amb `field_seconds` està previst però no implementat (catàleg 5.3). Caldria un player nou amb rellotge
de presentació, finestra de resposta i temps de reacció per element; un log amb camps nous (resposta i
temps de reacció per element); probablement un tipus de node propi per no barrejar-lo amb el
parpelleig de l'àrea de Velocitat, amb tot el recorregut de la llista de `docs/activity-system.md`. El
contingut sí que seria barat (algorítmic i compartible entre idiomes).

**Riscos.** Pressió de temps en un públic amb ansietat lectora; coincidència amb l'àrea de Velocitat;
precisió del rellotge en mòbils antics i al web; i en ús acompanyat, decidir qui toca (ha de ser el
nen, perquè el que es mesura és la seva resposta).

### Comparació

| | (a) Matriu amb regla | (b) Instruccions encadenades | (c) Àrea buida, fora del radar | (d) Seqüència amb regla |
|---|---|---|---|---|
| Inhibició | Alta | Baixa | Cap | Alta |
| Memòria de treball | Baixa a mitjana | Alta | Cap | Baixa a mitjana |
| Flexibilitat | Mitjana (regles de canvi) | Baixa | Cap | Baixa |
| Atenció sostinguda | Mitjana | Baixa | Cap | Alta |
| Solapament amb altres àrees | Perceptius, si no es controla la semblança visual | Memòria de Treball i llenguatge | | Velocitat |
| Cost a l'app | Petit a mitjà | Gran | Petit | Mitjà a gran |
| Cost del contingut | Baix (algorítmic, compartible) | Alt (per idioma, amb àudio) | Cap | Baix |
| Depèn d'àudio | No | Sí | No | No |

---

## 3. Recomanació

**Opció (a), matriu amb regla**, amb quatre famílies de regla que progressen per nivell (canvi amb
pista, regla condicional, regla inversa i alternança), material de baixa semblança visual i
comissions sobre esquers registrades a part. Motius: és l'única opció que treballa inhibició i
flexibilitat amb un cost petit, que no depèn de l'àudio, que es genera de manera algorítmica en els
dos idiomes alhora i que es pot tenir a les 11 cel·les en poc temps.

Com a complements, a decidir pel grup:

- Mentre no hi hagi contingut, que la rotació no reservi forat a l'àrea buida (cost petit, també
  útil per a qualsevol àrea buida en un idioma).
- L'opció (d) com a segon tipus de l'àrea per a la v1.1, perquè no tingui una sola mecànica.
- L'opció (b) a la v1.1, quan hi hagi locucions, però com a exercici de **Memòria de Treball**, que
  és el que mesura.

### 3.1 Matriu amb regla (proposta de mecànica, una pàgina)

**Què és.** Una quadrícula de símbols, lletres, síl·labes o paraules. El nen toca les cel·les que
compleixen una regla. Algunes cel·les són **esquers**: s'assemblen a l'objectiu però no compleixen
la regla, i són les que conviden a tocar per impuls. Es basa en les proves de cancel·lació amb regla
(d2) i en la progressió de la NEPSY-II (denominar, inhibir, canviar).

**Àrea.** Funcions Executives i Atenció; secundària Processos Perceptius (Discriminació Visual i
Auditiva). Codi `MAT-XX-Lnn-ATE-nnn`.

**Les quatre famílies de regla.**

| Regla | Enunciat d'exemple | Què és objectiu | Què és esquer | Component principal |
|---|---|---|---|---|
| R1 Clau de fila | "A cada fila, toca les iguals a la primera" | Les cel·les iguals a la clau de la seva fila (la primera columna, pintada a part i no tocable) | Les cel·les iguals a la clau d'una altra fila, sobretot de l'anterior | Flexibilitat amb pista visible |
| R2 Després de | "Toca la p només si just abans hi ha una a" | La p que té una a just a l'esquerra, a la mateixa fila | La p que té una altra cosa a l'esquerra o que comença fila | Inhibició i actualització |
| R3 Menys després de | "Toca totes les p, menys les que tenen una a just abans" | Les p sense a just abans | Les p amb a just abans | Inhibició (frenar la resposta per defecte) |
| R4 Alternança | "A les files clares toca la s; a les fosques, la m" | L'objectiu de la fila segons el fons (files alternes de fons lleugerament diferent) | L'objectiu de l'altra mena de fila | Flexibilitat sense clau a cada fila |

**Què veu el nen.** A dalt, la regla en una frase curta i en xips ([a] → [p], amb fletxa en el
sentit de lectura). Sota, la quadrícula i, si el nivell en porta, la barra de temps discreta de la
matriu. A Level9 i Level10 la regla s'amaga en començar la ronda (vegeu la pregunta 7).

**Què fa.** El mateix que a la matriu: tocar marca, tornar a tocar desmarca, "Comprovar" o el final
del temps tanquen la ronda. En revelar, els objectius trobats porten el check, els oblidats l'aro
ambre i les marques sobre esquers o neutres tornen al color neutre, sense missatge d'error. Si es
marquen exactament tots els objectius i res més, la ronda es tanca sola.

**Paper de l'adult.** Llegeix la regla en veu alta a la introducció. A Level0 i en el primer nivell
de cada regla nova (Level0, Level2, Level5 i Level6) fa un exemple abans de començar. El missatge
d'explicació de cada família de regla porta una imatge d'exemple (els `explanation_message` ja
admeten imatge).

**Què es mesura.** Per ronda: objectius trobats i objectius que hi havia (camps actuals d'encerts),
**esquers tocats** (camp nou, la comissió impulsiva), altres marques falses (camp actual
`field_false_marks`) i temps. Derivats, sense guardar: omissions (objectius no trobats) i encert
efectiu = (trobats − esquers tocats) / objectius.

**Regles de composició.**

- 40 a 50 % de cel·les neutres, visualment distants de l'objectiu, com demana l'especificació per a
  les matrius (amuntegament visual).
- Mai parells especulars (b, d, p, q) com a objectiu i esquer: això és de Processos Perceptius.
- La regla només es mira dins de la fila. Si una fila acaba amb el context (la a), la següent no pot
  començar amb l'objectiu (evita l'ambigüitat entre files).
- Objectius repartits: almenys un a cada meitat de la quadrícula i no més de 2 per fila fins a
  Level3.
- Almenys 5 objectius puntuables per activitat (fre per encerts).
- Símbols quan s'introdueix una regla nova a les edats petites (Level0 i Level2), perquè llegir no
  sigui l'obstacle; lletres, síl·labes i paraules a la resta.

**Paràmetres per nivell** (a validar pel grup).

| Nivell | Estímul | Regla | Quadrícula (columnes × files) | Rondes | Objectius per ronda | Esquers per ronda | Regla visible | Temps per ronda |
|---|---|---|---|---|---|---|---|---|
| Level0 | Símbols (● ▲ ■ ★) | R1 Clau de fila | 4 × 3 (1 clau + 3) | 2 | 3 | 2 | Sí (la clau) | Sense límit |
| Level1 | Lletres molt diferents (a, o, s, m, t, l) | R1 Clau de fila | 5 × 4 (1 clau + 4) | 2 | 6 | 3 | Sí | Sense límit |
| Level2 | Símbols | R2 Després de | 4 × 4 | 2 | 3 | 2 | Sí | Sense límit |
| Level3 | Lletres molt diferents | R2 Després de | 5 × 5 | 2 | 5 | 4 | Sí | 60 s |
| Level4 | Lletres | R2 Després de | 6 × 6 | 1 | 6 | 6 | Sí | 50 s |
| Level5 | Lletres | R3 Menys després de | 6 × 6 | 1 | 7 | 5 | Sí | 45 s |
| Level6 | Lletres | R4 Alternança | 6 × 7 | 1 | 8 | 6 | Sí | 45 s |
| Level7 | Síl·labes CV universals (ma, pa, sa, ta, lo, nu) | R2 Després de | 4 × 7 | 1 | 6 | 4 | Sí | 45 s |
| Level8 | Síl·labes CV i CVC | R3 Menys després de | 4 × 8 | 1 | 7 | 5 | Sí | 40 s |
| Level9 | Paraules curtes freqüents (article + nom) | R2 Després de ("toca casa només si abans hi ha la") | 3 × 8 | 2 | 4 | 4 | S'amaga en començar | 50 s |
| Level10 | Paraules curtes freqüents | R4 + R2: a les files clares una regla condicional i a les fosques una altra | 3 × 8 | 2 | 4 | 5 | S'amaga en començar | 50 s |

Durada prevista: d'1 a 3 minuts per activitat, dins de la pauta del catàleg (3.2). A Level9 i
Level10, la regla "article + nom" fa mirar les paraules funcionals, que els lectors amb dislèxia
tendeixen a saltar.

**Com es genera.** Un generador algorítmic amb llavor, com el de la matriu:

1. Prendre del nivell l'estímul, la regla, la mida, els objectius, els esquers i el temps.
2. Triar l'objectiu, el context (per a R2 i R3) i el conjunt de neutres, visualment distants.
3. Col·locar els objectius amb el seu context, després els esquers, i omplir amb neutres
   equilibrats sense crear per atzar cap parella que compleixi la regla.
4. Calcular i guardar les cel·les objectiu i esquer de cada ronda; l'importador les torna a
   calcular a partir de la regla i rebutja el lot si no coincideixen amb els recomptes declarats.

**En castellà i en català.** De Level0 a Level8 (símbols, lletres i síl·labes CV universals) el
material és el mateix en els dos idiomes: un registre amb `idiomas` [es, ca], amb el títol i la
instrucció per idioma. Exemples d'instrucció:

| Regla | Castellà | Català |
|---|---|---|
| R1 | En cada fila, toca las que son iguales a la primera. | A cada fila, toca les que són iguals a la primera. |
| R2 | Toca la p solo si justo antes hay una a. | Toca la p només si just abans hi ha una a. |
| R3 | Toca todas las p, menos las que tienen una a justo antes. | Toca totes les p, menys les que tenen una a just abans. |
| R4 | En las filas claras toca la s; en las oscuras, la m. | A les files clares toca la s; a les fosques, la m. |

A Level9 i Level10 les paraules són pròpies de cada idioma (lèxic del nivell, 3.6): en castellà
"la casa", "el sol", "un pan"; en català "la casa", "el sol", "un pa", sense apòstrofs a les cel·les
perquè cada cel·la sigui una sola paraula. La revisió de l'expert és la de sempre (mostra del 10 %),
amb la mirada posada en la claredat de la regla més que en el lèxic.

**Exemple.** `MAT-ES-L03-ATE-001`, "Toca la p si antes hay una a", R2, 5 × 5, una ronda de les dues.
En negreta els 5 objectius; en cursiva els 4 esquers (p sense a just abans); 11 neutres (o, s, m, t).

| | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Fila 1 | a | **p** | o | s | *p* |
| Fila 2 | m | a | **p** | t | o |
| Fila 3 | *p* | s | a | **p** | t |
| Fila 4 | o | a | **p** | m | *p* |
| Fila 5 | t | *p* | a | **p** | s |

### 3.2 Què caldria fer a l'app (resum del cost)

| Peça | Canvi | Mida |
|---|---|---|
| Drupal, tipus `activity_letter_matrix` | Camps de regla, cel·les objectiu i cel·les esquer | Petit |
| Drupal, log i resum de la matriu | Camp `field_lure_marks` | Petit |
| Importador (`LetterMatrixActivityHandler`) | Clau `regla`, càlcul i validació d'objectius i esquers, empremta amb la regla, tests | Mitjà |
| Avaluador de nivells | Encert efectiu amb esquers al fre per encerts (si el grup ho vol) | Petit |
| App, `letterMatrix.ts` | Objectius per índex en lloc de per text, columna de clau, tests | Petit |
| App, `LetterMatrixPlayer.tsx` | Enunciat de regla amb xips, columna de clau, fons alternat, regla amagable | Petit a mitjà |
| App, definició del tipus i textos | Esquers al log i al resum, textos `ca` i `es` de cada regla, tests de càrrega útil | Petit |
| Missatges d'explicació | Un per família de regla, amb imatge, en els dos idiomes | Petit (contingut) |
| Sense canvis | Sessions, càrrega a la sessió, `ACTIVITY_BUNDLES`, estadístiques, motivació | |
| Mentre no hi hagi contingut | Rotació només entre àrees amb contingut | Petit |

---

## 4. Preguntes per al grup

1. Quina opció adopteu: (a), (b), (c), (d) o una combinació (per exemple, (a) ara i (d) a la v1.1)?
2. L'àrea s'ha de centrar en inhibició, flexibilitat i atenció i deixar la memòria de treball a la seva àrea?
3. Les quatre famílies de regla (R1 a R4) i el nivell on entra cadascuna són adequats per a l'edat?
4. Símbols en lloc de lletres a Level0 i Level2 (quan s'introdueix una regla nova): sí o no?
5. Els esquers tocats han de restar a l'encert que fa servir el fre per encerts: sí o no?
6. En revelar, cal assenyalar d'alguna manera els esquers tocats o només els objectius oblidats, com ara?
7. Amagar la regla en començar la ronda a Level9 i Level10: sí, no o des de quin nivell?
8. "Abans" com a "a l'esquerra en el sentit de lectura" des de Level2 (7 anys), amb fletxa: és prou segur per la lateralitat?
9. Els temps per ronda de la taula són adequats o fan massa pressió?
10. Qualsevol que sigui l'opció, apliquem ja que la rotació no reservi forat a l'àrea buida?
11. Si es tria (b), la voleu com a exercici de Funcions Executives o de Memòria de Treball, i amb àudio o llegida per l'adult?
12. Amb quin mínim d'activitats per cel·la obrim l'àrea: 3, com el català a l'obertura, o el 6 del règim?

---

## Referències (orientatives, a verificar pel grup)

- Booth, J. N., Boyle, J. M. E. i Kelly, S. W. (2010). Do tasks make a difference? Accounting for
  heterogeneity of performance of children with reading difficulties on tasks of executive
  function: findings from a meta-analysis. British Journal of Developmental Psychology, 28, 133-176.
- Brickenkamp, R. Test d2, atenció selectiva i concentració (adaptació espanyola de TEA Ediciones).
- Diamond, A. (2013). Executive functions. Annual Review of Psychology, 64, 135-168.
- Franceschini, S. i col. (2013). Action video games make dyslexic children read better. Current
  Biology, 23, 462-466.
- Gathercole, S. E. i col. (2008). Working memory abilities and children's performance in
  laboratory analogues of classroom activities. Applied Cognitive Psychology, 22, 1019-1037.
- Kassai, R., Futo, J., Demetrovics, Z. i Takacs, Z. K. (2019). A meta-analysis of the experimental
  evidence on the near- and far-transfer effects among children's executive function skills.
  Psychological Bulletin, 145, 165-188.
- Korkman, M., Kirk, U. i Kemp, S. (2007). NEPSY-II, subtest d'Inhibició.
- Melby-Lervåg, M. i Hulme, C. (2013). Is working memory training effective? A meta-analytic
  review. Developmental Psychology, 49, 270-291.
- Miyake, A. i col. (2000). The unity and diversity of executive functions and their contributions
  to complex "frontal lobe" tasks. Cognitive Psychology, 41, 49-100.
- Thurstone, L. L. i Yela, M. CARAS-R, test de percepció de diferències (TEA Ediciones).
- Willcutt, E. G. i Pennington, B. F. (2000). Comorbidity of reading disability and
  attention-deficit/hyperactivity disorder. Journal of Learning Disabilities, 33, 179-191.

## Fonts internes consultades

- `plans/contenido/encarrecs/E10-decisions.md` (apartat 4).
- `docs/exercise-catalog.md` (2, 3.2, 3.3, 3.4, 5.3, 6.1, 6.4 i 7).
- `docs/activity-system.md` (llista per afegir un tipus i què escriu cada tipus).
- `docs/level-system.md` (5.1, 5.5 i 6).
- `docs/generador/Especificación Dislexia.md` (1, 3.3 i 3.4).
- `plans/design/07-fase-ejecucion/README.md` (7.10) i `plans/02-plan-ejecucion-v1.md` (v1.1).
- Codi: `shine-app/src/components/activities/LetterMatrixPlayer.tsx`, `shine-app/src/lib/letterMatrix.ts`,
  `shine-app/src/lib/activityKinds/`, `shine-app/src/lib/stats/areaRadar.ts`,
  `shine/public_html/modules/custom/shine_level/src/SessionGenerator.php` (`planRegular`) i
  `SessionEvaluator.php` (`effectiveRating`), `shine_content/src/Handler/LetterMatrixActivityHandler.php`.
