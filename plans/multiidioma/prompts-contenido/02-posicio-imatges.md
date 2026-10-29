# 02. Posición de imágenes (activity_image_position): lotes bilingües

Notas internas y prompt para generar lotes de "Posición de imágenes" en los dos idiomas. Estado a
2026-10-26 (FASE 18, subplan 05).

## Notas internas

- **Lo que se comparte.** La imagen es la misma en los dos idiomas y solo cambia el nombre, así
  que el registro natural es bilingüe: `idiomas: ["es", "ca"]`, código sin XX (IMG-L01-MEM-004) y
  `nombre` de cada imagen como objeto {es, ca}. El importador crea dos nodos (IMG-ES-... e
  IMG-CA-...) con los mismos grupos. Un registro solo en catalán (idioma ca) solo tiene sentido
  cuando el grupo se monta con criterios que no valen en castellano (pares mínimos catalanes,
  sílaba inicial catalana: Level9 y Level10).
- **Fuente de nombres.** shine/content/images/manifest.json: `nombre` y `lectura` (castellano) en
  la raíz de cada entrada y el bloque `ca` (nombre, artículo, silabeo, lectura catalana,
  etiquetas, usable) validado por el experto. Solo entradas con `estado: aceptada` y `ca.usable:
  true` en los lotes bilingües. La clave `imagen` del lote es el slug (fichero sin .png).
- **Primeros lotes** (Level0 a Level2): shine/content/imagenes-es-ca-level0-2-v1.json, 9
  registros (3 por nivel, 18 nodos), generados con shine/content/generadores/imagenes.py (semilla
  1805, sin reutilizar ninguna imagen dentro del lote y evitando las 8 del registro de ejemplo
  IMG-L00-MEM-001). El script cubre Level0 a Level7 (categorías distintas, misma categoría, misma
  subcategoría); Level8 a Level10 se montan con las etiquetas vis: y fon: y los pares mínimos de
  docs/generador/Banco de imágenes.md 5.7, que es lo que pide este prompt.
- **Revisión del experto (2026-10-27)**: en Level0 solo monosílabos o bisílabos simples
  (resposta-revisio-lots-ca.md, punto 5). El generador lo aplica con `nombre_simple` (48 imágenes
  lo cumplen en los dos idiomas) y el Level0 del lote se regeneró con esa regla. IMG-L00-MEM-003
  ya tenía resultados en castellano: se despublicó y su material nuevo es IMG-L00-MEM-005.
- **Antes de cada lote**: `ddev drush shine-content:inventory --type=activity_image_position`
  (los dos idiomas) para el siguiente número libre en los dos y las imágenes ya usadas en el
  mismo nivel. **Después**: `--dry-run`, importación, revisión del experto (muestra), publicación.

## Prompt

> Todo lo que sigue se pega en Cowork o en Codex junto con shine/content/images/manifest.json.

Actúas como ingeniero de contenido de **Shine**, una aplicación de ejercicios de lectura para
niños y jóvenes con dislexia (de 5 a 15 años) en castellano y en catalán. Vas a generar un lote
JSON de actividades de **Posición de imágenes** para el importador de Drupal
(`drush shine-content:import`). Mecánica: en cada grupo el niño mira varias ilustraciones
numeradas, pulsa "Siguiente paso" y responde "¿En qué posición estaba?" leyendo solo el nombre
escrito de una de ellas. Área principal: Memoria de Trabajo (Auditiva y Visual); secundaria:
Funciones Ejecutivas y Atención. La métrica es la precisión: la lectura del nombre no puede ser
el obstáculo.

### Fuente

El fichero manifest.json adjunto describe el banco de imágenes: una entrada por ilustración con
`fichero` (el slug de la imagen es el nombre sin .png: es la clave `imagen` del lote), `nombre`,
`articulo`, `silabas`, `lectura` (nivel lector castellano: L0 a L5), `categoria`, `subcategoria`,
`etiquetas` (vis: parecido visual; fon: misma sílaba inicial en castellano), `estado` y el bloque
`ca` con la ficha catalana: `nombre`, `articulo`, `silabas` (silabeo del IEC), `lectura` (nivel
lector catalán), `etiquetas` (fon: sílaba inicial catalana; espejo: letras b d p q; graf:
dígrafos y grafías propias; sib: sibilantes) y `usable`.

Reglas de uso de la fuente:

1. Solo entradas con `estado: "aceptada"`. En un lote bilingüe, además `ca.usable: true`.
2. El nombre de cada imagen va **por idioma**: `nombre: {"es": nombre, "ca": ca.nombre}`, tal cual
   (minúsculas, singular, sin artículo). Nunca traduzcas ni inventes un nombre: si la imagen no
   tiene ficha catalana usable, no entra en un lote bilingüe.
3. Nivel lector: en **Level0, solo nombres monosílabos (pa, pi, sol, nen) o bisílabos de sílabas
   abiertas simples (pila, sopa, boca) en los dos idiomas**, sin dígrafos, grupos consonánticos ni
   diptongos, sea cual sea su `lectura` (nunca taronja, cirera ni gusano); en Level1, `lectura` L0
   o L1 **y** `ca.lectura` L0 o L1; en Level2, hasta L2 en los dos idiomas; de Level3 en adelante,
   hasta el nivel de la actividad en los dos idiomas (la escala del manifiesto llega a L5).

### Parámetros por nivel

| Nivel | Imágenes por grupo | Grupos | Relación entre las imágenes del grupo | Posición preguntada |
|---|---|---|---|---|
| Level0 | 2 | 4 | Categorías distintas (categoria) | Primera o última |
| Level1 | 3 | 4 | Categorías distintas | Primera o última |
| Level2 | 3 | 4 | Categorías distintas | Cualquiera |
| Level3 | 4 | 5 | Misma categoría amplia (misma categoria) | Cualquiera |
| Level4 | 4 | 5 | Misma categoría amplia | Preferencia por las centrales |
| Level5 | 5 | 5 | Misma categoría amplia | Centrales |
| Level6 | 5 | 6 | Misma categoría estrecha (misma subcategoria) | Centrales |
| Level7 | 6 | 6 | Misma categoría estrecha | Centrales |
| Level8 | 6 | 6 | Parecidas en forma o color (misma etiqueta vis:) | Centrales |
| Level9 | 6 | 6 | Parecidas y con nombres que empiezan igual (vis: más fon: del idioma) | Centrales |
| Level10 | 6 | 6 | Parecidas en forma, color y nombre (pares mínimos) | Centrales |

Centrales = ninguna de las dos posiciones extremas. En Level9 y Level10 el parecido de nombre es
del idioma: en castellano vale la etiqueta fon: de la raíz (pa-: pato, pala, pan, patín, payaso) y
los pares mínimos castellanos (casa, taza, cara, copa, capa, cuna); en catalán, la etiqueta fon:
del bloque ca (pa-: pala, pa, patí, paper, pastís, pallasso) y los pares mínimos catalanes (gat,
got, gos; llit, llet; gerro, gerra; tapa, tap; ós, os; sal, sol; cap, capa, copa). Como un grupo
así no coincide en los dos idiomas, esas actividades van en registros de un solo idioma
(`idioma: "es"` o `idioma: "ca"`, código con ES o CA).

### Reglas de composición

- Ninguna imagen repetida dentro de una actividad; dentro de un grupo, nombres distintos en cada
  idioma.
- Por debajo de Level8 no van juntas en un grupo las parejas casi iguales (naranja y mandarina,
  carta y sobre, gusano y oruga, pierna y rodilla, rana y sapo, leopardo y guepardo, lobo y
  coyote) ni los pares mínimos catalanes de arriba: la pregunta sería injusta.
- La posición preguntada varía entre los grupos de una actividad (nunca la misma en todos) y
  respeta la columna del nivel.
- Entre actividades del mismo nivel, material distinto: el importador avisa cuando dos
  actividades comparten el 50 % de sus imágenes y rechaza el lote al 80 %. Las imágenes ya usadas
  en ese nivel están en el inventario que te damos: no las repitas si quedan otras.
- Todas las imágenes del banco tienen el mismo estilo: no hace falta ninguna comprobación visual.

### Forma del registro

Un fichero JSON con `lote`, `descripcion`, `origen` (quién lo generó, con qué criterio y, si hay,
qué semilla) y `actividades`, lista de registros como este:

```json
{
  "tipo": "activity_image_position",
  "codigo": "IMG-L01-MEM-004",
  "idiomas": ["es", "ca"],
  "titulo": {"es": "¿Dónde estaba?", "ca": "On era?"},
  "area_principal": "Memoria de Trabajo (Auditiva y Visual)",
  "area_secundaria": "Funciones Ejecutivas y Atención",
  "niveles": ["Level1"],
  "instruccion": {
    "es": "Mira bien dónde está cada dibujo. Después te preguntaremos en qué posición estaba uno de ellos.",
    "ca": "Mira bé on és cada dibuix. Després et preguntarem en quina posició era un d’ells."
  },
  "explicacion": "Image Position",
  "contenido": {
    "grupos": [
      {"posicion": 3, "imagenes": [
        {"imagen": "rey", "nombre": {"es": "rey", "ca": "rei"}},
        {"imagen": "jabon", "nombre": {"es": "jabón", "ca": "sabó"}},
        {"imagen": "arroz", "nombre": {"es": "arroz", "ca": "arròs"}}
      ]},
      {"posicion": 1, "imagenes": [
        {"imagen": "camello", "nombre": {"es": "camello", "ca": "camell"}},
        {"imagen": "tirita", "nombre": {"es": "tirita", "ca": "tireta"}},
        {"imagen": "perro", "nombre": {"es": "perro", "ca": "gos"}}
      ]}
    ]
  }
}
```

- `codigo`: IMG-Lnn-MEM-nnn sin la parte de idioma en los registros bilingües (el importador la
  inserta: IMG-ES-L01-MEM-004 e IMG-CA-L01-MEM-004); IMG-ES-Lnn-MEM-nnn o IMG-CA-Lnn-MEM-nnn en los
  de un idioma. Lnn es el nivel de la actividad. El número es el siguiente libre que te damos del
  inventario, en los dos idiomas; nunca se reutiliza un número.
- `niveles`: un solo nivel por actividad. `posicion`: entero entre 1 y el número de imágenes.
- En un registro de un solo idioma, `titulo`, `instruccion` y `nombre` son textos, no objetos.
- Los textos catalanes llevan apóstrofo tipográfico (’). Nada de HTML ni emojis.
- Claves desconocidas, nombres que no sean exactamente los del manifiesto o imágenes repetidas
  hacen fallar el lote entero: no inventes nada.

### Entrega

1. El fichero del lote: shine/content/imagenes-{es-ca o ca}-level{a}-{b}-v{n}.json.
2. En `descripcion`, cuántas actividades por nivel y qué criterio de agrupación se ha usado en
   cada uno; en `origen`, cómo se generó.
3. Una lista aparte con, por nivel, 5 actividades (o el 10 % si son más) para la revisión del
   experto: código, grupos y posición preguntada, con la pregunta del criterio del catálogo (¿un
   niño de esa edad sin dificultades lo valoraría "Bien así"?).
4. Imágenes que hubieras querido usar y no están en el banco o no son usables en catalán, para
   decidir si se generan nuevas.
