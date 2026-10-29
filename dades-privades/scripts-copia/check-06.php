<?php
$db = \Drupal::database();
$total = 0;
foreach ($db->schema()->findTables('%') as $t) {
  if (str_starts_with($t, 'search_') || !$db->schema()->fieldExists($t, 'langcode')) continue;
  $n = (int) $db->query("SELECT COUNT(*) FROM {" . $t . "} WHERE langcode = 'en'")->fetchField();
  if ($n) { echo "$t: $n\n"; $total += $n; }
}
echo "filas con langcode en: $total\n";
$ts = \Drupal::entityTypeManager()->getStorage('taxonomy_term');
foreach (['sonority', 'decoding_effort'] as $vid) {
  foreach (['es', 'ca'] as $lang) {
    $terms = $ts->loadByProperties(['vid' => $vid, 'langcode' => $lang]);
    $names = array_map(fn($t) => $t->label(), $terms);
    $leaf = array_filter($terms, fn($t) => !empty($t->get('parent')->target_id));
    printf("%s %s: %d términos (%d de segundo nivel), nombres únicos: %s\n", $vid, $lang, count($terms), count($leaf), count($names) === count(array_unique($names)) ? 'sí' : 'NO');
  }
}
$n = (int) $db->query("SELECT COUNT(*) FROM {watchdog} WHERE severity <= 3")->fetchField();
echo "watchdog errores (severity<=3): $n\n";
