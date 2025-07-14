<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscripción de Estudiantes</title>
    <link rel="stylesheet" href="styles3.css">
</head>
<body>
    <div class="form-container">
        <h1>Formulario de Inscripción</h1>

        <!-- Formulario para inscripción -->
        <form id="inscription-form">
            <label for="degree">Selecciona un grado:</label>
            <select id="degree" name="degree" required>
                <!-- Opciones de grados se llenarán con JavaScript -->
            </select>

            <label for="student">Selecciona un estudiante:</label>
            <select id="student" name="student" required>
                <!-- Opciones de grados se llenarán con JavaScript -->
           </select>
            <button type="submit">Inscribir Estudiante</button>
        </form>
    </div>

    <script src="matricula.js"></script>
</body>
</html>
