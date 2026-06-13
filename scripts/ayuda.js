// ============================================================
// ayuda.js - Autor: Felipe Reyes Ingunza
// Centro de ayuda: filtro en vivo de las FAQ y validacion del
// formulario de contacto con contador de caracteres.
// ============================================================

(function () {
  'use strict';

  const LA = window.LA || {};

  // Avisa por toast si el helper global esta disponible.
  function avisar(msg, tipo) {
    if (LA.notificar) LA.notificar(msg, tipo);
  }

  // ----------------------------------------------------------
  // Filtro en vivo de las preguntas frecuentes.
  // ----------------------------------------------------------
  function iniciarFiltroFAQ() {
    const form = document.querySelector('[name="form-buscar-ayuda"]');
    const input = document.getElementById('s-query');
    const faq = document.getElementById('faq');
    if (!input || !faq) return;

    const items = Array.from(faq.querySelectorAll('details'));

    // Mensaje "sin resultados" (oculto al inicio).
    const sinResultados = document.createElement('p');
    sinResultados.className = 'faq-sin-resultados';
    sinResultados.hidden = true;
    sinResultados.textContent = 'No encontramos preguntas que coincidan. Prueba con otra palabra.';
    faq.appendChild(sinResultados);

    // Oculta las preguntas que no contienen el texto buscado.
    function filtrar() {
      const q = input.value.trim().toLowerCase();
      let visibles = 0;
      items.forEach((det) => {
        const texto = det.textContent.toLowerCase();
        const coincide = !q || texto.includes(q);
        det.hidden = !coincide;
        if (coincide) visibles++;
      });
      sinResultados.hidden = visibles !== 0;
    }

    input.addEventListener('input', filtrar);
    // Evita que el submit recargue/navegue; el filtro ya es en vivo.
    if (form) form.addEventListener('submit', (e) => { e.preventDefault(); filtrar(); });
  }

  // ----------------------------------------------------------
  // Contador de caracteres del mensaje de contacto.
  // ----------------------------------------------------------
  function iniciarContador(textarea) {
    const max = Number(textarea.getAttribute('maxlength')) || 1000;
    const contador = document.createElement('span');
    contador.className = 'contador-chars';
    textarea.parentElement.appendChild(contador);

    // Actualiza el texto y el color del contador segun el largo.
    function actualizar() {
      const largo = textarea.value.length;
      contador.textContent = `${largo} / ${max} caracteres`;
      contador.classList.toggle('cerca', largo > max * 0.85 && largo <= max);
      contador.classList.toggle('excedido', largo >= max);
    }
    textarea.addEventListener('input', actualizar);
    actualizar();
  }

  // ----------------------------------------------------------
  // Validacion del formulario de contacto.
  // ----------------------------------------------------------
  function iniciarContacto() {
    const form = document.querySelector('[name="form-contacto"]');
    if (!form) return;
    const nombre = document.getElementById('c-nombre');
    const email = document.getElementById('c-email');
    const tipo = document.getElementById('c-tipo');
    const asunto = document.getElementById('c-asunto');
    const mensaje = document.getElementById('c-mensaje');
    const terminos = form.querySelector('[name="terminos"]');

    if (mensaje) iniciarContador(mensaje);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = LA.validarLargo(nombre, 3, 80, 'El nombre');
      ok = LA.validarEmail(email) && ok;
      ok = (tipo.value ? LA.limpiarError(tipo) : LA.mostrarError(tipo, 'Elige un tipo de consulta.')) && ok;
      ok = LA.validarLargo(asunto, 5, 100, 'El asunto') && ok;
      ok = LA.validarLargo(mensaje, 20, 1000, 'El mensaje') && ok;
      ok = LA.validarCheck(terminos, 'Debes aceptar los terminos.') && ok;
      if (!ok) {
        avisar('Faltan datos en el formulario.', 'error');
        return;
      }
      avisar('Consulta enviada. Te responderemos pronto.', 'ok');
      window.location.hash = 'gracias-contacto'; // muestra el modal del HTML
      form.reset();
    });
  }

  iniciarFiltroFAQ();
  iniciarContacto();
})();
