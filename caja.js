console.log('caja.js cargado');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded OK');

  const pensionSelect   = document.getElementById('pension');
  const form            = document.getElementById('payment-form');
  const messageDiv      = document.getElementById('message');

  if (!messageDiv) {
    console.error('Falta <div id="message"> en el HTML');
    return;
  }

  // 1. Cargar pensiones (solo las registradas)
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      pensionSelect.innerHTML = '<option value="">--Selecciona una pensión--</option>';
      data.results.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        // Mostrar estudiante y monto, por ejemplo:
        const estudiante = p.inscription && p.inscription.student
                          ? `${p.inscription.student.first_name || p.inscription.student.names} ${p.inscription.student.last_name || p.inscription.student.father_surname}`
                          : `Pensión #${p.id}`;
        opt.textContent = `${estudiante} — S/ ${p.monto}`;
        pensionSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Error al cargar pensiones:', err);
      pensionSelect.innerHTML = '<option value="">Error cargando pensiones</option>';
    });

  // 2. Envío del formulario
  form.addEventListener('submit', async e => {
    e.preventDefault();
    messageDiv.textContent = '';

    const pensionId    = pensionSelect.value;
    const method       = document.getElementById('payment-method').value;
    const amount       = document.getElementById('amount').value;
    const receiptInput = document.getElementById('receipt-image');
    const notes        = document.getElementById('notes').value;

    if (!pensionId || !method || !amount) {
      messageDiv.textContent = 'Completa todos los campos obligatorios.';
      messageDiv.style.color = 'red';
      return;
    }

    // Construir FormData para multipart/form-data
    const formData = new FormData();
    formData.append('pension', pensionId);
    formData.append('payment_method', method);
    formData.append('amount', amount);
    if (receiptInput.files.length > 0) {
      formData.append('receipt_image', receiptInput.files[0]);
    }
    formData.append('notes', notes);

    try {
      const res = await fetch(
        'https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/cashboxentries/',
        {
          method:  'POST',
          body:    formData
        }
      );
      const body = await res.json();
      if (!res.ok) throw body;

      console.log('Pago registrado en caja:', body);
      messageDiv.textContent = 'Pago registrado con éxito.';
      messageDiv.style.color = 'green';
      form.reset();
      setTimeout(() => {
        window.location.href = '/thanks.html';
      }, 1000);

    } catch (err) {
      console.error('Error al registrar pago:', err);
      messageDiv.textContent = err.detail 
                            || JSON.stringify(err) 
                            || 'Error al registrar el pago.';
      messageDiv.style.color = 'red';
    }
  });
});
