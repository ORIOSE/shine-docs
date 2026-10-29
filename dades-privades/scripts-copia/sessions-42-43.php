<?php
$st = \Drupal::entityTypeManager()->getStorage('node');
$ids = \Drupal::entityQuery('node')->accessCheck(FALSE)->condition('type','session')->condition('uid',[42,43],'IN')->sort('nid')->execute();
foreach ($st->loadMultiple($ids) as $s) {
  printf("nid %d uid %d %s status %d kind %s reason %s seq %s completed %s lang %s title '%s'\n", $s->id(), $s->getOwnerId(), $s->uuid(), $s->isPublished(), $s->get('field_session_kind')->value, $s->get('field_evaluation_reason')->value, $s->get('field_evaluation_seq')->value, $s->get('field_completed_at')->value ? 'yes' : 'no', $s->language()->getId(), $s->label());
}
foreach ([42,43] as $uid) {
  $u = \Drupal\user\Entity\User::load($uid);
  echo "uid $uid onboarding=" . $u->get('field_onboarding_state')->value . " lang=" . $u->getPreferredLangcode() . "\n";
  foreach (\Drupal::service('shine_level.level_repository')->getForUser($u) as $row) {
    printf("  %s level=%s probe=%s closed=%d evidence=%d\n", $row->get('area')->entity->label(), $row->get('level')->entity?->label(), $row->get('probe_level')->entity?->label(), $row->get('closed')->value, $row->get('evidence')->value);
  }
}
