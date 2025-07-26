document.addEventListener('DOMContentLoaded', () => {
  const degreeSelect  = document.getElementById('degree-select');
  const studentSelect = document.getElementById('student-select');
  const form          = document.getElementById('inscription-form');
  const messageDiv    = document.getElementById('message');

  // 1. Cargar grados
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/degrees/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      data.results.forEach(degree => {
        const opt = document.createElement('option');
        opt.value = degree.id;
        opt.textContent = `${degree.grade} – Año ${degree.school_year}`;
        degreeSelect.appendChild(opt);
      });
    })
    .catch(err => console.error('Error fetching degrees:', err));

  // 2. Cargar estudiantes
  fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/students/')
    .then(res => res.ok ? res.json() : Promise.reject(res))
    .then(data => {
      data.results.forEach(student => {
        const opt = document.createElement('option');
        opt.value = student.id;
        opt.textContent = `${student.names} ${student.father_surname} ${student.mother_surname || ''}`;
        studentSelect.appendChild(opt);
      });
    })
    .catch(err => console.error('Error fetching students:', err));

  // 3. Enviar inscripción
  form.addEventListener('submit', e => {
    e.preventDefault();
    const degreeId  = degreeSelect.value;
    const studentId = studentSelect.value;

    if (!degreeId || !studentId) {
      messageDiv.textContent = 'Por favor, selecciona grado y estudiante.';
      messageDiv.style.color = 'red';
      return;
    }

    const payload = { degree: degreeId, student: studentId };

    fetch('https://proyecto01-git-main-johan-vilca-flores-projects.vercel.app/api/inscriptions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => {
      if (res.ok) return res.json();
      return res.json().then(errData => Promise.reject(errData));
    })
    .then(() => {
      messageDiv.textContent = 'Inscripción registrada con éxito.';
      messageDiv.style.color = 'green';
      form.reset();
    })
    .catch(err => {
      console.error('Error al registrar inscripción:', err);
      messageDiv.textContent = 'Error al registrar inscripción. Revisa la consola.';
      messageDiv.style.color = 'red';
    });
  });
});
