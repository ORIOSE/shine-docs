# 03. App: infraestructura de idiomas y extracción de textos

- **Modelo recomendado: Opus.** Especificación cerrada: una librería concreta, dos catálogos, una
  convención de claves y una extracción mecánica de 881 líneas de texto. No hay decisiones de
  producto; las de idioma del alumno van en 04.
- Fase: 18 (multiidioma). Alcance: solo la app (shine-app/).
- Dependencias: ninguna (puede ir en paralelo con 01 y 02).

## Prompt

Lee plans/multiidioma/analisis.md (2.5 y 5.1), plans/multiidioma/README.md (decisiones 4 y 5),
CLAUDE.md (gotcha 5: comandos con nvm) y docs/conventions.md §3. Trabaja en shine-app/. No
cambies ningún comportamiento: esta sesión solo mueve textos a un catálogo y añade el catalán.

Tareas:

1. **Librería**: i18n-js con expo-localization (instalación con npx expo install desde la
   terminal del usuario, gotcha 5; deja el comando en el informe final si no puedes ejecutarlo).
   Módulo src/lib/i18n.ts: inicialización, idioma por defecto es, fallback a es, función t,
   setLocale y getLocale, y detección del idioma del dispositivo limitada a es y ca.
2. **Catálogos** src/locales/es.json y src/locales/ca.json con dos espacios de nombres: ui (lo
   que lee el tutor: pantallas, botones, estadísticas, errores, instrucciones de la intro) y
   player (lo que lee el niño dentro del juego: "¿En qué posición estaba?", "Encuentra todas
   las", resultados, "¡N palabras!", "plátano: 12 repeticiones", "0,8 por segundo", motivación de
   fin de actividad, preguntas de "¿Cómo ha ido?" y de fin de sesión). Claves por pantalla o
   componente (ui.dashboard.*, ui.learners.new.*, player.imagePosition.*...). Pluralización con
   count donde haga falta. Documenta la convención en docs/conventions.md.
3. **Extracción**: sustituye todos los textos en castellano de app/, src/components y src/lib
   (hoy 881 líneas en 103 ficheros; los objetos *_COPY de learnerScreens, sessionCards,
   accountScreens y learnerCopy, RATING_COPY y las instructions de src/lib/activityKinds se
   convierten en claves). Los mensajes de error que vienen de códigos de la API (authForm,
   errors.ts, learners) también. Nada de texto literal en castellano en el código al terminar:
   compruébalo con una búsqueda de caracteres ¿, ¡, ñ y vocales con tilde fuera de los catálogos
   y de los tests.
4. **Catalán**: traduce el catálogo completo al catalán con cuidado de registro (tú para el niño,
   tono amable, sin tecnicismos), y marca en docs/progress.md que es una traducción provisional
   pendiente de revisión por hablante nativo (la revisa 05 o el experto).
5. **Formatos**: fechas de las estadísticas con el locale del idioma activo (es-ES o ca-ES);
   números con coma decimal en los dos; el formateador de ritmo de rapidRepetition.ts recibe el
   texto "por segundo" del catálogo.
6. **Tests**: los que comparan textos (authForm, learnerForm, sessionCards, rapidRepetition,
   learnerCopy, golden payloads si incluyen labels) pasan a comparar claves o a cargar el catálogo
   es; añade un test que compruebe que es.json y ca.json tienen exactamente las mismas claves.
7. **Fuentes y glifos**: comprueba en web y en Expo Go una pantalla con ç, l·l (punto volado
   U+00B7), ï, ü, à, è, ò en Nunito y OpenDyslexic, en pesos regular y bold; anota el resultado.
8. **Tienda**: app.json con locales es y ca (CFBundleLocalizations en iOS y locales en Android)
   y nota en plans/prompts/14b sobre la ficha en dos idiomas.
9. Un conmutador temporal de idioma en Ajustes (solo para esta sesión y QA; 04 lo sustituye por
   el idioma del alumno) para poder recorrer la app en catalán.

## Verificación

- tsc, lint y tests limpios (source ~/.nvm/nvm.sh && nvm use 21 && npx tsc --noEmit && npm run
  lint && npm test).
- Recorrido en navegador en es y en ca por login, registro, alta de alumno, dashboard, una sesión
  completa con los siete tipos de actividad, fin de sesión y estadísticas: ningún texto sin
  traducir ni clave visible.
- Búsqueda de literales en castellano fuera de los catálogos: cero.

## Al terminar

Marca la fila en plans/multiidioma/README.md y anota en docs/progress.md (FASE 18) qué se hizo,
el estado de la traducción catalana y los pendientes.
