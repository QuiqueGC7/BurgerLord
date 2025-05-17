// Array para almacenar todas las hamburguesas
let burgers = [];

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

// Carga los datos iniciales de hamburguesas
async function loadInitialData() {
    try {
        // Intenta cargar desde localStorage primero
        const storedBurgers = localStorage.getItem('burgers');
        
        if (storedBurgers) {
            burgers = JSON.parse(storedBurgers);
            console.log('Data uploaded from localStorage');
            renderTable();
            populateSelects();
            return;
        }
        
        // Si no hay datos en localStorage, carga desde el archivo JSON
        const response = await fetch('./json/burgers.json');
        if (!response.ok) {
            throw new Error(`Error downloading archivo JSON: ${response.status}`);
        }
        
        burgers = await response.json();
        console.log('Data uploaded from burgers.json');
        
        // Guarda en localStorage para uso futuro
        localStorage.setItem('burgers', JSON.stringify(burgers));
        
        renderTable();
        populateSelects();
    } catch (error) {
        // Maneja errores en la carga de datos
        console.error('Error dowloading the data:', error);
        showNotification('Error downloading the data.');
        
        // Iniciamos con un array vacío en caso de error
        burgers = [];
        
        // Actualiza la interfaz con el array vacío
        renderTable();
        populateSelects();
    }
}

// Guarda los cambios en localStorage y actualiza la interfaz
function saveBurgers() {
    localStorage.setItem('burgers', JSON.stringify(burgers));
    renderTable();
    populateSelects();
    showNotification('Changes saved');
}

// Actualiza la tabla con los datos actuales
function renderTable() {
    const tableBody = $('#burgerTableBody');
    tableBody.innerHTML = burgers.map(burger => `
        <tr>
            <td>${burger.id}</td>
            <td>${burger.nombre}</td>
            <td>${burger.descripcion}</td>
            <td>€${burger.precio.toFixed(2)}</td>
            <td>${burger.categoria}</td>
        </tr>
    `).join('');
}

// Actualiza los selectores desplegables con la lista de hamburguesas
function populateSelects() {
    const selects = ['#editProductSelect', '#deleteProductSelect'];
    selects.forEach(selector => {
        const select = $(selector);
        select.innerHTML = '<option value="">Select Product</option>';
        burgers.forEach(burger => {
            select.innerHTML += `<option value="${burger.id}">${burger.nombre}</option>`;
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

// Al seleccionar una hamburguesa para editar, carga sus datos en el formulario
$('#editProductSelect').addEventListener('change', function() {
    const selectedId = parseInt(this.value);
    if (!selectedId) return;
    
    const selectedBurger = burgers.find(b => b.id === selectedId);
    if (selectedBurger) {
        $('#editNombre').value = selectedBurger.nombre;
        $('#editDescripcion').value = selectedBurger.descripcion;
        $('#editPrecio').value = selectedBurger.precio;
        $('#editImagen').value = selectedBurger.imagen;
        $('#editCategoria').value = selectedBurger.categoria;
    }
});

// Procesa el formulario para añadir hamburguesa
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
    
    // Crea ID único para la nueva hamburguesa
    const maxId = burgers.length > 0 
        ? Math.max(...burgers.map(burger => burger.id)) 
        : 0;
    
    // Crea el objeto de la nueva hamburguesa
    const newBurger = {
        id: maxId + 1,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        imagen: $('#addImagen').value.trim() || './Images/placeholder.png',
        categoria: $('#addCategoria').value
    };

    burgers.push(newBurger);
    saveBurgers();
    
    $('#addForm').reset();
    closeModal('addModal');
});

// Procesa el formulario para editar hamburguesa
$('#editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedId = parseInt($('#editProductSelect').value);
    if (!selectedId) {
        showNotification('Please select a producto to edit.');
        return;
    }
    
    const burgerIndex = burgers.findIndex(b => b.id === selectedId);
    if (burgerIndex === -1) {
        showNotification('Prooduct not found');
        return;
    }
    
    // Actualiza solo los campos modificados
    const nombre = $('#editNombre').value.trim();
    const descripcion = $('#editDescripcion').value.trim();
    const precioStr = $('#editPrecio').value.trim();
    const imagen = $('#editImagen').value.trim();
    const categoria = $('#editCategoria').value;
    
    if (nombre) burgers[burgerIndex].nombre = nombre;
    if (descripcion) burgers[burgerIndex].descripcion = descripcion;
    if (precioStr && !isNaN(parseFloat(precioStr))) {
        burgers[burgerIndex].precio = parseFloat(precioStr);
    }
    if (imagen) burgers[burgerIndex].imagen = imagen;
    if (categoria) burgers[burgerIndex].categoria = categoria;

    saveBurgers();
    closeModal('editModal');
});

// Procesa el formulario para eliminar hamburguesa
$('#deleteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedId = parseInt($('#deleteProductSelect').value);
    if (!selectedId) {
        showNotification('Select a product to delete.');
        return;
    }
    
    // Pide confirmación antes de eliminar
    const confirmDelete = confirm(`Sure you want to delete "${burgers.find(b => b.id === selectedId)?.nombre}"?`);
    if (!confirmDelete) return;
    
    const index = burgers.findIndex(b => b.id === selectedId);
    if (index !== -1) {
        burgers.splice(index, 1);
        saveBurgers();
        closeModal('deleteModal');
    } else {
        showNotification('Product not found');
    }
});

// Exporta los datos de hamburguesas a un archivo JSON
function exportJSON() {
    const jsonStr = JSON.stringify(burgers, null, 2);
    const blob = new Blob([jsonStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'burgers.json';
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