document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("matricula");

    // Verificar si el formulario existe
    if (!form) {
        console.error('Formulario de matrícula no encontrado');
        return;
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario
        const studentData = {
            names: document.getElementById("student-name").value,
            dni: document.getElementById("student-dni").value,
            phone: document.getElementById("student-phone").value,
            address: document.getElementById("student-address").value,
        };

        const familiarData = {
            name: document.getElementById("familiar-name").value,
            parentesco: document.getElementById("familiar-parentesco").value,
            dni: document.getElementById("familiar-dni").value,
            phone: document.getElementById("familiar-phone").value,
            address: document.getElementById("familiar-address").value,
        };

        // Enviar los datos a la API de Estudiantes usando fetch (AJAX)
        fetch("https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData)
        })
        .then(response => response.json())
        .then(data => {
            console.log("Estudiante guardado correctamente:", data);

            // Después de guardar el estudiante, enviar los datos del familiar
            fetch("https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/familiars/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(familiarData)
            })
            .then(response => response.json())
            .then(data => {
                console.log("Familiar guardado correctamente:", data);
                // Redirigir al usuario a la página de inscripción después de guardar
                window.location.href = "/inscripcion"; // Cambia la URL si es necesario
            })
            .catch(error => {
                console.error("Error al guardar el familiar:", error);
            });
        })
        .catch(error => {
            console.error("Error al guardar el estudiante:", error);
        });
    });
});
