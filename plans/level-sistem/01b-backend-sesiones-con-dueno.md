# 01b. Backend: sesiones con dueño real y acceso por usuario

- **Modelo recomendado: Fable.** Decisión de acceso (node grants) que afecta a JSON:API, al
  admin y a las sesiones ya existentes. Un error aquí es invisible con el user 1 y deja al
  usuario viendo sesiones ajenas o ninguna.
- Fase: 15. Alcance: solo Drupal.
- Dependencias: 01a.

## Prompt

Lee `docs/level-system.md` §4 (apartado `node.session`), `CLAUDE.md` (gotchas 14 y 16) y la
memoria de preferencias del proyecto: se prefieren APIs estándar de Drupal a código custom.

Objetivo: las sesiones generadas pertenecen a un usuario (`uid` del nodo) y cada usuario solo
ve las suyas en `GET /jsonapi/node/session`, tanto en colección como en detalle. El admin sigue
viendo todas.

Tareas:

1. **Decide y documenta el mecanismo de acceso.** Los nodos no usan `hook_jsonapi_*_filter_access`
   (eso es para entidades custom); su filtrado en colecciones se hace por node grants. La vía
   estándar es `hook_node_access_records()` + `hook_node_grants()` en un módulo custom pequeño
   (`shine_session_access` o dentro de `shine_level` si prefieres que el subplan 03 lo absorba;
   razona cuál y deja constancia). Escribe un grant con realm propio (por ejemplo
   `shine_session_owner`, gid = uid) para el bundle `session`; el resto de bundles no se tocan.
   Recuerda `node_access_rebuild()` tras instalar y que los grants solo se evalúan si existe al
   menos un módulo que implemente `hook_node_grants`.
2. **Sesiones existentes.** Hoy hay sesiones hechas a mano, con `uid` del admin. Decide qué pasa
   con ellas: la recomendación es conservarlas como material de referencia visible solo para el
   admin (quedan fuera del dashboard de cualquier usuario normal). Si el usuario del proyecto
   prefiere otra cosa, pregunta antes de borrar nada.
3. **`group_session`**: comprueba si sigue teniendo sentido con sesiones generadas por usuario.
   No lo retires en este subplan; anota en `docs/level-system.md` §10 qué se propone.
4. Verifica que la vista de administración de contenido (`/admin/content`) sigue mostrando
   todas las sesiones al admin y que un editor sin `bypass node access` no ve las de otros.
5. Exporta config (`core.extension` con el módulo nuevo, permisos si los hay).

Verificación (obligatoria con dos usuarios normales, A y B, creados por REST):
- Crea una sesión con `uid = A` por `php-eval`. `GET /jsonapi/node/session` como A la devuelve;
  como B devuelve `data: []`; `GET /jsonapi/node/session/{uuid}` como B devuelve 403 o 404.
- El user 1 sigue viendo todo.
- Usa el patrón de `account_switcher` + sub-request del gotcha 14 para probar sin montar OAuth.
- `ddev drush cim -y` idempotente.

Al terminar: marca la fila en `plans/level-sistem/README.md`, actualiza `docs/progress.md` y
añade a `CLAUDE.md` un gotcha con el mecanismo elegido y el aviso de `node_access_rebuild`.
