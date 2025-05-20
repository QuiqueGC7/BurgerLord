// Array para almacenar todos los productos
let products = [];

// Función abreviada para seleccionar elementos del DOM
function $(selector) {
    return document.querySelector(selector);
}

// Muestra una notificación temporal al usuario
function showNotification(message) {
    const notification = $('#notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Carga los datos iniciales de productos
async function loadInitialData() {
    try {
        // Intenta cargar desde localStorage primero
        const storedProducts = localStorage.getItem('products');
        
        if (storedProducts) {
            products = JSON.parse(storedProducts);
            console.log('Data uploaded from localStorage');
            renderTable();
            populateSelects();
            return;
        }
        
        // Si no hay datos en localStorage, carga desde el archivo JSON
        const response = await fetch('./json/Products.json');
        if (!response.ok) {
            throw new Error(`Error downloading archivo JSON: ${response.status}`);
        }
        
        products = await response.json();
        console.log('Data uploaded from Products.json');
        
        // Guarda en localStorage para uso futuro
        localStorage.setItem('products', JSON.stringify(products));
        
        renderTable();
        populateSelects();
    } catch (error) {
        // Maneja errores en la carga de datos
        console.error('Error downloading the data:', error);
        showNotification('Error downloading the data.');
        
        // Iniciamos con un array vacío en caso de error
        products = [];
        
        // Actualiza la interfaz con el array vacío
        renderTable();
        populateSelects();
    }
}

// Guarda los cambios en localStorage y actualiza la interfaz
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    renderTable();
    populateSelects();
    showNotification('Changes saved');
}

// Actualiza la tabla con los datos actuales
function renderTable() {
    const tableBody = $('#burgerTableBody');
    tableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.nombre}</td>
            <td>${product.descripcion}</td>
            <td>€${product.precio.toFixed(2)}</td>
            <td>${product.categoria}</td>
        </tr>
    `).join('');
}

// Actualiza los selectores desplegables con la lista de productos
function populateSelects() {
    const selects = ['#editProductSelect', '#deleteProductSelect'];
    selects.forEach(selector => {
        const select = $(selector);
        select.innerHTML = '<option value="">Select Product</option>';
        products.forEach(product => {
            select.innerHTML += `<option value="${product.id}">${product.nombre}</option>`;
        });
    });
}

// Abre un modal y limpia sus campos si es necesario
function openModal(modalId) {
    $(`#${modalId}`).style.display = 'block';
    
    // Limpia campos según el modal
    if (modalId === 'editModal') {
        $('#editNombre').value = '';
        $('#editDescripcion').value = '';
        $('#editPrecio').value = '';
        $('#editImagen').value = '';
        $('#editCategoria').value = '';
        $('#editProductSelect').value = '';
    }
    else if (modalId === 'addModal') {
        $('#addNombre').value = '';
        $('#addDescripcion').value = '';
        $('#addPrecio').value = '';
        $('#addImagen').value = '';
        $('#addCategoria').value = '';
    }
}

// Cierra un modal
function closeModal(modalId) {
    $(`#${modalId}`).style.display = 'none';
}

// Al seleccionar un producto para editar, carga sus datos en el formulario
$('#editProductSelect').addEventListener('change', function() {
    const selectedId = parseInt(this.value);
    if (!selectedId) return;
    
    const selectedProduct = products.find(p => p.id === selectedId);
    if (selectedProduct) {
        $('#editNombre').value = selectedProduct.nombre;
        $('#editDescripcion').value = selectedProduct.descripcion;
        $('#editPrecio').value = selectedProduct.precio;
        $('#editImagen').value = selectedProduct.imagen;
        $('#editCategoria').value = selectedProduct.categoria;
    }
});

// Procesa el formulario para añadir producto
$('#addForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validación básica
    const nombre = $('#addNombre').value.trim();
    const descripcion = $('#addDescripcion').value.trim();
    const precio = parseFloat($('#addPrecio').value);
    
    if (!nombre || !descripcion || isNaN(precio) || precio <= 0) {
        showNotification('Please complete all the gaps.');
        return;
    }
    
    // Crea ID único para el nuevo producto
    const maxId = products.length > 0 
        ? Math.max(...products.map(product => product.id)) 
        : 0;
    
    // Crea el objeto del nuevo producto
    const newProduct = {
        id: maxId + 1,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        imagen: $('#addImagen').value.trim() || './Images/placeholder.png',
        categoria: $('#addCategoria').value
    };

    products.push(newProduct);
    saveProducts();
    
    $('#addForm').reset();
    closeModal('addModal');
});

// Procesa el formulario para editar producto
$('#editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedId = parseInt($('#editProductSelect').value);
    if (!selectedId) {
        showNotification('Please select a product to edit.');
        return;
    }
    
    const productIndex = products.findIndex(p => p.id === selectedId);
    if (productIndex === -1) {
        showNotification('Product not found');
        return;
    }
    
    // Actualiza solo los campos modificados
    const nombre = $('#editNombre').value.trim();
    const descripcion = $('#editDescripcion').value.trim();
    const precioStr = $('#editPrecio').value.trim();
    const imagen = $('#editImagen').value.trim();
    const categoria = $('#editCategoria').value;
    
    if (nombre) products[productIndex].nombre = nombre;
    if (descripcion) products[productIndex].descripcion = descripcion;
    if (precioStr && !isNaN(parseFloat(precioStr))) {
        products[productIndex].precio = parseFloat(precioStr);
    }
    if (imagen) products[productIndex].imagen = imagen;
    if (categoria) products[productIndex].categoria = categoria;

    saveProducts();
    closeModal('editModal');
});

// Procesa el formulario para eliminar producto
$('#deleteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedId = parseInt($('#deleteProductSelect').value);
    if (!selectedId) {
        showNotification('Select a product to delete.');
        return;
    }
    
    // Pide confirmación antes de eliminar
    const confirmDelete = confirm(`Sure you want to delete "${products.find(p => p.id === selectedId)?.nombre}"?`);
    if (!confirmDelete) return;
    
    const index = products.findIndex(p => p.id === selectedId);
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        closeModal('deleteModal');
    } else {
        showNotification('Product not found');
    }
});

// Exporta los datos de productos a un archivo JSON
function exportJSON() {
    const jsonStr = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Products.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('JSON exported');
}

// Cierra modales al hacer clic fuera de ellos
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Inicia la aplicación cuando el DOM está listo
document.addEventListener('DOMContentLoaded', loadInitialData);