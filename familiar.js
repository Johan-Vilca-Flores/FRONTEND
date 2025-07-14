document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("familiar-form");

    // Verificar si el formulario existe
    if (!form) {
        console.error('Formulario de familiar no encontrado');
        return;
    }

    // Llamar a la API para obtener los estudiantes registrados
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/')
    .then(response => response.json())
    .then(data => {
        console.log(data); // Verifica qué datos estás recibiendo de la API
        const studentSelect = document.getElementById('student');

        // Verificar si "results" existe y es un arreglo
        const students = data.results;
        if (Array.isArray(students)) {
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;  // ID del estudiante
                option.textContent = `${student.names} ${student.father_surname} ${student.mother_surname}`;
                studentSelect.appendChild(option);
            });
        } else {
            console.error('No se encontró un arreglo de estudiantes en la respuesta:', data);
        }
    })
    .catch(error => {
        console.error('Error al cargar los estudiantes:', error);
    });

    // Manejador de envío de formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario
        const familiarData = {
            nombre: document.getElementById("familiar-name").value,
            parentesco: document.getElementById("familiar-parentesco").value,
            dni: document.getElementById("familiar-dni").value,
            telefono: document.getElementById("familiar-phone").value,
            direccion: document.getElementById("familiar-address").value,
            student: document.getElementById("student").value,  // Obtener el ID del estudiante seleccionado
        };

        console.log("Datos enviados a la API:", familiarData);

        // Enviar los datos a la API de Django
        fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/familiars/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(familiarData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            console.log("Familiar guardado correctamente:", data);
            window.location.href = "/inscripcion.html";  // Cambia la URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar el familiar:", error);
        });
    });
});
