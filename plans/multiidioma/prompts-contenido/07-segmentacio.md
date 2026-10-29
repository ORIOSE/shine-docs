# 07. Segmentación léxica en catalán (activity_word_split)

Prompt de generación de lotes catalanes de "Separa les paraules". Notas internas primero; desde el
título "Prompt", lo que se pega en Cowork o en Codex.

## Notas internas

- **Primer lote** (2026-10-26, subplan 05): shine/content/segmentacion-ca-level1-2-v1.json, 6
  actividades (3 en Level1 y 3 en Level2; Level0 no se recomienda), escrito a mano. Códigos
  SEG-CA-L01-LIN-001 a SEG-CA-L02-LIN-003. Siguiente libre: SEG-CA-L0n-LIN-004.
- **Ambigüedad, revisada por el experto el 2026-10-27** (resposta-revisio-lots-ca.md, punto 2):
  la app corrige contra la frase declarada, no contra el léxico, así que una partición alternativa
  hecha de palabras sueltas sin sentido no descarta la frase: casa (ca + sa), pare y mare (pa, ma
  + re), escola (es + cola), pilota (pi + lota), vola (vol + a) y a la (ala) se usan. En el primer
  lote se habían descartado y quedaban frases poco naturales (el ruc menja); el lote se corrigió.
  Hasta Level6 solo se descarta la frase si otra partición da una frase con sentido que un niño
  podría leer; desde Level7 la ambigüedad es el objetivo (homófonos) y la decide la revisión humana.
- **Enclíticos con guion** (dona-m’ho): el importador todavía no los admite. Hasta que se programe
  la mejora (pendiente en el catálogo 8), en Level6 solo enclíticos con apóstrofo (posa’t, mira’l);
  el experto lo aceptó como solución temporal.
- **Apóstrofos y contracciones** (l’avi, d’un, al, del, pel) se trabajan desde Level3: son la
  dificultad de segmentación propia del catalán ("Apostrofació i contraccions", esfuerzo alto
  estructural). El importador admite el apóstrofo recto y el tipográfico; usar el tipográfico (’).
- **Estructuras**: Level1 sin trabadas ni dígrafos complejos ni codas complejas (surt y dorm son
  Level2 por la excepción de monosílabos frecuentes con coda simple, confirmada por el experto el
  2026-10-27); Level2 con trabadas y, como excepción, els, al, als, del, dels, pel, pels y los
  plurales regulares en -ns y -ls (els nens juguen; grupo de expertos, 2026-10-29), nunca una coda
  compleja de raíz (verd, text, disc); Level3 con CVCC, hiatos, l·l y apóstrofos.
- Hoy solo existen Level0 a Level2 en local; el prompt cubre hasta Level10.

---

## Prompt

Actúas como generador de contenido de **Shine**, una aplicación de ejercicios de lectura para niños
y jóvenes con dislexia (de 5 a 15 años) que usan acompañados de un adulto. Vas a escribir un lote
de actividades **en catalán** del ejercicio "Separa les paraules" (tipo activity_word_split): una
frase aparece sin espacios ("elgatmenjapa") y el niño toca las letras donde empieza cada palabra
hasta separarlas todas. Se guarda la frase correcta con espacios; la versión sin espacios la deriva
la app. Entregas un JSON que importa Drupal.

### Reglas del catalán

1. **Minúsculas, sin puntuación ni cifras, sin nombres propios**; se conservan acentos (és, té,
   què), diéresis, ç, l·l y el apóstrofo tipográfico (’). Espacios simples.
2. **Ninguna otra lectura con sentido.** La app solo acepta la partición de la frase declarada.
   Una partición alternativa en palabras sueltas sin sentido no importa: "la nena va a casa" (ca +
   sa), "la bruixa vola" (vol + a) y "el plat és a la taula" (ala) son buenas, y casa, pare, mare,
   escola y pilota se pueden usar. Descarta la frase hasta Level6 solo si otra partición forma una
   frase que un niño podría leer con sentido.
3. **Apóstrofos** solo desde Level3 (l’avi, d’un, l’ós); las contracciones al, del, pel, als, dels
   y pels y el artículo els se admiten desde Level2, pero la frase de Level2 no se construye para
   trabajarlas (eso es Level3);
   pronombres febles delante del verbo desde Level5 (el veu, la porta, em dona), unidos al verbo
   desde Level6 solo con apóstrofo (porta’l, posa’t; el guion de dona-me’l todavía no lo admite el
   importador); homófonos y pares que se confunden desde Level7 (a veure /
   haver, si no / sinó, per què / perquè, també / tan bé).
4. **Léxico y estructuras del nivel**: hasta las 1.000 palabras más frecuentes en Level1, 2.000
   en Level2, 3.000 en Level3, 5.000 en Level4, 7.000 en Level5, 10.000 en Level6, 15.000 en
   Level7, 20.000 en Level8, sin límite desde Level9. Level1 sin trabadas, dígrafos complejos ni
   codas complejas; Level2 con trabadas y dígrafos complejos; Level3 con CVCC, hiatos, l·l.
5. Frases naturales y con sentido para un niño, con sujetos cotidianos (el gat, la nena, el tren,
   la pluja). Tiempos (guía editorial E11, aprobada el 2026-10-29): solo presente en Level1 y
   Level2; pasados desde Level3 (perifrástico, nunca el pasado simple); futuro y condicional desde
   Level4; subjuntivo desde Level5. Lo comprueba `lexico.py` (`tense_check`).

### Parámetros por nivel

| Nivel | Frases | Palabras por frase | Uniones que se trabajan |
|---|---|---|---|
| Level0 | No recomendado | | |
| Level1 | 4 | 3 | Palabras muy frecuentes de 1 y 2 sílabas (el sol puja, la nena riu) |
| Level2 | 5 | 4 a 5 | Artículos, preposiciones y conjunciones (el, la, un, a, de, amb, i) |
| Level3 | 5 | 5 a 6 | Apóstrofos y contracciones (l’avi va al parc, el nen beu l’aigua) |
| Level4 | 5 | 6 a 7 | Contracciones y apóstrofos con más longitud (els nens del poble van a l’escola) |
| Level5 | 6 | 7 a 8 | Pronombres febles simples delante del verbo (la mare el porta a casa); los combinados (li ho, se'n) desde Level7 (grupo, 2026-10-29) |
| Level6 | 6 | 8 a 9 | Pronombres unidos al verbo con apóstrofo (posa’t les botes abans de sortir, mira’l) |
| Level7 | 6 | 9 a 10 | Pares que se confunden: a veure / haver, si no / sinó, per què / perquè, també / tan bé |
| Level8 | 6 | 10 a 11 | Ídem con vocabulario menos frecuente |
| Level9 | 6 | 11 a 12 | Dos oraciones coordinadas |
| Level10 | 6 | 12 a 14 | Oraciones con subordinadas |

La frase cabe en un móvil pequeño con la tipografía del ejercicio: como mucho 120 caracteres.

### Etiquetas fonológicas

- **`esfuerzo`** (obligatorio): los términos catalanes de la taxonomía `decoding_effort` de las
  estructuras de nivel más alto que aparecen en el material (por ejemplo, "Dígrafs complexos" si la
  más difícil es tx o ig). Lo calcula `shine/content/generadores/etiquetar_lote.py`: puedes dejarlo
  vacío y ejecutar `python3 etiquetar_lote.py ../{lote}.json --write`, o ponerlo a mano y comprobar
  que coincide. El mismo script avisa de las palabras con una estructura por encima del nivel.
- **`sonoridad`** (solo si la actividad trabaja un grupo fonético concreto, por ejemplo todas las
  palabras con ny o con tx/ig): los términos catalanes de la taxonomía `sonority`. Si la actividad no
  se centra en un grupo, no se pone.

### Forma del registro

```json
{
  "tipo": "activity_word_split",
  "codigo": "SEG-CA-L02-LIN-004",
  "idioma": "ca",
  "titulo": "Separa les paraules",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Rendimiento y Velocidad de Procesamiento",
  "niveles": ["Level2"],
  "instruccion": "La frase està escrita sense espais. Toca una lletra per posar-hi un espai just al davant, fins a separar totes les paraules, i prem Comprovar.",
  "explicacion": "Word split",
  "contenido": {
    "frases": ["el gat menja pa", "la nena va a peu", "la flor és blava", "un drac verd i gros", "el nen beu un suc"]
  }
}
```

- codigo: SEG-CA-Lnn-LIN-nnn, correlativo desde el siguiente libre que te indiquen.
- Sin frases repetidas en la actividad ni, a ser posible, entre actividades del mismo nivel.
- El fichero: {"lote": "segmentacion-ca-level{a}-{b}-v{n}", "descripcion", "origen", "actividades"}.

### Qué entregar

1. El fichero JSON del lote.
2. Por frase, las otras particiones con sentido que hayas encontrado (o la otra lectura, desde Level7).
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
