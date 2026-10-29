<?php

/**
 * @file
 * 01a (FASE 17): comprobaciones de email sintético, validación y correo.
 *
 * Uso: ddev drush php:script private/scripts/shine-account-checks.php
 * Crea un alumno de prueba y lo borra al final.
 */

use Drupal\Component\Uuid\Php as Uuid;
use Drupal\user\Entity\User;

$uuid = (new Uuid())->generate();
$mail = "learner+$uuid@shine.invalid";

echo 'email.validator: ' . (\Drupal::service('email.validator')->isValid($mail) ? 'válido' : 'NO válido') . PHP_EOL;

// Como lo creará 01b: un titular autenticado crea al alumno.
\Drupal::service('account_switcher')->switchTo(User::load(2));
$learner = User::create([
  'name' => $mail,
  'mail' => $mail,
  'pass' => \Drupal::service('password_generator')->generate(32),
  'status' => 1,
  'field_account_kind' => 'learner',
  'field_display_name' => 'Alumno de prueba',
  'roles' => ['learner'],
]);
$violations = $learner->validate();
echo 'violations: ' . count($violations) . PHP_EOL;
foreach ($violations as $violation) {
  echo '  ' . $violation->getPropertyPath() . ': ' . strip_tags((string) $violation->getMessage()) . PHP_EOL;
}
$learner->save();
\Drupal::service('account_switcher')->switchBack();
echo "creado uid {$learner->id()} ({$learner->getEmail()})" . PHP_EOL;

// Correo al alumno: shine_account_mail_alter() lo anula.
$result = \Drupal::service('plugin.manager.mail')->mail('user', 'password_reset', $learner->getEmail(), 'en', ['account' => $learner]);
echo 'mail al alumno: send=' . var_export($result['send'], TRUE) . ' result=' . var_export($result['result'], TRUE) . PHP_EOL;

// Lista mixta: se quita la dirección sintética y el resto sale.
$result = \Drupal::service('plugin.manager.mail')->mail('user', 'password_reset', $learner->getEmail() . ', prueba@example.com', 'en', ['account' => $learner], NULL, FALSE);
echo 'mail mixto: to=' . $result['to'] . ' send=' . var_export($result['send'], TRUE) . PHP_EOL;

$learner->delete();
echo 'borrado: ' . (User::load($learner->id()) ? 'NO' : 'sí') . PHP_EOL;
