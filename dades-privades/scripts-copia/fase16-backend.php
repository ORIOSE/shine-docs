<?php

/**
 * @file
 * FASE 16: tipo activity_rapid_repetition y bundles de tracking.
 *
 * Idempotente. No se versiona (private/ está en .gitignore): la config
 * exportada con `drush cex` es la verdad. Clona los campos comunes de
 * activity_word_split (FASE 13), field_time_limit de activity_letter_matrix y
 * los bundles de logwordsplit / summary_word_split sin los contadores de
 * acierto (decisión 6 del prompt 16a).
 *
 * Ejecutar con: ddev drush php:script private/scripts/fase16-backend.php
 */

use Drupal\activitylog\Entity\ActivitylogType;
use Drupal\activitysummary\Entity\ActivitysummaryType;
use Drupal\Core\Field\Entity\BaseFieldOverride;
use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;
use Drupal\node\Entity\NodeType;

const TYPE = 'activity_rapid_repetition';
const LOG_BUNDLE = 'lograpidrepetition';
const SUMMARY_BUNDLE = 'summary_rapid_repetition';
// Rendimiento y Velocidad de Procesamiento / Competencia Lingüística y Fonológica.
const AREA_VELOCIDAD_UUID = '8717434d-45b8-4752-a88a-b9fe8a5b0d1a';
const AREA_LINGUISTICA_UUID = '8aa46c3f-ad98-45a9-badd-bb7ac2c7d4d7';

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
  FieldConfig::create(['field_name' => $name, 'entity_type' => $entity_type, 'bundle' => $bundle] + $values)->save();
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

// ---------------------------------------------------------------------------
// 1. Node type.
// ---------------------------------------------------------------------------
$node_type = NodeType::load(TYPE);
if (!$node_type) {
  $node_type = NodeType::create([
    'type' => TYPE,
    'name' => 'Activity rapid repetition',
    'description' => 'Repetición rápida de palabra (FASE 16): el alumno repite una palabra en voz alta durante un tiempo fijo y el tutor cuenta las repeticiones.',
    'new_revision' => FALSE,
    'preview_mode' => 0,
    'display_submitted' => FALSE,
  ]);
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
ensure_storage('node', 'field_words', 'string', ['max_length' => 255, 'case_sensitive' => FALSE, 'is_ascii' => FALSE], -1);
ensure_storage('activitylog', 'field_repetitions', 'integer', ['unsigned' => FALSE, 'size' => 'normal'], 1);
ensure_storage('activitysummary', 'field_repetitions', 'integer', ['unsigned' => FALSE, 'size' => 'normal'], 1);

// ---------------------------------------------------------------------------
// 3. Campos del nodo: comunes clonados de activity_word_split, field_time_limit
//    de activity_letter_matrix (obligatorio aquí) y field_words nuevo.
// ---------------------------------------------------------------------------
foreach (['field_activity_code', 'field_activity_level', 'field_custom_explanation', 'field_cycle', 'field_cycle_weight', 'field_decoding_effort', 'field_explanation', 'field_sonority'] as $name) {
  clone_field('node', 'activity_word_split', TYPE, $name);
}
clone_field('node', 'activity_word_split', TYPE, 'field_main_area', [
  'default_value' => [['target_uuid' => AREA_VELOCIDAD_UUID]],
]);
clone_field('node', 'activity_word_split', TYPE, 'field_secondary_area', [
  'default_value' => [['target_uuid' => AREA_LINGUISTICA_UUID]],
]);
clone_field('node', 'activity_letter_matrix', TYPE, 'field_time_limit', [
  'required' => TRUE,
  'description' => 'Segundos de cada ronda: tiempo fijo en el que el alumno repite la palabra. Igual para todas las palabras de la actividad.',
  'settings' => ['min' => 1, 'max' => NULL, 'prefix' => '', 'suffix' => ''],
]);
ensure_field('node', TYPE, 'field_words', [
  'label' => 'Words',
  'description' => 'Una palabra o pseudopalabra por valor, en el orden en que se presentan (mínimo 4). Cada una es una ronda con el mismo tiempo.',
  'required' => TRUE,
  'translatable' => TRUE,
  'settings' => [],
]);

clone_display('form', 'node', 'activity_word_split', TYPE, [
  'field_words' => ['type' => 'string_textfield', 'weight' => 3, 'region' => 'content', 'settings' => ['size' => 60, 'placeholder' => ''], 'third_party_settings' => []],
  'field_time_limit' => ['type' => 'number', 'weight' => 4, 'region' => 'content', 'settings' => ['placeholder' => ''], 'third_party_settings' => []],
], ['field_sentences']);
clone_display('view', 'node', 'activity_word_split', TYPE, [
  'field_words' => ['type' => 'string', 'label' => 'above', 'weight' => 5, 'region' => 'content', 'settings' => ['link_to_entity' => FALSE, 'link_rel' => 'canonical'], 'third_party_settings' => []],
  'field_time_limit' => ['type' => 'number_integer', 'label' => 'inline', 'weight' => 6, 'region' => 'content', 'settings' => ['thousand_separator' => '', 'prefix_suffix' => TRUE], 'third_party_settings' => []],
], ['field_sentences']);

// ---------------------------------------------------------------------------
// 4. Bundle de activitylog: clon de logwordsplit sin acierto ni intentos.
// ---------------------------------------------------------------------------
if (!ActivitylogType::load(LOG_BUNDLE)) {
  ActivitylogType::create(['id' => LOG_BUNDLE, 'label' => 'Log Rapid repetition'])->save();
  out('Bundle activitylog creado: ' . LOG_BUNDLE);
}
else {
  out('Bundle activitylog ya existe: ' . LOG_BUNDLE);
}
foreach (['field_activity_type', 'field_errors', 'field_item', 'field_iteration', 'field_sessionid', 'field_time', 'field_weight'] as $name) {
  clone_field('activitylog', 'logwordsplit', LOG_BUNDLE, $name);
}
$activityid = FieldConfig::loadByName('activitylog', 'logwordsplit', 'field_activityid');
clone_field('activitylog', 'logwordsplit', LOG_BUNDLE, 'field_activityid', [
  'settings' => ['handler_settings' => ['target_bundles' => [TYPE => TYPE]] + $activityid->getSetting('handler_settings')] + $activityid->getSettings(),
]);
ensure_field('activitylog', LOG_BUNDLE, 'field_repetitions', [
  'label' => 'Repetitions',
  'description' => 'Repeticiones completas contadas por el tutor en esta ronda (una palabra).',
  'required' => FALSE,
  'translatable' => TRUE,
  'settings' => ['min' => 0, 'max' => NULL, 'prefix' => '', 'suffix' => ''],
]);
clone_display('form', 'activitylog', 'logwordsplit', LOG_BUNDLE, [
  'field_repetitions' => ['type' => 'number', 'weight' => 3, 'region' => 'content', 'settings' => ['placeholder' => ''], 'third_party_settings' => []],
], ['field_attempts', 'field_correct']);
clone_display('view', 'activitylog', 'logwordsplit', LOG_BUNDLE, [
  'field_repetitions' => ['type' => 'number_integer', 'label' => 'inline', 'weight' => 3, 'region' => 'content', 'settings' => ['thousand_separator' => '', 'prefix_suffix' => TRUE], 'third_party_settings' => []],
], ['field_attempts', 'field_correct']);

// ---------------------------------------------------------------------------
// 5. Bundle de activitysummary: clon de summary_word_split sin contadores.
// ---------------------------------------------------------------------------
if (!ActivitysummaryType::load(SUMMARY_BUNDLE)) {
  ActivitysummaryType::create(['id' => SUMMARY_BUNDLE, 'label' => 'Summary Rapid repetition'])->save();
  out('Bundle activitysummary creado: ' . SUMMARY_BUNDLE);
}
else {
  out('Bundle activitysummary ya existe: ' . SUMMARY_BUNDLE);
}
foreach (['field_activity_level', 'field_activity_type', 'field_errors', 'field_iteration', 'field_main_area', 'field_sessionid', 'field_time'] as $name) {
  clone_field('activitysummary', 'summary_word_split', SUMMARY_BUNDLE, $name);
}
$summary_activityid = FieldConfig::loadByName('activitysummary', 'summary_word_split', 'field_activityid');
clone_field('activitysummary', 'summary_word_split', SUMMARY_BUNDLE, 'field_activityid', [
  'settings' => ['handler_settings' => ['target_bundles' => [TYPE => TYPE]] + $summary_activityid->getSetting('handler_settings')] + $summary_activityid->getSettings(),
]);
$activitylogs = FieldConfig::loadByName('activitysummary', 'summary_word_split', 'field_activitylogs');
clone_field('activitysummary', 'summary_word_split', SUMMARY_BUNDLE, 'field_activitylogs', [
  'settings' => ['handler_settings' => ['target_bundles' => [LOG_BUNDLE => LOG_BUNDLE]] + $activitylogs->getSetting('handler_settings')] + $activitylogs->getSettings(),
]);
ensure_field('activitysummary', SUMMARY_BUNDLE, 'field_repetitions', [
  'label' => 'Repetitions',
  'description' => 'Suma de las repeticiones de todas las palabras del intento. El ritmo (repeticiones por segundo) se deriva con field_time y no se guarda.',
  'required' => FALSE,
  'translatable' => TRUE,
  'settings' => ['min' => 0, 'max' => NULL, 'prefix' => '', 'suffix' => ''],
]);
clone_display('form', 'activitysummary', 'summary_word_split', SUMMARY_BUNDLE, [
  'field_repetitions' => ['type' => 'number', 'weight' => 29, 'region' => 'content', 'settings' => ['placeholder' => ''], 'third_party_settings' => []],
], ['field_correct_count', 'field_items_count']);
clone_display('view', 'activitysummary', 'summary_word_split', SUMMARY_BUNDLE, [
  'field_repetitions' => ['type' => 'number_integer', 'label' => 'above', 'weight' => 29, 'region' => 'content', 'settings' => ['thousand_separator' => '', 'prefix_suffix' => TRUE], 'third_party_settings' => []],
], ['field_correct_count', 'field_items_count']);

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
// 7. Contenido por entorno: mensaje de motivación y explicación.
// ---------------------------------------------------------------------------
$messages = \Drupal::entityTypeManager()->getStorage('activity_message');
$motivations = $messages->loadByProperties(['bundle' => 'motivation_message']);
$tagged = 0;
foreach ($motivations as $message) {
  $types = array_column($message->get('field_activity_types')->getValue(), 'target_id');
  if (in_array('activity_word_split', $types, TRUE) && !in_array(TYPE, $types, TRUE)) {
    $types[] = TYPE;
    $message->set('field_activity_types', $types)->save();
    $tagged++;
  }
}
out("Mensajes de motivación con el tipo nuevo añadido: $tagged");

$explanations = $messages->loadByProperties(['bundle' => 'explanation_message', 'label' => 'Rapid repetition']);
if (!$explanations) {
  $messages->create(['bundle' => 'explanation_message', 'label' => 'Rapid repetition', 'uid' => 1])->save();
  out('explanation_message "Rapid repetition" creado');
}
else {
  out('explanation_message "Rapid repetition" ya existe');
}

\Drupal::service('router.builder')->rebuild();
out('Hecho.');
