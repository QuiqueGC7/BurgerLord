// Inicializar el carrito desde localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let complementosData = [];

// Función para renderizar el menú
function renderizarMenu(data) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    
    let currentCategory = '';
    
    data.forEach(item => {
        // Añadir encabezado de categoría si es diferente
        if (item.categoria !== currentCategory) {
            currentCategory = item.categoria;
            const categoriaHeader = document.createElement('section');
            categoriaHeader.className = 'categoria';
            categoriaHeader.textContent = `Complementos ${currentCategory}`;
            menuContainer.appendChild(categoriaHeader);
        }
        
        // Crear tarjeta de hamburguesa
        const burgerCard = document.createElement('div');
        burgerCard.className = 'menu-item';
        
        burgerCard.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" id="${item.id}">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <strong>$${item.precio.toFixed(2)}</strong>
            <ol></ol>
            <button class="btn-agregar" onclick="agregarAlCarrito(${item.id})">
                🛒 Añadir al carrito
            </button>
        `;
        
        menuContainer.appendChild(burgerCard);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(complementosId) {
    // Obtener el carrito más reciente de localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const itemExistente = carrito.find(item => item.id === complementosId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        // Encontrar la hamburguesa en los datos cargados
        const complemento = complementosData.find(b => b.id === complementosId);
        if (complemento) {
            carrito.push({
                id: complemento.id,
                nombre: complemento.nombre,
                precio: complemento.precio,
                cantidad: 1
            });
        }
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar confirmación con opción de ir al carrito
    if (confirm('Hamburguesa añadida al carrito. ¿Quieres ver tu carrito?')) {
        window.location.href = 'Carrito.html';
    }
}

// Función para mostrar el contador del carrito
function actualizarContadorCarrito() {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    
    // Si existe un elemento contador en la página, actualizarlo
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = totalItems;
    }
}

// Cargar los datos del JSON de hamburguesas
fetch('./json/complementos.json')
    .then(res => {
        if (!res.ok) throw new Error("Error de red");
        return res.json();
    })
    .then(data => {
        // Guardar los datos para usarlos en otras funciones
        complementosData = data;
        // Renderizar el menú con los botones del carrito
        renderizarMenu(data);
        // Actualizar contador
        actualizarContadorCarrito();
    })
    .catch(err => console.error("Error al cargar el menú:", err));

// Actualizar el contador cuando cambie el localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        actualizarContadorCarrito();
    }
}); 