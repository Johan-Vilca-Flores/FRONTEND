document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("matricula-form");

   

    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario y asegurarse de que los valores sean correctos
        const studentData = {
            dni: parseInt(document.getElementById("student-dni").value, 10),  // Asegurarse de que sea un número
            names: document.getElementById("student-name").value,
            father_surname: document.getElementById("apell-padre").value,
            mother_surname: document.getElementById("apell-madre").value,
            email: document.getElementById("Email").value,
            phone: document.getElementById("student-phone").value,
            Codigo_de_pago: parseInt(document.getElementById("cod-pag").value, 10), // Asegurarse de que sea un número
            status: document.getElementById("status").checked,  // Captura el valor del checkbox
        };

        // Validación para asegurarse de que los campos requeridos están completos
        if (!studentData.dni || !studentData.names || !studentData.email || !studentData.phone) {
            alert("Por favor, completa todos los campos obligatorios.");
            return;
        }

        console.log("Datos enviados a la API:", studentData);

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
            window.location.href = "/inscripcion";  // Cambia la URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar el estudiante:", error);
        });
    });
});
