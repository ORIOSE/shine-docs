# 08. App: SDK de RevenueCat, paywall y gestión de la suscripción

- **Modelo recomendado: Opus.** Integración documentada de `react-native-purchases`, pantalla con
  el design system y requisitos de Apple ya enumerados en el diseño §8. Los comandos `eas` y
  `npx expo install` los ejecuta el usuario.
- Fase: 17, parte 17d. Alcance: app (`shine-app/`) y `app.config.ts`.
- Dependencias: 05 (store y 402), 06b (sección "Tu plan"), 07 (webhook) y 09 (productos, oferta y
  claves de RevenueCat).
  Si `plans/prompts/14b` no se ha ejecutado, este subplan crea el `eas.json` mínimo con el perfil
  `development`.

## Prompt

Lee `docs/monetization.md` §6.1, §6.2 (último punto), §7 y §8, `docs/stores.md` (lo escribe 09:
ids de producto, oferta, claves públicas por plataforma), `src/lib/config.ts`, `app.config.ts`,
`src/store/auth.ts` (05), `app/(auth)/dashboard.tsx` (manejo del 402) y `app/(auth)/settings.tsx`
(06). Documentación oficial de RevenueCat para React Native y Expo (config plugin, `configure`,
`logIn`, `getOfferings`, `purchasePackage`, `restorePurchases`, `showManageSubscriptions`).

Tareas:

1. **Development build**: `eas.json` (perfiles `development`, `preview`, `production` si no
   existen), `npx expo install react-native-purchases` y `expo-dev-client` en la terminal del
   usuario, plugin en `app.config.ts`, variables `EXPO_PUBLIC_RC_IOS_KEY` y
   `EXPO_PUBLIC_RC_ANDROID_KEY` en `extra` y `.env.example`. Guía al usuario en
   `eas build --profile development --platform ios` (y Android) y en instalar la build. Expo Go deja
   de servir para el flujo de compra; déjalo escrito en `CLAUDE.md`.
2. **Módulo `src/lib/purchases/`** con `index.native.ts` e `index.web.ts` (misma interfaz:
   `configure`, `identify(holderUuid)`, `reset`, `getPackages`, `purchase`, `restore`,
   `manage`, `isAvailable`). La web devuelve `isAvailable = false` y no importa el SDK. `configure`
   al arrancar; `identify` con el UUID del **titular** tras login e `initialize`; `reset` en logout.
   Nunca el UUID del alumno (§6.1).
3. **Paywall** `app/(auth)/paywall.tsx` (recibe `reason` y, opcionalmente, el nombre del alumno):
   dos opciones (anual destacada como ancla, mensual) con precio y periodo **del SDK** (nunca
   escritos a mano), texto de renovación automática y cancelación, enlaces a Términos y Privacidad
   (URLs en `config.ts`, de momento a las páginas que exista en Drupal o a marcadores claros),
   "Restaurar compras", "Ahora no". En web: explica que la suscripción se gestiona desde la app
   móvil, sin precios. Tras `purchase` o `restore` con éxito: `refreshMe()` con hasta tres
   reintentos espaciados (el webhook tarda unos segundos); si sigue sin cobertura, mensaje "Estamos
   activando tu acceso" con botón de reintento, sin bloquear la navegación.
4. **Enganches**: 402 en el dashboard (`reason` `trial_exhausted` o `learner_paused`) y al crear
   alumno (`learner_limit`) navegan al paywall con `reason` y el resumen de progreso de la prueba
   ("en estas {N} sesiones, {área} ha pasado de {nivel} a {nivel}", a partir de
   `userarealevel_log` del alumno, §5.4); la tarjeta de aviso de 05 (quedan 3 sesiones) enlaza al
   paywall; en Ajustes, "Gestionar suscripción" llama a `manage()` (abre la gestión de la store) y
   "Restaurar compras" se activa en "Tu plan". Si `holder_status.source` es `stripe` u
   `organization`, o el alumno tiene `covered_by: organization`, no se muestra nada de compra (12
   completa el texto neutro).
5. **Cumplimiento**: sin menciones a compra web ni precios externos en iOS; textos del paywall en
   un objeto `PAYWALL_COPY`; `accessibilityRole` y foco correctos.
6. **Tests** de lógica pura: orden y etiquetas de paquetes, decisión de mostrar paywall según
   `holder_status.source` y `reason`, política de reintentos de `refreshMe`.

Verificación:
- `npx tsc --noEmit`, `npm run lint`, `npm test` limpios; `npm run web` arranca sin el SDK.
- En la development build con un sandbox tester de Apple y un license tester de Google: compra
  mensual → en unos segundos `GET /shine/me` cubre → la regular bloqueada se genera; "Restaurar
  compras" en una reinstalación recupera la cobertura; cancelar en la store deja la app usable hasta
  la caducidad (el entitlement pasa a `expired` por webhook).

Al terminar: marca la fila en `plans/entitlement/README.md`, actualiza `docs/progress.md`,
`CLAUDE.md` (development builds, variables nuevas) y `docs/stores.md` con lo probado. **Hito H2**.
