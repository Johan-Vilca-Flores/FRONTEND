document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("matricula");

    // Verificar si el formulario existe
    if (!form) {
        console.error('Formulario de matrícula no encontrado');
        return;
    }


    // Llenar el formulario con los datos del estudiante
    document.getElementById("student-id").value = studentData.id;
    document.getElementById("student-dni").value = studentData.dni;
    document.getElementById("student-name").value = studentData.names;
    document.getElementById("apell-padre").value = studentData.father_surname;
    document.getElementById("apell-madre").value = studentData.mother_surname;
    document.getElementById("Email").value = studentData.email;
    document.getElementById("student-phone").value = studentData.phone;
    document.getElementById("cod-pag").value = studentData.Codigo_de_pago;
    document.getElementById("status").checked = studentData.status;
    document.getElementById("created").value = studentData.created;
    document.getElementById("modified").value = studentData.modified;

    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario
        const studentData = {
            id: document.getElementById("student-id").value,
            dni: document.getElementById("student-dni").value,
            names: document.getElementById("student-name").value,
            father_surname: document.getElementById("apell-padre").value,
            mother_surname: document.getElementById("apell-madre").value,
            email: document.getElementById("Email").value,
            phone: document.getElementById("student-phone").value,
            status: document.getElementById("status").checked,
            created: document.getElementById("created").value,
            modified: document.getElementById("modified").value,
            Codigo_de_pago: document.getElementById("cod-pag").value
        };

        // Enviar los datos a la API de Estudiantes usando fetch (AJAX)
        fetch("https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/", {
            method: "POST",  // Cambiar a "PUT" si estás actualizando el estudiante
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
            window.location.href = "/inscripcion";  // Cambia la URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar el estudiante:", error);
        });
    });
});
