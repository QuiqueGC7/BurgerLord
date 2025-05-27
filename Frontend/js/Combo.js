// Inicializar el carrito desde localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let productsData = [];
let ComplementsData = [];

// Función para renderizar el menú
function renderizarMenu(data) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';

    // Filtrar solo los productos cuyo Product_Type_ID sea 1 y 2 (Hamburguesas y Complementos)
    const filteredData = data.filter(item => item.Product_Type_ID === 1, item => item.Product_Type_ID === 2);

    filteredData.forEach(item => {
        // Crear tarjeta de menú
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-item';
        if(Product_Type_ID === 1){
        menuCard.innerHTML = `
            <img src="${item.Product_Photo}" alt="${item.Product_Name}" id="${item.Product_ID}">
            <h3>${item.Product_Name}</h3>
            <p>${item.Product_Description}</p>
            <strong>$${item.Price.toFixed(2)}</strong>
            <ol></ol>
            <button class="btn-agregar" onclick="agregarAlCarrito(${item.Product_ID})">
                🛒 BUY
            </button>
        `;
        menuContainer.appendChild(menuCard);}
        if(Product_Type_ID === 2){
            menuCard.innerHTML = `
                <img src="${item.Complement_Photo}" alt="${item.Complement_Name}" id="${item.Complement_ID}">
                <h3>${item.Complement_Name}</h3>
                <p>${item.Complement_Description}</p>
                <strong>$${item.Price.toFixed(2)}</strong>
                <ol></ol>
                <button class="btn-agregar" onclick="agregarAlCarrito(${item.Complement_ID})">
                    🛒 BUY
                </button>
            `;
        menuContainer.appendChild(menuCard);}
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
// Función para agregar al carrito
function agregarAlCarrito(complement_ID) {
    // Obtener el carrito más reciente de localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const itemExistente = carrito.find(item => item.id === complement_ID);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        // Encontrar el producto en los datos cargados
        const complement = ComplementsData.find(c => c.Complement_ID === complement_ID);
        if (complement) {
            carrito.push({
                id: complement.Complement_ID,
                nombre: complement.Complement_Name,
                precio: complement.Price,
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

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function ObtenerCombo() {
    const ComboH = productsData.getRandomItem;
    const ComboC = ComplementsData.getRandomItem;
}



// Cargar Hamburguesas
fetch('./Controller?ACTION=PRODUCT.FIND_ALL')
    .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta de la API");
        return res.json();
    })
    .then(data => {
        // Guardar los datos para usarlos en otras funciones
        productsData = data.getRandomItem;
        if (productsData.length >= 1){
            stop;
        } else {
            // Renderizar el menú con los botones del carrito
            renderizarMenu(data);
            // Actualizar contador
            actualizarContadorCarrito();
        }
        
    })
    .catch(err => console.error("Error loading the menu from API:", err));

// Actualizar el contador cuando cambie el localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        actualizarContadorCarrito();
    }
});
// Cargar Complementos
fetch('./Controller?ACTION=COMPLEMENTS.FIND_ALL')
    .then(res => {
        if (!res.ok) throw new Error("Error en la respuesta de la API");
        return res.json();
    })
    .then(data => {
        // Guardar los datos para usarlos en otras funciones
        ComplementsData = data.getRandomItem;
        if (ComplementsData.length >= 1){
            stop;
        } else {
            // Renderizar el menú con los botones del carrito
            renderizarMenu(data);
            // Actualizar contador
            actualizarContadorCarrito();
        }
    })
    .catch(err => console.error("Error loading the menu from API:", err));

// Actualizar el contador cuando cambie el localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'carrito') {
        actualizarContadorCarrito();
    }
});