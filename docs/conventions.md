# Convenciones de desarrollo — Shine

Este documento establece los estándares que deben seguirse en todos los desarrollos del proyecto para garantizar consistencia.

---

## 1. Convenciones Drupal / PHP

### Módulos

- **Prefijo**: todos los módulos custom usan prefijo `shine_` para los nuevos. Los existentes (activitylog, activitysummary, activity_message, activitylog_register, preprocess) mantienen su nombre por compatibilidad con la base de datos.
- **Nombrado**: `snake_case`
- **`.info.yml`** obligatorio:
  ```yaml
  name: 'Shine Mi Módulo'
  type: module
  description: 'Descripción real, no @todo.'
  package: shine
  core_version_requirement: ^11
  ```

### Entidades custom

| Elemento | Convención | Ejemplo |
|---|---|---|
| Tipo de entidad (machine name) | `snake_case` | `activitylog` |
| Bundle (machine name) | `snake_case` | `logverticaltext` |
| Clase PHP | `PascalCase` | `ActivityLog` |
| Clase bundle PHP | `PascalCaseType` | `ActivityLogType` |
| Tabla base de datos | igual al tipo | `activitylog` |

### Campos

- **Siempre** con prefijo `field_`
- `snake_case`
- Nombres descriptivos, no abreviaturas: `field_activity_level`, no `field_act_lvl`
- Los campos reutilizados entre tipos de contenido comparten el mismo `field.storage`: si `field_activity_level` ya existe, se reutiliza en el nuevo content type, no se crea uno nuevo

### Permisos

El patrón estándar para entidades custom es:
```
view {entity_type}
create {entity_type}
edit {entity_type}
delete {entity_type}
administer {entity_type} types
```

### Configuración

- **Obligatorio** hacer `drush cex` después de cualquier cambio de configuración en el sitio antes de hacer commit
- Los archivos `.yml` exportados son la fuente de verdad, no la base de datos
- Nunca editar manualmente un archivo `.yml` de config sin aplicarlo después con `drush cim`

### Nomenclatura de tipos de actividad (crítico para escalabilidad)

Cuando se crea un nuevo tipo de actividad, todos los elementos deben seguir el mismo patrón de nombre:

| Elemento | Patrón | Ejemplo: lectura de audio |
|---|---|---|
| Node type (Drupal) | `activity_{tipo}` | `activity_audio_reading` |
| Activitylog bundle | `log{tipo}` | `logaudioreading` |
| Activitysummary bundle | `summary_{tipo}` | `summary_audio_reading` |
| React Native component | `{Tipo}Player` | `AudioReadingPlayer` |
| TypeScript type | `Activity{Tipo}` | `ActivityAudioReading` |

---

## 2. Convenciones JavaScript (código acoplado Drupal, histórico)

> **Histórico.** Aplicaba a `activitylog_register/js/`, retirado en la FASE 9. Para la app, ver la sección 3 y `docs/activity-system.md` ("Cómo añadir un nuevo tipo de actividad").

- **Patrón de actividades**: clase base `Activity` con subclases por tipo
- Métodos obligatorios en cada subclase: `prepareActivity()`, `playActivityItem()`, `addRegisterLog()`
- Inicialización via `Drupal.behaviors.{moduleName}`, nunca en DOMContentLoaded
- **No usar jQuery AJAX** en código nuevo — usar `fetch` API
- Los datos del log siempre se envían juntos: `activityId`, `sessionId`, `activityType`, `items[]`, `times[]`, `weights[]`
- Registrar el tipo de actividad en `activitylog_register.module` vía `hook_preprocess_node()`

---

## 3. Convenciones React Native / Expo

### Estructura de carpetas

```
shine-app/
├── app/                        # Expo Router (file-based routing)
│   ├── (auth)/                 # Rutas protegidas
│   │   ├── dashboard.tsx
│   │   ├── session/[id].tsx
│   │   └── activity/[id].tsx
│   ├── login.tsx
│   └── _layout.tsx
├── src/
│   ├── components/
│   │   ├── activities/         # Un archivo por tipo de actividad
│   │   │   ├── ActivityRouter.tsx   # tipo → player, monta ActivityBase
│   │   │   ├── ActivityBase.tsx     # intro, marco, guardado, pantalla final (común)
│   │   │   ├── VerticalTextPlayer.tsx
│   │   │   ├── ImageGroupPlayer.tsx
│   │   │   └── AudioReadingPlayer.tsx
│   │   ├── statistics/         # Componentes de gráficas
│   │   │   ├── ActivityEvolutionChart.tsx
│   │   │   ├── StandardComparison.tsx
│   │   │   └── SessionProgressBar.tsx
│   │   └── ui/                 # Componentes reutilizables
│   ├── hooks/                  # Custom hooks (prefijo `use`)
│   │   ├── useActivityLog.ts
│   │   └── useSession.ts
│   ├── lib/
│   │   ├── activityKinds/      # Definición pura por tipo + buildTracking (payloads)
│   │   └── api/
│   │       ├── client.ts       # Fetch + JWT interceptor
│   │       ├── activities.ts   # Queries de actividades
│   │       ├── sessions.ts     # Queries de sesiones
│   │       └── tracking.ts     # postLog / postSummary genéricos
│   ├── store/                  # Zustand stores
│   │   ├── auth.ts
│   │   └── session.ts
│   └── types/                  # TypeScript interfaces (mirroring Drupal)
│       ├── activity.ts
│       ├── session.ts
│       ├── activitylog.ts
│       └── activitysummary.ts
```

### Nombrado

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | `PascalCase` | `VerticalTextPlayer` |
| Hooks | `use` + PascalCase | `useActivityLog` |
| Stores Zustand | `use` + PascalCase + `Store` | `useAuthStore` |
| Funciones de API | camelCase descriptivo | `fetchActivitiesBySession` |
| Archivos de componente | `PascalCase.tsx` | `VerticalTextPlayer.tsx` |
| Archivos de hook/util | `camelCase.ts` | `useActivityLog.ts` |

### Tipos TypeScript

Cada entidad Drupal tiene su tipo TypeScript correspondiente en `src/types/`. Los campos JSON:API usan el prefijo `field_` igual que en Drupal:

```typescript
// src/types/activity.ts
export interface ActivityNode {
  id: string;
  attributes: {
    title: string;
    field_activity_format: string;
    field_activity_code: string | null;
    field_seconds: number | null;
    field_text: string | null;
  };
  relationships: {
    field_activity_level: { data: { id: string } };
    field_explanation: { data: { id: string } | null };
  };
}
```

### Patrón de componentes de actividad

Todos los players de actividad siguen la misma estructura:

```typescript
interface ActivityPlayerProps {
  activity: ActivityNode;
  sessionId: string;
  onComplete: (logData: ActivityLogData) => void;
}

// Ciclo de vida obligatorio:
// 1. Render intro (explanation + motivational message)
// 2. Usuario pulsa "Comenzar"
// 3. Timer inicia
// 4. Lógica específica del tipo
// 5. Al completar: llamar onComplete() con los datos
// 6. El padre se encarga de enviar el log a la API
```

### Textos e idiomas (FASE 18)

Ningún texto visible va escrito en el código: todos viven en src/locales/es.json y src/locales/ca.json, que tienen exactamente las mismas claves (lo comprueba src/lib/__tests__/i18n.test.ts). Los comentarios siguen en castellano.

- **Uso**: t('ui.dashboard.title') o t('player.letterMatrix.find', { letter }) de src/lib/i18n.ts, igual en componentes que en lógica pura (sin proveedor ni contexto). Las claves están tipadas a partir de es.json: una clave que no existe no compila. El idioma por defecto y de reserva es es.
- **Dos espacios de nombres**: ui.* para lo que lee el tutor (pantallas, botones, estadísticas, errores, instrucciones de la intro de cada actividad) y player.* para lo que lee el niño dentro del juego (preguntas, resultados, motivación de fin de actividad, "¿Cómo ha ido?" y preguntas de fin de sesión). Hoy los dos usan el idioma de la app; separarlos (interfaz del tutor, juego del niño) será un cambio en el selector de idioma, no en los textos.
- **Claves**: por pantalla o componente y en camelCase: ui.learners.new.title, ui.statistics.detail.empty, player.imagePosition.question. Los textos compartidos de verdad van en ui.common (volver, cancelar, guardar, errores de conexión) y las fechas en ui.date.
- **Marcadores y plurales**: %{nombre} para valores (t('ui.operator.other', { name })). Un plural es un objeto con one y other (y zero si hace falta) y se pide con count, que también se puede usar como %{count}.
- **Nada calculado al cargar un módulo**: el idioma cambia en caliente, así que una constante con texto se convierte en función o guarda la clave y llama a t() al pintar. Las funciones de src/lib que devuelven texto (operatorLabel, formatPerSecond, generateErrorCopy...) llaman a t() dentro.
- **Fechas y números**: formatDayMonth(fecha) para "6 de noviembre" o "6 de novembre" (el mes va con su preposición en el catálogo porque en catalán se apostrofa: "1 d’octubre"); toLocaleDateString e Intl con dateLocale() (es-ES o ca-ES), nunca con un locale fijo; decimales con coma en los dos idiomas con formatDecimal().
- **Catalán**: trato de tú al tutor y al niño, tono amable, sin tecnicismos; apóstrofo tipográfico (’), comillas «» y punto volado U+00B7 en l·l. La traducción actual es provisional hasta que la revise un hablante nativo.
- **Idioma de la app**: el del alumno activo (lo aplica src/store/auth.ts al elegir, restaurar o refrescar el alumno; learnerLocale() trata un alumno sin idioma como es); sin alumno, el del dispositivo si es castellano o catalán, y castellano si no (deviceLocale()). setLocale() cambia el idioma y el layout raíz usa useLocale() como key de la pila de navegación para que todas las pantallas se vuelvan a pintar. Los textos player.* pueden ir en otro idioma con setPlayerLocale() (hoy, solo si la sesión cargada no es del idioma del alumno).
- **Recursos traducidos de Drupal** (áreas, ciclo, mensajes): apiFetch con la opción lang, que antepone el prefijo de idioma a JSON:API (API_BASE/ca/jsonapi; es sin prefijo). Actividades y sesiones no lo llevan: son nodos de un solo idioma.
- **Textos nativos y de tienda**: nombre visible y avisos de permisos por idioma en shine-app/native-locales/{es,ca}.json (clave locales de app.json); idiomas declarados con el plugin expo-localization (supportedLocales).

---

## 4. Convenciones de API (JSON:API)

- Los headers de toda request autenticada: `Authorization: Bearer {token}`, `Content-Type: application/vnd.api+json`
- Incluir siempre `include` para evitar N+1 requests: `?include=field_activities,field_explanation`
- Filtros siguiendo el spec JSON:API: `?filter[field_activity_level.name]=Básico`
- Ver `docs/api-design.md` para los endpoints concretos

---

## 5. Convenciones de Git

- **Idioma de commits**: inglés
- **Prefijos obligatorios**:
  - `feat:` nueva funcionalidad
  - `fix:` corrección de bug
  - `refactor:` refactorización sin cambio funcional
  - `docs:` cambios solo en documentación
  - `chore:` configuración, dependencias, tareas de mantenimiento
  - `config:` cambios de configuración Drupal (config export)
- **Ejemplos correctos**:
  - `feat: add AudioReadingPlayer component`
  - `config: add field_standard_time to node.activity`
  - `fix: correct iteration counter in activitylog controller`
- **Ramas**: `feature/{nombre}`, `fix/{nombre}`, `release/{versión}`
