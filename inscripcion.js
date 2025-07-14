document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("inscripcion-form");

    // Verificar si el formulario existe
    if (!form) {
        console.error('Formulario de inscripción no encontrado');
        return;
    }

    // Llamar a la API para obtener los estudiantes registrados
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/')
    .then(response => response.json())
    .then(data => {
        const studentSelect = document.getElementById('student');
        
        // Verificar que la respuesta contenga los estudiantes
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

    // Llamar a la API para obtener los grados disponibles
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/degrees/')
    .then(response => response.json())
    .then(data => {
        const degreeSelect = document.getElementById('degree');
        
        // Verificar que la respuesta contenga los grados
        const degrees = data.results;
        if (Array.isArray(degrees)) {
            degrees.forEach(degree => {
                const option = document.createElement('option');
                option.value = degree.id;  // ID del grado
                option.textContent = `${degree.grade} (${degree.school_year})`;
                degreeSelect.appendChild(option);
            });
        } else {
            console.error('No se encontró un arreglo de grados en la respuesta:', data);
        }
    })
    .catch(error => {
        console.error('Error al cargar los grados:', error);
    });

    // Manejador de envío de formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario
        const inscriptionData = {
            student: document.getElementById("student").value,  // ID del estudiante
            degree: document.getElementById("degree").value,  // ID del grado
        };

        console.log("Datos enviados a la API:", inscriptionData);

        // Enviar los datos a la API de Django
        fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inscriptionData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            console.log("Inscripción guardada correctamente:", data);
            window.location.href = "/pension.html";  // Cambia la URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar la inscripción:", error);
        });
    });
});
