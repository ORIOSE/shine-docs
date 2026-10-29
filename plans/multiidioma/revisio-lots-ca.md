# Revisió dels lots catalans (Level0 a Level2) per l’expert

Data: 2026-10-26. Estat: **revisat per l’expert el 2026-10-27** (resposta a plans/multiidioma/resposta-revisio-lots-ca.md; correccions aplicades i lots reimportats en local el mateix dia). L’expert no va donar un veredicte fila per fila: les files amb «amb canvis», «retirada» o «nova» són les que va corregir; a la resta no hi va posar cap objecció. Els lots són a shine/content/ i estan importats i publicats en local com a contingut de prova (plans/multiidioma/prompts-contenido/README.md); no es publica res en producció sense aquesta revisió.

Criteri (docs/exercise-catalog.md 2.1 i 4.5): un nen de 5 + n anys sense dificultats valoraria l’activitat «Bé així». La mostra demanada és del 10 % i almenys 5 per nivell: com que els lots de nivell tenen 3 activitats per nivell, la mostra és el lot sencer; del cicle, almenys una activitat de cada bloc (marcades amb ★). Per a cada activitat: correcta (sí / no / amb canvis) i comentari. Les correccions es fan al fitxer del lot (sense tocar el codi) i es reimporten; una activitat amb activitysummary no canvia de material: es despublica i se’n crea una altra.

Dubtes que ja han sortit en generar-los (per confirmar): vegeu l’apartat final.

## Matriu de discriminació visual: matriz-es-ca-level0-2-v1.json (10 registres, un node per idioma)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| MAT-L00-PER-003 | Level0 | Troba totes les d | objectiu d, 3×4, 2 rondes; ronda 1: s a d s d o a o d a o s | | |
| MAT-L00-PER-004 | Level0 | Troba totes les q | objectiu q, 3×4, 2 rondes; ronda 1: a o q q s s s a a q o o | | |
| MAT-L00-PER-005 | Level0 | Troba totes les m | objectiu m, 3×4, 2 rondes; ronda 1: s s a o m m a o a o m s | | |
| MAT-L01-PER-002 | Level1 | Troba totes les b | objectiu b, 4×5, 2 rondes; ronda 1: d b d d o s s o b d s s s d d b o o o b | | |
| MAT-L01-PER-003 | Level1 | Troba totes les d | objectiu d, 4×5, 2 rondes; ronda 1: s b b b s d o b s b o d o s d d o s b o | | |
| MAT-L01-PER-004 | Level1 | Troba totes les n | objectiu n, 4×5, 2 rondes; ronda 1: s o u s s u n o u o n o s u o n u n s o | | |
| MAT-L02-PER-002 | Level2 | Troba totes les d | objectiu d, 4×6, 2 rondes; ronda 1: b o o d b o s o q o q d b s b s q q d d s b d s | | |
| MAT-L02-PER-003 | Level2 | Troba totes les q | objectiu q, 4×6, 2 rondes; ronda 1: q s s q q d p d q o o o q p s o p p d s p o d s | | |
| MAT-L02-PER-004 | Level2 | Troba totes les u | objectiu u, 4×6, 2 rondes; ronda 1: s m s s m u s o n n o m u o n u m u n s m o u o | | |
| MAT-CA-L02-PER-001 | Level2 | Troba totes les l·l | objectiu l·l, 4×6, 2 rondes; ronda 1: l il il l·l il l ll l il l·l l·l il ll ll ll l il l il l·l ll l·l l ll | amb canvis | Passa a Level3 (punt 3): MAT-CA-L03-PER-001 a matriz-ca-level3-v1.json; el node de Level2 està despublicat. |

## Posició d’imatges: imagenes-es-ca-level0-2-v1.json (9 registres, un node per idioma)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| IMG-L00-MEM-002 | Level0 | On era? | grup 1 (pos. 2): nen [nene], pes [pesa]; grup 2 (pos. 2): rosa [rosa], bebè [bebe]; grup 3 (pos. 1): cara [cara], ona [ola]; grup 4 (pos. 1): ala [ala], toro [toro] | amb canvis | Només monosíl·labs o bisíl·labs simples als dos idiomes (punt 5). |
| IMG-L00-MEM-003 | Level0 | On era? | grup 1 (pos. 1): pila [pila], polo [polo]; grup 2 (pos. 2): mapa [mapa], moto [moto]; grup 3 (pos. 2): nata [nata], ona [ola]; grup 4 (pos. 1): ala [ala], pilota [balon] | retirada | Tenia resultats en castellà (contingut congelat): despublicada; el material nou és IMG-L00-MEM-005. |
| IMG-L00-MEM-004 | Level0 | On era? | grup 1 (pos. 1): pipa [pipa], lupa [lupa]; grup 2 (pos. 2): nata [nata], suc [zumo]; grup 3 (pos. 1): polo [polo], moto [moto]; grup 4 (pos. 2): pal [palo], bota [bota] | amb canvis | Només monosíl·labs o bisíl·labs simples als dos idiomes (punt 5). |
| IMG-L00-MEM-005 | Level0 | On era? | grup 1 (pos. 2): got [vaso], fada [hada]; grup 2 (pos. 1): mag [mago], puma [puma]; grup 3 (pos. 1): mapa [mapa], capa [capa]; grup 4 (pos. 2): pila [pila], tapa [tapa] | nova | Substitueix IMG-L00-MEM-003 amb la regla del punt 5. |
| IMG-L01-MEM-001 | Level1 | On era? | grup 1 (pos. 3): rei [rey], sabó [jabon], arròs [arroz]; grup 2 (pos. 1): camell [camello], tireta [tirita], gos [perro]; grup 3 (pos. 3): paraigua [paraguas], ovella [oveja], pera [pera]; grup 4 (pos. 1): pollet [pollito], ulleres [gafas], regal [regalo] | | |
| IMG-L01-MEM-002 | Level1 | On era? | grup 1 (pos. 1): tetera [tetera], autobús [autobus], dau [dado]; grup 2 (pos. 3): forquilla [tenedor], bolet [seta], maleta [maleta]; grup 3 (pos. 1): pinta [peine], medalla [medalla], arpa [arpa]; grup 4 (pos. 3): copa [copa], robot [robot], gall [gallo] | | |
| IMG-L01-MEM-003 | Level1 | On era? | grup 1 (pos. 3): boca [boca], bufanda [bufanda], cangur [canguro]; grup 2 (pos. 1): pinya [pina], llapis [lapiz], volcà [volcan]; grup 3 (pos. 1): tambor [tambor], palmera [palmera], cargol [caracol]; grup 4 (pos. 3): niu [nido], foca [foca], xiulet [silbato] | | |
| IMG-L02-MEM-001 | Level2 | On era? | grup 1 (pos. 3): moneda [moneda], anell [anillo], conill [conejo]; grup 2 (pos. 2): cofre [cofre], princesa [princesa], faldilla [falda]; grup 3 (pos. 2): gorra [gorra], bombeta [bombilla], cérvol [ciervo]; grup 4 (pos. 1): mosca [mosca], botiga [tienda], gamba [gamba] | | |
| IMG-L02-MEM-002 | Level2 | On era? | grup 1 (pos. 2): àliga [aguila], llop [lobo], balança [balanza]; grup 2 (pos. 1): llaç [lazo], mosquit [mosquito], dit [dedo]; grup 3 (pos. 1): sal [sal], pinzell [pincel], bruixa [bruja]; grup 4 (pos. 2): sobre [sobre], molí [molino], finestra [ventana] | | |
| IMG-L02-MEM-003 | Level2 | On era? | grup 1 (pos. 3): far [faro], dofí [delfin], armari [armario]; grup 2 (pos. 3): cap [cabeza], patata [patata], follet [duende]; grup 3 (pos. 2): àncora [ancla], olla [olla], bales [canicas]; grup 4 (pos. 2): espelma [vela], brúixola [brujula], granja [granja] | | |

## Parpelleig: blink-ca-level0-2-v1.json (24 registres)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| BLK-CA-L00-VEL-002 | Level0 | Síl·labes amb p | pa, a (alivi), pe, pi, o (alivi), po | | |
| BLK-CA-L00-VEL-003 | Level0 | Síl·labes amb l | la, le, u (alivi), li, e (alivi), lo | | |
| BLK-CA-L00-VEL-004 | Level0 | Síl·labes amb s | sa, i (alivi), se, si, a (alivi), so | | |
| BLK-CA-L00-VEL-005 | Level0 | Síl·labes amb t | ta, o (alivi), te, ti, e (alivi), to | | |
| BLK-CA-L00-VEL-006 | Level0 | Síl·labes amb n | na, ne, u (alivi), ni, i (alivi), no | | |
| BLK-CA-L00-VEL-007 | Level0 | Síl·labes amb d | da, a (alivi), de, u (alivi), di, do | | |
| BLK-CA-L01-VEL-001 | Level1 | Síl·labes amb f | fa, fe, ma (alivi), fi, fulo, fo, sol (alivi), fipa | | |
| BLK-CA-L01-VEL-002 | Level1 | Síl·labes amb ny | nya, pa (alivi), nye, nyi, nyopa, a (alivi), nyo, nyufa | | |
| BLK-CA-L01-VEL-003 | Level1 | Síl·labes amb ll | lla, lle, e (alivi), lli, llupa, llo, so (alivi), llomi | | |
| BLK-CA-L01-VEL-004 | Level1 | Síl·labes amb j i g (ja, jo, ge, gi) | ja, la (alivi), jo, ge, jopi, ma (alivi), gi, gemu | | |
| BLK-CA-L01-VEL-005 | Level1 | Síl·labes amb c i qu (ca, co, que, qui) | ca, no (alivi), co, que, cupi, a (alivi), qui, quelo | | |
| BLK-CA-L01-VEL-006 | Level1 | Síl·labes amb c i ç (ce, ci, ça, ço) | ce, ci, pa (alivi), ça, cefo, ço, a (alivi), tuça | | |
| BLK-CA-L01-VEL-007 | Level1 | Síl·labes amb b i v | ba, ma (alivi), ve, bi, vobi, no (alivi), vo, bimu | | |
| BLK-CA-L01-VEL-008 | Level1 | Síl·labes amb x | xa, xe, sol (alivi), xi, xofi, xo, e (alivi), xufi | | |
| BLK-CA-L01-VEL-009 | Level1 | Inverses amb l i n | al, el, pa (alivi), an, olpe, en, e (alivi), unfa | | |
| BLK-CA-L01-VEL-010 | Level1 | Paraules curtes amb final (gat, sol) | gat, ma (alivi), sol, cap, nol, a (alivi), dit, tep | | |
| BLK-CA-L02-VEL-001 | Level2 | Travades amb pl i pr | pla, pre, ma (alivi), pri, plimo, pro, sol (alivi), prute | | |
| BLK-CA-L02-VEL-002 | Level2 | Travades amb bl i br | bla, pa (alivi), ble, bra, blimo, a (alivi), bru, brofe | | |
| BLK-CA-L02-VEL-003 | Level2 | Travades amb tr i dr | tra, tre, la (alivi), dra, trumi, dro, e (alivi), drifo | | |
| BLK-CA-L02-VEL-004 | Level2 | Travades amb fl, fr, cl i cr | fla, no (alivi), fre, clo, flusi, ma (alivi), cra, crofe | | |
| BLK-CA-L02-VEL-005 | Level2 | Travades amb gl i gr | gla, gle, sol (alivi), gra, glumi, a (alivi), gru, grofe | | |
| BLK-CA-L02-VEL-006 | Level2 | Parells pra i par, tra i tar | pra, par, ma (alivi), tra, prali, tar, e (alivi), tralo | | |
| BLK-CA-L02-VEL-007 | Level2 | Dígrafs tx, ix, ig i tg | cotxe, caixa, pa (alivi), boig, potxa, metge, sol (alivi), fitge | | |
| BLK-CA-L02-VEL-008 | Level2 | Síl·labes gue, gui, güe i güi | gue, ma (alivi), gui, güe, guesa, a (alivi), güi, güipo | | |

## Parpelleig: ciclo-sillabes-ca-v1.json (44 registres)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| ★ BLK-CA-CIC-SILABAS-010 | cicle, pes 10 | Cicle: les vocals | a, e, i, o, u, o, e, u, a, i, ala, ou, avi | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| ★ BLK-CA-CIC-SILABAS-020 | cicle, pes 20 | Cicle: síl·labes amb m | ma, me, mi, mo, mu, me, ma, mi, mu, mo, mare, mel, mico | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-030 | cicle, pes 30 | Cicle: síl·labes amb p | pa, pe, pi, po, pu, po, pe, pa, pi, pu, pare, pipa, tapa | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-040 | cicle, pes 40 | Cicle: síl·labes amb l | la, le, li, lo, lu, li, lu, le, lo, la, pala, lila, lupa | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-050 | cicle, pes 50 | Cicle: síl·labes amb s | sa, se, si, so, su, so, sa, si, se, su, sopa, sabata, cosa | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-060 | cicle, pes 60 | Cicle: síl·labes amb t | ta, te, ti, to, tu, te, tu, to, ti, ta, taula, tela, moto | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-070 | cicle, pes 70 | Cicle: síl·labes amb n | na, ne, ni, no, nu, na, nu, ni, ne, no, nina, nas, nen | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-080 | cicle, pes 80 | Cicle: síl·labes amb d | da, de, di, do, du, de, du, di, da, do, dona, dit, dau | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| ★ BLK-CA-CIC-SILABAS-090 | cicle, pes 90 | Cicle: síl·labes amb f | fa, fe, fi, fo, fu, fe, fo, fa, fu, fi, foc, fada, fil | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-100 | cicle, pes 100 | Cicle: síl·labes amb b i v | ba, be, va, ve, vi, be, ba, va, vi, ve, bosc, vaca, bebè | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-110 | cicle, pes 110 | Cicle: síl·labes amb r | ra, re, ri, ro, ru, ri, re, ro, ra, ru, rosa, rei, roda | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-120 | cicle, pes 120 | Cicle: síl·labes amb rr | rra, rre, rri, rro, rru, rro, rra, rri, rru, rre, carro, serra, gorra | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-130 | cicle, pes 130 | Cicle: síl·labes amb ny | nya, nye, nyi, nyo, nyu, nyo, nya, nyu, nyi, nye, pinya, canya, muntanya | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-140 | cicle, pes 140 | Cicle: síl·labes amb ll | lla, lle, lli, llo, llu, lla, llu, lle, llo, lli, lluna, llet, pollet | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-150 | cicle, pes 150 | Cicle: síl·labes amb j i g (ja, jo, ju, ge, gi) | ja, jo, ju, ge, gi, ju, ja, ge, jo, gi, joc, girafa, pijama | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-160 | cicle, pes 160 | Cicle: síl·labes amb z, c i ç | za, ce, ci, ça, ço, za, ço, ci, ce, ça, zero, cel, caça | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-170 | cicle, pes 170 | Cicle: síl·labes amb c i qu | ca, co, cu, que, qui, cu, ca, qui, que, co, casa, cuc, quin | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-180 | cicle, pes 180 | Cicle: síl·labes amb g i gu | ga, go, gu, gue, gui, go, ga, gu, gui, gue, gat, gos, guineu | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-190 | cicle, pes 190 | Cicle: síl·labes amb h | ha, he, hi, ho, hu, ha, ho, hi, he, hu, hora, home, hivern | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-200 | cicle, pes 200 | Cicle: síl·labes amb x | xa, xe, xi, xo, xu, xa, xi, xu, xo, xe, xoc, xai, xocolata | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| ★ BLK-CA-CIC-SILABAS-210 | cicle, pes 210 | Cicle: grups amb ss | assa, esse, issi, osso, ussu, issi, esse, osso, assa, ussu, tassa, massa, pissarra | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-220 | cicle, pes 220 | Cicle: grups amb ix | aix, eix, oix, uix, eix, uix, aix, oix, caixa, peix, coixí | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-230 | cicle, pes 230 | Cicle: grups amb tx | atx, etx, itx, otx, utx, etx, atx, otx, itx, utx, cotxe, despatx, petxina | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-240 | cicle, pes 240 | Cicle: grups amb ig | aig, eig, oig, uig, aig, oig, eig, uig, boig, roig, maig | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-250 | cicle, pes 250 | Cicle: grups amb tg i tj | tge, tgi, tja, tjo, tju, tja, tgi, tjo, tge, tju, metge, platja, jutge | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| ★ BLK-CA-CIC-SILABAS-260 | cicle, pes 260 | Cicle: inverses amb l | al, el, il, ol, ul, el, ol, al, ul, il, sal, mel, sol | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-270 | cicle, pes 270 | Cicle: inverses amb n | an, en, in, on, un, en, an, un, on, in, nen, son, pinta | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-280 | cicle, pes 280 | Cicle: inverses amb s | as, es, is, os, us, es, us, os, is, as, gas, pes, cos | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-290 | cicle, pes 290 | Cicle: inverses amb r | ar, er, ir, or, ur, or, er, ar, ir, ur, mar, cor, ser | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| ★ BLK-CA-CIC-SILABAS-300 | cicle, pes 300 | Cicle: travades amb pl | pla, ple, pli, plo, plu, plo, pli, pla, plu, ple, plat, pluja, plàtan | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-310 | cicle, pes 310 | Cicle: travades amb bl | bla, ble, bli, blo, blu, blo, ble, bla, blu, bli, blau, blanc, poble | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-320 | cicle, pes 320 | Cicle: travades amb cl | cla, cle, cli, clo, clu, cli, clu, cle, cla, clo, clau, clavell, clip | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-330 | cicle, pes 330 | Cicle: travades amb fl | fla, fle, fli, flo, flu, flo, fli, fle, fla, flu, flor, flam, flauta | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-340 | cicle, pes 340 | Cicle: travades amb gl | gla, gle, gli, glo, glu, gli, gle, glu, gla, glo, globus, glaçó, regle | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| ★ BLK-CA-CIC-SILABAS-350 | cicle, pes 350 | Cicle: travades amb pr | pra, pre, pri, pro, pru, pri, pre, pra, pru, pro, pruna, prat, preu | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-360 | cicle, pes 360 | Cicle: travades amb br | bra, bre, bri, bro, bru, bre, bro, bri, bra, bru, braç, bruixa, cabra | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-370 | cicle, pes 370 | Cicle: travades amb cr | cra, cre, cri, cro, cru, cra, cru, cri, cre, cro, cranc, creu, crema | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-380 | cicle, pes 380 | Cicle: travades amb fr | fra, fre, fri, fro, fru, fra, fru, fro, fri, fre, fred, fruita, frase | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-390 | cicle, pes 390 | Cicle: travades amb gr | gra, gre, gri, gro, gru, gro, gre, gru, gra, gri, gran, gris, grua | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-400 | cicle, pes 400 | Cicle: travades amb tr | tra, tre, tri, tro, tru, tre, tru, tro, tri, tra, tren, tres, truita | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-410 | cicle, pes 410 | Cicle: travades amb dr | dra, dre, dri, dro, dru, dre, dra, dri, dru, dro, drac, dret, pedra | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| ★ BLK-CA-CIC-SILABAS-420 | cicle, pes 420 | Cicle: finals ns, st, ts, cs i nc | ans, est, ets, ocs, anc, ans, ets, anc, est, ocs, gust, gats, banc | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-430 | cicle, pes 430 | Cicle: ela geminada (l·l) | al·la, el·le, il·li, ol·lo, ul·lu, el·le, ul·lu, il·li, al·la, ol·lo, col·legi, il·lusió, pel·lícula | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |
| BLK-CA-CIC-SILABAS-440 | cicle, pes 440 | Cicle: apòstrof l’ i d’ | l’avi, l’ou, d’or, l’illa, d’un, l’avi, d’un, d’or, l’ou, l’illa, l’home, d’aigua, l’escola | amb canvis | Volta desordenada d’una síl·laba per pantalla (punt 1). |

## Reordenament de síl·labes: silabas-ca-level0-2-v1.json (9 registres)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SIL-CA-L00-LIN-001 | Level0 | Ordena les síl·labes amb dibuix | mu-la [mula], so-pa [sopa], mo-to [moto], lu-pa [lupa] | | |
| SIL-CA-L00-LIN-002 | Level0 | Ordena les síl·labes amb dibuix | po-ma [manzana], pi-la [pila], po-lo [polo], a-la [ala] | | |
| SIL-CA-L00-LIN-003 | Level0 | Ordena les síl·labes amb dibuix | ma-pa [mapa], me-ló [melon], ni-na [muneca], pu-ma [puma] | | |
| SIL-CA-L01-LIN-001 | Level1 | Ordena les síl·labes amb dibuix | ga-lli-na [gallina], co-nill [conejo], ca-di-ra [silla], llu-na [luna], pe-ra [pera] | | |
| SIL-CA-L01-LIN-002 | Level1 | Ordena les síl·labes amb dibuix | sa-ba-ta [zapato], ta-ron-ja [naranja], pi-nya [pina], bo-ta [bota], mo-ne-da [moneda] | | |
| SIL-CA-L01-LIN-003 | Level1 | Ordena les síl·labes amb dibuix | ga-le-ta [galleta], tor-tu-ga [tortuga], ca-vall [caballo], ro-da [rueda], gi-ra-fa [jirafa] | | |
| SIL-CA-L02-LIN-001 | Level2 | Ordena les síl·labes amb dibuix | ca-bra [cabra], ti-gre [tigre], cot-xe [coche], lli-bre [libro], plà-tan [platano] | | |
| SIL-CA-L02-LIN-002 | Level2 | Ordena les síl·labes amb dibuix | gra-no-ta [rana], mot-xi-lla [mochila], pe-dra [piedra], flau-ta [flauta], ze-bra [cebra] | | |
| SIL-CA-L02-LIN-003 | Level2 | Ordena les síl·labes amb dibuix | cai-xa [caja], plu-ja [lluvia], es-tre-lla [estrella], bran-ca [rama], pru-na [ciruela] | | |

## Repetició ràpida: repeticion-ca-level0-2-v1.json (9 registres)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| REP-CA-L00-VEL-001 | Level0 | Repeteix ràpid: paraules amb m i p | mapa, mula, moto, pipa | | |
| REP-CA-L00-VEL-002 | Level0 | Repeteix ràpid: paraules amb s i t | sopa, pota, tapa, tela | amb canvis | Fora sala i dona, paraules més concretes per a 5 anys (punt 5). |
| REP-CA-L00-VEL-003 | Level0 | Repeteix ràpid: paraules amb l i n | lupa, nina, pila, lila | amb canvis | Fora sala i dona, paraules més concretes per a 5 anys (punt 5). |
| REP-CA-L01-VEL-001 | Level1 | Repeteix ràpid: paraules curtes amb final | gat, sol, mapa (alivi), nas, dit | | |
| REP-CA-L01-VEL-002 | Level1 | Repeteix ràpid: paraules amb ll i ny | llet, pinya, sopa (alivi), llop, lluna | | |
| REP-CA-L01-VEL-003 | Level1 | Repeteix ràpid: paraules amb f, g i c | foc, gos, mula (alivi), fil, cuc | | |
| REP-CA-L02-VEL-001 | Level2 | Repeteix ràpid: paraules amb pl, bl, fl i gl | pluja, globus, pala (alivi), blau, flauta | | |
| REP-CA-L02-VEL-002 | Level2 | Repeteix ràpid: paraules amb pr, br, tr i dr | pruna, cabra, sopa (alivi), tigre, pedra | | |
| REP-CA-L02-VEL-003 | Level2 | Repeteix ràpid: paraules curtes amb final doble | dent, pont, plat, lupa (alivi), tren | | |

## Segmentació lèxica: segmentacion-ca-level1-2-v1.json (6 registres)

| Codi | Nivell | Títol | Material | Correcta | Comentari |
|---|---|---|---|---|---|
| SEG-CA-L01-LIN-001 | Level1 | Separa les paraules | el sol puja / la nena riu / el gat menja / el gos beu |  |  |
| SEG-CA-L01-LIN-002 | Level1 | Separa les paraules | la lluna puja / el pare neda / la nina balla / la mare riu | amb canvis | Recuperades casa, pare, mare, pilota, vola i a la; fora les frases poc naturals (punt 2). |
| SEG-CA-L01-LIN-003 | Level1 | Separa les paraules | el nen pinta / la foca neda / el gat juga / la nena canta | amb canvis | Recuperades casa, pare, mare, pilota, vola i a la; fora les frases poc naturals (punt 2). |
| SEG-CA-L02-LIN-001 | Level2 | Separa les paraules | el gat menja pa / la nena va a casa / la flor és blava / un drac verd i gros / el nen beu un suc | amb canvis | Recuperades casa, pare, mare, pilota, vola i a la; fora les frases poc naturals (punt 2). |
| SEG-CA-L02-LIN-002 | Level2 | Separa les paraules | la nena té un gat / el tren puja la muntanya / la cabra puja la roca / el tigre té gana / la pluja cau de nit |  |  |
| SEG-CA-L02-LIN-003 | Level2 | Separa les paraules | el gos i el gat juguen / el nen juga a pilota / els nens juguen i riuen / la bruixa vola de nit / el plat és a la taula | amb canvis | Recuperades casa, pare, mare, pilota, vola i a la; fora les frases poc naturals (punt 2). |

Total: 111 registres a la revisió (més IMG-L00-MEM-005, nova el 2026-10-27).

## Dubtes sorgits en generar els lots (per confirmar)

Parpelleig de nivell (blink-ca-level0-2-v1.json):
- Pseudoparaules: que no siguin paraules i que es puguin pronunciar: fulo, fipa, nyopa, nyufa, llupa, llomi, jopi, gemu, cupi, quelo, cefo, tuça, vobi, bimu, xofi, xufi, olpe, unfa, nol, tep, plimo, prute, blimo, brofe, trumi, drifo, flusi, crofe, glumi, grofe, prali, tralo, potxa, fitge, guesa, güipo.
- «par» i «tar» (parells pra/par) i «sol», «cap», «dit», «gat» s’han etiquetat com a síl·laba mixta tot i ser paraules.

Cicle Síl·labes (ciclo-sillabes-ca-v1.json):
- La volta desordenada va en parelles («mu ma», «mi me») perquè l’importador no admet elements repetits (decisió pendent al catàleg 5.3 i 8).
- A rr, ss i tg/tj es presenten grups de lectura (rra, assa, tge) que l’IEC no considera síl·labes (car-ro, tas-sa, met-ge); a ix, tx i ig, grups finals (aix, atx, aig); a l·l, al·la, el·le; a l’apòstrof, grups reals (l’avi, d’or).
- Vocals desordenades en parelles («u a», «o i», «e u») es podrien llegir com a diftong.
- Bloc 3: gue/gui agrupades dins g/gu (nivell mínim L2 segons la taula) i que/qui dins c/qu; «be», «el», «al» són paraules reals usades com a síl·labes; «ca» es pot llegir com a paraula.
- Freqüència per a 5 a 8 anys: mico, lila, lupa, cosa, tela, hivern, despatx, pissarra, jutge, glaçó, regle, gust, il·lusió, pel·lícula.

Reordenament de síl·labes (silabas-ca-level0-2-v1.json):
- Descartades per ambigüitat (una altra permutació és paraula): casa (saca), vaca (cava), pipa (papi), pala (lapa), tapa (pata). Confirmar el criteri.
- «ala» (a-la) i «ona» (o-na) tenen una síl·laba d’una sola vocal; es mantenen a Level0 perquè el nivell lector del manifest és L0.
- Ela geminada: les fitxes s’ajunten per formar la paraula i col-le-gi donaria «collegi»; proposta per a Level3: la primera fitxa conserva el punt volat (col·, le, gi).

Repetició ràpida (repeticion-ca-level0-2-v1.json):
- Level0: «tela», «lila», «dona» com a bisíl·labes CV molt freqüents; «sala» i «dona» potser menys infantils que «sopa» o «nina».
- Level2: «blau» (CCVV) i «flor» (CCVC) etiquetades com a travades amb l; «plat» i «tren» com a complexes CCVC (estructura-ca.md 5).

Segmentació lèxica (segmentacion-ca-level1-2-v1.json):
- S’han evitat «pare», «mare», «casa», «vola», «pilota», «passa», «escola» i «a la» perquè una comprovació estricta amb lèxic hi troba una altra partició (pa re, ca sa, vol a, pi lota, pas sa, es cola, ala). Si «re», «sa» o «ca» no compten com a paraules per a un nen, es poden recuperar.
- Level1: «surt» i «dorm» (codes rt, rm) s’han tractat com a L2 i L3; «el nen neda» i «la mula riu» són correctes però poc naturals.
- Pronoms enclítics amb guionet (dona-m’ho) no els admet l’importador: a Level6 només enclítics amb apòstrof (posa’t, mira’l).

Documents (no són lots, però també els ha de revisar):
- docs/generador/Taxonomía fonológica (català).md i Guía de Parametrización (català).md (pseudoparaules dels nivells baixos: nyola, plim, trum, trosp, insfa, pil·lo; textos de lectura de Level4 i Level5, potser massa adults; grups d’imatges de Level8 a Level10).
- Traduccions dels missatges d’explicació i motivació (scripts/translate-interface-terms.php): l’expert no en va lliurar textos; els de l’equip tècnic queden pendents.

## Resultat de la revisió (2026-10-27)

Correccions de l’expert, totes aplicades:

1. **Cicle sense parelles**: cada pantalla és una sola síl·laba o vocal. L’importador accepta ara elements repetits si no van seguits, i la volta desordenada repeteix les síl·labes de la família en un altre ordre, sense cap parella seguida de l’ordre original. Les 44 activitats s’han reimportat.
2. **Segmentació**: l’app corregeix contra la frase declarada (ja ho feia), de manera que s’han recuperat casa, pare, mare, pilota, vola i a la, i s’han tret les frases poc naturals. Escola tornarà a Level3, on la frase natural porta apòstrof (a l’escola).
3. **Matriu de l·l a Level3**: MAT-CA-L02-PER-001 està despublicada i el registre és ara MAT-CA-L03-PER-001 (matriz-ca-level3-v1.json, paràmetres de Level3). S’importarà quan existeixi el terme Level3.
4. **col·legi a Ordena les síl·labes**: validat (col·, le, gi). Va a Level3, que encara no té lot.
5. **Vocabulari de Level0**: a Posició d’imatges, només monosíl·labs o bisíl·labs simples als dos idiomes (regla nombre_simple del generador); a Repetició ràpida, sala i dona substituïdes per pota i pila. No s’ha fet servir xupa, que va proposar l’expert, perquè la x és de Level1 a la taula de nivell mínim.

Validats sense canvis: el descart de paraules amb una altra permutació a Ordena les síl·labes (casa, vaca, pipa, pala, tapa), ala i ona a Level0, sol, cap, dit i gat com a CVC, el prefix grafies dels termes i els enclítics només amb apòstrof a Level6 com a solució temporal (la millora de l’importador per al guionet queda pendent al catàleg, secció 8).

## Resposta als dubtes restants (2026-10-27)

Resposta a plans/multiidioma/resposta-dubtes-revisio-lots-ca.md. Tots els dubtes queden tancats:

- **Pseudoparaules** (fulo, fipa, nyopa... i nyola, plim, trum, trosp, insfa, pil·lo als documents): vàlides, es mantenen totes.
- **Grups de lectura del cicle** (rra, assa, tge, aix, al·la): es mantenen com a patrons de lectura fluïda. La descripció del lot, el catàleg (5.3) i el prompt del cicle diuen ara que entrenen el reconeixement visual del dígraf i no substitueixen la divisió sil·làbica de l’IEC. L’app no té cap guia del tutor on posar-ho.
- **Freqüència** de mico, lila, lupa, cosa, tela, hivern, despatx, pissarra, jutge, glaçó, regle, gust, il·lusió i pel·lícula: adequades. Als lots ja van al nivell de la seva estructura: les de les activitats de nivell, a Level0; la resta, al cicle, que no té nivell i les ordena pel bloc.
- **surt i dorm**: Level2, per l’excepció dels monosíl·labs freqüents amb coda simple, ampliada amb rm. **blau, flor, plat i tren** a Repetició ràpida de Level2: correctes.
- **Documents**: la Taxonomía fonológica (català).md i la Guía de Parametrización (català).md queden validades. A la guia, l’exemple de Level1 de segmentació portava surt i dorm i s’ha canviat.
- **Missatges**: els textos catalans d’explicació i motivació de l’expert són a scripts/translate-interface-terms.php, amb dos ajustos a la mecànica: la matriu no sempre té temps i els botons de la lectura es diuen «Començar a llegir» i «He acabat». Els tres missatges de motivació nous tenen un original castellà traduït per l’equip tècnic.
