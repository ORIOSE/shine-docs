# Per revisar: lliuraments dels encàrrecs E01 a E11 (2026-10-28)

A petició del grup, els lliuraments els ha redactat l'equip (Claude, model Opus, amb programes de
comprovació) i el grup els revisa. Cada paquet porta la seva **fitxa de revisió**: què s'ha fet,
què cal mirar, quins criteris s'han de decidir i on tornar la resposta.

**Paquets per enviar** (un fitxer per revisor): `shine/private/enviament-2026-10-28/` (fora de
git, perquè les llistes de freqüència tenen llicència i no es redistribueixen). Cada zip conté
l'encàrrec original, la fitxa de revisió i tots els fitxers que s'han de revisar.

| Paquet (zip) | Perfil del revisor | Fitxa de revisió | Què ha de fer | Resposta a |
|---|---|---|---|---|
| `E01-llista-general-es.zip` | lingüista del castellà | `lliuraments/E01-revisio.md` | mostra de 300 formes, 776 marques, 27 descarts, 9 criteris | `lliuraments/E01-revisio-resposta.md` |
| `E02-llista-general-ca.zip` | lingüista del català | `lliuraments/E02-revisio.md` | mostra de 300, 574 marques, 74 descarts, 144 fusions de diacrítics, 9 criteris | `lliuraments/E02-revisio-resposta.md` |
| `E03-llista-infantil-es.zip` | logopeda o mestre (castellà) | `lliuraments/E03-revisio.md` | mostra de 300 lemes, 3 criteris | `lliuraments/E03-revisio-resposta.md` |
| `E04-llista-infantil-ca.zip` | logopeda o mestre (català) | `lliuraments/E04-revisio.md` | mostra de 300 lemes, 75 conflictes amb lots ja revisats, 4 criteris | `lliuraments/E04-revisio-resposta.md` |
| `E05-E06-pseudoparaules.zip` | logopeda (un per idioma) | `lliuraments/E05-E06-revisio.md` | 672 pseudoparaules castellanes i 670 catalanes, criteri 5 | `lliuraments/E05-E06-revisio-resposta.md` |
| `E07-E08-matriu.zip` | logopeda o lectoescriptura | `lliuraments/E07-E08-revisio.md` | 40 conjunts castellans i 70 catalans | `lliuraments/E07-E08-revisio-resposta.md` |
| `E09-grups-imatges.zip` | logopeda | `lliuraments/E09-revisio.md` | triar opció A, B o mixta per idioma; llista d'imatges noves | `lliuraments/E09-revisio-resposta.md` |
| `E10-4-funcions-executives.zip` | coordinació del grup | `lliuraments/E10-4-funcions-executives-proposta.md` | **respost el 2026-10-29** (`lliuraments/E10-4-funcions-executives-proposta-respostes.md`); queden obertes les preguntes de detall 3 a 9 i 12, que es resolen amb els valors de la proposta si no diuen res | |
| `E11-guia-editorial.zip` | pedagog o editor (un per idioma) | `lliuraments/E11-guia-editorial-es.md`, `lliuraments/E11-guia-editorial-ca.md` | revisar les guies i confirmar l'apartat final de decisions | `lliuraments/E11-revisio-resposta.md` |

E12 (protocol de revisió de lots) no té lliurament: s'aplica a cada lot.

## Lots per revisar

| Paquet (zip) | Perfil | Fitxer de revisió | Què ha de fer |
|---|---|---|---|
| `LOT-ciclo-silabas-es-v1.zip` | logopeda (castellà) | `plans/contenido/revision/ciclo-silabas-es-v1.md` | 38 activitats del cicle Sílabas castellà (com a mínim les 7 amb ★) i 5 dubtes; resposta al mateix fitxer, columnes Correcta i Comentari |

## Ubicació dels fitxers (per a qui tingui accés al repositori)

| Fitxer | Ruta |
|---|---|
| Encàrrecs originals | `plans/contenido/encarrecs/E01-...md` a `E12-...md` |
| Fitxes de revisió, bancs, matrius, grups, guies i proposta (en git) | `plans/contenido/encarrecs/lliuraments/` |
| Llistes de freqüència i vocabulari infantil, i els seus fitxers de revisió (fora de git) | `shine/private/lexico/{es,ca}-general.*` i `shine/private/lexico/{es,ca}-infantil.*` |
| Fonts amb llicència (CORPES XXI, SUBTLEX-ESP, Softcatalà) | `shine/private/lexico/fuentes/` |
| Registre de fonts i citacions | `docs/fuentes-de-datos.md` |

## Decisions que bloquegen alguna cosa

- **E09, opció d'imatges**: sense aquesta decisió no es pot fer l'encàrrec d'imatges noves ni
  generar la posició d'imatges de Level9 i Level10.
- **E04, conflictes amb lots**: afecta la porta lèxica dels lots catalans de Level0 a Level2.

La resta de criteris no bloquegen la generació: mentre no arribin les respostes, els lots es
generen amb les propostes de les fitxes i la revisió de cada lot ho corregeix.

## Pregunta nova per al grup (2026-10-29)

En revisar l'estructura dels lots catalans ja aprovats, dues frases de segmentació de Level2 porten
paraules que la taula de nivell mínim posa a Level3: "verd" (SEG-CA-L02-LIN-001) i "els", "nens"
(SEG-CA-L02-LIN-003), per les codes -rd, -ls i -ns. "Els" és gairebé inevitable en una frase
catalana. Proposta: afegir a l'excepció de Level2 (monosíl·labs freqüents amb coda final) els
articles i pronoms "els", "dels", "pels", "als" i els plurals en -ns i -ls de paraules de Level1
(nens, pans, sals). Responeu sí o no, o la llista que vulgueu.

## Contradiccions entre documents del grup que convé resoldre

- La llista de diacrítics de l'encàrrec E02 (posava "seu" i "sóc"; hi faltaven "mà", "sé" i "sí").
  S'ha seguit la norma de l'IEC (E02, criteri 1). **Resolt (2026-10-29)**: el grup confirma la llista
  oficial de l'IEC del 2017: bé, déu, és, mà, més, món, pèl, què, sé, sí, sòl, són, té, ús, vós
  ("sóc" s'escriu "soc"). És la que ja aplica `ca-general.csv`.
- Els noms propis "Leo", "Teo" i "Mía/Mia" de la decisió E10.2 tenen hiat. **Resolt (2026-10-29)**:
  sense hiat a Level1 i Level2 (Pol, Pau, Marc, Pep, Ana, Lola, Sara), Leo, Teo i Mia com a excepció.
- La lectura en veu alta: **resolt (2026-10-29)**, 35 a 80 paraules en un sol paràgraf.
