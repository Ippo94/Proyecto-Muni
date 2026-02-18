async function getData(endpoint) {
    try {
        const peticion = await fetch(`http://localhost:3001/${endpoint}`)
        const respuesta = await peticion.json()
        return respuesta
    } catch (error) {
        console.error(error);
    }
}

async function postData(endpoint,obj) {
   try {
    const peticion = await fetch(`http://localhost:3001/${endpoint}`,{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(obj)
    })
    const respuesta = await peticion.json()
    return respuesta
    
   } catch (error) {
        console.error(error);
        
   }
}



// PUT (Actualizar - Necesario para cambiar estados)
export async function putData(endpoint, id, data) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// DELETE (Eliminar - Necesario para borrar registros)
export async function deleteData(endpoint, id) {
    try {
        const response = await fetch(`${BASE_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export {getData,postData}