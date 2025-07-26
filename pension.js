document.addEventListener('DOMContentLoaded', () => {
  const inscriptionSelect = document.getElementById('inscription');
  const form              = document.getElementById('pension-form');
  const messageDiv        = document.getElementById('message');

  // 1. Cargar inscripciones
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      // Limpiar opción de "cargando..."
      inscriptionSelect.innerHTML = '<option value="">--Selecciona una inscripción--</option>';
      data.results.forEach(ins => {
        const opt = document.createElement('option');
        const student = ins.student;
        const degree  = ins.degree;
        // Ajusta estas propiedades según tu serializer real
        opt.value = ins.id;
        opt.textContent = 
          `${student.names} ${student.father_surname} — ${degree.grade} (Año ${degree.school_year})`;
        inscriptionSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Error al obtener inscripciones:', err);
      inscriptionSelect.innerHTML = '<option value="">Error cargando</option>';
    });

  // 2. Manejar el envío del formulario
  form.addEventListener('submit', e => {
    e.preventDefault();
    messageDiv.textContent = '';

    const payload = {
      inscription: inscriptionSelect.value,
      monto:       Number(document.getElementById('monto').value),
      estado_pago: document.getElementById('estado-pago').checked,
      fecha_pago:  document.getElementById('fecha-pago').value
    };

    // Validación mínima
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
    .then(res => {
      if (res.ok) return res.json();
      return res.json().then(errData => Promise.reject(errData));
    })
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
