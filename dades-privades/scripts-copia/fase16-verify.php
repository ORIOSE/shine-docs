<?php

/**
 * @file
 * FASE 16: sesión de prueba "FASE 16 de jose" y verificación JSON:API como
 * usuario 2 (gotcha 14). Las entidades de prueba que crea se borran al final.
 */

use Drupal\node\Entity\Node;
use Drupal\user\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

const UID = 2;

$etm = \Drupal::entityTypeManager();

// 1. Sesión de prueba (idempotente por título).
$sessions = $etm->getStorage('node')->loadByProperties(['type' => 'session', 'title' => 'FASE 16 de jose']);
$session = $sessions ? reset($sessions) : NULL;
if (!$session) {
  $blink = $etm->getStorage('node')->loadByProperties(['type' => 'activity_blink', 'field_activity_code' => 'BLK-L00-VEL-002']);
  $rep = $etm->getStorage('node')->loadByProperties(['type' => 'activity_rapid_repetition', 'field_activity_code' => 'REP-L00-VEL-001']);
  $session = Node::create([
    'type' => 'session',
    'title' => 'FASE 16 de jose',
    'uid' => UID,
    'status' => 1,
    'field_session_kind' => 'regular',
    'field_activities' => [reset($blink)->id(), reset($rep)->id()],
  ]);
  $session->save();
  print "Sesión creada: nid " . $session->id() . PHP_EOL;
}
else {
  print "Sesión ya existe: nid " . $session->id() . PHP_EOL;
}
foreach ($session->get('field_activities')->referencedEntities() as $a) {
  print "  " . $a->id() . " " . $a->bundle() . " " . $a->label() . PHP_EOL;
}

$rep = $etm->getStorage('node')->loadByProperties(['type' => 'activity_rapid_repetition', 'field_activity_code' => 'REP-L00-VEL-001']);
$rep = reset($rep);
$user = User::load(UID);

$switcher = \Drupal::service('account_switcher');
$kernel = \Drupal::service('http_kernel');

function call(string $method, string $uri, ?array $payload = NULL): array {
  $kernel = \Drupal::service('http_kernel');
  $request = Request::create($uri, $method, [], [], [], ['CONTENT_TYPE' => 'application/vnd.api+json'], $payload === NULL ? NULL : json_encode($payload));
  $request->headers->set('Accept', 'application/vnd.api+json');
  $response = $kernel->handle($request, HttpKernelInterface::SUB_REQUEST);
  $body = json_decode((string) $response->getContent(), TRUE);
  return [$response->getStatusCode(), $body];
}

$switcher->switchTo($user);
$created = [];
try {
  // 2. GET del nodo con sus campos.
  [$code, $body] = call('GET', '/jsonapi/node/activity_rapid_repetition/' . $rep->uuid());
  $attrs = $body['data']['attributes'] ?? [];
  printf("GET nodo: %d words=%s time_limit=%s count_errors=%s skip=%s\n", $code, json_encode($attrs['field_words'] ?? NULL, JSON_UNESCAPED_UNICODE), var_export($attrs['field_time_limit'] ?? NULL, TRUE), var_export($attrs['count_errors'] ?? NULL, TRUE), var_export($attrs['skip_on_error'] ?? NULL, TRUE));
  printf("  main_area=%s levels=%s\n", $body['data']['relationships']['field_main_area']['data']['id'] ?? '-', count($body['data']['relationships']['field_activity_level']['data'] ?? []));

  // 3. POST log.
  [$code, $body] = call('POST', '/jsonapi/activitylog/lograpidrepetition', ['data' => [
    'type' => 'activitylog--lograpidrepetition',
    'attributes' => [
      'label' => 'Repite rápido — mano',
      'field_item' => 'mano',
      'field_weight' => 0,
      'field_repetitions' => 12,
      'field_time' => 10040,
      'field_iteration' => 1,
      'field_activity_type' => 'rapid_repetition',
    ],
    'relationships' => [
      'field_sessionid' => ['data' => ['type' => 'node--session', 'id' => $session->uuid()]],
      'field_activityid' => ['data' => ['type' => 'node--activity_rapid_repetition', 'id' => $rep->uuid()]],
    ],
  ]]);
  printf("POST log: %d %s\n", $code, $code === 201 ? $body['data']['id'] : json_encode($body['errors'] ?? $body, JSON_UNESCAPED_UNICODE));
  if ($code === 201) {
    $created[] = ['activitylog', $body['data']['id']];
  }
  $logUuid = $body['data']['id'] ?? NULL;

  // 4. POST summary (sin field_correct_count ni field_items_count).
  $area = $rep->get('field_main_area')->entity;
  [$code, $body] = call('POST', '/jsonapi/activitysummary/summary_rapid_repetition', ['data' => [
    'type' => 'activitysummary--summary_rapid_repetition',
    'attributes' => [
      'label' => 'Repite rápido — intento 1',
      'field_time' => 10040,
      'field_iteration' => 1,
      'field_repetitions' => 12,
    ],
    'relationships' => [
      'field_activitylogs' => ['data' => $logUuid ? [['type' => 'activitylog--lograpidrepetition', 'id' => $logUuid]] : []],
      'field_activityid' => ['data' => ['type' => 'node--activity_rapid_repetition', 'id' => $rep->uuid()]],
      'field_main_area' => ['data' => ['type' => 'taxonomy_term--areas', 'id' => $area->uuid()]],
      'field_activity_level' => ['data' => array_map(fn($t) => ['type' => 'taxonomy_term--activity_level', 'id' => $t->uuid()], $rep->get('field_activity_level')->referencedEntities())],
      'field_sessionid' => ['data' => ['type' => 'node--session', 'id' => $session->uuid()]],
    ],
  ]]);
  printf("POST summary: %d %s\n", $code, $code === 201 ? $body['data']['id'] . ' repetitions=' . $body['data']['attributes']['field_repetitions'] . ' correct_count=' . var_export(array_key_exists('field_correct_count', $body['data']['attributes']), TRUE) : json_encode($body['errors'] ?? $body, JSON_UNESCAPED_UNICODE));
  if ($code === 201) {
    $created[] = ['activitysummary', $body['data']['id']];
  }

  // 5. Filtros por uid (gotcha 16).
  [$code, $body] = call('GET', '/jsonapi/activitysummary/summary_rapid_repetition?filter[uid.id]=' . $user->uuid() . '&include=field_activityid,field_sessionid');
  printf("GET summaries filter[uid.id]: %d data=%d included=%d\n", $code, count($body['data'] ?? []), count($body['included'] ?? []));
  [$code, $body] = call('GET', '/jsonapi/activitylog/lograpidrepetition?filter[uid.id]=' . $user->uuid());
  printf("GET logs filter[uid.id]: %d data=%d\n", $code, count($body['data'] ?? []));

  // 6. activityfeedback sobre una actividad del tipo nuevo.
  [$code, $body] = call('POST', '/jsonapi/activityfeedback/activityfeedback', ['data' => [
    'type' => 'activityfeedback--activityfeedback',
    'attributes' => ['rating' => 'easy'],
    'relationships' => [
      'session' => ['data' => ['type' => 'node--session', 'id' => $session->uuid()]],
      'activity' => ['data' => ['type' => 'node--activity_rapid_repetition', 'id' => $rep->uuid()]],
    ],
  ]]);
  printf("POST activityfeedback: %d %s\n", $code, $code === 201 ? $body['data']['id'] : json_encode($body['errors'] ?? $body, JSON_UNESCAPED_UNICODE));
  if ($code === 201) {
    $created[] = ['activityfeedback', $body['data']['id']];
  }

  // 7. sessionfeedback que señale la actividad nueva.
  [$code, $body] = call('POST', '/jsonapi/sessionfeedback/sessionfeedback', ['data' => [
    'type' => 'sessionfeedback--sessionfeedback',
    'relationships' => [
      'session' => ['data' => ['type' => 'node--session', 'id' => $session->uuid()]],
      'hardest_activity' => ['data' => ['type' => 'node--activity_rapid_repetition', 'id' => $rep->uuid()]],
    ],
  ]]);
  printf("POST sessionfeedback: %d %s\n", $code, $code === 201 ? $body['data']['id'] : json_encode($body['errors'] ?? $body, JSON_UNESCAPED_UNICODE));
  if ($code === 201) {
    $created[] = ['sessionfeedback', $body['data']['id']];
  }
}
finally {
  $switcher->switchBack();
}

// Limpieza: lo creado aquí no debe contar en "Mi progreso" de jose.
foreach ($created as [$type, $uuid]) {
  $entities = $etm->getStorage($type)->loadByProperties(['uuid' => $uuid]);
  foreach ($entities as $e) {
    $e->delete();
  }
  print "Borrado $type $uuid\n";
}
print "Hecho.\n";
