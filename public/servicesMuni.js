// URLs Endpoints según db.json
const URLS = {
    usuarios: "http://localhost:3000/usuarios",
    reportes: "http://localhost:3000/reportes",
    proyectos: "http://localhost:3000/proyectos",
    servicios: "http://localhost:3000/servicios_publicos",
    comunidades: "http://localhost:3000/comunidades"
};

/**
 * Función Maestra Fetch: Maneja GET, POST, PUT y DELETE
 */
async function apiFetch(url, method = 'GET', data = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (data) options.body = JSON.stringify(data);
    
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Error en la petición: ${res.statusText}`);
    return await res.json();
}

// --- SERVICIOS EXPORTADOS ---

// Auth
export const registrarUsuario = (user) => apiFetch(URLS.usuarios, 'POST', user);
export const validarUsuario = async (correo, password) => {
    const users = await apiFetch(`${URLS.usuarios}?correo=${correo}&password=${password}`);
    return users.length > 0 ? users[0] : null;
};

// Consultas Generales
export const obtenerTodo = (tipo) => apiFetch(URLS[tipo]);
export const crearDato = (tipo, data) => apiFetch(URLS[tipo], 'POST', data);
export const actualizarDato = (tipo, id, data) => apiFetch(`${URLS[tipo]}/${id}`, 'PATCH', data);
export const eliminarDato = (tipo, id) => apiFetch(`${URLS[tipo]}/${id}`, 'DELETE');