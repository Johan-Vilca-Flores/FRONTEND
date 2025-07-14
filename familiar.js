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
        const studentSelect = document.getElementById('student');

        // Llenar el selector de estudiantes con los estudiantes disponibles
        data.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;  // ID del estudiante
            option.textContent = `${student.names} ${student.father_surname} ${student.mother_surname}`;
            studentSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error al cargar los estudiantes:', error);
    });

    // Manejador de envío de formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario
        const familiarData = {
            Nombre: document.getElementById("familiar-name").value,
            Parentesco: document.getElementById("familiar-parentesco").value,
            Dni: document.getElementById("familiar-dni").value,
            Telefono: document.getElementById("familiar-phone").value,
            Direccion: document.getElementById("familiar-address").value,
            Student: document.getElementById("student").value,  // Obtener el ID del estudiante seleccionado
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
            window.location.href = "/caja";  // Cambia la URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar el familiar:", error);
        });
    });
});
