// Función para cargar las pensiones desde la API
fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/')  // URL de la API de pensiones
    .then(response => response.json())
    .then(data => {
        const pensionSelect = document.getElementById('pension');

        // Llenar el selector de pensiones con las pensiones disponibles
        data.forEach(pension => {
            const option = document.createElement('option');
            option.value = pension.id;
            option.textContent = `Pensión ${pension.id} - Monto: ${pension.monto}`;
            pensionSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar las pensiones:', error));

// Manejar el envío del formulario
document.getElementById('payment-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevenir el comportamiento por defecto del formulario

    const pensionId = document.getElementById('pension').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const amount = document.getElementById('amount').value;
    const receiptImage = document.getElementById('receipt-image').files[0];  // Obtener el archivo de imagen
    const notes = document.getElementById('notes').value;

    const paymentData = new FormData();
    paymentData.append('pension', pensionId);
    paymentData.append('payment_method', paymentMethod);
    paymentData.append('amount', amount);
    paymentData.append('receipt_image', receiptImage);
    paymentData.append('notes', notes);

    // Enviar los datos del pago a la API
    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/cashbox/', {  // URL de la API de CashBox
        method: 'POST',
        body: paymentData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Pago registrado:', data);
        alert('¡Pago registrado exitosamente!');

        // Redirigir a la página de "Gracias" o cierre de sesión
        window.location.href = 'thanks.html';  // Redirigir a una página de agradecimiento o cierre de sesión
    })
    .catch(error => {
        console.error('Error al registrar el pago:', error);
        alert('Hubo un error al realizar el pago.');
    });
});
