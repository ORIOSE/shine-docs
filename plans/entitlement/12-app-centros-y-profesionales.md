# 12. App: código de centro, alumnos en plaza, liberación y textos para profesionales

- **Modelo recomendado: Opus.** Pantallas y variantes de texto con el design system sobre los
  endpoints de 10; la lógica de qué se muestra a quién está cerrada en §5.6 y §6.2.
- Fase: 17, parte 17e y §5.6. Alcance: solo app (`shine-app/`).
- Dependencias: 06 (gestión de alumnos y vínculo) y 10 (organizaciones).

## Prompt

Lee `docs/monetization.md` §3.4, §5.6, §6.2 (último punto), §7 y §8, `docs/api-design.md`
("Organizaciones"), `src/types/me.ts`, `app/(auth)/settings.tsx` (06, 06b),
`app/(auth)/learners/*` y `app/(auth)/paywall.tsx` (08, si ya existe; si no, deja los enganches
preparados). Mantén el tono de la app.

Tareas:

1. **"Tengo un código de centro"** (profesionales y docentes; distinto del código de alumno de
   06): entrada en Ajustes → sección nueva "Tu centro" y en la pantalla de primer alumno;
   `POST /shine/organizations/join`; con éxito, `refreshMe()` y la sección muestra organización y
   rol. Tipos: `me.organizations[]`.
2. **Crear alumno en plaza**: en `learners/new.tsx`, si `me.organizations` no está vacío, selector
   "¿Para quién es este perfil?" con "Mi familia" y cada organización; con organización, `POST
   /shine/learners {organization}`; 422 `organization_limit` → "El centro no tiene plazas libres;
   habla con la coordinación". Los alumnos en plaza muestran "acceso activado por {centro}" en el
   selector y en Ajustes (ya lo pinta `covered_by` desde 05).
3. **Acciones del personal del centro** en Ajustes → Alumnos, según `role` y membresía:
   "Invitar a la familia" (misma pantalla de código que 06), "Dar acceso a otro docente" (lista
   de miembros, `POST .../staff`), "Liberar del centro" con confirmación que explica que el
   historial queda con la familia y que, sin familia vinculada, el perfil se archiva.
4. **Textos del muro para profesionales** (§6.2): si el titular tiene organizaciones o
   `holder_status.source` es `stripe`, la pantalla que recibe el 402 (o `learner_limit`) nunca
   ofrece compra de store: "Tu centro o profesional debe activar tu acceso" con el nombre del
   centro si lo hay; en Android y web puede enlazar a la página de contratación de 11; en iOS no
   hay enlace ni mención a precios.
5. **Alumno liberado** (§5.6 "Familia" punto 7): si un alumno trae `released_by`, tarjeta en el
   dashboard y en el selector: "{centro} ha dejado de cubrir el acceso de {nombre}. Para seguir,
   elige un plan" con enlace al paywall de 08 (o al texto neutro si no aplica). `reason:
   released_by_organization` en el 402 usa el mismo texto.
6. **Tests** de lógica pura: decisión paywall de store frente a texto neutro según
   `organizations`, `source` y `covered_by`; acciones visibles para `coordinator`, `staff` y
   docente `owner`; texto de alumno liberado.

Verificación:
- `npx tsc --noEmit`, `npm run lint`, `npm test` limpios.
- Recorrido de 10 pero desde la app: coordinador y docente se unen por código, el docente crea
  una alumna en plaza, invita a la familia, la familia la ve con "acceso activado por {centro}" y
  sin muro; el docente la libera y la familia ve la tarjeta de aviso y, con la prueba agotada, el
  texto de `released_by_organization`; un profesional sin cobertura ve el texto neutro y nunca
  precios de store en iOS.

Al terminar: marca la fila en `plans/entitlement/README.md` y actualiza `docs/progress.md`.
**Hito H3** (con 11).
