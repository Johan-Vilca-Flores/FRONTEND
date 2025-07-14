document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("matricula-form");

    // Verificar si el formulario existe
    if (!form) {
        console.error('Formulario de matrícula no encontrado');
        return;
    }

    // Capturar el evento de envío del formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario y guardarlos en un objeto
        const studentData = {
            dni: document.getElementById("student-dni").value,
            names: document.getElementById("student-name").value,
            apell_padre: document.getElementById("apell-padre").value,
            apell_madre: document.getElementById("apell-madre").value,
            email: document.getElementById("Email").value,
            phone: document.getElementById("student-phone").value,
            cod_pag: document.getElementById("cod-pag").value,
            status: document.getElementById("status").checked,  // Captura el valor del checkbox
        };

        // Ver en consola los datos capturados
        console.log("Datos capturados:", studentData);

        // Enviar los datos al servidor
        fetch("https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            console.log("Estudiante guardado correctamente:", data);
            // Redirigir a la página de inscripción u otra acción
            window.location.href = "/inscripcion";  // Cambia la URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar el estudiante:", error);
        });
    });
});
