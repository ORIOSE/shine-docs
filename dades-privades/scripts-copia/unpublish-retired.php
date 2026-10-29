<?php
$codes = ['MAT-CA-L02-PER-001', 'IMG-ES-L00-MEM-003', 'IMG-CA-L00-MEM-003'];
$storage = \Drupal::entityTypeManager()->getStorage('node');
foreach ($codes as $code) {
  $nodes = $storage->loadByProperties(['field_activity_code' => $code]);
  foreach ($nodes as $n) {
    $n->setUnpublished()->save();
    echo "$code: nodo {$n->id()} ({$n->language()->getId()}) despublicado\n";
  }
  if (!$nodes) echo "$code: no encontrado\n";
}
