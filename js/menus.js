// Inicializar el carrito desde localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let menusData = [];

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
            categoriaHeader.textContent = `Menus ${currentCategory}`;
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
                🛒 BUY
            </button>
        `;
        
        menuContainer.appendChild(burgerCard);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(menuId) {
    // Obtener el carrito más reciente de localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const itemExistente = carrito.find(item => item.id === menuId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        // Encontrar la hamburguesa en los datos cargados
        const menus = menusData.find(b => b.id === menuId);
        if (menus) {
            carrito.push({
                id: menus.id,
                nombre: menus.nombre,
                precio: menus.precio,
                cantidad: 1
            });
        }
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar confirmación con opción de ir al carrito
    if (confirm('Menu send to the list. Want to see the list??')) {
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
fetch('./json/menus.json')
    .then(res => {
        if (!res.ok) throw new Error("Red error");
        return res.json();
    })
    .then(data => {
        // Guardar los datos para usarlos en otras funciones
        menusData = data;
        // Renderizar el menú con los botones del carrito
        renderizarMenu(data);
        // Actualizar contador
        actualizarContadorCarrito();
    })
    .catch(err => console.error("Error loading the menu:", err));

// Actualizar el contador cuando cambie el localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        actualizarContadorCarrito();
    }
}); 