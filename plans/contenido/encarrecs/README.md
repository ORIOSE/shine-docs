# Encàrrecs per al grup d'experts

Un fitxer per feina, autocontingut: es pot donar a una persona diferent sense que hagi de llegir
cap altre document. Cada encàrrec diu què s'ha de lliurar, en quin format exacte, amb quins
criteris i on deixar-ho. Els lliuraments amb dades sota llicència (llistes de freqüència) van a
`shine/private/lexico/` (fora del repositori); la resta, a `plans/contenido/encarrecs/lliuraments/`.

| Codi | Encàrrec | Perfil | Idioma | Bloqueja | Lliurament |
|---|---|---|---|---|---|
| E01 | Llista de freqüència general, castellà | lingüista, corpus | es | la puerta lèxica de Level3 a Level10 | shine/private/lexico/es-general.csv |
| E02 | Llista de freqüència general, català | lingüista, corpus | ca | ídem | shine/private/lexico/ca-general.csv |
| E03 | Llista de vocabulari infantil, castellà | logopeda o mestre | es | la puerta lèxica de Level0 a Level2 | shine/private/lexico/es-infantil.csv |
| E04 | Llista de vocabulari infantil, català | logopeda o mestre | ca | ídem | shine/private/lexico/ca-infantil.csv |
| E05 | Banc de pseudoparaules per nivell, castellà | logopeda | es | parpelleig i llista de text de Level1 en amunt | lliuraments/E05-pseudoparaules-es.csv |
| E06 | Banc de pseudoparaules per nivell, català | logopeda | ca | ídem | lliuraments/E06-pseudoparaules-ca.csv |
| E07 | Parelles confusables per a la matriu de Level7 a Level10, castellà | logopeda, lectoescriptura | es | matrius de Level7 a Level10 | lliuraments/E07-matriu-es.csv |
| E08 | Parelles confusables per a la matriu de Level7 a Level10, català | logopeda, lectoescriptura | ca | ídem | lliuraments/E08-matriu-ca.csv |
| E09 | Grups d'imatges per a Level9 i Level10 | logopeda + qui conegui el banc | es i ca | posició d'imatges de Level9 i Level10 | lliuraments/E09-grups-imatges.csv |
| E10 | Decisions pedagògiques pendents (4 preguntes) | coordinador del grup | tots dos | la lectura en veu alta i els textos de Level1 i Level2 | lliuraments/E10-decisions.md |
| E11 | Guia editorial dels textos | pedagog o editor infantil | es i ca | lectura en veu alta i frases | lliuraments/E11-guia-editorial.md |
| E12 | Protocol de revisió de lots | tots els revisors | tots dos | la publicació de cada lot | (és el protocol que seguiran; no lliuren res) |

**Canvi de model (2026-10-28)**: a petició del grup, els lliuraments els redacta l'equip (Claude,
model Opus) i el grup els revisa. Cada lliurament ve amb una fitxa de revisió a `lliuraments/`.
Estat: E01 a E11 fets, per revisar; l'índex de què enviar a qui, amb fitxers i rutes, és a `PER-REVISAR.md`; E10, preguntes 1 a 3 respostes i
aplicades, la 4 oberta.

Ordre recomanat si no es poden fer tots alhora: E10 i E12 (són curts i desbloquegen la resta),
després E03, E04, E05 i E06 (nivells baixos, que és per on comencem), i E01, E02, E07, E08, E09 i
E11 en paral·lel.

Com ho farem servir: les llistes alimenten `shine/content/generadores/lexico.py`, que comprova
cada lot abans de la revisió; els bancs (E05 a E09) són material pre-validat del qual surten les
activitats, de manera que la revisió de lots es limita a la composició; les decisions (E10) i la
guia (E11) entren als prompts de generació (plans/contenido/prompts-es/ i
plans/multiidioma/prompts-contenido/). Si algun expert prefereix redactar textos de lectura en
veu alta directament, el prompt 09 de cada idioma serveix tal qual com a encàrrec.

Cada encàrrec acaba amb una secció "Documents de referència": són context (criteris ja decidits,
exemples fets), no lectura obligatòria. Si l’expert no té accés al repositori, cal adjuntar-los.
