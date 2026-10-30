# Prototipos de Lovable del panel web de Shine

Copia local, descargada el 2026-10-30 con la herramienta `read_file` del conector de Lovable, de los
ficheros fuente de dos proyectos de Lovable. Son prototipos de interfaz: React con datos simulados en
TypeScript, sin backend, pensados como referencia visual y funcional para el futuro panel web (tema de
Drupal) y para la pantalla de entrada de la app.

Carpetas:

- `panel/`: proyecto "Shine Panel de Progreso" (30 ficheros).
- `signin/`: proyecto "Shine Sign In" (4 ficheros).

Ficheros descargados (misma ruta relativa que en Lovable):

| Proyecto | Fichero |
|---|---|
| panel | `README.md`, `AGENTS.md`, `roadmap.md`, `package.json` |
| panel | `src/styles.css` |
| panel | `src/lib/shine-context.tsx`, `src/lib/utils.ts` |
| panel | `src/data/mock.ts`, `src/data/report.ts` |
| panel | `src/components/shine/DataTable.tsx`, `charts.tsx`, `homes.tsx`, `org.tsx`, `ui.tsx` |
| panel | `src/routes/__root.tsx`, `index.tsx`, `login.tsx`, `alumno.tsx`, `panel.tsx`, `panel.index.tsx`, `panel.alumnos.index.tsx`, `panel.alumnos.$id.tsx`, `panel.avisos.tsx`, `panel.ayuda.tsx`, `panel.cuenta.tsx`, `panel.grupos.tsx`, `panel.informes.tsx`, `panel.organizacion.tsx`, `panel.plan.tsx` |
| signin | `README.md`, `src/styles.css`, `src/routes/__root.tsx`, `src/routes/index.tsx` |

No se han descargado, por ser plantilla de Lovable o generados: `src/components/ui/*` (shadcn de
serie), `routeTree.gen.ts`, `server.ts`, `start.ts`, `router.tsx`, `error-*.ts`,
`lovable-error-reporting.ts`, tests y `bun.lock`. Los ficheros `__root.tsx` importan
`../lib/lovable-error-reporting`, que por tanto no está en esta copia.

---

## 1. Origen

### Proyecto A: "Shine Panel de Progreso"

- id: `3f01f5c0-47d4-45a5-88a9-c85ad938d6e6`
- Editor: https://lovable.dev/projects/3f01f5c0-47d4-45a5-88a9-c85ad938d6e6
- Vista previa: https://id-preview--3f01f5c0-47d4-45a5-88a9-c85ad938d6e6.lovable.app
- Creado el 2026-10-23 a las 10:46 UTC; última edición el 2026-10-23 a las 10:57 UTC. Último commit
  `672871b9ec3eec46135b72b7b2d0e4b247c932d4`. No publicado (visibilidad `workspace_edit`).
- Descripción registrada en Lovable: panel web en castellano para gestionar cuentas, alumnos,
  licencias y progreso de la app Shine; vistas por rol para familias, profesionales y coordinadores
  de gabinete; prototipo frontend con datos mock en TypeScript y sin backend.
- Qué es: una app TanStack Start (React 19, TanStack Router 1.170, Tailwind 4, Recharts 3,
  lucide-react) cuyo `AGENTS.md` dice literalmente: "Frontend-only prototype: all data lives in
  src/data/mock.ts; no backend (future Drupal theme)". No hay llamadas HTTP, ni autenticación, ni
  persistencia: el login navega a `/panel` tras 500 ms y todas las acciones terminan en un toast.
- Stack según `package.json` (nombre del paquete `tanstack_start_ts`): `@tanstack/react-start`
  1.168.60, `@tanstack/react-router` 1.170.41, `react` 19.2, `tailwindcss` 4.2.1, `recharts` 3.10.1,
  `lucide-react` 1.61, `class-variance-authority`, `clsx`, `tailwind-merge`, `vite` 8.1.5,
  `vitest` 4. Incluye muchos paquetes `@radix-ui/*`, `sonner`, `react-hook-form`, `zod`, `cmdk`,
  `vaul`, `embla-carousel-react` que vienen de la plantilla shadcn y que los componentes propios no
  usan (el toast es propio, no `sonner`).

### Proyecto B: "Shine Sign In"

- id: `8bc2e5af-eafc-4777-9a23-2e1f4357088b`
- Editor: https://lovable.dev/projects/8bc2e5af-eafc-4777-9a23-2e1f4357088b
- Vista previa: https://id-preview--8bc2e5af-eafc-4777-9a23-2e1f4357088b.lovable.app
- Creado el 2026-10-23 a las 10:39 UTC; última edición el 2026-10-23 a las 10:41 UTC. Último commit
  `aef0084c23a1c6dafdc29a30f24d83f7fa92228a`. No publicado.
- Qué es: una sola pantalla, `src/routes/index.tsx`, que dibuja dentro de un marco de móvil (390 x
  640 px, esquinas de 32 px) la pantalla de entrada de la app, con tres estados de demostración
  (Normal, Cargando, Error) que se cambian con unas píldoras encima del marco. No es el login del
  panel web: es una maqueta del login de la app móvil. Mismo stack que el proyecto A, sin datos.

---

## 2. Design tokens de `src/styles.css`

### 2.1 Panel (`panel/src/styles.css`)

Cabecera: `@import "tailwindcss" source(none)`, `@source "../src"`, `@import "tw-animate-css"`.
El comentario de cabecera dice "Shine design system, light mode only": **no hay modo oscuro**
(ni `.dark`, ni `prefers-color-scheme`).

Fuentes:

- `@font-face` "OpenDyslexic" en pesos 400 y 700, cargada por URL desde
  `https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/` (`OpenDyslexic-Regular.woff` y
  `OpenDyslexic-Bold.woff`, `font-display: swap`).
- Nunito se carga en `src/routes/__root.tsx` desde Google Fonts, pesos 400, 500, 600, 700 y 800,
  con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.
- `--font-base: "Nunito", system-ui, sans-serif`. El contexto (`shine-context.tsx`) sobrescribe esta
  variable en `document.documentElement` cuando el usuario elige OpenDyslexic.

Variables en `:root` (colores en hexadecimal):

| Grupo | Variables |
|---|---|
| Marca | `--teal #3dbfa0`, `--teal-dark #2a8c74`, `--teal-tint #e8f6f1`, `--amber #f5a623`, `--amber-dark #c77f0e`, `--amber-tint #fdf0da` |
| Fondos y texto | `--bg #f7f5f2`, `--surface #ffffff`, `--shell #eeece9`, `--ink #1e1e2e`, `--ink-muted #6b7280`, `--line #e3e0db`, `--track #e5e7eb` |
| Estados | `--success #4caf7d`, `--success-dark #2e7d53`, `--success-tint #e4f3eb`, `--error #e05a5a` |
| Bandas de nivel | `--lvl-ini-bg #e4f3eb` / `--lvl-ini-fg #2e7d53` (Inicial), `--lvl-int-bg #fdf0da` / `--lvl-int-fg #b5760b` (Intermedio), `--lvl-adv-bg #efe7fa` / `--lvl-adv-fg #6d45a8` (Avanzado) |
| Sombras | `--shadow-card: 0 2px 8px rgba(0,0,0,0.08)`, `--shadow-raised: 0 4px 16px rgba(0,0,0,0.1)`, `--shadow-modal: 0 8px 32px rgba(30,30,46,0.16)` |
| Movimiento | `--ease: cubic-bezier(0.22, 0.61, 0.36, 1)` |
| Compatibilidad shadcn | `--radius: 0.75rem`; `--background` = bg, `--foreground` = ink, `--card` y `--popover` = surface, `--primary` = teal (foreground `#ffffff`), `--secondary` y `--accent` = teal-tint (foreground teal-dark), `--muted` = shell (foreground ink-muted), `--destructive` = error, `--border` e `--input` = line, `--ring` = teal |

Bloque `@theme inline` (lo que se convierte en utilidades de Tailwind): `--font-sans`; colores
`teal`, `teal-dark`, `teal-tint`, `amber`, `amber-dark`, `amber-tint`, `bg`, `surface`, `shell`,
`ink`, `ink-muted`, `success`, `success-dark`, `success-tint`, `error`, `track`, `line`,
`lvl-ini-bg`, `lvl-ini-fg`, `lvl-int-bg`, `lvl-int-fg`, `lvl-adv-bg`, `lvl-adv-fg`, `on-teal`
(`#ffffff`) y los nombres shadcn; radios `--radius-sm: 8px`, `--radius-md: 12px`,
`--radius-lg: 16px`, `--radius-xl: 24px`; sombras `shadow-card`, `shadow-raised`, `shadow-modal`;
`--ease-shine`.

Estilos base (`@layer base`): borde por defecto `--line`; `html` con `--font-base`; `body` con fondo
`--bg`, color `--ink`, **18 px** de cuerpo, interlineado 1.7, espaciado 0.2 px, alineado a la
izquierda; `h1` 28 px / 1.3 / 700 / 0.3 px; `h2` 22 px / 1.4 / 600; `h3` 18 px / 700;
`:focus-visible` con contorno de 2 px teal y desplazamiento de 2 px.

Utilidades propias (`@utility`):

- `label-text`: 14 px, interlineado 1.5, peso 500, color ink-muted (etiquetas y textos secundarios).
- `stat-num`: 32 px, interlineado 1.1, peso 800 (cifras grandes de las tarjetas de estadística).
- `shine-t`: `transition: all 160ms var(--ease)`.
- `press`: la misma transición y `scale(0.97)` al pulsar (botones).
- `press-card`: igual con `scale(0.98)` (tarjetas pulsables).
- `no-scrollbar`: oculta la barra de desplazamiento.

Además: con `prefers-reduced-motion: reduce` anula transiciones y animaciones; en `@media print`
oculta `.no-print`, pone el fondo blanco y quita la sombra a `.print-area` (los informes se
"descargan" con `window.print()`).

### 2.2 Sign In (`signin/src/styles.css`)

Es la plantilla de Lovable (shadcn) en **oklch**, con `@custom-variant dark (&:is(.dark *))`,
un `:root` claro y un bloque `.dark` completos (background, foreground, card, popover, primary,
secondary, muted, accent, destructive, border, input, ring, chart-1 a chart-5, sidebar-*) y
`--radius: 0.625rem` con `radius-sm` a `radius-4xl` calculados. El comentario de la plantilla exige
que todos los colores sean oklch. Esta parte no la usa la pantalla de Shine (no hay conmutador de
tema).

Al final se añade un bloque propio de Shine, también en oklch:

| Variable | Valor |
|---|---|
| `--shine-teal` | `oklch(0.73 0.12 170)` |
| `--shine-teal-dark` | `oklch(0.58 0.1 170)` |
| `--shine-teal-tint` | `oklch(0.96 0.02 170)` |
| `--shine-amber` | `oklch(0.78 0.16 70)` |
| `--shine-amber-dark` | `oklch(0.63 0.14 65)` |
| `--shine-amber-tint` | `oklch(0.96 0.03 80)` |
| `--shine-bg` | `oklch(0.97 0.004 80)` |
| `--shine-shell` | `oklch(0.94 0.004 80)` |
| `--shine-ink` | `oklch(0.24 0.03 285)` |
| `--shine-ink-muted` | `oklch(0.55 0.02 265)` |
| `--shine-surface` | `oklch(1 0 0)` |
| `--shine-border` | `oklch(0.9 0.008 75)` |
| `--shadow-logo` | `0 8px 24px color-mix(in oklab, var(--shine-teal) 35%, transparent)` |
| `--shadow-frame` | `0 16px 48px color-mix(in oklab, var(--shine-ink) 18%, transparent)` |
| `--shadow-card` | `0 2px 8px oklch(0 0 0 / 8%)` |

Y un segundo `@theme inline` que expone `font-nunito`, y los colores `teal`, `teal-dark`,
`teal-tint`, `amber`, `amber-dark`, `amber-tint`, `screen` (= shine-bg), `shell`, `ink`,
`ink-muted`, `surface`, `frame-border`, `on-teal` (`oklch(1 0 0)`), más `shadow-logo`,
`shadow-frame` y `shadow-card`. No define utilidades propias ni OpenDyslexic. Nunito se carga igual
que en el panel desde `__root.tsx`.

Diferencia entre los dos: la paleta es la misma de concepto (teal, ámbar, fondo crema, tinta
oscura) pero el panel la expresa en hexadecimal y el Sign In en oklch; los nombres de utilidad
coinciden en su mayoría (`bg-teal`, `text-ink-muted`, `bg-shell`, `text-on-teal`), salvo que el
panel usa `bg-bg` y el Sign In `bg-screen` para el fondo.

---

## 3. Modelo de datos mock

### 3.1 `panel/src/data/mock.ts`

Tipos de unión:

- `AreaId = "fon" | "vis" | "mem" | "ort" | "flu"`
- `Trend = "sube" | "estable" | "baja"`
- `Status = "activo" | "pausa" | "archivado"`
- `FamilyLink = "vinculada" | "pendiente" | "no"`
- `Role = "familia" | "profesional" | "gabinete" | "centro" | "docente"` (el tipo de rol vive aquí,
  no en el contexto)
- `Levels = Record<AreaId, number>`

Constantes de áreas:

- `AREAS`: `fon` "Conciencia fonológica" (corto "Fonológica"), `vis` "Discriminación visual"
  ("Visual"), `mem` "Memoria de trabajo" ("Memoria"), `ort` "Ortografía" ("Ortografía"), `flu`
  "Fluidez lectora" ("Fluidez").
- `AREA_COLORS`: fon `#3DBFA0`, vis `#F5A623`, mem `#2A8C74`, ort `#6D45A8`, flu `#6B7280`.
- `areaName(id)`.

Interfaces y datos:

- `Student { id, name, daysSince, total, last4, levels, trend, status, family, owner, group?,
  centerSessions?, homeSessions? }`. `STUDENTS` tiene 14 alumnos: Lucía, Mateo, Noa, Hugo,
  Martina, Leo, Vera, Pau, Aina (en pausa), Iker, Carla, Dani, Olivia y Sara (archivada). El `id` es
  el nombre en minúsculas sin acentos; `owner` rota entre "Marta R.", "Jordi P.", "Elena S."; `group`
  rota entre "3.º A", "4.º B", "5.º A"; `centerSessions` es el 60 % de `total` y `homeSessions` el
  resto.
- Helpers: `getStudent(id)`, `lowestHighest(levels)` (área más baja y más alta),
  `lastSessionLabel(days)` ("Hoy", "Ayer", "Hace N días").
- `LUCIA_HISTORY`: 12 valores por área (12 semanas). `historyFor(student)` devuelve ese histórico
  para Lucía y uno sintético para el resto (interpolación desde `nivel - 3` si sube, o `nivel - 1`).
  `weeklySeries(h)` lo convierte en filas `{ semana: "S1".."S12", fon, vis, mem, ort, flu }` para
  Recharts.
- `Activity { name, area, time, hits, pace }`: cinco actividades fijas, "Rimas locas" (fon, "9 de
  10", "Buen ritmo"), "Busca la letra" (vis, "7 de 10", "Ritmo tranquilo"), "Palabras encadenadas"
  (mem, "5 de 8", "Necesitó más tiempo"), "Lectura cronometrada" (flu, "42 palabras", "Buen ritmo"),
  "¿B o V?" (ort, "8 de 10", "Buen ritmo").
- `Session { date, type, where, activities, rating, minutes, detail: Activity[] }` con `type` en
  `"Regular" | "Evaluación periódica" | "Ajuste" | "Bloque inicial"`, `where` en `"Gabinete" |
  "Casa" | "Centro"` y `rating` en `"Muy bien" | "Bien" | "Me ha costado"`. `LUCIA_SESSIONS`: 6
  sesiones ("Hoy, 17:20", "Ayer, 18:05", "20 oct", "17 oct", "15 oct", "13 oct").
- `DIFFICULT`: tres entradas `{ name, area, text }` ("4 de 6 veces «me ha costado»", "Tiempo 30 %
  por encima de su media", "2 de 5 veces «me ha costado»").
- `LEVEL_CHANGES`: `{ date, area, from, to, reason }` con razones "Evaluación periódica",
  "Evidencia acumulada", "Ajuste por facilidad", "Ajuste por dificultad" e "Inicial" (from 0).
- `Note { id, date, author, shared, text }`; `LUCIA_NOTES`: dos notas de "Marta R.", una privada y
  una compartida con la familia.
- `FamilyChild { id, name, coverage, coverageKind: "familia" | "centro" | "prueba" | "sin",
  trialLeft?, lastSession, next }`. `FAMILY`: titular "Laura"; hijos Mateo ("Plan Familia"), Noa
  ("Centro Escola Vallparadís") y Olivia ("Prueba · 2 sesiones restantes", `trialLeft: 2`);
  `plan { name: "Plan Familia", origin: "App Store", renews: "14 nov 2026", ends: (un guion largo
  como marcador de "sin fecha fin"), price: "4,99 € / mes" }`; `payments`: tres cobros
  `{ date, concept: "Plan Familia mensual", amount: "4,99 €", status: "Pagado" }`.
- `GABINETE { name: "Gabinete Aprèn", coordinator: "Marta R.", seats: 20, used: 14, plan:
  "Licencia Gabinete", renews: "1 feb 2027", amount: "89 € / mes", payment: "Al día" }`.
- `CENTRO { name: "Escola Vallparadís", seats: 60, used: 47, groups: 3, ends: "30 jun 2027",
  payment: "Al día" }`.
- `Member { id, name, role, since, students, lastActive }`; `MEMBERS`: Marta R. (Coordinadora, 6
  alumnos), Jordi P. (Profesional, 4), Elena S. (Profesional, 4), Pere V. (Profesional, 0, alta el
  10 oct 2026).
- `INVITE_CODES`: `{ code, role, uses, expires }`: "APREN-PRO-7K2Q" (Profesional, "1 de 3", 30 nov
  2026) y "APREN-COO-4M9X" (Coordinador, "0 de 1", 5 nov 2026).
- `GROUPS`: `{ id, name, teacher, students: string[] }`: "3.º A" (Núria F.), "4.º B" (Albert G.),
  "5.º A" (Sílvia M.).
- `WEEKLY_SESSIONS`: `{ semana, sesiones }`, 8 semanas del "1 sep" al "20 oct" (38 a 74 sesiones).
- `ACCESS_LOG`: `{ date, who, action }`, cuatro entradas (invitó, reasignó, exportó informe, liberó
  de la licencia).
- `Notice { id, title, body, date, read, kind: "trial" | "info" | "success" }`; `NOTICES`: cuatro
  avisos (prueba de Olivia, resumen semanal, Hugo 16 días sin practicar, novedades), tres sin leer.

### 3.2 `panel/src/data/report.ts`

Reexporta todo `mock.ts` y añade `levelBandName(n)`: "Inicial" si n <= 3, "Intermedio" si n <= 6,
"Avanzado" en otro caso. Lo usa `panel.informes.tsx` para la distribución de niveles. La misma
lógica está duplicada en `levelBand()` de `ui.tsx`.

### 3.3 Roles o perfiles de demostración (`panel/src/lib/shine-context.tsx`)

- `ROLE_LABELS`: `familia` "Familia", `profesional` "Profesional independiente", `gabinete`
  "Coordinador de gabinete", `centro` "Coordinador de centro", `docente` "Docente".
- `ROLE_USER` (nombre que aparece en la cabecera): familia "Laura", profesional "Marta", gabinete
  "Marta", centro "Jordi", docente "Núria".
- Rol por defecto al cargar: `"profesional"`.
- `ShineProvider` guarda en estado de React `role`, `font` (`"nunito" | "dyslexic"`) y una cola de
  toasts; expone `useShine()` con `{ role, setRole, font, setFont, toast }`. El toast dura 3,5 s y se
  pinta abajo centrado. Nada se persiste: recargar la página vuelve a "profesional" y Nunito.
- `can`: `edit`, `invite`, `notes` y `portfolio` son verdaderos para todo rol menos `familia`;
  `members` e `isCoord` solo para `gabinete` y `centro`. `can.portfolio` no se usa en ninguna ruta.
- **Cómo se cambia de rol**: con el selector "Ver como" de la cabecera de `panel.tsx` (en pantallas
  grandes a la derecha; en pantallas pequeñas, en una barra bajo la cabecera). No hay login por rol:
  `/login` entra siempre como el rol activo.

---

## 4. Rutas

Todas las rutas de `panel/src/routes/` (TanStack Router, ficheros planos con punto como separador).

### `__root.tsx`

Raíz. `<html lang="es">`, título "Shine · Panel web", descripción "Panel de gestión de Shine para
familias, profesionales y centros.", carga Nunito, `styles.css` y favicon. Envuelve todo en
`QueryClientProvider` y `ShineProvider`. Página 404: "No encontramos esta página", "Puede que se haya
movido. Vuelve al inicio y sigue desde allí.", botón "Ir al inicio" a `/panel`. Página de error:
"Esta página no se ha cargado", "Algo ha fallado por nuestra parte. Prueba de nuevo.", botón
"Volver a intentarlo".

### `index.tsx` (URL `/`)

Redirige en `beforeLoad` a `/login`. Título "Shine · Panel web".

### `login.tsx` (URL `/login`, título "Entrar · Shine")

Tarjeta centrada con el `Wordmark` y tres modos:

- `login`: h1 "Hola de nuevo", "Entra para ver el progreso y gestionar tu cuenta."; campos "Email"
  (valor inicial `laura@ejemplo.com`) y "Contraseña" (valor inicial `demo1234`); botón "Entrar" (pone
  `loading` y navega a `/panel` a los 500 ms, sin validar nada); enlace "¿Has olvidado tu
  contraseña?".
- `recover`: h1 "Recupera tu contraseña", "Te enviaremos un enlace para crear una nueva."; campo
  "Email"; botón "Enviar enlace"; enlace "Volver a entrar".
- `sent`: `MotivationCard` "Revisa tu correo" con "Si {email} tiene cuenta, recibirás un enlace en
  unos minutos."; botón secundario "Volver a entrar".

### `alumno.tsx` (URL `/alumno`, título "Inicio del alumno · Shine")

Maqueta del **inicio del alumno en la app** (ancho máximo `max-w-xl`, barra inferior fija), la
entrada "Dashboard del alumno (02-dashboard.md)" del roadmap. Arriba, una barra de demo con el
enlace "Panel" (vuelve a `/panel`), la etiqueta "Estado demo" y cuatro chips: "Con datos", "Primer
uso", "Vacío", "Carga".

- Cabecera teal: saludo según la hora ("¡Buenos días" / "¡Buenas tardes" / "¡Buenas noches" + ",
  Lucía!"); con datos, "Esta semana: 5 actividades, 24 minutos" y la racha "3 días seguidos" (icono
  Flame); en primer uso, "Qué bien tenerte aquí. Elige una sesión para empezar.".
- Tarjeta "Continuar donde lo dejaste" (solo si hay una sesión empezada y no terminada): título de
  la sesión, `ProgressBar` "x de y actividades", botón "Continuar".
- Sección "Sesiones": cuatro sesiones fijas, "Sonidos que riman" (fon, nivel 7, 7 de 10),
  "Detective de letras" (vis, 5, 3 de 8), "Cadena de palabras" (mem, 4, 6 de 6, badge
  "Completada"), "Lee a tu ritmo" (flu, 5, 0 de 5); cada tarjeta lleva descripción, `AreaChip`,
  `LevelChip` y `ProgressBar`. Vacío: `EmptyState` "Todavía no tienes sesiones", "Vuelve pronto. Tu
  profe o tu familia te preparará una muy pronto.". Carga: esqueletos grises.
- Barra inferior: "Inicio" (activo) y "Mi progreso" (enlace muerto, `href="#"`).

### `panel.tsx` (URL `/panel`, título "Panel · Shine")

Layout del panel con cabecera y `Outlet`. Descrito en la sección 6.

### `panel.index.tsx` (URL `/panel`, título "Inicio · Shine")

Elige la portada por rol: `familia` → `FamilyHome`, `profesional` → `ProHome`, `docente` →
`TeacherHome`, `gabinete` y `centro` → `OrgHome` (todas en `components/shine/homes.tsx`).

- **FamilyHome**: cabecera "Hola, Laura 👋" / "Aquí tienes cómo van tus peques esta semana.";
  `MotivationCard` "¡5 días seguidos! 🌟" ("Tu constancia está dando frutos. Mateo ha completado 3
  sesiones esta semana."); `Alert` de aviso "A Olivia le quedan 2 sesiones de prueba" ("Puedes
  contratar un plan desde la app cuando quieras.") con botón "Ver opciones" a `/panel/plan`; una
  tarjeta por hijo con `Avatar`, nombre, badge de cobertura (ámbar si prueba, neutro si sin
  cobertura, teal en el resto), "Última sesión", "Siguiente paso" y botones "Ver progreso" (a la
  ficha) y "Abrir en la app" (enlace muerto).
- **ProHome**: cabecera "Hola, Marta 👋" / "Así va tu cartera esta semana." con botón "Ver alumnos";
  cinco `StatTile`: "Alumnos activos" (contados), "Sesiones esta semana" (23, fijo), "Sin actividad
  en 14 días" (contados, `daysSince > 14`), "Cambios de nivel recientes" (5, fijo), "En pausa por
  cupo" (1, fijo); tarjeta "Plazas de tu licencia" con `ProgressBar` "14 de 20 plazas usadas";
  sección "Necesitan atención" con una tarjeta por alumno inactivo: "{nombre} lleva N días sin
  practicar. Quizá sea buen momento para animarle." que lleva a la ficha.
- **OrgHome**: título con el nombre de la organización ("Gabinete Aprèn" o "Escola Vallparadís"),
  subtítulo "Hola, {nombre} 👋 Este es el resumen de tu centro/gabinete." y botón "Gestionar
  centro/gabinete" a `/panel/organizacion`; alertas "Quedan pocas plazas" ("{n} plazas libres.
  Puedes pedir una ampliación cuando lo necesites.") y "2 invitaciones pendientes" ("Pere V. y una
  familia aún no han aceptado su invitación."); tarjeta "Licencia" con `ProgressBar` "x de y
  plazas" y datos "Grupos" (solo centro), "Vigencia" ("Hasta {fecha}") y "Pago" (badge "Al día");
  tarjeta "Sesiones por semana" con `SessionsBarChart`; cuatro `StatTile`: "Alumnos activos",
  "Miembros activos" (4 en centro, 3 en gabinete), "Sesiones esta semana" (74), "Sin actividad en 14
  días" (3).
- **TeacherHome**: "Hola, Núria 👋" / "Tus alumnos de Escola Vallparadís."; `MotivationCard` "Buen
  comienzo de semana" ("Tu grupo ha hecho 18 sesiones en los últimos 7 días."); una tarjeta por
  alumno del grupo "3.º A" no archivado, con `Avatar`, nombre, "última sesión · grupo",
  `TrendIndicator`, los `AreaChip` del área más alta y más baja y `StatusBadge`, enlazada a la
  ficha; `Alert` "¿Algo no cuadra?" ("Si falta algún alumno, habla con tu coordinación.") con botón
  "Escribir a soporte" a `/panel/ayuda`.

### `panel.alumnos.index.tsx` (URL `/panel/alumnos`, título "Alumnos · Shine")

Para `familia` muestra `FamilyStudents`; para el resto, `Portfolio`.

**FamilyStudents**

- Cabecera "Alumnos" / "Las personas que practican con Shine en tu familia." con botones "Tengo un
  código del centro" (secundario) y "Añadir alumno".
- Tarjeta con `ProgressBar` "3 de 3 alumnos con el Plan Familia".
- Una tarjeta por hijo (`Avatar`, nombre, badge de cobertura) con "Ver ficha" y, si la cobertura es
  del centro, "Retirar mi acceso" (toast "Has retirado tu acceso a Noa"); si no, "Editar" (toast
  "Cambios guardados") y "Archivar" (toast "{nombre} archivado. Puedes restaurarlo cuando quieras.").
- Diálogo "Añadir alumno": `Alert` de aviso "Has llegado al cupo de tu plan" ("Con el Plan Familia
  puedes tener 3 alumnos. Archiva uno para añadir otro."), campo "Nombre o apodo" con pista "No hace
  falta su apellido ni su edad.", botón "Añadir" (toast "Alumno añadido").
- Diálogo "Código del centro": "Tu centro o gabinete te habrá dado un código. Escríbelo para ver el
  progreso.", campo "Código" (placeholder "Ej. VALL-FAM-82KD"), botón "Vincular" (toast "Código
  aceptado").

**Portfolio** (profesional, gabinete, centro, docente)

- Cabecera "Mis alumnos" (docente) o "Alumnos", subtítulo "{n} alumnos activos", botón "Dar de
  alta".
- `DataTable` con selección múltiple, búsqueda por nombre y clic en fila que abre la ficha. Barra de
  herramientas: `Select` "Filtrar por estado" con "Activos y en pausa" (por defecto; excluye
  archivados), "Activos", "En pausa", "Archivados"; con selección, "{n} seleccionados", botón
  "Archivar" (toast "{n} alumnos archivados") y "Exportar informe" (toast "Preparando informe…").
- Columnas: "Nombre" (avatar + nombre, ordenable), "Responsable" (solo para coordinadores,
  ordenable), "Última sesión" (ordenable por días), "Totales", "Últ. 4 sem.", "Área más baja"
  (`AreaChip` corto + `LevelChip` compacto), "Área más alta", "Tendencia" (`TrendIndicator`),
  "Estado" (`StatusBadge`), "Familia" (badge "Sí", "Invitación pendiente" con icono de sobre, o
  "No"; si es "no" se muestra el enlace "Invitar" que abre el diálogo de invitación).
- En móvil, tarjeta por alumno con avatar, "última sesión · N sesiones", tendencia, chips de áreas y
  badges de estado y familia.
- Con el filtro "Archivados": nota "Abre la ficha de un alumno archivado para restaurarlo.".
- Diálogo "Dar de alta un alumno": `ProgressBar` "14 de 20 plazas usadas · ocupará 1 plaza", campo
  "Nombre o apodo" con pista "Solo nombre o apodo. No guardamos edad ni email del alumno.", botón
  "Dar de alta" (toast "Alumno dado de alta").

**InviteFamilyModal** (exportado; lo usa también la ficha): título "Invitar a la familia de
{nombre}", texto "Comparte este código o el QR. La familia podrá ver el progreso desde su cuenta.",
un QR falso de 11 x 11 celdas generado a partir del código (`MockQR`), código "FAM-XXXX-YYY" derivado
del id y del total de sesiones, badge ámbar "Estado: sin enviar", campo "Email de la familia"
(placeholder `familia@ejemplo.com`) y botón "Enviar invitación" (toast "Invitación enviada").

### `panel.alumnos.$id.tsx` (URL `/panel/alumnos/{id}`, título "{nombre} · Ficha de alumno · Shine")

`loader` que busca el alumno con `getStudent` y lanza `notFound()` si no existe.

- Enlace "← Volver a alumnos".
- Tarjeta de cabecera: `Avatar` grande, h1 con el nombre, `StatusBadge`, `TrendIndicator`; línea
  de datos "Cobertura" (para familia: "Centro Escola Vallparadís" si es Noa, "Prueba · 2 sesiones
  restantes" si es Olivia, "Plan Familia" en otro caso; para el resto de roles, siempre "Gabinete
  Aprèn"), "Responsable" (`owner`), "Otros adultos" ("Laura (familia)" y ", invitación pendiente" si
  `family === "pendiente"`), "Última sesión". Botones según rol: "Invitar a la familia"
  (`can.invite` y familia no vinculada), "Reasignar" (`can.members`), "Liberar" (`can.invite` y no
  docente), "Restaurar" (si está archivado y `can.edit`; toast "{nombre} restaurado").
- Pestañas: "Niveles", "Sesiones", "Rendimiento", "Notas" (solo si `can.notes`, es decir, no
  familia) y "Exportar".
- **Niveles**: cinco tarjetas, una por área, con icono y nombre, `LevelChip` "Nivel N · Banda",
  "Sondeo: nivel 5" (solo en memoria de trabajo, fijo), "Última evaluación: 20 oct" (fijo) y
  "Evidencia: {8 + nivel} actividades"; tarjeta "Evolución en 12 semanas" con `AreaLineChart`;
  tarjeta "Historial de cambios" con las filas de `LEVEL_CHANGES` (fecha, `AreaChip`, "De X a Y" o
  "Empieza en Y", badge con la razón).
- **Sesiones**: si `total === 0`, `EmptyState` "Aún no hay sesiones" ("Cuando empiece una sesión,
  su progreso aparecerá aquí."); si no, un acordeón con las sesiones de `LUCIA_SESSIONS` (se muestran
  las de Lucía sea cual sea el alumno): fecha, tipo, lugar con icono de mapa, "{n} actividades",
  badge de valoración (ámbar si "Me ha costado"), "{min} min"; al desplegar, tabla con columnas
  "Actividad" (`AreaChip` corto + nombre), "Tiempo", "Aciertos", "Ritmo".
- **Rendimiento**: tarjeta "Actividades que le han costado más" ("Es normal. Son buenas pistas de
  qué reforzar con calma.") con las filas de `DIFFICULT`; tarjeta "Comparativa entre sesiones" con
  otro `AreaLineChart` (datos sintéticos por sesión).
- **Notas**: `Alert` de aviso "No escribas diagnósticos ni datos de salud en las notas."; tarjeta
  con campo "Nueva nota", `Toggle` "Compartir con la familia" y botón "Guardar nota" (añade la nota
  con autor "Marta R." y fecha "Hoy"; toast "Nota guardada"); lista de notas con autor, fecha, badge
  "Compartida con la familia" (icono Users) o "Solo profesionales" (icono Lock), texto y un `Toggle`
  para cambiar el reparto.
- **Exportar**: tarjeta "Informe PDF" con campo "Periodo" ("Últimas 4 semanas", "Últimas 12
  semanas", "Este curso") y enlace "Preparar informe" a `/panel/informes?alumno={id}`; tarjeta
  "Sesiones en CSV" con campo "Desde" (fecha, por defecto 2026-09-01) y botón "Descargar CSV"
  (`downloadCsv`, descarga real de un Blob `sesiones-{nombre}.csv` con columnas
  `fecha;tipo;lugar;actividades;valoracion;minutos` a partir de `LUCIA_SESSIONS`).
- Diálogos: "Liberar a {nombre}" ("Se liberará su plaza. Su historial se conserva y la familia
  vinculada podrá seguir usando Shine con su propio plan o la prueba gratuita.", botones "Cancelar"
  y "Liberar plaza", toast "Plaza liberada"); "Reasignar responsable" (campo "Nuevo responsable" con
  Marta R., Jordi P., Elena S., Pere V.; botón "Guardar", toast "Responsable actualizado").

### `panel.avisos.tsx` (URL `/panel/avisos`, título "Avisos · Shine")

Cabecera "Avisos" con botón "Marcar todo como leído". Dos columnas: a la izquierda, una tarjeta
por aviso de `NOTICES` (icono según `kind`: reloj de arena para `trial`, info para `info`, confeti
para `success`; título, cuerpo, fecha; fondo teal y marca "Sin leer" si no está leído; al pulsar se
marca como leído) y, si la lista queda vacía, `EmptyState` "Todo al día" ("Cuando haya algo nuevo,
te avisaremos aquí."); a la derecha, tarjeta "Emails que quieres recibir" con cinco `Toggle`:
"Resumen semanal" (activo), "Prueba a punto de agotarse" (activo), "Liberación por el centro"
(activo), "Pago fallido" (activo), "Novedades de Shine" (inactivo). Igual para todos los roles.

### `panel.ayuda.tsx` (URL `/panel/ayuda`, título "Ayuda · Shine")

Cabecera "Ayuda" / "Todo lo que necesitas para acompañar con Shine.". A la izquierda, sección
"Cómo funciona" con un acordeón de cuatro preguntas (la primera abierta): "Bloque inicial",
"Sesiones regulares", "Ajustes de nivel" y "Áreas y niveles" (este último dice: "Trabajamos 5
áreas: conciencia fonológica, discriminación visual, memoria de trabajo, ortografía y fluidez
lectora. Cada una va del nivel 1 al 10: inicial (1–3), intermedio (4–6) y avanzado (7–10)."). A la
derecha, tarjeta "Escribe a soporte" con campos "Asunto", "Alumno relacionado (opcional)" (select
con "Ninguno" y todos los `STUDENTS`) y "Mensaje", y botón "Enviar" (toast "Mensaje enviado. Te
responderemos pronto ❤️").

### `panel.cuenta.tsx` (URL `/panel/cuenta`, título "Mi cuenta · Shine")

Cabecera "Mi cuenta" y cuatro tarjetas:

- "Datos personales": campos "Nombre" (el de `ROLE_USER`), "Email" (`{nombre}@ejemplo.com`),
  "Nueva contraseña" (placeholder "Mínimo 8 caracteres"), "Idioma" (select "Español" / "Català");
  botón "Guardar cambios" (toast "Cambios guardados").
- "Fuente de lectura" ("Se aplica a todo el panel al momento."): dos tarjetas-radio "Nunito" y
  "OpenDyslexic" con el texto de muestra "La luna brilla sobre el bosque tranquilo."; cambian
  `font` en el contexto y, con él, `--font-base` en todo el documento.
- "Consentimientos": tres líneas con check: "Términos de uso · aceptados el 3 mar 2025", "Política
  de privacidad · aceptada el 3 mar 2025", "Tratamiento de datos de menores · aceptado el 3 mar
  2025".
- "Privacidad y seguridad": `Alert` "Exportar mis datos" ("Preparamos un archivo con todos tus
  datos. Se genera en cola y te llega por email en unas horas."); botones "Exportar mis datos" (toast
  "Solicitud recibida. Te llegará por email."), "Cerrar sesión en todos los dispositivos" (toast
  "Sesiones cerradas en todos los dispositivos") y "Borrar mi cuenta" (destructivo, abre el diálogo).
- Diálogo "Borrar tu cuenta": texto según rol (familia: "Se borrarán tus datos y los de los alumnos
  creados por ti. Si algún alumno está cubierto por un centro, seguirá allí y solo perderás tu
  acceso."; coordinador: "Antes de borrar tu cuenta, asigna la coordinación a otra persona. Los
  alumnos de la organización no se borran."; resto: "Tus alumnos quedarán sin responsable hasta que
  la coordinación los reasigne. Sus historiales se conservan."), "Tienes 30 días para arrepentirte.
  Escribe BORRAR para confirmar.", campo "Confirmación", botones "Cancelar" y "Borrar cuenta" (solo
  activo al escribir BORRAR; toast "Solicitud de borrado registrada").

### `panel.grupos.tsx` (URL `/panel/grupos`, título "Mis grupos · Shine")

Cabecera "Mis grupos" / "Grupos que tienes asignados en Escola Vallparadís." y `GroupsSection` en
modo `readOnly`: solo el primer grupo ("3.º A", docente Núria F., badges con los alumnos), sin
botones. Solo aparece en el menú del docente, pero cualquier rol puede abrir la URL.

### `panel.informes.tsx` (URL `/panel/informes`, título "Informes · Shine")

Acepta `?alumno={id}` (`validateSearch`). Cabecera "Informes" / "Prepara un informe, revísalo y
descárgalo en PDF.". Los coordinadores ven dos pestañas, "Informe de alumno" e "Informe de
organización"; el resto solo el informe de alumno.

- **StudentReport**: a la izquierda (oculto al imprimir), campos "Alumno" (select con todos los
  `STUDENTS`, por defecto el de la URL o "lucia"), "Periodo" ("Últimas 4 semanas", "Últimas 12
  semanas", "Este curso"), "Observaciones" (texto por defecto "Lucía mantiene un ritmo constante.
  Recomendamos seguir con dos sesiones cortas en casa."), botón "Descargar PDF" (`window.print()`)
  y botón secundario "Informe de cartera CSV" (descarga real `cartera.csv` con columnas
  `alumno;sesiones;ultimas4;fon;vis;mem;ort;flu` para todos los alumnos). A la derecha, la tarjeta
  `print-area` del informe: cabecera "Informe de {nombre}" con "{periodo} · {organización}" y, a la
  derecha, el nombre de la organización, "con" y el `Wordmark`; tres cifras "Sesiones", "Últimas 4
  semanas", "Responsable"; sección "Niveles por área" (tabla "Área" / "Inicio" / "Final" con
  `LevelChip` de la semana 1 y la 12); "Evolución" (`AreaLineChart`); "Actividades que le han
  costado más" (`DIFFICULT`); "Observaciones".
- **OrgReport**: campo "Periodo" ("Este trimestre", "Este curso"), botones "Descargar PDF" y
  "Descargar CSV" (`organizacion.csv`); cuatro tarjetas de cifra "Alumnos" (no archivados),
  "Sesiones" (489), "Nivel medio" ("5,8"), "Docentes activos" (4); tarjeta "Distribución de niveles
  por área" con `LevelDistributionChart`; tarjeta "Uso por docente" (tabla "Persona" / "Alumnos" /
  "Sesiones": Marta R. 6 / 182, Jordi P. 4 / 121, Elena S. 4 / 104, Pere V. 0 / 0).

### `panel.organizacion.tsx` (URL `/panel/organizacion`, título "Mi organización · Shine")

Si el rol no es coordinador (`can.members`), `EmptyState` "Solo para coordinación" ("Cambia a un
rol de coordinador en «Ver como» para ver esta sección."). Si lo es: cabecera con el nombre de la
organización y subtítulo "Mi centro" o "Mi gabinete", botón "Informes" a `/panel/informes`, y
pestañas "Miembros", "Alumnos", "Grupos" (solo centro), "Licencia y facturación", "Datos y
privacidad". Las secciones viven en `components/shine/org.tsx`:

- **MembersSection**: botones "Generar código de invitación" y "Dar acceso a un alumno";
  `DataTable` de `MEMBERS` con búsqueda y columnas "Nombre" (avatar), "Rol" (un `Select` en línea
  con "Coordinadora" / "Profesional" / "Docente"; cambiarlo da el toast "Rol actualizado"), "Alta",
  "Alumnos a cargo", "Última actividad" y un botón "Dar de baja" por fila; tarjeta "Códigos
  vigentes" con código, badge de rol, "Usos x de y · caduca {fecha}" y botones "Copiar" (toast
  "Código copiado") y "Revocar" (quita el código, toast "Código revocado"). Diálogos: "Nuevo código
  de invitación" (campos "Rol" con Profesional / Docente / Coordinador, "Usos máximos" numérico 5,
  "Caduca el" fecha 2026-12-30; botón "Generar" crea un código "APREN-XXXX", toast "Código
  creado"); "Dar de baja a {nombre}" (`Alert` "Sus {n} alumnos quedarán «sin responsable»" con
  "Podrás reasignarlos desde la pestaña Alumnos. No se pierde ningún dato."; "Cancelar" / "Dar de
  baja", toast "Miembro dado de baja"); "Dar acceso a un alumno" (selects "Miembro" y "Alumno";
  botón "Dar acceso", toast "Acceso concedido").
- **OrgStudentsSection**: botones "Alta masiva por CSV" y "Liberación de fin de curso";
  `DataTable` de `STUDENTS` con selección, búsqueda por nombre y responsable, barra con "Reasignar
  responsable" (toast "Responsable actualizado") y "Liberar de la licencia" (toast "{n} plazas
  liberadas") cuando hay selección; columnas "Nombre", "Responsable", "Grupo", "Familia" ("Sí" /
  "Pendiente" / "No"), "Última sesión", "Centro / casa" ("{centro} / {casa}"), "Niveles" (cinco mini
  chips "Fon 8", "Vis 6"...), "Estado". Diálogos: "Liberación de fin de curso" ("Se liberarán las
  plazas de todos los alumnos del centro. Las familias vinculadas conservan el historial y pueden
  seguir con su propio plan.", campo "Escribe LIBERAR para confirmar", botones "Cancelar" / "Liberar
  todas" activo solo con LIBERAR, toast "47 plazas liberadas"); "Alta masiva por CSV" ("Columnas:
  nombre;grupo;responsable. Sin edad ni email.", campo de archivo "Archivo CSV" que se parsea en el
  navegador separando por `;` o `,`, botón "Usar ejemplo" con dos filas (Bruno, 3.º A, Núria F.;
  Júlia, 4.º B, Albert G.), vista previa de las 6 primeras filas, botón "Dar de alta", toast "{n}
  alumnos dados de alta").
- **GroupsSection** (`readOnly?`): botón "Crear grupo" (si no es solo lectura); una tarjeta por
  grupo con nombre, "Docente: {nombre}", badges de alumnos y botón "Editar alumnos" (toast "Cambios
  guardados"). Diálogo "Crear grupo": campos "Nombre" (placeholder "Ej. 6.º B") y "Docente" (Núria
  F., Albert G., Sílvia M., Pau C.); botón "Crear" añade "Nuevo grupo" / "Sin asignar", toast "Grupo
  creado".
- **LicenseSection** (`centro`): para gabinete, solo un `Alert` "La licencia del gabinete se
  gestiona como la profesional" ("Ve a Licencia en tu menú de cuenta para ver plazas, importes y
  datos fiscales."). Para centro: tarjeta "Contrato" (`ProgressBar` "47 de 60 plazas", "Licencia de
  centro · curso 2026–27 · vigente hasta 30 jun 2027", "Contacto de facturación:
  administracio@vallparadis.cat", botón "Contrato de encargado de tratamiento", toast "Descargando
  contrato (demo)"); tarjeta "Facturas" ("Sep 2026 · 1.440 €" y "Mar 2026 · 1.440 €" con botón
  "PDF", toast "Descargando factura"); tarjeta "Solicitar ampliación" (campos "Plazas adicionales"
  numérico 20 y "Comentarios"; botón "Enviar solicitud", toast "Solicitud enviada").
- **PrivacySection**: `Alert` "Exportar datos de la organización" ("Se genera en cola y llega por
  email a la coordinación.") con botón "Exportar" (toast "Exportación en cola. Llegará por email.");
  tarjeta "Registro de accesos" con las filas de `ACCESS_LOG` (fecha, quién, acción).

### `panel.plan.tsx` (URL `/panel/plan`, título "Plan y licencia · Shine")

Para `familia`, `FamilyPlan`; para el resto, `ProPlan`.

- **FamilyPlan**: cabecera "Plan" / "Tu suscripción se gestiona desde la tienda donde la
  contrataste."; tarjeta "Plan Familia" con badge "Activo" y datos "Origen" (App Store), "Importe"
  (4,99 € / mes), "Próxima renovación" (14 nov 2026), "Fecha fin"; enlace "Gestionar suscripción"
  a `https://apps.apple.com/account/subscriptions`; tarjeta "Alumnos en prueba" con `ProgressBar`
  "Olivia: 3 de 5 sesiones de prueba usadas" y `Alert` "¿Cómo contratar?" ("Abre Shine en el móvil
  o la tablet, ve a Ajustes y elige un plan. El cobro lo hace la tienda."); tarjeta "Historial de
  cobros" con las filas de `FAMILY.payments` (fecha, concepto, importe, badge "Pagado").
- **ProPlan** (profesional, gabinete, centro, docente): cabecera "Licencia profesional" con botón
  "Abrir portal de cliente" (toast "Abriendo portal de cliente (demo)"); tarjeta "Licencia
  Gabinete" con badge "Al día" y datos "Asientos" ("3 profesionales"), "Importe" (89 € / mes),
  "Próxima renovación" (1 feb 2027), "Método" ("Tarjeta ···· 4242"), más `ProgressBar` "14 de 20
  plazas"; tarjeta "Datos fiscales" con "Nombre o razón social" (Aprèn Psicopedagogia SL), "NIF"
  (B12345678), "Dirección" (Carrer de Mallorca 120, 08036 Barcelona) y botón "Guardar cambios"
  (toast "Datos fiscales guardados"); y el mismo "Historial de cobros" que la familia (reutiliza
  `FAMILY.payments`, así que muestra cobros de "Plan Familia mensual" en la licencia profesional).

### Rutas de `signin/src/routes/`

- `__root.tsx`: raíz de la plantilla, en inglés (`<html lang="en">`, 404 "Page not found", error
  "This page didn't load"). Título "Shine", descripción "Shine: practicamos juntos." (en el original
  con guion largo), `twitter:site` "@Lovable". Carga Nunito 400 a 800 desde Google Fonts, el
  `styles.css` y el favicon. Solo `QueryClientProvider` y `Outlet`.
- `index.tsx` (URL `/`): título "Shine Login" (en el original "Shine", guion largo, "Login"),
  descripción "Inicia sesión en Shine de forma segura. Practicamos juntos.". Píldoras de estado
  "Normal", "Cargando", "Error" (con `aria-pressed`). Dentro del marco de móvil: círculo teal con el
  icono Sparkles y sombra `shadow-logo`, marca "Shine" a 44 px con el punto ámbar, lema "Practicamos
  juntos". En estado de error, aviso ámbar con icono CloudOff: "No hemos podido conectar", "Vuelve a
  intentarlo, estamos aquí para ayudarte.". Botón principal: en carga, un spinner con
  `aria-label="Cargando"`; en error, "Reintentar" con icono RotateCw; en normal, "Entrar" con
  ArrowRight. Pulsarlo pone "Cargando" 1,5 s y vuelve a normal. Nota al pie con ShieldCheck: "Se
  abrirá el navegador para iniciar sesión de forma segura. Volverás a la app al terminar.".

---

## 5. Componentes propios (`panel/src/components/shine/`)

### `ui.tsx`

Primitivas de interfaz, todas construidas con Tailwind sobre los tokens de `styles.css` (no usan
los componentes shadcn de `src/components/ui/`):

| Export | Qué es |
|---|---|
| `buttonVariants`, `Button` | `cva` con variantes `primary` (teal), `secondary` (borde teal), `destructive` (borde error), `ghost`; tamaños `md` (48 px) y `sm` (40 px); prop `loading` con `Loader2` girando |
| `Card` | tarjeta blanca con `shadow-card`; `pressable` añade `press-card` y sombra al pasar |
| `StatTile` | icono en cuadrado de color (`tone` amber, teal o success), cifra `stat-num` y etiqueta `label-text` |
| `ProgressBar` | barra ámbar sobre `track`, `role="progressbar"`, etiqueta debajo |
| `levelBand(n)`, `LevelChip` | banda Inicial (<= 3), Intermedio (<= 6), Avanzado; chip "Nivel N · Banda" o, `compact`, "N · Banda" |
| `AREA_ICON`, `AreaChip` | icono por área (fon Ear, vis Eye, mem Brain, ort SpellCheck, flu BookOpen); chip con nombre largo o `short`, opcionalmente pulsable con `active` |
| `MotivationCard` | tarjeta con borde izquierdo teal e icono (Sparkles por defecto) |
| `EmptyState` | icono en círculo, título, mensaje y acción opcional |
| `StatusBadge` | `activo` "Activo" (CheckCircle2), `pausa` "En pausa" (PauseCircle), `archivado` "Archivado" (Archive) |
| `Badge` | píldora con `tone` neutral, teal, amber o success e icono opcional |
| `TrendIndicator` | `sube` "Sube" (flecha arriba, teal), `estable` "Estable" (guion), `baja` "Baja" (flecha abajo, ámbar) |
| `Avatar` | iniciales sobre un fondo oklch cuyo tono sale de un hash del nombre |
| `Modal` | capa oscura, `role="dialog"`, título, botón "Cerrar", pie; se cierra con Escape y clic fuera |
| `Field`, `Input`, `Select`, `Textarea` | `Field` genera el `id` con `useId` y lo pasa a `children(id)`; los tres controles comparten estilo (48 px, borde line, foco teal) |
| `Toggle` | interruptor `role="switch"` con etiqueta a la izquierda |
| `Alert` | bloque teal (`info`) o ámbar (`warning`) con título, contenido y acción a la derecha |
| `Tabs` | `role="tablist"` con subrayado teal, desplazable en móvil |
| `PageHeader` | h1, subtítulo y zona de acciones (`no-print`) |
| `Wordmark` | "Shine" en teal con el punto ámbar |

Se usa en todas las rutas del panel y en `homes.tsx` y `org.tsx`.

### `DataTable.tsx`

Tabla genérica `DataTable<T extends { id: string }>` con `Column<T> { key, header, render, sort?,
className? }`. Props: `rows`, `columns`, `searchText` (activa el buscador "Buscar por nombre"),
`onRowClick`, `selectable` + `selected` + `onSelect` (casillas con "Seleccionar todos" /
"Seleccionar"), `mobileCard` (obligatoria: cómo pintar cada fila como tarjeta en pantallas
pequeñas) y `toolbar`. Ordena por columna con flechas, filtra en memoria y muestra "No hay
resultados con esa búsqueda." si no hay filas. Se usa en `panel.alumnos.index.tsx` (cartera) y en
`org.tsx` (`MembersSection`, `OrgStudentsSection`).

### `charts.tsx`

Librería: **Recharts** (`recharts` 3.10.1), como manda `AGENTS.md` ("charts via Recharts only").
Animaciones desactivadas (`isAnimationActive={false}`), rejilla `#E5E7EB`, ticks `#6B7280` a 14 px.

- `AreaLineChart({ data, height = 280 })`: `LineChart` con cinco `Line` (una por área, color de
  `AREA_COLORS`, grosor 2,5, sin puntos), eje Y de 0 a 10, eje X `semana`, y una leyenda propia
  `AreaLegend` con raya de color, icono y nombre de cada área. `aria-label` "Evolución de niveles por
  área en 12 semanas". Usada en la ficha (pestañas Niveles y Rendimiento) y en el informe de alumno.
- `SessionsBarChart({ data })`: `BarChart` con una sola barra `sesiones` en teal con esquinas
  redondeadas; `aria-label` "Sesiones por semana". Usada en `OrgHome`.
- `LevelDistributionChart({ data })`: `BarChart` horizontal apilado con `Inicial` (#4CAF7D),
  `Intermedio` (#F5A623) y `Avanzado` (#6D45A8), leyenda y etiqueta de valor dentro de cada tramo;
  `aria-label` "Distribución de niveles por área". Usada en el informe de organización.

### `homes.tsx`

Exporta `FamilyHome`, `ProHome`, `OrgHome` y `TeacherHome` (descritas en `panel.index.tsx`). Solo
las usa `panel.index.tsx`.

### `org.tsx`

Exporta `MembersSection`, `OrgStudentsSection`, `GroupsSection({ readOnly? })`,
`LicenseSection({ centro })` y `PrivacySection` (descritas en `panel.organizacion.tsx`). Las usa
`panel.organizacion.tsx`; `GroupsSection` también `panel.grupos.tsx`.

### `lib/`

`shine-context.tsx` (sección 3.3) y `utils.ts` (`cn()` = `twMerge(clsx(...))`).

---

## 6. Layout del panel (`panel.tsx` y `__root.tsx`)

No hay barra lateral: la navegación es una **cabecera superior pegajosa** (`sticky top-0`, 64 px,
contenido centrado a 1200 px, clase `no-print`).

- Izquierda: `Wordmark` enlazado a `/panel` (`aria-label` "Shine, inicio").
- Centro (a partir de `md`): los enlaces de `navFor(role)` como botones horizontales con icono;
  el activo va en teal-tint (home se compara exacto, el resto por prefijo de ruta).
- Derecha: selector "Ver como" (solo a partir de `lg`) con las cinco etiquetas de `ROLE_LABELS`;
  enlace "Avisos" con icono de campana, contador ámbar de no leídos (3 con los datos mock) y
  `aria-label` "Avisos, N sin leer"; y el menú de usuario, un botón con icono de persona, el nombre
  de `ROLE_USER` y una flecha (`aria-expanded`), que despliega: "Mi cuenta" (`/panel/cuenta`),
  "Plan y pagos" (`/panel/plan`, solo para familia y profesional), "Vista del alumno (app)"
  (`/alumno`) y "Cerrar sesión" (`/login`, en rojo).
- Bajo la cabecera, en pantallas menores de `lg`, una barra con el mismo selector "Ver como"; en
  pantallas menores de `md`, una fila de chips desplazable con las secciones (es el menú móvil).
- `main`: columna centrada a 1200 px con separación de 24 px y relleno 16 / 32 px, donde se pinta el
  `Outlet`.

Menú por rol (`navFor`):

| Rol | Items |
|---|---|
| familia | Inicio (`/panel`), Alumnos (`/panel/alumnos`), Plan (`/panel/plan`), Ayuda (`/panel/ayuda`) |
| profesional | Inicio, Alumnos, Informes (`/panel/informes`), Licencia (`/panel/plan`), Ayuda |
| gabinete | Inicio, Mi gabinete (`/panel/organizacion`), Alumnos, Informes, Ayuda |
| centro | Inicio, Mi centro (`/panel/organizacion`), Alumnos, Informes, Ayuda |
| docente | Mis alumnos (`/panel`, exacto), Mis grupos (`/panel/grupos`), Ayuda |

Iconos de lucide: Home, Users, CreditCard, FileText, Building2, UsersRound, HelpCircle.

`__root.tsx` aporta el `<html lang="es">`, las metaetiquetas, las fuentes, las páginas de 404 y
error (sección 4) y el `ShineProvider`, que además pinta los toasts (abajo centrados, fondo ink,
3,5 s).

---

## 7. `roadmap.md`, `README.md` y `AGENTS.md`

- `roadmap.md` ("# Shine · Panel web"): seis casillas, **todas marcadas**: "Design system +
  componentes shine"; "Layout panel + selector de rol"; "Inicio familia / profesional / coordinador
  / docente"; "Cartera de alumnos + ficha de alumno"; "Plan, informes, organización, grupos, cuenta,
  avisos, ayuda"; "Dashboard del alumno (02-dashboard.md) en /alumno con estados con datos, primer
  uso, vacío, carga". No deja pendientes. Cita un documento `02-dashboard.md` que no forma parte del
  proyecto (sería la especificación que se le dio a Lovable).
- `README.md` (idéntico en los dos proyectos): plantilla genérica de Lovable; "Built with: TanStack
  Start, TypeScript, React, Tailwind CSS"; para trabajar en local, `npm i` y `npm run dev`.
- `AGENTS.md` (solo en el panel): el aviso estándar de Lovable de no reescribir el historial de git
  y tres decisiones de proyecto: prototipo solo frontend con todos los datos en `src/data/mock.ts`
  y sin backend ("future Drupal theme"); la interfaz reutilizable en `src/components/shine/`
  (primitivas en `ui.tsx`, `DataTable`, gráficas solo con Recharts) y los tokens solo en
  `src/styles.css`; el rol de demostración y la fuente en `src/lib/shine-context.tsx`, con las
  comprobaciones de permiso a través de `can`.

---

## 8. Lo que es invención del prototipo frente al backend real

Contrastado con lo que documenta `CLAUDE.md` y `docs/api-design.md` del repositorio (módulos
`shine_account`, `shine_entitlement`, `shine_org`, `shine_level`). Donde se dice "no existe" se
refiere a la API y a las entidades actuales; conviene confirmar en `docs/` antes de dar nada por
cerrado.

Modelo de dominio:

- **Áreas y niveles**: el prototipo fija cinco áreas (fonológica, visual, memoria, ortografía,
  fluidez) con colores e iconos propios, y niveles del 1 al 10 en tres bandas (Inicial 1 a 3,
  Intermedio 4 a 6, Avanzado 7 a 10). En el backend las áreas son la taxonomía `areas` (y existe,
  por ejemplo, Funciones Ejecutivas) y los niveles son los términos Level0 a Level10, once valores
  sin bandas. La FAQ de Ayuda repite el "nivel 1 al 10".
- **Roles**: el prototipo tiene un rol global por usuario (familia, profesional, gabinete, centro,
  docente) elegido con "Ver como". En el backend un titular puede tener distintos roles por alumno
  (`owner`, `guardian`, `staff` en `learner_access`) y por organización (`coordinator`,
  `professional`, `teacher` en `organization_membership`, con organizaciones de tipo `practice` o
  `school`). La correspondencia aproximada sería: familia = owner/guardian sin organización;
  profesional = titular con plan professional; gabinete = coordinator de una `practice`; centro =
  coordinator de una `school`; docente = teacher. No hay un único rol por cuenta.
- **Alumno** (`Student`): `daysSince`, `total`, `last4`, `trend`, `centerSessions` /
  `homeSessions` y `group` no los devuelve la API; habría que calcularlos a partir de sesiones y
  resúmenes (`field_operated_by` dice qué titular generó cada sesión, que es lo más parecido a
  "centro / casa"). El estado `pausa` es en el backend una cobertura (`paused`, `blocked_reason`),
  no un estado del alumno. El idioma del alumno (`langcode`) no aparece en el prototipo.
- **Sesión** (`Session`): los tipos "Regular / Evaluación periódica / Ajuste / Bloque inicial", el
  lugar "Gabinete / Casa / Centro" y la valoración "Muy bien / Bien / Me ha costado" son
  invenciones; el backend tiene `field_session_kind` (`regular` | `evaluation`),
  `field_evaluation_scope` / `reason` / `seq`, `sessionfeedback.overall` (`easy` | `ok` | `hard`)
  y `activityfeedback.rating`. Los campos `hits` y `pace` de cada actividad ("9 de 10", "Buen
  ritmo") son texto libre inventado; el dato real son los `activitysummary` de cada tipo.
- **Historial de cambios de nivel**: las razones "Evaluación periódica", "Evidencia acumulada",
  "Ajuste por facilidad", "Ajuste por dificultad", "Inicial" y el "Sondeo: nivel 5" son texto del
  prototipo; el backend registra los cambios en `userarealevel_log` con sus propios códigos de razón
  (ver `docs/level-system.md`).

Funcionalidades sin equivalente en el backend:

- **Notas** del profesional sobre un alumno, con "Compartir con la familia" (`Note`,
  `LUCIA_NOTES`, pestaña Notas).
- **Avisos** (`NOTICES`) y preferencias de email (resumen semanal, prueba a punto de agotarse,
  liberación por el centro, pago fallido, novedades).
- **Informes PDF** (`window.print()` sobre una tarjeta `print-area`) y **CSV** (de sesiones, de
  cartera y de organización): no hay endpoint; los CSV se generan en el navegador con datos mock.
- **Grupos** o clases (`GROUPS`, `GroupsSection`, `/panel/grupos`, columna "Grupo", "Uso por
  docente"): las organizaciones del backend tienen miembros y alumnos en plaza, no grupos.
- **Alta masiva por CSV** de alumnos y **liberación de fin de curso** en bloque: el backend solo
  tiene `POST /shine/learners` (uno a uno) y `POST /shine/learners/{uuid}/release` por alumno.
- **Reasignar responsable** (cambiar el `owner` de un alumno) y **dar de baja a un miembro** o
  **cambiar su rol** en línea: no hay endpoints; sí existe repartir acceso `staff`
  (`POST /shine/learners/{uuid}/staff` y su `DELETE`), que es lo que "Dar acceso a un alumno"
  representa.
- **Códigos de invitación de la organización** gestionados por el coordinador (generar con rol,
  usos máximos y caducidad; copiar; revocar): la entidad `organization_invite` existe con esos
  campos, pero hoy los códigos se generan en la administración de Drupal
  (`/admin/shine/organizations`), no desde la API; solo el canje (`POST /shine/organizations/join`)
  está en la API.
- **Invitación a la familia** con email y QR: el backend da un código de vínculo
  (`POST /shine/learners/{uuid}/invite` → `{ code, expires_at }`, se muestra una sola vez) que la
  familia canjea en `POST /shine/learners/join`; no envía emails ni guarda un "Estado: sin enviar".
  La app ya genera el QR con `react-native-qrcode-svg`. "Tengo un código del centro" de la familia
  equivale a ese canje.
- **Licencia y facturación**: las plazas (`seats` / `used`) corresponden a `max_learners` y
  `used_seats` de `GET /shine/organizations`, y el "portal de cliente" existe
  (`POST /shine/billing/portal`, Stripe); pero las facturas descargables, el "Contrato de encargado
  de tratamiento", la "Solicitud de ampliación", los "Datos fiscales" editables y el "Historial de
  cobros" no están en la API (el cobro familiar va por RevenueCat / tienda y el profesional por
  Stripe).
- **Cuenta**: "Exportar mis datos", "Cerrar sesión en todos los dispositivos", los consentimientos
  con fecha de términos y privacidad y el "Registro de accesos" de la organización no existen (hay
  `field_adult_consent` y `field_adult_consent_at`). "Borrar mi cuenta" sí existe
  (`POST /shine/account/delete` con contraseña) pero anonimiza al momento, sin los "30 días para
  arrepentirte". El "Idioma" de la cuenta no existe como tal: el idioma es del alumno
  (`preferred_langcode`). La fuente OpenDyslexic sí tiene correspondencia (`field_dyslexic_font`).
- **Login del panel** con email y contraseña y recuperación por enlace: el prototipo no llama a
  nada. La app usa el grant `password` de OAuth2; un panel como tema de Drupal usaría la sesión de
  Drupal, como la página `/pro`.
- **Inicio del alumno** (`/alumno`): el backend entrega una sesión cada vez
  (`POST /shine/session/generate`, con pendiente única), no una lista de cuatro sesiones con
  progreso parcial; la racha de días, "Esta semana: 5 actividades, 24 minutos" y la navegación "Mi
  progreso" son del prototipo.
- **Sign In**: el texto "Se abrirá el navegador para iniciar sesión de forma segura" corresponde al
  flujo Authorization Code que la app dejó de usar en la FASE 14 (hoy el login es in-app con email y
  contraseña).

Rarezas internas del propio prototipo, útiles si se reutiliza el código:

- La pestaña Sesiones y la de Rendimiento muestran siempre los datos de Lucía (`LUCIA_SESSIONS`,
  `DIFFICULT`) sea cual sea el alumno; el historial de niveles de los demás es sintético.
- `ProPlan` reutiliza `FAMILY.payments`, así que la licencia profesional lista cobros de "Plan
  Familia mensual".
- Cifras fijas en el código: 23 sesiones esta semana, 5 cambios de nivel, 1 en pausa por cupo, 74
  sesiones semanales, 3 sin actividad, 489 sesiones, nivel medio "5,8", 4 docentes activos, "14 de
  20 plazas", "3 de 3 alumnos con el Plan Familia", "Olivia: 3 de 5 sesiones de prueba".
- Ninguna acción persiste nada y el rol no sobrevive a una recarga.
- `levelBand()` de `ui.tsx` y `levelBandName()` de `report.ts` son la misma regla duplicada.
- `can.portfolio` está definido y no se usa.
