# 05. Reordenamiento de sílabas en castellano (activity_syllable_order)

Prompt de generación de lotes castellanos de "Ordena las sílabas". Contrato en
docs/exercise-catalog.md 6.2; versión catalana en
plans/multiidioma/prompts-contenido/05-ordena-sillabes.md.

## Notas internas

- **Lo que hay**: SIL-ES-L00-LIN-001 y 002 y SIL-ES-L02-LIN-001 (lote de ejemplo fase13). Siguiente
  libre: el del inventario (`--lang=es --type=activity_syllable_order`).
- **Fuente de palabras con imagen**: shine/content/images/manifest.json (raíz de cada entrada:
  nombre, silabas, lectura L0 a L5, estado aceptada). La clave imagen del lote es el slug del
  fichero (manzana, muneca, pinguino: sin tildes ni ñ).
- **Silabeo**: el del manifiesto para las palabras con imagen; para el resto, el de la RAE: ch, ll
  y rr nunca se separan (co-che, ca-lle, pe-rro), la x entre vocales va con la vocal siguiente
  (e-xa-men), los diptongos van juntos (pei-ne, hue-vo, ai-re) y los hiatos se separan (pa-ís,
  le-ón, ba-úl, po-e-ta); la h intercalada no rompe el diptongo (ahu-mar) salvo hiato (a-hí).
- **Ambigüedad**: ninguna otra permutación de las fichas forma una palabra castellana (la app
  solo acepta el orden declarado). Descartar, por ejemplo: casa (saca), tapa (pata), cosa (saco),
  lata (tala), mora (ramo), ropa (paro), sopa (paso), pato (topa), mesa (same no, vale), loma
  (malo), tomate (ma-te-to no, vale). Con sobrantes, las sobrantes tampoco pueden formar otra
  palabra con las demás.
- **Nivel mínimo por estructura** (catálogo 3.5): CV con m, p, l, s, t, n, d en Level0; resto de
  directas, inversas y mixtas en Level1; trabadas en Level2; CVCC y VCC en Level3; hiatos desde
  Level3. Los monosílabos no sirven (una sola ficha).

---

## Prompt

Actúas como generador de contenido de **Shine**, una aplicación de ejercicios de lectura para niños
y jóvenes con dislexia (de 5 a 15 años) que usan acompañados de un adulto. Vas a escribir un lote
de actividades **en castellano** del ejercicio "Ordena las sílabas" (tipo
activity_syllable_order): las sílabas de una palabra aparecen desordenadas en fichas y el niño las
toca en orden para formar la palabra; en los niveles bajos ve un dibujo como pista. Entregas un
fichero JSON que importa Drupal sin tocar nada a mano, así que el formato es exacto.

### Reglas del castellano

1. **Silabeo normativo (RAE)**: ch, ll y rr no se separan (co-che, ca-lle, pe-rro); qu y gu van
   con su vocal (que-so, gui-ta-rra); la x entre vocales abre sílaba (e-xa-men); diptongos juntos
   (pei-ne, hue-vo, cau-sa) e hiatos separados (pa-ís, le-ón, po-e-ta, ba-úl); grupos
   consonánticos inseparables pl, bl, cl, fl, gl, pr, br, cr, fr, gr, tr, dr (ca-bra, a-plau-so);
   otros grupos se reparten (ins-tan-te, trans-por-te, ac-ción). Las palabras con imagen llevan su
   silabeo en el manifiesto: úsalo tal cual.
2. **Ortografía**: minúsculas, tildes (ca-mión, ár-bol, pá-ja-ro), diéresis (pin-güi-no), ñ.
   Nunca mayúsculas ni nombres propios.
3. **Sin ambigüedad**: ninguna otra permutación de las fichas forma una palabra castellana (ca-sa
   y sa-ca, ta-pa y pa-ta, so-pa y pa-so). Con sílabas sobrantes, tampoco con ellas. Si hay duda,
   otra palabra.
4. **Frecuencia**: léxico infantil y escolar (catálogo 3.6): hasta las 500 palabras más
   frecuentes en Level0, 1.000 en Level1, 2.000 en Level2, 3.000 en Level3, 5.000 en Level4,
   7.000 en Level5, 10.000 en Level6, 15.000 en Level7, 20.000 en Level8; sin límite desde Level9.
5. **Estructuras por nivel** (nivel mínimo de cada una): Level0, CV con m, p, l, s, t, n, d;
   Level1, resto de CV (c/qu, g/gu, r/rr, ñ, ch, ll/y, j, z/ce/ci, f, b/v, h, x), inversas VC y
   mixtas CVC (sol, ár-bol), diptongos; Level2, trabadas CCV con l y r (pla-to, ca-bra),
   gue/gui/güe/güi; Level3, CVCC y VCC (ins-tan-te, trans-por-te), hiatos (pa-ís, po-e-ta);
   desde Level4, todas.

### Parámetros por nivel

| Nivel | Palabras | Sílabas por palabra | Estructuras | Sobrantes | Imagen |
|---|---|---|---|---|---|
| Level0 | 4 | 2 | CV con m, p, l, s, t, n, d (mu-la, so-pa, me-sa) | 0 | Siempre |
| Level1 | 5 | 2 a 3 | Directas, inversas, mixtas, dígrafos (ga-lli-na, co-ne-jo, ár-bol) | 0 | Siempre |
| Level2 | 5 | 2 a 3 | Con trabadas o gue/gui (ca-bra, pla-to, ju-gue-te) | 0 | Siempre |
| Level3 | 6 | 3 a 4 | Complejas, hiatos, tildes (ins-tan-te, pi-a-no, mur-cié-la-go) | 0 | Como pista activable |
| Level4 | 6 | 4 | Todas (bi-ci-cle-ta, za-na-ho-ria, ma-ri-po-sa) | 0 | Pista |
| Level5 | 6 | 4 | Todas | 1 | Pista |
| Level6 | 6 | 5 | Todas | 1 | Sin imagen |
| Level7 | 6 | 5 | Todas | 1 parecida a una de la palabra (bra si está bar) | Sin imagen |
| Level8 | 6 | 5 a 6 | Baja frecuencia | 1 parecida | Sin imagen |
| Level9 | 6 | 6 | Baja frecuencia | 2 parecidas | Sin imagen |
| Level10 | 6 | 6 a 7 | Vocabulario académico | 2 parecidas | Sin imagen |

Sin palabras repetidas dentro de una actividad; entre actividades del mismo nivel, evita repetir
(el importador avisa cuando una palabra ya está en 3 actividades del mismo tipo, idioma y nivel).
La imagen solo si existe en el banco (slug de la entrada, estado aceptada).

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
  "tipo": "activity_syllable_order",
  "codigo": "SIL-ES-L01-LIN-001",
  "idioma": "es",
  "titulo": "Ordena las sílabas con dibujo",
  "area_principal": "Competencia Lingüística y Fonológica",
  "area_secundaria": "Memoria de Trabajo (Auditiva y Visual)",
  "niveles": ["Level1"],
  "instruccion": "Mira el dibujo y toca las sílabas en orden para formar su nombre.",
  "explicacion": "Syllable order",
  "contenido": {
    "palabras": [
      {"silabas": "ga-lli-na", "imagen": "gallina"},
      {"silabas": "co-ne-jo", "imagen": "conejo"},
      {"silabas": "si-lla", "imagen": "silla"},
      {"silabas": "lu-na", "imagen": "luna"},
      {"silabas": "pe-ra", "imagen": "pera"}
    ]
  }
}
```

- codigo: SIL-ES-Lnn-LIN-nnn, nn = nivel, nnn correlativo a partir del siguiente libre que te
  indiquen (nunca se reutiliza un código).
- Sin imagen: "silabas" solo, o con "sobrantes" ("bra") desde Level5. Título sin imagen: "Ordena
  las sílabas". Instrucción sin imagen: "Toca las sílabas en orden para formar la palabra."
- areas, niveles y explicacion van con esos nombres exactos.
- El fichero: {"lote": "silabas-es-level{a}-{b}-v{n}", "descripcion": "...", "origen": {"generador":
  "...", "version": "...", "nota": "..."}, "actividades": [...]}.

### Qué entregar

1. El fichero JSON del lote.
2. Una lista de las palabras descartadas por ambigüedad (con la otra lectura) y de las que no tienen
   imagen en el banco.
3. Una muestra para la revisión del experto: el 10 % de las actividades y al menos 5 por nivel.
