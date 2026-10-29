# Revisió: tanda 8, Level8 (castellà i català)

Estat: **pendent de revisió**. Els lots són a `shine/content/` i estan importats **sense publicar**; es publiquen quan el grup els aprovi.

Com revisar (protocol E12, `plans/contenido/encarrecs/E12-protocol-revisio.md`): a **Correcta** poseu `sí`, `no` o `amb canvis`, i a **Comentari** el canvi exacte. Criteri únic: un nen de l'edat del nivell (Level8 = 13 anys, 2n d'ESO) sense dificultats valoraria l'activitat "Bé així". Els registres amb dos idiomes es mostren una sola vegada (noms en català i, entre claudàtors, en castellà).

Contingut: 48 activitats, 24 en castellà i 24 en català, 6 per àrea i idioma (Funcions Executives ja té les 3 de Level8 aprovades). Totes passen la comprovació d'estructura, la porta lèxica (rang 20.000 més el rescat infantil) i la validació de l'importador. Cada activitat es construeix al voltant d'un grup de so i d'una dificultat, amb grups que no s'havien fet servir a Level7 (ll/y, h muda, p/b, m, l, f, ch en castellà; grafies g/j, x/ix, s sorda/s sonora, grafies b/v, tg/tj, h muda en català).

## Decisions que us demanem de validar

1. **Posició d'imatges de Level8**: cada grup comparteix una etiqueta visual del banc (mateix color o forma: vermell, rodó, marró, persones...), i aquí sí que poden anar juntes les parelles gairebé iguals. S'han deixat fora els oficis que vau treure de l'E09.
2. **Matrius de Level8 amb doble objectiu**: dues síl·labes travades que es confonen (bra i dra, pla i pra...), 4 de cada per ronda, entre les seves inversions i altres travades.
3. **Llistes de 15 elements** (8 paraules, 3 pseudoparaules, 4 alleujaments), com diu el catàleg a Level8; parpelleig de 12.
4. **Síl·labes sobrants que sonen igual** a "ordena les síl·labes": ll/y i h muda en castellà (yo per llo, os per hos), g/j i p/b en català, com la b/v que vau aprovar a Level7.
5. **Segmentació**: compostos i locucions que s'escriuen junts o separats (asimismo / a sí mismo, entorno / en torno, sinfín / sin fin, porvenir / por venir, mediodía / medio día, quehaceres / que hacer; sobretot / sobre tot, alhora / a l’hora, malgrat / de mal grat) i, en català, pronoms combinats amb ho i hi al costat de o/ho, a/ha, i/hi.
6. **Pseudoparaules fora del grup de so**: el banc no té grup b/v ni k/g a Level8 en català; s'han triat les que porten aquestes lletres d'altres grups. En castellà, frichaflamoban (14 lletres) és l'única altra pseudoparaula amb ch del banc.
7. **Lectures**: Ramón y Cajal (castellà; el premi Nobel sense dir que va ser compartit amb Golgi) i Eratòstenes (català). Paraules a mirar: avantprojecte, burocràcia, "de mal grat".

## Ordena les síl·labes: silabas-es-level8-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-ES-L08-LIN-001 | Level8 | Ordena las sílabas | a-yun-ta-mien-to · ma-yo-ri-ta-rio · sen-ci-lla-men-te · a-ma-ri-llen-to · ma-ra-vi-llo-so · de-sa-rro-lla-do | | |
| SIL-ES-L08-LIN-002 | Level8 | Ordena las sílabas | hos-pi-ta-li-dad · hu-mo-rís-ti-co · he-re-di-ta-rio · his-tó-ri-ca-men-te · hi-po-té-ti-co · des-ha-bi-ta-do | | |

## Segmentació lèxica: segmentacion-es-level8-v1.json (2 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-ES-L08-LIN-001 | Level8 | Separa las palabras | el pintor se retrató a sí mismo frente a un espejo · el museo abre los domingos y asimismo organiza talleres para escolares · los alumnos estudian las plantas y los animales de su entorno · los planetas del sistema solar giran en torno al sol · en la feria de ciencias había un sinfín de inventos curiosos · desde lo alto del faro se ve un mar sin fin | | |
| SEG-ES-L08-LIN-002 | Level8 | Separa las palabras | la ingeniera cree que la energía solar tiene mucho porvenir · los organizadores aseguran que lo mejor del festival está por venir · a mediodía el sol alcanza el punto más alto del cielo · la excursión por la sierra durará medio día como mucho · en casa nos repartimos todos los quehaceres de la semana · para el experimento hay que hacer varias mediciones de la temperatura | | |

## Llista de text: lista-es-level8-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-ES-L08-LIN-001 | Level8 | Palabras técnicas con p y b | problemático · cuprubampezu · moto · parábola · impermeable · ribropembura · dedo · publicación · aplicable · mesa · pinsbestrapa · imprescindible · tela · impenetrable · comprobación | | |
| LIS-ES-L08-LIN-002 | Level8 | Palabras técnicas con m | monosílabo · microscópico · sapo · meclamibralgu · metabolismo · nata · muclijanfril · magnetismo · atmosférico · pala · mamífero · moslisfubrerdi · luna · metamorfosis · milímetro | | |
| LIS-ES-L08-VEL-001 | Level8 | Lee rápido frases de ciencia y técnica | Los paneles solares transforman la luz del sol en electricidad sin producir humo ni ruido. · Al correr, el corazón late más deprisa para llevar oxígeno a los músculos del cuerpo. · Mamá pone la mesa. · Muchas ciudades plantan árboles en las calles, reduciendo así el calor de los meses de verano. · Algunos alumnos defienden el uniforme escolar porque evita comparaciones, aunque otros prefieren elegir su propia ropa. · La imprenta permitió copiar libros con rapidez, y así la lectura llegó a mucha más gente. · La moto de papá. · Ciertos robots clasifican los residuos de las plantas de reciclaje mediante cámaras y sensores. · En el espacio, los astronautas hacen ejercicio a diario para que sus huesos se mantengan fuertes. · Mete la pala. · Muchos relojes mecánicos antiguos se colocaron en torres para que toda la ciudad oyera las horas. · El barrio ha inaugurado una biblioteca nueva, que será gestionada por un grupo de vecinos voluntarios. · Mamá toma la sopa. · Los arquitectos estudian cómo entra la luz antes de decidir dónde colocar las ventanas. · Muchas pinturas prehistóricas de las cuevas fueron hechas con carbón y tierras de distintos colores. | | |

## Parpelleig: blink-es-level8-v1.json (3 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-ES-L08-VEL-001 | Level8 | Palabras largas con l | luminosidad · sol · longitudinal · lerilnirpleme · locomotora · pa · vonublumil · literalmente · mesa · lavandería · clodisodel · lubricante | | |
| BLK-ES-L08-VEL-002 | Level8 | Palabras largas con f | fosforescente · flositagra · la · filosofía · fertilizante · fuzapurmudraz · e · fotosíntesis · fermentación · no · nebanfremufo · fisiológico | | |
| BLK-ES-L08-VEL-003 | Level8 | Palabras largas con c, qu y k | equitativo · a · kilovatio · esquemático · becrenirqui · sopa · arqueólogo · durbisquigra · inequívoco · pato · zaseasplaqui · quebradizo | | |

## Repetició ràpida: repeticion-es-level8-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-ES-L08-VEL-001 | Level8 | Repite rápido: palabras largas con ch | chimenea · chifachirgro · archipiélago · frichaflamoban · sopa · caprichoso (20 s) | | |

## Lectura en veu alta: lectura-es-level8-v1.json (1 registres, es)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-ES-L08-VEL-001 | Level8 | Ramón y Cajal | Santiago Ramón y Cajal fue un científico español que dedicó su vida a estudiar el sistema nervioso. En su época, muchos investigadores creían que el cerebro era una red continua. Sin embargo, observando miles de muestras al microscopio, Cajal demostró que está formado por células independientes, las neuronas. Gracias a ese descubrimiento, fue reconocido con el premio Nobel. Además, dibujaba lo que veía con tanta precisión que sus láminas todavía aparecen en muchos libros de ciencia. (33 s) | | |

## Ordena les síl·labes: silabas-ca-level8-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-CA-L08-LIN-001 | Level8 | Ordena les síl·labes | ter-mi-no-lo-gi-a · di-li-gèn-ci-a · a-vant-pro-jec-te · es-tra-tè-gi-ca · ge-ne-ra-lit-zar · e-ner-gè-ti-ca | | |
| SIL-CA-L08-LIN-002 | Level8 | Ordena les síl·labes | su-pe-ri-o-ri-tat · ur-ba-nís-ti-ca · re-ci-pro-ci-tat · fi-a-bi-li-tat · re-tros-pec-ti-va · bu-ro-crà-ci-a | | |

## Segmentació lèxica: segmentacion-ca-level8-v1.json (2 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-CA-L08-LIN-001 | Level8 | Separa les paraules | els rèptils busquen el sol sobretot a primera hora del matí · la boira del matí es va estendre sobre tot el territori · alguns ocells poden mirar endavant i cap als costats alhora · si arribes a l’hora podràs veure l’eclipsi des del terrat · malgrat la pluja el concert a l’aire lliure va començar puntualment · de mal grat va acceptar que l’excursió s’ajornés una setmana | | |
| SEG-CA-L08-LIN-002 | Level8 | Separa les paraules | o t’ho explica la mestra o ho busques al diccionari · la investigadora ens ho ha explicat a tota la classe · al museu hi ha fòssils i n’hi ha de molt antics · em sembla que encara no us ho hem agraït prou · el riu baixa net i molts ocells s’hi acosten a beure · li ho he dit a la monitora i ho tindrà present | | |

## Llista de text: llista-ca-level8-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LIS-CA-L08-LIN-001 | Level8 | Tecnicismes amb dièresi | ambigüitat · benogüejon · casa · qüestionar · bilingüisme · e · pefigüemon · seqüències · sol · multilingüe · freqüentment · vesgüefimep · u · lingüista · conseqüent | | |
| LIS-CA-L08-LIN-002 | Level8 | Tecnicismes amb tg i tj | emmagatzematge · lluna · potgecanin · etiquetatge · camuflatge · a · encoratjar · tapevatge · aliatge · pa · curtmetratge · homenatjar · fancatjudom · sopa · arbitratge | | |
| LIS-CA-L08-VEL-001 | Level8 | Paraules d’estudi amb h | humanitat · habilitat · mapa · harmonia · historiador · hipòtesi · i · horitzontal · coherència · no · hivernacle · prehistòria · la · honestedat · hidràulica | | |

## Parpelleig: blink-ca-level8-v1.json (3 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-CA-L08-VEL-001 | Level8 | Paraules llargues amb x i ix | xemeneia · coleixenve · pa · aixecament · desconeixement · sol · digraixesa · renaixentista · e · deixalleria · neseleixolom · reeixida | | |
| BLK-CA-L08-VEL-002 | Level8 | Paraules llargues amb s sorda i sonora | travessia · u · gentilesa · dalissaton · ressonància · no · lofossitum · agosarat · escassetat · a · dossotabar · lluminositat | | |
| BLK-CA-L08-VEL-003 | Level8 | Paraules llargues amb b i v | irreversible · invencible · la · bacuvossodo · vibració · i · viabilitat · vipuberatgi · so · objectivitat · vomedellur · benvolguda | | |

## Repetició ràpida: repeticion-ca-level8-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-CA-L08-VEL-001 | Level8 | Repeteix ràpid: paraules llargues amb c i g | cartografia · guebocriter · lupa · gramatical · gosagüelcon · conglomerat (20 s) | | |

## Lectura en veu alta: lectura-ca-level8-v1.json (1 registres, ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| LEC-CA-L08-VEL-001 | Level8 | La mida de la Terra | Molta gent creu que antigament tothom pensava que la Terra era plana, però és un error. A l’antiga Grècia ja se sabia que era rodona, i el matemàtic Eratòstenes en va calcular la mida. Va observar que, el mateix dia al migdia, els objectes feien ombres diferents a dues ciutats d’Egipte. Si la Terra fos plana, totes dues ombres serien iguals; per tant, havia de ser corba. A partir d’aquesta diferència, va obtenir una xifra força propera a la real. (34 s) | | |

## Matriu de discriminació visual: matriz-es-ca-level8-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-L08-PER-001 | Level8 | es: Encuentra todas las bra y dra / ca: Troba totes les bra i dra | objectiu bra, dra, 4×8, 1 rondes; ronda 1: bar pra dar bar bla dra pra bra bla dra dar dra dar bar dra pra bar bar bla bla bra bla pra bra dar pra pra bla bra dar bar dar | | |
| MAT-L08-PER-002 | Level8 | es: Encuentra todas las pra y bra / ca: Troba totes les pra i bra | objectiu pra, bra, 4×8, 1 rondes; ronda 1: par pla bar par bra pla tra pla bra pla tra par tra bra pra pla bar pra par pra bar par bar bar tra tra bra pra par pla tra bar | | |
| MAT-L08-PER-003 | Level8 | es: Encuentra todas las pla y pra / ca: Troba totes les pla i pra | objectiu pla, pra, 4×8, 1 rondes; ronda 1: fla par par par pal bla par pra pra fla pla pal fla fla pal pla bla bla pal pla fla pal bla fla par pra bla pla pal bla par pra | | |
| MAT-L08-PER-004 | Level8 | es: Encuentra todas las tra y dra / ca: Troba totes les tra i dra | objectiu tra, dra, 4×8, 1 rondes; ronda 1: dra pra tar dra dar tar tar tar cra tra cra dra dar pra pra dar cra tra tra tra cra tar pra tar dar cra dra dar cra pra dar pra | | |
| MAT-L08-PER-005 | Level8 | es: Encuentra todas las gra y tra / ca: Troba totes les gra i tra | objectiu gra, tra, 4×8, 1 rondes; ronda 1: gar tra gra gar dra dra gra gla gla gla gar dra gla gra gra gar gar dra cra tra tra cra cra tra gla cra gar gla cra cra dra dra | | |
| MAT-L08-PER-006 | Level8 | es: Encuentra todas las dra y pra / ca: Troba totes les dra i pra | objectiu dra, pra, 4×8, 1 rondes; ronda 1: bra pra pra tra bra par pra dar bra dra par pra dra dar bra tra dra par tra par bra dar par tra tra dar bra tra dar par dar dra | | |

## Posició d'imatges: imagenes-es-ca-level8-v1.json (6 registres, es i ca)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-L08-MEM-001 | Level8 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): cigne [cisne], arròs [arroz], capella [capilla], iglú [iglú], cartell [cartel], camisó [camisón]; grup 2 (pos. 2): cavernícola [cavernícola], carter [cartero], piragüista [piragüista], cavaller [caballero], superheroi [superhéroe], princesa [princesa]; grup 3 (pos. 5): cactus [cactus], kiwi [kiwi], drac [dragón], cuc [gusano], saltamartí [saltamontes], dinosaure [dinosaurio]; grup 4 (pos. 4): plàtan [plátano], bombeta [bombilla], sol [sol], lleó [león], carta [carta], llimona [limón]; grup 5 (pos. 3): bales [canicas], brioix [bollo], pilota [balón], moneda [moneda], cirera [cereza], plat [plato]; grup 6 (pos. 3): patata [patata], cacau [cacao], cavall [caballo], camell [camello], capibara [capibara], cargol [caracol] | | |
| IMG-L08-MEM-002 | Level8 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): iogurt [yogur], coet [cohete], núvol [nube], cigonya [cigüeña], os [hueso], bata [bata]; grup 2 (pos. 2): lluna [luna], estrella [estrella], pluja [lluvia], planeta [planeta], paracaigudes [paracaídas], llamp [rayo]; grup 3 (pos. 2): violí [violín], xilòfon [xilófono], tambor [tambor], pandereta [pandereta], piano [piano], tuba [tuba]; grup 4 (pos. 5): patinador [patinador], avi [abuelo], paleta [albañil], pallasso [payaso], policia [policía], acròbata [acróbata]; grup 5 (pos. 4): mà [mano], panxa [barriga], ull [ojo], cama [pierna], nas [nariz], braç [brazo]; grup 6 (pos. 3): maquineta [sacapuntas], matamosques [matamoscas], magrana [granada], piruleta [piruleta], tulipa [tulipán], tomàquet [tomate] | | |
| IMG-L08-MEM-003 | Level8 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 2): plantofa [pantufla], penjador [percha], castanyoles [castañuelas], esquirol [ardilla], xocolata [chocolate], pal [palo]; grup 2 (pos. 3): lleopard [leopardo], guepard [guepardo], linx [lince], puma [puma], gat [gato], tigre [tigre]; grup 3 (pos. 3): torre [torre], escola [escuela], botiga [tienda], granja [granja], molí [molino], far [faro]; grup 4 (pos. 4): taronja [naranja], botó [botón], lupa [lupa], carbassa [calabaza], col [col], brúixola [brújula]; grup 5 (pos. 5): harmònica [armónica], bateria [batería], clarinet [clarinete], acordió [acordeón], arpa [arpa], guitarra [guitarra]; grup 6 (pos. 2): batedora [batidora], floc [copo], dent [diente], calendari [calendario], cuiner [cocinero], bolquer [pañal] | | |
| IMG-L08-MEM-004 | Level8 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 4): camió [camión], imant [imán], salsitxa [salchicha], cortina [cortina], paella [sartén], pintallavis [pintalabios]; grup 2 (pos. 5): eruga [oruga], pi [pino], fulla [hoja], llima [lima], meló [melón], serp [serpiente]; grup 3 (pos. 3): pop [pulpo], calamar [calamar], sirena [sirena], ona [ola], boia [boya], dofí [delfín]; grup 4 (pos. 3): roda [rueda], mandarina [mandarina], ceba [cebolla], rosquilla [rosquilla], globus [globo], pruna [ciruela]; grup 5 (pos. 2): capità [capitán], astronauta [astronauta], pilot [piloto], granger [granjero], camioner [camionero], picapedrer [picapedrero]; grup 6 (pos. 2): tren [tren], ambulància [ambulancia], bicicleta [bicicleta], excavadora [excavadora], cotxe [coche], avió [avión] | | |
| IMG-L08-MEM-005 | Level8 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 4): animadora [animadora], pianista [pianista], bomber [bombero], metge [médico], mag [mago], apicultor [apicultor]; grup 2 (pos. 3): corall [coral], cranc [cangrejo], cor [corazón], pinça [pinza], corbata [corbata], con [cono]; grup 3 (pos. 2): dit [dedo], llengua [lengua], cap [cabeza], cabell [pelo], ungla [uña], peu [pie]; grup 4 (pos. 5): canyella [canela], caixa [caja], peó [peón], perdiu [perdiz], cangur [canguro], bombó [bombón]; grup 5 (pos. 2): hipopòtam [hipopótamo], pedra [piedra], rinoceront [rinoceronte], foca [foca], coala [koala], tauró [tiburón]; grup 6 (pos. 3): trèvol [trébol], cocodril [cocodrilo], regadora [regadera], lloro [loro], enciam [lechuga], arbre [árbol] | | |
| IMG-L08-MEM-006 | Level8 | es: ¿Dónde estaba? / ca: On era? | grup 1 (pos. 3): autobús [autobús], copa [copa], formatge [queso], cadenat [candado], bústia [buzón], mel [miel]; grup 2 (pos. 5): sargantana [lagarto], tortuga [tortuga], granota [rana], follet [duende], cogombre [pepino], síndria [sandía]; grup 3 (pos. 2): peix [pez], gamba [gamba], xarxa [red], vaixell [barco], balena [ballena], cavallet [caballito]; grup 4 (pos. 2): matrioixca [matrioska], pebrot [pimiento], carpa [carpa], capa [capa], martell [martillo], marieta [mariquita]; grup 5 (pos. 3): bufanda [bufanda], pantalons [pantalón], abric [abrigo], vestit [vestido], pijama [pijama], banyador [bañador]; grup 6 (pos. 4): nen [nene], acordionista [acordeonista], aventurer [aventurero], rei [rey], fada [hada], paracaigudista [paracaidista] | | |

