# 02. Backend: importador bilingüe, códigos, huella, términos por idioma y handler de imágenes

- **Modelo recomendado: Fable.** Cambia el contrato del lote, el formato del código y la huella de
  contenido (transversales a todos los handlers), añade la dimensión idioma a duplicados,
  unidades, cobertura e inventario, y crea el primer handler con media y paragraphs.
- Fase: 18 (multiidioma). Alcance: solo Drupal (shine/), módulo shine_content y scripts.
- Dependencias: 01 (idiomas y langcode en actividades).

## Prompt

Lee plans/multiidioma/analisis.md (3.4, 3.5, 3.7, 6.2 y 6.3), plans/multiidioma/README.md
(decisiones), docs/exercise-catalog.md (3.4 códigos y huella, 4.3 contrato, 4.4 importador, 5.4
posición de imágenes, 6.2 sílabas), docs/generador/Banco de imágenes.md (secciones 2, 4 y 5.4
manifiesto) y CLAUDE.md (tabla de módulos, shine_content). Trabaja en shine/ con ddev. El
contenido actual es de ejemplo: borra las actividades existentes y reimporta; no conserves códigos.

Tareas:

1. **Clave de idioma en el registro**: idioma (es o ca) o idiomas (lista). Obligatoria; sin ella,
   error de validación. Con idiomas de más de un valor, el importador crea un nodo por idioma con
   el mismo contenido; titulo e instruccion admiten un escalar o un objeto por idioma
   ({es: ..., ca: ...}); un escalar vale para todos. Clave desconocida sigue siendo error.
2. **Código con idioma**: TIPO-XX-Lnn-AREA-nnn (BLK-CA-L00-VEL-001); con idiomas, el registro da
   el código sin la parte de idioma y el importador la inserta (documenta el formato en 3.4 del
   catálogo). Validación: XX coincide con el langcode del nodo. Reescribe los tres lotes de
   shine/content/ con códigos ES. Borra las actividades de demostración (incluidas A1, A2 y A3 y
   las sesiones de prueba que las referencien) y reimporta los lotes.
3. **Huella y duplicados por idioma**: ContentFingerprint::hash incluye el langcode (sha256 de
   tipo, idioma y contenido canónico); check compara solo con actividades del mismo idioma;
   unidades y sobreuso por tipo, nivel e idioma; el hook de presave escribe la huella con idioma.
   shine-content:rehash recalcula todo.
4. **Resolución de términos**: areas, niveles y ciclos por nombre canónico en castellano (son los
   términos originales; la traducción es solo para mostrar). sonoridad y esfuerzo por nombre
   dentro del langcode del registro (TermResolver indexa por vocabulario e idioma). Error claro
   si un término no existe en ese idioma. Con idiomas [es, ca], sonoridad y esfuerzo admiten un
   escalar (mismo nombre en los dos idiomas, por ejemplo p/b o m) o un objeto por idioma, porque
   los vocabularios catalanes tienen nombres propios (s sorda, Directes resta (CV)).
5. **Términos fonológicos por idioma**: convierte create-phonology-terms.php en un script que lee
   un JSON por idioma y crea términos con el langcode del idioma, idempotente por vocabulario,
   idioma y nombre (corrige padre, peso y descripción; nunca borra). Los dos ficheros ya existen y
   no se inventan ni se reescriben: scripts/phonology-terms.es.json (los 8 grupos y 38 términos
   actuales, copiados del script PHP) y scripts/phonology-terms.ca.json (8 grupos, 33 términos de
   sonoridad y 19 de esfuerzo, definidos con el experto en plans/multiidioma/estructura-ca.md).
   Formato: objeto con langcode y vocabularies, y por vocabulario una lista de grupos con name,
   description y children (lista de objetos name y description), en el orden que fija el peso.
   Uso: drush php:script scripts/create-phonology-terms.php -- es (o ca). Comprobaciones: el es
   sobre la base migrada da "sin cambios" en los 38 términos; el ca crea 52 términos con langcode
   ca; los nombres son únicos por vocabulario e idioma (el script falla si no). Documéntalo en el
   catálogo 3.5 y en CLAUDE.md.
6. **Cobertura e inventario por idioma**: la tabla final del importador sale por idioma;
   shine-content:inventory acepta --lang y agrupa el sobreuso y el siguiente código libre por
   idioma; shine-level:generate --dry-run ya informa del idioma (01).
7. **Clave del media del banco**: name = slug del fichero (platano), alt = slug. Actualiza
   SyllableOrderActivityHandler para que la clave imagen del lote sea el slug y la sección 4 de
   docs/generador/Banco de imágenes.md.
8. **Importador del banco de imágenes**: comando shine-content:import-images {manifest.json}
   que crea o actualiza un media image por entrada aceptada (fichero en content/images/, name y
   alt = slug, idempotente por name, sin tocar los existentes si el sha256 coincide) e informa de
   creados, actualizados y sin cambios. Los descartados del manifiesto no se importan.
9. **Handler ImagePositionActivityHandler** (activity_image_position, prefijo IMG, bilingüe
   desde el inicio): contenido grupos, cada uno con posicion y imagenes (lista de {imagen: slug,
   nombre}); nombre admite escalar u objeto por idioma. Crea paragraphs i1 e i1_item (reutiliza
   los existentes si no cambian, como el de sílabas), resuelve el media por slug, exige nombres e
   imágenes distintos dentro del grupo y posicion entre 1 y el tamaño del grupo. canonicalContent =
   grupos con slugs y posiciones (sin nombres); units = slugs. Kernel tests como Fase13HandlersTest.
10. **Lote de ejemplo bilingüe** shine/content/fase18-ejemplos-v1.json: una matriz de letras
    (p/b/d/q) y una posición de imágenes con idiomas [es, ca] y nombres por idioma, más un
    parpadeo solo ca. Importar con --dry-run, importar y publicar; segunda pasada "sin cambios".
11. **Docs**: catálogo (3.4, 3.5, 4.3, 4.4, 5.4 contrato del handler), CLAUDE.md (comandos y tabla
    de módulos), docs/progress.md.

## Verificación

- Kernel tests de shine_content en verde, incluidos: registro sin idioma (error), idiomas
  [es, ca] (dos nodos, dos huellas, dos códigos), duplicado dentro del idioma (error) y mismo
  material en otro idioma (no es duplicado), handler de imágenes con media y paragraphs.
- Inventario: --lang=es y --lang=ca muestran actividades distintas; cobertura por idioma.
- Hito de control del README: shine-level:generate --dry-run con el alumno ca recibe la matriz y
  la posición de imágenes ca y nada en castellano; el alumno es no recibe nada ca.
- Media del banco creados con name = slug; el lote de sílabas de ejemplo referencia imagen por
  slug y la app sigue mostrando la pista.

## Al terminar

Marca la fila en plans/multiidioma/README.md y anota en docs/progress.md (FASE 18) qué se hizo,
decisiones y pendientes.
