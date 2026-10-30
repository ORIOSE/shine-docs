# 11. Panel en catalán, ayuda y contacto, verificación de extremo a extremo y documentación

- **Agente recomendado: Opus 5.5.** Trabajo de cierre con especificación cerrada: traducción con
  la voz de la app, página de ayuda, recorrido completo y documentación. **Sonnet 5.5** puede
  hacer, supervisado dentro de esta sesión, la extracción mecánica de las cadenas al `.po`; la
  traducción al catalán y todo lo demás, Opus.
- Fase: 21. Alcance: Drupal (`shine/`): `locale`, ficheros `.po`, `/panel/ayuda`, formulario de
  contacto, datos de demostración (`private/scripts/`), docs. Nada en la app.
- Dependencias: todo lo anterior (01 a 10). Es el último subplan.

## Prompt

Lee `plans/backoffice/README.md` (hitos, decisiones 7 y 8, "Fuera de alcance"),
`docs/dashboards.md` entero (es la lista de comprobación), `docs/lovable/panel/src/routes/panel.ayuda.tsx`
(contenido de ayuda del prototipo) y `docs/lovable/INDEX.md`, los catálogos de la app
`shine-app/src/locales/es.json` y `ca.json` (voz y vocabulario: "alumno/alumne", "sesión de
ajuste", nombres de las áreas) y `docs/conventions.md` §3 (convención de textos), la sección "Idiomas
(FASE 18)" de `CLAUDE.md` (prefijo `/ca`, `preferred_langcode`), y los scripts locales de recorrido
`private/scripts/drive_api.py` y `langchange.py` (gitignored; si no existen en esta máquina, los
describe `docs/progress.md`, FASE 18 06). Trabaja en `shine/`.

Tareas:

1. **`locale`**: instala el módulo (`drush en locale`, `cex`), sin descargar traducciones de
   drupal.org para los módulos custom (`locale.settings`: `translation.use_source: local`;
   en los `.info.yml` de `shine_panel`, `shine_stats`, `shine_support` y `shine_audit`:
   `'interface translation project'` y `'interface translation server pattern':
   'modules/custom/%project/translations/%project.%language.po'`). Las traducciones de core y
   contrib al catalán sí se pueden importar de drupal.org (`drush locale:check && drush
   locale:update`), porque las páginas de usuario de core (`/user/login`, `/user/password`) las
   usan.
2. **Cadenas del panel**: comprueba que ningún texto visible del panel está fuera de `t()`,
   `$this->t()`, `{% trans %}` o `#title`/`#description` traducibles (incluidos los componentes SDC:
   las etiquetas se pasan como props ya traducidas). Extrae todas las cadenas de los cuatro módulos y
   del tema a `translations/{módulo}.ca.po` (`msgid` castellano, `msgstr` catalán) con la voz de
   `ca.json`; mismos términos que la app para áreas, tipos de sesión, cobertura y roles. Importa con
   `drush locale:import ca ruta --type=not-customized --override=all` (o `locale:update` si el
   patrón local funciona) y deja documentado el comando de reimportación en el README del módulo.
3. **Idioma del titular**: "Mi cuenta" (02) ya guarda `preferred_langcode`; aquí se verifica que al
   entrar en `/user/login` con un titular en `ca` se redirige a `/ca/panel`, que todos los enlaces
   del panel conservan el prefijo (usa `Url::fromRoute` con el idioma actual, nunca rutas escritas a
   mano), que las fechas (`date.formatter`) y los decimales salen en catalán, y que los correos de 08
   se envían en el idioma del titular.
4. **Ayuda** (`/panel/ayuda`): la guía de la dinámica en lenguaje de familia (qué es el bloque
   inicial, las sesiones regulares y las de ajuste, las áreas, los niveles 0 a 10 y qué significa
   cada cambio, qué hacer si una sesión se queda pendiente), la misma explicación que da la app
   (`es.json`, claves de onboarding y dashboard) adaptada al formato de página con índice; preguntas
   frecuentes sobre cuenta, alumnos, códigos y planes; y el formulario de contacto: core `contact`
   (ya instalado) con un formulario `soporte` que adjunta automáticamente el titular y deja elegir el
   alumno al que se refiere (select con sus alumnos), enviado al correo del sitio y registrado en
   `audit_log` (`support.contact`). Textos en `es` y `ca`.
5. **Datos de demostración** (`private/scripts/panel-demo.php`, gitignored, `ddev drush php:script`):
   idempotente, crea o repara el conjunto completo para probar los cinco tipos de titular:
   - familia: `jose@test.com` (Marta `es`, Pau `ca`, cortesía familiar; ya existe);
   - segunda familia sin plan con un alumno en prueba casi agotada (7 de 8 regulares completadas);
   - profesional independiente: organización `practice` de un miembro con licencia `professional`
     manual y 3 alumnos en plaza, uno compartido con la segunda familia por código;
   - gabinete: coordinador + 2 profesionales, licencia 2 asientos, 20 alumnos, uno en pausa por
     cupo;
   - centro: coordinador + 2 docentes, licencia `school_individual` de 10 plazas, 8 alumnos, un
     alumno liberado hace 3 días (`released_by`), y un alumno con acceso `staff` de la segunda
     docente;
   - usuario `support`.
   Con sesiones y summaries suficientes (usa el generador y el cierre de sesión reales por HTTP,
   como `drive_api.py`, o crea summaries sintéticos coherentes con los tipos de actividad) para que
   las estadísticas tengan contenido. Imprime las credenciales al final.
6. **Recorrido de extremo a extremo** (manual con el navegador, a 390 px y 1280 px, en `es` y
   `ca`), siguiendo `docs/dashboards.md` sección a sección con la matriz de §8 como lista: para cada
   tipo de titular, lo que debe ver y lo que **no** debe ver (una familia no ve `/panel/organizacion`;
   un docente no ve a los alumnos de otra docente sin `staff`; un `guardian` no puede archivar; un
   coordinador no opera sin `staff` pero libera; soporte ve como y no borra). Anota en
   `docs/progress.md` cada desviación encontrada y corrígela si es del panel; si es de un servicio
   de `shine_account`, `shine_entitlement` o `shine_org`, corrígela con su test kernel.
7. **Documentación de cierre**: `docs/dashboards.md` pasa de especificación a estado (cada
   sección con "implementado en NN", "parcial" o "pendiente"), con §11 cerrado y una lista final de
   pendientes (exportación RGPD en ZIP, alta masiva por CSV, DPA descargable, modo aula, textos
   legales, embudo); `docs/architecture.md` y `docs/structure.md` (tema y módulos nuevos);
   `CLAUDE.md` (sección "Panel web" con rutas, módulos, comandos y gotchas nuevos; "Configuración en
   un PC nuevo": `locale:import`, fuentes del tema, script de demostración);
   `docs/progress.md` (FASE 21 cerrada); `plans/backoffice/README.md` (todas las filas marcadas).
   Si en el recorrido aparece un gotcha nuevo, va a la lista numerada de `CLAUDE.md`.

Verificación:
- `/ca/panel` entero en catalán sin ninguna cadena en castellano (recorre todas las rutas con un
  titular `ca`; busca restos con `grep` de palabras castellanas frecuentes en el HTML servido:
  "alumno", "sesión", "ajustes"); `/panel` entero en castellano.
- `drush locale:import` reimporta sin errores; `cim`/`cex` sin cambios después.
- El formulario de contacto llega a Mailpit con titular y alumno, y deja su fila en
  `/admin/shine/audit`.
- El script de demostración se puede ejecutar dos veces seguidas sin duplicar nada.
- Recorrido de §6 completado para los cinco tipos de titular y soporte, con las desviaciones
  anotadas y corregidas; tests de `shine_account`, `shine_entitlement`, `shine_org`, `shine_level`,
  `shine_panel`, `shine_stats`, `shine_support` y `shine_audit` en verde.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md` y el resto
de la documentación de la tarea 7.
