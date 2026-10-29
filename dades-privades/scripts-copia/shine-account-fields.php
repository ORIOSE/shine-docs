<?php

/**
 * @file
 * 01a (FASE 17): campos de cuenta en user y field_operated_by en node.session.
 *
 * Uso: ddev drush php:script private/scripts/shine-account-fields.php
 * Idempotente. Después: ddev drush cex -y.
 */

use Drupal\field\Entity\FieldConfig;
use Drupal\field\Entity\FieldStorageConfig;

$fields = [
  ['user', 'user', 'field_account_kind', 'list_string', [
    'allowed_values' => ['holder' => 'Titular', 'learner' => 'Alumno'],
    'allowed_values_function' => '',
  ], [
    'label' => 'Tipo de cuenta',
    'description' => 'Titular: adulto que se registra, paga y maneja la app. Alumno: perfil gestionado sin credenciales (lo crea un titular). Lo escribe el servidor.',
    'required' => TRUE,
    'default_value' => [['value' => 'holder']],
  ]],
  ['user', 'user', 'field_adult_consent', 'boolean', [], [
    'label' => 'Soy mayor de edad y responsable de la persona con la que voy a trabajar',
    'description' => 'Declaración del titular en el registro. Obligatoria en el registro anónimo; el servidor guarda la hora en field_adult_consent_at. Solo se escribe al crear la cuenta.',
    'default_value' => [['value' => 0]],
    'settings' => ['on_label' => 'Sí', 'off_label' => 'No'],
  ]],
  ['user', 'user', 'field_adult_consent_at', 'timestamp', [], [
    'label' => 'Consentimiento aceptado el',
    'description' => 'Lo fija el servidor la primera vez que field_adult_consent pasa a verdadero. Vacío con consentimiento = usuario anterior a la FASE 17.',
  ]],
  ['user', 'user', 'field_archived_at', 'timestamp', [], [
    'label' => 'Archivado el',
    'description' => 'Alumno archivado por su titular: no ocupa cupo ni recibe tokens; sus datos se conservan. Lo escribe el servidor.',
  ]],
  ['user', 'user', 'field_avatar', 'string', ['max_length' => 32, 'is_ascii' => TRUE], [
    'label' => 'Avatar',
    'description' => 'Clave de un avatar del set de la app (no es una imagen).',
  ]],
  ['node', 'session', 'field_operated_by', 'entity_reference', ['target_type' => 'user'], [
    'label' => 'Operated by',
    'description' => 'Titular que generó la sesión con el token del alumno (claim operated_by). Vacío en sesiones del propio usuario. Lo escribe el servidor.',
    'settings' => [
      'handler' => 'default:user',
      'handler_settings' => [
        'target_bundles' => NULL,
        'sort' => ['field' => '_none', 'direction' => 'ASC'],
        'auto_create' => FALSE,
        'filter' => ['type' => '_none'],
        'include_anonymous' => FALSE,
      ],
    ],
  ]],
];

foreach ($fields as [$entity_type, $bundle, $name, $type, $storage_settings, $field_values]) {
  if (!FieldStorageConfig::loadByName($entity_type, $name)) {
    FieldStorageConfig::create([
      'field_name' => $name,
      'entity_type' => $entity_type,
      'type' => $type,
      'cardinality' => 1,
      'translatable' => FALSE,
      'settings' => $storage_settings,
    ])->save();
    echo "storage $entity_type.$name\n";
  }
  if (!FieldConfig::loadByName($entity_type, $bundle, $name)) {
    FieldConfig::create([
      'field_name' => $name,
      'entity_type' => $entity_type,
      'bundle' => $bundle,
      'translatable' => FALSE,
    ] + $field_values)->save();
    echo "field $entity_type.$bundle.$name\n";
  }
}

$repository = \Drupal::service('entity_display.repository');

// Usuario: el admin reclasifica a mano con el tipo de cuenta; el consentimiento
// se ve en el alta (admin y formulario web de registro). El resto lo escribe el
// servidor y no se muestra.
$form = $repository->getFormDisplay('user', 'user');
$form->setComponent('field_account_kind', ['type' => 'options_select', 'weight' => -6]);
$form->setComponent('field_adult_consent', ['type' => 'boolean_checkbox', 'weight' => 10, 'settings' => ['display_label' => TRUE]]);
foreach (['field_adult_consent_at', 'field_archived_at', 'field_avatar'] as $name) {
  $form->removeComponent($name);
}
$form->save();
$view = $repository->getViewDisplay('user', 'user');
foreach (['field_account_kind', 'field_adult_consent', 'field_adult_consent_at', 'field_archived_at', 'field_avatar'] as $name) {
  $view->removeComponent($name);
}
$view->save();

// Sesión: junto a los demás campos de sistema (completed_at, kind...).
$form = $repository->getFormDisplay('node', 'session');
$form->setComponent('field_operated_by', [
  'type' => 'entity_reference_autocomplete',
  'weight' => 22,
  'settings' => ['match_operator' => 'CONTAINS', 'match_limit' => 10, 'size' => 60, 'placeholder' => ''],
]);
$form->save();
$repository->getViewDisplay('node', 'session', 'default')->setComponent('field_operated_by', [
  'type' => 'entity_reference_label',
  'label' => 'inline',
  'weight' => 22,
  'settings' => ['link' => FALSE],
])->save();
$repository->getViewDisplay('node', 'session', 'teaser')->removeComponent('field_operated_by')->save();

echo "OK\n";
