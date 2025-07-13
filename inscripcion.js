document.addEventListener("DOMContentLoaded", function() {
// Función para cargar los grados desde la API
fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/degrees/')  // URL de la API de grados
    .then(response => response.json())
    .then(data => {
        const degreeSelect = document.getElementById('degree');

        // Llenar el selector de grados con los grados disponibles
        data.forEach(degree => {
            const option = document.createElement('option');
            option.value = degree.id;
            option.textContent = `${degree.grade} (${degree.school_year})`;
            degreeSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar los grados:', error));

// Función para cargar los estudiantes desde la API
fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/')  // URL de la API de estudiantes
    .then(response => response.json())
    .then(data => {
        const studentSelect = document.getElementById('student');

        // Llenar el selector de estudiantes con los estudiantes disponibles
        data.forEach(student => {
            const option = document.createElement('option');
            option.value = student.id;  // Usar el ID del estudiante como valor
            option.textContent = `${student.names} ${student.father_surname} ${student.mother_surname}`;
            studentSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar los estudiantes:', error));

// Manejar el envío del formulario
document.getElementById('inscription-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const degreeId = document.getElementById('degree').value;
    const studentId = document.getElementById('student').value;

    const inscriptionData = {
        degree: degreeId,
        student: studentId,
        status: true // Puedes añadir más datos si lo necesitas
    };

    // Enviar la inscripción a la API de Django
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/', {  // URL de la API de inscripciones
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Si necesitas autenticación, puedes incluir el token JWT o cookies de sesión
            // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
        },
        body: JSON.stringify(inscriptionData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Inscripción exitosa:', data);
        alert('¡Inscripción realizada con éxito!');
    })
    .catch(error => {
        console.error('Error al inscribir:', error);
        alert('Hubo un error al realizar la inscripción.');
    });
});
});
