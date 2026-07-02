// scripts/empresas.js
// EE4 - Lucky Air - Pagina Empresas + Supabase
console.log('empresas.js cargado');

document.addEventListener('DOMContentLoaded', () => {
  const radiosPlan = document.querySelectorAll('input[name="plan"]');
  const resumenPlan = document.createElement('p');
  resumenPlan.id = 'resumen-plan';
  resumenPlan.classList.add('resumen-plan');

  const fieldsets = document.querySelectorAll('form[name="form-empresa"] fieldset');
  const fieldsetPlan = fieldsets[2] || null;

  if (fieldsetPlan) {
    fieldsetPlan.appendChild(resumenPlan);
  }

  const infoPlanes = {
    starter: 'Plan Starter: gratis, hasta 10 empleados, 5% de descuento en vuelos.',
    business: 'Plan Business: CNY 500/mes, hasta 50 empleados, 10% de descuento y ejecutivo compartido.',
    enterprise: 'Plan Enterprise: precio a medida, empleados ilimitados, 15%+ de descuento y ejecutivo dedicado.',
  };

  function actualizarResumenPlan() {
    const seleccionado = document.querySelector('input[name="plan"]:checked');
    if (seleccionado && resumenPlan) {
      resumenPlan.textContent = infoPlanes[seleccionado.value] || '';
      resumenPlan.classList.add('visible');
    }
  }

  radiosPlan.forEach((radio) => {
    radio.addEventListener('change', actualizarResumenPlan);
  });
  actualizarResumenPlan();

  const inputRazon = document.getElementById('e-razon');
  if (inputRazon) {
    const guardado = localStorage.getItem('luckyair_empresa_razon');
    if (guardado) inputRazon.value = guardado;
    inputRazon.addEventListener('input', () => {
      localStorage.setItem('luckyair_empresa_razon', inputRazon.value);
    });
  }

  const formEmpresa = document.querySelector('form[name="form-empresa"]');
  if (!formEmpresa) return;

  let feedback = document.getElementById('empresa-feedback');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.id = 'empresa-feedback';
    feedback.setAttribute('role', 'alert');
    formEmpresa.insertBefore(feedback, formEmpresa.firstChild);
  }

  function mostrarFeedback(tipo, mensaje) {
    feedback.className = `feedback feedback--${tipo}`;
    feedback.innerHTML = mensaje;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  formEmpresa.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const errores = [];
    const razon = document.getElementById('e-razon');
    const ruc = document.getElementById('e-ruc');
    const tamano = document.getElementById('e-tamano');
    const rubro = document.getElementById('e-rubro');
    const contacto = document.getElementById('e-contacto');
    const cargo = document.getElementById('e-cargo');
    const email = document.getElementById('e-email');
    const telefono = document.getElementById('e-tel');
    const planSeleccionado = document.querySelector('input[name="plan"]:checked');

    if (razon.value.trim().length < 3) errores.push('La razon social debe tener al menos 3 caracteres.');
    if (!/^[0-9]{8,13}$/.test(ruc.value.trim())) errores.push('El RUC o NIT debe contener solo numeros (8 a 13 digitos).');
    if (!tamano.value) errores.push('Selecciona el tamano de la empresa.');
    if (!rubro.value) errores.push('Selecciona el rubro de la empresa.');
    if (contacto.value.trim().length < 3) errores.push('Ingresa el nombre del contacto.');
    if (cargo.value.trim().length < 2) errores.push('Ingresa el cargo del contacto.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) errores.push('Ingresa un email corporativo valido.');
    if (!/^[+0-9 ]{9,15}$/.test(telefono.value.trim())) errores.push("El telefono debe tener entre 9 y 15 caracteres (numeros, espacios o '+').");
    if (!planSeleccionado) errores.push('Selecciona un plan.');

    if (errores.length > 0) {
      mostrarFeedback('error', '<strong>Revisa los siguientes datos:</strong><ul>' + errores.map((err) => `<li>${err}</li>`).join('') + '</ul>');
      return;
    }

    if (!window.EmpresasCrud) {
      mostrarFeedback('error', 'No se cargo el modulo CRUD de empresas.');
      return;
    }

    mostrarFeedback('ok', 'Formulario valido. Guardando solicitud en Supabase...');

    const resultado = await window.EmpresasCrud.crearEmpresa({
      ruc: ruc.value.trim(),
      razon_social: razon.value.trim(),
      contacto_email: email.value.trim(),
      plan: planSeleccionado.value,
      tamano: tamano.value,
      rubro: rubro.value,
      contacto: contacto.value.trim(),
      cargo: cargo.value.trim(),
      telefono: telefono.value.trim(),
    });

    if (!resultado.ok) {
      mostrarFeedback('error', `<strong>No se pudo guardar la solicitud:</strong> ${resultado.error}`);
      return;
    }

    localStorage.removeItem('luckyair_empresa_razon');
    formEmpresa.reset();
    actualizarResumenPlan();
    mostrarFeedback('ok', '<strong>Solicitud enviada correctamente.</strong> Se guardo en Supabase y ya puedes mostrarla en la demo.');
    window.location.hash = 'gracias-empresa';
  });
});
