// ============================================
// VARIABLES GLOBALES
// ============================================
let configuracion = null;
let horaSeleccionada = null;
let serviciosSeleccionados = [];

// ============================================
// INICIO: Cuando carga la página
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando aplicación de agenda...');
    
    await cargarConfiguracion();
    inicializarServicios();
    configurarFechaMinima();
    setupEventListeners();
    
    console.log('✅ Aplicación lista!');
});

// ============================================
// FUNCIÓN: Cargar configuración del negocio
// ============================================
async function cargarConfiguracion() {
    try {
        console.log('📡 Obteniendo configuración del servidor...');
        
        const response = await fetch(`${API_URL}/config`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        configuracion = await response.json();
        console.log('✅ Configuración cargada:', configuracion);
        
        const nombreElemento = document.getElementById('negocioNombre');
        if (nombreElemento && configuracion.nombre_negocio) {
            nombreElemento.textContent = configuracion.nombre_negocio;
        }
        
        const emailElemento = document.getElementById('footerEmail');
        if (emailElemento && configuracion.email_negocio) {
            emailElemento.textContent = configuracion.email_negocio;
            emailElemento.href = `mailto:${configuracion.email_negocio}`;
        }
        
    } catch (error) {
        console.error('❌ Error cargando configuración:', error);
        mostrarMensaje(
            'Error de conexión',
            'No se pudo conectar con el servidor. Por favor verifica tu conexión.',
            'error'
        );
    }
}

// ============================================
// ✨ INICIALIZAR SERVICIOS
// ============================================
function inicializarServicios() {
    const serviciosGrid = document.getElementById('serviciosGrid');
    if (!serviciosGrid) return;
    
    const servicios = obtenerServicios();
    
    // Limpiar grid
    serviciosGrid.innerHTML = '';
    
    // Crear cards de servicios
    servicios.forEach((servicio, index) => {
        const card = crearCardServicio(servicio, index);
        serviciosGrid.appendChild(card);
    });
    
    console.log(`✅ ${servicios.length} servicios cargados`);
}

// ============================================
// ✨ CREAR CARD DE SERVICIO
// ============================================
function crearCardServicio(servicio, index) {
    const card = document.createElement('div');
    card.className = 'servicio-card';
    card.dataset.servicioId = servicio.id;
    card.style.animationDelay = `${index * 0.05}s`;
    
    card.innerHTML = `
        <div class="servicio-checkbox">
            <span class="servicio-checkbox-icon">✓</span>
        </div>
        <div class="servicio-info">
            <div class="servicio-nombre">${servicio.nombre}</div>
            <div class="servicio-duracion">
                ⏱️ ${servicio.duracion} min
            </div>
        </div>
        <div class="servicio-precio">${formatearPrecio(servicio.precio)}</div>
    `;
    
    // Agregar evento click
    card.addEventListener('click', () => toggleServicio(servicio, card));
    
    return card;
}

// ============================================
// ✨ TOGGLE SELECCIÓN DE SERVICIO
// ============================================
function toggleServicio(servicio, card) {
    const index = serviciosSeleccionados.findIndex(s => s.id === servicio.id);
    
    if (index > -1) {
        // Deseleccionar
        serviciosSeleccionados.splice(index, 1);
        card.classList.remove('seleccionado');
        console.log(`❌ Servicio deseleccionado: ${servicio.nombre}`);
    } else {
        // Seleccionar
        serviciosSeleccionados.push(servicio);
        card.classList.add('seleccionado');
        console.log(`✅ Servicio seleccionado: ${servicio.nombre}`);
    }
    
    // Actualizar resumen
    actualizarResumen();
    
    // Actualizar input oculto
    actualizarInputServicios();
}

// ============================================
// ✨ ACTUALIZAR RESUMEN DE SERVICIOS
// ============================================
function actualizarResumen() {
    const resumen = document.getElementById('resumenServicios');
    const lista = document.getElementById('listaServiciosSeleccionados');
    const subtotalEl = document.getElementById('subtotalPrecio');
    
    if (!resumen || !lista || !subtotalEl) return;
    
    if (serviciosSeleccionados.length === 0) {
        resumen.style.display = 'none';
        return;
    }
    
    // Mostrar resumen
    resumen.style.display = 'block';
    
    // Limpiar lista
    lista.innerHTML = '';
    
    // Calcular subtotal
    let subtotal = 0;
    
    // Agregar items
    serviciosSeleccionados.forEach(servicio => {
        subtotal += servicio.precio;
        
        const item = document.createElement('div');
        item.className = 'resumen-item';
        item.innerHTML = `
            <div class="resumen-item-info">
                <div class="resumen-item-nombre">${servicio.nombre}</div>
                <div class="resumen-item-duracion">${servicio.descripcion}</div>
            </div>
            <div class="resumen-item-precio">${formatearPrecio(servicio.precio)}</div>
        `;
        lista.appendChild(item);
    });
    
    // Actualizar subtotal
    subtotalEl.textContent = formatearPrecio(subtotal);
    
    console.log(`💰 Subtotal actualizado: ${formatearPrecio(subtotal)}`);
}

// ============================================
// ✨ ACTUALIZAR INPUT OCULTO DE SERVICIOS
// ============================================
function actualizarInputServicios() {
    const input = document.getElementById('servicios');
    if (!input) return;
    
    input.value = JSON.stringify(serviciosSeleccionados.map(s => ({
        id: s.id,
        nombre: s.nombre,
        precio: s.precio,
        descripcion: s.descripcion
    })));
}

// ============================================
// ✨ CALCULAR SUBTOTAL
// ============================================
function calcularSubtotal() {
    return serviciosSeleccionados.reduce((total, servicio) => total + servicio.precio, 0);
}

// ============================================
// ✨ FUNCIÓN MEJORADA: Configurar fecha mínima y deshabilitar domingos
// ============================================
function configurarFechaMinima() {
    const inputFecha = document.getElementById('fecha');
    if (!inputFecha) return;
    
    // ✨ Configurar fecha mínima como HOY
    const hoy = new Date();
    const fechaMinima = formatearFechaInput(hoy);
    inputFecha.min = fechaMinima;
    
    // Configurar fecha máxima (60 días adelante)
    const fechaMaxima = new Date();
    fechaMaxima.setDate(fechaMaxima.getDate() + 60);
    inputFecha.max = formatearFechaInput(fechaMaxima);
    
    console.log(`📅 Rango de fechas: ${fechaMinima} a ${inputFecha.max}`);
    
    // ✨ NUEVO: Validar la fecha cuando el usuario la selecciona
    inputFecha.addEventListener('input', validarFechaSeleccionada);
}

// ============================================
// ✨ NUEVA FUNCIÓN: Validar fecha seleccionada
// ============================================
function validarFechaSeleccionada(evento) {
    const inputFecha = evento.target;
    const fechaSeleccionada = inputFecha.value;
    
    if (!fechaSeleccionada) return;
    
    const fecha = new Date(fechaSeleccionada + 'T00:00:00');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Verificar si es fecha pasada
    if (fecha < hoy) {
        console.log('⚠️ Fecha pasada detectada');
        inputFecha.value = '';
        mostrarMensaje(
            'Fecha inválida',
            'No puedes seleccionar una fecha que ya pasó. Por favor elige una fecha desde hoy en adelante.',
            'error'
        );
        return;
    }
    
    // ✨ Verificar si es domingo (día 0)
    const diaSemana = fecha.getDay();
    if (diaSemana === 0) { // 0 = Domingo
        console.log('⚠️ Domingo detectado');
        inputFecha.value = '';
        mostrarMensaje(
            'Día no disponible',
            'Los domingos no hay atención. Por favor selecciona otro día.',
            'error'
        );
        return;
    }
    
    // Si llegamos aquí, la fecha es válida
    console.log(`✅ Fecha válida seleccionada: ${fechaSeleccionada}`);
}

// ============================================
// FUNCIÓN: Formatear fecha para input date
// ============================================
function formatearFechaInput(fecha) {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ============================================
// FUNCIÓN: Configurar event listeners
// ============================================
function setupEventListeners() {
    const inputFecha = document.getElementById('fecha');
    if (inputFecha) {
        inputFecha.addEventListener('change', cargarHorariosDisponibles);
    }
    
    const form = document.getElementById('formReserva');
    if (form) {
        form.addEventListener('submit', realizarReserva);
    }
    
    console.log('🎯 Event listeners configurados');
}

// ============================================
// ✨ FUNCIÓN MEJORADA: Cargar horarios con visualización
// ============================================
async function cargarHorariosDisponibles() {
    const inputFecha = document.getElementById('fecha');
    const horariosGrid = document.getElementById('horariosGrid');
    const loadingIndicator = document.getElementById('loadingHoras');
    const horaInput = document.getElementById('hora');
    
    const fecha = inputFecha.value;
    
    if (!fecha) {
        console.log('⚠️ No se seleccionó fecha');
        return;
    }
    
    console.log(`🔍 Buscando horarios para: ${fecha}`);
    
    // Resetear selección
    horaSeleccionada = null;
    horaInput.value = '';
    
    // Mostrar indicador de carga
    if (horariosGrid) {
        horariosGrid.innerHTML = '';
        horariosGrid.style.display = 'none';
    }
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
    }
    
    try {
        const response = await fetch(`${API_URL}/appointments/available?fecha=${fecha}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Horarios obtenidos:`, data);
        
        // Limpiar grid
        horariosGrid.innerHTML = '';
        
        if (data.mensaje) {
            // Día no disponible
            horariosGrid.innerHTML = `
                <div class="horarios-mensaje-vacio">
                    <div class="mensaje-vacio-icon">📅</div>
                    <h3 class="mensaje-vacio-titulo">Día no disponible</h3>
                    <p class="mensaje-vacio-texto">${data.mensaje}</p>
                </div>
            `;
            horariosGrid.style.display = 'block';
            return;
        }
        
        const disponibles = data.disponibles || [];
        const ocupadas = data.ocupadas || [];
        
        if (disponibles.length === 0 && ocupadas.length === 0) {
            horariosGrid.innerHTML = `
                <div class="horarios-mensaje-vacio">
                    <div class="mensaje-vacio-icon">⏰</div>
                    <h3 class="mensaje-vacio-titulo">Sin horarios</h3>
                    <p class="mensaje-vacio-texto">No hay horarios disponibles para esta fecha</p>
                </div>
            `;
            horariosGrid.style.display = 'block';
            return;
        }
        
        // Crear título de sección
        const tituloContainer = document.createElement('div');
        tituloContainer.className = 'horarios-titulo-container';
        tituloContainer.innerHTML = `
            <h3 class="horarios-titulo">Selecciona tu horario</h3>
            <div class="horarios-leyenda">
                <span class="leyenda-item">
                    <span class="leyenda-dot disponible"></span>
                    <span class="leyenda-texto">Disponible</span>
                </span>
                <span class="leyenda-item">
                    <span class="leyenda-dot ocupado"></span>
                    <span class="leyenda-texto">Ocupado</span>
                </span>
            </div>
        `;
        horariosGrid.appendChild(tituloContainer);
        
        // Crear grid de horarios
        const gridContainer = document.createElement('div');
        gridContainer.className = 'horarios-grid-container';
        
        // Combinar y ordenar todas las horas
        const todasLasHoras = [...new Set([...disponibles, ...ocupadas])].sort();
        
        todasLasHoras.forEach((hora, index) => {
            const esDisponible = disponibles.includes(hora);
            const card = crearCardHorario(hora, esDisponible, index);
            gridContainer.appendChild(card);
        });
        
        horariosGrid.appendChild(gridContainer);
        horariosGrid.style.display = 'block';
        
        console.log(`✅ Horarios mostrados: ${disponibles.length} disponibles, ${ocupadas.length} ocupadas`);
        
    } catch (error) {
        console.error('❌ Error cargando horarios:', error);
        horariosGrid.innerHTML = `
            <div class="horarios-mensaje-vacio error">
                <div class="mensaje-vacio-icon">⚠️</div>
                <h3 class="mensaje-vacio-titulo">Error al cargar</h3>
                <p class="mensaje-vacio-texto">No se pudieron cargar los horarios. Intenta nuevamente.</p>
            </div>
        `;
        horariosGrid.style.display = 'block';
        
        mostrarMensaje(
            'Error',
            'No se pudieron cargar los horarios disponibles. Intenta nuevamente.',
            'error'
        );
    } finally {
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
}

// ============================================
// ✨ FUNCIÓN: Crear card de horario
// ============================================
function crearCardHorario(hora, esDisponible, index) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `horario-card ${esDisponible ? 'disponible' : 'ocupado'}`;
    card.dataset.hora = hora;
    
    // Animación escalonada
    card.style.animationDelay = `${index * 0.03}s`;
    
    const horaFormateada = formatearHoraLegible(hora);
    
    card.innerHTML = `
        <div class="horario-card-icon">${esDisponible ? '✓' : '✕'}</div>
        <div class="horario-card-hora">${horaFormateada}</div>
        <div class="horario-card-estado">${esDisponible ? 'Disponible' : 'Ocupado'}</div>
    `;
    
    if (esDisponible) {
        card.addEventListener('click', () => seleccionarHorario(hora, card));
    } else {
        card.disabled = true;
    }
    
    return card;
}

// ============================================
// ✨ FUNCIÓN: Seleccionar horario
// ============================================
function seleccionarHorario(hora, cardElement) {
    console.log(`⏰ Horario seleccionado: ${hora}`);
    
    // Remover selección previa
    const todasLasCards = document.querySelectorAll('.horario-card');
    todasLasCards.forEach(c => c.classList.remove('seleccionado'));
    
    // Seleccionar nueva card
    cardElement.classList.add('seleccionado');
    horaSeleccionada = hora;
    
    // Actualizar input oculto
    const horaInput = document.getElementById('hora');
    horaInput.value = hora;
    
    // Scroll suave al botón de envío
    const btnSubmit = document.getElementById('btnSubmit');
    if (btnSubmit) {
        setTimeout(() => {
            btnSubmit.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

// ============================================
// FUNCIÓN: Formatear hora a formato legible (24 horas - Uruguay)
// ============================================
function formatearHoraLegible(hora) {
    // Retorna el formato 24 horas directamente (ej: "09:00", "13:00", "18:30")
    return hora;
}

// ============================================
// FUNCIÓN: Realizar reserva
// ============================================
async function realizarReserva(evento) {
    evento.preventDefault();
    
    console.log('📝 Procesando reserva...');
    
    const botonSubmit = document.getElementById('btnSubmit');
    const formulario = evento.target;
    
    const formData = new FormData(formulario);
    const datos = {
        nombre: formData.get('nombre').trim(),
        email: formData.get('email').trim(),
        telefono: formData.get('telefono')?.trim() || '',
        servicios: serviciosSeleccionados,
        fecha: formData.get('fecha'),
        hora: horaSeleccionada || formData.get('hora'),
        subtotal: calcularSubtotal()
    };
    
    console.log('📋 Datos de la reserva:', datos);
    
    // Validar servicios seleccionados
    if (serviciosSeleccionados.length === 0) {
        console.log('⚠️ No se seleccionaron servicios');
        mostrarMensaje(
            'Selecciona un servicio',
            'Por favor selecciona al menos un servicio para continuar con la reserva.',
            'error'
        );
        return;
    }
    
    // Validar datos básicos
    if (!datos.nombre || !datos.email || !datos.fecha || !datos.hora) {
        console.log('⚠️ Faltan datos requeridos');
        mostrarMensaje(
            'Datos incompletos',
            'Por favor completa todos los campos requeridos (*) y selecciona un horario.',
            'error'
        );
        return;
    }
    
    if (!validarEmail(datos.email)) {
        console.log('⚠️ Email inválido');
        mostrarMensaje(
            'Email inválido',
            'Por favor ingresa un email válido.',
            'error'
        );
        return;
    }
    
    botonSubmit.disabled = true;
    const textoOriginal = botonSubmit.innerHTML;
    botonSubmit.innerHTML = '<span class="spinner"></span> <span>Procesando...</span>';
    
    try {
        console.log('📡 Enviando reserva al servidor...');
        
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });
        
        const resultado = await response.json();
        
        if (!response.ok) {
            throw new Error(resultado.error || 'Error al crear la reserva');
        }
        
        console.log('✅ Reserva creada exitosamente:', resultado);
        
        // Crear lista de servicios para el mensaje
        const listaServicios = serviciosSeleccionados.map(s => s.nombre).join(', ');
        
        mostrarMensaje(
            '¡Reserva confirmada! 🎉',
            `Tu cita ha sido agendada para el ${formatearFechaLegible(datos.fecha)} a las ${formatearHoraLegible(datos.hora)}. Servicios: ${listaServicios}. Total: ${formatearPrecio(datos.subtotal)}. Te hemos enviado un email de confirmación a ${datos.email}.`,
            'success'
        );
        
        // Resetear formulario
        resetearFormulario(formulario);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('❌ Error al crear reserva:', error);
        
        mostrarMensaje(
            'Error al reservar',
            error.message || 'Hubo un problema al procesar tu reserva. Por favor intenta nuevamente.',
            'error'
        );
    } finally {
        botonSubmit.disabled = false;
        botonSubmit.innerHTML = textoOriginal;
    }
}

// ============================================
// ✨ FUNCIÓN: Resetear formulario completo
// ============================================
function resetearFormulario(form) {
    // Resetear campos
    form.reset();
    
    // Limpiar servicios seleccionados
    serviciosSeleccionados = [];
    document.querySelectorAll('.servicio-card.seleccionado').forEach(card => {
        card.classList.remove('seleccionado');
    });
    actualizarResumen();
    actualizarInputServicios();
    
    // Limpiar horario seleccionado
    horaSeleccionada = null;
    document.querySelectorAll('.horario-card.seleccionado').forEach(card => {
        card.classList.remove('seleccionado');
    });
    
    // Ocultar grid de horarios
    const horariosGrid = document.getElementById('horariosGrid');
    if (horariosGrid) {
        horariosGrid.innerHTML = '';
        horariosGrid.style.display = 'none';
    }
    
    console.log('✅ Formulario reseteado completamente');
}

// ============================================
// FUNCIÓN: Validar formato de email
// ============================================
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ============================================
// FUNCIÓN: Formatear fecha a texto legible
// ============================================
function formatearFechaLegible(fecha) {
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const fechaObj = new Date(fecha + 'T00:00:00');
    
    return fechaObj.toLocaleDateString('es-ES', opciones);
}

// ============================================
// FUNCIÓN: Mostrar mensaje al usuario
// ============================================
function mostrarMensaje(titulo, texto, tipo = 'success') {
    console.log(`💬 Mostrando mensaje (${tipo}): ${titulo}`);
    
    const mensajeContainer = document.getElementById('mensaje');
    const mensajeTitulo = document.getElementById('mensajeTitulo');
    const mensajeTexto = document.getElementById('mensajeTexto');
    const mensajeIcon = document.getElementById('mensajeIcon');
    
    if (!mensajeContainer) {
        console.error('❌ No se encontró el contenedor de mensajes');
        return;
    }
    
    if (mensajeTitulo) mensajeTitulo.textContent = titulo;
    if (mensajeTexto) mensajeTexto.textContent = texto;
    
    if (mensajeIcon) {
        mensajeIcon.textContent = tipo === 'success' ? '✓' : '⚠';
    }
    
    mensajeContainer.className = `mensaje-container ${tipo}`;
    mensajeContainer.style.display = 'block';
    
    setTimeout(() => {
        cerrarMensaje();
    }, 8000);
}

// ============================================
// FUNCIÓN: Cerrar mensaje
// ============================================
function cerrarMensaje() {
    const mensajeContainer = document.getElementById('mensaje');
    if (mensajeContainer) {
        mensajeContainer.style.animation = 'slideUp 0.3s ease-out';
        
        setTimeout(() => {
            mensajeContainer.style.display = 'none';
            mensajeContainer.style.animation = '';
        }, 300);
    }
}

// ============================================
// FUNCIÓN GLOBAL PARA CERRAR MENSAJE
// ============================================
window.cerrarMensaje = cerrarMensaje;

// Animación de salida
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

console.log('📱 Navegador:', navigator.userAgent);
console.log('🌐 URL API:', API_URL);
console.log('📅 Fecha actual:', new Date().toISOString());