# 09. Verificación de extremo a extremo, contenido de prueba y documentación

- **Modelo recomendado: Fable.** Hay que juzgar si el sistema se comporta como el diseño
  pretende con un usuario real, no solo si los tests pasan; y decidir qué desviaciones son
  bugs y cuáles son parámetros mal puestos.
- Fase: 15. Alcance: Drupal + app + docs.
- Dependencias: todos los subplanes anteriores.

## Prompt

Lee `docs/level-system.md` entero, el README de `plans/level-sistem/` y `docs/progress.md`
(sección FASE 15). Ejecuta todo con usuarios normales creados por la app (gotcha 14).

Tareas:

1. **Contenido de prueba**: script drush (`shine-level:seed-content`, en `shine_level`, solo
   para entornos de desarrollo) que cree actividades publicadas con área principal y nivel
   para cubrir las 5 áreas × 3 niveles con al menos 3 actividades por celda, más 6 actividades
   del ciclo "Sílabas" con pesos. Reutiliza los bundles existentes (`activity`, `activity_blink`,
   `activity_image_position`) con contenido mínimo jugable. Marca las actividades con un tag
   para poder borrarlas (`shine-level:unseed-content`).
2. **Recorrido A, bloque inicial**: usuario nuevo; 4 sesiones "para conocerte" valorando con
   un patrón conocido (por ejemplo, área 1 siempre `easy`, área 2 `easy` y luego `hard`, área 3
   `ok`, área 4 saltada siempre, área 5 `hard`). Comprueba en las vistas de 08 que los niveles
   finales son los que predice §5.1 y que `field_onboarding_state` pasa a `regular`.
3. **Recorrido B, sesiones regulares y disparadores**: con ese usuario, encadena sesiones
   regulares con `overall = easy` tres veces y comprueba que la siguiente generada es
   `trigger_easy` con `probe_level + 1`; complétala (2 sesiones) con `easy` y verifica la
   subida; luego fuerza `evidence` con `hard` + `hardest` hasta el umbral y verifica la
   dirigida de 3 actividades. Comprueba que el ciclo "Sílabas" aparece una vez por sesión
   regular, en orden de peso, y que no repite hasta dar la vuelta.
4. **Recorrido C, periódica**: baja `periodic_sessions` a 2 y `periodic_min_days` a 0 en el
   formulario de ajustes y comprueba que se dispara; devuelve los valores por defecto.
5. **Recorrido D, aislamiento**: segundo usuario en paralelo; ninguna sesión, feedback ni nivel
   del primero es visible por JSON:API ni en la app.
6. **Rendimiento básico**: mide el tiempo de `generate` y de `complete` con el contenido de
   prueba; si alguna consulta por `activitysummary` o `activityfeedback` crece con el
   histórico sin índice, añade el índice en la entidad y anótalo.
7. **Documentación**: `docs/level-system.md` pasa de "diseño" a "implementado" con las
   desviaciones integradas; `docs/architecture.md` y `docs/api-design.md` ganan la sección de
   niveles y los endpoints `generate` y `complete`; `CLAUDE.md` recoge los comandos drush
   nuevos y los gotchas descubiertos; `docs/progress.md` cierra la FASE 15 con lo pendiente
   (§10 del diseño actualizado).
8. Lista de bugs encontrados y corregidos en este subplan, con su causa, en `docs/progress.md`.

Verificación:
- Los cuatro recorridos cumplen lo que predice el diseño o la desviación está documentada y
  decidida con el usuario del proyecto.
- `ddev drush cim -y` idempotente; tests kernel en verde; `npx tsc --noEmit`, `npm run lint` y
  `npm test` limpios.

Al terminar: marca la fila en `plans/level-sistem/README.md`.
