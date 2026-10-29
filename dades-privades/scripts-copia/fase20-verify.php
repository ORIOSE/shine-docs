<?php
/**
 * FASE 20: verificación como usuario normal (gotcha 14). Publica un momento
 * SEQ-ES-L05-ATE-001, hace GET del nodo y POST de log y summary como el alumno
 * 42, filtra por uid y lo deja todo como estaba.
 *
 * ddev drush php:script private/scripts/fase20-verify.php
 */
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\HttpKernelInterface;

$etm = \Drupal::entityTypeManager();
$nodes = $etm->getStorage('node')->loadByProperties(['field_activity_code' => 'SEQ-ES-L05-ATE-001']);
$node = reset($nodes);
$node->setPublished()->save();
$user = \Drupal\user\Entity\User::load(42);
$switcher = \Drupal::service('account_switcher');
$switcher->switchTo($user);

function call(string $method, string $path, ?array $body = NULL): array {
  $r = Request::create('/jsonapi' . $path, $method, [], [], [], [], $body ? json_encode($body) : NULL);
  $r->headers->set('Accept', 'application/vnd.api+json');
  $r->headers->set('Content-Type', 'application/vnd.api+json');
  $res = \Drupal::service('http_kernel')->handle($r, HttpKernelInterface::SUB_REQUEST);
  return [$res->getStatusCode(), json_decode($res->getContent(), TRUE)];
}

$created = [];
try {
  [$code, $json] = call('GET', '/node/activity_rule_sequence/' . $node->uuid());
  $a = $json['data']['attributes'] ?? [];
  echo "GET nodo: $code; regla {$a['field_rule_params']}; elementos " . count($a['field_elements'] ?? []) . "; objetivos {$a['field_target_cells'][0]}; ms {$a['field_stimulus_ms']}+{$a['field_gap_ms']}\n";

  $rel = ['field_activityid' => ['data' => ['type' => 'node--activity_rule_sequence', 'id' => $node->uuid()]]];
  [$code, $json] = call('POST', '/activitylog/logrulesequence', ['data' => ['type' => 'activitylog--logrulesequence', 'attributes' => [
    'label' => 'verify', 'field_item' => 's', 'field_weight' => 2, 'field_correct' => TRUE, 'field_response' => 'hit',
    'field_time' => 540, 'field_iteration' => 1, 'field_activity_type' => 'rule_sequence',
  ], 'relationships' => $rel]]);
  echo "POST log: $code" . ($code === 201 ? '' : ' ' . json_encode($json['errors'] ?? $json)) . "\n";
  $logId = $json['data']['id'] ?? NULL;
  if ($logId) {
    $created[] = ['activitylog', $json['data']['attributes']['drupal_internal__id']];
  }

  [$code, $json] = call('POST', '/activitysummary/summary_rule_sequence', ['data' => ['type' => 'activitysummary--summary_rule_sequence', 'attributes' => [
    'label' => 'verify', 'field_time' => 72000, 'field_iteration' => 1, 'field_correct_count' => 9, 'field_items_count' => 10,
    'field_lure_marks' => 2, 'field_lures_count' => 8, 'field_false_marks' => 1, 'field_reaction_ms' => 610, 'field_reaction_sd_ms' => 120,
  ], 'relationships' => $rel + ['field_activitylogs' => ['data' => $logId ? [['type' => 'activitylog--logrulesequence', 'id' => $logId]] : []]]]]);
  echo "POST summary: $code" . ($code === 201 ? '' : ' ' . json_encode($json['errors'] ?? $json)) . "\n";
  if (isset($json['data']['attributes']['drupal_internal__id'])) {
    $created[] = ['activitysummary', $json['data']['attributes']['drupal_internal__id']];
  }

  [$code, $json] = call('GET', '/activitysummary/summary_rule_sequence?filter[uid.id]=' . $user->uuid());
  echo "GET summaries filtrados: $code; " . count($json['data'] ?? []) . " resultado(s)\n";
  [$code, $json] = call('GET', '/activitylog/logrulesequence?filter[uid.id]=' . $user->uuid());
  echo "GET logs filtrados: $code; " . count($json['data'] ?? []) . " resultado(s)\n";
}
finally {
  $switcher->switchBack();
  foreach ($created as [$type, $id]) {
    $etm->getStorage($type)->load($id)?->delete();
  }
  $node->setUnpublished()->save();
  echo 'Limpieza: ' . count($created) . " entidades borradas; nodo despublicado\n";
}
