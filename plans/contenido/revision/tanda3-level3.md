# Revisió: tanda 3, Level3 (castellà i català)

Estat: **pendent de revisió**. Els lots són a `shine/content/` i estan importats **sense publicar**; es publiquen quan el grup els aprovi.

Com revisar (protocol E12, `plans/contenido/encarrecs/E12-protocol-revisio.md`): a **Correcta** poseu `sí`, `no` o `amb canvis`, i a **Comentari** el canvi exacte. Criteri únic: un nen de l'edat del nivell (Level3 = 8 anys, 3r de Primària) sense dificultats valoraria l'activitat "Bé així". Els registres amb dos idiomes es mostren una sola vegada (noms en català i, entre claudàtors, en castellà).

Contingut: 49 activitats, 24 en castellà i 25 en català. Per àrea i idioma: Lingüística 6 (2 síl·labes, 2 segmentació, 2 llista de descodificació), Memòria 6 (posició d'imatges), Perceptius 6 (matriu; en català 7, amb la de l'ela geminada que el grup va moure a Level3) i Velocitat 6 (3 parpelleig, 1 repetició ràpida, 1 llista de velocitat, 1 lectura en veu alta). Totes passen la comprovació d'estructura, la porta lèxica (llista general fins al rang 3.000 més el rescat de la llista infantil) i la validació de l'importador.

## Decisions que us demanem de validar

1. **Parpelleig: 5 elements de treball, 2 pseudoparaules i 3 alleujaments** en lloc dels 6 elements del prompt 03. Amb 6 elements i 2 pseudoparaules només hi caben 2 alleujaments de 10 (20 %), per sota del 25 a 30 % que demana la guia.
2. **Els hiats no tenen terme d'esforç** a la taxonomia de descodificació, ni en castellà ni en català. Les activitats d'hiat porten el terme que surt de les altres estructures (per exemple, "Travades amb r" per teatre) o cap (BLK-CA-L03-VEL-003). Voleu afegir un terme "Hiats" a les dues taxonomies?
3. **Sense diàleg a la lectura en veu alta.** La guia permet dues intervencions a Level3, però no les exigeix; els dos textos fan servir l'estil indirecte.
4. **SIL-ES-L03-LIN-002 no porta dibuix**: el banc no té cap paraula de 3 o 4 síl·labes amb coda VCC o CVCC (instante, transporte).
5. **Síl·labes del parpelleig castellà**: obs, trans i cris no passen la porta lèxica (fora del rang de Level3) i s'han substituït; la coda CVCC hi és amb "transporte" sencera.
6. **libèl·lula** es parteix li-bèl·-lu-la, amb el punt volat a la segona fitxa, com ja vau validar per a l'ela geminada.
7. **Pseudoparaules amb apòstrof** (l’ilbu, d’ospu): pseudoparaules de Level1 del banc amb l’ o d’ al davant.

## Ordena les síl·labes: silabas-es-level3-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-ES-L03-LIN-001 | Level3 | Ordena las sílabas con dibujo | ca-no-a [canoa] · san-dí-a [sandia] · to-a-lla [toalla] · le-o-par-do [leopardo] · a-cor-de-ón [acordeon] · ko-a-la [koala] | | |
| SIL-ES-L03-LIN-002 | Level3 | Ordena las sílabas | ins-tan-te · trans-por-te · ins-tru-men-to · obs-tá-cu-lo · cons-truc-ción · ins-ti-tu-to | | |

## Segmentació lèxica: segmentacion-es-level3-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-ES-L03-LIN-001 | Level3 | Separa las palabras | mi tío va al río · hay un pájaro en el árbol · el poeta lee un libro · el teatro es muy bonito · el autobús del colegio llega pronto | | |
| SEG-ES-L03-LIN-002 | Level3 | Separa las palabras | el león duerme al sol · la maestra toca un instrumento · hay un obstáculo en el camino · el barco de transporte llega hoy · el tren del puerto es rápido | | |

## Llista de text: lista-es-level3-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-ES-L03-LIN-001 | Level3 | Palabras con ns y bs | instante · obsga · sol · transporte · obstáculo · mesa · onsti · constante · la · instrumento | | |
| LIS-ES-L03-LIN-002 | Level3 | Palabras como país y poeta | poeta · pa · teatro · jeol · país · sopa · maestro · troaz · no · pasear | | |
| LIS-ES-L03-VEL-001 | Level3 | Lee rápido frases | Mi abuelo toca un instrumento. · Mamá pone la mesa. · Un búho vive en el bosque. · Hoy hemos visto un pájaro azul. · Mi pato nada solo. · La maestra lee un poema. · En un instante empezó a llover. · Papá toma la sopa. · Hay maíz en el campo. · El transporte del colegio llega tarde. | | |

## Parpelleig: blink-es-level3-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-ES-L03-VEL-001 | Level3 | Sílabas con ns, bs y rs | ins · cons · ma · donsga · mons · abs · e · ibste · sopa · pers | | |
| BLK-ES-L03-VEL-002 | Level3 | Palabras como país y león | país · leer · la · maíz · chaol · león · o · reír · mesa · boez | | |
| BLK-ES-L03-VEL-003 | Level3 | Trabadas con final: plan, tras, gran | plan · crenvi · tras · no · gran · sol · blan · glosti · pa · transporte | | |

## Repetició ràpida: repeticion-es-level3-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-ES-L03-VEL-001 | Level3 | Repite rápido: palabras con ns | instante · transporte · mapa · constante · instrumento (15 s) | | |

## Lectura en veu alta: lectura-es-level3-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-ES-L03-VEL-001 | Level3 | La cometa de Nadia | El sábado, Nadia fue al campo con su abuelo. Llevaban una cometa nueva. Hacía mucho viento y la cometa subió muy alto. De pronto, el hilo se rompió. La cometa cayó al otro lado del prado. Luego, Nadia corrió a buscarla. Tenía un palo roto. Su abuelo sacó cinta de la mochila. Entre los dos la arreglaron en un instante. Al final del día, la cometa volvió a volar. (52 s) | | |

## Ordena les síl·labes: silabas-ca-level3-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-CA-L03-LIN-001 | Level3 | Ordena les síl·labes amb dibuix | pi-a-no [piano] · e-le-fant [elefante] · ma-ri-e-ta [mariquita] · sín-dri-a [sandia] · hi-e-na [hiena] · bús-ti-a [buzon] | | |
| SIL-CA-L03-LIN-002 | Level3 | Ordena les síl·labes amb dibuix | li-bèl·-lu-la [libelula] · a-vi-ó [avion] · u-ni-corn [unicornio] · lle-o-pard [leopardo] · ba-te-ri-a [bateria] · ri-no-ce-ront [rinoceronte] | | |

## Segmentació lèxica: segmentacion-ca-level3-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-CA-L03-LIN-001 | Level3 | Separa les paraules | l’avi va al parc cada dia · el nen beu l’aigua del got · la nena porta l’abric al col·legi · l’ós busca mel al bosc · la iaia rega l’hort a la tarda | | |
| SEG-CA-L03-LIN-002 | Level3 | Separa les paraules | el gat va saltar pel balcó · juguem a l’ombra d’un arbre · l’aranya ha fet una tela · els avis han tornat del mercat · l’oca blanca neda a l’estany | | |

## Llista de text: llista-ca-level3-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-CA-L03-LIN-001 | Level3 | Paraules amb ela geminada | col·legi · sol · nal·lu · pel·lícula · mapa · ril·lu · tranquil·la · casa · val·lun · il·lusió | | |
| LIS-CA-L03-LIN-002 | Level3 | Paraules acabades en dues consonants | dimarts · pa · bijunt · transport · fupart · no · gegant · restaurant · sol · cunors | | |
| LIS-CA-L03-VEL-001 | Level3 | Paraules d’escola i de casa | l’escola · piano · casa · l’aigua · lleó · pa · camió · l’hivern · sopa · l’avió | | |

## Parpelleig: blink-ca-level3-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-CA-L03-VEL-001 | Level3 | Síl·labes amb dues consonants finals | ins · verd · la · camps · obsfi · temps · sol · forts · e · unspi | | |
| BLK-CA-L03-VEL-002 | Level3 | Apòstrofs i contraccions | l’ós · al · pa · l’arbre · d’una · l’ilbu · e · dels · no · d’ospu | | |
| BLK-CA-L03-VEL-003 | Level3 | Paraules amb hiat | poema · teatre · e · riure · jaol · veí · la · país · sol · quiol | | |

## Repetició ràpida: repeticion-ca-level3-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-CA-L03-VEL-001 | Level3 | Repeteix ràpid: paraules amb dues consonants finals | elefant · temps · sopa · gegant · important (15 s) | | |

## Lectura en veu alta: lectura-ca-level3-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-CA-L03-VEL-001 | Level3 | El niu de cigonyes | La Laia i l’avi van anar al riu. Dalt d’un arbre sec, van veure un niu. Era un niu enorme de cigonyes. Una cigonya blanca portava branques amb el bec. L’avi va explicar que esperava els pollets. La Laia va observar la cigonya en silenci. Després va dibuixar l’ocell a la llibreta. A la tarda van tornar contents a casa. (45 s) | | |

## Matriu de discriminació visual: matriz-es-ca-level3-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-L03-PER-002 | Level3 | es: Encuentra todas las b / ca: Troba totes les b | objectiu b, 5×6, 2 rondes; ronda 1: d b p p o d q b d d b d q b o q o b p p p p o q q q d o o b | | |
| MAT-L03-PER-003 | Level3 | es: Encuentra todas las d / ca: Troba totes les d | objectiu d, 5×6, 2 rondes; ronda 1: b q q d o q d b d q p q p d b p o b o d d p o p q b o o b p | | |
| MAT-L03-PER-004 | Level3 | es: Encuentra todas las p / ca: Troba totes les p | objectiu p, 5×6, 2 rondes; ronda 1: o p b d b o o o q q p o d d d o p q d d q p p b q b p b b q | | |
| MAT-L03-PER-005 | Level3 | es: Encuentra todas las q / ca: Troba totes les q | objectiu q, 5×6, 2 rondes; ronda 1: d b o b b p b b o o o q d d q d o q d q p b p o q d p p q p | | |
| MAT-L03-PER-006 | Level3 | es: Encuentra todas las n / ca: Troba totes les n | objectiu n, 5×6, 2 rondes; ronda 1: m o o u m n m u u h h o o n n u u n m h u o n h m h o n h m | | |
| MAT-L03-PER-007 | Level3 | es: Encuentra todas las u / ca: Troba totes les u | objectiu u, 5×6, 2 rondes; ronda 1: u w m u m w n o m m o w n u u w n o o u n m u w o o m n w n | | |

## Matriu de discriminació visual: matriz-ca-level3-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-CA-L03-PER-001 | Level3 | Troba totes les l·l | objectiu l·l, 5×6, 2 rondes; ronda 1: il l l il l·l l l ll ll l·l ll l il il ll l·l il l·l l il l·l ll ll l·l ll il il ll l l | | |

## Posició d'imatges: imagenes-es-ca-level3-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-L03-MEM-001 | Level3 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): banyador [bañador], barret [sombrero], vestit [vestido], llaç [lazo]; grup 2 (pos. 2): eriçó [erizo], girafa [jirafa], guineu [zorro], coiot [coyote]; grup 3 (pos. 2): peix [pez], gamba [gamba], tauró [tiburón], cavallet [caballito]; grup 4 (pos. 3): caixa [caja], llanterna [linterna], segell [sello], xiulet [silbato]; grup 5 (pos. 2): tren [tren], grua [grúa], moto [moto], tractor [tractor] | | |
| IMG-L03-MEM-002 | Level3 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): cactus [cactus], cova [cueva], volcà [volcán], tulipa [tulipán]; grup 2 (pos. 2): policia [policía], astronauta [astronauta], drac [dragón], carter [cartero]; grup 3 (pos. 4): llauna [lata], cara [cara], tap [tapón], llima [lima]; grup 4 (pos. 4): enciam [lechuga], arròs [arroz], pa [pan], patata [patata]; grup 5 (pos. 3): maquineta [sacapuntas], regle [regla], llibreta [cuaderno], gronxador [columpio] | | |
| IMG-L03-MEM-003 | Level3 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): trombó [trombón], guitarra [guitarra], harmònica [armónica], saxòfon [saxofón]; grup 2 (pos. 1): bandera [bandera], sobre [sobre], cadenat [candado], càmera [cámara]; grup 3 (pos. 2): gat [gato], toro [toro], ovella [oveja], conill [conejo]; grup 4 (pos. 4): figa [higo], plàtan [plátano], maduixa [fresa], síndria [sandía]; grup 5 (pos. 4): mag [mago], bebè [bebé], dinosaure [dinosaurio], bomber [bombero] | | |
| IMG-L03-MEM-004 | Level3 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 4): esquirol [ardilla], cérvol [ciervo], cargol [caracol], ratpenat [murciélago]; grup 2 (pos. 1): llet [leche], suc [zumo], mel [miel], bolet [seta]; grup 3 (pos. 3): maraques [maracas], trompeta [trompeta], violí [violín], bateria [batería]; grup 4 (pos. 4): casa [casa], galleda [cubo], gerro [jarrón], test [maceta]; grup 5 (pos. 1): baldufa [peonza], pissarra [pizarra], retolador [rotulador], globus [globo] | | |
| IMG-L03-MEM-005 | Level3 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 1): piano [piano], castanyoles [castañuelas], micròfon [micrófono], clarinet [clarinete]; grup 2 (pos. 3): porc [cerdo], gallina [gallina], ratolí [ratón], gos [perro]; grup 3 (pos. 4): semàfor [semáforo], torre [torre], piscina [piscina], far [faro]; grup 4 (pos. 3): llop [lobo], linx [lince], mico [mono], elefant [elefante]; grup 5 (pos. 2): pebrot [pimiento], crispetes [palomitas], pernil [jamón], macarrons [macarrones] | | |
| IMG-L03-MEM-006 | Level3 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): ona [ola], arbre [árbol], planeta [planeta], branca [rama]; grup 2 (pos. 3): quadre [cuadro], sabó [jabón], porta [puerta], espelma [vela]; grup 3 (pos. 3): bruixa [bruja], pirata [pirata], unicorn [unicornio], pallasso [payaso]; grup 4 (pos. 3): zebra [cebra], panda [panda], serp [serpiente], cuc [gusano]; grup 5 (pos. 4): cor [corazón], cama [pierna], nas [nariz], orella [oreja] | | |

