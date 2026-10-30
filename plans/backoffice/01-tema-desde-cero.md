# 01. Tema `shine_theme` desde cero, componentes y páginas de acceso

- **Agente recomendado: Opus 5.5 con la skill `frontend-design`.** Es trabajo visual con
  especificación cerrada (tokens, componentes, dos layouts) y sin lógica de acceso. La skill obliga a
  tomar decisiones de tipografía, espacio y jerarquía en vez de reproducir un admin genérico.
  Verificación visual con el navegador (`claude-in-chrome` o la skill `run`).
- Fase: 21. Alcance: solo Drupal (`shine/`): tema nuevo, módulo `shine_panel` (solo el esqueleto y
  la página de muestrario), config de bloques y tema por defecto, borrado del módulo `preprocess`.
- Dependencias: ninguna. Los temas heredados ya no existen (2026-10-30); el default es Olivero.

## Prompt

Lee `plans/backoffice/README.md` ("Decisiones de arquitectura", puntos 1, 2 y 8),
`docs/dashboards.md` §1 y §10.1, `docs/design.md` §2 a §4, `plans/design/00-sistema-diseno.md`
(design system de la app: paleta, tipografía, componentes y sus estados) y el prototipo de Lovable
en `docs/lovable/`: `INDEX.md` (sección 2, tokens, y sección 6, layout), `panel/src/styles.css`
(variables CSS), `panel/src/routes/panel.tsx` y `panel/src/routes/__root.tsx` (estructura de
navegación), `panel/src/components/shine/ui.tsx` (componentes propios del prototipo) y
`signin/src/routes/index.tsx` (pantalla de entrada). Mira también la captura de referencia en
`docs/lovable/INDEX.md` si la hay. En Drupal, lee la documentación de core sobre temas sin tema base
(`base theme: false`), Single Directory Components (`core/modules/sdc` ya es parte de core en 11) y
`core/themes/starterkit_theme` solo como inventario de qué plantillas conviene sobrescribir (no lo
uses como base: el tema nace vacío). Trabaja en `shine/`.

Principio: el tema es para un panel de gestión que abrirán familias desde el móvil y centros desde
ordenador. Mismo carácter que la app (cálido, tranquilo, sin ruido), pero más denso donde hay
tablas. Nunca aspecto de admin de Drupal ni de plantilla Bootstrap.

Tareas:

1. **Tema `shine_theme`** en `public_html/themes/custom/shine_theme/`: `shine_theme.info.yml`
   (`base theme: false`, `core_version_requirement: ^11`, regiones mínimas: `header`, `content`,
   `footer`; el panel no usa barras laterales de bloques, la navegación la pinta el módulo),
   `shine_theme.libraries.yml` (`global`: tokens, base, layout, formularios; `charts`: Chart.js,
   solo se adjunta donde hay gráficas), `shine_theme.theme` (preprocess de `html` para
   `data-font="dyslexic"` cuando el titular tiene `field_dyslexic_font`, y clase de layout según la
   ruta), `screenshot.png`, `logo.svg` (la marca "Shine" con el punto ámbar del prototipo),
   `README.md` del tema con la lista de fuentes y licencias.
2. **Tokens y base** (`css/tokens.css`, `css/base.css`): propiedades CSS con la paleta de
   `docs/design.md` (primario `#3DBFA0`, primario oscuro `#2A8C74`, acento `#F5A623`, fondo
   `#F7F5F2`, superficie `#FFFFFF`, texto `#1E1E2E` y `#6B7280`, éxito `#4CAF7D`, error `#E05A5A`)
   reconciliada con las variables de `docs/lovable/panel/src/styles.css` (si difieren, manda el
   prototipo y se anota en el README del tema); escala de espaciado de 4 px, radios 12 y 16,
   sombras suaves, tipografía (cuerpo 18 px, interlineado 1.6, etiquetas 15 px, nada por debajo de
   14 px, letter-spacing ligeramente abierto, texto nunca justificado). Fuentes alojadas en el tema:
   `fonts/nunito-*.woff2` (variable, OFL) y `fonts/opendyslexic-*.woff2` (OFL); `@font-face` con
   `font-display: swap`; sin ninguna petición a Google Fonts. Reset mínimo, foco visible,
   `prefers-reduced-motion`. Modo claro solo.
3. **Dos layouts** en `templates/layout/`: `page--user.html.twig` (tarjeta centrada para
   `/user/login`, `/user/password`, `/user/reset/*` y `/user/register`, como la pantalla "Shine Sign
   In": logo, título "Hola de nuevo", subtítulo, formulario, enlace "¿Has olvidado tu contraseña?") y
   `page--panel.html.twig` (concha del panel, como `panel.tsx` del prototipo: **cabecera superior
   pegajosa** de 64 px con la marca a la izquierda, los enlaces de sección en horizontal con icono a
   partir de 768 px y, por debajo, una fila de chips desplazable bajo la cabecera; a la derecha, la
   campana de "Avisos" con contador y el menú de usuario desplegable con nombre, "Mi cuenta", "Plan
   y pagos" y "Cerrar sesión"; zona de contenido centrada a 1200 px; pie discreto). Sin barra
   lateral: el prototipo no la tiene y en móvil estorba. El `page.html.twig` por defecto es una
   versión sencilla del de usuario para lo que no sea panel (hoy `/pro`). Las variables de
   navegación (secciones, activa, contador de avisos, usuario) las aporta el módulo (tarea 6) con
   una `#theme shine_panel_nav`; en este subplan basta con que el muestrario las rellene. El
   selector "Ver como" del prototipo es solo de demostración y no se implementa (la impersonación
   de soporte es de 10).
4. **Formularios y elementos** (`css/forms.css` y `templates/form/`): `input`, `form-element`,
   `form-element-label`, `select`, `checkbox`, `radios`, `details`, `fieldset`, `textarea`,
   `input--submit` con las clases del botón; `templates/misc/status-messages.html.twig` (mensajes
   con icono y color, nunca solo color); `templates/dataset/table.html.twig` y
   `templates/views/views-view-table.html.twig` (tabla con cabecera fija en móvil convertida en
   tarjetas apiladas por debajo de 640 px, patrón `data-label`).
5. **Componentes SDC** en `components/` (cada uno con `*.component.yml`, Twig, CSS y, si hace
   falta, JS): `button` (primario, secundario, destructivo, enlace; estados), `card` (con cabecera,
   cuerpo y pie opcionales), `stat-tile` (número grande, etiqueta, icono), `badge` (cobertura,
   estado, rol: siempre con texto, el color es apoyo), `avatar` (emoji del set de la app + nombre;
   la correspondencia clave → emoji es una constante PHP compartida, ver tarea 6), `level-chip`,
   `progress-bar` (con etiqueta de texto), `empty-state` (icono, título, texto, acción),
   `page-header` (título, subtítulo, acciones), `notice` (aviso destacado, variantes `info` teal y
   `warning` ámbar con acción a la derecha, como `Alert` del prototipo), `motivation-card` (borde
   izquierdo teal e icono), `panel-header` (marca, enlaces de sección con icono y estado activo,
   campana con contador, menú de usuario con `aria-expanded` y cierre con Escape), `user-menu`,
   `tabs` (`role="tablist"` con subrayado, desplazable en móvil; cada pestaña es una URL con
   `?tab=` para que funcione sin JavaScript), `confirm-dialog` (`<dialog>` nativo con título,
   texto y dos botones, abierto por `data-confirm` en un botón de formulario; variante con campo de
   confirmación escrita, p. ej. "LIBERAR"), `data-table` (envoltorio con título, buscador, filtros
   opcionales y estado vacío), `trend` (Sube, Estable, Baja: siempre con texto e icono), `toast`
   (mensajes de Drupal también como aviso flotante abajo, 3,5 s, sin JavaScript obligatorio).
   Iconos: un sprite SVG propio en `images/icons.svg` (línea, 24 px) con los que usa el prototipo
   (`docs/lovable/INDEX.md`, sección 5: Ear, Eye, Brain, SpellCheck, BookOpen, Home, Users,
   CreditCard, FileText, Building2, HelpCircle, Bell, etc.), redibujados o tomados de un set con
   licencia MIT (Lucide) y anotados en el README del tema; sin librería externa en tiempo de
   ejecución.
6. **Módulo `shine_panel` (solo esqueleto)** en `public_html/modules/custom/shine_panel/`:
   `shine_panel.info.yml` (`package: shine`, dependencias `shine_account`, `shine_entitlement`,
   `shine_org`, `shine_level`), `hook_theme` con `shine_panel_nav` y `shine_panel_page`, la
   constante `Drupal\shine_panel\Avatars::EMOJI` (misma lista y orden que
   `shine-app/src/lib/avatars.ts`; un test kernel que falle si cambia la cantidad, con un comentario
   que apunte al fichero de la app), y la ruta de desarrollo `/panel/_muestrario` (permiso
   `administer site configuration`, `_admin_route: FALSE`) que pinta todos los componentes en todos
   sus estados, el layout del panel con una navegación de ejemplo (las secciones de la tabla §2 de
   `docs/dashboards.md`), una tabla de ejemplo, un formulario de ejemplo y un `empty-state`. Es la
   "lámina de componentes" de `plans/design/00-sistema-diseno.md` y queda como herramienta de
   desarrollo. Nada más del módulo (rutas reales, acceso) va en este subplan: eso es 02.
7. **Tema por defecto y limpieza**: `shine_theme` pasa a ser el tema por defecto
   (`system.theme.default`); bloques del tema en `config/sync` (`shine_theme_messages`,
   `shine_theme_page_title`, `shine_theme_content`, `shine_theme_local_tasks` solo en rutas de
   usuario; sin branding ni menú de bloque, lo pinta la concha); Olivero desinstalado y sus bloques
   fuera de `config/sync`; módulo `preprocess` desinstalado y borrado (`drush pm:uninstall
   preprocess`, `rm -rf`, `cex`); `system.site.page.front` sigue como está (02 lo apunta a
   `/panel`). Comprueba que Gin sigue siendo el tema de administración y que `/admin` no cambia.
8. **Páginas de usuario de core**: con el layout de tarjeta, el formulario de login etiqueta el
   campo "Email" (el username es el email; `hook_form_user_login_form_alter` en `shine_panel`),
   quita la descripción por defecto de Drupal, pone "Entrar" y el enlace de recuperación; el
   registro web muestra la casilla de consentimiento de adulto con el texto de la app
   (`shine-app/src/locales/es.json`, clave del consentimiento) y nada que no esté en el registro de
   la app. `/user/{uid}` (perfil de core) redirige a `/panel` para titulares (02 lo hace; aquí solo
   se estiliza).
9. **Chart.js**: `js/vendor/chart.umd.js` (versión 4.x fijada, con su LICENSE), librería
   `shine_theme/charts` con `dependencies` a `core/once` para el inicializador
   `js/charts.js` (lee `data-chart` con un JSON y pinta; paleta desde los tokens; sin animación si
   `prefers-reduced-motion`). En este subplan solo se usa en el muestrario con datos de ejemplo
   (una línea con media móvil, un radar de cinco áreas, unas barras semanales).
10. **Documentación**: `docs/design.md` gana un apartado "Panel web" con los tokens que difieren de
    la app y la lista de componentes SDC; `CLAUDE.md` (estructura: tema y módulo nuevos; tabla de
    módulos: `shine_panel`; "Temas"); `docs/progress.md` (FASE 21, 01).

Verificación:
- Con el navegador a 390 px y 1280 px: `/user/login`, `/user/password` y `/panel/_muestrario`
  (como admin) se ven con el diseño del prototipo, sin estilos de Olivero ni de Claro; ningún texto
  por debajo de 14 px; contraste AA en botones, badges y texto secundario (comprueba con los valores
  de los tokens); el menú de usuario se abre y cierra con teclado y con Escape; la fila de chips
  de secciones se desplaza en móvil y es navegable con tabulador; `<dialog>` cierra con Escape;
  ninguna petición a dominios externos en la pestaña Red (el prototipo cargaba Nunito de Google
  Fonts y OpenDyslexic de jsDelivr: aquí ambas salen del tema).
- Un titular normal (`jose@test.com`, gotcha 14) entra por `/user/login` con su email y ve el
  muestrario denegado (403 con el layout del tema, no en blanco); el admin lo ve.
- `ddev drush config:status` limpio tras `cex`; `core.extension` sin `olivero` ni `preprocess`;
  `ddev drush core:requirements --format=csv | grep ",Error,"` sin errores nuevos; watchdog sin
  errores; `/pro` y `/admin/shine` siguen funcionando (el primero con el layout sencillo, el
  segundo con Gin).
- Tests: `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_panel`
  (el test de avatares) en verde.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`CLAUDE.md` y `docs/design.md` como se indica.
