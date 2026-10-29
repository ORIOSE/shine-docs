# 09. Lectura en veu alta en catalán (activity, formato audio_reading)

Prompt de generación de lotes catalanes de "Lectura en veu alta". Contrato en
docs/exercise-catalog.md 5.2 (con su párrafo "En catalán"); importable desde el 2026-10-27
(handler `TextActivityHandler`, prefijo LEC; el player ya se desplaza). Versión castellana en
plans/contenido/prompts-es/09-lectura-en-voz-alta.md.

## Notas internas

- **Lo que hay**: nada. Siguiente código: LEC-CA-Lnn-VEL-001.
- **Longitud decidida** (E10, plans/multiidioma/respostes-dubtes-expert.md, 2026-10-28): **un solo
  párrafo de 35 a 80 palabras en todos los niveles**; desde Level4 la dificultad crece en léxico,
  estructuras y subordinadas, no en volumen. El importador lo valida (32 a 88 con el margen).
- **Nunca traducido del castellano**: textos originales en catalán, con el léxico y las
  estructuras de la tabla 2.3 catalana y la velocidad de referencia de su columna. Los índices de
  legibilidad calibrados para el castellano no valen: el control es la revisión del experto.
- **Level0 no se recomienda** y el importador lo rechaza.
- **field_seconds** (`segundos`): palabras × 60 / velocidad de referencia del nivel (tabla 2.3
  catalana: 40 ppm en Level1, 60 en Level2, 80 en Level3, 100 en Level4, 110 en Level5, 120 en
  Level6, 130 en Level7, 140 en Level8, 150 en Level9, 160 en Level10), redondeado.

---

## Prompt

Actúas como autor de textos infantiles y juveniles en catalán y como logopeda de **Shine**, una
aplicación de ejercicios de lectura para niños y jóvenes con dislexia (5 a 15 años) que usan
acompañados de un adulto. Vas a escribir un lote de **textos per llegir en veu alta en catalán**
(node `activity`, formato `audio_reading`): el niño pulsa "Començar a llegir", lee el texto
completo en voz alta y pulsa "He acabat"; se mide el tiempo total. Área principal: Rendimiento y
Velocidad de Procesamiento; secundaria: Competencia Lingüística y Fonológica.

### Reglas del texto

1. **Catalán normativo** (IEC 2017, variedad central), puntuación normal, diálogos con raya (—)
   desde Level3, apóstrofo tipográfico (’), l·l con punto volado. Nombres propios (decisión E10, 2026-10-28): en Level1 y
   Level2 solo cortos y frecuentes, de una o dos sílabas sin trabadas ni hiatos (Pol,
   Pau, Marc, Pep, Ana, Lola, Sara; precisión del grupo, 2026-10-29); Leo, Teo y Mia, con hiato, solo
   como excepción de nombre muy frecuente; nunca de más de dos sílabas, con trabadas u ortografía
   compleja (Gisela, Meritxell, Christopher). Desde Level3, los que cumplan las
   estructuras del nivel, dentro del margen del tema. Sin cifras.
2. **Original**, nunca traducido ni adaptado; tema apto para la edad, sin contenidos sensibles;
   cotidiano y narrativo en los niveles bajos, expositivo o divulgativo en los altos.
3. **Número de palabras dentro del rango del nivel**; frase media y frase más larga dentro del
   nivel; al menos el 90 % de las palabras dentro de las estructuras silábicas de la tabla 2.3
   catalana (apóstrofos y contracciones desde Level3, pronombres febles simples desde Level4 y
   combinados desde Level7) y el 95 % dentro de su rango de frecuencia (catálogo 3.6).
4. **Un solo párrafo**: `parrafos` lleva exactamente un texto, de 1.200 caracteres como mucho.
5. **Guía editorial** (E11, aprobada por el grupo el 2026-10-29: plans/contenido/encarrecs/lliuraments/
   E11-guia-editorial-ca.md, y la -es para castellano). Lo esencial: **diálogo** ninguno en Level1 y
   Level2, dos intervenciones como mucho en Level3 y Level4, cuatro como mucho desde Level5, seguidas
   dentro del párrafo; **tiempos** solo presente en Level1 y Level2, pasados (en catalán perifrástico,
   nunca el pasado simple) desde Level3, futuro y condicional desde Level4, subjuntivo desde Level5;
   **números siempre en letras**, dos puntos desde Level4, paréntesis y comillas desde Level6, siglas
   desde Level8 (castellano) o Level9 (catalán); de Level0 a Level3, la mitad de los textos del lote
   **neutros de edad** (valen para un lector de 12 años); de 40 a 60 % de protagonistas chicas, tres
   de cada diez familias no nucleares y un mismo nombre en tres textos como mucho; lugares genéricos
   hasta Level3; sin fiestas religiosas ni clubes deportivos reales.

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

### Forma del registro

```json
{
  "tipo": "activity",
  "codigo": "LEC-CA-L01-VEL-001",
  "idioma": "ca",
  "titulo": "La gata de la Laia",
  "area_principal": "Rendimiento y Velocidad de Procesamiento",
  "area_secundaria": "Competencia Lingüística y Fonológica",
  "niveles": ["Level1"],
  "instruccion": "Prem Començar a llegir, llegeix el text en veu alta i, quan acabis, prem He acabat.",
  "explicacion": "Activity vertical text",
  "contenido": {
    "formato": "audio_reading",
    "parrafos": ["La Laia té una gata. La gata es diu Lluna. És petita i negra. Menja molt. Al matí salta al llit. La Laia la pren a coll. Les dues van a la cuina. La Lluna menja i la Laia mira."],
    "segundos": 58
  }
}
```

- `formato` siempre "audio_reading"; `parrafos` lista de textos; `segundos` entero. En Level1 y
  Level2 los nombres de los personajes son un recurso natural del cuento infantil: si se usan,
  que sean nombres cortos y muy frecuentes (Laia, Pau, Nil), y se anota para el experto.
- Título en catalán, en lenguaje del niño. Áreas, niveles y explicación con su nombre castellano
  canónico.
- El fichero: {"lote": "lectura-ca-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Entrega

1. El fichero JSON del lote.
2. Por texto: palabras, frase media, frase más larga y las palabras fuera del rango de frecuencia
   o de las estructuras del nivel (con el motivo de mantenerlas).
3. Una muestra para la revisión del experto: el 10 % de los textos y al menos 5 por nivel (en los
   textos, el experto revisa todos los de Level1 a Level3).
