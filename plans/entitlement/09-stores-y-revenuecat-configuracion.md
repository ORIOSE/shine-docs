# 09. Stores y RevenueCat: altas, productos y claves (checklist guiado)

- **Modelo recomendado: Opus.** Configuración guiada en consolas que son del usuario (App Store
  Connect, Play Console, RevenueCat); el entregable es un documento con ids y un checklist con
  fechas. Sin código salvo valores de configuración.
- Fase: 17, parte 17d. Alcance: cuentas del usuario y `docs/stores.md`.
- Dependencias: identidad de la app (`bundleIdentifier` y `package`, `plans/prompts/14b`). Las
  altas tienen esperas de días: **empezar el primer día de la fase**, en paralelo con el backend.

## Prompt

Lee `docs/monetization.md` §2, §6.1 y §8, `plans/prompts/14b-publicacion-stores.md` y
`plans/entitlement/README.md` (decisión: sin prueba gratuita de store). Pregunta al usuario qué
cuentas existen ya (Apple Developer, Google Play Console, RevenueCat) y quién es el titular legal.
Tu trabajo es ir paso a paso, pedir confirmación de cada alta y recoger los identificadores
resultantes en `docs/stores.md`. No inventes ids ni precios: los del diseño son hipótesis.

Tareas:

1. **Apple**: contrato de apps de pago, datos bancarios y fiscales; alta en el Small Business
   Program (15 % en la UE); registro de la app con el bundle id; grupo de suscripciones "Shine
   Familia" con `shine_family_monthly` y `shine_family_annual` (precio base y equivalencias por
   país, descripción localizada en castellano, captura para revisión); sin oferta introductoria
   (decisión del README); sandbox testers; secciones App Privacy y "Account deletion" previstas.
2. **Google**: cuenta de comerciante; app con el package; suscripciones `shine_family_monthly` y
   `shine_family_annual` con un plan base cada una (renovación automática), precios; license
   testers; pista de pruebas internas.
3. **RevenueCat**: proyecto, apps iOS y Android con sus credenciales (clave de App Store Connect
   API o In-App Purchase Key; cuenta de servicio de Play con permisos financieros), importación de
   productos, entitlement `family`, oferta por defecto con los dos paquetes, claves públicas por
   plataforma para la app (08), webhook apuntando a `https://{dominio}/shine/webhooks/revenuecat`
   con un valor de `Authorization` generado al azar (el mismo que irá a `settings.php`, 07),
   y, si se decide, clave de la API REST para el refresco de 07.
4. **`docs/stores.md`**: tabla de identificadores (bundle id, package, product ids, entitlement,
   oferta, ids de RevenueCat), dónde vive cada secreto (nunca el valor), quién tiene acceso a cada
   consola, estado de cada alta con fecha, y el guion de prueba en sandbox que ejecutará 08
   (compra, renovación acelerada, cancelación, reembolso, restauración).
5. **Decisiones a recoger del usuario** y anotar en `docs/monetization.md` §2 y §11: precios
   definitivos de partida, si habrá o no prueba de store (por defecto no), y categoría y rating de
   edad de la ficha (no Kids).

Verificación:
- En RevenueCat, el panel de productos muestra los cuatro productos (dos por store) "OK"; en cada
  consola el estado de las suscripciones es "Listo para enviar" o equivalente.
- `docs/stores.md` existe, sin secretos, con todas las filas rellenas o marcadas como pendientes
  con fecha.

Al terminar: marca la fila en `plans/entitlement/README.md` y actualiza `docs/progress.md`.
