* **1\. Llista de diacrítics en català (E02):**  
  * **Resolució:** Es manté estrictament la reforma ortogràfica de l'**IEC del 2017** (que redueix els accents diacrítics als 15 motis oficials: bé, déu, és, més, món, pèl, què, sé, sí, sóc, són, sòl, té, ús, vós). Es corregeix l'esborrany inicial d'E02 que ometia sé, sí o afegia formes no vigents.  
* **2\. Noms propis i hiats (E10.2 / E11):**  
  * **Resolució:** A Level1 i Level2 es permeten noms propis curts. Tanmateix, noms com Leo, Teo o Mia contenen hiats (que la taula d'estructures assigna a **Level3**). Per a Level1 i Level2 s'han de prioritzar **noms monosíl·labs o bisíl·labes directes sense hiat** (Pol, Pau, Marc, Pep, Ana, Lola, Sara). Si s'utilitzen Leo o Teo, s'han de tractar com una excepció d'alta freqüència de nom propi.  
* **3\. Rangs de longitud en la lectura en veu alta:**  
  * **Resolució:** Queda unificat oficialment el rang de **35 a 80 paraules** (en un sol paràgraf) per a tots els nivells, eliminant qualsevol referència a la horquilla 30–80.

  Això deixa el marc de treball i les regles de validació **completament establerts i resolts**:

* **Diacrítics IEC 2017:** Queda fixat el filtre estricte amb els **15 diacrítics oficials** (bé, déu, és, més, món, pèl, què, sé, sí, sóc, són, sòl, té, ús, vós), eliminant qualsevol forma desactualitzada.  
* **Noms propis a L1 i L2:** Es permeten noms curts prioritzant **monosíl·labs i bisíl·labes directes sense hiat** (Pol, Pau, Marc, Pep, Ana, Lola, Sara). Noms com Leo o Teo es tractaran com a excepcions d'alta freqüència.  
* **Longitud de lectura en veu alta:** Queda unificat el rang oficial de **35 a 80 paraules en un sol paràgraf** per a tots els nivells.  
  ---

    
  Strategy per a les Funcions Executives  
  Pel que fa al desenvolupament de l'àrea de **Funcions Executives**:  
* **Aplicació dels valors per defecte:** Adoptar directament la proposta per defecte (E10-4-funcions-executives-proposta.md) és la millor decisió pragmàtica per no bloquejar el disseny. Els paràmetres proposats (escalat de regles per nivell, penalització per esquers tocats, temps per ronda i l'ocultació de la regla a Level9 i Level10 per forçar la memòria de treball i la flexibilitat cognitiva) tenen una base clínica impecable.  
* **Planificació com a fase pròpia:** **Aprovat al 100%.** Com que és un desenvolupament transversal que afecta quatre capes diferents del sistema (**model de dades a Drupal, algorisme de l'importador, pantalla/reproductor a l'App i suite de tests automatitzats**), aïllar-ho en una fase o fita pròpia evitarà interferir en la generació i validació del gruix dels lots de lectoescriptura.  
  Amb aquestes decisions tancades, el motor de generació i els scripts de validació tenen el camí totalment buit per procedir.  
  Pols arrencar el desenvolupament i la generació dels lots del **cicle castellà** o prefereixes revisar primer els scripts de l'importador?


