const BASE_URL = "http://localhost:3000";

// --- FUNCIONES CORE (Siguiendo tu modelo) ---

async function getData(endpoint) {
    try {
        const peticion = await fetch(`${BASE_URL}/${endpoint}`);
        const respuesta = await peticion.json();
        return respuesta;
    } catch (error) {
        console.error("Error en GET:", error);
    }
}

async function postData(endpoint, obj) {
    try {
        const peticion = await fetch(`${BASE_URL}/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });
        const respuesta = await peticion.json();
        return respuesta;
    } catch (error) {
        console.error("Error en POST:", error);
    }
}

// Añadimos estas dos para completar los requerimientos del ejercicio (PUT y DELETE)
async function updateData(endpoint, id, obj) {
    try {
        const peticion = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
            method: "PATCH", // Usamos PATCH para actualizaciones parciales
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });
        const respuesta = await peticion.json();
        return respuesta;
    } catch (error) {
        console.error("Error en PUT:", error);
    }
}

async function deleteData(endpoint, id) {
    try {
        const peticion = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
            method: "DELETE"
        });
        const respuesta = await peticion.json();
        return respuesta;
    } catch (error) {
        console.error("Error en DELETE:", error);
    }
}

// --- LÓGICA DE NEGOCIO (Sincronizada con muni.js) ---

export const registrarUsuario = (user) => postData('usuarios', user);

export const validarUsuario = async (correo, password) => {
    const users = await getData(`usuarios?correo=${correo}&password=${password}`);
    return users.length > 0 ? users[0] : null;
};

// Funciones para los 3 CRUDs del Dashboard
export const obtenerTodo = (tipo) => getData(tipo);
export const crearDato = (tipo, data) => postData(tipo, data);
export const actualizarDato = (tipo, id, data) => updateData(tipo, id, data);
export const eliminarDato = (tipo, id) => deleteData(tipo, id);

export { getData, postData, updateData, deleteData };