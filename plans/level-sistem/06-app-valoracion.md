# 06. App: valoración "¿Cómo ha ido?" en sesión y por actividad

- **Modelo recomendado: Opus.** UI con componentes del design system y patrón ya existente
  (`SessionFeedbackPrompt`); las decisiones de tono están cerradas en §2 del diseño.
- Fase: 15. Alcance: solo app (`shine-app/`).
- Dependencias: 01a (`overall` en sessionfeedback, `field_session_kind` en session) y 02
  (`activityfeedback`). Puede hacerse en paralelo con 03, 04 y 05.

## Prompt

Lee `docs/level-system.md` §2, §3 y §9, `shine-app/src/components/session/SessionFeedbackPrompt.tsx`,
`shine-app/src/components/activities/ActivityBase.tsx` (fase `completed`),
`shine-app/src/lib/api/` (cómo se hace el POST de `sessionfeedback`) y el design system en
`src/theme` y `src/components/ui`. Respeta el tono: nunca "mal", "error", "test" ni
"evaluación" en pantalla.

Tareas:

1. **Tipos**: `src/types/session.ts` gana `field_session_kind`, `field_evaluation_scope`,
   `field_evaluation_reason`, `field_evaluation_seq`, `field_completed_at`; `src/types/sessionfeedback.ts`
   (o donde esté) gana `overall`; nuevo `src/types/activityfeedback.ts` espejo de la entidad.
   Tipo `Rating = 'easy' | 'ok' | 'hard'` en un único sitio.
2. **`RatingPicker`** (`src/components/session/RatingPicker.tsx`): tres opciones en orden fijo
   "Demasiado fácil" / "Bien así" / "Me ha costado", iconografía de esfuerzo sin valencia (tres
   pesas de tamaño creciente; añade los iconos a `Icon.tsx` si no existen), área táctil 48 px,
   accesible; "Ahora no" como acción secundaria. Todos los textos en un único objeto
   `RATING_COPY` exportado, para traducir a catalán e inglés más adelante sin tocar componentes.
3. **`SessionFeedbackPrompt`**: añade el paso `overall` como primero de los tres, usando
   `RatingPicker`; `onSubmit` pasa `overall` (o `null` si se salta ese paso pero no los
   otros); el POST de `sessionfeedback` incluye `overall`. Saltar el prompt entero sigue sin
   crear nada.
4. **`ActivityFeedbackPrompt`** (mismo `RatingPicker`) que `ActivityBase` muestra en la fase
   `completed`, antes de la tarjeta de motivación, solo cuando la sesión activa es de ajuste
   (`field_session_kind === 'evaluation'`). `ActivityBase` no debe conocer la sesión: recibe
   una prop (`askRating?: boolean` y `onRating?`) que la pantalla de sesión decide. El POST va
   a `activityfeedback` en `src/lib/api/feedback.ts` (o el fichero que ya agrupe
   `sessionfeedback`). Una valoración saltada no crea entidad.
5. **Pantalla de sesión** (`app/(auth)/session/[id].tsx`): en sesiones de ajuste no se
   muestran las preguntas de fin de sesión (`shouldAskSessionFeedback` recibe el `kind` o la
   pantalla lo corta antes). Misma celebración al terminar que una regular.
6. **Cierre de sesión en servidor**: donde hoy se decide que la sesión ha terminado (última
   actividad cerrada), añade la llamada `POST /shine/session/{uuid}/complete` (04) **después**
   de enviar o saltar la auto-evaluación, para que el servidor ya tenga `overall` y los
   `activityfeedback`. Si el endpoint todavía no existe en el entorno, la llamada debe fallar
   en silencio con un `console.warn` y no bloquear la celebración; déjalo preparado en
   `src/lib/api/sessions.ts` con su tipo de respuesta.
7. Tests: `src/lib/__tests__/` para la lógica pura (qué paso se muestra, qué se envía al
   saltar, orden de opciones fijo) siguiendo el patrón de los tests existentes.

Verificación:
- `npx tsc --noEmit`, `npm run lint` y `npm test` limpios (ejecutar en terminal del usuario con
  `nvm use 21`, gotcha 5).
- Recorrido manual con una sesión regular (tres preguntas, la primera "¿Cómo ha ido?") y con
  una de ajuste creada a mano en Drupal (pregunta tras cada actividad, sin preguntas finales).
- `GET /jsonapi/sessionfeedback/sessionfeedback` muestra `overall`; los `activityfeedback`
  aparecen con el usuario correcto.

Al terminar: marca la fila en `plans/level-sistem/README.md`, actualiza `docs/progress.md` y
`docs/level-system.md` §10 (texto e icono elegidos).
