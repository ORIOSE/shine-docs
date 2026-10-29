<?php

/**
 * @file
 * FASE 20, subplan 01: tipo activity_rule_sequence y bundles de tracking.
 *
 * Idempotente. No se versiona (private/ está en .gitignore; copia en
 * dades-privades/scripts-copia): la config exportada con `drush cex` es la
 * verdad. Clona los campos comunes de activity_letter_matrix y los bundles de
 * loglettermatrix / summary_letter_matrix (plans/funcions-executives/sequencia/README.md).
 *
 * ddev drush php:script private/scripts/fase20-01-backend.php
 */

use Drupal\activitylog\Entity\ActivitylogType;
use Drupal\activitysummary\Entity\ActivitysummaryType;
use Drupal\Core\Field\Entity\BaseFieldOverride;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\node\Entity\NodeType;

const TYPE = 'activity_rule_sequence';
const LOG_BUNDLE = 'logrulesequence';
const SUMMARY_BUNDLE = 'summary_rule_sequence';
const FROM_TYPE = 'activity_letter_matrix';
const FROM_LOG = 'loglettermatrix';
const FROM_SUMMARY = 'summary_letter_matrix';
// Funciones Ejecutivas y Atención.
const AREA_FUNCIONES_UUID = '24c342e1-3b9a-4a52-837c-e82108688660';

function out(string $message): void {
  print $message . PHP_EOL;
}

/**
 * Clona una instancia de campo a otro bundle del mismo tipo de entidad.
 */
function clone_field(string $entity_type, string $from_bundle, string $to_bundle, string $name, array $overrides = []): void {
  if (FieldConfig::loadByName($entity_type, $to_bundle, $name)) {
    out("Campo ya existe: $entity_type.$to_bundle.$name");
    return;
  }
  $source = FieldConfig::loadByName($entity_type, $from_bundle, $name);
  if (!$source) {
    throw new \RuntimeException("No existe el campo origen $entity_type.$from_bundle.$name");
  }
  $values = $source->toArray();
  unset($values['uuid'], $values['id'], $values['dependencies'], $values['_core']);
  $values['bundle'] = $to_bundle;
  FieldConfig::create(array_merge($values, $overrides))->save();
  out("Campo clonado: $entity_type.$to_bundle.$name");
}

/**
 * Crea un storage si no existe.
 */
function ensure_storage(string $entity_type, string $name, string $type, array $settings, int $cardinality): void {
  if (FieldStorageConfig::loadByName($entity_type, $name)) {
    out("Storage ya existe: $entity_type.$name");
    return;
  }
  FieldStorageConfig::create([
    'field_name' => $name,
    'entity_type' => $entity_type,
    'type' => $type,
    'settings' => $settings,
    'cardinality' => $cardinality,
    'translatable' => TRUE,
  ])->save();
  out("Storage creado: $entity_type.$name");
}

/**
 * Crea una instancia de campo nueva si no existe.
 */
function ensure_field(string $entity_type, string $bundle, string $name, array $values): void {
  if (FieldConfig::loadByName($entity_type, $bundle, $name)) {
    out("Campo ya existe: $entity_type.$bundle.$name");
    return;
  }
  FieldConfig::create(['field_name' => $name, 'entity_type' => $entity_type, 'bundle' => $bundle, 'translatable' => TRUE] + $values)->save();
  out("Campo creado: $entity_type.$bundle.$name");
}

/**
 * Copia los componentes de un display a otro bundle, quitando y añadiendo.
 *
 * @param array<string, array> $extra
 *   Componentes propios del destino (nombre => opciones).
 * @param string[] $skip
 *   Componentes del origen que no se copian.
 */
function clone_display(string $kind, string $entity_type, string $from_bundle, string $to_bundle, array $extra, array $skip): void {
  $repository = \Drupal::service('entity_display.repository');
  $source = $kind === 'form'
    ? $repository->getFormDisplay($entity_type, $from_bundle)
    : $repository->getViewDisplay($entity_type, $from_bundle);
  $target = $kind === 'form'
    ? $repository->getFormDisplay($entity_type, $to_bundle)
    : $repository->getViewDisplay($entity_type, $to_bundle);
  $wanted = [];
  foreach ($source->getComponents() as $name => $options) {
    if (in_array($name, $skip, TRUE)) {
      continue;
    }
    $wanted[$name] = $options;
  }
  foreach ($extra as $name => $options) {
    $wanted[$name] = $options;
  }
  foreach (array_keys($target->getComponents()) as $name) {
    if (!isset($wanted[$name])) {
      $target->removeComponent($name);
    }
  }
  foreach ($wanted as $name => $options) {
    $target->setComponent($name, $options);
  }
  $target->save();
  out("Display $kind actualizado: $entity_type.$to_bundle");
}

$integer = ['unsigned' => FALSE, 'size' => 'normal'];
$number_form = ['type' => 'number', 'region' => 'content', 'settings' => ['placeholder' => ''], 'third_party_settings' => []];
$number_view = ['type' => 'number_integer', 'label' => 'inline', 'region' => 'content', 'settings' => ['thousand_separator' => '', 'prefix_suffix' => TRUE], 'third_party_settings' => []];
$text_form = ['type' => 'string_textarea', 'region' => 'content', 'settings' => ['rows' => 3, 'placeholder' => ''], 'third_party_settings' => []];
$text_view = ['type' => 'basic_string', 'label' => 'above', 'region' => 'content', 'settings' => [], 'third_party_settings' => []];

// ---------------------------------------------------------------------------
// 1. Node type.
// ---------------------------------------------------------------------------
if (!NodeType::load(TYPE)) {
  $node_type = NodeType::create([
    'type' => TYPE,
    'name' => 'Activity rule sequence',
    'description' => 'Secuencia con regla (FASE 20): los elementos aparecen de uno en uno a ritmo fijo y el alumno toca solo los que cumplen la regla (tipo CPT).',
    'new_revision' => FALSE,
    'preview_mode' => 0,
    'display_submitted' => FALSE,
  ]);
  // Los aciertos los mide el player: el tutor no cuenta errores.
  $node_type->setThirdPartySetting('activity_options', 'count_errors', FALSE);
  $node_type->setThirdPartySetting('activity_options', 'skip_on_error', FALSE);
  $node_type->save();
  out('Node type creado: ' . TYPE);
}
else {
  out('Node type ya existe: ' . TYPE);
}
if (!BaseFieldOverride::loadByName('node', TYPE, 'promote')) {
  $promote = \Drupal::service('entity_field.manager')->getBaseFieldDefinitions('node')['promote'];
  BaseFieldOverride::createFromBaseFieldDefinition($promote, TYPE)->setDefaultValue([['value' => 0]])->save();
  out('Override de promote creado (no promocionar a portada)');
}

// ---------------------------------------------------------------------------
// 2. Storages nuevos.
// ---------------------------------------------------------------------------
ensure_storage('node', 'field_elements', 'string', ['max_length' => 255, 'case_sensitive' => FALSE, 'is_ascii' => FALSE], -1);
ensure_storage('node', 'field_dark_items', 'string_long', ['case_sensitive' => FALSE], 1);
ensure_storage('node', 'field_sequence_rule', 'list_string', ['allowed_values' => [
  's1' => 'S1 Detección',
  's2' => 'S2 Todos menos',
  's3' => 'S3 Después de',
  's4' => 'S4 Alternancia',
]], 1);
ensure_storage('node', 'field_stimulus_ms', 'integer', $integer, 1);
ensure_storage('node', 'field_gap_ms', 'integer', $integer, 1);
ensure_storage('node', 'field_practice', 'string_long', ['case_sensitive' => FALSE], 1);
ensure_storage('activitylog', 'field_response', 'list_string', ['allowed_values' => [
  'hit' => 'Objetivo tocado',
  'miss' => 'Objetivo sin tocar',
  'lure_tap' => 'Cebo tocado',
  'lure_ok' => 'Cebo sin tocar',
  'false_tap' => 'Neutro tocado',
]], 1);
ensure_storage('activitysummary', 'field_lures_count', 'integer', $integer, 1);
ensure_storage('activitysummary', 'field_reaction_ms', 'integer', $integer, 1);
ensure_storage('activitysummary', 'field_reaction_sd_ms', 'integer', $integer, 1);

// ---------------------------------------------------------------------------
// 3. Campos del nodo: comunes de la matriz y propios.
// ---------------------------------------------------------------------------
foreach (['field_activity_code', 'field_activity_level', 'field_custom_explanation', 'field_cycle', 'field_cycle_weight', 'field_decoding_effort', 'field_explanation', 'field_sonority', 'field_rule_params', 'field_target_cells', 'field_lure_cells', 'field_content_hash'] as $name) {
  clone_field('node', FROM_TYPE, TYPE, $name);
}
clone_field('node', FROM_TYPE, TYPE, 'field_main_area', [
  'default_value' => [['target_uuid' => AREA_FUNCIONES_UUID]],
]);
// Sin secundaria por defecto: la decide el grupo (E13, pregunta 10) y la pone el lote.
clone_field('node', FROM_TYPE, TYPE, 'field_secondary_area', ['default_value' => []]);
ensure_field('node', TYPE, 'field_elements', [
  'label' => 'Elements',
  'description' => 'Los elementos de la secuencia en el orden en que aparecen (símbolo, letra o sílaba).',
  'required' => TRUE,
  'settings' => [],
]);
ensure_field('node', TYPE, 'field_dark_items', [
  'label' => 'Dark items',
  'description' => 'Solo con la regla s4: índices (0 = primero) de los elementos con fondo oscuro, separados por espacios.',
  'required' => FALSE,
  'settings' => [],
]);
ensure_field('node', TYPE, 'field_sequence_rule', [
  'label' => 'Sequence rule',
  'description' => 'Familia de la regla (FASE 20). Los parámetros van en field_rule_params.',
  'required' => TRUE,
  'settings' => [],
]);
ensure_field('node', TYPE, 'field_stimulus_ms', [
  'label' => 'Stimulus ms',
  'description' => 'Milisegundos que cada elemento está visible.',
  'required' => TRUE,
  'settings' => ['min' => 200, 'max' => 10000, 'prefix' => '', 'suffix' => ' ms'],
]);
ensure_field('node', TYPE, 'field_gap_ms', [
  'label' => 'Gap ms',
  'description' => 'Milisegundos de pausa entre un elemento y el siguiente. La ventana de respuesta es el tiempo visible más la pausa.',
  'required' => TRUE,
  'settings' => ['min' => 0, 'max' => 10000, 'prefix' => '', 'suffix' => ' ms'],
]);
ensure_field('node', TYPE, 'field_practice', [
  'label' => 'Practice',
  'description' => 'JSON {"elementos": [...], "oscuros": [...]} de la práctica previa (no puntúa), o vacío si no hay práctica.',
  'required' => FALSE,
  'settings' => [],
]);

$skip_node = ['field_cells', 'field_columns', 'field_rows', 'field_target', 'field_time_limit', 'field_rule'];
clone_display('form', 'node', FROM_TYPE, TYPE, [
  'field_sequence_rule' => ['type' => 'options_select', 'weight' => 3, 'region' => 'content', 'settings' => [], 'third_party_settings' => []],
  'field_elements' => ['type' => 'string_textfield', 'weight' => 4, 'region' => 'content', 'settings' => ['size' => 20, 'placeholder' => ''], 'third_party_settings' => []],
  'field_dark_items' => ['weight' => 5] + $text_form,
  'field_stimulus_ms' => ['weight' => 6] + $number_form,
  'field_gap_ms' => ['weight' => 7] + $number_form,
  'field_practice' => ['weight' => 8] + $text_form,
], $skip_node);
clone_display('view', 'node', FROM_TYPE, TYPE, [
  'field_sequence_rule' => ['type' => 'list_default', 'label' => 'inline', 'weight' => 3, 'region' => 'content', 'settings' => [], 'third_party_settings' => []],
  'field_elements' => ['type' => 'string', 'label' => 'above', 'weight' => 4, 'region' => 'content', 'settings' => ['link_to_entity' => FALSE], 'third_party_settings' => []],
  'field_dark_items' => ['weight' => 5] + $text_view,
  'field_stimulus_ms' => ['weight' => 6] + $number_view,
  'field_gap_ms' => ['weight' => 7] + $number_view,
  'field_practice' => ['weight' => 8] + $text_view,
], $skip_node);

// ---------------------------------------------------------------------------
// 4. Bundle de activitylog: un log por objetivo, cebo y toque sobre un neutro.
// ---------------------------------------------------------------------------
if (!ActivitylogType::load(LOG_BUNDLE)) {
  ActivitylogType::create(['id' => LOG_BUNDLE, 'label' => 'Log Rule sequence'])->save();
  out('Bundle activitylog creado: ' . LOG_BUNDLE);
}
else {
  out('Bundle activitylog ya existe: ' . LOG_BUNDLE);
}
foreach (['field_activity_type', 'field_correct', 'field_errors', 'field_item', 'field_iteration', 'field_sessionid', 'field_time', 'field_weight'] as $name) {
  clone_field('activitylog', FROM_LOG, LOG_BUNDLE, $name);
}
$activityid = FieldConfig::loadByName('activitylog', FROM_LOG, 'field_activityid');
clone_field('activitylog', FROM_LOG, LOG_BUNDLE, 'field_activityid', [
  'settings' => ['handler_settings' => ['target_bundles' => [TYPE => TYPE]] + $activityid->getSetting('handler_settings')] + $activityid->getSettings(),
]);
ensure_field('activitylog', LOG_BUNDLE, 'field_response', [
  'label' => 'Response',
  'description' => 'Qué pasó con este elemento: objetivo tocado o sin tocar, cebo tocado o sin tocar, neutro tocado. field_time es el tiempo de reacción en ms (0 sin toque).',
  'required' => FALSE,
  'settings' => [],
]);
$log_skip = ['field_correct_count', 'field_items_count', 'field_lure_marks'];
clone_display('form', 'activitylog', FROM_LOG, LOG_BUNDLE, [
  'field_response' => ['type' => 'options_select', 'weight' => 3, 'region' => 'content', 'settings' => [], 'third_party_settings' => []],
], $log_skip);
clone_display('view', 'activitylog', FROM_LOG, LOG_BUNDLE, [
  'field_response' => ['type' => 'list_default', 'label' => 'inline', 'weight' => 3, 'region' => 'content', 'settings' => [], 'third_party_settings' => []],
], $log_skip);

// ---------------------------------------------------------------------------
// 5. Bundle de activitysummary: contadores de la matriz más cebos presentados
//    y tiempo de reacción.
// ---------------------------------------------------------------------------
if (!ActivitysummaryType::load(SUMMARY_BUNDLE)) {
  ActivitysummaryType::create(['id' => SUMMARY_BUNDLE, 'label' => 'Summary Rule sequence'])->save();
  out('Bundle activitysummary creado: ' . SUMMARY_BUNDLE);
}
else {
  out('Bundle activitysummary ya existe: ' . SUMMARY_BUNDLE);
}
foreach (['field_activity_level', 'field_activity_type', 'field_correct_count', 'field_errors', 'field_false_marks', 'field_items_count', 'field_iteration', 'field_lure_marks', 'field_main_area', 'field_sessionid', 'field_time'] as $name) {
  clone_field('activitysummary', FROM_SUMMARY, SUMMARY_BUNDLE, $name);
}
$summary_activityid = FieldConfig::loadByName('activitysummary', FROM_SUMMARY, 'field_activityid');
clone_field('activitysummary', FROM_SUMMARY, SUMMARY_BUNDLE, 'field_activityid', [
  'settings' => ['handler_settings' => ['target_bundles' => [TYPE => TYPE]] + $summary_activityid->getSetting('handler_settings')] + $summary_activityid->getSettings(),
]);
$activitylogs = FieldConfig::loadByName('activitysummary', FROM_SUMMARY, 'field_activitylogs');
clone_field('activitysummary', FROM_SUMMARY, SUMMARY_BUNDLE, 'field_activitylogs', [
  'settings' => ['handler_settings' => ['target_bundles' => [LOG_BUNDLE => LOG_BUNDLE]] + $activitylogs->getSetting('handler_settings')] + $activitylogs->getSettings(),
]);
$min0 = ['min' => 0, 'max' => NULL, 'prefix' => '', 'suffix' => ''];
ensure_field('activitysummary', SUMMARY_BUNDLE, 'field_lures_count', [
  'label' => 'Lures count',
  'description' => 'Cebos presentados (con s1, todos los elementos que no son objetivo). Con él, el evaluador usa el acierto efectivo objetivos tocados / objetivos − cebos tocados / cebos (FASE 20).',
  'required' => FALSE,
  'settings' => $min0,
]);
ensure_field('activitysummary', SUMMARY_BUNDLE, 'field_reaction_ms', [
  'label' => 'Reaction ms',
  'description' => 'Media del tiempo de reacción de los objetivos tocados, en ms.',
  'required' => FALSE,
  'settings' => $min0,
]);
ensure_field('activitysummary', SUMMARY_BUNDLE, 'field_reaction_sd_ms', [
  'label' => 'Reaction SD ms',
  'description' => 'Desviación típica del tiempo de reacción de los objetivos tocados, en ms (variabilidad).',
  'required' => FALSE,
  'settings' => $min0,
]);
clone_display('form', 'activitysummary', FROM_SUMMARY, SUMMARY_BUNDLE, [
  'field_lures_count' => ['weight' => 31] + $number_form,
  'field_reaction_ms' => ['weight' => 32] + $number_form,
  'field_reaction_sd_ms' => ['weight' => 33] + $number_form,
], []);
clone_display('view', 'activitysummary', FROM_SUMMARY, SUMMARY_BUNDLE, [
  'field_lures_count' => ['weight' => 31] + $number_view,
  'field_reaction_ms' => ['weight' => 32] + $number_view,
  'field_reaction_sd_ms' => ['weight' => 33] + $number_view,
], []);

// ---------------------------------------------------------------------------
// 6. La sesión admite el tipo nuevo.
// ---------------------------------------------------------------------------
$activities = FieldConfig::loadByName('node', 'session', 'field_activities');
$handler_settings = $activities->getSetting('handler_settings');
if (!isset($handler_settings['target_bundles'][TYPE])) {
  $handler_settings['target_bundles'][TYPE] = TYPE;
  $activities->setSetting('handler_settings', $handler_settings)->save();
  out('node.session.field_activities admite ' . TYPE);
}
else {
  out('node.session.field_activities ya admite ' . TYPE);
}

// ---------------------------------------------------------------------------
// 7. Idioma del nodo (FASE 18): como el resto de actividades.
// ---------------------------------------------------------------------------
$settings = \Drupal\language\Entity\ContentLanguageSettings::loadByEntityTypeBundle('node', TYPE);
$from = \Drupal\language\Entity\ContentLanguageSettings::loadByEntityTypeBundle('node', FROM_TYPE);
if ($settings->isNew() || $settings->getDefaultLangcode() !== $from->getDefaultLangcode() || $settings->isLanguageAlterable() !== $from->isLanguageAlterable()) {
  $settings->setDefaultLangcode($from->getDefaultLangcode())->setLanguageAlterable($from->isLanguageAlterable())->save();
  out('Ajustes de idioma del node type como la matriz');
}

// ---------------------------------------------------------------------------
// 8. Contenido por entorno: mensaje de motivación y explicación genérica.
// ---------------------------------------------------------------------------
$messages = \Drupal::entityTypeManager()->getStorage('activity_message');
$tagged = 0;
foreach ($messages->loadByProperties(['bundle' => 'motivation_message']) as $message) {
  $types = array_column($message->get('field_activity_types')->getValue(), 'target_id');
  if (in_array(FROM_TYPE, $types, TRUE) && !in_array(TYPE, $types, TRUE)) {
    $types[] = TYPE;
    $message->set('field_activity_types', $types)->save();
    $tagged++;
  }
}
out("Mensajes de motivación con el tipo nuevo añadido: $tagged");
if (!$messages->loadByProperties(['bundle' => 'explanation_message', 'label' => 'Rule sequence'])) {
  $messages->create(['bundle' => 'explanation_message', 'label' => 'Rule sequence', 'uid' => 1, 'langcode' => 'es'])->save();
  out('explanation_message "Rule sequence" creado');
}
else {
  out('explanation_message "Rule sequence" ya existe');
}

\Drupal::service('router.builder')->rebuild();
out('Hecho.');
