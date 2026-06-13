// ============================================================
// login.js - Autor: Rodrigo Alonso Santos Nunez
// Flujo de cuentas con localStorage (registrar y luego iniciar
// sesion con esa cuenta) integrado con cuentas.js - Felipe Reyes Ingunza
// ============================================================

const SESION_KEY = 'la_sesion';

const formLogin     = document.querySelector('[name="form-login"]');
const formRegistro  = document.querySelector('[name="form-registro"]');
const formRecuperar = document.querySelector('[name="form-recuperar"]');

// Autor: Rodrigo Alonso Santos Nunez - UTILIDADES DE VALIDACION

function mostrarError(campo, mensaje) {
  let contenedor = campo.parentElement.querySelector('.error-msg');
  if (!contenedor) {
    contenedor = document.createElement('span');
    contenedor.className = 'error-msg';
    contenedor.setAttribute('aria-live', 'polite');
    contenedor.setAttribute('role', 'alert');
    campo.parentElement.appendChild(contenedor);
  }
  contenedor.textContent = mensaje;
  campo.setAttribute('aria-invalid', 'true');
  campo.classList.add('campo-invalido');
}

function limpiarError(campo) {
  const contenedor = campo.parentElement.querySelector('.error-msg');
  if (contenedor) contenedor.textContent = '';
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

// Autor: Rodrigo Alonso Santos Nunez - VER / OCULTAR CONTRASENA (ojito)

function agregarOjito(campoPass) {
  
  if (campoPass.parentElement.querySelector('.btn-ojo')) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn-ojo';
  btn.setAttribute('aria-label', 'Mostrar contrasena');
  btn.innerHTML = '&#128065;'; // emoji ojo

  btn.addEventListener('click', () => {
    const estaOculta = campoPass.type === 'password';
    campoPass.type = estaOculta ? 'text' : 'password';
    btn.setAttribute('aria-label', estaOculta ? 'Ocultar contrasena' : 'Mostrar contrasena');
    btn.innerHTML = estaOculta ? '&#128064;' : '&#128065;';
  });


  campoPass.insertAdjacentElement('afterend', btn);
}

document.querySelectorAll('input[type="password"]').forEach(agregarOjito);

// Autor: Rodrigo Alonso Santos Nunez - MEDIDOR DE FORTALEZA DE CONTRASENA

function iniciarMedidorFortaleza(campoPass) {
  const wrapper = campoPass.closest('p') || campoPass.parentElement;

  if (wrapper.querySelector('.medidor-wrapper')) return;

  const medidorWrapper = document.createElement('div');
  medidorWrapper.className = 'medidor-wrapper';
  medidorWrapper.setAttribute('aria-live', 'polite');

  const barra   = document.createElement('div');
  barra.className = 'medidor-barra';

  const etiqueta = document.createElement('span');
  etiqueta.className = 'medidor-etiqueta';

  medidorWrapper.appendChild(barra);
  medidorWrapper.appendChild(etiqueta);
  wrapper.appendChild(medidorWrapper);

  campoPass.addEventListener('input', () => {
    const nivel = calcularFortaleza(campoPass.value);
    const niveles = ['', 'Muy debil', 'Debil', 'Aceptable', 'Fuerte', 'Muy fuerte'];
    const colores = ['', '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60'];

    barra.style.width   = `${(nivel / 5) * 100}%`;
    barra.style.background = colores[nivel];
    etiqueta.textContent   = nivel > 0 ? `Fortaleza: ${niveles[nivel]}` : '';
  });
}

function calcularFortaleza(pass) {
  if (!pass) return 0;
  let puntos = 0;
  if (pass.length >= 8)  puntos++;
  if (pass.length >= 12) puntos++;
  if (/[A-Z]/.test(pass)) puntos++;
  if (/[0-9]/.test(pass)) puntos++;
  if (/[^A-Za-z0-9]/.test(pass)) puntos++;
  return puntos;
}

const campoRegPass = document.getElementById('reg-pass');
if (campoRegPass) iniciarMedidorFortaleza(campoRegPass);

// Autor: Rodrigo Alonso Santos Nunez - ALTERNANCIA DE PESTANAS: Login / Registro / Recuperar

function iniciarTabs() {
    
  const secciones = {
    login:     document.querySelector('[aria-labelledby="login-title"]'),
    registro:  document.querySelector('[aria-labelledby="registro-title"]'),
    recuperar: document.getElementById('recuperar'),
  };

  // Crear barra de tabs si no existe en el HTML
  const main = document.getElementById('main-content');
  if (!main || !secciones.login) return;

  const barraNav = document.createElement('nav');
  barraNav.setAttribute('aria-label', 'Opciones de acceso');
  barraNav.className = 'tabs-nav';

  const definicionTabs = [
    { id: 'login',     label: 'Iniciar sesion' },
    { id: 'registro',  label: 'Crear cuenta'   },
    { id: 'recuperar', label: 'Recuperar contrasena' },
  ];

  const botones = definicionTabs.map(({ id, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.dataset.tab = id;
    btn.textContent = label;
    btn.className = 'tab-btn';
    barraNav.appendChild(btn);
    return btn;
  });

  main.insertBefore(barraNav, secciones.login);

  function activarTab(idActivo) {
    Object.entries(secciones).forEach(([id, seccion]) => {
      if (!seccion) return;
      const activa = id === idActivo;
      seccion.hidden = !activa;
      seccion.setAttribute('aria-hidden', String(!activa));
    });
    botones.forEach(btn => {
      const activa = btn.dataset.tab === idActivo;
      btn.setAttribute('aria-selected', String(activa));
      btn.classList.toggle('tab-activa', activa);
    });
  }

  botones.forEach(btn => {
    btn.addEventListener('click', () => activarTab(btn.dataset.tab));
  });

  activarTab('login');

  const enlaceRecuperar = document.querySelector('a[href="#recuperar"]');
  if (enlaceRecuperar) {
    enlaceRecuperar.addEventListener('click', e => {
      e.preventDefault();
      activarTab('recuperar');
    });
  }
}

iniciarTabs();

// Autor: Rodrigo Alonso Santos Nunez -VALIDACION Y ENVIO: FORM LOGIN

if (formLogin) {
  formLogin.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('l-email');
    const pass  = document.getElementById('l-pass');

    const emailOk = validarEmail(email);
    const passOk  = validarVacio(pass, 'La contrasena');

    if (!emailOk || !passOk) return;

    // Verifica las credenciales contra las cuentas guardadas (cuentas.js - Felipe).
    const r = window.LA && window.LA.cuentas
      ? window.LA.cuentas.login(email.value, pass.value)
      : { ok: true, usuario: { email: email.value.trim(), nombre: email.value.split('@')[0] } };

    if (!r.ok) {
      mostrarError(pass, r.error);
      if (window.LA && window.LA.notificar) window.LA.notificar(r.error, 'error');
      return;
    }

    guardarSesion(r.usuario);
    if (window.LA && window.LA.notificar) window.LA.notificar('Sesion iniciada. Hola, ' + r.usuario.nombre + '.', 'ok');
    redirigirTrasAcceso('gracias-login');
  });
}

// Autor: Rodrigo Alonso Santos Nunez -VALIDACION Y ENVIO: FORM REGISTRO

if (formRegistro) {
  formRegistro.addEventListener('submit', e => {
    e.preventDefault();

    const campos = {
      nombre:   { el: document.getElementById('reg-nombre'),   label: 'El nombre' },
      apellido: { el: document.getElementById('reg-apellido'), label: 'El apellido' },
      email:    { el: document.getElementById('reg-email'),    label: 'El correo' },
      doc:      { el: document.getElementById('reg-doc'),      label: 'El documento' },
      fecha:    { el: document.getElementById('reg-fecha'),    label: 'La fecha de nacimiento' },
      pais:     { el: document.getElementById('reg-pais'),     label: 'El pais' },
      pass:     { el: document.getElementById('reg-pass'),     label: 'La contrasena' },
      pass2:    { el: document.getElementById('reg-pass2'),    label: 'La confirmacion' },
    };

    let valido = true;

    Object.values(campos).forEach(({ el, label }) => {
      if (!validarVacio(el, label)) valido = false;
    });

    if (!validarEmail(campos.email.el)) valido = false;

    if (campos.pass.el.value && !/\d/.test(campos.pass.el.value)) {
      mostrarError(campos.pass.el, 'La contrasena debe incluir al menos un numero.');
      valido = false;
    }

    if (
      campos.pass.el.value &&
      campos.pass2.el.value &&
      campos.pass.el.value !== campos.pass2.el.value
    ) {
      mostrarError(campos.pass2.el, 'Las contrasenas no coinciden.');
      valido = false;
    }

    if (campos.fecha.el.value) {
      const fechaNac = new Date(campos.fecha.el.value);
      const hoy      = new Date();
      const edad     = hoy.getFullYear() - fechaNac.getFullYear();
      if (edad < 18) {
        mostrarError(campos.fecha.el, 'Debes tener al menos 18 anos para registrarte.');
        valido = false;
      }
    }

    if (!valido) return;

    // Registra la cuenta de forma persistente y rechaza correos duplicados (cuentas.js - Felipe).
    if (window.LA && window.LA.cuentas) {
      const reg = window.LA.cuentas.registrar({
        nombre:   campos.nombre.el.value.trim(),
        apellido: campos.apellido.el.value.trim(),
        email:    campos.email.el.value.trim(),
        pass:     campos.pass.el.value,
        pais:     campos.pais.el.value,
        doc:      campos.doc.el.value.trim(),
        fecha:    campos.fecha.el.value,
      });
      if (!reg.ok) {
        mostrarError(campos.email.el, reg.error);
        if (window.LA.notificar) window.LA.notificar(reg.error, 'error');
        return;
      }
      if (window.LA.notificar) window.LA.notificar('Cuenta creada. Ya puedes iniciar sesion con ella.', 'ok');
    }

    const usuario = {
      nombre:  campos.nombre.el.value.trim(),
      email:   campos.email.el.value.trim(),
    };
    guardarSesion(usuario);
    redirigirTrasAcceso('gracias-registro');
  });
}

//  Autor: Rodrigo Alonso Santos Nunez - VALIDACION Y ENVIO: FORM RECUPERAR

if (formRecuperar) {
  formRecuperar.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('rec-email');
    if (!validarEmail(email)) return;

    // Avisa de forma neutra si el correo no esta registrado (cuentas.js - Felipe).
    if (window.LA && window.LA.cuentas && !window.LA.cuentas.existeEmail(email.value) && window.LA.notificar) {
      window.LA.notificar('Si ese correo tiene una cuenta, te llegara el enlace de recuperacion.', 'info');
    }
    window.location.hash = 'gracias-recuperar';
  });
}

//  Autor: Rodrigo Alonso Santos Nunez - GESTION DE SESION 

function guardarSesion(usuario) {
  // Delega en el modulo de cuentas (Felipe) si esta disponible.
  if (window.LA && window.LA.cuentas) {
    window.LA.cuentas.guardarSesion(usuario);
    return;
  }
  try {
    localStorage.setItem(SESION_KEY, JSON.stringify(usuario));
  } catch {
    console.warn('login.js: no se pudo guardar la sesion en localStorage.');
  }
}

//  Autor: Felipe Reyes Ingunza - REDIRECCION DE RETORNO TRAS EL ACCESO

// Calcula a donde volver: la pagina previa guardada, el referrer o el home.
function destinoRetorno() {
  let destino = '';
  try { destino = localStorage.getItem('la_retorno') || ''; } catch { destino = ''; }
  if (!destino || /login\.html/i.test(destino)) {
    if (document.referrer && !/login\.html/i.test(document.referrer)) {
      try { if (new URL(document.referrer).origin === location.origin) destino = document.referrer; } catch { /* referrer invalido */ }
    }
  }
  if (!destino || /login\.html/i.test(destino)) destino = '../index.html'; // home por defecto
  try { localStorage.removeItem('la_retorno'); } catch { /* sin storage */ }
  return destino;
}

// Muestra el modal de confirmacion y apunta su boton al destino de retorno.
function redirigirTrasAcceso(idModal) {
  const destino = destinoRetorno();
  const modal = document.getElementById(idModal);
  if (modal) {
    const cta = modal.querySelector('.modal-actions a');
    if (cta) {
      cta.setAttribute('href', destino);
      cta.textContent = 'Continuar';
    }
  }
  window.location.hash = idModal;
}
