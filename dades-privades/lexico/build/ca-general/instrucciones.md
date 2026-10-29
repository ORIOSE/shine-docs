# Revisió d'una tanda de la llista de freqüència general del català

Context: app de lectura per a nens i joves amb dislèxia (de 5 a 15 anys). La llista fa de porta
lèxica: el generador d'exercicis rebutja paraules per sobre del rang de freqüència del seu nivell.
**Norma: ortografia de l'IEC del 2017. Varietat: català central.**

Les freqüències vénen de wordfreq (Viquipèdia, subtítols, notícies, web i xarxes; tot el domini
lingüístic). Ja s'han fet aquests passos automàtics: els diacrítics antics coneguts s'han fusionat
amb la forma actual ("dóna" va a "dona"; columna `fusionadas`); els enclítics amb apòstrof s'han
sumat al verb ("dona'm" va a "dona"); les elisions són entrades pròpies ("l'", "d'"). El lema i la
categoria vénen de:
- `origen` = ud: el treebank UD AnCora català, anotat a mà (`ud_n` = aparicions; `otras` = altres
  lectures, en el format categoria:lema:aparicions).
- `origen` = diccionari: el diccionari de Softcatalà (LanguageTool). Si la forma hi té més d'una
  lectura, s'ha triat la del lema més freqüent; `otras` = altres lectures (categoria:lema).
- `origen` = pendiente: no hi ha lema ni categoria.
- `en_diccionari` = no: la forma no és al diccionari de Softcatalà, normatiu i molt complet. És un
  senyal fort de castellanisme, paraula d'una altra llengua, errada o forma no normativa.

Categories permeses: nom, verb, adj, adv, det, pron, prep, conj, interj, num, npropi.

## Què has de fer amb CADA fila de la teva tanda

1. **pendiente**: omplir lema i categoria (acció `completar`) o descartar la forma.
2. **ud** i **diccionari**: comprovar lema i categoria i corregir-los (`corregir`) si són erronis.
   La categoria ha de ser la lectura més freqüent de la forma en l'ús general. Desconfia sobretot
   de `ud_n` 1 o 2, dels npropi que en realitat són noms comuns d'un títol ("col·legi") i, a
   `diccionari`, de la tria automàtica entre lectures.
3. **descartar** (acció `descartar`, amb el motiu a `nota`):
   - paraules castellanes o d'altres llengües sense ús en català ("pero", "the");
   - castellanismes i barbarismes no normatius ("bueno", "vale", "pues", "osea"): nota
     `castellanisme`;
   - formes sense l'accent obligatori o amb una errada ("perque", "tambe"): nota
     `errada: forma correcta`;
   - sigles, abreviatures, lletres soltes (excepte "a", "e", "i", "o", "u"), jerga d'internet,
     onomatopeies de xat.
   No descartis noms propis: van com a npropi (persones, llocs, marques), encara que siguin
   estrangers.
4. **fusionar** (acció `fusionar`): una forma amb un **diacrític antic** que la fusió automàtica no
   ha agafat. A la columna `lema` hi poses la forma escrita segons la norma del 2017 (per exemple,
   "véns" amb `lema` = "vens"). Només conserven el diacrític: bé, déu, és, mà, més, món, pèl, què,
   sé, sí, sóc, sòl, són, té, ús, vós (i els seus plurals i compostos).
5. **marcar** (columna `marca`; es pot combinar amb completar o corregir; si només marques, acció
   `marcar`):
   - `malsonante`: vulgar, sexual, insult o tabú. Si és vocabulari de sexualitat, suïcidi o
     violència sexual, marca'l igual i posa "sensible" a `nota`.
   - `dialectal`: forma pròpia d'una varietat no central que en català central no es fa servir o
     és marcada: valencià ("xiquet", "eixir", "este", "vore", "hui", "parle" de primera persona,
     "cantara" d'imperfet de subjuntiu), balear ("al·lot", l'article salat "es" o "sa"),
     nord-occidental. Marca només si l'ús dominant de la forma no és el central.
   - `extranjera`: manlleu no adaptat freqüent en català ("online", "show").
   Diverses marques s'uneixen amb `+`.

Convenció de lemes (DIEC2): verbs en infinitiu; noms en singular; adjectius en masculí singular;
determinants i pronoms demostratius i possessius en masculí singular ("aquesta" → aquest, "meva"
→ meu); pronoms forts: "ella", "ells", "elles" → ell; "jo", "tu", "nosaltres", "vosaltres" són el
seu propi lema. Pronoms febles: totes les variants d'un pronom (em, me, m', 'm) van al lema de la
forma plena: em, et, es, el, la, els, les, li, ens, us, en, hi, ho. L'article "l'" → el; "d'" → de;
contraccions "al", "del", "pel", "als", "dels", "pels": lema la pròpia forma, categoria prep. Ela
geminada sempre amb punt volat (l·l).

## Sortida

Un fitxer TSV (UTF-8, tabulador, amb capçalera) NOMÉS amb les files que canvies, descartes,
fusiones o marques. Les files `ud` i `diccionari` que no hi surtin s'accepten tal com estan; TOTES
les `pendiente` hi han de sortir (completar o descartar).

```
forma	accion	lema	categoria	marca	nota
bueno	descartar				castellanisme
xiquet	marcar	xiquet	nom	dialectal	valencià
véns	fusionar	vens			diacrític antic
col·legi	corregir	col·legi	nom
```

- A `corregir`, `completar` i `marcar`, posa sempre lema i categoria finals (encara que no canviïn).
- A `fusionar`, `lema` = la forma actual; categoria i marca buides.
- A `descartar`, lema, categoria i marca buits; motiu breu a `nota`.
- Sense cometes, sense columnes de més, una fila per forma.

Llegeix la tanda sencera (unes 4.500 línies; llegeix-la per parts amb offset i limit) i revisa totes
les files, no només una mostra. No esborris ni sobreescriguis fitxers que no siguin el teu de
sortida, i no facis servir noms de fitxer temporals genèrics dins de `out/`. En acabar, respon
només amb el nombre de files del fitxer de sortida per acció i 5 casos dubtosos que convingui que
revisi un lingüista (forma i per què).
