# Banco de imágenes de Shine, lote 2 (ampliación para Level9 y Level10): prompt de generación

> Todo lo que sigue se pega en la herramienta de generación. Hay que adjuntar como imágenes de
> referencia las tres anclas del banco: `shine/content/images/gato.png`,
> `shine/content/images/manzana.png` y `shine/content/images/coche.png`.
>
> Generado el 2026-10-29 con `shine/content/generadores/imagenes_lote2.py` (encargo E09). Las
> fichas completas de cada imagen (sílabas, nivel lector, etiquetas, nombre catalán) están en
> `shine/content/images/manifest-lote2.json`.

---

Actúas como director de arte de **Shine**, una aplicación de ejercicios de lectura para niños y
jóvenes con dislexia (de 5 a 15 años). Ya existe un banco de 432 ilustraciones con un estilo fijo
(las tres imágenes adjuntas son sus anclas). Necesitamos **122 ilustraciones nuevas con
exactamente el mismo estilo**, para el ejercicio "Posición de imágenes" de los niveles más altos:
se muestran 6 ilustraciones en tarjetas numeradas, se ocultan y el alumno responde leyendo el
nombre escrito de una de ellas. En estos niveles las imágenes de un grupo **se parecen a propósito
en color o forma** (todas rojas, todas blancas, todas alargadas, todas personas), así que:

- el color o la forma indicados en la tabla son obligatorios y deben dominar la imagen;
- aun así, cada imagen tiene que reconocerse sin ninguna duda por sí sola: la prueba es "¿un
  chico de 14 años, viendo solo esta imagen, diría esta palabra y no otra?".

## 1. Estilo visual (igual en todas las imágenes y en todo el banco)

- **Tipo**: ilustración vectorial plana, estilo tarjeta educativa o libro ilustrado moderno. Nada
  de foto, 3D, acuarela, lápiz ni pixel art.
- **Trazo**: contorno limpio y continuo en gris carbón oscuro (#1E1E2E), grosor uniforme y medio.
  Formas redondeadas y simplificadas, sin detalles pequeños: la imagen se verá a 110 puntos.
- **Color**: colores planos, saturados pero suaves, como mucho una sombra plana por color. Sin
  degradados, texturas ni brillos. El objeto conserva su color natural; cuando la tabla indica un
  color, ese es el color principal del objeto.
- **Composición**: un solo objeto o personaje, entero (nunca cortado por el borde), centrado, de
  frente o en tres cuartos, a la misma escala aparente que las anclas. Sin fondo, sin escena, sin
  suelo, sin sombra proyectada, sin marco.
- **Personas**: cuerpo entero salvo que la pista diga lo contrario, expresión amable, sin rasgos
  caricaturescos de ninguna cultura; varía el tono de piel entre personajes; el género sigue al
  nombre (bailarina, animadora y pitonisa son mujeres; en el resto alterna). Se reconocen por sus
  atributos (el piloto por la gorra y el uniforme), nunca por un texto.
- **Prohibido en la imagen**: texto, letras, números (también en calendarios, cartas, dorsales y
  carteles), logotipos, marcas, marcas de agua, firmas, manos sosteniendo el objeto cuando no son
  de un personaje, varios objetos cuando la palabra es singular, flechas, bocadillos, armas, nada
  que asuste.

Bloque de estilo que se repite literalmente en cada generación, con {SUBJECT} = la pista visual de
la tabla:

```
Flat vector illustration of a single {SUBJECT}, children's educational flashcard style.
Clean continuous dark charcoal (#1E1E2E) outline of uniform medium weight, simple rounded shapes,
flat colors with at most one flat shade per color, no gradients, no textures.
The object keeps its natural, most recognizable colors. Whole object visible, centered,
front or three-quarter view, occupying about 70% of the canvas with clear margins on all sides.
Transparent background. No scene, no ground, no cast shadow, no frame, no border.
No text, no letters, no numbers, no logos, no watermark, no hands, no extra objects.
Friendly, calm, modern picture-book look; consistent with the reference images.
```

## 2. Formato técnico

| Parámetro | Valor |
|---|---|
| Generación | 1024 x 1024, calidad media, fondo transparente, salida png |
| Entrega | 512 x 512 píxeles, PNG de 8 bits por canal con canal alfa, sRGB, sin metadatos |
| Margen | recortar al contenido real (caja del alfa), centrar y rellenar hasta cuadrado con un margen transparente del 14 % por cada lado; el objeto ocupa como mucho el 72 % del alto; nunca se deforma |
| Canal alfa | todo alfa igual o mayor que 240 pasa a 255; todo alfa igual o menor que 16 pasa a 0; el borde intermedio se deja |
| Si no hay transparencia | fondo plano uniforme #F7F5F2, sin sombra, mismo margen; indicarlo en la entrega |
| Peso | menos de 120 KB por fichero |
| Nombre de fichero | exactamente el de la columna "fichero" + `.png` (minúsculas, sin tildes ni ñ, sin espacios ni guiones) |

## 3. Cómo trabajar

1. Genera **dos candidatas por palabra**, siempre con las tres anclas como referencia y el bloque
   de estilo.
2. Sigue el orden de la tabla: las **40 primeras son imprescindibles**; si la tirada se
   interrumpe, que estén esas.
3. Haz una **hoja de contacto** por cada 30 imágenes (rejilla con el nombre del fichero debajo de
   cada imagen; el nombre solo en la hoja, nunca dentro del PNG).
4. Elige una candidata por palabra con la prueba de la introducción. Rechaza si hay ambigüedad (la
   cacatúa no puede parecer un loro verde; la col no puede parecer una lechuga; el canario no
   puede ser un pollito amarillo; el bol tiene que estar vacío), si rompe el estilo, si lleva texto
   o cifras o si toca el borde. Regenera solo las rechazadas, con la pista ajustada, tres rondas
   como mucho; si no sale, descártala y anota el motivo.

## 4. Entrega

- La carpeta de imágenes con un PNG por palabra aceptada, con el nombre de la columna "fichero".
- Las hojas de contacto.
- Una lista corta de palabras descartadas con el motivo, y de pistas visuales cambiadas.

## 5. Lista de imágenes

| n.º | fichero (slug) | castellano | catalán | color o forma | pista visual ({SUBJECT}) |
|---|---|---|---|---|---|
| 1 | canario | canario | canari | amarillo, aves | a small bright yellow canary bird perched, side view (clearly different from a chick) |
| 2 | carpa | carpa | carpa | rojo | a circus big top tent with red and white vertical stripes and a small flag on top |
| 3 | carretilla | carretilla | carretó | rojo | an empty red one-wheel garden wheelbarrow, three-quarter view |
| 4 | cascabel | cascabel | picarol | amarillo, redondo | a single round golden jingle bell with a slit and a small loop on top |
| 5 | casco | casco | casc | amarillo, sombreros | a yellow construction hard hat, three-quarter view |
| 6 | coral | coral | corall | rojo, mar | a branch of red coral, upright |
| 7 | manguera | manguera | mànega | rojo | a red garden hose neatly coiled with a nozzle at one end |
| 8 | manopla | manopla | manyopla | rojo, ropa | a single red knitted mitten (thumb separate, other fingers together) |
| 9 | paleta | paleta | paleta | marrón | a wooden painter's palette with a thumb hole and a few round paint blobs |
| 10 | pasa | pasa | pansa | marrón | a single large wrinkled dark brown raisin |
| 11 | percha | percha | penjador | marrón | a wooden clothes hanger with a metal hook, empty |
| 12 | bacalao | bacalao | bacallà | blanco | a flat piece of dried salted cod, off-white with grey skin edge |
| 13 | bailarina | bailarina | ballarina | blanco, personas | a ballet dancer in a white tutu standing on tiptoe, friendly face |
| 14 | baraja | baraja | baralla | blanco | a neat stack of playing cards seen from the back, plain white backs with a simple border, no numbers or symbols |
| 15 | bata | bata | bata | blanco, ropa | a white lab coat with buttons, front view, no person |
| 16 | batidora | batidora | batedora | blanco | a white stick hand blender, upright |
| 17 | cacatua | cacatúa | cacatua | blanco, aves | a white cockatoo with a yellow crest, side view (clearly not a green parrot) |
| 18 | calamar | calamar | calamar | blanco, mar | a whole pale squid with tentacles, friendly eyes |
| 19 | camarografo | camarógrafo | camarògraf | personas | a camera operator holding a big video camera on the shoulder, full body |
| 20 | caminante | caminante | caminant | personas | a hiker with a backpack and a walking stick, full body |
| 21 | camionero | camionero | camioner | personas | a truck driver with a cap holding a steering wheel, full body, no truck |
| 22 | camisa | camisa | camisa | blanco, ropa | a white button-up shirt, front view, no person |
| 23 | camison | camisón | camisó | blanco, ropa | a long white nightgown, front view, no person |
| 24 | capilla | capilla | capella | blanco, edificios | a small white chapel with a bell gable and a wooden door, no religious symbols |
| 25 | capitan | capitán | capità | personas | a ship captain with a white peaked cap and a navy jacket, full body |
| 26 | caravana | caravana | caravana | blanco, vehículos | a white camper caravan trailer, side view, no car |
| 27 | cavernicola | cavernícola | cavernícola | personas | a friendly caveman in a fur tunic holding a wooden club pointed down, full body |
| 28 | ladrillo | ladrillo | maó | rojo | a single red clay brick, three-quarter view, no holes |
| 29 | matamoscas | matamoscas | matamosques | rojo, alargado | a red plastic fly swatter, upright |
| 30 | matrioska | matrioska | matrioixca | rojo | a single red Russian nesting doll with a painted face and flowers |
| 31 | paleontologo | paleontólogo | paleontòleg | personas | a paleontologist with a hat and a brush holding a fossil bone, full body |
| 32 | albanil | albañil | paleta | personas | a bricklayer with a trowel and a yellow helmet, full body |
| 33 | paracaidista | paracaidista | paracaigudista | personas | a skydiver hanging from an open parachute, full figure |
| 34 | parapentista | parapentista | parapentista | personas | a paraglider pilot under a curved colorful paraglider wing |
| 35 | patinador | patinador | patinador | personas | a roller skater with helmet and knee pads, full body |
| 36 | pianista | pianista | pianista | personas | a pianist sitting at a small piano, side view |
| 37 | picapedrero | picapedrero | picapedrer | personas | a stonemason with a hammer and chisel next to a block of stone |
| 38 | piloto | piloto | pilot | personas | an airline pilot with a cap and uniform, full body, no plane |
| 39 | piraguista | piragüista | piragüista | personas | a kayaker sitting in a kayak holding a double paddle, side view |
| 40 | pitonisa | pitonisa | pitonissa | personas | a friendly fortune teller with a headscarf and a crystal ball, upper body |
| 41 | ajo | ajo | all | blanco | a whole white garlic bulb |
| 42 | bol | bol | bol | redondo | an empty plain round bowl seen slightly from above |
| 43 | bollo | bollo | brioix | redondo, marrón | a round golden sweet bun |
| 44 | bombon | bombón | bombó | redondo, marrón | a single round chocolate bonbon |
| 45 | boya | boya | boia | redondo, rojo, mar | a round red floating buoy, no text |
| 46 | cacahuete | cacahuete | cacauet | marrón | a single whole peanut in its shell |
| 47 | candelabro | candelabro | canelobre | amarillo | a golden three-armed candelabrum with unlit candles |
| 48 | capibara | capibara | capibara | marrón | a brown capybara sitting, side view |
| 49 | caqui | caqui | caqui | redondo, naranja | a whole orange persimmon with its green calyx |
| 50 | castana | castaña | castanya | marrón | a single shiny brown chestnut with a pale base |
| 51 | castor | castor | castor | marrón | a beaver standing, side view, flat tail visible |
| 52 | cazo | cazo | cassó | rojo | a red kitchen saucepan with a long handle, empty |
| 53 | cazuela | cazuela | cassola | marrón, redondo | a round clay casserole dish with two handles, empty |
| 54 | cana | caña | canya | alargado | a fishing rod with reel and a short line, diagonal |
| 55 | colchon | colchón | matalàs | blanco | a single white mattress, three-quarter view, no bed frame |
| 56 | coliflor | coliflor | coliflor | blanco | a white cauliflower head with green leaves |
| 57 | cono | cono | con | rojo | a red traffic cone with white bands |
| 58 | copo | copo | floc | blanco | a single six-pointed snowflake, light blue outline on white |
| 59 | mango | mango | mango | rojo | a whole ripe mango fruit, red with a yellow area |
| 60 | mantel | mantel | estovalles | rojo, rayas | a folded red and white checked tablecloth |
| 61 | pantufla | pantufla | plantofa | marrón, calzado | a single brown house slipper |
| 62 | paracaidas | paracaídas | paracaigudes | blanco, cielo | an open white parachute with lines, no person |
| 63 | pastilla | pastilla | pastilla | blanco, redondo | one large round white tablet with a score line |
| 64 | panal | pañal | bolquer | blanco | a white baby's diaper, front view |
| 65 | panuelo | pañuelo | mocador | blanco | a folded white cloth handkerchief |
| 66 | perdiz | perdiz | perdiu | marrón, aves | a brown partridge, side view |
| 67 | peon | peón | peó | marrón | a single wooden chess pawn |
| 68 | pintalabios | pintalabios | pintallavis | rojo, alargado | an open red lipstick tube, upright, no brand |
| 69 | pinza | pinza | pinça | rojo | a single red plastic clothes peg |
| 70 | piruleta | piruleta | piruleta | rojo, redondo | a round red spiral lollipop on a white stick |
| 71 | acordeonista | acordeonista | acordionista | personas | an accordion player playing an accordion, full body |
| 72 | acrobata | acróbata | acròbata | personas | a circus acrobat doing a handstand, friendly |
| 73 | animadora | animadora | animadora | personas | a cheerleader with two pom-poms, full body |
| 74 | apicultor | apicultor | apicultor | personas | a beekeeper in a white suit and veiled hat holding a honeycomb frame |
| 75 | aventurero | aventurero | aventurer | personas | an explorer with a safari hat, backpack and binoculars, full body |
| 76 | abuelo | abuelo | avi | personas | a friendly grandfather with white hair and a cardigan, full body |
| 77 | cacao | cacao | cacau | marrón | a whole brown cocoa pod |
| 78 | cajon | cajón | calaix | marrón | a single wooden drawer pulled out on its own, with a knob |
| 79 | comoda | cómoda | calaixera | marrón | a wooden chest of drawers with three drawers |
| 80 | calendario | calendario | calendari | blanco | a white wall calendar with a spiral top and an empty grid, absolutely no numbers or letters |
| 81 | camilla | camilla | camilla | blanco | a white hospital stretcher on wheels, empty |
| 82 | canela | canela | canyella | marrón, alargado | two rolled cinnamon sticks tied together |
| 83 | carabela | carabela | caravel·la | marrón, vehículos, mar | an old wooden caravel ship with three masts and white sails (different from the small boat of the bank) |
| 84 | cartel | cartel | cartell | blanco | a blank white signboard on a post, no text |
| 85 | coca | coca | coca | marrón, alargado | a long flat Catalan sweet flatbread pastry with sugar and pine nuts |
| 86 | col | col | col | verde, redondo | a whole round green cabbage (clearly different from a lettuce) |
| 87 | escafandra | escafandra | escafandre | gris | an old brass and grey diving helmet with round windows |
| 88 | escalador | escalador | escalador | personas | a rock climber with helmet, harness and rope, full body |
| 89 | explorador | explorador | escolta | personas | a scout with a neckerchief and a wide-brimmed hat, full body |
| 90 | barrendero | barrendero | escombriaire | personas | a street sweeper with a broom and an orange vest, full body |
| 91 | escultor | escultor | escultor | personas | a sculptor with a chisel next to a small stone sculpture |
| 92 | mondadientes | mondadientes | escuradents | alargado | a single wooden toothpick, diagonal, enlarged |
| 93 | escudo | escudo | escut | gris | a plain grey medieval shield, no emblem |
| 94 | espaguetis | espaguetis | espaguetis | alargado, amarillo | a bundle of uncooked spaghetti tied together |
| 95 | espantapajaros | espantapájaros | espantaocells | personas | a friendly scarecrow with a straw hat on a wooden pole |
| 96 | esparrago | espárrago | espàrrec | verde, alargado | a single green asparagus spear |
| 97 | espatula | espátula | espàtula | gris, alargado | a grey kitchen spatula with a long handle |
| 98 | espia | espía | espia | personas | a friendly detective-style spy with a trench coat, hat and magnifying glass |
| 99 | espiga | espiga | espiga | amarillo, alargado | a single golden ear of wheat |
| 100 | cencerro | cencerro | esquella | gris | a grey metal cowbell with a leather strap |
| 101 | esqui | esquí | esquí | alargado | a pair of skis side by side, diagonal |
| 102 | esquiador | esquiador | esquiador | personas | a skier with goggles, poles and skis, full body |
| 103 | estalactita | estalactita | estalactita | alargado, gris | a single hanging stalactite, pointed down |
| 104 | estatua | estatua | estàtua | gris | a grey stone statue of a person standing on a small pedestal |
| 105 | estudiante | estudiante | estudiant | personas | a teenage student with a backpack holding books, full body |
| 106 | estufa | estufa | estufa | gris | a grey electric radiator heater on feet |
| 107 | gota | gota | gota | azul | a single blue water drop |
| 108 | llama | llama | llama | blanco | a white and beige llama, side view, friendly (the animal, not a flame) |
| 109 | malabarista | malabarista | malabarista | personas | a juggler juggling three balls, full body |
| 110 | maniqui | maniquí | maniquí | personas | a plain dressmaker mannequin on a stand, no face |
| 111 | maquinista | maquinista | maquinista | personas | a train driver with a striped cap and overalls, full body |
| 112 | corredor | corredor | maratonià | personas | a marathon runner running, with a race bib without any number |
| 113 | marinero | marinero | mariner | personas | a sailor with a white sailor cap and striped shirt, full body |
| 114 | marioneta | marioneta | marioneta | personas | a wooden string puppet hanging from its control bar |
| 115 | nabo | nabo | nap | blanco | a white turnip with a purple top and green leaves |
| 116 | nota | nota | nota | instrumentos | a single black musical note (eighth note), large |
| 117 | paciente | paciente | pacient | personas | a patient in a hospital gown with an arm in a sling, friendly |
| 118 | fregadero | fregadero | pica | gris | a grey kitchen sink with a tap, no cabinet |
| 119 | puerro | puerro | porro | verde, alargado | a single leek, white and green |
| 120 | tarro | tarro | pot | gris | an empty glass jar with a lid, no label |
| 121 | pozo | pozo | pou | gris | an old round stone well with a small roof and a bucket |
| 122 | saco | saco | sac | marrón | a full brown burlap sack tied at the top, no print |
