// usuarios-crud.js

// REGISTRO
async function registrar(email, password, nombre, apellido, dni, fecha_nacimiento) {
    // 1. Crea el usuario en el sistema de Auth de Supabase
    const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error("Error al registrar:", error.message);
        return { ok: false, error: error.message };
    }

    // 2. Crea su fila en la tabla perfiles, usando el mismo id que generó Auth
    const { error: errorPerfil } = await supabaseClient.from("perfiles").insert({
        id: data.user.id,
        nombre,
        apellido,
        dni,
        fecha_nacimiento
    });

    if (errorPerfil) {
        console.error("Error al crear perfil:", errorPerfil.message);
        return { ok: false, error: errorPerfil.message };
    }

    return { ok: true, user: data.user };
}

// LOGIN
async function iniciarSesion(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Error al iniciar sesión:", error.message);
        return { ok: false, error: error.message };
    }

    return { ok: true, user: data.user, session: data.session };
}

// LOGOUT
async function cerrarSesion() {
    const { error } = await supabaseClient.auth.signOut();
    return !error;
}

// LEER USUARIO ACTUAL (útil para saber si hay sesión activa)
async function obtenerUsuarioActual() {
    const {
        data: { user },
    } = await supabaseClient.auth.getUser();
    return user;
}

// LEER PERFIL COMPLETO (datos extra de la tabla perfiles)
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

// ACTUALIZAR PERFIL
async function actualizarPerfil(userId, cambios) {
    const { data, error } = await supabaseClient
        .from("perfiles")
        .update(cambios)
        .eq("id", userId)
        .select();

    if (error) {
        console.error("Error al actualizar perfil:", error.message);
        return null;
    }
    return data;
}
