// Script para manejar el inicio de sesión de empleados y usuarios usando API

// Función que se ejecuta cuando el formulario de login se envía
async function handleLogin(event) {
    event.preventDefault();

    // Obtener email y contraseña
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Cargar empleados desde la API
        const employeeResponse = await fetch('./Controller?ACTION=EMPLOYEE.FIND_ALL');
        const employeeData = await employeeResponse.json();

        // Cargar clientes desde la API
        const customerResponse = await fetch('./Controller?ACTION=CUSTOMER.FIND_ALL');
        const customerData = await customerResponse.json();

        // Buscar empleado con email y contraseña coincidentes
        const employee = employeeData.find(emp =>
            emp.Employee_EMail.toLowerCase() === email.toLowerCase() &&
            emp.Employee_Password === password
        );

        if (employee) {
            // Es un empleado
            sessionStorage.setItem('isEmployee', 'true');
            sessionStorage.setItem('employeeName', employee.Employee_Name);
            sessionStorage.setItem('userEmail', employee.Employee_EMail);
            sessionStorage.setItem('userName', employee.Employee_Name);
            sessionStorage.setItem('employeeId', employee.Employee_ID);
            sessionStorage.setItem('roleId', employee.Role_ID);
            sessionStorage.setItem('shopId', employee.Shop_ID);
            sessionStorage.setItem('isLoggedIn', 'true');

            // Redirigir a la página de inicio
            window.location.href = 'index.html';
        } else {
            // No es empleado, verificar si es un cliente
            const customer = customerData.find(cust =>
                cust.Customer_EMail.toLowerCase() === email.toLowerCase() &&
                cust.Customer_Password === password
            );

            if (customer) {
                // Es un cliente regular
                sessionStorage.setItem('isEmployee', 'false');
                sessionStorage.setItem('userName', customer.Customer_Name);
                sessionStorage.setItem('userEmail', customer.Customer_EMail);
                sessionStorage.setItem('customerId', customer.Customer_ID);
                sessionStorage.setItem('isLoggedIn', 'true');

                // Redirigir a la página de inicio
                window.location.href = 'index.html';
            } else {
                // No coincide con ningún usuario ni empleado
                alert('Email or password wrong.');
                return;
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login error. Try again.');
    }
}

// Función para buscar usuario específico por email (opcional, para optimizar)
async function findUserByEmail(email, userType) {
    try {
        let url;
        if (userType === 'employee') {
            url = `./Controller?ACTION=EMPLOYEE.FIND_ALL`;
        } else {
            url = `./Controller?ACTION=CUSTOMER.FIND_ALL`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (userType === 'employee') {
            return data.find(emp => emp.Employee_EMail.toLowerCase() === email.toLowerCase());
        } else {
            return data.find(cust => cust.Customer_EMail.toLowerCase() === email.toLowerCase());
        }
    } catch (error) {
        console.error(`Error finding ${userType}:`, error);
        return null;
    }
}

// Función optimizada de login (alternativa que busca primero por email)
async function handleLoginOptimized(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Primero buscar en empleados
        const employee = await findUserByEmail(email, 'employee');

        if (employee && employee.Employee_Password === password) {
            // Es un empleado válido
            sessionStorage.setItem('isEmployee', 'true');
            sessionStorage.setItem('employeeName', employee.Employee_Name);
            sessionStorage.setItem('userEmail', employee.Employee_EMail);
            sessionStorage.setItem('userName', employee.Employee_Name);
            sessionStorage.setItem('employeeId', employee.Employee_ID);
            sessionStorage.setItem('roleId', employee.Role_ID);
            sessionStorage.setItem('shopId', employee.Shop_ID);
            sessionStorage.setItem('isLoggedIn', 'true');

            window.location.href = 'index.html';
            return;
        }

        // Si no es empleado, buscar en clientes
        const customer = await findUserByEmail(email, 'customer');

        if (customer && customer.Customer_Password === password) {
            // Es un cliente válido
            sessionStorage.setItem('isEmployee', 'false');
            sessionStorage.setItem('userName', customer.Customer_Name);
            sessionStorage.setItem('userEmail', customer.Customer_EMail);
            sessionStorage.setItem('customerId', customer.Customer_ID);
            sessionStorage.setItem('isLoggedIn', 'true');

            window.location.href = 'index.html';
            return;
        }

        // No se encontró usuario válido
        alert('Email or password wrong.');

    } catch (error) {
        console.error('Login error:', error);
        alert('Login error. Try again.');
    }
}

// Función para comprobar el estado de empleado y actualizar la interfaz
function checkEmployeeStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const isEmployee = sessionStorage.getItem('isEmployee');
    const employeeName = sessionStorage.getItem('employeeName');
    const userName = sessionStorage.getItem('userName');
    const loginButton = document.querySelector('.login-button');

    // Si está logueado
    if (isLoggedIn === 'true' && loginButton) {
        if (isEmployee === 'true') {
            // Si es un empleado, mostrar botón de panel de empleados
            const header = document.querySelector('header');
            const titulo = document.querySelector('.titulo');
            const employeePanelButton = document.createElement('a');
            employeePanelButton.href = 'Panel_Empleados.html';
            employeePanelButton.className = 'home-button';
            employeePanelButton.innerHTML = '<span>👥</span> Panel';
            header.insertBefore(employeePanelButton, titulo);
        }

        loginButton.innerHTML = `
            <div class="user-menu">
                <button class="user-menu-button">${userName}</button>
                <div class="dropdown-content">
                    <a href="MyProfile.html">Mi Profile</a>
                    <a href="#" onclick="logout()">Logout</a>
                </div>
            </div>
        `;
    }
}

// Función para cerrar sesión
function logout() {
    // Limpiar sessionStorage
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('isEmployee');
    sessionStorage.removeItem('employeeName');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userEmail');
    sessionStorage.removeItem('employeeId');
    sessionStorage.removeItem('customerId');
    sessionStorage.removeItem('roleId');
    sessionStorage.removeItem('shopId');

    window.location.reload();
}

// Función de utilidad para obtener datos del usuario logueado
function getCurrentUser() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        return null;
    }

    const isEmployee = sessionStorage.getItem('isEmployee') === 'true';

    if (isEmployee) {
        return {
            type: 'employee',
            id: sessionStorage.getItem('employeeId'),
            name: sessionStorage.getItem('employeeName'),
            email: sessionStorage.getItem('userEmail'),
            roleId: sessionStorage.getItem('roleId'),
            shopId: sessionStorage.getItem('shopId')
        };
    } else {
        return {
            type: 'customer',
            id: sessionStorage.getItem('customerId'),
            name: sessionStorage.getItem('userName'),
            email: sessionStorage.getItem('userEmail')
        };
    }
}

// Función para verificar si el usuario está autenticado
function requireAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Función para verificar si el usuario es empleado
function requireEmployee() {
    if (!requireAuth()) return false;

    const isEmployee = sessionStorage.getItem('isEmployee');
    if (isEmployee !== 'true') {
        alert('Access denied. Employee privileges required.');
        return false;
    }
    return true;
}

// Cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página de login, añadir el evento al formulario
    const loginForm = document.querySelector('form');
    if (loginForm) {
        // Usar la versión optimizada del login
        loginForm.addEventListener('submit', handleLoginOptimized);
    }

    // Comprobar el estado de empleado para todas las páginas
    checkEmployeeStatus();
});