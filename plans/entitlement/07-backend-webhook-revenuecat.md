# 07. Backend: webhook de RevenueCat

- **Modelo recomendado: Fable.** Endpoint público con secreto, máquina de estados del entitlement
  alimentada por eventos repetidos y desordenados, y mapeo de identidades (`app_user_id`). Un
  fallo da acceso gratis o lo quita a quien paga.
- Fase: 17, parte 17d. Alcance: solo Drupal (`shine_entitlement`).
- Dependencias: 03 (entidad y catálogo) y 04 (invalidación de caché del acceso).

## Prompt

Lee `docs/monetization.md` §6.1 y §6.3, `plans/entitlement/README.md` ("Secretos de webhooks",
"Idempotencia"), `CLAUDE.md` (gotcha 1 para probar con curl) y la documentación pública de
RevenueCat sobre webhooks (campos del evento: `type`, `id`, `event_timestamp_ms`, `app_user_id`,
`original_app_user_id`, `product_id`, `store`, `period_type`, `expiration_at_ms`,
`transferred_from`/`transferred_to`; cabecera `Authorization` configurable). Trabaja en `shine/`.

Tareas:

1. **Ruta `POST /shine/webhooks/revenuecat`** (anónima, `_access: 'TRUE'`, sin CSRF porque no hay
   cookie): compara la cabecera `Authorization` con `$settings['shine_entitlement.revenuecat_webhook_secret']`
   en tiempo constante (`hash_equals`); sin secreto configurado o distinto → 401 y watchdog. Añade
   la clave a la documentación de `settings.php` (y a `docs/deploy.md` si existe; si no, a
   `CLAUDE.md` "Archivos que NO están en git").
2. **Servicio `shine_entitlement.revenuecat_processor`** (la ruta solo decodifica y responde):
   - Resuelve el titular por `app_user_id` = UUID de usuario. Ids anónimos de RevenueCat o UUID
     desconocido → 200 con `ignored: true` y watchdog (RevenueCat reintenta cualquier no-2xx y no
     queremos cola infinita por un usuario borrado).
   - Resuelve `product_id` + `store` con `PlanCatalog::resolveExternal` (`app_store:...` o
     `play_store:...`); desconocido → 422 y watchdog (así se reintenta tras añadirlo al catálogo,
     como pide §4.3).
   - Localiza el entitlement por (`source`, `external_id` = `original_app_user_id` o el id de
     suscripción que RevenueCat dé de forma estable; decide y documenta) y aplica la tabla de §6.1:
     `INITIAL_PURCHASE`/`RENEWAL`/`UNCANCELLATION`/`PRODUCT_CHANGE` → `active` (o `trial` si
     `period_type = TRIAL`), `expires_at` = `expiration_at_ms`; `CANCELLATION` → solo
     `field_cancelled_at`; `BILLING_ISSUE` → `billing_retry`; `EXPIRATION` → `expired`;
     `SUBSCRIPTION_PAUSED` → `paused`; `REFUND`/`REVOKED` → `revoked` y `expires_at` ahora;
     `TRANSFER` → el entitlement pasa al titular de `transferred_to` (si no existe, se ignora con
     log). `field_quantity` = 1, `field_max_learners` del catálogo, `field_raw_event` = el JSON.
   - Idempotencia: descarta el evento si `event_timestamp_ms` es anterior al
     `field_event_timestamp` guardado o si `id` coincide con `field_last_event_id`; responde 200
     con `applied: false`.
   - Todo dentro de una transacción; al terminar, invalidar las etiquetas de caché del acceso (04).
3. **Refresco bajo demanda (opcional, detrás de un flag)**: servicio que consulta la API REST de
   RevenueCat (clave en `settings.php`) para un titular cuyo entitlement de store caduca en menos de
   1 h, pensado para `/shine/me`. Impleméntalo solo si el usuario tiene ya la clave; si no, deja la
   interfaz y el flag `shine_entitlement.settings: revenuecat_refresh = false` y anótalo.
4. **Tests kernel** con fixtures JSON reales (uno por tipo de evento, en `tests/fixtures/`):
   cabecera incorrecta 401; compra inicial crea `active` con caducidad y cupo del catálogo;
   renovación posterior mueve la caducidad; evento antiguo tras uno nuevo no cambia nada; evento
   repetido no cambia nada; `BILLING_ISSUE` mantiene cobertura (`EntitlementAccess` lo confirma);
   `EXPIRATION` la quita; `REFUND` la quita al momento; `TRANSFER` cambia de titular; producto
   desconocido 422; UUID desconocido 200 ignorado.
5. **Documentación**: `docs/api-design.md` (sección "Webhooks": URL, cabecera, respuestas,
   tabla de eventos tal como ha quedado) y `docs/monetization.md` §6.1 si algo difiere.

Verificación:
- Con curl (gotcha 1) y los fixtures: la secuencia compra → `BILLING_ISSUE` → `RENEWAL` →
  `CANCELLATION` → `EXPIRATION` deja el entitlement en `expired` y `GET /shine/me` del titular pasa
  de cubierto a no cubierto sin `drush cr`.
- `ddev exec vendor/bin/phpunit -c phpunit.xml public_html/modules/custom/shine_entitlement` en
  verde; watchdog muestra los avisos esperados y ningún error.

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md` y
`CLAUDE.md` (endpoints custom, secretos).
