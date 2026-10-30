# 02. Módulo `shine_panel`: acceso, concha con secciones por rol, inicio y "Mi cuenta"; módulo `shine_audit`

- **Agente recomendado: Fable 5.1**, con la skill `frontend-design` para las pantallas de inicio y
  cuenta. Es el subplan que decide **qué titular ve qué** desde una sesión de navegador (alumnos,
  organizaciones, secciones) y el que toca el borrado de cuenta: cualquier fallo es un acceso a datos
  de otra familia. Cerrar con `/security-review`.
- Fase: 21. Alcance: solo Drupal (`shine/`): módulos `shine_panel` (rutas reales) y `shine_audit`
  (nuevo), un hook nuevo en `shine_account` (bloqueos del borrado), config en `config/sync`.
- Dependencias: 01 (tema, componentes, esqueleto del módulo con `Avatars` y el muestrario).

## Prompt

Lee `plans/backoffice/README.md` (decisiones 2 a 5 y 7, "Riesgos conocidos"), `docs/dashboards.md`
§2, §3.1, §3.2, §4.1, §5.1, §6.1, §8 y §10.1, `docs/lovable/INDEX.md` secciones 3.3 (roles del
prototipo y su correspondencia real, sección 8), 4 (`panel.tsx`, `panel.index.tsx`, `panel.cuenta.tsx`)
y 6 (layout), y los ficheros `docs/lovable/panel/src/routes/panel.tsx`, `panel.index.tsx`,
`panel.cuenta.tsx` y `docs/lovable/panel/src/components/shine/homes.tsx` (textos, tarjetas y
avisos de cada portada). En Drupal, lee `shine_account` (`LearnerAccessPolicy`, `LearnerManager`,
`AccountDeleter`, `HolderAccessCheck`, `MeController` y `hook_shine_me_alter`), `shine_entitlement`
(`EntitlementAccess`: `holderStatus`, `coveredBy`, `canGenerateRegular`), `shine_org`
(`OrganizationManager::membershipsOf`, `toArray`, `OrganizationCoverage`, `OrganizationLearners`,
`OrganizationInviteManager::redeem`), `shine_level` (`LevelRepository`, `SessionGenerator`:
`pendingSession()` y el `plan()` de solo lectura que usa `shine-level:generate --dry-run`) y
`docs/api-design.md` ("Cuentas y alumnos", "Organizaciones"). Trabaja en `shine/`.

Regla de oro: el panel **no reimplementa** ninguna regla de acceso. Pregunta a
`LearnerAccessPolicy`, `OrganizationManager` y `EntitlementAccess`, y lee las entidades del alumno
con `accessCheck(FALSE)` solo después de preguntar (gotcha 17).

Tareas:

1. **`shine_audit`** (`package: shine`): entidad `audit_log` (campos de código: `actor` (user),
   `action` (string, p. ej. `learner.invite`, `learner.release`, `learner.reassign`,
   `report.export`, `support.masquerade.start`), `target_type` y `target_id` (opcionales),
   `organization` (ref, opcional), `data` (map, pequeño, sin datos personales más allá de uuids y
   nombres para mostrar), `created`; sin bundles; índice por organización y por actor; acceso de
   lectura solo con `administer shine accounts` o con un `hook_jsonapi_*_filter_access` que deniega
   todo en JSON:API, gotcha 16) y servicio `shine_audit.logger` (`log(string $action, array $data =
   [], ?EntityInterface $target = NULL, ?OrganizationInterface $organization = NULL)`), que toma el
   actor de `current_user` (y, si la sesión está impersonada, 10 añadirá el actor real). Test kernel
   mínimo. Es la base del "Registro de accesos" (06) y de la auditoría de soporte (10).
2. **Contexto del panel** (`shine_panel.context`, `PanelContext::for(UserInterface $holder)`):
   calcula una sola vez por petición (y cachea por usuario con etiquetas) lo que la concha y las
   portadas necesitan: `sections` (lista ordenada de secciones visibles con ruta, etiqueta e icono),
   `roles` (`family` siempre; `professional` si tiene membresía `professional` en una `practice` o
   un `holder_status` con plan `professional`; `coordinator` por cada organización que coordina;
   `teacher` si tiene membresía `teacher` en una `school`), `primaryHome` (`coordinator` >
   `professional` > `teacher` > `family`), `organizations[]` (forma `toArray` de `shine_org`),
   `learners[]` (forma de `LearnerManager::toArray` con `covered_by`, `paused`, `completed_regular`,
   `free_regular_sessions`, `released_by`, por el mismo `hook_shine_learner_alter` que usa
   `/shine/me`: reutiliza `MeController` o extrae su composición a un servicio compartido en
   `shine_account`, sin duplicarla), `holderStatus`, `unreadNotices` (0 hasta 08: déjalo como
   un servicio `shine_panel.notice_counter` con implementación nula que 08 sustituye). Secciones por
   rol como en el prototipo (`docs/lovable/INDEX.md`, sección 6): familia: Inicio, Alumnos, Plan,
   Ayuda; profesional: Inicio, Alumnos, Informes, Licencia, Ayuda; coordinación: Inicio, Mi
   gabinete / Mi centro (una por organización coordinada), Alumnos, Informes, Ayuda; docente: Mis
   alumnos, Ayuda. Un titular con varios roles ve la unión, sin repetir. "Mis grupos" no existe (fuera
   de alcance).
3. **Acceso** (`shine_panel.access`, `PanelAccess`, usado como `_custom_access` en todas las rutas
   del panel): `holder()` (lo mismo que `_shine_holder`: titular activo, no alumno, no archivado),
   `learner(uuid)` (404 si no existe, es alumno de otro o no hay acceso: `LearnerAccessPolicy::canSee`
   o `OrganizationLearners` para la coordinación; nunca 403), `organization(uuid)` (miembro),
   `coordinator(uuid)`, `section(name)`. Una ruta del panel que no supere `holder()` con sesión
   anónima redirige a `/user/login?destination=...`; un alumno o un usuario bloqueado recibe la
   página 403 del tema. Todas las rutas con `no_cache: TRUE` o `#cache` con `contexts: ['user']` y las
   etiquetas de lo que muestran. `system.site.page.front` pasa a `/panel`; la vista `frontpage` se
   desactiva; `/user/{uid}` (perfil de core) redirige a `/panel/cuenta` para titulares (un
   `RouteSubscriber` o `hook_entity_type_alter` del enlace canónico; los administradores lo siguen
   viendo en `/admin`).
4. **Concha** (`#theme shine_panel_page` del esqueleto de 01, ahora con datos reales):
   `hook_preprocess_page` o un `PageWrapper` que inyecta en `page--panel.html.twig` las secciones,
   la activa, el nombre del titular (`field_display_name`), el contador de avisos y el menú de
   usuario ("Mi cuenta", "Plan y pagos" solo si la sección Plan existe para él, "Cerrar sesión" a
   `/user/logout` con token CSRF). Título de ventana "{sección} · Shine". Banner de impersonación
   previsto (variable vacía que 10 rellena).
5. **Inicio (`/panel`)**: elige la portada por `primaryHome` con enlaces a las otras si hay más de
   un rol. Textos y estructura de `homes.tsx` con datos reales:
   - **Familia**: saludo con el nombre, una tarjeta por alumno (avatar emoji, nombre, badge de
     cobertura: "Plan Familia" / "Centro {nombre}" / "Prueba · N sesiones restantes" / "Sin
     acceso" / "En pausa", siempre con texto; "Última sesión" (fecha y tipo, de la última sesión
     publicada del alumno, o "Todavía ninguna"); "Siguiente paso" (pendiente sin completar → "Tienes
     una sesión empezada el {fecha}"; si no, lo que diga el `plan()` de solo lectura del generador:
     "Toca sesión de ajuste" / "Toca sesión regular" / "Bloque inicial en curso"; si el generador no
     se puede consultar sin efectos, omite esta línea y anótalo); botones "Ver progreso"
     (`/panel/alumnos/{uuid}`) y "Abrir en la app" (`shine://learners/{uuid}`, solo en móvil por
     `user-agent`; en escritorio se oculta). Avisos destacados (`notice` ámbar): prueba a punto de
     agotarse (`free_regular_sessions - completed_regular <= 3` y `covered_by = trial`) con enlace a
     Plan; alumno liberado por un centro (`released_by`) con el texto de `docs/monetization.md` §5.6.
     La `MotivationCard` de racha llega con 04 (usa `shine_stats` si está instalado; si no, no se
     muestra).
   - **Profesional**: cabecera "Así va tu cartera esta semana" con botón "Ver alumnos"; cinco
     `stat-tile` calculadas con el servicio `shine_panel.learner_activity` (tarea 6): alumnos
     activos, sesiones esta semana, sin actividad en 14 días, cambios de nivel recientes (7 días),
     en pausa por cupo; tarjeta "Plazas de tu licencia" (`used_seats` de `max_learners` de su
     organización, o cupo personal si no tiene); "Necesitan atención": alumnos con más de 14 días
     sin sesión, enlazados a su ficha.
   - **Coordinación** (por organización): nombre, licencia con barra "x de y plazas", vigencia y
     estado del pago (badge con texto: "Al día", "Pago pendiente" si `billing_retry`, "Caducada"),
     avisos "Quedan pocas plazas" (menos del 10 % libres) e "Invitaciones pendientes" (códigos de
     centro vigentes con usos libres), cuatro `stat-tile` (alumnos activos, miembros activos,
     sesiones esta semana, sin actividad en 14 días) y la gráfica "Sesiones por semana" (8 semanas,
     barras con la librería `shine_theme/charts`, tabla accesible debajo). Botón "Gestionar
     gabinete/centro" a `/panel/organizacion/{uuid}` (06).
   - **Docente**: "Tus alumnos de {centro}": tarjetas de los alumnos a los que tiene acceso en el
     centro (owner o staff) con última sesión y badge de estado, y el aviso "¿Algo no cuadra?" con
     enlace a Ayuda.
6. **Servicio `shine_panel.learner_activity`** (`LearnerActivity`): para una lista de alumnos ya
   autorizados, en pocas consultas (`accessCheck(FALSE)`, agrupadas, nunca una por alumno): última
   sesión (fecha, tipo, operador), sesiones completadas totales y en las últimas 4 semanas, sesiones
   por semana (8 semanas), días sin actividad, cambios de nivel recientes (`userarealevel_log`). Lo
   reutilizan 03 (tabla de cartera) y 06. Test kernel con dos titulares: el servicio solo recibe
   alumnos autorizados y el controlador no lo llama con un alumno ajeno.
7. **Mi cuenta (`/panel/cuenta`)**, con los bloques de `panel.cuenta.tsx` adaptados a lo que existe:
   - "Datos personales": nombre para mostrar, email (cambiarlo pide la contraseña actual, como el
     formulario de core), nueva contraseña (con la actual), idioma del panel (`es` / `ca` →
     `preferred_langcode`; al guardar, redirige al prefijo correspondiente). Formulario propio sobre
     la entidad `user` (no el `user_form` de core, que expone demasiado), validado con las mismas
     restricciones de core.
   - "Fuente de lectura": Nunito / OpenDyslexic con el texto de muestra del prototipo, sincronizada
     con `field_dyslexic_font` (la app la lee del alumno; aquí es del titular: documenta la
     diferencia en `docs/dashboards.md` §3.2). Se aplica al momento (`data-font` en `<html>`, 01).
   - "Consentimientos": el consentimiento de adulto responsable con su fecha
     (`field_adult_consent_at`; "anterior a la fecha de registro" si está vacío) y enlaces a los
     textos de términos y privacidad (rutas `/legal/terminos` y `/legal/privacidad` como nodos
     `page` o rutas con marcador "pendiente de redacción"; los textos no son de este plan).
   - "Organizaciones": las membresías con rol y "Tengo un código de centro" (formulario que canjea
     con `OrganizationInviteManager::redeem`, mismos errores que `POST /shine/organizations/join`).
   - "Privacidad y seguridad": "Exportar mis datos" queda como texto "Escríbenos desde Ayuda y te
     lo enviamos" (la exportación automática es pendiente, README); "Cerrar sesión en todos los
     dispositivos" (botón que 07 implementa: aquí deshabilitado con nota); "Borrar mi cuenta"
     (destructivo): diálogo con el texto según el caso real, calculado en servidor: alumnos de los
     que es único adulto → se anonimizan con la cuenta; alumnos compartidos o en plaza → solo
     pierde su acceso; si es único coordinador de una organización con otros miembros activos o
     licencia vigente → **bloqueado** ("Antes, asigna la coordinación a otra persona"); pide la
     contraseña y llama a `AccountDeleter`. Sin "30 días para arrepentirte": el borrado es
     inmediato, como en la app (`docs/api-design.md`). Para el bloqueo añade a `shine_account` el
     hook `hook_shine_account_delete_blockers(UserInterface $holder): array` (documentado en
     `shine_account.api.php`), que `AccountDeleter::blockers()` recoge y que `shine_org` implementa;
     `POST /shine/account/delete` también lo respeta (`409 {"error":"blocked","reasons":[...]}`) y
     la app ya muestra errores genéricos en ese caso (anótalo para un subplan de la app).
8. **Ayuda y avisos como marcadores**: `/panel/ayuda` con el acordeón de "Cómo funciona" del
   prototipo (textos provisionales; 11 los cierra) y sin formulario; `/panel/avisos` con el estado
   vacío "Todo al día" (08 lo rellena).
9. **Tests kernel** (`shine_panel/tests/src/Kernel/`, por HTTP con `http_kernel` y sesión de
   usuario simulada con `account_switcher`): titular A ve sus alumnos en `/panel`; alumno de B en
   `/panel/alumnos/{uuid}` → 404; alumno en plaza de un centro visto por su coordinador → 200;
   docente sin `staff` → 404; usuario `learner` → 403; anónimo → 302 al login; secciones calculadas
   para los cinco perfiles; bloqueo del borrado para el coordinador único; `audit_log` escrito al
   canjear un código de centro.
10. **Documentación**: `docs/dashboards.md` §2 y §3 (implementado, diferencias), `docs/api-design.md`
    (bloqueos del borrado), `CLAUDE.md` (módulos `shine_panel` y `shine_audit`, rutas del panel,
    portada, "Mi cuenta"), `docs/progress.md`.

Verificación:
- Con el navegador, a 390 px y 1280 px, con `jose@test.com` (familia con cortesía: Marta y Pau) y
  con un segundo titular normal: cada uno ve solo sus alumnos; la URL de un alumno ajeno da 404 con
  el layout del tema; un coordinador de prueba (créalo con drush y `shine_org`) ve la portada de
  organización con sus cifras y no ve a los alumnos de la otra familia.
- "Mi cuenta": cambiar el nombre y la fuente se refleja al momento en el panel y, tras un
  `refreshMe()`, en la app; cambiar el idioma a `ca` lleva a `/ca/panel` (los textos siguen en
  castellano hasta 11); canjear un código de centro crea la membresía y deja su fila en `audit_log`.
- Borrar cuenta como coordinador único de una organización con miembros → bloqueado con el texto;
  como familia con un alumno compartido → el alumno sigue con el otro adulto (comprueba con
  `/shine/me` del otro titular).
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_panel`
  y `.../shine_audit` y `.../shine_account` en verde; `config:status` limpio; watchdog sin
  errores; `/security-review` sin hallazgos abiertos.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/dashboards.md`, `docs/api-design.md` y `CLAUDE.md`.
