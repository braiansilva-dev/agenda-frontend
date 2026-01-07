/* ============================================
   ARCHIVO: config.js
   DESCRIPCIÓN: Configuración de conexión al backend
   ============================================ */

// ============================================
// CONFIGURACIÓN DE LA API
// ============================================

/* 
   🔧 DESARROLLO LOCAL (trabajando en tu computadora):
   Usa esta URL cuando estés probando en tu PC
*/
//const API_URL = 'http://localhost:3000/api';

/* 
   🌐 PRODUCCIÓN (cuando subes a Railway):
   Cuando subas el backend a Railway, descomenta la línea de abajo
   y reemplaza 'tu-app.railway.app' con la URL real que te dé Railway
*/
const API_URL = 'https://agenda-backend-production-72f3.up.railway.app/api';


// ============================================
// EJEMPLOS DE URLS SEGÚN DONDE ESTÉ ALOJADO
// ============================================

/*
   RAILWAY:
   const API_URL = 'https://agenda-backend-production.up.railway.app/api';
   
   RENDER:
   const API_URL = 'https://mi-agenda-backend.onrender.com/api';
   
   HEROKU:
   const API_URL = 'https://mi-agenda-backend.herokuapp.com/api';
   
   TU PROPIO DOMINIO:
   const API_URL = 'https://api.tunegocio.com/api';
*/


// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
   ⚠️ IMPORTANTE AL CAMBIAR ENTRE LOCAL Y PRODUCCIÓN:
   
   1. Para trabajar localmente:
      - Usa: http://localhost:3000/api
      - Asegúrate que el backend esté corriendo en tu PC
   
   2. Para subir a Hostinger/producción:
      - Cambia a la URL de Railway (con https://)
      - NO uses localhost en producción
   
   3. Para probar con móvil en tu red local:
      - Usa tu IP local, ejemplo: http://192.168.1.100:3000/api
      - Para encontrar tu IP:
        Windows: abre CMD y escribe "ipconfig"
        Mac/Linux: abre Terminal y escribe "ifconfig"
*/


/* ============================================
   📚 GUÍA DE PERSONALIZACIÓN COMPLETA
   ============================================

   🎨 CAMBIAR COLORES (EN styles.css)
   ====================================
   
   Abre styles.css y busca la sección ":root" al inicio.
   Ahí encontrarás todas las variables de color.
   
   EJEMPLO PARA BARBERÍA:
   ----------------------
   --color-principal: #1a1a1a;        (Negro)
   --color-principal-hover: #000000;  (Negro más oscuro)
   --color-principal-light: #333333;  (Gris oscuro)
   --gradiente-inicio: #1a1a1a;       (Negro)
   --gradiente-fin: #4a4a4a;          (Gris)
   
   EJEMPLO PARA PSICÓLOGO:
   -----------------------
   --color-principal: #10b981;        (Verde calmante)
   --color-principal-hover: #059669;  (Verde oscuro)
   --color-principal-light: #34d399;  (Verde claro)
   --gradiente-inicio: #6ee7b7;       (Verde agua claro)
   --gradiente-fin: #10b981;          (Verde)
   
   EJEMPLO PARA SPA:
   -----------------
   --color-principal: #ec4899;        (Rosa)
   --color-principal-hover: #db2777;  (Rosa oscuro)
   --color-principal-light: #f472b6;  (Rosa claro)
   --gradiente-inicio: #f9a8d4;       (Rosa pastel)
   --gradiente-fin: #ec4899;          (Rosa)
   
   EJEMPLO PARA GIMNASIO:
   ----------------------
   --color-principal: #f59e0b;        (Naranja energético)
   --color-principal-hover: #d97706;  (Naranja oscuro)
   --color-principal-light: #fbbf24;  (Naranja claro)
   --gradiente-inicio: #fbbf24;       (Amarillo)
   --gradiente-fin: #f59e0b;          (Naranja)
   
   
   🖼️ CAMBIAR LOGO (EN index.html Y AGREGAR ARCHIVO)
   =================================================
   
   1. Prepara el logo del cliente:
      - Formato: PNG con fondo transparente (ideal)
      - También funciona: JPG, SVG
      - Tamaño recomendado: 500x500 píxeles máximo
      - Peso: menos de 200KB
   
   2. Guarda el logo en la misma carpeta que index.html
      - Nombre sugerido: logo.png
      - O usa el nombre del cliente: logo-barberia-el-corte.png
   
   3. En index.html, busca esta línea (aproximadamente línea 28):
      <img src="logo.png" alt="Logo del Negocio" class="logo" id="logoNegocio">
      
      Cambia "logo.png" por el nombre de tu archivo:
      <img src="logo-barberia-el-corte.png" alt="Logo Barbería El Corte" class="logo">
   
   4. Si el cliente NO tiene logo:
      Agrega style="display:none" a la imagen:
      <img src="logo.png" alt="Logo" class="logo" style="display:none">
   
   
   📝 CAMBIAR TEXTOS (EN index.html)
   =================================
   
   1. TÍTULO DE LA PÁGINA (línea ~10):
      <title>Agenda de Citas - Tu Negocio</title>
      
      Cambiar a:
      <title>Reserva tu Cita - Barbería El Corte</title>
   
   2. DESCRIPCIÓN (línea ~42):
      <p class="negocio-descripcion">
          Reserva tu cita de forma rápida y sencilla
      </p>
      
      Cambiar según el negocio:
      - Barbería: "Los mejores cortes de Uruguay"
      - Psicólogo: "Agenda tu sesión de forma confidencial"
      - Spa: "Relájate y renueva tu energía"
   
   3. ETIQUETAS DE SERVICIOS (línea ~92):
      <label for="servicio" class="form-label">
          <span class="label-icon">✂️</span>
          Tipo de servicio (opcional)
      </label>
      
      Cambiar el emoji según el rubro:
      - Barbería: ✂️
      - Psicólogo: 🧠 o 💭
      - Spa: 💆 o 🌸
      - Gimnasio: 💪 o 🏋️
      - Dentista: 🦷
      - Veterinario: 🐾
   
   
   
   ⏰ CONFIGURAR HORARIOS Y DÍAS (EN BASE DE DATOS)
   ================================================
   
   Esto NO se cambia en los archivos HTML/CSS/JS, se cambia en la
   base de datos usando HeidiSQL o la consola de Railway.
   
   Ejecuta este SQL cambiando los valores según el cliente:
   
   UPDATE configuracion SET
       nombre_negocio = 'Barbería El Corte',
       email_negocio = 'contacto@elcorte.com',
       horario_inicio = '10:00:00',     -- Hora de apertura
       horario_fin = '20:00:00',        -- Hora de cierre
       duracion_cita = 45,              -- Duración de cada cita en minutos
       dias_trabajo = '1,2,3,4,5,6'     -- Días que trabaja (ver abajo)
   WHERE id = 1;
   
   DÍAS DE LA SEMANA:
   1 = Lunes
   2 = Martes
   3 = Miércoles
   4 = Jueves
   5 = Viernes
   6 = Sábado
   7 = Domingo
   
   EJEMPLOS:
   - Lunes a Viernes: '1,2,3,4,5'
   - Lunes a Sábado: '1,2,3,4,5,6'
   - Martes a Sábado: '2,3,4,5,6'
   - Solo Lunes, Miércoles y Viernes: '1,3,5'
   
   
   📧 CAMBIAR EMAIL DE CONTACTO EN FOOTER
   ======================================
   
   El email del footer se carga automáticamente desde la base de datos,
   pero si quieres cambiarlo manualmente:
   
   En index.html, busca la línea ~171:
   <a href="mailto:contacto@tunegocio.com" class="footer-link" id="footerEmail">
       contacto@tunegocio.com
   </a>
   
   Cambiar a:
   <a href="mailto:info@barberia.com" class="footer-link" id="footerEmail">
       info@barberia.com
   </a>
   

*/

// ============================================
// CONFIGURACIÓN DE SERVICIOS
// ============================================

// 🔧 CAMBIA ESTOS SERVICIOS SEGÚN TU NEGOCIO
// Opciones: 'barberia', 'psicologo', 'dentista', 'otro'

const TIPO_NEGOCIO = 'barberia'; // 👈 CAMBIA ESTO

// ============================================
// CATÁLOGO DE SERVICIOS POR TIPO DE NEGOCIO
// ============================================

const SERVICIOS_CATALOGO = {
    barberia: [
        {
            id: 1,
            nombre: 'Corte de cabello',
            precio: 350,
            duracion: 30,
            descripcion: 'Corte de cabello con máquina y tijera'
        },
        {
            id: 2,
            nombre: 'Barba',
            precio: 200,
            duracion: 20,
            descripcion: 'Recorte y perfilado de barba'
        },
        {
            id: 3,
            nombre: 'Corte + Barba',
            precio: 500,
            duracion: 45,
            descripcion: 'Combo completo de corte y barba'
        },
        {
            id: 4,
            nombre: 'Afeitado clásico',
            precio: 300,
            duracion: 25,
            descripcion: 'Afeitado tradicional con navaja'
        },
        {
            id: 5,
            nombre: 'Diseño de barba',
            precio: 250,
            duracion: 30,
            descripcion: 'Diseño personalizado de barba'
        }
    ],
    
    psicologo: [
        {
            id: 1,
            nombre: 'Consulta individual',
            precio: 1200,
            duracion: 60,
            descripcion: 'Sesión de terapia individual'
        },
        {
            id: 2,
            nombre: 'Terapia de pareja',
            precio: 1500,
            duracion: 90,
            descripcion: 'Sesión de terapia para parejas'
        },
        {
            id: 3,
            nombre: 'Terapia familiar',
            precio: 1800,
            duracion: 90,
            descripcion: 'Sesión de terapia familiar'
        },
        {
            id: 4,
            nombre: 'Consulta inicial',
            precio: 1000,
            duracion: 45,
            descripcion: 'Primera consulta de evaluación'
        },
        {
            id: 5,
            nombre: 'Seguimiento breve',
            precio: 800,
            duracion: 30,
            descripcion: 'Consulta de seguimiento'
        }
    ],
    
    dentista: [
        {
            id: 1,
            nombre: 'Consulta general',
            precio: 500,
            duracion: 30,
            descripcion: 'Revisión dental general'
        },
        {
            id: 2,
            nombre: 'Limpieza dental',
            precio: 800,
            duracion: 45,
            descripcion: 'Profilaxis dental profesional'
        },
        {
            id: 3,
            nombre: 'Empaste simple',
            precio: 1200,
            duracion: 60,
            descripcion: 'Restauración de una pieza dental'
        },
        {
            id: 4,
            nombre: 'Blanqueamiento',
            precio: 2500,
            duracion: 90,
            descripcion: 'Blanqueamiento dental profesional'
        },
        {
            id: 5,
            nombre: 'Extracción simple',
            precio: 1500,
            duracion: 45,
            descripcion: 'Extracción de pieza dental'
        },
        {
            id: 6,
            nombre: 'Ortodoncia consulta',
            precio: 600,
            duracion: 30,
            descripcion: 'Evaluación para ortodoncia'
        }
    ],
    
    otro: [
        {
            id: 1,
            nombre: 'Servicio básico',
            precio: 500,
            duracion: 30,
            descripcion: 'Servicio estándar'
        },
        {
            id: 2,
            nombre: 'Servicio premium',
            precio: 1000,
            duracion: 60,
            descripcion: 'Servicio premium completo'
        },
        {
            id: 3,
            nombre: 'Consulta',
            precio: 300,
            duracion: 20,
            descripcion: 'Consulta general'
        }
    ]
};

// ============================================
// CONFIGURACIÓN DE MONEDA
// ============================================

const CONFIG_MONEDA = {
    simbolo: '$',  // Símbolo de la moneda
    posicion: 'antes',  // 'antes' o 'despues' del monto
    decimales: 0,  // Cantidad de decimales a mostrar
    separadorMiles: '.',  // Separador de miles
    separadorDecimal: ','  // Separador de decimales
};

// ============================================
// FUNCIÓN PARA FORMATEAR PRECIO
// ============================================

function formatearPrecio(precio) {
    // Convertir a número y aplicar decimales
    const numero = Number(precio).toFixed(CONFIG_MONEDA.decimales);
    
    // Separar parte entera y decimal
    const [entero, decimal] = numero.split('.');
    
    // Agregar separador de miles
    const enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, CONFIG_MONEDA.separadorMiles);
    
    // Construir precio formateado
    let precioFormateado = enteroFormateado;
    if (CONFIG_MONEDA.decimales > 0 && decimal) {
        precioFormateado += CONFIG_MONEDA.separadorDecimal + decimal;
    }
    
    // Agregar símbolo de moneda
    if (CONFIG_MONEDA.posicion === 'antes') {
        return CONFIG_MONEDA.simbolo + precioFormateado;
    } else {
        return precioFormateado + CONFIG_MONEDA.simbolo;
    }
}

// ============================================
// OBTENER SERVICIOS SEGÚN TIPO DE NEGOCIO
// ============================================

function obtenerServicios() {
    return SERVICIOS_CATALOGO[TIPO_NEGOCIO] || SERVICIOS_CATALOGO.otro;
}

// ============================================
// EXPORTAR CONFIGURACIÓN
// ============================================

// Si usas módulos ES6, puedes descomentar esto:
// export { obtenerServicios, formatearPrecio, TIPO_NEGOCIO };