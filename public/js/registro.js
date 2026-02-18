// declarar los inputs de html
// buscar como aplicar el import de postdata en un formulario. Async
// generar una alerta si el usuario fue registrado correctamente o si ya existe en la base de datos

// 1. Importamos las funciones de nuestro servicio
// Nota: Es importante poner la extensión .js al final en imports nativos del navegador
import { getData, postData } from '../services/servicesMuni.js';

// 2. Referencias al DOM (elementos del HTML)
const formulario = document.getElementById('registroForm');
const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');
const inputTelefono = document.getElementById('telefono');
const inputPassword = document.getElementById('password');

// 3. Escuchamos el evento de envío (Submit)
formulario.addEventListener('submit', async function(event) {
    // Prevenimos que la página se recargue
    event.preventDefault();

    // Capturamos los valores actuales
    const nombre = inputNombre.value.trim();
    const email = inputEmail.value.trim();
    const telefono = inputTelefono.value.trim();
    const password = inputPassword.value.trim();

    // Validación básica (aunque el HTML ya tiene 'required')
    if (!nombre || !email || !telefono || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    try {
        // --- PASO A: Verificar si el usuario ya existe ---
        // Usamos json-server para filtrar por email
        try {
            const usuariosExistentes = await getData(`users?email=${email}`);
            if (usuariosExistentes.length > 0) {
                // Si el array no está vacío, el correo ya está en uso
                alert("⚠️ Error: Este correo electrónico ya está registrado.");
                return; // Detenemos la ejecución aquí
            }
        } catch (error) {
            
        }


        // --- PASO B: Crear el nuevo usuario ---
        // Construimos el objeto usuario
        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            telefono: telefono,
            password: password, // En un caso real, esto iría encriptado
            rol: "ciudadano"    // Asignamos el rol por defecto
        };

        // Enviamos los datos al backend
        const respuesta = await postData('usuarios', nuevoUsuario);

        // --- PASO C: Feedback y Redirección ---
        if (respuesta) {
            alert("✅ ¡Registro exitoso! Ahora puedes iniciar sesión.");
            // Opcional: Limpiar formulario
            formulario.reset(); 
            // Redirigir al login
            window.location.href = "inicioSesion.html";
        }

    } catch (error) {
        console.error("Error en el registro:", error);
        alert("❌ Ocurrió un error de conexión. Intenta nuevamente.");
    }
});