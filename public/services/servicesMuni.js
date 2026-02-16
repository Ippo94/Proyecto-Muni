async function getUsuarios() {
    try {
        const peticion = await fetch("http://localhost:3001/usuarios")
        const respuesta = await peticion.json()
        return respuesta
    } catch (error) {
        console.error(error);
    }
}

export {getUsuarios}