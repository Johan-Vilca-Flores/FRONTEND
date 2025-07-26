document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("pension-form");

    if (!form) {
        console.error('Formulario de pensión no encontrado');
        return;
    }

    // Cargar inscripciones desde la API
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')
    .then(response => response.json())
    .then(data => {
        const inscriptionSelect = document.getElementById('inscription');
        const inscriptions = data.results;

        if (Array.isArray(inscriptions)) {
            inscriptions.forEach(inscription => {
                const student = inscription.student || {};
                const degree = inscription.degree || {};

                // Obtener partes del nombre
                const nombres = student.names || '';
                const apellidoPaterno = student.father_surname || '';
                const apellidoMaterno = student.mother_surname || '';

                // Obtener datos de grado
                const grado = degree.grade || '';
                const año = degree.school_year || '';

                // Formatear texto: Juan Pérez García - 5to (2025)
                const studentName = `${nombres} ${apellidoPaterno} ${apellidoMaterno}`.trim();
                const degreeInfo = grado && año ? `${grado} (${año})` : '';

                const optionText = studentName && degreeInfo
                    ? `${studentName} - ${degreeInfo}`
                    : `Inscripción #${inscription.id}`;

                const option = document.createElement('option');
                option.value = inscription.id;
                option.textContent = optionText;
                inscriptionSelect.appendChild(option);
            });
        } else {
            console.error('La respuesta de inscripciones no es un arreglo:', data);
        }
    })
    .catch(error => {
        console.error('Error al cargar las inscripciones:', error);
    });

    // Enviar el formulario de pensión
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const pensionData = {
            monto: document.getElementById("monto").value,
            estado_pago: document.getElementById("estado-pago").checked,
            fecha_pago: document.getElementById("fecha-pago").value,
            inscription: document.getElementById("inscription").value,
        };

        console.log("Datos enviados a la API:", pensionData);

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
            window.location.href = "/caja";  // redirige luego de guardar
        })
        .catch(error => {
            console.error("Error al guardar la pensión:", error);
        });
    });
});
