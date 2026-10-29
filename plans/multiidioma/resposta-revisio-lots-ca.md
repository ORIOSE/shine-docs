Després d'analitzar detalladament el document revisio-lots-ca.md, cal destacar que és un treball de revisió **molt rigorós, exhaustiu i ben plantejat**. Identifica amb molta precisió els punts crítics de la generació de contingut en català.  
Tanmateix, hi ha **5 punts clau que no acaben d'encaixar** o que requereixen un ajust tècnic/pedagògic abans de donar els lots per definitius:

### 1\. Parpelleig del Cicle: Agrupació de vocals/síl·labes en parelles (mu ma, u a)

1. **El problema:** Per evitar que l'importador de Drupal rebutgi ítems repetits en el camp field\_text, s'han agrupat les síl·labes i vocals desordenades en parelles (ex. mu ma, mi me, u a, e u).  
2. **Per què no encaixa:**  
3. Per a un nen de 5 anys en Level0 o en els primers pesos del cicle, veure dues síl·labes a la vegada en una sola pantalla de parpelleig **duplica la càrrega cognitiva** no desitjada.  
4. En el cas de les vocals (u a, o i, e u), l'infant les llegirà naturalment com a **diftongs** (*ua, oi, eu*), desvirtuant l'objectiu d'entrenar la vocal aïllada.  
5. **Solució recomanada:** Cal demanar a l'equip tècnic que corregeixi la restricció de l'importador (permetent cadenes repetides en l'array o afegint un identificador/espai intern invisible) perquè cada element del parpelleig del cicle sigui **una sola síl·laba o vocal aïllada**.

### 2\. Segmentació Lèxica: "Falsos positius" de partició i pèrdua de vocabulari bàsic

* **El problema:** S'han hagut de descartar del generador paraules quotidianes com *casa, pare, mare, escola* perquè l'algorisme de comprovació troba sub-paraules vàlides al diccionari (*ca-sa*, *pa-re*, *es-cola*).  
* **Per què no encaixa:** Privar els exercicis de Level1 i Level2 de frases amb paraules tan naturals com *casa* o *escola* fa que les frases resultants siguin menys infantils o més artificioses (*"el ruc menja"*).  
* **Solució recomanada:** La validació de l'aplicació en el front-end ha de comprovar la resposta de l'alumne **exclusivament contra la solució declarada a la frase** (oracion\_resuelta / field\_sentences), i no fent una cerca combinatòria oberta contra el diccionari general. Així es podran recuperar immediatament mots bàsics com *casa, pare* i *escola*.

### 3\. Matriu de la Ela Geminada a Level2 (MAT-CA-L02-PER-001)

* **El problema:** S'ha inclòs una matriu de discriminació de la ela geminada (l·l) etiquetada a Level2.  
* **Per què no encaixa:** A estructura-ca.md es va establir de manera consensuada que el nivell mínim d'introducció de la ela geminada és **Level3** (8 anys / 3r de Primària), atesa la seva complexitat ortogràfica.  
* **Solució recomanada:** Re-etiquetar aquest registre a **Level3** (MAT-CA-L03-PER-001) per mantenir la coherència amb la taula de nivells mínims.

### 4\. Ela Geminada en Reordenament de Síl·labes (col·legi)

* **El dubte del document:** Si les fitxes són col, le, gi, en unir-les s'obté collegi (sense punt volat).  
* **Valoració:** La proposta que fa el document és **impecable i necessària**: la primera fitxa ha de conservar el punt volat (col·, le, gi). D'aquesta manera, quan l'alumne enllaci les fitxes visualment a la pantalla, la paraula resultant serà la forma normativa correcta (*col·legi*).

### 5\. Selecció de Vocabulari Infantil a Level0 (Posició d'Imatges i Repetició Rápida)

* **El problema:**  
* A *Posició d'imatges* (Level0), a IMG-L00-MEM-004 apareix taronja (*ta-ron-ja*, 3 síl·labes amb el dígraf *nj*).  
* A *Repetició ràpida* (Level0), apareixen mots com *sala* o *dona*.  
* **Per què no encaixa:** A Level0 (5 anys), l'infant que ha de llegir les opcions de la pregunta de memòria no ha d'enfrontar-se a paraules de 3 síl·labes amb dígrafs complexos.  
* **Solució recomanada:**  
* A *Posició d'imatges* (Level0): Usar exclusivament paraules bisíl·labes simples o monosíl·labs (*pila, ma, pa, pi, boca, sopa*).  
* A *Repetició ràpida* (Level0): Substituir *sala* o *dona* per paraules més concretes i familiars per a nens de 5 anys com *sopa, nina, pila, xupa*.

### 📋 Resum de Validacions Directes per als Dubtes del Document

Dubte plantejat a revisio-lots-ca.md,Resolució recomanada  
"Descarte de paraules ambígenes a Reordenament (casa/saca, vaca/cava)",Validat. Descartar-les és correcte mentre l'aplicació no admeti qualsevol anagrama vàlid com a resposta.  
Monosíl·labs com ala i ona a Level0,Validat. Són paraules V-CV molt senzilles amb imatge; es poden mantenir a Level0.  
"Etiquetatge de sol, cap, dit, gat com a CVC",Validat. Són estructures CVC / monosíl·labs freqüents; la seva classificació és correcta.  
Noms de la taxonomia amb prefix grafies,Validat. Decisió tècnica excel·lent per evitar duplicats en Drupal.  
Limitació de guionets en pronoms enclítics (Level6),"Validat com a parxe temporal. Usar apòstrofs (posa't) ara, però programar la millora de l'importador per admetre guionets (dona-m'ho) en lot superiors."  
