# 07. App: dashboard con sesiones propias y generación bajo demanda

- **Modelo recomendado: Opus.** Pantallas ya diseñadas (12a, 12b) que cambian de origen de
  datos y ganan un botón; retirada de `LevelChip`. Sin decisiones de modelado.
- Fase: 15. Alcance: solo app.
- Dependencias: 01b (sesiones por dueño), 05 (endpoint `generate`), 06 (tipos y prompts).

## Prompt

Lee `docs/level-system.md` §9 y §10, el README de `plans/level-sistem/` (decisión por defecto:
botón explícito), `app/(auth)/dashboard.tsx`, `src/lib/sessionCards.ts`, `src/lib/api/sessions.ts`
y `plans/prompts/12a-dashboard.md` para no romper el diseño validado.

Tareas:

1. **Origen de datos**: `getSessions()` ya no necesita filtrar por usuario (el servidor solo
   devuelve las propias tras 01b), pero añade `filter[uid.id]={uuid}` igualmente como
   defensa en profundidad y ordena por `created` descendente. Incluye los campos nuevos en los
   tipos (06 ya los definió).
2. **Tarjetas de sesión**: retira `LevelChip` de las tarjetas y de la cabecera del detalle de
   sesión (§9). Mantén los chips de área. Si `LevelChip` queda sin usos, elimínalo de
   `src/components/ui` y de `index.ts`. Las sesiones de ajuste se presentan con su nombre
   ("Sesión para conocerte" en el bloque inicial, "Sesión de ajuste" en el resto) y un
   subtítulo breve y amable; nunca la palabra "evaluación".
3. **Nueva sesión**: cuando no hay ninguna sesión pendiente (todas con `field_completed_at` o
   lista vacía), la tarjeta "Continuar" se sustituye por un `EmptyState` con botón "Nueva
   sesión" que llama a `POST /shine/session/generate` (`src/lib/api/sessions.ts`), navega a
   la sesión devuelta y refresca la lista. Estados de carga y error con `InlineAlert`.
   Deja un flag `AUTO_GENERATE_SESSION` en `src/lib/config.ts` (por defecto `false`) que,
   si está activo, dispara la generación al cargar el dashboard sin botón; no lo actives.
4. **Lista de sesiones**: solo las del usuario; las completadas se muestran como hasta ahora
   (bloqueadas, con la felicitación). Decide un límite razonable de sesiones mostradas o
   paginación simple si la lista crece (una por día de práctica).
5. **Mi progreso**: comprueba que las estadísticas no dependen de las sesiones antiguas hechas
   a mano (01b decide si siguen siendo visibles para el admin). Si alguna consulta usaba
   `node/session` sin filtro de usuario, ajústala.
6. Tests de la lógica pura (`sessionCards.ts`: qué tarjeta se muestra cuando no hay
   pendientes; nombre según `kind` y `reason`).

Verificación:
- `npx tsc --noEmit`, `npm run lint`, `npm test` limpios.
- Recorrido manual con un usuario nuevo registrado desde la app: dashboard vacío, "Nueva
  sesión" genera una "Sesión para conocerte", se completa con las valoraciones por actividad,
  al volver al dashboard la siguiente "Nueva sesión" genera la segunda del bloque. Con un
  segundo usuario, no se ve ninguna sesión del primero.

Al terminar: marca la fila en `plans/level-sistem/README.md` y actualiza `docs/progress.md` y
`docs/level-system.md` §10 (decisión botón/automático).
