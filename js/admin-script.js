// admin-script.js - MEJORADO CON CARDS MÓVILES

// ============================================
// VARIABLES GLOBALES
// ============================================
let token = null;
let citaParaEliminar = null;
let tabActual = 'todas';

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay token guardado
    token = localStorage.getItem('admin_token');
    
    if (token) {
        verificarToken();
    } else {
        mostrarLogin();
    }
    
    // Event listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('formCambiarPassword').addEventListener('submit', handleCambiarPassword);
});

// ============================================
// AUTENTICACIÓN
// ============================================
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const btnLogin = document.getElementById('btnLogin');
    const errorDiv = document.getElementById('loginError');
    
    btnLogin.disabled = true;
    btnLogin.textContent = 'Iniciando...';
    errorDiv.style.display = 'none';
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al iniciar sesión');
        }
        
        // Guardar token
        token = data.token;
        localStorage.setItem('admin_token', token);
        
        // Mostrar panel
        mostrarPanel(data.admin);
        
    } catch (error) {
        console.error('Error en login:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = 'Iniciar Sesión';
    }
}

async function verificarToken() {
    try {
        const response = await fetch(`${API_URL}/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Token inválido');
        }
        
        const data = await response.json();
        mostrarPanel(data.admin);
        
    } catch (error) {
        console.error('Token inválido:', error);
        logout();
    }
}

function logout() {
    token = null;
    localStorage.removeItem('admin_token');
    mostrarLogin();
}

function mostrarLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

function mostrarPanel(admin) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminName').textContent = admin.nombre;
    
    // Cargar datos iniciales
    cargarEstadisticas();
    cargarCitas();
}

// ============================================
// ESTADÍSTICAS
// ============================================
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error cargando estadísticas');
        
        const data = await response.json();
        const stats = data.estadisticas;
        
        document.getElementById('statTotal').textContent = stats.total_citas;
        document.getElementById('statHoy').textContent = stats.citas_hoy;
        document.getElementById('statSemana').textContent = stats.citas_semana;
        document.getElementById('statClientes').textContent = stats.total_clientes;
        
    } catch (error) {
        console.error('Error cargando estadísticas:', error);
    }
}

// ============================================
// ✨ CITAS - MEJORADO PARA MOBILE/DESKTOP
// ============================================
async function cargarCitas() {
    const tbody = document.getElementById('citasTableBody');
    const loading = document.getElementById('loadingCitas');
    const noData = document.getElementById('noCitas');
    const tabla = document.getElementById('tablaCitas');
    
    loading.style.display = 'block';
    tabla.style.display = 'none';
    noData.style.display = 'none';
    tbody.innerHTML = '';
    
    try {
        let url;
        
        switch(tabActual) {
            case 'hoy':
                url = `${API_URL}/admin/appointments/today`;
                break;
            case 'futuras':
                url = `${API_URL}/admin/appointments/upcoming`;
                break;
            default:
                url = `${API_URL}/admin/appointments`;
                
                // Agregar filtros si existen
                const params = new URLSearchParams();
                const fechaInicio = document.getElementById('filterFechaInicio').value;
                const fechaFin = document.getElementById('filterFechaFin').value;
                const estado = document.getElementById('filterEstado').value;
                
                if (fechaInicio) params.append('fecha_inicio', fechaInicio);
                if (fechaFin) params.append('fecha_fin', fechaFin);
                if (estado) params.append('estado', estado);
                
                if (params.toString()) {
                    url += '?' + params.toString();
                }
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error cargando citas');
        
        const data = await response.json();
        const citas = data.citas;
        
        if (citas.length === 0) {
            loading.style.display = 'none';
            noData.style.display = 'block';
            return;
        }
        
        // ✨ MEJORADO: Renderizar citas con data-label para móvil
        citas.forEach((cita, index) => {
            const tr = document.createElement('tr');
            tr.style.animationDelay = `${index * 0.05}s`;
            
            // Crear celdas con data-label para móvil
            tr.innerHTML = `
                <td data-label="Fecha">${formatearFecha(cita.fecha)}</td>
                <td data-label="Hora">${formatearHora(cita.hora)}</td>
                <td data-label="Cliente"><strong>${cita.cliente_nombre}</strong></td>
                <td data-label="Email"><small>${cita.cliente_email}</small></td>
                <td data-label="Teléfono"><small>${cita.cliente_telefono || '-'}</small></td>
                <td data-label="Servicio">${cita.servicio || '-'}</td>
                <td data-label="Estado">
                    <span class="estado-badge estado-${cita.estado}">
                        ${cita.estado.charAt(0).toUpperCase() + cita.estado.slice(1)}
                    </span>
                </td>
                <td data-label="Acciones">
                    <div class="action-buttons">
                        ${cita.estado !== 'confirmada' ? `
                            <button class="btn-action btn-confirmar" onclick="cambiarEstado(${cita.cita_id}, 'confirmada')">
                                ✓ Confirmar
                            </button>
                        ` : ''}
                        ${cita.estado !== 'cancelada' ? `
                            <button class="btn-action btn-cancelar" onclick="cambiarEstado(${cita.cita_id}, 'cancelada')">
                                ✕ Cancelar
                            </button>
                        ` : ''}
                        <button class="btn-action btn-eliminar" onclick="abrirModalEliminar(${cita.cita_id})">
                            🗑 Eliminar
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        loading.style.display = 'none';
        tabla.style.display = 'block';
        
        console.log(`✅ ${citas.length} citas cargadas`);
        
    } catch (error) {
        console.error('Error cargando citas:', error);
        loading.style.display = 'none';
        noData.style.display = 'block';
    }
}

async function cambiarEstado(citaId, nuevoEstado) {
    const estadoTexto = nuevoEstado === 'confirmada' ? 'Confirmada' : 'Cancelada';
    
    if (!confirm(`¿Cambiar estado a "${estadoTexto}"?`)) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/appointments/${citaId}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (!response.ok) throw new Error('Error cambiando estado');
        
        // Recargar citas y estadísticas
        cargarCitas();
        cargarEstadisticas();
        
        console.log(`✅ Estado cambiado a: ${nuevoEstado}`);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar el estado de la cita');
    }
}

// ============================================
// TABS
// ============================================
function cambiarTab(tab) {
    tabActual = tab;
    
    // Actualizar tabs visuales
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Limpiar filtros
    if (tab !== 'todas') {
        limpiarFiltros();
    }
    
    // Cargar citas
    cargarCitas();
    
    console.log(`📑 Tab cambiado a: ${tab}`);
}

// ============================================
// FILTROS
// ============================================
function aplicarFiltros() {
    tabActual = 'todas';
    
    // Actualizar tab visual
    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('active');
    });
    document.querySelector('.tab').classList.add('active');
    
    cargarCitas();
    
    console.log('🔍 Filtros aplicados');
}

function limpiarFiltros() {
    document.getElementById('filterFechaInicio').value = '';
    document.getElementById('filterFechaFin').value = '';
    document.getElementById('filterEstado').value = '';
    
    console.log('🧹 Filtros limpiados');
}

// ============================================
// MODAL CAMBIAR CONTRASEÑA
// ============================================
function abrirCambiarPassword() {
    document.getElementById('modalCambiarPassword').style.display = 'flex';
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('passwordSuccess').style.display = 'none';
}

function cerrarCambiarPassword() {
    document.getElementById('modalCambiarPassword').style.display = 'none';
}

async function handleCambiarPassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('passwordError');
    const successDiv = document.getElementById('passwordSuccess');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validar
    if (newPassword !== confirmPassword) {
        errorDiv.textContent = 'Las contraseñas no coinciden';
        errorDiv.style.display = 'block';
        return;
    }
    
    if (newPassword.length < 6) {
        errorDiv.textContent = 'La contraseña debe tener al menos 6 caracteres';
        errorDiv.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error cambiando contraseña');
        }
        
        successDiv.textContent = '¡Contraseña cambiada exitosamente!';
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            cerrarCambiarPassword();
        }, 2000);
        
    } catch (error) {
        console.error('Error:', error);
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    }
}

// ============================================
// MODAL ELIMINAR
// ============================================
function abrirModalEliminar(citaId) {
    citaParaEliminar = citaId;
    document.getElementById('modalEliminar').style.display = 'flex';
}

function cerrarModalEliminar() {
    citaParaEliminar = null;
    document.getElementById('modalEliminar').style.display = 'none';
}

async function confirmarEliminar() {
    if (!citaParaEliminar) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/appointments/${citaParaEliminar}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) throw new Error('Error eliminando cita');
        
        console.log(`✅ Cita ${citaParaEliminar} eliminada`);
        
        cerrarModalEliminar();
        cargarCitas();
        cargarEstadisticas();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la cita');
    }
}

// ============================================
// UTILIDADES
// ============================================
function formatearFecha(fecha) {
    const [year, month, day] = fecha.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
}

function formatearHora(hora) {
    // Formato 24 horas para Uruguay
    return hora.substring(0, 5);
}

// Cerrar modales al hacer click fuera
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}