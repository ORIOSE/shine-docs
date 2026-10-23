# 06b. App: estado del plan y borrado de cuenta en Ajustes

- **Modelo recomendado: Opus.** Dos secciones de Ajustes con el design system sobre `/shine/me`
  y `POST /shine/account/delete` (01b); requisitos de Apple ya enumerados en el diseño §8.
- Fase: 17, parte 17b. Alcance: solo app (`shine-app/`).
- Dependencias: 05. Puede ir en paralelo con 06.

## Prompt

Lee `docs/monetization.md` §4.1, §7 y §8 (borrado de cuenta, Apple 5.1.1), `docs/api-design.md`
("Cuentas y alumnos", "Entitlements"), `app/(auth)/settings.tsx`, `src/types/me.ts` (05) y
`src/components/ui/`. Mantén el tono de la app. Textos en un objeto propio por pantalla.

Tareas:

1. **Sección "Tu plan"**: lee `me.holder_status`: plan legible (`free` "Prueba gratuita",
   `family` "Familia", `courtesy` "Invitación", `professional` y `school` con su nombre), estado
   (`active` "activo", `grace` y `billing_retry` "pendiente de renovación", `paused` "en pausa",
   `expired` "caducado"), caducidad, cupo usado (`2 de 3 alumnos`, contando solo los `owner` sin
   organización) y, por alumno en `trial`, las sesiones de prueba que quedan. Si algún alumno tiene
   `covered_by: organization`, una línea "acceso de {nombre} activado por {centro}". Botones
   "Gestionar suscripción" y "Restaurar compras" deshabilitados con nota hasta 08 (no inventar
   enlaces a stores ni mencionar precios).
2. **Sección "Cuenta"**: email del titular, "Cerrar sesión" (ya existe) y **"Borrar cuenta"**:
   pantalla propia `app/(auth)/account/delete.tsx` que explica qué pasa con cada alumno según los
   datos de `me` (alumnos solo tuyos: se eliminan sus datos personales y se conservan de forma
   anónima; alumnos compartidos o de un centro: solo dejas de tener acceso), pide la contraseña,
   llama a `POST /shine/account/delete` y, con 200, hace `logout` y vuelve al login con un mensaje
   de despedida. 403 `invalid_password` → mensaje en el campo. Es requisito de Apple: accesible en
   dos toques desde Ajustes.
3. **Preferencia de fuente**: con 05 se guarda en el alumno activo; añade en su sección la línea
   "se guarda para {nombre}".
4. **Tests** de lógica pura: etiquetas de plan y estado, texto de cupo, texto de borrado según la
   composición de `me.learners`, validación del formulario de borrado.

Verificación:
- `npx tsc --noEmit`, `npm run lint`, `npm test` limpios.
- Recorrido manual con un titular normal: "Tu plan" cambia al crear una cortesía en el admin y
  volver a la pantalla (`refreshMe` al enfocar); con el alumno compartido de 01c el texto de
  borrado distingue los dos casos; borrar cuenta con contraseña errónea y correcta; después, el
  otro adulto sigue viendo al alumno compartido.

Al terminar: marca la fila en `plans/entitlement/README.md` y actualiza `docs/progress.md`.
**Hito H1 alcanzado** (con 06): se puede pilotar con cortesías.
