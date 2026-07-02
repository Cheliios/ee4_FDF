const SUPABASE_URL = 'https://wotakwvoqrqdtbcrxkzv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f-tdKYTzvnujbyEzyzLxQg_ZssCLZTI';

if (!window.supabase || typeof window.supabase.createClient !== 'function') {
  console.error('Supabase no esta disponible. Verifica la carga del CDN antes de config.js.');
} else {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

async function probarConexion() {
  if (!window.supabaseClient) return;

  const { data, error } = await window.supabaseClient
    .from('vuelos')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error de conexion con Supabase:', error.message);
  } else {
    console.log('Supabase conectado. Datos de prueba:', data);
  }
}

probarConexion();
