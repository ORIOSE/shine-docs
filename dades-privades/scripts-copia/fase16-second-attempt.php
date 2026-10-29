<?php

/**
 * @file
 * FASE 16: muestra lo guardado por la app y crea un segundo intento (como
 * usuario 2, por JSON:API) para ver dos barras en "Detalle de estadísticas".
 */

use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

$etm = \Drupal::entityTypeManager();
$user = User::load(2);
$rep = $etm->getStorage('node')->loadByProperties(['type' => 'activity_rapid_repetition', 'field_activity_code' => 'REP-L00-VEL-001']);
$rep = reset($rep);

print "=== Summaries de jose en summary_rapid_repetition ===\n";
$summaries = $etm->getStorage('activitysummary')->loadByProperties(['bundle' => 'summary_rapid_repetition', 'uid' => 2]);
foreach ($summaries as $s) {
  printf("summary %d iter=%s time=%s repetitions=%s area=%s level=%s session=%s errors=%s hasCorrect=%s logs=%d\n",
    $s->id(), $s->get('field_iteration')->value, $s->get('field_time')->value, $s->get('field_repetitions')->value,
    $s->get('field_main_area')->entity?->label(), implode(',', array_map(fn($t) => $t->label(), $s->get('field_activity_level')->referencedEntities())),
    $s->get('field_sessionid')->target_id, var_export($s->get('field_errors')->value, TRUE), var_export($s->hasField('field_correct_count'), TRUE),
    count($s->get('field_activitylogs')->getValue()));
  foreach ($s->get('field_activitylogs')->referencedEntities() as $log) {
    printf("   log %d item=%s weight=%s repetitions=%s time=%s type=%s\n", $log->id(), $log->get('field_item')->value, $log->get('field_weight')->value, $log->get('field_repetitions')->value, $log->get('field_time')->value, $log->get('field_activity_type')->value);
  }
}

if (count($summaries) >= 2) {
  print "Ya hay dos intentos; no se crea otro.\n";
  return;
}

function call(string $method, string $uri, ?array $payload = NULL): array {
  $kernel = \Drupal::service('http_kernel');
  $request = Request::create($uri, $method, [], [], [], ['CONTENT_TYPE' => 'application/vnd.api+json'], $payload === NULL ? NULL : json_encode($payload));
  $request->headers->set('Accept', 'application/vnd.api+json');
  $response = $kernel->handle($request, HttpKernelInterface::SUB_REQUEST);
  return [$response->getStatusCode(), json_decode((string) $response->getContent(), TRUE)];
}

$switcher = \Drupal::service('account_switcher');
$switcher->switchTo($user);
try {
  $words = ['mano' => 7, 'mapa' => 5, 'pato' => 6, 'pipa' => 5];
  $logIds = [];
  $i = 0;
  foreach ($words as $word => $reps) {
    [$code, $body] = call('POST', '/jsonapi/activitylog/lograpidrepetition', ['data' => [
      'type' => 'activitylog--lograpidrepetition',
      'attributes' => [
        'label' => "Repite rápido: palabras con m y p — $word",
        'field_item' => $word,
        'field_weight' => $i++,
        'field_repetitions' => $reps,
        'field_time' => 10000 + $i * 7,
        'field_iteration' => 2,
        'field_activity_type' => 'rapid_repetition',
      ],
      'relationships' => [
        'field_activityid' => ['data' => ['type' => 'node--activity_rapid_repetition', 'id' => $rep->uuid()]],
      ],
    ]]);
    print "POST log $word: $code\n";
    $logIds[] = $body['data']['id'];
  }
  $area = $rep->get('field_main_area')->entity;
  [$code, $body] = call('POST', '/jsonapi/activitysummary/summary_rapid_repetition', ['data' => [
    'type' => 'activitysummary--summary_rapid_repetition',
    'attributes' => [
      'label' => 'Repite rápido: palabras con m y p — intento 2',
      'field_time' => 40070,
      'field_iteration' => 2,
      'field_repetitions' => array_sum($words),
    ],
    'relationships' => [
      'field_activitylogs' => ['data' => array_map(fn($id) => ['type' => 'activitylog--lograpidrepetition', 'id' => $id], $logIds)],
      'field_activityid' => ['data' => ['type' => 'node--activity_rapid_repetition', 'id' => $rep->uuid()]],
      'field_main_area' => ['data' => ['type' => 'taxonomy_term--areas', 'id' => $area->uuid()]],
      'field_activity_level' => ['data' => array_map(fn($t) => ['type' => 'taxonomy_term--activity_level', 'id' => $t->uuid()], $rep->get('field_activity_level')->referencedEntities())],
    ],
  ]]);
  printf("POST summary intento 2: %d %s\n", $code, $code === 201 ? 'repetitions=' . $body['data']['attributes']['field_repetitions'] : json_encode($body['errors'] ?? $body, JSON_UNESCAPED_UNICODE));
}
finally {
  $switcher->switchBack();
}
