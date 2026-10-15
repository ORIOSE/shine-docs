# 08. Backend: administración y auditoría de niveles

- **Modelo recomendado: Opus.** Vistas y list builders sobre entidades ya definidas; el
  objetivo es poder explicar "por qué este usuario está en este nivel" sin tocar la BD.
- Fase: 15. Alcance: solo Drupal.
- Dependencias: 03 (entidades) y 04 (log con cambios reales).

## Prompt

Lee `docs/level-system.md` §1 (principio 4: "cualquier cambio de nivel se explica en una
frase") y §4, y el módulo `shine_level` tal como está tras 04. Prefiere Views exportadas en
config a list builders custom cuando sea posible (memoria del proyecto: estándares Drupal).

Tareas:

1. **Vista "Niveles por usuario"** (`/admin/shine/levels`): tabla de `userarealevel` con
   usuario (display name), área, nivel, nivel en prueba, cerrada, evidencia, última evaluación;
   filtros expuestos por usuario y área; ordenable. Permiso `administer shine level`.
2. **Vista "Histórico de niveles"** (`/admin/shine/levels/log`): tabla de `userarealevel_log`
   con fecha, usuario, área, de → a, razón y enlace a la sesión; filtros por usuario, área y
   razón. Desde la vista anterior, enlace contextual "ver histórico" por fila.
3. **Pestaña en el perfil de usuario** (`/user/{uid}/levels`, local task) que muestra las dos
   vistas filtradas por ese usuario, para que un terapeuta o el admin vea el caso completo.
4. **Vista de sesiones generadas** (`/admin/shine/sessions`): nodos `session` con dueño,
   tipo, razón, secuencia, creada, completada. Sirve para comprobar el generador sin
   consultar la BD.
5. **Acción de administración "Reiniciar niveles"** en la pestaña de usuario: pone todas las
   áreas en Level0, `closed = false`, `evidence = 0`, `field_onboarding_state = evaluating`,
   escribiendo un log con `reason = reset` (añade `reset` a las razones admitidas y a §4 del
   diseño). Con confirmación. Imprescindible para probar el bloque inicial varias veces con
   el mismo usuario.
6. Exporta config (`views.view.*`, menús, permisos) y comprueba `cim` idempotente.

Verificación:
- Tras ejecutar un recorrido del subplan 04 o 05, las vistas muestran lo esperado y los
  enlaces entre ellas funcionan.
- El reinicio deja al usuario como recién registrado y el generador vuelve a dar una sesión
  `initial`.
- Un usuario normal no puede acceder a ninguna ruta de admin de `shine_level`.

Al terminar: marca la fila en `plans/level-sistem/README.md` y actualiza `docs/progress.md` y
`CLAUDE.md` (rutas de admin en "Comandos útiles" o sección propia).
