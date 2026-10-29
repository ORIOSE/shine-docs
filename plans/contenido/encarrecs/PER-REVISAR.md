# Per revisar: lliuraments dels encàrrecs E01 a E11 (2026-10-28)

L'estat al dia de tot (encàrrecs, revisions, dubtes i contingut per nivell) és a `plans/contenido/SEGUIMENT.md`.

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
| `LOT-tanda2-level0-2.zip` | logopeda o mestre, un per idioma (hi ha registres compartits) | `plans/contenido/revision/tanda2-level0-2.md` | 48 registres de Level0 a Level2 (9 lots: ordena les síl·labes, segmentació, llista de text, lectura en veu alta, repetició, matriu, posició d'imatges) i 7 dubtes; resposta al mateix fitxer |

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

## Preguntes noves després de la resposta del 2026-10-29

1. **Mostres de 300 files (E01 a E04)**: **resolt (2026-10-29)**, revisades; les llistes queden acceptades.
2. **Malsonant, sensible o cap marca**: **resolt (2026-10-29)**, vegeu `lliuraments/respostes-2026-10-30/dubtes-oberts-resposta.md` (cul, teta, tonto, canalla, chusma, gentuza i desgraciada, sensibles; pixa, malsonant; pitu i tita, sense marca; la resta, com ara). Pregunta original: el dubte no és si s'exclouen de les llistes (hi continuen), sinó quina marca porta cadascuna, perquè la marca decideix on pot sortir: malsonant, mai; sensible, només des de Level5 i amb revisió; cap marca, a qualsevol nivell, també a Level0. Aquest és el repartiment que hem fet; confirmeu-lo o canvieu-lo:

   | Paraula | Marca actual | Dubte |
   |---|---|---|
   | culo (es), cul (ca) | malsonant | En català "cul" és el mot estàndard; en castellà la resposta posava "culo" com a exemple de malsonant. Sensible? |
   | teta (es, ca) | malsonant | És anatomia (sensible) o vulgar (malsonant)? |
   | polla, cardar (ca) | malsonant | Tenen sentit neutre (gallina jove, cardar la llana) però domina el vulgar. |
   | polla (es) | malsonant | Sense dubte; només per confirmar. |
   | tonto, tonta (ca) | cap | Insult lleu d'ús infantil corrent: sense marca, pot sortir a Level0. Ho voleu així? |
   | pedo (es) | cap | Escatològic infantil, com "caca", que el grup va deixar sense marca. |
   | pixa (ca) | sensible | "Pixar" és neutre; el nom és vulgar. Malsonant? |
   | pitu, tita (ca) | sensible | Mots infantils per al penis. El grup va treure la marca a "pito" en castellà: els deixem també sense marca? |
   | canalla, chusma, gentuza, desgraciada (es) | cap | Despectius de registre literari: sense marca. O malsonant? |

3. **Accent de les pseudoparaules (E05)**: **resolt (2026-10-29)**, l'accent només quan el demana la regla general (brasún sí, trumidal no).
4. **Coda catalana a Level2**: **resolt (2026-10-29)**, els, dels, pels, als i els plurals regulars en -ns i -ls d'una base de Level1 o Level2 entren a Level2; les codes d'arrel (text, verd, disc) es queden a Level3. Dos aclariments:
   - "gust" i "camp": **resolt (2026-10-29)**, Level3. A Level2 les úniques excepcions de coda són els plurals regulars i les formes gramaticals, de manera que es retira l'excepció de monosíl·labs del 2026-10-27 (dent, pont, porc i la resta passen a Level3).
   - al, del i pel a Level2: **resolt (2026-10-29)**, aprovat.
5. **Tanda 2**: la resposta diu que queden validats tots els lots de Level0 a Level10. Només existeixen i s'han revisat Level0 a Level2; la tanda 3 (Level3) serà la propera revisió.
