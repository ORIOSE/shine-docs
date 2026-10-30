# Paneles web por tipo de titular — Shine

Especificación funcional de los paneles de gestión **fuera de la app**, servidos por Drupal.
Complementa `monetization.md` (modelo de cuentas, entitlements, organizaciones) y
`statistics-design.md` (estadísticas dentro de la app). El objetivo es que un diseñador y un
desarrollador puedan construirlos en Drupal sin volver a discutir el alcance.

---

## 1. Principios

- **La app es para trabajar; la web es para gestionar.** Las sesiones y las actividades solo se
  hacen en la app. El panel web sirve para administrar cuentas, alumnos, licencias, miembros y
  para consultar e imprimir progreso. No se duplica el reproductor de actividades en la web.
- **Un panel, varias vistas.** Una sola ruta raíz (`/panel`) que muestra secciones distintas
  según los roles del titular. Un titular puede ser a la vez familia y miembro de un centro: ve
  ambas secciones.
- **Mismos datos que la app.** El panel lee las mismas entidades (`user` alumno, `node.session`,
  `activitysummary`, `userarealevel`, `userarealevel_log`, `entitlement`, `organization`,
  `learner_access`). No hay tablas paralelas.
- **Tema propio, no el admin de Drupal.** Los titulares nunca ven Gin ni `/admin`. Tema front
  propio (o subtema de Olivero) con el design system de la app (Nunito, opción OpenDyslexic,
  contraste alto). Solo el personal de Shine usa `/admin`.
- **Móvil primero.** Las familias abrirán el panel desde el móvil; los centros desde ordenador.
  Todo debe funcionar en ambos.
- **Mínimo de datos personales.** Alumnos sin email ni edad; nombres o apodos. Lo que no está no
  hay que proteger.

---

## 2. Tipos de titular y roles

> **Estado (02, 2026-10-30)**: los roles del panel los calcula `PanelContext` (`shine_panel`):
> `family` siempre; `professional` con membresía `professional` en un gabinete o plan personal
> `professional`; `coordinator` por cada organización coordinada; `teacher` con membresía `teacher`
> en un centro. Un titular con varios ve la unión de secciones y la portada del rol principal
> (coordinación > profesional > docente > familia) con enlaces a las demás (`?vista=`). Las
> secciones siguen el prototipo: Inicio, Mi centro / Mi gabinete (una por organización coordinada),
> Alumnos (o "Mis alumnos" para un docente sin otro rol), Informes (profesional y coordinación),
> Plan (o "Licencia"), Ayuda. El acceso se resuelve con `LearnerAccessPolicy::canSee()`,
> `OrganizationManager` y `EntitlementAccess`; un alumno ajeno es 404 y una organización que no
> se coordina, 403.

| Tipo de titular | Rol Drupal | Cómo lo obtiene | Secciones del panel |
|---|---|---|---|
| Familia | `authenticated` (holder) | Registro en la app o en la web | Mi cuenta, Mis alumnos, Mi plan |
| Profesional independiente | `authenticated` + `organization_membership` rol `professional` en una organización `practice` de un solo miembro | Contrata Profesional en la web | Mi cuenta, Mis alumnos, Mi plan (licencia profesional) |
| Coordinador de gabinete | `organization_membership` rol `coordinator` en `practice` | Contrata Profesional con varios asientos | + Mi gabinete (miembros, licencia, alumnos del gabinete) |
| Coordinador de centro | `organization_membership` rol `coordinator` en `school` | Alta por el personal de Shine tras contrato | + Mi centro (docentes, licencia, alumnos, grupos, informes) |
| Docente / PT | `organization_membership` rol `teacher` en `school` | Código de invitación del coordinador | Mi cuenta, Mis alumnos (los suyos del centro), Mis grupos |
| Personal de Shine | `administrator`, `content_editor`, nuevo `support` | Interno | `/admin` (Gin) con las vistas de soporte |

Los roles de organización no son roles de Drupal: son `field_role` de la membresía. El acceso a
cada sección se resuelve con un `AccessCheck` propio que consulta `learner_access`,
`organization_membership` y `entitlement`, nunca con permisos globales.

---

## 3. Funcionalidades transversales (todos los titulares)

### 3.1 Acceso

> **Estado (02)**: login y recuperación con el formulario de core reestilizado (01); el enlace de
> un solo uso desde la app y el cierre de sesión en todos los dispositivos llegan en 07.
- Login con email y contraseña (mismas credenciales que la app). Recuperación de contraseña.
- Login desde la app sin volver a escribir credenciales: enlace "Abrir panel web" que lleva un
  token de un solo uso (`/panel/auth/{token}`), caduca en 5 minutos.
- Cierre de sesión en todos los dispositivos (revoca tokens OAuth del titular).

### 3.2 Mi cuenta

> **Estado (02)**: nombre, email (pide la contraseña actual), contraseña e idioma del panel
> (`preferred_langcode` del titular; al guardar redirige al prefijo) en un formulario propio;
> fuente de lectura sincronizada con `field_dyslexic_font` **del titular** (en la app es del alumno:
> dos ajustes distintos, uno por quien lee); consentimientos: solo existe el de adulto responsable
> con su fecha, más enlaces a los textos legales (marcadores); "Tengo un código de centro" canjea con
> `OrganizationInviteManager::redeem` y deja rastro en `audit_log`; exportar datos queda como
> "escríbenos desde Ayuda"; borrar cuenta (`/panel/cuenta/borrar`) explica el caso real (alumnos
> que se anonimizan frente a accesos que se retiran), pide la contraseña y es inmediato, sin 30
> días; si el titular es el único coordinador de una organización con miembros o licencia, está
> bloqueado (`hook_shine_account_delete_blockers`).
- Nombre para mostrar, email, contraseña, idioma del panel (es, ca; en más adelante).
- Preferencia de fuente (Nunito / OpenDyslexic), sincronizada con `field_dyslexic_font`.
- Consentimientos aceptados, con fecha (adulto responsable, términos, privacidad).
- Exportar mis datos (RGPD): ZIP con JSON por alumno (sesiones, summaries, niveles) y CSV
  legible. Generado en cola, enviado por email.
- Borrar mi cuenta: explica las consecuencias según el caso (alumnos propios se anonimizan;
  alumnos de centro solo pierden mi acceso; suscripción de store hay que cancelarla en la
  store). Confirmación por email.

### 3.3 Notificaciones

> **Estado (02)**: `/panel/avisos` vacío ("Todo al día") y campana sin contador hasta 08.
- Preferencias por email: resumen semanal de progreso, aviso de prueba a punto de agotarse,
  aviso de liberación por el centro, aviso de pago fallido (Stripe), novedades.
- Centro de avisos dentro del panel (lista con leídos/no leídos). Mismos avisos que la app.

### 3.4 Ayuda

> **Estado (02)**: acordeón "Cómo funciona" con textos provisionales; contacto y textos
> definitivos en 11.
- Guía de la dinámica (bloque inicial, sesiones regulares, ajustes, áreas y niveles), en lenguaje
  de familia, con la misma explicación que la app.
- Contacto con soporte (formulario que adjunta automáticamente titular y, opcionalmente, alumno).

---

## 4. Panel de Familia

### 4.1 Inicio

> **Estado (02)**: implementado. Cobertura como badge con texto (cortesía o plan del adulto que
> cubre, centro, prueba con sesiones restantes, en pausa, sin acceso); última sesión completada
> (hoy, ayer, hace N días, con el tipo); siguiente paso: la sesión pendiente si la hay y, si no, lo
> que dice `SessionGenerator::plan()` (no escribe nada); "Abrir en la app" (`shine://learners/{uuid}`)
> solo con user-agent móvil. Avisos: prueba con 3 sesiones o menos y alumno liberado por un centro.
> La tarjeta de racha llega con 04.
- Tarjeta por alumno: nombre, avatar, cobertura (`covered_by`: plan Familia, centro X, prueba
  con N sesiones restantes, sin acceso), última sesión (fecha, tipo), siguiente paso sugerido
  ("tienes una sesión pendiente", "toca sesión de ajuste").
- Aviso destacado si la prueba está a punto de agotarse o si un centro ha liberado a un alumno.
- Acceso rápido "Abrir en la app" (deep link `shine://learner/{uuid}`).

### 4.2 Mis alumnos
- Lista y alta de alumnos (nombre, avatar). Mismo cupo que la app (1 gratis, 3 Familia).
- "Tengo un código del centro" para vincular un alumno compartido.
- Por alumno: editar, archivar, restaurar; si es de centro, "retirar mi acceso" en vez de archivar.
- Ficha de alumno (§7).

### 4.3 Mi plan
- Estado: plan, origen (App Store / Google Play), renovación, precio pagado, fecha de fin.
- "Gestionar suscripción": enlace a la gestión de la store correspondiente (no se puede cancelar
  ni cambiar desde la web: la suscripción pertenece a la store).
- Si no hay plan: resumen de la prueba (sesiones usadas por alumno) y explicación de cómo
  contratar (desde la app). En la web **no hay botón de compra** del plan Familia (coherencia con
  las reglas de Apple; la compra es por IAP). Excepción: si en el futuro se ofrece Familia por
  web con Stripe, aquí iría el checkout, y la app seguiría ofreciendo IAP.
- Historial de cobros (lo que RevenueCat reporta; sin importes exactos si la store no los da).

### 4.4 Qué no tiene
- Reproductor de actividades. Gestión de miembros. Facturas (las emite la store).

---

## 5. Panel de Profesional (independiente y miembros de gabinete)

Todo lo de Familia (§4), más:

### 5.1 Inicio

> **Estado (02)**: implementado con `LearnerActivity` (sesiones por alumno en dos consultas):
> alumnos activos, sesiones esta semana, sin actividad en 14 días (o nunca), cambios de nivel en 7
> días, en pausa por cupo; plazas del gabinete o, sin gabinete, del plan personal; "Necesitan
> atención" con enlace a la ficha.
- Resumen de la cartera: alumnos activos, sesiones esta semana, alumnos sin actividad en 14 días,
  alumnos con cambio de nivel reciente, alumnos en pausa por cupo.
- Plazas usadas / disponibles de la licencia.

### 5.2 Mis alumnos (vista de cartera)
- Tabla ordenable y filtrable: nombre, última sesión, sesiones totales, sesiones últimas 4
  semanas, áreas con nivel más bajo y más alto, tendencia (sube / estable / baja), estado
  (activo, pausa, archivado), familia vinculada (sí / no / invitación pendiente).
- Acciones masivas: archivar, exportar informe de varios alumnos.
- Alta de alumno (ocupa plaza del gabinete).
- Invitar a la familia (código, QR, email) y ver si lo ha usado.
- Ficha de alumno (§7) con el bloque de notas profesionales (§7.5).

### 5.3 Informes
- Informe de alumno en PDF para la familia o para el centro escolar: periodo, sesiones, niveles
  por área al inicio y al final, gráfica de evolución por área, actividades con más dificultad,
  observaciones del profesional. Plantilla con logotipo del gabinete.
- Informe de cartera (CSV/PDF): resumen de todos los alumnos del periodo.

### 5.4 Mi plan (licencia profesional)
- Estado de la suscripción Stripe: plan, asientos, plazas, próxima renovación, importe.
- Portal de cliente de Stripe (cambiar tarjeta, ampliar asientos, descargar facturas, cancelar).
- Datos fiscales de facturación (nombre, NIF, dirección), editables.

---

## 6. Panel de organización (coordinador de gabinete y de centro)

Solo para `coordinator`. Se accede como pestaña "Mi gabinete" o "Mi centro".

### 6.1 Inicio de la organización

> **Estado (02)**: implementado, un bloque por organización coordinada: licencia (plazas, plan,
> vigencia, pago como badge: al día, pago pendiente, caducada, sin licencia), avisos de plazas
> escasas (10 % o menos libres) y de códigos de invitación vigentes, cifras y "Sesiones por semana"
> (8 semanas, Chart.js con su tabla). "Gestionar el centro" lleva a 06.
- Licencia: plan, plazas usadas / contratadas, grupos (centro), fin de vigencia, estado del pago.
- Actividad: sesiones por semana en la organización, alumnos activos, docentes o profesionales
  activos, alumnos sin actividad en 14 días.
- Avisos: plazas agotadas, licencia a punto de caducar, invitaciones pendientes.

### 6.2 Miembros
- Lista de miembros con rol, fecha de alta, alumnos a su cargo, última actividad.
- Generar códigos de invitación por rol (`organization_invite`): usos máximos, caducidad; lista de
  códigos vigentes y revocación.
- Cambiar rol, dar de baja (los alumnos a su cargo pasan a "sin responsable" y se reasignan).
- Dar acceso `staff` a un alumno a otro miembro (p. ej. PT y tutora de aula).

### 6.3 Alumnos de la organización
- Todos los alumnos en plaza: responsable, grupo (centro), familia vinculada, última sesión,
  sesiones en el centro / en casa, niveles por área, estado.
- Reasignar responsable. Liberar de la licencia (con aviso de lo que implica). Liberación masiva
  a final de curso con confirmación explícita.
- Alta masiva por CSV (solo nombre o apodo y responsable).

### 6.4 Grupos (solo centro, cuando exista el modo aula)
- Crear grupos, asignar docente y alumnos, ver sesiones de grupo realizadas y niveles usados.

### 6.5 Informes de organización
- Informe de centro o gabinete por periodo: alumnos, sesiones, distribución de niveles por área,
  evolución media, uso por docente. PDF y CSV.
- Informe individual de cualquier alumno de la organización (§7).

### 6.6 Licencia y facturación
- Gabinete: portal de Stripe como en §5.4.
- Centro: datos del contrato (vigencia, plazas, grupos), facturas emitidas, contacto de
  facturación, contrato de encargado de tratamiento descargable, solicitud de ampliación
  (formulario que llega a Shine; no self-service).

### 6.7 Datos y privacidad de la organización
- Exportar todos los datos de la organización (RGPD, para el centro como responsable).
- Registro de accesos: quién invitó, liberó, reasignó o exportó, con fecha (auditoría mínima que
  un centro va a pedir).

---

## 7. Ficha de alumno (común a todos los titulares con acceso)

### 7.1 Cabecera
- Nombre, avatar, cobertura, responsable (`owner`), otros adultos con acceso y su rol, centro.
- Acciones según rol: editar, archivar, invitar a la familia, liberar, retirar mi acceso.

### 7.2 Niveles por área
- Nivel actual en cada área, nivel de sondeo (`probe_level`) si lo hay, fecha de última
  evaluación, evidencia acumulada. Historial de cambios (`userarealevel_log`) con motivo
  (`initial`, `periodic`, `trigger_easy`, `trigger_hard`, `evidence`).
- Gráfica de evolución de nivel por área en el tiempo.

### 7.3 Sesiones
- Lista: fecha, tipo (regular / evaluación y motivo), dónde se hizo (centro / casa, por
  `field_operated_by`), actividades, valoración dada, duración total.
- Detalle de sesión: cada actividad con su summary (tiempo, aciertos, ritmo según familia de
  métrica), valoración por actividad en las de evaluación.

### 7.4 Rendimiento
- Mismas gráficas que la app (`statistics-design.md`): evolución por actividad, comparativa
  entre sesiones, tiempos por familia de métrica. Reutilizar la lógica de `src/lib/stats/`
  portada a PHP o, mejor, exponer un endpoint de estadísticas en Drupal que sirva a ambos.
- Actividades con más dificultad en el periodo (más "me ha costado" o peor tiempo relativo).

### 7.5 Notas (solo profesionales y docentes)
- Notas de seguimiento con fecha y autor, visibles para los miembros de la organización con
  acceso al alumno. **No visibles para la familia** salvo que el autor las marque como
  compartidas. Las notas son texto libre: advertir en la interfaz de no escribir diagnósticos ni
  datos de salud (base jurídica distinta); si el centro los necesita, van en su expediente, no
  aquí.

### 7.6 Exportar
- Informe PDF del alumno por periodo (plantilla según quién lo genera: familia, profesional,
  centro). CSV de sesiones y summaries.

---

## 8. Matriz de permisos

| Acción | Familia `owner` | Familia `guardian` | Profesional / docente `owner` | `staff` | Coordinador | Shine `support` |
|---|---|---|---|---|---|---|
| Ver ficha y progreso | sí | sí | sí | sí | sí (toda la org.) | sí |
| Editar nombre/avatar | sí | no | sí | no | sí | sí |
| Archivar / restaurar | sí | no | sí | no | sí | sí |
| Invitar a la familia | no | no | sí | no | sí | sí |
| Liberar del centro | no | no | sí | no | sí | sí |
| Retirar mi acceso | sí (si no es `owner` único) | sí | sí | sí | n/a | n/a |
| Notas profesionales | no | no | sí | sí | sí | lectura |
| Ver notas compartidas | sí | sí | sí | sí | sí | sí |
| Exportar informe | sí | sí | sí | sí | sí | sí |
| Gestionar miembros / códigos | no | no | no | no | sí | sí |
| Reasignar responsable | no | no | no | no | sí | sí |
| Licencia y facturación | su plan | no | su plan | no | la de la org. | todas |
| Exportar datos RGPD | propios | propios | propios | no | de la org. | cualquiera |
| Borrar cuenta | sí | sí | sí | sí | sí (no si hay miembros) | n/a |

---

## 9. Panel interno de Shine (`/admin`, Gin)

Vistas de soporte y operación, además de lo que ya existe (`shine_levels`, `shine_level_log`,
`shine_sessions`, `gestion_activitysummary`):

- **Titulares**: buscar por email o nombre; ver alumnos, entitlements, organizaciones,
  dispositivos (último login por consumer), eventos de webhook recibidos.
- **Entitlements**: lista con filtros por plan, origen, estado, caducidad; crear cortesías;
  forzar resincronización con RevenueCat o Stripe; ver `field_raw_event`.
- **Organizaciones**: alta de centros (tras contrato), licencias, plazas, miembros, alumnos,
  contrato de encargado de tratamiento adjunto, contacto.
- **Webhooks**: log de eventos RevenueCat y Stripe con estado (aplicado, ignorado, error) y
  reintento manual.
- **Catálogo de planes**: edición de `shine_entitlement.plan` (ids externos, cupos).
- **Embudo**: registros, alumnos creados, bloques iniciales completados, muros vistos, pruebas
  agotadas, conversiones, cancelaciones por semana (de los eventos de `shine_analytics`).
- **Contenido**: lo que ya hay (actividades, generador, inventario, duplicados).
- **Soporte**: "ver como" un titular (impersonación con registro de auditoría), reenviar email de
  verificación, reactivar alumno archivado, trasladar alumno entre titulares (casos límite:
  familia que cambia de email, separaciones).

Rol nuevo `support` con permisos de lectura y las acciones de soporte, sin administrar
configuración ni contenido.

---

## 10. Implementación en Drupal

### 10.1 Módulo `shine_panel`
- Rutas bajo `/panel/*` con `_custom_access` que resuelve por `learner_access`,
  `organization_membership` y `entitlement`. Nada bajo `/admin` para titulares.
- Controladores finos que delegan en servicios ya existentes (`shine_level`,
  `shine_entitlement.access`) y en un nuevo `shine_stats` (servidor) que calcule lo que hoy
  calcula `src/lib/stats/` en la app, para que app y panel muestren los mismos números.
- Formularios Drupal estándar para alta y edición (alumno, invitación, miembro, datos fiscales).
- Views para las listas (alumnos, sesiones, miembros, summaries) con plugins de acceso propios
  (`views_access` que filtre por `learner_access`), exportadas a `config/sync`.
- Tema front propio (`shine_theme`): tokens del design system de la app (`docs/design.md`),
  componentes de tarjeta, tabla, gráfica (SVG en servidor o Chart.js embebido; una sola
  librería para todo el panel), formularios accesibles.
- Email: plantillas de aviso (Symfony Mailer) con el mismo diseño.
- Cola (`queue`) para exportaciones, informes PDF e impersonación auditada.
- PDF: `dompdf` o `wkhtmltopdf` vía módulo `entity_print`; una sola plantilla de informe con
  variantes por emisor.

### 10.2 Entidades y campos nuevos que requiere el panel
- `learner_note` (alumno, autor, organización, texto, compartida con la familia: boolean, fecha).
- `audit_log` ligero (actor, acción, objeto, organización, fecha) para §6.7 y §9.
- `notification` (titular, tipo, texto, leída, fecha) o reutilizar `message` contrib.
- Campo `field_logo` en `organization` para los informes.
- Datos fiscales en `organization` (ya previstos) y en el titular profesional independiente.

### 10.3 Prioridad
- **v1 (con la publicación en stores)**: §3.1 a 3.3, §4 completo, §7.1 a 7.4 y 7.6, §9
  Titulares, Entitlements y Webhooks. Sin esto no se puede dar soporte a familias.
- **v2 (canal profesional)**: §5 completo, §6 para gabinetes, §7.5, §9 Organizaciones y
  Catálogo.
- **v3 (centros)**: §6 para centros, §6.4 grupos, informes de organización, auditoría, alta
  masiva por CSV, contrato descargable.

---

## 11. Decisiones pendientes

- Si Familia se venderá también por web con Stripe (afecta a §4.3). Recomendación: no en v1.
- Si las notas profesionales se pueden compartir con la familia o se mantienen siempre internas.
- Librería de gráficas del panel y si se porta `src/lib/stats/` a PHP o se expone un endpoint.
- Idiomas del panel en v1 (es y ca; en).
- Impersonación de soporte: con o sin aviso al titular.
