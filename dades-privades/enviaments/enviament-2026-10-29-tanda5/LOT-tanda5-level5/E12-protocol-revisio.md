# E12. Protocol de revisió de lots

**Per a**: totes les persones que revisin lots d'activitats. No s'ha de lliurar res: és el
procediment que seguirà cada revisor.

## Què rebreu

Per cada lot, un fitxer `plans/contenido/revision/{lot}.md` amb una taula per activitat: codi,
nivell, títol, material (el contingut tal com el veurà el nen) i dues columnes buides,
**Correcta** i **Comentari**. Els lots de Level0 a Level2 tenen poques activitats per nivell i es
revisen sencers; dels altres, la mostra és el 10 % i com a mínim 5 per nivell, marcades amb una
estrella. Podeu revisar més files si voleu: tot el que marqueu s'aplica.

## Com revisar

1. **El criteri únic** (catàleg 2.1): un nen de l'edat del nivell (Level0 = 5 anys, Level1 = 6,
   fins a Level10 = 15) **sense dificultats** valoraria l'activitat "Bé així". Ni massa fàcil
   ni massa difícil per a la seva edat. L'app després ajusta cada alumne amb dislèxia al nivell
   que li toca; el que fixem aquí és la referència.
2. A la columna **Correcta** poseu una de tres: `sí`, `no` o `amb canvis`.
3. A **Comentari**, el motiu i, si és `amb canvis`, el canvi exacte (quina paraula fora, quina
   dins, quina frase reescrita). Un comentari sense canvi concret no es pot aplicar.
4. Mireu sobretot: paraules fora del nivell (estructura o freqüència), pseudoparaules que
   resulten ser paraules o són impronunciables, ambigüitats (una altra partició o permutació
   amb sentit), sil·labeig incorrecte, errors d'ortografia, contingut inadequat per a l'edat,
   i material repetit respecte a altres activitats del mateix nivell.
5. **No editeu els fitxers JSON** dels lots: les correccions les apliquem nosaltres al lot i
   reimportem. Si una activitat ja té resultats d'alumnes, el seu material no es pot canviar: es
   despublica i se'n crea una altra amb codi nou. Ho fem nosaltres.
6. **Dubtes generals** (un criteri que afecta tot un lot o tot un tipus) van en un apartat
   "Dubtes" al final del fitxer, no fila per fila.

## Què passa després

Apliquem les correccions, reimportem, i el lot es publica (aquest entorn és el real: a partir
d'aquell moment els alumnes el poden rebre). Les correccions que canvien un criteri general
s'incorporen als prompts de generació perquè no es repeteixin als lots següents.

## Temps

Un lot de 3 activitats per nivell i tres nivells (unes 9 a 24 activitats) es revisa en menys
d'una hora. Com que no hi ha límit de revisors, podem tenir diversos lots en revisió alhora:
digueu-nos quants podeu absorbir per setmana i ajustem el ritme de generació.

## Documents de referència (context, no lectura obligatòria)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec.

- `plans/multiidioma/revisio-lots-ca.md`: un fitxer de revisió real (els lots catalans de Level0 a Level2) amb les taules i l’apartat de dubtes: és el model del que rebreu.
- `plans/multiidioma/resposta-revisio-lots-ca.md i resposta-dubtes-revisio-lots-ca.md`: com va respondre el grup i com es van aplicar les correccions.
- `docs/exercise-catalog.md (apartat 2.1)`: el criteri únic de revisió.
