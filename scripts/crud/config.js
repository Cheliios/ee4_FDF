const SUPABASE_URL = 'https://wotakwvoqrqdtbcrxkzv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_f-tdKYTzvnujbyEzyzLxQg_ZssCLZTI';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function probarConexion() {
const { data, error } = await supabaseClient.from('vuelos').select('*').limit(1);
    if (error) {
        console.error('❌ Error de conexión:', error.message);
    } else {
        console.log('✅ Conectado. Datos:', data);
    }
}
probarConexion();