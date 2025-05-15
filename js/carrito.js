// Obtener los datos del carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para mostrar los items del carrito
function mostrarCarrito() {
    const container = document.getElementById('menu-container');
    
    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="carrito-vacio">
                <h2>Tu carrito está vacío</h2>
                <p>No hay productos en tu carrito</p>
                <a href="Carta.html" class="btn-volver">Volver a la carta</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    let html = '<h2>Tu Carrito</h2>';
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        
        html += `
            <div class="carrito-item">
                <div class="item-info">
                    <h3>${item.nombre}</h3>
                    <p>Precio unitario: $${item.precio.toFixed(2)}</p>
                </div>
                <div class="item-controles">
                    <button class="btn-decrementar" onclick="modificarCantidad(${item.id}, -1)">-</button>
                    <span class="cantidad">${item.cantidad}</span>
                    <button class="btn-incrementar" onclick="modificarCantidad(${item.id}, 1)">+</button>
                </div>
                <div class="item-precio">
                    <p>Subtotal: $${subtotal.toFixed(2)}</p>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="carrito-total">
            <h3>Total: $${total.toFixed(2)}</h3>
            <button class="btn-vaciar" onclick="vaciarCarrito()">Vaciar carrito</button>
            <button class="btn-comprar" onclick="finalizarCompra()">Finalizar compra</button>
        </div>
    `;
    
    container.innerHTML = html;
}

// Función para modificar la cantidad de un item
function modificarCantidad(itemId, cambio) {
    const item = carrito.find(i => i.id === itemId);
    
    if (item) {
        item.cantidad += cambio;
        
        // Si la cantidad llega a 0, eliminar el item
        if (item.cantidad <= 0) {
            eliminarDelCarrito(itemId);
        } else {
            // Actualizar localStorage y mostrar
            localStorage.setItem('carrito', JSON.stringify(carrito));
            mostrarCarrito();
        }
    }
}

// Función para eliminar un item del carrito
function eliminarDelCarrito(itemId) {
    carrito = carrito.filter(item => item.id !== itemId);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Función para vaciar todo el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que quieres vaciar todo el carrito?')) {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Aquí podrías implementar la lógica de pago
    alert('¡Gracias por tu compra! Tu pedido está siendo procesado.');
    
    // Vaciar el carrito después de la compra
    carrito = [];
    localStorage.setItem('carrito', JSON.stringify(carrito));
    mostrarCarrito();
}

// Cargar el carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // Obtener los datos más recientes del localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    mostrarCarrito();
});

// Actualizar el carrito si se detectan cambios en localStorage (útil si se abre en múltiples pestañas)
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        carrito = JSON.parse(e.newValue) || [];
        mostrarCarrito();
    }
});