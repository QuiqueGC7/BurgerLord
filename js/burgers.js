// Cargar los datos del JSON de hamburguesas
fetch('./json/burgers.json')
  .then(res => {
    if (!res.ok) throw new Error("Error de red");
    return res.json();
  })
  .then(data => {
    const container = document.getElementById('menu-container');
    let currentCategory = '';
    data.forEach(item => {
      if (item.categoria !== currentCategory) {
        currentCategory = item.categoria;
        container.innerHTML += `<section class="categoria">Hamburguesas ${currentCategory}</section>`;
      }
      container.innerHTML += `
        <div class="menu-item">
          <img src="${item.imagen}" alt="${item.nombre}" id="${item.id}">
          <h3>${item.nombre}</h3>
          <p>${item.descripcion}</p>
          <strong>$${item.precio.toFixed(2)}</strong>
        </div>`;
    });
  })
  .catch(err => console.error("Error al cargar el menú:", err));
  
// Inicializar el carrito desde localStorage o crear uno vacío
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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
            categoriaHeader.textContent = `Hamburguesas ${currentCategory}`;
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
            <button class="btn-agregar" onclick="agregarAlCarrito(${item.id})">
                🛒 Añadir al carrito
            </button>
        `;
        
        menuContainer.appendChild(burgerCard);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(burgerId) {
    const itemExistente = carrito.find(item => item.id === burgerId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        // Encontrar la hamburguesa en los datos cargados
        const burger = window.burgersData.find(b => b.id === burgerId);
        if (burger) {
            carrito.push({
                id: burger.id,
                nombre: burger.nombre,
                precio: burger.precio,
                cantidad: 1
            });
        }
    }
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Mostrar confirmación
    alert('Hamburguesa añadida al carrito');
}

// Cargar los datos del JSON de hamburguesas
fetch('./json/burgers.json')
    .then(res => {
        if (!res.ok) throw new Error("Error de red");
        return res.json();
    })
    .then(data => {
        // Guardar los datos para usarlos en otras funciones
        window.burgersData = data;
        // Renderizar el menú con los botones del carrito
        renderizarMenu(data);
    })
    .catch(err => console.error("Error al cargar el menú:", err));