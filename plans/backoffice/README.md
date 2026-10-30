# Plan de planes: panel web de titulares (FASE 21, "backoffice")

Implementa `docs/dashboards.md` (especificación funcional de los paneles web por tipo de titular,
2026-10-23) con el prototipo visual de Lovable descargado en `docs/lovable/` (índice en
`docs/lovable/INDEX.md`). Cada fichero de esta carpeta es un prompt autocontenido para una sesión
de Claude Code, con el mismo formato que `plans/entitlement/`. La especificación es la fuente de
verdad; si un subplan necesita apartarse de ella, lo anota en `docs/dashboards.md` y lo dice en
`docs/progress.md` (sección "FASE 21").

Lo que se construye, en una frase: una web servida por Drupal, con tema propio hecho desde cero,
donde el titular adulto (familia, profesional, coordinación de gabinete o centro, docente) entra
con las credenciales de la app y gestiona cuentas, alumnos, licencias y miembros, y consulta e
imprime el progreso; las sesiones y las actividades se siguen haciendo solo en la app.

## Punto de partida (2026-10-30)

- **Temas**: los tres temas heredados (`stablechild`, `shine` de Bootstrap 5 y `b5theme`) se
  desinstalaron y borraron el 2026-10-30, junto con sus bloques en `config/sync` y la dependencia
  `drupal/bootstrap5`. Tema por defecto provisional: **Olivero** (core). Admin: Gin. El módulo
  `preprocess` (plantillas de nodo del tema borrado) está muerto y se quita en 01.
- **Páginas web que ya existen**: `/pro` y `/pro/gracias` (contratación con Stripe, `shine_org`,
  FASE 17 subplan 11) y las de usuario de core (`/user/login`, `/user/password`, `/user/register`).
  No hay panel ni login propio.
- **Servicios de servidor que el panel reutiliza sin tocar**: `shine_account.learner_manager`,
  `shine_account.learner_access_policy` (`canSee`, `canEdit`, `canArchive`, `canInvite`,
  `canRelease`, `canWithdraw`, `effectiveRole`), `shine_account.learner_invite_manager`,
  `shine_account.account_deleter`, `shine_entitlement.access` (`holderStatus`, `coveredBy`,
  `canGenerateRegular`, `maxLearners`), `shine_org.organizations`, `shine_org.invites`,
  `shine_org.coverage`, `shine_org.learners`, `shine_org.billing`, `shine_level.level_repository`,
  `shine_level.session_generator` (solo lectura de la pendiente). Toda regla de "quién puede qué"
  ya existe; el panel no inventa ninguna.
- **Estadísticas**: la lógica pura vive en TypeScript (`shine-app/src/lib/stats/`, 11 funciones con
  tests). El panel no puede leerlas por JSON:API con la cookie del titular (las sesiones y los
  summaries son del `uid` del alumno, gotcha 17), así que se portan a PHP (04).
- **Idiomas**: el sitio tiene `es` (sin prefijo) y `ca` (`/ca`), FASE 18. El módulo `locale` no
  está instalado: lo instala 11 para traducir la interfaz del panel.

## Cómo usarlos

1. Abrir Claude Code en la raíz del proyecto con el agente indicado en la cabecera del fichero.
2. Pedir: "ejecuta plans/backoffice/XX-....md" (o pegar su sección "Prompt").
3. Al terminar: verificar según su sección "Verificación", marcar la fila en la tabla de abajo y
   actualizar `docs/progress.md` en la sección "FASE 21" (Panel web de titulares).

## Criterio de agente

Cada subplan indica el modelo y, cuando aplica, las skills o herramientas con las que conviene
ejecutarlo. El criterio:

- **Fable 5.1**: todo lo que decide acceso (qué titular ve qué alumno u organización desde una
  sesión de navegador), seguridad (token de un solo uso desde la app, impersonación de soporte,
  cierre de sesión global), y la portabilidad numérica con casos límite (estadísticas, que deben
  dar los mismos números que la app).
- **Opus 5.5**: pantallas con especificación cerrada y servicios ya existentes (alumnos, plan,
  informes, avisos), configuración de Views y formularios, documentación.
- **Opus 5.5 con la skill `frontend-design`**: el tema desde cero y los componentes (01) y
  cualquier subplan que cree pantallas nuevas con peso visual (02, 03, 05, 06). La skill evita el
  aspecto de plantilla genérica y obliga a decidir tipografía, espacio y jerarquía.
- **Verificación visual**: con el navegador (herramientas `claude-in-chrome` o la skill `run`) a
  390 px y 1280 px de ancho, con dos titulares normales (gotcha 14), nunca con el usuario 1.
- **Al cerrar cada subplan**: `/code-review` sobre el diff; en 02, 07 y 10 además
  `/security-review` (sesión de navegador, tokens, impersonación).
- **Sonnet 5.5** solo para trabajo mecánico y supervisado dentro de 11 (extracción de cadenas al
  `.po`); ningún subplan entero.

El propio plan de planes se ha escrito con Fable 5.1 tras revisar la especificación, el prototipo
de Lovable y el código de `shine_account`, `shine_entitlement`, `shine_org` y `shine_level`.

## Decisiones de arquitectura (cerradas aquí)

1. **Tema `shine_theme` sin tema base** (`base theme: false`; no puede llamarse como el módulo `shine_panel`: core lanza `ExtensionNameReservedException`), creado desde cero en
   `public_html/themes/custom/shine_theme/`: tokens como propiedades CSS (`css/tokens.css`) tomados
   de `docs/lovable/panel/src/styles.css` y de la paleta de `docs/design.md`, fuentes **alojadas en
   el tema** (Nunito y OpenDyslexic en `fonts/`, sin Google Fonts: RGPD), componentes como **SDC**
   (`components/*`), CSS plano sin paso de build (sin Tailwind, sin Sass), JavaScript mínimo y sin
   framework (`js/shell.js`), una sola librería de gráficas (**Chart.js**, versión fijada, vendida en
   `js/vendor/`, cargada solo en las páginas con gráficas). Olivero se desinstala cuando
   `shine_theme` pasa a ser el default (01). Modo claro solo, como la app.
2. **Seis módulos nuevos, pequeños y con una responsabilidad cada uno**: `shine_panel` (rutas
   `/panel/*`, acceso, controladores finos, formularios, una página de muestrario de componentes
   para desarrollo; 01 y 02), `shine_audit` (entidad `audit_log` y servicio `shine_audit.logger`:
   quién invitó, liberó, reasignó, exportó o suplantó, con fecha; lo crea 02 y lo escriben 03, 05,
   06, 09 y 10), `shine_stats` (cálculo de estadísticas en PHP con paridad probada frente a la app,
   servicio y endpoint; 04), `shine_notify` (entidad `notification`, preferencias y correos; 08),
   `shine_notes` (entidad `learner_note` con su política de reparto; 09) y `shine_support` (panel
   interno de soporte en `/admin/shine`, rol `support`, "ver como"; 10). Las entidades que la app
   podrá leer algún día (notas compartidas, notificaciones) no viven en `shine_panel` para que la
   app no dependa del panel. Nada del panel va en `shine_account`, `shine_entitlement` ni
   `shine_org`, salvo lo que de verdad es de ellos (`unarchive()` y los bloqueos del borrado en
   `shine_account`, las operaciones de miembros y reasignación en `shine_org`, el log de eventos de
   webhook en `shine_entitlement`).
3. **Sesión de Drupal por cookie**, no OAuth: el titular entra en `/user/login` con el email (el
   username es el email) y la contraseña de la app. Las páginas del panel son rutas con
   `_shine_holder` y un `_custom_access` propio (`shine_panel.access`) que resuelve con
   `LearnerAccessPolicy`, `OrganizationManager` y `EntitlementAccess`; jamás con permisos globales
   ni roles. Un alumno (`field_account_kind = learner`) no entra al panel. Las lecturas de datos del
   alumno (sesiones, summaries, niveles) las hacen servicios con `accessCheck(FALSE)` **después** de
   comprobar la política: los node grants de `shine_session_access` no se amplían al titular
   (gotcha 17).
4. **Una ruta raíz `/panel`** con secciones según los roles del titular (familia, profesional,
   coordinación, docente): un titular puede ver varias. La estructura de navegación sigue el
   prototipo (`docs/lovable/panel/src/routes/panel.tsx`); las URL se traducen al castellano del
   prototipo: `/panel`, `/panel/alumnos`, `/panel/alumnos/{uuid}`, `/panel/plan`, `/panel/cuenta`,
   `/panel/organizacion`, `/panel/informes`, `/panel/avisos`, `/panel/ayuda`.
5. **Escritura solo con formularios de Drupal** (token CSRF de serie) que delegan en los servicios
   existentes; sin JavaScript que llame a `/shine/*` desde el navegador. Confirmaciones con
   `<dialog>` nativo o páginas de confirmación, nunca `confirm()`.
6. **Estadísticas en PHP** (04): se porta `src/lib/stats/` función a función con fixtures de paridad
   compartidos; el panel dibuja con Chart.js y acompaña cada gráfica de su tabla accesible, con los
   mismos principios que la app (nunca una lectura de "empeora", `plans/design/README.md`).
7. **Idiomas del panel**: `es` y `ca` (11) con el módulo `locale` y un `ca.po` dentro de
   `shine_panel/translations/`; el prefijo de URL ya existe. El idioma del panel es el que elige el
   titular en "Mi cuenta" (`preferred_langcode` del titular), no el del alumno.
8. **Móvil primero**: las familias abren el panel desde el móvil. Cuerpo a 18 px, nada por debajo
   de 14 px, áreas táctiles de 48 px, foco visible, `prefers-reduced-motion`, WCAG AA.
9. **`/pro` se integra en el panel** (05): la contratación pasa a `/panel/plan/contratar` y `/pro`
   redirige; el formulario `ProCheckoutForm` se conserva y se reestiliza.

## Orden de ejecución

| Orden | Fichero | Spec (`dashboards.md`) | Agente | Depende de | Hecho |
|---|---|---|---|---|---|
| 1 | `01-tema-desde-cero.md` | §1, §10.1 (tema) | Opus 5.5 + `frontend-design` | nada | [x] 2026-10-30 |
| 2 | `02-panel-base-acceso-y-cuenta.md` | §2, §3.1, §3.2, §4.1, §10.1 (módulo) | Fable 5.1 (+ `frontend-design` para las pantallas) | 01 | [x] 2026-10-30 |
| 3 | `03-alumnos-y-ficha.md` | §4.2, §7.1 a 7.3, §7.6 (CSV), §8 | Opus 5.5 + `frontend-design` | 02 | [ ] |
| 4 | `04-estadisticas-php.md` | §7.4, §10.1 (`shine_stats`), §11 | Fable 5.1 | 02 (en paralelo con 03) | [ ] |
| 5 | `05-mi-plan-y-contratacion.md` | §4.3, §5.4, §6.6 (gabinete) | Opus 5.5 + `frontend-design` | 02 | [ ] |
| 6 | `06-organizacion.md` | §5.1, §5.2, §6.1 a 6.3, §6.7 (registro) | Fable 5.1 (+ `frontend-design`) | 03, 05 | [ ] |
| 7 | `07-acceso-desde-la-app.md` | §3.1 (token de un solo uso, cierre global) | Fable 5.1 | 02 | [ ] |
| 8 | `08-avisos-y-email.md` | §3.3, §4.1 (avisos destacados) | Opus 5.5 | 03, 05 | [ ] |
| 9 | `09-informes-y-notas.md` | §5.3, §6.5, §7.5, §7.6 (PDF) | Opus 5.5 | 04, 06 | [ ] |
| 10 | `10-panel-interno-soporte.md` | §9 | Fable 5.1 | 02 | [ ] |
| 11 | `11-catalan-ayuda-verificacion-y-docs.md` | §3.4, todas | Opus 5.5 (Sonnet para el `.po`) | todo lo anterior | [ ] |

Camino crítico: 01 → 02 → 03 → 04. El 05 y el 07 van en paralelo con 03; el 06 necesita la ficha
de alumno (03) y el bloque de licencia (05).

Hitos (coinciden con `docs/dashboards.md` §10.3):

- **H1, panel de familia** (tras 01, 02, 03, 04, 05 y 07): una familia entra con sus credenciales
  de la app (o desde Ajustes sin volver a escribirlas), ve a sus alumnos, su cobertura y su
  progreso, gestiona alumnos y cuenta, y sabe cómo está su plan. Es lo mínimo para dar soporte a
  familias cuando la app esté en las stores.
- **H2, canal profesional** (tras 06, 08 y 09): cartera de alumnos, gabinete con miembros y
  códigos, licencia de Stripe desde el panel, informes PDF y notas.
- **H3, operación** (tras 10 y 11): soporte interno con "ver como", panel en catalán, ayuda y
  verificación de extremo a extremo con los cinco tipos de titular.

## Dónde cae cada pantalla del prototipo

| Ruta del prototipo (`docs/lovable/panel/src/routes/`) | Ruta del panel | Subplan |
|---|---|---|
| `login.tsx`, proyecto "Shine Sign In" | `/user/login` (core, reestilizado) | 01 |
| `panel.tsx` (layout), `panel.index.tsx` (inicio) | `/panel` | 02 |
| `panel.cuenta.tsx` | `/panel/cuenta` | 02 |
| `panel.alumnos.index.tsx`, `panel.alumnos.$id.tsx`, `alumno.tsx` | `/panel/alumnos`, `/panel/alumnos/{uuid}` | 03 (datos y acciones), 04 (rendimiento), 09 (notas, PDF) |
| `panel.plan.tsx` | `/panel/plan`, `/panel/plan/contratar` | 05 |
| `panel.organizacion.tsx` | `/panel/organizacion`, `/panel/organizacion/{uuid}/...` | 06 |
| `panel.avisos.tsx` | `/panel/avisos` | 08 |
| `panel.informes.tsx` | `/panel/informes` | 09 |
| `panel.ayuda.tsx` | `/panel/ayuda` | 11 |
| `panel.grupos.tsx` | fuera de alcance (modo aula, 17f) | no |

## Decisiones que `docs/dashboards.md` §11 deja abiertas y cómo se cierran

| Decisión | Cierre | Subplan |
|---|---|---|
| Familia por web con Stripe | No en v1: en la web no hay botón de compra de Familia; se explica que se contrata en la app | 05 |
| Notas profesionales compartibles con la familia | Sí, por nota, con una casilla "compartir con la familia" desactivada por defecto y aviso de no escribir diagnósticos | 09 |
| Gráficas y cálculo | Chart.js en el tema; cálculo en PHP (`shine_stats`) con paridad probada; endpoint `GET /shine/learners/{uuid}/stats` que la app podrá adoptar más adelante | 04 |
| Idiomas del panel en v1 | `es` y `ca` | 11 |
| Impersonación de soporte | Con registro de auditoría y banner permanente en el panel; sin aviso al titular en v1 | 10 |

## Riesgos conocidos

- **Gotcha 14**: probar siempre con dos titulares normales con alumnos propios y uno compartido, y
  con un coordinador que no sea `owner` de ningún alumno. El usuario 1 pasa todas las puertas.
- **Gotcha 17**: el titular no tiene grants sobre las sesiones del alumno y no debe tenerlos. Todo
  servicio del panel que lea sesiones, summaries o niveles de un alumno comprueba
  `LearnerAccessPolicy::canSee()` (o la pertenencia a la organización) antes de consultar con
  `accessCheck(FALSE)`. Un test kernel por servicio con un titular ajeno que recibe 404.
- **Gotcha 20**: guardar el usuario titular desde el panel (nombre, fuente, idioma) borra sus
  access tokens de la app; la app los renueva con el refresh token, pero los tokens de alumno en
  vuelo caducan y se vuelven a pedir. Aceptable; documentarlo en "Mi cuenta" no hace falta.
- **Gotcha 23**: las Views del panel escritas a mano se importan (`cim`) antes de exportar (`cex`).
- **CSRF y sesión**: solo formularios de Drupal para escribir; las rutas GET del panel con
  `no_cache` y `#cache` por usuario (`contexts: user`, etiquetas de las entidades que muestran).
- **Datos personales**: el panel muestra nombres o apodos y métricas de ejecución. Nada de edad,
  email real de alumnos ni diagnósticos. Las notas (09) llevan el aviso en la interfaz.

## Fuera de alcance de esta carpeta

- Modo aula y grupos (§6.4, `panel.grupos.tsx`): FASE 17f.
- Exportación RGPD completa en cola y por email (§3.2): 09 deja el CSV por alumno; el ZIP por
  cuenta queda anotado como pendiente.
- Alta masiva por CSV, contrato de encargado de tratamiento descargable y solicitud de ampliación
  de centros (§6.3, §6.6): v3, fuera de este plan.
- Textos legales definitivos (términos, privacidad, DPA): no es trabajo de Claude Code.
