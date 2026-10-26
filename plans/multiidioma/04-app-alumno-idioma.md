# 04. App: idioma del alumno (alta, ficha, cambio con reinicio y recursos traducidos)

- **Modelo recomendado: Opus.** Pantallas con patrón ya existente (alta y ficha de alumno de la
  FASE 17, ConfirmPanel), una opción en apiFetch y el idioma de la app ligado al alumno activo.
  Las decisiones ya están tomadas en el análisis y en 01.
- Fase: 18 (multiidioma). Alcance: solo la app (shine-app/).
- Dependencias: 01 (API con langcode) y 03 (catálogo de textos).

## Prompt

Lee plans/multiidioma/analisis.md (2.3, 2.4, 2.5, 4, 5.2 y 5.3), plans/multiidioma/README.md
(decisiones), docs/api-design.md (sección de alumnos tras 01) y CLAUDE.md (doble token, pantallas
de alumnos). Trabaja en shine-app/ con los comandos de nvm del gotcha 5.

Tareas:

1. **API**: createLearner y updateLearner aceptan langcode (es o ca); el tipo Learner y /shine/me
   lo exponen; updateLearner devuelve reset cuando el servidor lo indica.
2. **Alta de alumno** ("¿Con quién vas a trabajar?"): selector de idioma obligatorio con dos
   tarjetas grandes (Castellano, Català), preseleccionado el idioma de la app, con la nota "Para
   trabajar en los dos idiomas, crea un perfil por idioma". learnerForm (lógica pura) valida el
   valor y tiene tests.
3. **Ficha del alumno**: muestra el idioma; acción "Cambiar idioma" (solo owner) con ConfirmPanel
   que avisa de que se reinicia el progreso y ofrece "Crear otro perfil" como alternativa. Tras el
   cambio, refrescar /shine/me, pedir token de alumno nuevo (el anterior queda revocado) y volver
   al dashboard vacío.
4. **Selector de alumno y tarjetas**: etiqueta discreta del idioma (CA o ES) cuando el titular
   tiene alumnos en los dos idiomas; nunca banderas.
5. **Idioma de la app ligado al alumno activo**: en el store de auth, selectLearner fija el
   idioma de i18n al del alumno y clearLearner o logout vuelven al del dispositivo (es o ca, si no
   es). startRoute no cambia. Sustituye el conmutador temporal de 03. El player usa siempre el
   idioma del alumno activo y comprueba el langcode de la sesión cargada: si no coincide con el
   alumno, registra un aviso en consola y usa el de la sesión para player.*.
6. **Recursos traducidos**: apiFetch gana una opción lang que antepone el prefijo a la base de
   JSON:API (API_BASE/jsonapi para es, API_BASE/ca/jsonapi para ca); la usan areas.ts y messages.ts
   (y el ciclo si se muestra). Caché por idioma de esas listas. El resto de llamadas no cambia.
7. **Textos**: nuevas claves en ui y player de los catálogos es y ca.
8. **Tests**: learnerForm, startRoute (sin cambios de comportamiento), store de auth (idioma al
   seleccionar y al salir), tokenFlow sin cambios.

## Verificación

- tsc, lint y tests limpios.
- Recorrido en navegador con jose@test.com: alumno es y alumno ca del mismo titular; al cambiar
  de alumno cambian el idioma de la interfaz, los nombres de las áreas en el radar y los chips, y
  el mensaje de motivación; el alumno ca juega la sesión del lote bilingüe de 02 con el player en
  catalán; "Cambiar idioma" del alumno es a ca pide confirmación, reinicia y deja el dashboard sin
  sesiones ni estadísticas.
- Un alumno sin idioma (creado antes de 01) se trata como es.

## Al terminar

Marca la fila en plans/multiidioma/README.md y anota en docs/progress.md (FASE 18) qué se hizo y
los pendientes.
