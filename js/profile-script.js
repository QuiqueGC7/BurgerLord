// Script simplificado para la página de perfil

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn !== 'true') {
        // Si no está logueado, redirigir a la página de inicio de sesión
        window.location.href = 'Login.html';
        return;
    }
    
    // Cargar datos del usuario desde localStorage
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    
    // Mostrar datos en la página
    document.getElementById('profile-name').textContent = userName;
    document.getElementById('profile-email').textContent = userEmail || 'Email no disponible';
    
    // Cargar datos guardados del perfil (si existen)
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData.name) document.getElementById('user-name').value = userData.name;
    if (userData.phone) document.getElementById('user-phone').value = userData.phone;
    if (userData.address) document.getElementById('user-address').value = userData.address;
    
    // Manejar el envío del formulario para guardar cambios
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
            
            // Mostrar mensaje de confirmación
            alert('¡Datos guardados correctamente!');
        });
    }
});