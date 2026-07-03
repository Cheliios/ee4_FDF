// ============================================================
// mi-cuenta.js - Refactorizado a Supabase (perfil y preferencias)
// ============================================================

(function () {
  'use strict';

  const LA = window.LA || {};
  const formPerfil = document.querySelector('[name="form-perfil"]');
  const formPref = document.querySelector('[name="form-preferencias"]');

  function avisar(msg, tipo) {
    if (LA.notificar) LA.notificar(msg, tipo);
  }

  async function iniciarPerfil() {
    if (!formPerfil) return;
    formPerfil.noValidate = true;
    const nombre = document.getElementById('p-nombre');
    const apellido = document.getElementById('p-apellido');
    const email = document.getElementById('p-email');
    const tel = document.getElementById('p-tel');
    const doc = document.getElementById('p-doc');
    const fecha = document.getElementById('p-fecha');

    const usuario = await obtenerUsuarioActual();
    if (!usuario) return; // no hay sesión, no hay nada que cargar/editar

    // Email viene de Auth, no de la tabla perfiles — se muestra pero no se edita aquí.
    if (email) {
      email.value = usuario.email;
      email.readOnly = true;
    }

    const perfil = await obtenerPerfil(usuario.id);
    if (perfil) {
      if (perfil.nombre) nombre.value = perfil.nombre;
      if (perfil.apellido) apellido.value = perfil.apellido;
      if (perfil.telefono) tel.value = perfil.telefono;
      if (perfil.dni) doc.value = perfil.dni;
      if (perfil.fecha_nacimiento) fecha.value = perfil.fecha_nacimiento;
    }

    function validar() {
      let ok = validarVacio(nombre, 'El nombre');
      ok = validarVacio(apellido, 'El apellido') && ok;
      ok = validarVacio(doc, 'El documento') && ok;
      if (tel.value.trim() && !/^[+0-9 ]{9,15}$/.test(tel.value.trim())) {
        mostrarError(tel, 'Telefono invalido (9 a 15 digitos).');
        ok = false;
      } else {
        limpiarError(tel);
      }
      return ok;
    }

    formPerfil.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validar()) {
        avisar('Revisa los campos marcados en rojo.', 'error');
        return;
      }
      const resultado = await actualizarPerfil(usuario.id, {
        nombre: nombre.value.trim(),
        apellido: apellido.value.trim(),
        telefono: tel.value.trim(),
        dni: doc.value.trim(),
        fecha_nacimiento: fecha.value || null,
      });
      if (!resultado.ok) {
        avisar('Error al guardar: ' + resultado.error, 'error');
        return;
      }
      avisar('Perfil guardado correctamente.', 'ok');
      window.location.hash = 'gracias-perfil';
    });
  }

  async function iniciarPreferencias() {
    if (!formPref) return;
    const promos = formPref.querySelector('[name="promos"]');
    const newsletter = formPref.querySelector('[name="newsletter"]');
    const sms = formPref.querySelector('[name="sms"]');

    const usuario = await obtenerUsuarioActual();
    if (!usuario) return;

    const pref = await obtenerPreferencias(usuario.id);
    if (pref) {
      if (promos) promos.checked = !!pref.promos;
      if (newsletter) newsletter.checked = !!pref.newsletter;
      if (sms) sms.checked = !!pref.sms;
      if (pref.idioma) {
        const radio = formPref.querySelector(`[name="idioma"][value="${pref.idioma}"]`);
        if (radio) radio.checked = true;
      }
    }

    formPref.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idiomaSel = formPref.querySelector('[name="idioma"]:checked');
      const resultado = await guardarPreferencias(usuario.id, {
        promos: promos ? promos.checked : false,
        newsletter: newsletter ? newsletter.checked : false,
        sms: sms ? sms.checked : false,
        idioma: idiomaSel ? idiomaSel.value : 'es',
      });
      if (!resultado.ok) {
        avisar('Error al guardar: ' + resultado.error, 'error');
        return;
      }
      avisar('Preferencias guardadas.', 'ok');
      window.location.hash = 'gracias-preferencias';
    });
  }

  iniciarPerfil();
  iniciarPreferencias();
})();