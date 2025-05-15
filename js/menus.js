// Cargar los datos del JSON de menus
fetch('./json/menus.json')
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
        container.innerHTML += `<section class="categoria">menus ${currentCategory}</section>`;
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
            categoriaHeader.textContent = `Menus ${currentCategory}`;
            menuContainer.appendChild(categoriaHeader);
        }
        
        // Crear tarjeta del menu
        const menuCard = document.createElement('div');
        menuCard.className = 'menu-item';
        
        menuCard.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" id="${item.id}">
            <h3>${item.nombre}</h3>
            <p>${item.descripcion}</p>
            <strong>$${item.precio.toFixed(2)}</strong>
            <ol></ol>
            <button class="btn-agregar" onclick="agregarAlCarrito(${item.id})">
                🛒 Añadir al carrito
            </button>
        `;
        
        menuContainer.appendChild(menuCard);
    });
}

// Función para agregar al carrito
function agregarAlCarrito(menusId) {
    const itemExistente = carrito.find(item => item.id === menusId);
    
    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        // Encontrar el menu en los datos cargados
        const menus = window.menusData.find(b => b.id === menusId);
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
    
    // Mostrar confirmación
    alert('Menu añadido al carrito');
}

// Cargar los datos del JSON de hamburguesas
fetch('./json/menus.json')
    .then(res => {
        if (!res.ok) throw new Error("Error de red");
        return res.json();
    })
    .then(data => {
        // Guardar los datos para usarlos en otras funciones
        window.menusData = data;
        // Renderizar el menú con los botones del carrito
        renderizarMenu(data);
    })
    .catch(err => console.error("Error al cargar el menú:", err));