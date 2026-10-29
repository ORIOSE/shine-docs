<?php
$s = \Drupal::entityTypeManager()->getStorage('activity_message');
foreach ($s->loadMultiple() as $m) {
  $types = $m->hasField('field_activity_types') ? implode(',', array_column($m->get('field_activity_types')->getValue(), 'value') ?: array_column($m->get('field_activity_types')->getValue(), 'target_id')) : '-';
  $es = strip_tags($m->get('description')->value ?? '');
  $ca = $m->hasTranslation('ca') ? strip_tags($m->getTranslation('ca')->get('description')->value ?? '') : '(sin ca)';
  echo "{$m->id()} {$m->bundle()} '{$m->label()}' tipos[$types]\n  es: " . mb_substr($es, 0, 140) . "\n  ca: " . mb_substr($ca, 0, 140) . "\n";
}
