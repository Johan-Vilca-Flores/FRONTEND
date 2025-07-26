console.log('pension.js cargado');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded OK');

  const inscriptionSelect = document.getElementById('inscription');
  const form              = document.getElementById('pension-form');
  const messageDiv        = document.getElementById('message');

  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      console.log('inscripciones:', data.results);
      inscriptionSelect.innerHTML = '<option value="">--Selecciona una inscripción--</option>';
      data.results.forEach(ins => {
        const { student = {}, degree = {} } = ins;
        const nombre   = student.first_name  || student.names  || 'Sin nombre';
        const apellido = student.last_name   || student.father_surname || '';
        const grado    = degree.name        || degree.grade || 'Grado des.';
        const año      = degree.school_year || degree.year  || 'N/D';

        const opt = document.createElement('option');
        opt.value = ins.id;
        opt.textContent = `${nombre} ${apellido}`.trim() + ` — ${grado} (Año ${año})`;
        inscriptionSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Error al obtener inscripciones:', err);
      inscriptionSelect.innerHTML = '<option value="">Error cargando</option>';
    });

  form.addEventListener('submit', e => {
    e.preventDefault();
    messageDiv.textContent = '';

    const payload = {
      inscription: inscriptionSelect.value,
      monto:       Number(document.getElementById('monto').value),
      estado_pago: document.getElementById('estado-pago').checked,
      fecha_pago:  document.getElementById('fecha-pago').value
    };

    if (!payload.inscription) {
      messageDiv.textContent = 'Debes seleccionar una inscripción.';
      messageDiv.style.color = 'red';
      return;
    }

    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.ok ? res.json() : res.json().then(e=>Promise.reject(e)))
    .then(() => {
      messageDiv.textContent = 'Pensión registrada con éxito.';
      messageDiv.style.color = 'green';
      form.reset();
    })
    .catch(err => {
      console.error('Error al registrar pensión:', err);
      messageDiv.textContent = 'Error al registrar la pensión. Revisa la consola.';
      messageDiv.style.color = 'red';
    });
  });
});
