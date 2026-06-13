// ============================================================
// main.js - Autor: Felipe Reyes Ingunza
// Funcionalidades globales (G1-G5) presentes en las 16 paginas:
//   G1 Menu hamburguesa con JS (toggle, Esc, click fuera)
//   G2 Link de navegacion activo (aria-current)
//   G3 Ano dinamico en el footer
//   G4 Estado de sesion simulado con localStorage
//   G5 Boton "volver arriba"
// Va envuelto en una funcion anonima (IIFE) para no contaminar
// el espacio global ni chocar con los scripts de otros companeros.
// ============================================================

(function () {
  'use strict';

  const SESION_KEY = 'la_sesion'; // misma clave que usa login.js (Rodrigo)
  const LA = (window.LA = window.LA || {}); // espacio de nombres compartido

  // ----------------------------------------------------------
  // Inyecta los estilos de los componentes creados por JS.
  // Se hace desde JS para no tocar el main.css compartido y que
  // las mejoras viajen solas con el script en las 16 paginas.
  // ----------------------------------------------------------
  function inyectarEstilos() {
    if (document.getElementById('la-js-styles')) return;
    const css = `
      .error-msg{display:block;color:var(--red,#C8102E);font-size:.85rem;font-weight:700;margin-top:4px}
      .campo-invalido{border:2px solid var(--red,#C8102E) !important}
      .sesion-saludo{color:var(--white,#fff);font-weight:700;margin-right:8px;display:inline-block}
      .btn-volver-arriba{position:fixed;right:18px;bottom:18px;width:46px;height:46px;border-radius:50%;
        border:none;background:var(--red,#C8102E);color:#fff;font-size:22px;line-height:1;cursor:pointer;
        box-shadow:0 4px 14px rgba(0,0,0,.25);opacity:0;transform:translateY(12px);visibility:hidden;
        transition:opacity .25s ease,transform .25s ease,visibility .25s;z-index:40}
      .btn-volver-arriba.visible{opacity:1;transform:translateY(0);visibility:visible}
      .btn-volver-arriba:hover{background:var(--red-dark,#9c0c24)}
      .la-aviso{margin-top:10px;padding:10px 12px;border-radius:var(--radius,6px);font-weight:700}
      .la-aviso--ok{background:#e7f6ec;color:#1b7a3d;border:1px solid #b6e2c4}
      .la-aviso--error{background:#fdecee;color:#9c0c24;border:1px solid #f3c0c7}
      .la-aviso--info{background:#eef4fc;color:#0a4ea0;border:1px solid #c4dbf5}
      .contador-chars{display:block;font-size:.8rem;color:var(--muted,#555);margin-top:4px}
      .contador-chars.cerca{color:#b5651d}
      .contador-chars.excedido{color:var(--red,#C8102E);font-weight:700}
      .faq-sin-resultados{font-weight:700;color:var(--muted,#555);margin-top:10px}
      .contador-pasajeros{display:inline-flex;align-items:center;gap:10px}
      .contador-pasajeros button{width:36px;height:36px;border-radius:var(--radius,6px);
        border:1px solid var(--border,#dcdcdc);background:var(--bg-alt,#f6f6f6);font-size:18px;
        font-weight:700;cursor:pointer;line-height:1}
      .contador-pasajeros button:hover{border-color:var(--gold,#D4A017)}
      .estrellas-pick{display:inline-flex;gap:4px;font-size:26px;cursor:pointer}
      .la-toasts{position:fixed;right:18px;bottom:78px;display:flex;flex-direction:column;gap:10px;
        z-index:60;max-width:min(92vw,340px)}
      .la-toast{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;border-radius:var(--radius,6px);
        background:var(--dark,#1A1A1A);color:#fff;box-shadow:0 8px 24px rgba(0,0,0,.28);font-weight:700;
        opacity:0;transform:translateY(12px) scale(.98);transition:opacity .22s ease-out,transform .22s ease-out}
      .la-toast.visible{opacity:1;transform:translateY(0) scale(1)}
      .la-toast--ok{background:#1b7a3d}
      .la-toast--error{background:#b3122c}
      .la-toast--info{background:#0a4ea0}
      .la-toast__icono{font-size:18px;line-height:1.3}
      @media (prefers-reduced-motion: reduce){
        .btn-volver-arriba{transition:none}
        .la-toast{transition:none}
      }
    `;
    const style = document.createElement('style');
    style.id = 'la-js-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ----------------------------------------------------------
  // G1 - Menu hamburguesa con JS (mejora el truco del checkbox).
  // ----------------------------------------------------------
  function iniciarMenu() {
    const toggle = document.getElementById('nav-toggle');
    const boton = document.querySelector('.nav-toggle-btn');
    const nav = document.querySelector('header nav');
    if (!toggle || !boton || !nav) return;

    // Etiqueta el boton para lectores de pantalla.
    if (!nav.id) nav.id = 'nav-principal';
    boton.setAttribute('role', 'button');
    boton.setAttribute('tabindex', '0');
    boton.setAttribute('aria-controls', nav.id);
    boton.setAttribute('aria-expanded', 'false');

    // Sincroniza aria-expanded cuando cambia el estado del menu.
    function sincronizar() {
      boton.setAttribute('aria-expanded', String(toggle.checked));
      document.body.classList.toggle('menu-abierto', toggle.checked);
    }
    // Cierra el menu (deja el checkbox sin marcar).
    function cerrar() {
      if (!toggle.checked) return;
      toggle.checked = false;
      sincronizar();
    }

    toggle.addEventListener('change', sincronizar);

    // Permite abrir/cerrar con Enter o Espacio desde el boton.
    boton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle.checked = !toggle.checked;
        sincronizar();
      }
    });

    // Cierra con la tecla Escape.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') cerrar();
    });

    // Cierra al hacer click fuera del header.
    document.addEventListener('click', (e) => {
      if (toggle.checked && !e.target.closest('header')) cerrar();
    });

    // Cierra al elegir un enlace del menu (comodo en movil).
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', cerrar));
  }

  // ----------------------------------------------------------
  // G2 - Marca el enlace de navegacion de la pagina actual.
  // ----------------------------------------------------------
  function marcarNavActiva() {
    const actual = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('header nav a').forEach((a) => {
      const destino = (a.getAttribute('href') || '').split('/').pop();
      if (destino && destino === actual) {
        a.setAttribute('aria-current', 'page');
      }
    });
  }

  // ----------------------------------------------------------
  // G3 - Muestra el ano actual en el footer.
  // ----------------------------------------------------------
  function ponerAno() {
    const ano = new Date().getFullYear();
    const span = document.getElementById('ano');
    if (span) {
      span.textContent = ano;
      return;
    }
    // Plan B: actualiza el ano dentro del texto de copyright.
    const small = document.querySelector('footer small');
    if (small) small.innerHTML = small.innerHTML.replace(/\b20\d{2}\b/, String(ano));
  }

  // ----------------------------------------------------------
  // G4 - Estado de sesion simulado guardado en localStorage.
  // ----------------------------------------------------------
  // Lee la sesion guardada (o null si no hay o esta corrupta).
  function leerSesion() {
    try {
      return JSON.parse(localStorage.getItem(SESION_KEY));
    } catch {
      return null;
    }
  }
  // Cierra la sesion y recarga para refrescar el header.
  function cerrarSesion() {
    localStorage.removeItem(SESION_KEY);
    location.reload();
  }
  // Pinta "Hola, X" + boton "Salir" si hay sesion; si no, recuerda
  // la pagina actual para volver a ella despues de iniciar sesion.
  function pintarSesion() {
    const sesion = leerSesion();
    const loginLink = document.querySelector('header a[href$="login.html"]');
    if (!loginLink) return;

    if (sesion && sesion.nombre) {
      const saludo = document.createElement('span');
      saludo.className = 'sesion-saludo';
      saludo.textContent = `Hola, ${sesion.nombre}`;
      loginLink.parentElement.insertBefore(saludo, loginLink);

      loginLink.textContent = 'Salir';
      loginLink.setAttribute('href', '#');
      loginLink.classList.add('sesion-salir');
      loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        cerrarSesion();
      });
    } else {
      // Guarda de donde viene el usuario para regresarlo tras loguearse.
      loginLink.addEventListener('click', () => {
        try { localStorage.setItem('la_retorno', location.href.split('#')[0]); } catch { /* sin storage */ }
      });
    }
  }

  // ----------------------------------------------------------
  // G5 - Boton "volver arriba" que aparece al hacer scroll.
  // ----------------------------------------------------------
  function iniciarVolverArriba() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-volver-arriba';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '&#8679;';
    document.body.appendChild(btn);

    // Respeta la preferencia de movimiento reducido del usuario.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Muestra u oculta el boton segun la posicion del scroll.
    function alScroll() {
      btn.classList.toggle('visible', window.scrollY > 300);
    }
    window.addEventListener('scroll', alScroll, { passive: true });
    alScroll();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // ----------------------------------------------------------
  // Notificaciones (toasts): comunicacion app -> usuario.
  // Se publica en LA.notificar para que lo usen todas las paginas.
  // ----------------------------------------------------------
  let contenedorToasts = null;
  // Muestra un mensaje flotante, accesible y auto-descartable.
  function notificar(mensaje, tipo = 'info', ms = 3500) {
    if (!contenedorToasts) {
      contenedorToasts = document.createElement('div');
      contenedorToasts.className = 'la-toasts';
      document.body.appendChild(contenedorToasts);
    }
    const iconos = { ok: '✔', error: '⚠', info: 'ℹ' };
    const toast = document.createElement('div');
    toast.className = `la-toast la-toast--${tipo}`;
    toast.setAttribute('role', tipo === 'error' ? 'alert' : 'status');
    toast.setAttribute('aria-live', tipo === 'error' ? 'assertive' : 'polite');
    toast.innerHTML = `<span class="la-toast__icono" aria-hidden="true">${iconos[tipo] || iconos.info}</span><span>${mensaje}</span>`;
    contenedorToasts.appendChild(toast);
    // Doble rAF para asegurar la transicion de entrada.
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('visible')));
    // Salida y limpieza.
    const cerrar = () => {
      toast.classList.remove('visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
      setTimeout(() => toast.remove(), 400); // respaldo si no hay transicion
    };
    setTimeout(cerrar, ms);
    toast.addEventListener('click', cerrar);
  }
  LA.notificar = notificar;

  // ----------------------------------------------------------
  // Accesibilidad de los modales :target del sitio:
  // mueve el foco al abrir y cierra con la tecla Escape.
  // ----------------------------------------------------------
  function iniciarModales() {
    const modales = document.querySelectorAll('.modal[id]');
    if (!modales.length) return;

    // Al cambiar el hash, enfoca el modal abierto.
    function alCambiarHash() {
      const id = location.hash.replace('#', '');
      const modal = id && document.getElementById(id);
      if (modal && modal.classList.contains('modal')) {
        const foco = modal.querySelector('.modal-card');
        if (foco) {
          foco.setAttribute('tabindex', '-1');
          foco.focus();
        }
      }
    }
    window.addEventListener('hashchange', alCambiarHash);
    alCambiarHash();

    // Escape cierra el modal abierto (apunta el hash a #close).
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && location.hash && document.querySelector('.modal:target')) {
        location.hash = 'close';
      }
    });
  }

  // ----------------------------------------------------------
  // Popup promocional: invita a crear cuenta para un descuento.
  // Solo en el home, una vez al dia y si no hay sesion activa.
  // ----------------------------------------------------------
  // Indica si estamos en la pagina de inicio.
  function enHome() {
    const seg = location.pathname.split('/').filter(Boolean).pop() || '';
    return seg === '' || seg === 'index.html' || seg === 'ee1_grupo2';
  }
  // Programa la aparicion del popup si corresponde.
  function iniciarPromo() {
    if (!enHome() || leerSesion()) return;
    let visto = '';
    try { visto = localStorage.getItem('la_promo_visto') || ''; } catch { visto = ''; }
    const hoy = new Date().toISOString().split('T')[0];
    if (visto === hoy) return; // ya se mostro hoy
    const logo = document.querySelector('header .logo img');
    setTimeout(() => mostrarPromo(logo ? logo.src : '', hoy), 1400);
  }
  // Construye y muestra el popup de marca con su animacion.
  function mostrarPromo(logoSrc, hoy) {
    const overlay = document.createElement('div');
    overlay.className = 'la-promo-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Crea tu cuenta y ahorra');
    overlay.innerHTML = `
      <div class="la-promo">
        <div class="la-promo__top">
          <button class="la-promo__close" type="button" aria-label="Cerrar">&times;</button>
          ${logoSrc ? `<img src="${logoSrc}" alt="Lucky Air">` : ''}
          <span class="la-promo__badge">-15% EXTRA</span>
          <h3>Vuela mas barato</h3>
        </div>
        <div class="la-promo__body">
          <h3>Crea tu cuenta y gana un descuento adicional</h3>
          <p>Registrate gratis en Lucky Air y obten <strong>15% extra</strong> en tu primer vuelo, ademas de Lucky Points de bienvenida.</p>
          <a class="la-promo__cta" href="pages/login.html#registro">Crear cuenta y ahorrar</a>
          <button class="la-promo__no" type="button">Ahora no, gracias</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('visible')));
    // Recuerda que ya se mostro hoy para no repetir.
    const marcar = () => { try { localStorage.setItem('la_promo_visto', hoy); } catch { /* sin storage */ } };
    const cerrar = () => { marcar(); overlay.classList.remove('visible'); setTimeout(() => overlay.remove(), 300); };
    overlay.querySelector('.la-promo__close').addEventListener('click', cerrar);
    overlay.querySelector('.la-promo__no').addEventListener('click', cerrar);
    overlay.querySelector('.la-promo__cta').addEventListener('click', marcar);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) cerrar(); });
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape') { cerrar(); document.removeEventListener('keydown', esc); }
    });
  }

  // ----------------------------------------------------------
  // Arranque de todas las funciones globales.
  // ----------------------------------------------------------
  inyectarEstilos();
  iniciarMenu();
  marcarNavActiva();
  ponerAno();
  pintarSesion();
  iniciarVolverArriba();
  iniciarModales();
  iniciarPromo();
})();
