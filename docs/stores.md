# Stores y RevenueCat: identificadores, secretos y estado de las altas

Referencia de la FASE 17, subplan 09 (`plans/entitlement/09-stores-y-revenuecat-configuracion.md`).
Recoge los identificadores de App Store Connect, Google Play Console y RevenueCat, dónde vive cada
secreto (nunca el valor), el estado de cada alta y el guion de prueba en sandbox que ejecutará el
subplan 08. Diseño en `docs/monetization.md` §2, §6.1 y §8; webhook en `docs/api-design.md`
("Webhooks").

> **Estado a 2026-10-29: altas en trámite.** Los valores marcados **EJEMPLO** son marcadores de
> posición para poder avanzar (subplan 08, configuración de la app); no existen en ninguna
> consola. Se sustituyen cuando se complete cada alta. Los marcados **decidido** son nuestros y ya
> están en el código o en `config/sync`.

---

## 1. Titular legal y cuentas

| Cuenta | Titular | Estado | Fecha |
|---|---|---|---|
| Apple Developer Program | Persona física (autónomo), cuenta individual | En trámite | 2026-10-29 |
| Contrato de apps de pago (App Store Connect → Business) | El mismo | Pendiente del alta anterior | |
| App Store Small Business Program | El mismo | Pendiente (pedir en cuanto haya contrato de pago) | |
| Google Play Console | Persona física, cuenta personal | En trámite | 2026-10-29 |
| Perfil de pagos de Google (cuenta de comerciante) | El mismo | Pendiente del alta anterior | |
| RevenueCat | Ya existe | Proyecto sin configurar | 2026-10-29 |

Consecuencias de ser **persona física** (a tener en cuenta antes de cerrar las altas):

- **Apple**: cuenta individual, sin número D-U-N-S. En la tienda el vendedor aparece con el
  nombre de la persona, no con el de la marca. Para vender en la UE hay que declararse
  "comerciante" (Digital Services Act) y Apple **publica dirección, teléfono y email** en la ficha.
- **Google**: en una cuenta personal que monetiza, la **dirección se muestra en la ficha**. Además,
  las cuentas personales creadas desde noviembre de 2023 necesitan una **prueba cerrada con al
  menos 12 testers durante 14 días seguidos** antes de poder pedir acceso a producción: cuenta en
  el calendario del piloto (14b).
- Si más adelante se crea una sociedad, las apps se pueden transferir a otra cuenta en las dos
  stores, pero las suscripciones activas y las reseñas lo complican: mejor decidirlo antes de
  publicar.

Acceso a cada consola: hoy solo el titular. Cuando haya más personas, anotar aquí quién y con qué
rol (App Store Connect: Admin / Finance / Developer; Play Console: permisos por app; RevenueCat:
Admin / Developer).

---

## 2. Identificadores

| Qué | Valor | Estado |
|---|---|---|
| Nombre de la app | "Shine" provisional | El nombre definitivo está por decidir (14b) |
| Bundle id (iOS) | `com.example.shine` | **EJEMPLO**: depende del nombre; no se puede cambiar una vez registrado |
| Package (Android) | `com.example.shine` | **EJEMPLO**: mismo valor que iOS |
| Apple Team ID | `ABCDE12345` | **EJEMPLO** |
| Apple App ID (numérico, App Store Connect) | `0000000000` | **EJEMPLO** |
| Grupo de suscripciones (Apple) | "Shine Familia" | Nombre provisional; se crea con el alta |
| Producto mensual | `shine_family_monthly` | **Decidido** (§2; catálogo `family`) |
| Producto anual | `shine_family_annual` | **Decidido** |
| Plan base Play, mensual | `monthly` (renovación automática, 1 mes) | **Decidido** 2026-10-29 |
| Plan base Play, anual | `annual` (renovación automática, 1 año) | **Decidido** 2026-10-29 |
| Product id en RevenueCat y en el webhook | App Store: `shine_family_monthly`, `shine_family_annual`. Play: `shine_family_monthly:monthly`, `shine_family_annual:annual` | **Decidido**; los cuatro están en `shine_entitlement.plan.family` |
| Entitlement de RevenueCat | `family` | **Decidido** (§6.1) |
| Oferta de RevenueCat | `default` (oferta actual), paquetes `$rc_monthly` y `$rc_annual` | **Decidido** |
| Proyecto de RevenueCat | `proj00000000` | **EJEMPLO** |
| Clave pública iOS (SDK) | `appl_EJEMPLO` | **EJEMPLO** (la usará 08) |
| Clave pública Android (SDK) | `goog_EJEMPLO` | **EJEMPLO** (la usará 08) |
| URL del webhook | `https://{dominio de producción}/shine/webhooks/revenuecat` | Pendiente del dominio (14a) |
| `app_user_id` | UUID de Drupal del **titular** (`Purchases.logIn`), nunca el del alumno | **Decidido** (§6.1) |

En el catálogo de planes (`/admin/config/shine/plans`) también siguen `play_store:shine_family_monthly`
y `play_store:shine_family_annual` sin plan base: los usan los fixtures de los tests de 07. Cuando
haya eventos reales de Play se puede comprobar en el rastro del entitlement (`field_raw_event`) cuál
llega y quitar el que sobre.

---

## 3. Dónde vive cada secreto

Ningún valor secreto va a git, a este documento ni a la app.

| Secreto | Dónde se genera | Dónde se guarda | Quién lo usa |
|---|---|---|---|
| In-App Purchase Key (`.p8`), con su Key ID y el Issuer ID | App Store Connect → Usuarios y acceso → Integraciones → Compra dentro de la app | Solo en RevenueCat (ajustes de la app iOS) y en el gestor de contraseñas del titular | RevenueCat (validar compras StoreKit 2) |
| Clave de la API de App Store Connect (`.p8`), opcional | App Store Connect → Integraciones → API de App Store Connect | Solo en RevenueCat | RevenueCat (importar productos y precios) |
| Cuenta de servicio de Google Cloud (JSON) | Google Cloud Console, proyecto vinculado a Play | Solo en RevenueCat (ajustes de la app Android) | RevenueCat (validar compras, notificaciones en tiempo real) |
| Valor de `Authorization` del webhook | Generado al azar (`openssl rand -hex 32`), **sin** el prefijo `Bearer ` (gotcha 22) | RevenueCat (Integraciones → Webhooks) y `settings.php` de producción: `$settings['shine_entitlement.revenuecat_webhook_secret']` | Drupal (07) |
| Clave secreta de la API REST v2 (`sk_...`), si se activa el refresco | RevenueCat → Project settings → API keys | `settings.php` de producción: `$settings['shine_entitlement.revenuecat_api_key']` | Drupal (refresco de 07, hoy sin implementar) |
| Claves públicas del SDK (`appl_...`, `goog_...`) | RevenueCat → API keys | No son secretas: variables `EXPO_PUBLIC_*` de EAS (las define 08) | App |

En local el secreto del webhook es `local-dev-secret` (CLAUDE.md, ficheros fuera de git).

---

## 4. Checklist de altas

Marcar cada paso con la fecha al completarlo. Los ids que salgan van a la tabla del apartado 2.

### 4.1 Apple (App Store Connect)

- [ ] Alta en el Apple Developer Program como persona física (en trámite, 2026-10-29).
- [ ] Contrato de apps de pago firmado, con datos bancarios y fiscales (Business).
- [ ] Declaración de comerciante para la UE (DSA).
- [ ] Solicitud del App Store Small Business Program (15 % en lugar del 30 %).
- [ ] Identificador de la app (bundle id definitivo) en Certificates, Identifiers & Profiles, con
      la capacidad In-App Purchase.
- [ ] App creada en App Store Connect, idioma principal castellano, ficha también en catalán (14b).
- [ ] Grupo de suscripciones "Shine Familia" con `shine_family_monthly` (1 mes) y
      `shine_family_annual` (1 año), mismo nivel (el anual por encima para que se pueda cambiar).
- [ ] Precio base en euros y equivalencias por país (**precios pendientes**, apartado 6).
- [ ] Nombre visible y descripción de cada suscripción en castellano y catalán.
- [ ] Captura de la pantalla de compra para la revisión (sale del paywall de 08).
- [ ] **Sin oferta introductoria ni prueba gratuita** (decisión del README y §4.4).
- [ ] Cuentas de sandbox (Usuarios y acceso → Sandbox) para las pruebas de 08.
- [ ] Notificaciones del servidor de App Store (versión 2) apuntando a la URL que da RevenueCat.
- [ ] Previstas: App Privacy (datos de uso y de rendimiento del alumno, sin seguimiento) y el
      enlace de "Account deletion" (la pantalla de 06b está en Ajustes, a dos toques).

Estado esperado al terminar: las dos suscripciones en "Lista para enviar" (se envían con la
primera versión de la app).

### 4.2 Google (Play Console)

- [ ] Alta en Play Console como cuenta personal, con verificación de identidad (en trámite,
      2026-10-29).
- [ ] Perfil de pagos (cuenta de comerciante) vinculado.
- [ ] App creada con el package definitivo; ficha en castellano y catalán (14b).
- [ ] Una primera compilación subida a la pista de pruebas internas (Play no deja crear
      suscripciones sin una compilación con el permiso de facturación; llega con 08).
- [ ] Suscripción `shine_family_monthly` con plan base `monthly` (renovación automática, 1 mes).
- [ ] Suscripción `shine_family_annual` con plan base `annual` (renovación automática, 1 año).
- [ ] Precios (**pendientes**, apartado 6); sin ofertas de prueba.
- [ ] Testers con licencia (Configuración → Pruebas de licencias) para las pruebas de 08.
- [ ] Prueba cerrada con 12 testers durante 14 días (requisito de cuenta personal) antes de
      pedir producción.

Estado esperado al terminar: los dos planes base "Activos".

### 4.3 RevenueCat

- [ ] Proyecto "Shine".
- [ ] App iOS con el bundle id y la In-App Purchase Key (y, si se quiere, la clave de la API de
      App Store Connect para importar productos).
- [ ] App Android con el package y la cuenta de servicio. En Play Console → Usuarios y permisos,
      a esa cuenta: ver datos financieros y gestionar pedidos y suscripciones. RevenueCat puede
      tardar hasta 36 h en validar las credenciales.
- [ ] Notificaciones en tiempo real de Google (Pub/Sub) activadas desde RevenueCat.
- [ ] Productos importados: los cuatro del apartado 2 en estado correcto.
- [ ] Entitlement `family` con los cuatro productos.
- [ ] Oferta `default` marcada como actual, con `$rc_monthly` (los dos mensuales) y `$rc_annual`
      (los dos anuales).
- [ ] Claves públicas por plataforma copiadas para 08.
- [ ] Webhook: URL de producción, valor de `Authorization` generado al azar (apartado 3), eventos
      de producción. Para sandbox, otro webhook hacia el entorno de pruebas cuando exista (14a),
      con su propio secreto.
- [ ] Decidir si se activa la API REST para el refresco de 07 (por defecto, no: el webhook basta
      para empezar).

Verificación del subplan: en RevenueCat los cuatro productos aparecen sin avisos; en cada consola
las suscripciones están listas para enviar o activas; este documento sin valores **EJEMPLO** ni
filas sin fecha.

---

## 5. Guion de prueba en sandbox (lo ejecuta 08)

Con una build de desarrollo de EAS (Expo Go no sirve), un titular de prueba del entorno de
pruebas y, en iOS, una cuenta de sandbox; en Android, un tester con licencia. En sandbox las
renovaciones van aceleradas (en Apple, por defecto un mes dura 5 minutos y la suscripción se renueva
hasta 12 veces). Tras cada paso, comprobar `GET /shine/me` (`holder_status`) y el entitlement en
`/admin/shine/entitlements` (rastro del último evento).

1. **Compra mensual**: `INITIAL_PURCHASE` → entitlement `active`, `source` de la store, caducidad
   del periodo; la app sale del muro (tras `refreshMe()`; si el webhook no ha llegado, reintentar
   unos segundos).
2. **Renovación acelerada**: esperar una o dos renovaciones → `RENEWAL`, la caducidad avanza.
3. **Cambio a anual**: `PRODUCT_CHANGE` → sigue cubierto; el plan sigue al producto nuevo.
4. **Cancelación**: desde los ajustes de suscripción del dispositivo → `CANCELLATION`, sigue
   cubierto hasta la caducidad; después `EXPIRATION` → `expired`, vuelve el muro.
5. **Reembolso**: en Apple, con la herramienta de sandbox de reembolsos; en Play, reembolso del
   pedido de prueba → `CANCELLATION` con `cancel_reason = CUSTOMER_SUPPORT` → `revoked` al momento.
6. **Restaurar compras**: en otro dispositivo o tras reinstalar, con el mismo titular →
   `Purchases.restorePurchases()`; con otro titular → `TRANSFER` y el entitlement cambia de dueño.
7. **Problema de cobro** (Play, tarjeta de prueba que falla) → `BILLING_ISSUE` → `billing_retry`,
   sigue cubierto hasta el fin del periodo de gracia.

---

## 6. Decisiones (2026-10-29)

| Decisión | Valor | Estado |
|---|---|---|
| Precios de partida de Familia | Pendientes; rangos de §2 (9,99 a 12,99 €/mes, 59,99 a 79,99 €/año) | Decidir antes de enviar las suscripciones a revisión |
| Prueba gratuita de store | No (la prueba son las sesiones gratis, §4.4) | Decidido |
| Categoría de la ficha | Educación; **no** la categoría Kids (§8) | Decidido |
| Clasificación por edades | La que salga del cuestionario de cada store; contenido sin violencia ni compras para niños, previsiblemente la mínima | Al rellenar el cuestionario |
| Titular legal | Persona física (autónomo) | Decidido |
| Nombre definitivo, bundle id y package | Por decidir | Bloquea el registro de la app en las dos stores |
