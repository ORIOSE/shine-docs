# 06. Mi gabinete / Mi centro: miembros, códigos, alumnos en plaza, reasignación, liberación y registro de accesos

- **Agente recomendado: Fable 5.1**, con la skill `frontend-design` para las tablas y diálogos. Es
  el subplan con más reglas de acceso cruzadas (coordinación que gestiona sin operar, bajas de
  miembros con alumnos a su cargo, último coordinador, liberaciones en bloque) y añade operaciones
  nuevas a `shine_org` que hoy solo existen en el admin. Un error quita o da acceso a alumnos de
  todo un centro.
- Fase: 21. Alcance: Drupal (`shine/`): `shine_panel` (rutas `/panel/organizacion/{uuid}*`) y
  `shine_org` (servicios nuevos con tests).
- Dependencias: 03 (ficha y cartera) y 05 (bloque de licencia).

## Prompt

Lee `docs/dashboards.md` §6.1 a §6.3, §6.6, §6.7 y §8, `docs/monetization.md` §3.4 y §5.6,
`plans/entitlement/10-backend-organizaciones.md` (decisiones: el coordinador gestiona pero no opera
sin `staff`; el `release` desactiva los accesos de origen `organization`; `released_notice_days`),
`docs/api-design.md` ("Organizaciones"), `docs/lovable/INDEX.md` secciones 4 (`panel.organizacion.tsx`)
y 8 (lo que no existe: cambio de rol, baja de miembro, códigos desde el panel, reasignar
responsable, liberación en bloque, alta por CSV), y `docs/lovable/panel/src/components/shine/org.tsx`
(textos, columnas y diálogos). En Drupal: `shine_org` entero (`OrganizationManager`,
`OrganizationInviteManager`, `OrganizationLearners`, `OrganizationCoverage`, `OrganizationRoles`,
entidades y sus handlers de acceso, `OrganizationAdminController` y `OrganizationInviteForm` del
admin, que hacen ya parte de esto), `shine_account` (`LearnerManager::release`, `grantAccess`,
`withdraw`, `LearnerAccessPolicy::canRelease`, `effectiveRole`), `shine_audit` (02) y `PanelAccess`
(02). Trabaja en `shine/`.

Tareas:

1. **Servicios nuevos en `shine_org`** (con tests kernel antes que las pantallas):
   - `OrganizationManager::changeRole(membership, role)`: nunca deja a la organización sin
     coordinador activo (`last_coordinator` → excepción); el propio coordinador puede dejar de
     serlo solo si hay otro.
   - `OrganizationManager::removeMember(membership)`: desactiva la membresía, desactiva los
     `learner_access` del miembro con origen `organization` sobre alumnos en plaza de esa
     organización (los alumnos quedan "sin responsable" si el miembro era su único `owner`), revoca
     sus tokens de alumno (`TokenRevoker` sobre esos alumnos; 12 h de caducidad de todas formas) y
     no toca lo que ese titular tenga fuera de la organización. Misma regla de último coordinador.
   - `OrganizationLearners::reassign(learner, newOwnerMembership)`: concede `owner`/`organization`
     al nuevo responsable (miembro activo de la misma organización) y desactiva el `owner` anterior
     de origen `organization`; los `staff` y los `guardian` no cambian.
   - `OrganizationLearners::withoutOwner(organization)`: alumnos en plaza sin `owner` activo.
   - `OrganizationInviteManager`: lo que falte para generar desde el panel (rol, usos máximos,
     caducidad) y revocar (`status 0`) un código vigente; el código solo se enseña al crearlo
     (se guarda el HMAC, como hoy).
   - `OrganizationCoverage`: `releaseAll(organization)` como generador para la liberación en
     bloque (cada alumno con `LearnerManager::release`, misma regla de promoción del `guardian`).
   Cada operación escribe en `audit_log` con la organización.
2. **Página `/panel/organizacion/{uuid}`** (solo coordinación; un miembro que no coordina ve la
   página "Solo para coordinación" con el nombre de quien coordina; un no miembro, 404). Cabecera con
   el nombre, "Mi gabinete" o "Mi centro", botón "Informes" (09) y pestañas por URL: Miembros,
   Alumnos, Licencia y facturación, Datos y privacidad. Si el titular coordina varias, la sección de
   navegación muestra una entrada por organización.
3. **Miembros**: tabla (`data-table`) con Nombre, Rol (select en línea dentro de un formulario por
   fila: Coordinación / Profesional / Docente según el tipo de organización), Alta, Alumnos a cargo
   (`owner` activos en plaza), Última actividad (última sesión que operó), y "Dar de baja" con
   diálogo (texto del prototipo: "Sus N alumnos quedarán sin responsable; podrás reasignarlos desde
   Alumnos. No se pierde ningún dato"). "Generar código de invitación" (rol, usos máximos, caduca
   el; el código se muestra una sola vez con "Copiar"); "Códigos vigentes" (código enmascarado salvo
   los 4 últimos caracteres, rol, "usos x de y", caducidad, "Revocar"). "Dar acceso a un alumno"
   (miembro + alumno en plaza → `staff`, como `POST /shine/learners/{uuid}/staff`; y "Retirar
   acceso"). Mensajes de error con texto ("No puedes dejar la organización sin coordinación").
4. **Alumnos de la organización**: tabla de todos los alumnos en plaza con Nombre, Responsable
   ("Sin responsable" destacado si no hay `owner`), Familia ("Sí" si hay `guardian`, "Pendiente" si
   hay invitación viva, "No"), Última sesión, Centro / casa (sesiones operadas por miembros frente al
   resto, de `LearnerActivity`), Niveles (mini chips por área), Estado; buscador por nombre y
   responsable; selección múltiple con "Reasignar responsable" (diálogo con los miembros activos) y
   "Liberar de la licencia" (diálogo con el texto de `docs/monetization.md` §5.6; en bloque con
   Batch API si son más de 20). "Liberación de fin de curso" (todas las plazas, confirmación escrita
   "LIBERAR", Batch API, resumen final con cuántas se liberaron y cuántos alumnos quedaron
   archivados por no tener familia). "Alta masiva por CSV": fuera de alcance (README); no se muestra.
   Desde aquí la ficha de cada alumno (03) abre con las acciones de coordinación ("Reasignar" ya
   activo).
5. **Licencia y facturación**: incrusta los bloques de 05 para esta organización (licencia, portal,
   datos de facturación, contratar o ampliar). Para un centro con licencia manual, el texto de
   contrato gestionado por Shine.
6. **Datos y privacidad**: "Registro de accesos": las filas de `audit_log` de la organización
   (fecha, quién, acción en lenguaje claro: "invitó a Pere V.", "liberó a Lucía de la licencia",
   "reasignó a Hugo a Jordi P.", "exportó el informe de cartera"), paginadas y filtrables por
   acción; "Exportar datos de la organización": pendiente (texto "Escríbenos desde Ayuda";
   README). Dirección de contacto de facturación visible.
7. **Portada de coordinación** (02): sustituye las cifras provisionales por las reales (invitaciones
   pendientes = códigos vigentes con usos libres; miembros activos; alumnos sin responsable como
   aviso nuevo con enlace a la pestaña Alumnos).
8. **Tests kernel** (`shine_org` y `shine_panel`): cambio de rol que dejaría sin coordinación →
   excepción y 422 en el formulario; baja de un miembro con dos alumnos a su cargo → ambos sin
   responsable, sus tokens de alumno revocados, su acceso a un alumno propio fuera de la organización
   intacto; reasignación mueve el `owner` y conserva `guardian` y `staff`; liberación en bloque de 3
   alumnos (uno con familia → `guardian` promovido, dos sin familia → archivados); coordinador de A
   en `/panel/organizacion/{B}` → 404; profesional sin coordinación → página "Solo para
   coordinación"; `audit_log` con una fila por operación.
9. **Documentación**: `docs/dashboards.md` §6 (implementado, pendientes), `docs/api-design.md`
   ("Organizaciones": nuevas operaciones de servicio; sin endpoints nuevos salvo que decidas
   exponerlos para la app, en cuyo caso documéntalos), `docs/monetization.md` §3.4 (baja de miembro
   y reasignación), `CLAUDE.md`, `docs/progress.md`.

Verificación:
- Con un gabinete de prueba (coordinadora, dos profesionales, licencia manual de 2 asientos, 6
  alumnos, uno compartido con `jose@test.com` por código): la coordinadora genera un código de
  profesional, un tercer titular lo canjea desde "Mi cuenta" (02) y aparece en Miembros; le reasigna
  dos alumnos; da de baja a un profesional y sus alumnos salen "Sin responsable"; libera a la
  alumna compartida y `jose@test.com` la ve con `released_by` en la app y en `/panel`; el registro
  de accesos lo cuenta todo con nombres.
- Un profesional del gabinete abre `/panel/organizacion/{uuid}` y ve "Solo para coordinación"; la
  coordinadora de otro gabinete recibe 404.
- Liberación de fin de curso con 25 alumnos en un centro de prueba corre por lotes y deja el
  resumen; `drush shine-level:generate` de una alumna liberada con familia da el 402
  `released_by_organization` esperado.
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_org`
  y `.../shine_panel` en verde; `config:status` limpio; `/security-review` sin hallazgos abiertos.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/dashboards.md`, `docs/api-design.md`, `docs/monetization.md` y `CLAUDE.md`.
