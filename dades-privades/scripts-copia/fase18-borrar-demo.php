<?php

/**
 * @file
 * FASE 18, subplan 02: borra las actividades de demostración y los media de prueba.
 *
 * Decisión 5 del plan: el contenido anterior era de ejemplo. Se borran todos
 * los nodos de actividad (los lotes se reimportan con códigos con idioma),
 * las sesiones que quedan y los cuatro media de prueba (image0.jpeg...),
 * que no son del banco.
 */

$etm = \Drupal::entityTypeManager();
$nodes = $etm->getStorage('node');
$types = ['activity', 'activity_blink', 'activity_image_position', 'activity_letter_matrix', 'activity_rapid_repetition', 'activity_syllable_order', 'activity_word_split', 'session'];
foreach ($types as $type) {
  $ids = $nodes->getQuery()->accessCheck(FALSE)->condition('type', $type)->execute();
  foreach (array_chunk($ids, 50) as $chunk) {
    $nodes->delete($nodes->loadMultiple($chunk));
  }
  echo "$type: borrados " . count($ids) . "\n";
}
$media = $etm->getStorage('media');
$ids = $media->getQuery()->accessCheck(FALSE)->condition('bundle', 'image')->execute();
$media->delete($media->loadMultiple($ids));
echo "media image: borrados " . count($ids) . "\n";
$paragraphs = $etm->getStorage('paragraph');
$ids = $paragraphs->getQuery()->accessCheck(FALSE)->execute();
echo "paragraphs que quedan: " . count($ids) . "\n";
