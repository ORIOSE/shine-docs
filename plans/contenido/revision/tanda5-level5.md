# Revisió: tanda 5, Level5 (castellà i català)

Estat: **pendent de revisió**. Els lots són a `shine/content/` i estan importats **sense publicar**; es publiquen quan el grup els aprovi.

Com revisar (protocol E12, `plans/contenido/encarrecs/E12-protocol-revisio.md`): a **Correcta** poseu `sí`, `no` o `amb canvis`, i a **Comentari** el canvi exacte. Criteri únic: un nen de l'edat del nivell (Level5 = 10 anys, 5è de Primària) sense dificultats valoraria l'activitat "Bé així". Els registres amb dos idiomes es mostren una sola vegada (noms en català i, entre claudàtors, en castellà).

Contingut: 48 activitats, 24 en castellà i 24 en català, 6 per àrea i idioma (Funcions Executives ja té les 3 de Level5 aprovades). Totes passen la comprovació d'estructura, la porta lèxica (rang 7.000 més el rescat infantil) i la validació de l'importador. Model: els lots de Level4 aprovats; el parpelleig segueix el model mixt (5 paraules reals, 2 pseudoparaules, 3 alleujaments) en tots dos idiomes.

## Decisions que us demanem de validar

1. **Síl·labes sobrants a "ordena les síl·labes"** (primera vegada a Level5): una síl·laba CV que no s'assembla a les de la paraula, i la instrucció ho avisa ("Sobra una sílaba." / "Hi ha una síl·laba que sobra."). S'ha comprovat que cap combinació de fitxes forma una altra paraula.
2. **termòmetre (català) i termómetro (castellà)**: l'agent castellà l'ha deixat fora per la regla de la guia sobre hospital i por; el català l'ha fet servir com a objecte. Quin criteri voleu?
3. **Pronoms febles a la segmentació**, davant del verb (me lo cuenta, nos lee; el porta, em deixa, s'amaga), i un subjuntiu per activitat. Els pronoms combinats (li ho, se'n) no hi són: el catàleg els posa a Level5 per a aquest tipus, però la taula 2.3 i la guia els deixen per a Level7. Quin val?
4. **Llistes de 12 elements**: 6 paraules, 3 pseudoparaules i 3 alleujaments.
5. **Repetició ràpida catalana**: el banc E06 de nivell 5 només té pseudoparaules de tres síl·labes; comparteixen el grup tg/tj amb les paraules reals però no la longitud.
6. **Llocs reals**: Sierra Nevada i el Montsec com a escenari, sense dades; Saturn com a fet que no caduca.
7. **Etiqueta "Hiatos" / "Hiats" que surt de paraules quotidianes** (tía, maestra, dia, acordió): el terme té el mateix pes que les codes complexes i acaba etiquetant activitats que no treballen l'hiat. Proposem que, a partir d'ara, l'hiat només etiqueti l'activitat si el treballa (més d'un terç de les paraules de treball amb hiat). D'acord?
8. **Paraules properes dins del lot**: electricitat i electricista en llistes diferents; planeta i planetario, cartero, bicicleta en tipus diferents.

## Ordena les síl·labes: silabas-es-level5-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-ES-L05-LIN-001 | Level5 | Ordena las sílabas con dibujo | ca-len-da-rio [calendario] · sal-ta-mon-tes [saltamontes] · pan-de-re-ta [pandereta] · fur-go-ne-ta [furgoneta] · be-ren-je-na [berenjena] · ro-tu-la-dor [rotulador] | | |
| SIL-ES-L05-LIN-002 | Level5 | Ordena las sílabas con dibujo | ca-la-ba-za [calabaza] · ca-mi-se-ta [camiseta] · li-bé-lu-la [libelula] · pi-rá-mi-de [piramide] · xi-ló-fo-no [xilofono] · mur-cié-la-go [murcielago] | | |

## Segmentació lèxica: segmentacion-es-level5-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-ES-L05-LIN-001 | Level5 | Separa las palabras | mi abuelo me lo cuenta todas las noches · la profesora nos lee un cuento largo · el cartero te trae una carta del pueblo · mi hermano pequeño se lo dice a papá · la vecina nos presta su escalera de madera · cuando llegue la primavera las flores se abren | | |
| SEG-ES-L05-LIN-002 | Level5 | Separa las palabras | la abuela le teje una bufanda roja · mi madre me lo explica con mucha paciencia · los niños la ayudan a regar el huerto · el entrenador nos espera en el campo · mi tía me deja su patinete azul · papá lo guarda para que no se moje | | |

## Llista de text: lista-es-level5-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-ES-L05-LIN-001 | Level5 | Palabras muy largas con tr, gr y pr | entrenamiento · bratelu · sopa · agricultura · equilibrio · mesa · prezuta · presentación · tradicional · casa · fudrico · dromedario | | |
| LIS-ES-L05-LIN-002 | Level5 | Palabras muy largas con es, in y or | estudiante · importante · ancibo · luna · ordenador · ustañe · espectáculo · pato · invernadero · nisfoga · mapa · almohada | | |
| LIS-ES-L05-VEL-001 | Level5 | Lee rápido frases muy largas | Cuando termine la clase, saldremos al patio a jugar. · Mi abuela riega las semillas para que crezcan pronto. · Papá me da la sopa. · La científica observa las estrellas con un telescopio. · Los alumnos preparan un experimento con agua y vinagre. · Mi hermano me presta su linterna para la excursión. · Toma la moto de papá. · Es necesario que bebamos agua después de hacer deporte. · La maestra nos recomienda un libro de aventuras. · Mamá me pasa la pelota. · Las abejas vuelan de flor en flor durante la primavera. · Ojalá mañana haga buen tiempo para ir en bicicleta. | | |

## Parpelleig: blink-es-level5-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-ES-L05-VEL-001 | Level5 | Palabras con pl, fl, cl y bl | planeta · clifuta · sol · reflejo · teclado · a · miflazo · público · mesa · ciclista | | |
| BLK-ES-L05-VEL-002 | Level5 | Palabras con tr, dr, gr, br y pr | secreto · pa · frozalu · ladrillo · cangrejo · e · abrigo · vecrizu · sopa · primero | | |
| BLK-ES-L05-VEL-003 | Level5 | Palabras con or, car, es, bol e in | orquesta · irmochu · cartero · la · escuela · bolsillo · no · falcumi · mapa · insecto | | |

## Repetició ràpida: repeticion-es-level5-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-ES-L05-VEL-001 | Level5 | Repite rápido: palabras largas con pl y bl | planetario · blazuri · pala · clasificación · cheplomu · plastilina (15 s) | | |

## Lectura en veu alta: lectura-es-level5-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-ES-L05-VEL-001 | Level5 | Niebla en Sierra Nevada | En invierno, Irene viajó a Sierra Nevada con su abuelo para bajar en trineo. El primer día, una niebla espesa cubrió la montaña. Desde el refugio no se veía la pista. Su abuelo le explicó que la niebla es una nube que toca el suelo. Mientras esperaban, tomaron una sopa caliente. Cuando salió el sol, una monitora le enseñó a frenar con los pies. Después, Irene bajó muy despacio. Ahora está deseando que llegue el próximo invierno. (42 s) | | |

## Ordena les síl·labes: silabas-ca-level5-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-CA-L05-LIN-001 | Level5 | Ordena les síl·labes amb dibuix | pas-ta-na-ga [zanahoria] · di-no-sau-re [dinosaurio] · ter-mò-me-tre [termometro] · pi-rà-mi-de [piramide] · ca-ra-va-na [caravana] · sa-ba-ti-lla [zapatilla] | | |
| SIL-CA-L05-LIN-002 | Level5 | Ordena les síl·labes amb dibuix | sa-mar-re-ta [camiseta] · to-va-llo-la [toalla] · a-cor-di-ó [acordeon] · har-mò-ni-ca [armonica] · cas-ta-nyo-les [castanuelas] · re-ga-do-ra [regadera] | | |

## Segmentació lèxica: segmentacion-ca-level5-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-CA-L05-LIN-001 | Level5 | Separa les paraules | la mare el porta a l’escola cada dia · l’avi ens explica un conte abans de dormir · la meva cosina em deixa la seva bicicleta · els avis ens porten tomàquets del seu hort · quan arribo a casa el gos em saluda · la mestra vol que li portem els dibuixos | | |
| SEG-CA-L05-LIN-002 | Level5 | Separa les paraules | el gat s’amaga i la nena el busca · el meu germà m’ajuda a fer els deures · aquesta cançó m’agrada i la canto sovint · a la platja hi anirem tots junts demà · quan vegis l’àvia li dones aquesta carta · els cosins ens esperen a l’estació del tren | | |

## Llista de text: llista-ca-level5-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-CA-L05-LIN-001 | Level5 | Paraules molt llargues amb travada amb r | agricultura · cabefram · pa · electricitat · entrenador · sol · lupafre · profunditat · casa · paframom · patrimoni · atrevida | | |
| LIS-CA-L05-LIN-002 | Level5 | Paraules molt llargues amb travada amb l | multiplicar · no · catobler · responsable · classificar · la · nabiflol · publicitat · planificar · e · vaslegle · saludable | | |
| LIS-CA-L05-VEL-001 | Level5 | Paraules dels oficis | arquitecte · periodista · sopa · fotògrafa · electricista · sol · mecànica · científic · veterinari · pa · jardinera · escriptora | | |

## Parpelleig: blink-ca-level5-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-CA-L05-VEL-001 | Level5 | Paraules de tres síl·labes amb travada amb r | trompeta · a · programa · brolajat · setembre · sol · pregunta · jonofras · o · octubre | | |
| BLK-CA-L05-VEL-002 | Level5 | Paraules de tres síl·labes amb travada amb l | planeta · clarinet · no · gladoper · pa · aplaudir · flotador · e · lublamip · eclipsi | | |
| BLK-CA-L05-VEL-003 | Level5 | Paraules de tres síl·labes amb ny | castanya · la · banyera · nyolevas · so · aranya · sopunyo · pestanya · i · banyador | | |

## Repetició ràpida: repeticion-ca-level5-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-CA-L05-VEL-001 | Level5 | Repeteix ràpid: paraules llargues amb tg | personatge · letjolun · avantatge · mapa · sucotgel · homenatge (15 s) | | |

## Lectura en veu alta: lectura-ca-level5-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-CA-L05-VEL-001 | Level5 | Una nit al Montsec | Una nit d’estiu, la Jana i l’avi van anar al Montsec. Allà dalt hi ha un observatori per estudiar el cel. Perquè les estrelles es vegin bé, cal que no hi hagi núvols. Per sort, el cel estava net i ple de punts brillants. Una científica els va deixar mirar per un aparell enorme. Quan la Jana hi va mirar, va descobrir els anells de Saturn. De tornada, la Jana va dir que mai no oblidaria aquella nit. (43 s) | | |

## Matriu de discriminació visual: matriz-es-ca-level5-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-L05-PER-001 | Level5 | es: Encuentra todas las b / ca: Troba totes les b | objectiu b, 6×8, 1 rondes; ronda 1: d p n d g p u n q n p b q p b d u g b u p g b n g d q d b b q q q d b u g u n g b p u n d p n q | | |
| MAT-L05-PER-002 | Level5 | es: Encuentra todas las d / ca: Troba totes les d | objectiu d, 6×8, 1 rondes; ronda 1: d n d p u q n g b u q u q q n g q g p p p q n p b d g d n g u d d u b g u b d n n b b d g p q b | | |
| MAT-L05-PER-003 | Level5 | es: Encuentra todas las p / ca: Troba totes les p | objectiu p, 6×8, 1 rondes; ronda 1: d u p n p n q u q b u b q d n p b u b g p q p n p g d n g g d p g d d u p q b d q g n u n b g q | | |
| MAT-L05-PER-004 | Level5 | es: Encuentra todas las q / ca: Troba totes les q | objectiu q, 6×8, 1 rondes; ronda 1: q d u u q p b b b d n b p q g q g b n g g u n p u u d g q q u d p d g p q q b n p d n p d n b g | | |
| MAT-L05-PER-005 | Level5 | es: Encuentra todas las n / ca: Troba totes les n | objectiu n, 6×8, 1 rondes; ronda 1: n h u n h n h u h m h n u u u h m n m n m u u u n h u h m h h m m h u m m h m m n h m m u u h u | | |
| MAT-L05-PER-006 | Level5 | es: Encuentra todas las u / ca: Troba totes les u | objectiu u, 6×8, 1 rondes; ronda 1: n w w n w n m n m m u n n m u w m n w m m n n w u m w w u n m m w w m u u w w n n u m n m w m u | | |

## Posició d'imatges: imagenes-es-ca-level5-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-L05-MEM-001 | Level5 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): orella [oreja], braç [brazo], genoll [rodilla], nas [nariz], mà [mano]; grup 2 (pos. 2): cérvol [ciervo], tigre [tigre], guepard [guepardo], lleó [león], panda [panda]; grup 3 (pos. 4): bombeta [bombilla], escala [escalera], finestra [ventana], pinta [peine], matalàs [colchón]; grup 4 (pos. 3): rosquilla [rosquilla], patata [patata], coliflor [coliflor], hamburguesa [hamburguesa], ceba [cebolla]; grup 5 (pos. 3): paella [sartén], forn [horno], batedora [batidora], olla [olla], plat [plato] | | |
| IMG-L05-MEM-002 | Level5 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): cova [cueva], lluna [luna], flor [flor], foc [fuego], niu [nido]; grup 2 (pos. 3): corona [corona], botó [botón], corbata [corbata], bufanda [bufanda], sandàlia [sandalia]; grup 3 (pos. 2): carta [carta], roda [rueda], cadena [cadena], boia [boya], rasclet [rastrillo]; grup 4 (pos. 4): acordionista [acordeonista], fantasma [fantasma], camarògraf [camarógrafo], astronauta [astronauta], drac [dragón]; grup 5 (pos. 3): cacauet [cacahuete], salsitxa [salchicha], pizza [pizza], albergínia [berenjena], caramel [caramelo] | | |
| IMG-L05-MEM-003 | Level5 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): micròfon [micrófono], castanyoles [castañuelas], clarinet [clarinete], saxòfon [saxofón], tambor [tambor]; grup 2 (pos. 2): flamenc [flamenco], colom [paloma], perdiu [perdiz], cigne [cisne], tucan [tucán]; grup 3 (pos. 4): col [col], gelat [helado], carbassa [calabaza], bolet [seta], brioix [bollo]; grup 4 (pos. 3): aventurer [aventurero], cavernícola [cavernícola], picapedrer [picapedrero], paleta [albañil], bebè [bebé]; grup 5 (pos. 2): pintallavis [pintalabios], pes [pesa], corda [cuerda], moneda [moneda], medalla [medalla] | | |
| IMG-L05-MEM-004 | Level5 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): mosquit [mosquito], escarabat [escarabajo], marieta [mariquita], aranya [araña], abella [abeja]; grup 2 (pos. 2): campana [campana], paracaigudes [paracaídas], cadenat [candado], balança [balanza], canya [caña]; grup 3 (pos. 3): forquilla [tenedor], cistell [cesta], cassó [cazo], ganivet [cuchillo], cassola [cazuela]; grup 4 (pos. 2): branca [rama], cactus [cactus], palmera [palmera], núvol [nube], floc [copo]; grup 5 (pos. 4): cacau [cacao], maduixa [fresa], pera [pera], taronja [naranja], préssec [melocotón] | | |
| IMG-L05-MEM-005 | Level5 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): pebrot [pimiento], galeta [galleta], sopa [sopa], suc [zumo], iogurt [yogur]; grup 2 (pos. 2): regal [regalo], càmera [cámara], àncora [ancla], termòmetre [termómetro], fil [hilo]; grup 3 (pos. 3): llit [cama], calaix [cajón], penjador [percha], canelobre [candelabro], coixí [cojín]; grup 4 (pos. 4): os [hueso], cor [corazón], dent [diente], cama [pierna], boca [boca]; grup 5 (pos. 2): ruc [burro], gos [perro], toro [toro], porc [cerdo], gall [gallo] | | |
| IMG-L05-MEM-006 | Level5 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): pala [pala], dau [dado], peó [peón], maquineta [sacapuntas], tobogan [tobogán]; grup 2 (pos. 2): rinoceront [rinoceronte], serp [serpiente], granota [rana], elefant [elefante], llop [lobo]; grup 3 (pos. 4): televisió [televisión], catifa [alfombra], ordinador [ordenador], quadre [cuadro], calaixera [cómoda]; grup 4 (pos. 3): cremallera [cremallera], ulleres [gafas], sabata [zapato], llaç [lazo], vestit [vestido]; grup 5 (pos. 2): calamar [calamar], cranc [cangrejo], balena [ballena], corall [coral], tauró [tiburón] | | |

