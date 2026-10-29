# E01. Llista general del castellà: proposta per revisar

**Estat**: versió 2, feta per l'equip (Claude, model Opus) el 2026-10-28 a partir del llistat del
CORPES XXI que ens heu passat. Pendent de la revisió del grup d'experts. Fins que no estigui
revisada, la porta lèxica la fa servir, però cap lot es publica només amb el seu aval.

## Què hi ha

`shine/private/lexico/es-general.csv` (fora de git): **87.611 formes** en 102.001 files. Totes les
formes amb 100 aparicions o més al CORPES XXI (0,22 per milió). Quan una forma té més d'una
categoria amb pes (com a mínim el 10 % dels usos), porta una fila per categoria amb la seva
freqüència ("hecho" verb i "hecho" nom), tal com demanava el criteri 5. El rang és el de la forma.

| Columna | Contingut |
|---|---|
| forma | minúscules, amb accents |
| lema | el del CORPES, corregit per Opus on era clarament erroni |
| categoria | nom, verb, adj, adv, det, pron, prep, conj, interj, num, npropi |
| frecuencia | aparicions per milió de paraules, sense comptar signes ortogràfics |
| rango | posició de la forma per freqüència (1 = la més freqüent), amb l'ajust de "vosotros" (més avall) |
| marca | buida, o malsonante, americano, extranjera (es poden combinar amb +) |
| etiqueta_font | l'etiqueta original del CORPES |
| frecuencia_wordfreq, rango_wordfreq | les de la versió 1 (subtítols, xarxes, web), com a contrast |
| frecuencia_subtlex, rango_subtlex | SUBTLEX-ESP, com a contrast (no compten per al rang) |
| rango_corpes, ajuste | el rang sense ajust i el motiu de l'ajust, si n'hi ha |
| revisada | sí si Opus ha revisat la forma (totes les de les 25.000 primeres posicions) |

Al costat hi ha la llicència (`es-general.LLICENCIA.txt`) i quatre fitxers de revisió.

## Com s'ha fet

1. **Freqüència, lema i categoria del CORPES XXI.** S'han tret la puntuació, les xifres, els
   elements en altres llengües (etiqueta F), els prefixos i els desconeguts. L'etiquetari del
   CORPES s'ha simplificat a les onze categories de l'encàrrec: els articles i els determinants van
   a det; els demostratius, quantificadors, possessius i interrogatius van a det o a pron segons
   l'etiqueta; els relatius i els clítics van a pron.
2. **Elements de diverses paraules.** El CORPES compta com un sol element els temps compostos
   ("ha sido"), les locucions ("sin embargo", "a través de") i els noms propis compostos ("Estados
   Unidos"). Són 10,5 milions d'aparicions. Com que el nen llegeix cada paraula, s'han repartit:
   l'auxiliar compta com a "haber" i el participi com el seu verb ("han" passa del rang 1.250 al
   61); les paraules de les locucions s'afegeixen a la seva categoria principal ("embargo" passa
   del 15.251 al 178); les dels noms propis compostos, com a npropi.
3. **Revisió d'Opus.** S'han reaprofitat els descarts i les marques de la versió 1, que havia
   revisat 35.804 formes. Opus ha revisat a més les 1.772 formes del CORPES de les 25.000 primeres
   posicions que la versió 1 no tenia, i n'ha corregit 14 lemes de l'etiquetador ("persiana" amb
   lema "persiano", "merluza" amb lema "merluzo").
4. **Ajust peninsular.** El CORPES és en bona part americà i deixa les formes de "vosotros" molt
   avall: "tenéis" hi té el rang 10.106, i "tienen", el 146. Per complir el criteri 3 (castellà
   peninsular), una forma verbal de segona persona del plural pren el rang de la seva equivalent
   de tercera (el mateix verb, temps i mode): "tenéis" pren el de "tienen". També "vosotros",
   "vosotras", "os" i "vuestro" prenen el d'"ustedes" (1.413). Afecta 82 formes i el rang original
   es conserva a `rango_corpes`.

Xifres: 1.198 descarts (sigles, abreviatures, lletres soltes, paraules d'altres llengües,
onomatopeies de transcripció oral), 814 marques (229 malsonants, 323 americanismes, 262
estrangerismes) i 82 ajustos de "vosotros".

Respostes a les preguntes de l'encàrrec:

- **Rang**: el CORPES dona recompte i freqüència normalitzada; el rang l'hem calculat nosaltres,
  després dels descarts.
- **Categoria**: simplificada des de l'etiquetari del CORPES (columna `etiqueta_font`).
- **Formes sense accent**: el CORPES és text editat i gairebé no en té. Per això no s'apliquen els
  descarts per falta de tilde de la versió 1: "publico" o "calculo" hi tenen la freqüència real del
  verb.
- **Varietat**: global (Espanya i Amèrica), amb l'ajust de "vosotros" del punt 4. El lèxic
  peninsular d'ús diari surt bé: "coche" al rang 1.204, "ordenador" al 3.402, "gafas" al 4.588,
  "coger" al 4.085.

## Què us demanem revisar, per ordre

1. **Mostra de qualitat** (`es-general.revision-muestra.csv`, 300 formes a l'atzar d'entre les
   20.000 primeres): omplir "correcto (sí/no)" i, si no ho és, la correcció. Proposem acceptar la
   llista si hi ha com a màxim un 3 % d'errors de lema o categoria (9 de 300).
2. **Marques** (`es-general.revision-marcas.csv`, 776 formes): confirmar o treure cada marca. La
   marca no bloqueja la paraula: la porta lèxica l'avisa i qui fa el lot decideix.
3. **Descarts amb freqüència alta** (`es-general.revision-descartes.csv`, ordenat per freqüència):
   n'hi ha prou amb les 27 primeres files (20 per milió o més) i dir si se n'ha de recuperar alguna.
4. **Discrepàncies** (`es-general.revision-discrepancias.csv`, 221 formes de les 20.000 primeres):
   formes on cap de les categories del CORPES coincideix amb la que va posar la revisió de la
   versió 1. Opcional; només si la mostra del punt 1 dona errors de categoria.

## Criteris que ha de decidir el grup

Una línia de resposta per punt n'hi ha prou.

1. **Ajust de "vosotros"** (punt 4 de "Com s'ha fet"): el validem, o preferiu una altra regla?
2. **Vocabulari infantil en un corpus d'adults**: el CORPES és premsa, assaig i novel·la, i hi
   queden molt avall paraules que un nen de 8 anys llegeix sense problema: "bolígrafo" (17.619),
   "estuche" (18.902), "melocotón" (31.551), "columpio" (34.316), "tobogán" (37.745). La llista
   infantil (E03) cobreix Level0 a Level2. Proposta: de Level3 en amunt, una paraula que sigui a la
   llista infantil es considera dins de rang, encara que el seu rang general sigui més alt.
3. **Formes flexionades rares**: la porta treballa per forma, com va demanar el grup
   ("comiéramos" pesa més que "comer"). L'efecte és que "jugábamos" (21.352) queda fora de rang
   fins a Level9. Ho deixem així o voleu una regla per lema (una forma s'accepta si el lema és dins
   del rang i el temps verbal és propi del nivell)?
4. **Veseig** ("tenés", "querés", "sos"): marcat americano. D'acord?
5. **Malsonant o sensible**: ara també es marca com a malsonant el vocabulari de sexualitat,
   anatomia genital, suïcidi i violència sexual ("semen", "suicidio", "violar"). Proposem separar-ho
   en dues marques: `malsonante` (vulgar o insult) i `sensible` (tema no apte per a l'edat).
6. **Paraules polisèmiques amb un sentit vulgar** ("perra", "zorra", "pelotas", "concha",
   "mariquita", "pito", "caca"): marcades "per si de cas". En castellà peninsular, en moltes el
   sentit neutre o infantil és el dominant. Quines traiem de la marca?
7. **Americanismes amb ús peninsular secundari** ("jugo", "cuadra", "enojar", "voltear", "acá",
   "lindo"): marcats americano. Quins traiem?
8. **Sigles d'institucions i mitjans** ("psoe", "tve", "ugt"): descartades. Per a l'app no hi ha
   diferència, perquè no surten en cap exercici. Les voleu com a npropi?
9. **Diminutius**: el CORPES no és coherent ("papelito" té el lema "papel", però "mesita" té el
   lema "mesita"). Proposta: lema del diminutiu = la base ("mesita" passa a "mesa"), perquè el lema
   serveix per comptar el sobreús.

## Contrast amb SUBTLEX-ESP

Les columnes `frecuencia_subtlex` i `rango_subtlex` porten SUBTLEX-ESP (Cuetos i col., 2011,
descarregat de l'OSF oficial el 2026-10-28). Cobreix el 93 % de les 20.000 primeres formes. Són
només de consulta: la llicència és CC BY-NC-SA 4.0 (no comercial) i, mentre no tinguem permís dels
autors, no entren en el rang de la porta lèxica. Són útils per a la decisió 2, perquè el
vocabulari infantil hi surt molt més amunt: "bolígrafo" al 6.676 (17.619 al CORPES), "melocotón" al
15.264 (31.551), "jugábamos" al 12.107 (21.352).

## On tornar-ho

Els tres CSV de revisió omplerts (o les correccions en un document) i les respostes als nou
criteris, a `plans/contenido/encarrecs/lliuraments/E01-revisio-resposta.md`. Si la persona no té
accés al repositori, cal adjuntar-li els fitxers de `shine/private/lexico/` que comencen per
`es-general`.
