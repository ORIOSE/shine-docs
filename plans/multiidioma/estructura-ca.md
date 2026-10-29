# Estructura catalana: decisiones de implementación

Fuente: plans/multiidioma/Shine en Catalán.md, entregado por el experto el 2026-10-26 como
respuesta a plans/multiidioma/estructura.md. Este fichero es la versión normalizada que usa el
equipo técnico: nombres definitivos de términos (únicos dentro de cada vocabulario), orden y
pesos del ciclo, nivel mínimo por estructura, y las decisiones tomadas donde el documento del
experto era ambiguo o se contradecía. Los datos que se importan en la plataforma están en
shine/scripts/phonology-terms.ca.json (términos) y en banco-imagenes-equivalencia-ca.csv
(fichas del banco de imágenes, borrador de Fable pendiente de revisión).

Lo que no se decide aquí: la tabla 2.3 catalana y el perfil lector 2.2 van tal cual al catálogo
(subplan 05, tarea 1), con la nota de fuente de frecuencias (CTILC o BDLOC).

---

## 1. Áreas (traducción del name de taxonomy areas, content_translation)

| Nombre en castellano (clave) | Nombre en catalán |
|---|---|
| Competencia Lingüística y Fonológica | Competència Lingüística i Fonològica |
| Rendimiento y Velocidad de Procesamiento | Rendiment i Velocitat de Processament |
| Memoria de Trabajo (Auditiva y Visual) | Memòria de Treball (Auditiva i Visual) |
| Funciones Ejecutivas y Atención | Funcions Executives i Atenció |
| Procesos Perceptivos (Discriminación Visual y Auditiva) | Processos Perceptius (Discriminació Visual i Auditiva) |

Ciclo: "Sílabas" se traduce como "Síl·labes" (traducción del término de activity_cycle).

## 2. Ciclo obligatorio "Síl·labes" (actividades de parpadeo ca con field_cycle y peso)

Mismo mecanismo que el castellano (catálogo 5.3): una actividad por familia, peso de 10 en 10,
Level0 y área Competencia Lingüística, 5 sílabas en orden, las mismas desordenadas y 3 palabras.

| Bloque | Familias | Actividades | Pesos |
|---|---|---|---|
| 1 Vocals | a e i o u | 1 | 10 |
| 2 Directes inicials | m, p, l, s, t, n, d | 7 | 20 a 80 |
| 3 Resta de directes | f, b/v, r, rr, ny, ll, j/g, z/c/ç, c/qu, g/gu, h, x | 12 | 90 a 200 |
| 4 Dígrafs propis | ss, ix, tx, ig, tg/tj | 5 | 210 a 250 |
| 5 Inverses | al el il ol ul, an en in on un, as es is os us, ar er ir or ur | 4 | 260 a 290 |
| 6 Travades amb l | pl, bl, cl, fl, gl | 5 | 300 a 340 |
| 7 Travades amb r | pr, br, cr, fr, gr, tr, dr | 7 | 350 a 410 |
| 8 Complexes i finals | codes ns, st, ts, cs, nc; ela geminada l·l; apòstrof l' i d' + vocal | 3 | 420 a 440 |

Unas 44 actividades. Dos cambios respecto al orden del experto, a confirmar (apartado 6): tx
pasa del bloque 3 al 4 (es africada medial o final, no una directa) y la ela geminada pasa del
bloque 4 al 8, porque su nivel mínimo es Level3 y el bloque 4 iba antes de las inversas (Level1).

## 3. Sonoridad (vocabulario sonority, términos con langcode ca)

Nombres definitivos. Los del experto eran identificadores (s_sorda, c_k_qu, x_ix_palatal); se
reescriben con el estilo castellano (letras separadas por barra) y, en el grupo de grafías, con
el prefijo "grafies" para que ningún nombre se repita dentro del vocabulario.

### 3.1 Consonants contínues (se mantiene y se amplía)

| Término | Descripción |
|---|---|
| m | Nasal bilabial prolongable (mà, mare). |
| l | Lateral alveolar prolongable (la, pala). |
| s sorda | Fricativa alveolar sorda: s, ss, c, ç (sol, sac, massa, cel, caça). |
| f | Fricativa labiodental sorda (foc, fada). |
| n | Nasal alveolar prolongable (nas, nit). |
| r | Vibrant alveolar simple o múltiple (rosa, pare, carro). |
| j/g | Fricativa postalveolar sonora: j davant a, o, u; g davant e, i (jardí, joc, gerani). No és la j castellana. |
| s sonora | Fricativa alveolar sonora: s entre vocals i z (casa, rosa, zero). Pròpia del català. |
| x/ix | Fricativa postalveolar sorda: x inicial i ix (xoc, xocolata, caixa, peix). |
| ny | Nasal palatal prolongable (vinya, nyap, pinya). |
| ll | Lateral palatal prolongable (lluna, vall, pollastre). |

### 3.2 Consonants oclusives i africades (cambia: ch desaparece, entran tx/ig y tg/tj; c, k y q se funden)

| Término | Descripción |
|---|---|
| p | Oclusiva bilabial sorda (pare, pa). |
| t | Oclusiva dental sorda (tota, te). |
| b | Oclusiva bilabial sonora (bosc, be). |
| d | Oclusiva dental sonora (dona, de). |
| c/qu/k | Oclusiva velar sorda: c davant a, o, u; qu davant e, i; k en manlleus (casa, quilo, quin). |
| g/gu | Oclusiva velar sonora: g davant a, o, u; gu davant e, i (gat, guió, guineu). |
| tx/ig | Africada postalveolar sorda: tx i ig final (cotxe, boig, mig). Substitueix la ch castellana. |
| tg/tj | Africada postalveolar sonora: tg davant e, i; tj davant a, o, u (metge, platja). |

### 3.3 Oposició sorda/sonora (se mantiene y se amplía)

| Término | Descripción |
|---|---|
| p/b | Oclusives bilabials: /p/ sorda, /b/ sonora (pala / bala). |
| t/d | Oclusives dentals: /t/ sorda, /d/ sonora (tos / dos). |
| k/g | Velars: /k/ (c, qu, k) sorda, /g/ (g, gu) sonora (cala / gala). |
| f/v | Labiodentals: /f/ sorda, /v/ sonora, en les varietats que distingeixen b i v (fi / vi). |
| s sorda/s sonora | Fricatives alveolars: s sorda (caça, passat) i s sonora (casa, zero). Parell mínim clau en català. |
| x/j | Palatals fricatives: x o ix sorda (xoc, caixa) i j o g sonora (joc, gerani). |
| tx/tg | Palatals africades: tx o ig sorda (cotxe, boig) i tg o tj sonora (metge, platja). |

### 3.4 Inconsistències grafema-fonema i homòfons (cambia por completo)

| Término | Descripción |
|---|---|
| grafies s/ss/c/ç | Sibilant sorda escrita s, ss, c o ç (sol, massa, cel, caça). |
| grafies c/qu/k | Velar sorda escrita c, qu o k (casa, quin, quilo). |
| grafies l/ll/l·l | Laterals escrites l, ll o l·l (color, lluna, col·legi). |
| grafies g/j | Palatal sonora escrita g davant e, i o j davant a, o, u (girafa, joc). |
| grafies x/ix | Palatal sorda escrita x o ix (xocolata, caixa). |
| grafies b/v | b i v sonen igual en català central (balena, vaca). |
| h muda | La h no sona (home, hora, hivern). |

## 4. Esfuerzo de decodificación (vocabulario decoding_effort, términos con langcode ca)

### 4.1 Esforç baix (se mantiene)

| Término | Descripción |
|---|---|
| Vocal aïllada (V) | a, e, i, o, u. Inclou l'atenció a la vocal neutra en posició àtona. |
| Directes inicials (CV) | Consonant + vocal amb m, p, l, s, t, n, d. |

### 4.2 Esforç mitjà (se mantiene y se añaden dígrafos y CVC)

| Término | Descripción |
|---|---|
| Directes resta (CV) | Consonant + vocal amb f, b/v, r, rr, ny, ll, j/g, z/c/ç, c/qu, g/gu, h, x. |
| Inverses (VC) | Vocal + consonant. Amb l: al, el, il, ol, ul. Amb n: an, en, in, on, un. Amb s: as, es, is, os, us. Amb r: ar, er, ir, or, ur. |
| Mixtes i finals (CVC) | Consonant + vocal + consonant, molt freqüents en català: gat, sol, cap, dit, pop. |
| Dígrafs simples | Lectura de ny, ll, ss, rr, qu, gu (pinya, lluna, tassa, carro, quin, guineu). |
| Dígrafs complexos | Lectura de tx, ig, tg, tj, ix (cotxe, boig, metge, platja, caixa). |

El experto proponía un solo término "Dígrafs i grafies pròpies" (ny, ll, l·l, ix, tx, tg, tj,
ig, ss, rr, gu, qu), pero su apartado 7 y su tabla 2.3 distinguen dígrafos simples (Level1),
complejos (Level2) y ela geminada (Level3). Como el nivel mínimo se fija por término, se
desglosa en tres (la ela geminada va en 4.3).

### 4.3 Esforç alt estructural (se mantiene y se añaden ela geminada y apostrofación)

| Término | Descripción |
|---|---|
| Travades amb l (CCV) | pl, bl, cl, fl, gl: pla, blau, clau, flor, globus. |
| Travades amb r (CCV) | pr, br, cr, fr, gr, tr, dr: pruna, brau, cranc, fred, gran, tren, drac. |
| Complexes (CCVC, VCC, CVCC) | Grups i codes complexos: plat, tram, ins, cons, trans, forts, temps, parcs. |
| Ela geminada (l·l) | Lectura de l·l (col·legi, il·lusió, libèl·lula). |
| Apostrofació i contraccions | Apostrofació (l'avi, d'un, m'ho) i contraccions (al, del, pel). Dificultat de segmentació pròpia del català. |

### 4.4 Esforç alt perceptiu (se mantiene y se añaden diacríticos)

| Término | Descripción |
|---|---|
| Mirall b-d | Reversibilitat horitzontal. |
| Mirall p-q | Reversibilitat horitzontal. |
| Mirall b-p | Reversibilitat vertical. |
| Mirall d-q | Reversibilitat vertical. |
| Rotació n-u | Gir de 180 graus. |
| Rotació m-w | Gir de 180 graus. |
| Grafies diacrítiques i especials | Discriminació de l·l davant ll, ç davant c, accent obert (à, è, ò) davant tancat (é, ó) i dièresi (ï, ü). |

## 5. Nivel mínimo en que aparece cada estructura (catalán)

| Término de esfuerzo (catalán) | Nivel mínimo | Ejemplos |
|---|---|---|
| Vocal aïllada (V), Directes inicials (CV) | Level0 | ma, pa, la, no, so |
| Directes resta (CV), Inverses (VC), Mixtes i finals (CVC), Dígrafs simples | Level1 | gat, pa, sol, cap, nyap, lluna |
| Travades amb l (CCV), Travades amb r (CCV), Dígrafs complexos | Level2 | pla, bra, tren, cotxe, metge |
| Complexes: CCVC | Level2 | plat, tren, drac |
| Complexes: VCC i CVCC | Level3 | temps, forts, trans, ins, verd, text, disc |
| Hiats | Level3 | piano, lleó, país, riure (terme afegit pel grup el 2026-10-29) |
| Complexes: monosílabos muy frecuentes con coda final simple (nt, rt, rm, st, mp, rc, rp, rn, lp, nc) | Level2 | dent, pont, font, porc, serp, forn, guant, talp, llamp, cranc, tronc; verbs surt, dorm |
| Excepción gramatical y morfológica: els, al, als, del, dels, pel, pels y plurales regulares en -ns y -ls de una base de Level1 o Level2 | Level2 | els nens, el pa dels avis, pans, trens, pals, galls (grupo de expertos, 2026-10-29) |
| Ela geminada (l·l), Apostrofació i contraccions | Level3 | col·legi, l'avi, d'un |
| Mirall, rotacions i grafies diacrítiques | Cualquiera | transversal |

Con que/qui en Level1 (grupo c/qu de "Directes resta") y gue/gui, güe/güi, qüe/qüi en Level2,
igual que en castellano (gue/gui en Level2).

## 6. Preguntas abiertas para el experto (respondidas el 2026-10-26)

Respuesta en plans/multiidioma/resposta-estructura-ca.md: las ocho decisiones confirmadas. La única
modificación es la excepción de la pregunta 4 (monosílabos muy frecuentes con coda final simple en
Level2, fila añadida en el apartado 5 y aplicada al CSV del banco). El CSV queda validado por el
experto. Se deja la lista original como registro.

1. Desglose de "Dígrafs i grafies pròpies" en Dígrafs simples (Level1), Dígrafs complexos
   (Level2) y Ela geminada (Level3), según su apartado 7.
2. Ciclo: tx al bloque 4 y ela geminada al bloque 8 (apartado 2).
3. que/qui en Level1 y gue/gui en Level2: su tabla 2.3 pone "gu/qu + e/i" en Level2 pero su
   apartado 7 pone c/qu y g/gu (Directes resta) en Level1.
4. Codas complejas (CVCC) en Level3: la regla deja en L3 palabras muy frecuentes del banco de
   imágenes (dent, pont, font, porc, serp, forn, guant, talp, llamp, cranc, tronc, elefant). Si
   se prefiere, un tramo Level2 para finales simples (nt, rt, lt, rc, st, mp) en monosílabos.
5. Hiatos en Level3: deja en L3 piano, lleó, avió, camió, coet, gàbia, bústia, marieta.
6. Silabeo de tx: la norma del IEC separa el dígrafo (cot-xe, pet-xi-na); su nota sobre el CSV
   decía mantenerlo unido. El CSV sigue el IEC.
7. Nombres de 3.4 con el prefijo "grafies" (en vez de s_sorda_grafies, k_q_c...).
8. Revisión del CSV del banco de imágenes: 423 fichas usables, 9 no usables (4 nombres que
   coinciden con otra imagen y 5 nombres de varias palabras o con guion), nivel lector calculado
   con la tabla 2.3 catalana (criterio en estructura.md, apartado 9.1).
