# Petició a l'expert: llistes de freqüència lèxica (català i castellà)

Data: 2026-10-27. Per a què: generar les activitats de Level3 a Level10 en els dos idiomes.
El catàleg fixa per a cada nivell un llindar de freqüència (fins a les 500 paraules més
freqüents a Level0, 1.000 a Level1, 2.000 a Level2, 3.000 a Level3, 5.000 a Level4, 7.000 a
Level5, 10.000 a Level6, 15.000 a Level7, 20.000 a Level8 i sense límit a Level9 i Level10).
Avui aquest criteri l'aplica l'equip a ull i el valida l'expert. Amb llistes reals, el generador
pot etiquetar cada paraula amb el seu rang i comprovar el llindar de manera automàtica abans de
la revisió.

## Què necessitem, per a cada idioma

1. **Una llista de freqüència general**, en un fitxer de text (CSV o TSV, UTF-8), amb una fila
   per forma i aquestes columnes:
   - forma (tal com s'escriu, en minúscules i amb accents: "casa", "cotxe", "l'avi" no cal, les
     formes apostrofades les tractem a part),
   - lema (opcional, però molt útil per agrupar flexions),
   - categoria gramatical (opcional),
   - freqüència: el recompte o el rang (posició) a la font.
   Com a mínim les 20.000 formes més freqüents, o totes les que tingui la font si en són menys.
   Fonts que ens semblen adequades: per al català, el diccionari de freqüències del CTILC
   (IEC) o el que l'expert consideri de referència; per al castellà, CREA o CORPES XXI (RAE) o
   un equivalent.

2. **Una llista de vocabulari infantil**, si existeix a part de la general: paraules habituals
   entre 5 i 8 anys (Level0 a Level2), ja sigui un diccionari de freqüències de llengua
   infantil o escolar, o una llista per curs (P5 a 2n de primària). Mateix format. Serveix per
   als nivells baixos, on la freqüència general enganya (paraules molt freqüents en adults que
   un nen de 5 anys no fa servir).

3. **Per a cada llista, la font exacta i la llicència d'ús** (si es pot guardar al nostre
   repositori i fer-la servir per generar contingut). No la redistribuirem.

4. **Opcional**: alguna taula d'edat d'adquisició o de vocabulari per cicle escolar, i, per al
   català, confirmació que la llista segueix l'ortografia de l'IEC del 2017 i la varietat
   central.

## Com les farem servir

- Ordena les síl·labes, repetició ràpida i parpelleig (paraules): la paraula ha d'estar dins
  del llindar del nivell.
- Segmentació lèxica, lista de texto i lectura en veu alta (frases i textos): totes les
  paraules dins del llindar, llevat de noms propis, que no fem servir.
- Posició d'imatges: no cal, el banc ja porta el nivell lector de cada nom validat per
  l'expert.
- Les llistes no substitueixen la revisió: serveixen per no proposar res fora de nivell i per
  marcar les paraules dubtoses abans que l'expert les vegi.
