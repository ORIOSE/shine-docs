# 05. Mi plan: estado de la cobertura, licencia profesional, portal de Stripe y contratación dentro del panel

- **Agente recomendado: Opus 5.5 con la skill `frontend-design`.** Especificación cerrada y todo el
  servicio ya existe (`EntitlementAccess`, `BillingManager`, `ProCheckoutForm`); el trabajo es
  componer la página por tipo de titular y mover `/pro` al panel sin romper el enlace que ya usa la
  app.
- Fase: 21. Alcance: solo Drupal (`shine/`): `shine_panel` (rutas `/panel/plan*`) y `shine_org`
  (`/pro` pasa a redirigir; el formulario de contratación se reutiliza).
- Dependencias: 02. En paralelo con 03.

## Prompt

Lee `docs/dashboards.md` §4.3, §5.4 y §6.6, `docs/monetization.md` §2, §4, §6.2 y §8 (en iOS no hay
compra ni precios de Familia fuera de la app; en la web no hay botón de compra de Familia),
`docs/lovable/INDEX.md` sección 4 (`panel.plan.tsx`) y 8 (qué del prototipo no existe: historial
de cobros, método de pago, datos fiscales del titular), `docs/lovable/panel/src/routes/panel.plan.tsx`,
`docs/stores.md` (ids de productos y enlaces de gestión de suscripciones de las tiendas), y en
Drupal `shine_entitlement` (`EntitlementAccess::holderStatus`, `HolderStatus`, `Entitlement::PLANS`
y `STATUSES`, catálogo `shine_entitlement_plan`), `shine_org` (`ProController`, `ProCheckoutForm`,
`BillingManager::offers`, `checkout`, `portal`, `OrganizationManager::toArray`: `plan`,
`max_learners`, `used_seats`, `covered`, `expires_at`; `Organization`: `field_tax_id`,
`field_billing_email`, `field_stripe_customer`) y `docs/api-design.md` ("Billing", "Entitlements").
Trabaja en `shine/`.

Tareas:

1. **`/panel/plan` para todos los titulares**: tarjeta "Tu plan" con `holderStatus`: nombre del
   plan del catálogo (o "Plan gratuito"), estado con badge de texto ("Activo", "Prueba", "Periodo
   de gracia", "Pago pendiente", "En pausa", "Caducado", "Cortesía"), origen ("App Store", "Google
   Play", "Web", "Cortesía"), fecha de fin o de renovación, "Renovación cancelada: acceso hasta el
   {fecha}" si `cancelled_at`, y "x de y alumnos" del cupo (`maxLearners` y alumnos `owner`
   activos). Sin importes: ni RevenueCat ni nosotros guardamos el precio pagado; el prototipo lo
   inventa.
2. **Bloque de familia** (origen store o gratuito): "Gestionar suscripción" como enlace a la
   gestión de la tienda según `source` (App Store: `https://apps.apple.com/account/subscriptions`;
   Google Play: `https://play.google.com/store/account/subscriptions`), con el texto "La suscripción
   pertenece a la tienda: cambios y cancelación se hacen allí"; "Alumnos en prueba": barra por
   alumno con `covered_by = trial` ("{nombre}: x de N sesiones de prueba usadas") y alumnos en
   pausa con su motivo; aviso "¿Cómo contratar?" con el texto del prototipo ("Abre Shine en el móvil
   o la tablet, ve a Ajustes y elige un plan. El cobro lo hace la tienda."), **sin precios ni botón
   de compra**. "Historial de cobros": no existe el dato; en su lugar, "Los recibos los emite la
   tienda" con el enlace anterior. Si el titular tiene una cortesía, se dice y no se enseña nada de
   tiendas.
3. **Bloque de organización** (una tarjeta por membresía, de `OrganizationManager::toArray`):
   nombre, tipo (gabinete / centro), tu rol, licencia (plan del catálogo, asientos `field_quantity`
   del entitlement que cubre, "x de y plazas", estado, renovación o fin, cancelación programada),
   estado del pago como badge ("Al día", "Pago pendiente" en `billing_retry` con el texto "Stripe
   está reintentando el cobro; el acceso se mantiene unos días"). Solo para **coordinación**:
   "Abrir portal de cliente" (formulario POST que llama a `BillingManager::portal()` y redirige;
   `409 no_customer` → mensaje "Todavía no hay una suscripción de Stripe para esta organización";
   `503` → "La contratación por web no está disponible ahora mismo"), "Datos de facturación"
   (formulario sobre la organización: nombre o razón social (`label`), NIF (`field_tax_id`), email
   de facturación (`field_billing_email`); escribe `organization.billing_update` en `audit_log`) y
   "Contratar o ampliar" (enlace a la tarea 4). Para un miembro que no coordina: "Tu acceso lo
   gestiona {organización}; habla con {nombre del coordinador}". Un centro con licencia manual (sin
   Stripe): sin portal, con "Contrato gestionado por Shine: escríbenos desde Ayuda para ampliarlo".
4. **Contratación dentro del panel**: `/panel/plan/contratar` muestra `ProCheckoutForm` dentro de la
   concha del panel (mismo formulario, reestilizado por el tema de 01; solo si el titular puede
   coordinar o crear una organización, como hoy); `/panel/plan?gracias=1` es la vuelta de Checkout
   (`success_url`): aviso "Gracias. Stripe nos avisa en unos segundos; si tu licencia todavía no
   aparece activa, espera un momento y recarga" y la tabla de organizaciones de `ProController::thanks`.
   `/pro` y `/pro/gracias` pasan a **redirigir** (302) a esas rutas, porque la app los enlaza en
   Android y web (FASE 17 subplan 12) y no queremos tocar la app ahora; `BillingManager` actualiza
   `success_url` y `cancel_url`. Las rutas `POST /shine/billing/*` no cambian.
5. **Avisos de Apple** (§8): revisa que ninguna página del panel muestre precios ni enlaces de
   compra del plan Familia, y que la contratación solo hable de planes profesional y de centro.
   Deja la comprobación como un test kernel sencillo que recorre `/panel/plan` con un titular de
   familia y busca "€" en la respuesta.
6. **Tests kernel**: página de plan de un titular gratuito con un alumno en prueba (texto "x de 8"),
   con cortesía, con cobertura de store (`app_store`, enlace de Apple), coordinador con licencia de
   Stripe (portal: POST devuelve redirección a la URL que da `BillingManager`, con el cliente
   simulado), miembro no coordinador (sin portal, 403 si fuerza el POST), `/pro` → 302.
7. **Documentación**: `docs/dashboards.md` §4.3, §5.4 y §6.6, `docs/monetization.md` §6.2 (la
   página de contratación vive en el panel) y `docs/api-design.md` ("Billing": nuevas URL de vuelta),
   `CLAUDE.md` (rutas `/pro` → panel), `docs/progress.md`.

Verificación:
- `jose@test.com` (cortesía familiar): "Tu plan" dice cortesía, sin tiendas ni precios; Pau y Marta
  cubiertos. Un titular gratuito con un alumno con 6 regulares completadas ve "6 de 8".
- Coordinador de prueba con licencia manual: tarjeta de organización sin portal y con el texto de
  contrato gestionado por Shine; con una suscripción de Stripe simulada por el webhook (fixtures de
  `shine_entitlement/tests/fixtures/stripe/` firmados a mano, CLAUDE.md) la tarjeta muestra asientos,
  plazas y renovación; "Abrir portal" sin clave de Stripe da el mensaje de no disponible, no un 500.
- `/pro` en el navegador acaba en `/panel/plan/contratar` con la sesión iniciada; anónimo → login →
  contratación.
- Navegador a 390 px y 1280 px; `grep -c "€"` en el HTML de `/panel/plan` de una familia = 0.
- `cd shine && ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_panel`
  y `.../shine_org` en verde; `config:status` limpio.

Al terminar: marca la fila en `plans/backoffice/README.md`, actualiza `docs/progress.md`,
`docs/dashboards.md`, `docs/monetization.md`, `docs/api-design.md` y `CLAUDE.md`.
