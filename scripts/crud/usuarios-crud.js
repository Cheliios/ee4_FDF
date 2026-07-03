// usuarios-crud.js — CRUD completo de Auth + tabla perfiles + preferencias

// ===== CREATE =====
async function registrar(email, password, nombre, apellido, dni, fecha_nacimiento, pais) {
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
        console.error("Error al registrar:", error.message);
        return { ok: false, error: error.message };
    }

    const { error: errorPerfil } = await supabaseClient.from("perfiles").insert({
        id: data.user.id,
        nombre,
        apellido,
        dni,
        fecha_nacimiento,
        pais
    });
    if (errorPerfil) {
        console.error("Error al crear perfil:", errorPerfil.message);
        return { ok: false, error: errorPerfil.message };
    }

    return { ok: true, user: data.user };
}

// ===== READ (login / sesión) =====
async function iniciarSesion(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        console.error("Error al iniciar sesión:", error.message);
        return { ok: false, error: error.message };
    }
    return { ok: true, user: data.user, session: data.session };
}

async function cerrarSesion() {
    const { error } = await supabaseClient.auth.signOut();
    return !error;
}

async function obtenerUsuarioActual() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
}

// ===== READ (perfil) =====
async function obtenerPerfil(userId) {
    const { data, error } = await supabaseClient
        .from("perfiles")
        .select("*")
        .eq("id", userId)
        .single();
    if (error) {
        console.error("Error al leer perfil:", error.message);
        return null;
    }
    return data;
}

// ===== UPDATE (perfil) =====
async function actualizarPerfil(userId, cambios) {
    const { data, error } = await supabaseClient
        .from("perfiles")
        .update(cambios)
        .eq("id", userId)
        .select();
    if (error) {
        console.error("Error al actualizar perfil:", error.message);
        return { ok: false, error: error.message };
    }
    return { ok: true, data };
}

// ===== DELETE (perfil) =====
// Nota: esto borra la FILA de datos en "perfiles", no la cuenta de Auth.
// Borrar la cuenta de Auth en sí requiere la service_role key (solo backend/admin),
// no se puede hacer de forma segura desde el navegador. Para el proyecto de curso,
// esto es suficiente para demostrar el DELETE del CRUD.
async function eliminarPerfil(userId) {
    const { error } = await supabaseClient
        .from("perfiles")
        .delete()
        .eq("id", userId);
    if (error) {
        console.error("Error al eliminar perfil:", error.message);
        return { ok: false, error: error.message };
    }
    await supabaseClient.auth.signOut();
    return { ok: true };
}

// ===== READ (preferencias) =====
async function obtenerPreferencias(perfilId) {
    const { data, error } = await supabaseClient
        .from("preferencias")
        .select("*")
        .eq("perfil_id", perfilId)
        .single();
    if (error) return null; // normal si aún no tiene preferencias guardadas
    return data;
}

// ===== CREATE/UPDATE (preferencias, upsert) =====
async function guardarPreferencias(perfilId, cambios) {
    const { data, error } = await supabaseClient
        .from("preferencias")
        .upsert({ perfil_id: perfilId, ...cambios })
        .select();
    if (error) {
        console.error("Error al guardar preferencias:", error.message);
        return { ok: false, error: error.message };
    }
    return { ok: true, data };
}