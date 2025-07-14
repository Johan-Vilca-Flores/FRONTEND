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
            dni: document.getElementById("student-dni").value,
            names: document.getElementById("student-name").value,
            apell_padre: document.getElementById("apell-padre").value,
            apell_madre: document.getElementById("apell_madre").value,
            Email: document.getElementById("Email").value,
            phone: document.getElementById("student-phone").value,
            cod_pag: document.getElementById("cod-pag").value,
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
                window.location.href = "/inscripcion"; // Cambia la URL si es necesario
            }) 
        })
        .catch(error => {
            console.error("Error al guardar el estudiante:", error);
        });
    });

