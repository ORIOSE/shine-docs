# Revisió: tanda 6, Level6 (castellà i català)

Estat: **pendent de revisió**. Els lots són a `shine/content/` i estan importats **sense publicar**; es publiquen quan el grup els aprovi.

Com revisar (protocol E12, `plans/contenido/encarrecs/E12-protocol-revisio.md`): a **Correcta** poseu `sí`, `no` o `amb canvis`, i a **Comentari** el canvi exacte. Criteri únic: un nen de l'edat del nivell (Level6 = 11 anys, 6è de Primària) sense dificultats valoraria l'activitat "Bé així". Els registres amb dos idiomes es mostren una sola vegada (noms en català i, entre claudàtors, en castellà).

Contingut: 48 activitats, 24 en castellà i 24 en català, 6 per àrea i idioma (Funcions Executives ja té les 3 de Level6 aprovades). Totes passen la comprovació d'estructura, la porta lèxica (rang 10.000 més el rescat infantil) i la validació de l'importador. Model: els lots de Level5 aprovats; parpelleig i llistes de 12 elements (6 + 3 + 3).

## Decisions que us demanem de validar

1. **"Ordena les síl·labes" sense dibuix a Level6**, com diuen el prompt 05, el catàleg (6.2) i la guia de parametrització: paraules de 5 síl·labes, una síl·laba sobrant i cap combinació de fitxes que formi una altra paraula. En català s'ha usat la síl·labació de l'IEC (dic-ci-o-na-ri, ce-le-bra-ci-ó): convé que la reviseu.
2. **Lectures expositives**: el Teide (castellà) i el cicle de l'aigua (català), amb dades comprovables que no caduquen, sense personatges. La catalana fa servir un parèntesi, que la guia permet des de Level6.
3. **Segmentació amb enclítics**: en castellà, units al verb (ponte, dámelo, cuéntame); en català, només els d'apòstrof (porta’l, truca’m, compra’n), perquè l'importador encara no admet el guionet. Dues frases catalanes fan servir "que" causal sense coma ("afanya’t que el tren surt..."), perquè la segmentació no porta puntuació.
4. **Subjuntiu imperfet** en una frase per idioma (si tuvieras tiempo; que portéssim la flauta).
5. **Repetició ràpida**: les pseudoparaules del banc de nivell 6 són de 3 síl·labes, més curtes que les paraules reals (com a Level5).
6. **Hiat**: "ordena les síl·labes" castellà (2 de 6 paraules) i el parpelleig BLK-ES-L06-VEL-003 (totes) porten l'etiqueta "Hiatos"; en català, les activitats de síl·labes i la llista d'assignatures porten "Hiats".
7. **Paraules temàtiques poc freqüents però dins de rang** pel rescat de la llista infantil: rinoceronte, escarabajo, excavadora, frambuesa, trineo, extraterrestre, constelación.

## Ordena les síl·labes: silabas-es-level6-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-ES-L06-LIN-001 | Level6 | Ordena las sílabas | pa-na-de-rí-a · ve-te-ri-na-rio · ar-qui-tec-tu-ra · ma-ra-vi-llo-so · i-ma-gi-na-ción · he-li-cóp-te-ro | | |
| SIL-ES-L06-LIN-002 | Level6 | Ordena las sílabas | e-lec-tri-ci-dad · fo-to-gra-fí-a · a-e-ro-puer-to · ri-no-ce-ron-te · co-mu-ni-ca-ción · es-ca-ra-ba-jo | | |

## Segmentació lèxica: segmentacion-es-level6-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-ES-L06-LIN-001 | Level6 | Separa las palabras | ponte el abrigo porque hace mucho frío fuera · cuando termines el dibujo enséñalo a tu abuela · guárdalo en el cajón para que no se pierda · mi prima tiene una guitarra y sabe tocarla · tráeme el cuaderno azul que está sobre la mesa · si encuentras mi gorro de lana dámelo en clase | | |
| SEG-ES-L06-LIN-002 | Level6 | Separa las palabras | lávate las manos antes de sentarte a comer · cuando llegue la vecina dile que espere un momento · mira el cielo y cuéntame cuántas estrellas ves · la entrenadora quiere vernos nadar en la piscina · pruébate esta chaqueta antes de comprarla en la tienda · si tuvieras tiempo podrías ayudarme a pintar la valla | | |

## Llista de text: lista-es-level6-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-ES-L06-LIN-001 | Level6 | Palabras compuestas largas | rascacielos · bragunfe · sopa · rompecabezas · extraterrestre · mesa · grencifo · contratiempo · antebrazo · luna · pristaño · supermercado | | |
| LIS-ES-L06-LIN-002 | Level6 | Palabras largas con ex | expedición · extranjero · dobsteña · pato · exposición · benscuma · experiencia · mapa · explorador · tinsfola · casa · excavadora | | |
| LIS-ES-L06-VEL-001 | Level6 | Lee rápido frases con dos partes | Cuando el sol se esconde, las farolas de la calle se encienden. · El vidrio que tiramos al contenedor verde se recicla para hacer botellas. · Mamá me da la mano. · Si tuviera una cámara, haría fotos de los pájaros del parque. · La entrenadora pidió que todos movieran los brazos antes de nadar. · Los volcanes expulsan lava, que se enfría y se convierte en roca. · Mi pato nada. · Mientras mi padre preparaba la cena, yo ponía la mesa. · Aunque llovía mucho, las jugadoras siguieron entrenando en la pista cubierta. · Toma la pala de mamá. · Las abejas fabrican miel con lo que recogen de las flores. · Mi abuela me enseñó a tejer cuando yo tenía siete años. | | |

## Parpelleig: blink-es-level6-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-ES-L06-VEL-001 | Level6 | Palabras con pl, fl y bl y sílabas cerradas | plástico · blismora · sol · plantilla · flamenco · a · clundefa · suplente · templado · mesa · plonferi · ejemplo | | |
| BLK-ES-L06-VEL-002 | Level6 | Palabras con fr, tr, cr y br y sílabas cerradas | frontera · pa · crendufa · tranquilo · frambuesa · e · cristales · frenguma · brillante · sopa · tronfiga · pregunta | | |
| BLK-ES-L06-VEL-003 | Level6 | Palabras con dos vocales que se separan | recreo · flaezu · campeón · la · oasis · aldea · no · preochu · creación · mapa · boañer · trineo | | |

## Repetició ràpida: repeticion-es-level6-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-ES-L06-VEL-001 | Level6 | Repite rápido: palabras largas con ns y bs | constelación · ganstife · lupa · obstáculo · lersfiño · instalación (15 s) | | |

## Lectura en veu alta: lectura-es-level6-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-ES-L06-VEL-001 | Level6 | El Teide | El Teide es un volcán de la isla de Tenerife. Además, es la montaña más alta de España. En invierno, su cumbre suele cubrirse de nieve, aunque en la costa hace buen tiempo. Lo rodea un parque nacional cuyos paisajes de lava parecen de otro planeta. Allí crecen plantas que solo existen en las islas Canarias. Como el cielo es muy limpio, cerca del volcán se instalaron grandes telescopios. (35 s) | | |

## Ordena les síl·labes: silabas-ca-level6-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-CA-L06-LIN-001 | Level6 | Ordena les síl·labes | al-ber-gí-ni-a · dic-ci-o-na-ri · ce-le-bra-ci-ó · pa-ra-cai-gu-des · cu-ri-o-si-tat · ex-plo-ra-ci-ó | | |
| SIL-CA-L06-LIN-002 | Level6 | Ordena les síl·labes | fo-to-gra-fi-a · la-bo-ra-to-ri · e-du-ca-ci-ó · vo-ca-bu-la-ri · ha-bi-ta-ci-ó · de-co-ra-ci-ó | | |

## Segmentació lèxica: segmentacion-ca-level6-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-CA-L06-LIN-001 | Level6 | Separa les paraules | agafa el llibre de ciències i porta’l a classe · si necessites ajuda amb els deures truca’m aquesta tarda · avisa’m quan arribis i et vindré a buscar · fa fred al carrer per això posa’t la bufanda · si queda pa a la fleca compra’n per sopar · si trobes el meu estoig guarda’l fins demà | | |
| SEG-CA-L06-LIN-002 | Level6 | Separa les paraules | deixa’m el regle i jo et deixo la goma · quan acabis el dibuix pinta’l amb els teus colors · afanya’t que el tren surt d’aquí a deu minuts · la mestra ens va demanar que portéssim la flauta · escolta’m bé abans de començar a resoldre el problema · el pa no és cuit espera abans de treure’l | | |

## Llista de text: llista-ca-level6-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-CA-L06-LIN-001 | Level6 | Paraules compostes | gratacels · sanuvesc · pa · escuradents · llevataps · daberent · sol · rentaplats · salvavides · e · cajodomp · obrellaunes | | |
| LIS-CA-L06-LIN-002 | Level6 | Paraules derivades amb ny i ll | ensenyament · natonyem · sol · meravellós · aconsellar · la · lliretep · companyia · acompanyament · a · lanyibi · bellesa | | |
| LIS-CA-L06-VEL-001 | Level6 | Paraules de les assignatures | matemàtiques · geografia · sopa · informàtica · literatura · no · gramàtica · ortografia · tecnologia · sol · biologia · ciències | | |

## Parpelleig: blink-ca-level6-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-CA-L06-VEL-001 | Level6 | Paraules de tres síl·labes amb travades i codes | instrument · a · prisglotur · obstacle · sol · inspector · pefringrom · trimestre · o · transformar · tudrafrac · transparent | | |
| BLK-CA-L06-VEL-002 | Level6 | Paraules de tres síl·labes amb tg i tj | missatge · la · neratgec · paisatge · coratge · e · patgilne · rellotge · viatjar · no · fecotjas · mitjana | | |
| BLK-CA-L06-VEL-003 | Level6 | Paraules de tres síl·labes amb ela geminada | satèl·lit · i · novel·la · crul·lija · pa · il·lustrar · instal·lar · jabul·lep · u · col·lega · rol·live · excel·lent | | |

## Repetició ràpida: repeticion-ca-level6-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-CA-L06-VEL-001 | Level6 | Repeteix ràpid: paraules llargues amb travades | trencaclosques · brocudro · programació · lupa · glagrome · trapezista (15 s) | | |

## Lectura en veu alta: lectura-ca-level6-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-CA-L06-VEL-001 | Level6 | El viatge de l’aigua | L’aigua de la Terra no s’acaba mai, perquè viatja sense parar en un cicle. Amb la calor del sol, una part del mar es converteix en vapor. El vapor puja, es refreda i forma les gotes dels núvols. Quan pesen massa, cauen en forma de pluja (o de neu, si fa fred). Si el sol no escalfés el mar, no tornaria a ploure mai. Per això, l’aigua que beus potser va regar els boscos dels dinosaures. (38 s) | | |

## Matriu de discriminació visual: matriz-es-ca-level6-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-L06-PER-001 | Level6 | es: Encuentra todas las b / ca: Troba totes les b | objectiu b, 5×10, 1 rondes; ronda 1: d p p d q p g d g q d b q d b d d p b g q g b p q p g p b b d g g d b d p g q g b q q p g q p p q d | | |
| MAT-L06-PER-002 | Level6 | es: Encuentra todas las d / ca: Troba totes les d | objectiu d, 5×10, 1 rondes; ronda 1: d g d q b g p q b g b p q p q q q g q g g g p q b d p d b g b d d g p p b g d p b q q b b d p p q b | | |
| MAT-L06-PER-003 | Level6 | es: Encuentra todas las p / ca: Troba totes les p | objectiu p, 5×10, 1 rondes; ronda 1: b b p g q b b g q d d q d d b p q d q d p g p d p b g g q g g p b g b b p q d q g d g b q b q g d p | | |
| MAT-L06-PER-004 | Level6 | es: Encuentra todas las q / ca: Troba totes les q | objectiu q, 5×10, 1 rondes; ronda 1: q g d d q d p b b b g g b q g q p p b b p p d g g b d d q q d p g d p g p q b b g p p d b g d b q p | | |
| MAT-L06-PER-005 | Level6 | es: Encuentra todas las n / ca: Troba totes les n | objectiu n, 5×10, 1 rondes; ronda 1: n u h n u n m u u m u n h u m m m n u m h h m m h m m u h u u h h u m h h u h h n u h n h m m n u m | | |
| MAT-L06-PER-006 | Level6 | es: Encuentra todas las u / ca: Troba totes les u | objectiu u, 5×10, 1 rondes; ronda 1: n w w n w n w m n m u n n n u m w m n w m m n w u w m w u m w m w n m u u n n w w u m m m n m w n u | | |

## Posició d'imatges: imagenes-es-ca-level6-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-L06-MEM-001 | Level6 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): orella [oreja], braç [brazo], genoll [rodilla], nas [nariz], mà [mano]; grup 2 (pos. 3): cérvol [ciervo], patata [patata], perdiu [perdiz], calaix [cajón], cofre [cofre]; grup 3 (pos. 2): bombeta [bombilla], plàtan [plátano], llimona [limón], campana [campana], pinya [piña]; grup 4 (pos. 4): rosquilla [rosquilla], brúixola [brújula], boia [boya], pilota [balón], medalla [medalla]; grup 5 (pos. 4): paella [sartén], forn [horno], olla [olla], tetera [tetera], ampolla [botella]; grup 6 (pos. 3): cavernícola [cavernícola], pirata [pirata], camioner [camionero], picapedrer [picapedrero], piragüista [piragüista] | | |
| IMG-L06-MEM-002 | Level6 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 4): tomàquet [tomate], piruleta [piruleta], llaç [lazo], cassó [cazo], mànega [manguera]; grup 2 (pos. 2): plat [plato], anell [anillo], ceba [cebolla], brioix [bollo], rellotge [reloj]; grup 3 (pos. 3): fanal [farola], gàbia [jaula], piràmide [pirámide], pont [puente], semàfor [semáforo]; grup 4 (pos. 2): meló [melón], serp [serpiente], tortuga [tortuga], dinosaure [dinosaurio], fulla [hoja]; grup 5 (pos. 4): branca [rama], flor [flor], pi [pino], palmera [palmera], margarida [margarita]; grup 6 (pos. 3): guitarra [guitarra], tuba [tuba], acordió [acordeón], violí [violín], clarinet [clarinete] | | |
| IMG-L06-MEM-003 | Level6 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): fada [hada], ballarina [bailarina], caminant [caminante], superheroi [superhéroe], carter [cartero]; grup 2 (pos. 4): cactus [cactus], trèvol [trébol], pera [pera], llima [lima], cocodril [cocodrilo]; grup 3 (pos. 4): casc [casco], canelobre [candelabro], sol [sol], copa [copa], corona [corona]; grup 4 (pos. 2): cassola [cazuela], caixa [caja], gla [bellota], castanya [castaña], cacau [cacao]; grup 5 (pos. 3): cadenat [candado], sal [sal], corda [cuerda], carta [carta], càmera [cámara]; grup 6 (pos. 2): abric [abrigo], vestit [vestido], bufanda [bufanda], jaqueta [chaqueta], samarreta [camiseta] | | |
| IMG-L06-MEM-004 | Level6 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 4): marieta [mariquita], mosquit [mosquito], eruga [oruga], saltamartí [saltamontes], escarabat [escarabajo]; grup 2 (pos. 3): calendari [calendario], pastilla [pastilla], arròs [arroz], capella [capilla], fantasma [fantasma]; grup 3 (pos. 2): cirera [cereza], estovalles [mantel], síndria [sandía], matamosques [matamoscas], rosa [rosa]; grup 4 (pos. 4): pijama [pijama], mitjó [calcetín], faldilla [falda], corbata [corbata], pantalons [pantalón]; grup 5 (pos. 3): coala [koala], elefant [elefante], hipopòtam [hipopótamo], foca [foca], rinoceront [rinoceronte]; grup 6 (pos. 2): tractor [tractor], submarí [submarino], cotxe [coche], tren [tren], excavadora [excavadora] | | |
| IMG-L06-MEM-005 | Level6 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 4): camell [camello], cangur [canguro], talp [topo], mico [mono], eriçó [erizo]; grup 2 (pos. 2): cola [pegamento], puzle [puzle], estoig [estuche], pissarra [pizarra], robot [robot]; grup 3 (pos. 3): unicorn [unicornio], llet [leche], nevera [nevera], iglú [iglú], matalàs [colchón]; grup 4 (pos. 2): cremallera [cremallera], collaret [collar], ulleres [gafas], maleta [maleta], paraigua [paraguas]; grup 5 (pos. 4): bateria [batería], piano [piano], arpa [arpa], xilòfon [xilófono], tambor [tambor]; grup 6 (pos. 3): crispetes [palomitas], macarrons [macarrones], salsitxa [salchicha], pollastre [pollo], truita [tortilla] | | |
| IMG-L06-MEM-006 | Level6 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): coet [cohete], avió [avión], moto [moto], furgoneta [furgoneta], ambulància [ambulancia]; grup 2 (pos. 3): xiulet [silbato], mapa [mapa], agulla [aguja], cadena [cadena], bandera [bandera]; grup 3 (pos. 4): pa [pan], canyella [canela], penjador [percha], xocolata [chocolate], castor [castor]; grup 4 (pos. 4): xarxa [red], pop [pulpo], cranc [cangrejo], petxina [concha], peix [pez]; grup 5 (pos. 2): cortina [cortina], làmpada [lámpara], televisió [televisión], test [maceta], llit [cama]; grup 6 (pos. 2): cullera [cuchara], gerra [jarra], got [vaso], tassa [taza], tapa [tapa] | | |

