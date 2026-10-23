# 11. Backend: Stripe Checkout, Customer Portal y webhook para profesionales y centros

- **Modelo recomendado: Fable.** Pagos: firma de webhooks, idempotencia, mapeo de suscripción
  con cantidad a entitlement de organización, y una página de contratación en Drupal que crea o
  reutiliza al titular. Los errores son dinero o acceso indebido.
- Fase: 17, parte 17e. Alcance: solo Drupal (`shine/`), módulo `shine_entitlement` (y una ruta
  web en `shine_org`).
- Dependencias: 03 (catálogo con `stripe:price_...`) y 10 (`organization`, `field_organization`).

## Prompt

Lee `docs/monetization.md` §4.3, §6.2, §6.3 y §8, `plans/entitlement/README.md` ("Facturación
profesional", "Secretos de webhooks", "Idempotencia"), el procesador de RevenueCat de 07 (misma
forma: ruta fina, servicio gordo, fixtures) y la documentación de Stripe sobre Checkout en modo
suscripción, Customer Portal, `stripe-php` y verificación de firma de webhooks
(`Webhook::constructEvent`). Decisión del README: Stripe Checkout + Customer Portal, sin Drupal
Commerce; la factura la emite Stripe (con Stripe Tax si el usuario lo activa). Trabaja en `shine/`.

Tareas:

1. **Dependencia y secretos**: `ddev composer require stripe/stripe-php`; claves en `settings.php`
   (`shine_entitlement.stripe_secret_key`, `shine_entitlement.stripe_webhook_secret`), nunca en
   config. Documenta en `docs/deploy.md` o CLAUDE.md.
2. **Página de contratación** (`/pro`, módulo `shine_org`, sesión Drupal por cookie): el
   profesional o coordinador entra con su cuenta de la app (mismo email y contraseña), ve los
   planes `professional` y `school` del catálogo con sus precios (leídos de Stripe al vuelo con
   caché), elige cantidad y organización (crea una nueva con nombre y datos fiscales mínimos si no
   tiene, con membresía `coordinator`) y pulsa "Contratar": `POST /shine/billing/checkout {plan,
   quantity, organization}` crea una Checkout Session (`mode: subscription`, `client_reference_id`
   = UUID del titular, `metadata.organization` = UUID, `customer_email` o `customer` reutilizado
   por `field_stripe_customer` en la organización) y redirige. Página de vuelta `/pro/gracias` que
   consulta `/shine/me` y muestra el estado. `POST /shine/billing/portal` devuelve la URL del
   Customer Portal (cambiar cantidad, tarjeta, cancelar). Nada de esto se enlaza desde la app iOS
   (§8); en Android y web el texto neutro de 12 puede apuntar a `/pro`.
3. **Webhook `POST /shine/webhooks/stripe`** (anónimo, verifica la firma con el secreto; 400 si
   falla): servicio `shine_entitlement.stripe_processor` que maneja `checkout.session.completed`,
   `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`,
   `invoice.paid` e `invoice.payment_failed`. Upsert por (`source` `stripe`, `external_id` = id de
   suscripción): `field_holder` = titular del `client_reference_id`, `field_organization`,
   `field_plan` y `field_max_learners` desde `price_id` + `quantity` (ítem único; con varios ítems,
   422 y watchdog), `field_expires_at` = `current_period_end` más el periodo de gracia que decidas
   (documéntalo), estados: `active`/`trialing` → `active`/`trial`, `past_due` → `billing_retry`,
   `unpaid` y `canceled` → `expired` al llegar la fecha, `paused` → `paused`. Idempotencia por
   `event.id` (key-value con caducidad) y por `created` del evento frente a `field_event_timestamp`.
   Precio desconocido → 422 y watchdog para que Stripe reintente. Invalida la caché del acceso.
4. **Tests kernel** con fixtures JSON de Stripe (en `tests/fixtures/stripe/`): firma inválida
   400; alta por checkout crea entitlement de organización con cupo `15 × quantity`; subida de
   cantidad recalcula; `payment_failed` mantiene cobertura como `billing_retry`; `subscription.deleted`
   expira; evento repetido o antiguo no cambia nada; precio desconocido 422.
5. **Pruebas locales**: documenta el uso de la CLI de Stripe (`stripe listen --forward-to
   https://shine.ddev.site/shine/webhooks/stripe`) y tarjetas de prueba en `docs/api-design.md`.
6. **Documentación**: `docs/api-design.md` ("Billing" y "Webhooks"), `docs/monetization.md` §6.2
   y §11 (decisión Checkout), `docs/stores.md` (ids de precio de Stripe, modo test y live).

Verificación:
- En modo test: un titular normal contrata `professional` × 2 desde `/pro`, el webhook crea el
  entitlement (`max_learners` 30) ligado a su organización, y una alumna en plaza queda cubierta
  sin `drush cr`; desde el Customer Portal baja a 1 y el cupo se recalcula; cancela y la cobertura
  dura hasta `expires_at`.
- `ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_entitlement` en
  verde; sin secretos en git (`git log -p` de los ficheros tocados).

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md` y
`CLAUDE.md` (endpoints, secretos, dependencia composer).
