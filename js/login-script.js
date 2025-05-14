// Script para manejar el inicio de sesión de empleados y usuarios

// Función que se ejecuta cuando el formulario de login se envía
async function handleLogin(event) {
    event.preventDefault();
    
    // Obtener email y contraseña
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Cargar empleados
        const response = await fetch('./json/Employees.json');
        const data = await response.json();
        
        // Buscar empleado con email y contraseña coincidentes
        const employee = data.Employees.find(emp => 
            emp.Employee_EMail.toLowerCase() === email.toLowerCase() && 
            emp.Employee_Password === password
        );
        
        if (employee) {
            // Es un empleado
            localStorage.setItem('isEmployee', 'true');
            localStorage.setItem('employeeName', employee.Employee_Name);
            localStorage.setItem('userEmail', employee.Employee_EMail);
            localStorage.setItem('userName', employee.Employee_Name);
        } else {
            // No es empleado, podrías aquí añadir lógica para usuarios normales
            // Por ahora, solo mostramos error
            if (email !== '' && password !== '') {
                localStorage.setItem('isEmployee', 'false');
                localStorage.setItem('userName', email.split('@')[0]);
                localStorage.setItem('userEmail', email);
            } else {
                alert('Correo o contraseña incorrectos');
                return;
            }
        }
        
        // Guardar estado de inicio de sesión
        localStorage.setItem('isLoggedIn', 'true');
        
        // Redirigir a la página de inicio
        window.location.href = 'Inicio.html';
    } catch (error) {
        console.error('Error de inicio de sesión:', error);
        alert('Error al iniciar sesión. Inténtalo de nuevo.');
    }
}

// Función para comprobar el estado de empleado y actualizar la interfaz
function checkEmployeeStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isEmployee = localStorage.getItem('isEmployee');
    const employeeName = localStorage.getItem('employeeName');
    const userName = localStorage.getItem('userName');
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
                <a href="MyProfile.html">Mi Perfil</a>
                <a href="#" onclick="logout()">Cerrar Sesión</a>
            </div>
        </div>
    `;
}
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isEmployee');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.reload();
}

// Cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página de login, añadir el evento al formulario
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Comprobar el estado de empleado para todas las páginas
    checkEmployeeStatus();
});