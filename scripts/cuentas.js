// ============================================================
// cuentas.js - Adaptado a Supabase
// Mantiene la misma API pública (window.LA.cuentas) pero ahora
// habla con la base de datos en vez de localStorage.
// Requiere que config.js (supabaseClient) ya esté cargado antes.
// ============================================================

(function () {
  'use strict';

  const LA = (window.LA = window.LA || {});

  // Registra una cuenta nueva (Auth + tabla perfiles)
  async function registrar(datos) {
    const email = String(datos.email).trim().toLowerCase();

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password: datos.pass
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    const { error: errorPerfil } = await supabaseClient
      .from('perfiles')
      .insert({
        id: data.user.id,
        nombre: (datos.nombre || '').trim(),
        apellido: (datos.apellido || '').trim(),
        dni: datos.doc || null,
        fecha_nacimiento: datos.fecha || null
      });

    if (errorPerfil) {
      return { ok: false, error: errorPerfil.message };
    }

    return { ok: true };
  }

  // Verifica credenciales contra Supabase Auth
  async function login(email, pass) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password: pass
    });

    if (error) {
      return { ok: false, error: error.message };
    }

    // Trae el nombre desde la tabla perfiles
    const { data: perfil } = await supabaseClient
      .from('perfiles')
      .select('nombre, apellido')
      .eq('id', data.user.id)
      .single();

    return {
      ok: true,
      usuario: {
        nombre: perfil?.nombre || data.user.email.split('@')[0],
        email: data.user.email
      }
    };
  }

  // La "sesión" ya la maneja Supabase internamente (guardada en su propio storage)
  async function sesionActual() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) return null;

    const { data: perfil } = await supabaseClient
      .from('perfiles')
      .select('nombre, apellido')
      .eq('id', session.user.id)
      .single();

    return {
      nombre: perfil?.nombre || session.user.email.split('@')[0],
      email: session.user.email
    };
  }

  // Cierra la sesión activa
  async function cerrarSesion() {
    await supabaseClient.auth.signOut();
  }

  // Publica la API de cuentas (misma forma que antes, ahora async)
  LA.cuentas = {
    registrar,
    login,
    sesionActual,
    cerrarSesion,
  };
})();