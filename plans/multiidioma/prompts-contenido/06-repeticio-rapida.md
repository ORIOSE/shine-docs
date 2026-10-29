# 06. Repetición rápida de palabra en catalán (activity_rapid_repetition)

Prompt de generación de lotes catalanes de "Repeteix ràpid". Notas internas primero; desde el
título "Prompt", lo que se pega en Cowork o en Codex.

## Notas internas

- **Primer lote** (2026-10-26, subplan 05): shine/content/repeticion-ca-level0-2-v1.json, 9
  actividades (3 por nivel en Level0 a Level2), escrito a mano. Códigos REP-CA-L00-VEL-001 a
  REP-CA-L02-VEL-003. Siguiente libre: REP-CA-L0n-VEL-004 (comprobar con el inventario).
- **Etiquetado obligatorio**: el importador exige sonoridad o esfuerzo en este tipo, con los
  términos catalanes de segundo nivel de estructura-ca.md 3 y 4 ("Directes inicials (CV)", "Mixtes
  i finals (CVC)", "Dígrafs simples", "Travades amb r (CCV)", "Complexes (CCVC, VCC, CVCC)"; "m",
  "s sorda", "ll", "g/gu", "c/qu/k", "tx/ig"...). Describen solo el material objetivo, no el alivio.
- **Codas dobles en monosílabos** (dent, pont, porc, serp, gust, camp): Level3, como toda CVCC. La
  excepción de Level2 del 2026-10-27 la retiró el grupo el 2026-10-29; en Level2 solo entran, como
  excepción, els, al, als, del, dels, pel, pels y los plurales regulares en -ns y -ls (nens, pals).
- **Level0, revisión del experto (2026-10-27)**: palabras concretas y familiares para un niño de
  5 años (sopa, nina, pila, pota, mapa, moto); sala y dona se retiraron del primer lote. La x es de
  Level1, así que xupa, que propuso el experto, no entra en Level0.
- **Alivio**: desde Level1, una palabra fácil (Level0: mapa, sopa, mula, lupa, pala) intercalada
  en posición aleatoria, nunca al final, marcada alivio en desglose_tipos.
- Las palabras caben en grande en un móvil hasta unos 12 caracteres; el importador admite hasta 30.
- Hoy solo existen Level0 a Level2 en local; el prompt cubre hasta Level10.

---

## Prompt

Actúas como generador de contenido de **Shine**, una aplicación de ejercicios de lectura para niños
y jóvenes con dislexia (de 5 a 15 años) que usan acompañados de un adulto. Vas a escribir un lote
de actividades **en catalán** del ejercicio "Repeteix ràpid" (tipo activity_rapid_repetition): se
muestra una palabra en grande, el adulto pulsa Començar, la palabra desaparece y el niño la repite
en voz alta tantas veces como puede durante N segundos mientras el adulto cuenta. La métrica es el
ritmo (repeticiones por segundo); no hay aciertos ni errores. Entregas un JSON que importa Drupal.

### Reglas del catalán

1. Palabras reales del léxico infantil (CTILC o BDLOC como referencia), pronunciables y de la
   estructura silábica del nivel; pseudopalabras con fonotaxis catalana desde Level4 (pro, fru,
   blau, tren más vocal: "trubo", "flauma"), que no existan en catalán ni en castellano.
2. Ortografía normativa: minúsculas, acentos, diéresis, ç, l·l (punto volado U+00B7), apóstrofo
   tipográfico (’) si la palabra lo lleva (desde Level3: l’os, d’or). Sin espacios ni cifras.
3. Nivel mínimo por estructura: Level0, bisílabas CV con m, p, l, s, t, n, d, concretas y
   familiares para un niño de 5 años (mapa, sopa, nina, pila; no sala ni dona);
   Level1, resto de CV, inversas, mixtas CVC (gat, sol, nas), dígrafos simples (llet, pinya);
   Level2, trabadas CCV (pluja, cabra), CCVC (plat, tren, drac), dígrafos complejos (cotxe,
   metge), plurales regulares en -ns y -ls (nens, pals); Level3, CVCC y VCC, también en
   monosílabos (temps, forts, dent, pont), hiatos (piano, lleó), ela geminada (col·legi), apóstrofos; desde Level4,
   todas.
4. Cada actividad trabaja **un grupo objetivo** (una estructura y, si procede, una sonoridad):
   "paraules amb ll i ny", "travades amb r". Se etiqueta ese grupo en esfuerzo (y sonoridad si
   aplica), nunca las palabras de alivio.
5. Alivio: desde Level1, 1 palabra muy fácil (Level0) por actividad, intercalada en una posición
   al azar que no sea la última.

### Parámetros por nivel

| Nivel | Palabras | Segundos por palabra | Material |
|---|---|---|---|
| Level0 | 4 | 10 | Bisílabas CV muy frecuentes (mapa, mula, sopa, nina); el adulto modela la palabra antes |
| Level1 | 5 (4 + 1 alivio) | 10 | CVC frecuentes (gat, sol, dit), dígrafos simples (llet, lluna, pinya) |
| Level2 | 5 (4 + 1 alivio) | 10 | Trabadas (pluja, cabra, tren), plurales en -ns y -ls (nens, pals), dígrafos complejos (cotxe) |
| Level3 | 5 (4 + 1 alivio) | 15 | CVCC, hiatos, ela geminada, apóstrofos, 3 a 4 sílabas (temps, piano, col·legi, l’avió) |
| Level4 a Level6 | 5 a 6 | 15 | 4 a 5 sílabas; una o dos pseudopalabras |
| Level7 a Level10 | 6 | 20 | Polisílabas y vocabulario académico; dos pseudopalabras |

### Forma del registro

```json
{
  "tipo": "activity_rapid_repetition",
  "codigo": "REP-CA-L01-VEL-004",
  "idioma": "ca",
  "titulo": "Repeteix ràpid: paraules amb ll i ny",
  "area_principal": "Rendimiento y Velocidad de Procesamiento",
  "area_secundaria": "Funciones Ejecutivas y Atención",
  "niveles": ["Level1"],
  "instruccion": "Digues tu primer la paraula perquè l’alumne la senti i ensenya-la-hi. Quan premis Començar, la paraula s’amagarà: l’alumne l’ha de repetir en veu alta tantes vegades com pugui mentre tu comptes.",
  "explicacion": "Rapid repetition",
  "sonoridad": ["ll", "ny"],
  "esfuerzo": ["Dígrafs simples"],
  "contenido": {
    "grupo_fonetico_objetivo": "Dígrafs simples ll i ny amb un alivi",
    "palabras": ["llet", "pinya", "sopa", "llop", "lluna"],
    "desglose_tipos": ["palabra_real", "palabra_real", "alivio", "palabra_real", "palabra_real"],
    "segundos": 10
  }
}
```

- codigo: REP-CA-Lnn-VEL-nnn, correlativo desde el siguiente libre que te indiquen.
- desglose_tipos: una entrada por palabra, valores vocal, silaba, silaba_inversa, silaba_mixta,
  silaba_trabada, estructura_compleja, pseudopalabra, palabra_real o alivio.
- sonoridad y esfuerzo: nombres exactos de los términos catalanes (lista de
  plans/multiidioma/estructura-ca.md, apartados 3 y 4); al menos uno de los dos.
- El fichero: {"lote": "repeticion-ca-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Qué entregar

1. El fichero JSON del lote.
2. La lista de pseudopalabras con la comprobación de que no existen en catalán ni en castellano.
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
