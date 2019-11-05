TEAM CHARTER
TEAM: HR Boost by CRGJ3 Analytics  
PARTICIPANTS: Carlos, Raúl, Jan, Jessica, Jose, Gonzalo
MAIN OBJECTIVE: Deliver a machine learning model that provides actionable information while hiring in ESASA to significantly boost employee retention, thus, minimizing rotation.
BUSINESS NEED: ESASA is a Mexican PYME with 33 years providing B2B food services (comedores). Regarding HR, the single most important break-through to achieve is a boost in employee retention and/or hiring effectiveness; to impact significantly many other business results.
OBJECTIVES DEVELOPMENT:
a)	Understand /quantify the weight of each defined variable (see specific section) in order to maximize effectiveness and “survivability” chance for each candidate.
b)	Provide a mini full-stack app or page for HR recruiters or @ESASA’s webpage to discard low-retention-profile candidates with a score?
SCOPE: 
Minimum	Desired
Analyze data with at least one machine learning model	Regression, Neural networks, XG Boost models and compare each other
Survivability analysis	Random ForestXG to identify specific employee groups
Quantify each variable weight for the model	
Simple form or decision tree for recruiters to discard low-retention-prospect	Full-stack app for online / on-the-field discarding

Hypothesis to test:
-	Distance as a major factor in “ayudantes” (major hiring need)
-	Insecurity index
-	Specific weight of each variable in the model/retention equation
-	Quantify SalaryΔ sensitivity for “hot-spots” for retention
Variables definition: 
1.- Tiempo de recorrido
-Código postal trabajo /Etiqueta No. centros de trabajo
- Código postal de la vivienda.
2.- Sueldo 
-Dinero recibido(remuneración)
-Responsabilidad del trabajador /jerarquía de puesto
- Aumento de sueldo 
3.-Inseguridad
-Delitos por zona, por empleado API CDMX
4.- Sociodemográficos
-Edad
-Género
-Estado Civil
5.- Entorno Económico
-Índice de Rezago Social AGEB
6.- Duración en el empleo:
-Fecha de entrada y salida.
7.-Estatus del empleado
-En activo
-Baja
INITAL ASSIGNMENTS 2/XI/2019:
-Gonzalo: Variable Sueldo, Descripción del problema, Introducción/PPT y Objetivos, responsable de generar y compartir la información para análisis.
-Carlos: Variable Tiempo de recorrido. Entorno Económico
-José: Variable Inseguridad por zona por empleado.
-Raúl: Variables Duración del empleo y estatus empleado. Front End y librería XGBus.
-Jean: Limpieza de tablas, análisis en Machine Learning de las variables Neural Networks.
-Jéssica: Análisis de supervivencia, codificar variables de género, estado civil, jornada por No. de empleado y Entorno Económico con Carlos(martes).
NTH/Parking lot ideas:
-	Use XGboost library
-	Survivavility analysis using Random Forest Surveillance.
-	Clustering de locations de empleados
-	Root map de rutas para de centros de trabajo

