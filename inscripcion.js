document.addEventListener('DOMContentLoaded', () => {
  const form          = document.getElementById('inscripcion-form');
  const studentSelect = document.getElementById('student');
  const degreeSelect  = document.getElementById('degree');
  const messageDiv    = document.getElementById('message');

  // 1. Cargar estudiantes
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      studentSelect.innerHTML = '<option value="">--Selecciona un estudiante--</option>';
      data.results.forEach(s => {
        const option = document.createElement('option');
        option.value       = s.id;
        // Ajusta nombres según tu serializer real
        const nombre       = s.names || s.first_name || '';
        const paterno      = s.father_surname || s.last_name || '';
        option.textContent = `${nombre} ${paterno}`.trim();
        studentSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error al cargar estudiantes:', err);
      studentSelect.innerHTML = '<option value="">Error cargando estudiantes</option>';
    });

  // 2. Cargar grados
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/degrees/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      degreeSelect.innerHTML = '<option value="">--Selecciona un grado--</option>';
      data.results.forEach(d => {
        const option = document.createElement('option');
        option.value       = d.id;
        option.textContent = `${d.grade} (${d.school_year})`;
        degreeSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error al cargar grados:', err);
      degreeSelect.innerHTML = '<option value="">Error cargando grados</option>';
    });

  // 3. Manejar envío del formulario
  form.addEventListener('submit', event => {
    event.preventDefault();
    messageDiv.textContent = '';

    const studentId = studentSelect.value;
    const degreeId  = degreeSelect.value;

    if (!studentId || !degreeId) {
      messageDiv.textContent = 'Selecciona estudiante y grado.';
      messageDiv.style.color = 'red';
      return;
    }

    const payload = {
      student_id: Number(studentId),
      degree_id:  Number(degreeId)
    };

    console.log('Enviando a API:', payload);

    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    })
    .then(async res => {
      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error en respuesta:', errorData);
        throw new Error(errorData.detail || 'Error desconocido');
      }
      return res.json();
    })
    .then(data => {
      console.log('Inscripción creada:', data);
      messageDiv.textContent = 'Inscripción registrada con éxito.';
      messageDiv.style.color = 'green';
      form.reset();
      // Redirige a pensiones
      setTimeout(() => {
        window.location.href = '/pension.html';
      }, 1000);
    })
    .catch(err => {
      console.error('Error al crear inscripción:', err);
      messageDiv.textContent = `Error: ${err.message}`;
      messageDiv.style.color = 'red';
    });
  });
});
