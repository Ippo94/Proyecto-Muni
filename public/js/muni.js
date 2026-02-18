import * as api from '../services/servicesMuni.js';

document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. REGISTRO (Universal) ---
    const btnReg = document.getElementById('btnRegistro');
    if (btnReg) {
        btnReg.addEventListener('click', async () => {
            const data = {
                nombre: document.getElementById('nombre').value,
                correo: document.getElementById('correo').value,
                password: document.getElementById('password').value,
                telefono: document.getElementById('telefono').value,
                rol: "usuario",
                activo: true
            };

            if (!data.nombre || !data.correo || !data.password) {
                alert("Por favor, complete los campos obligatorios.");
                return;
            }

            try {
                await api.registrarUsuario(data);
                alert("Registro exitoso.");
                window.location.href = "./inicioSesion.html";
            } catch (e) { 
                alert("Error al registrar el usuario"); 
            }
        });
    }

    // --- 2. LOGIN (Con validación de Estado) ---
    const btnLog = document.getElementById('btnInicioSesion');
    if (btnLog) {
        btnLog.addEventListener('click', async () => {
            const correo = document.getElementById('correo').value;
            const pass = document.getElementById('password').value;
            
            const user = await api.validarUsuario(correo, pass);
            
            if (user) {
                if (user.activo === false) {
                    alert("⛔ Su cuenta ha sido desactivada por el administrador.");
                    return;
                }

                localStorage.setItem('usuarioActivo', JSON.stringify(user));
                window.location.href = user.rol === "admin" ? "dashboardAdministrador.html" : "usuario.html";
            } else { 
                alert("Credenciales incorrectas o usuario no encontrado"); 
            }
        });
    }

    // --- PASO 5: INYECCIÓN DE INTERFAZ (DOM Injection) ---
    const mainAdmin = document.querySelector('main');
    if (mainAdmin && window.location.pathname.includes('dashboardAdministrador')) {
        const sectionUsuarios = document.createElement('section');
        sectionUsuarios.className = 'admin-section';
        sectionUsuarios.style.marginTop = "40px";
        sectionUsuarios.innerHTML = `
            <h2 style="color: var(--neon-turquoise); border-bottom: 2px solid var(--neon-turquoise); padding-bottom: 10px;">Gestión de Usuarios (Sistema)</h2>
            <div id="cajaUsuarios" class="grid-admin" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; margin-top: 20px;">
                </div>
        `;
        mainAdmin.appendChild(sectionUsuarios);
    }

    // --- PASO 6: RENDER DE USUARIOS (Metodología DRY) ---
    const renderUsuarios = async () => {
        const container = document.getElementById('cajaUsuarios');
        if (!container) return;
        
        const usuarios = await api.obtenerTodo('usuarios');
        
        container.innerHTML = usuarios.map(u => `
            <div class="card-item" style="border: 1px solid var(--neon-turquoise); padding: 15px; border-radius: 8px; background: rgba(0,0,0,0.6); box-shadow: 0 0 10px rgba(0, 245, 255, 0.1);">
                <p><strong>${u.nombre}</strong></p>
                <p style="font-size: 0.85rem; color: var(--text-gray);">${u.correo}</p>
                <p>Rol: <span style="color: var(--neon-turquoise)">${u.rol}</span></p>
                <p>Estado: <span style="color: ${u.activo ? '#00ff00' : '#ff0000'}">${u.activo ? 'Activo' : 'Inactivo'}</span></p>
                
                <div style="margin-top: 15px; display: flex; gap: 8px; flex-wrap: wrap;">
                    <button onclick="window.gestionarRol('${u.id}', '${u.rol}')" class="btn-primary" style="font-size: 0.7rem; padding: 5px 10px;">Cambiar Rol</button>
                    <button onclick="window.gestionarEstado('${u.id}', ${u.activo})" class="btn-primary" style="font-size: 0.7rem; padding: 5px 10px;">
                        ${u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button onclick="window.borrarDato('usuarios', '${u.id}')" style="border: 1px solid red; color: red; background: transparent; cursor: pointer; border-radius: 4px; padding: 4px 8px; font-size: 0.7rem;">Eliminar</button>
                </div>
            </div>
        `).join('');
    };

    if (document.getElementById('cajaUsuarios')) {
        renderUsuarios();
    }

    // --- MANEJO DE CIERRE DE SESIÓN ---
    const btnOut = document.getElementById('cerrarSesion');
    if (btnOut) {
        btnOut.onclick = () => { 
            localStorage.clear(); 
            window.location.href = "../index.html"; 
        };
    }

    // --- OTROS RENDERS (Reportes, Proyectos, Servicios) ---
    const renderCRUD = async (tipo, contenedorId) => {
        const container = document.getElementById(contenedorId);
        if (!container) return;
        const datos = await api.obtenerTodo(tipo);
        container.innerHTML = datos.map(item => `
            <div class="card-item">
                <p><strong>${item.nombre || item.tipo || item.descripcion}</strong> (${item.estado || 'N/A'})</p>
                <button onclick="window.borrarDato('${tipo}', '${item.id}')">Eliminar</button>
                <button onclick="window.editarEstado('${tipo}', '${item.id}')">Cambiar Estado</button>
            </div>
        `).join('');
    };

    renderCRUD('reportes', 'cajaReportes');
    renderCRUD('proyectos', 'cajaProyectos');
    renderCRUD('servicios', 'cajaServicios');
});

// --- FUNCIONES GLOBALES (ACCESIBLES DESDE EL DOM INYECTADO) ---

window.gestionarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === "admin" ? "usuario" : "admin";
    if (confirm(`¿Desea cambiar el rol de ${rolActual} a ${nuevoRol}?`)) {
        await api.actualizarDato('usuarios', id, { rol: nuevoRol });
        location.reload();
    }
};

window.gestionarEstado = async (id, estadoActual) => {
    const nuevoEstado = !estadoActual;
    const mensaje = nuevoEstado ? "¿Desea activar este usuario?" : "¿Desea desactivar este usuario? No podrá iniciar sesión.";
    
    if (confirm(mensaje)) {
        await api.actualizarDato('usuarios', id, { activo: nuevoEstado });
        location.reload();
    }
};

window.borrarDato = async (tipo, id) => {
    if (confirm("¿Desea eliminar este registro?")) {
        await api.eliminarDato(tipo, id);
        location.reload();
    }
};

window.editarEstado = async (tipo, id) => {
    const nuevo = prompt("Nuevo estado (En Proceso / Resuelto):");
    if (nuevo) {
        await api.actualizarDato(tipo, id, { estado: nuevo });
        location.reload();
    }
};