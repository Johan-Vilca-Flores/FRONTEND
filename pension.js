document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("pension-form");

    // Verificar si el formulario existe
    if (!form) {
        console.error('Formulario de pensión no encontrado');
        return;
    }

    // Llamar a la API para obtener los estudiantes registrados
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/')
    .then(response => response.json())
    .then(studentData => {
        const studentSelect = document.getElementById('student');

        // Verificar si la respuesta contiene los estudiantes
        const students = studentData.results;
        if (Array.isArray(students)) {
            students.forEach(student => {
                const option = document.createElement('option');
                option.value = student.id;  // ID del estudiante
                option.textContent = `${student.names} ${student.father_surname} ${student.mother_surname}`;
                studentSelect.appendChild(option);
            });
        } else {
            console.error('No se encontró un arreglo de estudiantes en la respuesta:', studentData);
        }
    })
    .catch(error => {
        console.error('Error al cargar los estudiantes:', error);
    });

    // Llamar a la API para obtener los grados disponibles
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/degrees/')
    .then(response => response.json())
    .then(degreeData => {
        const degreeSelect = document.getElementById('degree');

        // Verificar si la respuesta contiene los grados
        const degrees = degreeData.results;
        if (Array.isArray(degrees)) {
            degrees.forEach(degree => {
                const option = document.createElement('option');
                option.value = degree.id;  // ID del grado
                option.textContent = `${degree.grade} (${degree.school_year})`;
                degreeSelect.appendChild(option);
            });
        } else {
            console.error('No se encontró un arreglo de grados en la respuesta:', degreeData);
        }
    })
    .catch(error => {
        console.error('Error al cargar los grados:', error);
    });

    // Llamar a la API para obtener las inscripciones registradas
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')
    .then(response => response.json())
    .then(inscriptionData => {
        console.log(inscriptionData);  // Verifica qué datos estás recibiendo de la API
        const inscriptionSelect = document.getElementById('inscription');

        const inscriptions = inscriptionData.results;
        if (Array.isArray(inscriptions)) {
            inscriptions.forEach(inscription => {
                const student = inscription.student;
                const degree = inscription.degree;

                // Asegúrate de que `student` y `degree` están correctamente definidos
                const studentName = student ? `${student.names} ${student.father_surname} ${student.mother_surname}` : "Estudiante no disponible";
                const degreeInfo = degree ? `${degree.grade} (${degree.school_year})` : "Grado no disponible";

                const option = document.createElement('option');
                option.value = inscription.id;  // ID de la inscripción
                option.textContent = `${studentName} - ${degreeInfo}`;
                inscriptionSelect.appendChild(option);
            });
        } else {
            console.error('No se encontró un arreglo de inscripciones en la respuesta:', inscriptionData);
        }
    })
    .catch(error => {
        console.error('Error al cargar las inscripciones:', error);
    });

    // Manejador de envío de formulario
    form.addEventListener("submit", function(event) {
        event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

        // Recolectar los datos del formulario
        const pensionData = {
            monto: document.getElementById("monto").value,
            estado_pago: document.getElementById("estado-pago").checked,  // Si está marcado, estado_pago es true
            fecha_pago: document.getElementById("fecha-pago").value,
            inscription: document.getElementById("inscription").value,  // ID de la inscripción
        };

        console.log("Datos enviados a la API:", pensionData);

        // Enviar los datos a la API de Django
        fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(pensionData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            console.log("Pensión guardada correctamente:", data);
            window.location.href = "/caja";  // Cambia la URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar la pensión:", error);
        });
    });
});
