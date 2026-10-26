# 05. Contenido catalán: escala, taxonomía, términos, manifiesto y lotes

- **Modelo recomendado: Fable** para convertir el trabajo del experto en documentos del catálogo,
  JSON de términos y bloque catalán del manifiesto (hay criterio lingüístico y pedagógico que
  contrastar, no solo formato). **Cowork y Codex** para la generación de lotes a partir de los
  documentos ya cerrados, como se hizo con el banco de imágenes.
- Fase: 18 (multiidioma). Alcance: documentación, scripts de términos, manifiesto y lotes en
  shine/content/. Sin código nuevo en módulos.
- Dependencias: 02 (importador bilingüe). La estructura catalana ya está entregada
  (plans/multiidioma/Shine en Catalán.md, respuesta del experto del 2026-10-26) y normalizada
  (plans/multiidioma/estructura-ca.md); los términos están en shine/scripts/phonology-terms.ca.json.
  El experto ha validado el CSV del banco y ha respondido las preguntas del apartado 6 de
  estructura-ca.md (resposta-estructura-ca.md, 2026-10-26): no queda nada pendiente de él para
  empezar.

## Prompt

Lee plans/multiidioma/Shine en Catalán.md (respuesta del experto), plans/multiidioma/estructura-ca.md
(decisiones y nombres definitivos; manda sobre el documento del experto donde difieran),
plans/multiidioma/estructura.md (apartado 9.1, criterios del CSV), el CSV del banco revisado,
plans/multiidioma/analisis.md (sección 6), docs/exercise-catalog.md entero y
docs/generador/Taxonomía fonológica.md y Guía de Parametrización.md (los equivalentes castellanos
de lo que hay que producir) y plans/multiidioma/resposta-estructura-ca.md (las respuestas del
experto, ya aplicadas en estructura-ca.md y en el CSV).

Tareas:

1. **Catálogo**: añade a docs/exercise-catalog.md la tabla 2.3 catalana y el perfil lector
   catalán de 2.2 (una subsección por idioma, tomadas de Shine en Catalán.md, con la fuente de
   frecuencias CTILC o BDLOC), el ciclo Síl·labes con sus 8 bloques y pesos (estructura-ca.md,
   apartado 2) junto al inventario castellano de 5.3, la tabla de nivel mínimo catalana
   (estructura-ca.md, apartado 5) en 3.5, y en cada tipo (secciones 5 y 6) lo que cambia en
   catalán (apóstrofos y contracciones en segmentación, l·l, ç, ny e ix en la matriz, silabeo del
   IEC en sílabas, alivio en parpadeo). Anota las decisiones que contradigan la versión
   castellana.
2. **Taxonomía fonológica catalana**: docs/generador/Taxonomía fonológica (català).md con la
   misma estructura que la castellana (grupos, términos, letras, ejemplos, motivo clínico), a
   partir de estructura-ca.md apartados 3 y 4 y de la justificación del experto. El JSON
   scripts/phonology-terms.ca.json ya existe (02 lo importa); si el experto cambia algo, se
   cambia ahí y se reimporta. Ejecuta el script en local y comprueba que los términos catalanes
   tienen langcode ca y que los filtros JSON:API por grupo funcionan dentro del idioma.
3. **Guía de parametrización catalana**: docs/generador/Guía de Parametrización (català).md con un
   ejemplo por tipo y nivel, como la castellana.
4. **Traducciones de interfaz revisadas**: sustituye las provisionales de 01 (áreas, ciclo,
   mensajes de explicación y motivación) por las del experto, en el script de 01.
5. **Banco de imágenes**: bloque ca en manifest.json a partir del CSV validado (nombre, artículo,
   sílabas, lectura, grupos fonológicos, usable); las no usables en catalán quedan marcadas, no
   se borran.
   Actualiza docs/generador/Banco de imágenes.md con la tabla catalana (o un enlace al manifiesto
   como fuente) y la nota de parejas que dejan de serlo. Si el experto pidió imágenes nuevas,
   genera un lote con Cowork con el mismo prompt y estilo (anclas incluidas).
6. **Lotes catalanes** por este orden, cada uno validado con --dry-run, importado sin publicar,
   revisado por el experto (muestra del 10 %, al menos 5 por nivel) y publicado: matriz de letras
   (en su mayoría con idiomas [es, ca]), posición de imágenes (nombres catalanes), parpadeo de
   sílabas (compartidas revisadas y propias), ciclo de sílabas catalán (actividades de parpadeo
   con field_cycle y peso, los 8 bloques de estructura-ca.md apartado 2), reordenamiento de
   sílabas, repetición rápida, segmentación léxica,
   lista de texto y lectura en voz alta. Objetivo mínimo antes de abrir el catalán: al menos 3
   actividades publicadas por área y nivel en Level0 a Level2 (regla 3.3 del catálogo), medido
   con la cobertura por idioma del importador. Los prompts de generación para Cowork o Codex van
   en plans/multiidioma/prompts-contenido/ con la misma estructura que docs/generador/Banco de
   imágenes.md (contexto, reglas, lista, entrega).
7. **Inventario** con --lang=ca antes de cada lote para no repetir material, como en castellano.

## Verificación

- shine-content:inventory --lang=ca y la tabla de cobertura muestran el mínimo por área y nivel
  en Level0 a Level2 sin asteriscos.
- shine-level:generate --dry-run con el alumno ca produce sesiones completas (cuatro huecos de
  área y el ciclo) en Level0 y sube de nivel con el bloque inicial sin avisos de techo.
- Revisión del experto registrada (qué lotes, qué muestra, qué se corrigió).

## Al terminar

Marca la fila en plans/multiidioma/README.md y anota en docs/progress.md (FASE 18) el estado de
cobertura por tipo y nivel y lo que queda por generar.
