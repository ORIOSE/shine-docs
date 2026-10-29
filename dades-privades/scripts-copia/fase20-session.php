<?php
/**
 * FASE 20: sesiones de prueba con secuencias con regla para Marta (42, es) y Pau (43, ca).
 * Idempotente por título. ddev drush php:script private/scripts/fase20-session.php
 */
$st = \Drupal::entityTypeManager()->getStorage('node');
$plan = [
  42 => ['es', 'Prueba FASE 20 (secuencias)', ['SEQ-ES-L00-ATE-001', 'SEQ-ES-L05-ATE-001', 'SEQ-ES-L06-ATE-001', 'SEQ-ES-L09-ATE-001']],
  43 => ['ca', 'Prova FASE 20 (seqüències)', ['SEQ-CA-L02-ATE-001', 'SEQ-CA-L08-ATE-001']],
];
foreach ($plan as $uid => [$lang, $title, $codes]) {
  $ids = [];
  foreach ($codes as $code) {
    $found = $st->loadByProperties(['field_activity_code' => $code]);
    $ids[] = ['target_id' => reset($found)->id()];
  }
  $existing = $st->loadByProperties(['type' => 'session', 'title' => $title, 'uid' => $uid]);
  $session = $existing ? reset($existing) : $st->create(['type' => 'session', 'title' => $title, 'uid' => $uid, 'langcode' => $lang]);
  $session->set('field_activities', $ids)->set('field_session_kind', 'regular')->setPublished()->save();
  printf("%s: nid %d uuid %s, %d actividades\n", $title, $session->id(), $session->uuid(), count($ids));
}
