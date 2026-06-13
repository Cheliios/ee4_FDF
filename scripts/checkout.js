// ============================================================
// checkout.js - Autor: Rodrigo Alonso Santos Nunez
// ============================================================

const VUELO_BASE = {
  subtotal:  380,
  impuestos:  55,
  puntosDisponibles: 2450,
  descuentoPorPunto: 25, 
};

const PRECIOS_EXTRAS = {
  equipaje: 80,
  asiento:  40,
  comida:   55,
  seguro:   45,
};

//  Autor: Rodrigo Alonso Santos Nunez - REFERENCIAS AL DOM

const formCheckout   = document.querySelector('[name="form-checkout"]');
const inputNumTarjeta = document.getElementById('t-numero');
const checkboxTerminos = document.querySelector('[name="acepto"]');
const checkboxPuntos   = document.querySelector('[name="usar_puntos"]');
const checkboxExtras   = document.querySelectorAll('[name="extras"]');
const radiosPago       = document.querySelectorAll('[name="pago"]');
const fieldsetTarjeta  = document.querySelector('fieldset:has(#t-numero)');
const btnPagar         = formCheckout ? formCheckout.querySelector('[type="submit"]') : null;

//  Autor: Rodrigo Alonso Santos Nunez - UTILIDADES DE VALIDACION

function mostrarError(campo, mensaje) {
  let span = campo.parentElement.querySelector('.error-msg');
  if (!span) {
    span = document.createElement('span');
    span.className = 'error-msg';
    span.setAttribute('aria-live', 'polite');
    span.setAttribute('role', 'alert');
    campo.parentElement.appendChild(span);
  }
  span.textContent = mensaje;
  campo.setAttribute('aria-invalid', 'true');
  campo.classList.add('campo-invalido');
}

function limpiarError(campo) {
  const span = campo.parentElement.querySelector('.error-msg');
  if (span) span.textContent = '';
  campo.removeAttribute('aria-invalid');
  campo.classList.remove('campo-invalido');
}

function validarVacio(campo, etiqueta) {
  if (!campo.value.trim()) {
    mostrarError(campo, `${etiqueta} es obligatorio.`);
    return false;
  }
  limpiarError(campo);
  return true;
}

function validarEmail(campo) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(campo.value.trim())) {
    mostrarError(campo, 'Ingresa un correo electronico valido.');
    return false;
  }
  limpiarError(campo);
  return true;
}

//  Autor: Rodrigo Alonso Santos Nunez - FORMATO DE NUMERO DE TARJETA 

function formatearNumeroTarjeta(input) {
  
  let soloDigitos = input.value.replace(/\D/g, '').slice(0, 16);

  const grupos = soloDigitos.match(/.{1,4}/g) || [];
  input.value = grupos.join(' ');

  detectarTipoTarjeta(soloDigitos);
}

function detectarTipoTarjeta(digitos) {
  const campo = document.getElementById('t-numero');
  if (!campo) return;

  let tipo = '';
  if (/^4/.test(digitos))             tipo = 'Visa';
  else if (/^5[1-5]/.test(digitos))   tipo = 'Mastercard';
  else if (/^3[47]/.test(digitos))    tipo = 'American Express';
  else if (/^62/.test(digitos))       tipo = 'UnionPay';

  let etiqueta = campo.parentElement.querySelector('.tipo-tarjeta');
  if (!etiqueta) {
    etiqueta = document.createElement('span');
    etiqueta.className = 'tipo-tarjeta';
    etiqueta.setAttribute('aria-live', 'polite');
    campo.insertAdjacentElement('afterend', etiqueta);
  }
  etiqueta.textContent = tipo ? `Tarjeta detectada: ${tipo}` : '';
}

if (inputNumTarjeta) {
  inputNumTarjeta.addEventListener('input', () => formatearNumeroTarjeta(inputNumTarjeta));
}

//  Autor: Rodrigo Alonso Santos Nunez - MOSTRAR / OCULTAR DATOS DE TARJETA SEGUN METODO DE PAGO

function actualizarVisibilidadTarjeta() {
  if (!fieldsetTarjeta) return;
  const metodoPago = document.querySelector('[name="pago"]:checked');
  const esTarjeta  = metodoPago && metodoPago.value === 'tarjeta';

  fieldsetTarjeta.hidden = !esTarjeta;

  fieldsetTarjeta.querySelectorAll('input').forEach(input => {
    input.required = esTarjeta;
  });
}

radiosPago.forEach(radio => {
  radio.addEventListener('change', actualizarVisibilidadTarjeta);
});

actualizarVisibilidadTarjeta(); 

//  Autor: Rodrigo Alonso Santos Nunez - RESUMEN / TOTAL DINAMICO

function actualizarResumen() {
  const main = document.getElementById('main-content');
  if (!main) return;

  let totalExtras = 0;
  checkboxExtras.forEach(cb => {
    if (cb.checked) totalExtras += (PRECIOS_EXTRAS[cb.value] || 0);
  });

  const usarPuntos   = checkboxPuntos && checkboxPuntos.checked;
  const descuento    = usarPuntos ? VUELO_BASE.descuentoPorPunto : 0;

  const total = VUELO_BASE.subtotal + VUELO_BASE.impuestos + totalExtras - descuento;

  actualizarDl('dl-extras',    `Extras`,            totalExtras > 0 ? `CNY ${totalExtras.toFixed(2)}` : '—');
  actualizarDl('dl-descuento', `Descuento puntos`,  descuento  > 0 ? `- CNY ${descuento.toFixed(2)}` : '—');
  actualizarDl('dl-total-din', `Total a pagar`,     `CNY ${total.toFixed(2)}`);

  if (btnPagar) {
    btnPagar.innerHTML = `<span aria-hidden="true">&#128179;</span> Confirmar y pagar CNY ${total.toFixed(2)}`;
  }
}

function actualizarDl(idDd, labelDt, valorDd) {
  const dl = document.querySelector('[aria-labelledby="resumen-title"] dl');
  if (!dl) return;

  let dd = document.getElementById(idDd);
  if (!dd) {
    const dt = document.createElement('dt');
    dt.textContent = labelDt;
    dd = document.createElement('dd');
    dd.id = idDd;
    dl.appendChild(dt);
    dl.appendChild(dd);
  }
  dd.textContent = valorDd;
  if (labelDt === 'Total a pagar') dd.innerHTML = `<strong>${valorDd}</strong>`;
}

checkboxExtras.forEach(cb => cb.addEventListener('change', actualizarResumen));
if (checkboxPuntos) checkboxPuntos.addEventListener('change', actualizarResumen);

actualizarResumen(); 

//  Autor: Rodrigo Alonso Santos Nunez - HABILITAR BOTON SOLO SI SE ACEPTAN TERMINOS

function actualizarEstadoBoton() {
  if (!btnPagar || !checkboxTerminos) return;
  const aceptado = checkboxTerminos.checked;
  btnPagar.disabled = !aceptado;
  btnPagar.setAttribute('aria-disabled', String(!aceptado));
}

if (checkboxTerminos) {
  checkboxTerminos.addEventListener('change', actualizarEstadoBoton);
}

actualizarEstadoBoton(); 

//  Autor: Rodrigo Alonso Santos Nunez - VALIDACION COMPLETA DEL FORMULARIO

if (formCheckout) {
  formCheckout.addEventListener('submit', e => {
    e.preventDefault();
    let valido = true;

    // Datos del pasajero
    const camposPasajero = [
      { id: 'p-nombre',   label: 'El nombre'    },
      { id: 'p-apellido', label: 'El apellido'  },
      { id: 'p-doc',      label: 'El documento' },
      { id: 'p-nac',      label: 'La fecha de nacimiento' },
    ];

    camposPasajero.forEach(({ id, label }) => {
      const el = document.getElementById(id);
      if (el && !validarVacio(el, label)) valido = false;
    });

    // Email del pasajero
    const emailPax = document.getElementById('p-email');
    if (emailPax && !validarEmail(emailPax)) valido = false;

    // Telefono
    const tel = document.getElementById('p-tel');
    if (tel && tel.value.trim()) {
      const reTel = /^[+0-9 ]{9,15}$/;
      if (!reTel.test(tel.value.trim())) {
        mostrarError(tel, 'Ingresa un telefono valido (9-15 digitos).');
        valido = false;
      } else {
        limpiarError(tel);
      }
    }

    // Datos de tarjeta 
    const metodoPago = document.querySelector('[name="pago"]:checked');
    if (metodoPago && metodoPago.value === 'tarjeta') {
      const soloDigitos = (inputNumTarjeta?.value || '').replace(/\D/g, '');
      if (soloDigitos.length < 13) {
        mostrarError(inputNumTarjeta, 'El numero de tarjeta debe tener al menos 13 digitos.');
        valido = false;
      } else {
        limpiarError(inputNumTarjeta);
      }

      const camposTarjeta = [
        { id: 't-titular', label: 'El titular' },
        { id: 't-venc',    label: 'El vencimiento' },
        { id: 't-cvv',     label: 'El CVV' },
      ];
      camposTarjeta.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        if (el && !validarVacio(el, label)) valido = false;
      });

      const campoVenc = document.getElementById('t-venc');
      if (campoVenc && campoVenc.value) {
        const [anio, mes] = campoVenc.value.split('-').map(Number);
        const hoy = new Date();
        if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
          mostrarError(campoVenc, 'La tarjeta esta vencida.');
          valido = false;
        }
      }
    }

    if (!checkboxTerminos || !checkboxTerminos.checked) {
      mostrarError(checkboxTerminos || formCheckout, 'Debes aceptar los terminos de compra.');
      valido = false;
    }

    if (!valido) return;

    guardarConfirmacionPago();

    window.location.hash = 'gracias-pago';
  });
}

//  Autor: Rodrigo Alonso Santos Nunez - GUARDAR CONFIRMACION EN LOCALSTORAGE

function guardarConfirmacionPago() {
  try {
    const metodoPago = document.querySelector('[name="pago"]:checked');
    const extras     = Array.from(checkboxExtras)
      .filter(cb => cb.checked)
      .map(cb => cb.value);

    const totalExtras = extras.reduce((acc, key) => acc + (PRECIOS_EXTRAS[key] || 0), 0);
    const descuento   = (checkboxPuntos && checkboxPuntos.checked) ? VUELO_BASE.descuentoPorPunto : 0;
    const total       = VUELO_BASE.subtotal + VUELO_BASE.impuestos + totalExtras - descuento;

    const confirmacion = {
      vuelo:   'LA8201',
      ruta:    'KMG - DLU',
      total:   `CNY ${total.toFixed(2)}`,
      metodo:  metodoPago ? metodoPago.value : 'desconocido',
      extras,
      fecha:   new Date().toISOString(),
    };

    localStorage.setItem('la_ultima_compra', JSON.stringify(confirmacion));
  } catch {
    console.warn('checkout.js: no se pudo guardar la confirmacion en localStorage.');
  }
}
