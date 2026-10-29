<?php
$db = \Drupal::database();
$rows = $db->query("SELECT n.nid, n.type, n.langcode, c.field_activity_code_value AS code, n.status FROM {node_field_data} n JOIN {node__field_activity_code} c ON c.entity_id = n.nid WHERE c.field_activity_code_value LIKE 'BLK-CA-CIC%' OR c.field_activity_code_value IN ('MAT-CA-L02-PER-001','IMG-L00-MEM-004') OR c.field_activity_code_value LIKE 'REP-CA-L00%' OR c.field_activity_code_value LIKE 'SEG-CA%' OR c.field_activity_code_value LIKE 'IMG-L00%'")->fetchAll();
$summary = \Drupal::entityTypeManager()->getStorage('activitysummary');
$played = 0;
foreach ($rows as $r) {
  $n = $summary->getQuery()->accessCheck(FALSE)->condition('field_activityid', $r->nid)->count()->execute();
  if ($n) { $played++; echo "$r->code ($r->langcode, nid $r->nid): $n summaries\n"; }
}
echo count($rows) . " nodos revisados, $played con summaries\n";
$sessions = \Drupal::entityQuery('node')->accessCheck(FALSE)->condition('type','session')->condition('uid',[42,43],'IN')->count()->execute();
echo "sesiones de Marta y Pau: $sessions\n";
