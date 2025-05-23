// Inicializar el carrito desde localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productsData = [];

// Función para renderizar el menú
function renderizarMenu(data) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';

    // Filtrar productos cuyo Product_Type_ID sea 2, 3, 4 o 5 (complementos)
    const filteredData = data.filter(item =>
        item.Product_Type_ID === 2 ||
        item.Product_Type_ID === 3 ||
        item.Product_Type_ID === 4 ||
        item.Product_Type_ID === 5
    );

    // Ordenar por Product_Type_ID para agrupar categorías
    filteredData.sort((a, b) => a.Product_Type_ID - b.Product_Type_ID);

    let currentCategory = '';

    // Mapeo de Product_Type_ID a nombres de categoría
    const categoryNames = {
        2: 'Fries',
        3: 'Drinks',
        4: 'Shakes',
        5: 'Ice Creams'
    };

    filteredData.forEach(item => {
        // Añadir encabezado de categoría si es diferente
        if (item.Product_Type_ID !== currentCategory) {
            currentCategory = item.Product_Type_ID;
            const categoriaHeader = document.createElement('section');
            categoriaHeader.className = 'categoria';
            categoriaHeader.textContent = `Complements ${categoryNames[currentCategory]}`;
            menuContainer.appendChild(categoriaHeader);
        }
        // Crear tarjeta de complemento
        const complementCard = document.createElement('div');
        complementCard.className = 'menu-item';

        complementCard.innerHTML = `
            <img src="${item.Product_Photo}" alt="${item.Product_Name}" id="${item.Product_ID}">
            <h3>${item.Product_Name}</h3>
            <p>${item.Product_Description}</p>
            <strong>$${item.Price.toFixed(2)}</strong>
            <ol></ol>
            <button class="btn-agregar" onclick="agregarAlCarrito(${item.Product_ID})">
                🛒 BUY
            </button>
        `;

        menuContainer.appendChild(complementCard);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(productId) {
    // Obtener el carrito más reciente de localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const itemExistente = carrito.find(item => item.id === productId);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        // Encontrar el producto en los datos cargados
        const product = productsData.find(p => p.Product_ID === productId);
        if (product) {
            carrito.push({
                id: product.Product_ID,
                nombre: product.Product_Name,
                precio: product.Price,
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

// Cargar los datos desde la API
fetch('./Controller?ACTION=PRODUCT.FIND_ALL')
    .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta de la API");
        return res.json();
    })
    .then(data => {
        // Guardar los datos para usarlos en otras funciones
        productsData = data;
        // Renderizar el menú con los botones del carrito
        renderizarMenu(data);
        // Actualizar contador
        actualizarContadorCarrito();
    })
    .catch(err => console.error("Error loading the menu from API:", err));

// Actualizar el contador cuando cambie el localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        actualizarContadorCarrito();
    }
});