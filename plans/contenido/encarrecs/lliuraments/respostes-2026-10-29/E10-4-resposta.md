### Diagnóstico Experto y Resolución de E10. Decisions pedagògiques pendents (Funcions Executives i Atenció)

Tras el análisis detallado del documento de propuesta E10-4-funcions-executives-proposta.md y la consolidación de las decisiones del grupo pedagógico, la definición del área **Funcions Executives i Atenció** queda **completamente resuelta y lista para su planificación técnica**.

### 🟢 1\. Opción Adoptada y Fundamentación Clínica

1. **Mecánica elegida:** **Opción (a) Matriz con regla (activity\_letter\_matrix con regla condicional)**.  
2. **Justificación Neuropsicológica:**  
3. Es la solución con mayor valor clínico directo para la dislexia y el TDAH comórbido (25-40% de coincidencia). Se apoya en pruebas estandarizadas de cancelación con regla (**d2, CARAS-R**) y en el paradigma de control atencional **AX-CPT**.  
4. Carga de forma pura los tres pilares ejecutivos no cubiertos:  
5. **Inhibición de respuesta impulsiva:** Las celdas "señuelo" (*esquers*) invitan al toque automático y exigen frenar la respuesta.  
6. **Flexibilidad cognitiva:** Exige cambiar de criterio según la fila o el fondo.  
7. **Atención sostenida y rastreo visual:** Refuerza el hábito lector de izquierda a derecha.  
8. Al utilizar letras, sílabas y palabras (en lugar de formas abstractas), se maximiza la **transferencia cercana a la descodificación lectora**.

### 📋 2\. Resolución Definitiva de las 12 Preguntas de Detalle

\#,Cuestión,Decisión Aprobada / Valor por Defecto  
1,Opción principal,Opción (a) Matriz con regla para la versión actual. La Opción (d) (Secuencia con regla/CPT) se programa como segundo tipo para la v1.1.  
2,Foco del área,"Centrado estrictamente en Inhibición, Flexibilidad y Atención. La Memoria de Trabajo se mantiene acotada a su área propia (Posición de imágenes)."  
3,Progresión de Reglas (R1-R4),"R1 Clave de fila (L0-L1) \\\\(\\rightarrow\\\\) R2 ""Después de"" (L2-L4, L7, L9) \\\\(\\rightarrow\\\\) R3 ""Menos después de"" (L5, L8) \\\\(\\rightarrow\\\\) R4 Alternancia (L6, L10)."  
4,Estímulos en L0 y L2,Uso de símbolos gráficos (● ▲ ■ ★) al introducir reglas en edades tempranas para aislar la carga ejecutiva de la dificultad lectora.  
5,Penalización por señuelos (esquers),"Sí. Los toques en señuelos descuentan del acierto efectivo (effectiveRating), midiendo la impulsividad por comisión."  
6,Feedback visual en revelado,"En la revelación final, los toques en señuelos vuelven al estado neutro sin mensajes punitivos de error, mientras que los objetivos olvidados se marcan con un aro ámbar."  
7,Ocultación de regla en L9 y L10,Sí. La regla se muestra al inicio y se oculta al comenzar el rastreo en L9 y L10 para aumentar la carga de memoria de trabajo activa.  
8,"Lateralidad (""Antes"" \= izquierda)",Permitido a partir de Level2 (7 años) incluyendo siempre un indicador visual explícito en forma de flecha (\\\\(a \\rightarrow p\\\\)).  
9,Tiempos por ronda,Sin tiempo en L0-L2 (reducir ansiedad lectora); tiempos discretos graduados de 60s a 40s en L3-L8; 50s en L9-L10.  
10,Rotación de sesiones en áreas vacías,Aplicación inmediata: El generador de sesiones (SessionGenerator::planRegular) omite las áreas sin contenido activo para evitar sesiones incompletas.  
11,Instrucciones encadenadas (Opción b),Se traslada a la v1.1 como actividad de Memoria de Trabajo cuando se disponga del sistema de locuciones/audio.  
12,Criterio de apertura de área,Se abre con 3 actividades por celda (equivalente al régimen de apertura del catalán) hasta alcanzar las 6 del régimen ordinario.

### 🛠️ 3\. Planificación de Desarrollo (Fase Propia)

Tal como se ha decidido, al tratarse de un cambio transversal que no requiere nuevos tipos de nodo pero sí modifica la lógica de control, la implementación se estructura como una **fase propia e independiente**:

* **Capa Drupal (Modelo de datos):**  
* Nuevos campos en activity\_letter\_matrix: tipo de regla, índices de celdas objetivo y celdas señuelo.  
* Registro del contador field\_lure\_marks en los nodos de *log* y *resumen*.  
* **Capa Importador (LetterMatrixActivityHandler):**  
* Incorporación de la clave de regla, cálculo determinista de objetivos/señuelos y firma canónica de contenido.  
* **Capa Aplicación / Frontend (LetterMatrixPlayer.tsx & letterMatrix.ts):**  
* Renderizado de la instrucción con chips visuales, columna clave no interactiva para R1, fondos alternados para R4 y evaluación basada en índices de celda.  
* **Capa de Tests:**  
* Suite de pruebas unitarias e integración para validación de reglas, conteo de señuelos y cálculo de rendimiento efectivo.

Con la resolución formal de E10, **todos los encargos y decisiones de la serie E01 a E11 quedan cerrados, coherentes y listos para la ejecución**.  
