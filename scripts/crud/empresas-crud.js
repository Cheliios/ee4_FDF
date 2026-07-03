(function () {
  'use strict';

  function obtenerCliente() {
    if (!window.supabaseClient) {
      throw new Error('Supabase no esta configurado en esta pagina.');
    }
    return window.supabaseClient;
  }

  function calcularDescuento(plan) {
    const descuentos = {
      starter: 5,
      business: 10,
      enterprise: 15,
    };
    return descuentos[plan] || 0;
  }

  async function crearEmpresa(payload) {
    const supabase = obtenerCliente();
    const registro = {
      ruc: payload.ruc,
      razon_social: payload.razon_social,
      descuento_porcentaje: calcularDescuento(payload.plan),
      contacto_email: payload.contacto_email,
    };

    const { data, error } = await supabase
      .from('empresas')
      .insert(registro)
      .select()
      .single();

    if (error) {
      console.error('Error al registrar empresa:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  }

  async function buscarEmpresaPorRuc(ruc) {
    const supabase = obtenerCliente();
    const { data, error } = await supabase
      .from('empresas')
      .select('*')
      .eq('ruc', ruc)
      .maybeSingle();

    if (error) {
      console.error('Error al consultar empresa:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, data };
  }

  window.EmpresasCrud = {
    crearEmpresa,
    buscarEmpresaPorRuc,
  };
})();
