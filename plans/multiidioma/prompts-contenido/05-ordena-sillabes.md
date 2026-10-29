# 05. Reordenamiento de sílabas en catalán (activity_syllable_order)

Prompt de generación de lotes catalanes de "Ordena les síl·labes". Notas internas primero; desde el
título "Prompt", lo que se pega en Cowork o en Codex.

## Notas internas

- **Primer lote** (2026-10-26, subplan 05): shine/content/silabas-ca-level0-2-v1.json, 9
  actividades (3 por nivel en Level0 a Level2), escrito a mano desde el bloque ca del manifiesto
  del banco de imágenes. Códigos SIL-CA-L00-LIN-001 a SIL-CA-L02-LIN-003. Siguiente libre:
  SIL-CA-L00-LIN-004, SIL-CA-L01-LIN-004, SIL-CA-L02-LIN-004 (comprobar con el inventario).
- **Fuente de palabras con imagen**: shine/content/images/manifest.json, entrada.ca (nombre,
  silabas con el silabeo del IEC, lectura L0 a L5, usable). Solo entradas aceptadas y usable true.
  La clave imagen del lote es el slug del fichero (manzana para "poma", muneca para "nina").
- **Silabeo**: el del manifiesto (validado por el experto), nunca uno automático. Los dígrafos
  tx, ix, ig, tg, tj, ss, rr y l·l se separan (cot-xe, cai-xa, met-ge, tas-sa, col-le-gi); ny, ll,
  qu y gu van unidos (pi-nya, llu-na, quin). Hiatos en sílabas distintas (pi-a-no, lle-ó, a-vi-ó).
- **Ambigüedad**: ninguna otra permutación de las fichas forma una palabra catalana. Descartadas en
  el primer lote: casa (saca), vaca (cava), pipa (papi), pala (lapa), tapa (pata). El experto validó
  el criterio el 2026-10-27, mientras la app solo acepte el orden declarado. Con sobrantes, las
  sobrantes tampoco pueden formar otra palabra con las demás.
- **Validado por el experto (2026-10-27)**: ala (a-la) y ona (o-na) en Level0; y la ela geminada
  con el punto volado en la ficha anterior (col·-le-gi), que es como se escribe en el lote.
- **Nivel mínimo por estructura** (estructura-ca.md 5): CV con m, p, l, s, t, n, d en Level0;
  resto de directas, inversas, mixtas y dígrafos simples en Level1; trabadas y dígrafos complejos
  en Level2; CVCC, hiatos, ela geminada y apóstrofos desde Level3. Los monosílabos no sirven (una
  sola ficha).
- **Hoy solo existen Level0 a Level2** en local; el prompt cubre hasta Level10 para cuando se creen
  los demás términos.
- Importación: cd shine && ddev drush shine-content:import content/{lote}.json --dry-run, después
  --publish. Revisión del experto registrada en plans/multiidioma/revisio-lots-ca.md.

---

## Prompt

Actúas como generador de contenido de **Shine**, una aplicación de ejercicios de lectura para niños
y jóvenes con dislexia (de 5 a 15 años) que usan acompañados de un adulto. Vas a escribir un lote
de actividades **en catalán** del ejercicio "Ordena les síl·labes" (tipo activity_syllable_order):
las sílabas de una palabra aparecen desordenadas en fichas y el niño las toca en orden para formar
la palabra; en los niveles bajos ve un dibujo como pista. Entregas un fichero JSON que importa
Drupal sin tocar nada a mano, así que el formato es exacto.

### Reglas del catalán

1. **Silabeo normativo del IEC.** Dígrafos que se separan entre sílabas: tx (cot-xe), ix (cai-xa),
   ig, tg (met-ge), tj (plat-ja), ss (tas-sa), rr (car-ro), l·l (col·-le-gi: el punto volado se queda
   en la primera ficha, para que al unirlas salga col·legi y no collegi). Dígrafos que van unidos: ny (pi-nya), ll (llu-na), qu (quin), gu (gui-neu). Hiatos en
   sílabas distintas (pi-a-no, lle-ó, co-et). Las palabras con imagen llevan su silabeo en el
   manifiesto del banco (bloque ca): úsalo tal cual.
2. **Ortografía**: minúsculas, acentos abiertos y cerrados (è, ò, é, ó, í, ú, à), diéresis (ï, ü),
   ç y punto volado (U+00B7) en l·l. Nunca mayúsculas ni nombres propios.
3. **Sin ambigüedad**: ninguna otra permutación de las fichas forma una palabra catalana (co-sa y
   sa-co, va-ca y ca-va). Con sílabas sobrantes, tampoco con ellas. Si hay duda, otra palabra.
4. **Frecuencia**: palabras del léxico infantil (CTILC o BDLOC como referencia): hasta las 500 más
   frecuentes en Level0, 1.000 en Level1, 2.000 en Level2, 3.000 en Level3, 5.000 en Level4,
   7.000 en Level5, 10.000 en Level6, 15.000 en Level7, 20.000 en Level8; sin límite desde Level9.
5. **Estructuras por nivel** (nivel mínimo en que puede aparecer cada una): Level0, sílabas CV con
   m, p, l, s, t, n, d; Level1, resto de CV (c/qu, g/gu, r/rr, ny, ll, ss, j/g, z/c/ç, x), inversas
   VC y mixtas CVC (gat, sol), dígrafos simples; Level2, trabadas CCV con l y r (pla, bra), dígrafos
   complejos (tx, ig, tg, tj, ix), gue/gui/güe/güi; Level3, CVCC y VCC (temps, ins), hiatos, ela
   geminada y apóstrofos (no hay apóstrofos en este tipo: una ficha nunca lleva apóstrofo);
   desde Level4, todas.

### Parámetros por nivel

| Nivel | Palabras | Sílabas por palabra | Estructuras | Sobrantes | Imagen |
|---|---|---|---|---|---|
| Level0 | 4 | 2 | CV con m, p, l, s, t, n, d (mu-la, so-pa) | 0 | Siempre |
| Level1 | 5 | 2 a 3 | Directas, inversas, mixtas, dígrafos simples (ga-lli-na, co-nill) | 0 | Siempre |
| Level2 | 5 | 2 a 3 | Con trabadas o dígrafos complejos (ca-bra, cot-xe, mot-xi-lla) | 0 | Siempre |
| Level3 | 6 | 3 a 4 | Complejas, hiatos, ela geminada (pi-a-no, li-bel-lu-la, en-tre-pà) | 0 | Como pista activable |
| Level4 | 6 | 4 | Todas (bi-ci-cle-ta, pas-ta-na-ga) | 0 | Pista |
| Level5 | 6 | 4 | Todas | 1 | Pista |
| Level6 | 6 | 5 | Todas | 1 | Sin imagen |
| Level7 | 6 | 5 | Todas | 1 parecida a una de la palabra (bra si está bar) | Sin imagen |
| Level8 | 6 | 5 a 6 | Baja frecuencia | 1 parecida | Sin imagen |
| Level9 | 6 | 6 | Baja frecuencia | 2 parecidas | Sin imagen |
| Level10 | 6 | 6 a 7 | Vocabulario académico | 2 parecidas | Sin imagen |

Sin palabras repetidas dentro de una actividad; entre actividades del mismo nivel, evita repetir
(el importador avisa cuando una palabra ya está en 3 actividades del mismo tipo, idioma y nivel).
La imagen solo si existe en el banco (slug de la entrada; usable true en el bloque ca).

### Etiquetas fonológicas

- **`esfuerzo`** (obligatorio): los términos catalanes de la taxonomía `decoding_effort` de las
  estructuras de nivel más alto que aparecen en el material (por ejemplo, "Dígrafs complexos" si la
  más difícil es tx o ig). Lo calcula `shine/content/generadores/etiquetar_lote.py`: puedes dejarlo
  vacío y ejecutar `python3 etiquetar_lote.py ../{lote}.json --write`, o ponerlo a mano y comprobar
  que coincide. El mismo script avisa de las palabras con una estructura por encima del nivel.
- **`sonoridad`** (solo si la actividad trabaja un grupo fonético concreto, por ejemplo todas las
  palabras con ny o con tx/ig): los términos catalanes de la taxonomía `sonority`. Si la actividad no
  se centra en un grupo, no se pone.

### Forma del registro

```json
{
  "tipo": "activity_syllable_order",
  "codigo": "SIL-CA-L01-LIN-004",
  "idioma": "ca",
  "titulo": "Ordena les síl·labes amb dibuix",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Memoria de Trabajo (Auditiva y Visual)",
  "niveles": ["Level1"],
  "instruccion": "Mira el dibuix i toca les síl·labes en ordre per formar el seu nom.",
  "explicacion": "Syllable order",
  "contenido": {
    "palabras": [
      {"silabas": "ga-lli-na", "imagen": "gallina"},
      {"silabas": "co-nill", "imagen": "conejo"},
      {"silabas": "ca-di-ra", "imagen": "silla"},
      {"silabas": "llu-na", "imagen": "luna"},
      {"silabas": "pe-ra", "imagen": "pera"}
    ]
  }
}
```

- codigo: SIL-CA-Lnn-LIN-nnn, nn = nivel, nnn correlativo a partir del siguiente libre que te
  indiquen (nunca se reutiliza un código).
- Sin imagen: "silabas" solo, o con "sobrantes" ("bra") desde Level5. Título sin imagen: "Ordena
  les síl·labes". Instrucción sin imagen: "Toca les síl·labes en ordre per formar la paraula."
- areas, niveles y explicacion van con esos nombres exactos (son claves del sistema, en castellano).
- El fichero: {"lote": "silabas-ca-level{a}-{b}-v{n}", "descripcion": "...", "origen": {"generador":
  "...", "version": "...", "nota": "..."}, "actividades": [...]}.

### Qué entregar

1. El fichero JSON del lote.
2. Una lista de las palabras descartadas por ambigüedad (con la otra lectura) y de las que no tienen
   imagen en el banco.
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
