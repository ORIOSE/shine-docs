<?php
/**
 * Crea field_content_hash (string 64) en todos los bundles de actividad.
 * Un solo uso: después, drush cex exporta la config a config/sync.
 */
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;

$name = 'field_content_hash';
if (!FieldStorageConfig::loadByName('node', $name)) {
  FieldStorageConfig::create([
    'field_name' => $name,
    'entity_type' => 'node',
    'type' => 'string',
    'settings' => ['max_length' => 64, 'is_ascii' => TRUE, 'case_sensitive' => FALSE],
    'cardinality' => 1,
    'translatable' => FALSE,
  ])->save();
  echo "storage creado\n";
}
foreach (\Drupal::service('shine_level.level_ladder')->activityBundles() as $bundle) {
  if (!FieldConfig::loadByName('node', $bundle, $name)) {
    FieldConfig::create([
      'field_name' => $name,
      'entity_type' => 'node',
      'bundle' => $bundle,
      'label' => 'Content hash',
      'description' => 'Huella sha256 del material de la actividad (docs/exercise-catalog.md §3.4). La escribe shine_content al guardar; no editar.',
      'translatable' => FALSE,
    ])->save();
    echo "campo en $bundle\n";
  }
}
