# Seguiment del contingut

Generat el 2026-10-29 amb `shine/content/generadores/seguiment.py` a partir de Drupal (activitats reals) i de `plans/contenido/seguiment-registre.json` (estat de fases, encàrrecs, revisions i dubtes, actualitzat el 2026-10-29). No s'edita a mà: es canvia el registre i es torna a generar.

Estats: **pendent** (no començat), **en curs**, **enviat** (a revisió del grup), **respost** (resposta rebuda, per aplicar), **aplicat**, **tancat**.

## Resum

| | Castellà | Català |
|---|---|---|
| Activitats publicades | 336 | 354 |
| Importades, en revisió | 0 | 0 |
| Retirades (sense publicar) | 4 | 2 |
| De les quals, del cicle Sílabas (publicades + en revisió) | 38 + 0 | 44 + 0 |

Encàrrecs: 11 aplicat, 1 tancat. Revisions de lots obertes: 0. Dubtes oberts: 0.

## Fases i tasques

| Id | Tasca | Estat | Detall |
|---|---|---|---|
| C1 | Cicle castellà Sílabas (38 activitats) | aplicat | Aprovat amb 3 canvis (lima → lata, prado → prisa, examen → boxeo) i el contrast gue/gui; publicat el 2026-10-29. Resposta plans/contenido/encarrecs/lliuraments/respostes-2026-10-29/LOT-ciclo-silabas-es-v1-resposta.md. |
| C2 | Tanda 2: completar Level0 a Level2 fins a 6 per cel·la | aplicat | Aprovat; canvis aplicats (SIL-ES-L00-LIN-005 amb pato) i 9 lots publicats el 2026-10-29. Resposta plans/contenido/encarrecs/lliuraments/respostes-2026-10-29/LOT-tanda2-level0-2-resposta.md. La resposta diu que tot Level0 a Level10 queda validat: no és així, només és Level0 a Level2. |
| C3 | Tanda 3: Level3 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 (respostes-2026-10-30/LOT-tanda3-level3-resposta.md) i publicada: 49 activitats. Amb la decisió 2, terme d'esforç nou Hiatos / Hiats a les dues taxonomies (estructura.py, phonology-terms) i 12 activitats reetiquetades. |
| C4 | Tanda 4: Level4 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 (respostes-2026-10-30/LOT-tanda4-level4-resposta.md) i publicada: 48 activitats. Decisió 1: model mixt de parpelleig des de Level3 (paraules reals + pseudoparaules + 30 % d'alleujament), fixat als prompts 03 dels dos idiomes. |
| C5 | Tanda 5: Level5 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 (respostes-2026-10-30/LOT-tanda5-level5-resposta.md) i publicada: 48 activitats. Decisions: termòmetre permès; pronoms combinats a la segmentació a Level7; l'etiqueta d'hiat només si un terç o més de les paraules en tenen (estructura.activity_effort), 17 activitats de Level3 a Level5 reetiquetades. |
| C6 | Tanda 6: Level6 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 (respostes-2026-10-30/LOT-tanda6-level6-resposta.md) i publicada: 48 activitats. Validats: ordena les síl·labes sense dibuix a Level6, lectures expositives, enclítics (en català només amb apòstrof), subjuntiu imperfet. |
| C7 | Tanda 7: Level7 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 (respostes-2026-10-30/LOT-tanda7-level7-resposta.md) i publicada: 48 activitats. Validats els termes nous de sonoritat i el grup d'esforç morfològic i lèxic, les síl·labes sobrants ortogràfiques, els homòfons a la segmentació i els pronoms combinats en català. |
| C8 | Tanda 8: Level8 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 (respostes-2026-10-30/LOT-tanda8-level8-resposta.md) i publicada: 48 activitats. Validats la posició d'imatges per etiqueta visual, les matrius de doble objectiu, les llistes de 15 i les síl·labes sobrants d'equivalència fonètica. |
| C9 | Tanda 9: Level9 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 (respostes-2026-10-30/LOT-tanda9-level9-resposta.md) i publicades les 36 de text i matriu. La posició d'imatges de Level9 i Level10 també està aprovada: s'importa i es publica quan arribin les 25 imatges de la tirada del 2026-10-30. |
| C10 | Tanda 10: Level10 sencer, tots dos idiomes | aplicat | Aprovada sense canvis el 2026-10-29 i publicada: 36 activitats. La primera resposta citava material que no era el nostre (l'eina del revisor no va llegir el lot); la revisió complementària (respostes-2026-10-30/LOT-tanda10-level10-resposta-complementaria.md) sí que revisa el material real. Falta la posició d'imatges de Level10 (aprovada; espera la tirada). |
| IMG2 | Banc d'imatges, lot 2 (122 imatges per a Level9 i Level10) | en curs | 81 candidates acceptades (revisió de Claude als fulls de contactes) i importades al banc el 2026-10-29 amb generadores/fusionar_ampliacion122.py; 16 descartades (cap grup E09 les fa servir). Per a la tirada del 2026-10-30: 20 pendents que calen i 5 per repetir (mango, pasa, bol, caqui, bacalao), llista a _revision/ampliacion122/repetir-2026-10-29.md. Després, tornar a executar la fusió, import-images i els lots de posició d'imatges de Level9 i Level10. Lots de Level9 i Level10 ja escrits (imagenes-{es,ca}-level9-10-v1.json, generadores/e09_lots.py, 12 activitats per idioma, cap imatge repetida dins d'una activitat): la prova d'importació només falla per les 25 imatges de la tirada; demà es verifica i s'importen. |
| F19 | FASE 19: matriu amb regla (Funcions Executives) | en curs | Subplans 01 a 06 fets el 2026-10-29. Lots aprovats pel grup sense canvis i publicats: 3 per nivell i idioma, l'àrea entra a la rotació. Missatge d'explicació per família amb imatge d'exemple a la intro de l'activitat. Verificat a Expo web amb la Marta (es) i el Pau (ca) en R1. Falta jugar R2, R3, R4 i la regla oculta a l'app i arribar a 6 per cel·la. |
| GEN | Generador de sessions: no reservar forat a àrees sense contingut | aplicat | SessionGenerator::planRegular(), 2026-10-29. |
| TAG | Etiquetes fonològiques (esforç) calculades per estructura | aplicat | estructura.py, etiquetar_lote.py; 20 activitats etiquetades, prompts 05, 07, 08. |
| SRC | Registre de fonts de dades | aplicat | docs/fuentes-de-datos.md; regla a CLAUDE.md. |

## Encàrrecs al grup d'experts

| Id | Encàrrec | Estat | Lliurament | Fitxa de revisió | Paquet |
|---|---|---|---|---|---|
| E01 | Llista general del castellà | aplicat | shine/private/lexico/es-general.csv | plans/contenido/encarrecs/lliuraments/E01-revisio.md | E01-llista-general-es.zip |
| E02 | Llista general del català | aplicat | shine/private/lexico/ca-general.csv | plans/contenido/encarrecs/lliuraments/E02-revisio.md | E02-llista-general-ca.zip |
| E03 | Vocabulari infantil del castellà | aplicat | shine/private/lexico/es-infantil.csv | plans/contenido/encarrecs/lliuraments/E03-revisio.md | E03-llista-infantil-es.zip |
| E04 | Vocabulari infantil del català | aplicat | shine/private/lexico/ca-infantil.csv | plans/contenido/encarrecs/lliuraments/E04-revisio.md | E04-llista-infantil-ca.zip |
| E05 | Banc de pseudoparaules, castellà | aplicat | plans/contenido/encarrecs/lliuraments/E05-pseudoparaules-es.csv | plans/contenido/encarrecs/lliuraments/E05-E06-revisio.md | E05-E06-pseudoparaules.zip |
| E06 | Banc de pseudoparaules, català | aplicat | plans/contenido/encarrecs/lliuraments/E06-pseudoparaules-ca.csv | plans/contenido/encarrecs/lliuraments/E05-E06-revisio.md | E05-E06-pseudoparaules.zip |
| E07 | Matriu de Level7 a Level10, castellà | aplicat | plans/contenido/encarrecs/lliuraments/E07-matriu-es.csv | plans/contenido/encarrecs/lliuraments/E07-E08-revisio.md | E07-E08-matriu.zip |
| E08 | Matriu de Level7 a Level10 i grafies pròpies, català | aplicat | plans/contenido/encarrecs/lliuraments/E08-matriu-ca.csv | plans/contenido/encarrecs/lliuraments/E07-E08-revisio.md | E07-E08-matriu.zip |
| E09 | Grups d'imatges de Level9 i Level10 | aplicat | plans/contenido/encarrecs/lliuraments/E09-grups-imatges-es.csv, E09-grups-imatges-ca.csv, definitius E09-grups-imatges-{es,ca}-definitiu.csv (decisió a E09-revisio-resposta.md) | plans/contenido/encarrecs/lliuraments/E09-revisio.md | E09-grups-imatges.zip |
| E10 | Decisions pedagògiques (4 preguntes) | aplicat | plans/multiidioma/respostes-dubtes-expert.md, lliuraments/E10-4-funcions-executives-proposta-respostes.md | plans/contenido/encarrecs/E10-decisions.md | E10-4-funcions-executives.zip |
| E11 | Guia editorial dels textos | aplicat | plans/contenido/encarrecs/lliuraments/E11-guia-editorial-es.md, E11-guia-editorial-ca.md | (les guies acaben amb les decisions per confirmar) | E11-guia-editorial.zip |
| E12 | Protocol de revisió de lots | tancat | (sense lliurament: és el procediment) | plans/contenido/encarrecs/E12-protocol-revisio.md |  |

## Revisions de lots

| Id | Revisió | Estat | Registres | Activitats (publicades) | Fitxa | Paquet |
|---|---|---|---|---|---|---|
| R-CA1 | Lots catalans de Level0 a Level2 (subplan 05) | aplicat | 111 | 129 (129) | plans/multiidioma/revisio-lots-ca.md |  |
| R-CIC-ES | Cicle castellà Sílabas | aplicat | 38 | 38 (38) | plans/contenido/revision/ciclo-silabas-es-v1.md | LOT-ciclo-silabas-es-v1.zip |
| R-T2 | Tanda 2, Level0 a Level2 | aplicat | 48 | 64 (64) | plans/contenido/revision/tanda2-level0-2.md | LOT-tanda2-level0-2.zip |
| R-T3 | Tanda 3, Level3 | aplicat | 37 | 49 (49) | plans/contenido/revision/tanda3-level3.md | LOT-tanda3-level3.zip |
| R-FE1 | Funcions Executives: matriu amb regla, 3 per nivell | aplicat | 39 | 66 (66) | plans/contenido/revision/fe-matriz-regla-v1.md | LOT-fe-matriz-regla-v1.zip |
| R-T4 | Tanda 4, Level4 | aplicat | 36 | 48 (48) | plans/contenido/revision/tanda4-level4.md | LOT-tanda4-level4.zip |
| R-T5 | Tanda 5, Level5 | aplicat | 36 | 48 (48) | plans/contenido/revision/tanda5-level5.md | LOT-tanda5-level5.zip |
| R-T6 | Tanda 6, Level6 | aplicat | 36 | 48 (48) | plans/contenido/revision/tanda6-level6.md | LOT-tanda6-level6.zip |
| R-T7 | Tanda 7, Level7 | aplicat | 36 | 48 (48) | plans/contenido/revision/tanda7-level7.md | LOT-tanda7-level7.zip |
| R-T8 | Tanda 8, Level8 | aplicat | 36 | 48 (48) | plans/contenido/revision/tanda8-level8.md | LOT-tanda8-level8.zip |
| R-T9 | Tanda 9, Level9 (i posició d'imatges de Level10) | aplicat | 60 | 36 (36) | plans/contenido/revision/tanda9-level9.md | LOT-tanda9-level9.zip |
| R-T10 | Tanda 10, Level10 | aplicat | 36 | 36 (36) | plans/contenido/revision/tanda10-level10.md | LOT-tanda10-level10.zip |

## Dubtes

| Origen | Pregunta | Estat | Resposta |
|---|---|---|---|
| Cicle castellà | güe/güi sense volta desordenada; paraules de 6 o 7 anys; família x; família h; cobertura de les inverses | tancat | Aprovat: gue/gui afegit; 3 paraules canviades (lata, prisa, boxeo); x i h es mantenen. |
| E01 | Ajust de 'vosotros' (rang de la forma de tercera del plural) | tancat | Aprovat: es manté el rang de la tercera del plural (E01-resposta.md). |
| E01 | Vocabulari infantil a partir de Level3: comptar dins de rang les paraules de la llista infantil | tancat | Aprovat: la paraula de la llista infantil compta dins de rang des de Level3 (lexico.py). |
| E01 | Formes flexionades rares (jugábamos): regla per forma o per lema | tancat | Regla mixta: forma vàlida si el lema és dins de rang i el temps és del nivell (lexico.py, by_lemma). |
| E01 | Veseig, malsonant o sensible, polisèmics vulgars, americanismes, sigles, diminutius (criteris 4 a 9) | tancat | Veseig americà; malsonant (bloqueja) separat de sensible (des de Level5, amb revisió); caca i pito sense marca; americanismes marcats; sigles fora; diminutius amb el lema de la base (32). Aplicat amb ajustos_llistes.py. |
| E01-E02 | Malsonant, sensible o cap marca (no és si s'exclouen de les llistes, sinó on poden sortir): culo/cul, teta, polla/cardar, tonto/tonta, pedo, pixa/pitu/tita (pito ja no porta marca) i els despectius (canalla, chusma, gentuza, desgraciada) | tancat | Resposta del 2026-10-29: culo, polla, cardar i pixa malsonants; cul, teta, tonto/tonta, canalla, chusma, gentuza i desgraciada sensibles; pedo, pitu i tita sense marca (respostes-2026-10-30/dubtes-oberts-resposta.md). |
| E01-E04 | Mostres de 300 files de les llistes: la resposta les accepta si l'encert és del 90 % o més (o els errors el 3 % o menys), però no diu el resultat. Es van revisar? | tancat | Revisades: les llistes queden acceptades (2026-10-29). |
| E02 | Formes vàlides que gairebé sempre són errada o castellà (series, varem, creo) | tancat | Descartades les formes minoritàries o castellanes (distancia, copia, sentencia, formula, creo). |
| E02 | Topònims amb grafia castellana o estrangera; sigles d'organitzacions | tancat | Topònims no catalanitzats i sigles, fora (20 exònims descartats). |
| E02 | Malsonant o sensible, i no marcar els termes d'identitat | tancat | Malsonant separat de sensible; els termes d'identitat, sense cap marca. |
| E02 | Dialectal (podis, mos, xic) i col·loquialismes d'origen castellà (tio, nòvio, barco) | tancat | podis i xic estàndard, mos dialectal; tio, nòvio i tonteria es queden; barbarismes clars fora. |
| E02 | Vocabulari infantil a partir de Level3 i formes flexionades rares (com a E01) | tancat | Com a E01: rescat infantil des de Level3 i regla mixta lema més temps. |
| E02 | Llista de diacrítics del 2017 (sense sóc, amb mà) i compostos sense accent | tancat | Confirmada la llista oficial de l'IEC (2026-10-29). |
| E03 | Temps verbals per nivell; un nivell per lema; llista infantil a partir de Level3 | tancat | Temps per forma a les llistes (E03 punt 1); un nivell per lema amb excepcions (gracias 0, vale 0, deberes 1, repente 1); rescat des de Level3. |
| E04 | 75 conflictes entre la llista i lots ja revisats (lupa, puma a Level0): baixar-les a la llista? | tancat | Aprovat baixar-les: 54 nivells corregits a ca-infantil (mam, papa, puma a 0; llar a 2; roig i xoc afegits). |
| E04 | Temps verbals (sense passat simple); un nivell per lema; llista infantil a partir de Level3 | tancat | Aprovat, sense passat simple; un nivell per lema amb excepcions; rescat des de Level3. |
| E05-E06 | Criteri 5: es permet canviar la primera lletra (ñopa i copa)? | tancat | Sí, es pot canviar la primera lletra (ñopa i copa); no una lletra posterior. |
| E05-E06 | Pronunciabilitat de les pseudoparaules de Level7 a Level10 | tancat | Pronunciables. El grup demana accent gràfic quan calgui (brasún); trumidál no s'aplica perquè una aguda en -l no porta accent (vegeu el dubte nou). |
| E05-E06 | Accent de les pseudoparaules: proposem posar-lo només quan ho demana la regla general (brasún sí, trumidal no, perquè és aguda acabada en -l). D'acord? | tancat | D'acord: l'accent només quan el demana la regla general (2026-10-29). |
| E07-E08 | Pseudoparaules estranyes a Level9 (blcho); varietat de Level10; vocabulari de 14 o 15 anys | tancat | Substitucions dins de la mateixa classe (consonant per consonant, vocal per vocal), amb famílies de forma; Level10 es manté; vocabulari molt conegut. Conjunts regenerats. |
| E09 | Opció A, B o mixta per idioma; etiquetes visuals que falten al banc; massa ca- a Level9 | tancat | Castellà A (grups de 6); català mixta (Level9 de 4, Level10 de 6) sense professions abstractes; 37 etiquetes visuals afegides; ca- acceptat. Grups definitius a E09-grups-imatges-{es,ca}-definitiu.csv. |
| E10 | Funcions Executives: opció i valors per defecte | tancat | Matriu amb regla com a FASE 19 amb els valors per defecte; ara, àrea secundària (2026-10-29). |
| E10 | Longitud de la lectura, noms propis, taula de nivell mínim | tancat | 35 a 80 paraules en un paràgraf; noms curts sense travades ni hiats (Leo, Teo, Mia com a excepció); mana la taula. |
| E11 | Decisions de les guies editorials (quotes, festes, llocs, temps verbals, signes, diàleg en un paràgraf) | tancat | Guies aprovades. Precisions aplicades: cap diàleg a Level1 i Level2, 2 intervencions a Level3 i Level4, 4 des de Level5; futur i condicional a Level4; meitat de textos neutres de Level0 a Level3; llocs genèrics fins a Level3. |
| Estructura | Català, Level2: 'els', 'dels', 'pels', 'als' i plurals en -ns i -ls dins de l'excepció de coda? | tancat | Sí (2026-10-29): els, dels, pels i als, i els plurals regulars en -ns i -ls d'una base de Level1 o Level2, a Level2 com a excepció gramatical i morfològica; les codes complexes d'arrel (text, verd, disc) a Level3. Aplicat a estructura.py, catàleg, guia catalana i prompts 07 i 08. |
| Estructura | Català, Level2: gust i camp (codes st i mp) eren a l'excepció de monosíl·labs freqüents (font, llamp), però la resposta del 2026-10-29 les posa a Level3. Quina val? | tancat | Level3 (2026-10-29). A Level2 només els plurals regulars en -ns/-ls i les formes gramaticals: es retira l'excepció de monosíl·labs del 2026-10-27 (dent, pont, porc... a Level3). |
| Estructura | Català, Level2: al, del i pel també dins de l'excepció gramatical (aplicat per coherència amb als, dels i pels)? | tancat | Aprovat (2026-10-29). |
| Tanda 2 | Alleujament a Level0; pseudoparaules a Level1; paraules d'ordena les síl·labes de Level0 (pato, sapo) | tancat | Sense alleujament a Level0; pseudoparaules del banc a Level1, sí; pato i sapo, sí (segon dado canviat per pato). |
| Tanda 2 | Frases d'alleujament a la llista de Level2; 'lo ayuda' i 'la corta'; 'la iaia'; velocitat a Level0 | tancat | Alleujament com ara; 'lo ayuda' correcte; 'la iaia' evita l'apòstrof. Sense canvis. |
| Taxonomies | Termes nous (2026-10-29): sonoritat es ñ, b/v, h muda, r/rr; ca grafies r/rr; grup d'esforç morfològic i lèxic (polisíl·labes, compostes, derivades, pronoms febles, homòfons). Els valideu? | tancat | Aprovats tots (revisió de la tanda 7, 2026-10-29). |

## Contingut per nivell i tipus

Cada cel·la: activitats **publicades** + **en revisió** (sense comptar el cicle Sílabas, que no va per nivell). La fila de cada àrea compara el total amb el mínim de 6 per cel·la: "ok" si s'hi arriba comptant les que són en revisió.

### Castellà

| Àrea / tipus | L0 | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Lingüística** | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| &nbsp;&nbsp;LIS | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| &nbsp;&nbsp;SEG | · | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| &nbsp;&nbsp;SIL | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| **Memòria** | ok | ok | ok | ok | ok | ok | ok | ok | ok | · | · |
| &nbsp;&nbsp;IMG | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | · | · |
| **Perceptius** | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| &nbsp;&nbsp;MAT | 7 | 7 | 7 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 |
| **Velocitat** | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| &nbsp;&nbsp;BLK | 7 | 7 | 6 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| &nbsp;&nbsp;LEC | · | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| &nbsp;&nbsp;LIS | · | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| &nbsp;&nbsp;REP | 2 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| **Funcions Executives** | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 |
| &nbsp;&nbsp;MAT | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |

### Català

| Àrea / tipus | L0 | L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8 | L9 | L10 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Lingüística** | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| &nbsp;&nbsp;LIS | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| &nbsp;&nbsp;SEG | · | 3 | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| &nbsp;&nbsp;SIL | 3 | 3 | 3 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| **Memòria** | ok | ok | ok | ok | ok | ok | ok | ok | ok | · | · |
| &nbsp;&nbsp;IMG | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | 6 | · | · |
| **Perceptius** | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| &nbsp;&nbsp;MAT | 6 | 6 | 6 | 7 | 6 | 6 | 6 | 6 | 6 | 6 | 6 |
| **Velocitat** | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok | ok |
| &nbsp;&nbsp;BLK | 7 | 10 | 8 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| &nbsp;&nbsp;LEC | · | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| &nbsp;&nbsp;LIS | · | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| &nbsp;&nbsp;REP | 3 | 3 | 3 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| **Funcions Executives** | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 | falten 3 |
| &nbsp;&nbsp;MAT | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |

## Activitats retirades

Sense publicar i fora de cap revisió oberta (substituïdes, mogudes de nivell o amb resultats d'alumnes):

IMG-CA-L00-MEM-003, IMG-ES-L00-MEM-003, MAT-CA-L02-PER-001, SEG-ES-L01-LIN-001, SIL-ES-L00-LIN-001, SIL-ES-L00-LIN-002

## Recursos

| Recurs | Estat | Detall |
|---|---|---|
| Llistes de freqüència generals (es, ca) | aplicat | es-general.csv 87.611 formes (CORPES XXI); ca-general.csv 51.547 formes (wordfreq). Ajustos de la resposta aplicats el 2026-10-29 amb ajustos_llistes.py (lemes de diminutius, marques malsonant i sensible, descarts). |
| Llistes de vocabulari infantil (es, ca) | aplicat | es-infantil.csv 2.408 lemes; ca-infantil.csv 2.554 lemes. Nivells per forma i conflictes amb lots revisats aplicats el 2026-10-29. |
| Bancs de pseudoparaules (es, ca) | aplicat | 672 i 670. |
| Banc d'imatges | aplicat | 432 imatges importades; lot 2 de 122 en generació. |
| Porta lèxica i d'estructura | aplicat | lexico.py (llistes), estructura.py (taula de nivell mínim), etiquetar_lote.py, revision_lote.py. |
| Tauler visual de seguiment | aplicat | https://claude.ai/artifact/7JkStNDLcYkg8H74rvokZv (privat); llegeix els JSON de plans/contenido/seguiment-dades. |

Tipus: SIL ordena les síl·labes, SEG segmentació, LIS llista de text, LEC lectura en veu alta, BLK parpelleig, REP repetició ràpida, MAT matriu, IMG posició d'imatges.
