<?php

/**
 * @file
 * FASE 18, subplan 01, tarea 9: datos de prueba.
 *
 * Borra las sesiones y estadísticas de ejemplo (decisión 5: nada es
 * definitivo), da a jose@test.com una cortesía familiar para que quepan dos
 * alumnos y crea un alumno es y otro ca.
 */

$etm = \Drupal::entityTypeManager();

foreach (['activitylog', 'activitysummary', 'sessionfeedback', 'activityfeedback', 'userarealevel_log', 'userarealevel'] as $type) {
  $storage = $etm->getStorage($type);
  $ids = $storage->getQuery()->accessCheck(FALSE)->execute();
  foreach (array_chunk($ids, 50) as $chunk) {
    $storage->delete($storage->loadMultiple($chunk));
  }
  echo "$type: borrados " . count($ids) . "\n";
}
$nodes = $etm->getStorage('node');
$ids = $nodes->getQuery()->accessCheck(FALSE)->condition('type', 'session')->execute();
$nodes->delete($nodes->loadMultiple($ids));
echo "session: borradas " . count($ids) . "\n";

$users = $etm->getStorage('user');
$jose = $users->loadByProperties(['mail' => 'jose@test.com']);
$jose = reset($jose);
if (!$jose) {
  throw new \RuntimeException('No existe jose@test.com');
}

$entitlements = $etm->getStorage('entitlement');
$existing = $entitlements->loadByProperties(['field_holder' => $jose->id(), 'field_source' => 'manual']);
if (!$existing) {
  $entitlements->create([
    'field_holder' => $jose->id(),
    'field_catalog_plan' => 'family',
    'field_plan' => 'courtesy',
    'field_source' => 'manual',
    'field_status' => 'active',
    'field_quantity' => 1,
  ])->save();
  echo "cortesía familiar creada para jose\n";
}
else {
  echo "jose ya tenía cortesía\n";
}

/** @var \Drupal\shine_account\LearnerManager $manager */
$manager = \Drupal::service('shine_account.learner_manager');
$have = [];
foreach ($manager->listFor($jose) as $learner) {
  $have[(string) $learner->get('preferred_langcode')->value] = $learner;
}
foreach (['es' => 'Marta', 'ca' => 'Pau'] as $langcode => $name) {
  if (isset($have[$langcode])) {
    $learner = $have[$langcode];
    echo "ya existe alumno $langcode: uid {$learner->id()}\n";
    continue;
  }
  $learner = $manager->create($jose, $name, NULL, $langcode);
  echo "alumno $langcode creado: $name, uid {$learner->id()}, uuid {$learner->uuid()}\n";
}
