document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("pension-form");

    // Verificar si el formulario existe
    if (!form) {
        console.error('Formulario de pensión no encontrado');
        return;
    }

    // Llamar a la API para obtener las inscripciones registradas
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')
    .then(response => response.json())
    .then(data => {
        const inscriptionSelect = document.getElementById('inscription');

        // Verificar si la respuesta contiene las inscripciones
        const inscriptions = data.results;
        if (Array.isArray(inscriptions)) {
            inscriptions.forEach(inscription => {
                const student = inscription.student || {};
                const degree = inscription.degree || {};

                const studentName = `${student.names || ''} ${student.father_surname || ''} ${student.mother_surname || ''}`.trim();
                const degreeInfo = `${degree.grade || ''} (${degree.school_year || ''})`.trim();

                // Texto final del option
                const optionText = studentName && degreeInfo
                    ? `${studentName} - ${degreeInfo}`
                    : `Inscripción #${inscription.id}`;

                const option = document.createElement('option');
                option.value = inscription.id;
                option.textContent = optionText;
                inscriptionSelect.appendChild(option);
            });
        } else {
            console.error('No se encontró un arreglo de inscripciones en la respuesta:', data);
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
            estado_pago: document.getElementById("estado-pago").checked,
            fecha_pago: document.getElementById("fecha-pago").value,
            inscription: document.getElementById("inscription").value,
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
            window.location.href = "/caja";  // Cambia esta URL si es necesario
        })
        .catch(error => {
            console.error("Error al guardar la pensión:", error);
        });
    });
});
