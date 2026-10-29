# E02. Llista general del català: proposta per revisar

**Estat**: feta per l'equip (Claude, model Opus) el 2026-10-28. Pendent de la revisió del grup
d'experts. Fins que no estigui revisada, la porta lèxica la fa servir, però cap lot es publica
només amb el seu aval.

## Què hi ha

`shine/private/lexico/ca-general.csv` (fora de git): **51.547 formes** del català, normalitzades a
l'ortografia de l'IEC del 2017. La forma del rang 20.000 (el límit de Level8) és "bàltic".

| Columna | Contingut |
|---|---|
| forma | minúscules, amb accents, dièresis i ela geminada amb punt volat (l·l) |
| lema | entrada de diccionari (criteri del DIEC2) |
| categoria | nom, verb, adj, adv, det, pron, prep, conj, interj, num, npropi |
| frecuencia | aparicions per milió de paraules |
| rango | posició per freqüència (1 = la més freqüent) |
| marca | buida, o malsonante, dialectal, extranjera (es poden combinar amb +) |
| anotacion | d'on surt el lema: ud (UD AnCora, anotat a mà), diccionari (Softcatalà), regla (elisions), opus (completat per Opus); amb "+opus" si Opus l'ha corregit |
| frecuencia_softcatala, rango_softcatala | les de la llista de Softcatalà, com a contrast |
| fusionadas | formes que s'han sumat a aquesta: diacrítics antics ("dóna") i enclítics ("dona'm") |
| en_diccionari | si la forma és al diccionari de Softcatalà |
| revisada | sí per a les 36.000 primeres formes, totes revisades per Opus |

Al costat hi ha la llicència (`ca-general.LLICENCIA.txt`) i cinc fitxers de revisió.

## D'on surt

- **Freqüències**: wordfreq, una llista oberta (CC BY-SA 4.0) que barreja Viquipèdia, subtítols,
  notícies, web i xarxes de tot el domini lingüístic. No surt del CTILC, que era la font
  recomanada, perquè no té exportació oberta. Les freqüències de Softcatalà són més netes, però el
  repositori no diu de quin corpus surten, i per traçabilitat les fem servir només de contrast. Si
  algú del grup pot exportar el CTILC, substituïm la columna de freqüència i conservem l'anotació.
- **Lema i categoria**: el treebank UD AnCora català (anotat a mà) quan té la forma, i si no, el
  diccionari de Softcatalà (el de LanguageTool), triant la lectura del lema més freqüent.
- **Revisió**: Opus ha revisat les 36.000 primeres formes en vuit tandes. N'ha completat 599, ha
  corregit 1.850 lemes o categories (sobretot pronoms febles i noms comuns que UD donava com a
  propis per sortir en títols, com "govern" o "col·legi"), n'ha descartat 2.610 i n'ha marcat 574.
  De la resta, s'han tret les 4.820 formes que no són al diccionari de Softcatalà.

### Com s'han aplicat els criteris de l'encàrrec

- **Ortografia del 2017**: 144 formes porten sumades les grafies antigues (fitxer de diacrítics).
  La conversió fa servir la classificació de Softcatalà: "dóna", "dónes", "vénen", "fóra", "cóm",
  "rés", "mòlta" i els compostos ("rodamón", "entresòl", "marededéu"), que amb la norma del 2017
  tampoc no porten accent. Conserven el diacrític bé, déu, és, mà, més, món, pèl, què, sé, sí, sòl,
  són, té, ús i vós. **Atenció**: la llista de l'encàrrec hi posava "seu" i "sóc" i hi faltaven
  "mà", "sé" i "sí". Hem seguit la norma: "sóc" s'escriu "soc" i s'ha sumat a "soc".
- **Apòstrofs i clítics**: les elisions són entrades pròpies ("l'", "d'", "m'", "n'", "s'", "t'"),
  com permet l'encàrrec. Les formes amb enclític no són entrades: "dona'm" i "deixa'ls" s'han sumat
  al verb, i "portar-se" ja ve separat. La porta lèxica treu l'apòstrof i busca la paraula base
  ("l'escola" troba "escola"; "posa't" troba "posa").
- **Ela geminada**: sempre amb punt volat; les poques formes amb punt normal ("col.legi") s'han
  sumat a la bona.
- **Una fila per forma**: wordfreq no separa la freqüència per categoria, així que cada forma
  porta la seva categoria principal, com preveu l'encàrrec per a aquest cas.

Respostes a les preguntes de l'encàrrec:

- **Rang**: la font dona freqüència, no rang; el rang l'hem calculat nosaltres, després dels
  descarts.
- **Categoria**: simplificada des de l'etiquetari UPOS d'UD i de l'etiquetari EAGLES del
  diccionari de Softcatalà.
- **Ortografia de la font**: barrejada (textos d'abans i de després del 2017); s'ha normalitzat
  com s'explica més amunt.

## Descarts (2.610 de les 36.000 revisades)

| Motiu | Formes |
|---|---|
| castellà, anglès o altres llengües | 1.255 |
| sigla o abreviatura | 606 |
| errada o falta d'accent | 463 |
| castellanisme ("bueno", "barco", "apretar") | 77 |
| lletres soltes, onomatopeies i altres | 209 |

## Què us demanem revisar, per ordre

1. **Mostra de qualitat** (`ca-general.revision-muestra.csv`, 300 formes a l'atzar d'entre les
   20.000 primeres): omplir "correcto (sí/no)" i, si no ho és, la correcció. Proposem acceptar la
   llista si hi ha com a màxim un 3 % d'errors (9 de 300).
2. **Marques** (`ca-general.revision-marcas.csv`, 574 formes): 260 dialectals, 141 malsonants i 173
   estrangerismes. Confirmar o treure cada marca. La marca no bloqueja la paraula: la porta l'avisa
   i qui fa el lot decideix.
3. **Descarts amb freqüència alta** (`ca-general.revision-descartes.csv`): n'hi ha prou amb les 74
   primeres files (20 per milió o més) i dir si se n'ha de recuperar alguna.
4. **Diacrítics i enclítics fusionats** (`ca-general.revision-diacritics.csv`, 144 formes):
   comprovar que cap fusió no ajunta dues paraules diferents.
5. **Correccions** (`ca-general.revision-cambios.csv`, 1.850 files): opcional; només si la mostra
   del punt 1 dona errors en files corregides.

## Criteris que ha de decidir el grup

Una línia de resposta per punt n'hi ha prou.

1. **Diacrítics**: confirmeu que la llista bona és la de la norma (sense "sóc" ni "seu", amb "mà",
   "sé" i "sí") i que els compostos van sense accent ("rodamon", "entresol").
2. **Formes vàlides que gairebé sempre són una errada o castellà**: "series" (de ser), "varem",
   "varies", "presencia", "creo", "beso", "reto", "regim", "anular". Són formes correctes, però al
   corpus quasi sempre són "sèries", "vàrem", "vàries", "presència", castellà o "anul·lar". Les tandes
   han fet servir criteris diferents. Proposta: descartar-les quan l'ús correcte és molt minoritari,
   perquè el generador mai no les farà servir en aquest sentit.
3. **Noms de lloc amb grafia castellana o estrangera** ("tokio", "nigeria", "austria", "palencia"):
   uns s'han descartat (en català, Tòquio, Nigèria, Àustria) i d'altres s'han conservat com a
   npropi. Proposta: descartar-los quan hi ha la forma catalana.
4. **Sigles d'organitzacions** ("psc", "erc", "fgc"): descartades. Per a l'app no hi ha
   diferència.
5. **Malsonant o sensible**: proposem separar `malsonante` (vulgar o insult) de `sensible` (actes
   sexuals, anatomia genital, suïcidi, violència sexual), i **no marcar els termes d'identitat**
   ("gai", "lesbiana", "bisexual"), que algunes tandes han marcat aplicant la regla al peu de la
   lletra.
6. **Dialectal**: s'han marcat formes valencianes ("xiquet", "este", "eixe", "hui", els subjuntius
   en -e com "busque" i l'accent tancat de "sorprés" o "estrés"), balears ("sa", "al·lot") i
   occidentals ("tomata"). D'acord amb el criteri? Casos dubtosos: "podis" (col·loquial central),
   "mos" (pronom "ens" en valencià i balear), "xic" (també central en "un xic").
7. **Col·loquialismes d'origen castellà**: "tio", "nòvio", "tonteria" s'han conservat; "barco",
   "apretar", "arrancar" s'han descartat. On posem la línia?
8. **Vocabulari infantil en un corpus d'adults**: queden molt avall paraules que un nen llegeix
   sense problema: "llapis" (8.263), "joguina" (11.322), "bolígraf" (15.281), "maduixa" (19.632),
   "tobogan" (21.371), "estoig" (24.038), "gronxador" (36.604). La mateixa proposta que per al
   castellà (E01, criteri 2): de Level3 en amunt, una paraula de la llista infantil (E04) es
   considera dins de rang.
9. **Formes flexionades rares**: "menjàvem" (30.513) i "jugàvem" (40.680) queden fora de rang
   fins a Level9. La mateixa pregunta que per al castellà (E01, criteri 3): ho deixem així o voleu
   una regla per lema?

## On tornar-ho

Els CSV de revisió omplerts (o les correccions en un document) i les respostes als nou criteris, a
`plans/contenido/encarrecs/lliuraments/E02-revisio-resposta.md`. Si la persona no té accés al
repositori, cal adjuntar-li els fitxers de `shine/private/lexico/` que comencen per `ca-general`.
