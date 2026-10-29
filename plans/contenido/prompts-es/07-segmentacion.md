# 07. Segmentación léxica en castellano (activity_word_split)

Prompt de generación de lotes castellanos de "Separa las palabras". Contrato en
docs/exercise-catalog.md 6.3; versión catalana en plans/multiidioma/prompts-contenido/07-segmentacio.md.

## Notas internas

- **Lo que hay**: SEG-ES-L01-LIN-001 y SEG-ES-L02-LIN-001 (lote de ejemplo fase13). Siguiente libre:
  el del inventario.
- **Ambigüedad** (criterio del experto del 2026-10-27, aplicado a los dos idiomas): la app
  corrige contra la frase declarada, no contra el léxico. Una partición alternativa hecha de
  palabras sueltas sin sentido no descarta la frase ("casa" se puede leer "ca sa", pero nadie lo
  leería así). Hasta Level6 solo se descarta la frase si otra partición da una frase con sentido
  que un niño podría leer ("sinoes": si no es / sino es; "aver": a ver / haber). Desde Level7 esa
  ambigüedad es el objetivo (pares que se confunden) y la decide la revisión humana.
- **Contracciones** al y del, y los pronombres enclíticos (dámelo, ponte, mírala) son una sola
  palabra sin guion: el importador los admite tal cual (a diferencia del catalán, aquí no hay
  guion).
- **Estructuras**: Level1 sin trabadas ni codas complejas; Level2 con trabadas; Level3 con CVCC,
  hiatos y esdrújulas.

---

## Prompt

Actúas como generador de contenido de **Shine**, una aplicación de ejercicios de lectura para niños
y jóvenes con dislexia (de 5 a 15 años) que usan acompañados de un adulto. Vas a escribir un lote
de actividades **en castellano** del ejercicio "Separa las palabras" (tipo activity_word_split):
una frase aparece sin espacios ("elgatocomepan") y el niño toca las letras donde empieza cada
palabra hasta separarlas todas. Se guarda la frase correcta con espacios; la versión sin espacios
la deriva la app. Entregas un JSON que importa Drupal.

### Reglas del castellano

1. **Minúsculas, sin puntuación ni cifras, sin nombres propios**; se conservan tildes (está, qué,
   también), diéresis y ñ. Espacios simples.
2. **Ninguna otra lectura con sentido.** La app solo acepta la partición de la frase declarada.
   Una partición alternativa en palabras sueltas sin sentido no importa; descarta la frase hasta
   Level6 solo si otra partición forma una frase que un niño podría leer con sentido ("sinoes",
   "aver").
3. **Léxico y estructuras del nivel** (catálogo 3.6 y 2.3): hasta las 1.000 palabras más
   frecuentes en Level1, 2.000 en Level2, 3.000 en Level3, 5.000 en Level4, 7.000 en Level5,
   10.000 en Level6, 15.000 en Level7, 20.000 en Level8, sin límite desde Level9. Level1 sin
   trabadas ni codas complejas; Level2 con trabadas; Level3 con CVCC, hiatos y esdrújulas.
4. **Uniones que se trabajan por nivel**: artículos, preposiciones y conjunciones desde Level2;
   contracciones al y del desde Level3; pronombres átonos delante del verbo desde Level5 (la mamá
   lo lleva, se lo da); enclíticos desde Level6 (dámelo, ponte las botas, mírala bien); pares que
   se confunden desde Level7 (a ver / haber, si no / sino, por qué / porque, también / tan bien,
   de más / demás, con que / conque, a sí mismo / asimismo).
5. Frases naturales y con sentido para un niño, en presente, con sujetos cotidianos (el gato, la
   niña, el tren, la lluvia).

### Parámetros por nivel

| Nivel | Frases | Palabras por frase | Uniones que se trabajan |
|---|---|---|---|
| Level0 | No recomendado | | |
| Level1 | 4 | 3 | Palabras muy frecuentes de 1 y 2 sílabas (el sol sale, la niña ríe) |
| Level2 | 5 | 4 a 5 | Artículos, preposiciones y conjunciones (el, la, un, a, de, con, y) |
| Level3 | 5 | 5 a 6 | Contracciones al y del, hay, muy (el niño va al parque) |
| Level4 | 5 | 6 a 7 | Más longitud y adjetivos (los niños del pueblo van a la escuela) |
| Level5 | 6 | 7 a 8 | Pronombres átonos delante del verbo (la mamá lo lleva a casa) |
| Level6 | 6 | 8 a 9 | Enclíticos (ponte las botas antes de salir, dámelo ahora) |
| Level7 | 6 | 9 a 10 | Pares que se confunden: a ver / haber, si no / sino, por qué / porque, también / tan bien |
| Level8 | 6 | 10 a 11 | Ídem con vocabulario menos frecuente |
| Level9 | 6 | 11 a 12 | Dos oraciones coordinadas |
| Level10 | 6 | 12 a 14 | Oraciones con subordinadas |

La frase cabe en un móvil pequeño con la tipografía del ejercicio: como mucho 120 caracteres.

### Etiquetas fonológicas

- **`esfuerzo`** (obligatorio): los términos de la taxonomía `decoding_effort` de las estructuras de
  nivel más alto que aparecen en el material (por ejemplo, "Trabadas con r (CCV)" si la más difícil es
  una trabada con r). Lo calcula `shine/content/generadores/etiquetar_lote.py`: puedes dejarlo vacío
  y ejecutar `python3 etiquetar_lote.py ../{lote}.json --write`, o ponerlo a mano y comprobar que
  coincide. El mismo script avisa de las palabras con una estructura por encima del nivel.
- **`sonoridad`** (solo si la actividad trabaja un grupo fonético concreto, por ejemplo todas las
  palabras con r o con ll/y): los términos de la taxonomía `sonority` del castellano. Si la actividad
  no se centra en un grupo, no se pone.

### Forma del registro

```json
{
  "tipo": "activity_word_split",
  "codigo": "SEG-ES-L02-LIN-002",
  "idioma": "es",
  "titulo": "Separa las palabras",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Rendimiento y Velocidad de Procesamiento",
  "niveles": ["Level2"],
  "instruccion": "La frase está escrita sin espacios. Toca una letra para poner un espacio justo delante, hasta separar todas las palabras, y pulsa Comprobar.",
  "explicacion": "Word split",
  "contenido": {
    "frases": ["el gato come pan", "la niña va en tren", "la flor es azul", "un dragón verde y grande", "el niño bebe un zumo"]
  }
}
```

- codigo: SEG-ES-Lnn-LIN-nnn, correlativo desde el siguiente libre que te indiquen.
- Sin frases repetidas en la actividad ni, a ser posible, entre actividades del mismo nivel.
- El fichero: {"lote": "segmentacion-es-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Qué entregar

1. El fichero JSON del lote.
2. Por frase, las otras particiones con sentido que hayas encontrado (o la otra lectura, desde Level7).
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
