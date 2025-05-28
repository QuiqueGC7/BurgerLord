// Array para almacenar todos los productos
let products = [];

// URL base del controlador
const API_BASE_URL = './Controller';

// Función abreviada para seleccionar elementos del DOM
function $(selector) {
   return document.querySelector(selector);
}

// Muestra una notificación temporal al usuario
function showNotification(message) {
   const notification = $('#notification');
   if (notification) {
       notification.textContent = message;
       notification.style.display = 'block';
       setTimeout(() => {
           notification.style.display = 'none';
       }, 3000);
   } else {
       console.log('Notification:', message);
   }
}

// Función genérica para hacer peticiones a la API
async function apiRequest(action, data = null) {
   try {
       let url = `${API_BASE_URL}?ACTION=PRODUCT.${action}`;

       const options = {
           method: 'POST',
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
           }
       };

       if (data) {
           const formData = new URLSearchParams();
           Object.keys(data).forEach(key => {
               formData.append(key, data[key]);
           });
           options.body = formData.toString();
       }

       const response = await fetch(url, options);

       if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
       }

       const responseText = await response.text();

       // Si la respuesta está vacía, devolver un objeto de éxito por defecto
       if (!responseText.trim()) {
           return { result: 1 };
       }

       // Intentar parsear como JSON
       try {
           return JSON.parse(responseText);
       } catch (e) {
           // Si no es JSON válido, devolver la respuesta como texto
           console.log('Response is not JSON:', responseText);
           return { result: 1, data: responseText };
       }
   } catch (error) {
       console.error('API request error:', error);
       throw error;
   }
}

// Carga los datos iniciales de productos desde la API
function loadInitialData() {
   showNotification('Loading products...');

   fetch(`${API_BASE_URL}?ACTION=PRODUCT.FIND_ALL`)
       .then(res => {
           if (!res.ok) throw new Error("Error en la respuesta de la API");
           return res.json();
       })
       .then(data => {
           // Guardar los datos mapeando los campos de la API al formato local
           if (Array.isArray(data)) {
               products = data.map(product => ({
                   id: product.Product_ID,
                   nombre: product.Product_Name,
                   descripcion: product.Product_Description,
                   precio: product.Price || 0,
                   imagen: product.Product_Photo || './Images/placeholder.png',
                   categoria: product.Product_Type_ID || 1
               }));
           } else {
               products = [];
           }

           console.log('Data loaded from API:', products);
           renderTable();
           populateSelects();
           showNotification('Products loaded successfully');
       })
       .catch(error => {
           console.error('Error loading data:', error);
           showNotification('Error loading data from server');

           // Iniciamos con un array vacío en caso de error
           products = [];
           renderTable();
           populateSelects();
       });
}

// Actualiza la tabla con los datos actuales
function renderTable() {
   const tableBody = $('#burgerTableBody');
   if (!tableBody) return;

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
       if (!select) return;

       select.innerHTML = '<option value="">Select Product</option>';
       products.forEach(product => {
           select.innerHTML += `<option value="${product.id}">${product.nombre}</option>`;
       });
   });
}

// Abre un modal y limpia sus campos si es necesario
function openModal(modalId) {
   const modal = $(`#${modalId}`);
   if (!modal) return;

   modal.style.display = 'block';

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
   const modal = $(`#${modalId}`);
   if (modal) {
       modal.style.display = 'none';
   }
}

// Configura los event listeners una vez que el DOM está cargado
function setupEventListeners() {
   // Al seleccionar un producto para editar, carga sus datos en el formulario
   const editSelect = $('#editProductSelect');
   if (editSelect) {
       editSelect.addEventListener('change', function() {
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
   }

   // Procesa el formulario para añadir producto
   const addForm = $('#addForm');
   if (addForm) {
       addForm.addEventListener('submit', async function(e) {
           e.preventDefault();

           // Validación básica
           const nombre = $('#addNombre').value.trim();
           const descripcion = $('#addDescripcion').value.trim();
           const precio = parseFloat($('#addPrecio').value);
           const imagen = $('#addImagen').value.trim() || './Images/placeholder.png';
           const categoria = parseInt($('#addCategoria').value) || 1;

           if (!nombre || !descripcion || isNaN(precio) || precio <= 0) {
               showNotification('Please complete all the required fields.');
               return;
           }

           try {
               showNotification('Adding product...');

               // Genera un ID único (en producción, esto debería manejarlo la base de datos)
               const maxId = products.length > 0
                   ? Math.max(...products.map(product => product.id))
                   : 0;

               const productData = {
                   id_products: maxId + 1,
                   name: nombre,
                   description: descripcion,
                   photo: imagen,
                   product_type_id: categoria,
                   price: precio
               };

               console.log('Sending product data:', productData);
               const result = await apiRequest('CREATE', productData);
               console.log('Create result:', result);

               if (result && (result.result === 1 || result.result === '1')) {
                   showNotification('Product added successfully');
                   addForm.reset();
                   closeModal('addModal');
                   loadInitialData(); // Recarga los datos
               } else {
                   showNotification('Error adding product: ' + (result.error || 'Unknown error'));
               }

           } catch (error) {
               console.error('Error adding product:', error);
               showNotification('Error adding product: ' + error.message);
           }
       });
   }

   // Procesa el formulario para editar producto
   const editForm = $('#editForm');
   if (editForm) {
       editForm.addEventListener('submit', async function(e) {
           e.preventDefault();

           const selectedId = parseInt($('#editProductSelect').value);
           if (!selectedId) {
               showNotification('Please select a product to edit.');
               return;
           }

           const nombre = $('#editNombre').value.trim();
           const descripcion = $('#editDescripcion').value.trim();
           const precioStr = $('#editPrecio').value.trim();
           const imagen = $('#editImagen').value.trim();
           const categoria = parseInt($('#editCategoria').value);

           if (!nombre || !descripcion || !precioStr || isNaN(parseFloat(precioStr))) {
               showNotification('Please complete all the required fields.');
               return;
           }

           try {
               showNotification('Updating product...');

               const productData = {
                   id_products: selectedId,
                   name: nombre,
                   description: descripcion,
                   photo: imagen || './Images/placeholder.png',
                   product_type_id: categoria || 1,
                   price: parseFloat(precioStr)
               };

               console.log('Updating product data:', productData);
               const result = await apiRequest('UPDATE', productData);
               console.log('Update result:', result);

               if (result && (result.result === 1 || result.result === '1')) {
                   showNotification('Product updated successfully');
                   closeModal('editModal');
                   loadInitialData(); // Recarga los datos
               } else {
                   showNotification('Error updating product: ' + (result.error || 'Unknown error'));
               }

           } catch (error) {
               console.error('Error updating product:', error);
               showNotification('Error updating product: ' + error.message);
           }
       });
   }

   // Procesa el formulario para eliminar producto
   const deleteForm = $('#deleteForm');
   if (deleteForm) {
       deleteForm.addEventListener('submit', async function(e) {
           e.preventDefault();

           const selectedId = parseInt($('#deleteProductSelect').value);
           if (!selectedId) {
               showNotification('Select a product to delete.');
               return;
           }

           const productToDelete = products.find(p => p.id === selectedId);
           if (!productToDelete) {
               showNotification('Product not found');
               return;
           }

           // Pide confirmación antes de eliminar
           const confirmDelete = confirm(`Are you sure you want to delete "${productToDelete.nombre}"?`);
           if (!confirmDelete) return;

           try {
               showNotification('Deleting product...');

               const result = await apiRequest('DELETE', { Product_ID: selectedId });
               console.log('Delete result:', result);

               if (result && (result.result === 1 || result.result === '1')) {
                   showNotification('Product deleted successfully');
                   closeModal('deleteModal');
                   loadInitialData(); // Recarga los datos
               } else {
                   showNotification('Error deleting product: ' + (result.error || 'Unknown error'));
               }

           } catch (error) {
               console.error('Error deleting product:', error);
               showNotification('Error deleting product: ' + error.message);
           }
       });
   }
}

// Exporta los datos de productos a un archivo JSON
function exportJSON() {
   // Convierte los productos al formato de la API para exportar
   const apiFormatProducts = products.map(product => ({
       Product_ID: product.id,
       Product_Name: product.nombre,
       Product_Description: product.descripcion,
       Price: product.precio,
       Product_Photo: product.imagen,
       Product_Type_ID: product.categoria
   }));

   const jsonStr = JSON.stringify(apiFormatProducts, null, 2);
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
document.addEventListener('DOMContentLoaded', function() {
   setupEventListeners();
   loadInitialData();
});