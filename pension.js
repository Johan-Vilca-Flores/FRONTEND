document.addEventListener('DOMContentLoaded', () => {
  // 1. Referencias al DOM
  const form       = document.getElementById('pension-form');
  const selInscrip = document.getElementById('inscription');
  const chkEstado  = document.getElementById('status');
  const inpFecha   = document.getElementById('payment_date');

  if (!form || !selInscrip) {
    console.error('Formulario de Pensión o <select> no encontrados');
    return;
  }

  // 2. Cargar inscripciones
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/')
    .then(res => res.json())
    .then(data => {
      // DRF paginado: data.results, o bien un array plano en data
      const inscripciones = Array.isArray(data.results) ? data.results : data;

      inscripciones.forEach(ins => {
        const { id, student, degree } = ins;
        const option = document.createElement('option');
        option.value = id;
        // Ajusta aquí los nombres de campo exactos que devuelve tu API:
        // p.ej. student.nombres, student.apellido_paterno, etc.
        option.textContent = 
          `${student.nombres} ${student.apellido_paterno} ${student.apellido_materno} — ` +
          `${degree.grado} (${degree.año_escolar})`;

        selInscrip.appendChild(option);
      });
    })
    .catch(err => console.error('Error cargando inscripciones:', err));

  // 3. Envío del formulario
  form.addEventListener('submit', e => {
    e.preventDefault();

    const payload = {
      inscription:  selInscrip.value,
      status:       chkEstado.checked,
      payment_date: inpFecha.value
    };

    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/pensions/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log('Pensión registrada:', data);
      // redirige o notifica al usuario:
      window.location.href = '/pension.html';
    })
    .catch(err => console.error('Error al registrar pensión:', err));
  });
});
