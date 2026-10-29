# 08. Lista de texto en castellano (activity, formato vertical_list)

Prompt de generación de lotes castellanos de "Lista de texto". Contrato en docs/exercise-catalog.md
5.1; importable desde el 2026-10-27 (handler `TextActivityHandler`, prefijo LIS). Versión catalana
en plans/multiidioma/prompts-contenido/08-llista-de-text.md.

## Notas internas

- **Lo que hay**: nada. Es un tipo nuevo en el catálogo real; el inventario
  (`--lang=es --type=activity`) da el siguiente código libre (LIS-ES-Lnn-AREA-001).
- **Dos usos, dos áreas**: decodificación (palabras nuevas y pseudopalabras; área principal
  Competencia Lingüística y Fonológica, código LIS-ES-Lnn-LIN-nnn) y velocidad (palabras
  conocidas o frases leídas deprisa; área principal Rendimiento y Velocidad de Procesamiento,
  código LIS-ES-Lnn-VEL-nnn). El reparto del catálogo completo pide 2 de decodificación y 1 de
  velocidad por nivel (3 de decodificación en Level0).
- **Diferencia con el parpadeo**: aquí el elemento puede ser una palabra larga o una frase (hasta
  120 caracteres desde Level6) y **no se repite ningún elemento** dentro de la actividad; el
  parpadeo trabaja sílabas y grupos cortos.
- **field_seconds**: opcional (`segundos_por_elemento`); la app no lo usa todavía. Si se pone,
  palabras del elemento × 60 / velocidad de referencia del nivel (tabla 2.3), mínimo 1,5.
- **Validación**: `--dry-run` (al menos 4 elementos, sin repetidos, sin HTML, 20 caracteres por
  elemento en Level0 a Level2, 60 en Level3 a Level5, 120 desde Level6); puerta léxica
  `lexico.py` cuando haya listas.

---

## Prompt

> Antes, adjuntar la salida de `ddev drush shine-content:inventory --lang=es --type=activity --json`.

Actúas como logopeda y como ingeniero de contenido de **Shine**, una aplicación de ejercicios de
lectura para niños y jóvenes con dislexia (5 a 15 años) que usan acompañados de un adulto. Vas a
generar un lote de **listas de texto en castellano** (node `activity`, formato `vertical_list`):
aparece un elemento cada vez (sílaba, palabra, pseudopalabra o frase), en grande; el niño lo lee
en voz alta y toca la pantalla para pasar al siguiente; se mide el tiempo de cada elemento y el
adulto puede contar errores.

### Reglas del material

1. **Castellano normativo** (RAE), minúsculas salvo lo que lleve mayúscula por norma (ninguna: no
   hay nombres propios), tildes y diéresis correctas, sin puntuación en palabras sueltas; las
   frases llevan su puntuación normal (coma, punto final).
2. **Elementos homogéneos** dentro de una actividad: todo palabras (o pseudopalabras) o todo
   frases, para que los tiempos por elemento se comparen entre intentos. Sin elementos repetidos.
3. **Nivel = edad de referencia 5 + n**. Estructuras, longitud y frecuencia de la tabla 2.3
   (catálogo 3.6 para los rangos: 500, 1.000, 2.000, 3.000, 5.000, 7.000, 10.000, 15.000, 20.000,
   sin límite).
4. **Variante de pseudopalabras** (desde Level2, uso de decodificación): palabras inventadas con
   las sílabas admitidas en el nivel, pronunciables, que no existan en castellano ni en catalán.
   Se mezclan con palabras reales del mismo grupo (sílaba, pseudopalabra, palabra real).
5. **Alivio**: el 25 a 30 % de los elementos son sílabas o palabras de Level0 (ma, pa, sol, sopa,
   mesa, casa, luna), intercaladas en posiciones al azar, nunca al final ni dos seguidas, marcadas
   `alivio` en `desglose_tipos`.
6. **Longitud por elemento**: 20 caracteres como mucho en Level0 a Level2, 60 en Level3 a Level5,
   120 desde Level6.
7. **Etiquetas**: en las listas de decodificación, `sonoridad` o `esfuerzo` del grupo objetivo
   (términos castellanos del catálogo 3.5); en las de velocidad y en las de frases, solo
   `esfuerzo` si hay una estructura dominante, o nada.
8. **Códigos**: LIS-ES-Lnn-LIN-nnn (decodificación) o LIS-ES-Lnn-VEL-nnn (velocidad), correlativos
   desde el siguiente libre del inventario.
9. **Cálculo del esfuerzo**: se puede hacer con `shine/content/generadores/etiquetar_lote.py` (`--write`
   rellena los que falten; avisa también de las palabras con estructura por encima del nivel).

### Parámetros por nivel (catálogo 5.1)

| Nivel | Elementos | Contenido de cada elemento |
|---|---|---|
| Level0 | 6 | Sílabas directas y palabras bisílabas CV muy frecuentes (mamá, pato, sopa, mesa) |
| Level1 | 8 | Palabras de 2 y 3 sílabas con directas, inversas, mixtas y diptongos (sol, árbol, pelota, huevo) |
| Level2 | 8 | Palabras con trabadas (plato, tren, playa, trigo) o frases de 3 a 4 palabras |
| Level3 | 10 | Palabras de 3 y 4 sílabas con estructuras complejas e hiatos (instante, transporte, país); frases de 5 a 6 palabras |
| Level4 | 10 | Palabras de 4 sílabas de frecuencia media; frases de 6 a 8 |
| Level5 | 12 | Palabras de 4 y 5 sílabas; frases de 8 a 10 |
| Level6 | 12 | Palabras poco frecuentes y compuestas; frases de 10 a 12 con subordinada |
| Level7 | 12 | Vocabulario académico; frases de 12 a 14 |
| Level8 | 15 | Tecnicismos y esdrújulas largas; frases de 14 a 16 |
| Level9 | 15 | Palabras de 6 o más sílabas; frases de 16 a 18 |
| Level10 | 15 | Frases de 18 a 22 palabras con vocabulario general adulto |

Ejemplos de referencia (docs/generador/Guía de Parametrización.md, 1): Level1 "pro, pso, cro,
sol, cra, proba, profe, casa"; Level3 "tra, trau, transporte, no, bla, blau, blanco, si, tras,
trasgo"; Level6 "limpiaparabrisas, parabros, casa, biodiversidad, biodiverfa, pelo...".

### Forma del registro

```json
{
  "tipo": "activity",
  "codigo": "LIS-ES-L02-LIN-001",
  "idioma": "es",
  "titulo": "Palabras con pl y tr",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Rendimiento y Velocidad de Procesamiento",
  "niveles": ["Level2"],
  "instruccion": "Lee cada palabra en voz alta y toca la pantalla para pasar a la siguiente.",
  "explicacion": "Activity vertical text",
  "esfuerzo": ["Trabadas con l (CCV)", "Trabadas con r (CCV)"],
  "contenido": {
    "formato": "vertical_list",
    "grupo_fonetico_objetivo": "pl y tr",
    "elementos": ["plato", "pla", "sol", "tren", "plimo", "trigo", "mesa", "truno"],
    "desglose_tipos": ["palabra_real", "silaba_trabada", "alivio", "palabra_real", "pseudopalabra", "palabra_real", "alivio", "pseudopalabra"],
    "segundos_por_elemento": 2.0
  }
}
```

- `formato` siempre "vertical_list". `segundos_por_elemento` opcional. `desglose_tipos` y
  `grupo_fonetico_objetivo` no se guardan: sirven para la revisión.
- Frases (uso de velocidad, desde Level2): `elementos` son frases completas ("el gato duerme en
  la silla"), con mayúscula inicial y punto si se quiere; cada frase cuenta como un elemento.
- El fichero: {"lote": "lista-es-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Entrega

1. El fichero JSON del lote.
2. La lista de pseudopalabras con la comprobación de que no existen en castellano ni en catalán.
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
