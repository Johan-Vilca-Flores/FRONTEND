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
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      inscriptionSelect.innerHTML = '<option value="">--Selecciona una inscripción--</option>';
      data.results.forEach(ins => {
        const { student = {}, degree = {} } = ins;
        const nombre   = student.first_name  || student.names  || 'Sin nombre';
        const apellido = student.last_name   || student.father_surname || '';
        const grado    = degree.name         || degree.grade  || 'Grado des.';
        const año      = degree.school_year  || degree.year   || 'N/D';

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

    const payload = {
      inscription_id: inscriptionSelect.value,
      monto:          Number(document.getElementById('monto').value),
      estado_pago:    document.getElementById('estado-pago').checked,
      fecha_pago:     document.getElementById('fecha-pago').value
    };

    if (!payload.inscription_id) {
      messageDiv.textContent = 'Debes seleccionar una inscripción.';
      messageDiv.style.color = 'red';
      return;
    }

    try {
      const res  = await fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const body = await res.json();
      if (!res.ok) throw body;

      console.log('Pensión registrada:', body);
      messageDiv.textContent = 'Pensión registrada con éxito.';
      messageDiv.style.color = 'green';
      form.reset();
    } catch(err) {
      console.error('Error al registrar la pensión:', err);
      messageDiv.textContent = err.detail 
        || JSON.stringify(err) 
        || 'Error al registrar la pensión.';
      messageDiv.style.color = 'red';
    }
  });
});
