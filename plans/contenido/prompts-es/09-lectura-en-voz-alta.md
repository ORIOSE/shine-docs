# 09. Lectura en voz alta en castellano (activity, formato audio_reading)

Prompt de generación de lotes castellanos de "Lectura en voz alta". Contrato en
docs/exercise-catalog.md 5.2; importable desde el 2026-10-27 (handler `TextActivityHandler`,
prefijo LEC; el player ya se desplaza). Versión catalana en
plans/multiidioma/prompts-contenido/09-lectura-en-veu-alta.md.

## Notas internas

- **Lo que hay**: nada. Siguiente código: LEC-ES-Lnn-VEL-001.
- **Longitud decidida** (E10, plans/multiidioma/respostes-dubtes-expert.md, 2026-10-28): **un solo
  párrafo de 35 a 80 palabras en todos los niveles**. A partir de Level4 la dificultad crece en
  léxico (rango de frecuencia), estructuras silábicas y subordinadas, no en volumen.
- **Level0 no se recomienda** y el importador lo rechaza.
- **field_seconds** (`segundos`): palabras × 60 / velocidad de referencia del nivel (tabla 2.3:
  40 ppm en Level1, 60 en Level2, 80 en Level3, 100 en Level4, 110 en Level5, 120 en Level6, 130
  en Level7, 140 en Level8, 150 en Level9, 160 en Level10), redondeado al entero.
- **Validación**: el importador cuenta las palabras y exige el rango del nivel con un 10 % de
  margen (32 a 88), un solo párrafo, sin HTML, 1.200 caracteres por párrafo como mucho y `segundos`
  entre 10 y 600. Frase media, frecuencia y legibilidad (Fernández Huerta o INFLESZ) son de la
  generación y de la revisión.

---

## Prompt

Actúas como autor de textos infantiles y juveniles y como logopeda de **Shine**, una aplicación de
ejercicios de lectura para niños y jóvenes con dislexia (5 a 15 años) que usan acompañados de un
adulto. Vas a escribir un lote de **textos para leer en voz alta en castellano** (node `activity`,
formato `audio_reading`): el niño pulsa "Empezar a leer", lee el texto completo en voz alta y pulsa
"He terminado"; se mide el tiempo total. Área principal: Rendimiento y Velocidad de Procesamiento;
secundaria: Competencia Lingüística y Fonológica.

### Reglas del texto

1. **Castellano normativo** (RAE), puntuación normal, diálogos con raya (—) desde Level3.  Nombres propios (decisión E10, 2026-10-28): en Level1 y
   Level2 solo cortos y frecuentes, de una o dos sílabas sin trabadas ni hiatos (Pol,
   Pau, Marc, Pep, Ana, Lola, Sara; precisión del grupo, 2026-10-29); Leo, Teo y Mia, con hiato, solo
   como excepción de nombre muy frecuente; nunca de más de dos sílabas, con trabadas u ortografía
   compleja (Gisela, Meritxell, Christopher). Desde Level3, los que cumplan las
   estructuras del nivel, dentro del margen del tema. Sin cifras: los números se escriben con letras.
2. **Original**, nunca traducido ni adaptado de un texto existente; tema apto para la edad, sin
   contenidos sensibles, con personajes y situaciones cotidianas en los niveles bajos y
   expositivo o divulgativo en los altos.
3. **Número de palabras dentro del rango del nivel** (tabla de abajo); frase media y frase más
   larga dentro del nivel; al menos el 90 % de las palabras dentro de las estructuras silábicas
   del nivel y el 95 % dentro de su rango de frecuencia (catálogo 2.3 y 3.6).
4. **Un solo párrafo**: la lista `parrafos` lleva exactamente un texto, de 1.200 caracteres como
   mucho. Lo que distingue un Level8 de un Level2 es el léxico y la sintaxis, no la longitud.
5. **Legibilidad** como control adicional (Fernández Huerta o INFLESZ): más fácil cuanto más bajo
   el nivel; anota el índice de cada texto en la entrega.

### Parámetros por nivel (catálogo 5.2)

| Nivel | Palabras | Párrafos | Palabras por frase (media) | Tipo de texto | Dónde crece la dificultad |
|---|---|---|---|---|---|
| Level0 | No recomendado | | | | |
| Level1 | 35 a 80 | 1 | 4 | Narrativo en presente, personajes y objetos cotidianos | Sílabas directas, inversas y mixtas; vocabulario infantil |
| Level2 | 35 a 80 | 1 | 5 | Narrativo | Trabadas (CCV, CCVC); vocabulario infantil |
| Level3 | 35 a 80 | 1 | 7 | Narrativo con diálogo | VCC y CVCC, hiatos; frecuencia hasta 3.000 |
| Level4 | 35 a 80 | 1 | 8 | Narrativo y descriptivo | Frecuencia hasta 5.000; oraciones coordinadas |
| Level5 | 35 a 80 | 1 | 10 | Narrativo y expositivo sencillo | Frecuencia hasta 7.000; primeras subordinadas |
| Level6 | 35 a 80 | 1 | 12 | Expositivo | Frecuencia hasta 10.000; subordinadas |
| Level7 | 35 a 80 | 1 | 14 | Expositivo de ámbito escolar | Frecuencia hasta 15.000; léxico académico |
| Level8 | 35 a 80 | 1 | 16 | Expositivo y argumentativo | Frecuencia hasta 20.000; conectores argumentativos |
| Level9 | 35 a 80 | 1 | 18 | Divulgativo con tecnicismos | Sin límite de frecuencia; tecnicismos |
| Level10 | 35 a 80 | 1 | 20 | Periodístico o divulgativo general | Léxico denso y sintaxis compleja |

`segundos` = palabras × 60 / velocidad de referencia del nivel (40, 60, 80, 100, 110, 120, 130,
140, 150, 160 palabras por minuto de Level1 a Level10), redondeado.

### Forma del registro

```json
{
  "tipo": "activity",
  "codigo": "LEC-ES-L01-VEL-001",
  "idioma": "es",
  "titulo": "El gato de Lola",
  "area_principal": "Rendimiento y Velocidad de Procesamiento",
  "area_secundaria": "Competencia Lingüística y Fonológica",
  "niveles": ["Level1"],
  "instruccion": "Pulsa Empezar a leer, lee el texto en voz alta y, cuando acabes, pulsa He terminado.",
  "explicacion": "Activity vertical text",
  "contenido": {
    "formato": "audio_reading",
    "parrafos": ["Lola tiene un gato. El gato se llama Sol. Sol es pequeño. Come mucho. Por la mañana salta a la cama. Lola lo toma en sus manos. Los dos van a la cocina. Sol come y Lola mira."],
    "segundos": 57
  }
}
```

- `formato` siempre "audio_reading"; `parrafos` lista de textos; `segundos` entero.
- Título: el del texto, en lenguaje del niño ("El gato de Lola", "La excursión al río").
- El fichero: {"lote": "lectura-es-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Entrega

1. El fichero JSON del lote.
2. Por texto: palabras, frase media, frase más larga, índice de legibilidad y las palabras fuera
   del rango de frecuencia o de las estructuras del nivel (con el motivo de mantenerlas).
3. Una muestra para la revisión del experto: el 10 % de los textos y al menos 5 por nivel (en
   los textos, el experto revisa todos los de Level1 a Level3).
