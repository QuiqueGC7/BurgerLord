// Estado inicial de los burgers
let burgers = [
    {
        id: 1,
        nombre: "Hamburguesa Clásica",
        descripcion: "Deliciosa hamburguesa con carne de ternera, lechuga, tomate y queso cheddar.",
        precio: 5.99,
        imagen: "./Images/Clásica.png",
        categoria: "Clasicas"
    }
];

// Funciones de utilidad
function $(selector) {
    return document.querySelector(selector);
}

function showNotification(message) {
    const notification = $('#notification');
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Guardar y cargar burgers
function saveBurgers() {
    localStorage.setItem('burgers', JSON.stringify(burgers));
    renderTable();
    populateSelects();
    showNotification('Cambios guardados');
}

function loadBurgers() {
    const storedBurgers = localStorage.getItem('burgers');
    if (storedBurgers) {
        burgers = JSON.parse(storedBurgers);
    }
    renderTable();
    populateSelects();
}

// Renderizar tabla
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

// Poblar selects
function populateSelects() {
    const selects = ['#editProductSelect', '#deleteProductSelect'];
    selects.forEach(selector => {
        const select = $(selector);
        select.innerHTML = '<option value="">Seleccionar Producto</option>';
        burgers.forEach(burger => {
            select.innerHTML += `<option value="${burger.id}">${burger.nombre}</option>`;
        });
    });
}

// Modal functions
function openModal(modalId) {
    $(`#${modalId}`).style.display = 'block';
}

function closeModal(modalId) {
    $(`#${modalId}`).style.display = 'none';
}

// Añadir producto
$('#addForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const maxId = burgers.reduce((max, burger) => Math.max(max, burger.id), 0);
    
    const newBurger = {
        id: maxId + 1,
        nombre: $('#addNombre').value,
        descripcion: $('#addDescripcion').value,
        precio: parseFloat($('#addPrecio').value),
        imagen: $('#addImagen').value || './Images/placeholder.png',
        categoria: $('#addCategoria').value
    };

    burgers.push(newBurger);
    saveBurgers();
    closeModal('addModal');
});

// Editar producto
$('#editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const selectedId = $('#editProductSelect').value;
    const burgerToEdit = burgers.find(b => b.id === parseInt(selectedId));

    if (burgerToEdit) {
        if ($('#editNombre').value) burgerToEdit.nombre = $('#editNombre').value;
        if ($('#editDescripcion').value) burgerToEdit.descripcion = $('#editDescripcion').value;
        if ($('#editPrecio').value) burgerToEdit.precio = parseFloat($('#editPrecio').value);
        if ($('#editImagen').value) burgerToEdit.imagen = $('#editImagen').value;
        if ($('#editCategoria').value) burgerToEdit.categoria = $('#editCategoria').value;

        saveBurgers();
        closeModal('editModal');
    }
});

// Eliminar producto
$('#deleteForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const selectedId = $('#deleteProductSelect').value;
    const index = burgers.findIndex(b => b.id === parseInt(selectedId));

    if (index !== -1) {
        burgers.splice(index, 1);
        saveBurgers();
        closeModal('deleteModal');
    }
});

// Exportar JSON
function exportJSON() {
    const jsonStr = JSON.stringify(burgers, null, 2);
    const blob = new Blob([jsonStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'burgers.json';
    a.click();
    URL.revokeObjectURL(url);
    showNotification('JSON exportado');
}

// Cerrar modals al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Cargar burgers al iniciar
document.addEventListener('DOMContentLoaded', loadBurgers);