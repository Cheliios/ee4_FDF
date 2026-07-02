(function () {
  'use strict';

  function obtenerCliente() {
    if (!window.supabaseClient) {
      throw new Error('Supabase no esta configurado en esta pagina.');
    }
    return window.supabaseClient;
  }

  async function crearEstudiante(payload) {
    const supabase = obtenerCliente();
    const registro = {
      nombre: payload.nombre,
      email: payload.email,
      universidad: payload.universidad,
      carnet: payload.carnet,
      ciclo: payload.ciclo,
    };

    const { data, error } = await supabase
      .from('estudiantes')
      .insert(registro)
      .select()
      .single();

    if (error) {
      console.error('Error al registrar estudiante:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  }

  async function crearSolicitudGrupal(payload) {
    const supabase = obtenerCliente();
    const registro = {
      institucion: payload.institucion,
      contacto: payload.contacto,
      email: payload.email,
      telefono: payload.telefono,
      personas: Number(payload.personas),
      origen: payload.origen,
      destino: payload.destino,
      fecha: payload.fecha,
      detalles: payload.detalles || null,
    };

    const { data, error } = await supabase
      .from('cotizaciones_grupales')
      .insert(registro)
      .select()
      .single();

    if (error) {
      console.error('Error al registrar solicitud grupal:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  }

  async function buscarEstudiantePorEmail(email) {
    const supabase = obtenerCliente();
    const { data, error } = await supabase
      .from('estudiantes')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Error al consultar estudiante:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  }

  window.EstudiantesCrud = {
    crearEstudiante,
    crearSolicitudGrupal,
    buscarEstudiantePorEmail,
  };
})();
