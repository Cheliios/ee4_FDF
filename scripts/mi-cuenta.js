// ============================================================
// mi-cuenta.js - Autor: Felipe Reyes Ingunza
// Perfil y preferencias del usuario con persistencia real en
// localStorage: se guardan al enviar y se cargan al abrir.
// ============================================================

(function () {
  'use strict';

  const LA = window.LA || {};
  const PERFIL_KEY = 'la_perfil';
  const PREF_KEY = 'la_preferencias';

  const formPerfil = document.querySelector('[name="form-perfil"]');
  const formPref = document.querySelector('[name="form-preferencias"]');

  // Avisa por toast usando el helper global (si esta disponible).
  function avisar(msg, tipo) {
    if (LA.notificar) LA.notificar(msg, tipo);
  }

  // ----------------------------------------------------------
  // PERFIL: validacion, guardado y carga desde localStorage.
  // ----------------------------------------------------------
  function iniciarPerfil() {
    if (!formPerfil) return;
    const nombre = document.getElementById('p-nombre');
    const apellido = document.getElementById('p-apellido');
    const email = document.getElementById('p-email');
    const tel = document.getElementById('p-tel');
    const doc = document.getElementById('p-doc');
    const fecha = document.getElementById('p-fecha');

    // Carga el perfil guardado; si no hay, usa los datos de la sesion.
    function cargar() {
      let perfil = null;
      try { perfil = JSON.parse(localStorage.getItem(PERFIL_KEY)); } catch { perfil = null; }
      if (!perfil) {
        try {
          const sesion = JSON.parse(localStorage.getItem('la_sesion'));
          if (sesion) perfil = { nombre: sesion.nombre, email: sesion.email };
        } catch { /* sin sesion */ }
      }
      if (!perfil) return;
      if (perfil.nombre) nombre.value = perfil.nombre;
      if (perfil.apellido) apellido.value = perfil.apellido;
      if (perfil.email) email.value = perfil.email;
      if (perfil.tel) tel.value = perfil.tel;
      if (perfil.doc) doc.value = perfil.doc;
      if (perfil.fecha) fecha.value = perfil.fecha;
    }

    // Valida los campos obligatorios del perfil.
    function validar() {
      let ok = LA.validarVacio(nombre, 'El nombre');
      ok = LA.validarVacio(apellido, 'El apellido') && ok;
      ok = LA.validarEmail(email) && ok;
      ok = LA.validarVacio(doc, 'El documento') && ok;
      // El telefono es opcional, pero si se escribe debe ser valido.
      if (tel.value.trim()) {
        ok = LA.validarPatron(tel, /^[+0-9 ]{9,15}$/, 'Telefono invalido (9 a 15 digitos).') && ok;
      } else {
        LA.limpiarError(tel);
      }
      return ok;
    }

    formPerfil.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validar()) {
        avisar('Revisa los campos marcados en rojo.', 'error');
        return;
      }
      const perfil = {
        nombre: nombre.value.trim(), apellido: apellido.value.trim(),
        email: email.value.trim(), tel: tel.value.trim(),
        doc: doc.value.trim(), fecha: fecha.value,
      };
      try { localStorage.setItem(PERFIL_KEY, JSON.stringify(perfil)); } catch { /* sin storage */ }
      avisar('Perfil guardado correctamente.', 'ok');
      window.location.hash = 'gracias-perfil'; // muestra el modal del HTML
    });

    cargar();
  }

  // ----------------------------------------------------------
  // PREFERENCIAS: guardado y carga desde localStorage.
  // ----------------------------------------------------------
  function iniciarPreferencias() {
    if (!formPref) return;
    const promos = formPref.querySelector('[name="promos"]');
    const newsletter = formPref.querySelector('[name="newsletter"]');
    const sms = formPref.querySelector('[name="sms"]');

    // Carga las preferencias guardadas y marca los controles.
    function cargar() {
      let pref = null;
      try { pref = JSON.parse(localStorage.getItem(PREF_KEY)); } catch { pref = null; }
      if (!pref) return;
      if (promos) promos.checked = !!pref.promos;
      if (newsletter) newsletter.checked = !!pref.newsletter;
      if (sms) sms.checked = !!pref.sms;
      if (pref.idioma) {
        const radio = formPref.querySelector(`[name="idioma"][value="${pref.idioma}"]`);
        if (radio) radio.checked = true;
      }
    }

    formPref.addEventListener('submit', (e) => {
      e.preventDefault();
      const idiomaSel = formPref.querySelector('[name="idioma"]:checked');
      const pref = {
        promos: promos ? promos.checked : false,
        newsletter: newsletter ? newsletter.checked : false,
        sms: sms ? sms.checked : false,
        idioma: idiomaSel ? idiomaSel.value : 'es',
      };
      try { localStorage.setItem(PREF_KEY, JSON.stringify(pref)); } catch { /* sin storage */ }
      avisar('Preferencias guardadas.', 'ok');
      window.location.hash = 'gracias-preferencias';
    });

    cargar();
  }

  iniciarPerfil();
  iniciarPreferencias();
})();
