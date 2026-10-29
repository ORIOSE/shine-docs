<?php

/**
 * @file
 * FASE 16: un "Demasiado fácil" sobre una repetición rápida en una sesión de
 * ajuste se conserva como easy (sin freno por aciertos). Usuario desechable.
 */

use Drupal\activityfeedback\Entity\Activityfeedback;
use Drupal\activitysummary\Entity\Activitysummary;
use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;

$etm = \Drupal::entityTypeManager();
$name = 'fase16-eval@shine.test';
$users = $etm->getStorage('user')->loadByProperties(['name' => $name]);
$user = $users ? reset($users) : NULL;
if (!$user) {
  $user = User::create(['name' => $name, 'mail' => $name, 'status' => 1, 'field_display_name' => 'Eval 16']);
  $user->save();
}
$uid = (int) $user->id();
print "uid=$uid\n";

// Sesión inicial real, generada por el servidor.
$generator = \Drupal::service('shine_level.session_generator');
$result = $generator->generate($user);
$session = $result->session ?? NULL;
if (!$session) {
  print "No se ha generado sesión: " . json_encode($result) . "\n";
  return;
}
printf("Sesión %d kind=%s reason=%s\n", $session->id(), $session->get('field_session_kind')->value, $session->get('field_evaluation_reason')->value);

// Sustituir la actividad de Velocidad por la repetición rápida REP-L00-VEL-001.
$rep = $etm->getStorage('node')->loadByProperties(['type' => 'activity_rapid_repetition', 'field_activity_code' => 'REP-L00-VEL-001']);
$rep = reset($rep);
$ids = [];
$replaced = FALSE;
foreach ($session->get('field_activities')->referencedEntities() as $a) {
  if (!$replaced && $a->get('field_main_area')->entity?->label() === 'Rendimiento y Velocidad de Procesamiento') {
    $ids[] = $rep->id();
    $replaced = TRUE;
  }
  else {
    $ids[] = $a->id();
  }
}
if (!$replaced) {
  $ids[] = $rep->id();
}
$session->set('field_activities', $ids)->save();
foreach ($session->get('field_activities')->referencedEntities() as $a) {
  printf("  %d %s %s [%s]\n", $a->id(), $a->bundle(), $a->label(), $a->get('field_main_area')->entity?->label());
}

// Un summary por actividad (como haría la app) y "Demasiado fácil" en la repetición rápida.
foreach ($session->get('field_activities')->referencedEntities() as $a) {
  $isRep = $a->bundle() === 'activity_rapid_repetition';
  Activitysummary::create([
    'bundle' => $isRep ? 'summary_rapid_repetition' : 'summary3_vertical_text_blink',
    'label' => 'e2e ' . $a->label(),
    'uid' => $uid,
    'field_sessionid' => $session->id(),
    'field_activityid' => $a->id(),
    'field_time' => 40000,
    'field_iteration' => 1,
    'field_main_area' => $a->get('field_main_area')->target_id,
    'field_activity_level' => array_column($a->get('field_activity_level')->getValue(), 'target_id'),
  ] + ($isRep ? ['field_repetitions' => 17] : []))->save();
  Activityfeedback::create([
    'uid' => $uid,
    'session' => $session->id(),
    'activity' => $a->id(),
    'rating' => $isRep ? 'easy' : 'ok',
  ])->save();
}

$evaluator = \Drupal::service('shine_level.evaluator');
$completion = $evaluator->complete(Node::load($session->id()));
print "complete(): " . json_encode($completion->toArray(), JSON_UNESCAPED_UNICODE) . "\n";

foreach ($etm->getStorage('userarealevel')->loadByProperties(['uid' => $uid]) as $row) {
  printf("ROW %s level=%s probe=%s closed=%s\n", $row->getArea()->label(), $row->getLevel()?->label(), $row->getProbeLevel()?->label(), var_export($row->isClosed(), TRUE));
}
foreach ($etm->getStorage('userarealevel_log')->loadByProperties(['uid' => $uid]) as $log) {
  printf("LOG %s reason=%s level=%s\n", $log->get('area')->entity?->label(), $log->get('reason')->value, $log->get('level')->entity?->label());
}
