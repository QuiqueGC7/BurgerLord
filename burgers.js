// Función para cargar las hamburguesas desde el archivo JSON
async function cargarHamburguesas() {
    try {
        // Realizar la petición al archivo JSON local
        const respuesta = await fetch('./burgers.json');
        
        // Si la respuesta no es satisfactoria, lanzar un error
        if (!respuesta.ok) {
            throw new Error('No se pudo cargar el archivo JSON');
        }
        
        // Convertir la respuesta a JSON
        const datos = await respuesta.json();
        
        // Llamar a la función para mostrar las hamburguesas
        mostrarHamburguesas(datos.hamburguesas);
    } catch (error) {
        console.error('Error al cargar las hamburguesas:', error);
        document.getElementById('menuContainer').innerHTML = '<p>Error al cargar el menú. Por favor, inténtelo de nuevo más tarde.</p>';
    }
}

// Función para mostrar las hamburguesas en el DOM
function mostrarHamburguesas(hamburguesas) {
    const menuContainer = document.getElementById('menuContainer');
    
    // Limpiar el contenedor
    menuContainer.innerHTML = '';
    
    // Mostrar las hamburguesas clásicas
    if (hamburguesas.clasicas && hamburguesas.clasicas.length > 0) {
        // Agregar título de categoría
        const categoriaClasicas = document.createElement('section');
        categoriaClasicas.className = 'categoria';
        categoriaClasicas.textContent = 'Hamburguesas Clasicas';
        menuContainer.appendChild(categoriaClasicas);
        
        // Agregar cada hamburguesa clásica
        hamburguesas.clasicas.forEach(hamburguesa => {
            agregarHamburguesa(hamburguesa, menuContainer);
        });
    }
    
    // Mostrar las hamburguesas especiales
    if (hamburguesas.especiales && hamburguesas.especiales.length > 0) {
        // Agregar título de categoría
        const categoriaEspeciales = document.createElement('section');
        categoriaEspeciales.className = 'categoria';
        categoriaEspeciales.textContent = 'Hamburguesas Especiales';
        menuContainer.appendChild(categoriaEspeciales);
        
        // Agregar cada hamburguesa especial
        hamburguesas.especiales.forEach(hamburguesa => {
            agregarHamburguesa(hamburguesa, menuContainer);
        });
    }
}

// Función para agregar una hamburguesa al contenedor
function agregarHamburguesa(hamburguesa, contenedor) {
    // Crear el elemento de menú
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    
    // Agregar la imagen
    const imagen = document.createElement('img');
    imagen.src = hamburguesa.imagen;
    imagen.alt = hamburguesa.nombre;
    imagen.id = hamburguesa.id;
    menuItem.appendChild(imagen);
    
    // Agregar el nombre
    const nombre = document.createElement('h3');
    nombre.textContent = hamburguesa.nombre;
    menuItem.appendChild(nombre);
    
    // Agregar la descripción
    const descripcion = document.createElement('p');
    descripcion.textContent = hamburguesa.descripcion;
    menuItem.appendChild(descripcion);
    
    // Agregar el precio
    const precio = document.createElement('strong');
    precio.textContent = `$${hamburguesa.precio.toFixed(2)}`;
    menuItem.appendChild(precio);
    
    // Agregar el elemento de menú al contenedor
    contenedor.appendChild(menuItem);
}

// Cargar las hamburguesas al cargar la página
document.addEventListener('DOMContentLoaded', cargarHamburguesas);