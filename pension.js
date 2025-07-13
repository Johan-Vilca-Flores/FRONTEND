// Función para cargar las inscripciones desde la API
fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')  // URL de la API de inscripciones
    .then(response => response.json())
    .then(data => {
        const inscriptionSelect = document.getElementById('inscription');

        // Llenar el selector de inscripciones con las inscripciones disponibles
        data.forEach(inscription => {
            const option = document.createElement('option');
            option.value = inscription.id;
            option.textContent = `Estudiante: ${inscription.student.names} - Grado: ${inscription.degree.grade}`;
            inscriptionSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las inscripciones:', error));

// Manejar el envío del formulario
document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const inscriptionId = document.getElementById('inscription').value;
    const amount = document.getElementById('amount').value;
    const status = document.getElementById('payment-status').value === "true";  // true para "Pagado", false para "Pendiente"
    const paymentDate = document.getElementById('payment-date').value;  // Obtener la fecha de pago

    const updatedPensionData = {
        monto: amount,
        estado_pago: status,
        fecha_pago: paymentDate  // Agregar la fecha de pago al cuerpo de la solicitud
    };

    // Enviar la actualización de la pensión a la API de Django
    fetch(`https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/`, {  
        method: 'POST',  // Usamos POST para crear una nueva pensión
        headers: {
            'Content-Type': 'application/json',
            // Si necesitas autenticación, puedes incluir el token JWT o cookies de sesión
            // 'Authorization': 'Bearer YOUR_JWT_TOKEN'
        },
        body: JSON.stringify(updatedPensionData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Pensión registrada:', data);
        alert('¡Pensión registrada con éxito!');

        // Redirigir a la página de "Caja" después de registrar la pensión
        window.location.href = "caja.html";  // Aquí puedes cambiar la URL si es necesario
    })
    .catch(error => {
        console.error('Error al registrar la pensión:', error);
        alert('Hubo un error al realizar el pago.');
    });
});
