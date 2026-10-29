# 08. Llista de text en catalán (activity, formato vertical_list)

Prompt de generación de lotes catalanes de "Llista de text". Contrato en docs/exercise-catalog.md
5.1 (con su párrafo "En catalán"); importable desde el 2026-10-27 (handler `TextActivityHandler`,
prefijo LIS). Versión castellana en plans/contenido/prompts-es/08-lista-de-texto.md.

## Notas internas

- **Lo que hay**: nada en catalán. Siguiente código: LIS-CA-Lnn-LIN-001 o LIS-CA-Lnn-VEL-001.
- **Dos usos, dos áreas**: decodificación (palabras nuevas y pseudopalabras; Competencia
  Lingüística y Fonológica, LIS-CA-Lnn-LIN-nnn) y velocidad (palabras conocidas o frases;
  Rendimiento y Velocidad de Procesamiento, LIS-CA-Lnn-VEL-nnn). Reparto del catálogo completo: 2
  de decodificación y 1 de velocidad por nivel (3 de decodificación en Level0).
- **Nunca una traducción de la lista castellana**: léxico y pseudopalabras catalanes, estructuras
  de la tabla 2.3 catalana, alivio del idioma (a, e, ma, pa, sol).
- **Validación**: `--dry-run` (al menos 4 elementos, sin repetidos, sin HTML, 20 caracteres por
  elemento en Level0 a Level2, 60 en Level3 a Level5, 120 desde Level6); `lexico.py --lang ca`
  cuando haya listas.

---

## Prompt

> Antes, adjuntar la salida de `ddev drush shine-content:inventory --lang=ca --type=activity --json`
> y plans/multiidioma/estructura-ca.md.

Actúas como logopeda y como ingeniero de contenido de **Shine**, una aplicación de ejercicios de
lectura para niños y jóvenes con dislexia (5 a 15 años) que usan acompañados de un adulto. Vas a
generar un lote de **llistes de text en catalán** (node `activity`, formato `vertical_list`):
aparece un elemento cada vez (sílaba, palabra, pseudopalabra o frase), en grande; el niño lo lee
en voz alta y toca la pantalla para pasar al siguiente; se mide el tiempo de cada elemento.

### Reglas del material

1. **Catalán normativo** (IEC 2017, variedad central), minúsculas, acentos abiertos y cerrados,
   dièresi, ç, l·l con punto volado (U+00B7), apóstrofo tipográfico (’); sin nombres propios.
   Las frases llevan mayúscula inicial y punto final (guía editorial E11, aprobada el 2026-10-29);
   interrogativas y exclamativas desde Level3. Sílabas y palabras, en minúscula y sin punto.
2. **Elementos homogéneos** dentro de una actividad (todo palabras o todo frases) y sin
   elementos repetidos.
3. **Nivel = edad de referencia 5 + n**. Estructuras, longitud y frecuencia de la tabla 2.3
   catalana y del nivel mínimo de estructura-ca.md (apartado 5): monosílabos CVC muy frecuentes
   desde Level1 (gat, sol, cap), dígrafos simples en Level1 (ny, ll, ss, rr, qu, gu), trabadas y
   dígrafos complejos (tx, ix, ig, tg, tj) en Level2 (con els, al, als, del, dels, pel, pels y los
   plurales regulares en -ns y -ls como excepción), ela geminada, apóstrofos, el resto de
   contracciones e hiatos desde Level3. Rangos de frecuencia del catálogo 3.6.
4. **Variante de pseudopalabras** (desde Level2, decodificación): fonotaxis catalana (pro, pso,
   frou, nyola, plim, trum), sin coincidir con ninguna palabra catalana ni castellana.
5. **Alivio**: el 25 a 30 % de los elementos son sílabas o palabras de Level0 (a, e, ma, pa, sol,
   sopa, casa, lluna), intercaladas al azar, nunca al final ni dos seguidas, marcadas `alivio`.
6. **Longitud por elemento**: 20 caracteres hasta Level2, 60 hasta Level5, 120 desde Level6.
7. **Etiquetas**: en las de decodificación, `sonoridad` o `esfuerzo` del grupo objetivo con los
   términos catalanes exactos (estructura-ca.md 3 y 4); en las de velocidad y en las de frases,
   solo `esfuerzo` si hay una estructura dominante, o nada.
8. **Códigos**: LIS-CA-Lnn-LIN-nnn o LIS-CA-Lnn-VEL-nnn, correlativos desde el siguiente libre.
9. **Cálculo del esfuerzo**: se puede hacer con `shine/content/generadores/etiquetar_lote.py` (`--write`
   rellena los que falten; avisa también de las palabras con estructura por encima del nivel).

### Parámetros por nivel (catálogo 5.1, con léxico catalán)

| Nivel | Elementos | Contenido de cada elemento |
|---|---|---|
| Level0 | 6 | Sílabas directas y bisílabas CV muy frecuentes (mama, pare, sopa, mapa) |
| Level1 | 8 | Palabras de 1 a 3 sílabas con directas, inversas, mixtas y dígrafos simples (sol, gat, pilota, gallina) |
| Level2 | 8 | Palabras con trabadas o dígrafos complejos (plat, tren, cotxe, metge) o frases de 3 a 4 palabras |
| Level3 | 10 | Palabras de 3 y 4 sílabas con estructuras complejas, hiatos, l·l y apóstrofo (instant, transport, piano, col·legi, l’avió); frases de 5 a 6 palabras |
| Level4 | 10 | Palabras de 4 sílabas de frecuencia media; frases de 6 a 8 |
| Level5 | 12 | Palabras de 4 y 5 sílabas; frases de 8 a 10 |
| Level6 | 12 | Palabras poco frecuentes y compuestas; frases de 10 a 12 con subordinada |
| Level7 | 12 | Vocabulario académico; frases de 12 a 14 |
| Level8 | 15 | Tecnicismos y palabras largas; frases de 14 a 16 |
| Level9 | 15 | Palabras de 6 o más sílabas; frases de 16 a 18 |
| Level10 | 15 | Frases de 18 a 22 palabras con vocabulario general adulto |

### Forma del registro

```json
{
  "tipo": "activity",
  "codigo": "LIS-CA-L02-LIN-001",
  "idioma": "ca",
  "titulo": "Paraules amb pl i tr",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Rendimiento y Velocidad de Procesamiento",
  "niveles": ["Level2"],
  "instruccion": "Llegeix cada paraula en veu alta i toca la pantalla per passar a la següent.",
  "explicacion": "Activity vertical text",
  "esfuerzo": ["Travades amb l (CCV)", "Travades amb r (CCV)"],
  "contenido": {
    "formato": "vertical_list",
    "grupo_fonetico_objetivo": "pl i tr",
    "elementos": ["plat", "pla", "sol", "tren", "plimo", "truita", "mapa", "trumo"],
    "desglose_tipos": ["palabra_real", "silaba_trabada", "alivio", "palabra_real", "pseudopalabra", "palabra_real", "alivio", "pseudopalabra"],
    "segundos_por_elemento": 2.0
  }
}
```

- `formato` siempre "vertical_list". `segundos_por_elemento` opcional (palabras × 60 / velocidad
  de la tabla 2.3 catalana, mínimo 1,5). `desglose_tipos` y `grupo_fonetico_objetivo` no se
  guardan. Áreas, niveles y explicación con su nombre castellano canónico.
- El fichero: {"lote": "lista-ca-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Entrega

1. El fichero JSON del lote.
2. La lista de pseudopalabras con la comprobación de que no existen en catalán ni en castellano.
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
