# 04. Ciclo obligatorio Sílabas (castellano): prompt de generación

Mecanismo del ciclo en docs/exercise-catalog.md 5.3 y docs/level-system.md sección 7; versión
catalana (ya cargada, 44 actividades) en plans/multiidioma/prompts-contenido/04-cicle-sillabes.md.

## Notas internas

- **Estado**: el castellano no tiene ciclo cargado. El término "Sílabas" de activity_cycle existe
  (scripts/create-cycle-term.php) y el generador de sesiones ya mete una actividad de ciclo por
  sesión regular cuando las hay en el idioma del alumno: hoy un alumno castellano no recibe
  ninguna. Es el primer lote del catálogo completo (plans/contenido/README.md, orden de trabajo).
- **Bloques y pesos** (catálogo 5.3, inventario propuesto): 1 vocales (10); 2 directas iniciales
  m p l s t n d (20 a 80); 3 resto de directas f, b/v, r, rr, ñ, ch, ll/y, j, z/ce/ci, c/qu, g/gu,
  güe/güi, h, x (90 a 220); 4 inversas con l, n, s, r (230 a 260); 5 trabadas con l pl bl cl fl gl
  (270 a 310); 6 trabadas con r pr br cr fr gr tr dr (320 a 380). 38 actividades, pesos de 10 en
  10 para poder intercalar familias después. El catalán tiene además dígrafos propios y un bloque
  final (ela geminada, apóstrofo), que en castellano no existen.
- **Composición** (regla del 2026-10-27 tras la revisión del experto del ciclo catalán): las
  sílabas de la familia en orden, las mismas desordenadas **una por pantalla** (ninguna pareja
  seguida del orden original; la primera de la vuelta desordenada no puede ser la última de la
  ordenada, porque el importador rechaza el mismo elemento dos veces seguidas) y 3 palabras
  frecuentes que las contengan: 11 a 13 elementos, 3,0 s.
- **Grupos de lectura que no son sílabas**: en rr, ll y ch la "sílaba" presentada es el grupo de
  lectura habitual en los métodos (rra, lla, cha); en castellano coincide con la sílaba ortográfica
  (pe-rro, ca-lle, co-che), así que no hay conflicto con la RAE. Las familias z/ce/ci y c/qu
  mezclan grafías del mismo sonido a propósito (za ce ci zo zu; ca que qui co cu); g/gu y
  güe/güi igual (ga gue gui go gu; güe güi).
- **Validación**: `ddev drush shine-content:import content/ciclo-silabas-es-v1.json --dry-run`;
  importar y publicar; después `ddev drush shine-level:generate 42 --dry-run` con un alumno
  castellano tiene que mostrar el hueco "Ciclo Sílabas" con la de peso 10.

---

## Prompt

Actúas como logopeda y como ingeniero de contenido de **Shine** (aplicación de ejercicios de
lectura para niños y jóvenes con dislexia, en castellano). Vas a escribir el **ciclo obligatorio
"Sílabas"** en castellano: una actividad de parpadeo (`activity_blink`) por familia silábica, que
todo alumno hace en orden, una por sesión regular, al margen de su nivel, y que se repite desde el
principio cuando se acaba. Entregas un JSON que importa Drupal.

### Reglas

1. **Una actividad por familia**, con `ciclo: "Sílabas"` y `peso_ciclo` múltiplo de 10 en el
   orden de los 6 bloques: vocales (10); directas iniciales m, p, l, s, t, n, d (20 a 80); resto
   de directas f, b/v, r, rr, ñ, ch, ll/y, j, z/ce/ci, c/qu, g/gu, güe/güi, h, x (90 a 220);
   inversas con l, n, s, r (230 a 260); trabadas con l (270 a 310); trabadas con r (320 a 380).
   38 actividades. Para intercalar una familia nueva se usa un peso intermedio (125 entre r y rr).
2. **Contenido**: las sílabas de la familia en orden (4 o 5), las mismas desordenadas **una por
   elemento** (ninguna pareja seguida del orden original; la primera desordenada distinta de la
   última ordenada) y 3 palabras castellanas frecuentes y familiares para un niño de 5 a 8 años
   que las contengan; 11 a 13 elementos, máximo 20 caracteres cada uno,
   `segundos_por_elemento` 3.0. Las palabras no pueden coincidir con una sílaba de la lista.
3. **Ortografía normativa** (RAE). Familias con grafías del mismo sonido: z/ce/ci (za, ce, ci,
   zo, zu), c/qu (ca, que, qui, co, cu), g/gu (ga, gue, gui, go, gu), güe/güi (güe, güi y 2 o 3
   palabras: pingüino, cigüeña, paragüero). b/v (ba, ve, bi, vo, bu); ll/y (lla, ye, lli, yo, llu).
4. **Etiquetas**: `sonoridad` con los términos castellanos de la familia (m; b, f/v para b/v; s/z/c
   para z/ce/ci; k/q/c para c/qu; g para g/gu; ll/y; ch) y `esfuerzo` por bloque (Vocal aislada
   (V); Directas iniciales (CV); Directas resto (CV); Inversas (VC); Trabadas con l (CCV);
   Trabadas con r (CCV)).
5. **Fijos en todas**: `tipo` activity_blink, `idioma` es, `niveles` ["Level0"],
   `area_principal` "Competencia Lingüística y Fonológica", `area_secundaria` "Rendimiento y
   Velocidad de Procesamiento", `explicacion` "Activity vertical text", instrucción "Lee cada
   sílaba en voz alta en cuanto aparezca y toca para pasar a la siguiente.", título "Ciclo:
   sílabas con ñ" (vocales: "Ciclo: las vocales"; inversas: "Ciclo: inversas con l"; trabadas:
   "Ciclo: trabadas con pl").
6. **Códigos**: BLK-ES-CIC-SILABAS-{peso con 3 cifras}: BLK-ES-CIC-SILABAS-010 a 380.

### Forma del registro

```json
{
  "tipo": "activity_blink",
  "codigo": "BLK-ES-CIC-SILABAS-140",
  "idioma": "es",
  "titulo": "Ciclo: sílabas con ñ",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Rendimiento y Velocidad de Procesamiento",
  "niveles": ["Level0"],
  "instruccion": "Lee cada sílaba en voz alta en cuanto aparezca y toca para pasar a la siguiente.",
  "explicacion": "Activity vertical text",
  "ciclo": "Sílabas",
  "peso_ciclo": 140,
  "sonoridad": ["n"],
  "esfuerzo": ["Directas resto (CV)"],
  "contenido": {
    "grupo_fonetico_objetivo": "ñ",
    "elementos": ["ña", "ñe", "ñi", "ño", "ñu", "ño", "ña", "ñu", "ñi", "ñe", "niño", "año", "piña"],
    "desglose_tipos": ["silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "palabra_real", "palabra_real", "palabra_real"],
    "segundos_por_elemento": 3.0
  }
}
```

### Entrega

El fichero shine/content/ciclo-silabas-es-v1.json completo, con `lote`, `descripcion`, `origen` y
las 38 actividades, más la lista de palabras con duda de frecuencia para el experto. Antes de
entregar: `cd shine && ddev drush shine-content:import content/ciclo-silabas-es-v1.json --dry-run`
sin errores.
