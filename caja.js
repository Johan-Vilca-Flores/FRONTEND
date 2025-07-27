// caja.js

console.log('caja.js cargado');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded OK');

  const pensionSelect = document.getElementById('pension');
  const form          = document.getElementById('payment-form');
  const messageDiv    = document.getElementById('message');

  if (!messageDiv) {
    console.error('Falta <div id="message"> en el HTML');
    return;
  }

  // 1. Cargar solo la pensión más reciente con datos de estudiante anidados vía fetch extra
  async function loadRecentPension() {
    try {
      const resP = await fetch(
        'https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/?_=' + Date.now(),
        { cache: 'no-store' }
      );
      if (!resP.ok) throw resP;
      const dataP = await resP.json();

      // Ordenar por id desc y quedarnos con la más reciente
      const [recent] = dataP.results
        .sort((a, b) => b.id - a.id)
        .slice(0, 1);

      pensionSelect.innerHTML = '<option value="">--Selecciona una pensión--</option>';

      // Fetch extra para obtener la inscripción completa
      const resI = await fetch(
        `https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/${recent.inscription}/`,
        { cache: 'no-store' }
      );
      if (!resI.ok) throw resI;
      const insData = await resI.json();

      const student   = insData.student || {};
      const nombre    = student.first_name   || student.names            || 'Sin nombre';
      const paterno   = student.last_name    || student.father_surname   || '';
      const estudiante= `${nombre} ${paterno}`.trim();

      const opt = document.createElement('option');
      opt.value       = recent.id;
      opt.textContent = `${estudiante} — S/ ${recent.monto}`;
      pensionSelect.appendChild(opt);

    } catch (err) {
      console.error('Error al cargar la pensión reciente:', err);
      pensionSelect.innerHTML = '<option value="">Error cargando pensión</option>';
    }
  }

  loadRecentPension();

  // 2. Envío del formulario de pago
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
        'https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/cashbox-entries/',
        {
          method: 'POST',
          body:   formData
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
      messageDiv.textContent = 
        err.detail 
        || JSON.stringify(err) 
        || 'Error al registrar el pago.';
      messageDiv.style.color = 'red';
    }
  });
});
