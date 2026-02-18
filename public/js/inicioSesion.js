import { getData } from "../services/servicesMuni.js"

const email = document.getElementById("email")
const password = document.getElementById("password")
const btnIngresar = document.getElementById("btnIngresar")


async function iniciarSesion() {
    try {
        const usuariosRegistrados = await getData()

        const usuarioValido = usuariosRegistrados.find((usuario)=> usuario.email === email.value && usuario.password === password.value)

        if (usuarioValido) {
            console.log("todo bien");
        }else{
            console.log("todo mal mari");
        }

    } catch (error) {
        console.error(error);
    }
}

btnIngresar.addEventListener("click",iniciarSesion)