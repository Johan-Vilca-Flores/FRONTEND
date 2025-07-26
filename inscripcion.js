document.addEventListener('DOMContentLoaded', () => {
  const form          = document.getElementById('inscripcion-form');
  const studentSelect = document.getElementById('student');
  const degreeSelect  = document.getElementById('degree');
  const messageDiv    = document.getElementById('message');

  // 1) Cargar estudiantes
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/')
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then(data => {
      studentSelect.innerHTML = '<option value="">--Selecciona un estudiante--</option>';
      data.results.forEach(s => {
        const opt = document.createElement('option');
        opt.value       = s.id;
        const nombre    = s.names || s.first_name || '';
        const paterno   = s.father_surname || s.last_name || '';
        opt.textContent = `${nombre} ${paterno}`.trim();
        studentSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Error al cargar estudiantes:', err);
      studentSelect.innerHTML = '<option value="">Error cargando estudiantes</option>';
    });

  // 2) Cargar grados
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/degrees/')
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then(data => {
      degreeSelect.innerHTML = '<option value="">--Selecciona un grado--</option>';
      data.results.forEach(d => {
        const opt = document.createElement('option');
        opt.value       = d.id;
        opt.textContent = `${d.grade} (${d.school_year})`;
        degreeSelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error('Error al cargar grados:', err);
      degreeSelect.innerHTML = '<option value="">Error cargando grados</option>';
    });

  // 3) Manejar envío
  form.addEventListener('submit', async e => {
    e.preventDefault();
    messageDiv.textContent = '';

    const studentId = Number(studentSelect.value);
    const degreeId  = Number(degreeSelect.value);
    if (!studentId || !degreeId) {
      messageDiv.textContent = 'Selecciona estudiante y grado.';
      messageDiv.style.color = 'red';
      return;
    }

    const payload = { student_id: studentId, degree_id: degreeId };
    console.log('Enviando payload:', payload);

    try {
      const res = await fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });
      const body = await res.json();
      if (!res.ok) throw body;

      console.log('Inscripción creada:', body);
      messageDiv.textContent = 'Inscripción registrada con éxito.';
      messageDiv.style.color = 'green';
      form.reset();
      setTimeout(() => window.location.href = '/pension.html', 1000);

    } catch(err) {
      console.error('Error al crear inscripción:', err);
      messageDiv.textContent = err.detail 
        || JSON.stringify(err) 
        || 'Error desconocido';
      messageDiv.style.color = 'red';
    }
  });
});
