// ============================================================
// login.js - Autor: Rodrigo Alonso Santos Nunez
// Flujo de cuentas con localStorage (registrar y luego iniciar
// sesion con esa cuenta) integrado con cuentas.js - Felipe Reyes Ingunza
// ============================================================

const SESION_KEY = 'la_sesion';

const formLogin     = document.querySelector('[name="form-login"]');
const formRegistro  = document.querySelector('[name="form-registro"]');
const formRecuperar = document.querySelector('[name="form-recuperar"]');



//Registro API//
document.getElementById('form-registro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-pass').value;
  const nombre = document.getElementById('reg-nombre').value;
  const apellido = document.getElementById('reg-apellido').value;
  const dni = document.getElementById('reg-doc').value;
  const fecha_nacimiento = document.getElementById('reg-fecha').value;
  const pais = document.getElementById('reg-pais').value;

  const resultado = await registrar(email, password, nombre, apellido, dni, fecha_nacimiento, pais);

});
//-------------//

// Login API//
document.getElementById('form-login').addEventListener('submit', async (e)  => {
  e.preventDefault();
  const email = document.getElementById('l-email').value;
  const password = document.getElementById('l-pass').value;

  const resultado = await iniciarSesion(email, password);

  if (resultado.ok) {
    redirigirTrasAcceso('gracias-login');// ajusta la ruta según dónde esté login.html
  } else {
    LA.notificar('Credenciales incorrectas', 'error');
  }
});

//-------------//


//Utilidades de Validacion//

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

  // Si se llega con #registro (ej. desde el popup promocional), abre Crear cuenta.
  if (location.hash === '#registro') activarTab('registro');

  const enlaceRecuperar = document.querySelector('a[href="#recuperar"]');
  if (enlaceRecuperar) {
    enlaceRecuperar.addEventListener('click', e => {
      e.preventDefault();
      activarTab('recuperar');
    });
  }
}

iniciarTabs();



function destinoRetorno() {
  let destino = '';
  try { destino = localStorage.getItem('la_retorno') || ''; } catch { destino = ''; }
  if (!destino || /login\.html/i.test(destino)) {
    if (document.referrer && !/login\.html/i.test(document.referrer)) {
      try { if (new URL(document.referrer).origin === location.origin) destino = document.referrer; } catch { /* referrer invalido */ }
    }
  }
  if (!destino || /login\.html/i.test(destino)) destino = 'mi-cuenta.html'; // destino por defecto
  try { localStorage.removeItem('la_retorno'); } catch { /* sin storage */ }
  return destino;
}

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