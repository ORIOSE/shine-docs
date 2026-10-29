# Guia de parametrització (català): un exemple per tipus i nivell

Document de treball per generar el contingut català de Shine. Equival a la Guía de Parametrización
castellana (docs/generador/Guía de Parametrización.md): per a cada un dels 8 tipus d’exercici dona
l’àrea principal, la mecànica, la regla de disseny i un exemple real per a cada nivell, de Level0 a
Level10. Els exemples són contingut català original (no traduccions) i segueixen la taula 2.3
catalana de plans/multiidioma/Shine en Catalán.md i el nivell mínim per estructura de
plans/multiidioma/estructura-ca.md (apartat 5).

- **Font**: estructura catalana de l’expert (plans/multiidioma/Shine en Catalán.md i
  resposta-estructura-ca.md, 2026-10-26), normalitzada a estructura-ca.md; exemples redactats per
  l’equip tècnic el 2026-10-26.
- **Estat**: provisional, pendent de revisió de l’expert (freqüència de les paraules, pseudoparaules
  i textos de lectura). Les decisions de l’apartat 0 s’han de confirmar abans de generar lots en
  volum.
- **Nivells importables**: avui només existeixen els termes Level0, Level1 i Level2 a
  activity_level (docs/exercise-catalog.md 2.5). Els exemples de Level3 a Level10 serveixen per
  calibrar i redactar, però no es poden importar fins que es creïn aquests termes.
- Convencions del lot (fitxers, codis, textos del registre): plans/multiidioma/prompts-contenido/README.md.

## 0. Regles que valen per a tots els tipus

- **Nivell mínim per estructura** (estructura-ca.md, apartat 5): Level0 només vocals i CV amb m, p,
  l, s, t, n, d (ma, pa, la, no, so; mapa, sopa, pala, lupa, moto, nina). Level1 totes les CV, les
  inverses VC (al, en, is), les mixtes CVC freqüents (gat, sol, cap, pa, llit), els dígrafs simples
  (ny, ll, ss, rr, qu, gu) i que/qui. Level2 travades amb l i r (pla, bra, tren), dígrafs complexos
  (tx, ig, tg, tj, ix), gue/gui/güe/güi i els monosíl·labs molt freqüents amb coda final simple
  (dent, pont, porc, serp, forn, guant, talp, llamp, cranc, tronc). Level3 codes complexes CVCC i
  VCC (temps, forts, trans, ins), ela geminada (col·legi), apostrofació i contraccions (l’avi, d’un,
  al, del) i hiats (pi-a-no, lle-ó). De Level4 en endavant la dificultat és la longitud, la
  freqüència, els pronoms febles i el vocabulari acadèmic.
- **Sil·labació del IEC**: els dígrafs tx, ix, ig, tg, tj, ss, rr i l·l se separen entre síl·labes
  (cot-xe, cai-xa, pet-xi-na, met-ge, plat-ja, tas-sa, car-ro, col-le-gi); ny, ll, qu i gu van
  units (pi-nya, llu-na, quin, gui-neu). Els hiats van en síl·labes diferents (pi-a-no, a-vi-ó).
- **Ela geminada a les fitxes de síl·labes** (decisió pendent): el punt volat desapareix quan es
  parteix la paraula amb guions (col-le-gi), però l’exercici «Ordena les síl·labes» ajunta les
  fitxes per comprovar la paraula i «collegi» no és «col·legi». Proposta: la fitxa de la primera
  síl·laba conserva el punt volat («col·» + «le» + «gi»). Fins que es confirmi, els lots eviten les
  paraules amb l·l en aquest exercici.
- **Pseudoparaules**: fonotaxi catalana, pronunciables, i que no siguin paraules ni en català ni en
  castellà (plim, frou, tral, blis, camiró, tolina). Es generen combinant síl·labes de l’inventari
  del nivell i descartant les que existeixen al lèxic.
- **Alivi**: a la llista de text, el parpelleig i la repetició ràpida, entre el 25 i el 30 % dels
  elements són d’alivi (síl·labes i paraules de Level0: a, e, ma, pa, la, no, sol, sopa, mapa,
  nina), intercalats en posicions a l’atzar, mai agrupats al final, i no s’etiqueten en sonoritat ni
  en esforç. Als exemples van marcats amb (alivi); les pseudoparaules, amb (pseudo).
- **Vocal neutra i o àtona**: des de Level2 el material pot incloure paraules amb a/e i o/u àtones
  (casa, poma, cosí) perquè el nen vegi que la lletra no sempre sona igual; a Level0 i Level1 es
  prefereixen paraules on la lletra i el so coincideixen.
- **Lletres i signes**: l’importador admet a les frases i paraules les lletres del castellà i del
  català (accents oberts i tancats, ñ, ü, ï, ç, l·l i l’apòstrof). Avui **no admet el guionet**, que
  cal per als pronoms enclítics amb guió (dona-m’ho, porta-li): fins que s’ampliï, les frases de
  segmentació fan servir enclítics amb apòstrof (posa’t, mira’l, deixa’m).
- **Terminologia de les etiquetes**: sonoritat i esforç amb els noms catalans d’estructura-ca.md
  (apartats 3 i 4): "Directes inicials (CV)", "Dígrafs simples", "Travades amb r (CCV)", "tx/ig",
  "grafies s/ss/c/ç", "Mirall b-d".

### 1. Llista de text (vertical_list)

* **Àrea principal:** Competència Lingüística i Fonològica (decodificació) o Rendiment i Velocitat
  de Processament (rapidesa amb paraules conegudes).
* **Mecànica:** lectura ítem a ítem, avanç en tocar i mesura del temps per ítem.
* **Regla de disseny:** seqüència fonètica agrupada (síl·laba → pseudoparaula → paraula real del
  grup) alternada amb un 25-30 % d’ítems d’alivi, intercalats. Màxim 20 caràcters per ítem a Level0
  a Level2, 60 a Level3 a Level5 i 120 des de Level6.
* **Level0 (5 anys, 6 ítems):** ["ma", "pa", "sopa", "pala", "la", "mapa"]
* **Level1 (6 anys, 8 ítems):** ["ga", "gat", "gol", "pa" (alivi), "nya", "nyola" (pseudo), "pinya", "sol" (alivi)]
* **Level2 (7 anys, 8 ítems):** ["pla", "plim" (pseudo), "plat", "mapa" (alivi), "tra", "trum" (pseudo), "tren", "sopa" (alivi)]
* **Level3 (8 anys, 10 ítems):** ["trans", "trosp" (pseudo), "transport", "ma" (alivi), "ins", "insfa" (pseudo), "instant", "sol" (alivi), "l’avi", "pa" (alivi)]
* **Level4 (9 anys, 10 ítems):** ["pastanaga", "pastanoli" (pseudo), "pa" (alivi), "tovallola", "tovaplena" (pseudo), "sol" (alivi), "samarreta", "cremallera", "ma" (alivi), "ordinador"]
* **Level5 (10 anys, 12 ítems):** ["electricitat", "electrinosa" (pseudo), "ma" (alivi), "temperatura", "tempolira" (pseudo), "sol" (alivi), "comunicació", "comunastre" (pseudo), "pa" (alivi), "vocabulari", "laboratori", "agricultura"]
* **Level6 (11 anys, 12 ítems):** ["paracaigudes", "paracalimbes" (pseudo), "sopa" (alivi), "rentaplats", "rentaflocs" (pseudo), "ma" (alivi), "biodiversitat", "inconstitucional", "pa" (alivi), "extraordinari", "subterrani", "llampegant"]
* **Level7 (12 anys, 12 ítems):** ["fotosíntesi", "fotosimbra" (pseudo), "sol" (alivi), "ecosistema", "ecosistrol" (pseudo), "pa" (alivi), "metamorfosi", "metamorflina" (pseudo), "ma" (alivi), "termodinàmica", "immunologia", "hidrosfera"]
* **Level8 (13 anys, 15 ítems):** ["espectrofotometria", "espectrofalma" (pseudo), "pa" (alivi), "electroencefalograma", "electrogranfe" (pseudo), "sol" (alivi), "espeleologia", "desoxiribonucleic", "desoxiplanta" (pseudo), "ma" (alivi), "neurotransmissor", "epistemologia", "sopa" (alivi), "nanotecnologia", "paleontologia"]
* **Level9 (14 anys, 15 ítems):** ["desproporcionadament", "desproporclau" (pseudo), "pa" (alivi), "interdisciplinarietat", "interdiscipro" (pseudo), "sol" (alivi), "contrarevolucionari", "electrocardiografia", "electrocardiofra" (pseudo), "ma" (alivi), "otorinolaringòleg", "descontextualització", "sopa" (alivi), "internacionalització", "incomprensibilitat"]
* **Level10 (15 anys, 15 ítems):** ["infraestructura", "infrastrucro" (pseudo), "sol" (alivi), "jurisprudència", "jurisprutra" (pseudo), "ma" (alivi), "desestabilització", "multidisciplinari", "multidisclipra" (pseudo), "pa" (alivi), "intergovernamental", "despersonalització", "mapa" (alivi), "descentralització", "incompatibilitat"]

### 2. Lectura en veu alta (audio_reading)

* **Àrea principal:** Rendiment i Velocitat de Processament; secundària Competència Lingüística i
  Fonològica.
* **Mecànica:** lectura contínua amb cronòmetre (i micròfon al mòbil); la mètrica és el temps total,
  del qual es deriven les paraules per minut.
* **Regla de disseny:** **un sol paràgraf** a tots els nivells; la dificultat es gradua per la
  longitud (paraules per text de la taula 2.3 catalana), la densitat lèxica i la sintaxi. Textos
  originals en català, aptes per a l’edat, sense noms propis fora del marge del nivell. Avís: el
  reproductor actual mostra unes 60 paraules sense desplaçament; els textos de Level3 en endavant
  necessiten el desplaçament previst al catàleg (5.2).
* **Level0 (5 anys):** *No recomanat: encara no llegeix textos.*
* **Level1 (6 anys, 1 paràgraf, 43 paraules, present, frases de 3 a 5 paraules):**
  * «La Laia té un gat. El gat es diu Sol. Sol és petit i menja molt. Cada matí salta i corre per la casa. La Laia el toca amb la mà. Els dos van a la cuina. Sol menja i la Laia mira.»
* **Level2 (7 anys, 51 paraules, travades tr i pr i pl):**
  * «El tren de la Berta passa per un prat verd. A la platja hi ha una planta petita i un plat amb fruita fresca. En Pere camina de pressa per no perdre el tren, mentre el seu germà prova una trampa de joguina. El tren xiula tres cops i tots pugen.»
* **Level3 (8 anys, 77 paraules, apostrofació, passat perifràstic):**
  * «En Marc i la seva germana van anar al parc a la tarda. El sol brillava al cel blau i l’aire era fresc. Un ocell gran va volar de pressa cap a l’estany, mentre els nens caminaven en silenci per no espantar els ànecs que nedaven a prop. Després van seure sota un arbre i van compartir un entrepà de formatge. Quan va començar a fer fosc, van tornar a casa amb les sabates plenes de sorra.»
* **Level4 (9 anys, 130 paraules, narratiu i descriptiu, ela geminada i dièresi):**
  * «L’antic far de la costa feia molts anys que estava apagat. Els veïns del poble explicaven històries sobre els vaixells que es guiaven per la seva llum les nits de tempesta, quan les onades colpejaven les roques amb força. Un jove electricista, que havia arribat al poble feia poc, va decidir arreglar-lo. Durant setmanes va pujar cada dia l’escala de cargol amb la caixa d’eines a l’espatlla. Va netejar els vidres, va canviar els cables vells i va revisar el motor que feia girar la gran lent. Una nit de novembre, amb tot el poble reunit al port, va prémer l’interruptor. La llum va travessar la foscor i va il·luminar el mar. Els pescadors més grans van aplaudir amb els ulls humits: el far tornava a vigilar la costa.»
* **Level5 (10 anys, 162 paraules, expositiu senzill):**
  * «Les abelles són insectes fonamentals per a l’equilibri de la natura, perquè s’encarreguen de la pol·linització. Quan una abella visita una flor per recollir nèctar, el pol·len se li enganxa a les potes i al cos. En volar cap a la flor següent, una part d’aquest pol·len es desprèn i permet que la planta produeixi fruits i llavors. Sense aquest viatge constant, moltes de les fruites i verdures que mengem cada dia no existirien. Dins del rusc hi ha una organització molt precisa. La reina pon els ous, les obreres construeixen les cel·les de cera, netegen, alimenten les larves i surten a buscar menjar, i els abellots s’ocupen de la reproducció. Cada membre compleix una funció concreta i cap no podria sobreviure sol. Per això els científics insisteixen que protegir les abelles és protegir, al mateix temps, els camps, els boscos i la nostra pròpia alimentació. Si desapareguessin, els camps es farien silenciosos i els prestatges de les botigues quedarien mig buits.»
* **Level6 (11 anys, 184 paraules, expositiu amb subordinades):**
  * «Tot i que la biodiversitat del planeta s’enfronta a reptes extraordinaris, molts científics treballen en laboratoris subterranis per conservar llavors d’espècies en perill. Aquests magatzems, excavats a la roca i mantinguts a temperatures molt baixes, guarden milions de mostres que podrien servir per recuperar cultius si una malaltia, una guerra o una catàstrofe climàtica els fes desaparèixer. L’observació constant dels ecosistemes permet dissenyar estratègies eficaces abans que les transformacions del clima causin danys irreversibles a la vegetació local. Els investigadors mesuren la temperatura del sòl, la quantitat de pluja i el comportament dels insectes, perquè qualsevol canvi petit pot anunciar un problema més gran. Quan detecten que una espècie retrocedeix, en recullen llavors i les classifiquen amb cura. D’aquesta manera, encara que un bosc sencer es perdi, la informació genètica de les seves plantes continua disponible per a les generacions futures, que potser podran tornar a plantar-lo en un món més estable. Alguns d’aquests magatzems han començat a compartir les seves dades amb escoles i universitats, perquè els joves entenguin que la riquesa natural del món també es pot guardar, catalogar i protegir.»
* **Level7 (12 anys, 241 paraules, expositiu d’àmbit escolar):**
  * «El sistema solar es va formar fa aproximadament quatre mil cinc-cents milions d’anys a partir d’un enorme núvol de gas i pols còsmica. La força de la gravetat va provocar que el centre d’aquell núvol es comprimís cada vegada més, fins que la temperatura i la pressió van ser tan altes que va néixer una estrella: el Sol. La matèria que va quedar al voltant va continuar girant en forma de disc, i a poc a poc els grans de pols van xocar entre ells i es van anar enganxant fins a formar cossos cada cop més grans. Així van aparèixer els vuit planetes principals, que els astrònoms divideixen en dos grups. Els planetes rocosos, com Mercuri, Venus, la Terra i Mart, són petits i tenen una superfície sòlida. Els gegants gasosos, com Júpiter i Saturn, i els gegants de gel, com Urà i Neptú, són molt més grans i estan formats sobretot per gasos i líquids. Al voltant de molts d’ells orbiten satèl·lits, alguns tan grans com planetes petits, i entre Mart i Júpiter s’estén un cinturó d’asteroides format per milers de roques de totes les mides. Més enllà de Neptú hi ha una regió freda i fosca on viuen els cometes, que de tant en tant s’acosten al Sol i mostren la seva cua lluminosa. Estudiar tots aquests objectes ajuda els científics a entendre com va començar tot i com podria ser el futur del nostre veïnat còsmic.»
* **Level8 (13 anys, 295 paraules, expositiu i argumentatiu):**
  * «La transició cap a fonts d’energia renovable representa un dels reptes tecnològics més urgents del segle XXI. L’esgotament progressiu dels combustibles fòssils, juntament amb els efectes del canvi climàtic, exigeix una reestructuració profunda del sistema energètic global que no es pot ajornar gaire més. L’energia solar i l’eòlica han abaratit els seus costos de manera espectacular durant l’última dècada, fins al punt que en moltes regions ja resulten més econòmiques que el carbó o el gas natural. No obstant això, la principal limitació continua sent la intermitència meteorològica: els panells no produeixen electricitat de nit ni els aerogeneradors quan el vent s’atura. Per compensar aquestes oscil·lacions, els enginyers desenvolupen sistemes avançats d’emmagatzematge, com les bateries d’ió liti de gran capacitat o la producció d’hidrogen verd, que permet guardar l’energia sobrant en forma de gas i recuperar-la quan la demanda augmenta. També és imprescindible modernitzar les xarxes de distribució perquè puguin gestionar milers de petits productors en lloc d’unes poques centrals grans. Alguns experts recorden, a més, que la tecnologia sola no resoldrà el problema si no va acompanyada d’un canvi en els hàbits de consum i d’una planificació política coherent. Els països que han avançat més ràpidament són precisament aquells que han combinat inversió pública, incentius per a les empreses i informació clara per als ciutadans. A les ciutats, per exemple, els edificis amb plaques a la teulada i les flotes de vehicles elèctrics redueixen la dependència del petroli i, alhora, milloren la qualitat de l’aire que respiren els veïns. Les escoles i els hospitals, que consumeixen energia a totes hores, són els primers candidats a instal·lar aquests sistemes. La transició energètica, en definitiva, no és només una qüestió d’enginyeria, sinó una transformació social que afecta la manera com produïm, ens desplacem i vivim.»
* **Level9 (14 anys, 306 paraules, divulgatiu amb tecnicismes):**
  * «El descobriment de l’estructura de doble hèlix de l’ADN, l’any 1953, va constituir una fita transcendental per a la biologia molecular. Aquesta molècula, present al nucli de gairebé totes les cèl·lules, està formada per dues cadenes antiparal·leles de nucleòtids que s’enrosquen l’una al voltant de l’altra com una escala de cargol. Cada esglaó de l’escala el formen dues bases nitrogenades complementàries unides per enllaços d’hidrogen: l’adenina sempre s’aparella amb la timina, i la guanina amb la citosina. Aquesta complementarietat explica com es copia la informació genètica abans de cada divisió cel·lular, ja que cada cadena serveix de motlle per construir la cadena oposada. La seqüència lineal de les bases funciona com un codi que les cèl·lules llegeixen per fabricar proteïnes, les molècules que executen pràcticament totes les funcions de l’organisme. Les mutacions que alteren aquesta seqüència poden modificar l’estructura de les proteïnes resultants i derivar en variacions adaptatives, que la selecció natural pot afavorir, o en patologies genètiques de gravetat diversa. Gràcies a les tècniques de seqüenciació actuals, els investigadors poden llegir genomes sencers en poques hores i comparar-los entre individus i espècies, cosa que ha revolucionat la medicina, la criminalística i l’estudi de l’evolució. Els primers models de la molècula es van construir amb làmines de metall i filferro, i encara avui es conserven en museus com a testimoni d’una època en què la biologia començava a parlar el llenguatge de la química i la física. Des de llavors, milers de laboratoris han ampliat aquell esquema inicial amb detalls que els seus descobridors no podien imaginar. Tanmateix, conèixer la seqüència no equival a comprendre-la: la regulació de l’expressió gènica, és a dir, quins gens s’activen en cada moment i en cada teixit, continua sent un dels camps més complexos i apassionants de la recerca contemporània, i cada resposta obtinguda sol generar noves preguntes.»
* **Level10 (15 anys, 318 paraules, periodístic i divulgatiu general, lèxic dens):**
  * «La interconnexió dels mercats financers globals exigeix una regulació transparent que prevengui crisis sistèmiques com la que va sacsejar l’economia mundial l’any 2008. Aleshores, la fallida d’unes quantes entitats bancàries, aparentment aïllades, va propagar-se en qüestió de dies a través d’una xarxa de productes derivats que pocs comprenien del tot, i va acabar afectant la feina i els estalvis de milions de persones que mai no havien sentit a parlar d’aquells instruments. Des d’aleshores, els organismes supervisors han imposat requisits de capital més estrictes, proves de resistència periòdiques i mecanismes de liquidació ordenada per a les entitats considerades massa grans per fer fallida. Tot i que la implementació d’aquestes mesures macroeconòmiques genera discrepàncies entre els analistes, que discuteixen si frenen el creixement o si, al contrari, el fan més sostenible, hi ha un consens creixent sobre la necessitat de modernitzar les infraestructures digitals del sector. Els sistemes de pagament instantani, les monedes digitals emeses pels bancs centrals i l’ús de la intel·ligència artificial per detectar fraus plantegen oportunitats evidents, però també riscos nous que la legislació vigent, pensada per a un món de sucursals i xecs, no sempre sap abordar. La ciberseguretat s’ha convertit, per tant, en una prioritat estratègica comparable a la solvència. Per aquest motiu, diverses organitzacions han impulsat programes d’educació financera adreçats a joves i adults, amb l’objectiu de reduir la distància entre els experts i la resta de la població. En un entorn en què una decisió presa a Singapur pot alterar en segons les cotitzacions de Frankfurt o de Nova York, la cooperació internacional entre reguladors deixa de ser una opció diplomàtica per esdevenir una condició indispensable per garantir l’estabilitat institucional davant la volatilitat dels fluxos de capital. Els ciutadans, finalment, haurien de poder entendre, almenys en les seves línies generals, com funciona el sistema que custodia els seus diners, perquè la confiança informada és el fonament més sòlid de qualsevol economia.»

### 3. Parpelleig (activity_blink)

* **Àrea principal:** Rendiment i Velocitat de Processament; secundària Competència Lingüística i
  Fonològica.
* **Mecànica:** presentació d’unitats sublèxiques (síl·labes, grups de lletres, pseudoparaules i
  paraules) amb segons per element descendents (field_seconds).
* **Regla de disseny:** mateix bastiment i alivi que la llista de text. Elements de 20 caràcters com
  a màxim a Level0 a Level2. Cada element fa servir només síl·labes de l’inventari admeses al nivell.
  El cicle obligatori «Síl·labes» (8 blocs, estructura-ca.md apartat 2) és un ús a part d’aquest
  tipus i no es descriu aquí.
* **Level0 (5 anys, 6 ítems, 3,0 s/element):** ["ma", "pe", "li", "so", "tu", "na"]
* **Level1 (6 anys, 8 ítems, 2,5 s/element):** ["nya", "llu", "ma" (alivi), "qui", "rra", "sol" (alivi), "ce", "ja"]
* **Level2 (7 anys, 8 ítems, 2,0 s/element):** ["pla", "plim" (pseudo), "plat", "pa" (alivi), "fra", "frou" (pseudo), "fred", "ma" (alivi)]
* **Level3 (8 anys, 10 ítems, 2,0 s/element):** ["trans", "trasc" (pseudo), "forts", "no" (alivi), "col·le", "pil·lo" (pseudo), "l’avi", "la" (alivi), "temps", "pa" (alivi)]
* **Level4 (9 anys, 10 ítems, 1,8 s/element):** ["plitó", "brasu", "sol" (alivi), "tracó", "frelu", "ma" (alivi), "clopi", "dratxe", "pa" (alivi), "grolís"]
* **Level5 (10 anys, 10 ítems, 1,5 s/element):** ["camiró", "tolina", "ma" (alivi), "purale", "mesota", "sol" (alivi), "baruda", "losame", "pa" (alivi), "pilaró"]
* **Level6 (11 anys, 12 ítems, 1,5 s/element):** ["transpori", "insmela", "sopa" (alivi), "cristalu", "frenasca", "ma" (alivi), "plamito", "tranxufa", "pa" (alivi), "blanpida", "grupento", "col·lima"]
* **Level7 (12 anys, 12 ítems, 1,2 s/element):** ["calimando", "pelitruca", "sopa" (alivi), "tucilanda", "matorida", "ma" (alivi), "furoclita", "terupinda", "pa" (alivi), "solimandra", "verostita", "galinxota"]
* **Level8 (13 anys, 12 ítems, 1,2 s/element):** ["obsolescència", "estupefacció", "pa" (alivi), "idiosincràsia", "convalescència", "ma" (alivi), "magnanimitat", "efervescència", "sol" (alivi), "reivindicació", "eutrofització", "imprescindible"]
* **Level9 (14 anys, 15 ítems, 1,0 s/element):** ["desarticulina" (pseudo), "inconstitucional", "sopa" (alivi), "pelicandorfa" (pseudo), "característica", "sol" (alivi), "desestabilina" (pseudo), "intercontinental", "ma" (alivi), "misericordiós", "multidisciplina", "pa" (alivi), "desproporcionat", "incompatibilitat", "despersonalina" (pseudo)]
* **Level10 (15 anys, 15 ítems, 1,0 s/element):** ["electroencefalograma", "metalingüístic", "ma" (alivi), "desproporcionadament", "interdisciplinarietat", "sol" (alivi), "inconstitucionalitat", "descontextualització", "sopa" (alivi), "internacionalització", "electrocardiografia", "pa" (alivi), "otorinolaringòleg", "desinstitucionalitzar", "anticonstitucional"]

### 4. Posició d’imatges (activity_image_position)

* **Àrea principal:** Memòria de Treball (Auditiva i Visual); secundària Funcions Executives i
  Atenció.
* **Mecànica:** exposició a grups d’imatges numerades i pregunta sobre la posició que ocupava la
  del nom que es mostra escrit.
* **Regla de disseny:** posicions extremes als nivells inicials, qualsevol a Level2 i centrals des
  de Level3; semblança visual i fonològica progressiva als nivells alts. Només imatges amb usable
  true al bloc ca del manifest (shine/content/images/manifest.json). A Level0 i Level1 només noms
  amb lectura catalana L0 o L1 (gat, sol, pa, mà, lluna, casa, taula, ànec, mula, puma, tapa, nina,
  pala, poma, meló, lupa, mapa, pila, molí, ona, pi, ala, nata, pipa, polo, moto, patí, sopa), perquè
  la lectura no sigui l’obstacle d’un exercici de memòria. Els noms es llegeixen sense article. Els
  grups de «mateixa síl·laba inicial» i de «parell mínim» es fan amb els noms catalans reals del
  manifest, no amb els castellans (ànec no comença per pa; got i gat, llet i llit, ós i os, cap i
  capa i copa són parells catalans).
* **Level0 (5 anys, 2 imatges per grup, 4 grups, categories diferents):**
  * *Grup 1:* [gat, poma] → «On era el gat?» (posició 1). *Grup 2:* [sopa, moto] → sopa (posició 1).
    *Grup 3:* [mapa, lluna] → lluna (posició 2). *Grup 4:* [pa, nina] → nina (posició 2).
* **Level1 (6 anys, 3 imatges per grup, 4 grups, categories diferents):**
  * *Grup 1:* [gos, pera, casa] → «On era la casa?» (posició 3, extrem).
* **Level2 (7 anys, 3 imatges per grup, 4 grups, categories diferents):**
  * *Grup 1:* [taula, ànec, got] → «On era l’ànec?» (posició 2, qualsevol).
* **Level3 (8 anys, 4 imatges per grup, 5 grups, mateixa categoria àmplia):**
  * *Grup 1:* [gat, gos, vaca, ànec] (animals) → «On era el gos?» (posició 2).
* **Level4 (9 anys, 4 imatges per grup, 5 grups):**
  * *Grup 1:* [lleó, ós, cavall, ovella] → «On era el cavall?» (posició 3, central).
* **Level5 (10 anys, 5 imatges per grup, 5 grups):**
  * *Grup 1:* [tigre, mico, porc, girafa, zebra] → «On era el porc?» (posició 3, central).
* **Level6 (11 anys, 5 imatges per grup, 6 grups, mateixa categoria estreta):**
  * *Grup 1:* [vaca, ovella, cabra, porc, gallina] (granja) → «On era la cabra?» (posició 3).
* **Level7 (12 anys, 6 imatges per grup, 6 grups, categoria estreta):**
  * *Grup 1:* [flauta, trompeta, clarinet, saxòfon, trombó, tuba] (instruments de vent) → «On era el
    saxòfon?» (posició 4).
* **Level8 (13 anys, 6 imatges per grup, 6 grups, semblants en forma o color):**
  * *Grup 1:* [gos, llop, guineu, coiot, hiena, linx] → «On era la guineu?» (posició 3).
* **Level9 (14 anys, 6 imatges per grup, 6 grups, mateixa síl·laba inicial):**
  * *Grup 1:* [pala, pa, patí, paper, pastís, pallasso] → «On era el patí?» (posició 3).
* **Level10 (15 anys, 6 imatges per grup, 6 grups, alta semblança ortogràfica i visual):**
  * *Grup 1:* [casa, capa, copa, cara, cap, caixa] → «On era la copa?» (posició 3).

### 5. Matriu de discriminació visual (activity_letter_matrix)

* **Àrea principal:** Processos Perceptius (Discriminació Visual i Auditiva); secundària Funcions
  Executives i Atenció.
* **Mecànica:** cancel·lació de tots els estímuls objectiu en una graella amb temps límit (sense
  límit a Level0 i Level1).
* **Regla de disseny:** 50 % de distractors confusos o mirall i 50 % de distractors neutres (o, s,
  m, t, a) per evitar la saturació visual; objectius repartits (almenys un a cada meitat i, a Level0
  a Level3, no més de 2 a la mateixa fila). Les lletres mirall (b, d, p, q, n, u, m, w) són
  universals i les matrius que només les fan servir es comparteixen amb el castellà (idiomes [es,
  ca]). Les grafies pròpies del català (l·l davant ll i l, ç davant c, s i z; ix davant xi; accent
  obert davant tancat) donen matrius només catalanes, marcades amb «Grafies diacrítiques i
  especials». Les cel·les se separen per espais, també l·l. Graelles generades amb llavor
  (shine/content/generadores): la dels exemples es pot regenerar.
* **Level0 (5 anys, matriu 3x4, objectiu «p», 3 objectius, sense temps, distractors sense trets
  en comú):**
  * s p p
  * a o a
  * a o o
  * p s s
* **Level1 (6 anys, matriu 4x5, objectiu «p», 4 objectius, sense temps, un distractor semblant):**
  * m p p s
  * s q o m
  * o q m p
  * o s q s
  * q m p o
* **Level2 (7 anys, matriu 4x6, objectiu «p», 5 objectius, 60 s, dos distractors semblants):**
  * b m t o
  * p q t p
  * t m s p
  * q q b s
  * o p p m
  * b b o s
* **Level2, variant catalana (matriu 4x6, objectiu «l·l», 5 objectius, 60 s, distractors ll, l,
  il, li; només ca):**
  * li l li l·l
  * l il l l·l
  * il l·l l ll
  * l·l li il l
  * ll il ll ll
  * il ll li l·l
* **Level3 (8 anys, matriu 5x6, objectiu «d», 6 objectius, 50 s, distractors mixtos b, p, q i
  neutres):**
  * b p s q b
  * m s b d o
  * p d q o m
  * o m m p d
  * s s d d q
  * d o b q p
* **Level3, variant catalana (matriu 5x6, objectiu «ç», 6 objectius, 50 s, distractors c, s, ss,
  z i neutres; només ca):**
  * o s ç e ss
  * e ss s o z
  * e c z c s
  * ç ss z ç o
  * e z c o ç
  * ç ç c s ss
* **Level4 (9 anys, matriu 6x7, objectiu «d», 7 objectius, 45 s, distractors b, q, p, g més
  neutres):**
  * s o s d d m
  * d q b d p t
  * g s m b b b
  * g p d m o q
  * q d p s g q
  * p t o m d t
  * p q o b g t
* **Level5 (10 anys, matriu 6x8, objectiu «n», 8 objectius, 35 s, miralls i rotacions u, m, w més
  neutres):**
  * t s n o a n
  * w o n m m o
  * n s n w u u
  * t u u o a n
  * n t w w m u
  * u w w t t a
  * s s o a o m
  * m s n a s m
* **Level6 (11 anys, matriu 5x10, objectiu «p», 8 objectius, 25 s, densa amb neutres):**
  * p d b d m
  * b a q p o
  * s p s t t
  * o d p s t
  * b g g p a
  * b a s g p
  * q a b q s
  * m g q q p
  * t o d p m
  * m o o m g
* **Level7 (12 anys, matriu 4x7 de síl·labes, objectiu «ix», 7 objectius, 40 s, inversions xi, is,
  si i neutres; grafia pròpia del català, només ca):**
  * ix ix in sol
  * is xi ix xi
  * is sol si xi
  * xi ix si ix
  * mar in ix sol
  * mar is is mar
  * si in si ix
* **Level8 (13 anys, matriu 4x8 de síl·labes, objectius «bra» i «dra», 8 objectius, 40 s,
  inversions i travades; compartible amb el castellà):**
  * pa pra dar pra
  * sol bar pa pra
  * sol bar sol pa
  * dar pra dra dar
  * dra bra mar dar
  * mar mar mar sol
  * bra pa bra dra
  * bra bar dra bar
* **Level9 (14 anys, matriu 3x7 de pseudoparaules, objectiu «bola», 6 objectius, 45 s, una lletra
  canviada o transposada):**
  * bloa casa pola
  * boal bola pola
  * pola boal bola
  * casa boal bola
  * bola bloa dola
  * bola bola casa
  * bloa dola dola
* **Level10 (15 anys, matriu 3x8 de paraules reals, objectius «casa» i «caça», 8 objectius, 45 s,
  parell s sorda i s sonora amb grafia ç):**
  * cosa cosa mar
  * mar caça caça
  * cara casa casa
  * caça cara sal
  * cosa capa cara
  * cara capa sal
  * sal casa caça
  * casa capa mar

### 6. Reordenament de síl·labes (activity_syllable_order)

* **Àrea principal:** Competència Lingüística i Fonològica; secundària Memòria de Treball
  (Auditiva i Visual).
* **Mecànica:** reconstrucció de paraules amb fitxes sil·làbiques desordenades, tocant-les en
  ordre; imatge d’ajuda als nivells inicials.
* **Regla de disseny:** sil·labació del IEC guardada explícita al lot (pan-ta-lons); cap altra
  permutació de les síl·labes pot formar una paraula del lèxic; des de Level5 s’afegeix una síl·laba
  sobrant i des de Level7 una de confusa (bra quan la paraula porta bar). Les imatges surten del
  manifest (clau imagen = slug) i la paraula té el nom i la sil·labació del bloc ca. Les paraules amb
  ela geminada queden fora fins que es decideixi com es representa a la fitxa (apartat 0).
* **Level0 (5 anys, 4 paraules de 2 síl·labes CV, amb imatge):**
  * [mu-la] → fitxes ["la", "mu"] (imatge: mula). També so-pa, pa-la, ma-pa.
* **Level1 (6 anys, 5 paraules de 2 a 3 síl·labes, amb imatge):**
  * [ga-lli-na] → fitxes ["na", "ga", "lli"] (imatge: gallina). També po-ma, llu-na, co-nill, ca-sa.
* **Level2 (7 anys, 5 paraules de 3 síl·labes amb travades, amb imatge):**
  * [gra-no-ta] → fitxes ["ta", "gra", "no"] (imatge: granota). També es-tre-lla, co-co-dril,
    mot-xi-lla, lli-bre-ta.
* **Level3 (8 anys, 6 paraules de 3 a 4 síl·labes, complexes i hiats, pista opcional):**
  * [a-vi-ó] → fitxes ["ó", "a", "vi"]. També pi-a-no, ca-mi-ó, cons-truc-ció, gà-bi-a, trans-por-tar.
* **Level4 (9 anys, 6 paraules de 4 síl·labes, sense sobrants, pista):**
  * [bi-ci-cle-ta] → fitxes ["cle", "bi", "ta", "ci"]. També or-di-na-dor, car-re-te-ra,
    pas-ta-na-ga, to-va-llo-la, sa-mar-re-ta.
* **Level5 (10 anys, 6 paraules de 4 síl·labes, 1 sobrant, pista):**
  * [e-lèc-tri-ca] → fitxes ["tri", "e", "tra", "ca", "lèc"] (sobrant: tra). També ca-len-da-ri
    (dra), te-le-vi-sor (sol), xo-co-la-ta (xa), pa-pa-llo-na (lla), ca-put-xe-ta (txa).
* **Level6 (11 anys, 6 paraules de 5 síl·labes, 1 sobrant, sense imatge):**
  * [u-ni-ver-si-tat] → fitxes ["ver", "u", "tat", "si", "sol", "ni"] (sobrant: sol). També
    te-le-vi-si-ó (mar), e-lec-tri-ci-tat (tra), a-gri-cul-tu-ra (gra), bi-bli-o-te-ca (pa),
    ma-te-mà-ti-ques (sol).
* **Level7 (12 anys, 6 paraules de 5 síl·labes, 1 sobrant confusa):**
  * [em-bar-ca-ci-ó] → fitxes ["ci", "em", "bra", "ó", "bar", "ca"] (sobrant confusa: bra). També
    tem-pe-ra-tu-ra (pre), im-por-tàn-ci-a (pro), o-por-tu-ni-tat (tro), cal-cu-la-do-ra (cla),
    con-ver-sa-ci-ó (vre).
* **Level8 (13 anys, 6 paraules de 5 a 6 síl·labes de baixa freqüència, 1 sobrant confusa):**
  * [me-ta-mor-fo-si] → fitxes ["fo", "me", "fro", "si", "ta", "mor"] (sobrant: fro). També
    fo-to-sín-te-si (set), ar-que-o-lo-gi-a (gla), es-tra-tos-fe-ra (tar), trans-pa-rèn-ci-a (tras),
    ex-tra-or-di-na-ri (dri).
* **Level9 (14 anys, 6 paraules de 6 síl·labes de baixa freqüència, 2 sobrants confuses):**
  * [res-pon-sa-bi-li-tat] → fitxes ["bi", "res", "tras", "tat", "pon", "li", "bli", "sa"]
    (sobrants: tras, bli). També in-ter-na-ci-o-nal (tre, ral), e-lec-tro-do-mès-tic (tro, dro),
    mi-cro-or-ga-nis-me (cor, gra), ex-pe-ri-men-ta-ció (pre, tac), co-mu-ni-ca-ci-ó (ac, nu).
* **Level10 (15 anys, 6 paraules de 6 a 7 síl·labes de lèxic acadèmic, 2 sobrants):**
  * [in-ter-dis-ci-pli-na-ri] → fitxes ["ci", "in", "pil", "ter", "ri", "pli", "na", "dis", "tras"]
    (sobrants: pil, tras). També des-con-tex-tu-a-lit-zar (tes, tra), i-di-o-sin-crà-si-a (car,
    ins), cons-ti-tu-ci-o-nal (tis, tra), he-te-ro-ge-ne-ï-tat (gre, nat), mi-cro-bi-o-lo-gi-a (cor,
    gla).

### 7. Segmentació lèxica (activity_word_split)

* **Àrea principal:** Competència Lingüística i Fonològica; secundària Rendiment i Velocitat de
  Processament.
* **Mecànica:** inserció d’espais en frases escrites sense espais.
* **Regla de disseny:** frases en minúscules, sense puntuació ni xifres, totes les paraules dins
  del lèxic i la freqüència del nivell, sense noms propis i sense ambigüitat de partició fins a
  Level6. Dificultat progressiva per les unions gramaticals: articles i preposicions (Level2),
  apostrofació i contraccions (Level3 i Level4: l’avi, d’un, al, del, pel), pronoms febles davant
  del verb (Level5: li ho, se’n), enclítics (Level6: posa’t, mira’l, deixa’m; els de guió esperen
  l’importador), parells que es confonen (des de Level7: si no / sinó, per què / perquè, tan bé /
  també), coordinades (Level9) i subordinades (Level10). L’apòstrof forma part de la paraula: «l’avi»
  és una sola paraula sense espai.
* **Level0 (5 anys):** *No recomanat: encara no llegeix frases.*
* **Level1 (6 anys, 4 frases de 3 paraules):**
  * Amalgamat: elsolpuja → Solució: el sol puja. També la nena canta, el gat juga, el gos corre.
    (surt i dorm són de Level2: coda rt i rm, excepció dels monosíl·labs freqüents.)
* **Level2 (7 anys, 5 frases de 4 a 5 paraules):**
  * Amalgamat: elgatmenjapa → el gat menja pa. També el meu tren és blau, la nena va a casa, el pare
    i jo juguem, el gos salta molt.
* **Level3 (8 anys, 5 frases de 5 a 6 paraules, apostrofació i contraccions):**
  * Amalgamat: l’avillegeixuncontealjardí → l’avi llegeix un conte al jardí. També
    avui i demà anirem a jugar, la mare porta pa del forn, d’un salt va pujar al llit, el nen vol
    anar al parc.
* **Level4 (9 anys, 5 frases de 6 a 7 paraules, contraccions al, del, pel):**
  * Amalgamat: anemalparcdelcostatdecasa → anem al parc del costat de casa. També el gos corre pel
    camí del bosc, la pilota ha caigut del balcó, demà pujarem al cim de la muntanya, el pare torna
    del mercat amb fruita.
* **Level5 (10 anys, 6 frases de 7 a 8 paraules, pronoms febles davant del verb):**
  * Amalgamat: lamarelihodonacadamatí → la mare li ho dona cada matí. També el mestre ens la va
    explicar molt bé, jo te la porto després de dinar, ella se’n va anar sense dir res, els nens us
    el deixaran al pati, nosaltres hi anem cada dissabte al matí.
* **Level6 (11 anys, 6 frases de 8 a 9 paraules, enclítics):**
  * Amalgamat: posa’tlesbotesimira’labansdesortir → posa’t les botes i mira’l abans de sortir. També
    deixa’m veure què has fet amb el dibuix, compra’n dos i porta’ls a casa de l’àvia, explica’ns el
    conte del llop abans d’anar a dormir, emporta’t el paraigua perquè plourà a la tarda, renta’t
    les mans abans de seure a taula.
* **Level7 (12 anys, 6 frases de 9 a 10 paraules, si no / sinó, per què / perquè, tan bé / també):**
  * Amalgamat: novindràsinoacabalafeinaatemps → no vindrà si no acaba la feina a temps. També no ha
    vingut perquè estava malalt tota la setmana, no sé per què no ha vingut avui a classe, ho has
    fet tan bé que jo també vull jugar, no volia aigua sinó un got de llet calenta, han jugat tan bé
    que tots els han aplaudit.
* **Level8 (13 anys, 6 frases de 10 a 11 paraules, ídem amb vocabulari menys freqüent):**
  * Amalgamat: nosabíemperquèelmuseutancavatanaviatelsdimarts → no sabíem per què el museu tancava
    tan aviat els dimarts. També la bibliotecària no volia soroll sinó una mica de silenci, si no
    plou aquesta setmana nosaltres regarem l’hort cada tarda, el científic va explicar per què els
    volcans entren en erupció, ens va dir que també vindria si no feia massa fred, va escriure tan
    bé la redacció que tots la van llegir.
* **Level9 (14 anys, 6 frases d’11 a 12 paraules, oracions coordinades):**
  * Amalgamat: l’estudiantvaacabarlafeinaielprofessorlavacorregir → l’estudiant va acabar la feina
    i el professor la va corregir. També la pluja va parar i els nens van sortir al pati, el tren
    arribava tard però els viatgers esperaven amb molta paciència, vam collir les pomes i després
    les vam guardar al celler, la mare cuinava i el pare parava taula mentre nosaltres jugàvem, no
    tenien pressa ni gana i van passejar fins al capvespre.
* **Level10 (15 anys, 6 frases de 12 a 14 paraules, oracions subordinades):**
  * Amalgamat: encaraquesabéslarespostanodiriaresperquènolihohandemanat → encara que sabés la
    resposta no diria res perquè no li ho han demanat. També quan la biblioteca tanqui les portes
    els estudiants hauran d’anar a estudiar a casa, si haguéssim sortit abans hauríem arribat a
    temps per veure la pel·lícula, el llibre que em vas deixar m’ha agradat tant que el llegiré de
    nou, tot i que plovia molt vam decidir sortir perquè volíem veure el mar, la mestra va explicar
    que els rius neixen on es fon la neu.

### 8. Repetició ràpida de paraula (activity_rapid_repetition)

* **Àrea principal:** Rendiment i Velocitat de Processament; secundària Competència Lingüística i
  Fonològica.
* **Mecànica:** la paraula es mostra, el tutor prem Començar, la paraula s’amaga i l’alumne la
  repeteix en veu alta tantes vegades com pot mentre el tutor compta els tocs; mètrica: repeticions
  en temps fix (ritme), sense encerts ni errors.
* **Regla de disseny:** totes les paraules d’una activitat comparteixen el grup objectiu (estructura
  sil·làbica i, si escau, sonoritat), que és el que s’etiqueta (almenys una etiqueta obligatòria);
  segons per paraula iguals dins de l’activitat; des de Level4 una o dues pseudoparaules; més de 12
  caràcters ja es llegeix pitjor en gran, cosa que es té en compte als nivells alts. A Level0 el
  tutor modela la paraula abans de començar.
* **Level0 (5 anys, 4 paraules, 10 s; bisíl·labes CV amb m, p, l, s):** ["mapa", "sopa", "pala", "lupa"]
* **Level1 (6 anys, 5 paraules, 10 s; mixtes CVC freqüents):** ["gat", "sol", "cap", "nas", "llit"]
* **Level2 (7 anys, 5 paraules, 10 s; travades amb l i r):** ["plat", "tren", "flor", "drac", "globus"]
* **Level3 (8 anys, 5 paraules, 15 s; complexes i hiats, 3 a 4 síl·labes):** ["transport", "instrument", "piano", "camió", "construcció"]
* **Level4 (9 anys, 6 paraules, 15 s; 4 síl·labes, 1 pseudoparaula):** ["bicicleta", "tovallola", "ordinador", "pastanoli" (pseudo), "samarreta", "cremallera"]
* **Level5 (10 anys, 6 paraules, 15 s; 4 a 5 síl·labes, 2 pseudoparaules):** ["electricitat", "temperatura", "laboratori", "comunastre" (pseudo), "agricultura", "tempolira" (pseudo)]
* **Level6 (11 anys, 6 paraules, 15 s; compostes i poc freqüents, 2 pseudoparaules):** ["biodiversitat", "paracaigudes", "extraordinari", "rentaflocs" (pseudo), "subterrani", "netejabros" (pseudo)]
* **Level7 (12 anys, 6 paraules, 20 s; vocabulari acadèmic, 2 pseudoparaules):** ["fotosíntesi", "metamorfosi", "termodinàmica", "ecosistrol" (pseudo), "immunologia", "fotosimbra" (pseudo)]
* **Level8 (13 anys, 6 paraules, 20 s):** ["espeleologia", "neurotransmissor", "epistemologia", "espectrofalma" (pseudo), "paleontologia", "desoxiplanta" (pseudo)]
* **Level9 (14 anys, 6 paraules, 20 s):** ["otorinolaringòleg", "descontextualització", "internacionalització", "desproporclau" (pseudo), "contrarevolucionari", "interdiscipro" (pseudo)]
* **Level10 (15 anys, 6 paraules, 20 s):** ["infraestructura", "jurisprudència", "desestabilització", "infrastrucro" (pseudo), "intergovernamental", "multidisclipra" (pseudo)]

## 9. Què ha de revisar l’expert

- La freqüència i l’edat de les paraules de Level0 a Level3 (sobretot nyola, plim, trum, trosp,
  insfa, pil·lo com a pseudoparaules; i si gol, fred, forts, temps i l’avi són del nivell on són).
- Els textos de lectura en veu alta: tema, longitud i frase mitjana per nivell, i si cal un
  registre més infantil a Level4 i Level5.
- Les pseudoparaules de Level4 en endavant (que no s’assemblin massa a una paraula real ni siguin
  impronunciables) i la proporció d’alivi.
- La representació de l’ela geminada a les fitxes de síl·labes (apartat 0) i si els enclítics amb
  guió han d’entrar a Level6 (cal canviar l’importador).
- Els grups de posició d’imatges de Level8 a Level10 (semblança visual real entre les
  il·lustracions catalanes i parells mínims disponibles al banc).
