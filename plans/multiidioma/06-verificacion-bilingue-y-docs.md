# 06. Verificación bilingüe de extremo a extremo y documentación

- **Modelo recomendado: Fable.** Hay que detectar lo que falta cruzando backend, app y contenido,
  y cerrar la documentación de referencia.
- Fase: 18 (multiidioma). Alcance: Drupal y app, sin funcionalidad nueva salvo correcciones.
- Dependencias: 01 a 05.

## Prompt

Lee plans/multiidioma/README.md, plans/multiidioma/analisis.md y las entradas de docs/progress.md
de la FASE 18. Ejecuta el recorrido completo y corrige lo que falle; si una corrección es grande,
anótala como pendiente en vez de hacerla aquí.

Recorrido (como usuario normal, nunca como usuario 1, gotcha 14):

1. Titular con dos alumnos del mismo niño, uno es y otro ca, dentro del cupo del plan gratuito
   (si el cupo es 1, usar una cortesía desde /admin/shine/entitlements/add).
2. Con cada alumno: bloque inicial completo, una sesión regular, fin de sesión con auto-evaluación,
   estadísticas. Comprobar que ninguna actividad del otro idioma aparece, que los nombres de áreas,
   chips, mensajes y textos del player salen en el idioma del alumno, y que las fechas y números
   se formatean en su locale.
3. Cambio de idioma del alumno es a ca: confirmación, reinicio (niveles a Level0 con log
   language_change, resúmenes borrados, sesiones despublicadas), token renovado, dashboard limpio,
   y la siguiente sesión generada en catalán.
4. Importación: un lote con registro bilingüe, uno solo ca y uno con error de idioma; duplicado
   dentro de un idioma (error) y mismo material en el otro (permitido); inventario y cobertura por
   idioma.
5. Técnica: drush cex y config:status limpios; kernel tests de shine_account, shine_level,
   shine_content y shine_entitlement en verde; tsc, lint y tests de la app limpios; watchdog sin
   errores; ninguna entidad con langcode en; términos fonológicos: 38 con langcode es (24 de
   sonoridad, 14 de esfuerzo) y 52 con langcode ca (33 y 19), nombres únicos por vocabulario e
   idioma, segunda ejecución de los dos scripts sin cambios.
6. Dispositivo real (Expo Go) en catalán: glifos de las fuentes, matriz con l·l y ny, player de
   sílabas con dígrafos, repetición rápida.

Documentación final:

- CLAUDE.md: sección "Idiomas" (modelo, prefijo JSON:API, alta de alumno con langcode, códigos con
  idioma, clave del media, scripts de términos por idioma, cómo probar con un alumno ca), tabla de
  módulos y comandos.
- docs/api-design.md, docs/level-system.md, docs/exercise-catalog.md, docs/conventions.md,
  docs/generador/Banco de imágenes.md, docs/monetization.md (dos perfiles por idioma) y
  docs/progress.md (cierre de la FASE 18 con pendientes).
- plans/multiidioma/README.md con todas las filas marcadas y lo que quedó fuera.

## Verificación

El recorrido anterior sin fallos y la documentación actualizada; lista explícita de pendientes.
