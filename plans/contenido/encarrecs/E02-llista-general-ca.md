**E02. Llista de freqüència general del català** formatat de manera neta i contínua en **Markdown estàndard** per evitar blocs de codi anidats i facilitar la seva lectura i còpia directa:

# E02. Llista de freqüència general del català

> **Estat (2026-10-28)**: lliurament redactat per l'equip amb Opus. Per revisar:
> `lliuraments/E02-revisio.md`.

**Per a**: una persona amb accés a un corpus de referència del català (CTILC de l'IEC, llista de Softcatalà, CQPweb de la UPF, wordfreq català o equivalent) i capacitat d'exportar-ne dades.  
**Objectiu**: una llista de formes del català ordenades per freqüència, amb lema i categoria, perquè el generador d'activitats comprovi automàticament que cap paraula d'un exercici queda per sobre del rang del seu nivell (Level3: 3.000 formes més freqüents; Level4: 5.000; Level5: 7.000; Level6: 10.000; Level7: 15.000; Level8: 20.000; Level9 i Level10: sense límit).

## Què cal lliurar

Un fitxer **ca-general.csv**, UTF-8 (sense BOM), separat per comes, amb capçalera i una fila per forma:  
Columna,Obligatòria,Contingut  
forma,sí,"la paraula tal com s'escriu, en minúscules, amb accents i dièresis (""menjàvem"", ""arbre"", ""aigües"")"  
lema,sí,"l'entrada de diccionari (""menjar"", ""arbre"", ""aigua"")"  
categoria,sí,"una d'aquestes: nom, verb, adj, adv, det, pron, prep, conj, interj, num, npropi"  
frecuencia,sí (o rango),recompte o freqüència per milió a la font  
rango,sí (o frecuencia),posició de la forma ordenant per freqüència descendent (1 \= la més freqüent)  
edad\_adquisicion,no,edat d'adquisició si la font la té (amb un decimal)  
etiqueta\_font,no,"l'etiqueta original de la font (EAGLES, CTILC o la que sigui) si la categoria s'ha hagut de simplificar"

### Exemple de files

forma,lema,categoria,frecuencia,rango  
de,de,prep,71200.0,1  
casa,casa,nom,1020.5,110  
menjàvem,menjar,verb,3.2,19870

## Criteris

* **Mida**: com a mínim les 20.000 formes més freqüents; si la font en té més, totes.  
* **Formes, no només lemes**: el nen llegeix "menjàvem", no "menjar"; el rang que necessitem és el de la forma. El lema serveix per agrupar flexions i per comptar el sobreús.  
* **Ortografia de l'IEC del 2017 i varietat central**:  
* Si la font és anterior al 2017, cal indicar-ho: les formes amb accents diacrítics antics (*dóna, vénen, fóra*) s'han de normalitzar a la norma actual (*dona, venen, fora*), conservant únicament els 15 diacrítics oficials (*bé, déu, és, més, món, pèl, què, seu, sóc, són, sòl, té, ús, vós*).  
* **Apòstrofs, clítics i enclítics**:  
* Les formes apostrofades davant de mot (*l'escola, d'un, m'agrada*) **no** han de ser entrades; el generador treu l'apòstrof i busca la paraula base (*escola, un, agrada*).  
* Els clítics aïllats (*l', d', m', n', s', t', 'l, 'm, 'ns...*) sí que poden anar com a entrades si la font els compta, amb categoria **pron** o **det**.  
* Les formes verbals amb clítics enclítics o combinats (*dona'm, portar-se, mira'l, dona-m'ho*) **no** han de ser entrades individuals; es compta la freqüència del verb base.  
* **Ela geminada**: s'ha d'escriure sempre amb punt volat (**l·l**, codi Unicode U+00B7), mai amb punt normal (l.l) ni guió (l-l).  
* **Noms propis**: si la font els inclou, marcar-los amb categoria **npropi**; no eliminar-los.  
* **Clau primària i sense duplicats**: la clau primària del fitxer és la combinació **forma \+ categoria**. Si una forma té més d'una categoria (com *casa* nom i verb), s'ha d'incloure una fila per categoria amb la seva freqüència corresponent. Si la font no desglossa la freqüència per categoria, s'assigna la categoria gramatical principal.  
* **Formatat tècnic**: fitxer codificat en **UTF-8 sense BOM**, delimitat per comes. Si un camp conté comes o caràcters especials, ha d'anar emmarcat entre cometes dobles ("...").  
* **Font i llicència**: indicar en un fitxer **ca-general.LLICENCIA.txt** d'on surt la llista i en quines condicions es pot fer servir. Es desarà fora del repositori i no es redistribuirà.

## Què respondre a més del fitxer

* Si la font no dona rang sinó recompte (el calcularem nosaltres).  
* Si la categoria s'ha simplificat des d'un etiquetari més fi (dir quin era).  
* Data/versió de l'ortografia de la font (anterior o posterior a la reforma de l'IEC del 2017).

## Documents de referència (context)

Si la persona no té accés al repositori, adjunteu-los amb l’encàrrec:

* plans/multiidioma/peticio-llistes-frequencia.md: la petició original de les llistes.  
* plans/multiidioma/resposta-peticio-llistes-frequencia.md: la resposta del grup amb les fonts recomanades i regles d'apòstrofs.  
* plans/multiidioma/estructura-ca.md: l’estructura catalana del projecte (IEC 2017, varietat central).  
* docs/exercise-catalog.md (apartats 2.3 i 3.6): la taula catalana de rangs per nivell i la porta de filtratge lèxic.

## On lliurar-ho

Ruta al repositori: **shine/private/lexico/ca-general.csv** (i el fitxer ca-general.LLICENCIA.txt al costat). Fora de git.  
Vols que revisem el prompt exacte de sistema que farem servir amb Claude / GPT-4o per processar aquests fitxers durant la generació de continguts?  
