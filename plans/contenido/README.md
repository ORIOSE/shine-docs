# Catálogo completo: Level0 a Level10, castellano y catalán, ocho tipos

Plan de generación del contenido definitivo (decisiones del 2026-10-27 con el usuario):
**6 actividades por área y nivel en cada idioma** (mínimo de régimen del catálogo 3.3), los ocho
tipos de ejercicio, revisión del experto de todo lo que haga falta y un solo entorno (este es
producción: lo que se importa y publica aquí es lo que ven los alumnos).

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Contrato de cada tipo y parámetros por nivel | docs/exercise-catalog.md (5.1 a 6.4), tabla 2.3 por idioma, nivel mínimo 3.5, léxico 3.6 |
| Prompts castellanos | plans/contenido/prompts-es/03 a 09 (parpadeo, ciclo, sílabas, repetición, segmentación, lista de texto, lectura) |
| Prompts catalanes | plans/multiidioma/prompts-contenido/03 a 09 |
| Prompts bilingües (matriz, posición de imágenes) | plans/multiidioma/prompts-contenido/01 y 02: un registro con `idiomas` [es, ca] y los generadores `shine/content/generadores/matriz.py` e `imagenes.py` |
| Puerta léxica | shine/content/generadores/lexico.py con las listas de shine/private/lexico/ (pendientes del experto) |
| Lotes | shine/content/{tipo}-{es|ca|es-ca}-level{a}-{b}-v{n}.json (ciclo: ciclo-silabas-es-v1.json) |
| Revisión del experto | plans/contenido/revision/{lote}.md (misma forma que plans/multiidioma/revisio-lots-ca.md) |

## Volumen

Celdas = 4 áreas con tipo (Funciones Ejecutivas sigue sin tipo que la cubra) × 11 niveles × 6.

| Área principal | Tipos que la alimentan | Reparto propuesto por celda |
|---|---|---|
| Competencia Lingüística y Fonológica | SIL (sílabas), SEG (segmentación), LIS (lista de texto de decodificación, pseudopalabras) | 2 SIL + 2 SEG + 2 LIS (en Level0: 3 SIL + 3 LIS, sin SEG) |
| Memoria de Trabajo | IMG (posición de imágenes) | 6 IMG |
| Procesos Perceptivos | MAT (matriz) | 6 MAT |
| Rendimiento y Velocidad | BLK (parpadeo), REP (repetición rápida), LEC (lectura en voz alta), LIS (lista de velocidad) | 3 BLK + 1 REP + 1 LEC + 1 LIS (en Level0: 4 BLK + 2 REP, sin LEC) |

Lo que hay a 2026-10-27 (publicado, sin ciclo, Level0 / Level1 / Level2): castellano Lingüística
2 / 1 / 2, Memoria 4 / 3 / 3, Perceptivos 5 / 4 / 4, Velocidad 8 / 8 / 7; catalán Lingüística
3 / 6 / 6, Memoria 4 / 3 / 3, Perceptivos 4 / 3 / 3, Velocidad 10 / 13 / 11, más 44 del ciclo
catalán. Falta: completar Level0 a Level2 hasta 6 (unas 26 en castellano y 19 en catalán), el
ciclo castellano (38) y Level3 a Level10 enteros (192 por idioma). Unas 470 actividades nuevas.

## Orden de trabajo

1. **Ciclo castellano** (ciclo-silabas-es-v1, 38 actividades): es lo único que hoy diferencia
   una sesión regular castellana de una catalana.
2. **Completar Level0 a Level2** en los dos idiomas, con los dos tipos nuevos (LIS y LEC) desde
   Level1.
3. **Level3**, los dos idiomas, todos los tipos; después Level4, y así hasta Level10. Un nivel
   entero por tanda para que el experto revise en bloque y para que el techo por contenido suba
   de forma pareja en las cuatro áreas.

Por tanda: inventario (`drush shine-content:inventory --lang=xx --type=... --json`) para los
códigos y el sobreuso; generar (generadores deterministas para MAT e IMG hasta Level7; el resto
escrito con los prompts); puerta léxica (`lexico.py`, cuando haya listas); `drush
shine-content:import --dry-run`; `python3 shine/content/generadores/etiquetar_lote.py` (esfuerzo y estructuras por
encima del nivel) y `lexico.py --lot` (frecuencia); importación sin publicar; muestra para el experto (10 %, al
menos 5 por nivel, en plans/contenido/revision/); correcciones; `--publish`.

## Quién genera

Decidido el 2026-10-27: los lotes los escribe Claude directamente en este repositorio (los
prompts son el contrato y la referencia para quien quiera reproducirlos en Cowork o Codex), los
de matriz y posición de imágenes salen de los generadores con semilla, y el experto revisa.

## Preguntas abiertas para el experto

- **Decidido (E10, plans/multiidioma/respostes-dubtes-expert.md, 2026-10-28)**:
  - Lectura en voz alta: **un solo párrafo de 35 a 80 palabras en todos los niveles**; desde
    Level4 crece el léxico y la sintaxis, no el volumen. Aplicado en `READING_WORDS` del handler
    (más un solo párrafo), catálogo 2.3 y 5.2 y los dos prompts 09.
  - Nombres propios en la lectura desde Level1: en Level1 y Level2 solo cortos, sin trabadas ni
    hiatos (Pol, Pau, Marc, Pep, Ana, Lola, Sara; Leo, Teo y Mia como excepción, 2026-10-29); desde Level3, los que cumplan la estructura del nivel.
    Aplicado en `lexico.py` y catálogo 3.6.
  - Manda la tabla de nivel mínimo por estructura; los ejemplos de Level1 con trabadas de la guía
    son errores (anotados en la guía).
- **Listas de frecuencia**: sin ficheros todavía (plans/multiidioma/peticio-llistes-frequencia.md
  y su respuesta). Mientras no lleguen, el criterio de frecuencia lo aplica quien genera y lo
  valida él en la muestra.
- **Funciones Ejecutivas**: ningún tipo la cubre; decisión de producto pendiente (matriz con
  regla o un ejercicio nuevo).
