# Taxonomia fonològica del català: sonoritat i esforç de decodificació

Versió catalana del vocabulari fonològic de Shine. És l’equivalent de
[Taxonomía fonológica.md](Taxonomía%20fonológica.md) (castellà) per a les activitats de lectura i
text en català, i la llegeix l’equip terapèutic català.

- **Font**: proposta de l’expert ([plans/multiidioma/Shine en Catalán.md](../../plans/multiidioma/Shine%20en%20Catalán.md),
  apartats 5 i 6) i les seves respostes ([resposta-estructura-ca.md](../../plans/multiidioma/resposta-estructura-ca.md)),
  normalitzades a [estructura-ca.md](../../plans/multiidioma/estructura-ca.md), apartats 3, 4 i 5,
  que és la versió que mana on els documents difereixen. Data: 2026-10-26.
- **Dades**: shine/scripts/phonology-terms.ca.json. Els termes s’importen a cada entorn amb
  `cd shine && ddev drush php:script scripts/create-phonology-terms.php -- ca` (idempotent: crea el
  que falta, corregeix pare, pes i descripció, mai no esborra). Són termes de contingut amb
  langcode ca als mateixos dos vocabularis que els castellans (sonority i decoding_effort), no
  traduccions: cada idioma té el seu joc. Els noms són únics dins de cada vocabulari i idioma,
  perquè l’importador de lots els referencia pel nom dins de l’idioma del registre
  (docs/exercise-catalog.md 3.5 i 4.3).
- **Com s’etiqueta**: sempre termes de segon nivell, mai el grup; diversos valors si l’activitat
  barreja material; només el material objectiu, no els elements d’alleujament. Consultar per grup
  és un filtre sobre el pare: `filter[field_sonority.parent.name]=Oposició sorda/sonora`.

El català té una ortografia menys transparent que el castellà: la vocal neutra, les sibilants
sorda i sonora, els dígrafs, l’ela geminada, l’apostrofació i els diacrítics allarguen la
decodificació. Per això els dos vocabularis conserven l’estructura castellana (quatre grups
cadascun) i s’amplien amb els termes propis del català.

## 1. Categorització per sonoritat (discriminació acústica i fonoarticulatòria)

Vocabulari sonority. Agrupa les lletres segons com es produeix el so a l’aparell fonador i
segons la semblança acústica. Serveix per entrenar la discriminació auditiva i corregir errors
de substitució fonètica.

### A. Consonants contínues i consonants oclusives i africades (mode d’articulació)

**Consonants contínues** (prolongables). El so es pot allargar sense tallar l’aire, com el de
les vocals ("mmmà"). Són les més fàcils per començar l’estimulació fonològica, perquè permeten
aïllar el so inicial. En català s’hi afegeixen la s sonora, la x i les palatals ny i ll.

| Terme | Lletres i exemples | Motiu |
|---|---|---|
| m | Nasal bilabial (mà, mare). | Prolongable; una de les primeres consonants que es llegeixen. |
| l | Lateral alveolar (la, pala). | Prolongable, d’articulació fàcil. |
| s sorda | Fricativa alveolar sorda: s, ss, c, ç (sol, sac, massa, cel, caça). | Prolongable; en català s’escriu de quatre maneres (vegeu el grup C). |
| f | Fricativa labiodental sorda (foc, fada). | Prolongable. |
| n | Nasal alveolar (nas, nit). | Prolongable. |
| r | Vibrant alveolar simple o múltiple (rosa, pare, carro). | Prolongable; la simple i la múltiple s’oposen entre vocals (pare / parra). |
| j/g | Fricativa postalveolar sonora: j davant a, o, u; g davant e, i (jardí, joc, gerani). | No és la j castellana: és un so sonor i palatal. Mateix so, dues grafies. |
| s sonora | Fricativa alveolar sonora: s entre vocals i z (casa, rosa, zero). | Pròpia del català; el castellà no la té. S’oposa a la s sorda (grup B). |
| x/ix | Fricativa postalveolar sorda: x inicial i ix (xoc, xocolata, caixa, peix). | Sorda i palatal; dues grafies per al mateix so. |
| ny | Nasal palatal (vinya, nyap, pinya). | Prolongable; dígraf d’alta freqüència des de 1r de Primària. |
| ll | Lateral palatal (lluna, vall, pollastre). | Prolongable; dígraf d’alta freqüència. No confondre amb l·l (grup C i esforç). |

**Consonants oclusives i africades** (discontínues, breus o explosives). Tallen l’aire del tot o
en part i no es poden allargar; demanen més precisió auditiva per captar-les aïllades. Canvia
respecte al castellà: desapareix la ch, entren les africades tx/ig i tg/tj, i c, k i q es fonen
en un sol terme perquè representen el mateix so.

| Terme | Lletres i exemples | Motiu |
|---|---|---|
| p | Oclusiva bilabial sorda (pare, pa). | Breu; parella de b. |
| t | Oclusiva dental sorda (tota, te). | Breu; parella de d. |
| b | Oclusiva bilabial sonora (bosc, be). | Breu; en català central sona igual que la v. |
| d | Oclusiva dental sonora (dona, de). | Breu. |
| c/qu/k | Oclusiva velar sorda: c davant a, o, u; qu davant e, i; k en manlleus (casa, quilo, quin). | Un so, tres grafies: la u de qu no sona. |
| g/gu | Oclusiva velar sonora: g davant a, o, u; gu davant e, i (gat, guió, guineu). | Un so, dues grafies: la u de gu no sona (sí amb dièresi: güe, güi). |
| tx/ig | Africada postalveolar sorda: tx i ig final (cotxe, boig, mig). | Substitueix la ch castellana; tx és medial o final, ig és final. |
| tg/tj | Africada postalveolar sonora: tg davant e, i; tj davant a, o, u (metge, platja). | Parella sonora de tx; el castellà no la té. |

### B. Oposició sorda/sonora (confusió per punt d’articulació idèntic)

Parells que s’articulen al mateix punt de la boca i només es diferencien en si vibren o no les
cordes vocals. És una causa freqüent de substitucions fonètiques. El català hi afegeix els
parells de sibilants i de palatals, que el castellà no té.

| Terme | Exemples | Motiu |
|---|---|---|
| p/b | Oclusives bilabials: /p/ sorda, /b/ sonora (pala / bala). | Mateix punt, només canvia la sonoritat. |
| t/d | Oclusives dentals: /t/ sorda, /d/ sonora (tos / dos). | Ídem. |
| k/g | Velars: /k/ (c, qu, k) sorda, /g/ (g, gu) sonora (cala / gala). | Ídem, amb les grafies de cada so. |
| f/v | Labiodentals: /f/ sorda, /v/ sonora, en les varietats que distingeixen b i v (fi / vi). | En català central la v sona com la b; el parell val per a les varietats distingidores. |
| s sorda/s sonora | Fricatives alveolars: s sorda (caça, passat) i s sonora (casa, zero). | Parell mínim clau en català (caça / casa); el castellà no el té. |
| x/j | Palatals fricatives: x o ix sorda (xoc, caixa) i j o g sonora (joc, gerani). | Mateix punt palatal, només canvia la sonoritat. |
| tx/tg | Palatals africades: tx o ig sorda (cotxe, boig) i tg o tj sonora (metge, platja). | Ídem per a les africades. |

### C. Inconsistències grafema-fonema i homòfons

Grups on lletres diferents representen el mateix so en català, o lletres que no sonen. Confonen
la ruta fonològica i l’ortogràfica. Canvia del tot respecte al castellà. Tots els noms porten el
prefix "grafies" (menys "h muda") perquè cap nom no es repeteixi dins del vocabulari: la unitat
fonètica (per exemple "s sorda") i les seves representacions ortogràfiques són termes diferents.

| Terme | Grafies i exemples | Motiu |
|---|---|---|
| grafies s/ss/c/ç | Sibilant sorda escrita s, ss, c o ç (sol, massa, cel, caça). | Quatre grafies per a un so; la ç i la ss no existeixen en castellà. |
| grafies c/qu/k | Velar sorda escrita c, qu o k (casa, quin, quilo). | La u de qu no es llegeix. |
| grafies l/ll/l·l | Laterals escrites l, ll o l·l (color, lluna, col·legi). | La l·l es llegeix com una l llarga, no com la ll: la convenció del punt volat és la dificultat. |
| grafies g/j | Palatal sonora escrita g davant e, i o j davant a, o, u (girafa, joc). | Mateix so, dues grafies segons la vocal. |
| grafies x/ix | Palatal sorda escrita x o ix (xocolata, caixa). | La i de ix no es llegeix com a vocal. |
| grafies b/v | b i v sonen igual en català central (balena, vaca). | Homòfons ortogràfics. |
| h muda | La h no sona (home, hora, hivern). | Lletra sense so. |

## 2. Categorització per esforç de decodificació (càrrega i estructura)

Vocabulari decoding_effort. Classifica els estímuls segons l’esforç de processament visual, la
complexitat de l’estructura sil·làbica i la càrrega de memòria de treball. Descriu el material i
**no substitueix** el nivell de l’activitat (field_activity_level): té quatre trams i l’escala de
nivells en té onze. La taula de l’apartat 3 diu a quin nivell mínim apareix cada estructura.

### A. Esforç baix (estructures directes simples i alta freqüència)

Exemples: ma, pa, la, so, tu, na; sopa, poma, mà, nina.

| Terme | Lletres i exemples | Motiu |
|---|---|---|
| Vocal aïllada (V) | a, e, i, o, u. Inclou l’atenció a la vocal neutra en posició àtona. | Nucli sil·làbic; en català la a i la e àtones sonen igual (vocal neutra), i la o àtona sona u. |
| Directes inicials (CV) | Consonant + vocal amb m, p, l, s, t, n, d. | Primeres consonants, d’articulació fàcil i alta freqüència. |

### B. Esforç mitjà (resta de directes, inverses, mixtes i dígrafs)

Exemples: sol, gat, cap, pilota, pinya, cotxe. Es manté el tram castellà i s’hi afegeixen les
estructures CVC, molt freqüents en català, i els dígrafs en dos termes.

| Terme | Lletres i exemples | Motiu |
|---|---|---|
| Directes resta (CV) | Consonant + vocal amb f, b/v, r, rr, ny, ll, j/g, z/c/ç, c/qu, g/gu, h, x. | Consonants complexes o inconsistents; inclou que/qui (Level1). |
| Inverses (VC) | Vocal + consonant. Amb l: al, el, il, ol, ul. Amb n: an, en, in, on, un. Amb s: as, es, is, os, us. Amb r: ar, er, ir, or, ur. | Estructura VC, molt freqüent en la lectura catalana. |
| Mixtes i finals (CVC) | Consonant + vocal + consonant, molt freqüents en català: gat, sol, cap, dit, pop. | El català té molts monosíl·labs acabats en consonant. |
| Dígrafs simples | Lectura de ny, ll, ss, rr, qu, gu (pinya, lluna, tassa, carro, quin, guineu). | S’introdueixen a 1r de Primària (Level1). |
| Dígrafs complexos | Lectura de tx, ig, tg, tj, ix (cotxe, boig, metge, platja, caixa). | Africats o amb i muda: demanen més maduració fonològica i control perceptiu (Level2). |

L’expert proposava un sol terme "Dígrafs i grafies pròpies"; es desglossa en simples, complexos i
ela geminada (tram C) perquè el nivell mínim es fixa per terme (resposta 1 de l’expert).

### C. Esforç alt estructural (travades i estructures complexes)

Exemples: plat, tren, blau, temps, forts, col·legi, l’avi. Es manté el tram castellà i s’hi
afegeixen l’ela geminada i l’apostrofació.

| Terme | Lletres i exemples | Motiu |
|---|---|---|
| Travades amb l (CCV) | pl, bl, cl, fl, gl: pla, blau, clau, flor, globus. | Sinfons amb l. |
| Travades amb r (CCV) | pr, br, cr, fr, gr, tr, dr: pruna, brau, cranc, fred, gran, tren, drac. | Sinfons amb r. |
| Complexes (CCVC, VCC, CVCC) | Grups i codes complexos: plat, tram, ins, cons, trans, forts, temps, parcs. | Codes dobles i grups inicials amb coda. |
| Ela geminada (l·l) | Lectura de l·l (col·legi, il·lusió, libèl·lula). | A més de la pronúncia, cal reconèixer la convenció ortogràfica del punt volat (Level3). |
| Apostrofació i contraccions | Apostrofació (l’avi, d’un, m’ho) i contraccions (al, del, pel). | Dificultat de segmentació pròpia del català: la paraula escrita no coincideix amb la unitat lèxica. |

### D. Esforç alt perceptiu (lletres mirall, rotacions i grafies diacrítiques)

Comparteixen trets gràfics i només canvia l’orientació o un signe. Pugen l’esforç atencional i
perceptiu sigui quina sigui l’estructura sil·làbica, i per això no tenen nivell mínim. S’amplia
amb els signes diacrítics i l’ela geminada.

| Terme | Descripció |
|---|---|
| Mirall b-d | Reversibilitat horitzontal. |
| Mirall p-q | Reversibilitat horitzontal. |
| Mirall b-p | Reversibilitat vertical. |
| Mirall d-q | Reversibilitat vertical. |
| Rotació n-u | Gir de 180 graus. |
| Rotació m-w | Gir de 180 graus. |
| Grafies diacrítiques i especials | Discriminació de l·l davant ll, ç davant c, accent obert (à, è, ò) davant tancat (é, ó) i dièresi (ï, ü). |

## 3. Nivell mínim en què apareix cada estructura

Per al generador de contingut: una activitat no pot usar una estructura per sota del seu nivell
mínim; sí que pot usar-ne de nivells inferiors. Taula de l’apartat 5 d’estructura-ca.md,
confirmada per l’expert, amb l’excepció dels monosíl·labs (resposta 4).

| Terme d’esforç | Nivell mínim | Exemples |
|---|---|---|
| Vocal aïllada (V), Directes inicials (CV) | Level0 | ma, pa, la, no, so |
| Directes resta (CV), Inverses (VC), Mixtes i finals (CVC), Dígrafs simples | Level1 | gat, pa, sol, cap, nyap, lluna; que, qui |
| Travades amb l (CCV), Travades amb r (CCV), Dígrafs complexos | Level2 | pla, bra, tren, cotxe, metge; gue, gui, güe, güi |
| Complexes: CCVC | Level2 | plat, tren, drac |
| Complexes: VCC i CVCC, també en monosíl·labs | Level3 | temps, forts, trans, ins, parcs, dent, porc, gust, camp |
| Excepció gramatical i morfològica: els, al, als, del, dels, pel, pels i plurals regulars en -ns i -ls d’una base de Level1 o Level2 | Level2 | els nens, pans, trens, pals, galls |
| Ela geminada (l·l), Apostrofació i contraccions | Level3 | col·legi, l’avi, d’un |
| Hiats | Level3 | pi-a-no, lle-ó, a-vi-ó, co-et |
| Mirall, rotacions i grafies diacrítiques | Qualsevol | transversal: l’esforç perceptiu no depèn de l’estructura |

Les codes dobles d’arrel (-nt, -rt, -st, -mp, -rc, -sc, -xt...) són de Level3 també en els
monosíl·labs (dent, pont, porc, serp, gust, camp). L’excepció de monosíl·labs freqüents a Level2
del 2026-10-27 la va retirar el grup el 2026-10-29: a Level2 les úniques excepcions de coda són les
formes gramaticals (els, al, als, del, dels, pel, pels) i els plurals regulars en -ns i -ls.

## 4. El que és propi del català

- **Vocal neutra**: en català central, a i e àtones sonen igual ([ə]) i la o àtona sona u. Un
  nen pot llegir "pare" i "para" amb la mateixa vocal final: l’ortografia no es dedueix del so.
  Per això el terme "Vocal aïllada (V)" ja inclou l’atenció a la vocal neutra, i el domini de les
  àtones (a/e, o/u) forma part del perfil lector de Level4.
- **Sibilants sorda i sonora**: la s sonora (casa, zero) no existeix en castellà, i la sorda
  s’escriu de quatre maneres (s, ss, c, ç). El parell caça / casa és el parell mínim clau.
- **Palatals**: j/g (sonora) i x/ix (sorda) són fricatives; tx/ig (sorda) i tg/tj (sonora) són
  africades. Ni la j ni la x sonen com en castellà.
- **Dígrafs simples** (ny, ll, ss, rr, qu, gu; Level1) i **complexos** (tx, ig, tg, tj, ix;
  Level2): la distinció és clínica, no ortogràfica. En el silabeig normatiu de l’IEC, els dígrafs
  tx, ix, ig, tg, tj, ss, rr i l·l se separen entre síl·labes (cot-xe, cai-xa, met-ge, tas-sa,
  col-le-gi) i ny, ll, qu i gu van units (pi-nya, llu-na, quin, gui-neu): el reordenament de
  síl·labes segueix l’IEC perquè és el que s’exigeix a l’escola (resposta 6 de l’expert).
- **Ela geminada (l·l)**: so de l llarga i convenció del punt volat (U+00B7). Nivell mínim
  Level3; en la matriu de discriminació visual, l·l davant ll és un estímul perceptiu vàlid a
  qualsevol nivell.
- **Apostrofació i contraccions** (l’avi, d’un, m’ho; al, del, pel): dificultat de segmentació
  que el castellà no té. Apareixen a Level3; la segmentació lèxica les treballa des d’aquest
  nivell.
- **Diacrítics**: accent obert (à, è, ò) davant tancat (é, ó), dièresi (ï, ü) i ç. Són estímuls
  del tram perceptiu, sense nivell mínim.
- **Monosíl·labs i codes**: el català té moltes més paraules acabades en consonant (gat, sol,
  cap, temps) que el castellà; d’aquí el terme "Mixtes i finals (CVC)" a Level1 i l’excepció dels
  monosíl·labs amb coda doble a Level2.

## 5. Resum de fitxes per a Drupal

Els noms són exactament els dels termes de segon nivell (phonology-terms.ca.json), agrupats pel
nom del seu pare. Per etiquetar un lot (clau sonoridad i esfuerzo del registre, docs/exercise-catalog.md 4.3)
s’usen aquests noms dins de l’idioma ca.

```json
{
  "langcode": "ca",
  "sonority": {
    "Consonants contínues": ["m", "l", "s sorda", "f", "n", "r", "j/g", "s sonora", "x/ix", "ny", "ll"],
    "Consonants oclusives i africades": ["p", "t", "b", "d", "c/qu/k", "g/gu", "tx/ig", "tg/tj"],
    "Oposició sorda/sonora": ["p/b", "t/d", "k/g", "f/v", "s sorda/s sonora", "x/j", "tx/tg"],
    "Inconsistències grafema-fonema i homòfons": ["grafies s/ss/c/ç", "grafies c/qu/k", "grafies l/ll/l·l", "grafies g/j", "grafies x/ix", "grafies b/v", "h muda"]
  },
  "decoding_effort": {
    "Esforç baix": ["Vocal aïllada (V)", "Directes inicials (CV)"],
    "Esforç mitjà": ["Directes resta (CV)", "Inverses (VC)", "Mixtes i finals (CVC)", "Dígrafs simples", "Dígrafs complexos"],
    "Esforç alt estructural": ["Travades amb l (CCV)", "Travades amb r (CCV)", "Complexes (CCVC, VCC, CVCC)", "Ela geminada (l·l)", "Apostrofació i contraccions"],
    "Esforç alt perceptiu": ["Mirall b-d", "Mirall p-q", "Mirall b-p", "Mirall d-q", "Rotació n-u", "Rotació m-w", "Grafies diacrítiques i especials"]
  }
}
```

En total, 4 grups i 33 termes de sonoritat i 4 grups i 19 termes d’esforç (60 termes amb els
grups), davant dels 28 i 18 del castellà. Correspondències amb el castellà que convé recordar en
compartir material entre idiomes: "s sorda" cobreix la s castellana i la z/c; "c/qu/k" fon c, k i
q; "tx/ig" substitueix ch; "j/g" no equival a la j castellana; "Mixtes i finals (CVC)" és "Mixtas
(CVC)"; els dígrafs, l’ela geminada i l’apostrofació no tenen equivalent.

## Verificació (2026-10-26)

Entorn local (DDEV), després d’importar els termes amb el script.

- `ddev drush php:script scripts/create-phonology-terms.php -- ca`: "creado: 0, actualizado: 0,
  sin cambios: 60" (33 termes i 4 grups de sonoritat, 19 termes i 4 grups d’esforç).
- Comparació de la base de dades amb el JSON (noms i pares): sonority ca 37 esperats, 37 a la
  BD, iguals; decoding_effort ca 23 esperats, 23 a la BD, iguals. Els castellans no s’han tocat:
  sonority es 28 i decoding_effort es 18, iguals al JSON castellà.
- JSON:API com a usuari normal (uid 2, account_switcher i sub-request, gotcha 14 de CLAUDE.md):
  - `GET /jsonapi/taxonomy_term/sonority?filter[langcode]=ca`: 200, 37 resultats (els 33 termes
    més els 4 grups; la col·lecció retorna els dos nivells).
  - `...&filter[parent.name]=Oposició sorda/sonora`: 200, 7 resultats (f/v, k/g, p/b,
    s sorda/s sonora, t/d, tx/tg, x/j).
  - `GET /jsonapi/taxonomy_term/decoding_effort?filter[langcode]=ca`: 200, 23 resultats.
  - `GET /jsonapi/node/activity_blink?filter[langcode]=ca&filter[field_sonority.name]=m`: 200,
    1 resultat, BLK-CA-L00-VEL-001. El mateix filtre amb `filter[langcode]=es` retorna només la
    castellana BLK-ES-L00-VEL-001 (el nom "m" existeix en els dos idiomes, cada terme dins del
    seu): el filtre per nom es resol dins de l’idioma del node.
  - `...filter[langcode]=ca&filter[field_decoding_effort.parent.name]=Esforç baix`: 200, 1
    resultat, BLK-CA-L00-VEL-001; amb langcode es, 0 resultats.
