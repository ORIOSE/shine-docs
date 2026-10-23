# 06. App: gestión de alumnos en Ajustes, invitar a otro adulto y vincularse por código

- **Modelo recomendado: Opus.** Pantallas con el design system sobre endpoints ya existentes
  (01b, 01c) y el store de 05; las decisiones de flujo y de roles están cerradas en el diseño §3.3
  y §5.6.
- Fase: 17, parte 17b y §5.6. Alcance: solo app (`shine-app/`).
- Dependencias: 05.

## Prompt

Lee `docs/monetization.md` §3.3, §5.2, §5.6 y §7, `docs/api-design.md` ("Cuentas y alumnos"),
`app/(auth)/settings.tsx`, `app/(auth)/learners/*` (05), `src/components/ui/`, `src/theme/`,
`src/lib/api/learners.ts` y `src/types/me.ts`. Mantén el tono de la app y las áreas táctiles de
48 px. Textos de cada pantalla en un objeto propio (como `RATING_COPY`), listos para catalán e
inglés.

Tareas:

1. **Sección "Alumnos"** en Ajustes: lista de alumnos activos (avatar, nombre, etiqueta discreta
   "en pausa" cuando `paused`, y una línea con `covered_by` legible). Acciones según `role`:
   - `owner`: "Cambiar nombre o avatar" (PATCH), "Invitar a otro adulto", "Archivar" con
     confirmación en dos pasos que explique que se conservan sus datos y que libera una plaza.
   - `guardian` y `staff`: solo "Dejar de trabajar con {nombre}" (retirar mi acceso, con
     confirmación); el texto aclara que el alumno sigue con los demás adultos.
   Botón "Añadir" (reutiliza la pantalla de 05; con `learner_limit`, texto que explica el cupo y,
   hasta el paywall de 08, nada más). Si se archiva o se retira el alumno activo, volver al
   selector. Los archivados se listan plegados al final, sin acciones.
2. **Invitar a otro adulto** (`POST /shine/learners/{uuid}/invite`): pantalla con el código en
   grande (fuente legible, agrupado "ABC 123"), caducidad, botón "Compartir" (hoja nativa con
   `Share` de React Native; en web, copiar) y QR. Para el QR usa `react-native-qrcode-svg` (ya
   está `react-native-svg`; el usuario lo instala con `npx expo install`); si no se instala, el
   código en texto basta. Un alumno con invitación viva muestra la misma pantalla con "Generar
   otro" (que invalida el anterior).
3. **"Tengo un código del centro"** en `learners/new.tsx` y como entrada en Ajustes →
   "Alumnos": campo de 6 caracteres con normalización (mayúsculas, sin espacios),
   `POST /shine/learners/join`; 422 `invite_invalid` → "Este código no sirve o ha caducado. Pide
   otro a quien te lo dio"; 429 → "Demasiados intentos, espera un momento". Con éxito,
   `refreshMe()` y selección del alumno: aparece con su nombre, avatar y niveles sin repetir el
   bloque inicial (lo garantiza el servidor; la app solo navega al dashboard).
4. **Quién operó cada sesión** en "Mi progreso" y en el detalle de sesión: marca discreta
   ("contigo" si `field_operated_by` es el titular, "con {nombre}" si es otro adulto de `adults`,
   nada si está vacío). Sin estadísticas por adulto: solo la marca.
5. **Tests** de lógica pura: acciones visibles por `role`, normalización y validación del código,
   etiqueta de operador a partir de `adults`, texto de `covered_by`.

Verificación:
- `npx tsc --noEmit`, `npm run lint`, `npm test` limpios.
- Recorrido manual con dos titulares normales: A invita desde Ajustes, B canjea en "¿Con quién
  vas a trabajar?", B ve al alumno con sus niveles y sin bloque inicial; B no ve "Archivar" y sí
  "Dejar de trabajar"; las sesiones de A aparecen en el progreso de B como "con A"; A renombra y
  archiva, y B deja de verlo en el selector.
- Código mal escrito seis veces → mensaje de espera; código caducado (ajusta `field_expires` en el
  admin) → mensaje de código no válido.

Al terminar: marca la fila en `plans/entitlement/README.md` y actualiza `docs/progress.md`.
