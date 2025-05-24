// Script mejorado para la página de perfil usando API

// Configuración de la API
const API_CONFIG = {
    BASE_URL: 'http://localhost:8080/Burgerlord', // Cambia esto por tu URL
    CONTROLLER_PATH: '/Controller'
};

// Función para construir URL de la API
function buildApiUrl(action) {
    return `${API_CONFIG.BASE_URL}${API_CONFIG.CONTROLLER_PATH}?ACTION=${action}`;
}

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn !== 'true') {
        // Si no está logueado, redirigir a la página de inicio de sesión
        window.location.href = 'Login.html';
        return;
    }

    // Cargar datos básicos del usuario desde sessionStorage
    const userName = sessionStorage.getItem('userName');
    const userEmail = sessionStorage.getItem('userEmail');

    // Mostrar datos básicos en la página
    document.getElementById('profile-name').textContent = userName || 'Usuario';
    document.getElementById('profile-email').textContent = userEmail || 'Email no disponible';

    // Determinar si es un cliente o un empleado
    const isEmployee = sessionStorage.getItem('isEmployee') === 'true';

    if (!isEmployee) {
        // Si es un cliente, cargar todos sus datos desde la API
        loadCustomerData(userEmail);
    } else {
        // Si es empleado, cargar datos desde la API
        loadEmployeeData();
    }

    // Manejar el envío del formulario para guardar cambios
    setupFormSubmitHandler();
});

// Función para cargar datos completos del cliente desde la API
async function loadCustomerData(userEmail) {
    try {
        // Cargar todos los clientes desde la API
        const response = await fetch(buildApiUrl('CUSTOMER.FIND_ALL'));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const customerData = await response.json();

        // Buscar el cliente por email
        const customer = customerData.find(cust =>
            cust.Customer_EMail.toLowerCase() === userEmail.toLowerCase()
        );

        if (customer) {
            // Llenar el formulario con los datos del cliente
            document.getElementById('user-name').value = customer.Customer_Name || '';
            document.getElementById('user-phone').value = customer.Customer_Phone || '';
            document.getElementById('user-address').value = customer.Customer_Address || '';

            // Guardar ID del cliente para futuras actualizaciones
            sessionStorage.setItem('customerId', customer.Customer_ID);

            // Guardar datos del cliente en sessionStorage para acceso rápido
            sessionStorage.setItem('userData', JSON.stringify({
                id: customer.Customer_ID,
                name: customer.Customer_Name,
                secondName: customer.Customer_SecondName,
                phone: customer.Customer_Phone,
                address: customer.Customer_Address,
                password: customer.Customer_Password
            }));
        } else {
            console.error('User not found in database.');
            showNotification('Error: Usuario no encontrado en la base de datos', 'error');
        }
    } catch (error) {
        console.error("Error loading customer data:", error);
        showNotification('Error al cargar los datos del usuario', 'error');
    }
}

// Función para cargar datos de empleado desde la API
async function loadEmployeeData() {
    try {
        const userEmail = sessionStorage.getItem('userEmail');

        // Cargar todos los empleados desde la API
        const response = await fetch(buildApiUrl('EMPLOYEE.FIND_ALL'));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const employeeData = await response.json();

        // Buscar el empleado por email
        const employee = employeeData.find(emp =>
            emp.Employee_EMail.toLowerCase() === userEmail.toLowerCase()
        );

        if (employee) {
            // Llenar el formulario con los datos del empleado
            document.getElementById('user-name').value = employee.Employee_Name || '';
            document.getElementById('user-phone').value = employee.Employee_Phone || '';

            // Los empleados pueden no tener dirección, usar un campo alternativo o dejarlo vacío
            const addressField = document.getElementById('user-address');
            if (addressField) {
                addressField.value = ''; // Los empleados no tienen dirección en tu modelo
                addressField.placeholder = 'No aplica para empleados';
                addressField.disabled = true;
            }

            // Guardar datos del empleado en sessionStorage
            sessionStorage.setItem('userData', JSON.stringify({
                id: employee.Employee_ID,
                name: employee.Employee_Name,
                secondName: employee.Employee_SecondName,
                phone: employee.Employee_Phone,
                roleId: employee.Role_ID,
                shopId: employee.Shop_ID,
                password: employee.Employee_Password
            }));
        } else {
            console.error('Employee not found in database.');
            showNotification('Error: Empleado no encontrado en la base de datos', 'error');
        }
    } catch (error) {
        console.error("Error loading employee data:", error);
        showNotification('Error al cargar los datos del empleado', 'error');
    }
}

// Configurar el manejador de envío del formulario
function setupFormSubmitHandler() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Determinar si es cliente o empleado
            const isEmployee = sessionStorage.getItem('isEmployee') === 'true';

            if (isEmployee) {
                updateEmployeeData();
            } else {
                updateCustomerData();
            }
        });
    }
}

// Función para actualizar datos del cliente via API
async function updateCustomerData() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        const customerId = sessionStorage.getItem('customerId');

        if (!customerId) {
            showNotification('Error: ID de cliente no encontrado', 'error');
            return;
        }

        // Recoger datos del formulario
        const formData = new FormData();
        formData.append('id_customers', customerId);
        formData.append('name', document.getElementById('user-name').value);
        formData.append('second_name', userData.secondName || '');
        formData.append('email', sessionStorage.getItem('userEmail'));
        formData.append('phone', document.getElementById('user-phone').value);
        formData.append('address', document.getElementById('user-address').value);
        formData.append('password', userData.password || '');

        // Crear URL con parámetros para GET/POST
        const updateUrl = buildApiUrl('CUSTOMER.UPDATE') +
            `&id_customers=${customerId}` +
            `&name=${encodeURIComponent(document.getElementById('user-name').value)}` +
            `&second_name=${encodeURIComponent(userData.secondName || '')}` +
            `&email=${encodeURIComponent(sessionStorage.getItem('userEmail'))}` +
            `&phone=${encodeURIComponent(document.getElementById('user-phone').value)}` +
            `&address=${encodeURIComponent(document.getElementById('user-address').value)}` +
            `&password=${encodeURIComponent(userData.password || '')}`;

        const response = await fetch(updateUrl, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.result && result.result > 0) {
            // Actualizar datos en sessionStorage
            const newUserData = {
                ...userData,
                name: document.getElementById('user-name').value,
                phone: document.getElementById('user-phone').value,
                address: document.getElementById('user-address').value
            };

            sessionStorage.setItem('userData', JSON.stringify(newUserData));

            // Actualizar nombre en sessionStorage si ha cambiado
            const newName = document.getElementById('user-name').value;
            if (newName && newName !== sessionStorage.getItem('userName')) {
                sessionStorage.setItem('userName', newName);
                document.getElementById('profile-name').textContent = newName;
            }

            showNotification('¡Datos guardados correctamente!', 'success');
        } else {
            showNotification('Error al guardar los datos', 'error');
        }

    } catch (error) {
        console.error('Error updating customer data:', error);
        showNotification('Error al actualizar los datos', 'error');
    }
}

// Función para actualizar datos del empleado via API
async function updateEmployeeData() {
    try {
        const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
        const employeeId = sessionStorage.getItem('employeeId');

        if (!employeeId) {
            showNotification('Error: ID de empleado no encontrado', 'error');
            return;
        }

        // Crear URL con parámetros para la actualización
        const updateUrl = buildApiUrl('EMPLOYEE.UPDATE') +
            `&id_employees=${employeeId}` +
            `&name=${encodeURIComponent(document.getElementById('user-name').value)}` +
            `&second_name=${encodeURIComponent(userData.secondName || '')}` +
            `&email=${encodeURIComponent(sessionStorage.getItem('userEmail'))}` +
            `&phone=${encodeURIComponent(document.getElementById('user-phone').value)}` +
            `&password=${encodeURIComponent(userData.password || '')}` +
            `&id_role=${userData.roleId || 1}` +
            `&id_shop=${userData.shopId || 1}`;

        const response = await fetch(updateUrl, {
            method: 'POST'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.result && result.result > 0) {
            // Actualizar datos en sessionStorage
            const newUserData = {
                ...userData,
                name: document.getElementById('user-name').value,
                phone: document.getElementById('user-phone').value
            };

            sessionStorage.setItem('userData', JSON.stringify(newUserData));

            // Actualizar nombre en sessionStorage si ha cambiado
            const newName = document.getElementById('user-name').value;
            if (newName && newName !== sessionStorage.getItem('userName')) {
                sessionStorage.setItem('userName', newName);
                sessionStorage.setItem('employeeName', newName);
                document.getElementById('profile-name').textContent = newName;
            }

            showNotification('¡Datos guardados correctamente!', 'success');
        } else {
            showNotification('Error al guardar los datos', 'error');
        }

    } catch (error) {
        console.error('Error updating employee data:', error);
        showNotification('Error al actualizar los datos', 'error');
    }
}

// Función mejorada para mostrar notificaciones con tipos
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Colores según el tipo
    let backgroundColor;
    switch (type) {
        case 'success':
            backgroundColor = '#4CAF50';
            break;
        case 'error':
            backgroundColor = '#f44336';
            break;
        case 'warning':
            backgroundColor = '#ff9800';
            break;
        default:
            backgroundColor = '#8b2801';
    }

    // Añadir notificación al DOM
    document.body.appendChild(notification);

    // Mostrar con efecto fade
    setTimeout(() => notification.style.opacity = '1', 10);

    // Eliminar después de 4 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}