Entendido. Simplificamos el flujo y el modelo de datos eliminando la clasificación cualitativa de errores por parte del tutor, enfocando el ejercicio de **Repetición Rápida de Palabra** exclusivamente en la **frecuencia y recuento de repeticiones (taps)** en el tiempo límite.  
A continuación, tienes la especificación técnica ajustada:

# 🛠️ ESPECIFICACIÓN TÉCNICA REVISADA (SOLO REGISTRO DE REPETICIONES)

**Nombre de la actividad:** Repetición Rápida de Palabra Asistida (activity\_rapid\_repetition)**Prefijo de código:** REP (Ejemplo: REP-L03-VEL-001)**Área Principal:** Rendimiento y Velocidad de Procesamiento (Tasa de articulación y velocidad fonoarticulatoria).**Áreas Secundarias:** Competencia Lingüística y Fonológica \+ Memoria de Trabajo (Bucle fonológico).**Modalidad de dispositivo:** Móvil / Tablet (Modelo Dúo: Tutor \+ Alumno).

## 1\. FLUJO DE INTERACCIÓN UI/UX SIMPLIFICADO

 ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐  
 │ 1\. PANTALLA INICIAL  │───►│ 2\. EJECUCIÓN TEMPORAL│───►│ 3\. RESUMEN Y GUARDADO│  
 │ Muestra la palabra   │    │ Cronómetro activo    │    │ Se guardan los Taps  │  
 │ \+ Botón "Comenzar"   │    │ Botón TAP (+1) Tutor │    │ y Tasa de articulación│  
 └──────────────────────┘    └──────────────────────┘    └──────────────────────┘

* **Fase 1: Presentación:**  
* La pantalla muestra la **palabra/pseudopalabra en tipografía adaptada grande** para el alumno.  
* Mensaje para el tutor: *"Pide al alumno que repita la palabra lo más rápido posible hasta que termine el tiempo."*  
* **Fase 2: Ejecución Cronometrada (Control del Tutor):**  
* El tutor pulsa **"Comenzar"** y se inicia la cuenta atrás (10 s, 15 s o 20 s según el nivel).  
* La pantalla muestra un **botón gigante de conteo (+1 TAP)**. Cada vez que el alumno pronuncia una repetición completa, el tutor toca el botón.  
* **Fase 3: Finalización Automática y Guardado:**  
* Al llegar a 0 segundos, suena un aviso discreto y se cierra el conteo.  
* La app muestra directamente el número total de repeticiones logradas y guarda el resultado sin necesidad de rellenar cuestionarios de errores.

## 2\. MODELO DE DATOS EN DRUPAL Y JSON DE IMPORTACIÓN

### Campos del Nodo Drupal (activity\_rapid\_repetition):

* title (string): Título de la actividad.  
* field\_main\_area (term\_reference): Rendimiento y Velocidad de Procesamiento.  
* field\_secondary\_area (term\_reference): Competencia Lingüística y Fonológica.  
* field\_activity\_level (term\_reference): Level0 a Level10.  
* field\_activity\_code (string): Código único (Ej. REP-L03-VEL-001).  
* field\_target\_word (string): Palabra o pseudopalabra a repetir.  
* field\_is\_pseudoword (boolean): true para palabras inventadas.  
* field\_time\_limit (integer): Tiempo límite en segundos (10, 15 o 20 s).

### JSON para Importación (shine-content:import):

{  
  "tipo": "activity\_rapid\_repetition",  
  "codigo": "REP-L03-VEL-001",  
  "titulo": "Repetición rápida: plátano",  
  "area\_principal": "Rendimiento y Velocidad de Procesamiento",  
  "area\_secundaria": "Competencia Lingüística y Fonológica",  
  "niveles": \["Level3"\],  
  "instruccion": "Pide al alumno que repita la palabra 'plátano' lo más rápido posible. Pulsa el botón \+1 cada vez que la pronuncie.",  
  "contenido": {  
    "palabra\_objetivo": "plátano",  
    "es\_pseudopalabra": false,  
    "grupo\_fonetico": "Trabada PL \+ Trisílaba",  
    "tiempo\_limite\_segundos": 15  
  }  
}

## 3\. SISTEMA DE REGISTRO DE DATOS (LOGS) Y ANALÍTICA

El *payload* enviado al *backend* queda estrictamente acotado a la métrica cuantitativa de repeticiones:

### Bundle de Log: lograpidrepetition

{  
  "activity\_code": "REP-L03-VEL-001",  
  "user\_id": "1042",  
  "tutor\_id": "502",  
  "repeticiones\_totales": 12,  
  "tiempo\_ejecucion\_ms": 15000,  
  "tasa\_articulacion\_hz": 0.80  
}

### Métricas Calculadas:

* **Tasa de Articulación (Hz):**  
* \\\\\\text{Tasa (Hz)} \= \\frac{\\text{Repeticiones contadas (Taps)}}{\\text{Tiempo límite (s)}}\\\\  
* **Evolución Longitudinal:** Comparativa directa de la tasa de repeticiones por segundo en la misma palabra entre distintas sesiones para medir la mejora en la velocidad de automatización fonoarticulatoria.

