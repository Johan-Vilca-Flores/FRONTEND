// pension.js

console.log('pension.js cargado');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded OK');

  const inscriptionSelect = document.getElementById('inscription');
  const form              = document.getElementById('pension-form');
  const messageDiv        = document.getElementById('message');

  if (!messageDiv) {
    console.error('No existe <div id="message"> en el HTML');
    return;
  }

  // 1. Cargar inscripciones
  fetch(
    'https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/?_=' + Date.now(),
    { cache: 'no-store' }
  )
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      inscriptionSelect.innerHTML = '<option value="">--Selecciona una inscripción--</option>';
      data.results.forEach(ins => {
        const { student = {}, degree = {} } = ins;

        const nombre   = student.first_name    || student.names             || 'Sin nombre';
        const apellido = student.last_name     || student.father_surname    || '';
        const grado    = degree.name           || degree.grade             || 'Grado des.';
        const año      = degree.school_year    || degree.year              || 'N/D';

        const opt = document.createElement('option');
        opt.value       = ins.id;
        opt.textContent = `${nombre} ${apellido}`.trim() + ` — ${grado} (Año ${año})`;
        inscriptionSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Error al obtener inscripciones:', err);
      inscriptionSelect.innerHTML = '<option value="">Error cargando inscripciones</option>';
    });

  // 2. Manejar envío del formulario
  form.addEventListener('submit', async e => {
    e.preventDefault();
    messageDiv.textContent = '';

    const inscription = Number(inscriptionSelect.value);
    const monto       = Number(document.getElementById('monto').value);
    const estado_pago = document.getElementById('estado-pago').checked;
    const fecha_pago  = document.getElementById('fecha-pago').value;

    if (!inscription) {
      messageDiv.textContent = 'Debes seleccionar una inscripción.';
      messageDiv.style.color = 'red';
      return;
    }

    const payload = {
      inscription,
      monto,
      estado_pago,
      fecha_pago
    };

    console.log('Enviando payload:', payload);

    try {
      const res  = await fetch(
        'https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/',
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        }
      );
      const body = await res.json();
      if (!res.ok) throw body;

      console.log('Pensión registrada:', body);
      messageDiv.textContent = 'Pensión registrada con éxito.';
      messageDiv.style.color   = 'green';
      form.reset();

    } catch(err) {
      console.error('Error al registrar la pensión:', err);
      messageDiv.textContent =
        err.inscription?.join(', ')
        || err.detail
        || 'Error al registrar la pensión.';
      messageDiv.style.color = 'red';
    }
  });
});
