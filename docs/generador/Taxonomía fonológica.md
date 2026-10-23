Basándonos en la literatura clínica y en los documentos técnicos de la aplicación 1-4, los grupos de letras y sílabas para las actividades de texto se pueden organizar en dos taxonomías o vocabularios principales: **Por Sonoridad (Discriminación Acústica y Fonoarticulatoria)** y **Por Dificultad / Esfuerzo Cognitivo (Complejidad Estructural y Perceptiva)**.

### 🔊 1\. Categorización por Sonoridad (Discriminación Acústica y Fonoarticulatoria)

Esta categoría agrupa las letras según la forma en que se producen los sonidos en el aparato fonador y la similitud acústica entre ellos. Es clave para entrenar la discriminación auditiva y corregir errores de sustitución fonética 4, 5\.

#### A. Consonantes Continuas vs. Discontinuas (Punto de Articulación)

* **Consonantes Continuas (Prolongables):** m, l, s, f, n, r, j (junto con las vocales a, e, i, o, u) 2\.  
* *Razón clínica:* Permiten alargar el sonido (ej. *"MMMIEL"*) sin interrumpir el flujo de aire 6\. Son las más fáciles para iniciar la estimulación fonológica porque facilitan aislar el sonido inicial 2\.  
* **Consonantes Discontinuas o Oclusivas (Breves/Explosivas):** p, t, b, d, c/k/q, g, ch 2\.  
* *Razón clínica:* Producen una interrupción total o parcial del aire 7\. No se pueden alargar en el tiempo, por lo que requieren mayor precisión auditiva para ser captadas aisladamente 2\.

#### B. Pares de Oposición Sorda / Sonora (Confusión por Punto Articular Idéntico)

Son pares de letras que se articulan en la misma posición de la boca, diferenciándose únicamente en si vibran o no las cuerdas vocales 4, 5:

* **Oclusivas Bilabiales:** /p/ (sorda) vs. /b/ (sonora) 4\.  
* **Oclusivas Dentales:** /t/ (sorda) vs. /d/ (sonora) 4\.  
* **Velares:** /k/ (c/k/q, sorda) vs. /g/ (g/gu, sonora) 6\.  
* **Fricativas / Labiodentales:** /f/ (sorda) vs. /b-v/ (sonora) 4\.

#### C. Grupos Homófonos e Inconsistencias Grafema-Fonema

Son grupos donde distintas letras representan un mismo sonido en español, lo que genera confusión en la ruta fonológica y ortográfica 6:

* **Grupo Sibilante / Interdental:** /s \- z \- c/ (ej. *sapo, zapato, cine*) 6\.  
* **Grupo Velar:** /k \- q \- c/ (ej. *kilo, queso, casa*) 6\.  
* **Grupo Palatal:** /ll \- y/ (ej. *llave, yema*) 6\.  
* **Grupo Velar / Fricativo:** /g \- j/ (ej. *gente, jarrón*) 8\.

### 📊 2\. Categorización por Dificultad / Esfuerzo (Carga de Decodificación y Estructura)

Esta categoría clasifica los estímulos según el esfuerzo de procesamiento visual, la complejidad de la estructura silábica y la carga en la memoria de trabajo 1, 3, 9\.

#### A. Nivel 1: Bajo Esfuerzo (Estructuras Directas Simples y Alta Frecuencia)

* **Estructura silábica:** Vocal aislada (V) y Sílabas Directas simples (Consonante \+ Vocal: CV) 1\.  
* **Grupo de consonantes iniciales:** m, p, l, s, t, n, d combinadas con vocales 1, 2\.  
* **Ejemplos de sílabas/palabras:** ma, pa, lo, se, tu, na / *sopa, pato, mesa, mano* 1\.

#### B. Nivel 2: Esfuerzo Medio (Directas Restantes, Inversas y Mixtas)

* **Estructura silábica:** Sílabas Inversas (Vocal \+ Consonante: VC) y Mixtas (CVC) 1\.  
* **Grupo de consonantes complejas/inconsistentes:** f, b/v, r, rr, ñ, ch, ll/y, j, z/ce/ci, c/qu, g/gu, güe/güi, h, x 1\.  
* **Bloques de inversas (VC):**  
* Inversas con L: al, el, il, ol, ul 1\.  
* Inversas con N: an, en, in, on, un 1\.  
* Inversas con S: as, es, is, os, us 1\.  
* Inversas con R: ar, er, ir, or, ur 1\.  
* **Ejemplos:** sol, árbol, huevo, pelota, franja 1\.

#### C. Nivel 3: Alto Esfuerzo (Trabadas / Sinfones y Estructuras Complejas)

* **Estructura silábica:** Sílabas Trabadas (Consonante \+ Consonante \+ Vocal: CCV) y Complejas (CCVC, VCC, CVCC) 1\.  
* **Sinfones con L (CCV):** pl, bl, cl, fl, gl (*pla, ble, cli, flo, glu*) 1\.  
* **Sinfones con R (CCV):** pr, br, cr, fr, gr, tr, dr (*pra, bre, cri, fro, tru, tra, dri*) 1\.  
* **Estructuras compuestas y complejas:** plan, tras, ins, cons, trans 1\.  
* **Ejemplos:** plato, tren, playa, trigo, transporte, instante 1\.

#### D. Nivel de Alto Esfuerzo Perceptivo (Letras Espejo / Confusión Visoespacial)

Independientemente de la estructura silábica, las letras que comparten rasgos gráficos y solo varían en su orientación espacial generan un pico de esfuerzo atencional y perceptual 3, 10:

* **Reversibilidad Horizontal/Vertical:** b \- d, p \- q, b \- p, d \- q 3, 10\.  
* **Rotación 180°:** n \- u, m \- w 10, 11\.

### 🏷️ Resumen de Fichas de Categorización para Drupal / Backend

Para etiquetar tus bancos de palabras y sílabas en el *CMS/Backend*, puedes estructurar los metadatos de las actividades bajo estas dos taxonomías asociadas:  
{  
  "vocabulario\_sonoridad": {  
    "consonantes\_continuas": \["m", "l", "s", "f", "n", "r", "j"\],  
    "consonantes\_oclusivas": \["p", "t", "b", "d", "c", "k", "q", "g", "ch"\],  
    "oposicion\_sorda\_sonora": \["p/b", "t/d", "k/g", "f/v"\],  
    "inconsistencias\_grafemicas": \["s/z/c", "k/q/c", "ll/y", "g/j"\]  
  },  
  "vocabulario\_esfuerzo": {  
    "nivel\_bajo": \["V", "CV\_iniciales (m,p,l,s,t,n,d)"\],  
    "nivel\_medio": \["CV\_resto", "VC\_inversas (al,an,as,ar)", "CVC\_mixtas"\],  
    "nivel\_alto\_estructural": \["CCV\_trabadas\_L", "CCV\_trabadas\_R", "CCVC\_complejas"\],  
    "nivel\_alto\_perceptivo": \["espejo\_bd", "espejo\_pq", "rotacion\_nu\_mw"\]  
  }  
}  
