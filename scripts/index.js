// ============================================================
// index.js - Autor: Felipe Reyes Ingunza
// Buscador del home: contador de pasajeros, control de fecha de
// vuelta segun el tipo de viaje y validacion antes de enviar.
// ============================================================

(function () {
  'use strict';

  const LA = window.LA || {};
  const form = document.querySelector('[name="buscador-vuelos"]');
  if (!form) return;

  const tipoViaje = document.getElementById('tipo-viaje');
  const origen = document.getElementById('origen');
  const destino = document.getElementById('destino');
  const fechaIda = document.getElementById('fecha-ida');
  const fechaVuelta = document.getElementById('fecha-vuelta');
  const pasajeros = document.getElementById('pasajeros');

  // Devuelve la fecha de hoy en formato YYYY-MM-DD para los inputs date.
  function hoyISO() {
    return new Date().toISOString().split('T')[0];
  }

  // No deja elegir fechas pasadas en la ida.
  if (fechaIda) fechaIda.min = hoyISO();

  // ----------------------------------------------------------
  // Contador de pasajeros con botones - y +.
  // ----------------------------------------------------------
  function iniciarContadorPasajeros() {
    if (!pasajeros) return;
    const min = Number(pasajeros.min) || 1;
    const max = Number(pasajeros.max) || 9;

    const grupo = document.createElement('span');
    grupo.className = 'contador-pasajeros';

    const menos = document.createElement('button');
    menos.type = 'button';
    menos.textContent = '-';
    menos.setAttribute('aria-label', 'Quitar un pasajero');

    const mas = document.createElement('button');
    mas.type = 'button';
    mas.textContent = '+';
    mas.setAttribute('aria-label', 'Agregar un pasajero');

    // Coloca los botones a los lados del input numerico.
    pasajeros.parentElement.insertBefore(grupo, pasajeros);
    grupo.appendChild(menos);
    grupo.appendChild(pasajeros);
    grupo.appendChild(mas);

    // Suma o resta respetando el minimo y el maximo.
    function ajustar(delta) {
      const actual = Number(pasajeros.value) || min;
      const nuevo = Math.min(max, Math.max(min, actual + delta));
      pasajeros.value = nuevo;
    }
    menos.addEventListener('click', () => ajustar(-1));
    mas.addEventListener('click', () => ajustar(1));
  }

  // ----------------------------------------------------------
  // Activa o desactiva la fecha de vuelta segun el tipo de viaje.
  // ----------------------------------------------------------
  function sincronizarFechaVuelta() {
    if (!tipoViaje || !fechaVuelta) return;
    const esIdaVuelta = tipoViaje.value === 'ida-vuelta';
    fechaVuelta.disabled = !esIdaVuelta;
    fechaVuelta.required = esIdaVuelta;
    if (!esIdaVuelta) {
      fechaVuelta.value = '';
      if (LA.limpiarError) LA.limpiarError(fechaVuelta);
    }
  }

  // La fecha de vuelta nunca puede ser anterior a la de ida.
  function sincronizarMinVuelta() {
    if (fechaIda && fechaVuelta) fechaVuelta.min = fechaIda.value || hoyISO();
  }

  // ----------------------------------------------------------
  // Validacion al enviar el buscador.
  // ----------------------------------------------------------
  function validar() {
    let ok = true;

    if (!origen.value) ok = LA.mostrarError(origen, 'Elige una ciudad de origen.') && ok;
    else LA.limpiarError(origen);

    if (!destino.value) ok = LA.mostrarError(destino, 'Elige una ciudad de destino.') && ok;
    else LA.limpiarError(destino);

    // Origen y destino no pueden ser iguales.
    if (origen.value && destino.value && origen.value === destino.value) {
      LA.mostrarError(destino, 'El destino debe ser distinto del origen.');
      ok = false;
    }

    if (!fechaIda.value) {
      LA.mostrarError(fechaIda, 'Elige la fecha de ida.');
      ok = false;
    } else {
      LA.limpiarError(fechaIda);
    }

    // Si es ida y vuelta, la vuelta debe ser igual o posterior a la ida.
    if (tipoViaje.value === 'ida-vuelta') {
      if (!fechaVuelta.value) {
        LA.mostrarError(fechaVuelta, 'Elige la fecha de vuelta.');
        ok = false;
      } else if (fechaVuelta.value < fechaIda.value) {
        LA.mostrarError(fechaVuelta, 'La vuelta no puede ser antes de la ida.');
        ok = false;
      } else {
        LA.limpiarError(fechaVuelta);
      }
    }

    return ok;
  }

  // ----------------------------------------------------------
  // Conexion de eventos.
  // ----------------------------------------------------------
  iniciarContadorPasajeros();
  sincronizarFechaVuelta();
  sincronizarMinVuelta();

  if (tipoViaje) tipoViaje.addEventListener('change', sincronizarFechaVuelta);
  if (fechaIda) fechaIda.addEventListener('change', sincronizarMinVuelta);

  form.addEventListener('submit', (e) => {
    // Si algo falla, frena el envio y muestra los errores propios.
    if (!validar()) e.preventDefault();
  });
})();
