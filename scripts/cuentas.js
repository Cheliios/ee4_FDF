// ============================================================
// cuentas.js - Autor: Felipe Reyes Ingunza
// Sistema de cuentas con persistencia en localStorage:
// registrar una cuenta y luego iniciar sesion con ESA cuenta.
// Se expone en window.LA.cuentas para que lo use login.js.
//
// NOTA: la contrasena se guarda ofuscada (base64). Es solo una
// simulacion academica, NO es seguridad real.
// ============================================================

(function () {
  'use strict';

  const LA = (window.LA = window.LA || {});
  const KEY_CUENTAS = 'la_cuentas';
  const KEY_SESION = 'la_sesion'; // compartida con main.js (Felipe) y login.js (Rodrigo)

  // Ofusca un texto a base64 admitiendo acentos/unicode.
  function ofuscar(txt) {
    try { return btoa(unescape(encodeURIComponent(txt))); } catch { return txt; }
  }

  // Lee de forma segura un valor JSON de localStorage.
  function leer(key, porDefecto) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v === null || v === undefined ? porDefecto : v;
    } catch {
      return porDefecto;
    }
  }

  // Escribe un valor JSON en localStorage.
  function escribir(key, valor) {
    try { localStorage.setItem(key, JSON.stringify(valor)); return true; }
    catch { return false; }
  }

  // Devuelve todas las cuentas registradas.
  function listar() {
    return leer(KEY_CUENTAS, []);
  }

  // Busca una cuenta por correo (sin distinguir mayusculas).
  function buscarPorEmail(email) {
    const e = String(email).trim().toLowerCase();
    return listar().find((c) => c.email === e) || null;
  }

  // Indica si ya existe una cuenta con ese correo.
  function existeEmail(email) {
    return !!buscarPorEmail(email);
  }

  // Registra una cuenta nueva; rechaza correos duplicados.
  function registrar(datos) {
    const email = String(datos.email).trim().toLowerCase();
    if (existeEmail(email)) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' };
    }
    const cuentas = listar();
    cuentas.push({
      nombre: (datos.nombre || '').trim(),
      apellido: (datos.apellido || '').trim(),
      email,
      pass: ofuscar(datos.pass || ''),
      pais: datos.pais || '',
      doc: datos.doc || '',
      fecha: datos.fecha || '',
    });
    escribir(KEY_CUENTAS, cuentas);
    return { ok: true };
  }

  // Verifica credenciales contra las cuentas guardadas.
  function login(email, pass) {
    const cuenta = buscarPorEmail(email);
    if (!cuenta) {
      return { ok: false, error: 'No existe una cuenta con ese correo. Registrate primero.' };
    }
    if (cuenta.pass !== ofuscar(pass)) {
      return { ok: false, error: 'La contrasena no es correcta.' };
    }
    return { ok: true, usuario: { nombre: cuenta.nombre || cuenta.email.split('@')[0], email: cuenta.email } };
  }

  // Guarda la sesion activa (lo que lee main.js para el header).
  function guardarSesion(usuario) {
    return escribir(KEY_SESION, usuario);
  }

  // Devuelve la sesion activa o null.
  function sesionActual() {
    return leer(KEY_SESION, null);
  }

  // Cierra la sesion activa.
  function cerrarSesion() {
    try { localStorage.removeItem(KEY_SESION); } catch { /* sin storage */ }
  }

  // Publica la API de cuentas.
  LA.cuentas = {
    listar, buscarPorEmail, existeEmail, registrar,
    login, guardarSesion, sesionActual, cerrarSesion,
  };
})();
