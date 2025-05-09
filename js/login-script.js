// Script para manejar el inicio de sesión y el menú desplegable

// Función que se ejecuta cuando el formulario de login se envía
function handleLogin(event) {
    event.preventDefault();
    
    // Obtener email y contraseña
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validación básica
    if (email && password) {
        // Almacenar el estado de inicio de sesión y el nombre de usuario
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', email.split('@')[0]); // Usar parte del email como nombre
        localStorage.setItem('userEmail', email); // Guardar el email completo
        
        // Redirigir a la página de inicio
        window.location.href = 'Inicio.html';
    } else {
        alert('Por favor, completa todos los campos');
    }
}

// Función para comprobar si el usuario está logueado y actualizar la interfaz
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    const loginButton = document.querySelector('.login-button');
    
    // Si el usuario está logueado, mostrar el menú desplegable
    if (isLoggedIn === 'true' && loginButton) {
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
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    window.location.reload(); // Recargar la página para mostrar el botón de inicio de sesión
}

// Cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Si estamos en la página de login, añadir el evento al formulario
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Comprobar el estado de inicio de sesión para todas las páginas
    checkLoginStatus();
});