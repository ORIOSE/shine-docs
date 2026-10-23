# 10. Backend: organizaciones, membresías, plazas y liberación del alumno (`shine_org`)

- **Modelo recomendado: Fable.** Modelo de datos nuevo con tres entidades, cobertura por plaza
  que se superpone a la personal, y el `release` de §5.6 (promoción de roles, archivo automático),
  todo con implicaciones de acceso entre adultos que no se conocen.
- Fase: 17, parte 17e y §5.6. Alcance: solo Drupal (`shine/`), módulo nuevo `shine_org` más
  retoques en `shine_account` y `shine_entitlement`.
- Dependencias: 01c (`learner_access`, invitaciones) y 04 (`OrganizationCoverageInterface`).

## Prompt

Lee `docs/monetization.md` §3.1 (`field_organization`), §3.3, §3.4, §4.1 ("Cobertura de un
alumno", punto 1), §4.2, §5.2, §5.6 completo y §6.2, `plans/entitlement/README.md` ("Campos que
apuntan a `organization`", "Orden de cobertura", "Incoherencias" sobre §11), `CLAUDE.md` (gotcha
16) y el código de `shine_account` (`LearnerAccessPolicy`, `LearnerManager`, `/shine/me`) y de
`shine_entitlement` (`EntitlementAccess`, catálogo). Trabaja en `shine/` con `ddev`.

Tareas:

1. **Módulo `shine_org`** (depende de `shine_account` y `shine_entitlement`) con tres entidades
   de contenido de campos de código: `organization` (`label`, `field_org_kind` `practice` |
   `school`, `field_tax_id`, `field_billing_email`, `field_owner`, `status`),
   `organization_membership` (`field_organization`, `field_user`, `field_role` `coordinator` |
   `professional` | `teacher`, `status`; único por organización y usuario) y `organization_invite`
   (`code` con hash como en `learner_invite`, `field_organization`, `field_role`, `field_max_uses`,
   `field_uses`, `field_expires`, `status`). Handlers de acceso (miembros ven su organización y sus
   membresías; admin todo), filtros JSON:API (gotcha 16), formularios y listas en
   `/admin/shine/organizations` (crear organización, miembros, generar códigos, ver alumnos en
   plaza). Permiso `administer shine organizations`.
2. **Campos que faltaban**: `field_organization` en `user` (entity_reference a `organization`,
   opcional) y `field_organization` en `entitlement` (campo base añadido con `hook_update_N` que
   instale la definición; 03 lo dejó fuera). `field_released_by` (organization) y
   `field_released_at` en `user`, para el mensaje de §5.6 "Familia" punto 7.
3. **Unirse a una organización**: `POST /shine/organizations/join {code}` (titular): valida el
   código (vivo, usos, caducidad; flood como en 01c), crea la membresía con el rol del código
   (idempotente para el mismo titular), responde la organización. `hook_shine_me_alter` añade
   `organizations[] {uuid, label, kind, role, covered}`.
4. **Alumnos en plaza**: `POST /shine/learners` acepta `organization` (UUID); solo si el titular
   es miembro activo. Fija `field_organization`, crea el `learner_access` `owner`/`organization` y
   comprueba la plaza: alumnos activos con ese `field_organization` frente a `max_learners` del
   entitlement de la organización (422 `organization_limit`). Estos alumnos **no** cuentan en el
   cupo personal del docente (`learner_quota` los excluye) ni consumen prueba. El coordinador puede
   dar acceso `staff` a otros miembros: `POST /shine/learners/{uuid}/staff {member_uuid}` y
   `DELETE .../staff/{member_uuid}`. `LearnerAccessPolicy` gana `coordinator` (edita, invita,
   libera y archiva alumnos de su organización aunque no tenga `learner_access`) y `staff`.
5. **Cobertura por organización**: implementa `OrganizationCoverageInterface` (04): un alumno con
   `field_organization` cuya organización tiene un entitlement `school`/`professional` cubierto
   (`field_organization` del entitlement) y está dentro de la plaza (orden de alta) devuelve
   `Coverage` `organization` con el nombre del centro, para **todos** sus adultos. La plaza se
   calcula sobre alumnos activos de la organización. Invalida la caché del acceso al cambiar
   membresías, plazas y entitlements de organización.
6. **Liberar al alumno** (`POST /shine/learners/{uuid}/release`, `owner` del centro o
   `coordinator`): `field_organization` a nulo, `field_released_by`/`field_released_at`, accesos
   `staff` y el `owner` del personal del centro desactivados; si queda algún `guardian` activo, el
   primero por antigüedad pasa a `owner`; si no queda ninguno, el alumno se archiva. A partir de
   ahí la cobertura sigue el orden normal (plan personal del nuevo `owner` o prueba, contando
   **todas** las regulares completadas, también las del aula). `hook_shine_me_alter` añade
   `released_by` al alumno hasta que vuelva a estar cubierto; `canGenerateRegular` devuelve
   `released_by_organization` en vez de `trial_exhausted` cuando el alumno fue liberado hace menos
   de 30 días y no está cubierto (para el texto de la app).
7. **Entitlements de organización desde el admin**: el formulario de 03 permite elegir
   organización (`source` `manual`, plan `professional` o `school`); hasta que exista Stripe (11)
   es la forma de dar de alta un centro.
8. **Tests kernel**: join con código válido, caducado y agotado; alumno en plaza cubierto para
   docente y para la familia vinculada; plaza llena 422; alumno de centro no gasta cupo ni prueba
   de la familia; `staff` opera y no archiva; `coordinator` libera sin `learner_access`; release
   con `guardian` promueve y con nadie archiva; tras release la prueba cuenta las regulares del
   aula; un titular miembro de dos organizaciones.
9. **Documentación**: `docs/api-design.md` ("Organizaciones"), `docs/monetization.md` (§11:
   cerrar "derivación centro → familia"; §3.1: `field_organization` nace en 17e; §10: añadir
   `release` y `staff` a 17e) y `CLAUDE.md` (módulo, endpoints).

Verificación:
- Tres titulares normales (gotcha 14): C coordinador crea organización desde el admin con
  entitlement `school` de 2 plazas; D docente se une por código, crea una alumna en plaza y
  trabaja con ella; F familia canjea la invitación de la alumna (01c): `covered_by: organization`
  en los dos, F no gasta cupo; tercera alumna en plaza → 422; D libera a la alumna → F pasa a
  `owner`, `released_by` aparece y, con la prueba agotada, el 402 trae `released_by_organization`;
  con cortesía para F vuelve a generar.
- Tests de `shine_org`, `shine_account` y `shine_entitlement` en verde; `drush cim -y`
  idempotente; watchdog sin errores nuevos.

Al terminar: marca la fila en `plans/entitlement/README.md` y actualiza `docs/progress.md`.
