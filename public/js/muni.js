import * as api from '../services/servicesMuni.js';

document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. REGISTRO (Register) ---
    const btnReg = document.getElementById('btnRegistro');
    if (btnReg) {
        btnReg.addEventListener('click', async () => {
            const data = {
                nombre: document.getElementById('nombre').value,
                correo: document.getElementById('correo').value,
                password: document.getElementById('password').value,
                telefono: document.getElementById('telefono').value,
                rol: "usuario"
            };
            try {
                await api.registrarUsuario(data);
                alert("Registro exitoso.");
                window.location.href = "../HTML/inicioSesion.html";
            } catch (e) { alert("Error al registrar"); }
        });
    }

    // --- 2. LOGIN (Login) ---
    const btnLog = document.getElementById('btnInicioSesion');
    if (btnLog) {
        btnLog.addEventListener('click', async () => {
            const correo = document.getElementById('correo').value;
            const pass = document.getElementById('password').value;
            const user = await api.validarUsuario(correo, pass);
            if (user) {
                localStorage.setItem('usuarioActivo', JSON.stringify(user));
                window.location.href = user.rol === "admin" ? "dashboardAdministrador.html" : "usuario.html";
            } else { alert("Credenciales incorrectas"); }
        });
    }

    // --- 3. CIUDADANO: CREAR REPORTE (usuario.html) ---
    const selectDist = document.getElementById('distrito');
    const selectComun = document.getElementById('comunidad');
    const btnRep = document.getElementById('btnReporte');

    if (selectDist && selectComun) {
        selectDist.addEventListener('change', async () => {
            const dist = selectDist.options[selectDist.selectedIndex].text;
            const comunidades = await api.obtenerTodo('comunidades');
            const filtradas = comunidades.filter(c => c.distrito === dist);
            selectComun.innerHTML = filtradas.map(c => `<option value="${c.nombre}">${c.nombre}</option>`).join('');
        });
    }

    if (btnRep) {
        btnRep.addEventListener('click', async () => {
            const user = JSON.parse(localStorage.getItem('usuarioActivo'));
            const data = {
                usuarioId: user.id,
                tipo: document.getElementById('select').value,
                distrito: selectDist.value,
                comunidad: selectComun.value,
                descripcion: document.getElementById('descripcionProblema').value,
                estado: "Pendiente",
                fecha: new Date().toLocaleDateString()
            };
            await api.crearDato('reportes', data);
            alert("Reporte creado");
            location.reload();
        });
    }

    // --- 4. ADMINISTRADOR: LOS 3 CRUDS (dashboardAdministrador.html) ---
    const renderCRUD = async (tipo, contenedorId) => {
        const container = document.getElementById(contenedorId);
        if (!container) return;
        const datos = await api.obtenerTodo(tipo);
        container.innerHTML = datos.map(item => `
            <div class="card-item">
                <p><strong>${item.nombre || item.tipo || item.descripcion}</strong> (${item.estado || 'N/A'})</p>
                <button onclick="borrarDato('${tipo}', '${item.id}')">Eliminar</button>
                <button onclick="editarEstado('${tipo}', '${item.id}')">Cambiar Estado</button>
            </div>
        `).join('');
    };

    // Cargar listas del Admin
    renderCRUD('reportes', 'cajaReportes');
    renderCRUD('proyectos', 'cajaProyectos');
    renderCRUD('servicios', 'cajaServicios');

    // Manejo de Cierre de Sesión
    const btnOut = document.getElementById('cerrarSesion');
    if (btnOut) btnOut.onclick = () => { localStorage.clear(); window.location.href = "../index.html"; };
});

// --- FUNCIONES GLOBALES PARA EL DASHBOARD ---
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