
# Plataforma de Gestión de Prácticas Pedagógicas

Bienvenido a la Plataforma de Gestión de Prácticas Pedagógicas. Este sistema está diseñado para facilitar la administración y coordinación de las prácticas profesionales y pedagógicas de los estudiantes de la Facultad de Educación.

## Tabla de Contenidos
1. [Secciones de Gestión](#secciones-de-gestión)
   - [Dashboard](#dashboard)
   - [Alumnos](#alumnos)
   - [Colegios](#colegios)
   - [Tutores](#tutores)
   - [Carreras](#carreras)
   - [Comunas](#comunas)
2. [Proceso de Adscripción](#proceso-de-adscripción)
   - [Paso 1: Selección y Adscripción](#paso-1-selección-y-adscripción)
   - [Paso 2: Notificación al Establecimiento](#paso-2-notificación-al-establecimiento)
   - [Paso 3: Notificación a Estudiantes](#paso-3-notificación-a-estudiantes)
3. [Herramientas Adicionales](#herramientas-adicionales)
   - [Carga Masiva](#carga-masiva)
   - [Plantillas](#plantillas)

---

## Secciones de Gestión

Estas secciones permiten administrar los datos maestros del sistema (CRUD: Crear, Leer, Actualizar, Borrar).

### Dashboard
Es la página de inicio. Ofrece un resumen de las herramientas de configuración principales, como el Editor de Plantillas y la Carga Masiva de Datos.

### Alumnos
En esta sección puedes gestionar la información de todos los estudiantes.
- **Agregar**: Haz clic en "Agregar Estudiante" para abrir un formulario y registrar a un nuevo alumno.
- **Editar**: En la tabla, usa el icono de lápiz (✏️) para modificar los datos de un estudiante existente.
- **Eliminar**: Usa el icono de papelera (🗑️) para eliminar a un estudiante. Esta acción es irreversible.
- **Ver Detalles**: Usa el icono del ojo (👁️) para ver una ficha completa del estudiante, incluyendo su historial de prácticas.
- **Buscar**: Utiliza la barra de búsqueda para filtrar estudiantes por nombre, email o carrera.

### Colegios
Aquí se administran los establecimientos educativos donde los alumnos realizan sus prácticas.
- **Agregar/Editar/Eliminar**: Funcionamiento similar a la sección de Alumnos.
- **Gestionar Directivos**: Usa el icono de contacto (👤) para añadir, editar o eliminar directivos (contactos) asociados a un colegio.
- **Gestionar Cupos**: Usa el icono de engranaje (⚙️) para asignar los niveles de práctica que un colegio ofrece. Esto es crucial para el proceso de adscripción.

### Tutores
Administra a los tutores académicos de la universidad que supervisan a los estudiantes.
- **Agregar/Editar/Eliminar**: Funcionalidad estándar de CRUD para gestionar la información de los tutores.

### Carreras
Gestiona las carreras de la facultad y sus respectivos niveles de práctica.
- **Agregar/Editar/Eliminar Carreras**: Permite manejar el listado de carreras.
- **Gestionar Niveles de Práctica**: Usa el icono de engranaje (⚙️) en una carrera para añadir o eliminar sus niveles de práctica (ej: "Práctica Profesional", "Práctica Intermedia I").

### Comunas
Permite administrar el listado de comunas. Esta información se utiliza en los formularios de Alumnos y Colegios.

---

## Proceso de Adscripción

Esta es la sección principal para asignar estudiantes a sus lugares de práctica. Se divide en tres pasos guiados.

### Paso 1: Selección y Adscripción
Aquí se prepara todo lo necesario para la asignación.
1.  **Seleccionar Establecimiento**: Elige el colegio donde se asignarán las prácticas.
2.  **Definir Fechas**:
    - **Práctica Profesional**: Selecciona la semana de inicio y término para este tipo de práctica.
    - **Prácticas Pedagógicas**: Selecciona las semanas para todos los demás niveles (Inicial, Intermedia, etc.).
3.  **Agregar Estudiantes**: Usa el buscador para encontrar y añadir a los estudiantes que participarán en este proceso.
4.  **Asignar Cupos**: En la tabla de "Estudiantes Seleccionados", asigna un cupo específico del establecimiento a cada estudiante usando el menú desplegable.
5.  **Continuar**: Una vez que todos los campos estén completos y cada estudiante tenga un cupo, haz clic en "Crear Fichas y Continuar" para generar los registros y pasar al siguiente paso.

### Paso 2: Notificación al Establecimiento
En este paso, se notifica formalmente al colegio sobre los estudiantes asignados.
1.  **Revisar Información**: Verifica que el destinatario y el número de estudiantes sean correctos.
2.  **Previsualizar Correo**: Revisa el contenido del correo que se enviará. Este utiliza la "Plantilla para Establecimientos" y se rellena automáticamente con los datos del Paso 1.
3.  **Enviar Notificación**: Haz clic en "Enviar Notificación" para mandar el correo al directivo principal del colegio.
4.  **Continuar**: Una vez enviado, puedes proceder al último paso.

### Paso 3: Notificación a Estudiantes
Aquí se programan y envían las notificaciones a los estudiantes.
1.  **Agrupación por Nivel**: Los estudiantes se agrupan automáticamente por su nivel de práctica.
2.  **Programar Envío**: Para cada grupo, selecciona la fecha y hora exactas en que deseas que se envíen los correos.
3.  **Previsualizar Correo**: Haz clic en el nombre de un estudiante para ver una vista previa del correo que recibirá.
4.  **Actualizar y Enviar**: Al hacer clic en "Actualizar y Enviar Correos", el sistema:
    - Guarda la fecha de envío programada en la ficha de cada estudiante.
    - Envía la solicitud para que los correos se despachen en la fecha y hora definidas.

---

## Herramientas Adicionales

### Carga Masiva
Permite registrar datos en el sistema usando un archivo de Excel.
- **Subir Archivo**: Selecciona y sube el archivo con el formato adecuado para procesar los datos de forma masiva.
- **Zona Peligrosa - Vaciar Base de Datos**: **¡CUIDADO!** Esta opción elimina **TODOS** los datos del sistema (alumnos, colegios, fichas, etc.) de forma irreversible. Úsala solo si estás absolutamente seguro de que quieres empezar desde cero.

### Plantillas
Permite editar el contenido de los correos automáticos.
- **Notificación a Establecimiento**: Edita la plantilla que se envía a los colegios. Puedes usar variables como `{{directivo.nombre}}`, `{{establecimiento.nombre}}`, y bucles como `{% for ficha in fichas %}`.
- **Notificación a Estudiante**: Edita la plantilla que se envía a los estudiantes. Variables disponibles incluyen `{{estudiante.nombre}}`, `{{nombre_establecimiento}}`, `{{nivel_practica}}`, etc.

**Nota Importante**: Se recomienda editar el texto pero no la estructura de las tablas que usan bucles, para no corromper la plantilla.
