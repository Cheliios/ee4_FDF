// scripts/estudiantes.js
// EE4 - Lucky Air - Pagina Estudiantes + Supabase
console.log('estudiantes.js cargado');

document.addEventListener('DOMContentLoaded', () => {
  const promosSection = document.getElementById('promos');
  const promoArticles = promosSection ? promosSection.querySelectorAll('.cards article') : [];

  if (promoArticles.length > 0) {
    const filtroDiv = document.createElement('div');
    filtroDiv.classList.add('filtro-promos');
    filtroDiv.innerHTML = `
      <button type="button" data-filtro="todas" class="btn btn-outline activo">Todas</button>
      <button type="button" data-filtro="vigentes" class="btn btn-outline">Solo vigentes</button>
    `;
    promosSection.querySelector('h2').insertAdjacentElement('afterend', filtroDiv);

    const hoy = new Date();

    function aplicarFiltro(modo) {
      promoArticles.forEach((articulo) => {
        const timeEl = articulo.querySelector('time');
        const fechaLimite = timeEl ? new Date(timeEl.getAttribute('datetime')) : null;
        const vigente = !fechaLimite || fechaLimite >= hoy;

        if (modo === 'vigentes' && !vigente) articulo.classList.add('promo-oculta');
        else articulo.classList.remove('promo-oculta');
      });
    }

    filtroDiv.querySelectorAll('button').forEach((boton) => {
      boton.addEventListener('click', () => {
        filtroDiv.querySelectorAll('button').forEach((b) => b.classList.remove('activo'));
        boton.classList.add('activo');
        aplicarFiltro(boton.dataset.filtro);
      });
    });
  }

  const detalles = document.getElementById('g-detalles');
  if (detalles) {
    const contador = document.createElement('p');
    contador.classList.add('contador-caracteres');
    contador.textContent = `0 / ${detalles.maxLength} caracteres`;
    detalles.insertAdjacentElement('afterend', contador);

    detalles.addEventListener('input', () => {
      contador.textContent = `${detalles.value.length} / ${detalles.maxLength} caracteres`;
      if (detalles.value.length > detalles.maxLength * 0.9) contador.classList.add('contador-limite');
      else contador.classList.remove('contador-limite');
    });
  }

  const inputUniversidad = document.getElementById('est-uni');
  if (inputUniversidad) {
    const universidadGuardada = localStorage.getItem('luckyair_universidad');
    if (universidadGuardada) inputUniversidad.value = universidadGuardada;
    inputUniversidad.addEventListener('change', () => {
      localStorage.setItem('luckyair_universidad', inputUniversidad.value);
    });
  }

  function crearFeedback(formulario, id) {
    let feedback = document.getElementById(id);
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.id = id;
      feedback.setAttribute('role', 'alert');
      formulario.insertBefore(feedback, formulario.firstChild);
    }
    return feedback;
  }

  function pintarFeedback(feedback, tipo, mensaje) {
    feedback.className = `feedback feedback--${tipo}`;
    feedback.innerHTML = mensaje;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const formGrupo = document.querySelector('form[name="form-grupo"]');
  if (formGrupo) {
    const feedbackGrupo = crearFeedback(formGrupo, 'grupo-feedback');

    formGrupo.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const errores = [];

      const institucion = document.getElementById('g-institucion');
      const contacto = document.getElementById('g-contacto');
      const email = document.getElementById('g-email');
      const telefono = document.getElementById('g-tel');
      const personas = document.getElementById('g-personas');
      const origen = document.getElementById('g-origen');
      const destino = document.getElementById('g-destino');
      const fecha = document.getElementById('g-fecha');
      const detallesTexto = document.getElementById('g-detalles');

      if (institucion.value.trim().length < 3) errores.push('Ingresa la institucion educativa.');
      if (contacto.value.trim().length < 3) errores.push('Ingresa el nombre del coordinador.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) errores.push('Ingresa un email valido.');
      if (!/^[+0-9 ]{9,15}$/.test(telefono.value.trim())) errores.push('El telefono debe tener entre 9 y 15 caracteres.');
      if (!Number(personas.value) || Number(personas.value) < 10) errores.push('El grupo debe tener al menos 10 personas.');
      if (origen.value.trim().length < 2) errores.push('Ingresa el origen del viaje.');
      if (destino.value.trim().length < 2) errores.push('Ingresa el destino del viaje.');
      if (!fecha.value) errores.push('Selecciona una fecha tentativa.');

      if (errores.length > 0) {
        pintarFeedback(feedbackGrupo, 'error', '<strong>Corrige lo siguiente:</strong><ul>' + errores.map((err) => `<li>${err}</li>`).join('') + '</ul>');
        return;
      }

      if (!window.EstudiantesCrud) {
        pintarFeedback(feedbackGrupo, 'error', 'No se cargo el modulo CRUD de estudiantes.');
        return;
      }

      pintarFeedback(feedbackGrupo, 'ok', 'Datos validos. Guardando solicitud grupal en Supabase...');

      const resultado = await window.EstudiantesCrud.crearSolicitudGrupal({
        institucion: institucion.value.trim(),
        contacto: contacto.value.trim(),
        email: email.value.trim(),
        telefono: telefono.value.trim(),
        personas: personas.value.trim(),
        origen: origen.value.trim(),
        destino: destino.value.trim(),
        fecha: fecha.value,
        detalles: detallesTexto.value.trim(),
      });

      if (!resultado.ok) {
        pintarFeedback(feedbackGrupo, 'error', `<strong>No se pudo guardar la solicitud:</strong> ${resultado.error}`);
        return;
      }

      formGrupo.reset();
      pintarFeedback(feedbackGrupo, 'ok', '<strong>Cotizacion grupal enviada.</strong> La solicitud quedo registrada en Supabase.');
      window.location.hash = 'gracias-grupo';
    });
  }

  const formVerificacion = document.querySelector('form[name="form-verificacion"]');
  if (formVerificacion) {
    const feedback = crearFeedback(formVerificacion, 'verificacion-feedback');

    formVerificacion.addEventListener('submit', async (evento) => {
      evento.preventDefault();
      const errores = [];

      const nombre = document.getElementById('est-nombre');
      const email = document.getElementById('est-email');
      const universidad = document.getElementById('est-uni');
      const carnet = document.getElementById('est-carnet');
      const ciclo = document.getElementById('est-ciclo');
      const foto = document.getElementById('est-foto');
      const acepto = formVerificacion.querySelector('input[name="acepto"]');

      if (nombre.value.trim().length < 3) errores.push('Ingresa tus nombres completos.');
      if (!/^[^\s@]+@[^\s@]+\.edu/.test(email.value.trim())) errores.push("El email debe ser institucional (debe contener '.edu').");
      if (universidad.value.trim().length < 3) errores.push('Ingresa el nombre de tu universidad.');
      if (carnet.value.trim().length < 3) errores.push('Ingresa tu numero de carnet.');
      if (!ciclo.value) errores.push('Selecciona tu ciclo actual.');
      if (!foto.files || foto.files.length === 0) errores.push('Adjunta una foto de tu carnet.');
      if (!acepto.checked) errores.push('Debes autorizar la verificacion de tu condicion de estudiante.');

      if (errores.length > 0) {
        pintarFeedback(feedback, 'error', '<strong>Corrige lo siguiente:</strong><ul>' + errores.map((err) => `<li>${err}</li>`).join('') + '</ul>');
        return;
      }

      if (!window.EstudiantesCrud) {
        pintarFeedback(feedback, 'error', 'No se cargo el modulo CRUD de estudiantes.');
        return;
      }

      pintarFeedback(feedback, 'ok', 'Datos validos. Guardando verificacion en Supabase...');

      const resultado = await window.EstudiantesCrud.crearEstudiante({
        nombre: nombre.value.trim(),
        email: email.value.trim(),
        universidad: universidad.value.trim(),
        carnet: carnet.value.trim(),
        ciclo: ciclo.value,
      });

      if (!resultado.ok) {
        pintarFeedback(feedback, 'error', `<strong>No se pudo guardar la verificacion:</strong> ${resultado.error}`);
        return;
      }

      localStorage.removeItem('luckyair_universidad');
      formVerificacion.reset();
      pintarFeedback(feedback, 'ok', '<strong>Verificacion enviada.</strong> El registro ya quedo guardado en Supabase.');
      window.location.hash = 'gracias-verificacion';
    });
  }
});
