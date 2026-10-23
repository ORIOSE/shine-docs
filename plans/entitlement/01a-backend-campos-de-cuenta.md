# 01a. Backend: campos de cuenta, rol de alumno y consentimiento

- **Modelo recomendado: Opus.** Especificación cerrada en `docs/monetization.md` §3.1 y §3.2; es
  añadir campos y un rol siguiendo los patrones del repo, una restricción de validación y una
  `hook_update_N`.
- Fase: 17 (monetización), parte 17a. Alcance: solo Drupal (`shine/`).
- Dependencias: ninguna.

## Prompt

Lee `docs/monetization.md` (§3.1, §3.2, §5.1 y §5.3 el último párrafo sobre `operated_by`),
`plans/entitlement/README.md` (secciones "Decisiones técnicas" e "Incoherencias"), `CLAUDE.md`
(gotchas 14, 15 y 16) y `docs/conventions.md` §1. Trabaja en `shine/` con `ddev`. Crea el módulo
**`shine_account`** (prefijo `shine_`, `package: shine`) y deja en él todo lo que sea código; los
campos se crean por UI o `php-eval` y se exportan con `ddev drush cex -y`. **No** crees ningún
campo "gestionado por": la relación titular-alumno es la entidad `learner_access` de 01b.

Tareas:

1. **Campos en `user`** (un storage por campo, en el bundle `user`):
   - `field_account_kind` (list_string, requerido, `holder` | `learner`, por defecto `holder`).
   - `field_adult_consent` (boolean, por defecto FALSE) y `field_adult_consent_at` (timestamp,
     opcional). En `hook_user_presave`, si el booleano pasa a TRUE y el timestamp está vacío, fija
     el timestamp con la hora actual; nunca se vuelve a tocar.
   - `field_archived_at` (timestamp, opcional): lo usa 01b para archivar alumnos.
   - `field_avatar` (string, 32, opcional): clave de un avatar del set de la app (ver README).
   `field_display_name` ya existe y se reutiliza para el nombre o apodo del alumno.
   `field_organization` **no** se crea aquí (referencia a una entidad que nace en 10).
2. **Campo en `node.session`**: `field_operated_by` (entity_reference a `user`, opcional, single):
   el titular que generó la sesión. Lo escribe 02; aquí solo existe y se expone en JSON:API como el
   resto de campos de la sesión.
3. **Consentimiento obligatorio en el registro anónimo**: añade al campo `field_adult_consent`
   una restricción de validación propia (`hook_entity_bundle_field_info_alter` + plugin
   `Constraint`) que falle si el usuario es nuevo, el actor es anónimo (registro por
   `POST /user/register?_format=json`) y el valor no es TRUE. El mensaje debe salir en el 422 de
   REST. Comprueba que `drush user:create` y el formulario de administración siguen creando
   usuarios sin consentimiento, y que el recurso `user_registration` acepta el campo (igual que
   hoy acepta `field_display_name`).
4. **Campos que el usuario no puede editar**: en `hook_entity_field_access` de `shine_account`,
   deniega `edit` de `field_account_kind`, `field_adult_consent_at`, `field_archived_at` (usuario)
   y `field_operated_by` (sesión) a quien no tenga `administer users` (mismo patrón que el
   `hook_entity_field_access` de `shine_level` para `field_onboarding_state`).
   `field_adult_consent` se puede escribir solo mientras la entidad es nueva. Los servicios de 01b
   y 02 escriben estos campos desde código, no pasan por aquí.
5. **Rol `learner`**: nuevo rol sin permisos propios (los de juego le llegan por `authenticated`).
   Exporta `user.role.learner.yml`.
6. **Correo**: `hook_mail_alter` en `shine_account` que anula (`send = FALSE`) cualquier correo a
   una dirección terminada en `@shine.invalid`. Comprueba que el validador de email de Drupal acepta
   `learner+{uuid}@shine.invalid` creando un usuario de prueba por `php-eval` y borrándolo después;
   si no lo acepta, elige otro dominio reservado y anótalo en el diseño §3.2.
7. **Reclasificación**: `hook_update_N` en `shine_account.install` que ponga `field_account_kind =
   holder` a todos los usuarios existentes con el campo vacío (uid 1 incluido) y
   `field_adult_consent = TRUE` sin timestamp para que no queden inválidos. En local hay cuentas de
   prueba con sesiones y niveles: siguen siendo titulares (lo dice el diseño; si alguna es un alumno
   se reclasifica a mano).
8. **Documentación**: corrige en `docs/api-design.md` la mención a Capacitor (la app es Expo y los
   binarios los genera EAS Build), añade los campos nuevos a la sección de registro con el ejemplo
   de cuerpo que incluye `field_adult_consent: {value: true}` y la respuesta 422 si falta, y
   `field_operated_by` a la sección de sesiones.
9. Exporta config y comprueba que `ddev drush cim -y` es idempotente.

Verificación:
- `POST /user/register?_format=json` sin `field_adult_consent` devuelve 422 con el mensaje de la
  restricción; con `{"value": true}` crea el usuario con `field_account_kind = holder` y
  `field_adult_consent_at` relleno.
- `ddev drush user:create prueba --mail=prueba@example.com --password=x` funciona sin consentimiento.
- Como usuario normal (gotcha 14), `PATCH /jsonapi/user/user/{uuid}` con `field_account_kind:
  learner` devuelve 403; el PATCH de `field_dyslexic_font` que ya hace la app sigue funcionando;
  `GET /jsonapi/node/session` muestra `field_operated_by` (vacío).
- `ddev drush updb -y` aplica la reclasificación; `ddev drush cim -y` idempotente;
  `ddev drush watchdog:show --severity=Error` sin errores nuevos.

Al terminar: marca la fila en `plans/entitlement/README.md`, crea la sección "FASE 17"
(Monetización y modelo de cuentas) en `docs/progress.md` y añade `shine_account` a la tabla de
módulos de `CLAUDE.md`.
