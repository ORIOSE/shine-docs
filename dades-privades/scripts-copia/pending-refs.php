<?php
$storage = \Drupal::entityTypeManager()->getStorage('node');
$ids = \Drupal::entityQuery('node')->accessCheck(FALSE)->condition('type', 'session')->condition('uid', [42, 43], 'IN')->condition('status', 1)->execute();
foreach ($storage->loadMultiple($ids) as $s) {
  $refs = array_column($s->get('field_activities')->getValue(), 'target_id');
  $done = $s->hasField('field_completed_at') && !$s->get('field_completed_at')->isEmpty();
  $hit = array_intersect($refs, [123, 126, 127]);
  echo "sesión {$s->id()} uid {$s->getOwnerId()} " . ($done ? 'completada' : 'PENDIENTE') . ' -> ' . ($hit ? 'usa ' . implode(',', $hit) : 'ok') . "\n";
}
