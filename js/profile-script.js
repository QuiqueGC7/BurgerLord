// Script mejorado para la página de perfil

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        // Si no está logueado, redirigir a la página de inicio de sesión
        window.location.href = 'Login.html';
        return;
    }
    
    // Cargar datos básicos del usuario desde localStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    // Mostrar datos básicos en la página
    document.getElementById('profile-name').textContent = userName || 'Usuario';
    document.getElementById('profile-email').textContent = userEmail || 'Email no disponible';
    
    // Determinar si es un cliente o un empleado
    const isEmployee = localStorage.getItem('isEmployee') === 'true';
    
    if (!isEmployee) {
        // Si es un cliente, cargar todos sus datos desde el archivo JSON
        loadCustomerData(userEmail);
    } else {
        // Si es empleado, cargar solo los datos guardados en localStorage
        loadEmployeeData();
    }
    
    // Manejar el envío del formulario para guardar cambios
    setupFormSubmitHandler();
});

// Función para cargar datos completos del cliente desde Customers.json
async function loadCustomerData(userEmail) {
    try {
        // Cargar el archivo de clientes
        const response = await fetch('./json/Customers.json');
        const customerData = await response.json();
        
        // Buscar el cliente por email
        const customer = customerData.find(cust => 
            cust.Customer_Email.toLowerCase() === userEmail.toLowerCase()
        );
        
        if (customer) {
            // Llenar el formulario con los datos del cliente
            document.getElementById('user-name').value = customer.Customer_Name || '';
            document.getElementById('user-phone').value = customer.Customer_Phone || '';
            document.getElementById('user-address').value = customer.Customer_Address || '';
            
            // Guardar datos del cliente en localStorage para acceso rápido
            localStorage.setItem('userData', JSON.stringify({
                name: customer.Customer_Name,
                phone: customer.Customer_Phone,
                address: customer.Customer_Address
            }));
        } else {
            console.error('Cliente no encontrado en la base de datos');
            
            // Cargar datos guardados en localStorage como respaldo
            loadSavedUserData();
        }
    } catch (error) {
        console.error('Error al cargar datos del cliente:', error);
        
        // Si hay un error, intentar cargar desde localStorage
        loadSavedUserData();
    }
}

// Función para cargar datos de empleado desde localStorage
function loadEmployeeData() {
    // Para empleados, solo cargamos lo que tengan guardado en localStorage
    loadSavedUserData();
}

// Función para cargar datos guardados en localStorage
function loadSavedUserData() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData.name) document.getElementById('user-name').value = userData.name;
    if (userData.phone) document.getElementById('user-phone').value = userData.phone;
    if (userData.address) document.getElementById('user-address').value = userData.address;
}

// Configurar el manejador de envío del formulario
function setupFormSubmitHandler() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Recoger datos del formulario
            const userData = {
                name: document.getElementById('user-name').value,
                phone: document.getElementById('user-phone').value,
                address: document.getElementById('user-address').value
            };
            
            // Guardar datos en localStorage
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Actualizar nombre en localStorage si ha cambiado
            if (userData.name && userData.name !== localStorage.getItem('userName')) {
                localStorage.setItem('userName', userData.name);
                document.getElementById('profile-name').textContent = userData.name;
            }
            
            // Mostrar mensaje de confirmación
            showNotification('¡Datos guardados correctamente!');
        });
    }
}

// Función para mostrar una notificación temporal
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Añadir estilos al vuelo
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#8b2801';
    notification.style.color = 'white';
    notification.style.padding = '12px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // Añadir notificación al DOM
    document.body.appendChild(notification);
    
    // Mostrar con efecto fade
    setTimeout(() => notification.style.opacity = '1', 10);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}