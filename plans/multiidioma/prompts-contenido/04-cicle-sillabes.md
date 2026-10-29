# Ciclo obligatorio Síl·labes (catalán): prompt de generación

Notas internas y, desde el título "Prompt", lo que se pega en Cowork o Codex para ampliar o
corregir el ciclo. Convenciones comunes en [README.md](README.md); mecanismo del ciclo en
docs/exercise-catalog.md 5.3 y docs/level-system.md sección 7; bloques, familias y pesos en
plans/multiidioma/estructura-ca.md apartado 2.

## Notas internas

- **Lote** (2026-10-26): shine/content/ciclo-sillabes-ca-v1.json, 44 actividades de parpadeo con
  `ciclo: "Sílabas"` (el término es único y traducido: "Síl·labes" en catalán) y `peso_ciclo` de
  10 en 10, códigos BLK-CA-CIC-SILABAS-010 a 440. Importado y publicado en local; pendiente de la
  revisión del experto. El generador de sesiones da a cada alumno catalán estas actividades en
  orden de peso, una por sesión regular, sin repetir hasta acabarlas (nextOfCycle filtra por el
  idioma del alumno: un alumno castellano no las ve; hoy el ciclo castellano no existe).
- **Bloques y pesos** (estructura-ca.md 2): 1 vocales (10); 2 directas iniciales m p l s t n d
  (20 a 80); 3 resto de directas f, b/v, r, rr, ny, ll, j/g, z/c/ç, c/qu, g/gu, h, x (90 a 200);
  4 dígrafos propios ss, ix, tx, ig, tg/tj (210 a 250); 5 inversas con l, n, s, r (260 a 290);
  6 trabadas con l (300 a 340); 7 trabadas con r (350 a 410); 8 finales ns/st/ts/cs/nc, ela
  geminada y apóstrofo l’/d’ (420 a 440). Los huecos de 10 permiten intercalar familias nuevas.
- **Composición de cada actividad**: las 4 o 5 sílabas (o grupos) de la familia en orden, las
  mismas **desordenadas, una por pantalla**, y 3 palabras catalanas frecuentes que las contienen;
  11 a 13 elementos, 3,0 s. La v1 llevaba la vuelta desordenada en parejas ("mu ma", "u a")
  porque el importador rechazaba los repetidos; el experto la corrigió el 2026-10-27
  (plans/multiidioma/resposta-revisio-lots-ca.md, punto 1): dos sílabas por pantalla doblan la
  carga de un niño de 5 años y dos vocales juntas se leen como diptongo. El importador admite
  ahora repetidos que no vayan seguidos. En la v1 el orden desordenado se eligió con
  random.Random(peso_ciclo) entre las permutaciones sin ninguna pareja consecutiva del orden
  original y sin empezar por la última sílaba de la vuelta ordenada.
- **Patrones de lectura fluida, validados por el experto** (2026-10-27): en las familias rr, ss,
  tg/tj la "sílaba" presentada (rra, assa, tge) no es una sílaba según el IEC (car-ro, tas-sa,
  met-ge), sino el grupo de lectura habitual en los métodos; en ix, tx e ig, los grupos finales
  (aix, atx, aig); en la ela geminada, al·la, el·le...; en el apóstrofo, grupos reales (l’avi,
  d’or). Se mantienen, y el tutor tiene que saber que entrenan el reconocimiento visual del dígrafo
  y no sustituyen la división silábica del IEC (catálogo 5.3). Las pseudopalabras y las palabras de
  frecuencia dudosa del primer lote también quedaron validadas.
- **Level0 y Competencia Lingüística y Fonológica** son obligatorios en las actividades de ciclo y
  el generador los ignora; no cuentan para la cobertura ni para el techo por contenido.
- **Avisos esperables**: el importador avisa de sobreuso de las vocales (a, e, u) porque las
  actividades de nivel las usan de alivio; no bloquea.

---

## Prompt

> Todo lo que sigue se pega en la herramienta. Antes, adjuntar shine/content/ciclo-sillabes-ca-v1.json
> (el ciclo vigente: no repetir familias ni pesos) y plans/multiidioma/estructura-ca.md.

Actúas como logopeda y como ingeniero de contenido de **Shine** (ejercicios de lectura para niños
con dislexia, en catalán). Vas a **ampliar o corregir el ciclo obligatorio "Síl·labes"**: una
secuencia de actividades de parpadeo (`activity_blink`) por familia silábica, en orden pedagógico,
por las que pasa todo alumno catalán al margen de su nivel, una por sesión.

### Reglas

1. **Una actividad por familia**, con `ciclo: "Sílabas"` y `peso_ciclo` múltiplo de 10 que
   respeta el orden de los 8 bloques (vocales; directas iniciales; resto de directas; dígrafos
   propios; inversas; trabadas con l; trabadas con r; finales complejas, l·l y apóstrofo). Para
   intercalar una familia nueva se usa un peso intermedio (por ejemplo 125 entre r y rr) y para
   corregir una existente se mantiene su código y su peso.
2. **Contenido**: las sílabas de la familia en orden (4 o 5), las mismas desordenadas **una por
   elemento** (nunca dos sílabas en el mismo elemento; ninguna pareja seguida del orden original,
   como "nya, nye"; la primera de la vuelta desordenada no puede ser la última de la ordenada,
   porque el importador rechaza el mismo elemento dos veces seguidas) y 3 palabras catalanas frecuentes y
   familiares para un niño de 5 a 8 años que las contengan; 11 a 13 elementos, máximo 20 caracteres
   cada uno, `segundos_por_elemento` 3.0. Las palabras no pueden coincidir con una sílaba de la
   lista (si la sílaba "gla" está, la palabra no puede ser "gla").
3. **Ortografía normativa** (IEC) y apóstrofo tipográfico (’). Las familias con dígrafo que se
   separa entre sílabas (rr, ss, tx, tg/tj, l·l) se presentan como grupo de lectura (rra, assa,
   atx, tge, al·la); ix e ig, como grupos finales (aix, aig).
4. **Etiquetas** del material: `sonoridad` y `esfuerzo` con los nombres catalanes de segundo nivel
   (por ejemplo ["ny"] y ["Directes resta (CV)", "Dígrafs simples"]; bloque 8: "Complexes (CCVC,
   VCC, CVCC)", "Ela geminada (l·l)", "Apostrofació i contraccions").
5. **Fijos en todas**: `tipo` activity_blink, `idioma` ca, `niveles` ["Level0"], `area_principal`
   "Competencia Lingüística y Fonológica", `area_secundaria` "Rendimiento y Velocidad de
   Procesamiento", `explicacion` "Activity vertical text", instrucción "Llegeix cada síl·laba en
   veu alta així que aparegui i toca per passar a la següent.", título "Cicle: síl·labes amb ny"
   (o "Cicle: grups amb tx", "Cicle: inverses amb l", "Cicle: travades amb pl").
6. **Código**: BLK-CA-CIC-SILABAS-{peso en tres cifras}, por ejemplo BLK-CA-CIC-SILABAS-125.

### Forma exacta del registro

```json
{
  "tipo": "activity_blink",
  "codigo": "BLK-CA-CIC-SILABAS-130",
  "idioma": "ca",
  "titulo": "Cicle: síl·labes amb ny",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Rendimiento y Velocidad de Procesamiento",
  "niveles": ["Level0"],
  "instruccion": "Llegeix cada síl·laba en veu alta així que aparegui i toca per passar a la següent.",
  "explicacion": "Activity vertical text",
  "ciclo": "Sílabas",
  "peso_ciclo": 130,
  "sonoridad": ["ny"],
  "esfuerzo": ["Directes resta (CV)", "Dígrafs simples"],
  "contenido": {
    "grupo_fonetico_objetivo": "ny",
    "elementos": ["nya", "nye", "nyi", "nyo", "nyu", "nyo", "nya", "nyu", "nyi", "nye", "pinya", "canya", "muntanya"],
    "desglose_tipos": ["silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "silaba", "palabra_real", "palabra_real", "palabra_real"],
    "segundos_por_elemento": 3.0
  }
}
```

### Entrega

El fichero shine/content/ciclo-sillabes-ca-v{n}.json completo (todas las familias, las nuevas y
las que no cambian), con `lote`, `descripcion`, `origen` y `actividades`, más la lista de
familias añadidas o cambiadas y de las palabras con duda de frecuencia. Antes de entregar:
`cd shine && ddev drush shine-content:import content/{lote}.json --dry-run` sin errores. Al
importar, una actividad que ya existe con el mismo código se actualiza (si ya tiene resultados de
alumnos, el contenido queda congelado y hay que crear otra con código nuevo).
