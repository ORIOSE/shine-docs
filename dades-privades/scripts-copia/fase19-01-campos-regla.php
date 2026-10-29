<?php

/**
 * @file
 * FASE 19, subplan 01: campos de la matriz con regla (de un solo uso; después, drush cex).
 *
 * ddev drush php:script private/scripts/fase19-01-campos-regla.php
 */

use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;

$fields = [
  ['node', 'activity_letter_matrix', 'field_rule', 'list_string', 1, 'Rule',
    'Familia de regla (FASE 19): vacía = matriz sin regla (Procesos Perceptivos).',
    // La API de campos de lista quiere clave => etiqueta (la convierte a la forma de config).
    ['allowed_values' => [
      'r1' => 'R1 Clave de fila',
      'r2' => 'R2 Después de',
      'r3' => 'R3 Menos después de',
      'r4' => 'R4 Alternancia',
    ]]],
  ['node', 'activity_letter_matrix', 'field_rule_params', 'string_long', 1, 'Rule parameters',
    'JSON con la regla tal como la declara el lote (contexto, objetivo por clase de fila, oculta). Lo escribe el importador.', []],
  ['node', 'activity_letter_matrix', 'field_target_cells', 'string_long', -1, 'Target cells',
    'Por ronda (mismo orden que las celdas), índices de las celdas objetivo separados por espacios. Lo calcula el importador a partir de la regla.', []],
  ['node', 'activity_letter_matrix', 'field_lure_cells', 'string_long', -1, 'Lure cells',
    'Por ronda, índices de las celdas cebo (se parecen al objetivo pero no cumplen la regla). Lo calcula el importador.', []],
  ['activitylog', 'loglettermatrix', 'field_lure_marks', 'integer', 1, 'Lure marks',
    'Cebos marcados al comprobar la ronda (comisión impulsiva, FASE 19).', ['min' => 0]],
  ['activitysummary', 'summary_letter_matrix', 'field_lure_marks', 'integer', 1, 'Lure marks',
    'Cebos marcados al comprobar (en total): restan del acierto efectivo (FASE 19).', ['min' => 0]],
];

$displays = \Drupal::service('entity_display.repository');
foreach ($fields as [$entityType, $bundle, $name, $type, $cardinality, $label, $description, $settings]) {
  if (!FieldStorageConfig::loadByName($entityType, $name)) {
    $storageSettings = $type === 'list_string' ? ['allowed_values' => $settings['allowed_values']] : [];
    FieldStorageConfig::create([
      'field_name' => $name,
      'entity_type' => $entityType,
      'type' => $type,
      'cardinality' => $cardinality,
      'settings' => $storageSettings,
    ])->save();
  }
  if (!FieldConfig::loadByName($entityType, $bundle, $name)) {
    FieldConfig::create([
      'field_name' => $name,
      'entity_type' => $entityType,
      'bundle' => $bundle,
      'label' => $label,
      'description' => $description,
      'required' => FALSE,
      'settings' => $type === 'integer' ? $settings : [],
    ])->save();
    $widget = match ($type) {
      'list_string' => 'options_select',
      'integer' => 'number',
      default => 'string_textarea',
    };
    $displays->getFormDisplay($entityType, $bundle)->setComponent($name, ['type' => $widget])->save();
    $displays->getViewDisplay($entityType, $bundle)->setComponent($name, ['label' => 'above'])->save();
    echo "creado $entityType.$bundle.$name\n";
  }
  else {
    echo "ya existe $entityType.$bundle.$name\n";
  }
}
