# Revisió: tanda 4, Level4 (castellà i català)

Estat: **pendent de revisió**. Els lots són a `shine/content/` i estan importats **sense publicar**; es publiquen quan el grup els aprovi.

Com revisar (protocol E12, `plans/contenido/encarrecs/E12-protocol-revisio.md`): a **Correcta** poseu `sí`, `no` o `amb canvis`, i a **Comentari** el canvi exacte. Criteri únic: un nen de l'edat del nivell (Level4 = 9 anys, 4t de Primària) sense dificultats valoraria l'activitat "Bé així". Els registres amb dos idiomes es mostren una sola vegada (noms en català i, entre claudàtors, en castellà).

Contingut: 48 activitats, 24 en castellà i 24 en català: per àrea i idioma, Lingüística 6 (2 síl·labes, 2 segmentació, 2 llista de descodificació), Memòria 6 (posició d'imatges), Perceptius 6 (matriu) i Velocitat 6 (3 parpelleig, 1 repetició ràpida, 1 llista de velocitat, 1 lectura). Funcions Executives ja té les seves 3 de Level4 (aprovades). Totes passen la comprovació d'estructura, la porta lèxica (llista general fins al rang 5.000 més el rescat de la llista infantil) i la validació de l'importador. Model: els lots de Level3 que vau aprovar.

## Decisions que us demanem de validar

1. **Parpelleig castellà: 7 pseudoparaules i 3 alleujaments.** El catàleg (5.3) i l'exemple de la guia de parametrització posen a Level4 pseudoparaules de dues síl·labes amb travades; el 30 % d'alleujament es manté. El català manté el 5 + 2 + 3 de Level3 amb paraules reals de dues síl·labes amb travada o coda (tractor, plàstic, agost) com a material de treball. Quina de les dues voleu per a tots dos idiomes?
2. **Segmentació amb futur**: una frase per activitat en futur o condicional (iremos, jugaran, voldria), que la guia permet des de Level4; el prompt 07 deia present.
3. **Pronoms febles a la lectura catalana** ("els va fer fotografies", "hi voldria tornar"): la guia els permet a la lectura des de Level4; a la segmentació no entren fins a Level5.
4. **Llocs reals a la lectura**: els Pirineos i el delta de l’Ebre, com a escenari i sense dades, com permet la guia a Level4.
5. **Famílies diverses**: una tia (castellà) i dues mares (català).
6. **tusòria** (repetició catalana): pseudoparaula nova de quatre síl·labes, perquè el banc de Level4 només en té de dues. Passa el filtre de pseudoparaules (no coincideix amb cap paraula catalana ni castellana).
7. **Pseudoparaules de dues síl·labes** a les llistes, al costat de paraules reals de quatre (com a Level3).
8. **Repeticions entre tipus**: "bicicleta" surt a ordena les síl·labes i a la llista catalana; "flamenc" al parpelleig i a la lectura.

## Ordena les síl·labes: silabas-es-level4-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-ES-L04-LIN-001 | Level4 | Ordena las sílabas con dibujo | bi-ci-cle-ta [bicicleta] · as-tro-nau-ta [astronauta] · mi-cró-fo-no [microfono] · cla-ri-ne-te [clarinete] · cre-ma-lle-ra [cremallera] · e-le-fan-te [elefante] | | |
| SIL-ES-L04-LIN-002 | Level4 | Ordena las sílabas con dibujo | ma-ri-po-sa [mariposa] · za-na-ho-ria [zanahoria] · te-lé-fo-no [telefono] · mar-ga-ri-ta [margarita] · di-no-sau-rio [dinosaurio] · se-má-fo-ro [semaforo] | | |

## Segmentació lèxica: segmentacion-es-level4-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-ES-L04-LIN-001 | Level4 | Separa las palabras | los niños del pueblo juegan al fútbol · mi abuela prepara una sopa muy caliente · el gato negro duerme sobre la alfombra · mañana iremos de excursión a la montaña · mi hermana mayor tiene una mochila verde | | |
| SEG-ES-L04-LIN-002 | Level4 | Separa las palabras | el perro del vecino es muy grande · las hojas amarillas caen en otoño · el panadero hace pan todas las mañanas · el próximo verano viajaremos en tren · la maestra explica el ciclo del agua | | |

## Llista de text: lista-es-level4-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-ES-L04-LIN-001 | Level4 | Palabras largas con pr y tr | primavera · presfu · mapa · profesora · madrugada · lupa · trechun · escritorio · pato · triángulo | | |
| LIS-ES-L04-LIN-002 | Level4 | Palabras largas con pl y bl | plataforma · luna · complicado · plañez · biblioteca · moto · explicación · blescho · pala · simplemente | | |
| LIS-ES-L04-VEL-001 | Level4 | Lee rápido frases largas | Mañana visitaremos el museo de ciencias. · Mamá me da la mano. · El autobús escolar llegará a las nueve. · Mi hermana construye un castillo de arena. · Los pájaros vuelan hacia el sur en otoño. · Papá pela la patata. · La piscina del barrio abre por la tarde. · Me gustaría aprender a tocar la trompeta. · Toma la pelota. · Las tortugas caminan despacio por la playa. | | |

## Parpelleig: blink-es-level4-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-ES-L04-VEL-001 | Level4 | Palabras inventadas con pl, bl, cl, fl y gl | blijol · plofel · sol · clumaz · flimez · mesa · glufan · a · closfe · plisfur | | |
| BLK-ES-L04-VEL-002 | Level4 | Palabras inventadas con pr, br, tr, cr y dr | brofal · luna · prichor · trugur · crozul · pa · drespu · frachul · o · grofil | | |
| BLK-ES-L04-VEL-003 | Level4 | Palabras inventadas con la trabada al final | molbru · merclu · sopa · belcra · la · faldru · durflo · balgru · mapa · dorpri | | |

## Repetició ràpida: repeticion-es-level4-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-ES-L04-VEL-001 | Level4 | Repite rápido: palabras largas con r | trabajador · granfez · lupa · cocodrilo · pranzul · frigorífico (15 s) | | |

## Lectura en veu alta: lectura-es-level4-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-ES-L04-VEL-001 | Level4 | Una semana en los Pirineos | En verano, Omar pasó una semana en los Pirineos con su tía. Cada mañana subían por un sendero hasta un lago. El agua era muy fría y transparente. Allí querían ver ardillas. Sin embargo, los animales se escondían al oír sus pasos. Entonces esperaron en silencio detrás de una roca. Al poco rato, tres ardillas bajaron de un pino. Después, Omar las dibujó en su cuaderno. Ya había decidido una cosa: el próximo verano volvería. (45 s) | | |

## Ordena les síl·labes: silabas-ca-level4-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-CA-L04-LIN-001 | Level4 | Ordena les síl·labes amb dibuix | bi-ci-cle-ta [bicicleta] · pa-pa-llo-na [mariposa] · he-li-còp-ter [helicoptero] · as-tro-nau-ta [astronauta] · fur-go-ne-ta [furgoneta] · mar-ga-ri-da [margarita] | | |
| SIL-CA-L04-LIN-002 | Level4 | Ordena les síl·labes amb dibuix | hi-po-pò-tam [hipopotamo] · cre-ma-lle-ra [cremallera] · man-da-ri-na [mandarina] · es-ca-ra-bat [escarabajo] · ca-len-da-ri [calendario] · pan-de-re-ta [pandereta] | | |

## Segmentació lèxica: segmentacion-ca-level4-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-CA-L04-LIN-001 | Level4 | Separa les paraules | els nens del barri jugaran al pati · demà anirem a l’hort amb els avis · el tren passa pel pont del riu · l’ocell fa el niu dalt de l’arbre · l’àvia porta les pomes als cosins | | |
| SEG-CA-L04-LIN-002 | Level4 | Separa les paraules | voldria anar al museu amb l’oncle · el gos dels veïns dorm a l’entrada · la nena guarda l’entrepà a la motxilla · els pescadors arriben al port de l’illa · a l’estiu farem una excursió pel bosc | | |

## Llista de text: llista-ca-level4-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-CA-L04-LIN-001 | Level4 | Paraules llargues amb travada amb r | primavera · pa · prabut · abraçada · sol · jabrol · professora · nina · trolum · estructura | | |
| LIS-CA-L04-LIN-002 | Level4 | Paraules llargues amb travada amb l | plastilina · clinap · sopa · complicada · poflap · no · plataforma · blemit · la · bicicleta | | |
| LIS-CA-L04-VEL-001 | Level4 | Paraules de l’escola | gimnàstica · retolador · mapa · ordinador · excursió · e · maquineta · paperera · casa · carmanyola | | |

## Parpelleig: blink-ca-level4-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-CA-L04-VEL-001 | Level4 | Paraules amb travada amb r | tractor · sol · trenta · trimac · trobar · i · premsa · refrul · pa · profund | | |
| BLK-CA-L04-VEL-002 | Level4 | Paraules amb travada amb l | plàstic · la · meclil · clàssic · globus · e · flamenc · buplos · no · plantar | | |
| BLK-CA-L04-VEL-003 | Level4 | Paraules acabades en dues consonants | agost · so · frabost · infant · valent · a · torrent · netrimp · lupa · dilluns | | |

## Repetició ràpida: repeticion-ca-level4-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-CA-L04-VEL-001 | Level4 | Repeteix ràpid: paraules llargues amb hiat | família · història · sopa · violeta · tusòria · memòria (15 s) | | |

## Lectura en veu alta: lectura-ca-level4-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-CA-L04-VEL-001 | Level4 | Els flamencs del delta | En Nil i les seves mares van anar al delta de l’Ebre. Van llogar tres bicicletes. Després van recórrer els camins entre els camps d’arròs. L’aigua dels canals semblava un mirall. De sobte, en Nil va veure uns ocells preciosos: eren flamencs. Tenien les potes llargues i el cos de color rosa. Buscaven menjar al fang i caminaven a poc a poc. En Nil els va fer fotografies. A la tornada, va dir que l’estiu vinent hi voldria tornar. (47 s) | | |

## Matriu de discriminació visual: matriz-es-ca-level4-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-L04-PER-001 | Level4 | es: Encuentra todas las b / ca: Troba totes les b | objectiu b, 6×7, 1 rondes; ronda 1: d p o d g g q p p d q b p q b p d g b q g p b o o d p q b b o o g o b o q d g d q g | | |
| MAT-L04-PER-002 | Level4 | es: Encuentra todas las d / ca: Troba totes les d | objectiu d, 6×7, 1 rondes; ronda 1: g q b g o p q g d q o b p b o q p b g o g o p o b d o d d g d q g p d p p b d q q b | | |
| MAT-L04-PER-003 | Level4 | es: Encuentra todas las p / ca: Troba totes les p | objectiu p, 6×7, 1 rondes; ronda 1: d b d o d q b q g p g b b o o o p p o d g p d q d q b b q o p o p g q g d q g b p g | | |
| MAT-L04-PER-004 | Level4 | es: Encuentra todas las q / ca: Troba totes les q | objectiu q, 6×7, 1 rondes; ronda 1: q d g d p o g g g d d b o o q q o p o p g b p g b b d d o p p q b p q q g o b d b q | | |
| MAT-L04-PER-005 | Level4 | es: Encuentra todas las n / ca: Troba totes les n | objectiu n, 6×7, 1 rondes; ronda 1: o u m o u h o o u h o n n o u m o n n u u m u h o m n h m m u h h n o n h m h h m u | | |
| MAT-L04-PER-006 | Level4 | es: Encuentra todas las u / ca: Troba totes les u | objectiu u, 6×7, 1 rondes; ronda 1: m u o u u w u n u m o m n m n o u o o w m n w n w n w o m o o m w n w n n w m u m w | | |

## Posició d'imatges: imagenes-es-ca-level4-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-L04-MEM-001 | Level4 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): moneda [moneda], pila [pila], sal [sal], pintallavis [pintalabios]; grup 2 (pos. 2): carter [cartero], bomber [bombero], policia [policía], dinosaure [dinosaurio]; grup 3 (pos. 3): nas [nariz], cabell [pelo], mà [mano], orella [oreja]; grup 4 (pos. 2): hamburguesa [hamburguesa], pebrot [pimiento], pollastre [pollo], patata [patata]; grup 5 (pos. 3): pedra [piedra], cova [cueva], gla [bellota], sol [sol] | | |
| IMG-L04-MEM-002 | Level4 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): granger [granjero], mag [mago], drac [dragón], pirata [pirata]; grup 2 (pos. 3): balança [balanza], cadenat [candado], regal [regalo], camilla [camilla]; grup 3 (pos. 3): flor [flor], planeta [planeta], rosa [rosa], tronc [tronco]; grup 4 (pos. 2): capella [capilla], far [faro], escola [escuela], botiga [tienda]; grup 5 (pos. 2): truita [tortilla], iogurt [yogur], entrepà [bocadillo], gelat [helado] | | |
| IMG-L04-MEM-003 | Level4 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): violí [violín], trombó [trombón], harmònica [armónica], micròfon [micrófono]; grup 2 (pos. 3): sargantana [lagarto], cangur [canguro], coala [koala], zebra [cebra]; grup 3 (pos. 3): cara [cara], ala [ala], llima [lima], llauna [lata]; grup 4 (pos. 2): coet [cohete], patinet [patinete], cotxe [coche], vaixell [barco]; grup 5 (pos. 2): cigonya [cigüeña], cacatua [cacatúa], ocell [pájaro], canari [canario] | | |
| IMG-L04-MEM-004 | Level4 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): font [fuente], granja [granja], fanal [farola], piscina [piscina]; grup 2 (pos. 2): gorro [gorro], capa [capa], bata [bata], casc [casco]; grup 3 (pos. 2): formatge [queso], suc [zumo], salsitxa [salchicha], canyella [canela]; grup 4 (pos. 3): grua [grúa], avió [avión], canoa [canoa], caravana [caravana]; grup 5 (pos. 2): cuiner [cocinero], fada [hada], capità [capitán], bruixa [bruja] | | |
| IMG-L04-MEM-005 | Level4 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): martell [martillo], matamosques [matamoscas], maó [ladrillo], imant [imán]; grup 2 (pos. 3): figa [higo], cirera [cereza], castanya [castaña], raïm [uva]; grup 3 (pos. 3): núvol [nube], cactus [cactus], pi [pino], foc [fuego]; grup 4 (pos. 2): safata [bandeja], cassola [cazuela], forn [horno], olla [olla]; grup 5 (pos. 2): medusa [medusa], cranc [cangrejo], cavallet [caballito], peix [pez] | | |
| IMG-L04-MEM-006 | Level4 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): peó [peón], llibreta [cuaderno], nina [muñeca], retolador [rotulador]; grup 2 (pos. 2): llana [lana], serra [sierra], fil [hilo], llanterna [linterna]; grup 3 (pos. 2): pa [pan], macarrons [macarrones], pastís [tarta], bolet [seta]; grup 4 (pos. 2): porc [cerdo], cabra [cabra], cavall [caballo], ànec [pato]; grup 5 (pos. 3): pantalons [pantalón], cinturó [cinturón], collaret [collar], faldilla [falda] | | |

