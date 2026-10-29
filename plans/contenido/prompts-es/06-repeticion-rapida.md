# 06. Repetición rápida de palabra en castellano (activity_rapid_repetition)

Prompt de generación de lotes castellanos de "Repite rápido". Contrato en docs/exercise-catalog.md
6.4; versión catalana en plans/multiidioma/prompts-contenido/06-repeticio-rapida.md.

## Notas internas

- **Lo que hay**: REP-ES-L00-VEL-001, L01-VEL-001 y L02-VEL-001 (lote de ejemplo de la FASE 16,
  pendiente de revisión terapéutica). Siguiente libre: el del inventario.
- **Etiquetado obligatorio**: el importador exige sonoridad o esfuerzo en este tipo, con los
  términos castellanos de segundo nivel (catálogo 3.5): "Directas iniciales (CV)", "Mixtas (CVC)",
  "Trabadas con r (CCV)", "Complejas (CCVC, VCC, CVCC)"; "m", "s", "ll/y", "k/q/c", "ch"...
  Describen solo el material objetivo, no el alivio.
- **Level0** (criterio del experto para el catalán, 2026-10-27, que vale igual aquí): palabras
  concretas y familiares para un niño de 5 años (mapa, sopa, pato, mesa, moto, pala).
- **Alivio**: desde Level1, una palabra fácil (Level0: mapa, sopa, mula, lupa, pala) intercalada
  en posición aleatoria, nunca al final, marcada alivio en desglose_tipos.
- Las palabras caben en grande en un móvil hasta unos 12 caracteres; el importador admite hasta 30.

---

## Prompt

Actúas como generador de contenido de **Shine**, una aplicación de ejercicios de lectura para niños
y jóvenes con dislexia (de 5 a 15 años) que usan acompañados de un adulto. Vas a escribir un lote
de actividades **en castellano** del ejercicio "Repite rápido" (tipo activity_rapid_repetition):
se muestra una palabra en grande, el adulto pulsa Comenzar, la palabra desaparece y el niño la
repite en voz alta tantas veces como puede durante N segundos mientras el adulto cuenta. La
métrica es el ritmo (repeticiones por segundo); no hay aciertos ni errores. Entregas un JSON que
importa Drupal.

### Reglas del castellano

1. Palabras reales del léxico infantil (catálogo 3.6), pronunciables y de la estructura silábica
   del nivel; pseudopalabras con fonotaxis castellana desde Level4 (trabada o coda más vocal:
   "trubo", "flauma", "plasón"), que no existan en castellano ni en catalán.
2. Ortografía normativa: minúsculas, tildes, diéresis, ñ. Sin espacios ni cifras ni guiones.
3. Nivel mínimo por estructura: Level0, bisílabas CV con m, p, l, s, t, n, d, concretas y
   familiares (mapa, sopa, pato, mesa); Level1, resto de CV, inversas, mixtas CVC (sol, pan, mar,
   árbol), dígrafos (llave, calle, perro, coche, niño); Level2, trabadas CCV (plato, globo, fruta,
   tren), CCVC (plan, tren, flan), gue/gui/güe/güi (juguete, pingüino); Level3, CVCC y VCC
   (instante, transporte, constante), hiatos (país, poeta, baúl), esdrújulas (pájaro, música);
   desde Level4, todas.
4. Cada actividad trabaja **un grupo objetivo** (una estructura y, si procede, una sonoridad):
   "palabras con ll y ñ", "trabadas con r". Se etiqueta ese grupo en esfuerzo (y sonoridad si
   aplica), nunca las palabras de alivio.
5. Alivio: desde Level1, 1 palabra muy fácil (Level0) por actividad, intercalada en una posición
   al azar que no sea la última.

### Parámetros por nivel

| Nivel | Palabras | Segundos por palabra | Material |
|---|---|---|---|
| Level0 | 4 | 10 | Bisílabas CV muy frecuentes (mapa, sopa, pato, mesa); el adulto modela la palabra antes |
| Level1 | 5 (4 + 1 alivio) | 10 | CVC frecuentes (sol, pan, mar), dígrafos (llave, perro, coche, niño) |
| Level2 | 5 (4 + 1 alivio) | 10 | Trabadas (plato, globo, tren, fruta), gue/gui (juguete) |
| Level3 | 5 (4 + 1 alivio) | 15 | CVCC, VCC, hiatos, esdrújulas, 3 a 4 sílabas (instante, transporte, poeta, pájaro) |
| Level4 a Level6 | 5 a 6 | 15 | 4 a 5 sílabas; una o dos pseudopalabras |
| Level7 a Level10 | 6 | 20 | Polisílabas y vocabulario académico; dos pseudopalabras |

### Forma del registro

```json
{
  "tipo": "activity_rapid_repetition",
  "codigo": "REP-ES-L01-VEL-002",
  "idioma": "es",
  "titulo": "Repite rápido: palabras con ll y ñ",
  "area_principal": "Rendimiento y Velocidad de Procesamiento",
  "area_secundaria": "Funciones Ejecutivas y Atención",
  "niveles": ["Level1"],
  "instruccion": "Di tú primero la palabra para que el alumno la oiga y enséñasela. Cuando pulses Comenzar, la palabra se esconderá: el alumno tiene que repetirla en voz alta tantas veces como pueda mientras tú cuentas.",
  "explicacion": "Rapid repetition",
  "sonoridad": ["ll/y"],
  "esfuerzo": ["Directas resto (CV)"],
  "contenido": {
    "grupo_fonetico_objetivo": "Dígrafos ll y ñ con un alivio",
    "palabras": ["llave", "niño", "sopa", "calle", "piña"],
    "desglose_tipos": ["palabra_real", "palabra_real", "alivio", "palabra_real", "palabra_real"],
    "segundos": 10
  }
}
```

- codigo: REP-ES-Lnn-VEL-nnn, correlativo desde el siguiente libre que te indiquen.
- desglose_tipos: una entrada por palabra, valores vocal, silaba, silaba_inversa, silaba_mixta,
  silaba_trabada, estructura_compleja, pseudopalabra, palabra_real o alivio.
- sonoridad y esfuerzo: nombres exactos de los términos castellanos (catálogo 3.5); al menos uno.
- El fichero: {"lote": "repeticion-es-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Qué entregar

1. El fichero JSON del lote.
2. La lista de pseudopalabras con la comprobación de que no existen en castellano ni en catalán.
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
