# Revisió: tanda 9, Level9 (castellà i català)

Estat: **pendent de revisió**. Els lots són a `shine/content/` i estan importats **sense publicar**; es publiquen quan el grup els aprovi.

Com revisar (protocol E12, `plans/contenido/encarrecs/E12-protocol-revisio.md`): a **Correcta** poseu `sí`, `no` o `amb canvis`, i a **Comentari** el canvi exacte. Criteri únic: un nen de l'edat del nivell (Level9 = 14 anys, 3r d'ESO) sense dificultats valoraria l'activitat "Bé així". Els registres amb dos idiomes es mostren una sola vegada (noms en català i, entre claudàtors, en castellà).

Contingut: 36 activitats de text i matriu importades sense publicar (18 per idioma) i la posició d'imatges de Level9 i Level10 (6 per nivell i idioma, amb els grups definitius de l'E09), que s'importarà quan es generin les 25 imatges que falten (tirada del 2026-10-30). Funcions Executives ja té les 3 de Level9 aprovades. Tot passa la comprovació d'estructura, la porta lèxica (Level9 sense límit de freqüència) i la validació de l'importador. Cada activitat va agrupada per un so i una dificultat.

## Decisions que us demanem de validar

1. **Dues síl·labes sobrants** a "ordena les síl·labes" ("Sobran dos sílabas." / "Hi ha dues síl·labes que sobren."), com diuen el catàleg (6.2) i el prompt 05 per a Level9: la primera canvia la grafia del grup de so i la segona inverteix una síl·laba. En castellà, les de s/z/c (se/ce, si/ci, sión/ción) només sonen igual amb seseo.
2. **Matrius de Level9**: paraula real entre pseudoparaules que canvien una lletra (mirall, rotació o grafia) o intercanvien dues lletres veïnes (com bloa al catàleg). En català no hi ha matriu de m-w (la w no és pròpia de l'ortografia catalana) i n'hi ha una de grafies (feliç entre felic, felíç, fleiç). Títol: "Encuentra todas las palabras «dibujo»" / "Troba totes les paraules dubte".
3. **Llistes i parpelleig de 15 elements** (8 paraules, 3 pseudoparaules, 4 alleujaments). Algunes paraules i pseudoparaules passen de 12 caràcters (polideportivo, perplunturatis), més del que hi cap en lletra grossa al mòbil.
4. **Segmentació**: aparte / a parte, debajo / de bajo, sinnúmero / sin número, conque / con que, quienquiera / quien quiera, afín / a fin; migdia / mig dia, tampoc / tan poc, demà / de mà, i pronoms combinats amb en (te’n, ens n’, us n’, li’n, me’n, se n’). "Quien quiera que llegue primero" es pot llegir de manera forçada.
5. **Lectures expositives**: Ada Lovelace (la consideració de "primera programadora" va atribuïda) i Alfred Wegener (deriva dels continents).
6. **Pseudoparaules d'altres grups del banc** quan el banc de Level9 no té el grup de so (f, d, g, j/g en català).
7. **Posició d'imatges de Level9 i Level10**: 12 activitats per idioma muntades amb els 36 grups per nivell de l'E09 que vau aprovar, sense cap imatge repetida dins d'una activitat.

## Ordena les síl·labes: silabas-es-level9-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-ES-L09-LIN-001 | Level9 | Ordena las sílabas | ne-ce-sa-ria-men-te · e-lec-tri-fi-ca-ción · es-ta-ble-ci-mien-to · or-ga-ni-za-cio-nes · ve-ro-si-mi-li-tud · ci-ber-se-gu-ri-dad | | |
| SIL-ES-L09-LIN-002 | Level9 | Ordena las sílabas | ge-ne-ra-cio-na-les · en-ve-je-ci-mien-to · ar-que-o-ló-gi-co · le-gí-ti-ma-men-te · re-fri-ge-ra-do-res · di-gi-ta-li-za-ción | | |

## Segmentació lèxica: segmentacion-es-level9-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-ES-L09-LIN-001 | Level9 | Separa las palabras | la técnica dejó aparte las piezas viejas y arregló el motor · la entrenadora convocó a parte del equipo y los demás descansaron · los cables pasan por debajo del suelo y nadie los ve · el instituto usa bombillas de bajo consumo y ahorra mucha energía · el telescopio detectó un sinnúmero de galaxias y los astrónomos las catalogaron · la cartera buscó un portal sin número y tardó en encontrarlo | | |
| SEG-ES-L09-LIN-002 | Level9 | Separa las palabras | el museo cierra a las seis conque tenemos que darnos prisa · basta con que riegues las plantas y quites las hojas secas · quienquiera que llegue primero abrirá el laboratorio y encenderá los ordenadores · quien quiera participar puede apuntarse hoy y el taller empieza el lunes · la química es una ciencia afín a la física y comparten métodos · entrenamos pronto a fin de evitar el calor y rendimos más | | |

## Llista de text: lista-es-level9-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-ES-L09-LIN-001 | Level9 | Palabras muy largas con n | nanotecnología · nifletecundan · pino · intercontinental · inimaginable · neclemonisben · nudo · incompatibilidad · inconmensurable · loma · nulquenspradilirru · ininterrumpido · lodo · denominaciones · independientemente | | |
| LIS-ES-L09-LIN-002 | Level9 | Tecnicismos muy largos con t | telecomunicación · termodinámica · pasa · triroblaliscu · trigonometría · duna · tradicionalmente · trolipipresdin · autobiográfico · polo · teleobjetivo · tasnugosdrifagui · lomo · retroalimentación · termoeléctrica | | |
| LIS-ES-L09-VEL-001 | Level9 | Lee rápido frases de ciencia, arte y técnica | Las turbinas eólicas usan la fuerza del viento para generar electricidad sin quemar nada ni echar humo. · Durante una carrera de fondo, los pulmones absorben más oxígeno y el corazón bombea más sangre. · Papá pela la patata. · La impresora tridimensional crea objetos depositando capas de plástico, una sobre otra, hasta completar la pieza. · Algunas ciudades han convertido viejas vías de tren en paseos verdes, recuperando así espacios que estaban abandonados. · Unos defienden que los deberes en vacaciones refuerzan lo aprendido, mientras otros creen que descansar también educa. · Dame la tapa. · Muchos pintores antiguos hacían sus propios colores moliendo minerales y mezclando el polvo obtenido con aceite o huevo. · Los robots submarinos exploran los fondos oceánicos y envían imágenes que son analizadas después por los científicos. · La pata nada. · Los satélites meteorológicos observan las nubes desde el espacio y ayudan a predecir la llegada de tormentas. · La restauradora limpió el cuadro con disolventes suaves y recuperó los colores que el barniz había oscurecido. · Toma la lima. · Un grupo de estudiantes ha diseñado un sistema que recoge el agua de lluvia para regar el huerto. · La invención del microscopio permitió la observación de seres diminutos que hasta entonces habían pasado desapercibidos. | | |

## Parpelleig: blink-es-level9-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-ES-L09-VEL-001 | Level9 | Palabras largas con s | sensibilidad · ascoslesosqui · lupa · sistemático · satisfactorio · mi · frislaplisosmo · simplificado · semicírculo · nata · solidaridad · brisjimesisgril · te · sofisticado · simultáneo | | |
| BLK-ES-L09-VEL-002 | Level9 | Palabras largas con r | laboratorio · tapa · fugrelordapil · literatura · meteorito · dama · embarcadero · pelerpatrajis · aventurero · lata · originario · ornitólogo · lablopulgrore · moda · paracaídas | | |
| BLK-ES-L09-VEL-003 | Level9 | Palabras largas con d | dedicatoria · diplomático · pomo · dronfeclandurli · desordenado · diferenciado · u · guidomancundra · deportividad · desagradable · lima · clodusprechonu · deshidratado · mula · domesticado | | |

## Repetició ràpida: repeticion-es-level9-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-ES-L09-VEL-001 | Level9 | Repite rápido: palabras largas con p | polideportivo · perplunturatis · paleontólogo · puma · posiltresibre · perpendicular (20 s) | | |

## Lectura en veu alta: lectura-es-level9-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-ES-L09-VEL-001 | Level9 | Ada Lovelace | Ada Lovelace fue una matemática británica que colaboró con Charles Babbage, el inventor que diseñó una calculadora mecánica llamada máquina analítica. Aunque aquella máquina nunca llegó a construirse, Lovelace escribió unas notas con un algoritmo que permitía calcular una serie de números. Por ese trabajo, muchos especialistas la consideran la primera programadora de la historia. Además, intuyó que esas máquinas podrían manipular símbolos y hasta componer música, una idea que anticipaba la informática actual. (30 s) | | |

## Matriu de discriminació visual: matriz-es-level9-v1.json (6 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-ES-L09-PER-001 | Level9 | Encuentra todas las palabras «dibujo» | objectiu dibujo, 3×7, 1 rondes; ronda 1: bibujo dibjuo dibjuo didujo bibujo bibujo bibujo dibujo dibjuo dibujo didujo dibujo didujo bibujo dibujo didujo didujo dibujo dibjuo dibujo dibjuo | | |
| MAT-ES-L09-PER-002 | Level9 | Encuentra todas las palabras «papel» | objectiu papel, 3×7, 1 rondes; ronda 1: paqel paqel papel papel paple paple paqel papel papel qapel papel qapel paqel qapel paple paple paple qapel papel paqel qapel | | |
| MAT-ES-L09-PER-003 | Level9 | Encuentra todas las palabras «pulpo» | objectiu pulpo, 3×7, 1 rondes; ronda 1: bulpo bulpo plupo bulpo pulpo bulpo bulpo pulbo pulbo plupo pulpo plupo plupo pulpo pulpo plupo pulbo pulbo pulpo pulbo pulpo | | |
| MAT-ES-L09-PER-004 | Level9 | Encuentra todas las palabras «dado» | objectiu dado, 3×7, 1 rondes; ronda 1: daqo daod qado daod daqo daod daod daqo dado dado daqo qado qado dado dado qado dado daqo dado qado daod | | |
| MAT-ES-L09-PER-005 | Level9 | Encuentra todas las palabras «mundo» | objectiu mundo, 3×7, 1 rondes; ronda 1: mnndo mudno muudo mudno mundo mudno mudno mundo mnndo mnndo mnndo muudo muudo mundo muudo muudo mundo mundo mudno mnndo mundo | | |
| MAT-ES-L09-PER-006 | Level9 | Encuentra todas las palabras «mimo» | objectiu mimo, 3×7, 1 rondes; ronda 1: wimo wimo mimo miom wimo miwo mimo miom miom wimo mimo miom wimo mimo miwo miwo miom miwo mimo mimo miwo | | |

## Ordena les síl·labes: silabas-ca-level9-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-CA-L09-LIN-001 | Level9 | Ordena les síl·labes | cir-cum-fe-rèn-ci-a · gra-vi-ta-ci-o-nal · ve-te-ri-nà-ri-a · ci-ne-ma-to-grà-fic · es-pe-ci-fi-ci-tat · com-pe-ti-ti-vi-tat | | |
| SIL-CA-L09-LIN-002 | Level9 | Ordena les síl·labes | me-to-do-lo-gi-a · tri-go-no-me-tri-a · e-lec-tro-mag-nè-tic · in-du-men-tà-ri-a · en-tre-ma-li-a-da · com-pu-ta-ci-o-nal | | |

## Segmentació lèxica: segmentacion-ca-level9-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-CA-L09-LIN-001 | Level9 | Separa les paraules | al migdia el sol escalfa molt i els gats busquen l’ombra · l’excursió va durar mig dia i vam tornar a casa cansats · el meu germà no ha vist la pel·lícula i jo tampoc · anit vam dormir tan poc i avui tenim molta son a classe · demà sortim de viatge i encara no hem preparat les maletes · la conductora posa el fre de mà i apaga el motor | | |
| SEG-CA-L09-LIN-002 | Level9 | Separa les paraules | tenim molta fruita al rebost i te’n pots endur una bossa · l’àvia sap moltes llegendes i cada estiu ens n’explica alguna de nova · la biblioteca té llibres nous i la bibliotecària us n’ha reservat tres · la veïna vol tomàquets i el pare li’n porta una cistella plena · vam visitar el castell fa anys però encara me’n recordo bé · la professora ha canviat l’horari i ningú no se n’ha adonat | | |

## Llista de text: llista-ca-level9-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-CA-L09-LIN-001 | Level9 | Paraules llargues amb l | vulnerabilitat · lamiflensaco · pa · multiplicació · sostenibilitat · mula · rasfoquepletil · localització · o · imparcialitat · elaboració · veclamiflabit · nina · compatibilitat · funcionalitat | | |
| LIS-CA-L09-LIN-002 | Level9 | Paraules llargues amb g i j | biològicament · e · gedenabiposc · regeneració · genealogia · sopa · majoritàriament · janaguipamami · oxigenació · la · generacional · geogràficament · safagejoqui · pila · justificació | | |
| LIS-CA-L09-VEL-001 | Level9 | Paraules d’estudi amb c i qu | característica · modificació · u · científicament · econòmicament · comunicativa · mapa · equivalència · matemàticament · no · qualificació · arquitectònica · moto · cooperativa · acadèmicament | | |

## Parpelleig: blink-ca-level9-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-CA-L09-VEL-001 | Level9 | Paraules llargues amb f | filosofia · fenabrolafis · a · fotografia · fantàsticament · lupa · mefarrilobas · magníficament · favorablement · so · ferroviari · fosatxagurva · pota · uniformitat · efectivament | | |
| BLK-CA-L09-VEL-002 | Level9 | Paraules llargues amb d | dedicació · i · decididament · drapucrotone · delicadesa · pala · diàriament · admiració · divatolsivaç · sol · dramàticament · deliciosa · tela · ladequessefo · editorial | | |
| BLK-CA-L09-VEL-003 | Level9 | Paraules llargues amb g i gu | investigador · negativament · u · soguifodata · regularitat · nena · agrupació · sebajoguetom · orgullosament · figurativa · la · gastronòmica · maloridrigui · sopa · gratuïtament | | |

## Repetició ràpida: repeticion-ca-level9-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-CA-L09-VEL-001 | Level9 | Repeteix ràpid: paraules llargues amb ll | meravellosa · llerdusepabe · rellotgeria · nina · bomogofullot · senzillament (20 s) | | |

## Lectura en veu alta: lectura-ca-level9-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-CA-L09-VEL-001 | Level9 | La deriva dels continents | El meteoròleg Alfred Wegener va observar que les costes de l’Amèrica del Sud i de l’Àfrica encaixen com un trencaclosques. També va comprovar que a banda i banda de l’Atlàntic hi havia fòssils de les mateixes espècies. Per això va proposar que tots els continents havien estat units i que es van anar separant lentament. Molts geòlegs van rebutjar la idea, però mig segle després la tectònica de plaques va demostrar que tenia raó. (30 s) | | |

## Matriu de discriminació visual: matriz-ca-level9-v1.json (6 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-CA-L09-PER-001 | Level9 | Troba totes les paraules dubte | objectiu dubte, 3×7, 1 rondes; ronda 1: dudte bubte dubte dubte dudte bubte dudte bubte dubte dutbe dubte dutbe bubte dubte dudte dutbe bubte dutbe dubte dudte dutbe | | |
| MAT-CA-L09-PER-002 | Level9 | Troba totes les paraules porquet | objectiu porquet, 3×7, 1 rondes; ronda 1: porquet qorquet porquet proquet qorquet porpuet proquet porquet porpuet qorquet proquet porpuet porquet porpuet qorquet porquet proquet porquet proquet qorquet porpuet | | |
| MAT-CA-L09-PER-003 | Level9 | Troba totes les paraules pebre | objectiu pebre, 3×7, 1 rondes; ronda 1: pebre pepre bebre pebre bebre peber peber pepre pebre pebre peber pepre pepre pebre bebre bebre pepre peber peber bebre pebre | | |
| MAT-CA-L09-PER-004 | Level9 | Troba totes les paraules quadern | objectiu quadern, 3×7, 1 rondes; ronda 1: quadern quaqern qaudern quaqern quadern duadern quaqern qaudern duadern duadern qaudern duadern quadern qaudern quadern qaudern quaqern quadern quadern duadern quaqern | | |
| MAT-CA-L09-PER-005 | Level9 | Troba totes les paraules menut | objectiu menut, 3×7, 1 rondes; ronda 1: menut meuut menut meuut mennt meunt meuut menut meuut meunt menut meunt menut meunt mennt mennt meunt mennt meuut menut mennt | | |
| MAT-CA-L09-PER-006 | Level9 | Troba totes les paraules feliç | objectiu feliç, 3×7, 1 rondes; ronda 1: feliç felíç fleiç fleiç feliç felic felíç felic feliç fleiç felic fleiç felíç feliç felíç felic fleiç feliç felíç felic feliç | | |

## Posició d'imatges: imagenes-es-level9-10-v1.json (12 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-ES-L10-MEM-001 | Level10 | ¿Dónde estaba? | grup 1 (pos. 3): cono, nata, coco, lata, mono, lana; grup 2 (pos. 2): bollo, bol, bolso, sol, sal, pollo; grup 3 (pos. 4): tapa, taza, mesa, pesa, pera, mapa; grup 4 (pos. 3): pipa, pila, zorro, gorro, piña, gorra; grup 5 (pos. 5): rama, casa, caña, cama, caja, capa; grup 6 (pos. 2): carta, tarta, luna, lupa, carpa, cuna | | |
| IMG-ES-L10-MEM-002 | Level10 | ¿Dónde estaba? | grup 1 (pos. 2): bota, pila, boca, pala, palo, boya; grup 2 (pos. 3): topo, zorro, copo, toro, gorro, gorra; grup 3 (pos. 4): cara, caña, casa, copa, capa, caja; grup 4 (pos. 2): pavo, hueso, gato, queso, huevo, pato; grup 5 (pos. 3): bol, tuba, sol, cubo, sal, tubo; grup 6 (pos. 5): paleta, maceta, taza, mapa, maleta, tapa | | |
| IMG-ES-L10-MEM-003 | Level10 | ¿Dónde estaba? | grup 1 (pos. 2): capa, polo, tapa, taza, pelo, palo; grup 2 (pos. 4): copo, cono, zorro, coco, gorra, gorro; grup 3 (pos. 5): lata, lana, bolsa, bollo, bolso, nata; grup 4 (pos. 2): mesa, oso, pasa, ojo, pesa, ajo; grup 5 (pos. 3): piña, pipa, carta, tarta, pila, carpa; grup 6 (pos. 3): tubo, cubo, mago, mono, tuba, mano | | |
| IMG-ES-L10-MEM-004 | Level10 | ¿Dónde estaba? | grup 1 (pos. 2): zorro, pollo, gorra, bollo, gorro, bolso; grup 2 (pos. 3): caña, cara, caja, capa, mapa, cama; grup 3 (pos. 5): mesa, pesa, pasa, cono, mono, moto; grup 4 (pos. 3): huevo, queso, topo, hueso, copo, coco; grup 5 (pos. 4): pala, gato, pelo, pavo, palo, pato; grup 6 (pos. 2): bota, sal, boca, boya, bol, sol | | |
| IMG-ES-L10-MEM-005 | Level10 | ¿Dónde estaba? | grup 1 (pos. 2): caja, cama, caña, casa, cara, pasa; grup 2 (pos. 3): pavo, gato, pato, piña, pala, pila; grup 3 (pos. 2): tapa, taza, mapa, bolso, bollo, pollo; grup 4 (pos. 5): cono, huevo, queso, moto, mono, hueso; grup 5 (pos. 3): nata, lata, lana, bota, boca, boya; grup 6 (pos. 4): loro, ajo, toro, lobo, ojo, oso | | |
| IMG-ES-L10-MEM-006 | Level10 | ¿Dónde estaba? | grup 1 (pos. 2): sol, copo, topo, bol, copa, sal; grup 2 (pos. 3): hueso, luna, queso, huevo, lupa, lana; grup 3 (pos. 4): loro, lobo, pera, pasa, pesa, toro; grup 4 (pos. 3): casa, palo, cama, polo, cara, pala; grup 5 (pos. 5): pato, boca, boya, pavo, gato, bota; grup 6 (pos. 2): tuba, carpa, cubo, carta, tubo, tarta | | |
| IMG-ES-L09-MEM-001 | Level9 | ¿Dónde estaba? | grup 1 (pos. 2): casco, candelabro, candado, caballito, campana, cascabel; grup 2 (pos. 3): macarrones, mango, martillo, mantel, manzana, mariquita; grup 3 (pos. 2): palo, pandereta, paleta, patata, pavo, pasa; grup 4 (pos. 5): cabaña, camello, caja, cazuela, castañuelas, castaña; grup 5 (pos. 4): caracol, cacahuete, canguro, castor, caballo, capibara; grup 6 (pos. 3): bombón, botón, bombilla, bollo, boya, bol | | |
| IMG-ES-L09-MEM-002 | Level9 | ¿Dónde estaba? | grup 1 (pos. 5): campana, canario, candelabro, casco, carta, caballito; grup 2 (pos. 4): pañal, pastilla, papel, paracaídas, pañuelo, paloma; grup 3 (pos. 3): castaña, cabaña, caballo, caja, castor, camello; grup 4 (pos. 2): cacahuete, cazuela, canguro, caracol, capibara, castañuelas; grup 5 (pos. 3): maracas, mantel, manzana, macarrones, mariquita, manopla; grup 6 (pos. 2): pintalabios, pirata, pimiento, pizza, pinza, piruleta | | |
| IMG-ES-L09-MEM-003 | Level9 | ¿Dónde estaba? | grup 1 (pos. 4): paracaídas, pañuelo, pañal, palomitas, paloma, pato; grup 2 (pos. 2): cascabel, campana, candado, caballito, carta, canario; grup 3 (pos. 3): camión, caramelo, capa, carpa, canoa, cangrejo; grup 4 (pos. 2): cazuela, cacahuete, castor, caballo, castañuelas, capibara; grup 5 (pos. 3): manguera, maracas, manzana, martillo, mango, macarrones; grup 6 (pos. 5): cortina, corbata, corazón, coral, cohete, cono | | |
| IMG-ES-L09-MEM-004 | Level9 | ¿Dónde estaba? | grup 1 (pos. 2): maracas, martillo, manopla, macarrones, mariquita, manguera; grup 2 (pos. 2): canoa, carpa, cazo, carretilla, cangrejo, caramelo; grup 3 (pos. 4): paleta, patata, pan, pasa, pantufla, pandereta; grup 4 (pos. 5): capibara, castaña, caballo, castañuelas, cazuela, cabaña; grup 5 (pos. 3): carta, cascabel, candado, canario, candelabro, casco; grup 6 (pos. 3): pastilla, palomitas, pato, pañal, paracaídas, papel | | |
| IMG-ES-L09-MEM-005 | Level9 | ¿Dónde estaba? | grup 1 (pos. 2): caqui, cara, canicas, cascabel, caramelo, calabaza; grup 2 (pos. 4): manopla, maracas, mantel, mango, manguera, manzana; grup 3 (pos. 2): cangrejo, capa, camión, carpa, cazo, carretilla; grup 4 (pos. 3): caracol, caja, camello, cacahuete, canguro, cabaña; grup 5 (pos. 3): pan, pandereta, palo, pavo, pantufla, patata; grup 6 (pos. 5): peluche, peón, perdiz, pelo, perro, percha | | |
| IMG-ES-L09-MEM-006 | Level9 | ¿Dónde estaba? | grup 1 (pos. 3): castaña, caja, castor, caracol, camello, canguro; grup 2 (pos. 4): paloma, pañuelo, papel, pastilla, palomitas, pato; grup 3 (pos. 3): mango, manopla, manguera, mantel, mariquita, martillo; grup 4 (pos. 5): capa, caramelo, cazo, camión, carretilla, canoa; grup 5 (pos. 2): pan, pantufla, pasa, paleta, pavo, palo; grup 6 (pos. 2): conejo, cohete, coliflor, cocinero, copo, colchón | | |

## Posició d'imatges: imagenes-ca-level9-10-v1.json (12 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-CA-L10-MEM-001 | Level10 | On era? | grup 1 (pos. 4): casa, cama, capa, cara, mapa, tapa; grup 2 (pos. 3): bota, boca, foca, coca, copa, cola; grup 3 (pos. 2): sal, sac, suc, cuc, ruc, sol; grup 4 (pos. 5): gorro, gorra, gerro, gerra, serra, porro; grup 5 (pos. 2): pila, pala, pipa, pica, cap, tap; grup 6 (pos. 3): pot, pou, pop, llima, llama, llana | | |
| IMG-CA-L10-MEM-002 | Level10 | On era? | grup 1 (pos. 3): mapa, tapa, capa, copa, sopa, cova; grup 2 (pos. 2): gota, nota, bota, bata, boca, coca; grup 3 (pos. 3): pal, sal, sol, poma, goma, puma; grup 4 (pos. 5): ruc, cuc, suc, pinya, pinta, pinça; grup 5 (pos. 4): pollet, follet, riu, niu, rosa, roda; grup 6 (pos. 2): pa, pi, ou, os, sabata, safata | | |
| IMG-CA-L10-MEM-003 | Level10 | On era? | grup 1 (pos. 3): cara, casa, cama, capa, copa, cova; grup 2 (pos. 2): gat, got, gos, pot, pou, pop; grup 3 (pos. 4): sol, col, cor, sal, sac, suc; grup 4 (pos. 3): galeta, maleta, paleta, cap, tap, nap; grup 5 (pos. 2): pica, pipa, pila, gota, nota, bota; grup 6 (pos. 5): sabata, safata, banyera, bandera, ovella, orella | | |
| IMG-CA-L10-MEM-004 | Level10 | On era? | grup 1 (pos. 2): poma, goma, gota, nota, bota, botó; grup 2 (pos. 3): cuc, ruc, suc, sac, sal, pal; grup 3 (pos. 4): castell, cistell, cartell, martell, llet, llit; grup 4 (pos. 2): lluna, llana, llama, llima, ou, os; grup 5 (pos. 3): nap, nas, tap, col, cor, sol; grup 6 (pos. 5): cavallet, cavaller, camell, cabell, escala, escola | | |
| IMG-CA-L10-MEM-005 | Level10 | On era? | grup 1 (pos. 3): copa, cola, cova, coca, sopa, capa; grup 2 (pos. 2): bota, boca, foca, botó, bata, gota; grup 3 (pos. 2): pal, sal, sol, col, cor, sac; grup 4 (pos. 5): pinya, pinta, pinça, galeta, maleta, paleta; grup 5 (pos. 4): gat, got, gos, pila, pala, pipa; grup 6 (pos. 3): panda, panxa, gla, ala, llet, llit | | |
| IMG-CA-L10-MEM-006 | Level10 | On era? | grup 1 (pos. 3): casa, cama, cara, capa, copa, cola; grup 2 (pos. 2): bota, gota, nota, goma, poma, puma; grup 3 (pos. 5): cap, tap, nap, nas, pa, pi; grup 4 (pos. 2): gorro, gorra, gerro, gerra, riu, niu; grup 5 (pos. 4): castell, cistell, cartell, lluna, llana, llama; grup 6 (pos. 3): peu, pes, pont, font, olla, illa | | |
| IMG-CA-L09-MEM-001 | Level9 | On era? | grup 1 (pos. 2): camilla, camisó, capella, caravana; grup 2 (pos. 3): espiga, espàrrec, espàtula, esquí; grup 3 (pos. 3): cabana, capibara, caravel·la, cavall; grup 4 (pos. 3): cassola, castanya, castanyoles, castor; grup 5 (pos. 2): pacient, paleta, paracaigudista, patinador; grup 6 (pos. 2): macarrons, maduixa, magrana, manyopla | | |
| IMG-CA-L09-MEM-002 | Level9 | On era? | grup 1 (pos. 3): maquineta, maraques, marieta, matamosques; grup 2 (pos. 2): pianista, picapedrer, piragüista, pirata; grup 3 (pos. 2): bacallà, ballarina, bata, batedora; grup 4 (pos. 3): cassola, castanya, castanyoles, castor; grup 5 (pos. 3): calaixera, camell, canyella, capibara; grup 6 (pos. 2): escuradents, espaguetis, espàtula, esquí | | |
| IMG-CA-L09-MEM-003 | Level9 | On era? | grup 1 (pos. 2): calaix, calaixera, camell, canyella; grup 2 (pos. 3): escut, espàtula, esquella, estufa; grup 3 (pos. 2): pacient, paleta, pallasso, patinador; grup 4 (pos. 3): camisa, camisó, capella, caravana; grup 5 (pos. 2): camió, canoa, capa, caramel; grup 6 (pos. 3): pianista, picapedrer, pilot, pirata | | |
| IMG-CA-L09-MEM-004 | Level9 | On era? | grup 1 (pos. 2): coet, coliflor, colom, conill; grup 2 (pos. 2): bacallà, ballarina, banyera, baralla; grup 3 (pos. 3): escut, espàtula, esquella, estàtua; grup 4 (pos. 2): cabell, cacau, cacauet, calaix; grup 5 (pos. 3): escuradents, espaguetis, espiga, espàrrec; grup 6 (pos. 3): cadenat, canari, canelobre, cavallet | | |
| IMG-CA-L09-MEM-005 | Level9 | On era? | grup 1 (pos. 3): macarrons, maduixa, matrioixca, maó; grup 2 (pos. 2): pacient, paleta, pallasso, paracaigudista; grup 3 (pos. 2): cacatua, calamar, calendari, camilla; grup 4 (pos. 3): escut, espàtula, estufa, estàtua; grup 5 (pos. 3): pianista, picapedrer, pilot, piragüista; grup 6 (pos. 2): camió, canoa, capa, caramel | | |
| IMG-CA-L09-MEM-006 | Level9 | On era? | grup 1 (pos. 2): cabana, cabell, cacau, cacauet; grup 2 (pos. 3): coet, coliflor, colom, conill; grup 3 (pos. 3): magrana, manyopla, maquineta, maraques; grup 4 (pos. 2): banyera, baralla, bata, batedora; grup 5 (pos. 3): cacatua, calamar, calendari, camisa; grup 6 (pos. 2): cadenat, canari, canelobre, cavallet | | |

